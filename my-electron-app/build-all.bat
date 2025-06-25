@echo off
chcp 65001 >nul
setlocal

echo === C: db_backup.exe ビルド ===
cd /d c-backup-tool
gcc -o db_backup.exe db_backup.c
if errorlevel 1 exit /b 1
copy /Y db_backup.exe ..\resources\

echo === Python: history_analyzer.exe ビルド ===
cd /d ..\python
pyinstaller --onefile history_analyzer.py --distpath dist
if errorlevel 1 exit /b 1
copy /Y dist\history_analyzer.exe ..\resources\

echo === Go: exporter.exe ビルド ===
cd /d ..\go-csv-exporter
go build -o exporter.exe exporter.go
if errorlevel 1 exit /b 1
copy /Y exporter.exe ..\resources\

echo === Go: importer.exe ビルド ===
cd /d ..\go-csv-importer
go build -o importer.exe importer.go
if errorlevel 1 exit /b 1
copy /Y importer.exe ..\resources\

echo === 完了 ===
endlocal
pause
