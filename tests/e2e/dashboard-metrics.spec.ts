import { expect, test } from '@playwright/test';

type Employee = {
  department?: string;
};

const adminEmail = process.env.E2E_ADMIN_EMAIL ?? 'admin@gmail.com';
const adminPassword = process.env.E2E_ADMIN_PASSWORD;
const apiBaseUrl =
  process.env.E2E_API_BASE_URL ??
  'https://employeeprofileapi-aag2cvghejagbhgp.southindia-01.azurewebsites.net/api';

async function login(page: import('@playwright/test').Page) {
  if (!adminPassword) {
    throw new Error('Set E2E_ADMIN_PASSWORD before running the e2e tests.');
  }

  await page.goto('/login');
  await page.getByPlaceholder('Enter email').fill(adminEmail);
  await page.getByPlaceholder('Enter password').fill(adminPassword);
  await page.locator('.login-btn').click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

async function getEmployees(request: import('@playwright/test').APIRequestContext) {
  const response = await request.get(`${apiBaseUrl}/employees`);
  expect(response.ok()).toBe(true);
  const employees = (await response.json()) as Employee[];
  expect(Array.isArray(employees)).toBe(true);
  return employees;
}

async function getMetricValue(page: import('@playwright/test').Page, label: string) {
  const card = page.locator('.stat-card').filter({ hasText: label });
  await expect(card).toBeVisible();
  return (await card.locator('h2').innerText()).trim();
}

test.describe('dashboard metrics', () => {
  test('total employees and departments match the Employee API', async ({ page, request }) => {
    const employees = await getEmployees(request);
    const expectedEmployeeCount = employees.length;
    const expectedDepartmentCount = new Set(
      employees.map(employee => employee.department?.trim()).filter(Boolean),
    ).size;

    await login(page);

    expect.soft(await getMetricValue(page, 'Total Employees')).toBe(String(expectedEmployeeCount));
    expect.soft(await getMetricValue(page, 'Departments')).toBe(String(expectedDepartmentCount));
  });

  test.skip('total projects matches the project API or employee project data', async () => {
    // Add this assertion once the API exposes a project count endpoint or employee project fields.
  });

  test.skip('attendance percentage matches the attendance API or employee attendance data', async () => {
    // Add this assertion once the API exposes attendance summary data.
  });
});
