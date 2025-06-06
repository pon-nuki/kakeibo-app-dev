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
      date TEXT NOT NULL,
      category_id INTEGER,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );
  `;
  const createBudgetsSQL = `
    CREATE TABLE IF NOT EXISTS budgets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      month TEXT NOT NULL UNIQUE,
      amount REAL NOT NULL
    );
  `;

  const createFixedCostsSQL = `
    CREATE TABLE IF NOT EXISTS fixed_costs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      category_id INTEGER,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );
  `;

  const createCategoriesSQL = `
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
  `;

  // SQLを実行する関数を作成（共通化）
  const runSQL = (sql: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      db.run(sql, (err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

  try {
    // カテゴリーテーブル
    await runSQL(createCategoriesSQL);
    console.log('categoriesテーブル作成成功');

    // expensesテーブル
    await runSQL(createExpensesSQL);
    console.log('expensesテーブル作成成功');

    // budgetsテーブル
    await runSQL(createBudgetsSQL);
    console.log('budgetsテーブル作成成功');

    // fixed_costsテーブル
    await runSQL(createFixedCostsSQL);
    console.log('fixed_costsテーブル作成成功');
    
    console.log('全テーブル作成完了');
  } catch (error) {
    console.error('テーブル作成中にエラーが発生:', error);
  }
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
export const addExpense = (description: string, amount: number, rawDate: string, categoryId: number): Promise<number> => {
  const date = toISODate(rawDate);
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO expenses (description, amount, date, category_id) VALUES (?, ?, ?, ?)');
    stmt.run(description, amount, date, categoryId, function (this: sqlite3.RunResult, err: Error | null) {
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
export const updateExpense = (id: number, description: string, amount: number, rawDate: string, categoryId: number): Promise<void> => {
  const date = toISODate(rawDate);
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('UPDATE expenses SET description = ?, amount = ?, date = ?, category_id = ? WHERE id = ?');
    stmt.run(description, amount, date, categoryId, id, (err: Error | null) => (err ? reject(err) : resolve()));
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

// 固定費一覧取得
export const fetchFixedCosts = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM fixed_costs', (err, rows) => {
      err ? reject(err) : resolve(rows);
    });
  });
};

// 固定費追加
export const addFixedCost = (
  description: string,
  amount: number,
  rawDate: string,
  paymentMethod: string,
  categoryId: number
): Promise<number> => {
  const date = toISODate(rawDate);
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(
      'INSERT INTO fixed_costs (description, amount, date, payment_method, category_id) VALUES (?, ?, ?, ?, ?)'
    );
    stmt.run(description, amount, date, paymentMethod, categoryId, function (this: sqlite3.RunResult, err: Error | null) {
      if (err) {
        console.error('[addFixedCost] SQL実行エラー:', err);
        reject(err);
      } else {
        console.log('[addFixedCost] 追加成功 ID:', this.lastID);
        resolve(this.lastID);
      }
    });
    stmt.finalize();
  });
};

// 固定費更新
export const updateFixedCost = (
  id: number,
  description: string,
  amount: number,
  rawDate: string,
  paymentMethod: string,
  categoryId: number
): Promise<void> => {
  const date = toISODate(rawDate);
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(
      'UPDATE fixed_costs SET description = ?, amount = ?, date = ?, payment_method = ?, category_id = ? WHERE id = ?'
    );
    stmt.run(description, amount, date, paymentMethod, categoryId, id, (err: Error | null) =>
      err ? reject(err) : resolve()
    );
    stmt.finalize();
  });
};

// 固定費削除
export const deleteFixedCost = (
  id: number
): Promise<{ message: string; changes: number }> => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM fixed_costs WHERE id = ?', [id], function (this: sqlite3.RunResult, err) {
      err
        ? reject(err)
        : resolve({ message: `削除されました。${this.changes} 行が影響を受けました。`, changes: this.changes });
    });
  });
};

// カテゴリ取得
export const fetchCategories = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM categories', (err, rows) => {
      err ? reject(err) : resolve(rows);
    });
  });
};

// カテゴリ追加
export const addCategory = (name: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO categories (name) VALUES (?)');
    stmt.run(name, function (this: sqlite3.RunResult, err: Error | null) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
    stmt.finalize();
  });
};

// カテゴリ更新
export const updateCategory = (id: number, name: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('UPDATE categories SET name = ? WHERE id = ?');
    stmt.run(name, id, (err: Error | null) => (err ? reject(err) : resolve()));
    stmt.finalize();
  });
};

// カテゴリ削除
export const deleteCategory = (id: number): Promise<{ message: string; changes: number }> => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM categories WHERE id = ?', [id], function (this: sqlite3.RunResult, err) {
      err
        ? reject(err)
        : resolve({ message: `削除されました。${this.changes} 行が影響を受けました。`, changes: this.changes });
    });
  });
};
