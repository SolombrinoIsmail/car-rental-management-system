# Story 02: Deposit Management System

**Story ID:** EPIC-03-S02  
**Epic:** Epic 3: Financial & Payment Processing  
**Priority:** High  
**Story Points:** 5

## User Story Statement

**As a** rental staff member  
**I want to** manage security deposits efficiently  
**So that** customer funds are properly tracked and protected throughout the rental lifecycle

## Detailed Acceptance Criteria

1. **Deposit Collection**
   - GIVEN a rental contract is being created
   - WHEN a security deposit is required
   - THEN I can collect the deposit via any available payment method
   - AND the deposit amount is clearly separated from rental charges

2. **Deposit Status Tracking**
   - GIVEN a deposit has been collected
   - WHEN viewing the rental contract
   - THEN the deposit status is clearly displayed (held/released/claimed)
   - AND the status history is available for audit

3. **Automatic Release Conditions**
   - GIVEN a rental is returned without issues
   - WHEN the vehicle inspection is completed
   - THEN the deposit is automatically marked for release
   - AND the customer is notified of the release

4. **Partial Claim Processing**
   - GIVEN damages or additional charges are identified
   - WHEN processing the return
   - THEN I can claim a partial amount from the deposit
   - AND provide detailed justification for the claim

5. **Manual Release Override**
   - GIVEN exceptional circumstances
   - WHEN a deposit needs immediate release
   - THEN supervisory approval can override automatic holds
   - AND the override reason is documented

6. **Refund Processing Integration**
   - GIVEN a deposit is marked for release
   - WHEN the refund is initiated
   - THEN the refund is processed via the original payment method
   - AND refund confirmation is provided to the customer

7. **Deposit Hold Duration**
   - GIVEN different deposit types (damage, fuel, cleaning)
   - WHEN setting hold periods
   - THEN each deposit type can have configurable hold durations
   - AND holds are automatically released after the specified period

8. **Multi-Deposit Support**
   - GIVEN complex rental scenarios
   - WHEN multiple deposits are required
   - THEN each deposit is tracked independently
   - AND can have different release conditions

9. **Deposit Transfer**
   - GIVEN rental extensions or vehicle changes
   - WHEN deposits need to be transferred
   - THEN deposits can be moved between contracts
   - AND transfer history is maintained

10. **Audit Trail Maintenance**
    - GIVEN any deposit transaction
    - WHEN deposit status changes
    - THEN all changes are logged with timestamp and staff member
    - AND audit trail is immutable and comprehensive

11. **Customer Deposit Visibility**
    - GIVEN a customer has deposits on file
    - WHEN they inquire about deposit status
    - THEN current deposit information is easily accessible
    - AND can be communicated clearly to the customer

12. **Automated Notifications**
    - GIVEN deposit status changes
    - WHEN deposits are released, claimed, or held
    - THEN relevant parties are automatically notified
    - AND notifications include clear next steps

## Technical Implementation Notes

### Deposit Tracking Architecture

- **State Machine:** Implement deposit lifecycle as finite state machine
- **Status Flow:** held → released → refunded OR held → claimed → processed
- **Concurrency:** Handle concurrent access to deposit records safely
- **Atomicity:** Ensure deposit operations are atomic and consistent

### Integration Points

- **Payment System:** Direct integration with payment processing
- **Contract Management:** Link deposits to rental contracts
- **Vehicle Inspection:** Trigger deposit decisions from inspection results
- **Notification System:** Send status updates to customers and staff

### Business Rules Engine

```typescript
interface DepositRule {
  condition: (rental: Rental, deposit: Deposit) => boolean;
  action: DepositAction;
  priority: number;
}

enum DepositAction {
  HOLD = 'hold',
  RELEASE = 'release',
  CLAIM_PARTIAL = 'claim_partial',
  REQUIRE_APPROVAL = 'require_approval',
}
```

### Database Design

```sql
-- Deposits table
CREATE TABLE deposits (
    id UUID PRIMARY KEY,
    rental_contract_id UUID REFERENCES rental_contracts(id),
    deposit_type ENUM('security', 'fuel', 'cleaning', 'damage'),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'CHF',
    status ENUM('held', 'released', 'claimed', 'refunded', 'expired'),
    payment_transaction_id UUID REFERENCES payment_transactions(id),
    claimed_amount DECIMAL(10,2) DEFAULT 0,
    release_date DATE,
    hold_until DATE,
    created_by UUID REFERENCES staff_users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Deposit status history
CREATE TABLE deposit_status_history (
    id UUID PRIMARY KEY,
    deposit_id UUID REFERENCES deposits(id),
    previous_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    reason TEXT,
    changed_by UUID REFERENCES staff_users(id),
    changed_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints Needed

### Deposit Management

```
POST /api/v1/deposits
- Body: { contract_id, type, amount, payment_method }
- Response: { deposit_id, status, payment_transaction_id }

GET /api/v1/deposits/{deposit_id}
- Response: { deposit_details, status_history, related_transactions }

PUT /api/v1/deposits/{deposit_id}/status
- Body: { new_status, reason, claimed_amount? }
- Response: { updated_deposit, status_change_id }
```

### Deposit Release

```
POST /api/v1/deposits/{deposit_id}/release
- Body: { release_reason, immediate? }
- Response: { release_confirmation, refund_transaction_id }

POST /api/v1/deposits/{deposit_id}/claim
- Body: { claim_amount, justification, evidence_urls[] }
- Response: { claim_confirmation, remaining_amount }
```

### Deposit Queries

```
GET /api/v1/deposits/by-contract/{contract_id}
- Response: { deposits[], total_held, total_claimed }

GET /api/v1/deposits/pending-release
- Query: location_id?, due_before?
- Response: { deposits[], count }
```

## Database Schema Requirements

### Core Tables

- `deposits` - Main deposit records with full lifecycle tracking
- `deposit_status_history` - Immutable audit trail of status changes
- `deposit_rules` - Configurable business rules for deposit handling
- `deposit_notifications` - Automated notification tracking

### Indexes Required

- `deposits(rental_contract_id, status)`
- `deposits(status, release_date)`
- `deposit_status_history(deposit_id, changed_at DESC)`
- `deposits(created_at DESC)` for reporting

### Constraints

- Deposit amount must be positive
- Claimed amount cannot exceed deposit amount
- Status transitions must be valid according to business rules
- Hold duration cannot be negative

## UI/UX Considerations

### Deposit Dashboard

- **Overview:** Quick view of all deposits by status
- **Filtering:** Filter by status, date, amount, customer
- **Bulk Actions:** Release multiple deposits simultaneously
- **Alerts:** Highlight deposits requiring attention

### Deposit Detail View

- **Status Timeline:** Visual representation of deposit lifecycle
- **Transaction History:** All related payment transactions
- **Documentation:** Attach evidence for claims or releases
- **Communication Log:** Track all customer communications

### Mobile Interface

- **Status Checking:** Quick deposit status lookup by contract number
- **Photo Upload:** Attach damage photos directly to deposit claims
- **Approval Workflow:** Mobile-friendly approval interface for supervisors

### Customer Portal

- **Deposit Summary:** Clear view of all held deposits
- **Status Updates:** Real-time notifications of deposit changes
- **Dispute Process:** Easy way to question deposit claims

## Testing Scenarios

### Standard Deposit Flow

1. **Deposit Collection and Hold**
   - Create rental with security deposit requirement
   - Process deposit payment via card
   - Verify deposit status shows as "held"

2. **Clean Return Automatic Release**
   - Complete rental return with no issues
   - Trigger automatic deposit release
   - Verify refund processing initiates

3. **Partial Deposit Claim**
   - Identify minor damage during return inspection
   - Claim partial amount with photo evidence
   - Verify remaining deposit released to customer

### Complex Scenarios

4. **Multiple Deposit Types**
   - Collect security, fuel, and cleaning deposits
   - Process return with fuel shortage only
   - Verify only fuel deposit claimed, others released

5. **Deposit Transfer Between Contracts**
   - Extend rental requiring new contract
   - Transfer existing deposits to new contract
   - Verify deposit history maintained across transfer

### Error Handling

6. **Payment Failure During Refund**
   - Process deposit release with original payment method expired
   - Verify fallback to alternative refund method
   - Ensure customer notification of refund delay

7. **Concurrent Deposit Access**
   - Attempt simultaneous release and claim operations
   - Verify only one operation succeeds
   - Test data consistency after concurrent access

8. **Supervisor Override Scenarios**
   - Override automatic hold with supervisor approval
   - Verify override reason recorded
   - Test audit trail completeness

## Definition of Done

- [ ] Deposit collection works with all payment methods
- [ ] Status tracking accurately reflects deposit lifecycle
- [ ] Automatic release triggers work based on inspection results
- [ ] Partial claim functionality allows detailed justification
- [ ] Manual override system requires appropriate authorization
- [ ] Refund processing integrates with original payment methods
- [ ] Audit trail captures all deposit-related activities
- [ ] Multiple deposit types are supported independently
- [ ] Deposit transfers work for rental modifications
- [ ] Customer notifications are sent for all status changes
- [ ] API endpoints are fully functional and documented
- [ ] Database maintains data integrity under concurrent access
- [ ] UI provides clear deposit status visibility
- [ ] Mobile interface supports field operations
- [ ] Integration tests cover all deposit scenarios
- [ ] Performance testing completed for high-volume operations

## Estimated Effort: 5 Story Points

### Breakdown

- **State Machine Implementation:** 2 points
- **Payment Integration:** 1 point
- **Audit Trail System:** 1 point
- **UI/UX Implementation:** 1 point

### Dependencies

- Payment processing system (Story 01) completed
- Vehicle inspection system framework
- Notification system infrastructure
- Supervisor approval workflow

### Risks

- **Medium:** Complex state transitions causing bugs
- **Medium:** Refund processing delays
- **Low:** Audit trail data volume growth
