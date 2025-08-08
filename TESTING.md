# Testing Infrastructure - Swiss Car Rental Management System

## Overview

This project implements a comprehensive testing infrastructure with multiple testing layers to
ensure code quality and prevent regressions.

## Testing Stack

### Unit Testing

- **Vitest 2.0+**: Fast unit testing framework with Vite integration
- **React Testing Library**: Component testing utilities
- **@testing-library/jest-dom**: DOM testing assertions
- **Happy DOM / JSDOM**: DOM environment for testing

### End-to-End Testing

- **Playwright 1.45+**: Cross-browser E2E testing
- **Multi-browser support**: Chromium, Firefox, WebKit
- **Mobile testing**: Responsive design validation
- **Visual regression testing**: UI consistency checks

### API Testing

- **Mock Service Worker (MSW)**: API request mocking
- **Custom API handlers**: Swiss-specific API testing
- **Request/response validation**: Type-safe API testing

### Test Data Generation

- **Faker.js**: Realistic test data generation
- **Factory functions**: Swiss-specific data factories
- **Customer factories**: Swiss addresses, phone numbers, licenses
- **Vehicle factories**: Swiss license plates, categories
- **Reservation factories**: Swiss locations, pricing (CHF)

## Coverage Requirements

- **Branches**: 70% minimum
- **Functions**: 70% minimum
- **Lines**: 80% minimum
- **Statements**: 80% minimum

## Commands

### Unit Testing

```bash
# Run all unit tests
pnpm test:unit

# Watch mode for development
pnpm test:unit:watch

# Interactive UI mode
pnpm test:unit:ui

# Generate coverage report
pnpm test:coverage
```

### End-to-End Testing

```bash
# Run all E2E tests
pnpm test:e2e

# Interactive UI mode
pnpm test:e2e:ui

# View test report
pnpm test:e2e:report

# Run specific browser
pnpm test:e2e --project=chromium
pnpm test:e2e --project=firefox
pnpm test:e2e --project=webkit
```

### Development

```bash
# Watch all tests
pnpm test:watch

# Run all tests (unit + integration)
pnpm test
```

## Project Structure

```
tests/
├── setup.ts                    # Test setup and configuration
├── mocks/
│   ├── server.ts               # MSW server setup
│   └── handlers.ts             # API request handlers
├── factories/
│   ├── customer.factory.ts     # Customer test data
│   ├── vehicle.factory.ts      # Vehicle test data
│   └── reservation.factory.ts  # Reservation test data
├── utils/
│   ├── test-utils.tsx          # React testing utilities
│   └── api-utils.ts            # API testing helpers
└── e2e/
    ├── home.spec.ts            # Homepage E2E tests
    └── **/*.spec.ts            # Additional E2E tests

packages/*/src/__tests__/        # Package-specific unit tests
```

## Configuration Files

### vitest.config.ts

- Global test configuration
- Coverage settings and thresholds
- Test environment setup (jsdom)
- Module path aliases

### playwright.config.ts

- Cross-browser configuration
- Test reporters (HTML, JSON, JUnit)
- Screenshots and video on failure
- Local dev server integration

## Swiss-Specific Features

### Data Factories

- **Addresses**: Real Swiss cities and postal codes
- **Phone Numbers**: +41 format with correct area codes
- **License Plates**: Swiss canton format (e.g., "ZH 123456")
- **Driving Licenses**: Swiss format (e.g., "CH-12345678")
- **Prices**: CHF currency formatting
- **Dates**: Swiss date format (dd.mm.yyyy)

### Localization Testing

- Swiss German/French/Italian support ready
- Currency formatting (CHF)
- Date formatting (Swiss format)
- Phone number validation (+41)

## Best Practices

### Unit Tests

- Test behavior, not implementation
- Use factories for test data
- Mock external dependencies
- Test error conditions
- Maintain high coverage

### E2E Tests

- Test critical user paths
- Use Page Object Model pattern
- Test on multiple browsers/devices
- Include accessibility testing
- Keep tests fast and reliable

### API Tests

- Mock all external APIs
- Test request/response formats
- Validate Swiss-specific data
- Test error scenarios
- Use type-safe assertions

## CI/CD Integration

All tests are configured to run in CI environments:

- **Parallelization**: Tests run in parallel where possible
- **Caching**: Turbo caches test results for faster builds
- **Reporting**: Multiple output formats (HTML, JSON, JUnit)
- **Screenshots**: Automatic capture on E2E failures
- **Coverage**: Automated coverage reporting

## Debugging

### Vitest

```bash
# Debug specific test file
pnpm test:unit customer.factory.test.ts

# Debug with UI
pnpm test:unit:ui
```

### Playwright

```bash
# Debug with UI
pnpm test:e2e:ui

# Debug specific test
pnpm test:e2e tests/e2e/home.spec.ts --debug

# Headed mode (see browser)
pnpm test:e2e --headed
```

## Future Enhancements

- [ ] Visual regression testing with Percy/Chromatic
- [ ] Performance testing with Lighthouse
- [ ] Database testing with test containers
- [ ] Load testing for API endpoints
- [ ] Accessibility testing automation (axe-core)
- [ ] Contract testing for API endpoints

## Troubleshooting

### Common Issues

1. **Playwright browser installation**: Run `npx playwright install`
2. **Coverage thresholds**: Adjust in `vitest.config.ts`
3. **Mock server conflicts**: Ensure MSW handlers don't conflict
4. **Path aliases**: Check `vitest.config.ts` resolve aliases

### Performance

- Use `vi.mock()` for expensive operations
- Parallel test execution where possible
- Efficient test data factories
- Clean up after tests (database, files)

---

_This testing infrastructure ensures high code quality and confident deployments for the Swiss Car
Rental Management System._
