# Frontend Team - Phase 3 작업 지시서

## 📋 작업 개요
- **담당**: Frontend Developer
- **기간**: Week 1-3 (2025-11-02 ~ 2025-11-22)
- **목표**: 핵심 기능 페이지 구현 완료

---

## 🎯 Week 1: Priority 1 페이지 (필수)

### Task 1.1: 장소 상세 페이지 구현

**경로**: `/places/[id]/page.tsx`
**소요 시간**: 2일
**우선순위**: 🔴 High

**요구사항**:
1. 장소 기본 정보 표시
   - 이름, 카테고리, 주소, 연락처
   - 운영시간, 웹사이트
   - 평균 평점, 리뷰 수

2. 이미지 갤러리
   - 메인 이미지
   - 추가 이미지 (슬라이더)

3. 지도 표시
   - 카카오맵 연동 (Full-stack 팀 협업)
   - 마커로 위치 표시

4. 리뷰 섹션
   - 리뷰 목록 (페이지네이션)
   - 평점 분포 차트
   - 리뷰 작성 버튼 (로그인 필요)

5. 액션 버튼
   - 북마크 버튼 (로그인 필요)
   - 공유 버튼
   - 사업자: 수정 버튼 (본인 장소만)

**API 엔드포인트**:
```
GET /api/places/:id
GET /api/reviews?placeId=:id&page=1&limit=10
POST /api/bookmarks (북마크 추가)
DELETE /api/bookmarks/:id (북마크 제거)
```

**컴포넌트 구조**:
```
app/places/[id]/
├── page.tsx (Server Component)
└── components/
    ├── PlaceDetail.tsx
    ├── ImageGallery.tsx
    ├── PlaceMap.tsx (Client Component)
    ├── ReviewList.tsx
    └── ActionButtons.tsx (Client Component)
```

---

### Task 1.2: 게시글 상세 페이지 구현

**경로**: `/boards/[id]/page.tsx`
**소요 시간**: 2일
**우선순위**: 🔴 High

**요구사항**:
1. 게시글 정보 표시
   - 제목, 작성자, 작성일, 조회수
   - 카테고리, 태그
   - 본문 내용 (마크다운 지원)
   - 첨부 이미지

2. 작성자 정보
   - 프로필 이미지
   - 이름, role
   - 다른 게시글 수

3. 댓글 섹션
   - 댓글 목록
   - 댓글 작성 폼 (로그인 필요)
   - 대댓글 지원

4. 액션 버튼
   - 좋아요 버튼
   - 공유 버튼
   - 작성자: 수정/삭제 버튼

**API 엔드포인트**:
```
GET /api/boards/:id
GET /api/comments?boardId=:id
POST /api/comments (댓글 작성)
POST /api/boards/:id/like (좋아요 토글)
PUT /api/boards/:id (수정)
DELETE /api/boards/:id (삭제)
```

**컴포넌트 구조**:
```
app/boards/[id]/
├── page.tsx (Server Component)
└── components/
    ├── BoardDetail.tsx
    ├── AuthorInfo.tsx
    ├── CommentList.tsx (Client Component)
    ├── CommentForm.tsx (Client Component)
    └── ActionButtons.tsx (Client Component)
```

---

### Task 1.3: 여행 일정 목록 페이지 구현 ⚠️ 최우선!

**경로**: `/itinerary/page.tsx`
**소요 시간**: 1일
**우선순위**: 🔴 Critical (현재 404 에러)

**요구사항**:
1. 내 여행 일정 목록 표시
   - 카드 형태로 표시
   - 제목, 기간, 지역, 썸네일
   - 상태 (계획 중, 진행 중, 완료)

2. 필터 및 정렬
   - 상태별 필터
   - 최신순/오래된순 정렬

3. 액션
   - 새 일정 만들기 버튼
   - 일정 카드 클릭 시 상세 페이지 이동

**API 엔드포인트**:
```
GET /api/itinerary (내 일정 목록)
POST /api/itinerary (새 일정 생성)
```

**컴포넌트 구조**:
```
app/itinerary/
├── page.tsx (Server Component)
└── components/
    ├── ItineraryList.tsx
    ├── ItineraryCard.tsx
    └── CreateButton.tsx (Client Component)
```

---

## 🎯 Week 2: 작성/수정 페이지

### Task 2.1: 게시글 작성 페이지 구현

**경로**: `/boards/new/page.tsx`
**소요 시간**: 2일
**우선순위**: 🔴 High

**요구사항**:
1. 게시글 작성 폼
   - 카테고리 선택 (REVIEW, TIP, QNA, FREE)
   - 제목 입력
   - 본문 입력 (텍스트 에디터)
   - 이미지 업로드 (최대 5개)
   - 태그 입력

2. 유효성 검사
   - 제목: 필수, 2-100자
   - 본문: 필수, 10자 이상
   - 이미지: 최대 5MB, jpg/png/webp

3. 작성 완료 후
   - 게시글 상세 페이지로 이동
   - Toast 메시지 표시

**사용 라이브러리**:
- React Hook Form
- Zod (유효성 검사)
- Tiptap (텍스트 에디터, 선택적)

**API 엔드포인트**:
```
POST /api/boards
POST /api/upload (이미지 업로드)
```

---

### Task 2.2: 장소 등록 페이지 구현

**경로**: `/places/new/page.tsx`
**소요 시간**: 2일
**우선순위**: 🟡 Medium
**권한**: 사업자(BUSINESS) 전용

**요구사항**:
1. 장소 등록 폼
   - 이름, 카테고리 선택
   - 주소 입력 (카카오 주소 검색 API)
   - 좌표 자동 입력
   - 연락처, 웹사이트
   - 운영시간
   - 설명
   - 이미지 업로드

2. 권한 체크
   - BUSINESS role만 접근 가능
   - 미인증 시 로그인 페이지 이동

**API 엔드포인트**:
```
POST /api/places
POST /api/upload
```

---

### Task 2.3: 여행 일정 생성 페이지 구현

**경로**: `/itinerary/new/page.tsx`
**소요 시간**: 1일
**우선순위**: 🟡 Medium

**요구사항**:
1. 일정 생성 폼
   - 제목 입력
   - 기간 선택 (시작일~종료일)
   - 지역 선택
   - 설명 (선택)

2. 생성 완료 후
   - 일정 상세 페이지로 이동
   - 장소 추가 모드

**API 엔드포인트**:
```
POST /api/itinerary
```

---

## 🎯 Week 3: 마이페이지 & 검색

### Task 3.1: 마이페이지 구현

**경로**: `/my-page/page.tsx`
**소요 시간**: 3일
**우선순위**: 🟡 Medium

**요구사항**:
1. 프로필 섹션
   - 프로필 이미지
   - 이름, 이메일
   - 가입일
   - 수정 버튼

2. 활동 통계
   - 작성한 리뷰 수
   - 작성한 게시글 수
   - 북마크 수
   - 좋아요 받은 수

3. 탭 메뉴
   - 내 리뷰
   - 북마크
   - 내 게시글
   - 여행 일정

**API 엔드포인트**:
```
GET /api/auth/me
GET /api/reviews?userId=:id
GET /api/bookmarks
GET /api/boards?userId=:id
GET /api/itinerary
```

---

### Task 3.2: 검색 페이지 구현

**경로**: `/search/page.tsx`
**소요 시간**: 2일
**우선순위**: 🟡 Medium

**요구사항**:
1. 검색 폼
   - 키워드 입력
   - 검색 타입 선택 (장소/게시글/전체)

2. 검색 결과
   - 장소 결과
   - 게시글 결과
   - 결과 없음 UI

3. 필터
   - 카테고리별
   - 지역별
   - 정렬 (관련도/최신순)

**API 엔드포인트**:
```
GET /api/search?q=keyword&type=places
GET /api/search?q=keyword&type=boards
```

---

## 🛠️ 개발 가이드라인

### 1. 폴더 구조

```
app/
├── places/
│   ├── page.tsx
│   ├── [id]/
│   │   ├── page.tsx
│   │   └── components/
│   ├── new/
│   │   └── page.tsx
│   └── [id]/edit/
│       └── page.tsx
├── boards/
│   └── (동일한 구조)
├── itinerary/
│   └── (동일한 구조)
├── my-page/
│   ├── page.tsx
│   └── components/
└── search/
    └── page.tsx

components/
├── common/
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Textarea.tsx
│   ├── Pagination.tsx
│   └── Toast.tsx
├── place/
│   ├── PlaceCard.tsx
│   ├── PlaceDetail.tsx
│   └── PlaceForm.tsx
├── board/
│   ├── BoardCard.tsx
│   ├── BoardDetail.tsx
│   └── BoardForm.tsx
└── itinerary/
    ├── ItineraryCard.tsx
    └── ItineraryForm.tsx

lib/
├── api/
│   ├── places.ts
│   ├── boards.ts
│   ├── comments.ts
│   ├── bookmarks.ts
│   ├── reviews.ts
│   └── itinerary.ts
├── hooks/
│   ├── useAuth.ts
│   ├── usePlaces.ts
│   └── useBoards.ts
└── utils/
    ├── formatDate.ts
    └── formatNumber.ts
```

### 2. Server Component vs Client Component

**Server Component 사용 (기본)**:
- 페이지 데이터 fetching
- 정적 콘텐츠 렌더링
- SEO가 중요한 페이지

**Client Component 사용**:
- 사용자 인터랙션 (버튼 클릭, 폼 제출)
- 상태 관리가 필요한 경우
- 브라우저 API 사용 (localStorage, geolocation)
- 지도 (Kakao Maps SDK)

```typescript
// Server Component (기본)
export default async function PlaceDetailPage({ params }: { params: { id: string } }) {
  const place = await fetch(`${API_URL}/places/${params.id}`).then(res => res.json())

  return (
    <div>
      <PlaceDetail place={place} />
      <ActionButtons placeId={place.id} /> {/* Client Component */}
    </div>
  )
}

// Client Component
'use client'

export function ActionButtons({ placeId }: { placeId: string }) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  // ...
}
```

### 3. API 연동

```typescript
// lib/api/places.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export const placesApi = {
  getPlace: async (id: string) => {
    const res = await fetch(`${API_URL}/api/places/${id}`)
    if (!res.ok) throw new Error('Failed to fetch place')
    return res.json()
  },

  createPlace: async (data: CreatePlaceDto) => {
    const res = await fetch(`${API_URL}/api/places`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create place')
    return res.json()
  },
}
```

### 4. 인증 처리

```typescript
// middleware.ts (프로젝트 루트)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value

  // 보호된 라우트
  const protectedRoutes = [
    '/boards/new',
    '/places/new',
    '/itinerary',
    '/my-page',
  ]

  const isProtected = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/boards/:path*',
    '/places/:path*',
    '/itinerary/:path*',
    '/my-page/:path*',
  ],
}
```

### 5. 폼 처리 (React Hook Form + Zod)

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const boardSchema = z.object({
  category: z.enum(['REVIEW', 'TIP', 'QNA', 'FREE']),
  title: z.string().min(2).max(100),
  content: z.string().min(10),
  images: z.array(z.string()).max(5).optional(),
  tags: z.array(z.string()).optional(),
})

type BoardFormData = z.infer<typeof boardSchema>

export function BoardForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BoardFormData>({
    resolver: zodResolver(boardSchema),
  })

  const onSubmit = async (data: BoardFormData) => {
    const res = await boardsApi.create(data)
    router.push(`/boards/${res.id}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select {...register('category')}>
        <option value="REVIEW">여행 후기</option>
        <option value="TIP">여행 팁</option>
        <option value="QNA">질문/답변</option>
        <option value="FREE">자유게시판</option>
      </select>
      {errors.category && <span>{errors.category.message}</span>}

      <input {...register('title')} placeholder="제목" />
      {errors.title && <span>{errors.title.message}</span>}

      <textarea {...register('content')} placeholder="내용" />
      {errors.content && <span>{errors.content.message}</span>}

      <button type="submit">작성하기</button>
    </form>
  )
}
```

---

## ✅ 작업 완료 체크리스트

각 페이지 완성 시 다음을 확인하세요:

### 기능
- [ ] API 연동 정상 작동
- [ ] 로딩 상태 표시
- [ ] 에러 처리
- [ ] 인증/권한 체크
- [ ] 폼 유효성 검사

### UI/UX
- [ ] 반응형 디자인 (모바일/태블릿/데스크톱)
- [ ] 일관된 디자인 (Tailwind CSS)
- [ ] 호버/포커스 상태
- [ ] 접근성 (ARIA 라벨, 키보드 네비게이션)

### 성능
- [ ] 이미지 최적화 (Next.js Image 컴포넌트)
- [ ] 코드 스플리팅
- [ ] Lazy loading

### 문서화
- [ ] 컴포넌트 주석
- [ ] API 함수 JSDoc
- [ ] README 업데이트

---

## 🚀 시작하기

1. **최신 코드 pull**
   ```bash
   cd /Users/chacha4164/Desktop/cursor/travel/frontend
   git pull origin main
   ```

2. **의존성 확인**
   ```bash
   npm install
   ```

3. **필요한 패키지 설치**
   ```bash
   npm install react-hook-form @hookform/resolvers zod
   npm install @tiptap/react @tiptap/starter-kit  # 텍스트 에디터 (선택)
   npm install react-datepicker  # 날짜 선택 (선택)
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```

5. **Task 1.3부터 시작!** (여행 일정 페이지 - 404 해결)

---

**문의사항**: PO에게 질문
**작업 시작일**: 2025-11-02
**목표 완료일**: 2025-11-22
