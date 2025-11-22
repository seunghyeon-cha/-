# Work Order: Business 모듈 코드 품질 개선

**발행일**: 2025-11-19
**담당 PO**: Code Quality Team Lead
**우선순위**: P1 (높음)
**예상 시간**: 30분
**목표**: ESLint 경고 5개 → 0개

---

## 📋 작업 개요

Phase 2에서 완료한 패턴을 Business 모듈에도 동일하게 적용하여 코드 품질을 100%로 끌어올립니다.

### 현재 상태
```bash
./src/app/(main)/business/stats/page.tsx
28:21  Warning: Unexpected any. Specify a different type.

./src/app/(main)/business/verify/page.tsx
29:11  Warning: 'user' is assigned a value but never used.
51:14  Warning: 'error' is defined but never used.
51:21  Warning: Unexpected any. Specify a different type.
80:21  Warning: Unexpected any. Specify a different type.
```

**총 5개 경고**

---

## 👥 팀별 작업 지시

---

## **Team 1: Type Safety Team** 🔒

**담당자**: TypeScript Specialist
**작업 파일**:
- `src/app/(main)/business/stats/page.tsx`
- `src/app/(main)/business/verify/page.tsx`

### 작업 내용

#### 1. stats/page.tsx (1개 이슈)
**Line 28**: `any` 타입 수정

**현재 코드 패턴 예상**:
```typescript
} catch (error: any) {
  // 또는
  const data: any = ...
}
```

**수정 패턴** (Phase 2 참고):
```typescript
// 에러 핸들링의 경우
import { AxiosError } from 'axios';

} catch (error) {
  if (error instanceof AxiosError) {
    // error.response.data 접근 가능
  }
}

// 데이터 타입의 경우
interface StatsData {
  // 적절한 타입 정의
}
const data: StatsData = ...
```

#### 2. verify/page.tsx (2개 any 타입)
**Line 51, 80**: `any` 타입 수정

**작업 방법**:
1. 파일을 읽고 51번, 80번 라인 확인
2. catch 블록이면 AxiosError 패턴 적용
3. 데이터 타입이면 적절한 interface 정의 또는 기존 타입 import

---

## **Team 2: Code Cleanup Team** 🧹

**담당자**: Code Quality Specialist
**작업 파일**: `src/app/(main)/business/verify/page.tsx`

### 작업 내용

#### 1. Line 29: 미사용 변수 `user` 제거
```typescript
// Before
const { user, isAuthenticated } = useAuthStore();

// After (user가 실제로 사용되지 않는다면)
const { isAuthenticated } = useAuthStore();
```

**확인 사항**:
- 파일 전체에서 `user` 변수가 실제로 사용되는지 검색
- 사용되지 않으면 제거
- 사용된다면 ESLint 경고가 잘못된 것이므로 보고

#### 2. Line 51: 미사용 변수 `error` 제거
```typescript
// Before
} catch (error: any) {
  // error를 사용하지 않음
}

// After
} catch {
  // error 파라미터 제거
}

// 또는 error를 실제로 사용하도록 수정
} catch (error) {
  console.error('Failed:', error);
  // ...
}
```

---

## **Team 3: Integration & Verification Team** ✅

**담당자**: Build & Test Specialist
**작업 순서**: Type Safety Team → Code Cleanup Team 완료 후 시작

### 작업 내용

#### 1. ESLint 검증
```bash
npm run lint
```

**완료 기준**: 경고 0개

#### 2. 빌드 테스트
```bash
npm run build
```

**완료 기준**:
- ✅ Compiled successfully
- ✅ 모든 페이지 정상 생성
- ✅ 타입 에러 없음

#### 3. 변경사항 문서화
- 수정한 파일 목록
- Before/After 코드 비교
- 발견한 추가 이슈 (있다면)

---

## 📝 작업 순서

### Step 1: 파일 읽기 (Type Safety Team)
```bash
1. stats/page.tsx 전체 읽기
2. verify/page.tsx 전체 읽기
3. 문제가 되는 라인 정확히 파악
```

### Step 2: 타입 수정 (Type Safety Team)
```bash
1. AxiosError import 추가
2. any 타입 3개 수정
3. 필요시 interface 정의
```

### Step 3: 변수 정리 (Code Cleanup Team)
```bash
1. user 변수 사용 여부 확인 후 제거/유지
2. error 변수 사용 여부 확인 후 제거/사용
```

### Step 4: 검증 (Integration Team)
```bash
1. npm run lint
2. npm run build
3. 결과 확인 및 문서화
```

---

## 🎯 완료 기준

### 필수 조건
- [ ] ESLint 경고 0개
- [ ] npm run build 성공
- [ ] 타입 안전성 100%
- [ ] 미사용 변수 0개

### 추가 조건
- [ ] 기존 Phase 2 패턴과 일관성 유지
- [ ] 코드 가독성 개선
- [ ] 완료 보고서 작성

---

## 📚 참고 자료

### Phase 2 성공 패턴

#### 1. AxiosError 패턴
```typescript
// src/app/(main)/mypage/password/page.tsx:77
import { AxiosError } from 'axios';

} catch (error) {
  console.error('Failed to change password:', error);
  if (error instanceof AxiosError && error.response?.status === 401) {
    setErrors({ currentPassword: '현재 비밀번호가 일치하지 않습니다' });
  } else {
    toast.error('비밀번호 변경에 실패했습니다');
  }
}
```

#### 2. 미사용 변수 제거 패턴
```typescript
// src/app/(main)/mypage/reviews/page.tsx:15
// Before
const router = useRouter();
const [reviews, setReviews] = useState<Review[]>([]);

// After (router 미사용 시)
const [reviews, setReviews] = useState<Review[]>([]);
```

#### 3. 타입 정의 패턴
```typescript
// src/app/(main)/places/[id]/page.tsx:99
// Before
const categoryConfig: any = { ... };

// After
const categoryConfig: Record<string, { label: string; color: string }> = { ... };
```

---

## ⚠️ 주의사항

1. **기존 로직 변경 금지**
   - 타입과 변수만 수정
   - 비즈니스 로직은 건드리지 않음

2. **일관성 유지**
   - Phase 2에서 사용한 패턴 그대로 적용
   - 다른 방식으로 수정하지 말 것

3. **즉시 에러 해결**
   - 수정 중 빌드 에러 발생 시 즉시 해결
   - 에러 내용을 로그에 기록

4. **검증 필수**
   - 각 수정 후 ESLint 재확인
   - 최종 빌드 테스트 필수

---

## 📊 예상 결과

### Before
```
ESLint Warnings: 5개
- stats/page.tsx: 1개 (any)
- verify/page.tsx: 4개 (any 2개, 미사용 변수 2개)
```

### After
```
ESLint Warnings: 0개 ✅
Build: Success ✅
Type Safety: 100% ✅
```

---

## 🚀 작업 시작

**Type Safety Team**, 먼저 두 파일을 읽고 문제 라인을 정확히 파악해주세요.

**명령어**:
```
1. stats/page.tsx와 verify/page.tsx 파일을 읽어줘
2. 28번, 29번, 51번, 80번 라인 주변 코드를 확인해줘
3. 어떤 타입 수정이 필요한지 분석해줘
```

작업을 시작하겠습니다! 🏁
