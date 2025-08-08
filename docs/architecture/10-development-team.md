# CRMS Development & Team Architecture

## Development Standards & Guidelines

### Code Organization Standards

#### Directory Structure & Naming Conventions

```
src/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Route groups (lowercase with parentheses)
│   ├── (dashboard)/                  # Protected routes grouping
│   ├── api/                          # API routes
│   │   └── contracts/                # Resource-based API organization
│   │       ├── route.ts              # CRUD operations
│   │       ├── [id]/                 # Dynamic routes
│   │       │   ├── route.ts
│   │       │   └── photos/route.ts
│   │       └── quick-create/route.ts # Action-specific endpoints
│   └── globals.css
│
├── components/                       # React Components
│   ├── ui/                          # Base UI components (shadcn/ui)
│   │   ├── button.tsx               # PascalCase for components
│   │   ├── card.tsx
│   │   └── index.ts                 # Barrel exports
│   ├── forms/                       # Feature-specific components
│   │   ├── ContractForm.tsx
│   │   ├── CustomerForm.tsx
│   │   └── fields/                  # Sub-components
│   │       ├── DateRangePicker.tsx
│   │       └── SwissPhoneInput.tsx
│   ├── contracts/                   # Domain-specific components
│   │   ├── ContractCard.tsx
│   │   ├── ContractList.tsx
│   │   └── QuickCreateWizard.tsx
│   └── shared/                      # Shared/common components
│       ├── Layout/
│       ├── DataTable.tsx
│       └── StatusBadge.tsx
│
├── lib/                             # Utility libraries & helpers
│   ├── api/                         # API client functions
│   │   ├── contracts.ts             # Resource-based API clients
│   │   ├── customers.ts
│   │   └── base.ts                  # Common API utilities
│   ├── business/                    # Business logic & calculations
│   │   ├── contract-calculator.ts   # Domain-specific logic
│   │   ├── pricing-engine.ts
│   │   └── validation-rules.ts
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.ts               # Feature-specific hooks
│   │   ├── useContracts.ts
│   │   └── useLocalStorage.ts       # Utility hooks
│   ├── utils/                       # Pure utility functions
│   │   ├── date.ts                  # Category-based utilities
│   │   ├── money.ts
│   │   ├── swiss.ts                 # Market-specific utilities
│   │   └── validation.ts
│   ├── stores/                      # State management
│   │   ├── auth.store.ts            # Feature-based stores
│   │   ├── ui.store.ts
│   │   └── contract.store.ts
│   └── constants/                   # Application constants
│       ├── routes.ts                # Category-based constants
│       ├── permissions.ts
│       └── config.ts
│
├── types/                           # TypeScript type definitions
│   ├── database.types.ts            # Generated Supabase types
│   ├── api.types.ts                 # API request/response types
│   ├── app.types.ts                 # Application-specific types
│   └── swiss.types.ts               # Market-specific types
│
└── styles/                          # Styling files
    ├── globals.css                  # Global styles
    └── components.css               # Component-specific styles
```

#### File Naming Conventions

```typescript
// ✅ CORRECT Naming Patterns

// Components - PascalCase
ContractForm.tsx;
CustomerDetails.tsx;
SwissPhoneInput.tsx;

// Hooks - camelCase starting with 'use'
useAuth.ts;
useContracts.ts;
useDebounce.ts;

// Utilities - camelCase
formatCurrency.ts;
validateSwissPhone.ts;
calculateTax.ts;

// Types - PascalCase with descriptive suffix
Customer.types.ts;
Contract.types.ts;
ApiResponse.types.ts;

// Constants - SCREAMING_SNAKE_CASE or camelCase for objects
API_ENDPOINTS.ts;
defaultSettings.ts;

// Test files - match source file + .test/.spec
ContractForm.test.tsx;
useAuth.test.ts;
contract - calculator.spec.ts;

// ❌ INCORRECT Naming
contractform.tsx; // Should be PascalCase
use - auth.ts; // Should be camelCase
CONTRACT_FORM.tsx; // Components are not constants
customer.types.ts; // Should be PascalCase for types
```

#### Import/Export Standards

```typescript
// ✅ CORRECT Import Organization
// 1. External libraries (React, third-party)
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';

// 2. Internal absolute imports (@ alias)
import { useAuth } from '@/lib/hooks/useAuth';
import { ContractCalculator } from '@/lib/business/contract-calculator';
import { Customer, Contract } from '@/types/app.types';

// 3. Relative imports (same directory/close proximity)
import { validateContractDates } from './validation';
import { FormField } from '../FormField';

// ✅ CORRECT Export Patterns
// Named exports for utilities and hooks
export const formatCHF = (amount: number) => {
  /* */
};
export const useContracts = () => {
  /* */
};

// Default exports for React components
export default function ContractForm() {
  /* */
}

// Re-exports from index files (barrel exports)
export { ContractForm } from './ContractForm';
export { CustomerForm } from './CustomerForm';
export * from './fields';

// Type-only exports when appropriate
export type { Customer, Contract, Payment } from './types';
```

### Code Quality Standards

#### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "verbatimModuleSyntax": true
  },
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    // Code Quality
    'prefer-const': 'error',
    'no-var': 'error',
    'no-console': 'warn',

    // TypeScript Specific
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',

    // React Specific
    'react/prop-types': 'off', // Using TypeScript
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Swiss-specific business rules
    'crms/no-hardcoded-currency': 'error',
    'crms/require-swiss-phone-validation': 'error',
    'crms/no-sensitive-data-logging': 'error',
  },
  // Custom rules for Swiss compliance
  plugins: ['crms-custom-rules'],
};
```

#### Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

#### Code Documentation Standards

````typescript
/**
 * Calculates the total amount for a rental contract including VAT
 *
 * @param contract - The contract data to calculate for
 * @param vatRate - Swiss VAT rate (default: 7.7%)
 * @returns Calculated totals with breakdown
 *
 * @example
 * ```typescript
 * const totals = calculateContractTotal(contract, 7.7);
 * console.log(totals.totalAmount); // CHF 287.56
 * ```
 *
 * @throws {ValidationError} When contract data is invalid
 * @throws {BusinessRuleError} When business rules are violated
 */
export function calculateContractTotal(
  contract: ContractData,
  vatRate: number = 7.7,
): ContractTotals {
  // Implementation with inline comments for complex logic
  const subtotal = contract.baseRate * contract.totalDays;

  // Swiss VAT calculation - rate is percentage (7.7% = 7.7)
  const vatAmount = subtotal * (vatRate / 100);

  return {
    subtotal,
    vatAmount,
    totalAmount: subtotal + vatAmount,
    breakdown: {
      baseRate: contract.baseRate,
      days: contract.totalDays,
      vatRate,
    },
  };
}

// ✅ CORRECT: Component documentation
/**
 * Contract creation form with Swiss market validation
 *
 * Features:
 * - Real-time total calculation
 * - Swiss phone number validation
 * - CHF currency formatting
 * - Driver license validation
 *
 * @param customers - Available customers for selection
 * @param vehicles - Available vehicles for selection
 * @param onSubmit - Callback when form is successfully submitted
 * @param onCancel - Callback when form is cancelled
 */
export default function ContractForm({
  customers,
  vehicles,
  onSubmit,
  onCancel,
}: ContractFormProps): JSX.Element {
  // Component implementation
}
````

## Development Workflow

### Git Workflow & Branching Strategy

#### Branch Naming Convention

```bash
# Feature branches
feature/contract-quick-create
feature/swiss-qr-bill-generation
feature/customer-blacklist-management

# Bug fixes
fix/contract-calculation-rounding
fix/phone-validation-regex
hotfix/payment-processing-error

# Documentation
docs/api-documentation-update
docs/architecture-diagrams

# Maintenance
chore/dependency-updates
chore/eslint-config-update
refactor/contract-validation-logic

# Release branches
release/v1.2.0
release/v1.2.1-hotfix
```

#### Commit Message Standards

```bash
# ✅ CORRECT Commit Messages (Conventional Commits)
feat(contracts): add quick create workflow for 2-minute goal
fix(payments): resolve Swiss QR bill generation encoding issue
docs(api): update contract endpoint documentation
test(components): add comprehensive ContractForm test suite
refactor(validation): extract Swiss-specific validation rules
chore(deps): update Supabase client to v2.39.1

# Commit message structure
<type>(<scope>): <description>

[optional body]

[optional footer]

# Types: feat, fix, docs, style, refactor, test, chore, perf
# Scopes: contracts, customers, vehicles, payments, auth, ui, api, db
```

#### Pull Request Template

```markdown
## 📋 PR Description

Brief description of changes and why they were made.

## 🎯 Type of Change

- [ ] 🆕 New feature
- [ ] 🐛 Bug fix
- [ ] 📚 Documentation update
- [ ] 🔧 Refactoring
- [ ] ⚡ Performance improvement
- [ ] 🧪 Test additions/updates

## 🧪 Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed
- [ ] Swiss-specific validation tested

## 🔍 Swiss Compliance Checklist

- [ ] Data residency requirements met
- [ ] GDPR compliance maintained
- [ ] VAT calculations accurate (7.7%)
- [ ] Swiss phone/address formats validated
- [ ] Currency formatting correct (CHF)

## 📝 Documentation

- [ ] Code comments updated
- [ ] API documentation updated
- [ ] Architecture docs updated (if needed)
- [ ] README updated (if needed)

## 🔗 Related Issues

Closes #XXX Fixes #XXX Related to #XXX

## 📸 Screenshots (if UI changes)

[Add screenshots or GIFs demonstrating the changes]

## ✅ Pre-merge Checklist

- [ ] Branch is up to date with main
- [ ] All CI checks pass
- [ ] Code review completed
- [ ] No console.log statements
- [ ] No hardcoded secrets or keys
- [ ] Swiss market requirements validated
```

### Code Review Process

#### Review Guidelines

```typescript
// ✅ CORRECT: What reviewers should look for

// 1. Business Logic Accuracy
// Check Swiss-specific calculations
const vatAmount = subtotal * 0.077; // ✅ Correct Swiss VAT rate
const vatAmount = subtotal * 0.08; // ❌ Incorrect rate

// 2. Type Safety
// Prefer strict typing
interface Customer {
  phone: string; // ✅ Required field
}
interface Customer {
  phone?: string; // ❌ Should be required for Swiss customers
}

// 3. Error Handling
// Proper error handling with user-friendly messages
try {
  await createContract(data);
} catch (error) {
  if (error instanceof ValidationError) {
    toast.error('Please check your input and try again');
  } else {
    toast.error('An unexpected error occurred');
    logger.error('Contract creation failed', { error });
  }
}

// 4. Security Considerations
// No sensitive data in logs
logger.info('Contract created', {
  contractId: contract.id,
  // ❌ customerId: customer.id, - Don't log customer ID
  // ❌ amount: contract.total_amount, - Don't log financial data
});

// 5. Performance Considerations
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Complex rendering logic
});

// Use useMemo for expensive calculations
const totalRevenue = useMemo(() => {
  return contracts.reduce((sum, contract) => sum + contract.total_amount, 0);
}, [contracts]);
```

#### Review Checklist Template

```markdown
## Code Review Checklist

### 🔍 Code Quality

- [ ] Code follows established patterns and conventions
- [ ] TypeScript types are accurate and strict
- [ ] Error handling is comprehensive
- [ ] Performance considerations addressed
- [ ] No code duplication

### 🇨🇭 Swiss Market Compliance

- [ ] VAT rate is correct (7.7%)
- [ ] Phone numbers use Swiss format (+41)
- [ ] Currency formatting uses CHF
- [ ] Address formats support Swiss cantons
- [ ] Date/time handling considers Swiss timezone

### 🔒 Security & Privacy

- [ ] No sensitive data in logs
- [ ] Input validation is comprehensive
- [ ] Authentication/authorization correct
- [ ] GDPR compliance maintained
- [ ] No hardcoded secrets

### 🧪 Testing

- [ ] Unit tests added/updated
- [ ] Edge cases covered
- [ ] Swiss-specific scenarios tested
- [ ] Error cases tested

### 📋 Business Logic

- [ ] Contract calculations accurate
- [ ] Pricing logic correct
- [ ] Validation rules appropriate
- [ ] Workflow states handled properly

### 🎨 UI/UX (if applicable)

- [ ] Responsive design maintained
- [ ] Accessibility considerations
- [ ] Swiss UI patterns followed
- [ ] Error messages user-friendly
- [ ] Loading states handled
```

## Team Collaboration Patterns

### Team Structure & Roles

#### Development Team Roles

```yaml
# Team Structure
Product Owner:
  - Business requirements
  - Swiss market expertise
  - Feature prioritization
  - User acceptance testing

Tech Lead:
  - Architecture decisions
  - Code review oversight
  - Technical mentoring
  - Performance optimization

Senior Developers (2-3):
  - Feature development
  - Code reviews
  - Mentoring junior developers
  - Swiss compliance implementation

Mid-Level Developers (2-4):
  - Feature development
  - Bug fixes
  - Testing
  - Documentation

Junior Developers (1-2):
  - Bug fixes
  - Testing
  - Documentation
  - Learning Swiss market requirements

DevOps Engineer:
  - CI/CD pipeline
  - Infrastructure
  - Monitoring & alerting
  - Security implementation

QA Engineer:
  - Test planning
  - Manual testing
  - Test automation
  - Swiss compliance validation
```

#### Pair Programming Guidelines

```typescript
// Pair Programming Sessions - Recommended Pairings

// 1. Complex Business Logic (Driver + Navigator)
// Driver: Implements the logic
// Navigator: Reviews Swiss market requirements, catches edge cases
function calculateSwissVAT(amount: number, rate: number = 7.7): number {
  // Navigator checks: Is 7.7% still current Swiss VAT rate?
  // Navigator verifies: Are we handling Rappen (0.05 rounding) correctly?
  return Math.round(((amount * rate) / 100) * 20) / 20; // Swiss Rappen rounding
}

// 2. Critical Features (Senior + Junior)
// Knowledge transfer for Swiss market specifics
// Junior learns business domain while contributing

// 3. Bug Fixes (Cross-team pairing)
// Frontend + Backend developer for full-stack issues
// Helps avoid finger-pointing and improves understanding

// Session Structure:
// - 25-minute focused sessions (Pomodoro)
// - 5-minute breaks to discuss and switch roles
// - Clear objectives defined upfront
// - Both developers commit to shared branch
```

#### Knowledge Sharing Sessions

##### Weekly Tech Talks (30 minutes)

```markdown
# Tech Talk Schedule

Week 1: "Swiss Market Deep Dive"

- VAT rates and calculations
- Phone number formats and validation
- Address formats and postal codes
- Cultural considerations for UI/UX

Week 2: "Architecture Deep Dive"

- Supabase patterns and best practices
- Row Level Security implementation
- Real-time subscriptions
- Performance optimization techniques

Week 3: "Testing Strategies"

- Swiss-specific test scenarios
- E2E testing for critical workflows
- Performance testing methods
- Security testing approaches

Week 4: "Security & Compliance"

- GDPR implementation details
- Data anonymization strategies
- Audit logging best practices
- Swiss data protection requirements
```

##### Code Review Learning Sessions

```typescript
// Monthly "Code Review Retrospective" Sessions

// Example discussion topics:

// 1. Common Issues Found in Reviews
const commonIssues = {
  swissFormatting: [
    'Phone numbers not using +41 format',
    'Currency not showing CHF symbol',
    'VAT rate hardcoded incorrectly',
  ],
  typeScript: [
    'Using "any" type instead of proper interfaces',
    'Missing null checks for optional fields',
    'Not leveraging discriminated unions',
  ],
  performance: [
    'Missing React.memo on expensive components',
    'Unnecessary re-renders in forms',
    'Not using proper keys in lists',
  ],
};

// 2. Best Practices Discovered
const bestPractices = {
  businessLogic: 'Extract Swiss-specific calculations to separate utilities',
  errorHandling: 'Always provide user-friendly error messages in German/French',
  testing: 'Test Swiss edge cases (Rappen rounding, canton validation)',
  accessibility: 'Consider multilingual support for screen readers',
};
```

### Documentation Standards

#### API Documentation

```typescript
/**
 * @api {post} /api/contracts Create New Contract
 * @apiName CreateContract
 * @apiGroup Contracts
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new rental contract with Swiss market validation
 *
 * @apiHeader {String} Authorization Bearer JWT token
 * @apiHeader {String} Content-Type application/json
 *
 * @apiParam {String} customer_id UUID of the customer
 * @apiParam {String} vehicle_id UUID of the vehicle
 * @apiParam {String} start_date ISO 8601 date string
 * @apiParam {String} end_date ISO 8601 date string
 * @apiParam {Number} pickup_km Current vehicle kilometers
 * @apiParam {Number} pickup_fuel Fuel level percentage (0-100)
 * @apiParam {String="daily","weekly","monthly"} rate_type Pricing period
 * @apiParam {Number} base_rate Rate per period in CHF
 * @apiParam {Number} deposit_amount Security deposit in CHF
 *
 * @apiSuccess {Boolean} success Request success status
 * @apiSuccess {Object} data Response data
 * @apiSuccess {String} data.id Contract UUID
 * @apiSuccess {String} data.contract_number Generated contract number (e.g., "CR-2025-00001")
 * @apiSuccess {String} data.status Contract status ("draft", "confirmed", etc.)
 * @apiSuccess {Number} data.total_amount Total amount including 7.7% Swiss VAT
 * @apiSuccess {String} data.contract_pdf_url URL to generated PDF contract
 *
 * @apiError (400) ValidationError Invalid input data
 * @apiError (401) Unauthorized Missing or invalid JWT token
 * @apiError (403) Forbidden Insufficient permissions
 * @apiError (409) Conflict Vehicle not available for selected dates
 *
 * @apiExample {javascript} Request Example
 * const response = await fetch('/api/contracts', {
 *   method: 'POST',
 *   headers: {
 *     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
 *     'Content-Type': 'application/json'
 *   },
 *   body: JSON.stringify({
 *     customer_id: '123e4567-e89b-12d3-a456-426614174004',
 *     vehicle_id: '123e4567-e89b-12d3-a456-426614174006',
 *     start_date: '2025-08-10T10:00:00Z',
 *     end_date: '2025-08-15T10:00:00Z',
 *     pickup_km: 15000,
 *     pickup_fuel: 80,
 *     rate_type: 'daily',
 *     base_rate: 89.00,
 *     deposit_amount: 500.00
 *   })
 * });
 *
 * @apiSuccessExample {json} Success Response
 * HTTP/1.1 201 Created
 * {
 *   "success": true,
 *   "data": {
 *     "id": "123e4567-e89b-12d3-a456-426614174011",
 *     "contract_number": "CR-2025-00002",
 *     "status": "draft",
 *     "total_amount": 479.27,
 *     "contract_pdf_url": "https://storage.supabase.co/contracts/CR-2025-00002.pdf"
 *   }
 * }
 */
```

#### Component Documentation

````typescript
// README.md for component directories
# Contract Components

This directory contains all components related to contract management and creation.

## Components Overview

### `ContractForm.tsx`
Main contract creation and editing form with Swiss market validation.

**Features:**
- Real-time total calculation with Swiss VAT (7.7%)
- Swiss phone number format validation
- Driver license validation for Swiss/EU licenses
- CHF currency formatting with Rappen precision
- Date validation preventing past dates

**Usage:**
```typescript
import { ContractForm } from '@/components/contracts/ContractForm';

<ContractForm
  customers={customers}
  vehicles={vehicles}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  initialData={existingContract} // Optional for editing
/>
````

### `QuickCreateWizard.tsx`

Streamlined contract creation for the 2-minute target workflow.

**Workflow Steps:**

1. Customer selection/creation
2. Vehicle selection with availability check
3. Rental period and pricing
4. Photo capture (pickup condition)
5. Payment method selection
6. Contract review and signature
7. Confirmation

### Swiss Market Considerations

All contract components handle:

- VAT rate: 7.7% (configurable per company)
- Currency: CHF with Rappen rounding (0.05 increments)
- Phone format: +41 XX XXX XX XX
- Date format: DD.MM.YYYY (Swiss standard)
- Language: German/French UI text support

````

#### Decision Records (ADR)
```markdown
# ADR-001: Swiss VAT Rate Handling

## Status
Accepted

## Context
Swiss VAT rate is currently 7.7% but may change. We need flexible handling while ensuring accuracy in financial calculations.

## Decision
- Store VAT rate in company settings (default: 7.7%)
- Use Dinero.js for precise currency calculations
- Round to Swiss Rappen precision (0.05)
- Log VAT rate changes in audit trail

## Consequences
✅ **Positive:**
- Flexible for future VAT changes
- Precise financial calculations
- Audit trail for compliance
- No floating point precision issues

❌ **Negative:**
- Slightly more complex than hardcoded rate
- Need to handle rate changes in historical data

## Implementation
```typescript
// Company settings include VAT rate
interface CompanySettings {
  vatRate: number; // 7.7 for Switzerland
  currency: 'CHF';
  // ... other settings
}

// Use Dinero.js for calculations
import { dinero, multiply, add } from 'dinero.js';
import { CHF } from '@dinero.js/currencies';

function calculateWithVAT(amount: number, vatRate: number) {
  const base = dinero({ amount: Math.round(amount * 100), currency: CHF });
  const vatAmount = multiply(base, { amount: vatRate, scale: 2 });
  return add(base, vatAmount);
}
````

## Alternatives Considered

1. Hardcode 7.7% - Rejected due to inflexibility
2. External tax API - Rejected as overkill for Swiss-only system
3. Configuration file - Rejected as less flexible than database storage

```

---

**Document Version:** 3.0 - Development & Team Architecture
**Last Updated:** 2025-08-06
**Status:** Ready for Implementation
```
