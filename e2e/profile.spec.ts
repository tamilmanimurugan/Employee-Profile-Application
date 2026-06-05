import { test, expect } from '@playwright/test';

test.describe('Profile Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('token', 'employee-token'));
    await page.goto('/profile');
    await expect(page).toHaveURL(/profile/, { timeout: 10000 });
    await page.waitForTimeout(500);
  });

  // ── Page load ─────────────────────────────────────────────────────────────

  test('profile page loads without errors', async ({ page }) => {
    await expect(page.locator('.page-content')).toBeVisible({ timeout: 10000 });
  });

  test('profile page renders content', async ({ page }) => {
    // At minimum, some content should be visible
    const body = page.locator('body');
    await expect(body).not.toBeEmpty();
  });

  // ── Profile content (checks common patterns) ──────────────────────────────

  test('profile image is visible', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Tamilmani name is visible on profile page', async ({ page }) => {
    await expect(page.getByText('Tamilmani').first()).toBeVisible({ timeout: 10000 });
  });

  test('Angular Developer role is visible', async ({ page }) => {
    await expect(page.getByText('Angular Developer').first()).toBeVisible({ timeout: 10000 });
  });

  // ── Navigation from profile ────────────────────────────────────────────────

  test('sidebar active link shows Profile', async ({ page }) => {
    await expect(page.locator('.sidebar a.active-link')).toContainText('Profile');
  });

  test('can navigate to Dashboard from profile page', async ({ page }) => {
    await page.locator('.sidebar a[href="/dashboard"]').click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  // ── Mobile ────────────────────────────────────────────────────────────────

  test('profile page renders on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/profile');
    await page.waitForTimeout(500);
    await expect(page.locator('.page-content')).toBeVisible({ timeout: 10000 });
  });

  test('bottom nav shows Profile as active on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/profile');
    await expect(page.locator('.bottom-nav a.bottom-active')).toBeVisible({ timeout: 10000 });
  });

});
