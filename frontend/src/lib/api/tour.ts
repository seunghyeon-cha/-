import { apiClient } from './client';

/**
 * Tour API (한국관광공사 API) 클라이언트
 *
 * 백엔드를 통해 한국관광공사의 관광 정보를 조회합니다.
 */

// ============================================
// Types
// ============================================

export interface TourPlace {
  contentid: string;
  contenttypeid: string;
  title: string;
  addr1?: string;
  addr2?: string;
  mapx?: string;
  mapy?: string;
  tel?: string;
  firstimage?: string;
  firstimage2?: string;
  areacode?: string;
  sigungucode?: string;
  cat1?: string;
  cat2?: string;
  cat3?: string;
  createdtime?: string;
  modifiedtime?: string;
  overview?: string;
  homepage?: string;
  zipcode?: string;
}

export interface TourImage {
  contentid: string;
  originimgurl: string;
  smallimageurl: string;
  imgname: string;
  serialnum: string;
}

export interface TourApiResponse<T> {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items?: {
        item: T[];
      } | string;
      numOfRows?: number;
      pageNo?: number;
      totalCount?: number;
    };
  };
}

export interface TourSearchParams {
  areaCode?: string;
  sigunguCode?: string;
  contentTypeId?: string;
  numOfRows?: number;
  pageNo?: number;
}

// 지역 코드 (참고용)
export const AREA_CODES = {
  SEOUL: '1',
  INCHEON: '2',
  DAEJEON: '3',
  DAEGU: '4',
  GWANGJU: '5',
  BUSAN: '6',
  ULSAN: '7',
  SEJONG: '8',
  GYEONGGI: '31',
  GANGWON: '32',
  CHUNGBUK: '33',
  CHUNGNAM: '34',
  GYEONGBUK: '35',
  GYEONGNAM: '36',
  JEONBUK: '37',
  JEONNAM: '38',
  JEJU: '39',
} as const;

// 콘텐츠 타입 ID (참고용)
export const CONTENT_TYPE_IDS = {
  TOURIST_SPOT: '12', // 관광지
  CULTURE: '14', // 문화시설
  FESTIVAL: '15', // 축제/공연/행사
  COURSE: '25', // 여행코스
  LEPORTS: '28', // 레포츠
  ACCOMMODATION: '32', // 숙박
  SHOPPING: '38', // 쇼핑
  RESTAURANT: '39', // 음식점
} as const;

// ============================================
// API Functions
// ============================================

/**
 * 키워드로 관광지 검색
 *
 * @param keyword - 검색 키워드
 * @param pageNo - 페이지 번호 (기본값: 1)
 * @returns Tour API 응답
 *
 * @example
 * const results = await searchTourPlaces('경복궁', 1);
 */
export const searchTourPlaces = async (
  keyword: string,
  pageNo: number = 1,
): Promise<TourApiResponse<TourPlace>> => {
  const response = await apiClient.get('/api/tour/search', {
    params: {
      keyword,
      pageNo,
    },
  });
  return response.data;
};

/**
 * 지역 기반 관광지 목록 조회
 *
 * @param params - 검색 파라미터
 * @returns Tour API 응답
 *
 * @example
 * // 서울 관광지 10개 조회
 * const results = await getTourPlaces({
 *   areaCode: AREA_CODES.SEOUL,
 *   contentTypeId: CONTENT_TYPE_IDS.TOURIST_SPOT,
 *   numOfRows: 10,
 *   pageNo: 1,
 * });
 */
export const getTourPlaces = async (
  params: TourSearchParams = {},
): Promise<TourApiResponse<TourPlace>> => {
  const response = await apiClient.get('/api/tour/places', {
    params: {
      numOfRows: 10,
      pageNo: 1,
      ...params,
    },
  });
  return response.data;
};

/**
 * 관광지 상세 정보 조회
 *
 * @param contentId - 콘텐츠 ID
 * @returns Tour API 응답
 *
 * @example
 * const detail = await getTourPlaceDetail('2733967');
 */
export const getTourPlaceDetail = async (
  contentId: string,
): Promise<TourApiResponse<TourPlace>> => {
  const response = await apiClient.get(`/api/tour/places/${contentId}`);
  return response.data;
};

/**
 * 관광지 이미지 목록 조회
 *
 * @param contentId - 콘텐츠 ID
 * @returns Tour API 응답
 *
 * @example
 * const images = await getTourPlaceImages('2733967');
 */
export const getTourPlaceImages = async (
  contentId: string,
): Promise<TourApiResponse<TourImage>> => {
  const response = await apiClient.get(`/api/tour/places/${contentId}/images`);
  return response.data;
};

// ============================================
// Helper Functions
// ============================================

/**
 * Tour API 응답에서 아이템 배열 추출
 *
 * @param response - Tour API 응답
 * @returns 아이템 배열 (없으면 빈 배열)
 */
export const extractTourItems = <T>(
  response: TourApiResponse<T>,
): T[] => {
  const items = response.response.body.items;

  // items가 문자열("")이거나 undefined인 경우 빈 배열 반환
  if (!items || typeof items === 'string') {
    return [];
  }

  return items.item || [];
};

/**
 * Tour API 응답이 성공인지 확인
 *
 * @param response - Tour API 응답
 * @returns 성공 여부
 */
export const isTourApiSuccess = <T>(
  response: TourApiResponse<T>,
): boolean => {
  return response.response.header.resultCode === '0000';
};

/**
 * 좌표 문자열을 숫자로 변환
 *
 * @param coord - 좌표 문자열
 * @returns 숫자 좌표 (실패시 0)
 */
export const parseCoordinate = (coord?: string): number => {
  if (!coord) return 0;
  const parsed = parseFloat(coord);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Tour API 장소를 내부 Place 형식으로 변환
 * (추후 데이터베이스 동기화 시 사용)
 */
export const convertTourPlaceToPlace = (tourPlace: TourPlace) => {
  return {
    name: tourPlace.title,
    description: tourPlace.overview || '',
    address: `${tourPlace.addr1 || ''} ${tourPlace.addr2 || ''}`.trim(),
    lat: parseCoordinate(tourPlace.mapx),
    lng: parseCoordinate(tourPlace.mapy),
    images: tourPlace.firstimage ? [tourPlace.firstimage] : [],
    contact: tourPlace.tel || '',
    externalId: tourPlace.contentid,
    externalSource: 'TOUR_API',
  };
};
