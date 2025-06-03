const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// APPDATA内のmy-electron-appディレクトリにデータベースファイルを作成する
const dbPath = path.join(
  'C:',
  'Users',
  'PC_admin',
  'AppData',
  'Roaming',
  'my-electron-app',
  'expenses.db'
);

// ディレクトリが存在しない場合に作成
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

// SQLiteデータベースに接続
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('データベース接続エラー:', err.message);
    process.exit(1); // エラー発生時にアプリを終了
  } else {
    console.log('データベース接続成功:', dbPath);
  }
});

app.use(express.json());
app.use(require('cors')({ origin: 'http://localhost:8080' }));  // 特定のオリジンからのアクセスのみ許可

// テーブルが存在しない場合は作成
const createTableIfNotExists = () => {
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

  db.run(createExpensesSQL, (err) => {
    if (err) {
      console.error('expensesテーブル作成エラー:', err.message);
    } else {
      console.log('expensesテーブル作成成功');
    }
  });

  db.run(createBudgetsSQL, (err) => {
    if (err) {
      console.error('budgetsテーブル作成エラー:', err.message);
    } else {
      console.log('budgetsテーブル作成成功');
    }
  });
};

// サーバ起動時にテーブルを作成
createTableIfNotExists();

// 取得エンドポイント
app.get('/expenses', (req, res) => {
  try {
    db.all('SELECT * FROM expenses', (err, rows) => {
      if (err) {
        console.error('データベースエラー:', err.message);
        return res.status(500).json({ error: 'データベースの取得に失敗しました' });
      }
      res.json(rows);  // データベースから取得した費用を返す
    });
  } catch (err) {
    console.error('サーバーエラー:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'サーバーエラー' });
    }
  }
});

// 削除エンドポイント
app.delete('/expenses/:id', (req, res) => {
  const { id } = req.params;
  // id に対応する費用の削除処理
  db.run('DELETE FROM expenses WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('削除エラー:', err.message);
      return res.status(500).json({ message: '削除に失敗しました' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'ID に対応する費用が見つかりませんでした' });
    }
    return res.status(200).json({ message: `ID ${id} の費用が削除されました` });
  });
});

// 予算取得エンドポイント
app.get('/budget', (req, res) => {
  const { month } = req.query;
  if (!month) {
    return res.status(400).json({ error: 'monthパラメータが必要です' });
  }

  const sql = 'SELECT * FROM budgets WHERE month = ?';
  db.get(sql, [month], (err, row) => {
    if (err) {
      console.error('データベースエラー:', err.message);
      return res.status(500).json({ error: '予算の取得に失敗しました' });
    }
    if (!row) {
      return res.status(200).json(null);
    }
    res.json(row);
  });
});

// 予算登録・更新エンドポイント
app.post('/budget', (req, res) => {
  const { month, amount } = req.body;

  if (!month || typeof amount !== 'number') {
    return res.status(400).json({ error: 'month と amount は必須です' });
  }

  // 既に登録されている場合は更新、なければ挿入
  const sql = `
    INSERT INTO budgets (month, amount)
    VALUES (?, ?)
    ON CONFLICT(month) DO UPDATE SET amount=excluded.amount
  `;

  db.run(sql, [month, amount], function(err) {
    if (err) {
      console.error('予算登録エラー:', err.message);
      return res.status(500).json({ error: '予算の登録に失敗しました' });
    }
    res.json({ message: `予算が設定されました`, month, amount });
  });
});

// 月別支出合計を取得するエンドポイント
app.get('/expenses/total', (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: 'month パラメータが必要です' });
  }

  const getEndOfMonth = (month) => {
    const date = new Date(`${month}-01`);
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const startDate = `${month}-01`;
  const endDate = getEndOfMonth(month);

  const sql = `
    SELECT SUM(amount) AS total FROM expenses
    WHERE date BETWEEN ? AND ?
  `;

  db.get(sql, [startDate, endDate], (err, row) => {
    if (err) {
      console.error('支出合計取得エラー:', err.message);
      return res.status(500).json({ error: '支出合計の取得に失敗しました' });
    }
    res.json({ total: row?.total ?? 0 });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
