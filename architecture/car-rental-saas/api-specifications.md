# Car Rental SaaS - API Specifications & Contracts

## API Architecture Overview

The Car Rental SaaS API follows RESTful principles combined with GraphQL for complex queries and real-time subscriptions. The API is built on Next.js 14 with TypeScript and integrates with Supabase for authentication and data access.

## Base Configuration

```yaml
openapi: 3.0.3
info:
  title: Car Rental Management System API
  description: Swiss-compliant multi-tenant SaaS for car rental operations
  version: 1.0.0
  contact:
    name: CRMS API Support
    email: api@crms.swiss
  license:
    name: Proprietary
servers:
  - url: https://api.crms.swiss/v1
    description: Production server (Frankfurt)
  - url: https://staging-api.crms.swiss/v1
    description: Staging server
security:
  - BearerAuth: []
```

## Authentication & Authorization

### JWT Authentication
```typescript
interface JWTPayload {
  sub: string           // User ID
  email: string        // User email
  company_id: string   // Company isolation
  role: 'owner' | 'manager' | 'staff' | 'viewer'
  permissions: string[] // Granular permissions
  exp: number          // Token expiration
  iat: number          // Issued at
}
```

### Permission System
```typescript
enum Permissions {
  // Contract permissions
  CONTRACT_CREATE = 'contract:create',
  CONTRACT_READ = 'contract:read',
  CONTRACT_UPDATE = 'contract:update',
  CONTRACT_DELETE = 'contract:delete',
  CONTRACT_SIGN = 'contract:sign',
  
  // Financial permissions
  PAYMENT_PROCESS = 'payment:process',
  PAYMENT_REFUND = 'payment:refund',
  FINANCIAL_READ = 'financial:read',
  FINANCIAL_EXPORT = 'financial:export',
  
  // Vehicle permissions
  VEHICLE_MANAGE = 'vehicle:manage',
  VEHICLE_READ = 'vehicle:read',
  
  // User management
  USER_MANAGE = 'user:manage',
  USER_READ = 'user:read',
  
  // System administration
  SYSTEM_CONFIGURE = 'system:configure',
  AUDIT_READ = 'audit:read'
}
```

## Core API Endpoints

### 1. Authentication Endpoints

#### POST /auth/login
```yaml
paths:
  /auth/login:
    post:
      summary: User authentication
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email, password]
              properties:
                email:
                  type: string
                  format: email
                  example: "staff@example.ch"
                password:
                  type: string
                  minLength: 8
                  example: "SecurePass123!"
                remember_me:
                  type: boolean
                  default: false
                company_subdomain:
                  type: string
                  description: "For multi-tenant access"
      responses:
        200:
          description: Login successful
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        401:
          $ref: '#/components/responses/Unauthorized'
```

```typescript
interface AuthResponse {
  success: true
  data: {
    access_token: string
    refresh_token: string
    expires_at: number
    user: UserProfile
  }
}

interface UserProfile {
  id: string
  email: string
  full_name: string
  role: string
  company_id: string
  company_name: string
  permissions: Permissions[]
  last_login: string
}
```

### 2. Contract Management

#### POST /contracts
```typescript
interface CreateContractRequest {
  customer_id: string
  vehicle_id: string
  start_date: string // ISO 8601
  end_date: string   // ISO 8601
  pickup_location?: string
  return_location?: string
  pickup_km: number
  pickup_fuel: number // 0-100 percentage
  rate_type: 'daily' | 'weekly' | 'monthly'
  base_rate: number  // CHF amount
  deposit_amount: number
  km_included?: number
  extra_km_rate?: number
  notes?: string
}

interface ContractResponse {
  success: true
  data: {
    id: string
    contract_number: string
    customer: Customer
    vehicle: Vehicle
    start_date: string
    end_date: string
    status: 'draft' | 'confirmed' | 'active' | 'completed' | 'cancelled'
    payment_status: 'pending' | 'partial' | 'paid' | 'refunded'
    total_amount: number
    deposit_amount: number
    created_at: string
    pdf_url?: string
  }
}
```

#### GET /contracts
```yaml
paths:
  /contracts:
    get:
      summary: List contracts with filtering
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            minimum: 1
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
        - name: status
          in: query
          schema:
            type: string
            enum: [draft, confirmed, active, completed, cancelled]
        - name: customer_id
          in: query
          schema:
            type: string
            format: uuid
        - name: vehicle_id
          in: query
          schema:
            type: string
            format: uuid
        - name: start_date
          in: query
          schema:
            type: string
            format: date
        - name: end_date
          in: query
          schema:
            type: string
            format: date
        - name: search
          in: query
          schema:
            type: string
          description: "Search by contract number or customer name"
```

#### POST /contracts/{id}/sign
```typescript
interface SignContractRequest {
  signature_data: string // Base64 encoded signature image
  signature_type: 'customer' | 'staff'
  ip_address?: string
  user_agent?: string
}
```

#### POST /contracts/quick-create
```typescript
interface QuickCreateContractRequest {
  // Customer data (creates if not exists)
  customer: {
    first_name: string
    last_name: string
    date_of_birth: string
    phone: string
    email?: string
    address: string
    city: string
    postal_code: string
    id_type: 'passport' | 'swiss_id' | 'residence_permit'
    id_number: string
    id_expiry?: string
    driver_license_number: string
    driver_license_expiry: string
    driver_license_category: string
  }
  // Contract details
  vehicle_id: string
  rental_days: number
  start_date: string
  pickup_km: number
  pickup_fuel: number
  payment_method: 'cash' | 'card' | 'twint' | 'qr_bill'
  // Optional overrides
  rate_override?: number
  deposit_override?: number
  notes?: string
}
```

### 3. Vehicle Management

#### GET /vehicles/availability
```typescript
interface AvailabilityRequest {
  start_date: string
  end_date: string
  vehicle_type?: string
  exclude_contract?: string // For modifications
}

interface AvailabilityResponse {
  success: true
  data: {
    available_vehicles: Vehicle[]
    unavailable_vehicles: {
      vehicle: Vehicle
      reason: string
      available_from?: string
      next_available?: string
    }[]
    suggestions?: {
      similar_vehicles: Vehicle[]
      alternative_dates: {
        start_date: string
        end_date: string
        available_vehicles: number
      }[]
    }
  }
}
```

#### POST /vehicles/{id}/status
```typescript
interface UpdateVehicleStatusRequest {
  status: 'available' | 'rented' | 'maintenance' | 'cleaning' | 'retired'
  reason?: string
  maintenance_details?: {
    type: 'service' | 'repair' | 'inspection'
    description: string
    estimated_completion: string
    cost_estimate?: number
  }
  notes?: string
}
```

### 4. Payment Processing

#### POST /payments
```typescript
interface ProcessPaymentRequest {
  contract_id: string
  amount: number
  currency: 'CHF'
  payment_type: 'deposit' | 'rental' | 'damage' | 'fine' | 'refund'
  payment_method: 'cash' | 'card' | 'twint' | 'qr_bill' | 'transfer'
  // Card payment fields
  payment_method_id?: string // Stripe payment method
  // Cash payment fields
  cash_received?: number
  change_given?: number
  // Reference fields
  reference_number?: string
  notes?: string
}

interface PaymentResponse {
  success: true
  data: {
    id: string
    amount: number
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
    payment_method: string
    transaction_id?: string
    reference_number?: string
    receipt_url?: string
    qr_bill_url?: string // For QR-bill payments
    created_at: string
  }
}
```

#### POST /payments/{id}/qr-bill
```typescript
interface QRBillRequest {
  creditor: {
    name: string
    address: string
    postal_code: string
    city: string
    iban: string
  }
  amount: number
  currency: 'CHF'
  debtor?: {
    name: string
    address: string
    postal_code: string
    city: string
  }
  reference_type: 'QRR' | 'SCOR' | 'NON'
  reference?: string
  additional_info?: string
  billing_info?: string
}

interface QRBillResponse {
  success: true
  data: {
    qr_bill_url: string
    reference_number: string
    qr_code_svg: string
    pdf_url: string
  }
}
```

### 5. Customer Management

#### POST /customers
```typescript
interface CreateCustomerRequest {
  first_name: string
  last_name: string
  date_of_birth: string // YYYY-MM-DD
  email?: string
  phone: string // +41 format
  address: string
  city: string
  postal_code: string
  country: string // Default: 'CH'
  id_type: 'passport' | 'swiss_id' | 'residence_permit' | 'driver_license'
  id_number: string
  id_expiry?: string
  driver_license_number: string
  driver_license_expiry: string
  driver_license_category: string
  notes?: string
  gdpr_consent: boolean
}
```

#### GET /customers/search
```typescript
interface CustomerSearchQuery {
  q: string // Search term
  limit?: number
  include_blacklisted?: boolean
}

interface CustomerSearchResponse {
  success: true
  data: {
    customers: CustomerSummary[]
    total: number
    duplicates_found?: DuplicateCustomer[]
  }
}
```

#### POST /customers/{id}/blacklist
```typescript
interface BlacklistCustomerRequest {
  reason: string
  notes?: string
  effective_date?: string
}
```

### 6. Photo Management

#### POST /photos/upload
```yaml
paths:
  /photos/upload:
    post:
      summary: Upload contract photos
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              required: [files, contract_id]
              properties:
                files:
                  type: array
                  items:
                    type: string
                    format: binary
                contract_id:
                  type: string
                  format: uuid
                photo_type:
                  type: string
                  enum: [pickup, return, damage, id, license]
                photo_category:
                  type: string
                  enum: [exterior, interior, damage, document]
                compress:
                  type: boolean
                  default: true
```

```typescript
interface PhotoUploadResponse {
  success: true
  data: {
    photos: {
      id: string
      storage_path: string
      public_url: string
      thumbnail_url: string
      file_size: number
      mime_type: string
    }[]
    processing_jobs: string[] // For background compression
  }
}
```

#### POST /photos/{id}/annotate
```typescript
interface AnnotatePhotoRequest {
  annotations: {
    type: 'damage' | 'note' | 'arrow' | 'circle' | 'rectangle'
    position: {
      x: number
      y: number
      width?: number
      height?: number
    }
    text?: string
    color?: string
    severity?: 'low' | 'medium' | 'high'
  }[]
  damage_description?: string
}
```

### 7. Dashboard & Analytics

#### GET /dashboard/overview
```typescript
interface DashboardOverviewQuery {
  period: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'
  start_date?: string // For custom period
  end_date?: string   // For custom period
}

interface DashboardOverviewResponse {
  success: true
  data: {
    period: string
    revenue: {
      total: number
      previous_period: number
      growth_percentage: number
      breakdown: {
        rental_fees: number
        deposits_held: number
        damage_charges: number
        late_fees: number
      }
    }
    contracts: {
      total: number
      active: number
      completed: number
      cancelled: number
      draft: number
      previous_period: number
      growth_percentage: number
      avg_duration_days: number
      avg_value: number
    }
    vehicles: {
      total: number
      available: number
      rented: number
      maintenance: number
      utilization_rate: number
      top_performers: {
        vehicle_id: string
        license_plate: string
        revenue: number
        utilization_rate: number
      }[]
    }
    customers: {
      total: number
      new_this_period: number
      returning: number
      blacklisted: number
      top_customers: {
        customer_id: string
        name: string
        total_spent: number
        contract_count: number
      }[]
    }
    alerts: {
      overdue_returns: number
      pending_payments: number
      maintenance_due: number
      expiring_licenses: number
    }
  }
}
```

## Real-time Subscriptions

### WebSocket Connection
```typescript
// Connection
const ws = new WebSocket('wss://api.crms.swiss/realtime')

// Authentication
ws.send(JSON.stringify({
  type: 'auth',
  token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}))

// Subscribe to fleet status
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'fleet_status',
  company_id: 'company-uuid'
}))
```

### Real-time Events
```typescript
interface WebSocketMessage {
  type: 'event' | 'error' | 'heartbeat'
  channel?: string
  event?: string
  data?: any
}

// Fleet status change
{
  type: 'event',
  channel: 'fleet_status',
  event: 'vehicle_status_changed',
  data: {
    vehicle_id: 'vehicle-uuid',
    old_status: 'available',
    new_status: 'rented',
    contract_id: 'contract-uuid',
    timestamp: '2025-08-07T14:30:00Z'
  }
}

// Contract created
{
  type: 'event',
  channel: 'contracts',
  event: 'contract_created',
  data: {
    contract_id: 'contract-uuid',
    customer_name: 'John Doe',
    vehicle_license: 'ZH-123456',
    total_amount: 450.00,
    created_by: 'user-uuid'
  }
}
```

## Error Handling

### Standard Error Response
```typescript
interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: any
    timestamp: string
    trace_id?: string
  }
}
```

### Error Codes
```typescript
enum ErrorCodes {
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // Business logic errors
  VEHICLE_NOT_AVAILABLE = 'VEHICLE_NOT_AVAILABLE',
  CONTRACT_ALREADY_SIGNED = 'CONTRACT_ALREADY_SIGNED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  CUSTOMER_BLACKLISTED = 'CUSTOMER_BLACKLISTED',
  
  // System errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // File upload errors
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  UPLOAD_FAILED = 'UPLOAD_FAILED'
}
```

## Rate Limiting

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1691416800
X-RateLimit-Window: 60
```

### Rate Limit Policies
```typescript
const rateLimits = {
  // By endpoint
  'POST /auth/login': { limit: 5, window: '1m' },
  'POST /photos/upload': { limit: 20, window: '1m' },
  'GET /dashboard/*': { limit: 100, window: '1m' },
  
  // By user role
  owner: { limit: 1000, window: '1m' },
  manager: { limit: 500, window: '1m' },
  staff: { limit: 200, window: '1m' },
  viewer: { limit: 100, window: '1m' },
  
  // Global limits
  global: { limit: 10000, window: '1m' }
}
```

## API Client SDKs

### TypeScript/JavaScript SDK
```typescript
import { CRMSClient } from '@crms/sdk'

const client = new CRMSClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.crms.swiss/v1'
})

// Usage examples
const contracts = await client.contracts.list({
  status: 'active',
  limit: 50
})

const contract = await client.contracts.create({
  customer_id: 'customer-uuid',
  vehicle_id: 'vehicle-uuid',
  start_date: '2025-08-10T10:00:00Z',
  end_date: '2025-08-15T10:00:00Z'
})

const payment = await client.payments.process({
  contract_id: contract.id,
  amount: contract.total_amount,
  payment_method: 'card'
})
```

## API Documentation

### OpenAPI Specification
Complete OpenAPI 3.0 specification available at:
- Development: `https://api-dev.crms.swiss/docs`
- Staging: `https://api-staging.crms.swiss/docs`
- Production: `https://api.crms.swiss/docs`

### Interactive API Explorer
Swagger UI with authentication and testing capabilities:
- Try API calls directly from documentation
- Download Postman collections
- Generate client SDKs

---

**API Specifications Version:** 1.0  
**Last Updated:** 2025-08-07  
**Status:** Complete Analysis  
**Coverage:** All Core Business Operations