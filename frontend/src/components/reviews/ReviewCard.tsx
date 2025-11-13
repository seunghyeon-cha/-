'use client';

import { useState } from 'react';
import { Review } from '@/lib/api/reviews';

interface ReviewCardProps {
  review: Review;
  onLike?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
  canDelete?: boolean;
}

const ReviewCard = ({
  review,
  onLike,
  onDelete,
  canDelete = false,
}: ReviewCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(review._count?.likes || 0);

  const handleLike = () => {
    if (onLike) {
      onLike(review.id);
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      {/* 프로필 & 평점 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* 프로필 이미지 */}
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {review.user.profileImage ? (
              <img
                src={review.user.profileImage}
                alt={review.user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-600 font-semibold">
                {review.user.name[0]}
              </span>
            )}
          </div>

          {/* 이름 & 날짜 */}
          <div>
            <div className="font-semibold text-gray-900">
              {review.user.name}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString('ko-KR')}
            </div>
          </div>
        </div>

        {/* 별점 */}
        <div className="flex items-center gap-1">
          {renderStars(review.rating)}
        </div>
      </div>

      {/* 리뷰 내용 */}
      <p className="text-gray-700 leading-relaxed mb-4">{review.content}</p>

      {/* 이미지 */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`리뷰 이미지 ${index + 1}`}
              className="w-24 h-24 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
            />
          ))}
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        {/* 좋아요 */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 text-sm transition-colors ${
            liked ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill={liked ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          <span>{likeCount}</span>
        </button>

        {/* 삭제 (본인 리뷰일 경우만) */}
        {canDelete && onDelete && (
          <button
            onClick={() => onDelete(review.id)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-error transition-colors"
          >
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span>삭제</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
