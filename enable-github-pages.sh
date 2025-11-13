#!/bin/bash

# GitHub Pages 자동 활성화 스크립트
# macOS에서 자동으로 GitHub Pages 설정 페이지를 엽니다

echo "========================================="
echo "GitHub Pages 설정 페이지 열기"
echo "========================================="
echo ""
echo "다음 작업을 수행합니다:"
echo "1. GitHub Settings 페이지를 브라우저에서 엽니다"
echo "2. Pages 설정으로 이동합니다"
echo ""
echo "페이지가 열리면 다음을 확인하세요:"
echo "- Source: Deploy from a branch"
echo "- Branch: gh-pages"
echo "- Folder: / (root)"
echo ""
echo "이미 설정되어 있다면 아무것도 하지 않아도 됩니다!"
echo ""

# GitHub Settings Pages 페이지 열기
open "https://github.com/seunghyeon-cha/-/settings/pages"

echo "브라우저에서 설정 페이지가 열렸습니다."
echo ""
echo "설정 후 다음 URL에서 사이트를 확인하세요:"
echo "https://seunghyeon-cha.github.io/-/"
echo ""
echo "배포가 완료되려면 1-2분 정도 걸립니다."
