#!/bin/bash

# GitHub Pages 배포 스크립트
# 사용법: ./deploy.sh

set -e

echo "🚀 Starting deployment to GitHub Pages..."

# 1. frontend 디렉토리로 이동
cd frontend

# 2. 의존성 설치 (필요한 경우)
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# 3. 빌드
echo "🔨 Building Next.js application..."
rm -rf .next out
NODE_OPTIONS='--max-old-space-size=4096' npm run build

# 4. .nojekyll 및 404.html 생성
echo "📝 Creating deployment files..."
cd out
echo '' > .nojekyll
cp index.html 404.html
cd ..

# 5. gh-pages 브랜치로 전환
echo "🔀 Switching to gh-pages branch..."
cd ..
git checkout --orphan gh-pages-temp 2>/dev/null || git checkout gh-pages-temp

# 6. 모든 파일 삭제
echo "🧹 Cleaning gh-pages branch..."
git rm -rf . 2>/dev/null || true
rm -rf * .* 2>/dev/null || true

# 7. out 디렉토리 내용을 루트로 복사
echo "📂 Copying build files..."
cp -r frontend/out/. .

# 8. node_modules와 기타 불필요한 파일 제거
rm -rf frontend .next node_modules 2>/dev/null || true

# 9. git에 추가 및 커밋
echo "📤 Committing and pushing..."
git add -A
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"

# 10. gh-pages 브랜치로 강제 푸시
git branch -D gh-pages 2>/dev/null || true
git branch -m gh-pages
git push -f origin gh-pages

# 11. main 브랜치로 복귀
echo "🔙 Returning to main branch..."
git checkout main

echo "✅ Deployment complete!"
echo "🌐 Your site will be available at: https://seunghyeon-cha.github.io/-/"
echo "⏰ Please wait a few minutes for GitHub Pages to update."
