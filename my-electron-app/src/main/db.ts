// db.ts
import * as sqlite3 from 'sqlite3';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

// データベースパスをユーザーディレクトリに設定
const username = os.userInfo().username;
const dbPath = path.join(
  'C:',
  'Users',
  username,
  'AppData',
  'Roaming',
  'my-electron-app',
  'expenses.db'
);

// ディレクトリが存在しない場合は作成
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

// SQLiteに接続
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('データベース接続エラー:', err.message);
  } else {
    console.log('データベース接続成功:', dbPath);
  }
});

// 日付をYYYY-MM-DDに変換
const toISODate = (rawDate: string): string => {
  const normalized = rawDate.replace(/\//g, '-');
  const d = new Date(normalized);
  if (isNaN(d.getTime())) throw new Error(`Invalid date format: ${rawDate}`);
  return d.toISOString().slice(0, 10);
};

// テーブル作成
export const createTablesIfNotExists = async (): Promise<void> => {
  const createExpensesSQL = `
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL
    );
  `;
  const createBudgetsSQL = `
    CREATE TABLE IF NOT EXISTS budgets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      month TEXT NOT NULL UNIQUE,
      amount REAL NOT NULL
    );
  `;

  await new Promise<void>((resolve, reject) => {
    db.run(createExpensesSQL, (err: Error | null) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

  await new Promise<void>((resolve, reject) => {
    db.run(createBudgetsSQL, (err: Error | null) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

  console.log('全テーブル作成完了');
};

// DB初期化
export const initializeDatabase = () => createTablesIfNotExists();

// 費用取得
export const fetchExpenses = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM expenses', (err, rows) => {
      err ? reject(err) : resolve(rows);
    });
  });
};

// 費用追加
export const addExpense = (description: string, amount: number, rawDate: string): Promise<number> => {
  const date = toISODate(rawDate);
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO expenses (description, amount, date) VALUES (?, ?, ?)');
    stmt.run(description, amount, date, function (this: sqlite3.RunResult, err: Error | null) {
      err ? reject(err) : resolve(this.lastID);
    });
    stmt.finalize();
  });
};

// 費用削除
export const deleteExpense = (id: number): Promise<{ message: string; changes: number }> => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM expenses WHERE id = ?', [id], function (this: sqlite3.RunResult, err) {
      err
        ? reject(err)
        : resolve({ message: `削除されました。${this.changes} 行が影響を受けました。`, changes: this.changes });
    });
  });
};

// 費用更新
export const updateExpense = (id: number, description: string, amount: number, rawDate: string): Promise<void> => {
  const date = toISODate(rawDate);
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('UPDATE expenses SET description = ?, amount = ?, date = ? WHERE id = ?');
    stmt.run(description, amount, date, id, (err: Error | null) => (err ? reject(err) : resolve()));
    stmt.finalize();
  });
};

// 予算取得
export const getBudget = (month: string): Promise<number | null> => {
  return new Promise((resolve, reject) => {
    db.get('SELECT amount FROM budgets WHERE month = ?', [month], (err, row) => {
      if (err) return reject(err);
      const result = row as { amount: number } | undefined;
      resolve(result?.amount ?? null);
    });
  });
};

// 予算保存（新規または更新）
export const setBudget = (month: string, amount: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO budgets (month, amount)
      VALUES (?, ?)
      ON CONFLICT(month) DO UPDATE SET amount = excluded.amount
    `;
    db.run(sql, [month, amount], (err) => (err ? reject(err) : resolve()));
  });
};

// 月別支出合計取得
export const getTotalExpensesForMonth = (month: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const start = `${month}-01`;

    const [yearStr, monthStr] = month.split('-');
    const year = parseInt(yearStr, 10);
    const monthNum = parseInt(monthStr, 10);

    const endDate = new Date(year, monthNum, 0);
    const end = endDate.toISOString().slice(0, 10);

    db.get(
      `
      SELECT SUM(amount) AS total FROM expenses
      WHERE date BETWEEN ? AND ?
    `,
      [start, end],
      (err, row) => {
        if (err) return reject(err);
        const result = row as { total: number | null } | undefined;
        resolve(result?.total ?? 0);
      }
    );
  });
};
