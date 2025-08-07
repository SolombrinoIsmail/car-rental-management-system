# Story 2: Damage Dispute Process

## Story ID
**Epic:** 08 - Dispute & Exception Handling  
**Story:** 02  
**Priority:** High  
**Phase:** 3 (Week 10)

## User Story Statement
**As a** rental staff member  
**I want to** manage damage disagreements systematically  
**So that** legitimate damage claims are processed fairly while protecting the company from false claims

## Detailed Acceptance Criteria

### AC-01: Damage Dispute Case Creation
- **Given** a customer disputes damage charges
- **When** staff creates a damage dispute case
- **Then** the system links to the original damage assessment
- **And** captures the customer's disputed claim details

### AC-02: Evidence Management System
- **Given** a damage dispute case exists
- **When** staff manages evidence
- **Then** the system allows attachment of before/after photos
- **And** provides tools to annotate and compare images

### AC-03: Customer Statement Capture
- **Given** a damage dispute is being documented
- **When** collecting customer input
- **Then** the system records detailed customer statements
- **And** allows voice recording with automatic transcription

### AC-04: Damage Assessment Review
- **Given** conflicting damage evidence
- **When** reviewing the case
- **Then** the system displays original inspection photos
- **And** highlights discrepancies between assessments

### AC-05: Expert Opinion Integration
- **Given** complex damage disputes
- **When** external expertise is needed
- **Then** the system allows third-party assessor input
- **And** tracks expert opinion costs and recommendations

### AC-06: Manager Review Workflow
- **Given** damage disputes exceed staff authority
- **When** manager review is required
- **Then** the system escalates case with all evidence
- **And** provides recommendation based on evidence strength

### AC-07: Partial Waiver Options
- **Given** disputed damage with mixed evidence
- **When** applying resolution
- **Then** the system supports partial charge waivers
- **And** calculates adjusted amounts based on liability percentage

### AC-08: Insurance Coordination
- **Given** disputed damage involves insurance claims
- **When** processing the dispute
- **Then** the system coordinates with insurance workflow
- **And** tracks insurance adjuster decisions

### AC-09: Resolution Documentation
- **Given** damage dispute resolution
- **When** closing the case
- **Then** the system documents final decision rationale
- **And** creates comprehensive case file for legal protection

### AC-10: Customer Communication
- **Given** damage dispute decisions
- **When** communicating resolution
- **Then** the system sends detailed explanation with evidence
- **And** provides appeal process information if applicable

### AC-11: Settlement Processing
- **Given** agreed damage resolution
- **When** finalizing settlement
- **Then** the system processes charge adjustments
- **And** handles payment refunds or additional charges

### AC-12: Legal Documentation
- **Given** potential legal action
- **When** preparing case files
- **Then** the system generates complete evidence packages
- **And** ensures chain of custody for all documentation

## Technical Implementation Notes

### Backend Components
- **DamageDisputeService:** Core damage dispute logic
- **EvidenceManager:** Photo and document handling
- **AssessmentComparator:** Before/after analysis tools
- **ExpertOpinionTracker:** Third-party integration
- **SettlementProcessor:** Financial adjustment handling

### Advanced Features
- **AI Image Analysis:** Automated damage severity assessment
- **Evidence Timeline:** Chronological evidence organization
- **Liability Calculator:** Percentage-based settlement computation
- **Legal Package Generator:** Automated documentation compilation

### Integration Requirements
- Vehicle inspection system integration
- Insurance claim management connection
- Legal document management system
- Expert assessor network APIs

## API Endpoints Needed

### Damage Dispute Management
```
POST /api/v1/disputes/damage
GET /api/v1/disputes/damage/{disputeId}
PUT /api/v1/disputes/damage/{disputeId}/evidence
POST /api/v1/disputes/damage/{disputeId}/assessment
PUT /api/v1/disputes/damage/{disputeId}/settle
```

### Evidence Handling
```
POST /api/v1/disputes/damage/{disputeId}/photos
GET /api/v1/disputes/damage/{disputeId}/comparison
POST /api/v1/disputes/damage/{disputeId}/expert-opinion
```

### Settlement Processing
```
POST /api/v1/disputes/damage/{disputeId}/partial-waiver
GET /api/v1/disputes/damage/{disputeId}/settlement-options
POST /api/v1/disputes/damage/{disputeId}/finalize
```

## Database Schema Requirements

### Damage Disputes Table
```sql
CREATE TABLE damage_disputes (
    id UUID PRIMARY KEY,
    contract_id UUID REFERENCES contracts(id),
    damage_assessment_id UUID REFERENCES damage_assessments(id),
    customer_statement TEXT,
    dispute_reason VARCHAR(100),
    evidence_strength VARCHAR(20),
    liability_percentage INTEGER DEFAULT 100,
    original_amount DECIMAL(10,2),
    disputed_amount DECIMAL(10,2),
    settled_amount DECIMAL(10,2),
    status VARCHAR(30) DEFAULT 'open',
    resolution_type VARCHAR(50),
    created_by UUID REFERENCES users(id),
    reviewed_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);
```

### Dispute Evidence Table
```sql
CREATE TABLE dispute_evidence (
    id UUID PRIMARY KEY,
    dispute_id UUID REFERENCES damage_disputes(id),
    evidence_type VARCHAR(50),
    file_path VARCHAR(500),
    description TEXT,
    uploaded_by UUID REFERENCES users(id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    chain_of_custody JSONB
);
```

### Expert Opinions Table
```sql
CREATE TABLE expert_opinions (
    id UUID PRIMARY KEY,
    dispute_id UUID REFERENCES damage_disputes(id),
    expert_name VARCHAR(100),
    expert_credentials VARCHAR(200),
    opinion_text TEXT,
    recommended_amount DECIMAL(10,2),
    confidence_level INTEGER,
    opinion_date TIMESTAMP,
    cost DECIMAL(8,2)
);
```

### Settlement History Table
```sql
CREATE TABLE settlement_history (
    id UUID PRIMARY KEY,
    dispute_id UUID REFERENCES damage_disputes(id),
    settlement_type VARCHAR(50),
    amount DECIMAL(10,2),
    percentage_waived INTEGER,
    reason_code VARCHAR(50),
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## UI/UX Considerations

### Evidence Comparison Interface
- **Split-Screen View:** Before/after photo comparison
- **Annotation Tools:** Markup capabilities for highlighting damage
- **Zoom and Pan:** Detailed damage examination tools
- **Timeline View:** Chronological evidence organization

### Dispute Resolution Dashboard
- **Evidence Strength Meter:** Visual indicator of case strength
- **Settlement Calculator:** Interactive liability percentage tool
- **Expert Opinion Panel:** Third-party assessment integration
- **Resolution Recommendation Engine:** AI-powered suggestions

### Mobile Evidence Capture
- **In-Field Documentation:** Mobile app for additional evidence
- **Real-Time Upload:** Immediate evidence synchronization
- **GPS Tagging:** Location verification for evidence authenticity
- **Voice Notes:** Quick verbal documentation capability

## Testing Scenarios

### TS-01: Photo Evidence Dispute
- **Given:** Customer disputes damage shown in return photos
- **When:** Staff creates damage dispute with customer photos
- **Then:** System provides side-by-side photo comparison
- **Expected:** Visual evidence comparison available for assessment

### TS-02: Partial Damage Liability
- **Given:** Damage partly pre-existing, partly new
- **When:** Manager sets 60% customer liability
- **Then:** System calculates partial charge (60% of original)
- **Expected:** Settlement amount reflects proportional liability

### TS-03: Expert Opinion Integration
- **Given:** Complex damage requiring professional assessment
- **When:** Third-party expert provides opinion
- **Then:** System integrates expert recommendation into case
- **Expected:** Expert opinion influences settlement calculation

### TS-04: Insurance Coordination
- **Given:** Damage covered by customer insurance
- **When:** Insurance adjuster reviews case
- **Then:** System coordinates with insurance workflow
- **Expected:** Insurance decision integrated with dispute resolution

### TS-05: Evidence Chain of Custody
- **Given:** Multiple evidence items from different sources
- **When:** Generating legal documentation
- **Then:** System maintains complete evidence chronology
- **Expected:** Chain of custody preserved for legal validity

### TS-06: Customer Appeal Process
- **Given:** Customer disagrees with damage dispute resolution
- **When:** Customer initiates appeal
- **Then:** System escalates to senior management review
- **Expected:** Appeal process documented with additional review cycle

### TS-07: Settlement Processing
- **Given:** Agreed damage settlement for partial waiver
- **When:** Processing settlement
- **Then:** System adjusts charges and processes refund
- **Expected:** Financial transactions completed with proper documentation

### TS-08: Legal Package Generation
- **Given:** Damage dispute heading to legal action
- **When:** Preparing legal documentation
- **Then:** System compiles complete evidence package
- **Expected:** Comprehensive legal file ready for attorney review

## Definition of Done

- [ ] Damage dispute case creation workflow functional
- [ ] Photo evidence management and comparison tools working
- [ ] Customer statement capture with transcription operational
- [ ] Manager review and escalation workflow active
- [ ] Partial waiver calculation system functional
- [ ] Expert opinion integration capability working
- [ ] Insurance coordination workflow operational
- [ ] Settlement processing with refunds functional
- [ ] Legal documentation package generation working
- [ ] Chain of custody maintenance for all evidence
- [ ] All API endpoints tested and documented
- [ ] Database schema optimized for evidence storage
- [ ] Mobile evidence capture interface tested
- [ ] Integration with existing damage assessment system
- [ ] Staff training materials for dispute handling completed

## Estimated Effort
**Story Points:** 8 (1.5 developer days)

### Breakdown:
- **Backend Development:** 5 points (dispute logic, evidence handling, settlement processing)
- **Frontend Development:** 2 points (evidence comparison UI, dispute management interface)
- **Integration Work:** 1 point (insurance system, legal documentation)

### Dependencies:
- Existing damage assessment system
- Photo storage and management infrastructure
- Insurance claim management system
- Legal documentation templates
- Expert assessor network partnerships