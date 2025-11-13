# GitHub Pages 배포 가이드

## 배포 완료 ✅

예림투어 웹사이트가 성공적으로 GitHub Pages에 배포되었습니다!

**사이트 URL:** https://seunghyeon-cha.github.io/-/

## 배포 상태

- ✅ 메인 페이지 로드 정상
- ✅ CSS 스타일 적용 정상
- ✅ JavaScript 로드 정상
- ✅ 클라이언트 사이드 라우팅 정상
- ✅ 모든 카테고리 페이지 접근 가능

## 테스트된 페이지

- 메인 페이지: https://seunghyeon-cha.github.io/-/
- 관광지: https://seunghyeon-cha.github.io/-/places/
- 맛집: https://seunghyeon-cha.github.io/-/restaurants/
- 숙소: https://seunghyeon-cha.github.io/-/accommodations/
- 축제: https://seunghyeon-cha.github.io/-/festivals/
- 커뮤니티: https://seunghyeon-cha.github.io/-/boards/
- 여행일정: https://seunghyeon-cha.github.io/-/itinerary/

## 향후 배포 방법

변경사항을 배포하려면 다음 명령어를 실행하세요:

```bash
./deploy.sh
```

또는 수동으로:

```bash
cd frontend
npm run build
cd out
cp index.html 404.html
echo '' > .nojekyll
cd ../..
# gh-pages 브랜치에 out 디렉토리 내용을 푸시
```

## 설정 내역

### next.config.js
- `basePath: '/-'` - GitHub Pages 저장소 경로
- `assetPrefix: '/-'` - 정적 파일 경로
- `trailingSlash: true` - URL 끝에 슬래시 추가
- `output: 'export'` - 정적 사이트 생성

### GitHub Pages 설정
- Source: gh-pages 브랜치
- Custom domain: 없음
- HTTPS: 자동 활성화

## 클라이언트 사이드 라우팅

GitHub Pages는 정적 호스팅이므로 직접 URL 접근 시 404 오류가 발생합니다.
이를 해결하기 위해 `404.html` 파일을 `index.html`과 동일하게 설정했습니다.

브라우저가 404.html을 로드하면, Next.js의 클라이언트 사이드 라우팅이
올바른 페이지를 렌더링합니다.

## 문제 해결

### 화면이 깨져 보이는 경우
- 브라우저 캐시를 강제 새로고침하세요 (Cmd+Shift+R / Ctrl+Shift+F5)
- 배포 후 GitHub Pages가 업데이트되기까지 5-10분 정도 소요될 수 있습니다

### 카테고리 클릭이 작동하지 않는 경우
- 브라우저 콘솔에서 JavaScript 오류를 확인하세요
- 모든 JavaScript 파일이 정상적으로 로드되는지 확인하세요
- 404.html 파일이 존재하고 index.html과 동일한지 확인하세요

### 배포가 실패하는 경우
- `frontend/node_modules`가 있는지 확인하세요
- `npm install`을 실행하세요
- Git 상태를 확인하고 충돌이 없는지 확인하세요

## 주의사항

1. **백엔드 API 연결 불가**
   - GitHub Pages는 정적 호스팅만 지원합니다
   - 백엔드 API는 별도로 호스팅해야 합니다
   - 현재는 프론트엔드 UI만 확인할 수 있습니다

2. **환경 변수**
   - `.env` 파일의 내용은 빌드 시 포함되지 않습니다
   - `next.config.js`의 `env` 섹션에 정의된 변수만 사용됩니다

3. **이미지 최적화**
   - Next.js의 이미지 최적화는 정적 배포에서 작동하지 않습니다
   - `unoptimized: true` 설정으로 원본 이미지를 사용합니다

## 개발 환경

로컬에서 개발하려면:

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 http://localhost:3000 을 열어 확인하세요.
