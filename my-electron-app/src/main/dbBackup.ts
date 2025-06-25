// src/main/dbBackup.ts
import path from 'path';
import fs from 'fs';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { app } from 'electron';
import dayjs from 'dayjs';
import { getSetting, setSetting } from './services/settingsService';

const execFileAsync = promisify(execFile);

export const runDatabaseBackupIfNeeded = async () => {
  try {
    const lastBackupDate = await getSetting('lastBackupDate');
    const today = dayjs().format('YYYY-MM-DD');

    if (lastBackupDate === today) {
      console.log('[Backup] 今日はすでにバックアップ済みです');
      return;
    }

    const exePath = path.join(__dirname, '../../c-backup-tool/db_backup.exe');
    const backupDir = path.join(app.getPath('userData'), 'backup');
    const dbPath = path.join(app.getPath('userData'), 'expenses.db');

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    console.log(`[Backup] バックアップ開始: ${today}`);
    await execFileAsync(exePath, [dbPath, backupDir]);
    await setSetting('lastBackupDate', today);

    // 古いバックアップ（30日以上前）を削除
    const files = fs.readdirSync(backupDir);
    const threshold = dayjs().subtract(30, 'day');

    files.forEach(file => {
      const match = file.match(/(\d{4}-\d{2}-\d{2})/);
      if (match) {
        const fileDate = dayjs(match[1]);
        if (fileDate.isBefore(threshold)) {
          const filePath = path.join(backupDir, file);
          fs.unlinkSync(filePath);
          console.log(`[Backup] 古いバックアップ削除: ${file}`);
        }
      }
    });

    console.log('[Backup] バックアップ完了');
  } catch (error) {
    console.error('[Backup] バックアップエラー:', error);
  }
};
