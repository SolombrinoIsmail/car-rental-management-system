-- Enable Row Level Security for all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_damages ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE additional_drivers ENABLE ROW LEVEL SECURITY;

-- Create function to get user's organization
CREATE OR REPLACE FUNCTION auth.organization_id() 
RETURNS uuid AS $$
  SELECT (auth.jwt() -> 'user_metadata' ->> 'organization_id')::uuid;
$$ LANGUAGE sql STABLE;

-- Create function to get user's role
CREATE OR REPLACE FUNCTION auth.user_role() 
RETURNS text AS $$
  SELECT auth.jwt() -> 'user_metadata' ->> 'role';
$$ LANGUAGE sql STABLE;

-- Organizations Policies
CREATE POLICY "Organizations are viewable by members" ON organizations
  FOR SELECT USING (id = auth.organization_id());

CREATE POLICY "Organizations are editable by admins" ON organizations
  FOR UPDATE USING (
    id = auth.organization_id() AND 
    auth.user_role() IN ('SUPER_ADMIN', 'ADMIN')
  );

-- Users Policies
CREATE POLICY "Users are viewable by organization members" ON users
  FOR SELECT USING (organization_id = auth.organization_id());

CREATE POLICY "Users are insertable by admins" ON users
  FOR INSERT WITH CHECK (
    organization_id = auth.organization_id() AND 
    auth.user_role() IN ('SUPER_ADMIN', 'ADMIN')
  );

CREATE POLICY "Users are editable by admins or self" ON users
  FOR UPDATE USING (
    organization_id = auth.organization_id() AND 
    (auth.user_role() IN ('SUPER_ADMIN', 'ADMIN') OR id = auth.uid())
  );

CREATE POLICY "Users are deletable by admins" ON users
  FOR DELETE USING (
    organization_id = auth.organization_id() AND 
    auth.user_role() IN ('SUPER_ADMIN', 'ADMIN')
  );

-- Customers Policies
CREATE POLICY "Customers are viewable by organization members" ON customers
  FOR SELECT USING (organization_id = auth.organization_id());

CREATE POLICY "Customers are insertable by staff" ON customers
  FOR INSERT WITH CHECK (
    organization_id = auth.organization_id() AND 
    auth.user_role() IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF')
  );

CREATE POLICY "Customers are editable by staff" ON customers
  FOR UPDATE USING (
    organization_id = auth.organization_id() AND 
    auth.user_role() IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF')
  );

CREATE POLICY "Customers are deletable by managers" ON customers
  FOR DELETE USING (
    organization_id = auth.organization_id() AND 
    auth.user_role() IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  );

-- Vehicles Policies
CREATE POLICY "Vehicles are viewable by organization members" ON vehicles
  FOR SELECT USING (organization_id = auth.organization_id());

CREATE POLICY "Vehicles are manageable by managers" ON vehicles
  FOR ALL USING (
    organization_id = auth.organization_id() AND 
    auth.user_role() IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  );

-- Vehicle Categories Policies
CREATE POLICY "Vehicle categories are viewable by organization members" ON vehicle_categories
  FOR SELECT USING (organization_id = auth.organization_id());

CREATE POLICY "Vehicle categories are manageable by managers" ON vehicle_categories
  FOR ALL USING (
    organization_id = auth.organization_id() AND 
    auth.user_role() IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  );

-- Contracts Policies
CREATE POLICY "Contracts are viewable by organization members" ON contracts
  FOR SELECT USING (organization_id = auth.organization_id());

CREATE POLICY "Contracts are insertable by staff" ON contracts
  FOR INSERT WITH CHECK (
    organization_id = auth.organization_id() AND 
    auth.user_role() IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF')
  );

CREATE POLICY "Contracts are editable by staff" ON contracts
  FOR UPDATE USING (
    organization_id = auth.organization_id() AND 
    auth.user_role() IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF')
  );

CREATE POLICY "Contracts are deletable by managers" ON contracts
  FOR DELETE USING (
    organization_id = auth.organization_id() AND 
    auth.user_role() IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  );

-- Payments Policies
CREATE POLICY "Payments are viewable by organization members" ON payments
  FOR SELECT USING (organization_id = auth.organization_id());

CREATE POLICY "Payments are insertable by staff" ON payments
  FOR INSERT WITH CHECK (
    organization_id = auth.organization_id() AND 
    auth.user_role() IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF')
  );

CREATE POLICY "Payments are editable by managers" ON payments
  FOR UPDATE USING (
    organization_id = auth.organization_id() AND 
    auth.user_role() IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  );

-- Locations Policies
CREATE POLICY "Locations are viewable by organization members" ON locations
  FOR SELECT USING (organization_id = auth.organization_id());

CREATE POLICY "Locations are manageable by managers" ON locations
  FOR ALL USING (
    organization_id = auth.organization_id() AND 
    auth.user_role() IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  );

-- Vehicle Damages Policies
CREATE POLICY "Vehicle damages are viewable by organization members" ON vehicle_damages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM vehicles 
      WHERE vehicles.id = vehicle_damages.vehicle_id 
      AND vehicles.organization_id = auth.organization_id()
    )
  );

CREATE POLICY "Vehicle damages are manageable by staff" ON vehicle_damages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM vehicles 
      WHERE vehicles.id = vehicle_damages.vehicle_id 
      AND vehicles.organization_id = auth.organization_id()
    ) AND 
    auth.user_role() IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF')
  );

-- Maintenance Records Policies
CREATE POLICY "Maintenance records are viewable by organization members" ON maintenance_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM vehicles 
      WHERE vehicles.id = maintenance_records.vehicle_id 
      AND vehicles.organization_id = auth.organization_id()
    )
  );

CREATE POLICY "Maintenance records are manageable by staff" ON maintenance_records
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM vehicles 
      WHERE vehicles.id = maintenance_records.vehicle_id 
      AND vehicles.organization_id = auth.organization_id()
    ) AND 
    auth.user_role() IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF')
  );

-- Activity Logs Policies
CREATE POLICY "Activity logs are viewable by managers" ON activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = activity_logs.user_id 
      AND users.organization_id = auth.organization_id()
    ) AND 
    auth.user_role() IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  );

CREATE POLICY "Activity logs are insertable by system" ON activity_logs
  FOR INSERT WITH CHECK (true);

-- Customer Documents Policies
CREATE POLICY "Customer documents are viewable by staff" ON customer_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM customers 
      WHERE customers.id = customer_documents.customer_id 
      AND customers.organization_id = auth.organization_id()
    )
  );

CREATE POLICY "Customer documents are manageable by staff" ON customer_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM customers 
      WHERE customers.id = customer_documents.customer_id 
      AND customers.organization_id = auth.organization_id()
    ) AND 
    auth.user_role() IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF')
  );

-- Additional Drivers Policies
CREATE POLICY "Additional drivers are viewable by staff" ON additional_drivers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM contracts 
      WHERE contracts.id = additional_drivers.contract_id 
      AND contracts.organization_id = auth.organization_id()
    )
  );

CREATE POLICY "Additional drivers are manageable by staff" ON additional_drivers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM contracts 
      WHERE contracts.id = additional_drivers.contract_id 
      AND contracts.organization_id = auth.organization_id()
    ) AND 
    auth.user_role() IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF')
  );