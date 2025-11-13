'use client';

import Image from 'next/image';
import Link from 'next/link';

interface PopularPlace {
  id: number;
  name: string;
  location: string;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
}

const popularPlaces: PopularPlace[] = [
  {
    id: 1,
    name: '제주 성산일출봉',
    location: '제주도',
    image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=300&h=200&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 1234,
    category: 'TOURIST',
  },
  {
    id: 2,
    name: '부산 해운대',
    location: '부산광역시',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=300&h=200&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 987,
    category: 'TOURIST',
  },
  {
    id: 3,
    name: '강릉 경포대',
    location: '강원도 강릉시',
    image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=300&h=200&auto=format&fit=crop',
    rating: 4.6,
    reviewCount: 756,
    category: 'TOURIST',
  },
  {
    id: 4,
    name: '경주 불국사',
    location: '경상북도 경주시',
    image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?q=80&w=300&h=200&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 1100,
    category: 'TOURIST',
  },
  {
    id: 5,
    name: '전주 한옥마을',
    location: '전라북도 전주시',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=300&h=200&auto=format&fit=crop',
    rating: 4.5,
    reviewCount: 890,
    category: 'TOURIST',
  },
  {
    id: 6,
    name: '여수 해상케이블카',
    location: '전라남도 여수시',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=300&h=200&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 1050,
    category: 'TOURIST',
  },
  {
    id: 7,
    name: '속초 설악산',
    location: '강원도 속초시',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=300&h=200&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 920,
    category: 'TOURIST',
  },
  {
    id: 8,
    name: '가평 남이섬',
    location: '경기도 가평군',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=300&h=200&auto=format&fit=crop',
    rating: 4.6,
    reviewCount: 680,
    category: 'TOURIST',
  },
];

export default function PopularPlaces() {
  return (
    <section className="container mx-auto px-4 py-16 bg-gray-50">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="text-3xl" role="img" aria-label="인기">
            🔥
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            지금 인기있는 여행지
          </h2>
        </div>
        <p className="text-lg text-gray-600">
          여행객들이 가장 많이 찾는 국내 명소를 만나보세요
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {popularPlaces.map((place) => (
          <Link
            key={place.id}
            href={`/places?category=${place.category}`}
            className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-primary-500 transition-all hover:shadow-lg hover:-translate-y-1"
          >
            {/* 이미지 */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={place.image}
                alt={place.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>

            {/* 정보 */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {place.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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
                <span>{place.location}</span>
              </div>

              {/* 평점 및 리뷰 */}
              <div className="flex items-center gap-1">
                <svg
                  className="w-5 h-5 text-yellow-400 fill-current"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="sr-only">평점</span>
                <span className="font-bold text-gray-900">{place.rating}</span>
                <span className="text-gray-500 text-sm">
                  <span className="sr-only">리뷰</span>({place.reviewCount.toLocaleString()}
                  <span className="sr-only">개</span>)
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 더보기 버튼 */}
      <div className="text-center mt-12">
        <Link
          href="/places"
          className="inline-flex items-center gap-2 bg-white border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          더 많은 여행지 보기
          <svg
            className="w-5 h-5"
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
        </Link>
      </div>
    </section>
  );
}
