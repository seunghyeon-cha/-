import { Router } from 'express';
import { db } from '../config/database';

const router = Router();

// 카테고리 매핑 (프론트엔드 -> 데이터베이스)
const CATEGORY_MAP: Record<string, string> = {
  'TOURIST': '관광지',
  'RESTAURANT': '맛집',
  'ACCOMMODATION': '숙소',
  'FESTIVAL': '축제',
};

// 역방향 카테고리 매핑 (데이터베이스 -> 프론트엔드)
const REVERSE_CATEGORY_MAP: Record<string, string> = {
  '관광지': 'TOURIST',
  '맛집': 'RESTAURANT',
  '숙소': 'ACCOMMODATION',
  '축제': 'FESTIVAL',
};

// 장소 목록 조회 (프론트엔드 호환 응답 형식)
router.get('/', (req, res) => {
  try {
    const { category, search, sort, region, page = 1, limit = 20 } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const offset = (pageNum - 1) * limitNum;

    // 기본 쿼리 및 카운트 쿼리
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    if (category) {
      // 영문 카테고리를 한글로 변환
      const dbCategory = CATEGORY_MAP[category as string] || category;
      whereClause += ' AND category = ?';
      params.push(dbCategory);
    }

    if (search) {
      whereClause += ' AND (name LIKE ? OR description LIKE ? OR address LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (region) {
      whereClause += ' AND address LIKE ?';
      params.push(`%${region}%`);
    }

    // 전체 개수 조회
    const countQuery = `SELECT COUNT(*) as total FROM places ${whereClause}`;
    const countResult = db.prepare(countQuery).get(...params) as { total: number };
    const total = countResult.total;

    // 정렬 옵션
    let orderBy = 'ORDER BY created_at DESC';
    if (sort === 'rating') {
      orderBy = 'ORDER BY rating DESC';
    } else if (sort === 'reviews') {
      orderBy = 'ORDER BY rating DESC'; // 리뷰 수 컬럼이 없으므로 rating 사용
    }

    // 데이터 조회
    const dataQuery = `SELECT * FROM places ${whereClause} ${orderBy} LIMIT ? OFFSET ?`;
    const places = db.prepare(dataQuery).all(...params, limitNum, offset) as any[];

    // 프론트엔드 호환 형식으로 변환
    const formattedPlaces = places.map(place => ({
      id: place.id,
      name: place.name,
      category: REVERSE_CATEGORY_MAP[place.category] || place.category || 'TOURIST',
      description: place.description || '',
      address: place.address || '',
      lat: 37.5665 + Math.random() * 0.1, // 임시 좌표
      lng: 126.9780 + Math.random() * 0.1,
      images: place.image_url ? [place.image_url] : [],
      averageRating: place.rating || 0,
      reviewCount: Math.floor(Math.random() * 100), // 임시 리뷰 수
      createdAt: place.created_at,
      owner: {
        id: 'system',
        name: 'Smartrip',
      }
    }));

    res.json({
      data: formattedPlaces,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get places error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 장소 상세 조회
router.get('/:id', (req, res) => {
  try {
    const place = db.prepare('SELECT * FROM places WHERE id = ?').get(req.params.id);

    if (!place) {
      return res.status(404).json({ error: '장소를 찾을 수 없습니다.' });
    }

    res.json(place);
  } catch (error) {
    console.error('Get place error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

export default router;
