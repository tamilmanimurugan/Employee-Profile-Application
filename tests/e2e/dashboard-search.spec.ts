import { expect, test } from '@playwright/test';

const adminEmail = process.env.E2E_ADMIN_EMAIL ?? 'admin@gmail.com';
const adminPassword = process.env.E2E_ADMIN_PASSWORD;

async function login(page: import('@playwright/test').Page) {
  if (!adminPassword) {
    throw new Error('Set E2E_ADMIN_PASSWORD before running the e2e tests.');
  }

  await page.goto('/login');
  await page.evaluate(() => localStorage.removeItem('dashboardEmployees'));
  await page.getByPlaceholder('Enter email').fill(adminEmail);
  await page.getByPlaceholder('Enter password').fill(adminPassword);
  await page.locator('.login-btn').click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

async function expectOnlyMatchingRows(
  page: import('@playwright/test').Page,
  query: string,
  expectedText: string,
  unexpectedTexts: string[],
) {
  const rows = page.locator('tbody tr');

  await page.getByPlaceholder('Search employee...').fill(query);
  await expect(rows).toHaveCount(1);
  await expect(rows.first()).toContainText(expectedText);

  for (const unexpectedText of unexpectedTexts) {
    await expect(rows.first()).not.toContainText(unexpectedText);
  }
}

test('filters the dashboard Employee Directory by name, department, and role', async ({ page }) => {
  await login(page);

  const rows = page.locator('tbody tr');
  await expect(rows).toHaveCount(3);

  await expectOnlyMatchingRows(page, 'Tamil', 'Tamilmani', ['Rahul', 'Priya']);
  await expectOnlyMatchingRows(page, 'Backend', 'Rahul', ['Tamilmani', 'Priya']);
  await expectOnlyMatchingRows(page, 'Designer', 'Priya', ['Tamilmani', 'Rahul']);

  await page.getByPlaceholder('Search employee...').fill('NoSuchEmployee');
  await expect(rows).toHaveCount(0);
});
