// main.ts
import * as path from 'path'; 
import { app, BrowserWindow, ipcMain } from 'electron';
import { getAllExpenses, addExpense, deleteExpense, updateExpense } from './db';

let mainWindow: BrowserWindow | null;

console.log('App is starting');

function createWindow() {
  const preloadPath = path.join(__dirname, '..', 'renderer', 'preload.js');

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
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

  console.log('loadURL');
  mainWindow.loadURL('http://localhost:8080')
    .then(() => {
      console.log('URL loaded successfully');
    })
    .catch((err) => {
      console.error('Failed to load URL:', err);
    });
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

// 参照
ipcMain.handle('getAllExpenses', async () => {
  return await getAllExpenses();
});

// 追加
ipcMain.handle('addExpense', async (event, description, amount, date) => {
  return await addExpense(description, amount, date);
});

// 削除
ipcMain.handle('deleteMessage', async (event, id) => {
  console.trace('[TRACE] deleteMessage invoked with ID:', id);

  // idが不正な場合は何もせずreturn
  if (!id || typeof id !== 'number') {
    return { message: '無効な ID です。', changes: 0 };
  }

  try {
    const result = await deleteExpense(id);
    if (result !== null) {
      if (result.changes > 0) {
        return { message: `ID ${id} の費用が削除されました`, changes: result.changes };
      } else {
        return { message: `ID ${id} の費用は見つかりませんでした`, changes: result.changes };
      }
    } else {
      throw new Error('削除失敗: 型が不正です');
    }
  } catch (error) {
    console.error('削除に失敗しました:', error);
    throw new Error('削除に失敗しました');
  }
});

// 更新
ipcMain.handle('updateExpense', async (_event, { id, desc, amt, date }) => {
  try {
    await updateExpense(id, desc, amt, date);
    return { message: '更新に成功しました' };
  } catch (error) {
    console.error('updateExpenseエラー:', error);
    return { message: '更新に失敗しました' };
  }
});
