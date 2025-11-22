# React Optimization Team - Work Order

**발행일**: 2025-11-19
**우선순위**: P1 (높음)
**담당자**: React Optimization Team
**예상 소요 시간**: 2시간

---

## 작업 개요

React Hook 의존성 배열을 올바르게 설정하여 불필요한 리렌더링을 방지하고 버그를 예방합니다.

---

## 현재 상황

**발견된 이슈**: 23개
**주요 문제**: useEffect 의존성 배열에 필요한 의존성 누락

**영향도**:
- 잠재적 버그 (stale closure)
- 불필요한 리렌더링
- 예상치 못한 동작
- 성능 저하

---

## 작업 내용

### Task 1: useCallback으로 함수 메모이제이션

**문제 패턴**:
```typescript
const fetchData = () => { ... }

useEffect(() => {
  fetchData()
}, []) // ❌ fetchData가 의존성에 없음
```

**해결 방법**:
```typescript
const fetchData = useCallback(() => {
  // 데이터 페칭 로직
}, [/* 필요한 의존성 */])

useEffect(() => {
  fetchData()
}, [fetchData]) // ✅ 의존성 명시
```

### Task 2: 의존성 배열 완성

**파일별 수정 사항**:

#### `src/app/(main)/accommodations/page.tsx`
- fetchPlaces 함수를 useCallback으로 감싸기
- sortOption, viewMode 의존성 추가

#### `src/app/(main)/boards/[id]/edit/page.tsx`
- fetchBoard 함수를 useCallback으로 감싸기

#### `src/app/(main)/boards/[id]/page.tsx`
- fetchData 함수를 useCallback으로 감싸기

#### `src/app/(main)/boards/page.tsx`
- fetchBoards 함수를 useCallback으로 감싸기

#### `src/app/(main)/business/places/[id]/page.tsx`
- loadStats 함수를 useCallback으로 감싸기

#### `src/app/(main)/business/promotions/page.tsx`
- selectedPlaceId 의존성 추가
- loadPromotionsByPlace 함수를 useCallback으로 감싸기

---

## 작업 패턴

### 패턴 1: API 호출 함수

```typescript
import { useCallback } from 'react';

const fetchData = useCallback(async () => {
  try {
    const response = await api.getData();
    setData(response);
  } catch (error) {
    console.error(error);
  }
}, [/* API 파라미터 의존성 */]);

useEffect(() => {
  fetchData();
}, [fetchData]);
```

### 패턴 2: 검색/필터 기능

```typescript
const fetchWithFilters = useCallback(async () => {
  const response = await api.getData({
    sort: sortOption,
    view: viewMode,
    search: searchTerm
  });
  setData(response);
}, [sortOption, viewMode, searchTerm]); // 모든 필터 의존성

useEffect(() => {
  fetchWithFilters();
}, [fetchWithFilters]);
```

### 패턴 3: 조건부 실행

```typescript
useEffect(() => {
  if (selectedId) {
    loadData(selectedId);
  }
}, [selectedId, loadData]); // 조건에 사용된 값도 의존성
```

---

## 체크리스트

### useCallback 적용
- [ ] accommodations/page.tsx - fetchPlaces
- [ ] boards/[id]/edit/page.tsx - fetchBoard
- [ ] boards/[id]/page.tsx - fetchData
- [ ] boards/page.tsx - fetchBoards
- [ ] business/places/[id]/page.tsx - loadStats
- [ ] business/promotions/page.tsx - loadPromotionsByPlace
- [ ] 기타 컴포넌트 함수들

### 의존성 배열 수정
- [ ] 모든 useEffect 의존성 검토
- [ ] ESLint exhaustive-deps 경고 해결

### 검증
- [ ] npm run lint 통과
- [ ] 기능 정상 작동 확인
- [ ] 무한 루프 발생 여부 확인

---

## 주의사항

⚠️ **무한 루프 주의**:
- 객체/배열을 의존성으로 사용 시 useMemo 활용
- setState 함수는 의존성에 포함 불필요 (안정적 참조)

⚠️ **과도한 메모이제이션 지양**:
- 간단한 계산은 메모이제이션 불필요
- 성능 이슈가 있는 경우에만 최적화

---

## 참고 자료

- [React Hooks Rules](https://react.dev/reference/react)
- [useCallback Hook](https://react.dev/reference/react/useCallback)
- [useEffect Hook](https://react.dev/reference/react/useEffect)
