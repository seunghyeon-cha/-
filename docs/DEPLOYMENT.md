# Smartrip 배포 가이드

## 목차
1. [백엔드 배포](#백엔드-배포)
2. [프론트엔드 배포](#프론트엔드-배포)
3. [도메인 및 SSL 설정](#도메인-및-ssl-설정)
4. [모니터링 설정](#모니터링-설정)
5. [백업 정책](#백업-정책)

---

## 백엔드 배포

### Option 1: Railway (권장)

1. [Railway](https://railway.app) 가입 및 프로젝트 생성
2. GitHub 저장소 연결
3. 환경 변수 설정:
   ```
   NODE_ENV=production
   PORT=4000
   JWT_SECRET=<32자 이상 랜덤 문자열>
   TOUR_API_KEY=<공공데이터포털 API 키>
   CORS_ORIGINS=https://smartrip.com
   ```
4. 자동 배포 활성화
5. 배포 URL 확인: `https://your-app.railway.app`

### Option 2: Render

1. [Render](https://render.com) 가입
2. New Web Service → GitHub 저장소 연결
3. 설정:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
4. 환경 변수 설정 (Railway와 동일)
5. Disk 추가 (SQLite 영구 저장용)

### Option 3: Docker

```bash
# 이미지 빌드
docker build -t smartrip-backend ./backend

# 컨테이너 실행
docker run -d \
  -p 4000:4000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-secret \
  -v smartrip-data:/app/data \
  smartrip-backend
```

---

## 프론트엔드 배포

### Vercel (권장)

1. [Vercel](https://vercel.com) 가입
2. Import Git Repository → GitHub 저장소 선택
3. Root Directory: `frontend` 선택
4. 환경 변수 설정:
   ```
   NEXT_PUBLIC_API_URL=https://api.smartrip.com
   NEXT_PUBLIC_SITE_URL=https://smartrip.com
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
5. Deploy 클릭
6. 커스텀 도메인 연결

### 배포 확인사항
- [ ] 빌드 성공 확인
- [ ] API 연결 테스트
- [ ] 이미지 로딩 확인
- [ ] 모바일 반응형 확인

---

## 도메인 및 SSL 설정

### 도메인 구매
1. 도메인 등록업체 선택:
   - [가비아](https://gabia.com)
   - [Namecheap](https://namecheap.com)
   - [Google Domains](https://domains.google)
2. `smartrip.com` 또는 원하는 도메인 검색 및 구매

### DNS 설정

#### 프론트엔드 (Vercel)
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### 백엔드 (Railway/Render)
```
Type: CNAME
Name: api
Value: <railway-or-render-provided-domain>
```

### SSL 인증서
- **Vercel**: 자동 SSL 발급 (Let's Encrypt)
- **Railway/Render**: 자동 SSL 발급
- **수동 설정 시**: [Let's Encrypt](https://letsencrypt.org) 또는 [Cloudflare](https://cloudflare.com) 사용

---

## 모니터링 설정

### 1. 서버 모니터링

#### UptimeRobot (무료)
1. [UptimeRobot](https://uptimerobot.com) 가입
2. New Monitor 추가
3. Monitor Type: HTTP(s)
4. URL: `https://api.smartrip.com/health`
5. Alert Contact 설정 (이메일/Slack)

#### Better Uptime (무료 플랜)
- 더 상세한 상태 페이지 제공
- 팀 알림 기능

### 2. 에러 추적

#### Sentry (권장)
```bash
# 백엔드
npm install @sentry/node

# 프론트엔드
npm install @sentry/nextjs
```

### 3. 로그 모니터링
- Railway/Render: 내장 로그 뷰어 사용
- 고급: [Logtail](https://logtail.com) 또는 [Papertrail](https://papertrail.com)

---

## 백업 정책

### SQLite 백업 (이미 구현됨)

```bash
# 수동 백업
npm run backup

# 백업 목록 확인
npm run backup:list

# 복원
npm run backup:restore <filename>
```

### 자동 백업 설정

#### Cron Job (서버에서)
```bash
# crontab -e
# 매일 새벽 3시 백업
0 3 * * * cd /app && npm run backup
```

#### GitHub Actions
```yaml
# .github/workflows/backup.yml
name: Daily Backup
on:
  schedule:
    - cron: '0 3 * * *'
jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run backup
      - uses: actions/upload-artifact@v3
        with:
          name: backup
          path: backups/
```

### 백업 보관 정책
- 일일 백업: 7일 보관
- 주간 백업: 4주 보관
- 월간 백업: 12개월 보관

---

## 배포 체크리스트

### 배포 전
- [ ] 모든 테스트 통과
- [ ] 환경 변수 설정 완료
- [ ] CORS 설정 확인
- [ ] 시크릿 키 변경 (JWT_SECRET 등)

### 배포 후
- [ ] 헬스체크 엔드포인트 확인
- [ ] API 응답 테스트
- [ ] 프론트엔드 빌드 확인
- [ ] SSL 인증서 확인
- [ ] 모니터링 알림 테스트

### 롤백 계획
1. Vercel/Railway 대시보드에서 이전 배포로 롤백
2. 또는 Git revert 후 재배포
3. 데이터베이스 복원 필요 시 백업에서 복원

---

## 문의 및 지원

- 기술 문의: dev@smartrip.com
- 긴급 연락: 1588-0000
