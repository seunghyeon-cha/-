# Type Safety Team - Work Order

**발행일**: 2025-11-19
**우선순위**: P1 (높음)
**담당자**: Type Safety Team
**예상 소요 시간**: 2-3시간

---

## 작업 개요

TypeScript의 `any` 타입 사용을 제거하고 명시적 타입 정의를 통해 타입 안정성을 개선합니다.

---

## 현재 상황

**발견된 이슈**: 54개
**주요 파일**:
- `src/types/user.ts` - 사용자 관련 타입
- `src/lib/api/client.ts` - API 클라이언트
- `src/lib/api/festivals.ts` - 축제 API
- 각종 페이지 컴포넌트 - 이벤트 핸들러

**영향도**:
- 타입 안전성 부족
- 런타임 에러 가능성 증가
- IDE 자동완성 기능 제한
- 코드 유지보수성 저하

---

## 작업 내용

### Task 1: 사용자 타입 정의 개선

**파일**: `src/types/user.ts`

현재 문제:
```typescript
settings?: any;
metadata?: any;
```

해결 방법:
```typescript
// 명시적 타입 정의
interface UserSettings {
  notifications: boolean;
  language: string;
  theme: 'light' | 'dark';
  // 필요한 설정 추가
}

interface UserMetadata {
  lastLogin?: Date;
  loginCount?: number;
  // 필요한 메타데이터 추가
}

// User 인터페이스 수정
settings?: UserSettings;
metadata?: UserMetadata;
```

### Task 2: API 응답 타입 정의

**파일**: `src/lib/api/client.ts`, `src/lib/api/festivals.ts`

현재 문제:
```typescript
.catch((error: any) => { ... })
```

해결 방법:
```typescript
// API 에러 타입 정의
interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// 사용
.catch((error: unknown) => {
  const apiError = error as ApiError;
  // 에러 처리
})
```

### Task 3: 이벤트 핸들러 타입 지정

**파일**: 각종 페이지 컴포넌트

현재 문제:
```typescript
const handleSubmit = async (e: any) => { ... }
```

해결 방법:
```typescript
import { FormEvent } from 'react';

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // 폼 처리
}
```

### Task 4: 폼 데이터 타입 정의

현재 문제:
```typescript
const [formData, setFormData] = useState<any>({ ... })
```

해결 방법:
```typescript
interface LoginFormData {
  email: string;
  password: string;
}

const [formData, setFormData] = useState<LoginFormData>({
  email: '',
  password: ''
})
```

---

## 체크리스트

### 타입 정의
- [ ] UserSettings 인터페이스 생성
- [ ] UserMetadata 인터페이스 생성
- [ ] ApiError 인터페이스 생성
- [ ] 각 페이지별 FormData 인터페이스 생성

### 코드 수정
- [ ] src/types/user.ts 수정
- [ ] src/lib/api/client.ts 수정
- [ ] src/lib/api/festivals.ts 수정
- [ ] src/app/(auth)/login/page.tsx 수정
- [ ] src/app/(auth)/signup/page.tsx 수정
- [ ] 기타 페이지 컴포넌트 수정

### 검증
- [ ] npm run lint 통과 (any 관련 경고 0개)
- [ ] npm run build 성공
- [ ] 타입 체크 통과

---

## 베스트 프랙티스

1. **unknown 사용**: any 대신 unknown 사용 후 타입 가드 적용
2. **명시적 타입**: 가능한 모든 곳에 명시적 타입 선언
3. **타입 재사용**: 공통 타입은 types 폴더에 정의
4. **Strict 모드**: TypeScript strict 옵션 활용

---

## 참고 자료

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Next.js TypeScript](https://nextjs.org/docs/basic-features/typescript)
