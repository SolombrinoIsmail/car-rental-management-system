-- Rental Contracts and Transactions Schema
-- Part of Car Rental Management System

-- Contract status enum
CREATE TYPE contract_status AS ENUM (
    'draft',
    'confirmed',
    'active',
    'completed',
    'cancelled',
    'void'
);

-- Payment status enum
CREATE TYPE payment_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'refunded',
    'partial'
);

-- Payment method enum
CREATE TYPE payment_method AS ENUM (
    'cash',
    'credit_card',
    'debit_card',
    'bank_transfer',
    'qr_bill',
    'twint',
    'paypal',
    'other'
);

-- Contract sequence for contract numbers
CREATE SEQUENCE IF NOT EXISTS contract_sequence START 1000;

-- Main contracts table
CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    contract_number VARCHAR(20) UNIQUE NOT NULL DEFAULT ('CT' || LPAD(nextval('contract_sequence')::TEXT, 8, '0')),
    
    -- Related entities
    customer_id UUID NOT NULL REFERENCES customers(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    
    -- Contract dates and duration
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_return_date TIMESTAMP WITH TIME ZONE,
    
    -- Pickup and return locations
    pickup_location VARCHAR(255),
    return_location VARCHAR(255),
    
    -- Pricing details
    daily_rate DECIMAL(10,2) NOT NULL,
    total_days INTEGER NOT NULL GENERATED ALWAYS AS (
        EXTRACT(DAY FROM (COALESCE(actual_return_date, end_date) - start_date))::INTEGER + 1
    ) STORED,
    
    base_amount DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    
    -- Additional charges
    insurance_amount DECIMAL(10,2) DEFAULT 0,
    equipment_charges DECIMAL(10,2) DEFAULT 0,
    fuel_charges DECIMAL(10,2) DEFAULT 0,
    late_return_charges DECIMAL(10,2) DEFAULT 0,
    damage_charges DECIMAL(10,2) DEFAULT 0,
    cleaning_charges DECIMAL(10,2) DEFAULT 0,
    other_charges DECIMAL(10,2) DEFAULT 0,
    
    -- Discounts
    discount_percentage DECIMAL(5,2) DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    discount_amount DECIMAL(10,2) DEFAULT 0,
    
    -- Total calculation
    total_amount DECIMAL(10,2) GENERATED ALWAYS AS (
        base_amount + 
        COALESCE(insurance_amount, 0) +
        COALESCE(equipment_charges, 0) +
        COALESCE(fuel_charges, 0) +
        COALESCE(late_return_charges, 0) +
        COALESCE(damage_charges, 0) +
        COALESCE(cleaning_charges, 0) +
        COALESCE(other_charges, 0) -
        COALESCE(discount_amount, 0)
    ) STORED,
    
    -- Mileage tracking
    start_mileage INTEGER NOT NULL,
    end_mileage INTEGER,
    mileage_limit INTEGER,
    excess_mileage_rate DECIMAL(10,2),
    excess_mileage_charges DECIMAL(10,2) DEFAULT 0,
    
    -- Fuel tracking
    start_fuel_level INTEGER CHECK (start_fuel_level >= 0 AND start_fuel_level <= 100),
    end_fuel_level INTEGER CHECK (end_fuel_level >= 0 AND end_fuel_level <= 100),
    
    -- Contract status
    status contract_status DEFAULT 'draft',
    
    -- Digital signature
    customer_signature_url TEXT,
    customer_signed_at TIMESTAMP WITH TIME ZONE,
    staff_signature_url TEXT,
    staff_signed_at TIMESTAMP WITH TIME ZONE,
    
    -- Additional drivers
    additional_drivers JSONB DEFAULT '[]'::jsonb,
    
    -- Equipment and extras
    extras JSONB DEFAULT '[]'::jsonb,
    
    -- Terms acceptance
    terms_accepted BOOLEAN DEFAULT FALSE,
    terms_accepted_at TIMESTAMP WITH TIME ZONE,
    
    -- Notes
    internal_notes TEXT,
    customer_notes TEXT,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_by UUID
);

-- Contract photos (before/after)
CREATE TABLE IF NOT EXISTS contract_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    
    photo_type VARCHAR(50) NOT NULL CHECK (
        photo_type IN ('before_exterior', 'before_interior', 'before_damage',
                      'after_exterior', 'after_interior', 'after_damage',
                      'fuel_gauge', 'mileage', 'incident', 'other')
    ),
    
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    
    -- Photo metadata
    captured_at TIMESTAMP WITH TIME ZONE NOT NULL,
    captured_by UUID,
    
    -- Annotations for damage
    annotations JSONB,
    damage_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Damage reports
CREATE TABLE IF NOT EXISTS damage_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES contracts(id),
    
    -- Damage details
    description TEXT NOT NULL,
    location VARCHAR(255),
    severity VARCHAR(20) CHECK (severity IN ('minor', 'moderate', 'major', 'total_loss')),
    
    -- Cost assessment
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    insurance_covered BOOLEAN DEFAULT FALSE,
    customer_liable BOOLEAN DEFAULT TRUE,
    
    -- Documentation
    photos JSONB DEFAULT '[]'::jsonb,
    police_report_number VARCHAR(100),
    insurance_claim_number VARCHAR(100),
    
    -- Resolution
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID
);

-- Payment transactions
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    contract_id UUID NOT NULL REFERENCES contracts(id),
    
    -- Payment details
    payment_type VARCHAR(50) CHECK (
        payment_type IN ('deposit', 'rental', 'damage', 'late_fee', 'fuel', 'cleaning', 'refund', 'other')
    ),
    
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'CHF',
    
    -- Payment method
    method payment_method NOT NULL,
    status payment_status DEFAULT 'pending',
    
    -- Swiss QR Bill specific
    qr_bill_reference VARCHAR(100),
    qr_bill_url TEXT,
    
    -- Transaction details
    transaction_id VARCHAR(255),
    gateway_response JSONB,
    
    -- Processing timestamps
    initiated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    
    -- Failure tracking
    failure_reason TEXT,
    retry_count INTEGER DEFAULT 0,
    
    -- Refund information
    is_refund BOOLEAN DEFAULT FALSE,
    refunded_payment_id UUID REFERENCES payments(id),
    refund_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID
);

-- Create indexes
CREATE INDEX idx_contracts_tenant ON contracts(tenant_id);
CREATE INDEX idx_contracts_customer ON contracts(customer_id);
CREATE INDEX idx_contracts_vehicle ON contracts(vehicle_id);
CREATE INDEX idx_contracts_dates ON contracts(start_date, end_date);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_number ON contracts(contract_number);

CREATE INDEX idx_contract_photos_contract ON contract_photos(contract_id);
CREATE INDEX idx_damage_reports_contract ON damage_reports(contract_id);

CREATE INDEX idx_payments_tenant ON payments(tenant_id);
CREATE INDEX idx_payments_contract ON payments(contract_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_type ON payments(payment_type);

-- Enable RLS
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE damage_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY tenant_isolation_contracts ON contracts
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_payments ON payments
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Trigger to validate contract dates
CREATE OR REPLACE FUNCTION validate_contract_dates()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.end_date < NEW.start_date THEN
        RAISE EXCEPTION 'Contract end date must be after start date';
    END IF;
    
    IF NEW.actual_return_date IS NOT NULL AND NEW.actual_return_date < NEW.start_date THEN
        RAISE EXCEPTION 'Actual return date cannot be before start date';
    END IF;
    
    -- Calculate late charges if returned late
    IF NEW.actual_return_date IS NOT NULL AND NEW.actual_return_date > NEW.end_date THEN
        NEW.late_return_charges := 
            EXTRACT(DAY FROM (NEW.actual_return_date - NEW.end_date)) * NEW.daily_rate * 1.5;
    END IF;
    
    -- Calculate excess mileage charges
    IF NEW.end_mileage IS NOT NULL AND NEW.mileage_limit IS NOT NULL THEN
        IF (NEW.end_mileage - NEW.start_mileage) > NEW.mileage_limit THEN
            NEW.excess_mileage_charges := 
                ((NEW.end_mileage - NEW.start_mileage) - NEW.mileage_limit) * 
                COALESCE(NEW.excess_mileage_rate, 0.50);
        END IF;
    END IF;
    
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_contract
    BEFORE INSERT OR UPDATE ON contracts
    FOR EACH ROW EXECUTE FUNCTION validate_contract_dates();