# CRMS Backend Architecture

## Storage Architecture

### Simplified Supabase-First Approach

The CRMS backend leverages Supabase's integrated platform to handle:
- **Authentication**: JWT-based auth with RLS
- **Database**: PostgreSQL with automated backups
- **File Storage**: Photos, PDFs, and documents
- **Real-time**: Live fleet status updates
- **Edge Functions**: Custom business logic

**Benefits:**
- Reduced infrastructure complexity
- Built-in security and compliance
- Swiss data residency (Zurich region)
- Automatic scaling and monitoring

## Data Models

### Core Data Models Overview

The system uses 8 core entities designed for multi-tenant SaaS with Swiss compliance requirements.

### 1. Companies (Multi-tenant isolation)
**Purpose:** Isolates data per rental company for SaaS multi-tenancy
**Key Attributes:**
- id: UUID - Unique identifier
- name: string - Company name
- subscription_tier: enum - Pricing tier (starter/professional/business)
- settings: JSON - Company-specific configuration

**TypeScript Interface:**
```typescript
interface Company {
  id: string;
  name: string;
  vat_number: string;
  address: string;
  city: string;
  postal_code: string;
  canton: string;
  phone: string;
  email: string;
  subscription_tier: 'starter' | 'professional' | 'business';
  subscription_status: 'active' | 'trial' | 'suspended';
  trial_ends_at: Date;
  created_at: Date;
  settings: {
    currency: 'CHF';
    vat_rate: number;
    default_fuel_price: number;
    km_price: number;
    contract_terms: string;
  };
}
```

### 2. Users (Staff and Owners)
**Purpose:** Staff access control with role-based permissions
**Key Features:**
- Multi-role support (owner, manager, staff, viewer)
- Granular permissions per role
- Activity tracking and audit trails

### 3. Customers (Rental customers)
**Purpose:** Customer registry with Swiss compliance
**Key Features:**
- Swiss ID validation
- Driver license verification
- GDPR-compliant data handling
- Blacklist management

### 4. Vehicles (Fleet inventory)
**Purpose:** Complete vehicle management
**Key Features:**
- Multi-vehicle type support
- Maintenance tracking
- Real-time availability status
- Rate management (daily/weekly/monthly)

### 5. Contracts (Core rental agreements)
**Purpose:** Central business entity for rentals
**Key Features:**
- Automated contract numbering
- Multi-status workflow
- Financial calculations
- Digital signatures

### 6. Contract Photos (Evidence documentation)
**Purpose:** Visual documentation for damage/condition
**Key Features:**
- Pickup/return photo comparison
- Damage annotation system
- Secure storage with RLS
- Thumbnail generation

### 7. Payments (Financial transactions)
**Purpose:** Complete payment processing
**Key Features:**
- Multi-method support (card, QR bill, cash)
- Stripe integration
- Swiss QR bill generation
- Refund processing

### 8. Reservations (Future bookings)
**Purpose:** Advanced booking system
**Key Features:**
- Availability checking
- No-show management
- Conversion to contracts
- Overbooking protection

## Error Handling & Logging

### Error Handling Strategy

#### Error Classes
```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number,
    public details?: any,
    public isOperational = true
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details: any) {
    super('VALIDATION_ERROR', message, 422, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super('AUTHENTICATION_ERROR', message, 401);
  }
}
```

#### Global Error Handler
```typescript
// app/api/middleware/errorHandler.ts
export async function errorHandler(
  error: Error,
  request: Request
): Promise<Response> {
  // Log error
  logger.error({
    error: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
  });

  // Send to Sentry
  Sentry.captureException(error, {
    tags: {
      url: request.url,
    },
  });

  // Return appropriate response
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  // Generic error
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    },
    { status: 500 }
  );
}
```

### Logging Architecture

#### Structured Logging
```typescript
// lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: ['password', 'token', 'api_key'],
  serializers: {
    error: pino.stdSerializers.err,
    request: (req) => ({
      method: req.method,
      url: req.url,
      headers: req.headers,
    }),
    response: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

// Usage
logger.info({
  event: 'contract.created',
  contractId: contract.id,
  customerId: customer.id,
  amount: contract.total_amount,
  userId: user.id,
});
```

## Performance Specifications

### Performance Targets

#### Response Time SLAs
| Operation | Target | Maximum |
|-----------|--------|---------|
| API Response | < 200ms | 500ms |
| Contract Creation | < 2s | 5s |
| PDF Generation | < 3s | 10s |
| Photo Upload (5MB) | < 3s | 10s |
| Search | < 300ms | 1s |
| Report Generation | < 5s | 30s |

#### Capacity Planning
- **Concurrent Users**: 100 per company
- **Total Users**: 10,000 system-wide
- **API Requests/Second**: 1,000 peak
- **Database Connections**: 100 concurrent
- **Storage**: 10GB per company
- **Photo Storage**: 1GB per 100 contracts

### Caching Strategy
```typescript
// lib/cache.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = 300 // 5 minutes default
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return cached as T;
  
  const fresh = await fetcher();
  await redis.set(key, fresh, { ex: ttl });
  return fresh;
}
```

---

**Document Version:** 3.0 - Backend Architecture
**Last Updated:** 2025-08-06
**Status:** Ready for Implementation