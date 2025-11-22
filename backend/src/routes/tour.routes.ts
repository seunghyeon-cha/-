import { Router } from 'express';
import axios from 'axios';

const router = Router();

// 한국관광공사 Tour API 설정
const TOUR_API_BASE_URL = 'http://apis.data.go.kr/B551011/KorService1';

// 공통 API 파라미터 - env 변수는 함수 호출 시점에 접근
const getCommonParams = () => ({
  serviceKey: process.env.TOUR_API_KEY || '',
  MobileOS: 'ETC',
  MobileApp: 'Smartrip',
  _type: 'json',
});

// 지역 기반 관광지 목록 조회
router.get('/places', async (req, res) => {
  try {
    const { areaCode, sigunguCode, contentTypeId, numOfRows = 10, pageNo = 1 } = req.query;

    const response = await axios.get(`${TOUR_API_BASE_URL}/areaBasedList1`, {
      params: {
        ...getCommonParams(),
        areaCode: areaCode || '',
        sigunguCode: sigunguCode || '',
        contentTypeId: contentTypeId || '',
        numOfRows: Number(numOfRows),
        pageNo: Number(pageNo),
        listYN: 'Y',
        arrange: 'A',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Tour API places error:', error);
    res.status(500).json({
      response: {
        header: { resultCode: '9999', resultMsg: 'API 호출 오류' },
        body: { items: '', numOfRows: 0, pageNo: 1, totalCount: 0 }
      }
    });
  }
});

// 키워드 검색
router.get('/search', async (req, res) => {
  try {
    const { keyword, pageNo = 1 } = req.query;

    if (!keyword) {
      return res.status(400).json({ message: '검색어를 입력해주세요.' });
    }

    const response = await axios.get(`${TOUR_API_BASE_URL}/searchKeyword1`, {
      params: {
        ...getCommonParams(),
        keyword: keyword as string,
        numOfRows: 20,
        pageNo: Number(pageNo),
        listYN: 'Y',
        arrange: 'A',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Tour API search error:', error);
    res.status(500).json({
      response: {
        header: { resultCode: '9999', resultMsg: 'API 호출 오류' },
        body: { items: '', numOfRows: 0, pageNo: 1, totalCount: 0 }
      }
    });
  }
});

// 관광지 상세 정보 조회
router.get('/places/:contentId', async (req, res) => {
  try {
    const { contentId } = req.params;

    const response = await axios.get(`${TOUR_API_BASE_URL}/detailCommon1`, {
      params: {
        ...getCommonParams(),
        contentId,
        defaultYN: 'Y',
        firstImageYN: 'Y',
        areacodeYN: 'Y',
        catcodeYN: 'Y',
        addrinfoYN: 'Y',
        mapinfoYN: 'Y',
        overviewYN: 'Y',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Tour API detail error:', error);
    res.status(500).json({
      response: {
        header: { resultCode: '9999', resultMsg: 'API 호출 오류' },
        body: { items: '', numOfRows: 0, pageNo: 1, totalCount: 0 }
      }
    });
  }
});

// 관광지 이미지 목록 조회
router.get('/places/:contentId/images', async (req, res) => {
  try {
    const { contentId } = req.params;

    const response = await axios.get(`${TOUR_API_BASE_URL}/detailImage1`, {
      params: {
        ...getCommonParams(),
        contentId,
        imageYN: 'Y',
        subImageYN: 'Y',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Tour API images error:', error);
    res.status(500).json({
      response: {
        header: { resultCode: '9999', resultMsg: 'API 호출 오류' },
        body: { items: '', numOfRows: 0, pageNo: 1, totalCount: 0 }
      }
    });
  }
});

// 축제/행사 정보 조회
router.get('/festivals', async (req, res) => {
  try {
    const { areaCode, eventStartDate, eventEndDate, numOfRows = 20, pageNo = 1 } = req.query;

    const response = await axios.get(`${TOUR_API_BASE_URL}/searchFestival1`, {
      params: {
        ...getCommonParams(),
        areaCode: areaCode || '',
        eventStartDate: eventStartDate || new Date().toISOString().slice(0, 10).replace(/-/g, ''),
        eventEndDate: eventEndDate || '',
        numOfRows: Number(numOfRows),
        pageNo: Number(pageNo),
        listYN: 'Y',
        arrange: 'A',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Tour API festivals error:', error);
    res.status(500).json({
      response: {
        header: { resultCode: '9999', resultMsg: 'API 호출 오류' },
        body: { items: '', numOfRows: 0, pageNo: 1, totalCount: 0 }
      }
    });
  }
});

export default router;
