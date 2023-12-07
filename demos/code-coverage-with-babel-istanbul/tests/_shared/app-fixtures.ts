import { test as baseTest } from '@playwright/test';
import {
  collectV8CodeCoverageAsync,
  collectV8CodeCoverageOptions,
} from 'tests/_shared/fixtures/v8-code-coverage';

export { expect } from '@playwright/test';

// See https://playwright.dev/docs/test-fixtures and https://playwright.dev/docs/test-parameterize

interface AppFixtures {
  codeCoverageAutoTestFixture: void;
}

export const test = baseTest.extend<AppFixtures>({
  codeCoverageAutoTestFixture: [
    async ({ browser, page }, use): Promise<void> => {
      const options: collectV8CodeCoverageOptions = {
        browserType: browser.browserType(),
        page: page,
        use: use,
        enableJsCoverage: true,
        enableCssCoverage: true,
      };
      await collectV8CodeCoverageAsync(options);
    },
    {
      auto: true,
    },
  ],
});