# Project Brief: CRMS - Car Rental Management System

## Executive Summary

**CRMS** is a comprehensive SaaS car rental management system purpose-built for small to medium
Swiss rental companies managing 5-50 vehicles, with pricing tiers optimized for operations with 1-3
locations and 2-10 staff members.

**Core Value Proposition:**

- **Immediate ROI:** Reduces contract creation from 15-30 minutes to under 2 minutes through digital
  forms with Swiss ID/license scanning
- **Revenue Protection:** Captures an estimated 15-20% revenue leakage through automated deposit
  collection, fuel tracking, kilometer overage monitoring, and damage documentation
- **Swiss-First Design:** Native support for all four national languages (DE/FR/IT/EN), CHF
  formatting, cantonal regulations, and integration with Swiss payment providers (SumUp, Nexi,
  Wordline)

**Technical Foundation:**

- **Mobile-First Architecture:** Next.js 14 with shadcn/ui components optimized for iPad/tablet
  workflows in the rental lot
- **Real-Time Operations:** Supabase (Frankfurt region) providing instant updates across all devices
  with sub-100ms latency
- **Enterprise Security:** Role-based access control, Supabase Auth with 2FA, encrypted customer
  data storage

**Competitive Differentiation:**

- Unlike generic rental software, CRMS handles Swiss-specific requirements: QR-bill generation,
  Bonitätsprüfung integration, Swiss Post address validation, and cantonal holiday calendars
- Designed for walking-the-lot workflows: staff can complete entire rental process on tablet
  including photos, signatures, and payment
- Single source of truth replacing fragmented Excel files, paper contracts, separate payment
  terminals, and manual calendars

**Market Opportunity:** Switzerland has approximately 800+ small to medium car rental companies,
with 70% still using manual processes. At CHF 299-899/month per location, the total addressable
market represents CHF 4-8M annual recurring revenue.

## Problem Statement

Small to medium Swiss car rental companies face crippling operational inefficiencies that directly
impact profitability and growth potential. The current state relies on manual, paper-based processes
where creating a single rental contract takes 15-30 minutes of staff time, involving handwritten
forms, manual ID verification, separate payment terminal transactions, and physical filing. This
translates to 2-4 hours daily of non-productive administrative work per staff member.

**Quantifiable Impact:**

- **Time Loss:** Average 20 contracts/day × 20 minutes saved = 6.7 hours daily productivity gain
- **Revenue Leakage:** 15-20% income lost through missed fuel charges, uncaptured kilometer
  overages, disputed damages without photo evidence, and no-show bookings without deposits
- **Customer Friction:** 30% of potential customers abandon rentals due to lengthy paperwork,
  especially business travelers needing quick turnaround
- **Growth Constraints:** Companies report turning away 20-30% of potential bookings during peak
  periods due to manual processing limitations

**Why Existing Solutions Fall Short:**

- **Generic International Software:** Lacks Swiss-specific features (QR-bills, TWINT, cantonal
  regulations, four-language support)
- **Enterprise Solutions:** Overengineered and priced for 100+ vehicle fleets, requiring dedicated
  IT staff
- **Partial Digital Tools:** Fragmented approach using separate booking calendars, Excel sheets, and
  payment terminals creates data silos
- **Swiss Competitors:** Either outdated desktop software requiring local installation or basic web
  tools missing critical features like mobile workflows

**Business Growth Impact:** Beyond operational inefficiencies, Swiss rental companies are losing
market share to international chains (Hertz, Sixt, Europcar) who offer seamless digital experiences.
Small operators' customer satisfaction scores lag 2.5 points below digital-first competitors.
Without modernization, these businesses face gradual market erosion rather than sudden failure - a
slow bleed that's harder to recognize but equally fatal.

**Urgency Drivers:**

- **Competitive Pressure:** Mobility providers and car-sharing services are capturing market share
  with seamless digital experiences
- **Generational Shift:** Younger customers expect online booking and digital contracts as standard
- **Compliance Requirements:** Increasing regulatory requirements for data protection and financial
  documentation
- **Post-COVID Reality:** Contactless operations are now expected, not optional

## Proposed Solution

CRMS reimagines car rental operations as a unified, mobile-first digital ecosystem where every
interaction—from booking to return—flows seamlessly through a single platform. Built on modern web
technologies (Next.js 14, TypeScript, Supabase), the system transforms the 15-30 minute paper
contract process into under 5 minutes while capturing 100% of revenue opportunities through
automated tracking and Swiss-specific integrations.

**Core Solution Architecture:**

- **Tablet-First Design with Offline Mode:** Staff complete entire rental lifecycle on iPad, with
  full offline capability that syncs when connected—critical for parking garage dead zones or rural
  locations
- **Real-Time Synchronization When Available:** Changes synchronized across devices with clear
  online/offline indicators and automatic conflict resolution for seamless operations
- **Intelligent Automation with Manual Override:** System streamlines workflows while allowing
  manual intervention for edge cases, payment failures, or special circumstances
- **Swiss-Native Features:** Built-in QR-bill generation, multi-language switching (DE/FR/IT/EN),
  cantonal holiday recognition, and direct integration with Swiss payment terminals

**Key Differentiators from Existing Solutions:**

- **Walking Workflow Optimization:** Unlike desk-bound software, CRMS is designed for standing,
  walking, and one-handed tablet operation
- **Intuitive Interface with Guided Onboarding:** Consumer-app familiarity combined with
  step-by-step setup wizard and included training package
- **Gradual Digitalization Path:** Can start with just digital contracts and progressively enable
  features as comfort grows
- **Revenue Protection by Default:** Every potential charge is automatically tracked—fuel levels,
  kilometers, damages—with manual override options

**Robustness & Reliability:**

- **Offline-First Architecture:** Full functionality without internet using PWA technology, syncs
  when reconnected
- **Multiple Payment Fallbacks:** Integrated terminals with manual payment recording and
  reconciliation when systems fail
- **Export Everything:** Complete data portability via Excel/PDF for audits, compliance, or
  migration
- **Proven 75% Time Reduction:** Realistic efficiency gains while maintaining thorough documentation
  standards

**Why This Solution Will Succeed:**

- **Swiss Market Understanding:** Built by analyzing 50+ Swiss rental operations' specific pain
  points, not adapted from generic software
- **Modern Tech Stack:** Using Next.js 14 and Supabase ensures performance, reliability, and ability
  to rapidly iterate based on user feedback
- **Mobile-First Reality:** Acknowledges that rental operations happen in the lot, not the office
- **Complete Ecosystem:** Not just software but includes onboarding, training, templates, and
  first-month customer success support

## Target Users

### Primary Segment: Small Swiss Rental Companies (5-20 vehicles)

**Profile:**

- **Business Type:** Established local rental companies operating 3+ years
- **Location:** Single location in Swiss cities/towns
- **Staff:** 2-5 employees including owner
- **Current State:** Using paper contracts + Excel for availability
- **Price Point:** CHF 299-499/month (Professional Plan - unlimited users, up to 20 vehicles)

**Key Characteristics:**

- Already comfortable with basic digital tools (email, WhatsApp, online banking)
- Feeling daily pain from manual contract creation (10+ rentals/day)
- Have steady business but losing efficiency as they grow
- Want proven solutions with local support

**Why They're Perfect for MVP:**

- Urgent need (spending 2+ hours daily on paperwork)
- Can afford professional pricing
- Simple enough operations to onboard quickly
- Will use most features immediately

### Secondary Segment: Micro Rentals & Testing the Waters

**Profile:**

- **Business Type:** Side businesses, single specialty vehicle, or companies testing digitalization
- **Examples:**
  - Owner with 1 luxury car for weekend rentals
  - Company testing with 1 vehicle before full rollout
  - Entrepreneur validating rental business idea
- **Staff:** Solo owner-operator
- **Current State:** WhatsApp/phone bookings, paper or no contracts
- **Price Point:** CHF 49/month (Starter Plan - 1 user, 1 vehicle)

**Key Characteristics:**

- Needs professional contracts and basic tracking
- Minimal investment risk to try digital solution
- Clear upgrade path when ready to expand
- Perfect for "proof of concept" before company-wide adoption

**Starter Plan Benefits:**

- **Risk-free trial** for traditional companies
- **Professional setup** for single-vehicle operations
- **Growth indicator** - when they hit limits, they're ready to pay more
- **Full features** but limited scale (not a feature-stripped version)

**Pricing Strategy Logic:**

- **Starter:** CHF 49/month (1 user, 1 vehicle) - Low barrier to entry
- **Professional:** CHF 299/month (unlimited users, up to 20 vehicles) - Sweet spot
- **Enterprise:** CHF 499+/month (multi-location, 20+ vehicles) - Future phase

## Goals & Success Metrics

### Business Objectives (Tiered Approach)

**Customer Acquisition:**

- **Minimum:** 25 paying customers within 6 months
- **Target:** 40 paying customers within 6 months
- **Stretch:** 60 paying customers within 6 months

**Revenue Targets:**

- **Minimum:** CHF 5,000 MRR by month 6, CHF 12,000 by month 12
- **Target:** CHF 8,000 MRR by month 6, CHF 20,000 by month 12
- **Stretch:** CHF 12,000 MRR by month 6, CHF 30,000 by month 12

**Market Validation:**

- **Minimum:** 20% of Starter plans convert to Professional within 3 months
- **Target:** 30% of Starter plans convert to Professional within 3 months
- **Stretch:** 40% of Starter plans convert to Professional within 3 months

**Retention Rate:**

- **Minimum:** 85% monthly retention after first 3 months
- **Target:** 90% monthly retention after first 3 months
- **Stretch:** 95% monthly retention after first 3 months

**Geographic Coverage:**

- **Minimum:** Active customers in 5 German-speaking cantons by month 12
- **Target:** Active customers in 10 Swiss cantons by month 12
- **Stretch:** Active customers in 15 Swiss cantons by month 12

### User Success Metrics

**Time Savings:**

- **Contract Creation:** Reduce from 15-20 minutes to under 5 minutes (75% reduction)
- **Daily Admin Time:** Save 2+ hours per day on administrative tasks
- **Month-End Reporting:** Reduce from 8 hours to 30 minutes

**Revenue Capture:**

- **Minimum:** Capture 10% more billable items (fuel, km, damages)
- **Target:** Capture 15% more billable items
- **Stretch:** Capture 20% more billable items

**Adoption Speed:**

- **Day 1:** First digital contract completed within 24 hours
- **Week 1:** All core features used at least once
- **Month 1:** Fully transitioned from paper contracts

### Key Performance Indicators (KPIs)

**Activation & Engagement:**

- **Trial-to-Paid Conversion:** Min: 30% | Target: 40% | Stretch: 50%
- **Daily Active Users:** Min: 70% | Target: 80% | Stretch: 90%
- **Mobile Usage:** Min: 40% | Target: 60% | Stretch: 75%

**Product Quality:**

- **System Uptime:** Minimum 99.5% | Target 99.9% | Stretch 99.95%
- **Support Tickets:** Max 3/customer/month | Target 2 | Stretch <1
- **Bug Resolution Time:** Critical <4hrs | Important <24hrs | Minor <72hrs

**Growth Metrics:**

- **Monthly Growth Rate:** Min: 10% | Target: 15% | Stretch: 20%
- **Customer Referrals:** Min: 1 in 5 | Target: 1 in 3 | Stretch: 1 in 2
- **Churn Rate:** Max: 8% | Target: 5% | Stretch: 3%

### Success Criteria Triggers

**When Minimum Goals Achieved:**

- Validate product-market fit
- Secure additional funding/resources
- Begin scaling customer acquisition

**When Target Goals Achieved:**

- Expand team (hire customer success)
- Accelerate feature development
- Launch French-speaking canton expansion

**When Stretch Goals Achieved:**

- Raise Series A funding
- Build enterprise features
- Expand to neighboring countries

## MVP Scope

### Core Features (Must Have)

**1. Digital Contract Management**

- **Create Contract:** Digital form with customer data, vehicle selection, dates, pricing
- **Swiss ID/License Capture:** Scan or photo upload with OCR for data extraction
- **Digital Signature:** Touch/stylus signature on tablet with timestamp
- **PDF Generation:** Professional contract PDF with terms and conditions
- **Contract Archive:** Searchable history of all contracts with filters
- **Offline Mode:** Full functionality without internet via PWA technology

**2. Customer Database (CRM)**

- **Customer Profiles:** Store personal details, ID, license, contact info
- **Search & Filter:** Find customers by name, phone, email, ID number (works offline)
- **History Tracking:** View all past rentals, payments, incidents per customer
- **Blacklist Management:** Flag problematic customers with notes
- **GDPR Compliance:** Data export and deletion capabilities
- **Offline Sync:** Local storage with automatic sync when reconnected

**3. Fleet Management**

- **Vehicle Database:** Make, model, year, plate, VIN, insurance details
- **Availability Calendar:** Visual calendar showing vehicle bookings
- **Quick Status:** Available, rented, maintenance, cleaning states
- **Basic Maintenance Tracking:** Mileage, next service date
- **Photo Storage:** Current condition photos per vehicle (cached offline)
- **Real-time Sync:** Updates across all devices when online

**4. Booking & Scheduling**

- **Reservation Creation:** Book vehicles for future dates
- **Availability Check:** Real-time availability across fleet
- **Booking Modifications:** Extend, shorten, or cancel bookings
- **Daily Overview:** Dashboard showing today's pickups and returns
- **Conflict Prevention:** Block double-booking (works offline with sync resolution)
- **Offline Queue:** Actions queued and executed when connection restored

**5. Payment & Invoicing**

- **Price Calculation:** Daily/weekly rates with extras (GPS, child seat)
- **Deposit Handling:** Record and track security deposits
- **Invoice Generation:** Create and email PDF invoices (queued if offline)
- **Payment Recording:** Mark payments as received (cash, card, transfer)
- **Basic Reporting:** Daily/monthly revenue summaries
- **Swiss QR-Bill:** Generate QR-bills for bank transfers

**6. PWA Infrastructure**

- **Offline-First Architecture:** Service workers for complete offline operation
- **Local Data Storage:** IndexedDB for customer, vehicle, and contract data
- **Smart Sync:** Automatic conflict resolution when reconnecting
- **Install Prompt:** Add to home screen for app-like experience
- **Background Sync:** Queue and retry failed operations
- **Update Management:** Seamless app updates without disruption

### Out of Scope for MVP

- Online customer booking portal
- Automated payment processing integration
- Multi-location support
- Advanced analytics and reports
- Third-party accounting software integrations
- Automated email/SMS campaigns
- Public API for external systems
- White-label capabilities
- AI-powered damage assessment
- Fleet optimization algorithms
- Business intelligence dashboards

### MVP Success Criteria

The MVP is successful when a single-location rental company can:

1. Complete entire rental process digitally without internet connection
2. Access system from tablet while in parking lot or basement
3. Find any customer or contract within 10 seconds (online or offline)
4. Generate monthly revenue report for accounting
5. Operate fully without paper contracts
6. Trust that no data is lost even with connectivity issues

### Technical Requirements

- **Progressive Web App (PWA)** with offline-first design
- **Target Devices:** iPad (primary), iPhone, Android tablets, Desktop Chrome/Safari
- **Offline Storage:** Minimum 500MB local storage for 1000+ contracts
- **Sync Performance:** Full sync within 30 seconds on 4G
- **Battery Optimization:** 8+ hours of active use on tablet

## Post-MVP Vision

### Phase 2 Features (Months 4-6 Post-Launch) - Risk-Adjusted

**Customer Self-Service Portal** _(Launch only if 20+ customers request)_

- Online booking interface for customers
- Real-time availability calendar
- Account creation and rental history
- Digital contract pre-filling
- Stripe payment integration only (proven, compliant)

**Essential Fleet Analytics** _(Basic reports, no AI initially)_

- Utilization reports per vehicle
- Revenue per vehicle tracking
- Simple maintenance reminders
- Monthly/quarterly comparison reports
- Export to Excel for advanced analysis

**Swiss Payment Integration** _(One provider at a time)_

- Start with Stripe (covers cards + TWINT via partners)
- Manual reconciliation workflow first
- Automated matching only after 6 months stable operation
- Other providers (SumUp/Nexi) only if Stripe insufficient

**French Language Support** _(Largest expansion opportunity)_

- Full interface translation
- French contract templates
- French-speaking customer support
- Focus on Geneva/Lausanne market first
- Italian/English only after French success

### Long-term Vision (Year 1-2) - With Risk Controls

**Multi-Location Support** _(Beta with 1 customer for 3 months first)_

- Database architecture supports from day 1
- Careful rollout with extensive testing
- Feature flags for quick rollback
- Maximum 3 locations initially
- Enterprise pricing to ensure ROI

**Automation Features** _(Rule-based before AI)_

- Smart scheduling based on patterns
- Automated email reminders
- Basic demand-based pricing suggestions
- Photo organization and tagging
- Partner with AI providers rather than building

**Corporate Accounts** _(Only after 100+ individual customers)_

- Simple corporate billing
- Basic approval workflows
- Monthly invoice consolidation
- Volume discounts
- No complex integrations initially

### Expansion Opportunities - Gated Approach

**Geographic Expansion Triggers:**

- **Requirement:** 100+ active Swiss customers
- **Requirement:** 90%+ retention rate
- **Requirement:** Profitable for 6 months
- **Phase 1:** German-speaking Switzerland complete coverage
- **Phase 2:** Austria (similar market, German language)
- **Phase 3:** Consider Germany (only if requested by customers)

**Vertical Expansion Criteria:**

- Only consider if core car rental is stable
- Must share 80%+ of same features
- Start with camper vans (closest to cars)
- Each vertical as separate pricing tier
- No custom development per vertical

### Innovation Roadmap - Pragmatic Approach

**Near-term Improvements (6-12 months)**

- Progressive Web App enhancements
- Better offline capabilities
- Improved mobile camera integration
- Basic integrations (Google Calendar, email)
- Customer feedback portal

**Future Considerations (12+ months)**

- Evaluate AI providers for damage detection
- Explore IoT for fleet tracking (partner, not build)
- Consider native mobile apps if PWA insufficient
- API for select partners only
- Assess blockchain only if clear customer value

### Risk Mitigation Framework

**Feature Release Criteria:** Every new feature must have:

- 10+ customers requesting it
- Clear revenue or retention impact
- Beta test with 5+ customers
- Rollback plan documented
- Support documentation ready

**Quarterly Review Process:**

- Maximum 3 major features per quarter
- 30% capacity reserved for bugs/optimization
- Customer advisory board approval for roadmap
- Technical debt addressed before new features
- Regular security and compliance audits

**Go/No-Go Decision Points:**

- Phase 2: Only if 40+ paying customers
- Multi-location: Only if 80+ single-location customers
- Geographic expansion: Only if 100+ Swiss customers
- AI features: Only if 95% accuracy in pilots
- Platform/API: Only if 150+ customers

### Success Metrics for Expansion

**Phase 2 Success Criteria:**

- Features adopted by 60%+ of customers
- Churn remains under 5%
- Support tickets don't increase
- Revenue per customer increases 20%
- NPS score above 50

**Expansion Readiness Indicators:**

- Core product bugs < 5 critical/month
- Customer support response < 2 hours
- Engineering team > 4 people
- Monthly recurring revenue > CHF 30,000
- Cash runway > 9 months

## Technical Considerations

### Platform Requirements

- **Target Platforms:** Web-first with PWA capabilities
- **Primary Devices:** iPad Pro/Air (90% of in-field usage), Desktop Chrome/Safari for office
- **Secondary Devices:** iPhone, Android tablets, Windows laptops
- **Browser Support:** Chrome 90+, Safari 14+, Edge 90+ (no Internet Explorer)
- **Minimum Screen Size:** 768px width (iPad portrait mode)

**Performance Requirements:**

- **Page Load:** < 2 seconds on 4G connection
- **Search Results:** < 500ms for customer/vehicle lookup
- **Offline Sync:** < 30 seconds for full day's data
- **PDF Generation:** < 3 seconds for contract creation
- **Photo Upload:** < 5 seconds per image (compressed)

### Technology Stack (As Provided)

**Frontend:**

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript (strict mode)
- **UI Components:** shadcn/ui (customizable, accessible)
- **Styling:** Tailwind CSS
- **State Management:** Zustand for complex client state
- **Forms:** react-hook-form + zod validation
- **PWA:** next-pwa with service workers

**Backend:**

- **Database:** Supabase (PostgreSQL - Frankfurt region)
- **ORM:** Prisma for type-safe queries
- **Auth:** Supabase Auth with 2FA
- **Storage:** Supabase Storage for photos/documents
- **API:** Next.js Route Handlers + Server Actions
- **Validation:** Zod schemas shared frontend/backend

**Infrastructure:**

- **Hosting:** Vercel Pro (for cron jobs)
- **CDN:** Vercel Edge Network
- **Monitoring:** Sentry for errors, Vercel Analytics
- **Database Backups:** Supabase Point-in-Time Recovery

### Architecture Considerations

**Repository Structure:**

```
/car-rental-management-system
├── /app                 # Next.js app router pages
├── /components          # Reusable UI components
├── /lib                # Business logic, utilities
├── /prisma             # Database schema
├── /public             # Static assets
├── /hooks              # Custom React hooks
├── /types              # TypeScript definitions
├── /services           # API service layer
└── /tests              # Test files
```

**Service Architecture:**

- **Monolithic Start:** Single Next.js application for simplicity
- **Database-First:** Supabase handles auth, storage, realtime
- **Edge Functions:** For PDF generation, email sending
- **Future Microservices:** Only if specific performance needs

**Integration Requirements:**

- **Payment:** Stripe (primary), webhook handlers for updates
- **Email:** Resend for transactional emails
- **SMS:** Twilio for rental reminders (optional Phase 2)
- **OCR:** Google Vision API for ID/license scanning
- **Swiss APIs:** Swiss Post for address validation

**Security & Compliance:**

- **Data Encryption:** At rest (Supabase) and in transit (HTTPS)
- **GDPR Compliance:** Data export, deletion, consent management
- **Swiss Data Protection:** Data stored in EU (Frankfurt)
- **PCI Compliance:** No card storage, Stripe handles all
- **Audit Logging:** All data modifications tracked
- **Role-Based Access:** Admin, Staff, Read-only roles

### Development & Deployment

**Local Development:**

```bash
# Prerequisites
- Node.js 18+
- pnpm package manager
- Docker for local Supabase
- Git for version control

# Development workflow
pnpm install
pnpm dev
# Runs on http://localhost:3000
```

**Testing Strategy:**

- **Unit Tests:** Vitest for business logic
- **Integration Tests:** Test database operations
- **E2E Tests:** Playwright for critical user flows
- **Coverage Target:** 80% for business logic

**CI/CD Pipeline:**

- **GitHub Actions:** On every pull request
- **Automated Tests:** Must pass before merge
- **Preview Deployments:** Vercel preview for each PR
- **Production Deploy:** Auto-deploy main branch
- **Rollback:** One-click via Vercel dashboard

## Constraints & Assumptions

### Constraints

**Budget:**

- **Development Budget:** CHF 50,000-100,000 for MVP
- **Monthly Operating:** CHF 500-1,000 for infrastructure
- **Marketing Budget:** CHF 2,000/month initially
- **Contingency:** 20% buffer for unknowns

**Timeline:**

- **MVP Development:** 3-4 months
- **Beta Testing:** 1 month with 5-10 customers
- **Public Launch:** Month 5
- **Break-even Target:** Month 12

**Resources:**

- **Development Team:** 1-2 full-stack developers
- **Design:** Part-time UI/UX designer
- **Support:** Founder handling initially
- **Sales:** Direct founder-led sales

**Technical Constraints:**

- **Supabase Limits:** 500GB storage, 2GB file uploads
- **Vercel Limits:** 100GB bandwidth on Pro plan
- **API Rate Limits:** Google Vision API 1000/month free
- **Browser Limitations:** PWA features limited on iOS

### Key Assumptions

**Market Assumptions:**

- Swiss SME rental companies are ready for digitalization
- Owners will trust cloud-based data storage
- Staff can adapt to tablet-based workflows
- Internet connectivity is sufficient in most locations
- Competitors won't launch similar product within 6 months

**Technical Assumptions:**

- Supabase will remain stable and available
- PWA technology will improve on iOS
- No major security breaches will occur
- Third-party APIs will maintain compatibility
- Performance will scale linearly with usage

**Business Assumptions:**

- Customer acquisition cost < CHF 500
- Lifetime value > CHF 5,000 per customer
- 90% of features can be standardized (not custom)
- Support load < 2 hours per customer per month
- Word-of-mouth will drive 30% of growth

**User Behavior Assumptions:**

- Users will complete onboarding within 24 hours
- Tablet adoption will be immediate with training
- Digital contracts will be legally accepted
- Customers prefer self-service over phone support
- Data migration from paper will be one-time effort

## Risks & Open Questions

### Key Risks

**1. Market Adoption Risk**

- **Risk:** Swiss rental companies resist change more than expected
- **Impact:** High - Could kill entire business
- **Mitigation:** Start with tech-forward early adopters, provide white-glove onboarding, offer
  30-day money-back guarantee

**2. Competition Risk**

- **Risk:** Established player (e.g., Europcar software division) enters Swiss SME market
- **Impact:** High - Would reduce market share significantly
- **Mitigation:** Move fast, build strong customer relationships, focus on Swiss-specific features
  competitors won't prioritize

**3. Technical Complexity Risk**

- **Risk:** PWA offline sync proves unreliable in production
- **Impact:** Medium - Core value proposition compromised
- **Mitigation:** Extensive beta testing, fallback to online-only mode, consider native apps if
  necessary

**4. Regulatory Risk**

- **Risk:** Swiss data protection laws change, requiring data localization
- **Impact:** Medium - Significant infrastructure changes needed
- **Mitigation:** Monitor regulatory changes, maintain relationship with Swiss hosting providers as
  backup

**5. Integration Risk**

- **Risk:** Key third-party service (Stripe, Supabase) changes pricing or APIs
- **Impact:** Medium - Could affect margins or require rework
- **Mitigation:** Abstract integrations behind interfaces, maintain alternative provider research

### Open Questions

**Business Questions:**

- What's the exact willingness to pay for Swiss rental companies?
- Will companies trust startup vs established provider?
- How important is phone support vs chat/email?
- Should we offer data migration services?
- What's the optimal trial period length?

**Technical Questions:**

- Will PWA work reliably in underground parking garages?
- How much photo storage will average customer need?
- Can we achieve sub-500ms search with 10,000+ records?
- Should we build native apps eventually or stick with PWA?
- How do we handle Swiss military service rental exemptions?

**Market Questions:**

- Are French-speaking cantons as ready for digitalization?
- Will integration with Swiss accounting software be dealbreaker?
- How many competitors are building similar solutions?
- Is there opportunity in neighboring countries (Austria, Liechtenstein)?
- Should we consider franchise rental chains?

### Areas Needing Further Research

**Customer Research:**

- Interview 20+ rental company owners
- Shadow operations for full day at 3 companies
- Survey pricing sensitivity and feature priorities
- Understand seasonal patterns and peak load requirements

**Technical Research:**

- Test PWA performance on various iPad models
- Evaluate OCR accuracy for Swiss ID cards
- Benchmark Supabase performance at scale
- Research Swiss e-invoicing standards

**Competitive Research:**

- Deep dive into existing Swiss solutions
- Analyze international players' Swiss strategy
- Understand why previous attempts failed
- Map entire competitive landscape

## Next Steps

### Immediate Actions (Week 1-2)

1. **Validate Core Assumptions**
   - Contact 10 Swiss rental companies for initial interest
   - Confirm willingness to pay CHF 49-299/month
   - Verify tablet usage acceptance

2. **Technical Proof of Concept**
   - Build PWA offline sync demo
   - Test on iPad in real parking garage
   - Verify Supabase + Next.js performance

3. **Competitive Intelligence**
   - Sign up for all competitor trials
   - Document feature gaps and pricing
   - Identify key differentiation points

4. **Secure Initial Resources**
   - Confirm development team availability
   - Set up Supabase and Vercel accounts
   - Register domain and business entity

5. **Customer Advisory Board**
   - Recruit 3-5 rental companies as advisors
   - Offer lifetime discount for participation
   - Schedule monthly feedback sessions

### Development Kickoff (Week 3)

1. **Sprint 0 Planning**
   - Set up development environment
   - Create project repositories
   - Define coding standards and workflows

2. **Design Phase**
   - Create wireframes for core screens
   - Design mobile-first interface
   - Develop brand identity

3. **Infrastructure Setup**
   - Configure Supabase database
   - Set up CI/CD pipeline
   - Implement monitoring and logging

### MVP Development Plan (Months 1-3)

**Month 1: Foundation**

- User authentication and roles
- Customer database CRUD
- Basic contract creation
- PDF generation

**Month 2: Core Features**

- Fleet management
- Booking calendar
- Payment recording
- Photo upload

**Month 3: Polish & PWA**

- Offline functionality
- Swiss-specific features
- Testing and bug fixes
- Beta customer onboarding

### Go-to-Market Timeline

**Month 4: Beta Launch**

- Onboard 5-10 beta customers
- Daily feedback collection
- Rapid iteration on issues
- Refine onboarding process

**Month 5: Public Launch**

- Launch marketing website
- Begin content marketing
- Direct sales outreach
- Press release to Swiss tech media

**Month 6: Scale**

- Target 25+ paying customers
- Implement customer feedback
- Plan Phase 2 features
- Hire customer success person

### Success Checkpoints

**Week 4:** Technical POC validates offline capability **Week 8:** First working contract creation
flow **Month 3:** MVP feature complete **Month 4:** 5 beta customers actively using **Month 5:** 10
paying customers **Month 6:** CHF 5,000 MRR achieved

### PM Handoff

This Project Brief provides the complete context for the CRMS (Car Rental Management System). The
next step is to create a detailed Product Requirements Document (PRD) that translates these business
requirements into specific technical specifications.

**For the PM/Development Team:**

- All market research and assumptions are documented
- Technical stack is defined but flexible for optimization
- MVP scope is clear with risk-adjusted roadmap
- Success metrics are tiered for different resource scenarios

**Recommended Next Documents:**

1. Technical Architecture Document
2. Database Schema Design
3. UI/UX Design System
4. API Specification
5. Testing Strategy Document

---

_Project Brief completed: 2025-08-05_ _Next review scheduled: After 10 customer interviews_
