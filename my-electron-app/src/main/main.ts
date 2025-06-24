// src/main/main.ts
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import cron from 'node-cron';
import { registerFixedCosts } from './services/autoRegister';
import { getUpcomingFixedCostNotifications } from './services/notificationService';
import { Notification } from 'electron';
import { spawn, execFile } from 'child_process';
import { fetchExpenses,
          addExpense,
          deleteExpense,
          updateExpense,
          initializeDatabase,
          getBudget,
          setBudget,
          getTotalExpensesForMonth,
          fetchFixedCosts,
          addFixedCost,
          deleteFixedCost,
          updateFixedCost,
          fetchCategories,
          addCategory,
          updateCategory,
          deleteCategory,
          fetchDiaries,
          getDiaryByDate,
          upsertDiary,
          deleteDiary,
          getCategorySummary,
          getMonthlySpending, 
          getBudgetVsActual,
          getSettingValue,
          setSettingValue,
          insertDefaultCategories,
          insertDefaultSettings
        } from './db';

let mainWindow: BrowserWindow | null;

console.log('App is starting');

const initializeApp = async () => {
  try {
    await initializeDatabase();
    console.log('データベース初期化完了');

    // 言語と通貨の初期設定はここでは行わない
    const initialized = await getSettingValue('initialized');
    if (initialized !== 'true') {
      console.log('初期化フラグがfalseのため、初期処理をスキップ');
      return;
    }

    // ここからは初期化済みのユーザーにのみ実行
    await setInitialLanguageFromInstaller();
    await setInitialCurrency();

    const autoRegister = await getSettingValue('autoRegisterFixedCosts');
    if (autoRegister === 'true') {
      console.log('設定により起動時に固定費を自動登録します');
      await registerFixedCosts();
    } else {
      console.log('固定費の自動登録は無効です');
    }

    scheduleAutoRegisterFixedCosts();
    checkUpcomingFixedCostNotifications();
  } catch (error) {
    console.error('アプリケーションの初期化エラー:', error);
  }
};

const setInitialLanguageFromInstaller = async () => {
  const langFilePath = path.join(os.homedir(), 'AppData', 'Roaming', 'my-electron-app', 'lang.txt');

  if (!fs.existsSync(langFilePath)) return;

  try {
    const lang = fs.readFileSync(langFilePath, 'utf-8').trim();

    const currentSetting = await getSettingValue('language');
    if (!currentSetting) {
      await setSettingValue('language', lang);
      console.log(`初期言語設定を ${lang} にしました`);
    } else {
      console.log(`既に設定されている言語: ${currentSetting}`);
    }

    fs.unlinkSync(langFilePath); // 1回限りの設定なので削除
  } catch (error) {
    console.error('初期言語設定エラー:', error);
  }
};

const setInitialCurrency = async () => {
  const currencyFilePath = path.join(os.homedir(), 'AppData', 'Roaming', 'my-electron-app', 'currency.txt');

  if (!fs.existsSync(currencyFilePath)) return;

  try {
    const currency = fs.readFileSync(currencyFilePath, 'utf-8').trim();
    const currentCurrency = await getSettingValue('currency');

    if (!currentCurrency) {
      await setSettingValue('currency', currency);
      console.log(`初期通貨設定を ${currency} にしました`);
    }

    fs.unlinkSync(currencyFilePath);
  } catch (error) {
    console.error('初期通貨設定エラー:', error);
  }
};

function createWindow() {
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
    // __dirname はビルド後は dist/main の中なので1階層上のrenderer/index.htmlへ
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
ipcMain.handle('addExpense', async (event, description, amount, date, categoryId) => {
  try {
    const id = await addExpense(description, amount, date, categoryId);
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
ipcMain.handle('updateExpense', async (_event, { id, desc, amt, date, categoryId }) => {
  try {
    await updateExpense(id, desc, amt, date, categoryId);
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

// 固定費一覧を取得
ipcMain.handle('fetchFixedCosts', async () => {
  try {
    const rows = await fetchFixedCosts();
    return rows;
  } catch (error) {
    console.error('fetchFixedCosts エラー:', error);
    throw new Error('固定費の取得に失敗しました');
  }
});

// 固定費を追加
ipcMain.handle('addFixedCost', async (event, description, amount, date, nextPaymentDate, paymentMethod, categoryId, frequency) => {
  try {
    const id = await addFixedCost(description, amount, date, nextPaymentDate, paymentMethod, categoryId, frequency);
    return { message: '固定費の追加に成功しました', id };
  } catch (error) {
    console.error('addFixedCost エラー:', error);
    throw new Error('固定費の追加に失敗しました');
  }
});

// 固定費を削除
ipcMain.handle('deleteFixedCost', async (_event, id: number) => {
  console.trace('[TRACE] deleteFixedCost invoked with ID:', id);

  if (!id || typeof id !== 'number') {
    return { message: '無効な ID です。', changes: 0 };
  }

  try {
    const result = await deleteFixedCost(id);
    if (result.changes > 0) {
      return { message: `ID ${id} の固定費が削除されました`, changes: result.changes };
    } else {
      return { message: `ID ${id} の固定費は見つかりませんでした`, changes: result.changes };
    }
  } catch (error) {
    console.error('deleteFixedCost エラー:', error);
    throw new Error('固定費の削除に失敗しました');
  }
});

// 固定費を更新
ipcMain.handle('updateFixedCost', async (_event, { id, description, amount, startDate, nextPaymentDate, paymentMethod, categoryId, frequency }) => {
  try {
    await updateFixedCost(id, description, amount, startDate, nextPaymentDate, paymentMethod, categoryId, frequency);
    return { message: '固定費の更新に成功しました' };
  } catch (error) {
    console.error('updateFixedCost エラー:', error);
    return { message: '固定費の更新に失敗しました' };
  }
});

// カテゴリ一覧を取得
ipcMain.handle('fetchCategories', async () => {
  try {
    const categories = await fetchCategories();
    return categories;
  } catch (error) {
    console.error('fetchCategories エラー:', error);
    throw new Error('カテゴリの取得に失敗しました');
  }
});

// カテゴリを追加
ipcMain.handle('addCategory', async (_event, name: string) => {
  try {
    const id = await addCategory(name);
    return { message: 'カテゴリの追加に成功しました', id };
  } catch (error) {
    console.error('addCategory エラー:', error);
    throw new Error('カテゴリの追加に失敗しました');
  }
});

// カテゴリを更新
ipcMain.handle('updateCategory', async (_event, { id, name }) => {
  try {
    await updateCategory(id, name);
    return { message: 'カテゴリの更新に成功しました' };
  } catch (error) {
    console.error('updateCategory エラー:', error);
    return { message: 'カテゴリの更新に失敗しました' };
  }
});

// カテゴリを削除
ipcMain.handle('deleteCategory', async (_event, id: number) => {
  try {
    const result = await deleteCategory(id);
    if (result.changes > 0) {
      return { message: `カテゴリ ID ${id} が削除されました`, changes: result.changes };
    } else {
      return { message: `カテゴリ ID ${id} は見つかりませんでした`, changes: result.changes };
    }
  } catch (error) {
    console.error('deleteCategory エラー:', error);
    throw new Error('カテゴリの削除に失敗しました');
  }
});

// 日記一覧を取得
ipcMain.handle('fetchDiaries', async () => {
  try {
    const diaries = await fetchDiaries();
    return diaries;
  } catch (error) {
    console.error('fetchDiaries エラー:', error);
    throw new Error('日記の取得に失敗しました');
  }
});

// 特定日付の日記を取得
ipcMain.handle('getDiaryByDate', async (_event, date: string) => {
  try {
    const diary = await getDiaryByDate(date);
    return diary;
  } catch (error) {
    console.error('getDiaryByDate エラー:', error);
    throw new Error('指定日の取得に失敗しました');
  }
});

// 日記を追加または更新（UPSERT）
ipcMain.handle('upsertDiary', async (_event, { date, content, mood, tags }) => {
  try {
    await upsertDiary(date, content, mood, tags);
    return { message: '日記が保存されました' };
  } catch (error) {
    console.error('upsertDiary エラー:', error);
    throw new Error('日記の保存に失敗しました');
  }
});

// 日記を削除
ipcMain.handle('deleteDiary', async (_event, date: string) => {
  try {
    const result = await deleteDiary(date);
    if (result.changes > 0) {
      return { message: `日記（${date}）が削除されました`, changes: result.changes };
    } else {
      return { message: `日記（${date}）は見つかりませんでした`, changes: result.changes };
    }
  } catch (error) {
    console.error('deleteDiary エラー:', error);
    throw new Error('日記の削除に失敗しました');
  }
});

// カテゴリ別支出合計を取得
ipcMain.handle('getCategorySummary', async () => {
  try {
    const summary = await getCategorySummary();
    return summary;
  } catch (error) {
    console.error('getCategorySummary エラー:', error);
    throw new Error('カテゴリ別支出合計の取得に失敗しました');
  }
});

// 月別支出合計を取得
ipcMain.handle('getMonthlySpending', async () => {
  try {
    const monthlySpending = await getMonthlySpending();
    return monthlySpending;
  } catch (error) {
    console.error('getMonthlySpending エラー:', error);
    throw new Error('月別支出合計の取得に失敗しました');
  }
});

// 予算と実支出の比較を取得
ipcMain.handle('getBudgetVsActual', async () => {
  try {
    const budgetVsActual = await getBudgetVsActual();
    return budgetVsActual;
  } catch (error) {
    console.error('getBudgetVsActual エラー:', error);
    throw new Error('予算と実支出の比較の取得に失敗しました');
  }
});

// 定期的に固定費を登録するcronジョブの設定
const scheduleAutoRegisterFixedCosts = () => {
  // 毎月1日の午前1時に実行
  cron.schedule('0 1 1 * *', async () => {
    console.log('自動固定費登録を開始します');
    
    // autoRegister.tsの関数を呼び出して、固定費登録を実行
    await registerFixedCosts();
  });
};

// 設定取得
ipcMain.handle('getSetting', async (_event, key: string) => {
  try {
    const value = await getSettingValue(key);
    return { value };
  } catch (error) {
    console.error('getSetting エラー:', error);
    throw new Error('設定の取得に失敗しました');
  }
});

// 設定保存
ipcMain.handle('setSetting', async (_event, key: string, value: string) => {
  try {
    await setSettingValue(key, value);
    return { message: '設定の保存に成功しました' };
  } catch (error) {
    console.error('setSetting エラー:', error);
    throw new Error('設定の保存に失敗しました');
  }
});

// 固定費の支払いが3日以内の場合に通知を出す
const iconPath = path.join(__dirname, '..', '..', 'icon.ico');
const checkUpcomingFixedCostNotifications = async () => {
  try {
    const notifications = await getUpcomingFixedCostNotifications(3);

    notifications.forEach(({ title, body }) => {
      const notification = new Notification({
        title,
        body,
        icon: iconPath,
        silent: false,
        urgency: 'critical',
      });

      notification.on('click', () => {
        if (mainWindow) {
          mainWindow.show();
        }
      });

      notification.show();
    });
  } catch (error) {
    console.error('通知の表示エラー:', error);
  }
};

// デフォルトカテゴリの登録
ipcMain.handle('insertDefaultCategories', async () => {
  try {
    await insertDefaultCategories();
    return { success: true };
  } catch (err) {
    console.error('insertDefaultCategories エラー:', err);
    return { success: false, error: err instanceof Error ? err.message : '不明なエラー' };
  }
});

// デフォルト設定の登録
ipcMain.handle('insertDefaultSettings', async () => {
  try {
    await insertDefaultSettings();
    return { success: true };
  } catch (error: any) {
    console.error('insertDefaultSettings エラー:', error);
    return { success: false, error: error.message };
  }
});

// CSVエクスポート
ipcMain.handle('export-csv', async () => {
  const isDev = !app.isPackaged;

  const executablePath = isDev
    ? path.join(__dirname, '../../resources/exporter.exe') // 開発時
    : path.join(process.resourcesPath, 'exporter.exe'); // 本番時

  return new Promise((resolve, reject) => {
    if (isDev) {
      const child = spawn('go', ['run', 'exporter.go'], {
        cwd: path.dirname(executablePath),
        env: { ...process.env, CGO_ENABLED: '1' }
      });

      let output = '';
      let error = '';

      child.stdout.on('data', (data) => (output += data));
      child.stderr.on('data', (data) => (error += data));

      child.on('close', (code) => {
        if (code === 0) {
          console.log('CSV export success:', output);
          resolve({ message: 'Export successful.' });
        } else {
          console.error('CSV export failed:', error);
          reject(new Error(error));
        }
      });

    } else {
      const child = spawn(executablePath, [], {
        env: { ...process.env },
      });

      let output = '';
      let error = '';

      child.stdout.on('data', (data) => (output += data));
      child.stderr.on('data', (data) => (error += data));

      child.on('close', (code) => {
        if (code === 0) {
          console.log('CSV export success:', output);
          resolve({ message: 'Export successful.' });
        } else {
          console.error('CSV export failed:', error);
          reject(new Error(error));
        }
      });
    }
  });
});

// CSVインポート
ipcMain.handle('import-csv', async (_event, filePath: string) => {
  const isDev = !app.isPackaged;
  const executablePath = isDev
    ? path.join(__dirname, '../../resources/importer.exe') // 開発時
    : path.join(process.resourcesPath, 'importer.exe'); // 本番時

  return new Promise((resolve, reject) => {
    execFile(executablePath, [filePath], (err, stdout, stderr) => {
      if (err) {
        console.error('CSV import failed:', stderr);
        return reject(new Error(stderr));
      }
      console.log('CSV import success:', stdout);
      resolve({ message: 'Import successful.' });
    });
  });
});

// CSVファイル選択ダイアログ
ipcMain.handle('select-csv-file', async () => {
  const result = await dialog.showOpenDialog({
    title: 'CSVファイルを選択',
    properties: ['openFile'],
    filters: [{ name: 'CSV Files', extensions: ['csv'] }],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return '';
  }

  return result.filePaths[0];
});

// アプリケーション開始
initializeApp();
