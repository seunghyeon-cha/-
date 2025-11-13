# Phase 7 Backend API 검토 보고서

**작성일**: 2025-11-09
**담당**: Backend Development Team
**검토자**: Backend Developer

---

## 📋 검토 내용

Phase 7 마이페이지 기능 구현을 위한 Backend API 확인 및 검토

### 필요한 기능
1. 내가 쓴 글 목록 조회
2. 내가 쓴 리뷰 목록 조회
3. 북마크 목록 조회
4. 알림 설정 조회/수정

---

## ✅ 1. 내가 쓴 글 (My Boards) API

### 상태: ✅ **완벽하게 구현됨**

### API 엔드포인트
```typescript
GET /api/api/users/me/boards
```

### 프론트엔드 사용법
```typescript
import { getMyBoards } from '@/lib/api/user';

// 기본 사용
const response = await getMyBoards();

// 파라미터 사용 (페이지네이션, 정렬)
const response = await getMyBoards({
  page: 1,
  limit: 10,
  sort: 'latest' // 'latest' | 'popular'
});
```

### 응답 형식
```typescript
interface BoardListResponse {
  boards: Board[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface Board {
  id: string;
  userId: string;
  category: BoardCategory;
  title: string;
  content: string;
  images: string[];
  views: number;
  likesCount: number;
  commentsCount: number;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
  boardTags?: BoardTag[];
  _count?: {
    comments: number;
    boardLikes: number;
  };
}
```

### 지원 기능
- ✅ 페이지네이션 (`page`, `limit`)
- ✅ 정렬 (`sort: 'latest' | 'popular'`)
- ✅ 게시글 상세 정보 포함
- ✅ 통계 정보 포함 (조회수, 좋아요, 댓글 수)

### 추가 API (게시글 관리)
```typescript
// 게시글 수정
import { updateBoard } from '@/lib/api/boards';
await updateBoard(boardId, {
  title: '수정된 제목',
  content: '수정된 내용',
  images: ['image1.jpg'],
  tags: ['태그1', '태그2']
});

// 게시글 삭제
import { deleteBoard } from '@/lib/api/boards';
await deleteBoard(boardId);
```

### Frontend 팀에 전달 사항
- `getMyBoards(params)` 함수 사용
- 페이지네이션 지원됨 (기본 10개씩)
- 정렬 옵션: `latest`, `popular`
- 검색 기능은 현재 미지원 (향후 추가 가능)

---

## ✅ 2. 내가 쓴 리뷰 (My Reviews) API

### 상태: ✅ **완벽하게 구현됨**

### API 엔드포인트
```typescript
GET /api/api/users/me/reviews
```

### 프론트엔드 사용법
```typescript
import { getMyReviews } from '@/lib/api/user';

// 기본 사용
const response = await getMyReviews();

// 파라미터 사용
const response = await getMyReviews({
  page: 1,
  limit: 10,
  sort: 'latest' // 'latest' | 'popular'
});
```

### 응답 형식
```typescript
interface ReviewListResponse {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface Review {
  id: string;
  placeId: string;
  userId: string;
  rating: number;       // 1-5
  content: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    profileImage?: string;
  };
  _count?: {
    likes: number;
  };
}
```

### 지원 기능
- ✅ 페이지네이션 (`page`, `limit`)
- ✅ 정렬 (`sort: 'latest' | 'popular'`)
- ✅ 리뷰 상세 정보 포함
- ✅ 평점 정보 포함 (1-5점)
- ✅ 좋아요 수 포함

### 추가 API (리뷰 관리)
```typescript
// 리뷰 수정
import { updateReview } from '@/lib/api/reviews';
await updateReview(reviewId, {
  rating: 5,
  content: '수정된 리뷰',
  images: ['image1.jpg']
});

// 리뷰 삭제
import { deleteReview } from '@/lib/api/reviews';
await deleteReview(reviewId);
```

### Frontend 팀에 전달 사항
- `getMyReviews(params)` 함수 사용
- 페이지네이션 지원됨 (기본 10개씩)
- 리뷰에 장소 정보는 포함되지 않음 (별도 조회 필요)
- 평점은 1-5 범위의 숫자

---

## ✅ 3. 북마크 (Bookmarks) API

### 상태: ✅ **완벽하게 구현됨**

### API 엔드포인트
```typescript
GET /api/bookmarks
```

### 프론트엔드 사용법
```typescript
import { getMyBookmarks } from '@/lib/api/bookmarks';

// 기본 사용 (기본 20개씩)
const response = await getMyBookmarks();

// 페이지네이션
const response = await getMyBookmarks(1, 12); // page, limit
```

### 응답 형식
```typescript
interface BookmarksResponse {
  data: Bookmark[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface Bookmark {
  id: string;
  userId: string;
  placeId: string;
  createdAt: string;
  place: Place;  // 장소 정보 포함됨!
}

interface Place {
  id: string;
  name: string;
  address: string;
  category: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  rating?: number;
  // ... 기타 장소 정보
}
```

### 지원 기능
- ✅ 페이지네이션 (`page`, `limit`)
- ✅ **장소 정보 자동 포함** (중요!)
- ✅ 생성일 정보 포함 (정렬 가능)

### 추가 API (북마크 관리)
```typescript
// 북마크 추가
import { createBookmark } from '@/lib/api/bookmarks';
await createBookmark(placeId);

// 북마크 삭제
import { deleteBookmark } from '@/lib/api/bookmarks';
await deleteBookmark(bookmarkId);

// 북마크 여부 확인
import { checkBookmark } from '@/lib/api/bookmarks';
const { bookmarked, bookmarkId } = await checkBookmark(placeId);
```

### Frontend 팀에 전달 사항
- `getMyBookmarks(page, limit)` 함수 사용
- **장소 정보가 자동으로 포함됨** (별도 조회 불필요)
- 기본 20개씩, 그리드 레이아웃에는 12개 추천
- 정렬은 최신순 (createdAt 기준)
- 필터링 (지역, 카테고리)은 프론트엔드에서 처리

---

## ❌ 4. 알림 설정 (Notification Settings) API

### 상태: ❌ **미구현**

### 현재 상황
- 백엔드에 알림 설정 관련 API 없음
- 알림 시스템 자체가 아직 구현되지 않음

### 프론트엔드 구현 방안

#### 옵션 A: 로컬 스토리지 사용 (추천)
프론트엔드에서만 UI 구현하고, 설정은 로컬 스토리지에 저장

```typescript
// 설정 저장 예시
const notificationSettings = {
  pushEnabled: true,
  emailEnabled: false,
  notifications: {
    boardComment: true,
    boardLike: true,
    reviewLike: true,
    systemNotice: true
  }
};

localStorage.setItem('notification_settings', JSON.stringify(notificationSettings));
```

**장점**:
- 즉시 구현 가능
- 백엔드 작업 불필요
- 사용자 경험 제공 가능

**단점**:
- 실제 알림 기능은 작동하지 않음
- 여러 기기 간 동기화 불가

#### 옵션 B: API 스펙만 정의 (향후 대비)
프론트엔드에서 API 함수만 정의해두고, 실제 호출은 mock 처리

```typescript
// /src/lib/api/notifications.ts (신규 생성)
export const getNotificationSettings = async () => {
  // 임시로 로컬 스토리지 사용
  const stored = localStorage.getItem('notification_settings');
  return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
};

export const updateNotificationSettings = async (settings: any) => {
  // 임시로 로컬 스토리지에 저장
  localStorage.setItem('notification_settings', JSON.stringify(settings));
  return settings;
};
```

**장점**:
- API 인터페이스 준비됨
- 향후 백엔드 구현 시 쉽게 연동
- 코드 구조 일관성 유지

**단점**:
- 초기 작업이 조금 더 필요

### 권장 사항
**옵션 B 추천** - 향후 확장성을 위해 API 인터페이스 구조로 구현

### 백엔드 향후 추가 예정 API (참고용)
```typescript
// 알림 설정 조회
GET /api/users/me/notification-settings

// 알림 설정 업데이트
PUT /api/users/me/notification-settings
{
  pushEnabled: boolean,
  emailEnabled: boolean,
  notifications: {
    boardComment: boolean,
    boardLike: boolean,
    reviewLike: boolean,
    systemNotice: boolean
  }
}
```

---

## 📊 API 검토 결과 요약

| 기능 | API 상태 | 엔드포인트 | 페이지네이션 | 정렬 | 필터 | 비고 |
|------|----------|-----------|-------------|------|------|------|
| 내가 쓴 글 | ✅ 완벽 | `/api/api/users/me/boards` | ✅ | ✅ | ❌ | 검색 미지원 |
| 내가 쓴 리뷰 | ✅ 완벽 | `/api/api/users/me/reviews` | ✅ | ✅ | ❌ | 장소 정보 미포함 |
| 북마크 | ✅ 완벽 | `/api/bookmarks` | ✅ | ❌ | ❌ | 장소 정보 포함 |
| 알림 설정 | ❌ 없음 | N/A | N/A | N/A | N/A | 로컬 스토리지 사용 |

---

## 🎯 Frontend 팀에 전달 사항

### 1. API 사용법

#### 내가 쓴 글
```typescript
import { getMyBoards } from '@/lib/api/user';
import { updateBoard, deleteBoard } from '@/lib/api/boards';

// 조회
const { boards, pagination } = await getMyBoards({ page: 1, limit: 10, sort: 'latest' });

// 수정
await updateBoard(boardId, { title: 'New Title', content: 'New Content' });

// 삭제
await deleteBoard(boardId);
```

#### 내가 쓴 리뷰
```typescript
import { getMyReviews } from '@/lib/api/user';
import { updateReview, deleteReview } from '@/lib/api/reviews';

// 조회
const { reviews, pagination } = await getMyReviews({ page: 1, limit: 10 });

// 수정
await updateReview(reviewId, { rating: 5, content: 'Updated review' });

// 삭제
await deleteReview(reviewId);
```

#### 북마크
```typescript
import { getMyBookmarks, deleteBookmark } from '@/lib/api/bookmarks';

// 조회 (장소 정보 자동 포함)
const { data, meta } = await getMyBookmarks(1, 12);

// 삭제
await deleteBookmark(bookmarkId);
```

### 2. 주의사항

#### 응답 형식 차이
- **내가 쓴 글/리뷰**: `{ boards/reviews, pagination }` 형식
- **북마크**: `{ data, meta }` 형식

**해결 방법**: 통일된 인터페이스로 래핑하거나 각각 처리

#### 정렬 및 필터링
- **정렬**: API 지원 (latest, popular)
- **검색**: API 미지원 → 프론트엔드에서 처리
- **필터링**: API 미지원 → 프론트엔드에서 처리

**예시**:
```typescript
// 검색 기능 (프론트엔드)
const filteredBoards = boards.filter(board =>
  board.title.includes(searchQuery) ||
  board.content.includes(searchQuery)
);

// 카테고리 필터 (프론트엔드)
const filteredByCategory = boards.filter(board =>
  selectedCategory === 'all' || board.category === selectedCategory
);
```

#### 북마크 삭제 시 ID
```typescript
// Bookmark 객체에서 id는 bookmark의 id (not placeId)
<button onClick={() => deleteBookmark(bookmark.id)}>
  삭제
</button>

// 장소 상세로 이동할 때는 placeId 사용
<Link href={`/places/${bookmark.place.id}`}>
  {bookmark.place.name}
</Link>
```

### 3. 타입 정의

모든 타입은 이미 정의되어 있음:
- `/src/types/board.ts` - Board, BoardListResponse
- `/src/lib/api/reviews.ts` - Review, ReviewsResponse
- `/src/lib/api/bookmarks.ts` - Bookmark, BookmarksResponse
- `/src/types/user.ts` - UserProfile, UserStats, QueryParams

---

## 🔧 추가 작업 필요 사항

### 백엔드 (선택적)

#### 1. 검색 기능 추가
```typescript
GET /api/api/users/me/boards?search=검색어
```

#### 2. 리뷰에 장소 정보 포함
현재 리뷰 응답에 장소 정보가 없어서 별도 조회 필요
```typescript
// 개선 전
const { reviews } = await getMyReviews();
const placeIds = reviews.map(r => r.placeId);
// 각 placeId로 별도 API 호출... (비효율)

// 개선 후 (백엔드 수정 필요)
interface Review {
  // ...
  place?: Place;  // 장소 정보 포함
}
```

#### 3. 알림 설정 API
위에서 설명한 알림 설정 API 구현

### 프론트엔드

#### 1. 통합 쿼리 훅 (선택적)
```typescript
// /src/hooks/useMyBoards.ts
export function useMyBoards(params: QueryParams) {
  return useQuery({
    queryKey: ['myBoards', params],
    queryFn: () => getMyBoards(params),
  });
}
```

#### 2. 에러 처리
모든 API 호출에 try-catch 필수

```typescript
try {
  const response = await getMyBoards({ page: 1 });
  // 성공 처리
} catch (error) {
  // 에러 처리
  toast.error('게시글을 불러오는데 실패했습니다');
}
```

#### 3. 로딩 상태 관리
```typescript
const [loading, setLoading] = useState(false);

const fetchBoards = async () => {
  setLoading(true);
  try {
    const response = await getMyBoards();
    // ...
  } catch (error) {
    // ...
  } finally {
    setLoading(false);
  }
};
```

---

## 📝 테스트 가이드

### API 테스트 (Swagger)
- Backend Swagger: http://localhost:4000/api/docs
- 실제 API 응답 형식 확인
- 페이지네이션 동작 확인

### 테스트 체크리스트

#### 내가 쓴 글
- [ ] 게시글 목록 조회
- [ ] 페이지네이션 동작
- [ ] 정렬 (latest, popular) 동작
- [ ] 게시글 수정
- [ ] 게시글 삭제
- [ ] 빈 목록 처리

#### 내가 쓴 리뷰
- [ ] 리뷰 목록 조회
- [ ] 페이지네이션 동작
- [ ] 정렬 동작
- [ ] 리뷰 수정
- [ ] 리뷰 삭제
- [ ] 평점 표시 (1-5점)
- [ ] 빈 목록 처리

#### 북마크
- [ ] 북마크 목록 조회 (장소 정보 포함 확인)
- [ ] 페이지네이션 동작
- [ ] 북마크 삭제
- [ ] 장소 상세 페이지 링크
- [ ] 빈 목록 처리

#### 알림 설정
- [ ] 설정 조회 (로컬 스토리지)
- [ ] 설정 저장 (로컬 스토리지)
- [ ] 토글 동작
- [ ] 체크박스 동작

---

## 🚀 구현 우선순위

### High (필수)
1. ✅ 내가 쓴 글 - API 완벽
2. ✅ 내가 쓴 리뷰 - API 완벽
3. ✅ 북마크 - API 완벽

### Medium (권장)
4. ⚠️ 알림 설정 - 로컬 스토리지로 구현

### Low (선택)
5. 검색 기능 (프론트 또는 백엔드 추가)
6. 고급 필터링
7. 일괄 삭제

---

## 💡 성능 최적화 제안

### 1. 페이지네이션 기본값
```typescript
const DEFAULT_PAGE_SIZE = {
  boards: 10,   // 게시글 (리스트 형태)
  reviews: 10,  // 리뷰 (리스트 형태)
  bookmarks: 12 // 북마크 (그리드 형태, 3x4)
};
```

### 2. 캐싱 (React Query 추천)
```typescript
// 5분간 캐시, stale 1분
queryClient.setQueryDefaults(['myBoards'], {
  staleTime: 60 * 1000,
  cacheTime: 5 * 60 * 1000,
});
```

### 3. Optimistic Updates
삭제 시 즉시 UI 업데이트 후 API 호출

```typescript
const handleDelete = async (id: string) => {
  // 1. UI에서 즉시 제거
  setBoards(boards.filter(b => b.id !== id));

  // 2. API 호출
  try {
    await deleteBoard(id);
    toast.success('삭제되었습니다');
  } catch (error) {
    // 3. 실패 시 롤백
    setBoards(originalBoards);
    toast.error('삭제에 실패했습니다');
  }
};
```

---

## 📋 결론

### API 준비 상태
- **내가 쓴 글**: ✅ 100% 준비 완료
- **내가 쓴 리뷰**: ✅ 100% 준비 완료
- **북마크**: ✅ 100% 준비 완료
- **알림 설정**: ⚠️ 로컬 스토리지로 대체

### Frontend 구현 가능
모든 핵심 기능 즉시 구현 가능합니다!

### 다음 단계
1. ✅ Backend API 검토 완료
2. ➡️ Frontend 레이아웃 및 라우팅 설계
3. ➡️ 각 페이지 구현
4. ➡️ 테스트

---

**검토 완료일**: 2025-11-09
**Backend Developer**: ✅ 검토 완료
**Frontend Team**: 구현 진행 가능
**상태**: API 준비 완료, Frontend 구현 시작 가능

**Let's build! 🚀**
