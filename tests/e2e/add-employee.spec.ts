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

test('adds an employee from the Add Employee popup', async ({ page }) => {
  await login(page);

  await page.locator('.hero-btn').click();
  const modal = page.locator('.custom-modal');
  await expect(modal.getByRole('heading', { name: 'Add Employee' })).toBeVisible();

  const fields = modal.locator('input.form-control');
  await fields.nth(0).fill('Arun Kumar');
  await fields.nth(1).fill('arun.kumar@example.com');
  await fields.nth(2).fill('Quality Assurance');
  await fields.nth(3).fill('QA Engineer');
  await fields.nth(4).fill('4+ Years');
  await modal.locator('.save-btn').click();

  await expect(modal).toBeHidden();

  const row = page.getByRole('row').filter({ hasText: 'Arun Kumar' });
  await expect(row).toBeVisible();
  await expect(row).toContainText('arun.kumar@example.com');
  await expect(row).toContainText('Quality Assurance');
  await expect(row).toContainText('QA Engineer');
  await expect(row).toContainText('Active');
  await expect(row).toContainText('4+ Years');
  await expect(row).toContainText('80%');

  await page.getByPlaceholder('Search employee...').fill('Arun');
  await expect(row).toBeVisible();
});
