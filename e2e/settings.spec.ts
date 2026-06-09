import { test, expect } from '@playwright/test';

test.describe('Settings Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('token', 'employee-token'));
    await page.goto('/settings');
    await expect(page).toHaveURL(/settings/, { timeout: 10000 });
    await page.waitForTimeout(500);
  });

  // ── Desktop view ──────────────────────────────────────────────────────────

  test('Settings Center heading is visible', async ({ page }) => {
    await expect(page.getByText('Settings Center')).toBeVisible({ timeout: 10000 });
  });

  test('Profile Information card is visible', async ({ page }) => {
    const el = page.locator('h3').filter({ hasText: 'Profile Information' });
    await el.scrollIntoViewIfNeeded();
    await expect(el).toBeVisible({ timeout: 10000 });
  });

  test('Security Settings card is visible', async ({ page }) => {
    const el = page.locator('h3').filter({ hasText: 'Security Settings' });
    await el.scrollIntoViewIfNeeded();
    await expect(el).toBeVisible({ timeout: 10000 });
  });

  test('Notification Preferences card is visible', async ({ page }) => {
    await expect(page.getByText('Notification Preferences')).toBeVisible({ timeout: 10000 });
  });

  // ── Profile form ──────────────────────────────────────────────────────────

  test('Full Name input is visible', async ({ page }) => {
    const el = page.locator('.settings-card.desktop-only input[type="text"]').first();
    await el.scrollIntoViewIfNeeded();
    await expect(el).toBeVisible({ timeout: 10000 });
  });

  test('Email Address input is visible', async ({ page }) => {
    await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('Department input is visible', async ({ page }) => {
    await expect(page.locator('input[type="text"]').filter({ hasText: '' }).nth(2)).toBeVisible({ timeout: 10000 });
  });

  test('profile form prefilled with Tamilmani name', async ({ page }) => {
    const fullNameInput = page.locator('label:has-text("Full Name") + input').first();
    await expect(fullNameInput).toHaveValue('Tamilmani');
  });

  test('profile form prefilled with email', async ({ page }) => {
    const emailInput = page.locator('label:has-text("Email Address") + input').first();
    await expect(emailInput).toHaveValue('tamil@gmail.com');
  });

  // ── Security form ─────────────────────────────────────────────────────────

  test('Current Password input is visible', async ({ page }) => {
    await expect(page.locator('input[type="password"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('New Password input is visible', async ({ page }) => {
    await expect(page.locator('input[type="password"]').nth(1)).toBeVisible({ timeout: 10000 });
  });

  test('2FA select dropdown is visible', async ({ page }) => {
    await expect(page.locator('select.form-select')).toBeVisible({ timeout: 10000 });
  });

  // ── Dark Mode toggle ──────────────────────────────────────────────────────

  test('Dark Mode toggle is visible', async ({ page }) => {
    await expect(page.locator('.settings-card.desktop-only h5').filter({ hasText: 'Dark Mode' })).toBeVisible({ timeout: 10000 });
  });

  test('Dark Mode checkbox toggle works', async ({ page }) => {
    const checkbox = page.locator('.settings-card.desktop-only').first().locator('.form-check-input');
    const initialState = await checkbox.isChecked();
    await checkbox.click();
    const newState = await checkbox.isChecked();
    expect(newState).toBe(!initialState);
  });

  test('toggling Dark Mode adds dark-theme to body', async ({ page }) => {
    const checkbox = page.locator('.settings-card.desktop-only').first().locator('.form-check-input');
    const isChecked = await checkbox.isChecked();
    if (!isChecked) {
      await checkbox.click();
    }
    const hasDark = await page.evaluate(() =>
      document.body.classList.contains('dark-theme')
    );
    expect(hasDark).toBe(true);
  });

  // ── Notifications ─────────────────────────────────────────────────────────

  test('Email Notifications toggle is visible', async ({ page }) => {
    await expect(page.locator('h5').filter({ hasText: 'Email Notifications' })).toBeVisible({ timeout: 10000 });
  });

  test('Attendance Alerts toggle is visible', async ({ page }) => {
    await expect(page.locator('h5').filter({ hasText: 'Attendance Alerts' })).toBeVisible({ timeout: 10000 });
  });

  test('Push Notifications toggle is visible', async ({ page }) => {
    await expect(page.locator('h5').filter({ hasText: 'Push Notifications' })).toBeVisible({ timeout: 10000 });
  });

  // ── Save button ───────────────────────────────────────────────────────────

  test('Save All Changes button is visible', async ({ page }) => {
    await expect(page.locator('button.main-save-btn')).toBeVisible({ timeout: 10000 });
  });

  test('Discard button is visible', async ({ page }) => {
    await expect(page.locator('button.discard-btn')).toBeVisible({ timeout: 10000 });
  });

  test('clicking Save All Changes button does not crash', async ({ page }) => {
    await page.locator('button.main-save-btn').click();
    await expect(page).toHaveURL(/settings/);
  });

  // ── Quick stat cards ──────────────────────────────────────────────────────

  test('Security Score quick card is visible', async ({ page }) => {
    await expect(page.getByText('Security Score')).toBeVisible({ timeout: 10000 });
  });

  test('Notifications quick card is visible', async ({ page }) => {
    await expect(page.locator('.quick-card span').filter({ hasText: /^Notifications$/ })).toBeVisible({ timeout: 10000 });
  });

  test('Cloud Backup quick card is visible', async ({ page }) => {
    await expect(page.getByText('Cloud Backup')).toBeVisible({ timeout: 10000 });
  });

  // ── Mobile view ───────────────────────────────────────────────────────────

  test('mobile settings section visible on small screen', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/settings');
    await page.waitForTimeout(500);
    await expect(page.locator('.mobile-settings')).toBeVisible({ timeout: 10000 });
  });

  test('mobile profile card is visible', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/settings');
    await page.waitForTimeout(500);
    await expect(page.locator('.mob-set-profile')).toBeVisible({ timeout: 10000 });
  });

  test('mobile Save Changes button is visible', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/settings');
    await page.waitForTimeout(500);
    await expect(page.locator('button.mob-set-save')).toBeVisible({ timeout: 10000 });
  });

  test('mobile Logout button is visible', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/settings');
    await page.waitForTimeout(500);
    await expect(page.locator('button.mob-set-logout')).toBeVisible({ timeout: 10000 });
  });

  test('mobile Logout button navigates to login', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/settings');
    await page.waitForTimeout(500);
    const logoutBtn = page.locator('button.mob-set-logout');
    await logoutBtn.scrollIntoViewIfNeeded();
    await logoutBtn.click({ force: true });
    await page.waitForURL(/login/, { timeout: 15000 });
  });

  test('mobile PREFERENCES section label is visible', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/settings');
    await expect(page.locator('.mob-set-section-label').first()).toContainText('PREFERENCES');
  });

  test('mobile ACCOUNT section label is visible', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/settings');
    await expect(page.locator('.mob-set-section-label').nth(1)).toContainText('ACCOUNT');
  });

  test('mobile Contact Us nav item navigates to contact page', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/settings');
    await page.locator('a.mob-set-item[href="/contact"]').click();
    await expect(page).toHaveURL(/contact/, { timeout: 10000 });
  });

});
