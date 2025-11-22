# Phase 2.1: 마이페이지 완성

**담당**: Type Safety Team + React Optimization Team
**우선순위**: P1 (높음)
**예상 시간**: 1시간
**작업량**: 11건

---

## 📋 작업 대상 파일

### 1. src/app/(main)/mypage/boards/page.tsx (1건)
**이슈**:
- useEffect 의존성 누락: loadBoards

**수정 방법**:
```typescript
const loadBoards = useCallback(async () => {
  // 기존 로직
}, []);

useEffect(() => {
  loadBoards();
}, [loadBoards]);
```

---

### 2. src/app/(main)/mypage/bookmarks/page.tsx (2건)
**이슈**:
- useEffect 의존성 누락: loadBookmarks
- img 태그 사용 (line 134)

**수정 방법 1 - useCallback**:
```typescript
const loadBookmarks = useCallback(async () => {
  // 기존 로직
}, []);
```

**수정 방법 2 - Image 컴포넌트**:
```typescript
import Image from 'next/image';

// line 134
<Image
  src={bookmark.place.images[0]}
  alt={bookmark.place.name}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, 33vw"
/>
```

---

### 3. src/app/(main)/mypage/edit/page.tsx (2건)
**이슈**:
- useEffect 의존성 누락: loadProfile
- any 타입 (line 45)

**수정 방법 1 - useCallback**:
```typescript
const loadProfile = useCallback(async () => {
  // 기존 로직
}, []);
```

**수정 방법 2 - AxiosError 타입**:
```typescript
import { AxiosError } from 'axios';

// line 45
} catch (error) {
  if (error instanceof AxiosError) {
    toast.error(error.response?.data?.message || '프로필 수정 실패');
  } else {
    toast.error('프로필 수정 실패');
  }
}
```

---

### 4. src/app/(main)/mypage/page.tsx (2건)
**이슈**:
- useEffect 의존성 누락: loadProfile
- any 타입 (line 38)

**수정 방법**:
```typescript
const loadProfile = useCallback(async () => {
  // 기존 로직
}, []);

// line 38 - AxiosError 적용
} catch (error) {
  if (error instanceof AxiosError) {
    console.error('프로필 로드 실패:', error);
  }
}
```

---

### 5. src/app/(main)/mypage/password/page.tsx (1건)
**이슈**:
- any 타입 (line 77)

**수정 방법**:
```typescript
import { AxiosError } from 'axios';

// line 77
} catch (error) {
  if (error instanceof AxiosError) {
    toast.error(error.response?.data?.message || '비밀번호 변경 실패');
  } else {
    toast.error('비밀번호 변경 실패');
  }
}
```

---

### 6. src/app/(main)/mypage/reviews/page.tsx (3건)
**이슈**:
- 미사용 변수: router (line 15)
- useEffect 의존성 누락: loadReviews (line 24)
- img 태그 사용 (line 173)

**수정 방법 1 - 미사용 변수 제거**:
```typescript
// line 15 제거 또는 주석
// const router = useRouter();
```

**수정 방법 2 - useCallback**:
```typescript
const loadReviews = useCallback(async () => {
  // 기존 로직
}, [page]);

useEffect(() => {
  loadReviews();
}, [loadReviews]);
```

**수정 방법 3 - Image 컴포넌트**:
```typescript
import Image from 'next/image';

// line 173
<Image
  src={review.images[0]}
  alt="리뷰 이미지"
  fill
  className="object-cover rounded"
  sizes="100px"
/>
```

---

## ✅ 체크리스트

- [ ] mypage/boards/page.tsx - useCallback 적용
- [ ] mypage/bookmarks/page.tsx - useCallback + Image
- [ ] mypage/edit/page.tsx - useCallback + AxiosError
- [ ] mypage/page.tsx - useCallback + AxiosError
- [ ] mypage/password/page.tsx - AxiosError
- [ ] mypage/reviews/page.tsx - router 제거 + useCallback + Image
- [ ] npm run lint 통과 확인
- [ ] 작업 로그 작성

---

## 📝 작업 로그 양식

```markdown
### Phase 2.1 작업 로그

**작업자**: [이름]
**작업 시간**: [시작 시간] - [종료 시간]

#### 수정한 파일
1. mypage/boards/page.tsx
   - 변경 사항: useCallback 적용
   - 이슈: 없음

2. mypage/bookmarks/page.tsx
   - 변경 사항: useCallback + Image 컴포넌트
   - 이슈: [발견된 이슈 및 해결 방법]

...

#### 발견된 추가 이슈
- [이슈 설명 및 해결 방법]

#### 테스트 결과
- ESLint: 11개 → 0개
- Build: 성공/실패
```

---

## 🚀 작업 시작

이 지시서를 확인한 후 Phase 2.1 작업을 시작하세요.
