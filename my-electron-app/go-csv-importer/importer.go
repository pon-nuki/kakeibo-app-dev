package main

import (
	"database/sql"
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"path/filepath"

	_ "github.com/mattn/go-sqlite3"
)

func getDBPath() string {
	userProfile := os.Getenv("USERPROFILE")
	return filepath.Join(userProfile, "AppData", "Roaming", "kakeibo", "expenses.db")
}

func main() {
	if len(os.Args) < 2 {
		log.Fatal("CSVファイルパスを指定してください")
	}
	csvPath := os.Args[1]

	fmt.Println("CSVファイルを読み込み:", csvPath)

	db, err := sql.Open("sqlite3", getDBPath())
	if err != nil {
		log.Fatalf("DB接続エラー: %v", err)
	}
	defer db.Close()

	file, err := os.Open(csvPath)
	if err != nil {
		log.Fatalf("CSVファイルオープン失敗: %v", err)
	}
	defer file.Close()

	reader := csv.NewReader(file)

	// ヘッダーを読み飛ばす
	_, err = reader.Read()
	if err != nil {
		log.Fatalf("CSV読み取りエラー（ヘッダー）: %v", err)
	}

	tx, err := db.Begin()
	if err != nil {
		log.Fatalf("トランザクション開始失敗: %v", err)
	}

	stmt, err := tx.Prepare(`INSERT INTO expenses (description, amount, date, category_id) VALUES (?, ?, ?, ?)`)
	if err != nil {
		log.Fatalf("ステートメント準備失敗: %v", err)
	}
	defer stmt.Close()

	for {
		record, err := reader.Read()
		if err != nil {
			break
		}

		if len(record) < 4 {
			log.Printf("不完全な行（スキップ）: %+v\n", record)
			continue
		}

		_, err = stmt.Exec(record[0], record[1], record[2], record[3])
		if err != nil {
			log.Printf("挿入エラー: %v", err)
		}
	}

	if err := tx.Commit(); err != nil {
		log.Fatalf("コミット失敗: %v", err)
	}

	fmt.Println("CSVデータをDBにインポートしました！")
}
