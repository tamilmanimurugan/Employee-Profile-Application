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
  await expect(page).toHaveURL(/\/(dashboard|employees)$/);
}

async function openAddEmployeeModal(page: import('@playwright/test').Page) {
  if (!page.url().endsWith('/employees')) {
    await page.goto('/employees');
  }

  await page.getByRole('button', { name: /add employee/i }).first().click();
  const modal = page.locator('.custom-modal');
  await expect(modal.getByRole('heading', { name: 'Add Employee' })).toBeVisible();
  return modal;
}

function nameInput(modal: import('@playwright/test').Locator) {
  return modal.locator('input.form-control').nth(0);
}

function emailInput(modal: import('@playwright/test').Locator) {
  return modal.locator('input.form-control').nth(1);
}

function errorMessages(modal: import('@playwright/test').Locator) {
  return modal.locator('.error-text, .text-danger, [role="alert"], .invalid-feedback, .alert');
}

async function submit(modal: import('@playwright/test').Locator) {
  await modal.locator('.save-btn').click();
}

test.describe.configure({ mode: 'serial' });

test.describe('Add Employee form validation', () => {
  test('shows visible required field messages when submitting an empty form', async ({ page }) => {
    await login(page);

    const modal = await openAddEmployeeModal(page);
    await submit(modal);

    await expect(modal).toBeVisible();
    await expect(errorMessages(modal).filter({ hasText: /name is required/i })).toBeVisible();
    await expect(errorMessages(modal).filter({ hasText: /email is required/i })).toBeVisible();
  });

  test('requires name before adding an employee', async ({ page }) => {
    await login(page);

    const modal = await openAddEmployeeModal(page);
    await emailInput(modal).fill('missing-name@example.com');
    await submit(modal);

    await expect(modal).toBeVisible();
    await expect(errorMessages(modal).filter({ hasText: /name is required/i })).toBeVisible();
    await expect(page.getByRole('row').filter({ hasText: 'missing-name@example.com' })).toHaveCount(0);
  });

  test('does not accept a name longer than 100 characters', async ({ page }) => {
    await login(page);

    const longName = 'A'.repeat(101);
    const modal = await openAddEmployeeModal(page);
    await nameInput(modal).fill(longName);
    await emailInput(modal).fill('too-long-name@example.com');
    await submit(modal);

    await expect(modal).toBeVisible();
    await expect(errorMessages(modal).filter({ hasText: /100|name/i })).toBeVisible();
    await expect(page.getByRole('row').filter({ hasText: 'too-long-name@example.com' })).toHaveCount(0);
  });

  test('requires email before adding an employee', async ({ page }) => {
    await login(page);

    const modal = await openAddEmployeeModal(page);
    await nameInput(modal).fill('Missing Email');
    await submit(modal);

    await expect(modal).toBeVisible();
    await expect(errorMessages(modal).filter({ hasText: /email is required/i })).toBeVisible();
    await expect(page.getByRole('row').filter({ hasText: 'Missing Email' })).toHaveCount(0);
  });

  test('validates email format before adding an employee', async ({ page }) => {
    await login(page);

    const modal = await openAddEmployeeModal(page);
    await nameInput(modal).fill('Invalid Email');
    await emailInput(modal).fill('invalid-email');

    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('Enter valid email');
      await dialog.accept();
    });
    await submit(modal);

    await expect(modal).toBeVisible();
    await expect(page.getByRole('row').filter({ hasText: 'Invalid Email' })).toHaveCount(0);
  });

  test('allows department, role, and experience to be optional', async ({ page }) => {
    await login(page);

    const modal = await openAddEmployeeModal(page);
    await nameInput(modal).fill('Optional Fields');
    await emailInput(modal).fill('optional-fields@example.com');
    await submit(modal);

    await expect(modal).toBeHidden();
    const row = page.getByRole('row').filter({ hasText: 'Optional Fields' });
    await expect(row).toBeVisible();
    await expect(row).toContainText('optional-fields@example.com');
  });
});
