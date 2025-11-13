'use client';

import { useState } from 'react';
import { createReview } from '@/lib/api/reviews';
import { toast } from '@/stores/toastStore';

interface ReviewFormProps {
  placeId: string;
  placeName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ReviewForm = ({
  placeId,
  placeName,
  isOpen,
  onClose,
  onSuccess,
}: ReviewFormProps) => {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (content.length < 10) {
      toast.warning('리뷰는 10자 이상 작성해주세요');
      return;
    }

    try {
      setIsSubmitting(true);
      await createReview({
        placeId,
        rating,
        content,
      });
      toast.success('리뷰가 작성되었습니다');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Failed to create review:', error);
      // API 인터셉터에서 이미 토스트 표시함
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setRating(5);
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      ></div>

      {/* 모달 */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">리뷰 작성</h2>
              <p className="text-sm text-gray-600 mt-1">{placeName}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={isSubmitting}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 본문 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 별점 선택 */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              평점을 선택해주세요
            </label>
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, index) => {
                const starValue = index + 1;
                const isFilled =
                  hoveredRating > 0
                    ? starValue <= hoveredRating
                    : starValue <= rating;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <svg
                      className={`w-10 h-10 ${
                        isFilled ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {rating === 5 && '최고예요!'}
              {rating === 4 && '좋아요'}
              {rating === 3 && '괜찮아요'}
              {rating === 2 && '별로예요'}
              {rating === 1 && '최악이에요'}
            </p>
          </div>

          {/* 리뷰 내용 */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              리뷰 내용 <span className="text-error">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="이 장소에 대한 솔직한 리뷰를 남겨주세요 (최소 10자)"
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              required
              minLength={10}
            />
            <p className="text-sm text-gray-500 mt-2">
              {content.length} / 최소 10자
            </p>
          </div>

          {/* 제출 버튼 */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting || content.length < 10}
              className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '작성 중...' : '리뷰 작성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
