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

// SQLiteのDBパスを取得
func getDBPath() string {
	userProfile := os.Getenv("USERPROFILE")
	return filepath.Join(userProfile, "AppData", "Roaming", "kakeibo", "expenses.db")
}

// ダウンロードディレクトリに保存するパスを取得
func getDownloadPath() string {
	downloadDir := filepath.Join(os.Getenv("USERPROFILE"), "Downloads")
	return filepath.Join(downloadDir, "expenses_export.csv")
}

func main() {
	fmt.Println("SQLite DB に接続します")

	dbPath := getDBPath()
	outPath := getDownloadPath()

	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Fatalf("DB接続エラー: %v", err)
	}
	defer db.Close()

	rows, err := db.Query(`SELECT id, description, amount, date, category_id FROM expenses ORDER BY date ASC`)
	if err != nil {
		log.Fatalf("クエリ失敗: %v", err)
	}
	defer rows.Close()

	file, err := os.Create(outPath)
	if err != nil {
		log.Fatalf("CSV作成失敗: %v", err)
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	writer.Write([]string{"ID", "Description", "Amount", "Date", "CategoryID"})

	for rows.Next() {
		var id, catID int
		var desc, date string
		var amount float64
		if err := rows.Scan(&id, &desc, &amount, &date, &catID); err != nil {
			log.Fatalf("スキャン失敗: %v", err)
		}
		writer.Write([]string{
			fmt.Sprint(id), desc, fmt.Sprintf("%.2f", amount), date, fmt.Sprint(catID),
		})
	}

	fmt.Printf("%s にエクスポートしました\n", outPath)
}
