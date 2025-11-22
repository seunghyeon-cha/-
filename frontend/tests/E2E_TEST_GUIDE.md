# E2E 테스트 가이드

## 📋 개요

이 프로젝트는 Playwright를 사용하여 3가지 핵심 User Journey에 대한 E2E 테스트를 구현했습니다.

### 구현된 테스트 시나리오
1. **장소 검색 및 북마크** (`01-place-bookmark.spec.ts`)
2. **게시글 CRUD** (`02-board-crud.spec.ts`)
3. **일정 CRUD** (`03-itinerary-crud.spec.ts`)

---

## 🚀 사전 준비

### 1. Playwright 브라우저 설치

처음 실행하기 전에 Playwright 브라우저를 설치해야 합니다:

```bash
npx playwright install
```

### 2. 테스트 사용자 계정 준비

프로젝트 루트에 `.env.test` 파일을 생성하고 테스트 계정 정보를 입력하세요:

```env
# .env.test
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=password123
```

**중요**: 실제 사용 가능한 테스트 계정이 필요합니다!

### 3. 개발 서버 실행

테스트는 로컬 개발 서버에서 실행됩니다:

```bash
npm run dev
```

또는 Playwright가 자동으로 서버를 시작하도록 설정되어 있습니다 (`playwright.config.ts`).

---

## 🧪 테스트 실행

### 전체 테스트 실행

```bash
npm run test:e2e
```

### 특정 시나리오만 실행

```bash
# Scenario 1: 장소 검색 및 북마크
npx playwright test 01-place-bookmark

# Scenario 2: 게시글 CRUD
npx playwright test 02-board-crud

# Scenario 3: 일정 CRUD
npx playwright test 03-itinerary-crud
```

### UI 모드로 실행 (디버깅 권장)

```bash
npm run test:e2e:ui
```

UI 모드를 사용하면:
- 각 테스트 단계를 시각적으로 확인
- 실패한 지점에서 디버깅
- 스크린샷 및 trace 확인

### 브라우저를 보면서 실행 (Headed Mode)

```bash
npm run test:e2e:headed
```

### 디버그 모드

```bash
npm run test:e2e:debug
```

### 특정 브라우저로 실행

```bash
# Chromium (기본)
npm run test:e2e:chromium

# Firefox
npm run test:e2e:firefox

# WebKit (Safari)
npm run test:e2e:webkit
```

---

## 📊 테스트 결과 확인

### HTML 리포트 보기

테스트 실행 후 자동으로 HTML 리포트가 생성됩니다:

```bash
npm run test:e2e:report
```

리포트에는 다음이 포함됩니다:
- 각 테스트 결과 (통과/실패)
- 실행 시간
- 실패 시 스크린샷
- Trace 파일 (재생 가능)

---

## 🏗️ 테스트 구조

```
tests/
├── e2e/
│   ├── fixtures/
│   │   └── base.fixture.ts          # 공통 테스트 픽스처
│   ├── helpers/
│   │   ├── auth.helper.ts           # 인증 헬퍼
│   │   └── navigation.helper.ts     # 네비게이션 헬퍼
│   └── user-journeys/
│       ├── 01-place-bookmark.spec.ts   # 장소 북마크
│       ├── 02-board-crud.spec.ts       # 게시글 CRUD
│       └── 03-itinerary-crud.spec.ts   # 일정 CRUD
└── test-data/
    ├── users.ts                      # 테스트 사용자 데이터
    └── places.ts                     # 테스트 장소/게시글/일정 데이터
```

---

## 🔧 트러블슈팅

### 1. 타임아웃 에러

**증상**: "Timeout 30000ms exceeded"

**해결**:
```typescript
// playwright.config.ts에서 timeout 증가
use: {
  timeout: 60000, // 30초 → 60초
}
```

### 2. 엘리먼트를 찾을 수 없음

**증상**: "Element not found"

**원인**: UI에 `data-testid` 속성이 없음

**해결**:
1. **임시**: 다른 셀렉터 사용 (현재 테스트에 이미 구현됨)
   ```typescript
   // 우선순위: data-testid > 텍스트 > 클래스
   page.locator('[data-testid="place-card"], article, .place-item')
   ```

2. **장기**: UI 컴포넌트에 `data-testid` 추가
   ```tsx
   <div data-testid="place-card">
     <button data-testid="bookmark-button">북마크</button>
   </div>
   ```

### 3. 인증 실패

**증상**: "로그인 실패" 또는 "Unauthorized"

**확인사항**:
- `.env.test` 파일 존재 확인
- 테스트 계정이 실제로 존재하는지 확인
- 백엔드 서버가 실행 중인지 확인

### 4. 네트워크 에러

**증상**: API 요청 실패

**확인사항**:
- 개발 서버가 실행 중인지 확인 (`npm run dev`)
- `playwright.config.ts`의 `baseURL` 확인
- CORS 설정 확인

### 5. 다이얼로그 처리 실패

**증상**: "confirm 다이얼로그를 처리할 수 없음"

**해결**: 테스트에 다이얼로그 핸들러 추가됨
```typescript
page.on('dialog', dialog => dialog.accept());
```

---

## 📝 테스트 작성 가이드

### 1. 새 테스트 추가

```typescript
import { test, expect } from '../fixtures/base.fixture';

test.describe('새로운 시나리오', () => {
  test('사용자가 ...할 수 있다', async ({ page, authHelper, navHelper }) => {
    // 1. test.step으로 단계 구분
    await test.step('첫 번째 단계', async () => {
      // 테스트 코드
    });

    await test.step('두 번째 단계', async () => {
      // 테스트 코드
    });
  });
});
```

### 2. 인증이 필요한 테스트

```typescript
// 자동 로그인 픽스처 사용
test('테스트명', async ({ authenticatedPage, page }) => {
  // 이미 로그인된 상태
});
```

### 3. 여러 셀렉터 시도

```typescript
// 우선순위 순으로 시도
const element = page.locator(
  '[data-testid="button"], button:has-text("클릭"), .btn-primary'
);
```

### 4. 비동기 처리

```typescript
// URL 변경 대기
await page.waitForURL(/\/boards\/[^/]+$/, { timeout: 10000 });

// 엘리먼트 대기
await page.waitForSelector('[data-testid="card"]', { timeout: 5000 });

// 네트워크 대기
await page.waitForLoadState('networkidle');
```

---

## 🎯 Best Practices

### 1. 테스트 데이터 격리
```typescript
const testData = {
  title: `테스트 ${Date.now()}`, // 유니크한 데이터
};
```

### 2. 에러 핸들링
```typescript
try {
  await page.locator('[data-testid="button"]').click();
} catch {
  // fallback
  await page.locator('button').click();
}
```

### 3. 명확한 Assertion
```typescript
// Good
await expect(page.locator('h1')).toContainText('제목');

// Bad
expect(await page.locator('h1').textContent()).toBe('제목');
```

---

## 🔍 CI/CD 통합 (선택사항)

### GitHub Actions

`.github/workflows/e2e-tests.yml` 파일이 준비되어 있습니다.

**필요한 설정**:
1. GitHub Secrets에 테스트 계정 추가
   - `TEST_USER_EMAIL`
   - `TEST_USER_PASSWORD`

2. Workflow 활성화
   ```bash
   git push origin main
   ```

---

## 📈 다음 단계

### 추가 테스트 시나리오
1. 회원가입 플로우
2. 비밀번호 변경
3. 리뷰 작성/수정/삭제
4. 프로필 편집
5. 검색 기능

### UI 개선
- `data-testid` 속성 추가
- 로딩 상태 명확히
- 에러 메시지 일관성

### 성능 최적화
- 테스트 병렬 실행
- 재사용 가능한 setup 함수
- 불필요한 waitFor 제거

---

## 📞 문의

테스트 관련 문의사항이나 버그 발견 시:
1. GitHub Issues에 등록
2. 테스트 실패 로그 첨부
3. 스크린샷/Trace 파일 첨부

---

**Happy Testing!** 🎉
