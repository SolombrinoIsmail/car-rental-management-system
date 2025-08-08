-- Rollback script to remove Row Level Security policies
-- WARNING: This will disable multi-tenant security!
-- Only use in development or if migrating to different security model

-- Disable RLS on all tables
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE contracts DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE locations DISABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_damages DISABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE customer_documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE additional_drivers DISABLE ROW LEVEL SECURITY;

-- Drop all RLS policies

-- Organizations Policies
DROP POLICY IF EXISTS "Organizations are viewable by members" ON organizations;
DROP POLICY IF EXISTS "Organizations are editable by admins" ON organizations;

-- Users Policies
DROP POLICY IF EXISTS "Users are viewable by organization members" ON users;
DROP POLICY IF EXISTS "Users are insertable by admins" ON users;
DROP POLICY IF EXISTS "Users are editable by admins or self" ON users;
DROP POLICY IF EXISTS "Users are deletable by admins" ON users;

-- Customers Policies
DROP POLICY IF EXISTS "Customers are viewable by organization members" ON customers;
DROP POLICY IF EXISTS "Customers are insertable by organization members" ON customers;
DROP POLICY IF EXISTS "Customers are editable by organization members" ON customers;
DROP POLICY IF EXISTS "Customers are deletable by managers" ON customers;

-- Vehicles Policies
DROP POLICY IF EXISTS "Vehicles are viewable by organization members" ON vehicles;
DROP POLICY IF EXISTS "Vehicles are insertable by managers" ON vehicles;
DROP POLICY IF EXISTS "Vehicles are editable by managers" ON vehicles;
DROP POLICY IF EXISTS "Vehicles are deletable by admins" ON vehicles;

-- Vehicle Categories Policies
DROP POLICY IF EXISTS "Categories are viewable by organization members" ON vehicle_categories;
DROP POLICY IF EXISTS "Categories are insertable by managers" ON vehicle_categories;
DROP POLICY IF EXISTS "Categories are editable by managers" ON vehicle_categories;
DROP POLICY IF EXISTS "Categories are deletable by admins" ON vehicle_categories;

-- Contracts Policies
DROP POLICY IF EXISTS "Contracts are viewable by organization members" ON contracts;
DROP POLICY IF EXISTS "Contracts are insertable by staff" ON contracts;
DROP POLICY IF EXISTS "Contracts are editable by staff" ON contracts;
DROP POLICY IF EXISTS "Contracts are deletable by managers" ON contracts;

-- Payments Policies
DROP POLICY IF EXISTS "Payments are viewable by organization members" ON payments;
DROP POLICY IF EXISTS "Payments are insertable by staff" ON payments;
DROP POLICY IF EXISTS "Payments are editable by managers" ON payments;
DROP POLICY IF EXISTS "Payments are deletable by admins" ON payments;

-- Locations Policies
DROP POLICY IF EXISTS "Locations are viewable by organization members" ON locations;
DROP POLICY IF EXISTS "Locations are insertable by managers" ON locations;
DROP POLICY IF EXISTS "Locations are editable by managers" ON locations;
DROP POLICY IF EXISTS "Locations are deletable by admins" ON locations;

-- Activity Logs Policies
DROP POLICY IF EXISTS "Activity logs are viewable by organization members" ON activity_logs;
DROP POLICY IF EXISTS "Activity logs are insertable by organization members" ON activity_logs;

-- Maintenance Records Policies
DROP POLICY IF EXISTS "Maintenance records are viewable by organization members" ON maintenance_records;
DROP POLICY IF EXISTS "Maintenance records are insertable by staff" ON maintenance_records;
DROP POLICY IF EXISTS "Maintenance records are editable by staff" ON maintenance_records;
DROP POLICY IF EXISTS "Maintenance records are deletable by managers" ON maintenance_records;

-- Vehicle Damages Policies
DROP POLICY IF EXISTS "Vehicle damages are viewable by organization members" ON vehicle_damages;
DROP POLICY IF EXISTS "Vehicle damages are insertable by staff" ON vehicle_damages;
DROP POLICY IF EXISTS "Vehicle damages are editable by staff" ON vehicle_damages;
DROP POLICY IF EXISTS "Vehicle damages are deletable by managers" ON vehicle_damages;

-- Customer Documents Policies
DROP POLICY IF EXISTS "Customer documents are viewable by organization members" ON customer_documents;
DROP POLICY IF EXISTS "Customer documents are insertable by staff" ON customer_documents;
DROP POLICY IF EXISTS "Customer documents are editable by staff" ON customer_documents;
DROP POLICY IF EXISTS "Customer documents are deletable by managers" ON customer_documents;

-- Additional Drivers Policies
DROP POLICY IF EXISTS "Additional drivers are viewable by organization members" ON additional_drivers;
DROP POLICY IF EXISTS "Additional drivers are insertable by staff" ON additional_drivers;
DROP POLICY IF EXISTS "Additional drivers are editable by staff" ON additional_drivers;
DROP POLICY IF EXISTS "Additional drivers are deletable by managers" ON additional_drivers;

-- Drop helper functions
DROP FUNCTION IF EXISTS auth.organization_id();
DROP FUNCTION IF EXISTS auth.user_role();