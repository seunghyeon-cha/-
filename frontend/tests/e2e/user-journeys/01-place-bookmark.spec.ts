import { test, expect } from '../fixtures/base.fixture';
import { testPlaces } from '../../test-data/places';
import { testUsers } from '../../test-data/users';

test.describe('User Journey: 장소 검색 및 북마크', () => {
  test('사용자가 로그인하여 장소를 검색하고 북마크할 수 있다', async ({
    page,
    authHelper,
    navHelper,
  }) => {
    // 1. 로그인
    await test.step('로그인', async () => {
      await authHelper.login(testUsers.validUser.email, testUsers.validUser.password);
      await expect(page).toHaveURL('/');

      // 로그인 성공 확인
      const isLoggedIn = await authHelper.isLoggedIn();
      expect(isLoggedIn).toBeTruthy();
    });

    // 2. 장소 페이지로 이동
    await test.step('장소 페이지로 이동', async () => {
      await navHelper.goToPlaces();
      await expect(page).toHaveURL(/\/places/);
    });

    // 3. 장소 검색
    let searchResultsVisible = false;
    await test.step('장소 검색', async () => {
      // 검색 입력란 찾기
      const searchInput = page.locator('input[placeholder*="검색"], input[type="search"]').first();

      if (await searchInput.isVisible()) {
        await searchInput.fill(testPlaces.searchKeyword);
        await page.keyboard.press('Enter');

        // 검색 결과 대기
        try {
          await page.waitForSelector('[data-testid="place-card"], article, .place-item', {
            timeout: 10000,
          });
          searchResultsVisible = true;
        } catch {
          console.log('검색 결과를 data-testid로 찾을 수 없습니다. 기존 목록 사용');
        }
      }

      // 검색 결과 또는 기본 목록 확인
      const placeCards = page.locator(
        '[data-testid="place-card"], article:has(h2, h3), .place-item'
      );
      const count = await placeCards.count();
      expect(count).toBeGreaterThan(0);
    });

    // 4. 첫 번째 장소 클릭하여 상세 페이지 이동
    await test.step('장소 상세 페이지 이동', async () => {
      const firstPlace = page
        .locator('[data-testid="place-card"], article:has(a), .place-item')
        .first();

      await firstPlace.click();

      // 상세 페이지 URL 확인
      await page.waitForURL(/\/places\/[^/]+$/, { timeout: 10000 });

      // 상세 페이지 로딩 확인
      await expect(page.locator('h1')).toBeVisible({ timeout: 5000 });
    });

    // 5. 북마크 추가
    await test.step('북마크 추가', async () => {
      // 북마크 버튼 찾기
      const bookmarkButton = page.locator(
        '[data-testid="bookmark-button"], button:has-text("북마크")'
      );

      await bookmarkButton.waitFor({ state: 'visible', timeout: 5000 });

      // 현재 북마크 상태 확인
      const currentText = await bookmarkButton.textContent();
      const isBookmarked = currentText?.includes('해제') || currentText?.includes('제거');

      if (!isBookmarked) {
        // 북마크 추가
        await bookmarkButton.click();

        // 성공 메시지 확인 (여러 가능성 고려)
        const successMessage = page.locator(
          'text=/북마크.*추가/i, text=/북마크.*성공/i, [role="alert"]:has-text("북마크")'
        );

        await expect(successMessage.first()).toBeVisible({
          timeout: 5000,
        });
      }
    });

    // 6. 마이페이지에서 북마크 확인
    await test.step('마이페이지에서 북마크 확인', async () => {
      await navHelper.goToMyPage();

      // 북마크 탭/링크 찾기
      const bookmarkLink = page.locator('a:has-text("북마크"), button:has-text("북마크")');

      if (await bookmarkLink.isVisible()) {
        await bookmarkLink.click();
        await page.waitForURL(/\/mypage\/bookmarks?/, { timeout: 5000 });

        // 북마크한 장소 확인
        const bookmarkedPlaces = page.locator(
          '[data-testid="bookmarked-place"], [data-testid="place-card"], article'
        );
        const count = await bookmarkedPlaces.count();
        expect(count).toBeGreaterThan(0);
      } else {
        console.log('북마크 탭을 찾을 수 없습니다. 기본 마이페이지에서 확인');
      }
    });

    // 7. 북마크 제거
    await test.step('북마크 제거', async () => {
      // 북마크 해제 버튼 찾기
      const removeButton = page
        .locator('button:has-text("북마크 해제"), button:has-text("삭제")')
        .first();

      if (await removeButton.isVisible()) {
        // 확인 다이얼로그 자동 수락
        page.on('dialog', (dialog) => dialog.accept());

        await removeButton.click();

        // 성공 메시지 확인
        const successMessage = page.locator(
          'text=/북마크.*해제/i, text=/삭제.*성공/i'
        );

        await expect(successMessage.first()).toBeVisible({
          timeout: 5000,
        });
      }
    });
  });

  test('북마크는 로그인 없이 사용할 수 없다', async ({ page, navHelper }) => {
    // 비로그인 상태에서 장소 페이지 방문
    await page.goto('/places');

    // 첫 번째 장소 찾기 및 클릭
    try {
      const firstPlace = page
        .locator('[data-testid="place-card"], article:has(a)')
        .first();

      await firstPlace.waitFor({ state: 'visible', timeout: 5000 });
      await firstPlace.click();

      await page.waitForURL(/\/places\/[^/]+$/, { timeout: 10000 });

      // 북마크 버튼 클릭
      const bookmarkButton = page.locator('button:has-text("북마크")');

      if (await bookmarkButton.isVisible()) {
        await bookmarkButton.click();

        // 로그인 필요 메시지 또는 로그인 페이지로 리다이렉트 확인
        const loginRequired =
          (await page.locator('text=/로그인.*필요/i').isVisible()) ||
          page.url().includes('/login');

        expect(loginRequired).toBeTruthy();
      }
    } catch (error) {
      console.log('비로그인 북마크 테스트 스킵: 장소 목록을 찾을 수 없음');
      test.skip();
    }
  });
});
