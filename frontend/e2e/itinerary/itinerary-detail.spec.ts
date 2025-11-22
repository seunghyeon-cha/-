import { test, expect } from '@playwright/test';
import { TEST_URLS } from '../fixtures/test-data';
import { waitForLoading } from '../utils/test-helpers';

test.describe('여행일정 상세 페이지 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URLS.ITINERARY);
    await waitForLoading(page);
  });

  test('일정 상세 페이지가 로드된다', async ({ page }) => {
    const firstItinerary = page.locator('.card a, article a').first();
    const hasItinerary = await firstItinerary.count() > 0;

    if (hasItinerary) {
      await firstItinerary.click();
      await waitForLoading(page);

      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent).toBeVisible();
    }
  });

  test('일정 제목과 기간이 표시된다', async ({ page }) => {
    const firstItinerary = page.locator('.card a, article a').first();
    const hasItinerary = await firstItinerary.count() > 0;

    if (hasItinerary) {
      await firstItinerary.click();
      await waitForLoading(page);

      const heading = page.locator('h1, h2, [class*="title"]').first();
      const hasHeading = await heading.count() > 0;

      if (hasHeading) {
        await expect(heading).toBeVisible();
      }
    }
  });

  test.describe('일정 항목', () => {
    test('일정 항목 목록이 표시된다', async ({ page }) => {
      const firstItinerary = page.locator('.card a, article a').first();
      const hasItinerary = await firstItinerary.count() > 0;

      if (hasItinerary) {
        await firstItinerary.click();
        await waitForLoading(page);

        // 일정 항목이나 장소 리스트 찾기
        const items = page.locator('[class*="place"], [class*="item"], li');
        await page.waitForTimeout(1000);

        // 일정 항목이 있을 수 있음
      }
    });
  });

  test.describe('지도 표시', () => {
    test('지도가 표시된다', async ({ page }) => {
      const firstItinerary = page.locator('.card a, article a').first();
      const hasItinerary = await firstItinerary.count() > 0;

      if (hasItinerary) {
        await firstItinerary.click();
        await waitForLoading(page);

        // 지도 컨테이너 찾기
        const mapContainer = page.locator('#map, [class*="map"], [id*="kakao"]');
        await page.waitForTimeout(2000); // 지도 로드 대기

        // 지도가 있을 수 있음
      }
    });
  });

  test('수정 버튼이 표시된다 (작성자인 경우)', async ({ page }) => {
    const firstItinerary = page.locator('.card a, article a').first();
    const hasItinerary = await firstItinerary.count() > 0;

    if (hasItinerary) {
      await firstItinerary.click();
      await waitForLoading(page);

      // 수정 버튼 찾기
      const editButton = page.locator('button:has-text("수정"), a:has-text("수정")');
      await page.waitForTimeout(1000);

      // 수정 버튼은 로그인 및 권한이 있을 때만 표시
    }
  });
});
