/**
 * SEO 메타데이터 유틸리티
 */

import { Metadata } from 'next';

const SITE_NAME = 'Smartrip';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartrip.com';
const DEFAULT_DESCRIPTION = '국내 여행의 모든 것, Smartrip와 함께 떠나는 여행';
const DEFAULT_IMAGE = `${SITE_URL}/images/og-default.jpg`;

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  noIndex?: boolean;
}

/**
 * 페이지 메타데이터 생성
 */
export function generateMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url = SITE_URL,
  type = 'website',
  keywords = [],
  noIndex = false,
}: SEOProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  return {
    title: fullTitle,
    description,
    keywords: [
      '국내여행',
      '여행정보',
      '관광지',
      '맛집',
      '숙소',
      '여행일정',
      ...keywords,
    ],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type,
      locale: 'ko_KR',
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * 장소 구조화 데이터 (JSON-LD)
 */
export function generatePlaceSchema(place: {
  name: string;
  description: string;
  address: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  lat?: number;
  lng?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: place.name,
    description: place.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: place.address,
      addressCountry: 'KR',
    },
    ...(place.image && { image: place.image }),
    ...(place.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: place.rating,
        reviewCount: place.reviewCount || 0,
      },
    }),
    ...(place.lat &&
      place.lng && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: place.lat,
          longitude: place.lng,
        },
      }),
  };
}

/**
 * 조직 구조화 데이터
 */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '1588-0000',
    contactType: 'customer service',
    availableLanguage: 'Korean',
  },
  sameAs: [
    'https://facebook.com/smartrip',
    'https://instagram.com/smartrip',
    'https://youtube.com/smartrip',
  ],
};

/**
 * 빵부스러기 구조화 데이터
 */
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export default generateMetadata;
