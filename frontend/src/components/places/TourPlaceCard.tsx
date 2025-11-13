'use client';

import Image from 'next/image';
import { TourPlace } from '@/lib/api/tour';

interface TourPlaceCardProps {
  place: TourPlace;
  onClick?: (contentId: string) => void;
}

export default function TourPlaceCard({ place, onClick }: TourPlaceCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(place.contentid);
    }
  };

  // 카테고리 표시 이름
  const getCategoryName = (contenttypeid: string) => {
    const categories: Record<string, string> = {
      '12': '관광지',
      '14': '문화시설',
      '15': '축제/행사',
      '25': '여행코스',
      '28': '레포츠',
      '32': '숙박',
      '38': '쇼핑',
      '39': '음식점',
    };
    return categories[contenttypeid] || '기타';
  };

  // 카테고리별 색상
  const getCategoryColor = (contenttypeid: string) => {
    const colors: Record<string, string> = {
      '12': 'bg-blue-100 text-blue-800',
      '14': 'bg-purple-100 text-purple-800',
      '15': 'bg-pink-100 text-pink-800',
      '25': 'bg-green-100 text-green-800',
      '28': 'bg-yellow-100 text-yellow-800',
      '32': 'bg-indigo-100 text-indigo-800',
      '38': 'bg-red-100 text-red-800',
      '39': 'bg-orange-100 text-orange-800',
    };
    return colors[contenttypeid] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
    >
      {/* 이미지 */}
      <div className="relative aspect-video bg-gray-200">
        {place.firstimage ? (
          <Image
            src={place.firstimage}
            alt={place.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg
              className="w-16 h-16 text-gray-400"
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

        {/* 카테고리 배지 */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
              place.contenttypeid,
            )}`}
          >
            {getCategoryName(place.contenttypeid)}
          </span>
        </div>

        {/* Tour API 배지 */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 rounded-md text-xs font-medium bg-primary-500 text-white">
            공공데이터
          </span>
        </div>
      </div>

      {/* 내용 */}
      <div className="p-4">
        {/* 제목 */}
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {place.title}
        </h3>

        {/* 주소 */}
        {place.addr1 && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-1 flex items-start gap-1">
            <svg
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="flex-1">{place.addr1}</span>
          </p>
        )}

        {/* 전화번호 */}
        {place.tel && (
          <p className="mt-1 text-sm text-gray-600 flex items-center gap-1">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            {place.tel}
          </p>
        )}

        {/* 하단 정보 */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>ID: {place.contentid}</span>
          {place.modifiedtime && (
            <span>
              업데이트:{' '}
              {new Date(
                place.modifiedtime.replace(
                  /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
                  '$1-$2-$3T$4:$5:$6',
                ),
              ).toLocaleDateString('ko-KR')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
