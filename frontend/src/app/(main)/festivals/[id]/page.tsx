'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { getFestivalById, getFestivalImages } from '@/lib/api/festivals';

interface FestivalDetail {
  contentid: string;
  contenttypeid: string;
  title: string;
  addr1?: string;
  addr2?: string;
  zipcode?: string;
  tel?: string;
  homepage?: string;
  overview?: string;
  firstimage?: string;
  firstimage2?: string;
  mapx?: string;
  mapy?: string;
  mlevel?: string;
  areacode?: string;
  sigungucode?: string;
}

interface FestivalImage {
  contentid: string;
  originimgurl?: string;
  smallimageurl?: string;
  serialnum?: string;
}

export default function FestivalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const contentId = params.id as string;

  const [festival, setFestival] = useState<FestivalDetail | null>(null);
  const [images, setImages] = useState<FestivalImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (contentId) {
      fetchFestivalDetail();
    }
  }, [contentId]);

  const fetchFestivalDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 상세 정보 조회
      const detailResponse = await getFestivalById(contentId);

      if (detailResponse.response.header.resultCode === '0000') {
        const item = detailResponse.response.body.items?.item?.[0];
        if (item) {
          setFestival(item);
        } else {
          setError('축제 정보를 찾을 수 없습니다.');
        }
      } else {
        setError('축제 정보를 불러오는데 실패했습니다.');
      }

      // 이미지 정보 조회
      try {
        const imagesResponse = await getFestivalImages(contentId);
        if (imagesResponse.response.header.resultCode === '0000') {
          const imageItems = imagesResponse.response.body.items?.item || [];
          setImages(imageItems);
        }
      } catch (err) {
        console.log('No additional images available');
      }
    } catch (error) {
      console.error('Failed to fetch festival detail:', error);
      setError('축제 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !festival) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600 mb-4">{error || '축제 정보를 찾을 수 없습니다.'}</p>
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>목록으로 돌아가기</span>
        </button>

        {/* 메인 카드 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* 대표 이미지 */}
          {festival.firstimage && (
            <div className="relative w-full aspect-[16/9] bg-gray-200">
              <Image
                src={festival.firstimage}
                alt={festival.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
                unoptimized
              />
            </div>
          )}

          {/* 정보 섹션 */}
          <div className="p-8">
            {/* 제목 */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{festival.title}</h1>

            {/* 기본 정보 */}
            <div className="space-y-4 mb-8">
              {festival.addr1 && (
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-primary-600 mt-0.5 flex-shrink-0"
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
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">개최 장소</p>
                    <p className="text-gray-900">
                      {festival.addr1} {festival.addr2}
                    </p>
                  </div>
                </div>
              )}

              {festival.tel && (
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-primary-600 mt-0.5 flex-shrink-0"
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
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">연락처</p>
                    <p className="text-gray-900">{festival.tel}</p>
                  </div>
                </div>
              )}

              {festival.homepage && (
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-primary-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">홈페이지</p>
                    <div
                      className="text-primary-600 hover:text-primary-700"
                      dangerouslySetInnerHTML={{ __html: festival.homepage }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 상세 설명 */}
            {festival.overview && (
              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">상세 정보</h2>
                <div
                  className="prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: festival.overview }}
                />
              </div>
            )}

            {/* 추가 이미지 */}
            {images.length > 0 && (
              <div className="border-t border-gray-200 pt-8 mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">갤러리</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                      {img.originimgurl && (
                        <Image
                          src={img.originimgurl}
                          alt={`${festival.title} 이미지 ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 33vw"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                          unoptimized
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
