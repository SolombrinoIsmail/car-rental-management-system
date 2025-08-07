# Story 7: Vehicle Preparation Workflow

## Story Information
- **Story ID:** CRMS-E9-S7
- **Epic:** 9 - Operational Edge Cases
- **Story Points:** 3

## User Story
**As a** rental staff member  
**I want to** prepare returned vehicles systematically for the next rental  
**So that** vehicles meet quality standards, customer expectations are exceeded, and operational efficiency is maintained

## Detailed Acceptance Criteria

1. **Systematic Cleaning Checklist**
   - Digital checklist with exterior wash, interior vacuum, and sanitization steps
   - Photo documentation requirements for before/after cleaning validation
   - Quality scoring system with pass/fail criteria for each cleaning stage
   - Time tracking for cleaning procedures to optimize workflow efficiency

2. **Fuel Level Verification**
   - Digital fuel gauge reading with photo documentation
   - Comparison with customer-returned fuel level from rental agreement
   - Automatic fuel charge calculation and billing for shortfalls
   - Fuel receipt tracking for company refueling operations

3. **Personal Item Removal Protocol**
   - Systematic search checklist for all vehicle compartments and storage areas
   - Lost and found item logging with customer contact procedures
   - Photo documentation of items found with secure storage tracking
   - Customer notification and item return coordination process

4. **Comprehensive Damage Inspection**
   - Vehicle walk-around inspection with digital damage mapping
   - Photo documentation of all exterior and interior damage
   - Comparison with pre-rental condition reports for new damage identification
   - Damage severity assessment and repair cost estimation

5. **Supply Restocking Procedures**
   - Inventory check for required vehicle supplies (registration, insurance cards, manuals)
   - Emergency kit validation (first aid, flashlight, tools, spare tire)
   - Comfort amenities restocking (tissues, sanitizer, air fresheners)
   - Technology accessory verification (charging cables, GPS units, toll transponders)

6. **Quality Verification Standards**
   - Multi-point inspection checklist covering safety, cleanliness, and functionality
   - Supervisor spot-check requirements for quality assurance
   - Customer-ready status confirmation with final approval signature
   - Failed inspection procedures with re-preparation workflows

7. **Maintenance Alert Integration**
   - Automatic maintenance due date checking based on mileage and time intervals
   - Integration with maintenance scheduling system for upcoming service needs
   - Warning flags for vehicles approaching service intervals
   - Preventive maintenance recommendations based on vehicle usage patterns

8. **Technology Systems Check**
   - Infotainment system reset and customer data clearing procedures
   - GPS navigation system update and functionality verification
   - Mobile device connectivity testing and Bluetooth pairing reset
   - Dashboard warning light inspection and diagnostic code checking

9. **Vehicle Status Management**
   - Real-time status updates from "Returned" to "Cleaning" to "Ready" states
   - Availability updates for reservation system integration
   - Priority queue management for high-demand vehicle classes
   - Staff workload balancing and task assignment optimization

10. **Performance Metrics Tracking**
    - Preparation time measurement for efficiency analysis
    - Quality score tracking for individual staff and overall performance
    - Customer satisfaction correlation with preparation quality scores
    - Cost per preparation analysis including supplies and labor

11. **Exception Handling Procedures**
    - Workflow for vehicles requiring extensive cleaning or detailing
    - Damage discovery procedures requiring maintenance or repair
    - Customer complaint resolution for preparation quality issues
    - Equipment malfunction procedures and backup preparation methods

12. **Staff Training Integration**
    - Interactive training modules for new staff on preparation standards
    - Skill assessment and certification tracking for preparation tasks
    - Best practice sharing and continuous improvement feedback loops
    - Performance coaching and quality improvement planning

## Technical Implementation Notes

### Backend Services
- `VehiclePreparationService`: Manages the complete preparation workflow
- `QualityAssuranceService`: Handles inspection and quality verification
- `InventoryManagementService`: Tracks supplies and restocking needs
- `MaintenanceAlertService`: Integrates with maintenance scheduling
- `PerformanceTrackingService`: Collects and analyzes preparation metrics

### Data Models
```sql
vehicle_preparations (
  id, vehicle_id, returned_rental_id, preparation_date,
  assigned_staff_id, started_at, completed_at,
  cleaning_score, inspection_score, overall_score,
  items_found, damage_discovered, maintenance_due,
  status, supervisor_approved, approved_by_user_id
)

preparation_checklists (
  id, preparation_id, checklist_item, category,
  completed, completion_time, quality_rating,
  notes, photo_url, completed_by_user_id
)
```

### State Machine
Assigned → In Progress → Cleaning → Inspection → Restocking → Quality Check → Approved → Ready

## API Endpoints

### Preparation Management
- `POST /api/vehicles/{id}/preparation/start` - Begin vehicle preparation
- `GET /api/vehicles/{id}/preparation/checklist` - Get preparation tasks
- `POST /api/vehicles/{id}/preparation/complete-item` - Mark checklist item done
- `POST /api/vehicles/{id}/preparation/photos` - Upload preparation photos
- `POST /api/vehicles/{id}/preparation/complete` - Finish preparation process
- `GET /api/vehicles/{id}/preparation/status` - Check preparation progress

### Quality Assurance
- `POST /api/vehicles/{id}/preparation/quality-check` - Submit quality inspection
- `GET /api/vehicles/{id}/preparation/quality-score` - Get quality metrics
- `POST /api/vehicles/{id}/preparation/supervisor-approval` - Supervisor sign-off

### Performance Analytics
- `GET /api/preparation/staff-performance` - Staff preparation metrics
- `GET /api/preparation/time-analysis` - Preparation time analytics
- `GET /api/preparation/quality-trends` - Quality score trending

### Inventory Integration
- `GET /api/preparation/supply-levels` - Check supply inventory
- `POST /api/preparation/restock-request` - Request supply replenishment
- `GET /api/preparation/supply-usage` - Track supply consumption

## Database Schema Requirements

### New Tables
```sql
CREATE TABLE vehicle_preparations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  preparation_number VARCHAR(20) UNIQUE NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) NOT NULL,
  returned_rental_id UUID REFERENCES rentals(id),
  preparation_date DATE DEFAULT CURRENT_DATE,
  assigned_staff_id UUID REFERENCES users(id) NOT NULL,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  estimated_duration INTEGER, -- minutes
  actual_duration INTEGER, -- minutes
  cleaning_score INTEGER CHECK (cleaning_score >= 1 AND cleaning_score <= 5),
  inspection_score INTEGER CHECK (inspection_score >= 1 AND inspection_score <= 5),
  overall_score INTEGER CHECK (overall_score >= 1 AND overall_score <= 5),
  items_found JSONB, -- lost items discovered
  damage_discovered JSONB, -- new damage found
  maintenance_due BOOLEAN DEFAULT false,
  maintenance_notes TEXT,
  supply_issues TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'assigned',
  supervisor_approved BOOLEAN DEFAULT false,
  approved_by_user_id UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  customer_ready BOOLEAN DEFAULT false,
  priority_level VARCHAR(10) DEFAULT 'normal', -- low, normal, high, urgent
  preparation_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE preparation_checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  preparation_id UUID REFERENCES vehicle_preparations(id) NOT NULL,
  category VARCHAR(30) NOT NULL, -- cleaning, inspection, restocking, maintenance
  item_name VARCHAR(100) NOT NULL,
  item_description TEXT,
  required BOOLEAN DEFAULT true,
  sequence_order INTEGER,
  estimated_minutes INTEGER,
  completed BOOLEAN DEFAULT false,
  completion_time TIMESTAMP,
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  notes TEXT,
  photo_required BOOLEAN DEFAULT false,
  photo_url VARCHAR(500),
  completed_by_user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lost_items_found (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  preparation_id UUID REFERENCES vehicle_preparations(id) NOT NULL,
  item_description TEXT NOT NULL,
  found_location VARCHAR(100), -- front_seat, trunk, glove_box, etc.
  photo_url VARCHAR(500),
  customer_contacted BOOLEAN DEFAULT false,
  customer_contact_date DATE,
  item_returned BOOLEAN DEFAULT false,
  return_date DATE,
  disposal_date DATE,
  found_by_user_id UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE preparation_supplies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supply_name VARCHAR(100) NOT NULL,
  supply_type VARCHAR(30) NOT NULL, -- cleaning, safety, comfort, technology
  current_inventory INTEGER DEFAULT 0,
  minimum_threshold INTEGER DEFAULT 10,
  cost_per_unit DECIMAL(6,2),
  supplier_name VARCHAR(100),
  last_restocked DATE,
  active BOOLEAN DEFAULT true
);

CREATE TABLE preparation_supply_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  preparation_id UUID REFERENCES vehicle_preparations(id) NOT NULL,
  supply_id UUID REFERENCES preparation_supplies(id) NOT NULL,
  quantity_used INTEGER NOT NULL,
  usage_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  used_by_user_id UUID REFERENCES users(id) NOT NULL
);
```

### Schema Updates
- Add `last_preparation_date` to vehicles table
- Add `preparation_count` to vehicles table for tracking
- Add `average_preparation_time` to users table for performance metrics

## UI/UX Considerations

### Mobile-First Checklist Interface
- Large, touch-friendly checkboxes for easy completion
- Progressive disclosure showing next steps as current ones complete
- Photo capture integration with automatic GPS and timestamp
- Voice notes capability for hands-free documentation

### Visual Quality Assessment
- Before/after photo comparison interface
- Color-coded quality scoring with visual indicators
- Damage marking on interactive vehicle diagrams
- Quick access to previous preparation reports for comparison

### Workflow Optimization Dashboard
- Real-time preparation queue with priority indicators
- Staff workload balancing with task assignment suggestions
- Performance metrics display with individual and team scores
- Supply level monitoring with automated reorder alerts

### Supervisor Oversight Interface
- Quality score trending with drill-down capability
- Staff performance comparison and coaching tools
- Customer complaint correlation with preparation quality
- Random quality audit assignment and tracking

## Testing Scenarios

### Scenario 1: Standard Vehicle Preparation
**Given:** Economy vehicle returned in normal condition
**When:** Staff completes full preparation workflow
**Then:** All checklist items completed, quality scores recorded, vehicle status updated to "Ready"

### Scenario 2: Vehicle with Lost Items
**Given:** Customer items found during cleaning process
**When:** Staff logs items and initiates customer contact
**Then:** Items photographed and stored, customer notified, return process tracked

### Scenario 3: Damage Discovery During Inspection
**Given:** New damage found that wasn't present at rental start
**When:** Staff documents damage and assesses severity
**Then:** Previous renter charged, repair estimate obtained, vehicle status updated appropriately

### Scenario 4: Maintenance Due Alert
**Given:** Vehicle preparation triggers maintenance due warning
**When:** Staff reviews maintenance requirements
**Then:** Maintenance scheduled, vehicle held from rental, fleet management notified

### Scenario 5: Failed Quality Inspection
**Given:** Vehicle preparation doesn't meet quality standards
**When:** Supervisor conducts quality check
**Then:** Re-preparation assigned, quality issues documented, staff coaching triggered

### Scenario 6: Supply Shortage During Preparation
**Given:** Cleaning supplies run low during preparation
**When:** Staff attempts to restock vehicle amenities
**Then:** Supply shortage flagged, reorder triggered, preparation completed with available items

### Scenario 7: Rush Preparation for VIP Customer
**Given:** High-priority customer reservation requires immediate vehicle
**When:** Staff receives urgent preparation assignment
**Then:** Expedited workflow completed, quality maintained, VIP standards met

### Scenario 8: Technology System Issues
**Given:** Vehicle infotainment system has customer data remaining
**When:** Staff performs technology reset procedures
**Then:** All personal data cleared, system functionality verified, privacy compliance confirmed

## Definition of Done

- [ ] Digital preparation checklist system operational
- [ ] Photo documentation and quality scoring implemented
- [ ] Lost item logging and customer notification system working
- [ ] Damage inspection with vehicle diagram marking functionality
- [ ] Supply inventory tracking with automated reordering
- [ ] Quality verification with supervisor approval workflow
- [ ] Performance metrics tracking for staff and operations
- [ ] Maintenance alert integration with scheduling system
- [ ] Mobile-responsive interface optimized for tablet use
- [ ] Real-time vehicle status updates integrated with fleet management
- [ ] Staff training modules with skill assessment capability
- [ ] Exception handling procedures for non-standard situations
- [ ] Integration with existing rental and customer management systems
- [ ] Performance testing (preparation completion <45 minutes)
- [ ] User acceptance testing with operations staff
- [ ] Quality assurance procedures validated with management

## Dependencies
- Vehicle fleet management system
- Maintenance scheduling system
- Supply inventory management system  
- Customer notification service
- Photo storage and management service
- Staff training and certification platform

## Risks and Mitigation
- **Risk:** Preparation quality inconsistency affecting customer satisfaction
  - **Mitigation:** Standardized checklists and supervisor quality audits
- **Risk:** Staff rushing through preparation to meet demand
  - **Mitigation:** Time standards with quality score requirements and performance monitoring
- **Risk:** Supply shortages disrupting preparation workflow
  - **Mitigation:** Automated inventory monitoring with safety stock levels
- **Risk:** Lost customer items creating liability and service issues
  - **Mitigation:** Systematic search procedures with photo documentation and secure storage