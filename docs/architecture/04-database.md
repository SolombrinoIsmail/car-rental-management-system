# CRMS Database Architecture

## Database Schema Design

### Schema Architecture Principles

1. **Multi-tenant Isolation**: Every table includes `company_id` for data segregation
2. **UUID Primary Keys**: Globally unique identifiers prevent collisions
3. **Soft Deletes**: `is_active` flags maintain data history
4. **Audit Trail**: Automatic tracking of all changes
5. **Optimistic Locking**: Version fields prevent concurrent update conflicts
6. **Swiss Compliance**: GDPR-ready fields and data retention policies

### Complete PostgreSQL Schema

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- For compound indexes

-- Companies table (multi-tenant root)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    vat_number VARCHAR(50) UNIQUE,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    canton VARCHAR(2) NOT NULL CHECK (canton IN ('AG','AI','AR','BE','BL','BS','FR','GE','GL','GR','JU','LU','NE','NW','OW','SG','SH','SO','SZ','TG','TI','UR','VD','VS','ZG','ZH')),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subscription_tier VARCHAR(20) DEFAULT 'starter' CHECK (subscription_tier IN ('starter', 'professional', 'business', 'enterprise')),
    subscription_status VARCHAR(20) DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'suspended', 'cancelled')),
    trial_ends_at TIMESTAMP,
    settings JSONB DEFAULT '{"currency": "CHF", "vat_rate": 7.7, "default_fuel_price": 1.65, "km_price": 0.25}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone ~ '^\+41[0-9\s]+$')
);

-- Users table (staff/owners)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'manager', 'staff', 'viewer')),
    phone VARCHAR(20),
    permissions JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    CONSTRAINT valid_user_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    country VARCHAR(2) DEFAULT 'CH',
    id_type VARCHAR(20) NOT NULL CHECK (id_type IN ('passport', 'swiss_id', 'residence_permit', 'driver_license')),
    id_number VARCHAR(50) NOT NULL,
    id_expiry DATE,
    driver_license_number VARCHAR(50) NOT NULL,
    driver_license_expiry DATE NOT NULL,
    driver_license_category VARCHAR(10) NOT NULL,
    is_blacklisted BOOLEAN DEFAULT false,
    blacklist_reason TEXT,
    verified BOOLEAN DEFAULT false,
    notes TEXT,
    gdpr_consent BOOLEAN DEFAULT false,
    gdpr_consent_date TIMESTAMP,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    version INT DEFAULT 1,
    CONSTRAINT valid_age CHECK (date_of_birth < CURRENT_DATE - INTERVAL '18 years'),
    CONSTRAINT valid_license_expiry CHECK (driver_license_expiry > CURRENT_DATE)
);

-- Vehicles table
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    vin VARCHAR(17) UNIQUE,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    color VARCHAR(30),
    vehicle_type VARCHAR(20) NOT NULL CHECK (vehicle_type IN ('economy', 'compact', 'sedan', 'suv', 'van', 'luxury', 'sports')),
    transmission VARCHAR(20) DEFAULT 'manual' CHECK (transmission IN ('manual', 'automatic')),
    fuel_type VARCHAR(20) DEFAULT 'petrol' CHECK (fuel_type IN ('petrol', 'diesel', 'hybrid', 'electric')),
    seats INT NOT NULL CHECK (seats > 0 AND seats <= 20),
    daily_rate DECIMAL(10,2) NOT NULL CHECK (daily_rate > 0),
    weekly_rate DECIMAL(10,2) NOT NULL CHECK (weekly_rate > 0),
    monthly_rate DECIMAL(10,2) NOT NULL CHECK (monthly_rate > 0),
    deposit_amount DECIMAL(10,2) NOT NULL CHECK (deposit_amount >= 0),
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance', 'cleaning', 'retired')),
    current_km INT NOT NULL CHECK (current_km >= 0),
    fuel_level INT NOT NULL CHECK (fuel_level >= 0 AND fuel_level <= 100),
    fuel_capacity INT CHECK (fuel_capacity > 0),
    next_service_km INT,
    next_service_date DATE,
    insurance_policy_number VARCHAR(50),
    insurance_expiry DATE,
    features TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT valid_rates CHECK (weekly_rate < daily_rate * 7 AND monthly_rate < daily_rate * 30)
);

-- Contracts table (core business entity)
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    contract_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    created_by UUID NOT NULL REFERENCES users(id),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    actual_return_date TIMESTAMP,
    pickup_km INT NOT NULL CHECK (pickup_km >= 0),
    pickup_fuel INT NOT NULL CHECK (pickup_fuel >= 0 AND pickup_fuel <= 100),
    pickup_location TEXT,
    return_km INT CHECK (return_km >= pickup_km),
    return_fuel INT CHECK (return_fuel >= 0 AND return_fuel <= 100),
    return_location TEXT,
    base_rate DECIMAL(10,2) NOT NULL CHECK (base_rate > 0),
    rate_type VARCHAR(20) NOT NULL CHECK (rate_type IN ('daily', 'weekly', 'monthly')),
    total_days INT NOT NULL CHECK (total_days > 0),
    km_included INT DEFAULT 0,
    extra_km_rate DECIMAL(10,2) DEFAULT 0.25,
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    vat_rate DECIMAL(5,2) DEFAULT 7.7 CHECK (vat_rate >= 0),
    vat_amount DECIMAL(10,2) NOT NULL CHECK (vat_amount >= 0),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    deposit_amount DECIMAL(10,2) NOT NULL CHECK (deposit_amount >= 0),
    deposit_status VARCHAR(20) DEFAULT 'pending' CHECK (deposit_status IN ('pending', 'held', 'released', 'forfeited')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded')),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'active', 'completed', 'cancelled', 'void')),
    contract_pdf_url TEXT,
    signature_customer_url TEXT,
    signature_staff_url TEXT,
    signed_at TIMESTAMP,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP,
    cancelled_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    version INT DEFAULT 1,
    CONSTRAINT valid_dates CHECK (end_date > start_date),
    CONSTRAINT valid_return CHECK (actual_return_date IS NULL OR actual_return_date >= start_date)
);

-- Contract Photos table
CREATE TABLE contract_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    photo_type VARCHAR(20) NOT NULL CHECK (photo_type IN ('pickup', 'return', 'damage', 'id', 'license', 'signature')),
    photo_category VARCHAR(20) NOT NULL CHECK (photo_category IN ('exterior', 'interior', 'damage', 'document')),
    storage_path TEXT NOT NULL,
    public_url TEXT,
    thumbnail_url TEXT,
    file_size INT,
    mime_type VARCHAR(50),
    caption TEXT,
    damage_description TEXT,
    position VARCHAR(20) CHECK (position IN ('front', 'rear', 'left', 'right', 'top', 'interior')),
    annotations JSONB,
    uploaded_at TIMESTAMP DEFAULT NOW(),
    uploaded_by UUID NOT NULL REFERENCES users(id),
    sort_order INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT false
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES contracts(id),
    customer_id UUID REFERENCES customers(id),
    amount DECIMAL(10,2) NOT NULL CHECK (amount != 0),
    currency VARCHAR(3) DEFAULT 'CHF',
    payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('deposit', 'rental', 'damage', 'fine', 'refund', 'partial')),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'card', 'transfer', 'twint', 'qr_bill')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
    reference_number VARCHAR(50),
    transaction_id VARCHAR(100),
    stripe_payment_intent_id VARCHAR(100),
    qr_bill_reference VARCHAR(27),
    qr_bill_url TEXT,
    processed_at TIMESTAMP,
    processed_by UUID REFERENCES users(id),
    failure_reason TEXT,
    refund_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Reservations table
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    pickup_location TEXT,
    return_location TEXT,
    estimated_rate DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'no_show', 'converted')),
    contract_id UUID REFERENCES contracts(id),
    converted_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    no_show_at TIMESTAMP,
    confirmation_sent BOOLEAN DEFAULT false,
    reminder_sent BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT valid_reservation_dates CHECK (end_date > start_date),
    CONSTRAINT future_reservation CHECK (start_date > CURRENT_TIMESTAMP)
);

-- Audit Log table (for compliance)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Database Optimization

### Indexes for Performance

```sql
-- Create indexes for performance
CREATE INDEX idx_companies_subscription ON companies(subscription_status, subscription_tier);
CREATE INDEX idx_users_company ON users(company_id) WHERE is_active = true;
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_customers_company ON customers(company_id);
CREATE INDEX idx_customers_search ON customers USING gin(company_id, last_name gin_trgm_ops, first_name gin_trgm_ops);
CREATE INDEX idx_customers_phone ON customers(company_id, phone);
CREATE INDEX idx_customers_blacklist ON customers(company_id) WHERE is_blacklisted = true;
CREATE INDEX idx_vehicles_availability ON vehicles(company_id, status) WHERE is_active = true;
CREATE INDEX idx_vehicles_maintenance ON vehicles(next_service_date, next_service_km) WHERE is_active = true;
CREATE INDEX idx_contracts_active ON contracts(company_id, status) WHERE status IN ('active', 'draft', 'confirmed');
CREATE INDEX idx_contracts_dates ON contracts(company_id, start_date, end_date);
CREATE INDEX idx_contracts_customer ON contracts(customer_id);
CREATE INDEX idx_contracts_vehicle ON contracts(vehicle_id);
CREATE INDEX idx_payments_contract ON payments(contract_id);
CREATE INDEX idx_payments_status ON payments(company_id, status) WHERE status = 'pending';
CREATE INDEX idx_reservations_dates ON reservations(company_id, start_date, end_date) WHERE status = 'confirmed';
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at);
```

### Materialized Views for Analytics

```sql
-- Materialized view for dashboard metrics
CREATE MATERIALIZED VIEW dashboard_metrics AS
SELECT
  company_id,
  DATE(created_at) as date,
  COUNT(*) as total_contracts,
  SUM(total_amount) as revenue,
  AVG(total_days) as avg_rental_duration
FROM contracts
WHERE status IN ('completed', 'active')
GROUP BY company_id, DATE(created_at);

-- Refresh daily
CREATE INDEX idx_dashboard_metrics ON dashboard_metrics(company_id, date);
```

## Row Level Security (RLS)

```sql
-- Row Level Security (RLS) Policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Company isolation policy (all tables)
CREATE POLICY company_isolation_companies ON companies
    FOR ALL USING (id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY company_isolation_users ON users
    FOR ALL USING (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY company_isolation_customers ON customers
    FOR ALL USING (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY company_isolation_vehicles ON vehicles
    FOR ALL USING (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY company_isolation_contracts ON contracts
    FOR ALL USING (company_id = (auth.jwt() ->> 'company_id')::uuid);
```

## Automated Functions

### Timestamp Updates

```sql
-- Triggers for automated timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### Contract Number Generation

```sql
-- Function for contract number generation
CREATE OR REPLACE FUNCTION generate_contract_number(company_id UUID)
RETURNS VARCHAR AS $$
DECLARE
    company_prefix VARCHAR(3);
    year_prefix VARCHAR(4);
    sequential_number INT;
    contract_number VARCHAR(20);
BEGIN
    -- Get company prefix (first 3 letters of company name)
    SELECT UPPER(LEFT(REGEXP_REPLACE(name, '[^a-zA-Z]', '', 'g'), 3))
    INTO company_prefix
    FROM companies
    WHERE id = company_id;

    year_prefix := TO_CHAR(CURRENT_DATE, 'YYYY');

    -- Get next sequential number for this company and year
    SELECT COALESCE(MAX(CAST(REGEXP_REPLACE(c.contract_number, '^[A-Z]+-\d{4}-', '') AS INT)), 0) + 1
    INTO sequential_number
    FROM contracts c
    WHERE c.company_id = generate_contract_number.company_id
    AND c.contract_number LIKE company_prefix || '-' || year_prefix || '-%';

    contract_number := company_prefix || '-' || year_prefix || '-' || LPAD(sequential_number::TEXT, 5, '0');

    RETURN contract_number;
END;
$$ LANGUAGE plpgsql;
```

---

**Document Version:** 3.0 - Database Architecture **Last Updated:** 2025-08-06 **Status:** Ready for
Implementation
