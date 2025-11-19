# E2E 테스트 가이드

## 개요

이 프로젝트는 **Playwright**를 사용하여 End-to-End (E2E) 테스트를 수행합니다. Playwright는 Chromium, Firefox, WebKit을 포함한 여러 브라우저에서 안정적이고 빠른 테스트를 제공합니다.

## 설치 완료

✅ Playwright 설치 완료
✅ 테스트 환경 구성 완료
✅ 샘플 테스트 작성 완료

## 프로젝트 구조

```
frontend/
├── e2e/                        # E2E 테스트 디렉토리
│   ├── auth/                   # 인증 관련 테스트
│   │   └── login.spec.ts       # 로그인 테스트
│   ├── pages/                  # 페이지 테스트
│   │   ├── homepage.spec.ts    # 홈페이지 테스트
│   │   └── navigation.spec.ts  # 네비게이션 테스트
│   ├── places/                 # 관광지 관련 테스트
│   │   └── places-list.spec.ts # 관광지 목록 테스트
│   ├── boards/                 # 게시판 테스트 (추가 예정)
│   ├── itinerary/              # 여행일정 테스트 (추가 예정)
│   ├── utils/                  # 테스트 유틸리티
│   │   └── test-helpers.ts     # 공통 헬퍼 함수
│   └── fixtures/               # 테스트 데이터
│       └── test-data.ts        # 테스트용 데이터
├── playwright.config.ts        # Playwright 설정
└── E2E_TEST_GUIDE.md          # 이 문서
```

## 테스트 실행

### 기본 명령어

```bash
# 모든 테스트 실행 (헤드리스 모드)
npm run test:e2e

# UI 모드로 테스트 실행 (권장)
npm run test:e2e:ui

# 브라우저를 표시하며 테스트 실행
npm run test:e2e:headed

# 디버그 모드로 테스트 실행
npm run test:e2e:debug
```

### 브라우저별 테스트

```bash
# Chromium만 테스트
npm run test:e2e:chromium

# Firefox만 테스트
npm run test:e2e:firefox

# WebKit만 테스트
npm run test:e2e:webkit

# 모바일 브라우저 테스트
npm run test:e2e:mobile
```

### 특정 테스트 파일 실행

```bash
# 특정 파일만 테스트
npx playwright test e2e/pages/homepage.spec.ts

# 특정 테스트만 실행
npx playwright test -g "홈페이지가 정상적으로 로드된다"
```

### 테스트 리포트 보기

```bash
# HTML 리포트 열기
npm run test:e2e:report
```

## 작성된 테스트

### 1. 홈페이지 테스트 (`e2e/pages/homepage.spec.ts`)

- ✅ 페이지 로드 확인
- ✅ 네비게이션 메뉴 표시
- ✅ 로그인/회원가입 버튼 표시
- ✅ 반응형 디자인 (모바일/데스크탑)
- ✅ 스크롤 기능
- ✅ 로고 클릭 시 홈으로 이동

### 2. 네비게이션 테스트 (`e2e/pages/navigation.spec.ts`)

- ✅ 모든 주요 페이지로 이동
- ✅ 브라우저 뒤로가기/앞으로가기
- ✅ 모바일 메뉴 토글
- ✅ URL 변경 확인

### 3. 로그인 테스트 (`e2e/auth/login.spec.ts`)

- ✅ 로그인 페이지 로드
- ✅ 폼 검증
- ✅ 이메일 형식 검증
- ✅ 키보드 네비게이션
- ✅ Enter 키로 폼 제출

### 4. 관광지 목록 테스트 (`e2e/places/places-list.spec.ts`)

- ✅ 목록 페이지 로드
- ✅ 카드 표시
- ✅ 검색 기능
- ✅ 필터링
- ✅ 정렬
- ✅ 페이지네이션
- ✅ 상세 페이지 이동
- ✅ 반응형 디자인

## 새로운 테스트 작성하기

### 1. 테스트 파일 생성

적절한 디렉토리에 `.spec.ts` 파일을 생성합니다:

```typescript
import { test, expect } from '@playwright/test';
import { TEST_URLS } from '../fixtures/test-data';
import { waitForPageLoad } from '../utils/test-helpers';

test.describe('새로운 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URLS.HOME);
  });

  test('테스트 설명', async ({ page }) => {
    // 테스트 코드 작성
    await expect(page).toHaveTitle(/예림투어/);
  });
});
```

### 2. 헬퍼 함수 사용

`e2e/utils/test-helpers.ts`의 함수들을 활용하세요:

```typescript
import {
  waitForPageLoad,
  waitForLoading,
  clickByText,
  fillForm,
  expectErrorMessage,
} from '../utils/test-helpers';

// 페이지 로드 대기
await waitForPageLoad(page, '/places', '관광지');

// 로딩 완료 대기
await waitForLoading(page);

// 텍스트로 요소 클릭
await clickByText(page, '로그인');

// 폼 입력 및 제출
await fillForm(
  page,
  [
    { selector: 'input[type="email"]', value: 'test@example.com' },
    { selector: 'input[type="password"]', value: 'password123' },
  ],
  'button[type="submit"]'
);

// 에러 메시지 확인
await expectErrorMessage(page, '로그인에 실패했습니다');
```

### 3. 테스트 데이터 활용

`e2e/fixtures/test-data.ts`의 데이터를 사용하세요:

```typescript
import { testUsers, TEST_URLS, SELECTORS } from '../fixtures/test-data';

// 사용자 데이터
await page.fill(SELECTORS.EMAIL_INPUT, testUsers.validUser.email);

// URL 상수
await page.goto(TEST_URLS.LOGIN);

// 선택자 상수
await page.click(SELECTORS.SUBMIT_BUTTON);
```

## 베스트 프랙티스

### 1. 독립적인 테스트

각 테스트는 독립적으로 실행될 수 있어야 합니다:

```typescript
test.beforeEach(async ({ page }) => {
  // 각 테스트 전에 초기 상태로 설정
  await page.goto(TEST_URLS.HOME);
});
```

### 2. 명확한 테스트 이름

테스트 이름은 무엇을 테스트하는지 명확하게 표현해야 합니다:

```typescript
test('로그인 버튼 클릭 시 로그인 페이지로 이동한다', async ({ page }) => {
  // ...
});
```

### 3. 대기 시간 활용

적절한 대기 함수를 사용하세요:

```typescript
// ❌ 나쁜 예: 고정된 시간 대기
await page.waitForTimeout(3000);

// ✅ 좋은 예: 특정 조건이 만족될 때까지 대기
await page.waitForSelector('.loading', { state: 'detached' });
await page.waitForLoadState('networkidle');
```

### 4. 선택자 우선순위

선택자는 다음 순서로 사용하세요:

1. role, aria-label 등의 접근성 속성
2. data-testid
3. 의미 있는 CSS 클래스나 ID
4. 마지막 수단으로 XPath

```typescript
// ✅ 좋은 예
await page.getByRole('button', { name: '로그인' });
await page.getByLabel('이메일');

// ⚠️ 사용 가능하지만 덜 선호됨
await page.locator('[data-testid="login-button"]');

// ❌ 피해야 할 예
await page.locator('div > div > button:nth-child(2)');
```

### 5. 에러 처리

예상 가능한 실패를 처리하세요:

```typescript
test('데이터가 없을 때 메시지가 표시된다', async ({ page }) => {
  await page.goto(TEST_URLS.PLACES);

  const cards = page.locator('.card');
  const count = await cards.count();

  if (count === 0) {
    // 빈 상태 메시지 확인
    await expect(page.getByText('데이터가 없습니다')).toBeVisible();
  } else {
    // 카드가 표시되는지 확인
    await expect(cards.first()).toBeVisible();
  }
});
```

## 디버깅

### 1. UI 모드 사용

가장 쉬운 디버깅 방법:

```bash
npm run test:e2e:ui
```

### 2. 디버그 모드

단계별로 실행:

```bash
npm run test:e2e:debug
```

### 3. 스크린샷 및 비디오

실패 시 자동으로 스크린샷과 비디오가 저장됩니다:

- `test-results/` 디렉토리에서 확인 가능

### 4. 브라우저 콘솔 로그

```typescript
page.on('console', (msg) => console.log('브라우저 로그:', msg.text()));
```

## CI/CD 통합

GitHub Actions 워크플로우가 설정되어 있습니다:

- **파일 위치**: `.github/workflows/playwright.yml`
- **트리거**: main, develop 브랜치에 push/PR 시
- **실행 내용**:
  - 의존성 설치
  - Playwright 브라우저 설치
  - 모든 테스트 실행
  - 테스트 리포트 업로드

### 테스트 결과 확인

1. GitHub 저장소의 Actions 탭으로 이동
2. 최근 워크플로우 실행 선택
3. Artifacts에서 `playwright-report` 다운로드

## 다음 단계

### 추가할 테스트

1. **게시판 테스트** (`e2e/boards/`)
   - 게시글 작성
   - 게시글 수정/삭제
   - 댓글 작성
   - 좋아요 기능

2. **여행일정 테스트** (`e2e/itinerary/`)
   - 일정 생성
   - 장소 추가/삭제
   - 드래그 앤 드롭
   - 일정 공유

3. **회원가입 테스트** (`e2e/auth/signup.spec.ts`)
   - 폼 검증
   - 이메일 중복 확인
   - 비밀번호 강도 검증

4. **검색 테스트** (`e2e/search/`)
   - 키워드 검색
   - 필터링
   - 정렬

5. **반응형 테스트**
   - 다양한 화면 크기
   - 터치 이벤트
   - 모바일 제스처

## 문제 해결

### 테스트가 실패하는 경우

1. **개발 서버 확인**
   ```bash
   npm run dev
   ```
   개발 서버가 실행 중인지 확인하세요.

2. **브라우저 재설치**
   ```bash
   npx playwright install
   ```

3. **캐시 삭제**
   ```bash
   rm -rf node_modules/.cache
   npx playwright install
   ```

4. **의존성 재설치**
   ```bash
   rm -rf node_modules
   npm install
   ```

### 테스트가 느린 경우

1. **병렬 실행 조정**
   `playwright.config.ts`에서 `workers` 설정 조정

2. **불필요한 대기 제거**
   `waitForTimeout` 대신 명시적 대기 사용

3. **네트워크 요청 모킹**
   실제 API 호출 대신 모킹 사용 고려

## 리소스

- [Playwright 공식 문서](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [테스트 작성 가이드](https://playwright.dev/docs/writing-tests)
- [선택자 가이드](https://playwright.dev/docs/selectors)

## 기여하기

새로운 테스트를 추가할 때:

1. 적절한 디렉토리에 테스트 파일 생성
2. 명확하고 설명적인 테스트 이름 사용
3. 헬퍼 함수와 테스트 데이터 재사용
4. 테스트가 독립적으로 실행되는지 확인
5. PR 전에 로컬에서 모든 테스트 실행

---

**작성일**: 2025-11-13
**Playwright 버전**: 1.56.1
**Node.js 버전**: 20.x
