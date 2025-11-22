import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// 북마크 목록 조회
router.get('/', authMiddleware, (req: AuthRequest, res) => {
  try {
    const bookmarks = db.prepare(`
      SELECT b.id, b.created_at, p.*
      FROM bookmarks b
      JOIN places p ON b.place_id = p.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `).all(req.userId);

    res.json(bookmarks);
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 북마크 추가
router.post('/', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { placeId } = req.body;

    if (!placeId) {
      return res.status(400).json({ error: '장소 ID가 필요합니다.' });
    }

    // 장소 존재 확인
    const place = db.prepare('SELECT id FROM places WHERE id = ?').get(placeId);
    if (!place) {
      return res.status(404).json({ error: '장소를 찾을 수 없습니다.' });
    }

    // 이미 북마크 되어있는지 확인
    const existing = db.prepare('SELECT id FROM bookmarks WHERE user_id = ? AND place_id = ?')
      .get(req.userId, placeId);
    if (existing) {
      return res.status(400).json({ error: '이미 북마크한 장소입니다.' });
    }

    const bookmarkId = uuidv4();
    db.prepare('INSERT INTO bookmarks (id, user_id, place_id) VALUES (?, ?, ?)')
      .run(bookmarkId, req.userId, placeId);

    res.status(201).json({ id: bookmarkId, message: '북마크가 추가되었습니다.' });
  } catch (error) {
    console.error('Add bookmark error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 북마크 삭제
router.delete('/:placeId', authMiddleware, (req: AuthRequest, res) => {
  try {
    const result = db.prepare('DELETE FROM bookmarks WHERE user_id = ? AND place_id = ?')
      .run(req.userId, req.params.placeId);

    if (result.changes === 0) {
      return res.status(404).json({ error: '북마크를 찾을 수 없습니다.' });
    }

    res.json({ message: '북마크가 삭제되었습니다.' });
  } catch (error) {
    console.error('Delete bookmark error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 특정 장소 북마크 여부 확인
router.get('/check/:placeId', authMiddleware, (req: AuthRequest, res) => {
  try {
    const bookmark = db.prepare('SELECT id FROM bookmarks WHERE user_id = ? AND place_id = ?')
      .get(req.userId, req.params.placeId);

    res.json({ isBookmarked: !!bookmark });
  } catch (error) {
    console.error('Check bookmark error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

export default router;
