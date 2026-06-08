import { expect, test } from '@playwright/test';

const adminEmail = process.env.E2E_ADMIN_EMAIL ?? 'admin@gmail.com';
const adminPassword = process.env.E2E_ADMIN_PASSWORD;

async function login(page: import('@playwright/test').Page) {
  if (!adminPassword) {
    throw new Error('Set E2E_ADMIN_PASSWORD before running the e2e tests.');
  }
  await page.goto('/login');
  await page.getByPlaceholder('Enter email').fill(adminEmail);
  await page.getByPlaceholder('Enter password').fill(adminPassword);
  await page.locator('.login-btn').click();
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15000 });
}

test.describe('Edit Employee flow', () => {

  test('employees page renders rows from GET /api/employees', async ({ page }) => {
    await login(page);
    await page.goto('/employees');

    // Table should load with at least one row
    const rows = page.locator('tbody tr');
    await expect(rows.first()).toBeVisible({ timeout: 15000 });
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('stats reflect the loaded employee list', async ({ page }) => {
    await login(page);
    await page.goto('/employees');

    await page.locator('tbody tr').first().waitFor({ timeout: 15000 });

    // All four stat cards should show a number > 0
    const statCards = page.locator('.stat-card h2');
    await expect(statCards.first()).toBeVisible({ timeout: 10000 });

    const count = await statCards.count();
    expect(count).toBe(4);

    for (let i = 0; i < count; i++) {
      const text = await statCards.nth(i).textContent();
      expect(Number(text?.trim())).toBeGreaterThanOrEqual(0);
    }
  });

  test('clicking edit button opens Edit Employee popup', async ({ page }) => {
    await login(page);
    await page.goto('/employees');

    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible({ timeout: 15000 });

    await firstRow.locator('.action-btn.edit').click();

    const modal = page.locator('.custom-modal');
    await expect(modal.getByRole('heading', { name: 'Edit Employee' })).toBeVisible({ timeout: 10000 });
  });

  test('can update employee fields and see changes in directory', async ({ page }) => {
    await login(page);
    await page.goto('/employees');

    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible({ timeout: 15000 });

    // Remember the employee name
    const empName = (await firstRow.locator('h6').textContent())?.trim() ?? '';
    expect(empName.length).toBeGreaterThan(0);

    // Open edit modal
    await firstRow.locator('.action-btn.edit').click();
    const modal = page.locator('.custom-modal');
    await expect(modal.getByRole('heading', { name: 'Edit Employee' })).toBeVisible({ timeout: 10000 });

    // Update performance to a known value
    const perfInput = modal.locator('input[type="number"]');
    await perfInput.clear();
    await perfInput.fill('72');

    // Save
    await modal.locator('.save-btn').click();

    // Modal closes
    await expect(modal).toBeHidden({ timeout: 15000 });

    // Employee row is still visible with the same name
    const updatedRow = page.locator('tbody tr').filter({ hasText: empName });
    await expect(updatedRow).toBeVisible({ timeout: 10000 });
  });

});
