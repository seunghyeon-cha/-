'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { createItinerary } from '@/lib/api/itinerary';
import { toast } from '@/stores/toastStore';
import { useAuthStore } from '@/stores/authStore';

// Form validation schema
const itinerarySchema = z.object({
  title: z.string().min(2, '제목은 최소 2자 이상이어야 합니다').max(100),
  startDate: z.string().min(1, '시작 날짜를 선택해주세요'),
  endDate: z.string().min(1, '종료 날짜를 선택해주세요'),
  region: z.string().min(2, '지역을 입력해주세요'),
  isPublic: z.boolean().optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  },
  {
    message: '종료 날짜는 시작 날짜보다 이후여야 합니다',
    path: ['endDate'],
  }
);

type ItineraryFormData = z.infer<typeof itinerarySchema>;

export default function NewItineraryPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ItineraryFormData>({
    resolver: zodResolver(itinerarySchema),
    defaultValues: {
      isPublic: false,
    },
  });

  // 로그인 체크
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <svg
            className="mx-auto h-12 w-12 text-yellow-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            로그인이 필요합니다
          </h3>
          <p className="text-gray-600 mb-4">
            여행 일정을 만들려면 로그인이 필요합니다.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  // 일수 계산
  const calculateDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const onSubmit = async (data: ItineraryFormData) => {
    try {
      setIsSubmitting(true);
      const newItinerary = await createItinerary(data);
      toast.success('여행 일정이 성공적으로 생성되었습니다');
      router.push(`/itinerary/${newItinerary.id}`);
    } catch (error) {
      console.error('Failed to create itinerary:', error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || '일정 생성에 실패했습니다');
      } else {
        toast.error('일정 생성에 실패했습니다');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900">새 여행 일정</h1>
          <p className="mt-1 text-sm text-gray-600">
            여행 계획을 세워보세요
          </p>
        </div>
      </div>

      {/* 폼 */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 기본 정보 섹션 */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              기본 정보
            </h2>

            {/* 제목 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('title')}
                type="text"
                placeholder="예: 2025 제주도 가족 여행"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* 지역 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                지역 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('region')}
                type="text"
                placeholder="예: 제주도"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.region && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.region.message}
                </p>
              )}
            </div>
          </div>

          {/* 일정 정보 섹션 */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              일정 정보
            </h2>

            {/* 날짜 */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시작 날짜 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('startDate')}
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  종료 날짜 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('endDate')}
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* 일수 표시 */}
            {calculateDays() > 0 && (
              <div className="mb-4 p-4 bg-primary-50 rounded-lg">
                <div className="flex items-center gap-2 text-primary-700">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-semibold">
                    {calculateDays()}일 일정
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {new Date(startDate).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  {' - '}
                  {new Date(endDate).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>

          {/* 공개 설정 섹션 */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              공개 설정
            </h2>

            {/* 공개 여부 */}
            <div className="flex items-center gap-3">
              <input
                {...register('isPublic')}
                type="checkbox"
                id="isPublic"
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
              />
              <label htmlFor="isPublic" className="text-sm text-gray-700">
                이 일정을 다른 사람들에게 공개합니다
              </label>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              공개 설정 시 다른 사용자들이 귀하의 여행 일정을 볼 수 있습니다.
            </p>
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
                  일정 생성 후 세부 사항 추가
                </h4>
                <p className="text-xs text-blue-700">
                  일정을 생성한 후 각 날짜별로 방문할 장소를 추가하고
                  상세한 계획을 세울 수 있습니다.
                </p>
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
              {isSubmitting ? '생성 중...' : '일정 생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
