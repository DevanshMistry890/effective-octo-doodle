import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        try:
            # Navigate to the signup page
            await page.goto("http://localhost:5173/signup", timeout=30000)

            # Wait for the page to load
            await expect(page.get_by_role("heading", name="Join GameHub")).to_be_visible(timeout=10000)

            # Fill in the signup form
            await page.locator("#username").fill("testuser")
            await page.locator("#email").fill("test@example.com")
            await page.locator("#password").fill("password")
            await page.locator("#confirmPassword").fill("password")

            # Click the signup button
            await page.get_by_role("button", name="Sign Up").click()

            # Wait for the dashboard to load
            await expect(page.get_by_role("heading", name="Dashboard")).to_be_visible(timeout=10000)

            # Take a screenshot of the dashboard
            await page.screenshot(path="jules-scratch/verification/verification.png")

        except Exception as e:
            print(f"An error occurred: {e}")
            await page.screenshot(path="jules-scratch/verification/error.png")
        finally:
            await browser.close()

asyncio.run(main())
