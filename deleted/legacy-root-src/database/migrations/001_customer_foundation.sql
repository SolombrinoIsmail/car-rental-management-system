-- Migration: 001_customer_foundation.sql
-- Description: Customer Management Foundation for Epic 1 Story 1
-- Author: System Architect
-- Created: 2025-08-07

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create sequence for customer codes
CREATE SEQUENCE customer_sequence START 1000;

-- Tenants table for multi-tenant architecture
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    country_code VARCHAR(3) DEFAULT 'CH',
    timezone VARCHAR(50) DEFAULT 'Europe/Zurich',
    subscription_tier VARCHAR(20) DEFAULT 'professional',
    max_customers INTEGER DEFAULT 50000,
    max_storage_mb INTEGER DEFAULT 51200, -- 50GB
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    active BOOLEAN DEFAULT TRUE
);

-- Users table for staff management
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role_level INTEGER NOT NULL CHECK (role_level BETWEEN 1 AND 4),
    -- 1=staff, 2=supervisor, 3=manager, 4=admin
    permissions JSONB DEFAULT '{}',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Core Customers table with Swiss-specific requirements
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    customer_code VARCHAR(20) UNIQUE NOT NULL,
    
    -- Personal Information (Swiss Requirements)
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    nationality VARCHAR(3) DEFAULT 'CHE', -- ISO 3166-1 alpha-3
    preferred_language VARCHAR(5) DEFAULT 'de-CH', -- RFC 5646 language tag
    
    -- Swiss Address Structure (JSONB for flexibility)
    address JSONB NOT NULL DEFAULT jsonb_build_object(
        'street', '',
        'house_number', '',
        'postal_code', '',
        'city', '',
        'canton', '',
        'country', 'CH'
    ),
    
    -- Swiss ID Documentation Requirements
    id_document_type VARCHAR(50) NOT NULL CHECK (
        id_document_type IN (
            'swiss_passport',
            'swiss_id_card', 
            'residence_permit_b',
            'residence_permit_c',
            'residence_permit_l',
            'residence_permit_f',
            'eu_passport',
            'other_passport'
        )
    ),
    id_document_number VARCHAR(100) NOT NULL,
    id_document_expiry DATE,
    
    -- Driver License (mandatory for rentals)
    driver_license_number VARCHAR(100) NOT NULL,
    driver_license_country VARCHAR(3) DEFAULT 'CHE',
    driver_license_expiry DATE NOT NULL,
    driver_license_category JSONB DEFAULT '{"B": true}', -- Swiss categories
    
    -- Customer Risk Management and Flags
    flags JSONB DEFAULT '{}' CHECK (
        jsonb_typeof(flags) = 'object' AND
        (flags ? 'blacklisted' IS NULL OR jsonb_typeof(flags->'blacklisted') = 'boolean') AND
        (flags ? 'vip' IS NULL OR jsonb_typeof(flags->'vip') = 'boolean') AND
        (flags ? 'payment_risk' IS NULL OR jsonb_typeof(flags->'payment_risk') = 'boolean') AND
        (flags ? 'damage_risk' IS NULL OR jsonb_typeof(flags->'damage_risk') = 'boolean') AND
        (flags ? 'special_needs' IS NULL OR jsonb_typeof(flags->'special_needs') = 'boolean') AND
        (flags ? 'requires_deposit' IS NULL OR jsonb_typeof(flags->'requires_deposit') = 'boolean')
    ),
    
    -- Blacklist Management
    blacklist_reason TEXT,
    blacklist_expiry TIMESTAMP WITH TIME ZONE,
    blacklist_approved_by UUID REFERENCES users(id),
    blacklist_approved_at TIMESTAMP WITH TIME ZONE,
    
    -- Customer Notes and Business Metrics
    notes TEXT CHECK (char_length(notes) <= 2000),
    lifetime_value DECIMAL(10,2) DEFAULT 0.00,
    total_rentals INTEGER DEFAULT 0,
    
    -- GDPR/FADP Compliance
    gdpr_consent_date TIMESTAMP WITH TIME ZONE,
    gdpr_consent_version VARCHAR(10),
    marketing_consent BOOLEAN DEFAULT FALSE,
    data_retention_expiry DATE, -- Auto-calculated based on last rental
    
    -- Audit Trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Customer Documents for ID/License photos and verification
CREATE TABLE customer_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    
    document_type VARCHAR(50) NOT NULL CHECK (
        document_type IN (
            'id_front', 'id_back', 
            'license_front', 'license_back',
            'passport', 'passport_back',
            'proof_of_address',
            'credit_card',
            'other'
        )
    ),
    
    -- File Storage (Supabase Storage references)
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL CHECK (file_size <= 5242880), -- 5MB limit
    mime_type VARCHAR(100) NOT NULL CHECK (
        mime_type IN ('image/jpeg', 'image/png', 'application/pdf')
    ),
    
    -- Generated thumbnails for performance
    thumbnail_url TEXT,
    thumbnail_small_url TEXT, -- 200x200
    thumbnail_medium_url TEXT, -- 400x400
    
    -- Document verification and expiry tracking
    expiry_date DATE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),
    verification_notes TEXT,
    
    -- OCR extracted data for validation
    extracted_data JSONB, -- Store OCR results
    extraction_confidence DECIMAL(3,2), -- 0.00-1.00
    
    -- Audit and metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by UUID REFERENCES users(id)
);

-- Customer Risk History for audit trail and manager approvals
CREATE TABLE customer_risk_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    
    risk_type VARCHAR(50) NOT NULL CHECK (
        risk_type IN (
            'blacklist', 'payment_risk', 'damage_risk', 
            'vip', 'special_needs', 'requires_deposit',
            'credit_check', 'police_check'
        )
    ),
    
    action VARCHAR(20) NOT NULL CHECK (action IN ('added', 'removed', 'modified', 'expired')),
    reason TEXT NOT NULL,
    expiry_date TIMESTAMP WITH TIME ZONE,
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    
    -- Manager approval workflow
    requires_approval BOOLEAN DEFAULT FALSE,
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES users(id),
    approval_status VARCHAR(20) CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    approval_notes TEXT,
    
    -- Audit trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES users(id)
);

-- Customer search cache for performance (Redis backup)
CREATE TABLE customer_search_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    query_hash VARCHAR(64) NOT NULL, -- MD5 of search parameters
    query_params JSONB NOT NULL,
    result_data JSONB NOT NULL,
    result_count INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '5 minutes')
);

-- Performance indexes for customer search and operations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customers_tenant_id 
ON customers(tenant_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customers_email 
ON customers(email) WHERE email IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customers_phone 
ON customers(phone);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customers_customer_code 
ON customers(customer_code);

-- Compound index for active customers by tenant
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customers_active 
ON customers(tenant_id, id, updated_at DESC) 
WHERE NOT (flags ? 'blacklisted' AND (flags->>'blacklisted')::boolean = true);

-- Full-text search index (German language for Swiss market)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customers_fulltext_search 
ON customers USING GIN (
    to_tsvector(
        'german', 
        coalesce(first_name, '') || ' ' || 
        coalesce(last_name, '') || ' ' || 
        coalesce(email, '') || ' ' || 
        coalesce(phone, '') || ' ' ||
        coalesce(customer_code, '')
    )
);

-- Trigram index for fuzzy search performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customers_trigram 
ON customers USING GIN (
    (first_name || ' ' || last_name || ' ' || coalesce(email, '')) gin_trgm_ops
);

-- Document management indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customer_documents_customer_id 
ON customer_documents(customer_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customer_documents_expiry 
ON customer_documents(expiry_date) 
WHERE expiry_date IS NOT NULL AND expiry_date > CURRENT_DATE;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customer_documents_type 
ON customer_documents(customer_id, document_type);

-- Risk history indexes for audit queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_risk_history_customer 
ON customer_risk_history(customer_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_risk_history_approval 
ON customer_risk_history(approval_status, created_at) 
WHERE approval_status = 'pending';

-- Search cache performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_search_cache_lookup 
ON customer_search_cache(tenant_id, query_hash, expires_at) 
WHERE expires_at > NOW();

-- Swiss-specific validation functions
CREATE OR REPLACE FUNCTION validate_swiss_customer_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate Swiss phone format: +41XXXXXXXXX or 07XXXXXXXX or 09XXXXXXXX
    IF NEW.phone !~ '^\+41[0-9]{9}$|^0[79][0-9]{8}$' THEN
        RAISE EXCEPTION 'Invalid Swiss phone format. Use +41XXXXXXXXX or 07X/09XXXXXXXX format: %', NEW.phone;
    END IF;
    
    -- Validate Swiss ID document formats
    CASE NEW.id_document_type
        WHEN 'swiss_passport' THEN
            IF NEW.id_document_number !~ '^[A-Z][0-9]{7}$' THEN
                RAISE EXCEPTION 'Invalid Swiss passport format. Expected: [A-Z][0-9]{7}, got: %', NEW.id_document_number;
            END IF;
        WHEN 'swiss_id_card' THEN
            IF NEW.id_document_number !~ '^[0-9]{8}$' THEN
                RAISE EXCEPTION 'Invalid Swiss ID card format. Expected: 8 digits, got: %', NEW.id_document_number;
            END IF;
        WHEN 'residence_permit_b', 'residence_permit_c', 'residence_permit_l', 'residence_permit_f' THEN
            IF NEW.id_document_number !~ '^[BCLF][0-9]{8}$' THEN
                RAISE EXCEPTION 'Invalid residence permit format. Expected: [BCLF][0-9]{8}, got: %', NEW.id_document_number;
            END IF;
    END CASE;
    
    -- Validate minimum age (18 years)
    IF NEW.date_of_birth > CURRENT_DATE - INTERVAL '18 years' THEN
        RAISE EXCEPTION 'Customer must be at least 18 years old. Birth date: %', NEW.date_of_birth;
    END IF;
    
    -- Validate maximum age (100 years - data quality check)
    IF NEW.date_of_birth < CURRENT_DATE - INTERVAL '100 years' THEN
        RAISE EXCEPTION 'Invalid birth date (over 100 years old). Please verify: %', NEW.date_of_birth;
    END IF;
    
    -- Validate driver license expiry is in the future
    IF NEW.driver_license_expiry <= CURRENT_DATE THEN
        RAISE EXCEPTION 'Driver license has expired. Expiry date: %', NEW.driver_license_expiry;
    END IF;
    
    -- Generate customer code if not provided
    IF NEW.customer_code IS NULL OR NEW.customer_code = '' THEN
        NEW.customer_code := 'CH' || LPAD(nextval('customer_sequence')::TEXT, 8, '0');
    END IF;
    
    -- Ensure email uniqueness within tenant (allow NULL)
    IF NEW.email IS NOT NULL THEN
        IF EXISTS (
            SELECT 1 FROM customers 
            WHERE email = NEW.email 
            AND tenant_id = NEW.tenant_id 
            AND id != COALESCE(NEW.id, uuid_generate_v4())
        ) THEN
            RAISE EXCEPTION 'Email address already exists for another customer in this tenant: %', NEW.email;
        END IF;
    END IF;
    
    -- Update timestamp
    NEW.updated_at := NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for customer validation
CREATE TRIGGER trigger_validate_swiss_customer_data
    BEFORE INSERT OR UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION validate_swiss_customer_data();

-- Function to calculate data retention expiry
CREATE OR REPLACE FUNCTION update_data_retention_expiry()
RETURNS TRIGGER AS $$
BEGIN
    -- Set data retention based on Swiss requirements (3 years after last activity)
    NEW.data_retention_expiry := CURRENT_DATE + INTERVAL '3 years';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update data retention on customer changes
CREATE TRIGGER trigger_update_data_retention
    BEFORE INSERT OR UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_data_retention_expiry();

-- Multi-tenant Row Level Security (RLS)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_risk_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_search_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenant isolation
CREATE POLICY tenant_isolation_customers ON customers
    FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::UUID);

CREATE POLICY tenant_isolation_documents ON customer_documents
    FOR ALL USING (
        customer_id IN (
            SELECT id FROM customers 
            WHERE tenant_id = (auth.jwt() ->> 'tenant_id')::UUID
        )
    );

CREATE POLICY tenant_isolation_risk_history ON customer_risk_history
    FOR ALL USING (
        customer_id IN (
            SELECT id FROM customers 
            WHERE tenant_id = (auth.jwt() ->> 'tenant_id')::UUID
        )
    );

CREATE POLICY tenant_isolation_search_cache ON customer_search_cache
    FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::UUID);

-- Function for safe customer search with performance optimization
CREATE OR REPLACE FUNCTION search_customers_optimized(
    p_tenant_id UUID,
    p_query TEXT,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0,
    p_include_flags BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
    id UUID,
    customer_code VARCHAR(20),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    flags JSONB,
    lifetime_value DECIMAL(10,2),
    total_rentals INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    rank REAL
) AS $$
BEGIN
    -- Use full-text search for longer queries, trigram for shorter ones
    IF length(p_query) >= 3 THEN
        RETURN QUERY
        SELECT 
            c.id,
            c.customer_code,
            c.first_name,
            c.last_name,
            CASE WHEN p_include_flags THEN c.email ELSE 
                mask_sensitive_data(c.email, 'email') 
            END as email,
            CASE WHEN p_include_flags THEN c.phone ELSE 
                mask_sensitive_data(c.phone, 'phone') 
            END as phone,
            CASE WHEN p_include_flags THEN c.flags ELSE '{}'::JSONB END as flags,
            c.lifetime_value,
            c.total_rentals,
            c.created_at,
            ts_rank(
                to_tsvector('german', c.first_name || ' ' || c.last_name || ' ' || coalesce(c.email, '') || ' ' || c.customer_code),
                plainto_tsquery('german', p_query)
            ) as rank
        FROM customers c
        WHERE c.tenant_id = p_tenant_id
        AND (
            to_tsvector('german', c.first_name || ' ' || c.last_name || ' ' || coalesce(c.email, '') || ' ' || c.customer_code) 
            @@ plainto_tsquery('german', p_query)
            OR 
            similarity(c.first_name || ' ' || c.last_name || ' ' || coalesce(c.email, ''), p_query) > 0.3
        )
        ORDER BY rank DESC, c.updated_at DESC
        LIMIT p_limit OFFSET p_offset;
    ELSE
        -- For short queries, use exact matching
        RETURN QUERY
        SELECT 
            c.id,
            c.customer_code,
            c.first_name,
            c.last_name,
            CASE WHEN p_include_flags THEN c.email ELSE 
                mask_sensitive_data(c.email, 'email') 
            END as email,
            CASE WHEN p_include_flags THEN c.phone ELSE 
                mask_sensitive_data(c.phone, 'phone') 
            END as phone,
            CASE WHEN p_include_flags THEN c.flags ELSE '{}'::JSONB END as flags,
            c.lifetime_value,
            c.total_rentals,
            c.created_at,
            1.0 as rank
        FROM customers c
        WHERE c.tenant_id = p_tenant_id
        AND (
            c.customer_code ILIKE p_query || '%'
            OR c.phone = p_query
            OR c.email = p_query
        )
        ORDER BY c.updated_at DESC
        LIMIT p_limit OFFSET p_offset;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Data masking function for privacy protection
CREATE OR REPLACE FUNCTION mask_sensitive_data(
    data TEXT,
    mask_type TEXT DEFAULT 'partial'
) RETURNS TEXT AS $$
BEGIN
    IF data IS NULL THEN
        RETURN NULL;
    END IF;
    
    CASE mask_type
        WHEN 'email' THEN
            -- Show first 2 characters and domain: ab***@domain.com
            RETURN regexp_replace(data, '(.{2}).*@(.*)\.(.{2,})', '\1***@\2.\3');
        WHEN 'phone' THEN
            -- Show first 3 and last 2 digits: +41****56
            RETURN regexp_replace(data, '(.{3}).*(.{2})', '\1****\2');
        WHEN 'id_number' THEN
            -- Show first 2 and last 2: AB****78
            RETURN regexp_replace(data, '(.{2}).*(.{2})', '\1****\2');
        WHEN 'license' THEN
            -- Show first 3 and last 2: ABC***78
            RETURN regexp_replace(data, '(.{3}).*(.{2})', '\1***\2');
        ELSE
            RETURN '***MASKED***';
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup function for expired search cache
CREATE OR REPLACE FUNCTION cleanup_expired_search_cache()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM customer_search_cache WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Grant appropriate permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Comment the tables for documentation
COMMENT ON TABLE customers IS 'Core customer data with Swiss compliance features and multi-tenant isolation';
COMMENT ON TABLE customer_documents IS 'Customer ID and license document storage with thumbnail support';
COMMENT ON TABLE customer_risk_history IS 'Audit trail for all customer risk flag changes and manager approvals';
COMMENT ON TABLE customer_search_cache IS 'Performance cache for frequently used customer search queries';

-- Create initial tenant for development (remove in production)
INSERT INTO tenants (id, name, subdomain, country_code, timezone) VALUES
('00000000-0000-0000-0000-000000000001', 'Development Tenant', 'dev', 'CH', 'Europe/Zurich')
ON CONFLICT (id) DO NOTHING;

-- Migration completed successfully
SELECT 'Customer Foundation Migration 001 completed successfully' as status;