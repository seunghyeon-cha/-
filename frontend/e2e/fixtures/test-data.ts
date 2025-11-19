/**
 * 테스트에 사용할 공통 데이터
 */

export const testUsers = {
  validUser: {
    email: 'test@example.com',
    password: 'Test1234!',
    nickname: '테스트유저',
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },
};

export const testPlaces = {
  validPlace: {
    name: '테스트 관광지',
    address: '서울특별시 강남구 테스트로 123',
    description: '테스트용 관광지 설명입니다.',
    category: '관광지',
  },
};

export const testBoards = {
  validPost: {
    title: '테스트 게시글 제목',
    content: '테스트 게시글 내용입니다. 이것은 E2E 테스트를 위한 샘플 게시글입니다.',
    category: 'free',
  },
  longPost: {
    title: '매우 긴 제목을 가진 테스트 게시글입니다. '.repeat(5),
    content: '매우 긴 내용을 가진 테스트 게시글입니다. '.repeat(50),
    category: 'review',
  },
};

export const testItinerary = {
  validItinerary: {
    title: '테스트 여행 일정',
    startDate: '2025-12-01',
    endDate: '2025-12-03',
    description: '테스트 여행 일정 설명',
  },
};

export const testReview = {
  validReview: {
    rating: 5,
    content: '정말 좋은 장소였습니다! 다시 방문하고 싶어요.',
  },
  negativeReview: {
    rating: 2,
    content: '기대에 못 미쳤습니다.',
  },
};

/**
 * 테스트용 URL 상수
 */
export const TEST_URLS = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PLACES: '/places',
  RESTAURANTS: '/restaurants',
  ACCOMMODATIONS: '/accommodations',
  FESTIVALS: '/festivals',
  BOARDS: '/boards',
  ITINERARY: '/itinerary',
  MYPAGE: '/mypage',
  SEARCH: '/search',
};

/**
 * 테스트용 선택자
 */
export const SELECTORS = {
  // Header
  HEADER: 'header',
  LOGO: 'a[href="/"]',
  NAV_PLACES: 'a[href="/places"]',
  NAV_RESTAURANTS: 'a[href="/restaurants"]',
  NAV_ACCOMMODATIONS: 'a[href="/accommodations"]',
  NAV_FESTIVALS: 'a[href="/festivals"]',
  NAV_BOARDS: 'a[href="/boards"]',
  NAV_ITINERARY: 'a[href="/itinerary"]',
  LOGIN_BUTTON: 'a[href="/login"]',
  SIGNUP_BUTTON: 'a[href="/signup"]',

  // Footer
  FOOTER: 'footer',

  // Forms
  EMAIL_INPUT: 'input[type="email"], input[name="email"]',
  PASSWORD_INPUT: 'input[type="password"], input[name="password"]',
  SUBMIT_BUTTON: 'button[type="submit"]',

  // Common
  LOADING_SPINNER: '.loading, [aria-busy="true"]',
  ERROR_MESSAGE: '[role="alert"], .error',
  SUCCESS_MESSAGE: '[role="status"], .success',
  CARD: '.card, [class*="card"]',
  MODAL: '[role="dialog"], .modal',
  CLOSE_BUTTON: 'button[aria-label="닫기"], button[aria-label="Close"]',
};

/**
 * 테스트용 메시지
 */
export const MESSAGES = {
  LOGIN_SUCCESS: '로그인되었습니다',
  LOGIN_FAIL: '로그인에 실패했습니다',
  SIGNUP_SUCCESS: '회원가입이 완료되었습니다',
  LOGOUT_SUCCESS: '로그아웃되었습니다',
  POST_CREATED: '게시글이 작성되었습니다',
  POST_UPDATED: '게시글이 수정되었습니다',
  POST_DELETED: '게시글이 삭제되었습니다',
  COMMENT_CREATED: '댓글이 작성되었습니다',
  REVIEW_CREATED: '리뷰가 작성되었습니다',
};
