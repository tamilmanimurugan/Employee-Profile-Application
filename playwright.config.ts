import { defineConfig, devices } from '@playwright/test';

const baseURL =
  process.env['E2E_BASE_URL'] ??
  (process.env['CI']
    ? 'https://employeeprofileweb-f3f9a0a7hzd9f7cm.southindia-01.azurewebsites.net'
    : 'http://localhost:4200');

export default defineConfig({
  testDir: '.',
  testMatch: ['e2e/**/*.spec.ts'],
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
