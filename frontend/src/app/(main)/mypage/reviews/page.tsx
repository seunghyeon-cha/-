'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMyReviews } from '@/lib/api/user';
import { deleteReview } from '@/lib/api/reviews';
import { Review } from '@/lib/api/reviews';
import { toast } from 'react-hot-toast';
import Pagination from '@/components/common/Pagination';

type SortType = 'latest' | 'popular';

export default function MyReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortType>('latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadReviews();
  }, [page, sortBy]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await getMyReviews({
        page,
        limit: 10,
        sort: sortBy,
      });
      setReviews(response.reviews);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      toast.error('리뷰를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 리뷰를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteReview(id);
      toast.success('리뷰가 삭제되었습니다');
      loadReviews();
    } catch (error) {
      console.error('Failed to delete review:', error);
      toast.error('리뷰 삭제에 실패했습니다');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>

        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-3 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-24 mb-3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">내가 쓴 리뷰</h1>
            <p className="mt-1 text-sm text-gray-600">
              총 {reviews.length}개의 리뷰
            </p>
          </div>
          <Link
            href="/places"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            장소 둘러보기
          </Link>
        </div>

        {/* 정렬 */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortType)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="latest">최신순</option>
            <option value="popular">인기순 (좋아요)</option>
          </select>
        </div>
      </div>

      {/* 리뷰 목록 */}
      {reviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            작성한 리뷰가 없습니다
          </h3>
          <p className="text-gray-600 mb-6">
            방문한 장소에 대한 리뷰를 작성하고 다른 여행자들과 경험을 공유해보세요
          </p>
          <Link
            href="/places"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            장소 둘러보기
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* 장소명 (placeId로 링크) */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">장소 ID: {review.placeId}</div>
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>

                {/* 리뷰 내용 */}
                <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                  {review.content}
                </p>

                {/* 이미지 (있는 경우) */}
                {review.images && review.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {review.images.slice(0, 3).map((image, idx) => (
                      <img
                        key={idx}
                        src={image}
                        alt={`리뷰 이미지 ${idx + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                    ))}
                  </div>
                )}

                {/* 통계 및 액션 */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      👍 {review._count?.likes || 0}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {/* 수정 기능은 모달이나 별도 페이지 필요 */}
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
