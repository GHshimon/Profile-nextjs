"""ログイン後の状態確認"""
from playwright.sync_api import sync_playwright

ADMIN_EMAIL = "test001@shimon-dev.com"
ADMIN_PASSWORD = "Z3bu3yG<"
BASE = "http://127.0.0.1:3000"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    page.on("console", lambda msg: print(f"  CONSOLE [{msg.type}]: {msg.text}"))

    page.goto(f"{BASE}/admin/login", timeout=60000, wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle", timeout=30000)
    print(f"ログイン前 URL: {page.url}")

    page.fill('input[type="email"]', ADMIN_EMAIL)
    page.fill('input[type="password"]', ADMIN_PASSWORD)

    responses = []
    page.on("response", lambda r: responses.append((r.status, r.url)) if "supabase" in r.url else None)

    page.click('button[type="submit"]')

    for i in range(6):
        page.wait_for_timeout(5000)
        print(f"{(i+1)*5}秒後 URL: {page.url}")
        if page.url != f"{BASE}/admin/login":
            print("  → リダイレクト成功！")
            break

    import os
    os.makedirs("C:/tmp", exist_ok=True)
    page.screenshot(path="C:/tmp/login_state.png")
    print(f"\n最終 URL: {page.url}")

    for sel in ["[role='alert']", ".form-error"]:
        els = page.locator(sel).all()
        for el in els:
            txt = el.text_content()
            if txt:
                print(f"エラー表示: {txt}")

    print(f"\nSupabase API レスポンス: {len(responses)} 件")
    for status, url in responses:
        print(f"  {status} {url}")

    browser.close()
