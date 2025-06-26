import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { app } from 'electron';

const execFileAsync = promisify(execFile);

// 開発 or 本番判定
const isDev = !app.isPackaged;

export const runMonthEndAlert = async (): Promise<void> => {
  try {
    const exePath = isDev
      ? path.join(__dirname, '..', '..', 'resources', 'month_end_alert.exe') // 開発中
      : path.join(process.resourcesPath, 'month_end_alert.exe'); // 本番

    const { stdout } = await execFileAsync(exePath);
    console.log('[月末警告] 出力:', stdout.trim());
  } catch (error) {
    console.error('[月末警告] 実行エラー:', error);
  }
};
