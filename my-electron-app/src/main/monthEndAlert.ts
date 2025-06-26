import { app, dialog, BrowserWindow } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

export const showMonthEndAlert = async (mainWindow: BrowserWindow) => {
  try {
    // 月末警告のtextファイルは開発中も本番も同じ場所を参照する
    const alertPath = path.join(app.getPath('userData'), 'month_end_alert.txt');

    console.log('[月末警告] alertPath:', alertPath);

    if (!fs.existsSync(alertPath)) {
      console.log('[月末警告] ファイルが存在しません');
      return;
    }

    const message = fs.readFileSync(alertPath, 'utf-8').trim();
    console.log('[月末警告] ファイル内容:', message);

    if (message.includes('支出に注意')) {
      console.log('[月末警告] 条件一致：警告表示');

      // モーダルを確実に表示
      mainWindow.focus();
      await dialog.showMessageBox(mainWindow, {
        type: 'warning',
        title: '月末警告',
        message,
      });
    } else {
      console.log('[月末警告] 条件不一致');
    }
  } catch (err) {
    console.error('[月末警告] 表示エラー:', err);
  }
};

