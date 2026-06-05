import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('token', 'employee-token'));
  });

  // ── Sidebar links (desktop) ───────────────────────────────────────────────

  test('sidebar Profile link navigates to /profile', async ({ page }) => {
    await page.goto('/dashboard');
    await page.locator('.sidebar a[href="/profile"]').click();
    await expect(page).toHaveURL(/profile/, { timeout: 10000 });
  });

  test('sidebar Dashboard link navigates to /dashboard', async ({ page }) => {
    await page.goto('/profile');
    await page.locator('.sidebar a[href="/dashboard"]').click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  test('sidebar Employees link navigates to /employees', async ({ page }) => {
    await page.goto('/dashboard');
    await page.locator('.sidebar a[href="/employees"]').click();
    await expect(page).toHaveURL(/employees/, { timeout: 10000 });
  });

  test('sidebar Attendance link navigates to /attendance', async ({ page }) => {
    await page.goto('/dashboard');
    await page.locator('.sidebar a[href="/attendance"]').click();
    await expect(page).toHaveURL(/attendance/, { timeout: 10000 });
  });

  test('sidebar Settings link navigates to /settings', async ({ page }) => {
    await page.goto('/dashboard');
    await page.locator('.sidebar a[href="/settings"]').click();
    await expect(page).toHaveURL(/settings/, { timeout: 10000 });
  });

  test('sidebar Contact Us link navigates to /contact', async ({ page }) => {
    await page.goto('/dashboard');
    await page.locator('.sidebar a[href="/contact"]').click();
    await expect(page).toHaveURL(/contact/, { timeout: 10000 });
  });

  // ── Sidebar active link highlight ─────────────────────────────────────────

  test('active-link class applied to current page link', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('.sidebar a.active-link')).toContainText('Dashboard');
  });

  test('active-link updates when navigating to Employees', async ({ page }) => {
    await page.goto('/employees');
    await expect(page.locator('.sidebar a.active-link')).toContainText('Employees');
  });

  test('active-link updates when navigating to Attendance', async ({ page }) => {
    await page.goto('/attendance');
    await expect(page.locator('.sidebar a.active-link')).toContainText('Attendance');
  });

  test('active-link updates when navigating to Settings', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.locator('.sidebar a.active-link')).toContainText('Settings');
  });

  // ── Topbar ────────────────────────────────────────────────────────────────

  test('topbar is visible on dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('.topbar')).toBeVisible();
  });

  test('topbar shows Employee Portal title', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('.logo-text')).toContainText('Employee Portal');
  });

  test('topbar notification button is visible', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('.notification-btn').first()).toBeVisible();
  });

  test('topbar profile image is visible', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('.profile-img')).toBeVisible();
  });

  // ── Sidebar profile section ───────────────────────────────────────────────

  test('sidebar shows EmployeeX logo text', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('.logo-section h3')).toContainText('EmployeeX');
  });

  test('sidebar shows user name Tamilmani', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('.profile-box h5')).toContainText('Tamilmani');
  });

  test('sidebar profile image is visible', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('.profile-box img')).toBeVisible();
  });

  // ── Dark mode toggle ──────────────────────────────────────────────────────

  test('theme button is visible in sidebar', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('button.theme-btn')).toBeVisible();
  });

  test('clicking theme button toggles dark-theme class on body', async ({ page }) => {
    await page.goto('/dashboard');
    await page.locator('button.theme-btn').click();
    const hasDark = await page.evaluate(() =>
      document.body.classList.contains('dark-theme')
    );
    expect(hasDark).toBe(true);
  });

  test('clicking theme button twice removes dark-theme class', async ({ page }) => {
    await page.goto('/dashboard');
    await page.locator('button.theme-btn').click();
    await page.locator('button.theme-btn').click();
    const hasDark = await page.evaluate(() =>
      document.body.classList.contains('dark-theme')
    );
    expect(hasDark).toBe(false);
  });

  test('dark mode preference saved to localStorage', async ({ page }) => {
    await page.goto('/dashboard');
    await page.locator('button.theme-btn').click();
    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(theme).toBe('dark');
  });

  // ── Mobile bottom nav (320px viewport) ───────────────────────────────────

  test('bottom nav is visible on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/dashboard');
    await expect(page.locator('.bottom-nav')).toBeVisible();
  });

  test('bottom nav Profile link works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/dashboard');
    await page.locator('.bottom-nav a[href="/profile"]').click();
    await expect(page).toHaveURL(/profile/, { timeout: 10000 });
  });

  test('bottom nav Employees link works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/dashboard');
    await page.locator('.bottom-nav a[href="/employees"]').click();
    await expect(page).toHaveURL(/employees/, { timeout: 10000 });
  });

  test('bottom nav Attendance link works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/dashboard');
    await page.locator('.bottom-nav a[href="/attendance"]').click();
    await expect(page).toHaveURL(/attendance/, { timeout: 10000 });
  });

  test('bottom nav Settings link works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/dashboard');
    await page.locator('.bottom-nav a[href="/settings"]').click();
    await expect(page).toHaveURL(/settings/, { timeout: 10000 });
  });

  test('sidebar is hidden on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/dashboard');
    const sidebar = page.locator('.sidebar');
    await expect(sidebar).toBeHidden();
  });

  // ── Mobile topbar logout button ───────────────────────────────────────────

  test('mobile logout button is visible on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/dashboard');
    await expect(page.locator('button.mobile-logout-btn')).toBeVisible();
  });

  test('mobile logout button navigates to login', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/dashboard');
    await page.locator('button.mobile-logout-btn').click();
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
  });

});
