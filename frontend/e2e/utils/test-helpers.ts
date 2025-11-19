import { Page, expect } from '@playwright/test';

/**
 * 테스트 헬퍼 함수 모음
 */

/**
 * 페이지 로드 대기 및 검증
 */
export async function waitForPageLoad(page: Page, url: string, title?: string) {
  await page.waitForLoadState('networkidle');

  if (title) {
    await expect(page).toHaveTitle(new RegExp(title, 'i'));
  }

  expect(page.url()).toContain(url);
}

/**
 * 특정 텍스트를 포함하는 요소 클릭
 */
export async function clickByText(page: Page, text: string | RegExp) {
  await page.getByText(text).click();
  await page.waitForLoadState('networkidle');
}

/**
 * 링크 클릭 및 네비게이션 대기
 */
export async function clickLink(page: Page, href: string) {
  await page.click(`a[href="${href}"]`);
  await page.waitForLoadState('networkidle');
}

/**
 * 폼 입력 및 제출
 */
export async function fillForm(
  page: Page,
  fields: Array<{ selector: string; value: string }>,
  submitSelector: string
) {
  for (const field of fields) {
    await page.fill(field.selector, field.value);
  }

  await page.click(submitSelector);
  await page.waitForLoadState('networkidle');
}

/**
 * 스크린샷 캡처
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({
    path: `e2e/screenshots/${name}.png`,
    fullPage: true,
  });
}

/**
 * 에러 메시지 확인
 */
export async function expectErrorMessage(page: Page, message: string | RegExp) {
  const errorElement = page.locator('[role="alert"], .error, .error-message');
  await expect(errorElement).toContainText(message);
}

/**
 * 성공 메시지 확인
 */
export async function expectSuccessMessage(page: Page, message: string | RegExp) {
  const successElement = page.locator('[role="status"], .success, .success-message');
  await expect(successElement).toContainText(message);
}

/**
 * 특정 요소가 표시될 때까지 대기
 */
export async function waitForElement(page: Page, selector: string, timeout = 5000) {
  await page.waitForSelector(selector, { timeout, state: 'visible' });
}

/**
 * 로딩 완료 대기
 */
export async function waitForLoading(page: Page) {
  // 로딩 스피너가 사라질 때까지 대기
  await page.waitForSelector('.loading, [aria-busy="true"]', { state: 'detached', timeout: 10000 }).catch(() => {
    // 로딩 요소가 없으면 무시
  });

  await page.waitForLoadState('networkidle');
}

/**
 * 모바일 뷰포트 설정
 */
export async function setMobileViewport(page: Page) {
  await page.setViewportSize({ width: 375, height: 667 });
}

/**
 * 데스크탑 뷰포트 설정
 */
export async function setDesktopViewport(page: Page) {
  await page.setViewportSize({ width: 1920, height: 1080 });
}

/**
 * 스크롤하여 요소가 보이도록 함
 */
export async function scrollToElement(page: Page, selector: string) {
  await page.locator(selector).scrollIntoViewIfNeeded();
}

/**
 * API 응답 대기 및 검증
 */
export async function waitForAPIResponse(
  page: Page,
  urlPattern: string | RegExp,
  expectedStatus = 200
) {
  const response = await page.waitForResponse(
    (response) => {
      const url = response.url();
      const matches = typeof urlPattern === 'string'
        ? url.includes(urlPattern)
        : urlPattern.test(url);
      return matches && response.status() === expectedStatus;
    },
    { timeout: 10000 }
  );

  return response;
}
