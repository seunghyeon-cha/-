'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getMyPlaces } from '@/lib/api/business';
import type { MyPlace } from '@/types/business';
import { toast } from '@/stores/toastStore';

export default function BusinessPlacesPage() {
  const [places, setPlaces] = useState<MyPlace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    try {
      setLoading(true);
      const data = await getMyPlaces();
      setPlaces(data);
    } catch (error) {
      console.error('Failed to load places:', error);
      toast.error('업장 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        <span className="text-yellow-400">★</span>
        <span className="font-semibold">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">내 업장 관리</h1>
            <p className="mt-1 text-sm text-gray-600">
              총 {places.length}개의 업장
            </p>
          </div>
          <div className="flex gap-3">
            <button
              disabled
              className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
              title="업장 등록 기능은 향후 추가될 예정입니다"
            >
              업장 등록
            </button>
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>참고:</strong> 업장 등록 기능은 향후 추가될 예정입니다. 현재는 등록된 업장의 통계 확인 및 프로모션 관리만 가능합니다.
          </p>
        </div>
      </div>

      {/* 업장 그리드 */}
      {places.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">🏪</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            등록된 업장이 없습니다
          </h3>
          <p className="text-gray-600 mb-6">
            사업자 인증 승인 후 업장을 등록하여 관리를 시작하세요
          </p>
          <button
            disabled
            className="inline-block px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
          >
            업장 등록 (향후 제공)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <div
              key={place.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
            >
              {/* 이미지 */}
              <Link
                href={`/business/places/${place.id}`}
                className="block relative h-48 bg-gray-200 overflow-hidden"
              >
                {place.images && place.images[0] ? (
                  <Image
                    src={place.images[0]}
                    alt={place.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-4xl">🏪</span>
                  </div>
                )}

                {/* 카테고리 뱃지는 MyPlace 타입에 없음 - 제거 */}
              </Link>

              {/* 정보 */}
              <div className="p-4">
                <Link
                  href={`/business/places/${place.id}`}
                  className="block mb-2"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                    {place.name}
                  </h3>
                </Link>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {place.address}
                </p>

                {/* 통계 */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-600 mb-1">평점</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {renderRating(place.avgRating)}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-600 mb-1">리뷰</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {place.reviewCount}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-600 mb-1">북마크</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {place.bookmarkCount}
                    </div>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/business/places/${place.id}`}
                    className="px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors text-center"
                  >
                    상세 통계
                  </Link>
                  <Link
                    href={`/business/promotions?placeId=${place.id}`}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-center"
                  >
                    프로모션
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
