import * as path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { fetchExpenses, addExpense, deleteExpense, updateExpense, initializeDatabase, getBudget, setBudget, getTotalExpensesForMonth } from './db';

let mainWindow: BrowserWindow | null;

console.log('App is starting');

// データベースの初期化
initializeDatabase();

function createWindow() {
  // 本番ビルド時は preload.js のパスを調整
  const preloadPath = path.join(__dirname, '..', 'renderer', 'preload.js');

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, '..', '..', 'icon.ico'),
    show: false,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  console.log('mainWindow 作成後');

  mainWindow.once('ready-to-show', () => {
    console.log('mainWindow ready-to-show');
    if (mainWindow) {
      mainWindow.show();
    }
  });

  // 開発時は localhost:8080 を読み込み、本番はビルド済みのファイルを読み込む
  if (app.isPackaged) {
    // __dirname はビルド後は dist/main の中なので1階層上の renderer/index.html へ
    const indexPath = path.join(__dirname, '..', 'renderer', 'index.html');
    mainWindow.loadFile(indexPath)
      .then(() => {
        console.log('index.html loaded successfully');
      })
      .catch((err) => {
        console.error('Failed to load index.html:', err);
      });
  } else {
    mainWindow.loadURL('http://localhost:8080')
      .then(() => {
        console.log('URL loaded successfully');
      })
      .catch((err) => {
        console.error('Failed to load URL:', err);
      });
  }
}

app.whenReady().then(() => {
  console.log('createWindow 呼び出し前');
  createWindow();
  console.log('createWindow 呼び出し後');

  app.on('activate', () => {
    console.log('app.on');
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPCリスナーを追加して、レンダラープロセスとバックエンドで通信

// 参照: 全ての費用を取得
ipcMain.handle('fetchExpenses', async () => {
  try {
    const expenses = await fetchExpenses();
    return expenses;
  } catch (error) {
    console.error('fetchExpenses:', error);
    throw new Error('費用の取得に失敗しました');
  }
});

// 追加: 費用を追加
ipcMain.handle('addExpense', async (event, description, amount, date) => {
  try {
    const id = await addExpense(description, amount, date);
    return { message: '費用の追加に成功しました', id };
  } catch (error) {
    console.error('addExpenseエラー:', error);
    throw new Error('費用の追加に失敗しました');
  }
});

// 削除: 費用を削除
ipcMain.handle('deleteExpense', async (event, id) => {
  console.trace('[TRACE] deleteExpense invoked with ID:', id);

  if (!id || typeof id !== 'number') {
    return { message: '無効な ID です。', changes: 0 };
  }

  try {
    const result = await deleteExpense(id);
    if (result.changes > 0) {
      return { message: `ID ${id} の費用が削除されました`, changes: result.changes };
    } else {
      return { message: `ID ${id} の費用は見つかりませんでした`, changes: result.changes };
    }
  } catch (error) {
    console.error('削除に失敗しました:', error);
    throw new Error('削除に失敗しました');
  }
});

// 更新: 費用を更新
ipcMain.handle('updateExpense', async (_event, { id, desc, amt, date }) => {
  try {
    await updateExpense(id, desc, amt, date);
    return { message: '更新に成功しました' };
  } catch (error) {
    console.error('updateExpenseエラー:', error);
    return { message: '更新に失敗しました' };
  }
});

// 月別予算を取得
ipcMain.handle('getBudget', async (_event, month: string) => {
  try {
    const amount = await getBudget(month);
    return amount;
  } catch (error) {
    console.error('getBudget エラー:', error);
    throw new Error('予算の取得に失敗しました');
  }
});

// 月別予算を追加・更新
ipcMain.handle('setBudget', async (_event, { month, amount }) => {
  try {
    await setBudget(month, amount);
    return { message: '予算の保存に成功しました' };
  } catch (error) {
    console.error('setBudget エラー:', error);
    throw new Error('予算の保存に失敗しました');
  }
});

// 月別支出合計を取得
ipcMain.handle('getExpensesTotal', async (_event, month: string) => {
  try {
    const total = await getTotalExpensesForMonth(month);
    return total;
  } catch (error) {
    console.error('getExpensesTotal エラー:', error);
    throw new Error('支出合計の取得に失敗しました');
  }
});

