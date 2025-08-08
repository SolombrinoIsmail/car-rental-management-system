# Story 4: Maintenance Management

**Story ID:** EPIC-02-STORY-04  
**Epic:** Fleet Management System  
**Priority:** High  
**Story Points:** 6

## User Story Statement

**As an** owner  
**I want to** track and manage vehicle maintenance schedules, costs, and service history  
**So that** my fleet remains safe, reliable, and compliant while minimizing unexpected breakdowns
and maximizing vehicle lifespan

## Detailed Acceptance Criteria

1. **Maintenance Scheduling System**
   - System shall allow setting maintenance schedules based on mileage intervals (e.g., every 5,000
     km)
   - System shall support time-based maintenance schedules (e.g., every 6 months)
   - System shall combine mileage and time criteria for comprehensive scheduling
   - System shall automatically calculate next maintenance due dates

2. **Automated Maintenance Alerts**
   - System shall generate alerts when vehicles approach maintenance due dates (30, 15, 7 days)
   - System shall trigger immediate alerts when maintenance is overdue
   - System shall send notifications via email and in-app alerts
   - System shall escalate alerts to management for overdue maintenance

3. **Maintenance Flagging and Blocking**
   - System shall allow manual flagging of vehicles requiring immediate maintenance
   - System shall automatically block flagged vehicles from new rental assignments
   - System shall provide emergency override capability with management approval
   - System shall maintain separate statuses for different maintenance types

4. **Service History Tracking**
   - System shall record detailed maintenance history for each vehicle
   - System shall track service provider information and contact details
   - System shall store maintenance documentation (receipts, service reports, photos)
   - System shall maintain warranty information and claim history

5. **Cost Management and Tracking**
   - System shall record all maintenance costs categorized by service type
   - System shall track labor costs, parts costs, and external service fees
   - System shall calculate total cost of ownership per vehicle
   - System shall generate cost reports by vehicle, time period, and service type

6. **Maintenance Types and Categories**
   - System shall support different maintenance categories (preventive, corrective, emergency)
   - System shall handle routine services (oil change, tire rotation, inspection)
   - System shall manage major repairs and component replacements
   - System shall track regulatory inspections and certifications

7. **Service Provider Management**
   - System shall maintain database of approved service providers
   - System shall track provider ratings and performance metrics
   - System shall store provider contact information and service capabilities
   - System shall support preferred provider assignments by maintenance type

8. **Availability Integration**
   - System shall automatically block availability during scheduled maintenance
   - System shall provide estimated service completion times
   - System shall allow reservation of vehicles post-maintenance
   - System shall update availability immediately upon maintenance completion

9. **Compliance and Regulatory Tracking**
   - System shall track mandatory inspections and certifications
   - System shall alert for expiring regulatory compliance items
   - System shall maintain documentation for audit purposes
   - System shall support different compliance requirements by vehicle type/location

10. **Maintenance Workflow Management**
    - System shall support approval workflow for maintenance requests
    - System shall allow scheduling of maintenance appointments
    - System shall track maintenance status through completion
    - System shall provide photo documentation capability for maintenance issues

11. **Reporting and Analytics**
    - System shall generate maintenance cost reports by vehicle and fleet
    - System shall provide maintenance frequency analysis
    - System shall track average time between failures (MTBF)
    - System shall identify high-maintenance vehicles for fleet optimization

12. **Mobile Maintenance Support**
    - System shall support mobile photo capture for maintenance issues
    - System shall allow field updates of maintenance status
    - System shall provide offline capability for maintenance records
    - System shall support barcode scanning for parts inventory tracking

## Technical Implementation Notes

### Database Schema Requirements

```sql
-- Maintenance schedules table
CREATE TABLE maintenance_schedules (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT REFERENCES vehicles(id),
    maintenance_type VARCHAR(50), -- oil_change, inspection, tire_rotation, etc.
    interval_type VARCHAR(20), -- mileage, time, combined
    mileage_interval INTEGER, -- kilometers
    time_interval INTEGER, -- days
    last_service_date DATE,
    last_service_mileage INTEGER,
    next_due_date DATE,
    next_due_mileage INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Maintenance records table
CREATE TABLE maintenance_records (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT REFERENCES vehicles(id),
    maintenance_type VARCHAR(50),
    service_date DATE,
    service_mileage INTEGER,
    service_provider_id BIGINT REFERENCES service_providers(id),
    labor_cost DECIMAL(10,2),
    parts_cost DECIMAL(10,2),
    external_cost DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    description TEXT,
    warranty_expiry DATE,
    next_service_due DATE,
    status VARCHAR(20), -- scheduled, in_progress, completed, cancelled
    created_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Maintenance documents table
CREATE TABLE maintenance_documents (
    id BIGSERIAL PRIMARY KEY,
    maintenance_record_id BIGINT REFERENCES maintenance_records(id),
    document_type VARCHAR(50), -- receipt, service_report, photo, warranty
    file_path VARCHAR(500),
    file_name VARCHAR(200),
    uploaded_at TIMESTAMP DEFAULT NOW(),
    uploaded_by BIGINT REFERENCES users(id)
);

-- Service providers table
CREATE TABLE service_providers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    specialties TEXT[], -- array of service types
    rating DECIMAL(3,2), -- 1.00 to 5.00
    is_preferred BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Maintenance alerts table
CREATE TABLE maintenance_alerts (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT REFERENCES vehicles(id),
    maintenance_type VARCHAR(50),
    alert_type VARCHAR(20), -- due_soon, overdue, urgent
    alert_date DATE,
    due_date DATE,
    message TEXT,
    is_acknowledged BOOLEAN DEFAULT false,
    acknowledged_by BIGINT REFERENCES users(id),
    acknowledged_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Vehicle maintenance status
CREATE TABLE vehicle_maintenance_status (
    vehicle_id BIGINT PRIMARY KEY REFERENCES vehicles(id),
    is_flagged_for_maintenance BOOLEAN DEFAULT false,
    maintenance_priority VARCHAR(20), -- low, medium, high, urgent
    flagged_by BIGINT REFERENCES users(id),
    flagged_at TIMESTAMP,
    estimated_completion_date DATE,
    blocking_reason TEXT,
    override_authorized_by BIGINT REFERENCES users(id)
);
```

### API Endpoints Needed

- `GET /api/maintenance/schedules/{vehicleId}` - Get maintenance schedule for vehicle
- `POST /api/maintenance/schedules` - Create maintenance schedule
- `PUT /api/maintenance/schedules/{id}` - Update maintenance schedule
- `GET /api/maintenance/records/{vehicleId}` - Get maintenance history
- `POST /api/maintenance/records` - Create maintenance record
- `PUT /api/maintenance/records/{id}` - Update maintenance record
- `GET /api/maintenance/alerts` - Get maintenance alerts
- `POST /api/maintenance/alerts/{id}/acknowledge` - Acknowledge alert
- `GET /api/maintenance/providers` - Get service providers list
- `POST /api/maintenance/flag/{vehicleId}` - Flag vehicle for maintenance
- `DELETE /api/maintenance/flag/{vehicleId}` - Remove maintenance flag
- `GET /api/maintenance/costs/report` - Generate cost reports
- `POST /api/maintenance/documents` - Upload maintenance documents

### UI/UX Considerations

1. **Maintenance Dashboard**
   - Overview of fleet maintenance status
   - Alert summary with priority indicators
   - Upcoming maintenance calendar
   - Cost tracking widgets

2. **Maintenance Scheduling Interface**
   - Intuitive schedule setup forms
   - Calendar integration for appointment scheduling
   - Drag-and-drop maintenance planning
   - Bulk scheduling capabilities

3. **Service History Display**
   - Chronological maintenance timeline
   - Document viewer for receipts and reports
   - Photo gallery for maintenance documentation
   - Cost breakdown visualizations

4. **Mobile Maintenance App**
   - Photo capture for maintenance issues
   - Quick status updates
   - Barcode scanning for parts tracking
   - Offline synchronization

## Testing Scenarios

1. **Maintenance Scheduling**
   - Create mileage-based maintenance schedule for vehicle
   - Create time-based maintenance schedule
   - Test combined mileage and time criteria
   - Verify automatic due date calculations

2. **Alert System Testing**
   - Set up maintenance due in 7 days, verify alert generation
   - Test overdue maintenance alert escalation
   - Verify email and in-app notification delivery
   - Test alert acknowledgment workflow

3. **Maintenance Flagging**
   - Flag vehicle for urgent maintenance
   - Verify automatic availability blocking
   - Test emergency override functionality
   - Confirm flag removal restores availability

4. **Cost Tracking Validation**
   - Record maintenance with various cost categories
   - Generate cost reports by vehicle and time period
   - Test cost calculation accuracy
   - Verify warranty tracking functionality

5. **Service History Management**
   - Create complete maintenance record with documents
   - Upload photos and receipts
   - Test document retrieval and viewing
   - Verify maintenance history chronology

6. **Integration Testing**
   - Schedule maintenance and verify calendar blocking
   - Complete maintenance and verify availability restoration
   - Test real-time status updates
   - Verify cross-system data consistency

7. **Compliance Tracking**
   - Set up regulatory inspection requirements
   - Test compliance alert generation
   - Verify documentation storage for audits
   - Test compliance reporting features

8. **Mobile Functionality**
   - Test photo capture for maintenance issues
   - Verify offline record creation and sync
   - Test barcode scanning accuracy
   - Validate mobile status updates

## Definition of Done

- [ ] Maintenance scheduling system implemented and tested
- [ ] Automated alert generation functioning correctly
- [ ] Vehicle flagging and availability blocking working
- [ ] Service history tracking with document management
- [ ] Cost tracking and reporting system operational
- [ ] Service provider management implemented
- [ ] Compliance and regulatory tracking functional
- [ ] Mobile maintenance interface deployed
- [ ] API endpoints documented and tested
- [ ] Unit tests covering maintenance logic (85%+ coverage)
- [ ] Integration with availability system verified
- [ ] User acceptance testing completed
- [ ] Performance benchmarks met
- [ ] Security testing passed
- [ ] Training materials created

## Dependencies

- Vehicle registry system (Story 1)
- Real-time availability tracking (Story 3)
- Document storage system
- Email notification service
- Mobile app framework
- Reporting and analytics infrastructure

## Risks and Mitigation

**Risk:** Complex maintenance scheduling causing system performance issues  
**Mitigation:** Implement efficient background job processing for schedule calculations  
**Contingency:** Manual maintenance scheduling with notification reminders

**Risk:** Integration with availability system causing booking conflicts  
**Mitigation:** Implement robust transaction handling and rollback mechanisms  
**Contingency:** Manual availability blocking with alerts for maintenance

**Risk:** Mobile app synchronization failures causing data loss  
**Mitigation:** Implement robust offline storage and conflict resolution  
**Contingency:** Web-based mobile interface as fallback option

## Estimated Effort: 6 Story Points

**Breakdown:**

- Database schema design and setup: 1 day
- Maintenance scheduling engine: 1.5 days
- Service history and documentation system: 1.5 days
- Alert and notification system: 1 day
- Cost tracking and reporting: 1 day
- Mobile interface development: 1.5 days
- Integration testing and optimization: 1.5 days

**Total:** 9 developer days
