import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ToastContainer from '@/components/common/Toast';

export const metadata: Metadata = {
  title: {
    default: '예림투어 - 국내 여행의 모든 것',
    template: '%s | 예림투어',
  },
  description: '예림투어에서 국내 여행 시 필요한 관광지, 맛집, 숙소 정보를 찾고 여행 경험을 공유하세요',
  keywords: ['국내여행', '관광지', '맛집', '숙소', '여행일정', '여행커뮤니티', '국내여행추천', '여행지', '예림투어'],
  authors: [{ name: '예림투어' }],
  creator: '예림투어',
  publisher: '예림투어',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://yerimtour.com',
    siteName: '예림투어',
    title: '예림투어 - 국내 여행의 모든 것',
    description: '국내 여행 정보, 관광지, 맛집, 숙소를 한눈에. 여행 일정을 만들고 경험을 공유하세요.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '예림투어',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '예림투어 - 국내 여행의 모든 것',
    description: '국내 여행 정보, 관광지, 맛집, 숙소를 한눈에',
    images: ['/og-image.jpg'],
    creator: '@yerimtour',
  },
  verification: {
    google: 'google-site-verification-code',
    other: {
      'naver-site-verification': 'naver-verification-code',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script
          type="text/javascript"
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`}
        ></script>
      </head>
      <body className="font-sans antialiased">
        {/* Skip to Content 링크 - 키보드 포커스 시에만 표시 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-primary-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:outline-2 focus:outline-offset-2 focus:outline-white"
        >
          본문으로 건너뛰기
        </a>
        <Header />
        <main id="main-content" className="min-h-screen pt-16" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <ToastContainer />
      </body>
    </html>
  );
}
