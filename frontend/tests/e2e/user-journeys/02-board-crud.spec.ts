import { test, expect } from '../fixtures/base.fixture';
import { testBoards } from '../../test-data/places';

test.describe('User Journey: 게시글 CRUD', () => {
  test('사용자가 게시글을 작성, 수정, 삭제할 수 있다', async ({
    page,
    authenticatedPage,
    navHelper,
  }) => {
    // 1. 게시판 페이지로 이동
    await test.step('게시판 페이지로 이동', async () => {
      await navHelper.goToBoards();
      await expect(page).toHaveURL(/\/boards$/);
    });

    // 2. 새 글 작성 버튼 클릭
    await test.step('글쓰기 페이지로 이동', async () => {
      const newPostButton = page.locator(
        'button:has-text("새 글"), a:has-text("글쓰기"), a:has-text("작성")'
      );

      await newPostButton.click();
      await page.waitForURL(/\/boards\/new/, { timeout: 10000 });
    });

    // 3. 게시글 작성
    let postUrl = '';
    await test.step('게시글 작성', async () => {
      // 카테고리 선택 (있는 경우)
      const categorySelect = page.locator('select[name="category"]');
      if (await categorySelect.isVisible()) {
        await categorySelect.selectOption(testBoards.category);
      }

      // 제목 입력
      await page.fill('input[name="title"], input[placeholder*="제목"]', testBoards.title);

      // 내용 입력 - 여러 에디터 타입 지원
      const contentSelectors = [
        '.ProseMirror', // TipTap
        'textarea[name="content"]', // 일반 textarea
        '[contenteditable="true"]', // contenteditable div
      ];

      let editorFound = false;
      for (const selector of contentSelectors) {
        const editor = page.locator(selector).first();
        if (await editor.isVisible()) {
          await editor.click();
          await editor.fill(testBoards.content);
          editorFound = true;
          break;
        }
      }

      if (!editorFound) {
        throw new Error('콘텐츠 에디터를 찾을 수 없습니다');
      }

      // 작성 버튼 클릭
      const submitButton = page.locator(
        'button:has-text("작성"), button:has-text("등록"), button[type="submit"]'
      );
      await submitButton.click();

      // 상세 페이지로 이동 대기
      await page.waitForURL(/\/boards\/[^/]+$/, { timeout: 10000 });
      postUrl = page.url();

      // 작성한 게시글 내용 확인
      await expect(page.locator('h1, .title')).toContainText(testBoards.title);
    });

    // 4. 게시글 수정
    await test.step('게시글 수정', async () => {
      // 수정 버튼 클릭
      const editButton = page.locator('button:has-text("수정"), a:has-text("수정")');
      await editButton.click();

      await page.waitForURL(/\/boards\/[^/]+\/edit/, { timeout: 10000 });

      // 제목 수정
      const titleInput = page.locator('input[name="title"], input[placeholder*="제목"]');
      await titleInput.clear();
      await titleInput.fill(testBoards.updatedTitle);

      // 내용 수정
      const contentSelectors = [
        '.ProseMirror',
        'textarea[name="content"]',
        '[contenteditable="true"]',
      ];

      for (const selector of contentSelectors) {
        const editor = page.locator(selector).first();
        if (await editor.isVisible()) {
          await editor.click();

          // 전체 선택 후 새 내용 입력
          await page.keyboard.press('Control+A');
          await page.keyboard.press('Meta+A'); // macOS
          await editor.fill(testBoards.updatedContent);
          break;
        }
      }

      // 저장 버튼 클릭
      const saveButton = page.locator(
        'button:has-text("저장"), button:has-text("수정"), button[type="submit"]'
      );
      await saveButton.click();

      // 상세 페이지로 돌아오기
      await page.waitForURL(/\/boards\/[^/]+$/, { timeout: 10000 });

      // 수정된 내용 확인
      await expect(page.locator('h1, .title')).toContainText(testBoards.updatedTitle);
    });

    // 5. 게시글 삭제
    await test.step('게시글 삭제', async () => {
      // 삭제 버튼 클릭
      const deleteButton = page.locator('button:has-text("삭제")');
      await deleteButton.click();

      // 확인 다이얼로그 자동 수락
      page.on('dialog', (dialog) => dialog.accept());

      // 목록 페이지로 이동
      await page.waitForURL(/\/boards$/, { timeout: 10000 });

      // 삭제 성공 메시지 확인 (선택사항)
      const successMessage = page.locator('text=/삭제.*성공/i');
      try {
        await expect(successMessage).toBeVisible({ timeout: 3000 });
      } catch {
        // 메시지가 없어도 OK
        console.log('삭제 성공 메시지 없음 (정상)');
      }
    });

    // 6. 삭제 확인 (목록에서 없어졌는지)
    await test.step('삭제 확인', async () => {
      // 삭제한 게시글이 목록에 없는지 확인
      const deletedPost = page.locator(`text="${testBoards.updatedTitle}"`);
      const isVisible = await deletedPost.isVisible({ timeout: 2000 }).catch(() => false);
      expect(isVisible).toBeFalsy();
    });
  });

  test('비로그인 사용자는 게시글을 작성할 수 없다', async ({ page }) => {
    // 비로그인 상태에서 글쓰기 페이지 접근 시도
    await page.goto('/boards/new');

    // 로그인 페이지로 리다이렉트 또는 접근 불가 메시지 확인
    await page.waitForTimeout(2000);

    const isLoginPage = page.url().includes('/login');
    const hasAccessDenied = await page.locator('text=/로그인.*필요/i').isVisible();

    expect(isLoginPage || hasAccessDenied).toBeTruthy();
  });
});
