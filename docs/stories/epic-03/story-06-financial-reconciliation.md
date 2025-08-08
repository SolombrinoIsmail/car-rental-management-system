# Story 06: Financial Reconciliation

**Story ID:** EPIC-03-S06  
**Epic:** Epic 3: Financial & Payment Processing  
**Priority:** High  
**Story Points:** 5

## User Story Statement

**As an** owner  
**I want to** reconcile all payments daily  
**So that** finances are accurate, complete, and I have full visibility into revenue streams with
ability to export for accounting

## Detailed Acceptance Criteria

1. **Daily Cash Reconciliation**
   - GIVEN cash transactions processed during the day
   - WHEN performing end-of-day reconciliation
   - THEN system cash totals are compared against physical cash count
   - AND discrepancies are identified with detailed variance reports

2. **Card Payment Settlement Tracking**
   - GIVEN card payments processed through payment gateways
   - WHEN reconciling card transactions
   - THEN all card payments are matched to gateway settlement reports
   - AND settlement dates and amounts are tracked for cash flow management

3. **Twint Payment Verification**
   - GIVEN Twint payments received during the day
   - WHEN performing payment reconciliation
   - THEN Twint payments are verified against Twint merchant statements
   - AND any missing or mismatched payments are flagged for investigation

4. **Discrepancy Identification**
   - GIVEN all payment method reconciliations
   - WHEN comparing system records to external sources
   - THEN any discrepancies are automatically identified and categorized
   - AND variance reports show amount, payment method, and potential causes

5. **Automated Reconciliation Reports**
   - GIVEN daily reconciliation completion
   - WHEN generating reconciliation reports
   - THEN comprehensive reports include all payment methods and totals
   - AND reports show reconciliation status and outstanding issues

6. **Multi-Location Support**
   - GIVEN multiple rental locations
   - WHEN performing reconciliation
   - THEN each location can be reconciled independently
   - AND consolidated reports show enterprise-wide financial position

7. **Historical Reconciliation Tracking**
   - GIVEN completed daily reconciliations
   - WHEN reviewing historical data
   - THEN all previous reconciliations are accessible with full audit trail
   - AND trends in discrepancies or issues are identifiable

8. **Accounting Export Integration**
   - GIVEN completed and approved reconciliations
   - WHEN exporting financial data
   - THEN data exports in standard accounting formats (CSV, Excel, QIF)
   - AND exports include all necessary fields for accounting software import

9. **Real-time Balance Monitoring**
   - GIVEN ongoing payment processing
   - WHEN monitoring financial positions
   - THEN real-time running totals are available by payment method
   - AND alerts trigger when discrepancies exceed defined thresholds

10. **Deposit and Refund Reconciliation**
    - GIVEN deposits collected and refunds processed
    - WHEN reconciling financial positions
    - THEN deposit holds and releases are properly tracked
    - AND refund processing is reconciled against original payment methods

11. **Weekend and Holiday Handling**
    - GIVEN payments processed on non-business days
    - WHEN settlement dates differ from processing dates
    - THEN reconciliation accounts for settlement timing differences
    - AND weekend/holiday processing is properly tracked

12. **Supervisor Approval Workflow**
    - GIVEN reconciliation discrepancies above threshold
    - WHEN reconciliation is completed
    - THEN supervisor approval is required before finalization
    - AND approval history is maintained for audit purposes

## Technical Implementation Notes

### Reconciliation Engine Architecture

```typescript
interface ReconciliationEngine {
  reconcileCash(location: Location, date: Date): CashReconciliation;
  reconcileCards(location: Location, date: Date): CardReconciliation;
  reconcileTwint(location: Location, date: Date): TwintReconciliation;
  generateConsolidatedReport(date: Date): ConsolidatedReconciliation;
}

interface ReconciliationResult {
  reconciliationType: 'cash' | 'card' | 'twint' | 'consolidated';
  date: Date;
  location: Location;
  systemTotal: Decimal;
  externalTotal: Decimal;
  variance: Decimal;
  discrepancies: Discrepancy[];
  status: 'balanced' | 'variance_within_tolerance' | 'requires_investigation';
}
```

### Settlement Integration

- **Card Processors:** API integration for settlement download
- **Twint:** Merchant portal integration or API access
- **Bank Statements:** Automated bank statement import via ISO 20022
- **Cash Management:** Physical count vs system total comparison

### Database Design

```sql
-- Daily reconciliation records
CREATE TABLE daily_reconciliations (
    id UUID PRIMARY KEY,
    reconciliation_date DATE NOT NULL,
    location_id UUID REFERENCES locations(id),
    reconciliation_type ENUM('cash', 'card', 'twint', 'consolidated'),
    system_total DECIMAL(12,2) NOT NULL,
    external_total DECIMAL(12,2),
    variance DECIMAL(12,2) GENERATED ALWAYS AS (system_total - external_total) STORED,
    variance_percentage DECIMAL(5,2),
    status ENUM('pending', 'balanced', 'variance_within_tolerance', 'requires_investigation', 'approved'),
    reconciled_by UUID REFERENCES staff_users(id),
    approved_by UUID REFERENCES staff_users(id),
    reconciled_at TIMESTAMP DEFAULT NOW(),
    approved_at TIMESTAMP,
    notes TEXT
);

-- Reconciliation discrepancies
CREATE TABLE reconciliation_discrepancies (
    id UUID PRIMARY KEY,
    reconciliation_id UUID REFERENCES daily_reconciliations(id),
    discrepancy_type ENUM('missing_payment', 'extra_payment', 'amount_mismatch', 'settlement_timing'),
    system_transaction_id UUID REFERENCES payment_transactions(id),
    external_reference VARCHAR(255),
    discrepancy_amount DECIMAL(12,2),
    description TEXT,
    resolution_status ENUM('pending', 'resolved', 'write_off', 'carry_forward'),
    resolved_by UUID REFERENCES staff_users(id),
    resolved_at TIMESTAMP,
    resolution_notes TEXT
);

-- Settlement data imports
CREATE TABLE settlement_imports (
    id UUID PRIMARY KEY,
    settlement_date DATE NOT NULL,
    payment_processor ENUM('stripe', 'datatrans', 'twint', 'bank'),
    import_file_name VARCHAR(255),
    total_transactions INTEGER,
    total_amount DECIMAL(12,2),
    import_status ENUM('processing', 'completed', 'error'),
    imported_by UUID REFERENCES staff_users(id),
    imported_at TIMESTAMP DEFAULT NOW(),
    error_details TEXT
);
```

## API Endpoints Needed

### Reconciliation Operations

```
POST /api/v1/reconciliation/daily/{date}
- Body: { location_id?, reconciliation_types[], external_data }
- Response: { reconciliation_results[], overall_status, variance_summary }

GET /api/v1/reconciliation/status/{date}
- Query: location_id?
- Response: { reconciliation_status, pending_approvals, discrepancies[] }

POST /api/v1/reconciliation/{reconciliation_id}/approve
- Body: { approval_notes?, override_reason? }
- Response: { approval_confirmation, updated_status }
```

### Settlement Integration

```
POST /api/v1/reconciliation/import-settlement
- Body: { processor, settlement_file, date_range }
- Response: { import_id, processed_records, identified_discrepancies }

GET /api/v1/reconciliation/settlement-data/{date}
- Query: processor?, location_id?
- Response: { settlement_records[], totals_by_processor }
```

### Reporting and Export

```
GET /api/v1/reconciliation/report/{date}
- Query: location_id?, format?, include_details?
- Response: { report_data, export_url?, discrepancy_summary }

POST /api/v1/reconciliation/export-accounting
- Body: { date_range, locations[], format, accounting_system? }
- Response: { export_file_url, record_count, export_summary }
```

## Database Schema Requirements

### Core Tables

- `daily_reconciliations` - Master reconciliation records with approvals
- `reconciliation_discrepancies` - Detailed variance tracking and resolution
- `settlement_imports` - External settlement data import tracking
- `reconciliation_rules` - Configurable tolerance and approval thresholds
- `accounting_exports` - History of financial data exports

### Indexes Required

- `daily_reconciliations(reconciliation_date, location_id, status)`
- `reconciliation_discrepancies(reconciliation_id, resolution_status)`
- `settlement_imports(settlement_date, payment_processor, import_status)`
- `daily_reconciliations(status, variance_percentage DESC)`

### Constraints

- Reconciliation date cannot be in the future
- Variance percentage calculated from system vs external totals
- Approval timestamps must be after reconciliation timestamps
- Settlement imports must have valid processor enum values

## UI/UX Considerations

### Reconciliation Dashboard

- **Daily Overview:** Visual dashboard showing reconciliation status across all locations
- **Variance Highlighting:** Clear indication of discrepancies requiring attention
- **Quick Actions:** One-click reconciliation for balanced days
- **Progress Tracking:** Show reconciliation completion percentage

### Discrepancy Management Interface

- **Investigation Tools:** Detailed drill-down into payment transaction details
- **Side-by-Side Comparison:** System vs external data comparison views
- **Resolution Workflow:** Step-by-step process for resolving discrepancies
- **Documentation Tools:** Easy attachment of supporting documents and notes

### Reporting Interface

- **Interactive Reports:** Clickable charts and tables for deeper analysis
- **Export Options:** Multiple format options with preview capability
- **Scheduled Reports:** Automated daily/weekly/monthly report generation
- **Trend Analysis:** Historical variance trends and pattern identification

### Mobile Reconciliation Tools

- **Cash Count Entry:** Mobile-optimized interface for physical cash counting
- **Photo Documentation:** Attach photos of cash counts, receipts, settlement reports
- **Quick Approval:** Mobile approval workflow for supervisors
- **Real-time Notifications:** Push notifications for urgent reconciliation issues

## Testing Scenarios

### Standard Reconciliation Testing

1. **Perfect Balance Day**
   - Process various payment types throughout the day
   - Run reconciliation with all amounts matching exactly
   - Verify automatic approval and report generation

2. **Small Variance Within Tolerance**
   - Create minor cash variance within acceptable limits
   - Verify reconciliation completes with warning but no approval required
   - Test tolerance threshold configuration

3. **Multi-Location Reconciliation**
   - Process payments at multiple locations
   - Run consolidated reconciliation across all locations
   - Verify location-specific and consolidated reporting

### Discrepancy Handling Testing

4. **Missing External Payment**
   - System shows payment but external settlement doesn't
   - Verify discrepancy identification and flagging
   - Test investigation and resolution workflow

5. **Settlement Timing Differences**
   - Card payment processed Friday, settled Monday
   - Verify weekend settlement handling
   - Test cross-date reconciliation accuracy

### Integration Testing

6. **Accounting Export Accuracy**
   - Complete reconciliation with various payment types
   - Export to multiple accounting formats
   - Verify data completeness and format compliance

7. **Supervisor Approval Workflow**
   - Create variance exceeding approval threshold
   - Test supervisor notification and approval process
   - Verify audit trail completeness

8. **Historical Reconciliation Review**
   - Generate 30 days of reconciliation data
   - Test historical reporting and trend analysis
   - Verify data retention and accessibility

## Definition of Done

- [ ] Daily cash reconciliation compares system totals to physical counts
- [ ] Card payment settlement tracking matches all processor settlements
- [ ] Twint payment verification confirms all payments received
- [ ] Discrepancy identification automatically flags variances
- [ ] Automated reconciliation reports generated for all payment methods
- [ ] Multi-location support allows independent and consolidated reconciliation
- [ ] Historical reconciliation tracking maintains complete audit trail
- [ ] Accounting export integration supports standard formats
- [ ] Real-time balance monitoring provides ongoing financial visibility
- [ ] Deposit and refund reconciliation tracks all fund movements
- [ ] Weekend and holiday handling accounts for settlement timing
- [ ] Supervisor approval workflow manages variance resolution
- [ ] API endpoints support complete reconciliation lifecycle
- [ ] Database maintains data integrity across all reconciliation operations
- [ ] UI provides intuitive reconciliation management for staff
- [ ] Mobile tools support field reconciliation activities
- [ ] Integration tests verify end-to-end reconciliation accuracy
- [ ] Performance testing confirms system handles high-volume reconciliation

## Estimated Effort: 5 Story Points

### Breakdown

- **Reconciliation Engine Development:** 2 points
- **Settlement Integration:** 1 point
- **Reporting and Export Functionality:** 1 point
- **UI/UX and Workflow Implementation:** 1 point

### Dependencies

- Payment processing system (Story 01) fully operational
- Deposit management system (Story 02) completed
- Settlement data access from payment processors
- Accounting system integration requirements defined

### Risks

- **High:** Settlement data format changes from processors
- **Medium:** Reconciliation tolerance threshold configuration complexity
- **Medium:** Multi-timezone handling for settlement timing
- **Low:** Large data volume performance impact on daily reconciliation
