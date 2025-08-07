# Story 3: Vehicle Swap Mid-Rental

## Story Information
- **Story ID:** CRMS-E9-S3
- **Epic:** 9 - Operational Edge Cases
- **Story Points:** 5

## User Story
**As a** rental staff member  
**I want to** swap vehicles during an active rental period  
**So that** customers can continue their rental without interruption when the original vehicle becomes unavailable

## Detailed Acceptance Criteria

1. **Swap Reason Documentation**
   - System provides predefined swap reasons (breakdown, accident, maintenance, upgrade, downgrade)
   - Free-text field for detailed explanation of circumstances
   - Photo upload capability for vehicle condition documentation
   - Staff member identification and timestamp recording

2. **Contract Transfer Process**
   - One-click transfer of rental contract from original to replacement vehicle
   - All original terms (insurance, add-ons, special conditions) automatically carried forward
   - Rental period and return date remain unchanged
   - Customer signature capture for swap acknowledgment (digital or physical)

3. **Vehicle Eligibility Validation**
   - Replacement vehicle must meet or exceed original vehicle class
   - Availability verification for remaining rental period
   - Maintenance and inspection status validation
   - Customer license restrictions compatibility check

4. **Pricing Adjustment Engine**
   - Automatic calculation of price differences between vehicles
   - Daily rate adjustments for upgrade/downgrade scenarios
   - Prorated billing for partial day rate differences
   - Credits/charges processing through existing payment methods

5. **Status Management System**
   - Original vehicle status updated to appropriate state (out of service, maintenance, damaged)
   - Replacement vehicle status changed to "rented" with customer assignment
   - Rental contract linked to new vehicle with historical reference to original
   - Availability updates for both vehicles in real-time

6. **Comprehensive Documentation**
   - Before/after photos of both vehicles required
   - Mileage readings recorded for both vehicles at swap time
   - Fuel level documentation to prevent customer disputes
   - Condition reports completed for both vehicles

7. **Customer Communication**
   - Immediate notification to customer about vehicle swap
   - Explanation of reason and any pricing implications
   - New vehicle details (license plate, location, features)
   - Updated rental agreement sent electronically

8. **Audit Trail Maintenance**
   - Complete chronological log of swap process
   - Staff actions timestamped and attributed
   - System changes tracked with before/after states
   - Customer interactions and approvals documented

9. **Emergency Swap Handling**
   - Expedited process for breakdown or accident scenarios
   - Customer location tracking for replacement delivery
   - Roadside assistance coordination integration
   - Emergency contact notifications to management

10. **Insurance Considerations**
    - Coverage verification for replacement vehicle
    - Policy transfer for comprehensive/collision coverage
    - Additional driver authorization transfers
    - Incident reporting if swap due to damage/accident

11. **Quality Control Checks**
    - Manager approval required for downgrades or significant cost impacts
    - Customer satisfaction verification post-swap
    - Vehicle preparation confirmation before handover
    - Key and accessory transfer verification

12. **Rollback Capabilities**
    - Ability to reverse swap if replacement vehicle has issues
    - Original vehicle restoration process if problem resolved
    - Multi-level approval for complex swap scenarios
    - Historical swap tracking for pattern analysis

## Technical Implementation Notes

### Backend Services
- `VehicleSwapService`: Orchestrates the complete swap process
- `ContractTransferService`: Handles rental agreement transitions
- `PricingAdjustmentService`: Calculates cost differences and billing changes
- `VehicleAvailabilityService`: Manages vehicle status updates
- `DocumentationService`: Handles photo storage and condition reports

### Data Models
```sql
vehicle_swaps (
  id, original_rental_id, original_vehicle_id, replacement_vehicle_id,
  swap_reason, detailed_reason, initiated_by_user_id, initiated_at,
  customer_approved_at, completed_at, pricing_adjustment,
  original_vehicle_mileage, replacement_vehicle_mileage, status
)

swap_documentation (
  id, swap_id, document_type, file_url, description,
  vehicle_id, recorded_at, recorded_by_user_id
)
```

### State Machine
Initiated → Vehicle Selected → Customer Contacted → Customer Approved → Documents Prepared → Swap Executed → Completed

## API Endpoints

### Core Swap Endpoints
- `POST /api/rentals/{id}/swap/initiate` - Start vehicle swap process
- `GET /api/rentals/{id}/swap/available-vehicles` - Get eligible replacement vehicles
- `POST /api/rentals/{id}/swap/select-vehicle` - Choose replacement vehicle
- `POST /api/rentals/{id}/swap/customer-approval` - Record customer consent
- `POST /api/rentals/{id}/swap/execute` - Complete the swap process
- `GET /api/rentals/{id}/swap/status` - Check swap progress

### Documentation Endpoints
- `POST /api/swaps/{id}/photos` - Upload vehicle condition photos
- `POST /api/swaps/{id}/mileage` - Record vehicle mileage readings
- `POST /api/swaps/{id}/condition-report` - Submit vehicle condition reports

### Administrative Endpoints
- `GET /api/swaps/pending-approval` - Get swaps requiring manager approval
- `POST /api/swaps/{id}/approve` - Manager approval for swap
- `GET /api/swaps/analytics` - Swap frequency and reason analysis

## Database Schema Requirements

### New Tables
```sql
CREATE TABLE vehicle_swaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swap_number VARCHAR(20) UNIQUE NOT NULL,
  original_rental_id UUID REFERENCES rentals(id) NOT NULL,
  original_vehicle_id UUID REFERENCES vehicles(id) NOT NULL,
  replacement_vehicle_id UUID REFERENCES vehicles(id) NOT NULL,
  swap_reason VARCHAR(50) NOT NULL,
  detailed_reason TEXT,
  initiated_by_user_id UUID REFERENCES users(id) NOT NULL,
  initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  customer_contacted_at TIMESTAMP,
  customer_approved_at TIMESTAMP,
  completed_at TIMESTAMP,
  status VARCHAR(30) NOT NULL DEFAULT 'initiated',
  pricing_adjustment DECIMAL(10,2) DEFAULT 0,
  original_vehicle_mileage INTEGER,
  replacement_vehicle_mileage INTEGER,
  original_vehicle_fuel_level INTEGER,
  replacement_vehicle_fuel_level INTEGER,
  manager_approval_required BOOLEAN DEFAULT false,
  approved_by_user_id UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE swap_documentation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swap_id UUID REFERENCES vehicle_swaps(id) NOT NULL,
  document_type VARCHAR(50) NOT NULL, -- photo, condition_report, signature, etc.
  vehicle_id UUID REFERENCES vehicles(id), -- which vehicle this doc relates to
  file_url VARCHAR(500),
  description TEXT,
  metadata JSONB, -- additional structured data
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  recorded_by_user_id UUID REFERENCES users(id) NOT NULL
);

CREATE TABLE swap_pricing_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swap_id UUID REFERENCES vehicle_swaps(id) NOT NULL,
  adjustment_type VARCHAR(30) NOT NULL, -- upgrade_charge, downgrade_credit, etc.
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  days_applied INTEGER,
  processed_at TIMESTAMP
);
```

### Schema Updates
- Add `swap_history` JSONB column to rentals table for quick reference
- Add `swap_eligible` boolean to vehicles table
- Add `swap_count` to customer profiles for analytics

## UI/UX Considerations

### Swap Initiation Interface
- Quick-access "Vehicle Swap" button in rental detail view
- Reason selection with visual icons and descriptions
- Photo capture workflow with guided instructions
- Customer contact information prominently displayed

### Vehicle Selection Interface
- Visual vehicle comparison with original vs. replacement details
- Real-time pricing impact calculator
- Availability calendar for replacement vehicle
- Feature comparison highlighting upgrades/downgrades

### Customer Approval Interface
- Digital signature capture for tablet/touch devices
- Clear explanation of swap terms and pricing changes
- Side-by-side vehicle comparison for customer review
- Electronic document delivery confirmation

### Progress Tracking Dashboard
- Visual progress indicator for swap stages
- Pending approvals highlighted for management attention
- Completion time tracking with performance metrics
- Quick action buttons for common next steps

## Testing Scenarios

### Scenario 1: Emergency Breakdown Swap
**Given:** Customer's vehicle breaks down during rental period
**When:** Staff initiates emergency swap with comparable vehicle
**Then:** Replacement vehicle assigned, customer contacted, swap completed within 2 hours

### Scenario 2: Upgrade Swap with Pricing
**Given:** Original vehicle unavailable, only premium vehicle available
**When:** Staff selects higher-class replacement vehicle
**Then:** System calculates upgrade charges, gets customer approval, processes additional payment

### Scenario 3: Insurance Coverage Transfer
**Given:** Customer has comprehensive coverage on original rental
**When:** Vehicle swap is executed to replacement vehicle
**Then:** All insurance coverage automatically transfers, no gaps in protection

### Scenario 4: Manager Approval Required
**Given:** Swap involves significant downgrade or cost impact >$200
**When:** Staff attempts to complete swap
**Then:** System requires manager approval, sends notification, holds swap until approved

### Scenario 5: Customer Declines Swap
**Given:** Customer is offered replacement vehicle with pricing changes
**When:** Customer declines the swap option
**Then:** Original rental terminated, refund processed, alternative solutions offered

### Scenario 6: Multi-Day Rental Mid-Swap
**Given:** 7-day rental requires vehicle swap on day 3
**When:** Swap executed with different daily rate
**Then:** Pricing correctly prorated, customer billed for 3 days original + 4 days replacement

### Scenario 7: Same-Day Return After Swap
**Given:** Customer's replacement vehicle is also problematic
**When:** Customer requests immediate rental termination
**Then:** Full refund processed, incident documented, customer service escalation triggered

### Scenario 8: Documentation Quality Check
**Given:** Staff uploads blurry photos during swap documentation
**When:** System processes uploaded images
**Then:** Quality validation rejects poor images, prompts for retake with guidance

## Definition of Done

- [ ] Vehicle swap initiation workflow operational
- [ ] Replacement vehicle eligibility engine implemented
- [ ] Contract transfer system preserving all terms and conditions
- [ ] Pricing adjustment calculator accurate for all scenarios
- [ ] Customer approval process with digital signature capability
- [ ] Documentation capture system with photo and condition reports
- [ ] Vehicle status management updating availability in real-time
- [ ] Customer notification system sending timely updates
- [ ] Manager approval workflow for high-impact swaps
- [ ] Emergency swap handling for breakdown scenarios
- [ ] Insurance coverage transfer automation
- [ ] Audit trail capturing complete swap history
- [ ] Rollback capability for failed swaps
- [ ] Mobile-responsive interface for field use
- [ ] Integration with existing rental and billing systems
- [ ] Performance testing (swap completion <10 minutes)
- [ ] User acceptance testing with operations team
- [ ] Staff training documentation and procedures

## Dependencies
- Vehicle availability management system
- Customer notification service  
- Payment processing system integration
- Digital signature capture capability
- Photo storage and management service
- Insurance system integration
- Manager approval workflow system

## Risks and Mitigation
- **Risk:** Replacement vehicle also has issues
  - **Mitigation:** Multi-level backup vehicle selection and validation
- **Risk:** Customer refuses replacement vehicle
  - **Mitigation:** Clear refund policy and alternative solution protocols
- **Risk:** Insurance coverage gaps during swap
  - **Mitigation:** Instantaneous coverage transfer validation
- **Risk:** Pricing disputes over vehicle differences
  - **Mitigation:** Transparent pricing calculator with customer approval requirement