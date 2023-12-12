import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { env } from 'playwright.env-vars';
import { testsDir, testsResultsDir } from 'playwright.shared-vars';

const _isRunningOnCI = env.CI;
const _webServerPort = 4200;
const _webServerHost = '127.0.0.1';
const _webServerUrl = `http://${_webServerHost}:${_webServerPort}`;

// See https://playwright.dev/docs/test-configuration.
export default defineConfig({
  testDir: testsDir,
  outputDir: testsResultsDir,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !_isRunningOnCI,
  /* Retry on CI only */
  retries: _isRunningOnCI ? 2 : 0,
  /*
   * The default config opts out of parallel tests on CI by doing 'workers: _isRunningOnCI ? 1 : undefined'
   * I don't know why we wouldn't run tests in parallel on CI so I'm setting 'workers: undefined' to always
   * run tests in parallel.
   */
  workers: undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    /* See https://playwright.dev/docs/test-reporters#html-reporter */
    [
      'html',
      {
        open: _isRunningOnCI ? 'never' : 'on-failure',
        outputFolder: path.resolve(testsDir, 'html-report'),
      }
    ]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: _webServerUrl,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  /* Run your local dev server before starting the tests */
  webServer: {
    command: `npx ng serve --host ${_webServerHost} --port ${_webServerPort} --watch false`,
    url: _webServerUrl,
    reuseExistingServer: !_isRunningOnCI,
    stdout: 'pipe',
    timeout: 5 * 60 * 1000, // 1 min
  },
});
