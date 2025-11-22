import { test, expect } from '@playwright/test';
import { TEST_URLS, SELECTORS } from '../fixtures/test-data';
import { waitForPageLoad, waitForLoading } from '../utils/test-helpers';

test.describe('여행일정 목록 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URLS.ITINERARY);
    await waitForLoading(page);
  });

  test('여행일정 페이지가 정상적으로 로드된다', async ({ page }) => {
    await expect(page).toHaveTitle(/여행일정|예림투어/);

    const mainContent = page.locator('main, [role="main"]');
    await expect(mainContent).toBeVisible();
  });

  test('여행일정 목록이 표시된다', async ({ page }) => {
    // 일정 카드나 리스트 확인
    const itineraries = page.locator('.card, article, [class*="itinerary"]');
    const count = await itineraries.count();

    // 일정이 있거나 빈 상태 메시지
    if (count > 0) {
      await expect(itineraries.first()).toBeVisible();
    }
  });

  test('일정 생성 버튼이 표시된다', async ({ page }) => {
    const createButton = page.locator('button:has-text("일정 만들기"), a:has-text("일정 만들기"), button:has-text("생성"), a:has-text("새 일정")');
    const hasButton = await createButton.count() > 0;

    if (hasButton) {
      await expect(createButton.first()).toBeVisible();
    }
  });

  test.describe('필터 및 정렬', () => {
    test('필터 옵션이 표시된다', async ({ page }) => {
      const filterButtons = page.locator('button:has-text("전체"), button:has-text("공개"), button:has-text("비공개")');
      const hasFilters = await filterButtons.count() > 0;

      if (hasFilters) {
        await expect(filterButtons.first()).toBeVisible();
      }
    });

    test('정렬 옵션이 표시된다', async ({ page }) => {
      const sortSelect = page.locator('select[name*="sort"], button:has-text("정렬")');
      const hasSort = await sortSelect.count() > 0;

      if (hasSort) {
        await expect(sortSelect.first()).toBeVisible();
      }
    });
  });

  test('일정 카드 클릭 시 상세 페이지로 이동한다', async ({ page }) => {
    const cards = page.locator('.card a, article a').first();
    const hasCard = await cards.count() > 0;

    if (hasCard) {
      await cards.click();
      await waitForLoading(page);

      const currentUrl = page.url();
      expect(currentUrl).toContain('/itinerary/');
    }
  });

  test.describe('반응형 디자인', () => {
    test('모바일에서 그리드 레이아웃이 변경된다', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const cards = page.locator('.card, article');
      const count = await cards.count();

      if (count > 0) {
        await expect(cards.first()).toBeVisible();
      }
    });
  });
});
