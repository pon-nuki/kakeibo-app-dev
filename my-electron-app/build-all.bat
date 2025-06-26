@echo off
chcp 65001 >nul
setlocal

cd /d "%~dp0"
echo 現在のディレクトリ: %cd%

echo === C: db_backup.exe ビルド ===
cd c-backup-tool
gcc -o db_backup.exe db_backup.c
if errorlevel 1 exit /b 1
copy /Y db_backup.exe ..\resources\
cd ..

echo === Python: history_analyzer.exe ビルド ===
cd python
pyinstaller --onefile history_analyzer.py --distpath dist
if errorlevel 1 exit /b 1
copy /Y dist\history_analyzer.exe ..\resources\
cd ..

echo === Go: exporter.exe ビルド ===
cd go-csv-exporter
go build -o exporter.exe exporter.go
if errorlevel 1 exit /b 1
copy /Y exporter.exe ..\resources\
cd ..

echo === Go: importer.exe ビルド ===
cd go-csv-importer
go build -o importer.exe importer.go
if errorlevel 1 exit /b 1
copy /Y importer.exe ..\resources\
cd ..

echo === Rust: month_end_alert.exe ビルド ===
cd rust-month-end-alert || (echo [ERROR] rust-month-end-alert ディレクトリが見つかりません。& exit /b 1)

cargo build --release
if errorlevel 1 exit /b 1

if exist "target\release\rust-month-end-alert.exe" (
  copy /Y "target\release\rust-month-end-alert.exe" "..\resources\month_end_alert.exe"
) else (
  echo [ERROR] Rust ビルドは成功したが exe ファイルが見つかりません。
  dir target\release
  exit /b 1
)
cd ..

echo === 完了 ===
endlocal
