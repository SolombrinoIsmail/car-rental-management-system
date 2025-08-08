# Story 1: Price Dispute Resolution

## Story ID

**Epic:** 08 - Dispute & Exception Handling  
**Story:** 01  
**Priority:** High  
**Phase:** 2 (Week 7)

## User Story Statement

**As a** rental staff member  
**I want to** handle price disagreements systematically  
**So that** customers feel heard and issues are resolved fairly while protecting revenue

## Detailed Acceptance Criteria

### AC-01: Dispute Case Creation

- **Given** a customer disputes the rental price
- **When** staff creates a dispute case
- **Then** the system captures customer claimed price vs actual charged price
- **And** automatically calculates the price difference

### AC-02: Price Breakdown Display

- **Given** a price dispute case is created
- **When** staff reviews the dispute
- **Then** the system displays detailed price calculation breakdown
- **And** shows all applied rates, fees, and charges with timestamps

### AC-03: Evidence Documentation

- **Given** a price dispute is in progress
- **When** staff documents the dispute
- **Then** the system allows attachment of original booking confirmation
- **And** captures customer statements and verbal agreements

### AC-04: Manager Override Authorization

- **Given** a price adjustment is proposed
- **When** the amount exceeds staff authority limits
- **Then** the system requires manager approval
- **And** prevents adjustment until approval is granted

### AC-05: Adjustment Application

- **Given** an approved price adjustment
- **When** staff applies the adjustment
- **Then** the system updates the contract with new pricing
- **And** recalculates all dependent charges and taxes

### AC-06: Reason Code Tracking

- **Given** a price adjustment is made
- **When** the adjustment is saved
- **Then** the system requires a reason code selection
- **And** captures detailed explanation in notes field

### AC-07: Invoice Regeneration

- **Given** a price adjustment is applied
- **When** the contract is updated
- **Then** the system generates a new invoice with correct amounts
- **And** voids the original invoice with reference linkage

### AC-08: Customer Communication

- **Given** a price dispute resolution
- **When** the case is closed
- **Then** the system generates customer notification
- **And** provides explanation of resolution decision

### AC-09: Dispute Outcome Tracking

- **Given** price disputes are resolved
- **When** viewing dispute metrics
- **Then** the system tracks resolution outcomes (approved/denied/partial)
- **And** measures customer satisfaction scores

### AC-10: Audit Trail Maintenance

- **Given** any price dispute activity
- **When** actions are performed
- **Then** the system logs all changes with timestamps
- **And** maintains immutable audit trail for compliance

### AC-11: Resolution Timeline

- **Given** a price dispute case
- **When** tracking progress
- **Then** the system enforces maximum resolution time of 10 minutes
- **And** escalates overdue cases to management

### AC-12: Payment Reconciliation

- **Given** a price adjustment with refund
- **When** the adjustment is processed
- **Then** the system initiates payment reversal workflow
- **And** updates payment records with adjustment details

## Technical Implementation Notes

### Backend Components

- **DisputeService:** Core dispute management logic
- **PriceCalculationEngine:** Breakdown and recalculation functionality
- **ApprovalWorkflow:** Manager override processing
- **AuditLogger:** Comprehensive activity tracking
- **InvoiceGenerator:** Dynamic invoice creation

### Database Requirements

- New dispute tracking tables with case management
- Price adjustment history with reason codes
- Manager approval workflow states
- Enhanced audit trail with dispute context

### Integration Points

- Contract management system for price updates
- Payment processing for refunds/adjustments
- Notification service for customer communication
- Reporting system for dispute analytics

## API Endpoints Needed

### Dispute Management

```
POST /api/v1/disputes/price
GET /api/v1/disputes/price/{disputeId}
PUT /api/v1/disputes/price/{disputeId}/adjust
POST /api/v1/disputes/price/{disputeId}/approve
PUT /api/v1/disputes/price/{disputeId}/resolve
```

### Price Calculation

```
GET /api/v1/contracts/{contractId}/price-breakdown
POST /api/v1/contracts/{contractId}/recalculate
```

### Approval Workflow

```
GET /api/v1/approvals/pending
POST /api/v1/approvals/{approvalId}/decision
```

## Database Schema Requirements

### Dispute Cases Table

```sql
CREATE TABLE dispute_cases (
    id UUID PRIMARY KEY,
    contract_id UUID REFERENCES contracts(id),
    customer_id UUID REFERENCES customers(id),
    dispute_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'open',
    claimed_amount DECIMAL(10,2),
    actual_amount DECIMAL(10,2),
    adjustment_amount DECIMAL(10,2),
    reason_code VARCHAR(50),
    resolution_notes TEXT,
    created_by UUID REFERENCES users(id),
    resolved_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    escalated_at TIMESTAMP
);
```

### Price Adjustments Table

```sql
CREATE TABLE price_adjustments (
    id UUID PRIMARY KEY,
    dispute_case_id UUID REFERENCES dispute_cases(id),
    original_amount DECIMAL(10,2),
    adjusted_amount DECIMAL(10,2),
    adjustment_type VARCHAR(50),
    reason_code VARCHAR(50),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    applied_at TIMESTAMP,
    reversal_id UUID REFERENCES price_adjustments(id)
);
```

### Approval Workflow Table

```sql
CREATE TABLE approval_requests (
    id UUID PRIMARY KEY,
    request_type VARCHAR(50),
    reference_id UUID,
    amount DECIMAL(10,2),
    requester_id UUID REFERENCES users(id),
    approver_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending',
    reason TEXT,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP
);
```

## UI/UX Considerations

### Dispute Creation Interface

- **Quick Dispute Button:** One-click access from contract view
- **Price Comparison Widget:** Side-by-side claimed vs actual amounts
- **Calculation Breakdown:** Expandable detail view of all charges
- **Evidence Upload:** Drag-drop interface for supporting documents

### Resolution Dashboard

- **Active Cases Queue:** Priority-sorted dispute list
- **Resolution Tools:** Adjustment sliders and approval buttons
- **Communication Panel:** Customer interaction history
- **Approval Status:** Real-time workflow progress indicators

### Manager Override Interface

- **Approval Queue:** Pending override requests with context
- **Risk Indicators:** Visual warnings for high-value adjustments
- **Reason Templates:** Predefined justification options
- **Audit Summary:** Quick view of staff override patterns

## Testing Scenarios

### TS-01: Standard Price Dispute

- **Given:** Customer claims booking showed lower price
- **When:** Staff creates dispute with claimed amount
- **Then:** System calculates difference and requires documentation
- **Expected:** Dispute case created with accurate price comparison

### TS-02: Manager Override Required

- **Given:** Price adjustment exceeds $100 staff limit
- **When:** Staff attempts to apply adjustment
- **Then:** System blocks action and requests manager approval
- **Expected:** Approval workflow initiated with notification sent

### TS-03: Partial Adjustment Approval

- **Given:** Customer claims $300 overcharge, evidence supports $150
- **When:** Manager approves partial adjustment
- **Then:** System applies $150 adjustment with explanation
- **Expected:** Invoice updated, customer notified of partial resolution

### TS-04: Evidence-Based Resolution

- **Given:** Customer provides booking confirmation screenshot
- **When:** Staff reviews evidence against system records
- **Then:** System highlights price discrepancies automatically
- **Expected:** Evidence analyzed and discrepancies flagged for review

### TS-05: Dispute Escalation

- **Given:** Dispute case exceeds 10-minute resolution time
- **When:** System checks for overdue cases
- **Then:** Automatic escalation to manager with urgency flag
- **Expected:** Manager receives escalation notification with case details

### TS-06: Invoice Regeneration

- **Given:** Price adjustment applied to active rental
- **When:** System processes the adjustment
- **Then:** New invoice generated with corrected amounts
- **Expected:** Original invoice voided, new invoice issued with adjustment details

### TS-07: Audit Trail Verification

- **Given:** Multiple dispute actions performed
- **When:** Audit report is generated
- **Then:** All actions logged with timestamps and user identification
- **Expected:** Complete audit trail available for compliance review

### TS-08: Customer Satisfaction Follow-up

- **Given:** Dispute resolved in customer favor
- **When:** Resolution is completed
- **Then:** Customer satisfaction survey automatically sent
- **Expected:** Satisfaction feedback collected and tracked in system

## Definition of Done

- [ ] Price dispute creation workflow functional
- [ ] Automatic price breakdown calculation working
- [ ] Manager override system with approval limits operational
- [ ] Reason code tracking implemented
- [ ] Invoice regeneration after adjustments working
- [ ] Customer notification system functional
- [ ] Audit trail capturing all dispute activities
- [ ] Resolution timeline enforcement active
- [ ] Payment reconciliation for refunds working
- [ ] All API endpoints tested and documented
- [ ] Database schema deployed and optimized
- [ ] UI components responsive and accessible
- [ ] All test scenarios passing
- [ ] Staff training materials prepared
- [ ] Performance testing completed (sub-10 minute resolution)

## Estimated Effort

**Story Points:** 8 (1.5 developer days)

### Breakdown:

- **Backend Development:** 5 points (dispute logic, approval workflow)
- **Frontend Development:** 2 points (dispute interface, management tools)
- **Database Design:** 1 point (schema creation, migrations)

### Dependencies:

- Manager role permissions system
- Contract pricing engine
- Payment processing integration
- Notification service functionality
