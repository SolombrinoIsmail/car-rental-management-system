# Story 4: Accident Reporting

## Story Information
- **Story ID:** CRMS-E9-S4
- **Epic:** 9 - Operational Edge Cases
- **Story Points:** 8

## User Story
**As a** rental staff member  
**I want to** document vehicle accidents thoroughly and systematically  
**So that** insurance claims are properly supported, legal requirements are met, and business liability is minimized

## Detailed Acceptance Criteria

1. **Comprehensive Incident Capture**
   - System collects all essential accident details (date, time, location, weather conditions)
   - Multiple photo uploads with automatic GPS tagging and timestamps
   - Damage assessment with vehicle diagram for marking damage locations
   - Severity classification (minor, moderate, major, total loss) with cost estimates

2. **Police Report Integration**
   - Police report number capture and validation
   - Officer name and badge number recording
   - Citation information if applicable
   - Integration with local police databases where available

3. **Insurance Information Management**
   - Customer's personal insurance details verification
   - Rental insurance coverage confirmation and policy details
   - Third-party insurance information collection
   - Automatic claim number generation and tracking

4. **Multi-Party Documentation**
   - Other driver(s) information collection (license, insurance, contact)
   - Passenger information for all vehicles involved
   - Witness contact information and statement recording
   - Emergency contact notifications for all parties

5. **Timeline Construction**
   - Chronological event timeline with before/during/after phases
   - Customer statement recording (voice or text)
   - Automated timeline from available data sources
   - Discrepancy identification between different accounts

6. **Medical Incident Tracking**
   - Injury assessment and medical attention requirements
   - Hospital/medical facility information if applicable
   - Medical bill tracking and insurance coordination
   - Follow-up medical status monitoring

7. **Insurance Package Generation**
   - Automated report compilation for insurance submission
   - Required forms pre-populated with collected data
   - Photo packages organized by damage type and angle
   - Timeline reports with all supporting documentation

8. **Legal Compliance Assurance**
   - State-specific reporting requirement validation
   - DMV notification triggers for serious accidents
   - Legal counsel notification for liability concerns
   - Regulatory reporting automation where required

9. **Vehicle Status Management**
   - Immediate vehicle deactivation from rental fleet
   - Damage assessment and repair estimate integration
   - Towing and storage facility coordination
   - Rental replacement vehicle assignment

10. **Customer Communication Strategy**
    - Immediate accident response instructions via mobile app
    - Step-by-step guidance for on-scene documentation
    - Regular status updates throughout claims process
    - Billing and liability explanation communications

11. **Financial Impact Assessment**
    - Real-time cost estimation for damages and liability
    - Insurance deductible calculations and customer billing
    - Lost revenue calculation for vehicle downtime
    - Legal cost provisioning for complex cases

12. **Quality Assurance Measures**
    - Mandatory field validation for critical information
    - Photo quality assessment with retake requirements
    - Completeness scoring with missing information alerts
    - Manager review requirements for high-severity accidents

## Technical Implementation Notes

### Backend Services
- `AccidentReportService`: Core accident documentation and workflow management
- `InsuranceClaimsService`: Handles insurance integration and claim processing
- `TimelineService`: Constructs and manages event chronologies
- `PhotoManagementService`: Organizes and processes accident photography
- `LegalComplianceService`: Ensures regulatory requirement adherence
- `CostAssessmentService`: Calculates financial impacts and liability

### Data Models
```sql
accident_reports (
  id, incident_number, rental_id, vehicle_id, customer_id,
  accident_datetime, location_address, gps_coordinates,
  weather_conditions, road_conditions, severity_level,
  police_report_number, officer_name, citations_issued,
  customer_statement, staff_notes, total_estimated_cost,
  status, created_by_user_id, created_at
)

accident_parties (
  id, accident_id, party_type, driver_name, license_number,
  insurance_company, policy_number, vehicle_info,
  contact_phone, contact_email, injuries_reported
)

accident_photos (
  id, accident_id, photo_url, photo_type, description,
  gps_coordinates, timestamp, uploaded_by_user_id
)
```

### State Machine
Reported → Documented → Photos Collected → Police Filed → Insurance Notified → Under Investigation → Claim Submitted → Resolved → Closed

## API Endpoints

### Incident Management
- `POST /api/accidents/report` - Create new accident report
- `GET /api/accidents/{id}` - Retrieve accident details
- `PUT /api/accidents/{id}/update` - Update accident information
- `POST /api/accidents/{id}/photos` - Upload accident photos
- `GET /api/accidents/{id}/timeline` - Get accident timeline
- `POST /api/accidents/{id}/submit-claim` - Submit insurance claim

### Legal and Compliance
- `POST /api/accidents/{id}/police-report` - Record police report details
- `GET /api/accidents/{id}/compliance-status` - Check regulatory compliance
- `POST /api/accidents/{id}/legal-review` - Request legal review

### Insurance Integration
- `POST /api/insurance/claims/create` - Create insurance claim
- `GET /api/insurance/claims/{id}/status` - Check claim status
- `POST /api/insurance/claims/{id}/documents` - Submit supporting documents

### Reporting and Analytics
- `GET /api/accidents/reports/summary` - Get accident statistics
- `GET /api/accidents/reports/financial-impact` - Cost analysis reports
- `POST /api/accidents/reports/export` - Export accident data

## Database Schema Requirements

### New Tables
```sql
CREATE TABLE accident_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_number VARCHAR(20) UNIQUE NOT NULL,
  rental_id UUID REFERENCES rentals(id) NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) NOT NULL,
  customer_id UUID REFERENCES customers(id) NOT NULL,
  accident_datetime TIMESTAMP NOT NULL,
  location_address TEXT,
  gps_coordinates POINT,
  weather_conditions VARCHAR(50),
  road_conditions VARCHAR(50),
  severity_level VARCHAR(20) NOT NULL, -- minor, moderate, major, total_loss
  police_called BOOLEAN DEFAULT false,
  police_report_number VARCHAR(50),
  officer_name VARCHAR(100),
  officer_badge VARCHAR(20),
  citations_issued TEXT[],
  customer_statement TEXT,
  staff_notes TEXT,
  estimated_repair_cost DECIMAL(12,2),
  estimated_liability DECIMAL(12,2),
  total_estimated_cost DECIMAL(12,2),
  status VARCHAR(30) NOT NULL DEFAULT 'reported',
  created_by_user_id UUID REFERENCES users(id) NOT NULL,
  assigned_to_user_id UUID REFERENCES users(id),
  manager_reviewed BOOLEAN DEFAULT false,
  manager_reviewed_by UUID REFERENCES users(id),
  manager_reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accident_parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accident_id UUID REFERENCES accident_reports(id) NOT NULL,
  party_type VARCHAR(20) NOT NULL, -- customer, third_party, witness
  party_role VARCHAR(20), -- driver, passenger, pedestrian, witness
  full_name VARCHAR(200),
  driver_license_number VARCHAR(50),
  driver_license_state VARCHAR(2),
  insurance_company VARCHAR(100),
  insurance_policy_number VARCHAR(50),
  vehicle_make VARCHAR(50),
  vehicle_model VARCHAR(50),
  vehicle_year INTEGER,
  vehicle_license_plate VARCHAR(20),
  contact_phone VARCHAR(20),
  contact_email VARCHAR(100),
  injuries_reported BOOLEAN DEFAULT false,
  injury_description TEXT,
  medical_facility VARCHAR(200),
  statement TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accident_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accident_id UUID REFERENCES accident_reports(id) NOT NULL,
  photo_url VARCHAR(500) NOT NULL,
  photo_type VARCHAR(30) NOT NULL, -- damage, scene, documents, other
  damage_location VARCHAR(100), -- front_bumper, driver_side, etc.
  description TEXT,
  gps_coordinates POINT,
  photo_timestamp TIMESTAMP,
  file_size_bytes INTEGER,
  uploaded_by_user_id UUID REFERENCES users(id) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE insurance_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accident_id UUID REFERENCES accident_reports(id) NOT NULL,
  claim_number VARCHAR(50) UNIQUE NOT NULL,
  insurance_company VARCHAR(100) NOT NULL,
  policy_number VARCHAR(50),
  claim_type VARCHAR(30), -- collision, comprehensive, liability
  claim_amount DECIMAL(12,2),
  deductible_amount DECIMAL(10,2),
  status VARCHAR(30) NOT NULL DEFAULT 'submitted',
  adjuster_name VARCHAR(100),
  adjuster_phone VARCHAR(20),
  adjuster_email VARCHAR(100),
  settlement_amount DECIMAL(12,2),
  settlement_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Schema Updates
- Add `accident_history_count` to vehicles table
- Add `accident_involvement_count` to customers table
- Add `last_accident_date` to both vehicles and customers tables

## UI/UX Considerations

### Mobile-First Accident Reporting
- Large, touch-friendly buttons for emergency situations
- Voice-to-text capability for hands-free note taking
- Offline capability with sync when connection restored
- GPS auto-location with manual override option

### Photo Documentation Interface
- Guided photo checklist (front, rear, sides, interior, other vehicles)
- Automatic damage area marking on vehicle diagrams
- Photo quality validation with retake prompts
- Batch photo upload with progress indicators

### Timeline and Workflow Management
- Visual timeline with drag-and-drop event ordering
- Color-coded status indicators for different workflow stages
- Quick action buttons for common next steps
- Integration with calendar for follow-up scheduling

### Dashboard and Reporting
- Real-time accident statistics and trends
- Heat map visualization of accident locations
- Financial impact tracking with insurance recovery metrics
- Priority queue for accidents requiring immediate attention

## Testing Scenarios

### Scenario 1: Minor Fender Bender
**Given:** Customer involved in parking lot collision with minimal damage
**When:** Staff creates accident report with photos and details
**Then:** Report generated, insurance notified, repair estimate requested, customer informed

### Scenario 2: Multi-Vehicle Accident with Injuries
**Given:** Serious accident involving rental vehicle, third party, and reported injuries
**When:** Staff documents scene with multiple parties and police involvement
**Then:** Police report filed, medical information tracked, legal review triggered, insurance claims initiated

### Scenario 3: Hit-and-Run Incident
**Given:** Rental vehicle damaged while parked, other party fled scene
**When:** Customer reports damage upon return to vehicle
**Then:** Police report filed for hit-and-run, comprehensive insurance claim initiated, witness canvas requested

### Scenario 4: Customer Disputes Accident Liability
**Given:** Customer claims other party at fault but police report suggests otherwise
**When:** Insurance investigation reveals conflicting accounts
**Then:** Legal review triggered, detailed timeline constructed, additional evidence gathering initiated

### Scenario 5: Accident in Remote Location
**Given:** Accident occurs in area with poor cell coverage
**When:** Staff uses mobile app offline mode for documentation
**Then:** Information stored locally, synced when connection restored, all parties notified

### Scenario 6: Late-Reported Accident
**Given:** Customer reports accident 24 hours after occurrence
**When:** Staff begins documentation process
**Then:** Late reporting noted, insurance impact assessed, additional verification required

### Scenario 7: Total Loss Accident
**Given:** Rental vehicle declared total loss after severe accident
**When:** Staff processes total loss procedures
**Then:** Vehicle removed from fleet, insurance claim for full value, customer liability assessed

### Scenario 8: Fraudulent Accident Claim
**Given:** Suspicious accident report with inconsistent details
**When:** System flags potential fraud indicators
**Then:** Special investigation unit notified, additional evidence required, claim processing suspended

## Definition of Done

- [ ] Comprehensive accident reporting form with all required fields
- [ ] Multi-photo upload system with GPS tagging and quality validation
- [ ] Police report integration and validation system
- [ ] Insurance company integration for automated claim submission
- [ ] Timeline construction tool with chronological event ordering
- [ ] Multi-party information collection with relationship mapping
- [ ] Vehicle damage assessment with visual diagram marking
- [ ] Cost estimation engine for repairs and liability
- [ ] Legal compliance checking for state-specific requirements
- [ ] Mobile-responsive interface optimized for emergency use
- [ ] Offline capability with data synchronization
- [ ] Manager approval workflow for high-severity accidents
- [ ] Customer notification system with status updates
- [ ] Integration with vehicle management system for status updates
- [ ] Audit trail maintaining complete accident history
- [ ] Performance testing (report creation <3 minutes)
- [ ] Security review for sensitive personal information handling
- [ ] User acceptance testing with insurance and legal teams

## Dependencies
- Photo storage and management service
- GPS and mapping services
- Insurance company API integrations
- Police report database access (where available)
- Vehicle management system integration
- Customer notification service
- Legal document management system

## Risks and Mitigation
- **Risk:** Incomplete accident documentation affecting insurance claims
  - **Mitigation:** Mandatory field validation and completeness scoring
- **Risk:** Legal liability from inadequate reporting
  - **Mitigation:** Legal team review of reporting procedures and compliance checks
- **Risk:** Customer privacy concerns with extensive data collection
  - **Mitigation:** Clear privacy policy and consent procedures
- **Risk:** System unavailable during emergency situations
  - **Mitigation:** Offline capability and paper backup procedures