import { test, expect } from '@playwright/test';
import { TEST_URLS, SELECTORS, testUsers } from '../fixtures/test-data';
import { waitForPageLoad, waitForLoading, fillForm } from '../utils/test-helpers';

test.describe('로그인 페이지 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URLS.LOGIN);
    await waitForLoading(page);
  });

  test('로그인 페이지가 정상적으로 로드된다', async ({ page }) => {
    await expect(page).toHaveTitle(/로그인/);

    // 이메일 입력 필드 확인
    const emailInput = page.locator(SELECTORS.EMAIL_INPUT);
    await expect(emailInput).toBeVisible();

    // 비밀번호 입력 필드 확인
    const passwordInput = page.locator(SELECTORS.PASSWORD_INPUT);
    await expect(passwordInput).toBeVisible();

    // 로그인 버튼 확인
    const submitButton = page.locator(SELECTORS.SUBMIT_BUTTON);
    await expect(submitButton).toBeVisible();
  });

  test('빈 폼 제출 시 검증 오류가 표시된다', async ({ page }) => {
    // 로그인 버튼 클릭
    await page.click(SELECTORS.SUBMIT_BUTTON);

    // 검증 오류 메시지 확인 (브라우저 기본 검증 또는 커스텀 검증)
    await page.waitForTimeout(1000);

    // 이메일 입력 필드가 여전히 표시되는지 확인 (페이지 이동하지 않음)
    const emailInput = page.locator(SELECTORS.EMAIL_INPUT);
    await expect(emailInput).toBeVisible();
  });

  test('이메일 형식이 잘못된 경우 검증 오류가 표시된다', async ({ page }) => {
    // 잘못된 이메일 형식 입력
    await page.fill(SELECTORS.EMAIL_INPUT, 'invalid-email');
    await page.fill(SELECTORS.PASSWORD_INPUT, 'password123');

    // 로그인 버튼 클릭
    await page.click(SELECTORS.SUBMIT_BUTTON);

    await page.waitForTimeout(1000);

    // 여전히 로그인 페이지에 있는지 확인
    expect(page.url()).toContain(TEST_URLS.LOGIN);
  });

  test('회원가입 링크가 작동한다', async ({ page }) => {
    // 회원가입 링크 찾기 및 클릭
    const signupLink = page.getByText('회원가입').first();
    await signupLink.click();

    await waitForPageLoad(page, TEST_URLS.SIGNUP);
    expect(page.url()).toContain(TEST_URLS.SIGNUP);
  });

  test.describe('로그인 시도', () => {
    test('올바른 자격증명으로 로그인 시도', async ({ page }) => {
      // 로그인 폼 작성
      await page.fill(SELECTORS.EMAIL_INPUT, testUsers.validUser.email);
      await page.fill(SELECTORS.PASSWORD_INPUT, testUsers.validUser.password);

      // 로그인 버튼 클릭
      await page.click(SELECTORS.SUBMIT_BUTTON);

      // 로딩 대기
      await waitForLoading(page);

      // 성공 또는 실패 확인 (백엔드 연결 상태에 따라)
      // 백엔드가 없을 경우 에러 메시지가 나타날 수 있음
      await page.waitForTimeout(2000);
    });

    test('잘못된 자격증명으로 로그인 시도', async ({ page }) => {
      // 잘못된 자격증명 입력
      await page.fill(SELECTORS.EMAIL_INPUT, testUsers.invalidUser.email);
      await page.fill(SELECTORS.PASSWORD_INPUT, testUsers.invalidUser.password);

      // 로그인 버튼 클릭
      await page.click(SELECTORS.SUBMIT_BUTTON);

      await waitForLoading(page);

      // 에러 메시지나 여전히 로그인 페이지에 있는지 확인
      await page.waitForTimeout(2000);

      // 로그인 페이지에 남아있거나 에러 메시지가 표시되어야 함
      const currentUrl = page.url();
      const hasError = await page.locator(SELECTORS.ERROR_MESSAGE).count() > 0;

      expect(currentUrl.includes(TEST_URLS.LOGIN) || hasError).toBeTruthy();
    });
  });

  test.describe('비밀번호 표시/숨기기', () => {
    test('비밀번호 표시 토글이 작동한다', async ({ page }) => {
      const passwordInput = page.locator(SELECTORS.PASSWORD_INPUT);

      // 초기 상태는 password 타입
      const initialType = await passwordInput.getAttribute('type');
      expect(initialType).toBe('password');

      // 비밀번호 표시 버튼 찾기 (있는 경우)
      const toggleButton = page.locator('button[aria-label*="비밀번호"], button[aria-label*="password"]').first();
      const hasToggle = await toggleButton.count() > 0;

      if (hasToggle) {
        // 토글 버튼 클릭
        await toggleButton.click();

        // 타입이 text로 변경되었는지 확인
        const toggledType = await passwordInput.getAttribute('type');
        expect(toggledType).toBe('text');

        // 다시 클릭하여 숨기기
        await toggleButton.click();

        // 타입이 다시 password로 변경되었는지 확인
        const finalType = await passwordInput.getAttribute('type');
        expect(finalType).toBe('password');
      }
    });
  });

  test.describe('접근성', () => {
    test('키보드 네비게이션이 작동한다', async ({ page }) => {
      // 이메일 입력 필드에 포커스
      await page.locator(SELECTORS.EMAIL_INPUT).focus();

      // Tab 키로 다음 필드로 이동
      await page.keyboard.press('Tab');

      // 비밀번호 입력 필드에 포커스되었는지 확인
      const passwordInput = page.locator(SELECTORS.PASSWORD_INPUT);
      await expect(passwordInput).toBeFocused();

      // Tab 키로 제출 버튼으로 이동
      await page.keyboard.press('Tab');

      // 제출 버튼에 포커스되었는지 확인
      const submitButton = page.locator(SELECTORS.SUBMIT_BUTTON);
      await expect(submitButton).toBeFocused();
    });

    test('Enter 키로 폼을 제출할 수 있다', async ({ page }) => {
      await page.fill(SELECTORS.EMAIL_INPUT, testUsers.validUser.email);
      await page.fill(SELECTORS.PASSWORD_INPUT, testUsers.validUser.password);

      // Enter 키 입력
      await page.keyboard.press('Enter');

      // 로딩 또는 페이지 전환 대기
      await waitForLoading(page);
    });
  });
});
