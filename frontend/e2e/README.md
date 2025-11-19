# E2E 테스트

Playwright를 사용한 End-to-End 테스트입니다.

## 빠른 시작

```bash
# 테스트 실행
npm run test:e2e

# UI 모드로 테스트 실행 (권장)
npm run test:e2e:ui

# 특정 브라우저로 테스트
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit
```

## 테스트 구조

- `auth/` - 인증 관련 테스트 (로그인, 회원가입)
- `pages/` - 페이지 테스트 (홈페이지, 네비게이션)
- `places/` - 관광지 관련 테스트
- `boards/` - 게시판 테스트 (추가 예정)
- `itinerary/` - 여행일정 테스트 (추가 예정)
- `utils/` - 테스트 헬퍼 함수
- `fixtures/` - 테스트 데이터

## 자세한 가이드

전체 가이드는 [E2E_TEST_GUIDE.md](../E2E_TEST_GUIDE.md)를 참조하세요.
