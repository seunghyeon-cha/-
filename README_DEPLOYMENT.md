# 예림투어 배포 가이드

## 현재 배포 상태

✅ GitHub Pages 배포가 완료되었습니다!

- **웹사이트 URL**: https://seunghyeon-cha.github.io/-/
- **저장소**: https://github.com/seunghyeon-cha/-
- **배포 브랜치**: gh-pages
- **소스 브랜치**: main

## 배포 확인

브라우저에서 https://seunghyeon-cha.github.io/-/ 를 열어 웹사이트를 확인하세요.

만약 404 에러가 표시된다면:
1. https://github.com/seunghyeon-cha/-/settings/pages 에서 설정 확인
2. Source가 "Deploy from a branch"로 설정되어 있는지 확인
3. Branch가 "gh-pages"와 "/ (root)"로 설정되어 있는지 확인
4. Save 버튼을 클릭하고 1-2분 대기

## 향후 수정 및 재배포 방법

### 방법 1: 자동 배포 스크립트 사용 (권장)

프론트엔드를 수정한 후 다음 명령어로 자동 배포:

```bash
cd /Users/chacha4164/Desktop/cursor/travel
./deploy-ghpages.sh
```

이 스크립트는 자동으로:
- 프론트엔드 빌드
- gh-pages 브랜치 업데이트
- GitHub에 푸시
- main 브랜치로 복귀

### 방법 2: 수동 배포

```bash
# 1. main 브랜치에서 작업
git checkout main

# 2. 변경사항 커밋
git add .
git commit -m "Update frontend"
git push origin main

# 3. 프론트엔드 빌드
cd frontend
npm install  # 필요시
npm run build
touch out/.nojekyll
cd ..

# 4. gh-pages 브랜치로 전환 및 배포
git checkout gh-pages
git rm -rf .
cp -r frontend/out/* .
cp frontend/out/.nojekyll .
rm -rf frontend backend Postgres.app

# 5. 커밋 및 푸시
git add .
git commit -m "Deploy update"
git push -f origin gh-pages

# 6. main 브랜치로 복귀
git checkout main
```

## 프론트엔드 수정 워크플로우

### 1. 로컬에서 개발 및 테스트

```bash
cd /Users/chacha4164/Desktop/cursor/travel/frontend

# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:3000 확인
```

### 2. 변경사항 확인

```bash
# 프로덕션 빌드 테스트
npm run build

# 빌드 성공 확인
```

### 3. 배포

```bash
cd ..
./deploy-ghpages.sh
```

### 4. 배포 확인

1-2분 후 https://seunghyeon-cha.github.io/-/ 에서 변경사항 확인

## 백엔드 수정 (GitHub Pages와 무관)

백엔드는 별도 서버에서 실행되므로 GitHub Pages 배포와 무관합니다.

```bash
cd /Users/chacha4164/Desktop/cursor/travel/backend

# 변경사항 커밋
git add .
git commit -m "Update backend"
git push origin main

# 서버 재시작 (필요시)
npm run start:dev
```

## 트러블슈팅

### 배포 후 변경사항이 반영되지 않는 경우

1. **브라우저 캐시 삭제**: Cmd + Shift + R (강력 새로고침)
2. **GitHub Pages 빌드 확인**: https://github.com/seunghyeon-cha/-/actions
3. **gh-pages 브랜치 확인**: https://github.com/seunghyeon-cha/-/tree/gh-pages

### 빌드 에러 발생시

```bash
cd frontend

# node_modules 삭제 및 재설치
rm -rf node_modules package-lock.json
npm install

# 빌드 재시도
npm run build
```

### Git 충돌 발생시

```bash
# main 브랜치에서
git fetch origin
git reset --hard origin/main

# gh-pages 브랜치 재생성
git branch -D gh-pages
./deploy-ghpages.sh
```

## 중요 파일

- `deploy-ghpages.sh`: 자동 배포 스크립트
- `frontend/next.config.js`: Next.js 설정 (basePath, assetPrefix 제거됨)
- `frontend/out/`: 빌드된 정적 파일들
- `.nojekyll`: Jekyll 비활성화 파일

## 주의사항

⚠️ **절대 수정하지 말아야 할 것들:**

1. `gh-pages` 브랜치를 직접 수정하지 마세요
   - 항상 `main` 브랜치에서 작업 후 배포 스크립트 사용

2. `frontend/next.config.js`에 basePath나 assetPrefix 추가하지 마세요
   - 저장소 이름이 `-`라서 루트 경로로 배포됩니다

3. `frontend/out/` 디렉토리를 git에 커밋하지 마세요
   - 이 디렉토리는 빌드시마다 자동 생성됩니다

## 배포 히스토리

- 2025-11-13: 초기 GitHub Pages 배포 완료
- 빌드 설정: Next.js 14.2.33, Static Export
- 페이지 수: 29개
- 배포 방식: gh-pages 브랜치

## 문의

배포 관련 문제가 발생하면:
1. 이 문서의 트러블슈팅 섹션 확인
2. GitHub Actions 로그 확인
3. 배포 스크립트 로그 확인
