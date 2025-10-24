# Testing

This project uses a comprehensive testing setup with both unit tests (Vitest) and end-to-end tests (Playwright).

## Test Structure

- `tests/e2e/` - End-to-end tests using Playwright
- `src/**/*.test.ts` - Unit tests using Vitest (co-located with source files)

## Running Tests

### Unit Tests (Vitest)

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### End-to-End Tests (Playwright)

```bash
# Install Playwright browsers (first time only)
npm run playwright:install

# Run e2e tests
npm run test:e2e

# Run e2e tests with UI
npm run test:e2e:ui

# Run accessibility tests specifically
npm run test:accessibility

# Run all tests (unit + e2e)
npm run test:all
```

## Test Categories

### Unit Tests

- Business logic functions (utils)
- Component behavior
- Data transformations

### E2E Tests

- **Homepage Tests**: Navigation, hero section, responsiveness
- **Accessibility Tests**: WCAG compliance, keyboard navigation, color contrast
- **Navigation Tests**: Menu functionality, routing

### Accessibility Testing

Our accessibility tests check for:

- WCAG 2.1 AA color contrast compliance
- Keyboard navigation support
- Proper focus indicators
- Form accessibility
- Image alt text
- Heading structure
- Screen reader compatibility

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { formatTime, isBusinessOpen } from '~/utils/utils';

describe('Business Utils', () => {
  it('should format time correctly', () => {
    expect(formatTime('14:30')).toBe('2:30 PM');
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
});
```

## CI/CD Integration

Tests are configured to run in CI environments with:

- Retry logic for flaky tests
- Parallel execution
- Screenshot capture on failures
- Cross-browser testing

## Debugging Tests

### Playwright Debugging

```bash
# Run tests in debug mode
npx playwright test --debug

# Run tests with headed browsers
npx playwright test --headed

# Generate test report
npx playwright show-report
```

### Vitest Debugging

```bash
# Run specific test file
npx vitest src/utils/utils.test.ts

# Run tests with reporter
npx vitest --reporter=verbose
```
