/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',  // GitHub Pages를 위한 정적 내보내기
  // basePath와 assetPrefix 제거 - 루트 경로로 배포
  images: {
    unoptimized: true, // 정적 내보내기 시 필수
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },
  // Note: headers() is not supported with static export
  // Headers will be configured by the hosting platform (GitHub Pages)
  compress: true,
  poweredByHeader: false,
};

module.exports = nextConfig;
