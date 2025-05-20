const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.json());
app.use(require('cors')({ origin: 'http://localhost:8080' }));  // 特定のオリジンからのアクセスのみ許可

// SQLiteデータベースに接続
const db = new sqlite3.Database('expenses.db');

// 取得エンドポイント
app.get('/expenses', (req, res) => {
  try {
    db.all('SELECT * FROM expenses', (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'データベースの取得に失敗しました' });
      }
      res.json(rows);  // データベースから取得した費用を返す
    });
  } catch (err) {
    console.error(err);
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
      console.error(err);
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
