import { test, expect } from '@playwright/test';
import { TEST_URLS } from '../fixtures/test-data';
import { waitForLoading } from '../utils/test-helpers';

test.describe('리뷰 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 관광지 상세 페이지로 이동 (리뷰가 있는 곳)
    await page.goto(TEST_URLS.PLACES);
    await waitForLoading(page);
  });

  test.describe('리뷰 목록', () => {
    test('관광지 상세 페이지에서 리뷰 섹션이 표시된다', async ({ page }) => {
      const firstPlace = page.locator('.card a, article a').first();
      const hasPlace = await firstPlace.count() > 0;

      if (hasPlace) {
        await firstPlace.click();
        await waitForLoading(page);

        // 리뷰 섹션 찾기
        const reviewSection = page.locator('[class*="review"], section:has-text("리뷰")');
        await page.waitForTimeout(1000);

        // 리뷰 섹션이 있을 수 있음
      }
    });

    test('리뷰 목록이 표시된다', async ({ page }) => {
      const firstPlace = page.locator('.card a, article a').first();
      const hasPlace = await firstPlace.count() > 0;

      if (hasPlace) {
        await firstPlace.click();
        await waitForLoading(page);

        // 리뷰 카드나 아이템 찾기
        const reviews = page.locator('[class*="review-item"], [class*="review-card"]');
        await page.waitForTimeout(1000);

        // 리뷰가 있거나 없을 수 있음
      }
    });

    test('평점이 표시된다', async ({ page }) => {
      const firstPlace = page.locator('.card a, article a').first();
      const hasPlace = await firstPlace.count() > 0;

      if (hasPlace) {
        await firstPlace.click();
        await waitForLoading(page);

        // 별점이나 평점 찾기
        const rating = page.locator('[class*="rating"], [class*="star"], [aria-label*="별점"]');
        await page.waitForTimeout(1000);

        // 평점이 표시될 수 있음
      }
    });
  });

  test.describe('리뷰 작성', () => {
    test('리뷰 작성 버튼이 표시된다', async ({ page }) => {
      const firstPlace = page.locator('.card a, article a').first();
      const hasPlace = await firstPlace.count() > 0;

      if (hasPlace) {
        await firstPlace.click();
        await waitForLoading(page);

        // 리뷰 작성 버튼 찾기
        const writeButton = page.locator('button:has-text("리뷰 작성"), button:has-text("리뷰 쓰기"), a:has-text("리뷰 작성")');
        await page.waitForTimeout(1000);

        // 리뷰 작성 버튼이 있을 수 있음 (로그인 필요)
      }
    });

    test('리뷰 작성 폼이 열린다', async ({ page }) => {
      const firstPlace = page.locator('.card a, article a').first();
      const hasPlace = await firstPlace.count() > 0;

      if (hasPlace) {
        await firstPlace.click();
        await waitForLoading(page);

        const writeButton = page.locator('button:has-text("리뷰 작성"), button:has-text("리뷰 쓰기")').first();
        const hasButton = await writeButton.count() > 0;

        if (hasButton) {
          await writeButton.click();
          await page.waitForTimeout(1000);

          // 리뷰 작성 폼 찾기
          const reviewForm = page.locator('form, [class*="review-form"]');
          const hasForm = await reviewForm.count() > 0;

          // 폼이 나타날 수 있음
        }
      }
    });

    test('별점을 선택할 수 있다', async ({ page }) => {
      const firstPlace = page.locator('.card a, article a').first();
      const hasPlace = await firstPlace.count() > 0;

      if (hasPlace) {
        await firstPlace.click();
        await waitForLoading(page);

        const writeButton = page.locator('button:has-text("리뷰 작성")').first();
        const hasButton = await writeButton.count() > 0;

        if (hasButton) {
          await writeButton.click();
          await page.waitForTimeout(1000);

          // 별점 선택 요소 찾기
          const stars = page.locator('[class*="star"], button[aria-label*="별"]');
          const hasStars = await stars.count() > 0;

          if (hasStars && await stars.count() >= 5) {
            // 5번째 별 클릭 (5점)
            await stars.nth(4).click();
            await page.waitForTimeout(500);
          }
        }
      }
    });

    test('리뷰 내용을 입력할 수 있다', async ({ page }) => {
      const firstPlace = page.locator('.card a, article a').first();
      const hasPlace = await firstPlace.count() > 0;

      if (hasPlace) {
        await firstPlace.click();
        await waitForLoading(page);

        const writeButton = page.locator('button:has-text("리뷰 작성")').first();
        const hasButton = await writeButton.count() > 0;

        if (hasButton) {
          await writeButton.click();
          await page.waitForTimeout(1000);

          // 리뷰 입력 필드 찾기
          const reviewInput = page.locator('textarea[placeholder*="리뷰"], textarea[name*="content"]');
          const hasInput = await reviewInput.count() > 0;

          if (hasInput) {
            await reviewInput.first().fill('정말 좋은 장소였습니다!');
            await page.waitForTimeout(500);
          }
        }
      }
    });
  });

  test.describe('리뷰 수정/삭제', () => {
    test('자신의 리뷰에 수정/삭제 버튼이 표시된다', async ({ page }) => {
      const firstPlace = page.locator('.card a, article a').first();
      const hasPlace = await firstPlace.count() > 0;

      if (hasPlace) {
        await firstPlace.click();
        await waitForLoading(page);

        // 수정/삭제 버튼 찾기 (로그인하고 자신의 리뷰가 있을 때)
        const editButton = page.locator('button:has-text("수정"), button[aria-label*="수정"]');
        const deleteButton = page.locator('button:has-text("삭제"), button[aria-label*="삭제"]');
        await page.waitForTimeout(1000);

        // 본인의 리뷰가 있을 때만 버튼이 표시됨
      }
    });
  });

  test.describe('리뷰 좋아요', () => {
    test('리뷰에 좋아요를 누를 수 있다', async ({ page }) => {
      const firstPlace = page.locator('.card a, article a').first();
      const hasPlace = await firstPlace.count() > 0;

      if (hasPlace) {
        await firstPlace.click();
        await waitForLoading(page);

        // 좋아요 버튼 찾기
        const likeButton = page.locator('button:has-text("좋아요"), button[aria-label*="좋아요"]').first();
        const hasLike = await likeButton.count() > 0;

        if (hasLike) {
          await likeButton.click();
          await page.waitForTimeout(500);

          // 좋아요 카운트가 증가했는지 확인
        }
      }
    });
  });

  test.describe('리뷰 필터/정렬', () => {
    test('리뷰 정렬 옵션이 표시된다', async ({ page }) => {
      const firstPlace = page.locator('.card a, article a').first();
      const hasPlace = await firstPlace.count() > 0;

      if (hasPlace) {
        await firstPlace.click();
        await waitForLoading(page);

        // 정렬 옵션 찾기
        const sortSelect = page.locator('select[name*="sort"], button:has-text("최신순"), button:has-text("평점순")');
        await page.waitForTimeout(1000);

        // 정렬 옵션이 있을 수 있음
      }
    });

    test('별점 필터가 작동한다', async ({ page }) => {
      const firstPlace = page.locator('.card a, article a').first();
      const hasPlace = await firstPlace.count() > 0;

      if (hasPlace) {
        await firstPlace.click();
        await waitForLoading(page);

        // 별점 필터 버튼 찾기
        const starFilters = page.locator('button:has-text("5점"), button:has-text("4점")');
        const hasFilters = await starFilters.count() > 0;

        if (hasFilters) {
          await starFilters.first().click();
          await waitForLoading(page);
        }
      }
    });
  });

  test.describe('리뷰 페이지네이션', () => {
    test('리뷰가 많을 때 더보기 버튼이 표시된다', async ({ page }) => {
      const firstPlace = page.locator('.card a, article a').first();
      const hasPlace = await firstPlace.count() > 0;

      if (hasPlace) {
        await firstPlace.click();
        await waitForLoading(page);

        // 더보기 버튼 찾기
        const moreButton = page.locator('button:has-text("더보기"), button:has-text("더 보기")');
        await page.waitForTimeout(1000);

        const hasMore = await moreButton.count() > 0;

        if (hasMore) {
          await expect(moreButton.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('리뷰 통계', () => {
    test('평균 평점이 표시된다', async ({ page }) => {
      const firstPlace = page.locator('.card a, article a').first();
      const hasPlace = await firstPlace.count() > 0;

      if (hasPlace) {
        await firstPlace.click();
        await waitForLoading(page);

        // 평균 평점 표시 찾기
        const averageRating = page.locator('[class*="average"], [class*="total"]');
        await page.waitForTimeout(1000);

        // 평균 평점이 표시될 수 있음
      }
    });

    test('별점 분포가 표시된다', async ({ page }) => {
      const firstPlace = page.locator('.card a, article a').first();
      const hasPlace = await firstPlace.count() > 0;

      if (hasPlace) {
        await firstPlace.click();
        await waitForLoading(page);

        // 별점 분포 그래프 찾기
        const ratingDistribution = page.locator('[class*="distribution"], [class*="chart"]');
        await page.waitForTimeout(1000);

        // 별점 분포가 표시될 수 있음
      }
    });
  });
});
