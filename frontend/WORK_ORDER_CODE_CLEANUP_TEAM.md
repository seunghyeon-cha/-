# Code Cleanup Team - Work Order

**발행일**: 2025-11-19
**우선순위**: P2 (중간)
**담당자**: Code Cleanup Team
**예상 소요 시간**: 1시간

---

## 작업 개요

미사용 변수 및 import를 제거하여 코드 가독성을 개선하고 번들 크기를 최적화합니다.

---

## 현재 상황

**발견된 이슈**: 12개
**주요 문제**:
- 선언되었지만 사용되지 않는 변수
- import 했지만 사용되지 않는 모듈

**영향도**:
- 코드 가독성 저하
- 번들 크기 증가 (tree-shaking 제한)
- 잠재적 혼란 유발

---

## 작업 내용

### Task 1: 미사용 변수 제거

#### `src/app/(main)/accommodations/page.tsx`
```typescript
// ❌ 제거
const AREA_CODES = { ... }  // 사용되지 않음
const searchParams = { ... } // 사용되지 않음

// ✅ 필요한 경우만 유지, 아니면 제거
```

#### `src/app/(main)/boards/[id]/edit/page.tsx`
```typescript
// ❌ 제거
const isAuthenticated = useAuthStore(...)  // 사용되지 않음
const board = ...  // 사용되지 않음

// ✅ 실제로 사용하거나 제거
```

#### `src/app/(main)/boards/page.tsx`
```typescript
// ❌ 제거
const searchParams = { ... }  // 사용되지 않음
```

#### `src/app/(main)/business/places/page.tsx`
```typescript
// ❌ 제거
const router = useRouter()  // 사용되지 않음
```

#### `src/app/(main)/business/promotions/page.tsx`
```typescript
// ❌ 제거
const router = useRouter()  // 사용되지 않음
```

### Task 2: 미사용 Import 제거

각 파일에서 사용되지 않는 import 문 제거:
```typescript
// ❌ 제거
import { UnusedComponent } from '@/components/...'

// ✅ 사용되는 것만 유지
import { UsedComponent } from '@/components/...'
```

---

## 작업 프로세스

### 1. 변수 사용 여부 확인
```bash
# 파일 내 변수 사용 검색
grep -n "변수명" 파일경로
```

### 2. 제거 전 확인사항
- [ ] 정말 사용되지 않는지 확인
- [ ] 주석으로 남겨야 하는 코드인지 검토
- [ ] 향후 사용 예정인지 확인

### 3. 제거 방법

**완전히 사용되지 않는 경우**:
```typescript
// 전체 라인 삭제
```

**나중에 사용 예정인 경우**:
```typescript
// TODO: [티켓번호] 기능 구현 시 사용 예정
// const futureFeature = ...
```

---

## 파일별 작업 목록

### 우선순위 높음
- [ ] `src/app/(main)/accommodations/page.tsx`
  - [ ] AREA_CODES 제거 또는 사용
  - [ ] searchParams 제거 또는 사용

- [ ] `src/app/(main)/boards/[id]/edit/page.tsx`
  - [ ] isAuthenticated 제거 또는 사용
  - [ ] board 제거 또는 사용

### 우선순위 중간
- [ ] `src/app/(main)/boards/page.tsx`
  - [ ] searchParams 제거

- [ ] `src/app/(main)/business/places/page.tsx`
  - [ ] router 제거

- [ ] `src/app/(main)/business/promotions/page.tsx`
  - [ ] router 제거

### 전체 검토
- [ ] 모든 페이지 컴포넌트 검토
- [ ] 모든 재사용 컴포넌트 검토

---

## 체크리스트

- [ ] 모든 미사용 변수 제거 완료
- [ ] 모든 미사용 import 제거 완료
- [ ] ESLint no-unused-vars 경고 0개
- [ ] npm run build 성공
- [ ] 기능 정상 작동 확인

---

## 자동화 도구

### ESLint 자동 수정
```bash
npm run lint:fix
```

### VSCode 설정
`.vscode/settings.json`:
```json
{
  "editor.codeActionsOnSave": {
    "source.organizeImports": true,
    "source.fixAll.eslint": true
  }
}
```

---

## 주의사항

⚠️ **제거 전 확인**:
- props로 받은 값도 사용 여부 확인
- 타입 체크용으로만 사용하는 경우 주석 추가
- 향후 사용 예정인 경우 TODO 주석

⚠️ **부작용 방지**:
- 제거 후 반드시 테스트
- 빌드 성공 확인
- 타입 에러 발생 여부 확인
