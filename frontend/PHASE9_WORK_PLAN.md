# Phase 9: 성능 최적화 및 SEO 작업 계획서

**작성일**: 2025-11-10
**작성자**: PO (Product Owner)
**프로젝트**: 예림투어 - 국내 여행 플랫폼
**Phase**: Phase 9 - Performance Optimization & SEO

---

## 📋 작업 개요

### 목표
Phase 9의 목표는 **웹사이트 성능 최적화와 SEO를 통해 사용자 경험을 개선하고 검색 엔진 노출을 향상**시키는 것입니다.

### 핵심 지표
- ✅ Lighthouse Performance Score: **90점 이상**
- ✅ Lighthouse SEO Score: **90점 이상**
- ✅ First Contentful Paint (FCP): **1.8초 이하**
- ✅ Largest Contentful Paint (LCP): **2.5초 이하**
- ✅ Time to Interactive (TTI): **3.8초 이하**
- ✅ Cumulative Layout Shift (CLS): **0.1 이하**

---

## 🎯 작업 범위

### 1. 이미지 최적화
- Next.js Image 컴포넌트 적용
- 이미지 포맷 최적화 (WebP)
- 이미지 지연 로딩 (Lazy Loading)
- 이미지 크기 최적화
- Blur placeholder 적용

### 2. 코드 스플리팅
- Dynamic Import 적용
- Route-based 코드 스플리팅
- Component-level 코드 스플리팅
- 번들 크기 분석 및 최적화

### 3. Lazy Loading
- 컴포넌트 Lazy Loading
- 이미지 Lazy Loading
- 스크롤 기반 Lazy Loading
- Intersection Observer 활용

### 4. 캐싱 전략
- HTTP 캐싱 헤더 설정
- Service Worker 캐싱 (선택적)
- API 응답 캐싱
- Static Asset 캐싱

### 5. Lighthouse 점수 90점 이상 달성
- 성능 측정 및 분석
- 병목 지점 파악
- 최적화 적용
- 재측정 및 검증

### 6. 메타 태그 설정
- Title 태그 최적화
- Description 메타 태그
- Keywords 메타 태그
- Viewport 설정
- Canonical URL

### 7. Open Graph 설정
- og:title
- og:description
- og:image
- og:url
- og:type
- Twitter Card 설정

### 8. Sitemap 생성
- XML Sitemap 생성
- 동적 sitemap 생성
- Google Search Console 제출 준비

### 9. robots.txt
- robots.txt 파일 생성
- Crawling 규칙 설정
- Sitemap 위치 명시

---

## 📅 작업 일정

### Phase 1: 현재 상태 분석 (Day 1)
**담당**: Frontend Team
**예상 시간**: 2시간

**작업 내용**:
1. Lighthouse 측정 (Performance, SEO, Accessibility, Best Practices)
2. 번들 크기 분석
3. 이미지 사용 현황 분석
4. 현재 메타 태그 확인
5. 개선 포인트 도출

**산출물**:
- PHASE9_PERFORMANCE_ANALYSIS.md
- 개선 우선순위 리스트

---

### Phase 2: 이미지 최적화 (Day 1-2)
**담당**: Frontend Team
**예상 시간**: 4시간

**작업 내용**:
1. `<img>` 태그를 Next.js `<Image>` 컴포넌트로 전환
2. 이미지 크기 최적화 설정
3. Blur placeholder 추가
4. 반응형 이미지 설정 (sizes, srcSet)

**우선순위 페이지**:
1. 홈페이지 (/)
2. 장소 목록 (/places)
3. 장소 상세 (/places/[id])
4. 게시글 목록 (/boards)
5. 여행 일정 (/itinerary)

**코드 예시**:
```typescript
// Before
<img src="/images/hero.jpg" alt="Hero" className="w-full h-96" />

// After
<Image
  src="/images/hero.jpg"
  alt="Hero"
  width={1200}
  height={400}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

---

### Phase 3: 코드 스플리팅 및 Lazy Loading (Day 2-3)
**담당**: Frontend Team
**예상 시간**: 4시간

**작업 내용**:
1. **Route-based 코드 스플리팅**:
   - Next.js App Router는 기본적으로 route-based splitting 제공
   - 확인 및 최적화

2. **Component-level 코드 스플리팅**:
   - 무거운 컴포넌트 Dynamic Import
   - Modal, Chart, Map 등

3. **Third-party 라이브러리 최적화**:
   - Bundle analyzer로 큰 라이브러리 확인
   - Tree shaking 확인
   - 필요시 대체 라이브러리 검토

**적용 대상**:
- Modal 컴포넌트
- Map 컴포넌트 (카카오맵)
- Chart 컴포넌트 (통계 페이지)
- Toast 컴포넌트

**코드 예시**:
```typescript
// Dynamic Import
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  loading: () => <MapSkeleton />,
  ssr: false,
});

// Lazy Loading with Intersection Observer
const LazyImage = dynamic(() => import('@/components/LazyImage'));
```

---

### Phase 4: 캐싱 전략 구현 (Day 3)
**담당**: Frontend Team
**예상 시간**: 3시간

**작업 내용**:
1. **next.config.js 캐싱 설정**:
   ```javascript
   module.exports = {
     async headers() {
       return [
         {
           source: '/images/:path*',
           headers: [
             {
               key: 'Cache-Control',
               value: 'public, max-age=31536000, immutable',
             },
           ],
         },
       ];
     },
   };
   ```

2. **Static Asset 캐싱**:
   - 이미지: 1년 캐싱
   - CSS/JS: 1년 캐싱 (hash 기반)
   - Fonts: 1년 캐싱

3. **API 캐싱**:
   - React Query 활용 (이미 구현되어 있을 가능성)
   - staleTime, cacheTime 설정

4. **Service Worker** (선택적):
   - Next.js PWA 플러그인 고려
   - Offline 지원 검토

---

### Phase 5: 메타 태그 및 SEO 설정 (Day 3-4)
**담당**: Frontend Team
**예상 시간**: 4시간

**작업 내용**:
1. **Metadata API 활용** (Next.js 14):
   ```typescript
   // app/layout.tsx
   export const metadata: Metadata = {
     title: {
       default: '예림투어 - 국내 여행의 모든 것',
       template: '%s | 예림투어',
     },
     description: '국내 여행 정보, 관광지, 맛집, 숙소를 한눈에',
     keywords: ['국내여행', '관광지', '맛집', '숙소', '여행일정'],
     authors: [{ name: '예림투어' }],
     openGraph: {
       type: 'website',
       locale: 'ko_KR',
       url: 'https://yerimtour.com',
       siteName: '예림투어',
       images: [
         {
           url: '/images/og-image.jpg',
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
       images: ['/images/og-image.jpg'],
     },
   };
   ```

2. **페이지별 동적 메타데이터**:
   ```typescript
   // app/places/[id]/page.tsx
   export async function generateMetadata({ params }): Promise<Metadata> {
     const place = await getPlaceById(params.id);

     return {
       title: place.name,
       description: place.description,
       openGraph: {
         images: [place.images[0]],
       },
     };
   }
   ```

3. **Structured Data (JSON-LD)**:
   ```typescript
   const structuredData = {
     '@context': 'https://schema.org',
     '@type': 'TouristAttraction',
     name: place.name,
     description: place.description,
     image: place.images,
     address: {
       '@type': 'PostalAddress',
       addressLocality: place.address,
     },
     aggregateRating: {
       '@type': 'AggregateRating',
       ratingValue: place.avgRating,
       reviewCount: place.reviewCount,
     },
   };
   ```

---

### Phase 6: Sitemap 및 robots.txt (Day 4)
**담당**: Frontend Team
**예상 시간**: 2시간

**작업 내용**:
1. **Sitemap 생성**:
   ```typescript
   // app/sitemap.ts
   import { MetadataRoute } from 'next';

   export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
     const places = await getAllPlaces();
     const boards = await getAllBoards();

     return [
       {
         url: 'https://yerimtour.com',
         lastModified: new Date(),
         changeFrequency: 'daily',
         priority: 1,
       },
       {
         url: 'https://yerimtour.com/places',
         lastModified: new Date(),
         changeFrequency: 'daily',
         priority: 0.8,
       },
       ...places.map((place) => ({
         url: `https://yerimtour.com/places/${place.id}`,
         lastModified: place.updatedAt,
         changeFrequency: 'weekly' as const,
         priority: 0.7,
       })),
       ...boards.map((board) => ({
         url: `https://yerimtour.com/boards/${board.id}`,
         lastModified: board.updatedAt,
         changeFrequency: 'weekly' as const,
         priority: 0.6,
       })),
     ];
   }
   ```

2. **robots.txt 생성**:
   ```typescript
   // app/robots.ts
   import { MetadataRoute } from 'next';

   export default function robots(): MetadataRoute.Robots {
     return {
       rules: [
         {
           userAgent: '*',
           allow: '/',
           disallow: ['/api/', '/admin/', '/mypage/'],
         },
         {
           userAgent: 'Googlebot',
           allow: '/',
           disallow: ['/api/', '/admin/'],
         },
       ],
       sitemap: 'https://yerimtour.com/sitemap.xml',
     };
   }
   ```

---

### Phase 7: Lighthouse 최적화 및 테스트 (Day 4-5)
**담당**: Frontend Team + QA
**예상 시간**: 4시간

**작업 내용**:
1. **Lighthouse 측정**:
   ```bash
   # Chrome DevTools에서 Lighthouse 실행
   # 또는 CLI 사용
   npm install -g lighthouse
   lighthouse http://localhost:3000 --view
   ```

2. **주요 측정 지표**:
   - Performance: 90점 이상 목표
   - SEO: 90점 이상 목표
   - Accessibility: 90점 이상 목표
   - Best Practices: 90점 이상 목표

3. **개선 작업**:
   - FCP 개선 (폰트 로딩 최적화)
   - LCP 개선 (이미지 최적화, 코드 스플리팅)
   - CLS 개선 (이미지 크기 명시, 레이아웃 최적화)
   - TTI 개선 (JavaScript 최적화)

4. **반복 측정 및 개선**:
   - 측정 → 분석 → 개선 → 재측정
   - 90점 달성까지 반복

---

## 🔧 기술 스택 및 도구

### 성능 최적화
- **Next.js 14**: App Router, Image 컴포넌트, Metadata API
- **React 18**: Suspense, Lazy Loading
- **Webpack**: Code Splitting, Tree Shaking
- **Sharp**: 이미지 최적화 (Next.js 내장)

### 측정 도구
- **Lighthouse**: 성능 및 SEO 측정
- **Chrome DevTools**: Performance 분석
- **Webpack Bundle Analyzer**: 번들 크기 분석
- **PageSpeed Insights**: 실제 사용자 데이터

### SEO 도구
- **Google Search Console**: 검색 노출 모니터링
- **Schema.org**: Structured Data
- **Open Graph**: 소셜 미디어 공유

---

## 📊 성공 기준

### 필수 달성 지표
- [ ] Lighthouse Performance Score ≥ 90
- [ ] Lighthouse SEO Score ≥ 90
- [ ] FCP ≤ 1.8초
- [ ] LCP ≤ 2.5초
- [ ] CLS ≤ 0.1
- [ ] 모든 페이지 메타 태그 설정 완료
- [ ] Sitemap 생성 완료
- [ ] robots.txt 생성 완료

### 선택 달성 지표
- [ ] Lighthouse Accessibility Score ≥ 90
- [ ] Lighthouse Best Practices Score ≥ 90
- [ ] TTI ≤ 3.8초
- [ ] 번들 크기 30% 감소
- [ ] Service Worker 구현

---

## 🚨 주의사항

### 에러 발생 시 대응
1. **즉시 에러 해결 우선**: 다음 작업 진행 전 반드시 해결
2. **에러 로그 기록**: 에러 내용, 원인, 해결 방법 문서화
3. **팀 공유**: 동일 에러 재발 방지

### 성능 저하 방지
- 이미지 최적화 시 화질 유지 (quality: 80 이상)
- Lazy Loading 시 사용자 경험 저해 방지
- 캐싱 시 stale data 문제 고려

### SEO 주의사항
- robots.txt로 중요 페이지 차단하지 않기
- 메타 태그 중복 방지
- Canonical URL 올바르게 설정

---

## 📝 산출물

### 문서
1. **PHASE9_WORK_PLAN.md** (본 문서)
2. **PHASE9_PERFORMANCE_ANALYSIS.md** (현재 상태 분석)
3. **PHASE9_OPTIMIZATION_GUIDE.md** (최적화 가이드)
4. **PHASE9_SEO_SETUP.md** (SEO 설정 가이드)
5. **PHASE9_COMPLETION_REPORT.md** (완성 보고서)

### 코드
1. Image 컴포넌트 전환 (모든 페이지)
2. Dynamic Import 적용 (무거운 컴포넌트)
3. Metadata 설정 (모든 페이지)
4. sitemap.ts
5. robots.ts
6. next.config.js (캐싱 설정)

### 측정 결과
1. Before/After Lighthouse 스코어
2. 번들 크기 분석 리포트
3. 성능 개선 수치

---

## 📌 작업 우선순위

### High Priority (필수)
1. ✅ 현재 성능 상태 분석
2. ✅ 이미지 최적화
3. ✅ 메타 태그 및 Open Graph 설정
4. ✅ Sitemap 및 robots.txt 생성
5. ✅ Lighthouse 90점 달성

### Medium Priority (권장)
6. ✅ 코드 스플리팅
7. ✅ Lazy Loading
8. ✅ 캐싱 전략

### Low Priority (선택)
9. ⭕ Service Worker
10. ⭕ PWA 기능
11. ⭕ Advanced 캐싱

---

## 🎯 Phase 9 목표 요약

**"성능 최적화와 SEO를 통해 사용자 경험 개선 및 검색 노출 향상"**

1. **성능**: Lighthouse 90점 이상 달성으로 빠른 로딩 속도 제공
2. **SEO**: 메타 태그, sitemap으로 검색 엔진 최적화
3. **사용자 경험**: 이미지 최적화, lazy loading으로 부드러운 사용 경험
4. **유지보수**: 문서화를 통한 지속적인 최적화 가능

---

**작업 시작 준비 완료!**

다음 단계: Frontend Team이 현재 성능 상태 분석 시작
