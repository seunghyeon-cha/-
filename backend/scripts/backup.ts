/**
 * SQLite 데이터베이스 백업 스크립트
 *
 * 사용법:
 * - 수동 백업: npx ts-node scripts/backup.ts
 * - 자동 백업: cron job으로 실행
 */

import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(__dirname, '../data/yerim-tour.db');
const BACKUP_DIR = path.join(__dirname, '../backups');
const MAX_BACKUPS = 7; // 최대 보관 일수

/**
 * 백업 실행
 */
function backup(): void {
  // 백업 디렉토리 생성
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  // DB 파일 존재 확인
  if (!fs.existsSync(DB_PATH)) {
    console.error('❌ 데이터베이스 파일이 존재하지 않습니다:', DB_PATH);
    process.exit(1);
  }

  // 백업 파일명 생성 (timestamp 포함)
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFileName = `yerim_backup_${timestamp}.db`;
  const backupPath = path.join(BACKUP_DIR, backupFileName);

  // 파일 복사
  try {
    fs.copyFileSync(DB_PATH, backupPath);
    console.log(`✅ 백업 완료: ${backupFileName}`);
    console.log(`   경로: ${backupPath}`);

    // 파일 크기 출력
    const stats = fs.statSync(backupPath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`   크기: ${sizeKB} KB`);
  } catch (error) {
    console.error('❌ 백업 실패:', error);
    process.exit(1);
  }

  // 오래된 백업 정리
  cleanupOldBackups();
}

/**
 * 오래된 백업 파일 정리
 */
function cleanupOldBackups(): void {
  const files = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.startsWith('yerim_backup_') && f.endsWith('.db'))
    .map(f => ({
      name: f,
      path: path.join(BACKUP_DIR, f),
      time: fs.statSync(path.join(BACKUP_DIR, f)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time); // 최신순 정렬

  // MAX_BACKUPS 초과 파일 삭제
  if (files.length > MAX_BACKUPS) {
    const toDelete = files.slice(MAX_BACKUPS);
    toDelete.forEach(file => {
      fs.unlinkSync(file.path);
      console.log(`🗑️  오래된 백업 삭제: ${file.name}`);
    });
  }

  console.log(`📁 현재 백업 수: ${Math.min(files.length, MAX_BACKUPS)}/${MAX_BACKUPS}`);
}

/**
 * 백업 목록 조회
 */
export function listBackups(): string[] {
  if (!fs.existsSync(BACKUP_DIR)) {
    return [];
  }

  return fs.readdirSync(BACKUP_DIR)
    .filter(f => f.startsWith('yerim_backup_') && f.endsWith('.db'))
    .sort()
    .reverse();
}

/**
 * 백업 복원
 */
export function restore(backupFileName: string): void {
  const backupPath = path.join(BACKUP_DIR, backupFileName);

  if (!fs.existsSync(backupPath)) {
    console.error('❌ 백업 파일이 존재하지 않습니다:', backupFileName);
    process.exit(1);
  }

  // 현재 DB 백업 (복원 전 안전장치)
  const currentBackup = path.join(BACKUP_DIR, `yerim_pre_restore_${Date.now()}.db`);
  if (fs.existsSync(DB_PATH)) {
    fs.copyFileSync(DB_PATH, currentBackup);
    console.log(`📦 현재 DB 백업: ${currentBackup}`);
  }

  // 복원 실행
  try {
    fs.copyFileSync(backupPath, DB_PATH);
    console.log(`✅ 복원 완료: ${backupFileName}`);
  } catch (error) {
    console.error('❌ 복원 실패:', error);
    process.exit(1);
  }
}

// CLI 실행
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args[0] === 'list') {
    const backups = listBackups();
    console.log('📋 백업 목록:');
    backups.forEach((b, i) => console.log(`  ${i + 1}. ${b}`));
  } else if (args[0] === 'restore' && args[1]) {
    restore(args[1]);
  } else {
    backup();
  }
}

export default backup;
