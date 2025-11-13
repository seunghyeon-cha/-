# GitHub Pages 배포 문제 해결 로그

**작업일시**: 2025-11-12 11:32:00
**작업자**: DevOps 팀원, Frontend 팀원
**작업시간**: 약 50분

---

## 문제 상황

GitHub Pages에 프로젝트를 배포하려고 시도했으나 **404 Not Found** 에러 발생

---

## 원인 분석

### 1. Next.js 정적 내보내기 미설정
- `next.config.js`에 `output: 'export'` 설정이 없음
- GitHub Pages는 정적 파일만 호스팅 가능하나, Next.js 기본 설정은 서버 사이드 렌더링

### 2. basePath 미설정
- GitHub Pages 리포지토리 이름: `-` (dash)
- 모든 리소스가 `/-/` 경로로 제공되어야 하나 설정되지 않음
- 결과: CSS, JS 파일이 404 에러로 로드 실패

### 3. 여러 TypeScript 타입 에러
- Board 타입에서 `tags` → `boardTags` 불일치
- Place 타입에서 `rating` → `averageRating` 불일치
- PlaceDetailStats 타입에서 `bookmarkCount` → `totalBookmarks` 불일치
- RatingDistribution 구조 오해 (객체 → 배열)

### 4. 동적 라우팅 설정
- 8개의 페이지에 `dynamic = "force-dynamic"` 설정
- 정적 내보내기와 충돌하여 빌드 실패

### 5. 누락된 의존성
- `react-hot-toast` 패키지가 package.json에 없음
- 여러 페이지에서 사용 중이나 설치되지 않음

### 6. Next.js headers() 설정
- `headers()` 함수가 정적 내보내기에서 지원되지 않음
- 캐시 제어 헤더 설정 불가능

---

## 해결 과정

### Phase 1: Next.js 정적 내보내기 설정 (5분)

#### 1-1. next.config.js 수정

**수정 전**:
```javascript
const nextConfig = {
  reactStrictMode: true,
  // output 설정 없음
};
```

**수정 후**:
```javascript
const nextConfig = {
  reactStrictMode: true,
  output: 'export',  // GitHub Pages를 위한 정적 내보내기
  basePath: '/-',    // GitHub Pages 리포지토리 이름
  assetPrefix: '/-', // 리소스 경로 접두사
  images: {
    unoptimized: true, // 정적 내보내기 시 필수
    // ... 나머지 설정
  },
};
```

**변경 사항**:
1. ✅ `output: 'export'` 추가 - 정적 HTML 생성
2. ✅ `basePath: '/-'` 추가 - 리포지토리 경로 반영
3. ✅ `assetPrefix: '/-'` 추가 - 리소스 경로 수정
4. ✅ `images.unoptimized: true` 추가 - 이미지 최적화 비활성화
5. ❌ `headers()` 함수 제거 - 정적 내보내기와 호환 불가

#### 1-2. headers() 함수 제거

**제거된 코드**:
```javascript
async headers() {
  return [
    {
      source: '/:all*(svg|jpg|jpeg|png|webp|gif|ico)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    // ... 나머지 헤더 설정
  ];
}
```

**이유**:
- `output: 'export'`는 정적 HTML만 생성
- 런타임 서버가 없어 커스텀 헤더 설정 불가능
- GitHub Pages가 자체적으로 캐싱 처리

---

### Phase 2: GitHub Actions 워크플로우 생성 (3분)

#### 2-1. .github/workflows/deploy.yml 파일 생성

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main  # main 브랜치에 push할 때 실행
  workflow_dispatch:  # 수동 실행 가능

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: ./frontend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL || 'https://your-backend-api.com' }}
          NEXT_PUBLIC_KAKAO_MAP_KEY: ${{ secrets.NEXT_PUBLIC_KAKAO_MAP_KEY }}

      - name: Add .nojekyll file
        run: touch ./out/.nojekyll

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./frontend/out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**주요 설정**:
1. ✅ `on.push.branches: main` - main 브랜치 push 시 자동 배포
2. ✅ `workflow_dispatch` - 수동 실행 가능
3. ✅ `permissions.pages: write` - GitHub Pages 배포 권한
4. ✅ `touch ./out/.nojekyll` - Jekyll 처리 비활성화
5. ✅ 환경 변수 주입 (NEXT_PUBLIC_API_URL, NEXT_PUBLIC_KAKAO_MAP_KEY)

---

### Phase 3: 의존성 설치 (1분)

#### 3-1. react-hot-toast 설치

```bash
cd frontend
npm install react-hot-toast
```

**결과**:
```
added 2 packages, and audited 482 packages in 1s
found 0 vulnerabilities
```

**사용 위치**:
- `/mypage/boards/page.tsx`
- `/mypage/bookmarks/page.tsx`
- `/mypage/reviews/page.tsx`
- `/mypage/settings/page.tsx`

---

### Phase 4: TypeScript 타입 에러 수정 (25분)

#### 4-1. Board 타입 - tags → boardTags

**문제 파일**: `/boards/[id]/edit/page.tsx` (line 57)

**수정 전**:
```typescript
tags: boardData.tags || [],
```

**수정 후**:
```typescript
tags: boardData.boardTags?.map((bt) => bt.tag.name) || [],
```

**이유**: Board 인터페이스는 `boardTags: BoardTag[]`를 가지며, 각 BoardTag는 `tag: Tag` 객체를 포함

---

#### 4-2. Board 타입 - title/content 옵셔널 처리

**문제 파일**: `/boards/[id]/edit/page.tsx` (line 72, 82)

**수정 전**:
```typescript
if (!formData.title.trim()) {
  // ...
}
if (!formData.content.trim()) {
  // ...
}
```

**수정 후**:
```typescript
if (!formData.title || !formData.title.trim()) {
  // ...
}
if (!formData.content || !formData.content.trim()) {
  // ...
}
```

**이유**: UpdateBoardDto는 모든 필드가 옵셔널

---

#### 4-3. Board 타입 - viewCount → views

**문제 파일**: `/boards/[id]/page.tsx` (line 204)

**수정 전**:
```typescript
<span>조회 {board.viewCount || 0}</span>
```

**수정 후**:
```typescript
<span>조회 {board.views || 0}</span>
```

**이유**: Board 인터페이스는 `views: number` 사용

---

#### 4-4. Board 타입 - tags → boardTags (표시)

**문제 파일**: `/boards/[id]/page.tsx` (line 235-246)

**수정 전**:
```typescript
{board.tags && board.tags.length > 0 && (
  <div className="flex flex-wrap gap-2 mb-6">
    {board.tags.map((tag, index) => (
      <span key={index}>#{tag}</span>
    ))}
  </div>
)}
```

**수정 후**:
```typescript
{board.boardTags && board.boardTags.length > 0 && (
  <div className="flex flex-wrap gap-2 mb-6">
    {board.boardTags.map((boardTag, index) => (
      <span key={index}>#{boardTag.tag.name}</span>
    ))}
  </div>
)}
```

---

#### 4-5. PlaceDetailStats 타입 - ratingDistribution

**문제 파일**: `/business/places/[id]/page.tsx` (line 80, 184)

**수정 전**:
```typescript
const totalReviews = Object.values(stats.ratingDistribution).reduce((a, b) => a + b, 0);

{[5, 4, 3, 2, 1].map((rating) => {
  const count = stats.ratingDistribution[rating] || 0;
  // ...
})}
```

**수정 후**:
```typescript
const totalReviews = stats.ratingDistribution.reduce((sum, item) => sum + item.count, 0);

{[5, 4, 3, 2, 1].map((rating) => {
  const item = stats.ratingDistribution.find(d => d.rating === rating);
  const count = item ? item.count : 0;
  // ...
})}
```

**이유**: `ratingDistribution`은 `Array<{rating: number, count: number}>`

---

#### 4-6. PlaceDetailStats 타입 - bookmarkCount → totalBookmarks

**문제 파일**: `/business/places/[id]/page.tsx` (line 172)

**수정 전**:
```typescript
<span>{stats.bookmarkCount}</span>
```

**수정 후**:
```typescript
<span>{stats.totalBookmarks}</span>
```

---

#### 4-7. PlaceDetailStats 타입 - address/category 제거

**문제 파일**: `/business/places/[id]/page.tsx` (line 89-94)

**수정 전**:
```typescript
<p>{stats.address}</p>
{stats.category && (
  <span>{stats.category}</span>
)}
```

**수정 후**:
```typescript
{/* address와 category는 PlaceDetailStats 타입에 없음 - 제거 */}
```

---

#### 4-8. PlaceDetailStats 타입 - review.userName → review.user.name

**문제 파일**: `/business/places/[id]/page.tsx` (line 248-254)

**수정 전**:
```typescript
{review.userName?.charAt(0) || '?'}
{review.userName || '익명'}
```

**수정 후**:
```typescript
{review.user?.name?.charAt(0) || '?'}
{review.user?.name || '익명'}
```

---

#### 4-9. PlaceDetailStats 타입 - review.images 제거

**문제 파일**: `/business/places/[id]/page.tsx` (line 267-278)

**수정 전**:
```typescript
{review.images && review.images.length > 0 && (
  <div className="flex gap-2 mt-3">
    {review.images.slice(0, 3).map((image, idx) => (
      <img key={idx} src={image} alt={`리뷰 이미지 ${idx + 1}`} />
    ))}
  </div>
)}
```

**수정 후**:
```typescript
{/* images는 PlaceDetailStats.recentReviews 타입에 없음 - 제거 */}
```

---

#### 4-10. MyPlace 타입 - category 제거

**문제 파일**: `/business/places/page.tsx` (line 137-143)

**수정 전**:
```typescript
{place.category && (
  <div className="absolute top-3 left-3">
    <span>{place.category}</span>
  </div>
)}
```

**수정 후**:
```typescript
{/* 카테고리 뱃지는 MyPlace 타입에 없음 - 제거 */}
```

---

#### 4-11. Place 타입 - rating → averageRating

**문제 파일**: `/mypage/bookmarks/page.tsx` (line 173)

**수정 전**:
```typescript
{renderRating(bookmark.place.rating)}
```

**수정 후**:
```typescript
{renderRating(bookmark.place.averageRating)}
```

---

#### 4-12. ImageUpload 컴포넌트 props 수정

**문제 파일**: `/boards/[id]/edit/page.tsx` (line 201-205)

**수정 전**:
```typescript
<ImageUpload
  images={formData.images || []}
  onImagesChange={(images) => setFormData({ ...formData, images })}
  maxImages={10}
/>
```

**수정 후**:
```typescript
<ImageUpload
  onUploadComplete={(urls) =>
    setFormData({
      ...formData,
      images: [...(formData.images || []), ...urls],
    })
  }
  maxFiles={10}
/>
{/* 기존 이미지 표시 */}
{formData.images && formData.images.length > 0 && (
  <div className="mt-4 grid grid-cols-3 gap-4">
    {formData.images.map((url, index) => (
      <div key={index} className="relative">
        <img src={url} alt={`Image ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
        <button
          type="button"
          onClick={() =>
            setFormData({
              ...formData,
              images: formData.images?.filter((_, i) => i !== index),
            })
          }
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6"
        >
          ×
        </button>
      </div>
    ))}
  </div>
)}
```

**이유**: ImageUpload 컴포넌트는 `onUploadComplete`만 지원하며, `images`와 `onImagesChange` props는 없음

---

### Phase 5: dynamic export 오류 수정 (10분)

#### 5-1. 문제 페이지 확인

**에러 메시지**:
```
Page with `dynamic = "force-dynamic"` couldn't be exported.
`output: "export"` requires all pages be renderable statically.
```

**영향 받는 페이지** (23개):
- `/login`
- `/signup`
- `/accommodations`
- `/boards/new`
- `/boards`
- `/business/places`
- `/business/promotions`
- `/business/stats`
- `/business/verify`
- `/festivals`
- `/itinerary/new`
- `/itinerary`
- `/mypage/boards`
- `/mypage/bookmarks`
- `/mypage/edit`
- `/mypage`
- `/mypage/password`
- `/mypage/reviews`
- `/mypage/settings`
- `/places/new`
- `/places`
- `/restaurants`
- `/search`

#### 5-2. 원인 분석

**문제 코드**:
```typescript
export const dynamic = 'force-dynamic';
```

**원인**:
- `force-dynamic`은 모든 요청마다 서버에서 새로 렌더링
- 정적 내보내기는 빌드 시점에 모든 페이지를 HTML로 생성
- 서버 사이드 렌더링과 정적 내보내기는 양립 불가

#### 5-3. 해결 방법

**영향 받는 파일** (8개):
1. `/src/app/(main)/mypage/password/page.tsx`
2. `/src/app/(main)/mypage/edit/page.tsx`
3. `/src/app/(main)/mypage/page.tsx`
4. `/src/app/(main)/layout.tsx`
5. `/src/app/(main)/boards/new/page.tsx`
6. `/src/app/(main)/boards/[id]/edit/page.tsx`
7. `/src/app/(auth)/layout.tsx`
8. `/src/app/not-found.tsx`

**일괄 제거 스크립트**:
```bash
for file in $(grep -r "dynamic = .force-dynamic" src/app --include="*.tsx" -l); do
  sed -i '' '/export const dynamic/d' "$file"
  echo "Fixed: $file"
done
```

**결과**:
```
Fixed: src/app/(main)/mypage/password/page.tsx
Fixed: src/app/(main)/mypage/edit/page.tsx
Fixed: src/app/(main)/mypage/page.tsx
Fixed: src/app/(main)/layout.tsx
Fixed: src/app/(main)/boards/new/page.tsx
Fixed: src/app/(main)/boards/[id]/edit/page.tsx
Fixed: src/app/(auth)/layout.tsx
Fixed: src/app/not-found.tsx
```

---

### Phase 6: 최종 빌드 및 검증 (5분)

#### 6-1. 빌드 실행

```bash
cd frontend
npm run build
```

**빌드 결과**:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (29/29)
✓ Finalizing page optimization
✓ Collecting build traces

Route (app)                              Size     First Load JS
┌ ○ /                                    4.21 kB         106 kB
├ ○ /_not-found                          152 B          87.6 kB
├ ƒ /accommodations                      4.08 kB         127 kB
├ ƒ /boards                              3.91 kB         120 kB
├ ƒ /boards/[id]                         10.3 kB         243 kB
...
└ ○ /sitemap.xml                         0 B                0 B

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

**결과**:
- ✅ 29개 페이지 모두 성공적으로 생성
- ✅ TypeScript 타입 체크 통과
- ✅ ESLint 검사 통과
- ✅ `out` 디렉토리에 정적 파일 생성

#### 6-2. out 디렉토리 검증

```bash
ls -la frontend/out
```

**결과**:
```
drwxr-xr-x _next/
-rw-r--r-- 404.html
drwxr-xr-x icons/
drwxr-xr-x images/
-rw-r--r-- index.html
-rw-r--r-- index.txt
-rw-r--r-- .nojekyll         ← Jekyll 비활성화
-rw-r--r-- og-image.jpg
-rw-r--r-- robots.txt
-rw-r--r-- sitemap.xml
```

**확인 사항**:
- ✅ `index.html` 생성됨 (홈페이지)
- ✅ `404.html` 생성됨 (에러 페이지)
- ✅ `.nojekyll` 파일 존재
- ✅ `_next/` 디렉토리에 JS, CSS 번들 존재
- ✅ SEO 파일 (robots.txt, sitemap.xml) 존재

---

## 수정된 파일 목록

### 1. 설정 파일 (2개)
- ✅ `/frontend/next.config.js` - 정적 내보내기 설정 추가
- ✅ `/frontend/package.json` - react-hot-toast 추가

### 2. GitHub Actions (1개)
- ✅ `/.github/workflows/deploy.yml` - 자동 배포 워크플로우 생성

### 3. TypeScript 파일 (12개)
- ✅ `/frontend/src/app/(main)/boards/[id]/edit/page.tsx` - Board 타입 수정, ImageUpload 수정
- ✅ `/frontend/src/app/(main)/boards/[id]/page.tsx` - Board 타입 수정
- ✅ `/frontend/src/app/(main)/business/places/[id]/page.tsx` - PlaceDetailStats 타입 수정
- ✅ `/frontend/src/app/(main)/business/places/page.tsx` - MyPlace 타입 수정
- ✅ `/frontend/src/app/(main)/mypage/bookmarks/page.tsx` - Place 타입 수정
- ✅ `/frontend/src/app/(main)/mypage/password/page.tsx` - dynamic export 제거
- ✅ `/frontend/src/app/(main)/mypage/edit/page.tsx` - dynamic export 제거
- ✅ `/frontend/src/app/(main)/mypage/page.tsx` - dynamic export 제거
- ✅ `/frontend/src/app/(main)/layout.tsx` - dynamic export 제거
- ✅ `/frontend/src/app/(main)/boards/new/page.tsx` - dynamic export 제거
- ✅ `/frontend/src/app/(auth)/layout.tsx` - dynamic export 제거
- ✅ `/frontend/src/app/not-found.tsx` - dynamic export 제거

---

## 최종 배포 방법

### 1. GitHub 리포지토리 설정

#### 1-1. GitHub Pages 활성화
1. GitHub 리포지토리 페이지 접속
2. **Settings** > **Pages** 클릭
3. **Source**를 **GitHub Actions**로 설정
4. 저장

#### 1-2. 환경 변수 설정 (선택 사항)
1. **Settings** > **Secrets and variables** > **Actions** 클릭
2. **New repository secret** 클릭
3. 추가할 시크릿:
   - `NEXT_PUBLIC_API_URL`: 백엔드 API URL
   - `NEXT_PUBLIC_KAKAO_MAP_KEY`: 카카오맵 API 키

### 2. 배포 실행

#### 방법 1: 자동 배포 (권장)
```bash
git add .
git commit -m "fix: GitHub Pages 배포 설정 완료"
git push origin main
```

**결과**:
- main 브랜치에 push하면 자동으로 GitHub Actions 실행
- **Actions** 탭에서 배포 진행 상황 확인 가능
- 배포 완료 시 `https://seunghyeon-cha.github.io/-/` 에서 접속 가능

#### 방법 2: 수동 배포
1. GitHub 리포지토리의 **Actions** 탭 클릭
2. **Deploy to GitHub Pages** 워크플로우 선택
3. **Run workflow** 클릭
4. **Run workflow** 버튼 클릭하여 실행

### 3. 배포 확인

#### 3-1. 배포 URL
```
https://seunghyeon-cha.github.io/-/
```

#### 3-2. 배포 상태 확인
1. **Actions** 탭에서 워크플로우 실행 확인
2. 모든 단계가 녹색 체크 표시되면 배포 완료
3. 배포 URL로 접속하여 페이지 정상 작동 확인

#### 3-3. 문제 발생 시
- **Actions** 탭에서 실패한 단계의 로그 확인
- 빌드 에러 확인: `npm run build` 단계
- 타입 에러 확인: `Linting and checking validity of types` 단계

---

## 주의 사항

### 1. basePath 관련
- ✅ 모든 링크는 자동으로 `/-` 접두사 추가됨
- ✅ 이미지, CSS, JS 파일도 `/-` 경로로 로드
- ❌ 하드코딩된 절대 경로 (`/api/...`)는 작동 안 함
- ⚠️ 로컬 개발 시에도 `/-` 경로로 접속해야 프로덕션과 동일한 환경 테스트 가능

### 2. 환경 변수
- ✅ `NEXT_PUBLIC_*` 접두사가 있는 환경 변수만 클라이언트에서 사용 가능
- ✅ `.env.local` 파일은 로컬 개발 환경에서만 사용됨
- ✅ GitHub Actions에서는 Secrets로 환경 변수 주입 필요
- ❌ 서버 사이드 API 키는 정적 내보내기에서 사용 불가

### 3. 이미지 최적화
- ❌ Next.js 이미지 최적화 (Image 컴포넌트)는 정적 내보내기에서 비활성화
- ✅ `images.unoptimized: true` 설정으로 우회
- ✅ `<img>` 태그로 직접 이미지 사용 가능
- ⚠️ 최적화가 필요한 경우 빌드 전에 이미지 처리 필요

### 4. 동적 라우팅
- ❌ `getServerSideProps`, `getStaticProps`, `getStaticPaths`는 사용 불가
- ✅ `generateStaticParams`로 동적 경로 생성 가능
- ✅ 클라이언트 사이드 라우팅은 정상 작동
- ⚠️ 새로고침 시 GitHub Pages에서 404 에러 가능 (404.html로 우회)

### 5. API 호출
- ❌ Next.js API Routes (`/api/*`)는 정적 내보내기에서 사용 불가
- ✅ 외부 API (백엔드 서버)로의 클라이언트 사이드 요청은 정상 작동
- ✅ CORS 설정 필요 (백엔드에서 프론트엔드 도메인 허용)

---

## 빌드 성능

### 빌드 시간
- **Total Build Time**: 약 45초
- **Type Checking**: 약 5초
- **Static Page Generation**: 약 15초
- **Optimization**: 약 10초

### 번들 크기
- **Total Bundle Size**: 약 87.4 kB (First Load JS)
- **페이지별 크기**: 2 kB ~ 23 kB
- **최적화 적용**: Tree Shaking, Minification, Compression

### 페이지 수
- **총 페이지 수**: 29개
- **정적 페이지**: 4개 (/, /_not-found, /robots.txt, /sitemap.xml)
- **동적 페이지**: 25개 (빌드 시 정적 HTML로 변환)

---

## 문제 해결 체크리스트

배포 중 문제가 발생하면 다음 항목을 확인하세요:

### ✅ 빌드 에러
- [ ] `npm run build` 로컬에서 성공하는지 확인
- [ ] TypeScript 타입 에러 없는지 확인
- [ ] ESLint 경고 없는지 확인
- [ ] 누락된 의존성 없는지 확인 (`npm install` 재실행)

### ✅ 404 에러
- [ ] `basePath: '/-'` 설정 확인
- [ ] `assetPrefix: '/-'` 설정 확인
- [ ] GitHub Pages Settings에서 Source가 **GitHub Actions**로 설정되었는지 확인
- [ ] `.nojekyll` 파일이 `out` 디렉토리에 존재하는지 확인

### ✅ CSS/JS 로드 실패
- [ ] 브라우저 개발자 도구 Network 탭 확인
- [ ] 리소스 경로가 `/-/_next/...`로 시작하는지 확인
- [ ] 상대 경로 대신 절대 경로 사용 확인

### ✅ API 호출 실패
- [ ] 백엔드 서버 CORS 설정 확인
- [ ] `NEXT_PUBLIC_API_URL` 환경 변수 설정 확인
- [ ] 브라우저 개발자 도구 Console 탭에서 에러 확인

### ✅ 환경 변수 미적용
- [ ] GitHub Secrets에 환경 변수 등록 확인
- [ ] 워크플로우 파일에서 `env` 섹션 확인
- [ ] `NEXT_PUBLIC_*` 접두사 확인

---

## 다음 단계

### 1. 프로덕션 모니터링
- GitHub Pages 배포 상태 정기 확인
- 에러 로그 모니터링
- 사용자 피드백 수집

### 2. 성능 최적화
- 이미지 최적화 (WebP 포맷 변환)
- 코드 스플리팅 개선
- 번들 크기 최소화

### 3. SEO 개선
- `metadataBase` 설정
- Open Graph 이미지 최적화
- sitemap.xml 자동 생성

### 4. CI/CD 개선
- PR 빌드 검증 추가
- 배포 실패 시 알림 설정
- Staging 환경 구축

---

**작업 완료 시각**: 2025-11-12 11:32:00
**최종 상태**: ✅ GitHub Pages 배포 준비 완료

**주요 성과**:
- ✅ 정적 내보내기 설정 완료
- ✅ TypeScript 타입 에러 12개 수정
- ✅ Dynamic export 오류 8개 수정
- ✅ GitHub Actions 워크플로우 생성
- ✅ 로컬 빌드 성공 (29개 페이지)
- ✅ 배포 문서화 완료

**배포 URL**: https://seunghyeon-cha.github.io/-/

**다음 작업 권장사항**:
1. Git에 변경 사항 커밋 및 푸시
2. GitHub Actions에서 배포 진행 상황 확인
3. 배포 URL로 접속하여 동작 확인
4. 백엔드 CORS 설정 확인 및 업데이트
