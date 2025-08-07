# Story 05: Reservation Modifications

## Story Information
- **Story ID:** RS-05
- **Epic:** Epic 5 - Reservation System
- **Priority:** Medium
- **Story Points:** 8

## User Story
**As a** rental staff member  
**I want to** modify existing reservations efficiently  
**So that** customer changes are accommodated while maintaining data integrity and proper pricing

## Detailed Acceptance Criteria

1. **AC-01:** Staff can modify pickup and return dates/times within availability constraints
2. **AC-02:** System allows vehicle upgrades/downgrades with automatic price adjustments
3. **AC-03:** Staff can add or remove extras (GPS, child seats, insurance) from reservations
4. **AC-04:** System recalculates total pricing automatically when modifications are made
5. **AC-05:** Availability conflicts are detected in real-time during modification process
6. **AC-06:** Modified reservations maintain original confirmation number but create new version
7. **AC-07:** System sends updated confirmation email with change summary to customer
8. **AC-08:** All modification history is preserved for audit and customer service purposes
9. **AC-09:** Staff can preview modification impacts before committing changes
10. **AC-10:** System handles complex scenarios like extending into unavailable periods
11. **AC-11:** Modification fees are calculated and applied according to business rules
12. **AC-12:** Vehicle substitution suggestions provided when original becomes unavailable

## Technical Implementation Notes

### Modification Types
- **Date Changes:** Pickup/return date or time adjustments
- **Duration Changes:** Extending or shortening rental period
- **Vehicle Changes:** Upgrade, downgrade, or lateral moves
- **Extras Changes:** Add/remove optional equipment and services
- **Customer Details:** Contact information or special requirements

### Business Rules
- **Modification Fees:** Flat fee or percentage-based depending on change type
- **Price Protection:** Some modifications may honor original rates vs. current rates
- **Availability Priority:** Existing reservations have priority over new bookings
- **Change Limits:** Restrict number of modifications per reservation

### Version Control
- Each modification creates new version while preserving original
- Change history tracks what changed, when, who made change
- Original reservation remains intact for audit purposes

## API Endpoints Needed

### PUT /api/reservations/{id}
**Purpose:** Modify existing reservation
**Request Body:**
```json
{
  "modifications": {
    "pickupDatetime": "2024-08-16T10:00:00Z",
    "returnDatetime": "2024-08-19T10:00:00Z",
    "vehicleId": "uuid",
    "extras": ["gps", "child_seat"],
    "specialNotes": "Customer requested red color if possible"
  },
  "changeReason": "Customer requested date extension",
  "applyModificationFee": true
}
```
**Response:**
```json
{
  "reservationId": "uuid",
  "versionNumber": 2,
  "changes": [
    {
      "field": "returnDatetime",
      "oldValue": "2024-08-17T10:00:00Z",
      "newValue": "2024-08-19T10:00:00Z",
      "priceImpact": 85.00
    }
  ],
  "newTotal": 335.00,
  "modificationFee": 15.00,
  "confirmationSent": true
}
```

### GET /api/reservations/{id}/modification-preview
**Purpose:** Preview modification impacts before applying
**Query Parameters:**
```
pickupDatetime, returnDatetime, vehicleId, extras
```
**Response:**
```json
{
  "availabilityStatus": "available",
  "priceChanges": {
    "originalTotal": 250.00,
    "newTotal": 335.00,
    "difference": 85.00,
    "modificationFee": 15.00
  },
  "conflicts": [],
  "suggestions": [
    {
      "type": "vehicle_upgrade",
      "vehicleId": "uuid",
      "additionalCost": 25.00,
      "reason": "Original vehicle unavailable for new dates"
    }
  ]
}
```

### GET /api/reservations/{id}/modification-history
**Purpose:** Retrieve complete modification history
**Response:**
```json
{
  "reservationId": "uuid",
  "currentVersion": 3,
  "modifications": [
    {
      "version": 2,
      "modifiedAt": "2024-08-10T14:30:00Z",
      "modifiedBy": "staff_uuid",
      "changes": [...],
      "reason": "Customer requested extension",
      "fee": 15.00
    }
  ]
}
```

### POST /api/reservations/{id}/suggest-alternatives
**Purpose:** Get alternative options when modification conflicts arise
**Request Body:**
```json
{
  "desiredChanges": {
    "pickupDatetime": "2024-08-16T10:00:00Z",
    "returnDatetime": "2024-08-19T10:00:00Z"
  }
}
```

## Database Schema Requirements

### New Tables
```sql
CREATE TABLE reservation_modifications (
    id UUID PRIMARY KEY,
    reservation_id UUID REFERENCES reservations(id),
    version_number INTEGER NOT NULL,
    modification_type VARCHAR(50) NOT NULL, -- date_change, vehicle_change, extras_change
    change_details JSONB NOT NULL, -- What changed with before/after values
    price_impact DECIMAL(10,2) DEFAULT 0,
    modification_fee DECIMAL(10,2) DEFAULT 0,
    change_reason TEXT,
    modified_by UUID REFERENCES staff(id),
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    customer_notified_at TIMESTAMP,
    notes TEXT
);

CREATE TABLE modification_fees_config (
    id UUID PRIMARY KEY,
    modification_type VARCHAR(50) NOT NULL,
    fee_type VARCHAR(20) NOT NULL, -- fixed, percentage
    fee_amount DECIMAL(10,2) NOT NULL,
    minimum_fee DECIMAL(10,2),
    maximum_fee DECIMAL(10,2),
    applies_after_hours_before_pickup INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE reservation_versions (
    id UUID PRIMARY KEY,
    reservation_id UUID REFERENCES reservations(id),
    version_number INTEGER NOT NULL,
    reservation_snapshot JSONB NOT NULL, -- Complete reservation state at this version
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(reservation_id, version_number)
);
```

### Updated Tables
```sql
ALTER TABLE reservations ADD COLUMN current_version INTEGER DEFAULT 1;
ALTER TABLE reservations ADD COLUMN total_modifications INTEGER DEFAULT 0;
ALTER TABLE reservations ADD COLUMN last_modified_at TIMESTAMP;
ALTER TABLE reservations ADD COLUMN modification_fee_total DECIMAL(10,2) DEFAULT 0;
```

### Indexes
```sql
CREATE INDEX idx_modifications_reservation ON reservation_modifications(reservation_id);
CREATE INDEX idx_modifications_date ON reservation_modifications(modified_at);
CREATE INDEX idx_versions_reservation ON reservation_versions(reservation_id, version_number);
```

## UI/UX Considerations

### Modification Interface
- **Side-by-side Comparison:** Original vs. modified reservation details
- **Real-time Validation:** Instant feedback on availability and pricing
- **Change Summary:** Clear display of what's changing and cost impact
- **Conflict Resolution:** Visual warnings and alternative suggestions
- **Preview Mode:** Allow staff to explore changes before committing

### Customer Communication
- **Change Summary Email:** Professional template highlighting key changes
- **Price Explanation:** Breakdown of additional charges or savings
- **New Confirmation:** Updated reservation details with same confirmation number
- **Modification Receipt:** Separate document for the changes made

### Staff Workflow
- **Quick Modification:** Common changes (extend by 1 day) with one-click options
- **Batch Modifications:** Handle multiple related changes efficiently
- **Approval Workflow:** Manager approval for large price increases
- **History Access:** Easy navigation through modification timeline

## Testing Scenarios

### Scenario 1: Simple Date Extension
**Given:** Customer wants to extend return date by 2 days  
**When:** Staff modifies return date with vehicle available  
**Then:** Price recalculated, modification fee applied, confirmation sent

### Scenario 2: Vehicle Upgrade Due to Availability
**Given:** Original vehicle unavailable for extended dates  
**When:** Staff selects alternative vehicle during modification  
**Then:** System suggests appropriate upgrade, calculates new pricing

### Scenario 3: Conflicting Date Change
**Given:** Customer wants to change pickup date  
**When:** Desired dates conflict with existing booking  
**Then:** System shows conflict warning, suggests alternative dates/vehicles

### Scenario 4: Multiple Simultaneous Changes
**Given:** Customer wants different dates, vehicle, and extras  
**When:** Staff makes all changes in single modification  
**Then:** All changes tracked as single version, total impact calculated

### Scenario 5: Free Modification Within Grace Period
**Given:** Modification made within 24 hours of original booking  
**When:** Staff processes change  
**Then:** No modification fee applied, only price difference charged

### Scenario 6: Modification Exceeding Limits
**Given:** Reservation already modified 3 times (system limit)  
**When:** Staff attempts 4th modification  
**Then:** System requires manager approval or suggests cancellation/rebook

### Scenario 7: Price Protection Scenario
**Given:** Customer has promotional rate, now wants to extend  
**When:** Extension would use higher current rates  
**Then:** System honors original rate structure for modifications

### Scenario 8: Modification History Review
**Given:** Customer disputes charges on modified reservation  
**When:** Staff reviews modification history  
**Then:** Complete timeline shows what changed, when, and by whom

## Definition of Done

- [ ] All acceptance criteria implemented and tested
- [ ] Modification engine handles all change types accurately
- [ ] Real-time availability checking during modifications
- [ ] Price recalculation engine working correctly
- [ ] Version control system preserves complete history
- [ ] Customer communication templates created and tested
- [ ] Staff workflow optimized for efficiency
- [ ] Database schema supports complex modification scenarios
- [ ] API endpoints implemented with comprehensive validation
- [ ] UI components provide clear modification workflow
- [ ] Unit tests cover all modification logic with >90% coverage
- [ ] Integration tests validate end-to-end modification process
- [ ] Performance tests ensure modifications complete quickly
- [ ] Conflict detection and resolution working properly
- [ ] Fee calculation engine accurate for all scenarios
- [ ] Management reporting on modification trends
- [ ] Documentation updated (procedures, API, user guide)
- [ ] Staff training materials created

## Dependencies

### Internal Dependencies
- Reservation system (Stories 1, 2)
- Fleet availability system (Epic 2)
- Payment processing for additional charges (Epic 3)
- Email notification service
- Staff management system for approval workflows

### External Dependencies
- Email service for customer notifications
- Payment gateway for processing additional charges

## Risk Mitigation

### Risk: Complex pricing calculations leading to errors
- **Mitigation:** Comprehensive testing with edge cases and preview functionality
- **Contingency:** Manual price override capability with audit trail

### Risk: Availability conflicts during modification process
- **Mitigation:** Real-time availability checking with locking mechanism
- **Contingency:** Alternative suggestion engine and staff override options

### Risk: Customer confusion about changes and charges
- **Mitigation:** Clear communication templates and detailed change summaries
- **Contingency:** Customer service scripts and dispute resolution procedures

### Risk: Data integrity issues with version control
- **Mitigation:** Transaction-based modifications with rollback capability
- **Contingency:** Data recovery procedures and manual correction tools

### Risk: Performance degradation with complex modifications
- **Mitigation:** Optimized database queries and caching strategies
- **Contingency:** Background processing for complex calculations

## Success Criteria
- Modification processing time <90 seconds for standard changes
- Price calculation accuracy >99.5%
- Customer satisfaction >4.3/5 for modification experience
- Staff efficiency improvement of 40% vs. cancel/rebook process
- Zero data loss incidents during modifications
- Modification completion rate >95% (excluding legitimate conflicts)