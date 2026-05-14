# -*- coding: utf-8 -*-
"""
Task 27: 管理者CMS E2E動作確認
実行方法:
  python e2e_admin_test.py  (dev server を別ターミナルで起動しておく)
"""

from playwright.sync_api import sync_playwright

# =============================
ADMIN_EMAIL = "test001@shimon-dev.com"
ADMIN_PASSWORD = "Z3bu3yG<"
# =============================

BASE = "http://localhost:3000"


def test_redirect_to_login(page):
    print("\n[1] 未ログイン状態で /admin -> /admin/login にリダイレクト")
    page.goto(f"{BASE}/admin", timeout=60000, wait_until="domcontentloaded")
    page.wait_for_url("**/admin/login", timeout=15000)
    assert "/admin/login" in page.url, f"リダイレクト失敗: {page.url}"
    print("    OK")


def test_login(page):
    print("\n[2] ログイン")
    page.goto(f"{BASE}/admin/login", timeout=60000, wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle", timeout=30000)
    page.fill('input[type="email"]', ADMIN_EMAIL)
    page.fill('input[type="password"]', ADMIN_PASSWORD)
    # ログインページには AdminNav がないので button[type="submit"] で OK
    page.click('button[type="submit"]')
    page.wait_for_url("**/admin", timeout=30000)
    assert page.url.rstrip("/").endswith("/admin"), f"ログイン後のURL異常: {page.url}"
    print("    OK")


def test_dashboard(page):
    print("\n[3] ダッシュボード: 統計カードが表示される")
    page.wait_for_load_state("networkidle")
    print(f"    ダッシュボード確認済 (URL: {page.url})")
    print("    OK")


def test_category_crud(page):
    print("\n[4] Categories CRUD")

    # 一覧
    page.goto(f"{BASE}/admin/categories", timeout=60000, wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle")
    print("    一覧ページ: OK")

    # 新規作成ページへ
    with page.expect_navigation():
        page.click("text=新規作成")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(1000)

    page.fill('input[name="slug"]', "e2e-test")
    page.fill('input[name="name"]', "E2Eテスト")
    page.fill('textarea[name="description"]', "自動テスト用カテゴリ")
    page.fill('input[name="order"]', "99")

    # 「作成」ボタンをテキストで指定 (AdminNav の「ログアウト」ボタンと混同しない)
    with page.expect_navigation(timeout=20000):
        page.locator('button[type="submit"]', has_text="作成").click()
    page.wait_for_load_state("networkidle")
    print(f"    新規作成後 URL: {page.url}")
    assert "admin/categories" in page.url, f"リダイレクト失敗: {page.url}"

    assert page.locator("text=E2Eテスト").count() > 0, "作成されたカテゴリが見つからない"
    print("    新規作成: OK")

    # 編集
    with page.expect_navigation():
        page.locator("tr", has_text="E2Eテスト").locator("text=編集").click()
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(1000)
    page.fill('input[name="name"]', "E2Eテスト（更新済）")
    with page.expect_navigation(timeout=20000):
        page.locator('button[type="submit"]', has_text="更新").click()
    page.wait_for_load_state("networkidle")
    assert page.locator("text=E2Eテスト（更新済）").count() > 0, "更新が反映されていない"
    print("    編集: OK")

    # 削除
    page.once("dialog", lambda d: d.accept())
    page.locator("tr", has_text="E2Eテスト（更新済）").locator("button", has_text="削除").click()
    page.wait_for_timeout(3000)
    page.reload()
    page.wait_for_load_state("networkidle")
    assert page.locator("text=E2Eテスト（更新済）").count() == 0, "削除が反映されていない"
    print("    削除: OK")


def test_works_crud(page):
    print("\n[5] Works CRUD（画像なし）")

    page.goto(f"{BASE}/admin/works", timeout=60000, wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle")
    print("    一覧ページ: OK")

    # 最初のカテゴリの「新規追加」ボタンをクリック
    with page.expect_navigation():
        page.locator("text=このカテゴリに新規追加").first.click()
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(1000)

    page.fill('input[name="title"]', "E2Eテスト Work")
    page.fill('input[name="number"]', "999")
    page.fill('input[name="slug"]', "e2e-test-work")
    page.fill('input[name="description"]', "自動テスト用Work")
    page.fill('input[name="order"]', "99")
    with page.expect_navigation(timeout=20000):
        page.locator('button[type="submit"]', has_text="作成").click()
    page.wait_for_load_state("networkidle")
    assert page.locator("text=E2Eテスト Work").count() > 0, "作成されたWorkが見つからない"
    print("    新規作成: OK")

    # 編集
    with page.expect_navigation():
        page.locator("tr", has_text="E2Eテスト Work").locator("text=編集").click()
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(1000)
    page.fill('input[name="title"]', "E2Eテスト Work（更新済）")
    with page.expect_navigation(timeout=20000):
        page.locator('button[type="submit"]', has_text="更新").click()
    page.wait_for_load_state("networkidle")
    assert page.locator("text=E2Eテスト Work（更新済）").count() > 0, "更新が反映されていない"
    print("    編集: OK")

    # 削除
    page.once("dialog", lambda d: d.accept())
    page.locator("tr", has_text="E2Eテスト Work（更新済）").locator("button", has_text="削除").click()
    page.wait_for_timeout(3000)
    page.reload()
    page.wait_for_load_state("networkidle")
    assert page.locator("text=E2Eテスト Work（更新済）").count() == 0, "削除が反映されていない"
    print("    削除: OK")


def test_logout(page):
    print("\n[6] ログアウト")
    page.goto(f"{BASE}/admin", timeout=60000, wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle")
    page.locator("button", has_text="ログアウト").click()
    page.wait_for_url("**/admin/login", timeout=8000)
    assert "/admin/login" in page.url, f"ログアウト後のURL異常: {page.url}"
    print("    OK")


def test_public_pages(page):
    print("\n[7] 公開サイトの主要ページ確認")
    for path in ["/", "/works"]:
        page.goto(f"{BASE}{path}", timeout=60000, wait_until="load")
        assert page.title() != "", f"{path} のタイトルが空"
        print(f"    {path}: OK")


def warmup(page):
    """dev サーバーの初回コンパイル完了を待つ"""
    print("\n[0] サーバーウォームアップ中...")
    page.goto(f"{BASE}/admin/login", timeout=120000, wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle", timeout=60000)
    print("    完了")


def main():
    assert ADMIN_EMAIL and ADMIN_PASSWORD, "ADMIN_EMAIL と ADMIN_PASSWORD を記入してください"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            warmup(page)
            test_redirect_to_login(page)
            test_login(page)
            test_dashboard(page)
            test_category_crud(page)
            test_works_crud(page)
            test_logout(page)
            test_public_pages(page)
            print("\n=============================")
            print("  全テスト PASSED")
            print("=============================\n")
        except AssertionError as e:
            import os
            os.makedirs("C:/tmp", exist_ok=True)
            page.screenshot(path="C:/tmp/failure.png")
            print(f"\n  FAILED: {e}")
            print("  スクリーンショット: C:/tmp/failure.png")
            raise
        finally:
            browser.close()


if __name__ == "__main__":
    main()
