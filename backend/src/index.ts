import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import placesRoutes from './routes/places.routes';
import bookmarksRoutes from './routes/bookmarks.routes';
import tourRoutes from './routes/tour.routes';
import { initDatabase } from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Initialize database
initDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/tour', tourRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smartrip 백엔드 서버 정상 작동 중' });
});

app.listen(PORT, () => {
  console.log(`🚀 백엔드 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
