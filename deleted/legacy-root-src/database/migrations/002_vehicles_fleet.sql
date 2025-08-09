-- Vehicle Fleet Management Schema
-- Part of Car Rental Management System

-- Vehicle categories enum
CREATE TYPE vehicle_category AS ENUM (
    'economy',
    'compact',
    'midsize',
    'fullsize',
    'luxury',
    'suv',
    'minivan',
    'convertible',
    'sports'
);

-- Vehicle status enum
CREATE TYPE vehicle_status AS ENUM (
    'available',
    'rented',
    'maintenance',
    'cleaning',
    'reserved',
    'out_of_service'
);

-- Main vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    vehicle_code VARCHAR(20) UNIQUE NOT NULL,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    vin VARCHAR(17) UNIQUE NOT NULL,
    
    -- Vehicle details
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    color VARCHAR(30),
    category vehicle_category NOT NULL,
    
    -- Technical specifications
    transmission VARCHAR(20) CHECK (transmission IN ('manual', 'automatic', 'semi-automatic')),
    fuel_type VARCHAR(20) CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid', 'plugin_hybrid')),
    seats INTEGER NOT NULL CHECK (seats > 0 AND seats <= 20),
    doors INTEGER CHECK (doors >= 2 AND doors <= 5),
    
    -- Rental pricing
    daily_rate DECIMAL(10,2) NOT NULL CHECK (daily_rate > 0),
    weekly_rate DECIMAL(10,2),
    monthly_rate DECIMAL(10,2),
    excess_mileage_rate DECIMAL(10,2) DEFAULT 0.50,
    
    -- Vehicle status
    status vehicle_status DEFAULT 'available',
    current_mileage INTEGER NOT NULL DEFAULT 0 CHECK (current_mileage >= 0),
    last_service_date DATE,
    next_service_date DATE,
    last_inspection_date DATE,
    next_inspection_date DATE,
    
    -- Insurance information
    insurance_company VARCHAR(100),
    insurance_policy_number VARCHAR(100),
    insurance_expiry DATE,
    
    -- Location tracking
    current_location VARCHAR(255),
    home_location VARCHAR(255),
    
    -- Additional features (JSONB for flexibility)
    features JSONB DEFAULT '[]'::jsonb,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- Vehicle maintenance log
CREATE TABLE IF NOT EXISTS maintenance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    
    maintenance_type VARCHAR(50) NOT NULL CHECK (
        maintenance_type IN ('routine_service', 'repair', 'inspection', 'tire_change', 
                           'oil_change', 'brake_service', 'battery', 'other')
    ),
    
    description TEXT NOT NULL,
    cost DECIMAL(10,2),
    
    -- Service details
    performed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    performed_by VARCHAR(255),
    service_center VARCHAR(255),
    
    -- Mileage tracking
    mileage_at_service INTEGER,
    next_due_date DATE,
    next_due_mileage INTEGER,
    
    -- Documentation
    invoice_number VARCHAR(100),
    warranty_info TEXT,
    parts_replaced JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID
);

-- Vehicle photos for documentation
CREATE TABLE IF NOT EXISTS vehicle_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    
    photo_type VARCHAR(50) NOT NULL CHECK (
        photo_type IN ('exterior_front', 'exterior_back', 'exterior_left', 'exterior_right',
                      'interior_front', 'interior_back', 'dashboard', 'trunk',
                      'damage', 'document', 'other')
    ),
    
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    
    -- Photo metadata
    captured_at TIMESTAMP WITH TIME ZONE NOT NULL,
    captured_by UUID,
    
    -- Annotations for damage documentation
    annotations JSONB,
    is_damage_photo BOOLEAN DEFAULT FALSE,
    damage_description TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicle availability calendar
CREATE TABLE IF NOT EXISTS vehicle_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    availability_type VARCHAR(50) CHECK (
        availability_type IN ('blocked', 'maintenance', 'reserved', 'rented')
    ),
    
    -- Reference to related entity
    contract_id UUID,
    maintenance_id UUID,
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    
    CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Create indexes for performance
CREATE INDEX idx_vehicles_tenant_id ON vehicles(tenant_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_category ON vehicles(category);
CREATE INDEX idx_vehicles_registration ON vehicles(registration_number);
CREATE INDEX idx_vehicles_availability ON vehicles(status) WHERE status = 'available';

CREATE INDEX idx_maintenance_vehicle ON maintenance_logs(vehicle_id);
CREATE INDEX idx_maintenance_date ON maintenance_logs(performed_at DESC);

CREATE INDEX idx_vehicle_photos_vehicle ON vehicle_photos(vehicle_id);
CREATE INDEX idx_vehicle_photos_type ON vehicle_photos(photo_type);

CREATE INDEX idx_availability_vehicle ON vehicle_availability(vehicle_id);
CREATE INDEX idx_availability_dates ON vehicle_availability(start_date, end_date);

-- Enable RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_availability ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY tenant_isolation_vehicles ON vehicles
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_maintenance ON maintenance_logs
    FOR ALL USING (
        vehicle_id IN (
            SELECT id FROM vehicles 
            WHERE tenant_id = current_setting('app.current_tenant_id')::UUID
        )
    );

-- Trigger to update vehicle status based on availability
CREATE OR REPLACE FUNCTION update_vehicle_status()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- Update vehicle status based on new availability
        IF NEW.availability_type = 'rented' THEN
            UPDATE vehicles SET status = 'rented' WHERE id = NEW.vehicle_id;
        ELSIF NEW.availability_type = 'maintenance' THEN
            UPDATE vehicles SET status = 'maintenance' WHERE id = NEW.vehicle_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        -- Check if vehicle should be available again
        IF NOT EXISTS (
            SELECT 1 FROM vehicle_availability 
            WHERE vehicle_id = OLD.vehicle_id 
            AND CURRENT_DATE BETWEEN start_date AND end_date
        ) THEN
            UPDATE vehicles SET status = 'available' WHERE id = OLD.vehicle_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_vehicle_status
    AFTER INSERT OR UPDATE OR DELETE ON vehicle_availability
    FOR EACH ROW EXECUTE FUNCTION update_vehicle_status();