# Phase 2.2: 일정 관리 완성

**담당**: Type Safety Team + React Optimization Team
**우선순위**: P1 (높음)
**예상 시간**: 1시간
**작업량**: 9건

---

## 📋 작업 대상 파일

### 1. src/app/(main)/itinerary/[id]/edit/page.tsx (5건)
**이슈**:
- 미사용 타입 import: ItineraryDay (line 6)
- 미사용 상수: AREA_LABELS (line 6)
- useEffect 의존성 누락: fetchItinerary (line 39)
- any 타입 (line 53)
- 미사용 변수: error (line 145)

**수정 방법 1 - 미사용 import 제거**:
```typescript
// line 6
import {
  Itinerary,
  ItineraryPlace,
  // ItineraryDay 제거
  CreateItineraryDto,
} from '@/types/itinerary';
// AREA_LABELS 제거
```

**수정 방법 2 - useCallback**:
```typescript
const fetchItinerary = useCallback(async () => {
  try {
    setIsLoading(true);
    const data = await getItineraryById(params.id);
    setItinerary(data);
    // ...
  } catch (error) {
    console.error('Failed to fetch itinerary:', error);
    router.push('/itinerary');
  } finally {
    setIsLoading(false);
  }
}, [params.id, router]);

useEffect(() => {
  fetchItinerary();
}, [fetchItinerary]);
```

**수정 방법 3 - AxiosError 타입** (line 53):
```typescript
import { AxiosError } from 'axios';

} catch (error) {
  if (error instanceof AxiosError) {
    toast.error(error.response?.data?.message || '일정 수정 실패');
  } else {
    toast.error('일정 수정 실패');
  }
}
```

**수정 방법 4 - 미사용 error 변수** (line 145):
```typescript
// error 파라미터 제거하거나 사용
} catch {  // error 파라미터 제거
  toast.error('장소 삭제 실패');
}
```

---

### 2. src/app/(main)/itinerary/[id]/page.tsx (2건)
**이슈**:
- useEffect 의존성 누락: fetchItinerary (line 24)
- any 타입 (line 31)

**수정 방법 1 - useCallback**:
```typescript
const fetchItinerary = useCallback(async () => {
  try {
    setIsLoading(true);
    const data = await getItineraryById(params.id);
    setItinerary(data);
  } catch (error) {
    console.error('Failed to fetch itinerary:', error);
    toast.error('일정을 불러오는데 실패했습니다');
  } finally {
    setIsLoading(false);
  }
}, [params.id]);

useEffect(() => {
  fetchItinerary();
}, [fetchItinerary]);
```

**수정 방법 2 - AxiosError 타입**:
```typescript
} catch (error) {
  if (error instanceof AxiosError) {
    console.error('Failed to delete:', error);
    toast.error(error.response?.data?.message || '일정 삭제 실패');
  } else {
    toast.error('일정 삭제 실패');
  }
}
```

---

### 3. src/app/(main)/itinerary/new/page.tsx (2건)
**이슈**:
- any 타입 2건 (lines 71, 107)

**수정 방법 - AxiosError 타입**:
```typescript
import { AxiosError } from 'axios';

// line 71
} catch (error) {
  if (error instanceof AxiosError) {
    toast.error(error.response?.data?.message || '장소 검색 실패');
  } else {
    toast.error('장소 검색 실패');
  }
}

// line 107
} catch (error) {
  if (error instanceof AxiosError) {
    toast.error(error.response?.data?.message || '일정 생성 실패');
  } else {
    toast.error('일정 생성 실패');
  }
}
```

---

### 4. src/app/(main)/itinerary/page.tsx (1건) - 참고용
**이슈**:
- useEffect 의존성 누락: fetchItineraries (line 80)

**수정 방법**:
```typescript
const fetchItineraries = useCallback(async () => {
  try {
    setIsLoading(true);
    const response = await getItineraries({ page });
    setItineraries(response.data);
    setMeta(response.meta);
  } catch (error) {
    console.error('Failed to fetch itineraries:', error);
  } finally {
    setIsLoading(false);
  }
}, [page]);

useEffect(() => {
  fetchItineraries();
}, [fetchItineraries]);
```

---

## ✅ 체크리스트

### itinerary/[id]/edit/page.tsx
- [ ] ItineraryDay import 제거
- [ ] AREA_LABELS 제거
- [ ] fetchItinerary useCallback 적용
- [ ] line 53 AxiosError 적용
- [ ] line 145 error 변수 처리

### itinerary/[id]/page.tsx
- [ ] fetchItinerary useCallback 적용
- [ ] line 31 AxiosError 적용

### itinerary/new/page.tsx
- [ ] line 71 AxiosError 적용
- [ ] line 107 AxiosError 적용

### itinerary/page.tsx
- [ ] fetchItineraries useCallback 적용

### 검증
- [ ] npm run lint - 9개 이슈 해결 확인
- [ ] 일정 생성/조회/수정/삭제 기능 테스트
- [ ] 작업 로그 작성

---

## 📝 작업 로그 양식

```markdown
### Phase 2.2 작업 로그

**작업 시간**: [시작] - [종료]

#### 수정 파일
1. itinerary/[id]/edit/page.tsx
   - 미사용 import 제거: ItineraryDay, AREA_LABELS
   - useCallback 적용: fetchItinerary
   - AxiosError 적용: 2곳
   - 발견 이슈: [있다면 기록]

2. itinerary/[id]/page.tsx
   - useCallback 적용: fetchItinerary
   - AxiosError 적용
   - 발견 이슈: [있다면 기록]

...

#### 테스트 결과
- ESLint: 9개 → 0개
- 기능 테스트: 정상/이슈 있음
- Build: 성공/실패
```

---

## 🚀 작업 시작

Phase 2.1 완료 후 이 작업을 시작하세요.
