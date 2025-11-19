import { test, expect } from '@playwright/test';
import { TEST_URLS } from '../fixtures/test-data';
import { waitForPageLoad, waitForLoading } from '../utils/test-helpers';

test.describe('페이지 네비게이션 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URLS.HOME);
    await waitForLoading(page);
  });

  test('관광지 페이지로 이동한다', async ({ page }) => {
    await page.click('a[href="/places"]');
    await waitForPageLoad(page, '/places');

    expect(page.url()).toContain('/places');
    await expect(page).toHaveTitle(/관광지|예림투어/);
  });

  test('맛집 페이지로 이동한다', async ({ page }) => {
    await page.click('a[href="/restaurants"]');
    await waitForPageLoad(page, '/restaurants');

    expect(page.url()).toContain('/restaurants');
    await expect(page).toHaveTitle(/맛집|예림투어/);
  });

  test('숙소 페이지로 이동한다', async ({ page }) => {
    await page.click('a[href="/accommodations"]');
    await waitForPageLoad(page, '/accommodations');

    expect(page.url()).toContain('/accommodations');
    await expect(page).toHaveTitle(/숙소|예림투어/);
  });

  test('축제 페이지로 이동한다', async ({ page }) => {
    await page.click('a[href="/festivals"]');
    await waitForPageLoad(page, '/festivals');

    expect(page.url()).toContain('/festivals');
    await expect(page).toHaveTitle(/축제|예림투어/);
  });

  test('커뮤니티 페이지로 이동한다', async ({ page }) => {
    await page.click('a[href="/boards"]');
    await waitForPageLoad(page, '/boards');

    expect(page.url()).toContain('/boards');
    await expect(page).toHaveTitle(/커뮤니티|예림투어/);
  });

  test('여행일정 페이지로 이동한다', async ({ page }) => {
    await page.click('a[href="/itinerary"]');
    await waitForPageLoad(page, '/itinerary');

    expect(page.url()).toContain('/itinerary');
    await expect(page).toHaveTitle(/여행일정|예림투어/);
  });

  test('로그인 페이지로 이동한다', async ({ page }) => {
    await page.click('a[href="/login"]');
    await waitForPageLoad(page, '/login');

    expect(page.url()).toContain('/login');
    await expect(page).toHaveTitle(/로그인|예림투어/);
  });

  test('회원가입 페이지로 이동한다', async ({ page }) => {
    await page.click('a[href="/signup"]');
    await waitForPageLoad(page, '/signup');

    expect(page.url()).toContain('/signup');
    await expect(page).toHaveTitle(/회원가입|예림투어/);
  });

  test.describe('뒤로가기/앞으로가기', () => {
    test('브라우저 뒤로가기가 작동한다', async ({ page }) => {
      // 관광지 페이지로 이동
      await page.click('a[href="/places"]');
      await waitForPageLoad(page, '/places');

      // 뒤로가기
      await page.goBack();
      await waitForLoading(page);

      // 홈페이지로 돌아왔는지 확인
      expect(page.url()).toMatch(/\/$|\/index/);
    });

    test('브라우저 앞으로가기가 작동한다', async ({ page }) => {
      // 관광지 페이지로 이동
      await page.click('a[href="/places"]');
      await waitForPageLoad(page, '/places');

      // 뒤로가기
      await page.goBack();
      await waitForLoading(page);

      // 앞으로가기
      await page.goForward();
      await waitForLoading(page);

      // 관광지 페이지로 돌아왔는지 확인
      expect(page.url()).toContain('/places');
    });
  });

  test.describe('모바일 네비게이션', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
    });

    test('모바일 메뉴를 열고 닫을 수 있다', async ({ page }) => {
      // 햄버거 메뉴 버튼 찾기
      const menuButton = page.locator('button[aria-label="메뉴"], button[aria-expanded]').first();
      await expect(menuButton).toBeVisible();

      // 메뉴 열기
      await menuButton.click();
      await page.waitForTimeout(500); // 애니메이션 대기

      // 메뉴가 열렸는지 확인 (aria-expanded 속성 확인)
      const isExpanded = await menuButton.getAttribute('aria-expanded');
      expect(isExpanded).toBe('true');

      // 메뉴 닫기
      await menuButton.click();
      await page.waitForTimeout(500);

      const isCollapsed = await menuButton.getAttribute('aria-expanded');
      expect(isCollapsed).toBe('false');
    });

    test('모바일 메뉴에서 페이지 이동이 가능하다', async ({ page }) => {
      // 햄버거 메뉴 열기
      const menuButton = page.locator('button[aria-label="메뉴"], button[aria-expanded]').first();
      await menuButton.click();
      await page.waitForTimeout(500);

      // 관광지 메뉴 클릭
      await page.click('a[href="/places"]');
      await waitForPageLoad(page, '/places');

      expect(page.url()).toContain('/places');
    });
  });
});
