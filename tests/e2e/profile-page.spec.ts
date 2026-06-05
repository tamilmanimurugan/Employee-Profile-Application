import { expect, test } from '@playwright/test';

const adminEmail = process.env.E2E_ADMIN_EMAIL ?? 'admin@gmail.com';
const adminPassword = process.env.E2E_ADMIN_PASSWORD;

test('profile page displays Tamilmani employee details', async ({ page }) => {
  if (!adminPassword) {
    throw new Error('Set E2E_ADMIN_PASSWORD before running the e2e tests.');
  }

  await page.goto('/login');
  await page.getByPlaceholder('Enter email').fill(adminEmail);
  await page.getByPlaceholder('Enter password').fill(adminPassword);
  await page.locator('.login-btn').click();
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.getByRole('link', { name: /profile/i }).click();
  await expect(page).toHaveURL(/\/profile$/);

  const profileCard = page.locator('.profile-card');
  await expect(page.getByText('Employee Portal')).toBeVisible();
  await expect(page.getByText('Welcome back, Tamilmani')).toBeVisible();
  await expect(profileCard.getByRole('heading', { name: 'Tamilmani' })).toBeVisible();
  await expect(profileCard.getByText('Senior Angular Developer')).toBeVisible();
  await expect(profileCard.getByText('tamil@gmail.com')).toBeVisible();
  await expect(profileCard.getByText('Development')).toBeVisible();
  await expect(profileCard.getByText('Chennai, India')).toBeVisible();
  await expect(profileCard.getByText('92%')).toBeVisible();
  await expect(profileCard.getByText('96%')).toBeVisible();
  await expect(profileCard.getByText('18')).toBeVisible();
  await expect(profileCard.getByText('Skills')).toBeVisible();
  await expect(profileCard.getByText('Angular').first()).toBeVisible();
  await expect(profileCard.getByText('TypeScript').first()).toBeVisible();
  await expect(profileCard.getByText('Bootstrap').first()).toBeVisible();
  await expect(profileCard.getByText('Node JS')).toBeVisible();
  await expect(profileCard.getByText('SQL')).toBeVisible();
  await expect(profileCard.getByText('About Employee')).toBeVisible();
  await expect(
    profileCard.getByText('Passionate Angular developer with experience in enterprise dashboard systems.'),
  ).toBeVisible();
  await expect(profileCard.getByRole('button', { name: /edit profile/i })).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
