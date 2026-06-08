import { test, expect } from '@playwright/test';

test.describe('Reports Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'employee-token');
      localStorage.setItem('isLoggedIn', 'true');
    });
    await page.goto('/reports');
    await expect(page).toHaveURL(/reports/, { timeout: 10000 });
  });

  // ── Page load ─────────────────────────────────────────────────────────────

  test('reports page loads without errors', async ({ page }) => {
    await expect(page.locator('.reports-page')).toBeVisible({ timeout: 10000 });
  });

  test('Reports heading is visible', async ({ page }) => {
    await expect(page.locator('h1').filter({ hasText: 'Reports' })).toBeVisible({ timeout: 10000 });
  });

  // ── Filter controls (Criteria 1) ──────────────────────────────────────────

  test('month filter dropdown is visible', async ({ page }) => {
    await expect(page.locator('.filter-card .filter-select').first()).toBeVisible({ timeout: 10000 });
  });

  test('year filter dropdown is visible', async ({ page }) => {
    await expect(page.locator('.filter-card .filter-select').nth(1)).toBeVisible({ timeout: 10000 });
  });

  test('month dropdown contains month options', async ({ page }) => {
    const monthSelect = page.locator('.filter-card .filter-select').first();
    await expect(monthSelect).toContainText('January');
    await expect(monthSelect).toContainText('June');
    await expect(monthSelect).toContainText('December');
  });

  test('year dropdown contains year options', async ({ page }) => {
    const yearSelect = page.locator('.filter-card .filter-select').nth(1);
    await expect(yearSelect).toContainText('2026');
  });

  // ── Download validation (Criteria 5) ─────────────────────────────────────

  test('download button is visible', async ({ page }) => {
    await expect(page.locator('.btn-download')).toBeVisible({ timeout: 10000 });
  });

  test('download button is disabled before filters are selected', async ({ page }) => {
    await expect(page.locator('.btn-download')).toBeDisabled({ timeout: 5000 });
  });

  test('View Report button is visible', async ({ page }) => {
    await expect(page.locator('.btn-search')).toBeVisible({ timeout: 10000 });
  });

  // ── No-data state (Criteria 4) ────────────────────────────────────────────

  test('selecting month with no data shows no-data state', async ({ page }) => {
    await page.locator('.filter-card .filter-select').first().selectOption('03');
    await page.locator('.filter-card .filter-select').nth(1).selectOption('2026');
    await page.locator('.btn-search').click();
    await expect(page.locator('.no-data-card')).toBeVisible({ timeout: 5000 });
  });

  test('no-data card shows correct message', async ({ page }) => {
    await page.locator('.filter-card .filter-select').first().selectOption('03');
    await page.locator('.filter-card .filter-select').nth(1).selectOption('2026');
    await page.locator('.btn-search').click();
    await expect(page.locator('.no-data-card')).toContainText('No records found');
  });

  // ── Report grid (Criteria 2) ──────────────────────────────────────────────

  test('selecting June 2026 shows report grid with data', async ({ page }) => {
    await page.locator('.filter-card .filter-select').first().selectOption('06');
    await page.locator('.filter-card .filter-select').nth(1).selectOption('2026');
    await page.locator('.btn-search').click();
    await expect(page.locator('.report-table-card')).toBeVisible({ timeout: 5000 });
  });

  test('report grid has story number column', async ({ page }) => {
    await page.locator('.filter-card .filter-select').first().selectOption('06');
    await page.locator('.filter-card .filter-select').nth(1).selectOption('2026');
    await page.locator('.btn-search').click();
    await expect(page.locator('.report-table')).toContainText('Story #');
  });

  test('report grid has story name column', async ({ page }) => {
    await page.locator('.filter-card .filter-select').first().selectOption('06');
    await page.locator('.filter-card .filter-select').nth(1).selectOption('2026');
    await page.locator('.btn-search').click();
    await expect(page.locator('.report-table')).toContainText('Story Name');
  });

  test('report grid has assigned user column', async ({ page }) => {
    await page.locator('.filter-card .filter-select').first().selectOption('06');
    await page.locator('.filter-card .filter-select').nth(1).selectOption('2026');
    await page.locator('.btn-search').click();
    await expect(page.locator('.report-table')).toContainText('Assigned User');
  });

  test('report grid has team lead and project manager columns', async ({ page }) => {
    await page.locator('.filter-card .filter-select').first().selectOption('06');
    await page.locator('.filter-card .filter-select').nth(1).selectOption('2026');
    await page.locator('.btn-search').click();
    await expect(page.locator('.report-table')).toContainText('Team Lead');
    await expect(page.locator('.report-table')).toContainText('Project Manager');
  });

  test('download button is enabled when data is available', async ({ page }) => {
    await page.locator('.filter-card .filter-select').first().selectOption('06');
    await page.locator('.filter-card .filter-select').nth(1).selectOption('2026');
    await page.locator('.btn-search').click();
    await expect(page.locator('.report-table-card')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.btn-download')).toBeEnabled({ timeout: 3000 });
  });

  // ── Validation before search (Criteria 5) ─────────────────────────────────

  test('clicking View Report without filters shows error hints', async ({ page }) => {
    await page.locator('.btn-search').click();
    await expect(page.locator('.error-hint').first()).toBeVisible({ timeout: 3000 });
  });

  // ── Navigation ────────────────────────────────────────────────────────────

  test('Reports link is visible in sidebar', async ({ page }) => {
    await expect(page.locator('.sidebar').getByText('Reports')).toBeVisible({ timeout: 5000 });
  });

});
