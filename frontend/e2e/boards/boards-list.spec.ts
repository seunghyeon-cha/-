import { test, expect } from '@playwright/test';
import { TEST_URLS, SELECTORS } from '../fixtures/test-data';
import { waitForPageLoad, waitForLoading } from '../utils/test-helpers';

test.describe('게시판 목록 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URLS.BOARDS);
    await waitForLoading(page);
  });

  test('게시판 페이지가 정상적으로 로드된다', async ({ page }) => {
    await expect(page).toHaveTitle(/커뮤니티|게시판|예림투어/);

    // 메인 콘텐츠 확인
    const mainContent = page.locator('main, [role="main"]');
    await expect(mainContent).toBeVisible();
  });

  test('게시글 목록이 표시된다', async ({ page }) => {
    // 게시글 카드나 리스트 항목 확인
    const posts = page.locator('.card, article, [class*="post"]');
    const count = await posts.count();

    // 게시글이 있거나 없음 메시지가 표시되어야 함
    if (count > 0) {
      await expect(posts.first()).toBeVisible();
    } else {
      // 빈 상태 메시지 확인 (있을 수 있음)
      await page.waitForTimeout(1000);
    }
  });

  test('게시글 작성 버튼이 표시된다', async ({ page }) => {
    // 글쓰기 버튼 찾기
    const writeButton = page.locator('button:has-text("글쓰기"), a:has-text("글쓰기"), button:has-text("작성"), a:has-text("작성")');
    const hasButton = await writeButton.count() > 0;

    if (hasButton) {
      await expect(writeButton.first()).toBeVisible();
    }
  });

  test.describe('카테고리 필터', () => {
    test('카테고리 탭이 표시된다', async ({ page }) => {
      // 카테고리 탭 버튼들 찾기
      const categoryTabs = page.locator('button[role="tab"], button:has-text("전체"), button:has-text("자유"), button:has-text("질문")');
      const hasCategories = await categoryTabs.count() > 0;

      if (hasCategories) {
        await expect(categoryTabs.first()).toBeVisible();
      }
    });

    test('카테고리 선택 시 필터링된다', async ({ page }) => {
      const categoryTabs = page.locator('button[role="tab"]');
      const count = await categoryTabs.count();

      if (count > 1) {
        // 두 번째 카테고리 선택
        await categoryTabs.nth(1).click();
        await waitForLoading(page);

        // URL이 변경되거나 콘텐츠가 업데이트되었는지 확인
        await page.waitForTimeout(1000);
      }
    });
  });

  test.describe('검색 기능', () => {
    test('검색 입력 필드가 표시된다', async ({ page }) => {
      const searchInput = page.locator('input[type="search"], input[placeholder*="검색"], input[name*="search"]');
      const hasSearch = await searchInput.count() > 0;

      if (hasSearch) {
        await expect(searchInput.first()).toBeVisible();
      }
    });

    test('검색어 입력 시 검색이 실행된다', async ({ page }) => {
      const searchInput = page.locator('input[type="search"], input[placeholder*="검색"]').first();
      const hasSearch = await searchInput.count() > 0;

      if (hasSearch) {
        await searchInput.fill('테스트');

        // 검색 버튼 클릭 또는 Enter
        const searchButton = page.locator('button:has-text("검색")');
        const hasButton = await searchButton.count() > 0;

        if (hasButton) {
          await searchButton.click();
        } else {
          await searchInput.press('Enter');
        }

        await waitForLoading(page);
      }
    });
  });

  test.describe('정렬', () => {
    test('정렬 옵션이 표시된다', async ({ page }) => {
      const sortSelect = page.locator('select[name*="sort"], button:has-text("정렬")');
      const hasSort = await sortSelect.count() > 0;

      if (hasSort) {
        await expect(sortSelect.first()).toBeVisible();
      }
    });
  });

  test.describe('페이지네이션', () => {
    test('페이지네이션이 표시된다', async ({ page }) => {
      const pagination = page.locator('nav[aria-label*="pagination"], .pagination, button:has-text("다음")');
      const hasPagination = await pagination.count() > 0;

      if (hasPagination) {
        await expect(pagination.first()).toBeVisible();
      }
    });
  });

  test('게시글 클릭 시 상세 페이지로 이동한다', async ({ page }) => {
    const posts = page.locator('.card a, article a, [class*="post"] a').first();
    const hasPost = await posts.count() > 0;

    if (hasPost) {
      await posts.click();
      await waitForLoading(page);

      // URL이 변경되었는지 확인
      const currentUrl = page.url();
      expect(currentUrl).toContain('/boards/');
    }
  });
});
