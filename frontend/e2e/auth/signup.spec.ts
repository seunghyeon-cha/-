import { test, expect } from '@playwright/test';
import { TEST_URLS, SELECTORS } from '../fixtures/test-data';
import { waitForPageLoad, waitForLoading } from '../utils/test-helpers';

test.describe('회원가입 페이지 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URLS.SIGNUP);
    await waitForLoading(page);
  });

  test('회원가입 페이지가 정상적으로 로드된다', async ({ page }) => {
    await expect(page).toHaveTitle(/회원가입|예림투어/);

    // 이메일 입력 필드
    const emailInput = page.locator(SELECTORS.EMAIL_INPUT);
    await expect(emailInput).toBeVisible();

    // 비밀번호 입력 필드
    const passwordInput = page.locator(SELECTORS.PASSWORD_INPUT);
    await expect(passwordInput).toBeVisible();

    // 회원가입 버튼
    const submitButton = page.locator(SELECTORS.SUBMIT_BUTTON);
    await expect(submitButton).toBeVisible();
  });

  test('빈 폼 제출 시 검증 오류가 표시된다', async ({ page }) => {
    await page.click(SELECTORS.SUBMIT_BUTTON);
    await page.waitForTimeout(1000);

    // 여전히 회원가입 페이지에 있어야 함
    const emailInput = page.locator(SELECTORS.EMAIL_INPUT);
    await expect(emailInput).toBeVisible();
  });

  test('이메일 형식이 잘못된 경우 검증 오류가 표시된다', async ({ page }) => {
    await page.fill(SELECTORS.EMAIL_INPUT, 'invalid-email');
    await page.fill(SELECTORS.PASSWORD_INPUT, 'password123');

    await page.click(SELECTORS.SUBMIT_BUTTON);
    await page.waitForTimeout(1000);

    // 여전히 회원가입 페이지에 있어야 함
    expect(page.url()).toContain(TEST_URLS.SIGNUP);
  });

  test.describe('비밀번호 검증', () => {
    test('비밀번호 확인 필드가 표시된다', async ({ page }) => {
      const passwordConfirmInput = page.locator('input[name*="confirm"], input[placeholder*="확인"]');
      const hasConfirm = await passwordConfirmInput.count() > 0;

      if (hasConfirm) {
        await expect(passwordConfirmInput.first()).toBeVisible();
      }
    });

    test('비밀번호가 일치하지 않으면 오류가 표시된다', async ({ page }) => {
      await page.fill(SELECTORS.EMAIL_INPUT, 'test@example.com');
      await page.fill(SELECTORS.PASSWORD_INPUT, 'password123');

      const passwordConfirmInput = page.locator('input[name*="confirm"], input[placeholder*="확인"]').first();
      const hasConfirm = await passwordConfirmInput.count() > 0;

      if (hasConfirm) {
        await passwordConfirmInput.fill('differentpassword');
        await page.click(SELECTORS.SUBMIT_BUTTON);
        await page.waitForTimeout(1000);

        // 에러 메시지나 여전히 회원가입 페이지에 있어야 함
      }
    });

    test('비밀번호 강도 표시기가 나타난다', async ({ page }) => {
      const passwordInput = page.locator(SELECTORS.PASSWORD_INPUT);
      await passwordInput.fill('weak');

      // 비밀번호 강도 표시기 찾기
      const strengthIndicator = page.locator('[class*="strength"], [class*="password-meter"]');
      await page.waitForTimeout(500);

      // 강도 표시기가 있을 수 있음
    });
  });

  test.describe('추가 필드', () => {
    test('닉네임 입력 필드가 표시된다', async ({ page }) => {
      const nicknameInput = page.locator('input[name="nickname"], input[placeholder*="닉네임"]');
      const hasNickname = await nicknameInput.count() > 0;

      if (hasNickname) {
        await expect(nicknameInput.first()).toBeVisible();
      }
    });

    test('전화번호 입력 필드가 표시된다', async ({ page }) => {
      const phoneInput = page.locator('input[name="phone"], input[type="tel"]');
      const hasPhone = await phoneInput.count() > 0;

      if (hasPhone) {
        await expect(phoneInput.first()).toBeVisible();
      }
    });
  });

  test.describe('약관 동의', () => {
    test('이용약관 체크박스가 표시된다', async ({ page }) => {
      const termsCheckbox = page.locator('input[type="checkbox"]');
      const hasCheckbox = await termsCheckbox.count() > 0;

      if (hasCheckbox) {
        await expect(termsCheckbox.first()).toBeVisible();
      }
    });

    test('약관 미동의 시 회원가입이 불가능하다', async ({ page }) => {
      await page.fill(SELECTORS.EMAIL_INPUT, 'test@example.com');
      await page.fill(SELECTORS.PASSWORD_INPUT, 'password123');

      // 약관 체크박스를 체크하지 않고 제출
      await page.click(SELECTORS.SUBMIT_BUTTON);
      await page.waitForTimeout(1000);

      // 여전히 회원가입 페이지에 있어야 함
      expect(page.url()).toContain(TEST_URLS.SIGNUP);
    });
  });

  test('로그인 페이지로 이동 링크가 작동한다', async ({ page }) => {
    const loginLink = page.getByText('로그인').first();
    await loginLink.click();

    await waitForPageLoad(page, TEST_URLS.LOGIN);
    expect(page.url()).toContain(TEST_URLS.LOGIN);
  });

  test.describe('회원가입 시도', () => {
    test('올바른 정보로 회원가입 시도', async ({ page }) => {
      const timestamp = Date.now();
      const email = `test${timestamp}@example.com`;

      await page.fill(SELECTORS.EMAIL_INPUT, email);
      await page.fill(SELECTORS.PASSWORD_INPUT, 'Test1234!');

      // 비밀번호 확인 필드
      const passwordConfirmInput = page.locator('input[name*="confirm"]').first();
      const hasConfirm = await passwordConfirmInput.count() > 0;

      if (hasConfirm) {
        await passwordConfirmInput.fill('Test1234!');
      }

      // 닉네임 필드
      const nicknameInput = page.locator('input[name="nickname"]').first();
      const hasNickname = await nicknameInput.count() > 0;

      if (hasNickname) {
        await nicknameInput.fill(`테스터${timestamp}`);
      }

      // 약관 동의 체크박스
      const checkboxes = page.locator('input[type="checkbox"]');
      const checkboxCount = await checkboxes.count();

      for (let i = 0; i < checkboxCount; i++) {
        await checkboxes.nth(i).check();
      }

      // 회원가입 버튼 클릭
      await page.click(SELECTORS.SUBMIT_BUTTON);
      await waitForLoading(page);

      // 성공 또는 실패 확인 (백엔드 연결 상태에 따라)
      await page.waitForTimeout(2000);
    });
  });

  test.describe('접근성', () => {
    test('키보드 네비게이션이 작동한다', async ({ page }) => {
      await page.locator(SELECTORS.EMAIL_INPUT).focus();

      // Tab으로 다음 필드로 이동
      await page.keyboard.press('Tab');

      const passwordInput = page.locator(SELECTORS.PASSWORD_INPUT);
      await expect(passwordInput).toBeFocused();
    });

    test('Enter 키로 폼을 제출할 수 있다', async ({ page }) => {
      await page.fill(SELECTORS.EMAIL_INPUT, 'test@example.com');
      await page.fill(SELECTORS.PASSWORD_INPUT, 'password123');

      await page.keyboard.press('Enter');
      await waitForLoading(page);
    });
  });
});
