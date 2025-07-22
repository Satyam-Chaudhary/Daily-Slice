import { defineConfig, devices } from '@playwright/test';

// Define the base URL for your local dev server
const baseURL = 'http://localhost:3000';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: baseURL, // Use the base URL in all tests
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  // This is the crucial part: configure the web server
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    timeout: 120 * 1000, // 2 minutes to start up
    reuseExistingServer: !process.env.CI,
  },
});