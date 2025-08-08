# Story 01: Reservation Creation

## Story Information

- **Story ID:** RS-01
- **Epic:** Epic 5 - Reservation System
- **Priority:** High
- **Story Points:** 8

## User Story

**As a** rental staff member  
**I want to** create advance reservations for customers  
**So that** customers can secure vehicles for future dates and guarantee availability

## Detailed Acceptance Criteria

1. **AC-01:** Staff can create reservations for pickup dates at least 1 hour in the future
2. **AC-02:** System validates that pickup date is before return date with minimum 1-day rental
   period
3. **AC-03:** Staff can select specific vehicle OR vehicle category with automatic assignment
4. **AC-04:** System blocks selected vehicle/category availability for the reservation period
5. **AC-05:** System calculates estimated total price including base rate, taxes, and optional
   extras
6. **AC-06:** Staff can add optional extras (GPS, child seats, insurance) to reservation
7. **AC-07:** System generates unique confirmation number using format RES-YYYYMMDD-XXXX
8. **AC-08:** System captures customer contact information (email, phone) for notifications
9. **AC-09:** System sends automated confirmation email within 2 minutes of creation
10. **AC-10:** Reservation shows "CONFIRMED" status immediately after successful creation
11. **AC-11:** System maintains audit trail of who created the reservation and when
12. **AC-12:** Staff can add special notes/instructions to the reservation

## Technical Implementation Notes

### Data Model Requirements

```sql
CREATE TABLE reservations (
    id UUID PRIMARY KEY,
    confirmation_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    vehicle_id UUID REFERENCES vehicles(id), -- NULL if category-based
    vehicle_category_id UUID REFERENCES vehicle_categories(id), -- NULL if specific vehicle
    pickup_datetime TIMESTAMP NOT NULL,
    return_datetime TIMESTAMP NOT NULL,
    estimated_total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'CONFIRMED',
    special_notes TEXT,
    created_by UUID REFERENCES staff(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Business Logic

- Grace period: 1 hour minimum between reservation creation and pickup
- Availability blocking occurs immediately upon confirmation
- Price estimation uses current rates but may change at pickup
- Confirmation number format: RES-YYYYMMDD-XXXX (sequential)

## API Endpoints Needed

### POST /api/reservations

**Purpose:** Create new reservation **Request Body:**

```json
{
  "customerId": "uuid",
  "vehicleId": "uuid", // OR vehicleCategoryId
  "vehicleCategoryId": "uuid", // OR vehicleId
  "pickupDatetime": "2024-08-15T10:00:00Z",
  "returnDatetime": "2024-08-17T10:00:00Z",
  "extras": ["gps", "child_seat"],
  "specialNotes": "Customer prefers red color if available"
}
```

**Response:**

```json
{
  "id": "uuid",
  "confirmationNumber": "RES-20240806-0001",
  "estimatedTotal": 245.5,
  "status": "CONFIRMED",
  "emailSent": true
}
```

### GET /api/vehicles/availability

**Purpose:** Check vehicle availability for date range **Query Parameters:**

- startDate, endDate, vehicleCategoryId (optional)

### POST /api/reservations/{id}/estimate-price

**Purpose:** Calculate estimated pricing for reservation

## Database Schema Requirements

### New Tables

- `reservations` - Main reservation entity
- `reservation_extras` - Many-to-many relationship for optional extras
- `reservation_audit_log` - Track all changes to reservations

### Updated Tables

- `vehicle_availability` - Add reservation blocking entries
- `customers` - Ensure email/phone fields exist for notifications

### Indexes

```sql
CREATE INDEX idx_reservations_confirmation ON reservations(confirmation_number);
CREATE INDEX idx_reservations_pickup_date ON reservations(pickup_datetime);
CREATE INDEX idx_reservations_customer ON reservations(customer_id);
CREATE INDEX idx_reservations_vehicle ON reservations(vehicle_id);
```

## UI/UX Considerations

### Interface Design

- **Reservation Form:** Step-by-step wizard (Customer → Vehicle → Dates → Extras → Review)
- **Calendar Integration:** Visual date picker showing availability
- **Vehicle Selection:** Grid view with photos, specifications, and real-time availability
- **Price Display:** Live price updates as selections change

### User Experience

- **Auto-save:** Draft reservations saved every 30 seconds
- **Validation:** Real-time validation with clear error messages
- **Confirmation:** Immediate success feedback with confirmation details
- **Print Option:** Printable reservation confirmation

### Accessibility

- ARIA labels for screen readers
- Keyboard navigation support
- High contrast mode compatibility
- Mobile-responsive design

## Testing Scenarios

### Scenario 1: Standard Reservation Creation

**Given:** Staff member logged in with customer details ready  
**When:** Creating reservation for specific vehicle next week  
**Then:** Reservation created successfully with confirmation number and email sent

### Scenario 2: Category-Based Reservation

**Given:** Customer wants any compact car  
**When:** Creating reservation with vehicle category instead of specific vehicle  
**Then:** System accepts reservation and will assign specific vehicle at pickup

### Scenario 3: Date Validation

**Given:** Staff attempting to create reservation  
**When:** Pickup date is in the past or return date is before pickup  
**Then:** System shows validation error and prevents submission

### Scenario 4: Vehicle Unavailability

**Given:** Selected vehicle is already reserved for requested dates  
**When:** Attempting to create overlapping reservation  
**Then:** System shows availability conflict and suggests alternatives

### Scenario 5: Email Notification Failure

**Given:** Reservation created successfully  
**When:** Email service is temporarily unavailable  
**Then:** Reservation still confirmed but email marked as "failed" for retry

### Scenario 6: Pricing Calculation

**Given:** Reservation with multiple extras and 5-day rental  
**When:** System calculates total estimate  
**Then:** All components (base rate, extras, taxes) correctly calculated and displayed

### Scenario 7: Concurrent Reservation Attempts

**Given:** Two staff members selecting same vehicle simultaneously  
**When:** Both attempt to confirm reservation  
**Then:** First confirmation succeeds, second receives availability conflict

### Scenario 8: Customer Information Update

**Given:** Existing customer with outdated contact information  
**When:** Creating reservation and updating customer details  
**Then:** Customer information updated and reservation uses new contact details

## Definition of Done

- [ ] All acceptance criteria implemented and tested
- [ ] Database schema created and migrated
- [ ] API endpoints implemented with proper validation
- [ ] UI components created and styled
- [ ] Email notification system configured
- [ ] Unit tests written with >90% coverage
- [ ] Integration tests cover all API endpoints
- [ ] Performance tests ensure <90 second creation time
- [ ] Security audit completed for input validation
- [ ] Documentation updated (API docs, user manual)
- [ ] Staff training materials prepared
- [ ] UAT completed by business stakeholders
- [ ] Accessibility testing passed
- [ ] Cross-browser testing completed

## Dependencies

### Internal Dependencies

- Customer management system (Epic 1)
- Fleet management system (Epic 2)
- Email notification service
- Vehicle availability tracking

### External Dependencies

- Email service provider (SendGrid/AWS SES)
- SMS service for mobile notifications (optional)
- Calendar integration APIs

## Risk Mitigation

### Risk: Double-booking due to race conditions

- **Mitigation:** Database-level constraints and optimistic locking
- **Contingency:** Real-time availability verification before final confirmation

### Risk: Email delivery failures

- **Mitigation:** Retry mechanism with exponential backoff
- **Contingency:** SMS backup notification system

### Risk: Price calculation errors

- **Mitigation:** Comprehensive validation and audit logging
- **Contingency:** Manual price override capability for staff

## Success Criteria

- Reservation creation completed in <90 seconds
- Email delivery success rate >98%
- Zero double-booking incidents
- Customer satisfaction score >4.5/5 for booking experience
