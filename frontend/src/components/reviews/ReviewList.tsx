'use client';

import { useState, useEffect, useCallback } from 'react';
import ReviewCard from './ReviewCard';
import RatingDistribution from './RatingDistribution';
import Pagination from '@/components/common/Pagination';
import { getReviews, toggleReviewLike, deleteReview, Review } from '@/lib/api/reviews';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/stores/toastStore';

interface ReviewListProps {
  placeId: string;
  onWriteReview?: () => void;
}

const ReviewList = ({ placeId, onWriteReview }: ReviewListProps) => {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const response = await getReviews(placeId, page, 10);
      setReviews(response.data);
      setMeta(response.meta);

      // 평균 평점 계산
      if (response.data.length > 0) {
        const avg =
          response.data.reduce((sum: number, r: Review) => sum + r.rating, 0) /
          response.data.length;
        setAverageRating(avg);

        // 평점 분포 계산 (현재 페이지 기준)
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        response.data.forEach((review: Review) => {
          if (review.rating >= 1 && review.rating <= 5) {
            distribution[review.rating as keyof typeof distribution]++;
          }
        });
        setRatingDistribution(distribution);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setIsLoading(false);
    }
  }, [placeId]);

  useEffect(() => {
    fetchReviews(1);
  }, [fetchReviews]);

  const handleLike = async (reviewId: string) => {
    try {
      await toggleReviewLike(reviewId);
      // 좋아요 상태는 ReviewCard에서 관리
    } catch (error) {
      console.error('Failed to toggle like:', error);
      toast.error('좋아요 처리에 실패했습니다');
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteReview(reviewId);
      toast.success('리뷰가 삭제되었습니다');
      fetchReviews(meta.page);
    } catch (error) {
      console.error('Failed to delete review:', error);
      toast.error('리뷰 삭제에 실패했습니다');
    }
  };

  const handlePageChange = (page: number) => {
    fetchReviews(page);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 bg-gray-50">
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center gap-6 mb-4 md:mb-0">
          <h2 className="text-3xl font-bold text-gray-900">
            리뷰 {meta.total}개
          </h2>
          {meta.total > 0 && (
            <div className="flex items-center gap-2">
              <svg
                className="w-6 h-6 text-yellow-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-2xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* 리뷰 쓰기 버튼 */}
        {user && onWriteReview && (
          <button
            onClick={onWriteReview}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
          >
            리뷰 쓰기
          </button>
        )}
      </div>

      {/* 평점 분포 차트 (리뷰가 있을 때만 표시) */}
      {meta.total > 0 && !isLoading && (
        <div className="mb-8">
          <RatingDistribution
            ratings={ratingDistribution}
            totalReviews={reviews.length}
            averageRating={averageRating}
          />
        </div>
      )}

      {/* 리뷰 목록 */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-32 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <>
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onLike={handleLike}
                onDelete={handleDelete}
                canDelete={user?.id === review.userId}
              />
            ))}
          </div>

          {/* 페이지네이션 */}
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
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
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            아직 리뷰가 없습니다
          </h3>
          <p className="mt-2 text-gray-600">
            첫 번째 리뷰를 작성해보세요!
          </p>
          {user && onWriteReview && (
            <button
              onClick={onWriteReview}
              className="mt-6 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              리뷰 쓰기
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default ReviewList;
