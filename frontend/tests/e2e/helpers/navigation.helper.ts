import { Page } from '@playwright/test';

export class NavigationHelper {
  constructor(private page: Page) {}

  async goToHome() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async goToPlaces() {
    // 네비게이션 링크 클릭
    const placesLink = this.page.locator('a[href*="/places"]:not([href*="/mypage"])').first();
    await placesLink.click();
    await this.page.waitForURL(/\/places/, { timeout: 10000 });
  }

  async goToBoards() {
    const boardsLink = this.page.locator('a[href*="/boards"]:not([href*="/mypage"])').first();
    await boardsLink.click();
    await this.page.waitForURL(/\/boards/, { timeout: 10000 });
  }

  async goToItinerary() {
    const itineraryLink = this.page.locator('a[href*="/itinerary"]').first();
    await itineraryLink.click();
    await this.page.waitForURL(/\/itinerary/, { timeout: 10000 });
  }

  async goToMyPage() {
    const myPageLink = this.page.locator('a[href*="/mypage"], a:has-text("마이페이지")').first();
    await myPageLink.click();
    await this.page.waitForURL(/\/mypage/, { timeout: 10000 });
  }

  async goToFestivals() {
    const festivalsLink = this.page.locator('a[href*="/festivals"]').first();
    await festivalsLink.click();
    await this.page.waitForURL(/\/festivals/, { timeout: 10000 });
  }

  async goToRestaurants() {
    const restaurantsLink = this.page.locator('a[href*="/restaurants"]').first();
    await restaurantsLink.click();
    await this.page.waitForURL(/\/restaurants/, { timeout: 10000 });
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }
}
