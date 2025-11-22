import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 설정
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // 테스트 디렉토리
  testDir: './tests/e2e',

  // 각 테스트의 최대 실행 시간
  timeout: 30 * 1000,

  // 각 테스트가 독립적으로 실행되도록 설정
  fullyParallel: true,

  // CI 환경에서 첫 번째 실패 시 테스트 중단
  forbidOnly: !!process.env.CI,

  // CI 환경에서 재시도 설정
  retries: process.env.CI ? 2 : 0,

  // 병렬 실행 워커 수
  workers: process.env.CI ? 1 : undefined,

  // 리포터 설정
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['list'],
  ],

  // 모든 프로젝트에 공통으로 적용되는 설정
  use: {
    // 기본 URL (개발 서버가 이미 실행 중이어야 함)
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // 테스트 실패 시 추적 정보 수집
    trace: 'on-first-retry',

    // 스크린샷 설정
    screenshot: 'only-on-failure',

    // 비디오 녹화
    video: 'retain-on-failure',

    // 액션 타임아웃
    actionTimeout: 10 * 1000,

    // 네비게이션 타임아웃
    navigationTimeout: 30 * 1000,
  },

  // 프로젝트 설정 (다양한 브라우저 환경)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // 모바일 뷰포트 테스트
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // 웹 서버 설정 제거 - 수동으로 개발 서버를 시작해야 함
  // 사용법: npm run dev를 먼저 실행한 후 테스트 실행
});
