# 관광지/맛집/숙소 검색 및 필터 기능 추가 작업 지시서

**발행일**: 2025-11-10
**발행자**: PO Team
**우선순위**: 🟡 **중요** (1-2일 소요)
**상태**: 🚀 **작업 시작**

---

## 📋 작업 요약

### 사용자 요청사항
> "관광지 맛집 숙소 카테고리에 검색 기능과 각 지역별로 깔끔하게 정리할 수 있는 기능을 추가하고싶은데"

### 작업 목표
1. ✅ **검색 기능 추가** - 장소명, 주소로 실시간 검색
2. ✅ **지역별 필터 추가** - 내부 장소 모드에서도 지역 선택 가능
3. ✅ **UI 개선** - 필터와 검색을 깔끔하게 정리
4. ✅ **모바일 반응형** - 작은 화면에서도 사용 편리하게

---

## 📊 현재 상태 분석

### 기존 기능 (이미 구현됨)
- ✅ 카테고리 탭 (전체, 관광지, 맛집, 숙소)
- ✅ 정렬 기능 (최신순, 평점순, 리뷰 많은 순)
- ✅ 리스트/지도 뷰 전환
- ✅ Tour API 모드에서 지역 선택 (서울, 부산 등)
- ✅ 페이지네이션

### 부족한 기능 (추가 필요)
- ❌ **검색 기능** - 장소명이나 주소로 검색 불가
- ❌ **내부 장소 지역 필터** - Tour API에만 있고 내부 장소엔 없음
- ❌ **필터 UI 개선** - 검색/필터가 흩어져 있음

---

## 🎯 작업 우선순위

### Phase 1: 검색 기능 추가 (1시간)
1. 검색창 UI 컴포넌트 추가
2. 검색 API 파라미터 추가
3. 실시간 검색 디바운싱 적용
4. 검색 결과 표시

### Phase 2: 지역 필터 추가 (1시간)
1. 지역 데이터 정의 (시/도 목록)
2. 지역 선택 드롭다운 추가
3. 지역별 필터링 API 연동
4. URL 쿼리 파라미터 동기화

### Phase 3: UI 개선 (30분)
1. 필터 영역을 상단에 통합
2. 모바일 반응형 레이아웃
3. 필터 초기화 버튼
4. 활성화된 필터 표시

### Phase 4: 테스트 및 문서화 (30분)
1. 전체 기능 테스트
2. 에러 핸들링 확인
3. 문서화 완료

---

## 👥 팀별 작업 지시

### 🎯 PO Team
**담당자**: PO
**작업 내용**:
- [x] 사용자 요구사항 분석
- [x] 현재 기능 파악
- [x] 작업 지시서 작성
- [ ] 각 팀 작업 모니터링
- [ ] 기능 테스트 및 검수
- [ ] 최종 승인

**예상 소요 시간**: 전체 작업 모니터링

---

### 💻 Frontend Team

#### 🔍 Task 1: 검색창 UI 컴포넌트 추가

**파일**: `src/app/(main)/places/page.tsx`

**작업 내용**:
```typescript
// 1. 검색 상태 추가
const [searchQuery, setSearchQuery] = useState('');
const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

// 2. 디바운싱 적용
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearchQuery(searchQuery);
  }, 500);

  return () => clearTimeout(timer);
}, [searchQuery]);

// 3. 검색창 UI
<div className="relative">
  <input
    type="text"
    placeholder="장소명 또는 주소로 검색..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg"
  />
  <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400">
    {/* 검색 아이콘 */}
  </svg>
</div>
```

**검증**:
- [ ] 검색창 표시 확인
- [ ] 입력 시 500ms 디바운싱 작동
- [ ] 검색 결과 필터링

---

#### 📍 Task 2: 지역 필터 추가

**파일**: `src/app/(main)/places/page.tsx`

**작업 내용**:
```typescript
// 1. 지역 데이터 정의
const KOREA_REGIONS = [
  { code: '', name: '전체 지역' },
  { code: 'seoul', name: '서울특별시' },
  { code: 'busan', name: '부산광역시' },
  { code: 'incheon', name: '인천광역시' },
  { code: 'daegu', name: '대구광역시' },
  { code: 'gwangju', name: '광주광역시' },
  { code: 'daejeon', name: '대전광역시' },
  { code: 'ulsan', name: '울산광역시' },
  { code: 'sejong', name: '세종특별자치시' },
  { code: 'gyeonggi', name: '경기도' },
  { code: 'gangwon', name: '강원특별자치도' },
  { code: 'chungbuk', name: '충청북도' },
  { code: 'chungnam', name: '충청남도' },
  { code: 'jeonbuk', name: '전북특별자치도' },
  { code: 'jeonnam', name: '전라남도' },
  { code: 'gyeongbuk', name: '경상북도' },
  { code: 'gyeongnam', name: '경상남도' },
  { code: 'jeju', name: '제주특별자치도' },
];

// 2. 지역 상태 추가
const [selectedRegion, setSelectedRegion] = useState('');

// 3. 지역 선택 드롭다운
<select
  value={selectedRegion}
  onChange={(e) => setSelectedRegion(e.target.value)}
  className="px-3 py-2 border border-gray-300 rounded-lg"
>
  {KOREA_REGIONS.map((region) => (
    <option key={region.code} value={region.code}>
      {region.name}
    </option>
  ))}
</select>
```

**검증**:
- [ ] 지역 드롭다운 표시
- [ ] 지역 선택 시 필터링
- [ ] URL 쿼리 파라미터 동기화

---

#### 🎨 Task 3: 필터 UI 통합 및 개선

**작업 내용**:
1. 검색/필터 영역을 한 곳에 모으기
2. 활성화된 필터 뱃지 표시
3. 필터 초기화 버튼
4. 모바일 반응형 레이아웃

**UI 구조**:
```
┌────────────────────────────────────────┐
│ [내부 장소] [Tour API]                  │
├────────────────────────────────────────┤
│ [검색창.....................]          │
│ [지역▼] [카테고리: 전체▼] [정렬▼]    │
│ 활성 필터: [서울 ×] [관광지 ×] [초기화]│
├────────────────────────────────────────┤
│ 총 125개의 장소                        │
└────────────────────────────────────────┘
```

**모바일 레이아웃**:
```
┌──────────────┐
│ [내부][Tour] │
│ [검색창...] │
│ [지역 ▼]    │
│ [카테고리▼] │
│ [정렬 ▼]    │
│ [초기화]    │
│ 총 125개    │
└──────────────┘
```

---

#### 🔌 Task 4: API 연동

**파일**: `src/lib/api/places.ts`

**작업 내용**:
```typescript
// getPlaces 함수에 파라미터 추가
export interface PlacesQueryParams {
  category?: PlaceCategory;
  sort?: SortOption;
  page?: number;
  limit?: number;
  search?: string;        // ✅ 추가
  region?: string;        // ✅ 추가
}

export const getPlaces = async (params: PlacesQueryParams) => {
  const queryParams = new URLSearchParams();

  if (params.category) queryParams.append('category', params.category);
  if (params.sort) queryParams.append('sort', params.sort);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);      // ✅ 추가
  if (params.region) queryParams.append('region', params.region);      // ✅ 추가

  // ... API 호출
};
```

**검증**:
- [ ] search 파라미터 전달
- [ ] region 파라미터 전달
- [ ] 응답 정상 처리

---

### 🔙 Backend Team

#### 📡 Task 1: 검색 API 지원

**파일**: `src/places/places.service.ts` (backend)

**작업 내용**:
```typescript
// findAll 메서드에 검색 기능 추가
async findAll(query: PlacesQueryDto) {
  const whereConditions: any = {};

  // 카테고리 필터
  if (query.category) {
    whereConditions.category = query.category;
  }

  // 검색 필터 추가
  if (query.search) {
    whereConditions[Op.or] = [
      { name: { [Op.like]: `%${query.search}%` } },
      { address: { [Op.like]: `%${query.search}%` } },
    ];
  }

  // 지역 필터 추가
  if (query.region) {
    whereConditions.address = { [Op.like]: `%${query.region}%` };
  }

  // ... 쿼리 실행
}
```

**검증**:
- [ ] search 파라미터로 name, address 검색
- [ ] region 파라미터로 지역 필터링
- [ ] 성능 최적화 (인덱스 확인)

---

#### 📝 Task 2: DTO 업데이트

**파일**: `src/places/dto/places-query.dto.ts` (backend)

**작업 내용**:
```typescript
export class PlacesQueryDto {
  @IsOptional()
  @IsEnum(PlaceCategory)
  category?: PlaceCategory;

  @IsOptional()
  @IsEnum(SortOption)
  sort?: SortOption;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;

  // ✅ 추가
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  // ✅ 추가
  @IsOptional()
  @IsString()
  region?: string;
}
```

---

### 📝 Documentation Team

**담당자**: Documentation
**작업 내용**:
- [ ] 새 기능 사용법 문서화
- [ ] API 파라미터 문서 업데이트
- [ ] 스크린샷 및 예제 추가
- [ ] 완료 보고서 작성

---

## 🎨 UI/UX 가이드

### 검색창
- **위치**: 페이지 상단, 카테고리 탭 아래
- **크기**: 전체 너비의 100% (max-width: 600px)
- **플레이스홀더**: "장소명 또는 주소로 검색..."
- **아이콘**: 왼쪽에 돋보기 아이콘
- **디바운싱**: 500ms

### 지역 필터
- **위치**: 검색창 오른쪽 (모바일: 검색창 아래)
- **스타일**: 드롭다운 select
- **기본값**: "전체 지역"
- **옵션**: 17개 시도

### 활성 필터 표시
- **위치**: 검색/필터 영역 바로 아래
- **스타일**:
  ```
  [서울 ×] [관광지 ×] [초기화 버튼]
  ```
- **색상**:
  - 뱃지: `bg-primary-100 text-primary-700`
  - 초기화: `text-gray-600 hover:text-gray-900`

### 반응형 브레이크포인트
- **Desktop** (lg: 1024px+): 검색/필터 한 줄에 배치
- **Tablet** (md: 768px+): 검색 한 줄, 필터 한 줄
- **Mobile** (sm: 640px-): 모두 세로 배치

---

## 🔍 테스트 체크리스트

### 검색 기능
- [ ] 장소명으로 검색 시 정확한 결과 표시
- [ ] 주소로 검색 시 정확한 결과 표시
- [ ] 부분 검색 가능 (예: "서울" → "서울역", "서울숲" 등)
- [ ] 검색어 입력 중 디바운싱 작동
- [ ] 검색 결과 없을 때 빈 상태 표시
- [ ] 검색어 지울 때 전체 목록 복원

### 지역 필터
- [ ] 전체 지역 선택 시 모든 장소 표시
- [ ] 특정 지역 선택 시 해당 지역만 표시
- [ ] 지역 + 카테고리 조합 필터링
- [ ] 지역 + 검색어 조합 필터링
- [ ] URL 쿼리 파라미터에 지역 반영

### UI/UX
- [ ] 데스크톱에서 레이아웃 깔끔
- [ ] 태블릿에서 레이아웃 적절
- [ ] 모바일에서 모든 요소 사용 가능
- [ ] 활성 필터 뱃지 표시
- [ ] 초기화 버튼으로 모든 필터 제거
- [ ] 로딩 상태 표시

### 성능
- [ ] 검색 디바운싱으로 불필요한 요청 감소
- [ ] 페이지네이션 정상 작동
- [ ] 필터 변경 시 첫 페이지로 이동
- [ ] API 응답 시간 2초 이내

### 에러 처리
- [ ] API 에러 시 사용자 친화적 메시지
- [ ] 네트워크 에러 처리
- [ ] 잘못된 검색어 처리
- [ ] 결과 없을 때 안내 메시지

---

## 📐 구현 예시 코드

### 완전한 필터 UI 예시

```tsx
{/* 검색 및 필터 영역 */}
<div className="bg-white border-b border-gray-200 py-4">
  <div className="max-w-7xl mx-auto px-6">
    {/* 검색창 */}
    <div className="mb-4">
      <div className="relative max-w-2xl">
        <input
          type="text"
          placeholder="장소명 또는 주소로 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>

    {/* 필터 영역 */}
    <div className="flex flex-wrap gap-3 items-center">
      {/* 지역 선택 */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">지역</label>
        <select
          value={selectedRegion}
          onChange={(e) => handleRegionChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          {KOREA_REGIONS.map((region) => (
            <option key={region.code} value={region.code}>
              {region.name}
            </option>
          ))}
        </select>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 정렬 */}
      <select
        value={sortOption}
        onChange={handleSortChange}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm ml-auto"
      >
        <option value="latest">최신순</option>
        <option value="rating">평점순</option>
        <option value="reviews">리뷰 많은 순</option>
      </select>
    </div>

    {/* 활성 필터 표시 */}
    {(searchQuery || selectedRegion || activeTab !== 'ALL') && (
      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <span className="text-sm text-gray-600">활성 필터:</span>

        {searchQuery && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
            검색: {searchQuery}
            <button
              onClick={() => setSearchQuery('')}
              className="hover:text-primary-900"
            >
              ×
            </button>
          </span>
        )}

        {selectedRegion && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
            {KOREA_REGIONS.find(r => r.code === selectedRegion)?.name}
            <button
              onClick={() => setSelectedRegion('')}
              className="hover:text-primary-900"
            >
              ×
            </button>
          </span>
        )}

        {activeTab !== 'ALL' && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
            {tabs.find(t => t.key === activeTab)?.label}
            <button
              onClick={() => handleTabChange('ALL')}
              className="hover:text-primary-900"
            >
              ×
            </button>
          </span>
        )}

        <button
          onClick={handleClearAllFilters}
          className="text-sm text-gray-600 hover:text-gray-900 underline"
        >
          모두 초기화
        </button>
      </div>
    )}

    {/* 결과 개수 */}
    <div className="mt-4 text-sm text-gray-600">
      총 <span className="font-semibold text-gray-900">{meta.total}</span>개의 장소
    </div>
  </div>
</div>
```

---

## 🚀 배포 전 최종 체크리스트

- [ ] 모든 기능 테스트 통과
- [ ] 모바일 반응형 확인
- [ ] API 에러 핸들링 완료
- [ ] 로딩 상태 표시
- [ ] 빈 상태 메시지
- [ ] 접근성 (키보드 네비게이션, ARIA)
- [ ] 코드 리뷰 완료
- [ ] 문서화 완료
- [ ] PO 최종 승인

---

## 📝 완료 보고서 형식

작업 완료 시 아래 형식으로 보고서 작성:

```markdown
# 검색 및 필터 기능 추가 완료 보고서

## 완료된 기능
1. ✅ 검색 기능 (장소명, 주소)
2. ✅ 지역 필터 (17개 시도)
3. ✅ 통합 UI 개선
4. ✅ 모바일 반응형

## 수정된 파일
- src/app/(main)/places/page.tsx
- src/lib/api/places.ts
- (backend) src/places/places.service.ts
- (backend) src/places/dto/places-query.dto.ts

## 테스트 결과
- 검색: ✅ 통과
- 필터: ✅ 통과
- 반응형: ✅ 통과
- 성능: ✅ 통과

## Before/After 스크린샷
[스크린샷 첨부]

## 사용자 피드백
[피드백 기록]
```

---

**작성자**: PO Team
**최종 수정**: 2025-11-10
**다음 리뷰**: 기능 완료 후

**📢 모든 에러는 즉시 해결하고, 작업 내용은 실시간으로 기록해야 합니다!**
