import { test, expect } from '../fixtures/base.fixture';
import { testItinerary } from '../../test-data/places';

test.describe('User Journey: 일정 CRUD', () => {
  test('사용자가 여행 일정을 생성, 수정, 삭제할 수 있다', async ({
    page,
    authenticatedPage,
    navHelper,
  }) => {
    // 1. 일정 페이지로 이동
    await test.step('일정 페이지로 이동', async () => {
      await navHelper.goToItinerary();
      await expect(page).toHaveURL(/\/itinerary$/);
    });

    // 2. 새 일정 만들기
    await test.step('일정 생성 페이지로 이동', async () => {
      const newButton = page.locator(
        'button:has-text("새 일정"), a:has-text("일정 만들기"), a:has-text("만들기")'
      );

      await newButton.click();
      await page.waitForURL(/\/itinerary\/new/, { timeout: 10000 });
    });

    // 3. 일정 정보 입력
    await test.step('일정 생성', async () => {
      // 제목 입력
      await page.fill('input[name="title"], input[placeholder*="제목"]', testItinerary.title);

      // 지역 입력/선택
      const regionInput = page.locator('input[name="region"], select[name="region"]');
      if ((await regionInput.getAttribute('type')) === 'text') {
        await regionInput.fill(testItinerary.region);
      } else {
        // select인 경우
        await regionInput.selectOption({ label: testItinerary.region });
      }

      // 시작 날짜 입력
      await page.fill(
        'input[type="date"][name="startDate"], input[name="startDate"]',
        testItinerary.startDate
      );

      // 종료 날짜 입력
      await page.fill(
        'input[type="date"][name="endDate"], input[name="endDate"]',
        testItinerary.endDate
      );

      // 공개 여부 (선택사항)
      const publicCheckbox = page.locator('input[type="checkbox"][name="isPublic"]');
      if (await publicCheckbox.isVisible()) {
        await publicCheckbox.check();
      }

      // 생성 버튼 클릭
      const submitButton = page.locator(
        'button:has-text("생성"), button:has-text("만들기"), button[type="submit"]'
      );
      await submitButton.click();

      // 상세 페이지로 이동 대기
      await page.waitForURL(/\/itinerary\/[^/]+$/, { timeout: 10000 });

      // 생성된 일정 확인
      await expect(page.locator('h1, .title')).toContainText(testItinerary.title);
    });

    // 4. 일정 수정
    await test.step('일정 수정', async () => {
      // 수정 버튼 클릭
      const editButton = page.locator('button:has-text("수정"), a:has-text("수정")');
      await editButton.click();

      await page.waitForURL(/\/itinerary\/[^/]+\/edit/, { timeout: 10000 });

      // 제목 수정
      const titleInput = page.locator('input[name="title"], input[placeholder*="제목"]');
      await titleInput.clear();
      await titleInput.fill(testItinerary.updatedTitle);

      // 지역 수정 (선택사항)
      const regionInput = page.locator('input[name="region"], select[name="region"]');
      if (await regionInput.isVisible()) {
        if ((await regionInput.getAttribute('type')) === 'text') {
          await regionInput.clear();
          await regionInput.fill(testItinerary.updatedRegion);
        }
      }

      // 저장 버튼 클릭
      const saveButton = page.locator(
        'button:has-text("저장"), button[type="submit"]'
      );
      await saveButton.click();

      // 상세 페이지로 돌아오기
      await page.waitForURL(/\/itinerary\/[^/]+$/, { timeout: 10000 });

      // 수정된 제목 확인
      await expect(page.locator('h1, .title')).toContainText(testItinerary.updatedTitle);
    });

    // 5. 일정 삭제
    await test.step('일정 삭제', async () => {
      // 삭제 버튼 찾기
      const deleteButton = page.locator('button:has-text("삭제")');

      // 확인 다이얼로그 자동 수락
      page.on('dialog', (dialog) => dialog.accept());

      await deleteButton.click();

      // 목록 페이지로 이동
      await page.waitForURL(/\/itinerary$/, { timeout: 10000 });

      // 삭제 성공 메시지 확인 (선택사항)
      const successMessage = page.locator('text=/삭제.*성공/i');
      try {
        await expect(successMessage).toBeVisible({ timeout: 3000 });
      } catch {
        console.log('삭제 성공 메시지 없음 (정상)');
      }
    });

    // 6. 삭제 확인
    await test.step('삭제 확인', async () => {
      // 삭제한 일정이 목록에 없는지 확인
      const deletedItinerary = page.locator(`text="${testItinerary.updatedTitle}"`);
      const isVisible = await deletedItinerary.isVisible({ timeout: 2000 }).catch(() => false);
      expect(isVisible).toBeFalsy();
    });
  });

  test('비로그인 사용자는 일정을 생성할 수 없다', async ({ page }) => {
    // 비로그인 상태에서 일정 생성 페이지 접근 시도
    await page.goto('/itinerary/new');

    // 로그인 페이지로 리다이렉트 또는 접근 불가 메시지 확인
    await page.waitForTimeout(2000);

    const isLoginPage = page.url().includes('/login');
    const hasAccessDenied = await page.locator('text=/로그인.*필요/i').first().isVisible();

    expect(isLoginPage || hasAccessDenied).toBeTruthy();
  });

  test('날짜 유효성 검증', async ({ page, authenticatedPage }) => {
    // 일정 생성 페이지로 이동
    await page.goto('/itinerary/new');

    // 제목 입력
    await page.fill('input[name="title"]', '테스트 일정');

    // 잘못된 날짜 입력 (종료일이 시작일보다 빠름)
    await page.fill('input[name="startDate"]', '2025-12-10');
    await page.fill('input[name="endDate"]', '2025-12-05');

    // 생성 시도
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // 에러 메시지 확인 (여러 가능성)
    const errorMessage = page.locator(
      'text=/날짜.*잘못/i, text=/종료.*이후/i, text=/날짜.*확인/i, .error, [role="alert"]'
    );

    try {
      await expect(errorMessage.first()).toBeVisible({ timeout: 3000 });
    } catch {
      // 브라우저 자체 유효성 검사가 작동할 수도 있음
      const currentUrl = page.url();
      expect(currentUrl).toContain('/new'); // 여전히 생성 페이지에 있어야 함
    }
  });
});
