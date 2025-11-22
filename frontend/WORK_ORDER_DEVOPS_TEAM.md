# DevOps Team - Work Order

**발행일**: 2025-11-19
**우선순위**: 긴급 (P0)
**담당자**: DevOps Team
**예상 소요 시간**: 30분

---

## 작업 개요

GitHub Actions Playwright workflow YAML 파싱 에러를 해결하여 CI/CD 파이프라인이 정상 작동하도록 수정

---

## 문제 상황

**위치**: `.github/workflows/playwright.yml:1:1`
**에러 메시지**: "Expected a scalar value, a sequence, or a mapping"
**영향도**:
- GitHub Actions workflow가 실행되지 않을 수 있음
- E2E 테스트 자동화가 차단될 수 있음
- CI/CD 파이프라인 전체에 영향 가능

---

## 작업 내용

### Task 1: YAML 파일 검증 및 수정
1. `.github/workflows/playwright.yml` 파일 구문 검증
2. YAML 파싱 에러 원인 파악
3. 파일 인코딩 확인 (UTF-8 BOM 여부 체크)
4. 들여쓰기 및 특수문자 오류 수정

### Task 2: 로컬 테스트
```bash
# YAML 검증 도구 사용
yamllint .github/workflows/playwright.yml

# GitHub Actions CLI로 검증
gh workflow view playwright.yml
```

### Task 3: 검증
- IDE에서 YAML 에러가 사라지는지 확인
- GitHub에 push 후 workflow가 정상 실행되는지 확인

---

## 체크리스트

- [ ] YAML 파일 구문 검증 완료
- [ ] 파일 인코딩 확인 (UTF-8)
- [ ] IDE 에러 해결 확인
- [ ] 로컬 YAML 검증 통과
- [ ] GitHub Actions workflow 정상 실행 확인

---

## 참고 자료

- [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Playwright GitHub Actions Guide](https://playwright.dev/docs/ci-github-actions)

---

## 완료 보고

작업 완료 후 다음 정보를 포함하여 보고:
1. 발견된 문제의 근본 원인
2. 적용한 해결 방법
3. 테스트 결과 (스크린샷 포함)
4. 추가 발견 사항 (있는 경우)
