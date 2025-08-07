# Car Rental Management System (CRMS) - MVP Product Requirements Document

## Executive Summary

CRMS is a web-based SaaS solution for Swiss car rental SMEs that delivers:
- **2-minute digital contracts** (vs 15-30 minutes paper-based)
- **10-15% revenue capture improvement** through automated tracking
- **Tiered pricing CHF 99-299/month** based on fleet size
- **6-8 week development timeline** for true MVP
- **Target: 20 customers in 4 months** from German-speaking Swiss cantons

## Business Goals

### Primary Goals
1. Enable rental companies to complete digital contracts in under 2 minutes
2. Capture 10-15% additional revenue through fuel and kilometer tracking
3. Provide owner-focused ROI dashboard showing money saved/earned
4. Replace paper contracts with legally-compliant digital PDFs
5. Support Swiss QR-bill generation for faster payment collection

### Success Metrics
- Contract completion time: <2 minutes (from current 15-30 minutes)
- Revenue increase: 10-15% from better tracking
- Customer acquisition: 20 paying customers within 4 months
- MRR target: CHF 3,500 by month 4
- Customer satisfaction: >4.5 stars

## Pricing Strategy

**Tiered Pricing by Fleet Size:**
- **Starter (1-10 vehicles):** CHF 99/month
- **Professional (11-30 vehicles):** CHF 199/month  
- **Business (31-50 vehicles):** CHF 299/month
- **Enterprise (50+ vehicles):** Custom pricing

**Early Adopter Incentive:** 20% discount for first 6 months for first 20 customers

## Core User Journeys

### Journey 1: New Rental (2 minutes)
1. Search/create customer (30 seconds)
2. Select available vehicle (30 seconds)
3. Enter rental details & calculate price (30 seconds)
4. Capture signatures (15 seconds)
5. Generate PDF with embedded photos (15 seconds)

### Journey 2: Rental Return (1 minute)
1. Find active contract (15 seconds)
2. Enter return fuel/kilometers (15 seconds)
3. Calculate additional charges (15 seconds)
4. Generate final invoice PDF (15 seconds)

## Functional Requirements (True MVP - 12 Requirements)

### Core Contract Operations

#### FR1: Digital Contract Creation
- Create rental contracts in under 2 minutes
- Auto-populate from customer database
- Required fields: customer, vehicle, dates, price
- Auto-save to prevent data loss
- **Business Value:** 6+ hours daily productivity gain

#### FR2: Customer Database
- Store customer information (name, ID, phone, email, address)
- Search by name or ID number
- View rental history
- Basic blacklist flag for problem customers
- **Business Value:** Faster repeat rentals, risk management

#### FR3: Vehicle Management
- Basic vehicle registry (make, model, plate, year)
- Track current status (available/rented)
- Current odometer and fuel level
- Simple maintenance due flag
- **Business Value:** Prevent double-bookings, track assets

#### FR4: Fleet Calendar View
- Visual calendar showing vehicle availability
- Click to see reservation details
- Drag to extend rentals
- Color coding for vehicle status
- **Business Value:** Optimize fleet utilization

### Documentation & Legal

#### FR5: PDF Contract Generation
- Generate legal Swiss rental contracts
- Include terms and conditions
- Embed customer/vehicle photos directly in PDF
- Embed damage photos with annotations in PDF
- Digital signatures visible in document
- **Business Value:** Legal compliance, instant documentation

#### FR6: Digital Signature Capture
- Touch signature on tablet/computer
- Timestamp and IP address logging
- Signatures embedded in PDF
- **Business Value:** Legally binding, paperless

#### FR7: Photo Documentation
- Capture customer ID photo
- Capture vehicle condition photos (4 angles minimum)
- Damage photos with annotation capability
- All photos embedded directly in contract PDF (no separate storage)
- **Business Value:** Dispute resolution, insurance claims

### Financial Management

#### FR8: Pricing Calculation
- Daily/weekly/monthly rates
- Extra charges (GPS, child seat, etc.)
- Fuel difference calculation
- Kilometer overage calculation
- Swiss VAT included
- **Business Value:** Accurate pricing, no manual calculations

#### FR9: Revenue Tracking
- Track fuel levels (before/after)
- Track kilometers (before/after)
- Calculate additional charges automatically
- Show in owner dashboard
- **Business Value:** Capture 10-15% more revenue

#### FR10: Swiss QR-Bill Generation
- Generate QR-bills for payment
- Include rental reference
- Track payment status manually
- **Business Value:** Faster payment collection

### Access Control

#### FR11: Basic Role Management
- Two roles: Owner and Staff
- Owners see financial dashboard
- Staff see operational views
- Password-protected access
- **Business Value:** Data security, owner oversight

#### FR12: Owner ROI Dashboard
- Daily/weekly/monthly revenue
- Time saved vs paper process
- Additional revenue captured
- Number of contracts processed
- Average contract value
- **Business Value:** Justify subscription cost

## Non-Functional Requirements (Simplified)

### Performance
- **NFR1:** Page load <3 seconds on 4G
- **NFR2:** Search results <2 seconds
- **NFR3:** PDF generation <5 seconds

### Reliability
- **NFR4:** 99% uptime during business hours (8am-6pm)
- **NFR5:** Daily automated backups
- **NFR6:** HTTPS encryption for all data

### Scalability
- **NFR7:** Support up to 50 vehicles per account
- **NFR8:** Handle 5 concurrent users
- **NFR9:** Store up to 100 contracts per month

### Compliance
- **NFR10:** Swiss data residency
- **NFR11:** GDPR compliance for customer data
- **NFR12:** Swiss contract law compliance

## Technical Architecture (Simplified)

### Technology Stack
- **Frontend:** React (simple SPA)
- **Backend:** Node.js with PostgreSQL
- **Authentication:** Supabase Auth
- **PDF Generation:** Server-side with embedded images
- **Hosting:** Vercel or similar
- **Database:** Supabase PostgreSQL

### Key Technical Decisions
- **No offline mode** - requires internet connection
- **No PWA** - standard web application
- **Photos in PDF only** - no separate blob storage needed
- **Real-time only** - no complex sync logic
- **German language only** - no i18n complexity

## Development Timeline (6-8 Weeks)

### Week 1-2: Foundation & Availability
- Setup infrastructure (database, hosting, auth setup)
- Basic auth & role management (FR11)
- Customer database (FR2)
- Vehicle management (FR3)
- Fleet calendar view (FR4) - *Critical for preventing double-bookings*

### Week 3-4: Contract Creation Flow
- Contract creation UI (FR1)
- Pricing calculation (FR8) - *Needed during contract creation*
- Photo capture infrastructure (FR7)
- Digital signature capture (FR6)
- PDF generation with embedded photos (FR5)

### Week 5-6: Contract Completion & Financial Features
- Contract return flow implementation
- Revenue tracking with fuel/km calculations (FR9)
- Additional charges calculation
- Swiss QR-bill generation (FR10)
- Owner ROI dashboard (FR12)

### Week 7: Polish & Testing
- Performance optimization
- User testing with beta customers
- Bug fixes and refinements
- Documentation preparation

### Week 8: Deployment
- Production deployment
- Customer onboarding documentation
- Launch to first customers
- Monitor and support initial users

## Out of Scope for MVP

### Explicitly NOT Included:
- Offline capabilities
- PWA features
- Multi-language support (French, Italian, English)
- Email automation
- Contract modifications
- Contract cancellations
- Complex business rules
- Third-party integrations (except payment)
- Mobile apps
- Customer portal
- Automated payment processing
- Insurance integrations
- Booking system integration
- WhatsApp integration
- Advanced reporting/analytics
- Bulk operations
- Data import/export (except basic PDF)

### Post-MVP Considerations (Month 3+):
1. French language support (23% market expansion)
2. Contract modifications
3. Email automation
4. Basic offline mode (if validated)
5. Enhanced reporting

## Risk Mitigation

### Critical Risks:
1. **Insurance photo requirements** - Validate with 2 insurers before Week 1
2. **PDF legal compliance** - Verify with Swiss legal expert
3. **Customer adoption** - Secure 3 beta customers before development
4. **Pricing validation** - Test willingness to pay at each tier

### Assumptions to Validate:
1. 2-minute contracts are achievable with this feature set
2. Owners will pay for time savings + revenue capture
3. German-only is acceptable for initial market
4. Internet connectivity is reliable at rental locations

## Success Criteria

### MVP Launch Criteria:
- [ ] 2-minute contract creation achieved
- [ ] 3 beta customers using system
- [ ] Owner dashboard shows clear ROI
- [ ] PDF contracts legally compliant
- [ ] QR-bills validate with Swiss banks
- [ ] System handles 50 contracts without issues

### 4-Month Success Metrics:
- 20 paying customers
- CHF 3,500 MRR
- <5% monthly churn
- 10%+ revenue increase for customers
- 4.5+ star customer reviews

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-08-06 | 2.0 | Complete rewrite for true MVP scope | John (PM) |
| 2025-08-06 | 2.1 | Removed offline, PWA, complex features | John (PM) |
| 2025-08-06 | 2.2 | Focus shifted to owner ROI | John (PM) |
| 2025-08-06 | 2.3 | Fixed critical sequencing issues - moved Fleet Calendar to Week 1-2, reorganized dependencies | John (PM) |

---

## Summary

This TRUE MVP focuses on the core value proposition: digital contracts in 2 minutes with better revenue tracking. By eliminating offline complexity, PWA requirements, and separate photo storage, we can deliver a working solution in 6-8 weeks that provides immediate value to Swiss car rental SMEs.

The key differentiator remains: Swiss-specific features (QR-bills, Swiss legal compliance) with laser focus on owner ROI rather than feature complexity.