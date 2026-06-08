import { test, expect } from '@playwright/test';

const mockEmployee = {
  id: 1,
  name: 'Tamilmani',
  role: 'Angular Developer',
  email: 'tamil@gmail.com',
  department: 'Development',
  experience: '4 Years',
  status: 'Active',
  performance: 92,
  image: 'https://i.pravatar.cc/100?img=12'
};

const mockEmployeeOnLeave = {
  id: 2,
  name: 'Priya Sharma',
  role: 'UI Designer',
  email: 'priya@gmail.com',
  department: 'Design',
  experience: '2 Years',
  status: 'On Leave',
  performance: 68,
  image: 'https://i.pravatar.cc/100?img=5'
};

test.describe('Employee Details Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.addInitScript((emp) => {
      localStorage.setItem('token', 'employee-token');
      localStorage.setItem('selectedEmployee', JSON.stringify(emp));
    }, mockEmployee);
    await page.goto('/employee-details');
    await expect(page).toHaveURL(/employee-details/, { timeout: 10000 });
    await page.waitForTimeout(500);
  });

  // ── Page load ─────────────────────────────────────────────────────────────

  test('employee details page loads without errors', async ({ page }) => {
    await expect(page.locator('.employee-details-page')).toBeVisible({ timeout: 10000 });
  });

  test('Employee Details heading is visible', async ({ page }) => {
    await expect(page.getByText('Employee Details')).toBeVisible({ timeout: 10000 });
  });

  // ── Profile section ───────────────────────────────────────────────────────

  test('employee name is displayed', async ({ page }) => {
    await expect(page.locator('.profile-section h1').filter({ hasText: 'Tamilmani' })).toBeVisible({ timeout: 10000 });
  });

  test('employee role is displayed', async ({ page }) => {
    await expect(page.locator('.role-text')).toContainText('Angular Developer');
  });

  test('employee profile image is visible', async ({ page }) => {
    await expect(page.locator('.profile-image')).toBeVisible({ timeout: 10000 });
  });

  test('Active status badge is displayed for active employee', async ({ page }) => {
    await expect(page.locator('.status-badge')).toContainText('Active');
  });

  test('active status badge has active-status class', async ({ page }) => {
    await expect(page.locator('.status-badge.active-status')).toBeVisible({ timeout: 10000 });
  });

  // ── Detail cards ──────────────────────────────────────────────────────────

  test('Email Address detail card is visible', async ({ page }) => {
    await expect(page.getByText('Email Address')).toBeVisible({ timeout: 10000 });
  });

  test('employee email is displayed', async ({ page }) => {
    await expect(page.getByText('tamil@gmail.com')).toBeVisible({ timeout: 10000 });
  });

  test('Department detail card is visible', async ({ page }) => {
    await expect(page.getByText('Department')).toBeVisible({ timeout: 10000 });
  });

  test('employee department is displayed', async ({ page }) => {
    await expect(page.getByText('Development')).toBeVisible({ timeout: 10000 });
  });

  test('Role detail card is visible', async ({ page }) => {
    await expect(page.getByText('Role').first()).toBeVisible({ timeout: 10000 });
  });

  test('Experience detail card is visible', async ({ page }) => {
    await expect(page.getByText('Experience')).toBeVisible({ timeout: 10000 });
  });

  test('employee experience is displayed', async ({ page }) => {
    await expect(page.getByText('4 Years')).toBeVisible({ timeout: 10000 });
  });

  // ── Performance card ──────────────────────────────────────────────────────

  test('Employee Performance card is visible', async ({ page }) => {
    await expect(page.getByText('Employee Performance')).toBeVisible({ timeout: 10000 });
  });

  test('performance percentage is displayed', async ({ page }) => {
    await expect(page.locator('.performance-top span')).toContainText('92%');
  });

  test('performance progress bar is visible', async ({ page }) => {
    await expect(page.locator('.custom-progress')).toBeVisible({ timeout: 10000 });
  });

  test('Excellent Performance label shown for 92% performance', async ({ page }) => {
    await expect(page.getByText('Excellent Performance')).toBeVisible({ timeout: 10000 });
  });

  // ── Back button ───────────────────────────────────────────────────────────

  test('back button is visible', async ({ page }) => {
    await expect(page.locator('button.close-btn')).toBeVisible({ timeout: 10000 });
  });

  test('back button navigates to employees page', async ({ page }) => {
    await page.locator('button.close-btn').click();
    await expect(page).toHaveURL(/employees/, { timeout: 10000 });
  });

  // ── On Leave employee ─────────────────────────────────────────────────────

  test('On Leave status badge shown for leave employee', async ({ page }) => {
    await page.addInitScript((emp) => {
      localStorage.setItem('selectedEmployee', JSON.stringify(emp));
    }, mockEmployeeOnLeave);
    await page.goto('/employee-details');
    await page.waitForTimeout(500);
    await expect(page.locator('.status-badge')).toContainText('On Leave');
  });

  test('leave-status class applied for On Leave employee', async ({ page }) => {
    await page.addInitScript((emp) => {
      localStorage.setItem('selectedEmployee', JSON.stringify(emp));
    }, mockEmployeeOnLeave);
    await page.goto('/employee-details');
    await page.waitForTimeout(500);
    await expect(page.locator('.status-badge.leave-status')).toBeVisible({ timeout: 10000 });
  });

  test('Needs Improvement label shown for 68% performance', async ({ page }) => {
    await page.addInitScript((emp) => {
      localStorage.setItem('selectedEmployee', JSON.stringify(emp));
    }, mockEmployeeOnLeave);
    await page.goto('/employee-details');
    await page.waitForTimeout(500);
    await expect(page.getByText('Needs Improvement')).toBeVisible({ timeout: 10000 });
  });

  // ── No employee data (edge case) ──────────────────────────────────────────

  test('page loads without crash when no employee in localStorage', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'employee-token');
      localStorage.removeItem('selectedEmployee');
    });
    await page.goto('/employee-details');
    await page.waitForTimeout(500);
    // Page should render without JS crash
    await expect(page.locator('.employee-details-page')).toBeVisible({ timeout: 10000 });
  });

  // ── Mobile view ───────────────────────────────────────────────────────────

  test('employee details page renders on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/employee-details');
    await page.waitForTimeout(500);
    await expect(page.locator('.employee-details-page')).toBeVisible({ timeout: 10000 });
  });

  test('employee name visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/employee-details');
    await page.waitForTimeout(500);
    await expect(page.locator('.profile-section h1').filter({ hasText: 'Tamilmani' })).toBeVisible({ timeout: 10000 });
  });

  test('back button works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/employee-details');
    await page.waitForTimeout(500);
    await page.locator('button.close-btn').click();
    await expect(page).toHaveURL(/employees/, { timeout: 10000 });
  });

});
