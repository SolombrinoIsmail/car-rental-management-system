# Story 01: Customer Management Foundation

**Story ID:** CRMS-001  
**Epic:** Epic 1 - Core Contract Operations  
**Priority:** High  
**Status:** Ready for Development

## User Story Statement

**As a** rental staff member  
**I want to** quickly find or create customer profiles  
**So that** I can start rental contracts efficiently and provide personalized service

## Detailed Acceptance Criteria

1. **Fast Customer Search**
   - GIVEN a database of up to 50,000 customers
   - WHEN searching by name, email, phone, or customer ID
   - THEN results display within 2 seconds for exact matches, 3 seconds for fuzzy search
   - AND show maximum 20 results per page with pagination
   - AND display customer photo thumbnail, full name, phone, and status badge
   - AND indicate customer status with color coding (green=active, red=blacklisted, gold=VIP)
   - AND handle search errors with specific messages (e.g., "No results found", "Search term too
     short")

2. **New Customer Creation**
   - GIVEN mandatory fields: first name, last name, email, phone, ID type, ID number
   - WHEN creating a new customer profile
   - THEN validate all fields in real-time with specific error messages
   - AND complete customer creation within 10 seconds including all validations
   - AND capture ID document photos (max 5MB per image, JPEG/PNG only)
   - AND capture driver's license photos (max 5MB per image, JPEG/PNG only)
   - AND validate Swiss ID formats:
     - Swiss passport: 1 letter + 7 digits (e.g., X1234567)
     - Swiss ID card: 8 digits (e.g., 12345678)
     - Residence permit: Format B/C/L/F + 8 digits
   - AND prevent duplicate creation by checking email (100% match) and phone (exact match)
   - AND auto-save draft every 30 seconds to prevent data loss

3. **Customer Profile Management**
   - GIVEN an existing customer profile
   - WHEN viewing or editing customer information
   - THEN load complete profile within 2 seconds
   - AND track all changes with timestamp, user ID, and field changed
   - AND limit notes field to 2000 characters
   - AND support 5 flag types: blacklist, VIP, payment-risk, damage-risk, special-needs
   - AND enforce GDPR data retention:
     - Active customers: retain indefinitely
     - Inactive customers: auto-flag for review after 3 years
     - Deleted customers: anonymize after 30 days
   - AND require manager role (level 2+) for blacklist modifications
   - AND log all flag changes in audit trail

4. **Rental History Integration**
   - GIVEN a customer with rental history
   - WHEN viewing customer profile
   - THEN display last 50 rentals in reverse chronological order
   - AND load rental history within 3 seconds
   - AND show for each rental: dates, vehicle, total amount, status icon
   - AND highlight overdue rentals in red with days overdue count
   - AND calculate lifetime value: sum of all completed rental revenues
   - AND display outstanding balance if amount > CHF 0.01
   - AND provide "Load More" option for rentals beyond 50

5. **Document Management**
   - GIVEN document upload requirements
   - WHEN managing customer documents
   - THEN support maximum 10 documents per customer
   - AND enforce file limits: max 5MB per file, 50MB total per customer
   - AND accept formats: JPEG, PNG, PDF only
   - AND auto-detect expiry dates from Swiss documents with 85% accuracy
   - AND alert staff 30 days before document expiry via dashboard notification
   - AND display expired documents with red border and "EXPIRED" badge
   - AND compress images to 80% quality if over 2MB
   - AND generate thumbnails (200x200px) within 5 seconds of upload

6. **Customer Risk Management**
   - GIVEN risk management requirements
   - WHEN flagging customers
   - THEN require selection from predefined risk reasons (max 500 chars custom note)
   - AND display modal warning when selecting flagged customer: "⚠️ This customer is flagged as
     [reason]"
   - AND support temporary blacklist with expiry date (max 2 years)
   - AND support permanent blacklist with mandatory reason
   - AND require manager approval within 24 hours for blacklist changes
   - AND send email notification to manager for pending approvals
   - AND auto-expire temporary blacklists at midnight on expiry date

7. **Data Validation and Integrity**
   - GIVEN data quality requirements
   - WHEN validating customer data
   - THEN validate email format using RFC 5322 standard
   - AND validate Swiss phone numbers: +41 format or 07x/09x (10 digits)
   - AND check duplicates in real-time during creation (within 500ms)
   - AND block contract creation if required documents expired or missing
   - AND perform basic ID validation:
     - Check digit validation for Swiss IDs
     - Format validation for all document numbers
     - Cross-reference name on ID with entered name (fuzzy match 80%)
   - AND display specific validation errors inline within 200ms

8. **Performance Requirements**
   - THE SYSTEM SHALL handle 50,000+ customer records
   - AND support 20 concurrent users without degradation
   - AND maintain response times:
     - Search: <2 seconds for exact, <3 seconds for fuzzy
     - Profile load: <2 seconds
     - Photo upload: <10 seconds per photo (up to 5MB)
     - Thumbnail generation: <5 seconds
     - Validation checks: <500ms
   - AND handle 100 searches per minute at peak load
   - AND maintain 99.9% uptime during business hours (7am-7pm)
   - AND auto-retry failed uploads up to 3 times

## Technical Implementation Notes

- **Database Design:** PostgreSQL with proper indexing on search fields
- **Search Engine:** Elasticsearch or PostgreSQL full-text search for fuzzy matching
- **Photo Storage:** AWS S3 or compatible object storage with CDN
- **Image Processing:** Automatic compression and thumbnail generation
- **Caching:** Redis for frequently accessed customer data
- **Data Migration:** Import existing customer data from current system

## API Endpoints Needed

```
GET    /api/customers/search?q={query}&limit={limit}
POST   /api/customers
GET    /api/customers/{id}
PUT    /api/customers/{id}
DELETE /api/customers/{id}
GET    /api/customers/{id}/rentals
POST   /api/customers/{id}/documents
GET    /api/customers/{id}/documents
PUT    /api/customers/{id}/flags
GET    /api/customers/{id}/risk-assessment
```

## Database Schema Requirements

```sql
-- Customers table
customers (
  id UUID PRIMARY KEY,
  customer_code VARCHAR(20) UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  date_of_birth DATE,
  address JSONB,
  id_document_type VARCHAR(50),
  id_document_number VARCHAR(100),
  driver_license_number VARCHAR(100),
  flags JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Customer documents table
customer_documents (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  document_type VARCHAR(50),
  file_url VARCHAR(500),
  thumbnail_url VARCHAR(500),
  expiry_date DATE,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Customer search indexes
CREATE INDEX idx_customers_search ON customers
USING GIN (to_tsvector('english', first_name || ' ' || last_name || ' ' || email));
CREATE INDEX idx_customers_phone ON customers (phone);
CREATE INDEX idx_customers_email ON customers (email);
```

## UI/UX Considerations

- **Search Interface:** Prominent search bar with auto-complete suggestions
- **Customer Cards:** Visual customer cards showing photo, name, and key info
- **Progressive Disclosure:** Show essential info first, expandable details
- **Mobile Responsive:** Touch-friendly interface for tablet use
- **Photo Capture:** Camera integration for document scanning
- **Accessibility:** Screen reader compatible, keyboard navigation
- **Loading States:** Clear indicators during search and photo upload
- **Error Handling:** User-friendly error messages with recovery options

## Testing Scenarios

1. **Basic Search Functionality**
   - Search by exact customer name returns correct results
   - Partial name search returns relevant matches
   - Search by customer ID returns exact match
   - Empty search query shows appropriate message

2. **New Customer Creation**
   - Create customer with all required fields succeeds
   - Validation prevents creation with missing mandatory fields
   - Duplicate customer creation is prevented
   - Document upload during creation works correctly

3. **Photo Management**
   - Upload ID and license photos successfully
   - Photo compression and thumbnail generation works
   - Large photo files are handled gracefully
   - Expired document alerts are displayed correctly

4. **Performance Testing**
   - Search returns results within 5-second requirement
   - System handles 10 concurrent searches without degradation
   - Large customer database (50k+ records) performs adequately
   - Photo upload completes within timeout limits

5. **Security and Privacy**
   - Customer data access is properly authenticated
   - GDPR compliance features work correctly
   - Blacklist functionality prevents unauthorized access
   - Sensitive data is properly encrypted at rest

6. **Integration Testing**
   - Customer creation integrates with contract system
   - Rental history displays correctly
   - Document expiry notifications trigger properly
   - Risk flags appear in contract creation workflow

7. **Error Handling**
   - Network failures during photo upload are handled gracefully
   - Database connection issues show appropriate messages
   - Invalid document formats are rejected with clear feedback
   - System recovery after temporary failures works correctly

8. **Mobile and Accessibility**
   - Interface works on tablets and mobile devices
   - Camera integration works on mobile browsers
   - Screen readers can navigate customer information
   - Keyboard navigation works for all functions

## Definition of Done

- [ ] All acceptance criteria implemented and tested
- [ ] API endpoints developed and documented
- [ ] Database schema deployed with proper indexes
- [ ] UI components developed and responsive
- [ ] Photo upload and storage working end-to-end
- [ ] Search performance meets <5 second requirement
- [ ] GDPR compliance features implemented
- [ ] Security testing completed (authentication, authorization)
- [ ] Integration tests with contract creation system
- [ ] User acceptance testing completed by staff
- [ ] Code review completed and approved
- [ ] Documentation updated (technical and user guides)

## Estimated Effort

**Story Points:** 8

**Breakdown:**

- Backend development (3 points)
- Frontend development (2 points)
- Photo storage integration (1 point)
- Search optimization (1 point)
- Testing and bug fixes (1 point)

**Dependencies:**

- Database infrastructure setup
- Photo storage solution selection
- Authentication system implementation

**Risks:**

- Photo storage costs may exceed budget
- Search performance with large datasets
- GDPR compliance complexity
