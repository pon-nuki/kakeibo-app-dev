// db.ts
import * as sqlite3 from 'sqlite3';

const db = new sqlite3.Database('expenses.db');

// 全ての費用を取得する関数
export const getAllExpenses = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM expenses', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// 費用を追加する関数
export const addExpense = (description: string, amount: number) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO expenses (description, amount) VALUES (?, ?)');
    stmt.run(description, amount, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
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
    db.run('DELETE FROM expenses WHERE id = ?', [id], function (err) {
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
export const updateExpense = (id: number, description: string, amount: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('UPDATE expenses SET description = ?, amount = ? WHERE id = ?');
    stmt.run(description, amount, id, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
    stmt.finalize();
  });
};

