# Story 02: Digital Contract Creation

**Story ID:** CRMS-002  
**Epic:** Epic 1 - Core Contract Operations  
**Priority:** High  
**Status:** Ready for Development

## User Story Statement

**As a** rental staff member  
**I want to** create complete rental contracts digitally  
**So that** I can serve customers in under 2 minutes and eliminate paperwork errors

## Detailed Acceptance Criteria

1. **Quick Contract Initialization (Target: 30 seconds)**
   - GIVEN a staff member needs to create a contract
   - WHEN selecting a customer from search results
   - THEN auto-populate all customer fields within 500ms
   - AND default rental start time to current timestamp rounded to next 15 minutes
   - AND support walk-in customers with inline creation (adds max 45 seconds)
   - AND display progress indicator showing "Step 1 of 5: Customer Selection"
   - AND prevent navigation away without save confirmation if data entered

2. **Vehicle Selection and Availability (Target: 20 seconds)**
   - GIVEN rental dates are specified
   - WHEN searching for available vehicles
   - THEN display results within 2 seconds with real-time status
   - AND show for each vehicle: photo, make/model, daily rate, features icons
   - AND indicate status with badges: "Available" (green), "Rented" (red), "Maintenance" (yellow)
   - AND lock selected vehicle for 10 minutes during contract creation
   - AND release lock automatically if contract not completed
   - AND show countdown timer for reservation lock ("Reserved for 9:45")

3. **Dynamic Pricing Calculation (Target: Real-time <500ms)**
   - GIVEN vehicle and rental duration selected
   - WHEN calculating pricing
   - THEN update total price within 500ms of any change
   - AND apply discount rules in order: Corporate (up to 20%), Loyalty (up to 15%), Seasonal (up to 10%)
   - AND support extras with quantities: GPS (CHF 15/day), Child seat (CHF 10/day), Additional driver (CHF 25/contract)
   - AND display breakdown: Base (CHF X), Extras (CHF Y), Discount (-CHF Z), VAT (7.7%), Total
   - AND support CHF (default) and EUR with live exchange rate (±2% margin)
   - AND validate total price is within bounds: min CHF 50, max CHF 10,000 per day

4. **Vehicle Condition Documentation (Target: 60 seconds)**
   - GIVEN vehicle inspection requirements
   - WHEN documenting vehicle condition
   - THEN capture minimum 8 exterior photos (front, back, 4 corners, both sides)
   - AND capture minimum 4 interior photos (dashboard, front seats, back seats, trunk)
   - AND compress photos to max 1MB each while maintaining 1920x1080 minimum resolution
   - AND record fuel level in 1/8 increments with visual gauge
   - AND record odometer reading with validation (±1000km from last known)
   - AND support damage marking on visual car diagram with 20 predefined zones
   - AND convert voice-to-text for damage notes (max 500 characters per damage)
   - AND require confirmation: "All damage documented?" before proceeding

5. **Contract Terms and Legal Compliance**
   - GIVEN Swiss legal requirements
   - WHEN generating contract terms
   - THEN include mandatory clauses: insurance coverage, liability limits, cross-border restrictions
   - AND load terms in customer's language within 1 second (DE/FR/IT/EN)
   - AND highlight any custom modifications in yellow with "Modified" badge
   - AND validate contract completeness: 15 required fields must be filled
   - AND version terms with date stamp (e.g., "Terms v2024.03.15")
   - AND block progression if customer under 21 or license <1 year old

6. **PDF Generation and Management (Target: 10 seconds)**
   - GIVEN completed contract data
   - WHEN generating PDF
   - THEN create PDF within 10 seconds for standard contract (up to 10 pages)
   - AND include: header with logo, customer details, vehicle info, all photos, terms, signature blocks
   - AND embed photos at 300DPI quality in PDF
   - AND generate unique contract number: YYYY-MM-XXXXX (year-month-sequence)
   - AND store PDF with versioning (v1, v2, etc.) for any modifications
   - AND support PDF/A format for long-term archival
   - AND handle generation failure with retry (max 3 attempts) and fallback to queue

7. **Pre-Signature Validation**
   - GIVEN contract ready for finalization
   - WHEN validating before signatures
   - THEN complete all checks within 3 seconds total:
     - Customer documents valid (not expired within rental period)
     - Vehicle available for entire duration (no conflicts)
     - Price calculation verified (±CHF 0.01 tolerance)
     - Minimum 12 photos captured and saved
     - Customer not blacklisted (real-time check)
     - Payment method verified if deposit required
   - AND display validation checklist with checkmarks/errors
   - AND block progression with specific error: "Cannot proceed: [specific issue]"

8. **Quick Actions and Shortcuts**
   - GIVEN efficiency requirements
   - WHEN using quick actions
   - THEN scan vehicle barcode/QR to select in <2 seconds
   - AND support keyboard shortcuts: Ctrl+N (new contract), Ctrl+S (save draft), Ctrl+P (generate PDF)
   - AND provide 5 contract templates for common scenarios (daily, weekly, monthly, long-term, corporate)
   - AND capture up to 20 photos in burst mode with auto-categorization
   - AND auto-save draft every 30 seconds with "Draft saved" toast notification
   - AND restore last draft if browser crashes (up to 24 hours old)

9. **Integration with Fleet Management**
   - GIVEN contract creation completion
   - WHEN updating system state
   - THEN update vehicle status to "rented" within 1 second
   - AND block vehicle in calendar for rental period +2 hour buffer
   - AND trigger maintenance alert if due within 500km or 7 days
   - AND update vehicle mileage with timestamp
   - AND send status to GPS tracker if equipped (within 5 seconds)
   - AND handle integration failures gracefully with queued retry

10. **2-Minute Target Breakdown**
    - Customer selection/creation: 30 seconds
    - Vehicle selection: 20 seconds
    - Pricing and extras: 10 seconds
    - Photo documentation: 60 seconds
    - Review and signatures: 10 seconds
    - **TOTAL: 120 seconds (2 minutes)**

## Technical Implementation Notes

- **Contract Engine:** Domain-driven design with contract aggregate
- **Pricing Engine:** Rule-based system with configurable rates
- **PDF Generation:** Headless Chrome or dedicated PDF service
- **Photo Processing:** Automatic compression, EXIF data removal
- **Template System:** Handlebars or similar for contract templates
- **Real-time Updates:** WebSocket for live pricing calculations
- **Caching:** Redis for vehicle availability and pricing rules

## API Endpoints Needed

```
POST   /api/contracts
GET    /api/contracts/{id}
PUT    /api/contracts/{id}
DELETE /api/contracts/{id}/draft
GET    /api/vehicles/available?start_date={date}&end_date={date}
GET    /api/vehicles/{id}/details
POST   /api/contracts/{id}/vehicle-condition
GET    /api/pricing/calculate
POST   /api/contracts/{id}/generate-pdf
GET    /api/contracts/{id}/pdf
POST   /api/contracts/{id}/photos
GET    /api/contract-templates
PUT    /api/contracts/{id}/save-draft
```

## Database Schema Requirements

```sql
-- Contracts table
contracts (
  id UUID PRIMARY KEY,
  contract_number VARCHAR(50) UNIQUE,
  customer_id UUID REFERENCES customers(id),
  vehicle_id UUID REFERENCES vehicles(id),
  status VARCHAR(20) DEFAULT 'draft',
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  pickup_location VARCHAR(200),
  return_location VARCHAR(200),
  base_price DECIMAL(10,2),
  extras_price DECIMAL(10,2),
  discount_amount DECIMAL(10,2),
  vat_amount DECIMAL(10,2),
  total_price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'CHF',
  terms_version VARCHAR(20),
  language VARCHAR(5) DEFAULT 'de',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contract extras table
contract_extras (
  id UUID PRIMARY KEY,
  contract_id UUID REFERENCES contracts(id),
  extra_type VARCHAR(50),
  extra_name VARCHAR(100),
  unit_price DECIMAL(10,2),
  quantity INTEGER DEFAULT 1,
  total_price DECIMAL(10,2)
);

-- Vehicle condition records
vehicle_conditions (
  id UUID PRIMARY KEY,
  contract_id UUID REFERENCES contracts(id),
  vehicle_id UUID REFERENCES vehicles(id),
  condition_type VARCHAR(20), -- 'pickup' or 'return'
  fuel_level INTEGER, -- percentage
  odometer_reading INTEGER,
  damage_notes TEXT,
  inspection_completed BOOLEAN DEFAULT false,
  recorded_by UUID REFERENCES users(id),
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- Contract photos table
contract_photos (
  id UUID PRIMARY KEY,
  contract_id UUID REFERENCES contracts(id),
  photo_type VARCHAR(50), -- 'exterior', 'interior', 'damage', etc.
  file_url VARCHAR(500),
  thumbnail_url VARCHAR(500),
  caption TEXT,
  taken_at TIMESTAMP DEFAULT NOW()
);
```

## UI/UX Considerations

- **Wizard Interface:** Step-by-step contract creation flow
- **Progress Indicators:** Clear progress through contract creation steps
- **Auto-Save:** Visual indicators when draft is saved automatically
- **Photo Gallery:** Grid view for capturing and organizing photos
- **Price Calculator:** Real-time price updates as options change
- **Mobile Camera:** Optimized camera interface for photo capture
- **Error Prevention:** Field validation with immediate feedback
- **Quick Actions:** Prominent buttons for common operations
- **Print Preview:** Live preview of contract before PDF generation

## Testing Scenarios

1. **Complete Contract Creation Flow**
   - Create contract from customer selection to PDF generation
   - Verify all customer data auto-populates correctly
   - Confirm vehicle selection updates availability status
   - Test pricing calculation with various scenarios

2. **Vehicle Condition Documentation**
   - Capture required photos for complete vehicle inspection
   - Test photo compression and storage functionality
   - Verify damage notes are saved and displayed correctly
   - Test voice-to-text functionality for damage descriptions

3. **Pricing Engine Accuracy**
   - Test base price calculation with different rental periods
   - Verify discount application (percentage and fixed amounts)
   - Test VAT calculation compliance with Swiss rates
   - Confirm extras pricing is added correctly

4. **PDF Generation Performance**
   - Generate contracts with various languages and templates
   - Test PDF generation completes within 30-second requirement
   - Verify all contract data appears correctly in PDF
   - Test PDF generation with large numbers of photos

5. **Error Handling and Recovery**
   - Test behavior when vehicle becomes unavailable during creation
   - Verify draft auto-save recovery after browser crash
   - Test handling of photo upload failures
   - Confirm validation prevents incomplete contracts

6. **Integration Testing**
   - Verify vehicle availability updates in fleet management
   - Test customer blacklist checking during creation
   - Confirm contract creation updates vehicle status
   - Test integration with pricing rule engine

7. **Performance and Concurrency**
   - Test multiple staff creating contracts simultaneously
   - Verify system performance with 20+ concurrent users
   - Test contract creation time meets 2-minute requirement
   - Confirm database performance with large datasets

8. **Legal and Compliance**
   - Verify generated contracts include all required Swiss clauses
   - Test multi-language contract generation accuracy
   - Confirm T&C version tracking works correctly
   - Test contract template customization functionality

9. **Mobile and Tablet Experience**
   - Test contract creation on tablet devices
   - Verify photo capture works on mobile browsers
   - Test touch interface usability
   - Confirm responsive design adapts correctly

## Definition of Done

- [ ] All acceptance criteria implemented and tested
- [ ] Contract creation completes within 2-minute target
- [ ] PDF generation works reliably within 30 seconds
- [ ] Vehicle condition photos captured and stored properly
- [ ] Pricing engine calculates accurately with Swiss VAT
- [ ] Swiss legal compliance verified by legal review
- [ ] Multi-language support implemented (DE/FR/IT/EN)
- [ ] Integration with customer and vehicle systems complete
- [ ] Auto-save and recovery functionality working
- [ ] Mobile/tablet interface tested and approved
- [ ] Performance testing completed (20+ concurrent users)
- [ ] Security testing completed (data validation, authorization)
- [ ] User acceptance testing completed by rental staff
- [ ] Documentation completed (API docs, user guides)

## Estimated Effort

**Story Points:** 13

**Breakdown:**
- Contract creation workflow (3 points)
- Pricing engine development (2 points)
- PDF generation system (2 points)
- Photo capture and management (2 points)
- Vehicle condition recording (1 point)
- Legal compliance and templates (2 points)
- Testing and optimization (1 point)

**Dependencies:**
- Customer management system (Story 01)
- Vehicle management system
- PDF generation service setup
- Photo storage infrastructure
- Legal contract template review

**Risks:**
- PDF generation performance with large photo sets
- Swiss legal compliance complexity
- Mobile camera integration reliability
- Pricing calculation accuracy requirements