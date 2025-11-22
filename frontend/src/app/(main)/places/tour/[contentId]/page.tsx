'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import KakaoMap from '@/components/map/KakaoMap';
import {
  getTourPlaceDetail,
  getTourPlaceImages,
  extractTourItems,
  TourPlace,
  TourImage,
} from '@/lib/api/tour';

export default function TourPlaceDetailPage({
  params,
}: {
  params: { contentId: string };
}) {
  const router = useRouter();
  const [place, setPlace] = useState<TourPlace | null>(null);
  const [images, setImages] = useState<TourImage[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      // 상세 정보 조회
      const detailResponse = await getTourPlaceDetail(params.contentId);
      const placeData = extractTourItems(detailResponse);

      if (placeData.length > 0) {
        setPlace(placeData[0]);
      }

      // 이미지 목록 조회
      const imagesResponse = await getTourPlaceImages(params.contentId);
      const imageData = extractTourItems(imagesResponse);
      setImages(imageData);
    } catch (error) {
      console.error('Failed to fetch tour place detail:', error);
    } finally {
      setIsLoading(false);
    }
  }, [params.contentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 카테고리 이름 가져오기
  const getCategoryName = (contenttypeid?: string) => {
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
    return contenttypeid ? categories[contenttypeid] || '기타' : '관광지';
  };

  // 카테고리 색상 가져오기
  const getCategoryColor = (contenttypeid?: string) => {
    const colors: Record<string, string> = {
      '12': 'bg-blue-500',
      '14': 'bg-purple-500',
      '15': 'bg-pink-500',
      '25': 'bg-green-500',
      '28': 'bg-yellow-500',
      '32': 'bg-indigo-500',
      '38': 'bg-red-500',
      '39': 'bg-orange-500',
    };
    return contenttypeid ? colors[contenttypeid] || 'bg-gray-500' : 'bg-blue-500';
  };

  // HTML 태그 제거
  const stripHtml = (html?: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* 로딩 스켈레톤 */}
        <div className="w-full h-96 bg-gray-200 animate-pulse" />
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            관광지 정보를 찾을 수 없습니다
          </h2>
          <button
            onClick={() => router.push('/places')}
            className="text-primary-600 hover:text-primary-700"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 표시할 이미지 목록 (대표 이미지 + 추가 이미지)
  const allImages = [
    ...(place.firstimage ? [{ originimgurl: place.firstimage, imgname: place.title }] : []),
    ...images,
  ];

  const currentImage = allImages[selectedImageIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 이미지 갤러리 */}
      <section className="relative w-full h-96 bg-gray-900">
        {currentImage ? (
          <div className="relative w-full h-full">
            <Image
              src={currentImage.originimgurl || place.firstimage || ''}
              alt={currentImage.imgname || place.title}
              fill
              className="object-cover"
              sizes="100vw"
            />

            {/* 이미지 네비게이션 */}
            {allImages.length > 1 && (
              <>
                {/* 이전 버튼 */}
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev > 0 ? prev - 1 : allImages.length - 1
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full flex items-center justify-center text-white transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* 다음 버튼 */}
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev < allImages.length - 1 ? prev + 1 : 0
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full flex items-center justify-center text-white transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* 이미지 인디케이터 */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === selectedImageIndex
                          ? 'bg-white w-8'
                          : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </section>

      {/* 썸네일 갤러리 */}
      {allImages.length > 1 && (
        <section className="bg-white border-b border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedImageIndex
                      ? 'border-primary-500'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={img.originimgurl || place.firstimage || ''}
                    alt={`썸네일 ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 기본 정보 */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* 왼쪽: 정보 */}
          <div className="lg:col-span-2">
            {/* 뒤로가기 */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>뒤로가기</span>
            </button>

            {/* 카테고리 & 공공데이터 배지 */}
            <div className="flex gap-2 mb-4">
              <span
                className={`px-3 py-1.5 ${getCategoryColor(place.contenttypeid)} text-white rounded-md text-sm font-semibold`}
              >
                {getCategoryName(place.contenttypeid)}
              </span>
              <span className="px-3 py-1.5 bg-primary-500 text-white rounded-md text-sm font-semibold">
                공공데이터
              </span>
            </div>

            {/* 장소명 */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{place.title}</h1>

            {/* 설명 */}
            {place.overview && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">소개</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {stripHtml(place.overview)}
                </p>
              </div>
            )}

            {/* 정보 */}
            <div className="space-y-4 mb-8">
              {place.addr1 && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex-1">
                    <span className="text-gray-700">{place.addr1}</span>
                    {place.addr2 && <span className="text-gray-600 text-sm ml-1">({place.addr2})</span>}
                  </div>
                </div>
              )}

              {place.tel && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-gray-700">{place.tel}</span>
                </div>
              )}

              {place.homepage && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  <div
                    className="text-primary-600 hover:underline flex-1 break-all"
                    dangerouslySetInnerHTML={{ __html: place.homepage }}
                  />
                </div>
              )}

              {place.zipcode && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-700">우편번호: {place.zipcode}</span>
                </div>
              )}
            </div>

            {/* 데이터 출처 */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>데이터 출처:</strong> 한국관광공사 Tour API 4.0
              </p>
              {place.modifiedtime && (
                <p className="text-xs text-blue-600 mt-1">
                  최종 수정일:{' '}
                  {new Date(
                    place.modifiedtime.replace(
                      /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
                      '$1-$2-$3T$4:$5:$6',
                    ),
                  ).toLocaleDateString('ko-KR')}
                </p>
              )}
            </div>
          </div>

          {/* 오른쪽: 지도 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 w-full h-96">
              <KakaoMap
                lat={place.mapy ? parseFloat(place.mapy) : 0}
                lng={place.mapx ? parseFloat(place.mapx) : 0}
                name={place.title}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
