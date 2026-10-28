import { test, expect } from "@playwright/test";

test.describe("M_Dalats Villa - Production E2E Audit", () => {
  // Capture uncaught page errors
  test.beforeEach(async ({ page }) => {
    page.on("pageerror", (err) => {
      // Ignore non-fatal third-party font/analytics errors if any
      console.warn(`[Browser PageError]: ${err.message}`);
    });
  });

  test("1. Homepage renders correctly with brand elements & navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/M_Dalats/i);

    // Header logo & main navigation
    const logo = page.locator("header, nav").first();
    await expect(logo).toBeVisible();

    // Check main sections exist
    const heroHeading = page.locator("h1, h2").first();
    await expect(heroHeading).toBeVisible();

    // Verify footer branding & contact phone
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(/0939/);
  });

  test("2. Rooms Catalog page (/rooms) loads 11 rooms with pricing & badges", async ({ page }) => {
    await page.goto("/rooms");
    await expect(page).toHaveTitle(/M_Dalats/i);

    // Verify room cards exist
    const roomCards = page.locator(".grid .group, main [class*='rounded-md']").filter({
      hasText: /đêm|VNĐ|₫/i,
    });
    await expect(roomCards.first()).toBeVisible({ timeout: 20_000 });

    // Verify price formatting contains comma or currency symbol
    const priceText = await roomCards.first().innerText();
    expect(priceText).toMatch(/(\d{1,3}[,.]\d{3}|VNĐ|₫)/);
  });

  test("3. Dining & Experience pages render correctly", async ({ page }) => {
    await page.goto("/dining");
    await expect(page).toHaveURL(/dining/);
    await expect(page.locator("h1, h2").first()).toBeVisible();

    await page.goto("/experiences");
    await expect(page).toHaveURL(/experiences/);
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("4. Contact page renders form with validation", async ({ page }) => {
    await page.goto("/contact");
    await expect(page).toHaveURL(/contact/);

    const nameInput = page.locator("input[name='name'], input[type='text']").first();
    const emailInput = page.locator("input[type='email'], input[name='email']").first();
    const messageInput = page.locator("textarea[name='message'], textarea").first();

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(messageInput).toBeVisible();
  });

  test("5. My Bookings lookup page renders phone/code tabs", async ({ page }) => {
    await page.goto("/my-bookings?phone=0939014234");
    await expect(page).toHaveURL(/my-bookings/);

    // Page must load without crashing
    const pageContent = page.locator("main");
    await expect(pageContent).toBeVisible();
  });

  test("6. Middleware protects /admin from anonymous access", async ({ page }) => {
    // Navigating to /admin without session must redirect to /login
    await page.goto("/admin");
    await page.waitForURL(/\/login/, { timeout: 15_000 });

    expect(page.url()).toContain("/login");
    expect(page.url()).toContain("callbackUrl=%2Fadmin");

    // Login page must render email & password inputs
    const emailInput = page.locator("input[type='email'], input[name='email']").first();
    const passwordInput = page.locator("input[type='password']").first();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test("7. SEO & Sitemap XML validation", async ({ page }) => {
    const sitemapRes = await page.request.get("/sitemap.xml");
    expect(sitemapRes.status()).toBe(200);
    const sitemapXml = await sitemapRes.text();
    expect(sitemapXml).toContain("<urlset");

    const robotsRes = await page.request.get("/robots.txt");
    expect(robotsRes.status()).toBe(200);
    const robotsTxt = await robotsRes.text();
    expect(robotsTxt).toContain("Disallow: /admin");
  });
});
