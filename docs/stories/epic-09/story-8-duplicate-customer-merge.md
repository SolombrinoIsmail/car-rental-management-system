# Story 8: Duplicate Customer Merge

## Story Information

- **Story ID:** CRMS-E9-S8
- **Epic:** 9 - Operational Edge Cases
- **Story Points:** 5

## User Story

**As a** rental staff member  
**I want to** identify and merge duplicate customer records systematically  
**So that** customer data is accurate, marketing efforts are effective, and customer service is
improved through complete rental history

## Detailed Acceptance Criteria

1. **Automated Duplicate Detection**
   - System scans for potential duplicates using multiple criteria (name, phone, email, license
     number)
   - Fuzzy matching algorithm to catch variations in spelling, formatting, and data entry
   - Confidence scoring for duplicate matches (high, medium, low probability)
   - Daily automated scans with flagged potential duplicates for staff review

2. **Multi-Criteria Comparison Interface**
   - Side-by-side record comparison showing all customer data fields
   - Highlighting of differences and similarities between potential duplicate records
   - Contact information validation and verification status display
   - Rental history timeline comparison for both accounts

3. **Intelligent Merge Algorithm**
   - Smart field selection keeping most complete and recent information
   - Preference weighting for verified vs. unverified data sources
   - Automatic selection of primary record based on data quality and completeness
   - Manual override capability for staff decision-making

4. **Rental History Consolidation**
   - Complete merge of all rental transactions under unified customer record
   - Preservation of original rental dates, charges, and terms
   - Maintenance of rental sequence and chronological order
   - Cross-reference tracking for historical data integrity

5. **Communication Preferences Integration**
   - Consolidation of email subscription preferences and opt-out settings
   - Phone and SMS communication preferences merger
   - Marketing segment assignment based on combined customer profile
   - Loyalty program status and points consolidation

6. **Audit Trail Preservation**
   - Complete documentation of merge operation with before/after snapshots
   - Staff member identification and timestamp recording
   - Reason codes for merge decisions and data source preferences
   - Reversibility procedures for incorrectly merged accounts

7. **Reference Update Management**
   - Automatic update of all system references to merged customer ID
   - Payment method and billing information consolidation
   - Insurance and emergency contact information merger
   - Third-party system reference updates (loyalty programs, marketing platforms)

8. **Duplicate Prevention Measures**
   - Real-time duplicate checking during new customer registration
   - Warning system for staff when similar customers are found
   - Enhanced validation rules for customer data entry
   - Machine learning improvement based on confirmed duplicates

9. **Quality Assurance Validation**
   - Manager approval requirements for high-value customer merges
   - Automated validation checks for merge operation completeness
   - Post-merge verification of data integrity and system functionality
   - Customer notification procedures for significant account changes

10. **Batch Processing Capabilities**
    - Bulk merge operations for data cleanup initiatives
    - Scheduled processing for large-scale duplicate resolution
    - Progress tracking and error handling for batch operations
    - Rollback capabilities for batch operations if issues discovered

11. **Customer Communication Management**
    - Notification procedures for customers whose accounts are merged
    - Explanation of improved service benefits from consolidated history
    - Contact information verification and update requests
    - Privacy compliance for data consolidation operations

12. **Performance Impact Minimization**
    - Background processing to avoid system performance degradation
    - Incremental merge operations for large customer databases
    - Database optimization and indexing for efficient duplicate detection
    - Cache invalidation and refresh procedures post-merge

## Technical Implementation Notes

### Backend Services

- `DuplicateDetectionService`: Identifies potential duplicate customers
- `CustomerMergeService`: Orchestrates the complete merge process
- `DataConsolidationService`: Handles data field selection and combination
- `ReferenceUpdateService`: Updates all system references to merged IDs
- `AuditTrailService`: Maintains complete merge operation history

### Data Models

```sql
customer_duplicates (
  id, primary_customer_id, duplicate_customer_id,
  match_confidence, detection_method, status,
  reviewed_by_user_id, reviewed_at, merge_decision
)

customer_merges (
  id, primary_customer_id, merged_customer_ids,
  merge_performed_by, merge_timestamp, audit_data,
  reversal_possible, reversed_at
)
```

### Algorithms

- **Fuzzy String Matching:** Levenshtein distance for name variations
- **Phone Number Standardization:** Format normalization for comparison
- **Email Domain Analysis:** Corporate vs. personal email detection
- **Confidence Scoring:** Weighted algorithm based on multiple match factors

## API Endpoints

### Duplicate Detection

- `GET /api/customers/duplicates/scan` - Run duplicate detection scan
- `GET /api/customers/duplicates/pending` - Get unresolved duplicate matches
- `POST /api/customers/duplicates/{id}/review` - Mark duplicate as reviewed
- `GET /api/customers/{id}/potential-duplicates` - Find duplicates for specific customer

### Merge Operations

- `POST /api/customers/merge/preview` - Preview merge operation results
- `POST /api/customers/merge/execute` - Perform customer merge
- `GET /api/customers/merge/{id}/status` - Check merge operation status
- `POST /api/customers/merge/{id}/reverse` - Reverse merge if possible

### Quality Assurance

- `GET /api/customers/merge/audit/{id}` - Get merge audit trail
- `POST /api/customers/merge/validate` - Validate merge operation completeness
- `GET /api/customers/data-quality/report` - Generate data quality metrics

### Administrative

- `POST /api/customers/merge/batch` - Initiate batch merge operation
- `GET /api/customers/merge/performance-stats` - Get merge performance metrics
- `POST /api/customers/prevention/rules` - Update duplicate prevention rules

## Database Schema Requirements

### New Tables

```sql
CREATE TABLE customer_duplicates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  detection_date DATE DEFAULT CURRENT_DATE,
  primary_customer_id UUID REFERENCES customers(id) NOT NULL,
  duplicate_customer_id UUID REFERENCES customers(id) NOT NULL,
  match_confidence DECIMAL(3,2) CHECK (match_confidence >= 0 AND match_confidence <= 1),
  detection_method VARCHAR(30) NOT NULL, -- name_match, phone_match, email_match, license_match, combined
  match_criteria JSONB, -- details of what matched
  status VARCHAR(20) NOT NULL DEFAULT 'pending_review', -- pending_review, confirmed, dismissed, merged
  reviewed_by_user_id UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  merge_decision VARCHAR(20), -- merge, keep_separate, needs_investigation
  decision_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer_merges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merge_operation_id VARCHAR(20) UNIQUE NOT NULL,
  primary_customer_id UUID REFERENCES customers(id) NOT NULL,
  merged_customer_ids UUID[] NOT NULL, -- array of merged customer IDs
  merge_performed_by UUID REFERENCES users(id) NOT NULL,
  merge_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  merge_reason TEXT,
  data_selection_rules JSONB, -- which fields were selected from which records
  pre_merge_snapshots JSONB, -- complete customer data before merge
  rental_count_consolidated INTEGER,
  revenue_consolidated DECIMAL(12,2),
  manager_approved BOOLEAN DEFAULT false,
  approved_by_user_id UUID REFERENCES users(id),
  reversal_possible BOOLEAN DEFAULT true,
  reversed BOOLEAN DEFAULT false,
  reversed_at TIMESTAMP,
  reversed_by_user_id UUID REFERENCES users(id),
  reversal_reason TEXT
);

CREATE TABLE merge_field_selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merge_id UUID REFERENCES customer_merges(id) NOT NULL,
  field_name VARCHAR(50) NOT NULL,
  selected_from_customer_id UUID REFERENCES customers(id) NOT NULL,
  selected_value TEXT,
  reason_for_selection VARCHAR(100), -- most_recent, most_complete, verified, manual_choice
  confidence_score DECIMAL(3,2)
);

CREATE TABLE duplicate_detection_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name VARCHAR(100) NOT NULL,
  field_name VARCHAR(50) NOT NULL,
  match_type VARCHAR(20) NOT NULL, -- exact, fuzzy, phonetic, normalized
  weight DECIMAL(3,2) NOT NULL, -- contribution to overall match confidence
  threshold DECIMAL(3,2), -- minimum similarity score for match
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Schema Updates

- Add `merged_from_customer_ids` JSONB array to customers table for tracking merge history
- Add `duplicate_detection_score` to customers table for prevention
- Add `last_duplicate_check` timestamp to customers table

## UI/UX Considerations

### Duplicate Review Interface

- Split-screen comparison with highlighted differences and similarities
- Drag-and-drop field selection for choosing preferred values
- Color-coded confidence indicators for match quality
- Quick action buttons for common decisions (merge, keep separate, investigate)

### Merge Preview Interface

- Visual representation of consolidated customer profile
- Before/after comparison showing impact of merge operation
- Warning indicators for potential data loss or conflicts
- Confirmation checklist ensuring staff understands merge consequences

### Dashboard Integration

- Duplicate detection queue with priority sorting by confidence score
- Performance metrics showing duplicate resolution rates
- Data quality indicators with trends over time
- Quick access to recently merged customers for verification

### Mobile Accessibility

- Touch-friendly interface for tablet use during customer service
- Simplified duplicate review process for field staff
- Offline capability for reviewing and queuing merge decisions
- Integration with customer service workflows

## Testing Scenarios

### Scenario 1: High-Confidence Name and Phone Match

**Given:** Two customer records with identical names and phone numbers but different email addresses
**When:** Staff reviews duplicate match and selects merge option **Then:** Accounts merged with most
recent email retained, all rental history consolidated

### Scenario 2: Complex Multi-Field Partial Match

**Given:** Customer records with similar names, same license number, but different contact
information **When:** Fuzzy matching detects potential duplicate with medium confidence **Then:**
Staff presented with detailed comparison, manual review completed, merge decision documented

### Scenario 3: False Positive Duplicate Detection

**Given:** Two different customers with same common name and similar contact information **When:**
Staff reviews potential duplicate match **Then:** Customers confirmed as separate individuals,
dismissal reason documented, prevention rules updated

### Scenario 4: Batch Merge Operation for Data Cleanup

**Given:** 100 high-confidence duplicate pairs identified during data quality audit **When:**
Administrator initiates batch merge operation **Then:** All duplicates processed in background,
progress tracked, completion report generated

### Scenario 5: Manager Approval Required for VIP Customer

**Given:** Potential duplicate involving customer with >$10,000 rental history **When:** Staff
attempts to merge high-value customer accounts **Then:** Manager approval required, detailed review
process initiated, additional verification performed

### Scenario 6: Merge Reversal Due to Error

**Given:** Customer merge performed incorrectly combining unrelated accounts **When:** Error
discovered through customer complaint **Then:** Merge operation reversed, original accounts
restored, audit trail maintained

### Scenario 7: Real-Time Duplicate Detection During Registration

**Given:** New customer registration with information matching existing customer **When:** Staff
enters customer details during reservation process **Then:** System alerts to potential duplicate,
staff prompted to verify or merge

### Scenario 8: Corporate Account Duplicate with Multiple Contacts

**Given:** Business customer with multiple employee contacts creating apparent duplicates **When:**
Staff reviews potential duplicates for corporate account **Then:** Business relationship identified,
contacts consolidated under corporate account structure

## Definition of Done

- [ ] Automated duplicate detection system operational with configurable rules
- [ ] Fuzzy matching algorithm implemented with confidence scoring
- [ ] Side-by-side customer comparison interface functional
- [ ] Intelligent merge algorithm with field selection logic
- [ ] Complete rental history consolidation preserving chronological order
- [ ] Audit trail system capturing all merge operations and decisions
- [ ] Reference update system ensuring all related data points to merged customer
- [ ] Real-time duplicate prevention during customer registration
- [ ] Manager approval workflow for high-value customer merges
- [ ] Batch processing capability for large-scale duplicate cleanup
- [ ] Merge reversal functionality for correcting mistakes
- [ ] Performance optimization ensuring minimal system impact
- [ ] Customer notification procedures for account changes
- [ ] Data quality reporting and metrics dashboard
- [ ] Integration testing with all customer-related systems
- [ ] User acceptance testing with customer service staff
- [ ] Documentation for duplicate detection rules and merge procedures

## Dependencies

- Customer management system with comprehensive data access
- Fuzzy string matching library or service
- Audit logging system for compliance and traceability
- Notification service for customer communications
- Background job processing system for batch operations
- Data quality monitoring and reporting tools

## Risks and Mitigation

- **Risk:** Incorrect merges combining unrelated customers
  - **Mitigation:** Multi-step verification process with manager approval for uncertain cases
- **Risk:** Data loss during merge operations
  - **Mitigation:** Complete audit trail with reversal capabilities and pre-merge snapshots
- **Risk:** Performance impact on customer-facing systems
  - **Mitigation:** Background processing and optimized database queries
- **Risk:** Legal compliance issues with data consolidation
  - **Mitigation:** Privacy policy review and customer consent procedures for significant changes
