import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface Festival {
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
  createdtime?: string;
  modifiedtime?: string;
}

export interface FestivalResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items?: {
        item: Festival[];
      };
      numOfRows?: number;
      pageNo?: number;
      totalCount?: number;
    };
  };
}

export interface FestivalQueryParams {
  areaCode?: string;
  numOfRows?: number;
  pageNo?: number;
}

/**
 * 축제 목록 조회
 */
export async function getFestivals(params: FestivalQueryParams = {}): Promise<FestivalResponse> {
  try {
    const response = await axios.get(`${API_URL}/api/tour/festivals`, {
      params: {
        areaCode: params.areaCode,
        numOfRows: params.numOfRows || 20,
        pageNo: params.pageNo || 1,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch festivals:', error);
    throw error;
  }
}

/**
 * 축제 검색
 */
export async function searchFestivals(params: {
  keyword: string;
  areaCode?: string;
  numOfRows?: number;
  pageNo?: number;
}): Promise<FestivalResponse> {
  try {
    const response = await axios.get(`${API_URL}/api/tour/festivals/search`, {
      params: {
        keyword: params.keyword,
        areaCode: params.areaCode,
        numOfRows: params.numOfRows || 20,
        pageNo: params.pageNo || 1,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to search festivals:', error);
    throw error;
  }
}

// 축제 상세 정보 타입
export interface FestivalDetail extends Festival {
  overview?: string;
  homepage?: string;
  eventstartdate?: string;
  eventenddate?: string;
  playtime?: string;
  eventplace?: string;
  usetimefestival?: string;
  zipcode?: string;
  mlevel?: string;
}

// 축제 상세 정보 응답 타입
export interface FestivalDetailResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items?: {
        item: FestivalDetail[];
      };
      numOfRows?: number;
      pageNo?: number;
      totalCount?: number;
    };
  };
}

// 축제 이미지 응답 타입
export interface FestivalImage {
  contentid: string;
  imgname?: string;
  originimgurl: string;
  serialnum?: string;
  cpyrhtDivCd?: string;
  smallimageurl?: string;
}

export interface FestivalImagesResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items?: {
        item: FestivalImage[];
      };
      numOfRows?: number;
      pageNo?: number;
      totalCount?: number;
    };
  };
}

/**
 * 축제 상세 정보 조회
 */
export async function getFestivalById(contentId: string): Promise<FestivalDetailResponse> {
  try {
    const response = await axios.get<FestivalDetailResponse>(`${API_URL}/api/tour/festivals/${contentId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch festival detail:', error);
    throw error;
  }
}

/**
 * 축제 이미지 정보 조회
 */
export async function getFestivalImages(contentId: string): Promise<FestivalImagesResponse> {
  try {
    const response = await axios.get<FestivalImagesResponse>(`${API_URL}/api/tour/festivals/${contentId}/images`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch festival images:', error);
    throw error;
  }
}

/**
 * 지역 코드 목록
 */
export const AREA_CODES = {
  ALL: '',
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
};

/**
 * 지역 코드 라벨
 */
export const AREA_LABELS: Record<string, string> = {
  '': '전체',
  '1': '서울',
  '2': '인천',
  '3': '대전',
  '4': '대구',
  '5': '광주',
  '6': '부산',
  '7': '울산',
  '8': '세종',
  '31': '경기',
  '32': '강원',
  '33': '충북',
  '34': '충남',
  '35': '경북',
  '36': '경남',
  '37': '전북',
  '38': '전남',
  '39': '제주',
};
