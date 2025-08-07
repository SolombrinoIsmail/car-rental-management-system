# Story 03: No-Show Management

## Story Information
- **Story ID:** RS-03
- **Epic:** Epic 5 - Reservation System
- **Priority:** High
- **Story Points:** 5

## User Story
**As a** rental staff member  
**I want to** automatically handle reservation no-shows  
**So that** vehicles become available for other customers and consistent policies are applied

## Detailed Acceptance Criteria

1. **AC-01:** System automatically identifies no-shows after configurable grace period (default 2 hours)
2. **AC-02:** System sends automated reminder notifications 24 hours and 2 hours before pickup
3. **AC-03:** No-show reservations are automatically cancelled and vehicle released for availability
4. **AC-04:** System applies no-show fees according to configured business rules
5. **AC-05:** Customer receives automated no-show notification with fee details
6. **AC-06:** Staff can manually override no-show status for valid reasons (traffic, emergency)
7. **AC-07:** System tracks no-show patterns per customer with flagging for repeat offenders
8. **AC-08:** Management reports show no-show statistics and revenue impact
9. **AC-09:** Released vehicles immediately appear in availability for new bookings
10. **AC-10:** No-show processing maintains complete audit trail for disputes
11. **AC-11:** Staff receive dashboard alerts for pending no-shows requiring attention
12. **AC-12:** System allows late conversion if customer arrives within extended grace period

## Technical Implementation Notes

### Automated Processing
- **Cron Job:** Runs every 15 minutes to check for overdue pickups
- **Grace Period:** Configurable per location (default 2 hours)
- **Extended Grace:** Additional 4-hour window for late arrivals with fees
- **Business Rules:** No-show fees calculated based on reservation value percentage

### No-Show Categorization
- **Standard No-Show:** No contact, no arrival within grace period
- **Late No-Show:** Arrives after grace period but within extended window
- **Excused No-Show:** Valid reason provided, fees waived by staff
- **Partial No-Show:** Customer modifies or shortens rental period

### Customer Pattern Detection
```sql
-- Algorithm for repeat offender detection
- 2 no-shows in 30 days: Warning flag
- 3 no-shows in 90 days: Deposit required for future reservations
- 5 no-shows in 365 days: Reservation approval required
```

## API Endpoints Needed

### GET /api/reservations/pending-no-shows
**Purpose:** Retrieve reservations at risk of no-show
**Response:**
```json
{
  "pendingNoShows": [
    {
      "reservationId": "uuid",
      "confirmationNumber": "RES-20240806-0001",
      "customer": {...},
      "pickupDatetime": "2024-08-15T10:00:00Z",
      "minutesOverdue": 45,
      "graceMinutesRemaining": 75,
      "estimatedNoShowFee": 50.00
    }
  ]
}
```

### POST /api/reservations/{id}/process-no-show
**Purpose:** Process automatic or manual no-show
**Request Body:**
```json
{
  "type": "automatic|manual",
  "reason": "No contact after grace period",
  "waiveFees": false,
  "staffNotes": "Customer called but couldn't make it"
}
```

### POST /api/reservations/{id}/convert-late-arrival
**Purpose:** Convert no-show to rental for late arrivals
**Request Body:**
```json
{
  "actualPickupDatetime": "2024-08-15T13:30:00Z",
  "applyLateFee": true,
  "lateFeeAmount": 25.00
}
```

### GET /api/customers/{id}/no-show-history
**Purpose:** Retrieve customer's no-show pattern
**Response:**
```json
{
  "customerId": "uuid",
  "totalNoShows": 2,
  "noShowsLast30Days": 1,
  "noShowsLast90Days": 2,
  "riskLevel": "medium",
  "requiresDeposit": true,
  "noShowHistory": [...]
}
```

### POST /api/no-shows/batch-process
**Purpose:** Process multiple no-shows automatically
**Internal endpoint for scheduled jobs**

## Database Schema Requirements

### New Tables
```sql
CREATE TABLE no_show_events (
    id UUID PRIMARY KEY,
    reservation_id UUID REFERENCES reservations(id),
    customer_id UUID REFERENCES customers(id),
    no_show_type VARCHAR(20) NOT NULL, -- standard, late, excused, partial
    grace_period_minutes INTEGER,
    minutes_overdue INTEGER,
    fee_amount DECIMAL(10,2) DEFAULT 0,
    fee_waived BOOLEAN DEFAULT FALSE,
    waive_reason TEXT,
    processed_by UUID REFERENCES staff(id), -- NULL for automatic
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    customer_notified_at TIMESTAMP,
    notes TEXT
);

CREATE TABLE customer_no_show_patterns (
    customer_id UUID PRIMARY KEY REFERENCES customers(id),
    total_no_shows INTEGER DEFAULT 0,
    no_shows_last_30_days INTEGER DEFAULT 0,
    no_shows_last_90_days INTEGER DEFAULT 0,
    no_shows_last_365_days INTEGER DEFAULT 0,
    risk_level VARCHAR(10) DEFAULT 'low', -- low, medium, high
    requires_deposit BOOLEAN DEFAULT FALSE,
    requires_approval BOOLEAN DEFAULT FALSE,
    last_calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE no_show_configurations (
    id UUID PRIMARY KEY,
    location_id UUID REFERENCES locations(id),
    grace_period_minutes INTEGER DEFAULT 120,
    extended_grace_period_minutes INTEGER DEFAULT 240,
    base_fee_percentage DECIMAL(5,2) DEFAULT 10.00,
    minimum_fee_amount DECIMAL(10,2) DEFAULT 25.00,
    maximum_fee_amount DECIMAL(10,2) DEFAULT 100.00,
    reminder_24h_enabled BOOLEAN DEFAULT TRUE,
    reminder_2h_enabled BOOLEAN DEFAULT TRUE
);
```

### Updated Tables
```sql
ALTER TABLE reservations ADD COLUMN no_show_processed_at TIMESTAMP;
ALTER TABLE reservations ADD COLUMN no_show_event_id UUID REFERENCES no_show_events(id);
```

### Indexes
```sql
CREATE INDEX idx_reservations_pickup_overdue ON reservations(pickup_datetime, status) 
    WHERE status = 'CONFIRMED';
CREATE INDEX idx_no_show_events_customer ON no_show_events(customer_id);
CREATE INDEX idx_no_show_events_date ON no_show_events(processed_at);
```

## UI/UX Considerations

### No-Show Dashboard
- **Alert Panel:** Overdue reservations requiring immediate attention
- **Timeline View:** Upcoming pickups with countdown timers
- **Action Buttons:** Quick process, contact customer, extend grace period
- **Status Indicators:** Color-coded alerts (yellow warning, red overdue)

### Customer Communication
- **Automated Messages:** Professional templates for no-show notifications
- **Multi-channel:** Email primary, SMS backup option
- **Fee Explanation:** Clear breakdown of charges and policies
- **Appeal Process:** Information on how to dispute no-show fees

### Staff Controls
- **Override Options:** Easy waiver process for legitimate cases
- **Pattern Alerts:** Visual indicators for repeat no-show customers
- **Batch Processing:** Handle multiple no-shows efficiently
- **Reporting Tools:** Analytics on no-show trends and impacts

## Testing Scenarios

### Scenario 1: Automatic No-Show Processing
**Given:** Reservation pickup time was 3 hours ago with 2-hour grace period  
**When:** Automated job runs  
**Then:** Reservation marked as no-show, vehicle released, customer notified, fee applied

### Scenario 2: Late Arrival Within Extended Grace
**Given:** Customer arrives 3 hours late within 4-hour extended grace period  
**When:** Staff attempts to convert reservation  
**Then:** System allows conversion with late arrival fee applied

### Scenario 3: Staff Override for Emergency
**Given:** Customer calls explaining medical emergency prevented pickup  
**When:** Staff processes manual override  
**Then:** No-show fees waived, incident logged, customer good standing maintained

### Scenario 4: Repeat Offender Detection
**Given:** Customer with 2 previous no-shows in 30 days  
**When:** Processing third no-show  
**Then:** Customer flagged as high risk, future reservations require deposit

### Scenario 5: Partial No-Show Handling
**Given:** Customer arrives but wants shorter rental than reserved  
**When:** Staff processes modified rental  
**Then:** Partial no-show recorded, minimal fees applied, remaining time released

### Scenario 6: Concurrent Vehicle Assignment
**Given:** No-show vehicle becomes available  
**When:** Multiple staff try to assign to new customers  
**Then:** First assignment succeeds, others receive availability update

### Scenario 7: Customer Communication Failure
**Given:** No-show event processed successfully  
**When:** Email notification fails to send  
**Then:** Notification marked for retry, staff alerted to contact customer manually

### Scenario 8: Appeal Process
**Given:** Customer disputes no-show fee  
**When:** Management reviews case with audit trail  
**Then:** Decision recorded, fee adjusted if warranted, customer notified

## Definition of Done

- [ ] All acceptance criteria implemented and tested
- [ ] Automated job scheduler configured and working
- [ ] No-show detection algorithm accurate and reliable
- [ ] Customer pattern tracking functional
- [ ] Fee calculation engine implemented
- [ ] Multi-channel notification system working
- [ ] Staff override capabilities implemented
- [ ] Database schema created with proper indexes
- [ ] API endpoints implemented with validation
- [ ] UI dashboard created for staff management
- [ ] Unit tests cover all business logic with >90% coverage
- [ ] Integration tests validate automated processing
- [ ] Performance tests ensure timely processing
- [ ] Customer communication templates created
- [ ] Management reporting functionality complete
- [ ] Documentation updated (procedures, API, user guide)
- [ ] Staff training conducted

## Dependencies

### Internal Dependencies
- Reservation system (Stories 1, 2)
- Customer management system
- Email/SMS notification service
- Fleet availability system
- Payment processing for fees

### External Dependencies
- Email service provider
- SMS service provider (optional)
- Scheduled job system (cron/scheduled tasks)

## Risk Mitigation

### Risk: False positive no-shows due to system errors
- **Mitigation:** Manual verification step for high-value reservations
- **Contingency:** Easy reversal process with automatic fee refunds

### Risk: Customer disputes and reputation damage
- **Mitigation:** Clear communication and fair appeal process
- **Contingency:** Management override capabilities and customer service protocols

### Risk: Revenue loss from legitimate late arrivals
- **Mitigation:** Extended grace period with reasonable late fees
- **Contingency:** Flexible conversion options for borderline cases

### Risk: System performance issues during high-volume periods
- **Mitigation:** Optimized database queries and batch processing
- **Contingency:** Manual processing capabilities as backup

## Success Criteria
- No-show processing accuracy >99%
- Vehicle release time <15 minutes after no-show determination
- Customer notification delivery >95% success rate
- No-show rate reduction to <5% within 3 months
- Zero false-positive no-show incidents
- Staff satisfaction >4.5/5 for no-show management tools