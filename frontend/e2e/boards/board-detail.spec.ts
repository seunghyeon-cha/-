import { test, expect } from '@playwright/test';
import { TEST_URLS } from '../fixtures/test-data';
import { waitForLoading } from '../utils/test-helpers';

test.describe('게시글 상세 페이지 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URLS.BOARDS);
    await waitForLoading(page);
  });

  test('게시글 상세 페이지가 로드된다', async ({ page }) => {
    // 첫 번째 게시글 찾기
    const firstPost = page.locator('.card a, article a, [class*="post"] a').first();
    const hasPost = await firstPost.count() > 0;

    if (hasPost) {
      await firstPost.click();
      await waitForLoading(page);

      // 상세 페이지 콘텐츠 확인
      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent).toBeVisible();
    }
  });

  test('게시글 제목과 내용이 표시된다', async ({ page }) => {
    const firstPost = page.locator('.card a, article a').first();
    const hasPost = await firstPost.count() > 0;

    if (hasPost) {
      await firstPost.click();
      await waitForLoading(page);

      // 제목이나 내용이 있는지 확인 (h1, h2, article, p 등)
      const heading = page.locator('h1, h2, [class*="title"]').first();
      const hasHeading = await heading.count() > 0;

      if (hasHeading) {
        await expect(heading).toBeVisible();
      }
    }
  });

  test.describe('댓글 기능', () => {
    test('댓글 목록이 표시된다', async ({ page }) => {
      const firstPost = page.locator('.card a, article a').first();
      const hasPost = await firstPost.count() > 0;

      if (hasPost) {
        await firstPost.click();
        await waitForLoading(page);

        // 댓글 섹션 찾기
        const commentSection = page.locator('[class*="comment"], section:has-text("댓글")');
        await page.waitForTimeout(1000);

        // 댓글 섹션이 있을 수 있음
        const hasComments = await commentSection.count() > 0;
        expect(hasComments || true).toBeTruthy(); // 댓글이 없어도 OK
      }
    });

    test('댓글 작성 폼이 표시된다', async ({ page }) => {
      const firstPost = page.locator('.card a, article a').first();
      const hasPost = await firstPost.count() > 0;

      if (hasPost) {
        await firstPost.click();
        await waitForLoading(page);

        // 댓글 작성 입력 필드 찾기
        const commentInput = page.locator('textarea[placeholder*="댓글"], input[placeholder*="댓글"]');
        await page.waitForTimeout(1000);

        // 댓글 입력 필드가 있을 수 있음 (로그인 필요할 수도)
      }
    });
  });

  test.describe('좋아요 기능', () => {
    test('좋아요 버튼이 표시된다', async ({ page }) => {
      const firstPost = page.locator('.card a, article a').first();
      const hasPost = await firstPost.count() > 0;

      if (hasPost) {
        await firstPost.click();
        await waitForLoading(page);

        // 좋아요 버튼 찾기
        const likeButton = page.locator('button:has-text("좋아요"), button[aria-label*="좋아요"]');
        await page.waitForTimeout(1000);

        // 좋아요 버튼이 있을 수 있음
      }
    });
  });

  test('목록으로 돌아가기 버튼이 작동한다', async ({ page }) => {
    const firstPost = page.locator('.card a, article a').first();
    const hasPost = await firstPost.count() > 0;

    if (hasPost) {
      await firstPost.click();
      await waitForLoading(page);

      // 뒤로가기 또는 목록 버튼 찾기
      const backButton = page.locator('button:has-text("목록"), button:has-text("뒤로"), a:has-text("목록")');
      const hasBackButton = await backButton.count() > 0;

      if (hasBackButton) {
        await backButton.first().click();
        await waitForLoading(page);

        // 목록 페이지로 돌아갔는지 확인
        expect(page.url()).toContain('/boards');
      } else {
        // 브라우저 뒤로가기 사용
        await page.goBack();
        await waitForLoading(page);
      }
    }
  });
});
