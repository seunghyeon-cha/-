'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PlaceCard from '@/components/places/PlaceCard';
import { getPlaces, Place } from '@/lib/api/places';

export default function HomePage() {
  const router = useRouter();
  const [popularPlaces, setPopularPlaces] = useState<Place[]>([]);
  const [touristPlaces, setTouristPlaces] = useState<Place[]>([]);
  const [restaurantPlaces, setRestaurantPlaces] = useState<Place[]>([]);
  const [accommodationPlaces, setAccommodationPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 슬라이더 상태
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: '국내 관광지 탐험',
      description: '아름다운 자연과 역사가 살아있는 곳',
      bgColor: 'bg-blue-600',
      link: '/places?category=TOURIST',
      emoji: '🏛️',
    },
    {
      id: 2,
      title: '전국 맛집 여행',
      description: '현지인이 추천하는 숨은 맛집',
      bgColor: 'bg-orange-600',
      link: '/places?category=RESTAURANT',
      emoji: '🍜',
    },
    {
      id: 3,
      title: '편안한 숙소',
      description: '여행의 휴식을 완성하는 공간',
      bgColor: 'bg-purple-600',
      link: '/places?category=ACCOMMODATION',
      emoji: '🏨',
    },
    {
      id: 4,
      title: '인기 여행지',
      description: '지금 가장 HOT한 여행 스팟',
      bgColor: 'bg-green-600',
      link: '/places?sort=reviews',
      emoji: '⭐',
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  // 슬라이더 자동 재생
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const [popular, tourist, restaurant, accommodation] = await Promise.all([
        getPlaces({ limit: 4, sort: 'reviews' }),
        getPlaces({ category: 'TOURIST', limit: 3 }),
        getPlaces({ category: 'RESTAURANT', limit: 3 }),
        getPlaces({ category: 'ACCOMMODATION', limit: 3 }),
      ]);

      setPopularPlaces(popular.data);
      setTouristPlaces(tourist.data);
      setRestaurantPlaces(restaurant.data);
      setAccommodationPlaces(accommodation.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const keyword = formData.get('keyword') as string;
    router.push(`/places?search=${encodeURIComponent(keyword)}`);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen">
      {/* 이미지 슬라이더 - 직접 구현 */}
      <div className="relative w-full bg-gray-900" style={{ height: '450px' }}>
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`min-w-full h-full ${slide.bgColor} cursor-pointer flex items-center justify-center relative`}
              onClick={() => router.push(slide.link)}
            >
              <div className="text-center px-6 text-white z-10">
                <div className="text-9xl mb-8 animate-bounce">{slide.emoji}</div>
                <h2 className="text-6xl font-black mb-6">{slide.title}</h2>
                <p className="text-3xl mb-10 opacity-90">{slide.description}</p>
                <div className="inline-block px-12 py-4 bg-white text-gray-900 rounded-full font-bold text-xl hover:scale-110 transition-transform shadow-2xl">
                  자세히 보기 →
                </div>
              </div>

              <div className="absolute top-10 left-10 w-24 h-24 bg-white opacity-10 rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
            </div>
          ))}
        </div>

        {/* 이전 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all z-20 shadow-xl"
        >
          <span className="text-gray-900 text-3xl font-bold">‹</span>
        </button>

        {/* 다음 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all z-20 shadow-xl"
        >
          <span className="text-gray-900 text-3xl font-bold">›</span>
        </button>

        {/* 인디케이터 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(index);
              }}
              className={`transition-all ${
                index === currentSlide
                  ? 'w-10 h-3 bg-white'
                  : 'w-3 h-3 bg-white/60 hover:bg-white/80'
              } rounded-full`}
            />
          ))}
        </div>

        {/* 카운터 */}
        <div className="absolute top-6 right-6 z-20 bg-black/60 px-4 py-2 rounded-full text-white font-bold">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>

      {/* 검색 섹션 */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSearch}>
            <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-full px-6 py-4 shadow-lg hover:border-primary-500 transition-all">
              <svg
                className="w-6 h-6 text-gray-400 mr-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                name="keyword"
                placeholder="어디로 떠나시나요? 관광지, 맛집, 숙소를 검색해보세요"
                className="flex-1 outline-none text-gray-900 text-lg bg-transparent"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-primary-500 text-white rounded-full font-semibold hover:bg-primary-600 transition-colors ml-4"
              >
                검색
              </button>
            </div>
          </form>

          {/* 카테고리 칩 */}
          <div className="flex gap-3 mt-6 justify-center">
            {[
              { label: '관광지', path: '/places?category=TOURIST' },
              { label: '맛집', path: '/places?category=RESTAURANT' },
              { label: '숙소', path: '/places?category=ACCOMMODATION' },
            ].map((category) => (
              <button
                key={category.label}
                onClick={() => router.push(category.path)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-primary-50 hover:text-primary-600 transition-all font-medium"
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 카테고리 퀵 링크 */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { emoji: '🏛️', title: '관광지', desc: '역사와 문화', category: 'TOURIST' },
            { emoji: '🍴', title: '맛집', desc: '현지인 추천', category: 'RESTAURANT' },
            { emoji: '🏨', title: '숙소', desc: '편안한 휴식', category: 'ACCOMMODATION' },
          ].map((item) => (
            <button
              key={item.title}
              onClick={() => router.push(`/places?category=${item.category}`)}
              className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center hover:-translate-y-2 hover:shadow-xl transition-all"
            >
              <div className="text-5xl mb-4">{item.emoji}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* 인기 장소 섹션 */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">인기 장소</h2>
              <p className="text-gray-600">가장 많이 찾는 여행지를 만나보세요</p>
            </div>
            <button
              onClick={() => router.push('/places?sort=reviews')}
              className="text-primary-600 font-semibold hover:text-primary-700"
            >
              더보기 →
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="aspect-video bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  {...place}
                  image={place.images?.[0]}
                  rating={place.averageRating}
                  onClick={(id) => router.push(`/places/${id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 관광지 추천 */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">관광지 추천</h2>
              <p className="text-gray-600">역사와 문화를 느낄 수 있는 곳</p>
            </div>
            <button
              onClick={() => router.push('/places?category=TOURIST')}
              className="text-primary-600 font-semibold hover:text-primary-700"
            >
              더보기 →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {touristPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                {...place}
                image={place.images?.[0]}
                rating={place.averageRating}
                onClick={(id) => router.push(`/places/${id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 맛집 추천 */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">맛집 추천</h2>
              <p className="text-gray-600">현지인이 사랑하는 맛집</p>
            </div>
            <button
              onClick={() => router.push('/places?category=RESTAURANT')}
              className="text-orange-600 font-semibold hover:text-orange-700"
            >
              더보기 →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurantPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                {...place}
                image={place.images?.[0]}
                rating={place.averageRating}
                onClick={(id) => router.push(`/places/${id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 숙소 추천 */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">숙소 추천</h2>
              <p className="text-gray-600">편안한 휴식을 위한 공간</p>
            </div>
            <button
              onClick={() => router.push('/places?category=ACCOMMODATION')}
              className="text-purple-600 font-semibold hover:text-purple-700"
            >
              더보기 →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accommodationPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                {...place}
                image={place.images?.[0]}
                rating={place.averageRating}
                onClick={(id) => router.push(`/places/${id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-24 px-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">사업자이신가요?</h2>
        <p className="text-xl mb-10 opacity-90">
          Smartrip에 장소를 등록하세요
        </p>
        <button
          onClick={() => router.push('/business/register')}
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold text-lg hover:-translate-y-1 hover:shadow-2xl transition-all"
        >
          지금 시작하기 →
        </button>
      </section>
    </div>
  );
}
