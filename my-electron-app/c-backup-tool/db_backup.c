#include <stdio.h>
#include <stdlib.h>
#include <windows.h>
#include <direct.h>
#include <time.h>

int main() {
    const char *appdata = getenv("APPDATA");
    if (!appdata) {
        fprintf(stderr, "APPDATAが取得できません\n");
        return 1;
    }

    char srcPath[MAX_PATH];
    char backupDir[MAX_PATH];
    char destPath[MAX_PATH];

    // 元のDBのパス
    snprintf(srcPath, MAX_PATH, "%s\\kakeibo\\expenses.db", appdata);

    // バックアップディレクトリの作成
    snprintf(backupDir, MAX_PATH, "%s\\kakeibo\\backup", appdata);
    _mkdir(backupDir);

    // 日付取得
    time_t t = time(NULL);
    struct tm tm = *localtime(&t);
    char dateStr[11];  // YYYY-MM-DD + null
    snprintf(dateStr, sizeof(dateStr), "%04d-%02d-%02d", tm.tm_year + 1900, tm.tm_mon + 1, tm.tm_mday);

    // 出力先のファイル名
    snprintf(destPath, MAX_PATH, "%s\\expenses_%s.db", backupDir, dateStr);

    // コピー実行
    if (!CopyFile(srcPath, destPath, FALSE)) {
        fprintf(stderr, "バックアップ失敗: エラーコード %lu\n", GetLastError());
        return 1;
    }

    printf("バックアップ成功: %s → %s\n", srcPath, destPath);
    return 0;
}
