"""dev サーバーを起動し、HTTP 応答が確認できてから E2E テストを実行する"""
import subprocess
import sys
import time
import urllib.request

SERVER_CMD = ["npm", "run", "dev"]
BASE = "http://127.0.0.1:3000"
WARMUP_URL = f"{BASE}/admin/login"
MAX_WAIT_SEC = 300  # 最大5分待つ


def wait_for_server():
    print("[0] dev サーバー起動中... (最大5分待機)")
    for i in range(MAX_WAIT_SEC):
        try:
            code = urllib.request.urlopen(WARMUP_URL, timeout=5).status
            print(f"    {i+1}秒後に HTTP {code} を確認 → サーバー準備完了")
            return True
        except Exception:
            if i % 15 == 0 and i > 0:
                print(f"    {i}秒経過... 待機中")
            time.sleep(1)
    return False


def main():
    proc = subprocess.Popen(
        SERVER_CMD,
        cwd=r"D:\Private\shimon\Project\プロフィールページ\site-nextjs",
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        shell=True,
    )

    try:
        if not wait_for_server():
            print("ERROR: サーバーが起動しませんでした")
            sys.exit(1)

        # E2E テスト実行
        result = subprocess.run(
            [sys.executable, "e2e_admin_test.py"],
            cwd=r"D:\Private\shimon\Project\プロフィールページ\site-nextjs",
        )
        sys.exit(result.returncode)
    finally:
        proc.terminate()
        proc.wait()
        print("サーバーを停止しました")


if __name__ == "__main__":
    main()
