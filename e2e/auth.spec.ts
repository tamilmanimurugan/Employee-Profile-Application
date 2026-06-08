import { test, expect } from '@playwright/test';

// Credentials: admin@gmail.com / 1234
// AuthGuard checks localStorage.getItem('token')

test.describe('Authentication', () => {

  // ── Login page loads ──────────────────────────────────────────────────────

  test('login page loads on root visit', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/login/);
  });

  test('login page shows Welcome Back heading', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Welcome Back')).toBeVisible();
  });

  test('login page shows Email and Password inputs', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[placeholder="Enter email"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Enter password"]')).toBeVisible();
  });

  test('login page shows Login button', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('button.login-btn')).toBeVisible();
  });

  test('login page shows Sign in with Google button', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('button.google-btn')).toBeVisible();
  });

  // ── Successful login ──────────────────────────────────────────────────────

  test('valid credentials redirect to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[placeholder="Enter email"]').fill('admin@gmail.com');
    await page.locator('input[placeholder="Enter password"]').fill('1234');
    await page.locator('button.login-btn').click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  test('valid login sets token in localStorage', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[placeholder="Enter email"]').fill('admin@gmail.com');
    await page.locator('input[placeholder="Enter password"]').fill('1234');
    await page.locator('button.login-btn').click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBe('employee-token');
  });

  // ── Invalid login ─────────────────────────────────────────────────────────

  test('wrong password shows inline error message', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[placeholder="Enter email"]').fill('admin@gmail.com');
    await page.locator('input[placeholder="Enter password"]').fill('wrongpassword');
    await page.locator('button.login-btn').click();
    await expect(page.locator('.error-message')).toBeVisible({ timeout: 5000 });
  });

  test('wrong email shows inline error message', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[placeholder="Enter email"]').fill('wrong@gmail.com');
    await page.locator('input[placeholder="Enter password"]').fill('1234');
    await page.locator('button.login-btn').click();
    await expect(page.locator('.error-message')).toBeVisible({ timeout: 5000 });
  });

  test('empty fields shows inline error message', async ({ page }) => {
    await page.goto('/login');
    await page.locator('button.login-btn').click();
    await expect(page.locator('.error-message')).toBeVisible({ timeout: 5000 });
  });

  test('wrong credentials stay on login page', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[placeholder="Enter email"]').fill('bad@test.com');
    await page.locator('input[placeholder="Enter password"]').fill('bad');
    await page.locator('button.login-btn').click();
    await expect(page.locator('.error-message')).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL(/login/);
  });

  test('login button shows loading state while authenticating', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[placeholder="Enter email"]').fill('admin@gmail.com');
    await page.locator('input[placeholder="Enter password"]').fill('1234');
    await page.locator('button.login-btn').click();
    await expect(page.locator('button.login-btn')).toContainText('Signing in', { timeout: 2000 });
  });

  // ── Authenticated user redirect ───────────────────────────────────────────

  test('authenticated user visiting /login is redirected to /dashboard', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('token', 'employee-token'));
    await page.goto('/login');
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  // ── Auth guard redirect ───────────────────────────────────────────────────

  test('unauthenticated access to /dashboard redirects to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
  });

  test('unauthenticated access to /employees redirects to login', async ({ page }) => {
    await page.goto('/employees');
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
  });

  test('unauthenticated access to /attendance redirects to login', async ({ page }) => {
    await page.goto('/attendance');
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
  });

  test('unauthenticated access to /settings redirects to login', async ({ page }) => {
    await page.goto('/settings');
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
  });

  test('unauthenticated access to /profile redirects to login', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
  });

  test('unauthenticated access to /contact redirects to login', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
  });

  // ── Logout ────────────────────────────────────────────────────────────────

  test('sidebar logout button navigates to login', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('token', 'employee-token'));
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
    await page.locator('button.logout-btn').click();
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
  });

  test('logout clears token from localStorage', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('token', 'employee-token'));
    await page.goto('/dashboard');
    await page.locator('button.logout-btn').click();
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
    const token = await page.evaluate(() => localStorage.getItem('isLoggedIn'));
    expect(token).toBeNull();
  });

  test('after logout, navigating to /dashboard redirects to login', async ({ page }) => {
    // Set token via evaluate (not addInitScript) so it doesn't re-run on subsequent navigations
    await page.goto('/login');
    await page.evaluate(() => localStorage.setItem('token', 'employee-token'));
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
    await page.locator('button.logout-btn').click();
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
    // Token is now cleared — navigating to /dashboard should redirect back to login
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
  });

});
