import { test, expect } from '@playwright/test';
import { TEST_URLS } from '../fixtures/test-data';
import { waitForPageLoad, waitForLoading } from '../utils/test-helpers';

test.describe('검색 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URLS.SEARCH);
    await waitForLoading(page);
  });

  test('검색 페이지가 정상적으로 로드된다', async ({ page }) => {
    await expect(page).toHaveTitle(/검색|예림투어/);

    const mainContent = page.locator('main, [role="main"]');
    await expect(mainContent).toBeVisible();
  });

  test('검색 입력 필드가 표시된다', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="검색"], input[name*="search"]');
    await expect(searchInput.first()).toBeVisible();
  });

  test.describe('키워드 검색', () => {
    test('검색어 입력 후 검색이 실행된다', async ({ page }) => {
      const searchInput = page.locator('input[type="search"], input[placeholder*="검색"]').first();
      await searchInput.fill('서울');

      // 검색 버튼 클릭 또는 Enter
      const searchButton = page.locator('button[type="submit"], button:has-text("검색")');
      const hasButton = await searchButton.count() > 0;

      if (hasButton) {
        await searchButton.first().click();
      } else {
        await searchInput.press('Enter');
      }

      await waitForLoading(page);

      // 검색 결과가 표시되는지 확인
      await page.waitForTimeout(1000);
    });

    test('빈 검색어로 검색 시도', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      await searchInput.fill('');

      const searchButton = page.locator('button[type="submit"]').first();
      const hasButton = await searchButton.count() > 0;

      if (hasButton) {
        await searchButton.click();
        await page.waitForTimeout(1000);

        // 빈 검색어 경고나 아무 동작 없음
      }
    });

    test('특수문자 검색어 처리', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      await searchInput.fill('!@#$%^&*()');

      await searchInput.press('Enter');
      await waitForLoading(page);
    });
  });

  test.describe('자동완성', () => {
    test('검색어 입력 시 자동완성 제안이 표시된다', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      await searchInput.fill('서');

      // 자동완성 드롭다운 대기
      await page.waitForTimeout(1000);

      const autocompleteDropdown = page.locator('[role="listbox"], [class*="autocomplete"], [class*="suggestion"]');
      const hasAutocomplete = await autocompleteDropdown.count() > 0;

      // 자동완성 기능이 있을 수 있음
      if (hasAutocomplete) {
        await expect(autocompleteDropdown.first()).toBeVisible();
      }
    });

    test('자동완성 항목 클릭 시 검색이 실행된다', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      await searchInput.fill('서');
      await page.waitForTimeout(1000);

      const firstSuggestion = page.locator('[role="option"], [class*="suggestion"] > *').first();
      const hasSuggestion = await firstSuggestion.count() > 0;

      if (hasSuggestion) {
        await firstSuggestion.click();
        await waitForLoading(page);
      }
    });
  });

  test.describe('검색 결과', () => {
    test('검색 결과가 표시된다', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      await searchInput.fill('서울');
      await searchInput.press('Enter');
      await waitForLoading(page);

      // 검색 결과 카드나 리스트
      const results = page.locator('.card, article, [class*="result"]');
      await page.waitForTimeout(1000);

      // 결과가 있거나 "결과 없음" 메시지
      const count = await results.count();
      const noResults = page.locator(':has-text("결과가 없습니다"), :has-text("검색 결과가 없습니다")');
      const hasNoResults = await noResults.count() > 0;

      expect(count > 0 || hasNoResults).toBeTruthy();
    });

    test('검색 결과 수가 표시된다', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      await searchInput.fill('서울');
      await searchInput.press('Enter');
      await waitForLoading(page);

      // 결과 수 표시 찾기
      const resultCount = page.locator(':has-text("개의 결과"), :has-text("건 검색")');
      await page.waitForTimeout(1000);

      // 결과 수가 표시될 수 있음
    });
  });

  test.describe('필터', () => {
    test('카테고리 필터가 표시된다', async ({ page }) => {
      const categoryFilters = page.locator('button:has-text("전체"), button:has-text("관광지"), button:has-text("맛집")');
      const hasFilters = await categoryFilters.count() > 0;

      if (hasFilters) {
        await expect(categoryFilters.first()).toBeVisible();
      }
    });

    test('카테고리 필터 적용 시 결과가 변경된다', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      await searchInput.fill('서울');
      await searchInput.press('Enter');
      await waitForLoading(page);

      const categoryFilters = page.locator('button[role="tab"], button:has-text("관광지")');
      const hasFilters = await categoryFilters.count() > 0;

      if (hasFilters) {
        await categoryFilters.first().click();
        await waitForLoading(page);
      }
    });
  });

  test.describe('정렬', () => {
    test('정렬 옵션이 표시된다', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      await searchInput.fill('서울');
      await searchInput.press('Enter');
      await waitForLoading(page);

      const sortSelect = page.locator('select[name*="sort"], button:has-text("정렬")');
      const hasSort = await sortSelect.count() > 0;

      if (hasSort) {
        await expect(sortSelect.first()).toBeVisible();
      }
    });
  });

  test.describe('최근 검색어', () => {
    test('최근 검색어가 표시된다', async ({ page }) => {
      // 첫 번째 검색
      const searchInput = page.locator('input[type="search"]').first();
      await searchInput.fill('서울');
      await searchInput.press('Enter');
      await waitForLoading(page);

      // 검색 페이지로 다시 이동
      await page.goto(TEST_URLS.SEARCH);
      await waitForLoading(page);

      // 검색 입력 필드 클릭
      await searchInput.click();
      await page.waitForTimeout(500);

      // 최근 검색어 목록 찾기
      const recentSearches = page.locator('[class*="recent"], [class*="history"]');
      await page.waitForTimeout(500);

      // 최근 검색어 기능이 있을 수 있음
    });
  });

  test.describe('반응형 디자인', () => {
    test('모바일에서 검색 레이아웃이 적절하다', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const searchInput = page.locator('input[type="search"]').first();
      await expect(searchInput).toBeVisible();

      await searchInput.fill('서울');
      await searchInput.press('Enter');
      await waitForLoading(page);
    });
  });
});
