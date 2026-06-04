import { expect, test } from '@playwright/test';

const adminEmail = process.env.E2E_ADMIN_EMAIL ?? 'admin@gmail.com';
const adminPassword = process.env.E2E_ADMIN_PASSWORD;

async function login(page: import('@playwright/test').Page) {
  if (!adminPassword) {
    throw new Error('Set E2E_ADMIN_PASSWORD before running the e2e tests.');
  }

  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();

  await page.getByPlaceholder('Enter email').fill(adminEmail);
  await page.getByPlaceholder('Enter password').fill(adminPassword);
  await page.locator('.login-btn').click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText('Employee Portal')).toBeVisible();
  await expect(page.getByText('Welcome back, Tamilmani')).toBeVisible();
}

test.describe('authentication', () => {
  test('logs in with the admin test account and opens the dashboard', async ({ page }) => {
    await login(page);

    await expect(page.getByText('Employee Management Dashboard')).toBeVisible();
    await expect(page.getByText('Employee Directory')).toBeVisible();
    await expect(page.locator('.logout-btn')).toBeVisible();
  });

  test('logs out and returns to the login page', async ({ page }) => {
    await login(page);

    await page.locator('.logout-btn').click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
    await expect(page.getByPlaceholder('Enter email')).toBeVisible();
    await expect(page.getByText('Employee Management Dashboard')).toBeHidden();
  });
});
