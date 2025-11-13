#!/bin/bash

# 배포 검증 스크립트
# 배포 전후에 실행하여 문제를 사전에 발견합니다

set -e

echo "========================================="
echo "예림투어 배포 상태 검증"
echo "========================================="
echo ""

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 성공/실패 카운터
SUCCESS=0
FAILED=0
WARNING=0

# 1. Git 저장소 확인
echo "1. Git 저장소 확인 중..."
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Git 저장소 확인 완료"
    SUCCESS=$((SUCCESS+1))
else
    echo -e "${RED}✗${NC} Git 저장소를 찾을 수 없습니다"
    FAILED=$((FAILED+1))
    exit 1
fi
echo ""

# 2. 브랜치 확인
echo "2. Git 브랜치 확인 중..."
CURRENT_BRANCH=$(git branch --show-current)
echo "   현재 브랜치: $CURRENT_BRANCH"

if git show-ref --verify --quiet refs/heads/gh-pages; then
    echo -e "${GREEN}✓${NC} gh-pages 브랜치 존재함"
    SUCCESS=$((SUCCESS+1))
else
    echo -e "${YELLOW}⚠${NC} gh-pages 브랜치가 없습니다 (첫 배포시 정상)"
    WARNING=$((WARNING+1))
fi
echo ""

# 3. 원격 저장소 확인
echo "3. 원격 저장소 확인 중..."
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")
if [ -n "$REMOTE_URL" ]; then
    echo "   원격 저장소: $REMOTE_URL"
    echo -e "${GREEN}✓${NC} 원격 저장소 설정 완료"
    SUCCESS=$((SUCCESS+1))
else
    echo -e "${RED}✗${NC} 원격 저장소가 설정되지 않았습니다"
    FAILED=$((FAILED+1))
fi
echo ""

# 4. 프론트엔드 디렉토리 확인
echo "4. 프론트엔드 디렉토리 확인 중..."
if [ -d "frontend" ]; then
    echo -e "${GREEN}✓${NC} frontend 디렉토리 존재함"
    SUCCESS=$((SUCCESS+1))
else
    echo -e "${RED}✗${NC} frontend 디렉토리를 찾을 수 없습니다"
    FAILED=$((FAILED+1))
fi
echo ""

# 5. package.json 확인
echo "5. package.json 확인 중..."
if [ -f "frontend/package.json" ]; then
    echo -e "${GREEN}✓${NC} package.json 존재함"
    SUCCESS=$((SUCCESS+1))
else
    echo -e "${RED}✗${NC} package.json을 찾을 수 없습니다"
    FAILED=$((FAILED+1))
fi
echo ""

# 6. next.config.js 확인
echo "6. next.config.js 설정 확인 중..."
if [ -f "frontend/next.config.js" ]; then
    # basePath와 assetPrefix가 없는지 확인
    if grep -q "basePath:" frontend/next.config.js; then
        echo -e "${RED}✗${NC} basePath가 설정되어 있습니다 (제거 필요)"
        FAILED=$((FAILED+1))
    elif grep -q "assetPrefix:" frontend/next.config.js; then
        echo -e "${RED}✗${NC} assetPrefix가 설정되어 있습니다 (제거 필요)"
        FAILED=$((FAILED+1))
    else
        echo -e "${GREEN}✓${NC} next.config.js 설정이 올바릅니다"
        SUCCESS=$((SUCCESS+1))
    fi

    # output: 'export' 확인
    if grep -q "output: 'export'" frontend/next.config.js; then
        echo -e "${GREEN}✓${NC} static export 설정 확인"
        SUCCESS=$((SUCCESS+1))
    else
        echo -e "${RED}✗${NC} static export 설정이 없습니다"
        FAILED=$((FAILED+1))
    fi
else
    echo -e "${RED}✗${NC} next.config.js를 찾을 수 없습니다"
    FAILED=$((FAILED+1))
fi
echo ""

# 7. Node.js 버전 확인
echo "7. Node.js 설치 확인 중..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "   Node.js 버전: $NODE_VERSION"
    echo -e "${GREEN}✓${NC} Node.js 설치됨"
    SUCCESS=$((SUCCESS+1))
else
    echo -e "${RED}✗${NC} Node.js가 설치되지 않았습니다"
    FAILED=$((FAILED+1))
fi
echo ""

# 8. npm 확인
echo "8. npm 설치 확인 중..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "   npm 버전: $NPM_VERSION"
    echo -e "${GREEN}✓${NC} npm 설치됨"
    SUCCESS=$((SUCCESS+1))
else
    echo -e "${RED}✗${NC} npm이 설치되지 않았습니다"
    FAILED=$((FAILED+1))
fi
echo ""

# 9. 빌드 출력 디렉토리 확인
echo "9. 빌드 출력 확인 중..."
if [ -d "frontend/out" ]; then
    FILE_COUNT=$(find frontend/out -type f | wc -l | tr -d ' ')
    echo "   빌드 파일 수: $FILE_COUNT"

    if [ -f "frontend/out/index.html" ]; then
        echo -e "${GREEN}✓${NC} index.html 존재함"
        SUCCESS=$((SUCCESS+1))
    else
        echo -e "${RED}✗${NC} index.html이 없습니다"
        FAILED=$((FAILED+1))
    fi

    if [ -f "frontend/out/.nojekyll" ]; then
        echo -e "${GREEN}✓${NC} .nojekyll 파일 존재함"
        SUCCESS=$((SUCCESS+1))
    else
        echo -e "${YELLOW}⚠${NC} .nojekyll 파일이 없습니다 (빌드시 자동 생성됨)"
        WARNING=$((WARNING+1))
    fi
else
    echo -e "${YELLOW}⚠${NC} 빌드 출력 디렉토리가 없습니다 (빌드 필요)"
    WARNING=$((WARNING+1))
fi
echo ""

# 10. 웹사이트 접근성 확인
echo "10. 배포된 웹사이트 확인 중..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://seunghyeon-cha.github.io/-/" 2>/dev/null || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓${NC} 웹사이트 정상 접근 가능 (HTTP 200)"
    SUCCESS=$((SUCCESS+1))
elif [ "$HTTP_CODE" = "404" ]; then
    echo -e "${YELLOW}⚠${NC} 웹사이트 404 에러 (GitHub Pages 설정 확인 필요)"
    echo "   https://github.com/seunghyeon-cha/-/settings/pages 에서 확인하세요"
    WARNING=$((WARNING+1))
else
    echo -e "${YELLOW}⚠${NC} 웹사이트 상태: HTTP $HTTP_CODE"
    WARNING=$((WARNING+1))
fi
echo ""

# 결과 요약
echo "========================================="
echo "검증 결과 요약"
echo "========================================="
echo -e "${GREEN}성공: $SUCCESS${NC}"
echo -e "${YELLOW}경고: $WARNING${NC}"
echo -e "${RED}실패: $FAILED${NC}"
echo ""

if [ $FAILED -gt 0 ]; then
    echo -e "${RED}배포 전에 실패한 항목들을 수정해주세요!${NC}"
    exit 1
elif [ $WARNING -gt 0 ]; then
    echo -e "${YELLOW}경고 항목이 있지만 배포는 가능합니다.${NC}"
    exit 0
else
    echo -e "${GREEN}모든 검증을 통과했습니다! 배포 준비 완료!${NC}"
    exit 0
fi
