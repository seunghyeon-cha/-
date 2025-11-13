#!/bin/bash

# 예림투어 GitHub Pages 자동 배포 스크립트
# 이 스크립트는 프론트엔드를 빌드하고 gh-pages 브랜치에 배포합니다

set -e  # 에러 발생시 스크립트 중단

echo "========================================="
echo "예림투어 GitHub Pages 자동 배포 시작"
echo "========================================="

# 현재 디렉토리 확인
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 1. 현재 브랜치 저장
CURRENT_BRANCH=$(git branch --show-current)
echo "현재 브랜치: $CURRENT_BRANCH"

# 2. main 브랜치로 전환
echo "main 브랜치로 전환 중..."
git checkout main

# 3. 변경사항 확인 및 커밋
if [[ -n $(git status -s) ]]; then
    echo "변경사항이 있습니다. 커밋을 진행합니다..."
    git add .
    git commit -m "Update before deployment $(date '+%Y-%m-%d %H:%M:%S')" || echo "커밋할 변경사항이 없거나 이미 커밋됨"
fi

# 4. 프론트엔드 빌드
echo "========================================="
echo "프론트엔드 빌드 시작..."
echo "========================================="
cd frontend

# node_modules가 없으면 설치
if [ ! -d "node_modules" ]; then
    echo "node_modules가 없습니다. 패키지 설치 중..."
    npm install
fi

# 빌드 실행
echo "Next.js 빌드 중..."
npm run build

# .nojekyll 파일 추가
touch out/.nojekyll

echo "빌드 완료!"
cd ..

# 5. gh-pages 브랜치 처리
echo "========================================="
echo "gh-pages 브랜치 업데이트 중..."
echo "========================================="

# gh-pages 브랜치가 이미 존재하는지 확인
if git show-ref --verify --quiet refs/heads/gh-pages; then
    echo "기존 gh-pages 브랜치 삭제 중..."
    git branch -D gh-pages
fi

# 원격 gh-pages 브랜치 정보 가져오기
git fetch origin gh-pages:gh-pages 2>/dev/null || echo "원격 gh-pages 브랜치 없음"

# gh-pages 브랜치가 원격에 있으면 삭제
if git show-ref --verify --quiet refs/heads/gh-pages; then
    git branch -D gh-pages
fi

# 새로운 orphan 브랜치 생성
echo "새 gh-pages 브랜치 생성 중..."
git checkout --orphan gh-pages

# 모든 파일 제거
echo "작업 디렉토리 정리 중..."
git rm -rf . 2>/dev/null || rm -rf *

# 빌드된 파일만 복사
echo "빌드 파일 복사 중..."
cp -r frontend/out/* .
cp frontend/out/.nojekyll .

# 불필요한 디렉토리 제거
rm -rf frontend backend Postgres.app

# 6. 커밋 및 푸시
echo "========================================="
echo "GitHub에 배포 중..."
echo "========================================="

git add .
git commit -m "Deploy to GitHub Pages - $(date '+%Y-%m-%d %H:%M:%S')"

echo "gh-pages 브랜치를 GitHub에 푸시 중..."
git push -f origin gh-pages

echo "========================================="
echo "배포 완료!"
echo "========================================="
echo ""
echo "웹사이트 URL: https://seunghyeon-cha.github.io/-/"
echo ""
echo "GitHub Pages 설정 확인:"
echo "1. https://github.com/seunghyeon-cha/-/settings/pages 방문"
echo "2. Source가 'gh-pages' 브랜치로 설정되어 있는지 확인"
echo "3. 1-2분 후 위 URL에서 사이트 확인"
echo ""

# 7. main 브랜치로 복귀
echo "main 브랜치로 복귀 중..."
git checkout main

echo "========================================="
echo "모든 작업이 완료되었습니다!"
echo "========================================="
