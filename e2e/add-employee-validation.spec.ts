import { test, expect } from '@playwright/test';

// Story 5323 — Add Employee form validation
// Auth guard checks localStorage.getItem('token')

test.describe('Add Employee Form Validation', () => {

  test.beforeEach(async ({ page }) => {
    // Inject auth token before Angular loads so the route guard passes
    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('isLoggedIn', 'true');
    });

    await page.goto('/employees');
    await expect(page).toHaveURL(/employees/, { timeout: 15000 });

    // Wait for loading skeleton to finish (API may be offline — that's OK)
    await page.waitForTimeout(1000);

    // Open Add Employee modal via testid button
    await page.getByTestId('open-add-modal').click();
    await expect(page.locator('.modal-box')).toBeVisible({ timeout: 10000 });

    // Ensure the submit button is enabled (not in loading state)
    await expect(page.getByTestId('submit-add-employee')).not.toBeDisabled({ timeout: 5000 });
  });

  // ── Empty form submission ────────────────────────────────────────────────

  test('shows Name required error when form submitted empty', async ({ page }) => {
    await page.getByTestId('submit-add-employee').click();
    await expect(page.getByTestId('name-required-error')).toBeVisible();
    await expect(page.getByTestId('name-required-error')).toHaveText('Name is required');
  });

  test('shows Email required error when form submitted empty', async ({ page }) => {
    await page.getByTestId('submit-add-employee').click();
    await expect(page.getByTestId('email-required-error')).toBeVisible();
    await expect(page.getByTestId('email-required-error')).toHaveText('Email is required');
  });

  test('blocks employee creation when both required fields are empty', async ({ page }) => {
    await page.getByTestId('submit-add-employee').click();
    // Modal stays open — creation was blocked
    await expect(page.locator('.modal-box')).toBeVisible();
    await expect(page.getByTestId('name-required-error')).toBeVisible();
    await expect(page.getByTestId('email-required-error')).toBeVisible();
  });

  // ── Name validation ──────────────────────────────────────────────────────

  test('clears Name required error after typing a name', async ({ page }) => {
    await page.getByTestId('submit-add-employee').click();
    await expect(page.getByTestId('name-required-error')).toBeVisible();
    await page.getByTestId('employee-name').fill('John Doe');
    await expect(page.getByTestId('name-required-error')).not.toBeVisible();
  });

  test('shows error when name exceeds 100 characters', async ({ page }) => {
    await page.getByTestId('employee-name').fill('A'.repeat(101));
    await page.getByTestId('submit-add-employee').click();
    await expect(page.getByTestId('name-length-error')).toBeVisible();
    await expect(page.getByTestId('name-length-error')).toHaveText('Name must not exceed 100 characters');
  });

  test('accepts name with exactly 100 characters', async ({ page }) => {
    await page.getByTestId('employee-name').fill('A'.repeat(100));
    await page.getByTestId('employee-email').fill('test@example.com');
    await page.getByTestId('submit-add-employee').click();
    await expect(page.getByTestId('name-length-error')).not.toBeVisible();
    await expect(page.getByTestId('name-required-error')).not.toBeVisible();
  });

  // ── Email validation ─────────────────────────────────────────────────────

  test('shows invalid email error for bad email format', async ({ page }) => {
    await page.getByTestId('employee-name').fill('John Doe');
    await page.getByTestId('employee-email').fill('not-an-email');
    await page.getByTestId('submit-add-employee').click();
    await expect(page.getByTestId('email-format-error')).toBeVisible();
    await expect(page.getByTestId('email-format-error')).toContainText('valid email address');
  });

  test('shows invalid email error for email without TLD', async ({ page }) => {
    await page.getByTestId('employee-name').fill('John Doe');
    await page.getByTestId('employee-email').fill('user@domain');
    await page.getByTestId('submit-add-employee').click();
    await expect(page.getByTestId('email-format-error')).toBeVisible();
  });

  test('accepts valid email format', async ({ page }) => {
    await page.getByTestId('employee-name').fill('John Doe');
    await page.getByTestId('employee-email').fill('john.doe@example.com');
    await page.getByTestId('submit-add-employee').click();
    await expect(page.getByTestId('email-required-error')).not.toBeVisible();
    await expect(page.getByTestId('email-format-error')).not.toBeVisible();
  });

  // ── Optional fields — no errors shown ───────────────────────────────────

  test('does not show validation error for empty Department', async ({ page }) => {
    await page.getByTestId('submit-add-employee').click();
    await expect(page.locator('[data-testid="name-required-error"]')).toBeVisible();
    // Confirm no department error exists in DOM
    await expect(page.locator('small:has-text("Department required")')).toHaveCount(0);
  });

  test('does not show validation error for empty Role', async ({ page }) => {
    await page.getByTestId('submit-add-employee').click();
    await expect(page.locator('small:has-text("Role required")')).toHaveCount(0);
  });

  test('does not show validation error for empty Experience', async ({ page }) => {
    await page.getByTestId('submit-add-employee').click();
    await expect(page.locator('small:has-text("Experience required")')).toHaveCount(0);
  });

  // ── Passes with only Name + Email ────────────────────────────────────────

  test('form passes validation with only Name and Email provided', async ({ page }) => {
    await page.getByTestId('employee-name').fill('Jane Smith');
    await page.getByTestId('employee-email').fill('jane@example.com');
    await page.getByTestId('submit-add-employee').click();
    await expect(page.getByTestId('name-required-error')).not.toBeVisible();
    await expect(page.getByTestId('email-required-error')).not.toBeVisible();
    await expect(page.getByTestId('name-length-error')).not.toBeVisible();
    await expect(page.getByTestId('email-format-error')).not.toBeVisible();
  });

});
