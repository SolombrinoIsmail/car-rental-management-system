# Story 1: Lost Key Process

## Story Information
- **Story ID:** CRMS-E9-S1
- **Epic:** 9 - Operational Edge Cases
- **Story Points:** 3

## User Story
**As a** rental staff member  
**I want to** handle lost key situations efficiently  
**So that** operations continue smoothly, costs are recovered, and customers receive appropriate support

## Detailed Acceptance Criteria

1. **Incident Documentation**
   - System captures complete lost key incident details (customer, vehicle, date/time, circumstances)
   - Staff can select from predefined loss scenarios (customer lost, staff lost, stolen, etc.)
   - System generates unique incident reference number

2. **Cost Calculation**
   - System automatically calculates replacement key cost based on vehicle type and key technology
   - Additional costs (locksmith, programming, delivery) are itemized
   - Total cost breakdown is clearly displayed to staff

3. **Customer Charging**
   - System processes lost key charges through existing payment methods
   - Customer receives detailed charge breakdown
   - Failed payment attempts are logged and flagged for follow-up

4. **Replacement Key Ordering**
   - System generates key replacement order with vehicle details and key specifications
   - Integration with preferred key suppliers for automated ordering
   - Order status tracking from placement to delivery

5. **Key Status Tracking**
   - Real-time status updates: Lost → Ordered → In Transit → Received → Programmed → Ready
   - Estimated delivery dates are calculated and displayed
   - Automated notifications to relevant staff on status changes

6. **Vehicle Availability Management**
   - Vehicle status automatically updated to "Out of Service - Key Issue"
   - System prevents new rentals until key replacement is complete
   - Alternative vehicle suggestions provided for affected reservations

7. **Customer Communication**
   - Automated email notification to customer explaining situation and next steps
   - SMS updates on key replacement progress
   - Apology compensation options available for staff to apply

8. **Audit Trail**
   - Complete chronological log of all actions taken
   - Staff member actions are timestamped and attributed
   - Incident resolution time is tracked for performance metrics

9. **Manager Escalation**
   - High-value key replacements (>$500) require manager approval
   - Recurring lost key customers are flagged for review
   - Unusual circumstances trigger automatic manager notification

10. **Insurance Integration**
    - System checks if customer has key replacement coverage
    - Automatic claim initiation for covered incidents
    - Insurance company notifications sent with required documentation

11. **Reporting Capabilities**
    - Lost key incident reports by date range, vehicle, or customer
    - Cost analysis and recovery tracking
    - Trend analysis for prevention strategies

12. **Prevention Measures**
    - Customer key handover checklist integration
    - GPS key fob tracking where available
    - Key return confirmation procedures

## Technical Implementation Notes

### Backend Services
- `IncidentService`: Manages lost key incident lifecycle
- `KeyOrderingService`: Handles replacement key procurement
- `CostCalculationService`: Determines replacement costs
- `NotificationService`: Customer and staff communications
- `PaymentService`: Processes lost key charges

### Data Models
```sql
lost_key_incidents (
  id, vehicle_id, customer_id, rental_id,
  incident_type, description, reported_at,
  estimated_cost, actual_cost, status,
  replacement_order_id, resolved_at
)

key_replacement_orders (
  id, incident_id, supplier_id, order_reference,
  key_type, vehicle_details, order_date,
  estimated_delivery, actual_delivery, status
)
```

### State Machine
Lost → Documented → Charged → Ordered → In Transit → Received → Programmed → Resolved

## API Endpoints

### Core Endpoints
- `POST /api/incidents/lost-keys` - Create lost key incident
- `GET /api/incidents/lost-keys/{id}` - Get incident details
- `PUT /api/incidents/lost-keys/{id}/status` - Update incident status
- `POST /api/key-orders` - Create replacement key order
- `GET /api/key-orders/{id}/status` - Check order status
- `POST /api/incidents/lost-keys/{id}/charges` - Process customer charges

### Integration Endpoints
- `POST /api/external/key-suppliers/orders` - Submit order to supplier
- `GET /api/external/key-suppliers/orders/{id}` - Check supplier order status
- `POST /api/notifications/lost-key-alerts` - Send notifications

## Database Schema Requirements

### New Tables
```sql
CREATE TABLE lost_key_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_number VARCHAR(20) UNIQUE NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id),
  customer_id UUID REFERENCES customers(id),
  rental_id UUID REFERENCES rentals(id),
  incident_type VARCHAR(50) NOT NULL,
  description TEXT,
  reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reported_by_user_id UUID REFERENCES users(id),
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  status VARCHAR(30) NOT NULL DEFAULT 'reported',
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE key_replacement_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES lost_key_incidents(id),
  supplier_name VARCHAR(100),
  order_reference VARCHAR(50),
  key_type VARCHAR(50),
  vehicle_make VARCHAR(50),
  vehicle_model VARCHAR(50),
  vehicle_year INTEGER,
  vin VARCHAR(17),
  order_date DATE,
  estimated_delivery DATE,
  actual_delivery DATE,
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  total_cost DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Schema Updates
- Add `key_status` enum to vehicles table: 'available', 'lost', 'replacement_ordered', 'replacement_pending'
- Add `lost_key_incidents_count` to customer profiles for risk assessment

## UI/UX Considerations

### Incident Reporting Interface
- Quick-access "Lost Key" button in main navigation
- Step-by-step wizard for incident documentation
- Pre-populated vehicle and customer information from current context
- Photo upload capability for any available key remnants

### Cost Transparency
- Clear cost breakdown before customer charging
- Visual progress indicator for replacement process
- Estimated timeline display with key milestones

### Dashboard Integration
- Lost key incidents widget on main dashboard
- Color-coded status indicators (Red: Lost, Orange: Ordered, Green: Resolved)
- Quick action buttons for common tasks

### Mobile Responsiveness
- Touch-friendly interface for tablet use in field
- Offline capability for initial incident reporting
- Camera integration for incident documentation

## Testing Scenarios

### Scenario 1: Standard Lost Key Process
**Given:** Customer reports lost key for Economy vehicle
**When:** Staff documents incident and processes replacement
**Then:** System calculates $150 cost, charges customer, orders replacement, updates vehicle status

### Scenario 2: High-Value Key Replacement
**Given:** Customer loses key for Luxury vehicle ($800 replacement cost)
**When:** Staff attempts to process incident
**Then:** System requires manager approval before proceeding with charges

### Scenario 3: Customer with Key Coverage
**Given:** Customer with comprehensive insurance loses key
**When:** Staff processes lost key incident
**Then:** System initiates insurance claim and reduces customer charge to deductible

### Scenario 4: Failed Payment Processing
**Given:** Customer's payment method fails for lost key charge
**When:** System attempts to process payment
**Then:** Staff receives alert, incident remains open, follow-up task created

### Scenario 5: Supplier Order Tracking
**Given:** Replacement key ordered from supplier
**When:** Supplier provides tracking updates
**Then:** System updates status, notifies relevant staff, adjusts estimated delivery

### Scenario 6: Emergency Key Replacement
**Given:** Customer stranded with urgent travel needs
**When:** Staff marks incident as emergency priority
**Then:** System suggests expedited shipping options, flags for manager attention

### Scenario 7: Recurring Lost Key Customer
**Given:** Customer with 3 previous lost key incidents
**When:** New incident is reported
**Then:** System flags customer for review, suggests key deposit requirement

### Scenario 8: Key Found After Replacement Ordered
**Given:** Replacement key ordered and original key is found
**When:** Staff updates incident status
**Then:** System provides options to cancel order or proceed with backup key

## Definition of Done

- [ ] All acceptance criteria implemented and tested
- [ ] Lost key incident workflow functional end-to-end
- [ ] Cost calculation engine accurate for all vehicle types
- [ ] Customer charging integration working with existing payment system
- [ ] Key supplier integration tested with at least 2 suppliers
- [ ] Vehicle availability updates working correctly
- [ ] Customer notification templates created and tested
- [ ] Manager escalation rules configured and tested
- [ ] Audit trail captures all required information
- [ ] Mobile-responsive interface completed
- [ ] Unit tests achieving >90% code coverage
- [ ] Integration tests for all critical paths
- [ ] Performance testing for incident reporting (<2 seconds)
- [ ] Security review completed for payment processing
- [ ] Staff training documentation prepared
- [ ] User acceptance testing completed with operations team

## Dependencies
- Payment processing system integration
- Vehicle status management system
- Customer notification service
- Key supplier API integrations
- Manager approval workflow system

## Risks and Mitigation
- **Risk:** Key supplier API unavailability
  - **Mitigation:** Manual order fallback process
- **Risk:** Customer disputes charges
  - **Mitigation:** Clear documentation and photo evidence requirements
- **Risk:** Vehicle downtime extends rental impact
  - **Mitigation:** Alternative vehicle recommendation system integration