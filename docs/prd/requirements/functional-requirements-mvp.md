# Functional Requirements - MVP Version

## Priority 1: Core Features (Must Have)

### FR1: Digital Contract Creation (Week 1-8)
**The single most important feature**
- Create rental contracts digitally in under 5 minutes
- Pre-populate from customer database
- Include all Swiss legal requirements
- Support for walk-in and returning customers
- Basic validation to prevent errors
- Auto-save to prevent data loss

### FR2: Customer Database (Week 3-4)
**Essential for contract creation**
- Add new customers with required fields (name, ID, license, contact)
- Search existing customers by name or ID
- View basic rental history
- Flag problematic customers (simple blacklist)
- Edit customer information
- No deletion (for audit trail)

### FR3: Vehicle Fleet Management (Week 5-6)
**Prevent double-bookings**
- Register vehicles (make, model, plate, year)
- Track availability status (available/rented/maintenance)
- Set basic daily/weekly rental rates per vehicle
- Current odometer and fuel level tracking
- Simple maintenance flag (available/not available)
- Basic vehicle categories

### FR4: PDF Contract Generation (Week 7-8)
**Legal requirement**
- Generate contracts as PDF
- Include all legal terms and conditions
- Embed customer and vehicle information
- Add rental period and pricing
- Swiss-compliant formatting
- Email or print capability

## Priority 2: Revenue Features (Must Have)

### FR5: Revenue Tracking (Week 9-10)
**Core value proposition**
- Record fuel level at pickup and return
- Record odometer at pickup and return
- Calculate fuel charges based on difference
- Calculate kilometer overage charges
- Track payment method (cash/card/bank transfer)
- Show additional charges clearly

### FR6: Swiss QR-Bill Generation (Week 11-12)
**Market requirement**
- Generate valid Swiss QR-bills
- Include correct reference numbers
- Support CHF currency
- Include company bank details
- Validate with Swiss banking standards
- PDF export for sending

### FR7: Basic Pricing Calculator (Week 9-10)
**Accurate pricing essential**
- Calculate daily/weekly rates
- Add extra charges (GPS, child seat)
- Apply kilometer/fuel charges
- Include Swiss VAT (7.7%)
- Show total clearly
- Support basic discounts (percentage)

## Priority 3: Digital Features (Should Have)

### FR8: Digital Signatures (Week 13-14)
**Paperless operation**
- Capture customer signature on screen
- Capture staff signature
- Timestamp signatures
- Embed in PDF contract
- Legal compliance for Swiss law
- Works on tablet and desktop

### FR9: Photo Documentation (Week 13-14)
**Damage protection**
- Take photos of vehicle condition
- Take photo of customer ID/license
- Basic annotation on photos
- Embed photos in contract PDF
- Compress images for storage
- 4 angles minimum (front/back/sides)

### FR10: Fleet Calendar View (Week 5-6)
**Visual availability**
- Calendar showing vehicle bookings
- Click date to see available vehicles
- Color coding for status
- Week and month views
- Quick navigation between dates
- No drag-drop (keep it simple)

## Priority 4: Operational Features (Should Have)

### FR11: Basic Role Management (Week 1-2)
**Data security**
- Two roles only: Owner and Staff
- Owners see financial data
- Staff see operational data only
- Simple login system
- Password reset capability
- Session timeout for security

### FR12: Revenue Dashboard (Week 15-16)
**Prove ROI to owners**
- Daily revenue summary
- Monthly revenue trends
- Payment method breakdown
- Additional charges captured
- Number of contracts created
- Time saved vs paper metric

### FR13: Contract Modifications (Week 15-16)
**Real-world necessity**
- Extend rental period
- Change return date
- Add additional charges
- Apply discounts
- Create amended contract
- Maintain audit trail

## What's Explicitly OUT of MVP Scope

### Not Included:
- Offline mode / PWA functionality
- Mobile app (web only)
- Email automation (manual sending)
- Online customer portal
- Advance reservations system
- Complex reporting/analytics
- Multi-location support
- Multiple languages (German only)
- Automated payment processing
- Third-party integrations (except QR-bills)
- Telematics/GPS tracking
- Insurance claims management
- Loyalty programs
- Corporate accounts
- API for external systems

## Technical Requirements (Simplified)

### Performance
- Page load under 3 seconds on 4G
- PDF generation under 10 seconds
- Search results under 2 seconds
- Support 50 vehicles maximum
- Support 5 concurrent users

### Security
- HTTPS everywhere
- Basic password security
- Session management
- Data encryption at rest
- Daily backups

### Compatibility
- Chrome, Safari, Edge (latest versions)
- iPad primary, desktop secondary
- No Internet Explorer support
- Minimum 1024x768 resolution

## Success Criteria for MVP

The MVP is complete when a rental company can:
1. ✅ Create a digital contract in under 5 minutes
2. ✅ Generate legally compliant PDF contracts
3. ✅ Track fuel/kilometer revenue accurately
4. ✅ Generate valid Swiss QR-bills
5. ✅ See clear ROI in the dashboard
6. ✅ Operate completely without paper

## User Acceptance Criteria

### For Staff:
- Can create contract for new customer in <5 minutes
- Can create contract for returning customer in <2 minutes
- Can record vehicle return and charges in <2 minutes
- Can check vehicle availability instantly

### For Owners:
- Can see daily revenue at a glance
- Can track additional revenue from fuel/km
- Can verify time savings
- Can justify subscription cost with data

---

*These requirements represent the absolute minimum viable product that still delivers clear value to Swiss car rental SMEs.*