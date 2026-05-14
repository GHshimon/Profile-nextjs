"""カテゴリ新規作成フォーム送信のデバッグ"""
from playwright.sync_api import sync_playwright

ADMIN_EMAIL = "test001@shimon-dev.com"
ADMIN_PASSWORD = "Z3bu3yG<"
BASE = "http://localhost:3000"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    page.on("console", lambda msg: print(f"  CONSOLE [{msg.type}]: {msg.text}"))
    page.on("response", lambda r: print(f"  RESPONSE: {r.status} {r.url}") if "localhost" in r.url else None)

    # ログイン
    print("[1] ログイン")
    page.goto(f"{BASE}/admin/login", timeout=60000, wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle", timeout=30000)
    page.fill('input[type="email"]', ADMIN_EMAIL)
    page.fill('input[type="password"]', ADMIN_PASSWORD)
    page.click('button[type="submit"]')
    page.wait_for_url("**/admin", timeout=30000)
    print(f"    ログイン後 URL: {page.url}")

    # クッキー確認
    cookies = page.context.cookies()
    print(f"    クッキー数: {len(cookies)}")
    for c in cookies:
        if "supabase" in c["name"].lower() or "auth" in c["name"].lower() or "sb-" in c["name"].lower():
            print(f"    クッキー: {c['name']} = {c['value'][:30]}...")

    # categories一覧
    print("\n[2] /admin/categories")
    page.goto(f"{BASE}/admin/categories", timeout=60000, wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle")
    print(f"    URL: {page.url}")

    # 新規作成ページ
    print("\n[3] 新規作成ページへ")
    with page.expect_navigation():
        page.click("text=新規作成")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(1000)
    print(f"    URL: {page.url}")

    # フォーム送信前のクッキー
    cookies_before = page.context.cookies()
    supabase_cookies_before = [c for c in cookies_before if "sb-" in c["name"]]
    print(f"\n[4] フォーム送信前 - Supabaseクッキー: {len(supabase_cookies_before)}件")

    # フォーム記入
    import time
    slug = f"e2e-debug-{int(time.time())}"
    page.fill('input[name="slug"]', slug)
    page.fill('input[name="name"]', "E2Eデバッグ")
    page.fill('textarea[name="description"]', "デバッグ用")
    page.fill('input[name="order"]', "99")
    print(f"    slug: {slug}")

    # 送信
    print("\n[5] フォーム送信")
    responses = []
    page.on("response", lambda r: responses.append(r) if "localhost" in r.url else None)
    page.click('button[type="submit"]')
    page.wait_for_timeout(6000)
    print(f"    送信後 URL: {page.url}")

    # クッキー確認
    cookies_after = page.context.cookies()
    supabase_cookies_after = [c for c in cookies_after if "sb-" in c["name"]]
    print(f"    Supabaseクッキー: {len(supabase_cookies_after)}件")

    # /admin/categoriesへ遷移
    print("\n[6] /admin/categoriesへ手動遷移")
    page.goto(f"{BASE}/admin/categories", timeout=60000, wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle")
    print(f"    URL: {page.url}")

    # ページのテキストを確認
    if "/admin/login" in page.url:
        print("    セッション切れ！")
        # エラーメッセージを確認
        content = page.content()
        print(f"    ページ内容 (先頭500文字): {content[:500]}")
    else:
        print("    セッション維持 OK")
        # 作成されたか確認
        count = page.locator("text=E2Eデバッグ").count()
        print(f"    'E2Eデバッグ' の件数: {count}")

    import os
    os.makedirs("C:/tmp", exist_ok=True)
    page.screenshot(path="C:/tmp/debug_category.png")
    browser.close()
