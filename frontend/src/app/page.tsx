'use client';

import HeroSlider from '@/components/home/HeroSlider';
import PopularPlaces from '@/components/home/PopularPlaces';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSlider />

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            예림투어와 함께하는 국내 여행
          </h2>
          <p className="text-lg text-gray-600">
            관광지, 맛집, 숙소 정보를 한눈에 확인하세요
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Link
            href="/places?category=TOURIST"
            className="group relative overflow-hidden rounded-2xl border border-gray-200 hover:border-primary-500 transition-all hover:shadow-xl"
          >
            <div className="relative h-64 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&h=250&auto=format&fit=crop"
                alt="전국의 아름다운 관광지"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
            <div className="p-6 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-3xl" role="img" aria-label="관광지">
                  🏞️
                </div>
                <h3 className="text-xl font-bold text-gray-900">관광지</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                전국의 아름다운 관광지 정보
              </p>
              <div className="flex items-center text-primary-500 font-medium text-sm group-hover:translate-x-2 transition-transform">
                자세히 보기
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>

          <Link
            href="/places?category=RESTAURANT"
            className="group relative overflow-hidden rounded-2xl border border-gray-200 hover:border-primary-500 transition-all hover:shadow-xl"
          >
            <div className="relative h-64 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&h=250&auto=format&fit=crop"
                alt="지역별 맛집 추천"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
            <div className="p-6 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-3xl" role="img" aria-label="맛집">
                  🍜
                </div>
                <h3 className="text-xl font-bold text-gray-900">맛집</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                지역별 맛집 추천 및 리뷰
              </p>
              <div className="flex items-center text-primary-500 font-medium text-sm group-hover:translate-x-2 transition-transform">
                자세히 보기
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>

          <Link
            href="/places?category=ACCOMMODATION"
            className="group relative overflow-hidden rounded-2xl border border-gray-200 hover:border-primary-500 transition-all hover:shadow-xl"
          >
            <div className="relative h-64 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&h=250&auto=format&fit=crop"
                alt="편안한 숙소 정보"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
            <div className="p-6 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-3xl" role="img" aria-label="숙소">
                  🏨
                </div>
                <h3 className="text-xl font-bold text-gray-900">숙소</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                편안한 숙소 정보와 예약
              </p>
              <div className="flex items-center text-primary-500 font-medium text-sm group-hover:translate-x-2 transition-transform">
                자세히 보기
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <PopularPlaces />

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-semibold text-primary-600">예림투어</span> 개발 현황
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>✅ 브랜드명 확정: 예림투어</p>
            <p>✅ 스카이 블루 컬러 시스템 적용</p>
            <p>✅ Header & Footer 컴포넌트 완성</p>
            <p>✅ 메인 페이지 이미지 섹션 추가</p>
            <p>🚧 로고 디자인 진행 중</p>
          </div>
        </div>
      </section>
    </div>
  );
}
