'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Slide {
  id: number;
  title: string;
  description: string;
  bgColor: string;
  link: string;
  emoji: string;
}

const slides: Slide[] = [
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

export default function ImageSlider() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full bg-gray-900" style={{ height: '400px' }}>
      {/* 슬라이드 컨테이너 */}
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
            {/* 콘텐츠 */}
            <div className="text-center px-6 text-white z-10">
              <div className="text-8xl mb-6">{slide.emoji}</div>
              <h2 className="text-5xl font-bold mb-4">{slide.title}</h2>
              <p className="text-2xl mb-8 opacity-90">{slide.description}</p>
              <div className="inline-block px-8 py-3 bg-white text-gray-900 rounded-full font-bold text-lg hover:scale-105 transition-transform">
                자세히 보기 →
              </div>
            </div>

            {/* 장식 원들 */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white opacity-10 rounded-full"></div>
          </div>
        ))}
      </div>

      {/* 이전 버튼 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all z-20"
        aria-label="이전"
      >
        <span className="text-gray-900 text-2xl font-bold">‹</span>
      </button>

      {/* 다음 버튼 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all z-20"
        aria-label="다음"
      >
        <span className="text-gray-900 text-2xl font-bold">›</span>
      </button>

      {/* 인디케이터 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(index);
            }}
            className={`transition-all ${
              index === currentSlide
                ? 'w-8 h-3 bg-white'
                : 'w-3 h-3 bg-white/50 hover:bg-white/70'
            } rounded-full`}
            aria-label={`슬라이드 ${index + 1}`}
          />
        ))}
      </div>

      {/* 카운터 */}
      <div className="absolute top-4 right-4 z-20 bg-black/50 px-3 py-1 rounded-full text-white text-sm font-bold">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
}
