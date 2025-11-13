# 예림투어 - 빠른 시작 가이드

## 🚀 웹사이트 확인

**배포된 웹사이트**: https://seunghyeon-cha.github.io/-/

브라우저에서 위 링크를 클릭하여 예림투어 웹사이트를 확인하세요!

## 📝 프론트엔드 수정 및 배포 (3단계)

### 1단계: 개발 서버 실행

```bash
cd /Users/chacha4164/Desktop/cursor/travel/frontend
npm run dev
```

브라우저에서 http://localhost:3000 열기

### 2단계: 코드 수정

원하는 파일을 수정하고 localhost:3000에서 실시간으로 확인

### 3단계: 배포

```bash
cd /Users/chacha4164/Desktop/cursor/travel
./deploy-ghpages.sh
```

끝! 1-2분 후 https://seunghyeon-cha.github.io/-/ 에서 변경사항 확인

## 🔧 문제 발생시

### 배포 전 검증

```bash
./verify-deployment.sh
```

### 웹사이트가 404 에러를 표시할 때

```bash
./enable-github-pages.sh
```

브라우저에서 GitHub Pages 설정을 확인하고:
- Source: "Deploy from a branch"
- Branch: "gh-pages"
- Folder: "/ (root)"

위 설정이 되어있는지 확인하고 Save 클릭

### 빌드 에러 발생시

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📚 상세 문서

더 자세한 내용은 다음 문서를 참고하세요:

- **DEPLOYMENT_COMPLETE.md**: 배포 완료 가이드 및 전체 기능 설명
- **README_DEPLOYMENT.md**: 상세 배포 가이드 및 트러블슈팅

## ✅ 현재 상태

- ✅ 웹사이트 배포 완료
- ✅ HTTP 200 OK (정상 접근 가능)
- ✅ 자동 배포 스크립트 준비
- ✅ 에러 방지 설정 완료
- ✅ 향후 수정 가능

## 📞 도움이 필요하면

1. `DEPLOYMENT_COMPLETE.md` 확인
2. `./verify-deployment.sh` 실행하여 문제 진단
3. 에러 메시지를 자세히 읽어보기

---

**배포 완료!** 🎉
