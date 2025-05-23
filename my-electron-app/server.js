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
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL
    );
  `;
  db.run(createTableSQL, (err) => {
    if (err) {
      console.error('テーブル作成エラー:', err.message);
    } else {
      console.log('テーブル作成成功');
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
