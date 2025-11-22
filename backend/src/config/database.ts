import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../data/yerim-tour.db');
export const db = new Database(dbPath);

export function initDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Places table
  db.exec(`
    CREATE TABLE IF NOT EXISTS places (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      address TEXT,
      category TEXT,
      image_url TEXT,
      rating REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Bookmarks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      place_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (place_id) REFERENCES places(id),
      UNIQUE(user_id, place_id)
    )
  `);

  // Insert sample places
  const placesCount = db.prepare('SELECT COUNT(*) as count FROM places').get() as { count: number };
  if (placesCount.count === 0) {
    const insertPlace = db.prepare(`
      INSERT INTO places (id, name, description, address, category, image_url, rating)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const samplePlaces = [
      ['p1', '경복궁', '조선시대 대표적인 궁궐', '서울시 종로구', '관광지', '/images/gyeongbokgung.jpg', 4.8],
      ['p2', '남산타워', '서울의 랜드마크', '서울시 용산구', '관광지', '/images/namsan.jpg', 4.5],
      ['p3', '부산 해운대', '한국 대표 해변', '부산시 해운대구', '관광지', '/images/haeundae.jpg', 4.7],
      ['p4', '전주 한옥마을', '전통 한옥 체험', '전라북도 전주시', '관광지', '/images/jeonju.jpg', 4.6],
      ['p5', '제주 성산일출봉', '유네스코 세계자연유산', '제주도 서귀포시', '관광지', '/images/seongsan.jpg', 4.9],
    ];

    samplePlaces.forEach(place => insertPlace.run(...place));
  }

  console.log('✅ 데이터베이스 초기화 완료');
}
