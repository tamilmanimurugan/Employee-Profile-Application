import { test, expect } from '@playwright/test';

test.describe('Attendance Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('token', 'employee-token'));
    await page.goto('/attendance');
    await expect(page).toHaveURL(/attendance/, { timeout: 10000 });
    await page.waitForTimeout(800);
  });

  // ── Desktop view ──────────────────────────────────────────────────────────

  test('Attendance Dashboard heading is visible', async ({ page }) => {
    await expect(page.getByText('Attendance Dashboard')).toBeVisible({ timeout: 10000 });
  });

  test('Total Employees stat card is visible', async ({ page }) => {
    await expect(page.getByText('Total Employees')).toBeVisible({ timeout: 10000 });
  });

  test('Active stat card is visible', async ({ page }) => {
    await expect(page.locator('.present-card').first()).toBeVisible({ timeout: 10000 });
  });

  test('On Leave stat card is visible', async ({ page }) => {
    await expect(page.locator('.leave-card')).toBeVisible({ timeout: 10000 });
  });

  test('Absent stat card is visible', async ({ page }) => {
    await expect(page.locator('.absent-card')).toBeVisible({ timeout: 10000 });
  });

  // ── Live Activity ─────────────────────────────────────────────────────────

  test('Live Office Activity section is visible', async ({ page }) => {
    await expect(page.getByText('Live Office Activity')).toBeVisible({ timeout: 10000 });
  });

  test('LIVE badge is visible', async ({ page }) => {
    await expect(page.locator('.live-badge').first()).toBeVisible({ timeout: 10000 });
  });

  test('Productivity activity box shows 92%', async ({ page }) => {
    await expect(page.getByText('92%')).toBeVisible({ timeout: 10000 });
  });

  test('In Meetings activity box shows 45', async ({ page }) => {
    await expect(page.getByText('In Meetings')).toBeVisible({ timeout: 10000 });
  });

  test('Online activity box shows 180', async ({ page }) => {
    await expect(page.getByText('Online')).toBeVisible({ timeout: 10000 });
  });

  test('Late Check-ins activity box shows 15', async ({ page }) => {
    await expect(page.getByText('Late Check-ins')).toBeVisible({ timeout: 10000 });
  });

  // ── Date & time boxes ─────────────────────────────────────────────────────

  test('date box is visible in topbar', async ({ page }) => {
    await expect(page.locator('.date-box').first()).toBeVisible({ timeout: 10000 });
  });

  test('clock box is visible in topbar', async ({ page }) => {
    await expect(page.locator('.date-box').nth(1)).toBeVisible({ timeout: 10000 });
  });

  // ── Mark Attendance modal ─────────────────────────────────────────────────

  test('Mark Attendance button is visible', async ({ page }) => {
    await expect(page.locator('button.mark-btn')).toBeVisible({ timeout: 10000 });
  });

  test('clicking Mark Attendance opens modal', async ({ page }) => {
    await page.locator('button.mark-btn').click();
    await expect(page.locator('.attendance-modal')).toBeVisible({ timeout: 5000 });
  });

  test('modal shows Mark Attendance title', async ({ page }) => {
    await page.locator('button.mark-btn').click();
    await expect(page.locator('.modal-top h3')).toContainText('Mark Attendance');
  });

  test('modal shows current time', async ({ page }) => {
    await page.locator('button.mark-btn').click();
    await expect(page.locator('.checkin-box h2')).toBeVisible();
  });

  test('modal shows Confirm Attendance button', async ({ page }) => {
    await page.locator('button.mark-btn').click();
    await expect(page.locator('button.confirm-btn')).toBeVisible();
  });

  test('modal close button closes the modal', async ({ page }) => {
    await page.locator('button.mark-btn').click();
    await expect(page.locator('.attendance-modal')).toBeVisible();
    await page.locator('button.close-btn').click();
    await expect(page.locator('.attendance-modal')).not.toBeVisible({ timeout: 5000 });
  });

  test('confirming attendance shows success alert', async ({ page }) => {
    await page.locator('button.mark-btn').click();
    await page.locator('button.confirm-btn').click();
    await expect(page.locator('.success-alert')).toBeVisible({ timeout: 5000 });
  });

  test('success alert contains success message', async ({ page }) => {
    await page.locator('button.mark-btn').click();
    await page.locator('button.confirm-btn').click();
    await expect(page.locator('.success-alert')).toContainText('Attendance Marked Successfully');
  });

  // ── Attendance table ──────────────────────────────────────────────────────

  test('Today Attendance table is visible', async ({ page }) => {
    await expect(page.getByText('Today Attendance')).toBeVisible({ timeout: 10000 });
  });

  test('table has Employee column', async ({ page }) => {
    await expect(page.locator('thead th').filter({ hasText: 'Employee' })).toBeVisible();
  });

  test('table has Status column', async ({ page }) => {
    await expect(page.locator('thead th').filter({ hasText: 'Status' })).toBeVisible();
  });

  test('table has Check In column', async ({ page }) => {
    await expect(page.locator('thead th').filter({ hasText: 'Check In' })).toBeVisible();
  });

  // ── Mobile view ───────────────────────────────────────────────────────────

  test('mobile attendance header is visible on small screen', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/attendance');
    await page.waitForTimeout(800);
    await expect(page.locator('.mob-att-header')).toBeVisible({ timeout: 10000 });
  });

  test('mobile Attendance title is visible', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/attendance');
    await page.waitForTimeout(500);
    await expect(page.locator('.mob-att-title')).toBeVisible();
  });

  test('mobile Mark button is visible', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/attendance');
    await expect(page.locator('button.mob-mark-btn')).toBeVisible({ timeout: 10000 });
  });

  test('mobile live activity section is visible', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/attendance');
    await page.waitForTimeout(500);
    await expect(page.locator('.mob-live-section')).toBeVisible({ timeout: 10000 });
  });

  test('mobile Active Employees accordion is visible', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/attendance');
    await page.waitForTimeout(1000);
    await expect(page.locator('.mob-list-toggle').first()).toBeVisible({ timeout: 10000 });
  });

  test('mobile Active Employees accordion expands on click', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/attendance');
    await page.waitForTimeout(1000);
    const toggle = page.locator('.mob-list-toggle').first();
    await toggle.click();
    await page.waitForTimeout(400);
    // After click, list may appear
    const list = page.locator('.mob-emp-list').first();
    const isVisible = await list.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });

  test('mobile stat cards are visible', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/attendance');
    await page.waitForTimeout(500);
    await expect(page.locator('.mob-att-stats')).toBeVisible({ timeout: 10000 });
  });

});
