-- Performance Indexes for Swiss Car Rental Management System
-- These indexes optimize frequently queried fields

-- Customer Indexes
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_organization ON customers(organization_id);
CREATE INDEX IF NOT EXISTS idx_customers_canton ON customers(canton);

-- Vehicle Indexes  
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_organization ON vehicles(organization_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_category ON vehicles(category_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_license_plate ON vehicles(license_plate);
CREATE INDEX IF NOT EXISTS idx_vehicles_status_org ON vehicles(status, organization_id);

-- Contract Indexes
CREATE INDEX IF NOT EXISTS idx_contracts_pickup_date ON contracts(pickup_date);
CREATE INDEX IF NOT EXISTS idx_contracts_return_date ON contracts(return_date);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_customer ON contracts(customer_id);
CREATE INDEX IF NOT EXISTS idx_contracts_vehicle ON contracts(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_contracts_organization ON contracts(organization_id);
CREATE INDEX IF NOT EXISTS idx_contracts_dates ON contracts(pickup_date, return_date);
CREATE INDEX IF NOT EXISTS idx_contracts_number ON contracts(contract_number);

-- Payment Indexes
CREATE INDEX IF NOT EXISTS idx_payments_contract ON payments(contract_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_organization ON payments(organization_id);
CREATE INDEX IF NOT EXISTS idx_payments_processed_at ON payments(processed_at);
CREATE INDEX IF NOT EXISTS idx_payments_method ON payments(method);

-- User Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_organization ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_user_id);

-- Location Indexes
CREATE INDEX IF NOT EXISTS idx_locations_organization ON locations(organization_id);
CREATE INDEX IF NOT EXISTS idx_locations_active ON locations(is_active);
CREATE INDEX IF NOT EXISTS idx_locations_canton ON locations(canton);

-- Activity Log Indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_organization ON activity_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);

-- Maintenance Record Indexes
CREATE INDEX IF NOT EXISTS idx_maintenance_vehicle ON maintenance_records(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_organization ON maintenance_records(organization_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_date ON maintenance_records(maintenance_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_next_due ON maintenance_records(next_due_date);

-- Additional Driver Indexes
CREATE INDEX IF NOT EXISTS idx_additional_drivers_contract ON additional_drivers(contract_id);
CREATE INDEX IF NOT EXISTS idx_additional_drivers_organization ON additional_drivers(organization_id);

-- Customer Document Indexes
CREATE INDEX IF NOT EXISTS idx_customer_docs_customer ON customer_documents(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_docs_organization ON customer_documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_customer_docs_type ON customer_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_customer_docs_expiry ON customer_documents(expiry_date);

-- Vehicle Damage Indexes
CREATE INDEX IF NOT EXISTS idx_vehicle_damages_vehicle ON vehicle_damages(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_damages_contract ON vehicle_damages(contract_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_damages_organization ON vehicle_damages(organization_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_damages_reported ON vehicle_damages(reported_date);

-- Composite Indexes for Complex Queries
CREATE INDEX IF NOT EXISTS idx_contracts_active_by_date 
  ON contracts(organization_id, status, pickup_date, return_date) 
  WHERE status IN ('ACTIVE', 'DRAFT');

CREATE INDEX IF NOT EXISTS idx_vehicles_available 
  ON vehicles(organization_id, status, category_id) 
  WHERE status = 'AVAILABLE';

CREATE INDEX IF NOT EXISTS idx_payments_pending 
  ON payments(organization_id, status, created_at) 
  WHERE status = 'PENDING';

-- Full Text Search Indexes
CREATE INDEX IF NOT EXISTS idx_customers_search 
  ON customers USING gin(
    to_tsvector('simple', 
      coalesce(first_name, '') || ' ' || 
      coalesce(last_name, '') || ' ' || 
      coalesce(email, '') || ' ' || 
      coalesce(phone, '')
    )
  );

CREATE INDEX IF NOT EXISTS idx_vehicles_search 
  ON vehicles USING gin(
    to_tsvector('simple', 
      coalesce(make, '') || ' ' || 
      coalesce(model, '') || ' ' || 
      coalesce(license_plate, '') || ' ' || 
      coalesce(vin, '')
    )
  );

-- Analyze tables to update statistics after index creation
ANALYZE customers;
ANALYZE vehicles;
ANALYZE contracts;
ANALYZE payments;
ANALYZE users;
ANALYZE locations;
ANALYZE activity_logs;