'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getPlaceDetailStats } from '@/lib/api/business';
import type { PlaceDetailStats } from '@/types/business';
import { toast } from '@/stores/toastStore';

export default function PlaceDetailStatsPage() {
  const params = useParams();
  const router = useRouter();
  const placeId = params.id as string;

  const [stats, setStats] = useState<PlaceDetailStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (placeId) {
      loadStats();
    }
  }, [placeId]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getPlaceDetailStats(placeId);
      setStats(data);
    } catch (error) {
      console.error('Failed to load place stats:', error);
      toast.error('업장 통계를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <p className="text-gray-600 mb-4">업장 통계를 불러올 수 없습니다</p>
        <button
          onClick={() => router.push('/business/places')}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  const totalReviews = stats.ratingDistribution.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{stats.placeName}</h1>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/business/promotions?placeId=${placeId}`}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              프로모션 관리
            </Link>
            <button
              onClick={() => router.push('/business/places')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              목록
            </button>
          </div>
        </div>
      </div>

      {/* 요약 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 평균 평점 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">평균 평점</h3>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-yellow-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {stats.avgRating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500 mb-1">/ 5.0</span>
          </div>
        </div>

        {/* 총 리뷰 수 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">총 리뷰 수</h3>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">{totalReviews}</span>
            <span className="text-sm text-gray-500 mb-1">개</span>
          </div>
        </div>

        {/* 총 북마크 수 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">총 북마크 수</h3>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">{stats.totalBookmarks}</span>
            <span className="text-sm text-gray-500 mb-1">개</span>
          </div>
        </div>
      </div>

      {/* 평점 분포 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">평점 분포</h2>

        <div className="space-y-4">
          {[5, 4, 3, 2, 1].map((rating) => {
            const item = stats.ratingDistribution.find(d => d.rating === rating);
            const count = item ? item.count : 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={rating} className="flex items-center gap-4">
                {/* 별점 표시 */}
                <div className="w-24 flex items-center gap-1">
                  {renderStars(rating)}
                </div>

                {/* 프로그레스 바 */}
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-yellow-400 h-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {/* 카운트 및 퍼센트 */}
                <div className="w-32 text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {count}개
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({percentage.toFixed(0)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {totalReviews === 0 && (
          <div className="text-center py-8 text-gray-500">
            아직 등록된 리뷰가 없습니다
          </div>
        )}
      </div>

      {/* 최근 리뷰 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">최근 리뷰</h2>
          <Link
            href={`/places/${placeId}#reviews`}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            전체 리뷰 보기 →
          </Link>
        </div>

        {stats.recentReviews && stats.recentReviews.length > 0 ? (
          <div className="space-y-4">
            {stats.recentReviews.slice(0, 5).map((review) => (
              <div
                key={review.id}
                className="pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {review.user?.name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {review.user?.name || '익명'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                  {review.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-3">💬</div>
            <p>아직 작성된 리뷰가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
