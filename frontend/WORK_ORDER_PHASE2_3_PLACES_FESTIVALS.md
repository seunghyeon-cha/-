# Phase 2.3: 장소/축제 페이지 완성

**담당**: Type Safety Team + Performance Team
**우선순위**: P2 (중간)
**예상 시간**: 45분
**작업량**: 7건

---

## 📋 작업 대상 파일

### 1. src/app/(main)/festivals/[id]/page.tsx (4건)
**이슈**:
- any 타입 3건 (lines 28, 51, 80)
- 미사용 변수 2건: user, error (lines 29, 51)
- useEffect 의존성 누락: fetchFestivalDetail (line 48)
- 미사용 변수: err (line 76)

**수정 방법 1 - 미사용 변수 제거**:
```typescript
// line 29 - user 제거
const { isAuthenticated } = useAuthStore();  // user 제거

// line 51 - error 사용 또는 제거
} catch {  // error 파라미터 제거
  console.error('Failed to fetch festival');
}

// line 76 - err 제거
} catch {  // err 파라미터 제거
  // 이미지 로드 실패는 무시
}
```

**수정 방법 2 - AxiosError 타입**:
```typescript
import { AxiosError } from 'axios';

// line 28 (handleLike 함수)
} catch (error) {
  if (error instanceof AxiosError) {
    toast.error(error.response?.data?.message || '좋아요 실패');
  } else {
    toast.error('좋아요 실패');
  }
}

// line 80 (handleBookmark 함수)
} catch (error) {
  if (error instanceof AxiosError) {
    toast.error(error.response?.data?.message || '북마크 실패');
  } else {
    toast.error('북마크 실패');
  }
}
```

**수정 방법 3 - useCallback**:
```typescript
const fetchFestivalDetail = useCallback(async () => {
  try {
    setIsLoading(true);
    setError(null);

    const detailResponse = await getFestivalById(contentId);
    if (detailResponse.response.header.resultCode === '0000') {
      const item = detailResponse.response.body.items?.item?.[0];
      if (item) {
        setFestival(item);
      } else {
        setError('축제 정보를 찾을 수 없습니다.');
      }
    }

    // 이미지 정보 조회
    try {
      const imageResponse = await getFestivalImages(contentId);
      if (imageResponse.response.header.resultCode === '0000') {
        const imageItems = imageResponse.response.body.items?.item || [];
        setImages(imageItems);
      }
    } catch {
      // 이미지 로드 실패는 무시
    }
  } catch {
    setError('축제 정보를 불러오는데 실패했습니다.');
  } finally {
    setIsLoading(false);
  }
}, [contentId]);

useEffect(() => {
  if (contentId) {
    fetchFestivalDetail();
  }
}, [contentId, fetchFestivalDetail]);
```

---

### 2. src/app/(main)/places/[id]/page.tsx (3건)
**이슈**:
- 미사용 변수: user (line 16)
- any 타입 4건 (lines 17, 18, 43, 98)
- useEffect 의존성 누락: fetchData (line 26)
- img 태그 사용 (line 140)

**수정 방법 1 - 미사용 변수 제거**:
```typescript
// line 16
const { isAuthenticated } = useAuthStore();  // user 제거
```

**수정 방법 2 - AxiosError 타입**:
```typescript
import { AxiosError } from 'axios';

// line 17, 18 - handleLike, handleBookmark
const handleLike = async () => {
  try {
    // ...
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || '좋아요 실패');
    } else {
      toast.error('좋아요 실패');
    }
  }
};

// line 43 - fetchData
} catch (error) {
  if (error instanceof AxiosError) {
    console.error('Failed to fetch place:', error);
    toast.error('장소 정보를 불러오는데 실패했습니다');
  }
}

// line 98 - handleSubmit
} catch (error) {
  if (error instanceof AxiosError) {
    toast.error(error.response?.data?.message || '리뷰 작성 실패');
  } else {
    toast.error('리뷰 작성 실패');
  }
}
```

**수정 방법 3 - useCallback**:
```typescript
const fetchData = useCallback(async () => {
  try {
    setIsLoading(true);
    const placeData = await getPlaceById(params.id);
    setPlace(placeData);

    const reviewsData = await getReviews(params.id);
    setReviews(reviewsData.data);
    setReviewMeta(reviewsData.meta);
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Failed to fetch place:', error);
      toast.error('장소 정보를 불러오는데 실패했습니다');
    }
  } finally {
    setIsLoading(false);
  }
}, [params.id]);

useEffect(() => {
  fetchData();
}, [fetchData]);
```

**수정 방법 4 - Image 컴포넌트**:
```typescript
import Image from 'next/image';

// line 140
<Image
  src={place.images[currentImageIndex]}
  alt={place.name}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, 800px"
  priority
/>
```

---

## ✅ 체크리스트

### festivals/[id]/page.tsx
- [ ] user 변수 제거
- [ ] error, err 변수 처리
- [ ] AxiosError 적용 (2곳)
- [ ] fetchFestivalDetail useCallback 적용

### places/[id]/page.tsx
- [ ] user 변수 제거
- [ ] AxiosError 적용 (4곳)
- [ ] fetchData useCallback 적용
- [ ] Image 컴포넌트 적용

### 검증
- [ ] npm run lint - 7개 이슈 해결
- [ ] 축제/장소 상세 페이지 테스트
- [ ] 이미지 표시 확인
- [ ] 작업 로그 작성

---

## 📝 작업 로그 양식

```markdown
### Phase 2.3 작업 로그

**작업 시간**: [시작] - [종료]

#### 수정 파일
1. festivals/[id]/page.tsx
   - 미사용 변수 제거: user, error, err
   - AxiosError 적용
   - useCallback 적용
   - 발견 이슈: [있다면]

2. places/[id]/page.tsx
   - 미사용 변수 제거: user
   - AxiosError 적용 (4곳)
   - useCallback 적용
   - Image 컴포넌트 적용
   - 발견 이슈: [있다면]

#### 테스트 결과
- ESLint: 7개 → 0개
- 기능 테스트: 정상/이슈
- Build: 성공/실패
```
