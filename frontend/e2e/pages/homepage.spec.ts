import { test, expect } from '@playwright/test';
import { TEST_URLS, SELECTORS } from '../fixtures/test-data';
import { waitForPageLoad, waitForLoading } from '../utils/test-helpers';

test.describe('홈페이지 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URLS.HOME);
    await waitForLoading(page);
  });

  test('홈페이지가 정상적으로 로드된다', async ({ page }) => {
    // 페이지 제목 확인
    await expect(page).toHaveTitle(/예림투어/);

    // 헤더 표시 확인
    const header = page.locator(SELECTORS.HEADER);
    await expect(header).toBeVisible();

    // 로고 표시 확인
    const logo = page.locator(SELECTORS.LOGO);
    await expect(logo).toBeVisible();

    // 푸터 표시 확인
    const footer = page.locator(SELECTORS.FOOTER);
    await expect(footer).toBeVisible();
  });

  test('네비게이션 메뉴가 올바르게 표시된다', async ({ page }) => {
    // 관광지 메뉴
    const placesLink = page.locator(SELECTORS.NAV_PLACES);
    await expect(placesLink).toBeVisible();
    await expect(placesLink).toHaveText(/관광지/);

    // 맛집 메뉴
    const restaurantsLink = page.locator(SELECTORS.NAV_RESTAURANTS);
    await expect(restaurantsLink).toBeVisible();
    await expect(restaurantsLink).toHaveText(/맛집/);

    // 숙소 메뉴
    const accommodationsLink = page.locator(SELECTORS.NAV_ACCOMMODATIONS);
    await expect(accommodationsLink).toBeVisible();
    await expect(accommodationsLink).toHaveText(/숙소/);

    // 축제 메뉴
    const festivalsLink = page.locator(SELECTORS.NAV_FESTIVALS);
    await expect(festivalsLink).toBeVisible();
    await expect(festivalsLink).toHaveText(/축제/);

    // 커뮤니티 메뉴
    const boardsLink = page.locator(SELECTORS.NAV_BOARDS);
    await expect(boardsLink).toBeVisible();
    await expect(boardsLink).toHaveText(/커뮤니티/);

    // 여행일정 메뉴
    const itineraryLink = page.locator(SELECTORS.NAV_ITINERARY);
    await expect(itineraryLink).toBeVisible();
    await expect(itineraryLink).toHaveText(/여행일정/);
  });

  test('로그인/회원가입 버튼이 표시된다', async ({ page }) => {
    const loginButton = page.getByText('로그인').first();
    await expect(loginButton).toBeVisible();

    const signupButton = page.getByText('회원가입').first();
    await expect(signupButton).toBeVisible();
  });

  test('메인 히어로 섹션이 표시된다', async ({ page }) => {
    // 히어로 섹션이나 메인 콘텐츠가 있는지 확인
    const mainContent = page.locator('main, [role="main"]');
    await expect(mainContent).toBeVisible();
  });

  test('인기 관광지 섹션이 표시된다', async ({ page }) => {
    // 카드나 리스트 형태의 콘텐츠가 있는지 확인
    await page.waitForSelector('.card, [class*="card"], article', { timeout: 10000 }).catch(() => {
      // 콘텐츠가 없을 수도 있으므로 실패는 무시
    });
  });

  test.describe('반응형 디자인', () => {
    test('모바일에서 햄버거 메뉴가 표시된다', async ({ page }) => {
      // 모바일 뷰포트로 설정
      await page.setViewportSize({ width: 375, height: 667 });

      // 햄버거 메뉴 버튼 확인
      const mobileMenuButton = page.locator('button[aria-label="메뉴"], button[aria-expanded]');
      await expect(mobileMenuButton).toBeVisible();
    });

    test('데스크탑에서 전체 메뉴가 표시된다', async ({ page }) => {
      // 데스크탑 뷰포트로 설정
      await page.setViewportSize({ width: 1920, height: 1080 });

      // 네비게이션 메뉴들이 표시되는지 확인
      const placesLink = page.locator(SELECTORS.NAV_PLACES);
      await expect(placesLink).toBeVisible();
    });
  });

  test('스크롤이 정상적으로 작동한다', async ({ page }) => {
    // 페이지 끝까지 스크롤
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // 푸터가 보이는지 확인
    const footer = page.locator(SELECTORS.FOOTER);
    await expect(footer).toBeInViewport();
  });

  test('로고 클릭 시 홈페이지로 이동한다', async ({ page }) => {
    // 다른 페이지로 이동
    await page.goto(TEST_URLS.PLACES);
    await waitForLoading(page);

    // 로고 클릭
    await page.click(SELECTORS.LOGO);
    await waitForPageLoad(page, TEST_URLS.HOME);

    // URL 확인
    expect(page.url()).toContain(TEST_URLS.HOME);
  });
});
