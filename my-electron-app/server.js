const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const os = require('os');
const { exec } = require('child_process');
const app = express();
const port = 3000;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// データベースパスをユーザーディレクトリに設定
const username = os.userInfo().username;
const dbPath = path.join(
  'C:',
  'Users',
  username,
  'AppData',
  'Roaming',
  'kakeibo',
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
    process.exit(1);
  } else {
    console.log('データベース接続成功:', dbPath);
  }
});

app.use(express.json());
app.use(require('cors')({ origin: 'http://localhost:8080' }));

// テーブルが存在しない場合は作成
const createTableIfNotExists = () => {
  return new Promise((resolve, reject) => {
    const createCategoriesSQL = `
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );
    `;

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
        payment_method TEXT NOT NULL,
        category_id INTEGER,
        frequency TEXT NOT NULL,   -- 支払い頻度
        date TEXT NOT NULL,  -- 初回支払日
        next_payment_date TEXT NOT NULL,  -- 次回支払日
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );
    `;

    const createDiarySQL = `
      CREATE TABLE IF NOT EXISTS diary (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        mood INTEGER,
        tags TEXT
      );
    `;

    const createSettingsSQL = `
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `;

    // categoriesテーブル作成
    db.run(createCategoriesSQL, (err) => {
      if (err) {
        reject('categoriesテーブル作成エラー: ' + err.message);
      } else {
        console.log('categoriesテーブル作成成功');

        // expensesテーブル作成
        db.run(createExpensesSQL, (err) => {
          if (err) {
            reject('expensesテーブル作成エラー: ' + err.message);
          } else {
            console.log('expensesテーブル作成成功');

            // budgetsテーブル作成
            db.run(createBudgetsSQL, (err) => {
              if (err) {
                reject('budgetsテーブル作成エラー: ' + err.message);
              } else {
                console.log('budgetsテーブル作成成功');

                // fixed_costsテーブル作成
                db.run(createFixedCostsSQL, (err) => {
                  if (err) {
                    reject('fixed_costsテーブル作成エラー: ' + err.message);
                  } else {
                    console.log('fixed_costsテーブル作成成功');

                    // diaryテーブル作成
                    db.run(createDiarySQL, (err) => {
                      if (err) {
                        reject('diaryテーブル作成エラー: ' + err.message);
                      } else {
                        console.log('diaryテーブル作成成功');

                        // settingsテーブル作成
                        db.run(createSettingsSQL, (err) => {
                          if (err) {
                            reject('settingsテーブル作成エラー: ' + err.message);
                          } else {
                            console.log('settingsテーブル作成成功');
                            resolve();
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  });
};

// デフォルトカテゴリを挿入
const defaultCategoriesByLang = {
  ja: ['食費', '交通費', '光熱費', '交際費', '住宅費', '娯楽費'],
  en: ['Food', 'Transport', 'Utilities', 'Social', 'Housing', 'Entertainment'],
  ru: ['Еда', 'Транспорт', 'Коммунальные', 'Общение', 'Жильё', 'Развлечения'],
};

// 現在の言語を取得
const getCurrentLanguage = () => {
  return new Promise((resolve) => {
    db.get('SELECT value FROM settings WHERE key = ?', ['language'], (err, row) => {
      if (err) {
        console.error('言語取得エラー:', err.message);
        resolve('ja');
      } else {
        resolve((row && row.value) || 'ja');
      }
    });
  });
};

// フラグチェック（初回かどうか）
const hasInsertedDefaultCategories = () => {
  return new Promise((resolve) => {
    db.get('SELECT value FROM settings WHERE key = ?', ['defaultCategoriesInserted'], (err, row) => {
      if (err) {
        console.error('設定フラグ取得エラー:', err.message);
        resolve(false);
      } else {
        resolve(row && row.value === 'true');
      }
    });
  });
};

// フラグ保存（挿入済みマーク）
const markDefaultCategoriesAsInserted = () => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      ['defaultCategoriesInserted', 'true'],
      (err) => {
        if (err) {
          console.error('フラグ保存エラー:', err.message);
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

// デフォルトカテゴリ挿入
const insertDefaultCategories = async () => {
  const alreadyInserted = await hasInsertedDefaultCategories();
  if (alreadyInserted) {
    console.log('デフォルトカテゴリはすでに挿入されています');
    return;
  }

  const lang = await getCurrentLanguage();
  const defaultCategories = defaultCategoriesByLang[lang] || defaultCategoriesByLang['ja'];

  for (const category of defaultCategories) {
    try {
      await new Promise((resolve, reject) => {
        db.run("INSERT OR IGNORE INTO categories (name) VALUES (?)", [category], (err) => {
          if (err) {
            console.error(`カテゴリ "${category}" の挿入エラー:`, err.message);
            reject(err);
          } else {
            console.log(`カテゴリ "${category}" を挿入しました`);
            resolve();
          }
        });
      });
    } catch (err) {
      console.error(`カテゴリ "${category}" の挿入中にエラーが発生しました:`, err.message);
    }
  }

  await markDefaultCategoriesAsInserted();
};

// デフォルト設定を挿入
const insertDefaultSettings = async () => {
  const defaultSettings = {
    autoRegisterFixedCosts: 'true',
  };

  for (const [key, value] of Object.entries(defaultSettings)) {
    await new Promise((resolve, reject) => {
      const sql = `
        INSERT OR IGNORE INTO settings (key, value)
        VALUES (?, ?)
      `;
      db.run(sql, [key, value], function (err) {
        if (err) {
          console.error(`設定 "${key}" の挿入エラー:`, err.message);
          return reject(err);
        }
        console.log(`設定 "${key}" が初期化されました`);
        resolve();
      });
    });
  }
};

// サーバ起動時にテーブルを作成
const startApp = async () => {
  try {
    await createTableIfNotExists();
    console.log('全テーブル作成完了');
  } catch (error) {
    console.error('エラー:', error);
  }
};

// サーバの起動処理を実行
startApp();

// 取得エンドポイント (費用)
app.get('/expenses', (req, res) => {
  try {
    db.all('SELECT * FROM expenses', (err, rows) => {
      if (err) {
        console.error('データベースエラー:', err.message);
        return res.status(500).json({ error: 'データベースの取得に失敗しました' });
      }
      res.json(rows);
    });
  } catch (err) {
    console.error('サーバーエラー:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'サーバーエラー' });
    }
  }
});

// 削除エンドポイント (費用)
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

// 固定費取得エンドポイント
app.get('/fixed-costs', (req, res) => {
  try {
    db.all('SELECT * FROM fixed_costs', (err, rows) => {
      if (err) {
        console.error('データベースエラー:', err.message);
        return res.status(500).json({ error: 'データベースの取得に失敗しました' });
      }
      res.json(rows);
    });
  } catch (err) {
    console.error('サーバーエラー:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'サーバーエラー' });
    }
  }
});

// 固定費更新エンドポイント
app.put('/fixed-costs/:id', (req, res) => {
  const { id } = req.params;
  const {
    description,
    amount,
    paymentMethod,
    categoryId,
    frequency,
    date,
    nextPaymentDate,
  } = req.body;

  if (
    !description || typeof amount !== 'number' ||
    !paymentMethod || !categoryId || !frequency || !date || !nextPaymentDate
  ) {
    return res.status(400).json({ error: '全ての項目が必要です' });
  }

  const sql = `
    UPDATE fixed_costs
    SET description = ?, amount = ?, payment_method = ?, category_id = ?, frequency = ?, date = ?, next_payment_date = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [description, amount, paymentMethod, categoryId, frequency, date, nextPaymentDate, id],
    function (err) {
      if (err) {
        console.error('固定費更新エラー:', err.message);
        return res.status(500).json({ error: '固定費の更新に失敗しました' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: '指定された固定費が見つかりませんでした' });
      }
      res.json({ message: `固定費 ID ${id} が更新されました` });
    }
  );
});

// 固定費削除エンドポイント
app.delete('/fixed-costs/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM fixed_costs WHERE id = ?';

  db.run(sql, [id], function (err) {
    if (err) {
      console.error('削除エラー:', err.message);
      return res.status(500).json({ error: '固定費の削除に失敗しました' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: '指定された固定費が見つかりませんでした' });
    }
    res.json({ message: `固定費 ID ${id} が削除されました` });
  });
});

// カテゴリ取得エンドポイント
app.get('/categories', (req, res) => {
  try {
    db.all('SELECT * FROM categories', (err, rows) => {
      if (err) {
        console.error('データベースエラー:', err.message);
        return res.status(500).json({ error: 'データベースの取得に失敗しました' });
      }
      res.json(rows);
    });
  } catch (err) {
    console.error('サーバーエラー:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'サーバーエラー' });
    }
  }
});

// カテゴリ登録エンドポイント
app.post('/categories', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'nameは必須です' });
  }

  const sql = 'INSERT INTO categories (name) VALUES (?)';

  db.run(sql, [name], function (err) {
    if (err) {
      console.error('カテゴリ登録エラー:', err.message);
      return res.status(500).json({ error: 'カテゴリの登録に失敗しました' });
    }
    res.json({ message: `カテゴリ "${name}" が登録されました`, id: this.lastID });
  });
});

// カテゴリ削除エンドポイント
app.delete('/categories/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM categories WHERE id = ?';

  db.run(sql, [id], function (err) {
    if (err) {
      console.error('削除エラー:', err.message);
      return res.status(500).json({ error: 'カテゴリの削除に失敗しました' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: '指定されたカテゴリが見つかりませんでした' });
    }
    res.json({ message: `カテゴリ ID ${id} が削除されました` });
  });
});

// 日記一覧（全件又は日付付き）取得
app.get('/diary', (req, res) => {
  const { date } = req.query;
  const sql = date ? 'SELECT * FROM diary WHERE date = ?' : 'SELECT * FROM diary ORDER BY date DESC';
  const params = date ? [date] : [];

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('日記取得エラー:', err.message);
      return res.status(500).json({ error: '日記の取得に失敗しました' });
    }
    res.json(rows);
  });
});

// 日記の登録または更新
app.post('/diary', (req, res) => {
  const { date, content } = req.body;

  if (!date || !content) {
    return res.status(400).json({ error: 'dateとcontentは必須です' });
  }

  const sql = `
    INSERT INTO diary (date, content)
    VALUES (?, ?)
    ON CONFLICT(date) DO UPDATE SET content = excluded.content
  `;

  db.run(sql, [date, content], function (err) {
    if (err) {
      console.error('日記登録エラー:', err.message);
      return res.status(500).json({ error: '日記の登録に失敗しました' });
    }
    res.json({ message: `日記が保存されました`, date });
  });
});

// 日記の削除
app.delete('/diary/:date', (req, res) => {
  const { date } = req.params;

  const sql = 'DELETE FROM diary WHERE date = ?';

  db.run(sql, [date], function (err) {
    if (err) {
      console.error('日記削除エラー:', err.message);
      return res.status(500).json({ error: '日記の削除に失敗しました' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: '指定された日記が見つかりませんでした' });
    }

    res.json({ message: `日記（${date}）が削除されました` });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// カテゴリ別支出合計
app.get('/summary/category', (req, res) => {
  const sql = `
    SELECT c.name AS category, SUM(e.amount) AS total
    FROM expenses e
    LEFT JOIN categories c ON e.category_id = c.id
    GROUP BY e.category_id
    ORDER BY total DESC;
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('カテゴリ別支出合計取得エラー:', err.message);
      return res.status(500).json({ error: 'カテゴリ別支出合計の取得に失敗しました' });
    }
    res.json(rows);
  });
});

// 月別支出合計
app.get('/summary/monthly', (req, res) => {
  const sql = `
    SELECT SUBSTR(date, 1, 7) AS month, SUM(amount) AS total
    FROM expenses
    GROUP BY month
    ORDER BY month ASC;
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('月別支出合計取得エラー:', err.message);
      return res.status(500).json({ error: '月別支出合計の取得に失敗しました' });
    }
    res.json(rows);
  });
});

// 予算と実支出の比較
app.get('/summary/budget-vs-actual', (req, res) => {
  const sql = `
    SELECT
      b.month,
      b.amount AS budget,
      IFNULL(SUM(e.amount), 0) AS actual
    FROM budgets b
    LEFT JOIN expenses e ON SUBSTR(e.date, 1, 7) = b.month
    GROUP BY b.month
    ORDER BY b.month ASC;
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('予算と実支出比較取得エラー:', err.message);
      return res.status(500).json({ error: '予算と実支出比較の取得に失敗しました' });
    }
    res.json(rows);
  });
});

// 設定取得エンドポイント
app.get('/settings/:key', (req, res) => {
  const { key } = req.params;

  const sql = 'SELECT value FROM settings WHERE key = ?';
  db.get(sql, [key], (err, row) => {
    if (err) {
      console.error('設定取得エラー:', err.message);
      return res.status(500).json({ error: '設定の取得に失敗しました' });
    }

    if (!row) {
      return res.status(404).json({ message: `設定 "${key}" は存在しません` });
    }

    res.json({ key, value: row.value });
  });
});

// 設定保存・更新エンドポイント
app.post('/settings/:key', (req, res) => {
  const { key } = req.params;
  const { value } = req.body;

  if (typeof value !== 'string') {
    return res.status(400).json({ error: 'value は文字列である必要があります' });
  }

  const sql = `
    INSERT INTO settings (key, value)
    VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `;

  db.run(sql, [key, value], function (err) {
    if (err) {
      console.error('設定保存エラー:', err.message);
      return res.status(500).json({ error: '設定の保存に失敗しました' });
    }
    res.json({ message: `設定 "${key}" を保存しました`, key, value });
  });
});

// デフォルトカテゴリ登録
app.post('/initialize/default-categories', async (req, res) => {
  try {
    await insertDefaultCategories();
    res.json({ message: 'デフォルトカテゴリを挿入しました' });
  } catch (error) {
    console.error('デフォルトカテゴリ挿入エラー:', error.message);
    res.status(500).json({ error: 'デフォルトカテゴリの挿入に失敗しました' });
  }
});

// デフォルト設定登録
app.post('/initialize/default-settings', async (req, res) => {
  try {
    await insertDefaultSettings();
    res.status(200).json({ message: 'デフォルト設定を登録しました' });
  } catch (err) {
    console.error('デフォルト設定登録エラー:', err.message);
    res.status(500).json({ error: 'デフォルト設定登録に失敗しました' });
  }
});

// CSVエクスポート
app.post('/export/csv', (req, res) => {
  exec('go run ./go-csv-exporter/exporter.go', { env: { ...process.env, CGO_ENABLED: '1' } }, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: stderr });
    }
    res.json({ message: 'エクスポート成功', output: stdout });
  });
});

// CSVインポート
app.post('/import/csv', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'CSVファイルがアップロードされていません' });
  }

  const importerPath = path.join(__dirname, 'go-csv-importer', 'importer.go');
  const csvPath = path.resolve(req.file.path);

  exec(`go run "${importerPath}" "${csvPath}"`, { env: { ...process.env, CGO_ENABLED: '1' } }, (err, stdout, stderr) => {
    // CSVファイルは使い終わったら削除する
    fs.unlink(csvPath, () => {});

    if (err) {
      console.error('インポート失敗:', stderr);
      return res.status(500).json({ error: stderr });
    }

    console.log('インポート成功:', stdout);
    res.json({ message: 'インポート成功', output: stdout });
  });
});
