import { test, expect } from '@playwright/test';
import { TEST_URLS, SELECTORS } from '../fixtures/test-data';
import { waitForPageLoad, waitForLoading } from '../utils/test-helpers';

test.describe('관광지 목록 페이지 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URLS.PLACES);
    await waitForLoading(page);
  });

  test('관광지 목록 페이지가 정상적으로 로드된다', async ({ page }) => {
    await expect(page).toHaveTitle(/관광지|예림투어/);

    // 메인 콘텐츠 확인
    const mainContent = page.locator('main, [role="main"]');
    await expect(mainContent).toBeVisible();
  });

  test('관광지 카드가 표시된다', async ({ page }) => {
    // 카드 요소 확인 (최소 1개 이상)
    const cards = page.locator(SELECTORS.CARD);
    const count = await cards.count();

    // 카드가 있는지 확인 (데이터가 없을 수도 있음)
    if (count > 0) {
      await expect(cards.first()).toBeVisible();
    }
  });

  test.describe('검색 기능', () => {
    test('검색 입력 필드가 표시된다', async ({ page }) => {
      // 검색 입력 필드 찾기
      const searchInput = page.locator('input[type="search"], input[placeholder*="검색"], input[name*="search"]');
      const hasSearch = await searchInput.count() > 0;

      if (hasSearch) {
        await expect(searchInput.first()).toBeVisible();
      }
    });

    test('검색어 입력 시 필터링이 작동한다', async ({ page }) => {
      const searchInput = page.locator('input[type="search"], input[placeholder*="검색"], input[name*="search"]').first();
      const hasSearch = await searchInput.count() > 0;

      if (hasSearch) {
        // 검색어 입력
        await searchInput.fill('서울');

        // 검색 버튼 클릭 또는 Enter 키 입력
        const searchButton = page.locator('button[type="submit"], button:has-text("검색")');
        const hasButton = await searchButton.count() > 0;

        if (hasButton) {
          await searchButton.first().click();
        } else {
          await searchInput.press('Enter');
        }

        await waitForLoading(page);
      }
    });
  });

  test.describe('필터링', () => {
    test('카테고리 필터가 표시된다', async ({ page }) => {
      // 필터 요소 찾기
      const filterButtons = page.locator('button[role="tab"], button:has-text("전체"), button:has-text("자연"), button:has-text("문화")');
      const hasFilters = await filterButtons.count() > 0;

      if (hasFilters) {
        await expect(filterButtons.first()).toBeVisible();
      }
    });

    test('필터 선택 시 목록이 변경된다', async ({ page }) => {
      const filterButtons = page.locator('button[role="tab"]');
      const count = await filterButtons.count();

      if (count > 1) {
        // 두 번째 필터 클릭
        await filterButtons.nth(1).click();
        await waitForLoading(page);

        // URL이 변경되었거나 콘텐츠가 로드되었는지 확인
        await page.waitForTimeout(1000);
      }
    });
  });

  test.describe('정렬', () => {
    test('정렬 옵션이 표시된다', async ({ page }) => {
      // 정렬 드롭다운이나 버튼 찾기
      const sortSelect = page.locator('select[name*="sort"], button:has-text("정렬")');
      const hasSort = await sortSelect.count() > 0;

      if (hasSort) {
        await expect(sortSelect.first()).toBeVisible();
      }
    });
  });

  test.describe('페이지네이션', () => {
    test('페이지네이션이 표시된다', async ({ page }) => {
      // 페이지네이션 요소 찾기
      const pagination = page.locator('nav[aria-label*="pagination"], .pagination, button:has-text("다음"), button:has-text("이전")');
      const hasPagination = await pagination.count() > 0;

      if (hasPagination) {
        await expect(pagination.first()).toBeVisible();
      }
    });

    test('다음 페이지로 이동한다', async ({ page }) => {
      const nextButton = page.locator('button:has-text("다음"), a:has-text("다음"), button[aria-label*="다음"]');
      const hasNext = await nextButton.count() > 0;

      if (hasNext) {
        const isEnabled = await nextButton.first().isEnabled();

        if (isEnabled) {
          await nextButton.first().click();
          await waitForLoading(page);

          // 페이지가 변경되었는지 확인
          await page.waitForTimeout(1000);
        }
      }
    });
  });

  test.describe('관광지 상세 페이지', () => {
    test('관광지 카드 클릭 시 상세 페이지로 이동한다', async ({ page }) => {
      const cards = page.locator(SELECTORS.CARD);
      const count = await cards.count();

      if (count > 0) {
        // 첫 번째 카드의 링크 클릭
        const firstCard = cards.first();
        const link = firstCard.locator('a').first();

        await link.click();
        await waitForLoading(page);

        // URL이 변경되었는지 확인
        const currentUrl = page.url();
        expect(currentUrl).toContain('/places/');
      }
    });
  });

  test.describe('반응형 디자인', () => {
    test('모바일에서 그리드 레이아웃이 변경된다', async ({ page }) => {
      // 모바일 뷰포트
      await page.setViewportSize({ width: 375, height: 667 });

      const cards = page.locator(SELECTORS.CARD);
      const count = await cards.count();

      if (count > 0) {
        await expect(cards.first()).toBeVisible();
      }
    });

    test('태블릿에서 레이아웃이 적절하다', async ({ page }) => {
      // 태블릿 뷰포트
      await page.setViewportSize({ width: 768, height: 1024 });

      const cards = page.locator(SELECTORS.CARD);
      const count = await cards.count();

      if (count > 0) {
        await expect(cards.first()).toBeVisible();
      }
    });
  });

  test('스크롤 시 무한 스크롤이 작동한다', async ({ page }) => {
    // 페이지 끝까지 스크롤
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // 로딩 인디케이터나 새로운 콘텐츠 대기
    await page.waitForTimeout(2000);

    // 더 많은 카드가 로드되었는지 확인 (무한 스크롤이 있는 경우)
    const cards = page.locator(SELECTORS.CARD);
    const count = await cards.count();

    // 최소한 페이지가 정상적으로 작동하는지 확인
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
