import sys
import io
import os
import sqlite3
import shutil
import datetime
import json
from urllib.parse import urlparse
from collections import Counter

# 出力を Shift_JIS に変換（Windowsのcmd向け）
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='cp932')

def get_browser_history_paths(base_dir_name, browser_name):
    """
    ブラウザのUser Dataディレクトリ内にある履歴ファイルパスを取得
    """
    base_path = os.path.expanduser("~") + fr"\AppData\Local\{base_dir_name}\User Data"
    profiles = []

    if not os.path.exists(base_path):
        return []

    for entry in os.listdir(base_path):
        profile_path = os.path.join(base_path, entry)
        history_path = os.path.join(profile_path, "History")
        if os.path.isfile(history_path):
            profiles.append((f"{browser_name}:{entry}", history_path))

    return profiles

def read_history_from_file(profile_name, history_path, limit=1000):
    """
    SQLite形式の履歴ファイルからデータを読み取り、最新の履歴を返す
    """
    tmp_file = f"temp_history_{profile_name.replace(':', '_').replace(' ', '_')}"
    shutil.copy2(history_path, tmp_file)

    conn = sqlite3.connect(tmp_file)
    cursor = conn.cursor()

    cursor.execute("SELECT url, title, last_visit_time FROM urls ORDER BY last_visit_time DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()

    results = []
    for url, title, last_visit_time in rows:
        visited = datetime.datetime(1601, 1, 1) + datetime.timedelta(microseconds=last_visit_time)
        results.append({
            "profile": profile_name,
            "url": url,
            "title": title,
            "visited": visited.isoformat()
        })

    conn.close()
    os.remove(tmp_file)
    return results

def get_all_histories():
    """
    Chrome と Edge のすべての履歴を統合して取得
    """
    chrome_profiles = get_browser_history_paths("Google\\Chrome", "Chrome")
    edge_profiles = get_browser_history_paths("Microsoft\\Edge", "Edge")

    all_profiles = chrome_profiles + edge_profiles
    all_history = []

    for profile_name, history_path in all_profiles:
        try:
            history = read_history_from_file(profile_name, history_path)
            all_history.extend(history)
        except Exception as e:
            print(f"Failed to read history from {profile_name}: {e}")

    return all_history

def extract_domain(url):
    try:
        return urlparse(url).netloc
    except:
        return "unknown"

def is_shopping_related(item):
    """
    ドメインがショッピング系サイトであれば支出傾向ありと判定
    """
    shopping_domains = [
        "amazon.co.jp", "rakuten.co.jp", "shopping.yahoo.co.jp",
        "zozo.jp", "mercari.com", "paypaymall.yahoo.co.jp",
        "store.shopping.yahoo.co.jp", "lohaco.jp", "aupay.market"
    ]

    domain = extract_domain(item['url'].lower())
    return any(domain.endswith(shop_domain) for shop_domain in shopping_domains)

if __name__ == "__main__":
    all_history = get_all_histories()

    # 支出傾向のある履歴を抽出
    shopping_history = [item for item in all_history if is_shopping_related(item)]

    if not shopping_history:
        print("\n支出につながるような履歴は見つかりませんでした。")
    else:
        print(f"\n支出傾向のある履歴 {len(shopping_history)} 件を検出。\n")

        # ドメイン別に表示
        domains = [extract_domain(item["url"]) for item in shopping_history]
        domain_counts = Counter(domains).most_common()

        print("TOP5：")
        for domain, count in domain_counts[:5]:
            print(f"  {domain:<30} ... {count}回")

        # ElectronのuserData（APPDATA/kakeibo）に保存
        try:
            appdata = os.environ.get("APPDATA")  # Windows環境変数
            if not appdata:
                raise EnvironmentError("APPDATA 環境変数が見つかりません")

            output_dir = os.path.join(appdata, "kakeibo")
            os.makedirs(output_dir, exist_ok=True)

            output_path = os.path.join(output_dir, "shopping_history.json")

            with open(output_path, "w", encoding="utf-8") as f:
                json.dump(shopping_history, f, ensure_ascii=False, indent=2)

            print(f"\nshopping_history.json に保存しました → {output_path}")
        except Exception as e:
            print(f"JSON保存失敗: {e}")

