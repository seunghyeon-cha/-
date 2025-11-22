import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://smartrip.com';
  const currentDate = new Date();

  // 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/places`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/boards`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/itinerary`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/business/verify`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // 카테고리별 페이지
  const categories = ['TOURIST', 'RESTAURANT', 'ACCOMMODATION'];
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/places?category=${category}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // 실제 환경에서는 API를 호출하여 동적으로 생성
  // 지금은 예시로 정적 페이지만 반환
  /*
  // 동적 페이지 생성 예시:
  const places = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/places`).then(res => res.json());
  const placePages: MetadataRoute.Sitemap = places.map((place: any) => ({
    url: `${baseUrl}/places/${place.id}`,
    lastModified: new Date(place.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const boards = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/boards`).then(res => res.json());
  const boardPages: MetadataRoute.Sitemap = boards.map((board: any) => ({
    url: `${baseUrl}/boards/${board.id}`,
    lastModified: new Date(board.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));
  */

  return [...staticPages, ...categoryPages];
}
