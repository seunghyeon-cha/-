'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

const slides: HeroSlide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=1920&h=600&auto=format&fit=crop',
    title: '제주도의 아름다운 자연을 만나보세요',
    subtitle: '성산일출봉부터 한라산까지, 제주의 모든 것',
    ctaText: '제주 여행 시작하기',
    ctaLink: '/places?area=제주도',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&h=600&auto=format&fit=crop',
    title: '부산 바다의 낭만을 느껴보세요',
    subtitle: '해운대부터 감천문화마을까지',
    ctaText: '부산 여행 시작하기',
    ctaLink: '/places?area=부산광역시',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=1920&h=600&auto=format&fit=crop',
    title: '강원도의 청정 자연 속으로',
    subtitle: '설악산, 남이섬, 강릉의 숨은 명소',
    ctaText: '강원 여행 시작하기',
    ctaLink: '/places?area=강원도',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?q=80&w=1920&h=600&auto=format&fit=crop',
    title: '경주에서 역사를 만나다',
    subtitle: '불국사, 첨성대, 천년의 역사가 살아있는 곳',
    ctaText: '경주 여행 시작하기',
    ctaLink: '/places?area=경상북도',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1920&h=600&auto=format&fit=crop',
    title: '전주 한옥마을의 전통미',
    subtitle: '맛과 멋이 가득한 전주를 경험하세요',
    ctaText: '전주 여행 시작하기',
    ctaLink: '/places?area=전라북도',
  },
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // 다음 슬라이드로 이동
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, []);

  // 이전 슬라이드로 이동
  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // 자동 슬라이드 (5초 간격)
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, nextSlide]);

  // 특정 슬라이드로 이동
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
    // 3초 후 자동 재생 재개
    setTimeout(() => setIsAutoPlay(true), 3000);
  };

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        setIsAutoPlay(false);
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        setIsAutoPlay(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const currentSlide = slides[currentIndex];

  return (
    <section
      className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-900"
      role="region"
      aria-label="메인 배너 슬라이드"
      aria-live="polite"
    >
      {/* 슬라이드 이미지 */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
            {/* 어두운 오버레이 */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>

      {/* 컨텐츠 */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-4xl">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            {currentSlide.title}
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 drop-shadow-md">
            {currentSlide.subtitle}
          </p>
          <Link
            href={currentSlide.ctaLink}
            className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 md:px-10 md:py-4 rounded-lg font-semibold text-base md:text-lg transition-all hover:scale-105 shadow-xl"
            aria-label={currentSlide.ctaText}
          >
            {currentSlide.ctaText}
          </Link>
        </div>
      </div>

      {/* 좌측 네비게이션 버튼 */}
      <button
        onClick={() => {
          prevSlide();
          setIsAutoPlay(false);
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-3 md:p-4 rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="이전 슬라이드"
      >
        <svg
          className="w-6 h-6 md:w-8 md:h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* 우측 네비게이션 버튼 */}
      <button
        onClick={() => {
          nextSlide();
          setIsAutoPlay(false);
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-3 md:p-4 rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="다음 슬라이드"
      >
        <svg
          className="w-6 h-6 md:w-8 md:h-8"
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
      </button>

      {/* 하단 인디케이터 */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`슬라이드 ${index + 1}로 이동`}
            aria-current={index === currentIndex}
          />
        ))}
      </div>

      {/* 자동 재생 표시 (스크린 리더용) */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        슬라이드 {currentIndex + 1} / {slides.length}: {currentSlide.title}
      </div>
    </section>
  );
}
