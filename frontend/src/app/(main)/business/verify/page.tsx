'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { getVerificationStatus, createVerification } from '@/lib/api/business';
import { toast } from '@/stores/toastStore';
import { useAuthStore } from '@/stores/authStore';
import type { BusinessVerification } from '@/types/business';

const verificationSchema = z.object({
  businessNumber: z
    .string()
    .min(10, '사업자 등록번호는 최소 10자 이상이어야 합니다')
    .max(12, '사업자 등록번호는 최대 12자입니다'),
  businessName: z.string().min(2, '상호명을 입력해주세요'),
  ownerName: z.string().min(2, '대표자명을 입력해주세요'),
  address: z.string().min(5, '사업장 주소를 입력해주세요'),
  documentUrl1: z.string().url('올바른 URL을 입력해주세요'),
  documentUrl2: z.string().url('올바른 URL을 입력해주세요').optional().or(z.literal('')),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

export default function BusinessVerifyPage() {
  const router = useRouter();
  useAuthStore(); // user 변수가 실제로 사용되지 않으므로 제거
  const [verification, setVerification] = useState<BusinessVerification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
  });

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      setIsLoading(true);
      const data = await getVerificationStatus();
      setVerification(data);
    } catch {
      // 인증 내역이 없으면 에러가 발생하므로 무시
      console.log('인증 내역 없음');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (formData: VerificationFormData) => {
    try {
      setIsSubmitting(true);

      // documents 배열 생성
      const documents = [formData.documentUrl1];
      if (formData.documentUrl2) {
        documents.push(formData.documentUrl2);
      }

      const data = {
        businessNumber: formData.businessNumber,
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        address: formData.address,
        documents,
      };

      await createVerification(data);
      toast.success('사업자 인증 신청이 완료되었습니다');
      await fetchVerificationStatus();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || '인증 신청에 실패했습니다');
      } else {
        toast.error('인증 신청에 실패했습니다');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-40 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // 인증 상태 표시
  if (verification) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              사업자 인증 상태
            </h1>

            <div className="space-y-4">
              {/* 상태 배지 */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">상태:</span>
                {verification.status === 'PENDING' && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
                    검토 중
                  </span>
                )}
                {verification.status === 'APPROVED' && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                    승인됨
                  </span>
                )}
                {verification.status === 'REJECTED' && (
                  <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-full">
                    거부됨
                  </span>
                )}
              </div>

              {/* 정보 표시 */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-sm text-gray-600">사업자 등록번호</p>
                  <p className="text-base font-medium">{verification.businessNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">상호명</p>
                  <p className="text-base font-medium">{verification.businessName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">대표자명</p>
                  <p className="text-base font-medium">{verification.ownerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">신청일</p>
                  <p className="text-base font-medium">
                    {new Date(verification.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>

              {/* 거부 사유 */}
              {verification.status === 'REJECTED' && verification.rejectedReason && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-900 mb-1">거부 사유</p>
                  <p className="text-sm text-red-700">{verification.rejectedReason}</p>
                </div>
              )}

              {/* 승인 후 액션 */}
              {verification.status === 'APPROVED' && (
                <div className="mt-8 flex gap-4">
                  <button
                    onClick={() => router.push('/business/places')}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    업장 관리
                  </button>
                  <button
                    onClick={() => router.push('/business/stats')}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    통계 보기
                  </button>
                </div>
              )}

              {/* 재신청 버튼 */}
              {verification.status === 'REJECTED' && (
                <button
                  onClick={() => setVerification(null)}
                  className="mt-6 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  재신청하기
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 인증 신청 폼
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">사업자 인증 신청</h1>
          <p className="text-sm text-gray-600 mb-8">
            사업자 인증을 완료하면 업장 등록 및 관리 기능을 사용할 수 있습니다.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 사업자 등록번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사업자 등록번호 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('businessNumber')}
                type="text"
                placeholder="123-45-67890"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.businessNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.businessNumber.message}</p>
              )}
            </div>

            {/* 상호명 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상호명 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('businessName')}
                type="text"
                placeholder="예: 맛있는 식당"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.businessName && (
                <p className="mt-1 text-sm text-red-500">{errors.businessName.message}</p>
              )}
            </div>

            {/* 대표자명 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대표자명 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('ownerName')}
                type="text"
                placeholder="예: 홍길동"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.ownerName && (
                <p className="mt-1 text-sm text-red-500">{errors.ownerName.message}</p>
              )}
            </div>

            {/* 사업장 주소 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사업장 주소 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('address')}
                type="text"
                placeholder="예: 서울시 강남구..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            {/* 서류 URL 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사업자등록증 이미지 URL <span className="text-red-500">*</span>
              </label>
              <input
                {...register('documentUrl1')}
                type="url"
                placeholder="https://example.com/license.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.documentUrl1 && (
                <p className="mt-1 text-sm text-red-500">{errors.documentUrl1.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                이미지 업로드 기능은 추후 제공될 예정입니다. 임시로 URL을 입력해주세요.
              </p>
            </div>

            {/* 서류 URL 2 (선택) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                신분증 이미지 URL (선택사항)
              </label>
              <input
                {...register('documentUrl2')}
                type="url"
                placeholder="https://example.com/id.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.documentUrl2 && (
                <p className="mt-1 text-sm text-red-500">{errors.documentUrl2.message}</p>
              )}
            </div>

            {/* 안내 메시지 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <svg
                  className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">
                    인증 절차 안내
                  </h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• 신청 후 관리자 검토를 거쳐 1-3일 내에 승인됩니다.</li>
                    <li>• 승인 완료 시 이메일로 알림이 발송됩니다.</li>
                    <li>• 승인 후 업장 등록 및 프로모션 기능을 사용할 수 있습니다.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '신청 중...' : '인증 신청'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
