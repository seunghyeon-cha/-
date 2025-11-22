'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createPlace, PlaceCategory } from '@/lib/api/places';
import { toast } from '@/stores/toastStore';
import { useAuthStore } from '@/stores/authStore';

// Form validation schema
const placeSchema = z.object({
  name: z.string().min(2, '장소명은 최소 2자 이상이어야 합니다').max(100),
  category: z.enum(['TOURIST', 'RESTAURANT', 'ACCOMMODATION'], {
    required_error: '카테고리를 선택해주세요',
  }),
  description: z.string().min(10, '설명은 최소 10자 이상이어야 합니다'),
  address: z.string().min(5, '주소를 입력해주세요'),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  contact: z.string().optional(),
  website: z.string().url('올바른 URL을 입력해주세요').optional().or(z.literal('')),
  operatingHours: z.string().optional(),
  images: z.array(z.string()).optional(),
});

type PlaceFormData = z.infer<typeof placeSchema>;

const CATEGORY_LABELS: Record<PlaceCategory, string> = {
  TOURIST: '관광지',
  RESTAURANT: '음식점',
  ACCOMMODATION: '숙박',
};

export default function NewPlacePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlaceFormData>({
    resolver: zodResolver(placeSchema),
    defaultValues: {
      lat: 37.5665,
      lng: 126.978,
      images: [],
    },
  });

  // Check if user is business owner
  if (user && user.role !== 'BUSINESS') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            권한이 없습니다
          </h3>
          <p className="text-gray-600 mb-4">
            사업자 회원만 장소를 등록할 수 있습니다.
          </p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: PlaceFormData) => {
    try {
      setIsSubmitting(true);
      await createPlace(data);
      toast.success('장소가 성공적으로 등록되었습니다');
      router.push('/places');
    } catch (error) {
      console.error('Failed to create place:', error);
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : '장소 등록에 실패했습니다';
      toast.error(errorMessage || '장소 등록에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900">새 장소 등록</h1>
          <p className="mt-1 text-sm text-gray-600">
            귀하의 사업장 정보를 등록해주세요
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

            {/* 장소명 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                장소명 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name')}
                type="text"
                placeholder="예: 서울타워"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* 카테고리 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 <span className="text-red-500">*</span>
              </label>
              <select
                {...register('category')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">선택해주세요</option>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* 설명 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설명 <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('description')}
                rows={4}
                placeholder="장소에 대한 상세한 설명을 입력해주세요"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* 위치 정보 섹션 */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              위치 정보
            </h2>

            {/* 주소 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                주소 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('address')}
                type="text"
                placeholder="예: 서울특별시 중구 남산공원길 105"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* 좌표 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  위도 (Latitude) <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('lat', { valueAsNumber: true })}
                  type="number"
                  step="0.000001"
                  placeholder="37.5665"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.lat && (
                  <p className="mt-1 text-sm text-red-500">{errors.lat.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  경도 (Longitude) <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('lng', { valueAsNumber: true })}
                  type="number"
                  step="0.000001"
                  placeholder="126.9780"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.lng && (
                  <p className="mt-1 text-sm text-red-500">{errors.lng.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* 추가 정보 섹션 */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              추가 정보
            </h2>

            {/* 연락처 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연락처
              </label>
              <input
                {...register('contact')}
                type="text"
                placeholder="예: 02-1234-5678"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* 웹사이트 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                웹사이트
              </label>
              <input
                {...register('website')}
                type="url"
                placeholder="예: https://example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.website && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.website.message}
                </p>
              )}
            </div>

            {/* 운영 시간 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                운영 시간
              </label>
              <input
                {...register('operatingHours')}
                type="text"
                placeholder="예: 평일 09:00-18:00, 주말 10:00-17:00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
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
              {isSubmitting ? '등록 중...' : '장소 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
