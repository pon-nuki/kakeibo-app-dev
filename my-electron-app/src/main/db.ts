// db.ts
import * as sqlite3 from 'sqlite3';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

// 現在のユーザー名を取得
const username = os.userInfo().username;

// データベースファイルのパスを設定
const dbPath = path.join(
  'C:',
  'Users',
  username,
  'AppData',
  'Roaming',
  'my-electron-app',
  'expenses.db'
);

// ディレクトリが存在しない場合に作成
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

// SQLite データベースを作成（または開く）
const db = new sqlite3.Database(dbPath, (err: Error | null) => {
  if (err) {
    console.error('データベース接続エラー:', err.message);
  } else {
    console.log('データベース接続成功:', dbPath);
  }
});

// テーブルが存在しない場合は作成する
const createTableIfNotExists = () => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL
    );
  `;
  
  return new Promise<void>((resolve, reject) => {
    db.run(createTableSQL, (err: Error | null) => {
      if (err) {
        console.error('テーブル作成エラー:', err.message);
        reject(err);
      } else {
        console.log('テーブル作成成功');
        resolve();
      }
    });
  });
};

// テーブル作成を実行
export const initializeDatabase = () => {
  return createTableIfNotExists();
};

// 全ての費用を取得する関数
export const fetchExpenses = () => {
  return new Promise<any[]>((resolve, reject) => {
    db.all('SELECT * FROM expenses', (err: Error | null, rows: any[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// 費用を追加する関数
export const addExpense = (description: string, amount: number, date: string) => {
  return new Promise<number>((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO expenses (description, amount, date) VALUES (?, ?, ?)');
    stmt.run(description, amount, date, function (this: sqlite3.RunResult, err: Error | null) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID); // `this` を RunResult 型として扱う
      }
    });
    stmt.finalize();
  });
};

// 費用を削除する関数
interface DeleteExpenseResult {
  message: string;
  changes: number;
}

export const deleteExpense = (id: number): Promise<DeleteExpenseResult> => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM expenses WHERE id = ?', [id], function (this: sqlite3.RunResult, err: Error | null) {
      if (err) {
        reject(err);
      } else {
        const changes = this.changes; // 削除された行数
        resolve({ message: `削除されました。${changes} 行が影響を受けました。`, changes });
      }
    });
  });
};

// 費用を更新する関数
export const updateExpense = (id: number, description: string, amount: number, date: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('UPDATE expenses SET description = ?, amount = ?, date = ? WHERE id = ?');
    stmt.run(description, amount, date, id, function (err: Error | null) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
    stmt.finalize();
  });
};
