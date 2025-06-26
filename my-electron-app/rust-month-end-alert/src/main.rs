use chrono::{Datelike, Local};
use std::fs::File;
use std::io::Write;

fn main() {
    let today = Local::now().date_naive();
    let year = today.year();
    let month = today.month();

    // 今月の最終日を計算
    let last_day = match month {
        1 | 3 | 5 | 7 | 8 | 10 | 12 => 31,
        4 | 6 | 9 | 11 => 30,
        2 => {
            if is_leap_year(year) { 29 } else { 28 }
        },
        _ => 30, // 通常ありえない
    };

    let day = today.day();
    let days_left = last_day as i64 - day as i64;

    let message = if days_left <= 5 {
        format!("月末まであと{}日です。支出に注意！", days_left)
    } else {
        format!("月末まであと{}日です。", days_left)
    };

    // ユーザーデータフォルダに通知ファイルを書き出す
    let user_data_dir = dirs::data_dir().unwrap_or_else(|| std::env::current_dir().unwrap());
    let output_path = user_data_dir.join("kakeibo").join("month_end_alert.txt");

    if let Some(parent) = output_path.parent() {
        std::fs::create_dir_all(parent).unwrap_or(());
    }

    let mut file = File::create(&output_path).expect("ファイル作成に失敗");
    writeln!(file, "{}", message).expect("ファイル書き込みに失敗");

    println!("{}", message);
}

fn is_leap_year(year: i32) -> bool {
    (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)
}
