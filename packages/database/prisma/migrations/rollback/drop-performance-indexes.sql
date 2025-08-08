-- Rollback script to remove performance indexes
-- Use this if indexes cause issues or need to be recreated

-- Customer Indexes
DROP INDEX IF EXISTS idx_customers_email;
DROP INDEX IF EXISTS idx_customers_phone;
DROP INDEX IF EXISTS idx_customers_organization;
DROP INDEX IF EXISTS idx_customers_canton;

-- Vehicle Indexes
DROP INDEX IF EXISTS idx_vehicles_status;
DROP INDEX IF EXISTS idx_vehicles_organization;
DROP INDEX IF EXISTS idx_vehicles_category;
DROP INDEX IF EXISTS idx_vehicles_license_plate;
DROP INDEX IF EXISTS idx_vehicles_status_org;

-- Contract Indexes
DROP INDEX IF EXISTS idx_contracts_pickup_date;
DROP INDEX IF EXISTS idx_contracts_return_date;
DROP INDEX IF EXISTS idx_contracts_status;
DROP INDEX IF EXISTS idx_contracts_customer;
DROP INDEX IF EXISTS idx_contracts_vehicle;
DROP INDEX IF EXISTS idx_contracts_organization;
DROP INDEX IF EXISTS idx_contracts_dates;
DROP INDEX IF EXISTS idx_contracts_number;

-- Payment Indexes
DROP INDEX IF EXISTS idx_payments_contract;
DROP INDEX IF EXISTS idx_payments_status;
DROP INDEX IF EXISTS idx_payments_organization;
DROP INDEX IF EXISTS idx_payments_processed_at;
DROP INDEX IF EXISTS idx_payments_method;

-- User Indexes
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_organization;
DROP INDEX IF EXISTS idx_users_role;
DROP INDEX IF EXISTS idx_users_auth_id;

-- Location Indexes
DROP INDEX IF EXISTS idx_locations_organization;
DROP INDEX IF EXISTS idx_locations_active;
DROP INDEX IF EXISTS idx_locations_canton;

-- Activity Log Indexes
DROP INDEX IF EXISTS idx_activity_logs_organization;
DROP INDEX IF EXISTS idx_activity_logs_user;
DROP INDEX IF EXISTS idx_activity_logs_entity;
DROP INDEX IF EXISTS idx_activity_logs_created;
DROP INDEX IF EXISTS idx_activity_logs_action;

-- Maintenance Record Indexes
DROP INDEX IF EXISTS idx_maintenance_vehicle;
DROP INDEX IF EXISTS idx_maintenance_organization;
DROP INDEX IF EXISTS idx_maintenance_date;
DROP INDEX IF EXISTS idx_maintenance_next_due;

-- Additional Driver Indexes
DROP INDEX IF EXISTS idx_additional_drivers_contract;
DROP INDEX IF EXISTS idx_additional_drivers_organization;

-- Customer Document Indexes
DROP INDEX IF EXISTS idx_customer_docs_customer;
DROP INDEX IF EXISTS idx_customer_docs_organization;
DROP INDEX IF EXISTS idx_customer_docs_type;
DROP INDEX IF EXISTS idx_customer_docs_expiry;

-- Vehicle Damage Indexes
DROP INDEX IF EXISTS idx_vehicle_damages_vehicle;
DROP INDEX IF EXISTS idx_vehicle_damages_contract;
DROP INDEX IF EXISTS idx_vehicle_damages_organization;
DROP INDEX IF EXISTS idx_vehicle_damages_reported;

-- Composite Indexes
DROP INDEX IF EXISTS idx_contracts_active_by_date;
DROP INDEX IF EXISTS idx_vehicles_available;
DROP INDEX IF EXISTS idx_payments_pending;

-- Full Text Search Indexes
DROP INDEX IF EXISTS idx_customers_search;
DROP INDEX IF EXISTS idx_vehicles_search;