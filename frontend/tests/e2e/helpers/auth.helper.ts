import { Page } from '@playwright/test';

export class AuthHelper {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.goto('/login');

    // 페이지 로드 대기
    await this.page.waitForLoadState('domcontentloaded');

    // 이메일 입력 - placeholder로 찾기
    const emailInput = this.page.getByPlaceholder('user@yerimtour.com');
    await emailInput.waitFor({ state: 'visible', timeout: 15000 });
    await emailInput.fill(email);

    // 비밀번호 입력 - placeholder로 찾기
    const passwordInput = this.page.getByPlaceholder('8자 이상');
    await passwordInput.waitFor({ state: 'visible', timeout: 5000 });
    await passwordInput.fill(password);

    // 로그인 버튼 클릭
    const loginButton = this.page.locator('button[type="submit"]').first();
    await loginButton.click();

    // 로그인 성공 대기 - URL 변경 확인
    try {
      // URL이 /login에서 벗어나길 대기
      await this.page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
    } catch {
      // 에러 메시지 확인
      const errorMsg = await this.page.locator('.bg-red-50, .text-error').textContent().catch(() => '');
      throw new Error(`로그인 실패: ${errorMsg || '알 수 없는 오류'}`);
    }
  }

  async logout() {
    // 헤더의 사용자 메뉴 클릭
    const userMenu = this.page.locator('[data-testid="user-menu"], button:has-text("프로필")');
    if (await userMenu.isVisible()) {
      await userMenu.click();

      // 로그아웃 버튼 클릭
      const logoutButton = this.page.locator('[data-testid="logout-button"], button:has-text("로그아웃")');
      await logoutButton.click();

      // 로그인 페이지로 이동 대기
      await this.page.waitForURL('/login', { timeout: 5000 });
    }
  }

  async isLoggedIn(): Promise<boolean> {
    // 로그인 상태 확인 - 사용자 메뉴가 보이는지 체크
    const userMenu = this.page.locator('[data-testid="user-menu"], nav button:has-text("프로필"), nav a:has-text("마이페이지")');

    try {
      await userMenu.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async register(email: string, password: string, name: string) {
    await this.page.goto('/signup');

    // 이메일 입력
    await this.page.fill('input[type="email"], input[name="email"]', email);

    // 비밀번호 입력
    await this.page.fill('input[type="password"][name="password"]', password);

    // 비밀번호 확인 입력
    await this.page.fill('input[name="passwordConfirm"]', password);

    // 이름 입력
    await this.page.fill('input[name="name"]', name);

    // 회원가입 버튼 클릭
    await this.page.click('button[type="submit"]:has-text("가입")');

    // 로그인 페이지 또는 메인 페이지로 이동 대기
    await this.page.waitForURL(/\/(login)?$/, { timeout: 10000 });
  }
}
