# Story 2: After-Hours Return Process

## Story Information

- **Story ID:** CRMS-E9-S2
- **Epic:** 9 - Operational Edge Cases
- **Story Points:** 5

## User Story

**As a** rental staff member  
**I want to** process after-hours returns efficiently  
**So that** customers have return flexibility while maintaining operational control and revenue
protection

## Detailed Acceptance Criteria

1. **Key Drop Box Process**
   - System guides customers through after-hours return procedure via mobile app
   - Digital key drop confirmation with photo evidence required
   - Return location validation using GPS coordinates
   - Fuel level and mileage self-reporting with photo validation

2. **Provisional Status Management**
   - Rental contract automatically moves to "Provisional Return" status
   - Vehicle marked as "Pending Inspection" and unavailable for new rentals
   - Return timestamp recorded based on key drop confirmation
   - Provisional charges calculated based on reported conditions

3. **Next-Day Inspection Workflow**
   - System generates inspection task for next business day opening
   - Priority queue for after-hours returns requiring inspection
   - Staff checklist includes fuel, mileage, damage, and cleanliness verification
   - Photo comparison with customer-submitted return photos

4. **Automated Customer Notification**
   - Immediate confirmation email/SMS upon key drop
   - Notification includes provisional charges and inspection timeline
   - Follow-up message after inspection completion with final charges
   - Proactive communication about any discrepancies found

5. **Discrepancy Resolution**
   - System flags discrepancies between reported and actual condition
   - Automated dispute resolution workflow for minor differences
   - Escalation process for significant discrepancies requiring customer contact
   - Photo evidence storage for potential customer disputes

6. **Final Processing Workflow**
   - One-click final processing after successful inspection
   - Automatic charge adjustments based on actual vs. reported conditions
   - Final receipt generation and customer delivery
   - Contract closure and vehicle availability update

7. **Late Return Charge Calculation**
   - Automatic calculation of late fees based on return time vs. scheduled
   - Grace period application (configurable, e.g., 30 minutes)
   - Tiered late fee structure (hourly, half-day, full-day rates)
   - Maximum late fee caps and daily rate conversions

8. **Security and Fraud Prevention**
   - Multiple verification checkpoints to prevent fraudulent returns
   - IP address and device fingerprinting for return submissions
   - Geolocation verification for return location accuracy
   - Unusual pattern detection (multiple after-hours returns, etc.)

9. **Exceptional Situation Handling**
   - Process for returns when key drop box is full or malfunctioning
   - Alternative return methods (security office, emergency contact)
   - Weather-related return modifications and photo requirement adjustments
   - Holiday and weekend processing schedule accommodations

10. **Manager Override Capabilities**
    - Manager approval for waiving late fees or discrepancy charges
    - Bulk processing approval for multiple after-hours returns
    - Emergency contact for customer issues during off-hours
    - Override authority for exceptional circumstances

11. **Reporting and Analytics**
    - After-hours return volume and pattern analysis
    - Discrepancy rate tracking and trend identification
    - Customer satisfaction metrics for after-hours experience
    - Staff efficiency metrics for next-day processing

12. **Integration Requirements**
    - Mobile app integration for customer return process
    - Photo storage and comparison system
    - Payment processing for final charge adjustments
    - Calendar integration for next-day task scheduling

## Technical Implementation Notes

### Backend Services

- `AfterHoursReturnService`: Manages the complete after-hours return lifecycle
- `InspectionWorkflowService`: Handles next-day inspection processes
- `DiscrepancyResolutionService`: Manages difference detection and resolution
- `LateChargeCalculationService`: Computes late return fees
- `ReturnValidationService`: Verifies return authenticity and accuracy

### Data Models

```sql
after_hours_returns (
  id, rental_id, customer_id, vehicle_id,
  drop_timestamp, reported_fuel_level, reported_mileage,
  gps_coordinates, photos, status, inspected_at,
  actual_fuel_level, actual_mileage, discrepancies,
  final_charges, processed_at
)

return_inspections (
  id, return_id, inspector_user_id, inspection_date,
  fuel_verified, mileage_verified, damage_found,
  cleanliness_rating, photos, notes, completed_at
)
```

### State Machine

Scheduled → Overdue → Provisionally Returned → Pending Inspection → Inspected → Processed → Closed

## API Endpoints

### Customer-Facing Endpoints

- `POST /api/returns/after-hours/initiate` - Start after-hours return process
- `POST /api/returns/after-hours/submit` - Submit return with photos and details
- `GET /api/returns/after-hours/{id}/status` - Check return processing status
- `GET /api/returns/after-hours/{id}/receipt` - Get final receipt

### Staff-Facing Endpoints

- `GET /api/inspections/pending` - Get list of returns needing inspection
- `POST /api/inspections/{id}/complete` - Submit inspection results
- `PUT /api/returns/after-hours/{id}/process` - Finalize return processing
- `POST /api/returns/after-hours/{id}/dispute` - Handle customer disputes

### Integration Endpoints

- `POST /api/external/photo-validation` - Validate submitted photos
- `GET /api/external/weather/{location}` - Get weather conditions for return assessment
- `POST /api/notifications/after-hours-alerts` - Send staff and customer notifications

## Database Schema Requirements

### New Tables

```sql
CREATE TABLE after_hours_returns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id UUID REFERENCES rentals(id) NOT NULL,
  customer_id UUID REFERENCES customers(id) NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) NOT NULL,
  drop_timestamp TIMESTAMP NOT NULL,
  reported_fuel_level INTEGER CHECK (reported_fuel_level >= 0 AND reported_fuel_level <= 100),
  reported_mileage INTEGER,
  gps_coordinates POINT,
  drop_location VARCHAR(200),
  customer_photos TEXT[], -- Array of photo URLs
  status VARCHAR(30) NOT NULL DEFAULT 'submitted',
  inspection_scheduled_for DATE,
  inspected_at TIMESTAMP,
  inspector_user_id UUID REFERENCES users(id),
  actual_fuel_level INTEGER,
  actual_mileage INTEGER,
  discrepancies JSONB,
  late_charges DECIMAL(10,2) DEFAULT 0,
  discrepancy_charges DECIMAL(10,2) DEFAULT 0,
  final_charges DECIMAL(10,2),
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE return_discrepancies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  return_id UUID REFERENCES after_hours_returns(id),
  discrepancy_type VARCHAR(50) NOT NULL, -- fuel, mileage, damage, cleanliness
  reported_value VARCHAR(100),
  actual_value VARCHAR(100),
  charge_applied DECIMAL(10,2),
  customer_notified BOOLEAN DEFAULT false,
  disputed BOOLEAN DEFAULT false,
  resolution_notes TEXT,
  resolved_at TIMESTAMP
);
```

### Schema Updates

- Add `after_hours_enabled` boolean to vehicles table
- Add `after_hours_return_count` to customer profiles
- Add `late_return_tolerance_minutes` to rental_terms table

## UI/UX Considerations

### Customer Mobile Interface

- Clear step-by-step return guidance with visual aids
- Multiple photo capture with automatic lighting/quality checks
- GPS confirmation with address validation
- Real-time return confirmation with receipt preview

### Staff Inspection Interface

- Split-screen comparison of customer photos vs. inspection photos
- Quick-tap buttons for common inspection results
- Voice-to-text notes capability for detailed findings
- One-click approval for returns matching customer reports

### Dashboard Integration

- After-hours returns requiring attention prominently displayed
- Color-coded status indicators for processing urgency
- Batch processing capabilities for multiple returns
- Quick access to customer contact information for disputes

### Accessibility Features

- Voice-guided return process for visually impaired customers
- Large button interface for outdoor/low-light conditions
- Multiple language support for return instructions
- Screen reader compatibility for staff interfaces

## Testing Scenarios

### Scenario 1: Standard After-Hours Return

**Given:** Customer returns vehicle at 10 PM with accurate reporting **When:** Customer completes
drop process and staff inspects next morning **Then:** Return processed within 15 minutes, customer
charged exact amount, vehicle available

### Scenario 2: Fuel Level Discrepancy

**Given:** Customer reports full tank but actual level is 75% **When:** Staff completes inspection
and finds difference **Then:** System calculates fuel charge, notifies customer, processes payment
automatically

### Scenario 3: Late Return with Grace Period

**Given:** Customer returns 45 minutes after scheduled time (30-minute grace) **When:** System
processes return timestamp **Then:** 15-minute late fee applied, customer notified of charge

### Scenario 4: Photo Quality Issues

**Given:** Customer submits blurry or dark photos during return **When:** System analyzes photo
quality **Then:** Customer prompted to retake photos with guidance for better lighting

### Scenario 5: GPS Location Verification Failure

**Given:** Customer attempts return from incorrect location **When:** GPS validation runs during
submission **Then:** Return rejected, customer directed to correct drop location

### Scenario 6: Key Drop Box Malfunction

**Given:** Key drop box is full or broken during return attempt **When:** Customer selects
alternative return method **Then:** System provides emergency contact number and alternative
procedures

### Scenario 7: Weather-Related Photo Exemption

**Given:** Severe weather conditions during return **When:** Staff reviews return requiring reduced
photo requirements **Then:** System applies weather exemption, accepts minimal photos, flags for
careful inspection

### Scenario 8: Customer Dispute Resolution

**Given:** Customer disputes discrepancy charges after inspection **When:** Customer contacts
support about charges **Then:** System provides photo evidence, initiates dispute resolution
workflow

## Definition of Done

- [ ] After-hours return submission process fully functional
- [ ] Mobile app integration for customer return workflow completed
- [ ] Photo capture and validation system operational
- [ ] GPS location verification working accurately
- [ ] Next-day inspection workflow integrated with staff task system
- [ ] Automated discrepancy detection and charge calculation implemented
- [ ] Customer notification system sending timely updates
- [ ] Late fee calculation engine accurate for all scenarios
- [ ] Manager override functionality for exceptional cases
- [ ] Batch processing capabilities for staff efficiency
- [ ] Security measures preventing fraudulent returns implemented
- [ ] Photo storage system with comparison capabilities operational
- [ ] Payment processing integration for charge adjustments working
- [ ] Comprehensive error handling for all failure scenarios
- [ ] Performance testing completed (return submission <5 seconds)
- [ ] User acceptance testing with actual customers and staff
- [ ] Documentation and training materials for staff created

## Dependencies

- Mobile application development platform
- Photo storage and processing service
- GPS and mapping services
- Payment processing system integration
- Customer notification service
- Staff task management system

## Risks and Mitigation

- **Risk:** Photo evidence quality insufficient for dispute resolution
  - **Mitigation:** Implement photo quality validation and retake prompts
- **Risk:** GPS spoofing for fraudulent returns
  - **Mitigation:** Multiple verification methods and pattern recognition
- **Risk:** Customer disputes overwhelming staff time
  - **Mitigation:** Automated dispute resolution for minor discrepancies
- **Risk:** Key drop box security concerns
  - **Mitigation:** Surveillance integration and tamper-evident features
