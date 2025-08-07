# Story 02: Reservation to Rental Conversion

## Story Information
- **Story ID:** RS-02
- **Epic:** Epic 5 - Reservation System
- **Priority:** High
- **Story Points:** 5

## User Story
**As a** rental staff member  
**I want to** efficiently convert reservations to active rental contracts  
**So that** the customer pickup process is streamlined and data integrity is maintained

## Detailed Acceptance Criteria

1. **AC-01:** Staff can quickly find reservations using confirmation number, customer name, or phone
2. **AC-02:** System pre-populates rental contract with all reservation details
3. **AC-03:** Staff can verify and update customer information during conversion
4. **AC-04:** System allows vehicle substitution if original vehicle unavailable
5. **AC-05:** System calculates final pricing based on current rates and actual pickup time
6. **AC-06:** Staff can modify rental period during conversion if needed
7. **AC-07:** System maintains complete audit trail linking reservation to rental contract
8. **AC-08:** Conversion process completes in under 60 seconds for standard cases
9. **AC-09:** System automatically releases reservation status and updates vehicle availability
10. **AC-10:** Original reservation record preserved for historical reporting
11. **AC-11:** System handles partial conversions (e.g., shorter rental period than reserved)
12. **AC-12:** Staff receives confirmation of successful conversion with contract number

## Technical Implementation Notes

### Data Flow
1. Search and retrieve reservation
2. Validate reservation eligibility for conversion
3. Pre-populate rental contract form
4. Allow staff modifications
5. Create rental contract record
6. Update reservation status to "CONVERTED"
7. Update vehicle availability
8. Generate rental contract confirmation

### Business Rules
- Reservations can be converted up to 24 hours after pickup time
- Vehicle substitutions must be same category or upgrade
- Price adjustments reflect current rates at time of pickup
- Grace period for late pickups: 2 hours default (configurable)

## API Endpoints Needed

### GET /api/reservations/search
**Purpose:** Search reservations for conversion
**Query Parameters:**
```
confirmationNumber, customerName, customerPhone, pickupDate
```
**Response:**
```json
{
  "reservations": [
    {
      "id": "uuid",
      "confirmationNumber": "RES-20240806-0001",
      "customer": {...},
      "vehicle": {...},
      "pickupDatetime": "2024-08-15T10:00:00Z",
      "returnDatetime": "2024-08-17T10:00:00Z",
      "status": "CONFIRMED"
    }
  ]
}
```

### POST /api/reservations/{id}/convert-to-rental
**Purpose:** Convert reservation to active rental
**Request Body:**
```json
{
  "actualPickupDatetime": "2024-08-15T10:30:00Z",
  "actualReturnDatetime": "2024-08-17T10:00:00Z",
  "vehicleId": "uuid", // May differ from reservation if substituted
  "customerUpdates": {
    "phone": "+41791234567",
    "licenseNumber": "updated"
  },
  "staffNotes": "Customer arrived 30 min late, no issues"
}
```
**Response:**
```json
{
  "rentalContractId": "uuid",
  "contractNumber": "RC-20240815-0042",
  "finalAmount": 267.80,
  "priceAdjustments": [
    {"reason": "Late pickup", "amount": 0},
    {"reason": "Current rate increase", "amount": 22.30}
  ]
}
```

### GET /api/reservations/{id}/conversion-preview
**Purpose:** Preview conversion details before finalizing
**Response:** Estimated final pricing and contract details

### PUT /api/reservations/{id}/substitute-vehicle
**Purpose:** Change vehicle assignment during conversion

## Database Schema Requirements

### Updated Tables
```sql
-- Add conversion tracking to reservations
ALTER TABLE reservations ADD COLUMN converted_to_rental_id UUID REFERENCES rental_contracts(id);
ALTER TABLE reservations ADD COLUMN converted_at TIMESTAMP;
ALTER TABLE reservations ADD COLUMN conversion_notes TEXT;

-- Add reservation reference to rental contracts
ALTER TABLE rental_contracts ADD COLUMN converted_from_reservation_id UUID REFERENCES reservations(id);

-- Audit trail for conversions
CREATE TABLE reservation_conversions (
    id UUID PRIMARY KEY,
    reservation_id UUID REFERENCES reservations(id),
    rental_contract_id UUID REFERENCES rental_contracts(id),
    original_vehicle_id UUID,
    final_vehicle_id UUID,
    price_adjustments JSONB,
    staff_id UUID REFERENCES staff(id),
    conversion_duration_seconds INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes
```sql
CREATE INDEX idx_reservations_search_name ON reservations USING gin(to_tsvector('english', customer_name));
CREATE INDEX idx_reservations_phone ON reservations(customer_phone);
CREATE INDEX idx_reservations_pickup_date ON reservations(pickup_datetime);
```

## UI/UX Considerations

### Search Interface
- **Multi-field Search:** Single search box accepting confirmation numbers, names, or phone
- **Auto-complete:** Predictive search as staff types
- **Quick Filters:** Today's pickups, overdue, confirmed status
- **Results Display:** List with key details and "Convert" button

### Conversion Workflow
- **Split Screen:** Reservation details on left, rental form on right
- **Pre-filled Form:** All reservation data automatically populated
- **Real-time Pricing:** Live updates as modifications made
- **Vehicle Browser:** Quick access to alternative vehicles if needed
- **One-click Convert:** Single button to finalize conversion

### Performance Optimizations
- **Caching:** Recent searches cached for quick access
- **Prefetching:** Load conversion preview automatically
- **Background Processing:** Price calculations happen asynchronously

## Testing Scenarios

### Scenario 1: Standard On-time Conversion
**Given:** Customer arrives on time with confirmed reservation  
**When:** Staff searches by confirmation number and converts  
**Then:** Conversion completes in under 60 seconds with pre-filled contract

### Scenario 2: Late Pickup Conversion
**Given:** Customer arrives 3 hours after scheduled pickup time  
**When:** Staff attempts conversion  
**Then:** System allows conversion with price adjustment for late pickup

### Scenario 3: Vehicle Substitution
**Given:** Reserved vehicle is unexpectedly unavailable  
**When:** Staff selects alternative vehicle during conversion  
**Then:** System suggests appropriate alternatives and updates pricing accordingly

### Scenario 4: Customer Information Updates
**Given:** Customer's phone number has changed since reservation  
**When:** Staff updates contact information during conversion  
**Then:** Customer record updated and rental contract uses new information

### Scenario 5: Partial Conversion - Shorter Period
**Given:** Customer wants to rent for 3 days instead of reserved 5 days  
**When:** Staff modifies return date during conversion  
**Then:** System recalculates pricing and creates contract for shorter period

### Scenario 6: Search by Customer Name
**Given:** Customer arrives without confirmation number  
**When:** Staff searches using customer's name  
**Then:** System displays matching reservations for selection

### Scenario 7: Concurrent Conversion Attempt
**Given:** Same reservation being converted by two staff members  
**When:** Both attempt to finalize conversion  
**Then:** First succeeds, second receives error about already converted reservation

### Scenario 8: Price Adjustment Transparency
**Given:** Rates have increased since reservation was made  
**When:** Converting reservation to rental  
**Then:** System clearly shows price differences and reasons for adjustments

## Definition of Done

- [ ] All acceptance criteria implemented and tested
- [ ] Search functionality supports multiple search methods
- [ ] Conversion process averages <60 seconds completion time
- [ ] Database schema updated with conversion tracking
- [ ] API endpoints implemented with proper validation
- [ ] UI components created for search and conversion workflow
- [ ] Unit tests written with >90% coverage
- [ ] Integration tests cover all conversion scenarios
- [ ] Performance tests validate speed requirements
- [ ] Audit trail functionality working correctly
- [ ] Staff training materials updated
- [ ] User acceptance testing completed
- [ ] Error handling for edge cases implemented
- [ ] Documentation updated

## Dependencies

### Internal Dependencies
- Reservation creation system (Story 1)
- Rental contract system (Epic 1)
- Customer management system
- Vehicle availability tracking
- Fleet calendar system

### External Dependencies
- None specific to this story

## Risk Mitigation

### Risk: Data loss during conversion process
- **Mitigation:** Transaction-based conversion with rollback capability
- **Contingency:** Manual data recovery procedures documented

### Risk: Performance degradation with large reservation volume
- **Mitigation:** Database indexing and query optimization
- **Contingency:** Background processing for complex conversions

### Risk: Price calculation discrepancies
- **Mitigation:** Transparent pricing display with itemized adjustments
- **Contingency:** Manual price override capability with approval workflow

### Risk: Vehicle availability conflicts during conversion
- **Mitigation:** Real-time availability checking before finalization
- **Contingency:** Automatic upgrade offers and notification system

## Success Criteria
- Conversion completion time <60 seconds for 95% of cases
- Zero data loss incidents during conversion
- Staff satisfaction score >4.5/5 for conversion process
- Customer satisfaction maintained during pickup process
- Conversion success rate >99% (excluding legitimate cancellations)