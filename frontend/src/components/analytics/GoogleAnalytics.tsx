'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// GA4 측정 ID - 실제 운영시 환경변수로 변경
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

/**
 * 페이지 뷰 이벤트 전송
 */
export function pageview(url: string) {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
}

/**
 * 커스텀 이벤트 전송
 */
export function event({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

/**
 * Google Analytics 컴포넌트
 */
export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() || '');
      pageview(url);
    }
  }, [pathname, searchParams]);

  // GA ID가 없으면 렌더링하지 않음
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

/**
 * 유용한 이벤트 추적 함수들
 */
export const trackEvent = {
  // 검색 이벤트
  search: (query: string) =>
    event({ action: 'search', category: 'engagement', label: query }),

  // 장소 조회
  viewPlace: (placeId: string, placeName: string) =>
    event({ action: 'view_place', category: 'content', label: `${placeId}:${placeName}` }),

  // 북마크 추가/제거
  bookmark: (placeId: string, action: 'add' | 'remove') =>
    event({ action: `bookmark_${action}`, category: 'engagement', label: placeId }),

  // 일정 생성
  createItinerary: () =>
    event({ action: 'create_itinerary', category: 'conversion' }),

  // 회원가입
  signup: (method: string) =>
    event({ action: 'sign_up', category: 'conversion', label: method }),

  // 로그인
  login: (method: string) =>
    event({ action: 'login', category: 'engagement', label: method }),

  // 게시글 작성
  createPost: (boardType: string) =>
    event({ action: 'create_post', category: 'content', label: boardType }),

  // 리뷰 작성
  createReview: (placeId: string, rating: number) =>
    event({ action: 'create_review', category: 'engagement', label: placeId, value: rating }),

  // 에러 추적
  error: (errorType: string, errorMessage: string) =>
    event({ action: 'error', category: 'technical', label: `${errorType}: ${errorMessage}` }),
};
