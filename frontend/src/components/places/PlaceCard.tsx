'use client';

import { useState } from 'react';
import Image from 'next/image';
import Card from '@/components/common/Card';

type PlaceCategory = 'TOURIST' | 'RESTAURANT' | 'ACCOMMODATION';

interface PlaceCardProps {
  id: string;
  image?: string | null;
  category: PlaceCategory;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  isBookmarked?: boolean;
  onBookmark?: (id: string) => void;
  onClick?: (id: string) => void;
}

const PlaceCard = ({
  id,
  image,
  category,
  name,
  address,
  rating,
  reviewCount,
  isBookmarked = false,
  onBookmark,
  onClick,
}: PlaceCardProps) => {
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const categoryConfig = {
    TOURIST: {
      label: '관광지',
      color: 'bg-primary-500/80 text-white',
    },
    RESTAURANT: {
      label: '맛집',
      color: 'bg-orange-500/80 text-white',
    },
    ACCOMMODATION: {
      label: '숙소',
      color: 'bg-purple-500/80 text-white',
    },
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
    onBookmark?.(id);
  };

  const handleCardClick = () => {
    onClick?.(id);
  };

  return (
    <Card
      padding="none"
      hover
      onClick={handleCardClick}
      className="overflow-hidden"
    >
      {/* 썸네일 이미지 */}
      <div className="relative aspect-video bg-gray-200">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* 카테고리 뱃지 */}
        <div
          className={`absolute top-3 left-3 px-3 py-1.5 rounded-md text-xs font-semibold backdrop-blur-sm ${categoryConfig[category].color}`}
        >
          {categoryConfig[category].label}
        </div>

        {/* 북마크 아이콘 */}
        <button
          onClick={handleBookmarkClick}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200"
          aria-label={bookmarked ? '북마크 제거' : '북마크 추가'}
        >
          <svg
            className={`w-5 h-5 ${bookmarked ? 'text-primary-500 fill-current' : 'text-gray-600'}`}
            fill={bookmarked ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>
      </div>

      {/* 카드 본문 */}
      <div className="p-4 space-y-2">
        {/* 장소명 */}
        <h3 className="text-lg font-bold text-gray-900 truncate">{name}</h3>

        {/* 주소 */}
        <div className="flex items-center gap-1 text-sm text-gray-600 truncate">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="truncate">{address}</span>
        </div>

        {/* 평점 및 리뷰 수 */}
        <div className="flex items-center gap-1 text-sm text-gray-700">
          <svg
            className="w-4 h-4 text-yellow-400 fill-current"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="sr-only">평점</span>
          <span className="font-medium">{rating.toFixed(1)}</span>
          <span className="text-gray-500">
            <span className="sr-only">리뷰</span>({reviewCount}<span className="sr-only">개</span>)
          </span>
        </div>
      </div>
    </Card>
  );
};

export default PlaceCard;
