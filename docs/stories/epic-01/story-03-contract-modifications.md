# Story 03: Contract Modifications

**Story ID:** CRMS-003  
**Epic:** Epic 1 - Core Contract Operations  
**Priority:** Medium  
**Status:** Ready for Development

## User Story Statement

**As a** rental staff member  
**I want to** modify active contracts safely  
**So that** I can handle extensions, early returns, corrections, and customer requests while
maintaining data integrity

## Detailed Acceptance Criteria

1. **Contract Extension Management**
   - Extend rental end date while checking vehicle availability
   - Automatically recalculate pricing for extended period
   - Handle conflicts when vehicle is booked by another customer
   - Send notification to customer about extension and new total
   - Update vehicle availability calendar in real-time

2. **Early Return Processing**
   - Process early returns with accurate refund calculations
   - Apply early return policies (minimum charges, fees)
   - Calculate partial refunds for extras and insurance
   - Generate refund receipts and updated final invoices
   - Update vehicle availability for earlier return date

3. **Data Correction Capabilities**
   - Edit customer information with proper validation
   - Correct pricing errors with manager approval for significant changes
   - Modify pickup/return locations and times
   - Update vehicle information if incorrect vehicle was assigned
   - Fix contract details before customer signature

4. **Comprehensive Audit Trail**
   - Log all modification attempts with user ID and timestamp
   - Record original values, new values, and reason for change
   - Track approval workflow for high-value changes
   - Maintain immutable history of all contract versions
   - Generate modification reports for management review

5. **Manager Approval Workflow**
   - Require manager approval for modifications over CHF 500
   - Implement approval workflow with email notifications
   - Allow managers to review and approve/reject changes
   - Escalate to senior management for very high-value changes
   - Track approval response times and status

6. **Pricing Recalculation Engine**
   - Recalculate pricing when dates or extras change
   - Apply current rates vs. original contract rates (configurable)
   - Handle partial period calculations (hourly, daily, weekly rates)
   - Process discounts and promotional codes for modified contracts
   - Calculate and display price differences clearly

7. **PDF Regeneration and Versioning**
   - Generate new contract PDF after approved modifications
   - Maintain version history of all contract PDFs
   - Include modification summary in updated contracts
   - Support side-by-side comparison of contract versions
   - Ensure legal compliance of modified contracts

8. **Customer Communication**
   - Generate modification notifications for customers
   - Send updated contracts via email automatically
   - Support SMS notifications for urgent changes
   - Provide customer portal access to view modifications
   - Handle customer acceptance/rejection of modifications

9. **Rollback and Recovery**
   - Support rollback to previous contract version
   - Implement soft deletes for modification safety
   - Provide emergency modification reversal capability
   - Maintain data consistency during rollback operations
   - Alert relevant staff when modifications are reversed

## Technical Implementation Notes

- **Event Sourcing:** Implement for complete modification history
- **State Machine:** Model contract states and valid transitions
- **Approval Engine:** Configurable workflow with role-based permissions
- **Pricing Service:** Stateless service for price recalculations
- **Notification System:** Queue-based system for reliable delivery
- **Version Control:** Git-like versioning for contract documents
- **Concurrency Control:** Optimistic locking to prevent race conditions

## API Endpoints Needed

```
PUT    /api/contracts/{id}/extend
POST   /api/contracts/{id}/early-return
PUT    /api/contracts/{id}/modify
GET    /api/contracts/{id}/history
GET    /api/contracts/{id}/versions
POST   /api/contracts/{id}/approve-modification
POST   /api/contracts/{id}/reject-modification
GET    /api/contracts/{id}/audit-trail
POST   /api/contracts/{id}/rollback
PUT    /api/contracts/{id}/customer-data
POST   /api/contracts/{id}/regenerate-pdf
GET    /api/contracts/{id}/price-impact
POST   /api/contracts/{id}/notifications
```

## Database Schema Requirements

```sql
-- Contract modifications table
contract_modifications (
  id UUID PRIMARY KEY,
  contract_id UUID REFERENCES contracts(id),
  modification_type VARCHAR(50), -- 'extension', 'early_return', 'correction'
  original_values JSONB,
  new_values JSONB,
  price_impact DECIMAL(10,2),
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  requested_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Contract versions table
contract_versions (
  id UUID PRIMARY KEY,
  contract_id UUID REFERENCES contracts(id),
  version_number INTEGER,
  contract_data JSONB,
  pdf_url VARCHAR(500),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Approval workflows table
approval_workflows (
  id UUID PRIMARY KEY,
  contract_modification_id UUID REFERENCES contract_modifications(id),
  workflow_step INTEGER,
  approver_role VARCHAR(50),
  approver_id UUID REFERENCES users(id),
  status VARCHAR(20), -- 'pending', 'approved', 'rejected'
  comments TEXT,
  responded_at TIMESTAMP
);

-- Modification audit logs
modification_audit_logs (
  id UUID PRIMARY KEY,
  contract_id UUID REFERENCES contracts(id),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100),
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## UI/UX Considerations

- **Modification Panel:** Dedicated interface for contract modifications
- **Version Comparison:** Side-by-side view of original vs. modified contract
- **Approval Dashboard:** Manager dashboard for pending approvals
- **Change Highlighting:** Visual indicators showing what changed
- **Price Impact Display:** Clear before/after pricing comparison
- **Progress Tracking:** Status indicators for approval workflow
- **Warning System:** Alerts for potential conflicts or issues
- **Quick Actions:** Common modification shortcuts and templates
- **Mobile Approval:** Mobile-friendly approval interface for managers

## Testing Scenarios

1. **Contract Extension Flow**
   - Extend contract when vehicle is available
   - Test extension when vehicle has subsequent booking
   - Verify pricing recalculation for extended period
   - Confirm customer notification is sent automatically
   - Test calendar update after extension approval

2. **Early Return Processing**
   - Process early return with standard refund policy
   - Test early return with minimum charge enforcement
   - Verify partial refund calculations for extras
   - Test vehicle availability update after early return
   - Confirm refund receipt generation

3. **Data Correction Scenarios**
   - Correct minor customer information errors
   - Test pricing correction requiring manager approval
   - Verify pickup location change with vehicle availability check
   - Test correction rollback functionality
   - Confirm audit trail captures all corrections

4. **Manager Approval Workflow**
   - Test automatic approval routing for high-value modifications
   - Verify email notifications are sent to approvers
   - Test approval and rejection workflows
   - Confirm escalation to senior management works
   - Test timeout handling for pending approvals

5. **Concurrent Modification Handling**
   - Test two staff members modifying same contract simultaneously
   - Verify optimistic locking prevents data corruption
   - Test conflict resolution mechanisms
   - Confirm proper error messaging for conflicts
   - Test modification queue handling under load

6. **PDF Generation and Versioning**
   - Generate updated PDF after contract modification
   - Test version comparison between contract versions
   - Verify PDF contains modification summary
   - Test bulk PDF regeneration performance
   - Confirm legal compliance of modified contracts

7. **Error Handling and Recovery**
   - Test modification rollback functionality
   - Verify data consistency after failed modifications
   - Test recovery from partial modification states
   - Confirm emergency reversal procedures work
   - Test system behavior during service outages

8. **Performance and Scalability**
   - Test modification processing with 100+ concurrent contracts
   - Verify pricing recalculation performance
   - Test audit trail query performance with large datasets
   - Confirm PDF generation doesn't block other operations
   - Test notification system under high volume

## Definition of Done

- [ ] All acceptance criteria implemented and tested
- [ ] Extension and early return workflows function correctly
- [ ] Manager approval system integrated and tested
- [ ] Comprehensive audit trail captures all modifications
- [ ] Pricing recalculation engine works accurately
- [ ] PDF regeneration maintains legal compliance
- [ ] Rollback functionality tested and verified
- [ ] Customer notification system operational
- [ ] Concurrent modification handling prevents data corruption
- [ ] Performance meets requirements (modification processing < 30 seconds)
- [ ] Security testing completed (authorization, data validation)
- [ ] Integration testing with existing contract system
- [ ] User acceptance testing completed by staff and managers
- [ ] Error handling covers all edge cases
- [ ] Documentation completed (API docs, user procedures)

## Estimated Effort

**Story Points:** 8

**Breakdown:**

- Extension and early return logic (2 points)
- Manager approval workflow system (2 points)
- Audit trail and versioning (2 points)
- Pricing recalculation engine (1 point)
- PDF regeneration and notifications (1 point)

**Dependencies:**

- Digital contract creation system (Story 02)
- User management and role system
- Notification infrastructure
- PDF generation service
- Pricing calculation service

**Risks:**

- Complex approval workflow requirements
- Data consistency during concurrent modifications
- Performance impact of extensive audit logging
- Legal compliance of modified contracts
