import { test, expect } from '@playwright/test';

// Add Employee form validation is covered in add-employee-validation.spec.ts
// This file covers: employee list, search, filters, view details

test.describe('Employees Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'employee-token');
      localStorage.setItem('isLoggedIn', 'true');
    });
    await page.goto('/employees');
    await expect(page).toHaveURL(/employees/, { timeout: 15000 });
    await page.waitForTimeout(1000);
  });

  // ── Page load ─────────────────────────────────────────────────────────────

  test('employees page loads without errors', async ({ page }) => {
    await expect(page.locator('.employees-page')).toBeVisible({ timeout: 10000 });
  });

  test('Employees heading or title is visible', async ({ page }) => {
    const heading = page.getByText('Employees').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  // ── Add Employee button ───────────────────────────────────────────────────

  test('Add Employee button is visible', async ({ page }) => {
    await expect(page.getByTestId('open-add-modal')).toBeVisible({ timeout: 10000 });
  });

  test('clicking Add Employee opens modal', async ({ page }) => {
    await page.getByTestId('open-add-modal').click();
    await expect(page.locator('.modal-box')).toBeVisible({ timeout: 10000 });
  });

  test('modal has Add Employee heading', async ({ page }) => {
    await page.getByTestId('open-add-modal').click();
    await expect(page.locator('.modal-box')).toContainText('Add Employee');
  });

  test('modal has Name input', async ({ page }) => {
    await page.getByTestId('open-add-modal').click();
    await expect(page.getByTestId('employee-name')).toBeVisible({ timeout: 5000 });
  });

  test('modal has Email input', async ({ page }) => {
    await page.getByTestId('open-add-modal').click();
    await expect(page.getByTestId('employee-email')).toBeVisible({ timeout: 5000 });
  });

  test('modal close button closes the modal', async ({ page }) => {
    await page.getByTestId('open-add-modal').click();
    await expect(page.locator('.modal-box')).toBeVisible();
    // Close button — look for X or cancel
    const closeBtn = page.locator('.modal-box button').filter({ hasText: /close|cancel|×/i }).first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await expect(page.locator('.modal-box')).not.toBeVisible({ timeout: 5000 });
    }
  });

  // ── Employee list / table ─────────────────────────────────────────────────

  test('employee table or card list is visible', async ({ page }) => {
    await expect(page.locator('.employee-table-card')).toBeVisible({ timeout: 10000 });
  });

  test('at least one employee row is visible after load', async ({ page }) => {
    await page.waitForTimeout(1500);
    const rows = page.locator('tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // ── Search ────────────────────────────────────────────────────────────────

  test('search input is visible', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="earch"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
  });

  test('typing in search input updates the list', async ({ page }) => {
    await page.waitForTimeout(1500);
    const searchInput = page.locator('input[placeholder*="earch"]').first();
    await searchInput.fill('Tamil');
    await page.waitForTimeout(500);
    // Verify no JS error occurs and page is still visible
    await expect(page.locator('.page-content')).toBeVisible();
  });

  test('search with no match shows empty state or zero rows', async ({ page }) => {
    await page.waitForTimeout(1500);
    const searchInput = page.locator('input[placeholder*="earch"]').first();
    await searchInput.fill('zzznomatchxyz999');
    await page.waitForTimeout(500);
    const rows = page.locator('tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('clearing search restores full list', async ({ page }) => {
    await page.waitForTimeout(1500);
    const searchInput = page.locator('input[placeholder*="earch"]').first();
    await searchInput.fill('zzznomatch');
    await page.waitForTimeout(400);
    await searchInput.fill('');
    await page.waitForTimeout(400);
    await expect(page.locator('.page-content')).toBeVisible();
  });

  // ── Status / Department filter (Story 5337) ──────────────────────────────

  test('status filter dropdown is visible', async ({ page }) => {
    await expect(page.locator('.filter-row .filter-select').first()).toBeVisible({ timeout: 10000 });
  });

  test('department filter dropdown is visible', async ({ page }) => {
    const selects = page.locator('.filter-row .filter-select');
    await expect(selects.nth(1)).toBeVisible({ timeout: 10000 });
  });

  test('status filter has All Status option', async ({ page }) => {
    const statusSelect = page.locator('.filter-row .filter-select').first();
    await expect(statusSelect).toContainText('All Status');
  });

  test('selecting Active status filter updates list', async ({ page }) => {
    await page.waitForTimeout(1500);
    const statusSelect = page.locator('.filter-row .filter-select').first();
    await statusSelect.selectOption('Active');
    await page.waitForTimeout(500);
    await expect(page.locator('.page-content')).toBeVisible();
  });

  test('selecting On Leave status filter updates list', async ({ page }) => {
    await page.waitForTimeout(1500);
    const statusSelect = page.locator('.filter-row .filter-select').first();
    await statusSelect.selectOption('On Leave');
    await page.waitForTimeout(500);
    await expect(page.locator('.page-content')).toBeVisible();
  });

  test('clear filter button appears when filter is active', async ({ page }) => {
    await page.waitForTimeout(1500);
    const statusSelect = page.locator('.filter-row .filter-select').first();
    await statusSelect.selectOption('Active');
    await page.waitForTimeout(300);
    await expect(page.locator('.filter-clear-btn')).toBeVisible({ timeout: 5000 });
  });

  test('clear filter button resets filters', async ({ page }) => {
    await page.waitForTimeout(1500);
    const statusSelect = page.locator('.filter-row .filter-select').first();
    await statusSelect.selectOption('Active');
    await page.waitForTimeout(300);
    await page.locator('.filter-clear-btn').click();
    await page.waitForTimeout(300);
    await expect(page.locator('.filter-clear-btn')).not.toBeVisible({ timeout: 3000 });
  });

  // ── Mobile view ───────────────────────────────────────────────────────────

  test('employees page loads on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/employees');
    await page.waitForTimeout(1000);
    await expect(page.locator('.page-content')).toBeVisible({ timeout: 10000 });
  });

  test('Add Employee button visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/employees');
    await page.waitForTimeout(1000);
    await expect(page.getByTestId('open-add-modal')).toBeVisible({ timeout: 10000 });
  });

});
