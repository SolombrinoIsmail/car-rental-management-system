# CRMS API Architecture

## API Specification

### Overview

The CRMS API follows RESTful principles and combines:
1. **Supabase Auto-generated APIs** - Direct CRUD operations with Row Level Security (RLS)
2. **Custom Next.js API Routes** - Complex business logic and integrations
3. **Real-time Subscriptions** - WebSocket connections for live updates

**Base URLs:**
- Production: `https://crms.swiss/api/v1`
- Staging: `https://staging.crms.swiss/api/v1`
- Supabase: `https://[project-id].supabase.co/rest/v1`

**Authentication:** JWT Bearer tokens from Supabase Auth
**Rate Limiting:** 100 requests per minute per authenticated user
**Swiss Compliance:** All endpoints support Swiss data residency and GDPR

### Global Response Format

All API responses follow a consistent structure:

```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    has_more?: boolean;
  };
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing JWT token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Request validation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `MAINTENANCE_MODE` | 503 | System maintenance |

## Core API Endpoints

### Authentication Endpoints

#### POST /auth/login
**Purpose:** Authenticate user with email/password

**Request:**
```json
{
  "email": "user@example.ch",
  "password": "securePassword123",
  "remember_me": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": 1699123200,
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.ch",
      "full_name": "John Doe",
      "role": "staff",
      "company_id": "123e4567-e89b-12d3-a456-426614174001",
      "permissions": {
        "can_create_contracts": true,
        "can_modify_contracts": false,
        "can_view_financials": false,
        "can_manage_fleet": false
      }
    }
  }
}
```

### Contract Management

#### GET /contracts
**Purpose:** List contracts with advanced filtering

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by status
- `customer_id` (string): Filter by customer
- `vehicle_id` (string): Filter by vehicle
- `start_date` (date): Filter contracts starting from date
- `end_date` (date): Filter contracts ending before date
- `payment_status` (string): Filter by payment status
- `search` (string): Search contract number or customer name

#### POST /contracts
**Purpose:** Create new rental contract

**Request:**
```json
{
  "customer_id": "123e4567-e89b-12d3-a456-426614174004",
  "vehicle_id": "123e4567-e89b-12d3-a456-426614174006",
  "start_date": "2025-08-10T10:00:00Z",
  "end_date": "2025-08-15T10:00:00Z",
  "pickup_km": 15432,
  "pickup_fuel": 85,
  "rate_type": "daily",
  "base_rate": 89.00,
  "deposit_amount": 500.00
}
```

#### POST /contracts/quick-create
**Purpose:** Streamlined contract creation for 2-minute goal

**Request:**
```json
{
  "customer": {
    "first_name": "Maria",
    "last_name": "Garcia",
    "phone": "+41 78 123 45 67",
    "id_type": "passport",
    "id_number": "ESP123456789",
    "driver_license_number": "ESP987654321",
    "driver_license_expiry": "2028-12-31"
  },
  "vehicle_id": "123e4567-e89b-12d3-a456-426614174006",
  "rental_days": 3,
  "start_date": "2025-08-10T10:00:00Z",
  "pickup_km": 15432,
  "pickup_fuel": 85,
  "payment_method": "card"
}
```

### Vehicle Management

#### GET /vehicles/availability
**Purpose:** Check vehicle availability for date range

**Query Parameters:**
- `start_date` (date): Required start date
- `end_date` (date): Required end date
- `vehicle_type` (string): Filter by type
- `exclude_contract` (string): Exclude specific contract from check

**Response:**
```json
{
  "success": true,
  "data": {
    "available_vehicles": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174006",
        "license_plate": "ZH-123456",
        "make": "Volkswagen",
        "model": "Golf",
        "vehicle_type": "economy",
        "daily_rate": 89.00,
        "is_available": true
      }
    ],
    "unavailable_vehicles": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174008",
        "license_plate": "ZH-456789",
        "make": "BMW",
        "model": "320i",
        "vehicle_type": "luxury",
        "reason": "Already rented",
        "available_from": "2025-08-10"
      }
    ]
  }
}
```

### Payment Management

#### POST /payments
**Purpose:** Process payment

**Request:**
```json
{
  "contract_id": "123e4567-e89b-12d3-a456-426614174010",
  "amount": 479.27,
  "payment_type": "rental",
  "payment_method": "card",
  "reference_number": "REF-2025-001"
}
```

#### GET /payments/{payment_id}/qr-bill
**Purpose:** Generate Swiss QR bill

**Response:**
```json
{
  "success": true,
  "data": {
    "qr_bill_url": "https://storage.supabase.co/qr-bills/payment-123.pdf",
    "reference_number": "210000000003139471430009017"
  }
}
```

## Business Logic Endpoints

### Dashboard & Analytics

#### GET /dashboard/overview
**Purpose:** Dashboard overview data

**Query Parameters:**
- `period` (string): today|week|month|year

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "revenue": {
      "total": 45780.50,
      "previous_period": 38940.25,
      "growth_percentage": 17.6
    },
    "contracts": {
      "total": 89,
      "active": 12,
      "completed": 65,
      "cancelled": 12,
      "previous_period": 73,
      "growth_percentage": 21.9
    },
    "vehicles": {
      "total": 25,
      "available": 18,
      "rented": 5,
      "maintenance": 2,
      "utilization_rate": 20.0
    },
    "customers": {
      "total": 156,
      "new_this_period": 23,
      "returning": 34,
      "blacklisted": 3
    }
  }
}
```

## File Upload Endpoints

#### POST /upload/photos
**Purpose:** Upload contract photos with compression

**Headers:**
```
Authorization: Bearer [access_token]
Content-Type: multipart/form-data
```

**Request:**
```
files[]: [image files]
contract_id: "123e4567-e89b-12d3-a456-426614174010"
photo_type: "pickup"
compress: true
```

## Real-time Subscription Endpoints

### WebSocket: /realtime/fleet-status
**Purpose:** Real-time fleet status updates

**Authentication:** JWT token via query parameter or header

**Subscription Message:**
```json
{
  "action": "subscribe",
  "channel": "fleet_status",
  "company_id": "123e4567-e89b-12d3-a456-426614174001"
}
```

**Server Messages:**
```json
{
  "event": "vehicle_status_changed",
  "data": {
    "vehicle_id": "123e4567-e89b-12d3-a456-426614174006",
    "old_status": "available",
    "new_status": "rented",
    "contract_id": "123e4567-e89b-12d3-a456-426614174010",
    "timestamp": "2025-08-06T14:30:00Z"
  }
}
```

## Rate Limiting and Security

### Rate Limits
- **Authentication endpoints:** 5 requests per minute per IP
- **File upload endpoints:** 20 files per minute per user
- **General API endpoints:** 100 requests per minute per user
- **Real-time subscriptions:** 10 connections per user

### Security Headers
All API responses include security headers:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### Swiss Data Compliance
- All data stored in Swiss AWS regions
- GDPR-compliant data processing
- Customer data anonymization on request
- Audit logging for all data access
- Encrypted data at rest and in transit

### Error Response Examples

**401 Unauthorized:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired JWT token",
    "details": "Token expired at 2025-08-06T12:00:00Z"
  }
}
```

**422 Validation Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "field_errors": {
        "email": ["Email is required"],
        "phone": ["Invalid Swiss phone number format"]
      }
    }
  }
}
```

---

**Document Version:** 3.0 - API Architecture
**Last Updated:** 2025-08-06
**Status:** Ready for Implementation