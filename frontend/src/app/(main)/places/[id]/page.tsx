'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PlaceCard from '@/components/places/PlaceCard';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';
import KakaoMap from '@/components/map/KakaoMap';
import { getPlace, getPlaces, Place } from '@/lib/api/places';
import { checkBookmark, createBookmark, deleteBookmark } from '@/lib/api/bookmarks';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/stores/toastStore';

export default function PlaceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [place, setPlace] = useState<Place | null>(null);
  const [recommendedPlaces, setRecommendedPlaces] = useState<Place[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      // 장소 정보 조회
      const placeData = await getPlace(params.id);
      setPlace(placeData);

      // 추천 장소 조회 (같은 카테고리)
      const recommended = await getPlaces({
        category: placeData.category,
        limit: 4,
      });
      // 현재 장소 제외
      setRecommendedPlaces(
        recommended.data.filter((p) => p.id !== params.id),
      );

      // 북마크 상태 확인 (로그인한 경우만)
      if (isAuthenticated) {
        const bookmarkStatus = await checkBookmark(params.id);
        setIsBookmarked(bookmarkStatus.bookmarked);
        setBookmarkId(bookmarkStatus.bookmarkId);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [params.id, isAuthenticated]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.warning('로그인이 필요합니다');
      router.push('/login');
      return;
    }

    try {
      if (isBookmarked && bookmarkId) {
        await deleteBookmark(bookmarkId);
        setIsBookmarked(false);
        setBookmarkId(null);
        toast.success('북마크가 해제되었습니다');
      } else {
        const bookmark = await createBookmark(params.id);
        setIsBookmarked(true);
        setBookmarkId(bookmark.id);
        toast.success('북마크에 추가되었습니다');
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
      // API 인터셉터에서 이미 토스트 표시함
    }
  };

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      toast.warning('로그인이 필요합니다');
      router.push('/login');
      return;
    }
    setIsReviewFormOpen(true);
  };

  const handleReviewSuccess = () => {
    // 리뷰 작성 성공 시 페이지 새로고침
    fetchData();
  };

  const categoryConfig: Record<string, { label: string; color: string }> = {
    TOURIST: { label: '관광지', color: 'bg-primary-500' },
    RESTAURANT: { label: '맛집', color: 'bg-orange-500' },
    ACCOMMODATION: { label: '숙소', color: 'bg-purple-500' },
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
            장소를 찾을 수 없습니다
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 이미지 갤러리 */}
      <section className="relative w-full h-96 bg-gray-900">
        {place.images && place.images.length > 0 ? (
          <Image
            src={place.images[0]}
            alt={place.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
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

            {/* 카테고리 & 북마크 */}
            <div className="flex justify-between items-center mb-4">
              <span className={`px-3 py-1.5 ${categoryConfig[place.category].color} text-white rounded-md text-sm font-semibold`}>
                {categoryConfig[place.category].label}
              </span>
              <button
                onClick={handleBookmark}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                  isBookmarked
                    ? 'bg-primary-500 border-primary-500 text-white'
                    : 'border-gray-300 text-gray-600 hover:border-primary-500'
                }`}
              >
                <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>

            {/* 장소명 */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{place.name}</h1>

            {/* 평점 */}
            <div className="flex items-center gap-2 mb-8">
              <svg className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xl font-bold">{place.averageRating.toFixed(1)}</span>
              <span className="text-gray-600">({place.reviewCount}개 리뷰)</span>
            </div>

            {/* 설명 */}
            <p className="text-gray-700 leading-relaxed mb-8 whitespace-pre-wrap">{place.description}</p>

            {/* 정보 */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">{place.address}</span>
              </div>

              {place.contact && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-700">{place.contact}</span>
                </div>
              )}

              {place.website && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                    {place.website}
                  </a>
                </div>
              )}

              {place.operatingHours && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">{place.operatingHours}</span>
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽: 지도 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 w-full h-96">
              <KakaoMap
                lat={place.lat || 37.5665}
                lng={place.lng || 126.9780}
                name={place.name}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 리뷰 섹션 */}
      <ReviewList placeId={params.id} onWriteReview={handleWriteReview} />

      {/* 추천 장소 */}
      {recommendedPlaces.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16 bg-white">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">이런 장소는 어때요?</h2>
          <p className="text-gray-600 mb-10">비슷한 카테고리의 인기 장소</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedPlaces.map((p) => (
              <PlaceCard
                key={p.id}
                {...p}
                image={p.images?.[0]}
                rating={p.averageRating}
                onClick={(id) => router.push(`/places/${id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 리뷰 작성 모달 */}
      <ReviewForm
        placeId={params.id}
        placeName={place.name}
        isOpen={isReviewFormOpen}
        onClose={() => setIsReviewFormOpen(false)}
        onSuccess={handleReviewSuccess}
      />
    </div>
  );
}
