# CRMS Testing Architecture

## Testing Strategy Overview

The CRMS testing architecture follows a comprehensive pyramid approach ensuring code quality, reliability, and confidence in deployments. Our testing strategy emphasizes automated testing at all levels with particular focus on critical business flows.

### Test Pyramid Structure

```
            /\
           /E2E\         5%  - Critical user journeys
          /------\
         /Integr. \     20%  - API & component integration  
        /----------\
       /    Unit    \   75%  - Business logic & utilities
      /--------------\
```

## Testing Stack & Tools

### Core Testing Framework
```json
{
  "dependencies": {
    "vitest": "1.2+",
    "jsdom": "24+",
    "@testing-library/react": "14+",
    "@testing-library/jest-dom": "6+",
    "@testing-library/user-event": "14+",
    "playwright": "1.41+",
    "msw": "2.0+",
    "@faker-js/faker": "8+",
    "factory-bot": "1.0+"
  }
}
```

### Testing Configuration

#### Vitest Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: [
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'tests/unit/**/*.{test,spec}.{js,ts,tsx}',
      'tests/integration/**/*.{test,spec}.{js,ts,tsx}'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        'src/types/'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        },
        // Critical business logic must have higher coverage
        'src/lib/business/**': {
          branches: 95,
          functions: 95,
          lines: 95,
          statements: 95
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@tests': resolve(__dirname, './tests')
    }
  }
});
```

#### Test Setup
```typescript
// tests/setup.ts
import '@testing-library/jest-dom';
import { expect, afterEach, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Start MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset any request handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());

// Extend expect with custom matchers
expect.extend({
  toBeSwissPhoneNumber: (received: string) => {
    const swissPhoneRegex = /^\+41[0-9\s]{9,}$/;
    const pass = swissPhoneRegex.test(received);
    
    return {
      pass,
      message: () => 
        pass 
          ? `Expected ${received} not to be a valid Swiss phone number`
          : `Expected ${received} to be a valid Swiss phone number`
    };
  },
  
  toBeValidCHF: (received: number) => {
    const pass = Number.isFinite(received) && received >= 0;
    
    return {
      pass,
      message: () =>
        pass
          ? `Expected ${received} not to be a valid CHF amount`
          : `Expected ${received} to be a valid CHF amount (positive number)`
    };
  }
});
```

## Unit Testing

### Business Logic Testing
```typescript
// tests/unit/lib/business/contract-calculator.test.ts
import { describe, it, expect } from 'vitest';
import { ContractCalculator } from '@/lib/business/contract-calculator';
import { contractFactory, vehicleFactory } from '@tests/factories';

describe('ContractCalculator', () => {
  const calculator = new ContractCalculator();

  describe('calculateTotal', () => {
    it('should calculate correct total for daily rental', () => {
      const vehicle = vehicleFactory.build({ daily_rate: 89.00 });
      const contract = contractFactory.build({
        vehicle,
        total_days: 3,
        rate_type: 'daily'
      });

      const result = calculator.calculateTotal(contract);

      expect(result.subtotal).toBe(267.00);
      expect(result.vat_amount).toBe(20.56); // 7.7%
      expect(result.total_amount).toBe(287.56);
    });

    it('should apply weekly discount correctly', () => {
      const vehicle = vehicleFactory.build({
        daily_rate: 89.00,
        weekly_rate: 500.00
      });
      const contract = contractFactory.build({
        vehicle,
        total_days: 7,
        rate_type: 'weekly'
      });

      const result = calculator.calculateTotal(contract);

      expect(result.subtotal).toBe(500.00);
      expect(result.savings).toBe(123.00); // vs daily rate
    });

    it('should handle extra kilometers', () => {
      const contract = contractFactory.build({
        km_included: 200,
        extra_km_rate: 0.25,
        pickup_km: 15000,
        return_km: 15350 // 350km driven, 150km extra
      });

      const result = calculator.calculateExtraCharges(contract);

      expect(result.extra_km).toBe(150);
      expect(result.extra_km_charge).toBe(37.50);
    });

    it('should calculate fuel charges for Swiss prices', () => {
      const contract = contractFactory.build({
        pickup_fuel: 80,
        return_fuel: 20,
        vehicle: vehicleFactory.build({ fuel_capacity: 50 })
      });

      const result = calculator.calculateFuelCharges(contract, 1.65); // CHF per liter

      expect(result.fuel_difference).toBe(60); // 60% less fuel
      expect(result.fuel_charge).toBeValidCHF();
      expect(result.fuel_charge).toBe(49.50); // 30L * 1.65
    });
  });

  describe('edge cases', () => {
    it('should handle zero-day rentals gracefully', () => {
      const contract = contractFactory.build({ total_days: 0 });

      expect(() => calculator.calculateTotal(contract))
        .toThrow('Rental duration must be at least 1 day');
    });

    it('should handle negative fuel levels', () => {
      const contract = contractFactory.build({
        pickup_fuel: -10,
        return_fuel: 50
      });

      expect(() => calculator.calculateFuelCharges(contract))
        .toThrow('Invalid fuel levels');
    });
  });
});
```

### Utility Function Testing
```typescript
// tests/unit/lib/utils/swiss.test.ts
import { describe, it, expect } from 'vitest';
import {
  formatSwissPhone,
  validateSwissVAT,
  formatCHF,
  generateQRReference
} from '@/lib/utils/swiss';

describe('Swiss utilities', () => {
  describe('formatSwissPhone', () => {
    it('should format Swiss mobile numbers correctly', () => {
      expect(formatSwissPhone('0791234567')).toBe('+41 79 123 45 67');
      expect(formatSwissPhone('+41791234567')).toBe('+41 79 123 45 67');
    });

    it('should handle landline numbers', () => {
      expect(formatSwissPhone('0441234567')).toBe('+41 44 123 45 67');
    });

    it('should reject invalid numbers', () => {
      expect(() => formatSwissPhone('123')).toThrow('Invalid Swiss phone number');
    });
  });

  describe('validateSwissVAT', () => {
    it('should validate correct CHE format', () => {
      expect(validateSwissVAT('CHE-123.456.789')).toBe(true);
      expect(validateSwissVAT('CHE-123456789')).toBe(true);
    });

    it('should reject invalid formats', () => {
      expect(validateSwissVAT('DE123456789')).toBe(false);
      expect(validateSwissVAT('CHE-12345678')).toBe(false);
    });
  });

  describe('formatCHF', () => {
    it('should format Swiss currency correctly', () => {
      expect(formatCHF(1234.56)).toBe('CHF 1\'234.56');
      expect(formatCHF(1000000.00)).toBe('CHF 1\'000\'000.00');
    });

    it('should handle zero and negative amounts', () => {
      expect(formatCHF(0)).toBe('CHF 0.00');
      expect(formatCHF(-500.25)).toBe('CHF -500.25');
    });
  });

  describe('generateQRReference', () => {
    it('should generate valid ISO 11649 reference', () => {
      const ref = generateQRReference('payment-123');
      
      expect(ref).toMatch(/^RF\d{2}\d+$/);
      expect(ref.length).toBeLessThanOrEqual(25);
    });

    it('should generate unique references', () => {
      const ref1 = generateQRReference('payment-123');
      const ref2 = generateQRReference('payment-124');
      
      expect(ref1).not.toBe(ref2);
    });
  });
});
```

## Component Testing

### Form Component Testing
```typescript
// tests/unit/components/forms/ContractForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContractForm } from '@/components/forms/ContractForm';
import { customerFactory, vehicleFactory } from '@tests/factories';

const mockProps = {
  customers: [customerFactory.build()],
  vehicles: [vehicleFactory.build()],
  onSubmit: vi.fn(),
  onCancel: vi.fn()
};

describe('ContractForm', () => {
  it('should render all required fields', () => {
    render(<ContractForm {...mockProps} />);

    expect(screen.getByLabelText(/customer/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/vehicle/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pickup km/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pickup fuel/i)).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();
    render(<ContractForm {...mockProps} />);

    const submitButton = screen.getByRole('button', { name: /create contract/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/customer is required/i)).toBeInTheDocument();
      expect(screen.getByText(/vehicle is required/i)).toBeInTheDocument();
    });

    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it('should validate date range', async () => {
    const user = userEvent.setup();
    render(<ContractForm {...mockProps} />);

    const startDate = screen.getByLabelText(/start date/i);
    const endDate = screen.getByLabelText(/end date/i);

    await user.type(startDate, '2025-08-15');
    await user.type(endDate, '2025-08-10'); // End before start

    await user.click(screen.getByRole('button', { name: /create contract/i }));

    await waitFor(() => {
      expect(screen.getByText(/end date must be after start date/i)).toBeInTheDocument();
    });
  });

  it('should calculate total automatically', async () => {
    const user = userEvent.setup();
    const vehicle = vehicleFactory.build({ daily_rate: 89.00 });
    
    render(<ContractForm {...mockProps} vehicles={[vehicle]} />);

    // Fill form
    await user.selectOptions(screen.getByLabelText(/vehicle/i), vehicle.id);
    await user.type(screen.getByLabelText(/start date/i), '2025-08-10');
    await user.type(screen.getByLabelText(/end date/i), '2025-08-13'); // 3 days

    await waitFor(() => {
      expect(screen.getByText(/CHF 267.00/i)).toBeInTheDocument(); // 3 * 89
      expect(screen.getByText(/CHF 287.56/i)).toBeInTheDocument(); // With 7.7% VAT
    });
  });

  it('should handle form submission', async () => {
    const user = userEvent.setup();
    const customer = customerFactory.build();
    const vehicle = vehicleFactory.build();

    render(<ContractForm {...mockProps} customers={[customer]} vehicles={[vehicle]} />);

    // Fill all required fields
    await user.selectOptions(screen.getByLabelText(/customer/i), customer.id);
    await user.selectOptions(screen.getByLabelText(/vehicle/i), vehicle.id);
    await user.type(screen.getByLabelText(/start date/i), '2025-08-10');
    await user.type(screen.getByLabelText(/end date/i), '2025-08-13');
    await user.type(screen.getByLabelText(/pickup km/i), '15000');
    await user.type(screen.getByLabelText(/pickup fuel/i), '80');

    await user.click(screen.getByRole('button', { name: /create contract/i }));

    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        customer_id: customer.id,
        vehicle_id: vehicle.id,
        start_date: expect.any(Date),
        end_date: expect.any(Date),
        pickup_km: 15000,
        pickup_fuel: 80,
        // ... other calculated fields
      });
    });
  });
});
```

### Dashboard Component Testing
```typescript
// tests/unit/components/dashboard/RevenueChart.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { useQuery } from '@tanstack/react-query';

vi.mock('@tanstack/react-query');

const mockRevenueData = [
  { date: '2025-08-01', revenue: 1250.00 },
  { date: '2025-08-02', revenue: 890.50 },
  { date: '2025-08-03', revenue: 2100.75 }
];

describe('RevenueChart', () => {
  it('should display loading state', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    } as any);

    render(<RevenueChart period="week" />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should display error state', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to fetch data')
    } as any);

    render(<RevenueChart period="week" />);

    expect(screen.getByText(/error loading revenue data/i)).toBeInTheDocument();
  });

  it('should render chart with data', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: mockRevenueData,
      isLoading: false,
      error: null
    } as any);

    render(<RevenueChart period="week" />);

    expect(screen.getByText(/revenue chart/i)).toBeInTheDocument();
    expect(screen.getByText(/CHF 4'241.25/i)).toBeInTheDocument(); // Total
  });
});
```

## Integration Testing

### API Route Testing
```typescript
// tests/integration/api/contracts.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createMocks } from 'node-mocks-http';
import { POST } from '@/app/api/contracts/route';
import { createTestDatabase, cleanupTestDatabase } from '@tests/helpers/database';
import { createTestUser, createTestCompany } from '@tests/helpers/auth';

describe('/api/contracts', () => {
  let testDb: any;
  let testUser: any;
  let testCompany: any;

  beforeEach(async () => {
    testDb = await createTestDatabase();
    testCompany = await createTestCompany(testDb);
    testUser = await createTestUser(testDb, testCompany.id);
  });

  afterEach(async () => {
    await cleanupTestDatabase(testDb);
  });

  describe('POST /api/contracts', () => {
    it('should create a new contract successfully', async () => {
      const contractData = {
        customer_id: 'customer-123',
        vehicle_id: 'vehicle-123',
        start_date: '2025-08-10T10:00:00Z',
        end_date: '2025-08-15T10:00:00Z',
        pickup_km: 15000,
        pickup_fuel: 80,
        rate_type: 'daily',
        base_rate: 89.00,
        deposit_amount: 500.00
      };

      const { req, res } = createMocks({
        method: 'POST',
        body: contractData,
        headers: {
          'authorization': `Bearer ${testUser.access_token}`,
          'content-type': 'application/json'
        }
      });

      await POST(req as any);

      expect(res._getStatusCode()).toBe(201);
      
      const response = JSON.parse(res._getData());
      expect(response.success).toBe(true);
      expect(response.data.contract_number).toMatch(/^[A-Z]+-2025-\d{5}$/);
      expect(response.data.total_amount).toBeValidCHF();
    });

    it('should validate required fields', async () => {
      const invalidData = {
        customer_id: 'customer-123',
        // Missing required fields
      };

      const { req, res } = createMocks({
        method: 'POST',
        body: invalidData,
        headers: {
          'authorization': `Bearer ${testUser.access_token}`,
        }
      });

      await POST(req as any);

      expect(res._getStatusCode()).toBe(422);
      
      const response = JSON.parse(res._getData());
      expect(response.success).toBe(false);
      expect(response.error.code).toBe('VALIDATION_ERROR');
    });

    it('should enforce company isolation', async () => {
      const otherCompanyUser = await createTestUser(testDb, 'other-company-id');
      
      const contractData = {
        customer_id: 'customer-123',
        vehicle_id: 'vehicle-123',
        start_date: '2025-08-10T10:00:00Z',
        end_date: '2025-08-15T10:00:00Z',
        pickup_km: 15000,
        pickup_fuel: 80
      };

      const { req, res } = createMocks({
        method: 'POST',
        body: contractData,
        headers: {
          'authorization': `Bearer ${otherCompanyUser.access_token}`,
        }
      });

      await POST(req as any);

      expect(res._getStatusCode()).toBe(404); // Customer/vehicle not found due to RLS
    });
  });
});
```

### Database Integration Testing
```typescript
// tests/integration/database/contract-queries.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTestSupabaseClient } from '@tests/helpers/supabase';
import { contractFactory, customerFactory, vehicleFactory } from '@tests/factories';

describe('Contract Database Operations', () => {
  let supabase: any;
  let testCompanyId: string;

  beforeAll(async () => {
    supabase = createTestSupabaseClient();
    testCompanyId = 'test-company-123';
  });

  afterAll(async () => {
    // Cleanup test data
    await supabase
      .from('contracts')
      .delete()
      .eq('company_id', testCompanyId);
  });

  it('should enforce row level security', async () => {
    // Create contract with different company_id
    const otherCompanyContract = contractFactory.build({
      company_id: 'other-company'
    });

    await supabase
      .from('contracts')
      .insert(otherCompanyContract);

    // Try to fetch with different company context
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('company_id', testCompanyId);

    expect(error).toBeNull();
    expect(data).toHaveLength(0); // Should not see other company's data
  });

  it('should automatically generate contract numbers', async () => {
    const contract = contractFactory.build({
      company_id: testCompanyId,
      contract_number: undefined // Should be auto-generated
    });

    const { data, error } = await supabase
      .from('contracts')
      .insert(contract)
      .select()
      .single();

    expect(error).toBeNull();
    expect(data.contract_number).toMatch(/^[A-Z]+-2025-\d{5}$/);
  });

  it('should validate contract constraints', async () => {
    const invalidContract = contractFactory.build({
      company_id: testCompanyId,
      start_date: '2025-08-15T10:00:00Z',
      end_date: '2025-08-10T10:00:00Z' // End before start
    });

    const { error } = await supabase
      .from('contracts')
      .insert(invalidContract);

    expect(error).toBeTruthy();
    expect(error.code).toBe('23514'); // Check constraint violation
  });
});
```

## End-to-End Testing

### Playwright Configuration
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
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
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Critical User Journey Tests
```typescript
// tests/e2e/contract-creation.spec.ts
import { test, expect } from '@playwright/test';
import { loginAsStaff } from './helpers/auth';
import { createTestCustomer, createTestVehicle } from './helpers/setup';

test.describe('Contract Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStaff(page);
    await createTestCustomer(page);
    await createTestVehicle(page);
  });

  test('should create contract in under 2 minutes', async ({ page }) => {
    const startTime = Date.now();

    // Navigate to quick create
    await page.goto('/contracts/quick-create');

    // Fill customer information
    await page.fill('[data-testid="customer-first-name"]', 'Maria');
    await page.fill('[data-testid="customer-last-name"]', 'Garcia');
    await page.fill('[data-testid="customer-phone"]', '+41 78 123 45 67');
    await page.fill('[data-testid="customer-id-number"]', 'ESP123456789');
    await page.fill('[data-testid="driver-license"]', 'ESP987654321');
    await page.fill('[data-testid="license-expiry"]', '2028-12-31');

    // Select vehicle
    await page.selectOption('[data-testid="vehicle-select"]', 'vehicle-123');

    // Set rental period
    await page.fill('[data-testid="start-date"]', '2025-08-10');
    await page.fill('[data-testid="end-date"]', '2025-08-13');

    // Fill vehicle condition
    await page.fill('[data-testid="pickup-km"]', '15000');
    await page.selectOption('[data-testid="pickup-fuel"]', '80');

    // Upload photos
    await page.setInputFiles(
      '[data-testid="photo-upload"]',
      ['tests/fixtures/vehicle-front.jpg', 'tests/fixtures/vehicle-rear.jpg']
    );

    // Select payment method
    await page.click('[data-testid="payment-card"]');

    // Review and confirm
    await page.click('[data-testid="review-button"]');
    
    // Verify calculated amounts
    await expect(page.locator('[data-testid="subtotal"]')).toContainText('CHF 267.00');
    await expect(page.locator('[data-testid="total"]')).toContainText('CHF 287.56');

    // Sign contract
    await page.locator('[data-testid="signature-pad"]').click({ position: { x: 100, y: 50 } });
    await page.locator('[data-testid="signature-pad"]').mouse.move(150, 80);

    // Complete contract
    await page.click('[data-testid="complete-contract"]');

    // Verify success
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="contract-number"]')).toContainText(/CR-2025-\d{5}/);

    const totalTime = Date.now() - startTime;
    expect(totalTime).toBeLessThan(120000); // 2 minutes = 120,000ms
  });

  test('should handle payment processing', async ({ page }) => {
    // ... setup contract creation

    // Process payment
    await page.click('[data-testid="pay-now"]');

    // Wait for Stripe iframe
    const stripeFrame = page.frameLocator('[name^="__privateStripeFrame"]');
    
    // Fill card details
    await stripeFrame.fill('[placeholder="Card number"]', '4242424242424242');
    await stripeFrame.fill('[placeholder="MM / YY"]', '12/25');
    await stripeFrame.fill('[placeholder="CVC"]', '123');

    // Submit payment
    await page.click('[data-testid="submit-payment"]');

    // Verify payment success
    await expect(page.locator('[data-testid="payment-success"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="contract-status"]')).toContainText('Confirmed');
  });

  test('should validate Swiss-specific requirements', async ({ page }) => {
    await page.goto('/contracts/quick-create');

    // Test Swiss phone number validation
    await page.fill('[data-testid="customer-phone"]', '123456789');
    await page.blur('[data-testid="customer-phone"]');
    
    await expect(page.locator('[data-testid="phone-error"]'))
      .toContainText('Invalid Swiss phone number format');

    // Correct the phone number
    await page.fill('[data-testid="customer-phone"]', '+41 79 123 45 67');
    
    await expect(page.locator('[data-testid="phone-error"]')).not.toBeVisible();
  });
});
```

### Performance Testing
```typescript
// tests/e2e/performance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should meet Core Web Vitals thresholds', async ({ page }) => {
    // Start performance monitoring
    await page.goto('/dashboard');

    // Wait for page load
    await page.waitForLoadState('networkidle');

    // Measure performance
    const performance = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      return {
        lcp: navigation.loadEventStart - navigation.fetchStart,
        fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        cls: 0, // Would need layout shift observer
        fid: 0  // Would need interaction observer
      };
    });

    // Assert Core Web Vitals
    expect(performance.lcp).toBeLessThan(2500); // LCP < 2.5s
    expect(performance.fcp).toBeLessThan(1800); // FCP < 1.8s
  });

  test('should handle large datasets efficiently', async ({ page }) => {
    // Create test data
    await page.goto('/contracts');
    
    // Load large contract list
    await page.selectOption('[data-testid="items-per-page"]', '100');
    
    const startTime = Date.now();
    await page.waitForSelector('[data-testid="contracts-table"]');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
    
    // Test scroll performance
    await page.evaluate(() => {
      const table = document.querySelector('[data-testid="contracts-table"]');
      table?.scrollTo(0, table.scrollHeight);
    });
    
    // Verify no layout thrashing
    await page.waitForTimeout(100);
    await expect(page.locator('[data-testid="loading-spinner"]')).not.toBeVisible();
  });
});
```

## Test Data & Factories

### Test Factories
```typescript
// tests/factories/index.ts
import { Factory } from 'factory-bot';
import { faker } from '@faker-js/faker/locale/de_CH'; // Swiss German locale

// Customer factory
Factory.define('customer', () => ({
  id: faker.string.uuid(),
  company_id: 'test-company',
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  date_of_birth: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }),
  email: faker.internet.email(),
  phone: `+41 ${faker.helpers.fromRegExp(/[0-9]{2} [0-9]{3} [0-9]{2} [0-9]{2}/)}`,
  address: faker.location.streetAddress(),
  city: faker.helpers.arrayElement(['Zurich', 'Basel', 'Geneva', 'Bern', 'Lausanne']),
  postal_code: faker.location.zipCode(),
  country: 'CH',
  id_type: faker.helpers.arrayElement(['passport', 'swiss_id', 'residence_permit']),
  id_number: faker.helpers.fromRegExp(/CH[0-9]{10}/),
  driver_license_number: faker.helpers.fromRegExp(/CH[0-9]{8}/),
  driver_license_expiry: faker.date.future({ years: 5 }),
  driver_license_category: 'B',
  is_blacklisted: false,
  verified: true,
  created_at: faker.date.recent(),
  updated_at: faker.date.recent()
}));

// Vehicle factory
Factory.define('vehicle', () => ({
  id: faker.string.uuid(),
  company_id: 'test-company',
  license_plate: `ZH-${faker.number.int({ min: 100000, max: 999999 })}`,
  vin: faker.vehicle.vin(),
  make: faker.vehicle.manufacturer(),
  model: faker.vehicle.model(),
  year: faker.number.int({ min: 2020, max: 2024 }),
  color: faker.vehicle.color(),
  vehicle_type: faker.helpers.arrayElement(['economy', 'compact', 'sedan', 'suv']),
  transmission: faker.helpers.arrayElement(['manual', 'automatic']),
  fuel_type: faker.helpers.arrayElement(['petrol', 'diesel', 'hybrid']),
  seats: faker.number.int({ min: 2, max: 7 }),
  daily_rate: faker.number.float({ min: 50, max: 200, precision: 0.05 }),
  weekly_rate: faker.number.float({ min: 300, max: 1200, precision: 0.05 }),
  monthly_rate: faker.number.float({ min: 1000, max: 4000, precision: 0.05 }),
  deposit_amount: faker.number.float({ min: 200, max: 1000, precision: 0.05 }),
  status: 'available',
  current_km: faker.number.int({ min: 0, max: 200000 }),
  fuel_level: faker.number.int({ min: 10, max: 100 }),
  fuel_capacity: faker.number.int({ min: 40, max: 80 }),
  features: faker.helpers.arrayElements(['GPS', 'Bluetooth', 'Air Conditioning', 'Heated Seats']),
  is_active: true,
  created_at: faker.date.recent(),
  updated_at: faker.date.recent()
}));

// Contract factory
Factory.define('contract', () => {
  const startDate = faker.date.future();
  const endDate = new Date(startDate.getTime() + (3 * 24 * 60 * 60 * 1000)); // 3 days later
  const baseRate = faker.number.float({ min: 50, max: 200, precision: 0.05 });
  const totalDays = 3;
  const subtotal = baseRate * totalDays;
  const vatAmount = subtotal * 0.077;
  const totalAmount = subtotal + vatAmount;

  return {
    id: faker.string.uuid(),
    company_id: 'test-company',
    contract_number: `CR-2025-${faker.string.numeric(5)}`,
    customer_id: Factory.build('customer').id,
    vehicle_id: Factory.build('vehicle').id,
    created_by: faker.string.uuid(),
    start_date: startDate,
    end_date: endDate,
    pickup_km: faker.number.int({ min: 0, max: 200000 }),
    pickup_fuel: faker.number.int({ min: 20, max: 100 }),
    return_km: null,
    return_fuel: null,
    base_rate: baseRate,
    rate_type: 'daily',
    total_days: totalDays,
    km_included: 200,
    extra_km_rate: 0.25,
    subtotal,
    vat_rate: 7.7,
    vat_amount: vatAmount,
    total_amount: totalAmount,
    deposit_amount: faker.number.float({ min: 200, max: 1000, precision: 0.05 }),
    deposit_status: 'pending',
    payment_status: 'pending',
    status: 'draft',
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
    version: 1
  };
});

// Export factory functions
export const customerFactory = Factory.build('customer');
export const vehicleFactory = Factory.build('vehicle');
export const contractFactory = Factory.build('contract');
```

### Test Helpers
```typescript
// tests/helpers/database.ts
import { createClient } from '@supabase/supabase-js';

export async function createTestDatabase() {
  const supabase = createClient(
    process.env.TEST_SUPABASE_URL!,
    process.env.TEST_SUPABASE_ANON_KEY!
  );

  return supabase;
}

export async function cleanupTestDatabase(supabase: any) {
  // Clean up test data in reverse dependency order
  await supabase.from('contract_photos').delete().match({});
  await supabase.from('payments').delete().match({});
  await supabase.from('contracts').delete().match({});
  await supabase.from('reservations').delete().match({});
  await supabase.from('vehicles').delete().match({});
  await supabase.from('customers').delete().match({});
  await supabase.from('users').delete().match({});
  await supabase.from('companies').delete().match({});
}

export async function seedTestData(supabase: any) {
  const company = await supabase
    .from('companies')
    .insert(Factory.build('company'))
    .select()
    .single();

  const user = await supabase
    .from('users')
    .insert(Factory.build('user', { company_id: company.data.id }))
    .select()
    .single();

  return { company: company.data, user: user.data };
}
```

## Test Scripts & Commands

### Package.json Scripts
```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run --reporter=verbose tests/unit",
    "test:integration": "vitest run --reporter=verbose tests/integration",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest run --coverage",
    "test:ci": "npm run test:unit && npm run test:integration && npm run test:e2e",
    "test:smoke": "playwright test tests/e2e/smoke.spec.ts",
    "test:performance": "playwright test tests/e2e/performance.spec.ts"
  }
}
```

### CI/CD Integration
```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage
      
      - uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

**Document Version:** 3.0 - Testing Architecture
**Last Updated:** 2025-08-06
**Status:** Ready for Implementation