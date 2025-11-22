import { test as base, Page } from '@playwright/test';
import { AuthHelper } from '../helpers/auth.helper';
import { NavigationHelper } from '../helpers/navigation.helper';

type TestFixtures = {
  authHelper: AuthHelper;
  navHelper: NavigationHelper;
  authenticatedPage: Page;
};

export const test = base.extend<TestFixtures>({
  authHelper: async ({ page }, use) => {
    const authHelper = new AuthHelper(page);
    await use(authHelper);
  },

  navHelper: async ({ page }, use) => {
    const navHelper = new NavigationHelper(page);
    await use(navHelper);
  },

  authenticatedPage: async ({ page }, use) => {
    // 테스트 시작 전 자동 로그인
    const authHelper = new AuthHelper(page);

    const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_USER_PASSWORD || 'password123';

    try {
      await authHelper.login(testEmail, testPassword);
    } catch (error) {
      console.warn('자동 로그인 실패. 테스트 계정을 확인하세요.');
      console.warn('필요한 환경변수: TEST_USER_EMAIL, TEST_USER_PASSWORD');
      throw error;
    }

    await use(page);

    // 테스트 종료 후 로그아웃 (선택사항)
    try {
      await authHelper.logout();
    } catch {
      // 로그아웃 실패는 무시 (페이지가 이미 닫혔을 수 있음)
    }
  },
});

export { expect } from '@playwright/test';
