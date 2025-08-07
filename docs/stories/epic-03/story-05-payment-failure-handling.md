# Story 05: Payment Failure Handling

**Story ID:** EPIC-03-S05  
**Epic:** Epic 3: Financial & Payment Processing  
**Priority:** Medium  
**Story Points:** 3

## User Story Statement

**As a** rental staff member  
**I want to** handle payment failures gracefully  
**So that** rentals can proceed with alternative methods and customer relationships are maintained despite technical issues

## Detailed Acceptance Criteria

1. **Automatic Payment Retry Logic**
   - GIVEN a card payment fails due to temporary network issues (timeout, 5xx errors)
   - WHEN the failure is detected within 30 seconds
   - THEN the system SHALL automatically retry the payment exactly 3 times with exponential backoff: 1st retry after 5 seconds, 2nd retry after 15 seconds, 3rd retry after 45 seconds
   - AND SHALL complete all retry attempts within maximum 120 seconds total
   - AND SHALL log each retry attempt with timestamp, error code, and response time
   - AND SHALL NOT retry for non-retryable errors (card declined, expired, insufficient funds)

2. **Payment Method Fallback**
   - GIVEN the primary payment method fails after maximum 3 retry attempts
   - WHEN automatic retries are exhausted within 120 seconds
   - THEN the system SHALL immediately offer alternative payment methods (Twint, bank transfer, cash) within 5 seconds
   - AND SHALL preserve all transaction details (amount, line items, customer info) for 30 minutes
   - AND SHALL allow switching to alternative method without re-entering any transaction data
   - AND SHALL provide progress indicator showing 'Payment failed, offering alternatives' status

3. **Failure Reason Classification**
   - GIVEN any payment failure occurs with gateway response
   - WHEN processing the failure within 10 seconds
   - THEN the system SHALL categorize the failure into exactly 7 types: network_timeout, card_declined, card_expired, insufficient_funds, invalid_data, gateway_error, system_error
   - AND SHALL map gateway error codes to categories with 95% accuracy
   - AND SHALL provide specific next steps: network errors → retry, declined → try different card, expired → update card details, insufficient funds → contact bank or reduce amount
   - AND SHALL store classification with confidence score (0-100%) for audit purposes

4. **Customer Communication**
   - GIVEN a payment failure occurs with classified reason
   - WHEN communicating with the customer within 3 seconds of failure
   - THEN clear, non-technical error messages SHALL be displayed in customer's preferred language (German, French, Italian, English)
   - AND suggested solutions SHALL be provided: card declined → 'Please try a different card or contact your bank', network error → 'Connection issue, please wait while we retry'
   - AND error messages SHALL be limited to maximum 150 characters for readability
   - AND SHALL avoid displaying gateway error codes or technical details to customers
   - AND SHALL provide customer service contact information for unresolvable issues

5. **Staff Notification System**
   - GIVEN payment failures requiring staff attention (failures >CHF 500, repeated customer failures, system errors)
   - WHEN failures cannot be resolved automatically within 5 minutes
   - THEN staff SHALL be notified within 30 seconds via email, SMS, and dashboard alert
   - AND notification SHALL include: customer name, failure amount, failure type, transaction ID, timestamp, and customer contact details
   - AND SHALL provide recommended actions ranked by priority: 'Call customer immediately', 'Process alternative payment', 'Escalate to supervisor'
   - AND SHALL track notification acknowledgment with mandatory response within 15 minutes during business hours

6. **Transaction State Management**
   - GIVEN a payment failure occurs mid-transaction with partial completion
   - WHEN the failure is being handled within session timeout of 30 minutes
   - THEN the transaction state SHALL be preserved for exactly 30 minutes including: rental details, customer info, selected services, pricing calculations, payment attempts
   - AND customers SHALL be able to resume from payment step without re-entering any data
   - AND SHALL provide clear session timeout warning at 25 minutes with option to extend
   - AND SHALL generate unique transaction recovery ID for customer support reference

7. **Payment Issue Documentation**
   - GIVEN any payment failure regardless of amount
   - WHEN the issue occurs within system processing
   - THEN complete failure details SHALL be logged within 1 second including: transaction ID, customer ID, payment amount, gateway response code, error message, timestamp (UTC), retry attempt number, IP address, user agent
   - AND logs SHALL be retained for minimum 7 years for compliance purposes
   - AND SHALL be searchable by transaction ID, customer ID, error type, and date range
   - AND SHALL include payment gateway transaction reference for dispute resolution

8. **Customer Account Flagging**
   - GIVEN repeated payment failures from the same customer (3 or more failures within 30 days)
   - WHEN processing subsequent transactions within 24 hours
   - THEN the customer account SHALL be automatically flagged with risk levels: low (3-5 failures), medium (6-10 failures), high (>10 failures)
   - AND staff SHALL receive immediate popup alert showing: failure count, last failure date, total failed amount, success rate percentage
   - AND SHALL require supervisor approval for high-risk customers attempting payments >CHF 200
   - AND SHALL automatically remove flag after 90 consecutive days without payment failures

9. **Follow-up Task Generation**
   - GIVEN unresolved payment issues exceeding 60 minutes or CHF 300 in value
   - WHEN manual intervention is required as determined by failure type
   - THEN follow-up tasks SHALL be automatically created within 5 minutes with specific details: task type (retry_payment, contact_customer, manual_review, escalate), priority level (low, medium, high, urgent), due date/time, customer contact info
   - AND SHALL be assigned to available staff based on workload balancing (maximum 10 active payment tasks per staff member)
   - AND SHALL escalate to supervisor if not acknowledged within: urgent (15 min), high (1 hour), medium (4 hours), low (24 hours)
   - AND SHALL generate daily summary report of pending payment tasks

10. **Offline Payment Recording**
    - GIVEN payment systems are completely unavailable for >5 minutes during business hours
    - WHEN rentals must proceed for business continuity with supervisor approval
    - THEN offline payment recording SHALL be available with manual entry including: payment method, amount, authorization code (for cards), timestamp, staff member ID, customer signature capture
    - AND offline transactions SHALL be synchronized within 15 minutes when systems recover
    - AND SHALL require double verification (two staff members) for offline amounts >CHF 500
    - AND SHALL generate reconciliation report showing all offline transactions for daily audit
    - AND SHALL limit offline recording to maximum CHF 2000 per transaction and 50 transactions per day

11. **Partial Payment Handling**
    - GIVEN a payment partially succeeds with confirmed partial authorization
    - WHEN processing the transaction within 30 seconds
    - THEN the partial amount SHALL be recorded with precision to CHF 0.01 and immediately credited to customer account
    - AND the remaining balance SHALL be clearly displayed to customer and staff with automatic calculation: total amount, paid amount, outstanding balance, percentage paid
    - AND SHALL generate separate invoice for remaining balance with 14-day payment terms
    - AND SHALL automatically send balance reminder after 7 days and 13 days
    - AND SHALL handle multiple partial payments up to 5 transactions per original rental

12. **Escalation Workflow**
    - GIVEN payment issues persist beyond defined thresholds: >5 failed attempts, >CHF 1000 failed amount, >4 hours unresolved, customer complaints
    - WHEN escalation criteria are met with automatic detection
    - THEN supervisory notification SHALL be triggered within 10 minutes via SMS and email including: escalation reason, customer details, failure history, recommended actions, urgency level
    - AND escalation procedures SHALL be followed in order: Level 1 (supervisor response within 30 minutes), Level 2 (manager notification after 2 hours), Level 3 (owner notification for amounts >CHF 2000)
    - AND SHALL track escalation response times and generate weekly performance reports
    - AND SHALL provide escalation override capability for exceptional circumstances with documented justification

## Technical Implementation Notes

### Retry Strategy Implementation
```typescript
interface RetryStrategy {
  maxAttempts: number;
  backoffStrategy: 'exponential' | 'linear' | 'fixed';
  initialDelay: number;
  maxDelay: number;
  jitter: boolean;
}

class PaymentRetryHandler {
  async processWithRetry(
    paymentRequest: PaymentRequest, 
    strategy: RetryStrategy
  ): Promise<PaymentResult> {
    // Implement retry logic with circuit breaker pattern
  }
}
```

### Failure Classification System
```typescript
enum PaymentFailureCategory {
  NETWORK_ERROR = 'network_error',
  CARD_DECLINED = 'card_declined',
  INSUFFICIENT_FUNDS = 'insufficient_funds',
  EXPIRED_CARD = 'expired_card',
  INVALID_DATA = 'invalid_data',
  GATEWAY_ERROR = 'gateway_error',
  SYSTEM_ERROR = 'system_error'
}

interface FailureAnalysis {
  category: PaymentFailureCategory;
  retryable: boolean;
  suggestedActions: string[];
  customerMessage: string;
  staffMessage: string;
}
```

### Database Design
```sql
-- Payment failure tracking
CREATE TABLE payment_failures (
    id UUID PRIMARY KEY,
    payment_transaction_id UUID REFERENCES payment_transactions(id),
    failure_category VARCHAR(50) NOT NULL,
    gateway_error_code VARCHAR(50),
    gateway_error_message TEXT,
    retry_attempt INTEGER DEFAULT 0,
    max_retries_reached BOOLEAN DEFAULT FALSE,
    resolution_status ENUM('pending', 'resolved', 'escalated', 'abandoned'),
    failure_timestamp TIMESTAMP DEFAULT NOW(),
    resolved_timestamp TIMESTAMP,
    resolved_by UUID REFERENCES staff_users(id),
    resolution_notes TEXT
);

-- Customer payment issues
CREATE TABLE customer_payment_issues (
    id UUID PRIMARY KEY,
    customer_id UUID REFERENCES customers(id),
    issue_count INTEGER DEFAULT 0,
    first_issue_date DATE,
    last_issue_date DATE,
    risk_level ENUM('low', 'medium', 'high', 'blocked'),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Follow-up tasks
CREATE TABLE payment_followup_tasks (
    id UUID PRIMARY KEY,
    payment_failure_id UUID REFERENCES payment_failures(id),
    task_type ENUM('retry_payment', 'contact_customer', 'manual_review', 'escalate'),
    priority ENUM('low', 'medium', 'high', 'urgent'),
    assigned_to UUID REFERENCES staff_users(id),
    status ENUM('pending', 'in_progress', 'completed', 'cancelled'),
    due_date TIMESTAMP,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);
```

## API Endpoints Needed

### Failure Handling
```
POST /api/v1/payments/handle-failure
- Body: { transaction_id, failure_details, retry_options }
- Response: { retry_result, alternative_methods, next_steps }

GET /api/v1/payments/failures/{transaction_id}
- Response: { failure_history, retry_attempts, current_status }

POST /api/v1/payments/retry/{transaction_id}
- Body: { retry_strategy?, force_retry? }
- Response: { retry_result, remaining_attempts }
```

### Customer Issue Tracking
```
GET /api/v1/customers/{customer_id}/payment-issues
- Response: { issue_summary, risk_level, recent_failures }

POST /api/v1/customers/{customer_id}/payment-flag
- Body: { flag_reason, risk_level, notes }
- Response: { flag_created, notification_sent }
```

### Task Management
```
GET /api/v1/payment-tasks/pending
- Query: staff_id?, priority?, due_before?
- Response: { tasks[], count, priorities }

POST /api/v1/payment-tasks/{task_id}/complete
- Body: { resolution_notes, outcome }
- Response: { task_updated, follow_up_actions }
```

## Database Schema Requirements

### Core Tables
- `payment_failures` - Complete record of all payment failures
- `customer_payment_issues` - Customer-specific payment problem tracking
- `payment_followup_tasks` - Action items generated from failures
- `payment_retry_logs` - Detailed log of retry attempts

### Indexes Required
- `payment_failures(payment_transaction_id, failure_timestamp DESC)`
- `customer_payment_issues(customer_id, risk_level)`
- `payment_followup_tasks(assigned_to, status, priority, due_date)`
- `payment_failures(failure_category, resolution_status)`

### Constraints
- Retry attempts cannot exceed configured maximum
- Resolution timestamp cannot be before failure timestamp
- Follow-up tasks must have valid assignment and due dates
- Risk levels must follow defined escalation thresholds

## UI/UX Considerations

### Error Display Interface
- **User-Friendly Messages:** Clear, non-technical error explanations
- **Action Buttons:** Prominent retry and alternative payment options
- **Progress Indicators:** Show retry attempts and remaining options
- **Help Context:** Contextual help based on specific error types

### Staff Management Dashboard
- **Failure Overview:** Real-time dashboard of payment issues
- **Priority Queue:** Tasks sorted by urgency and customer impact
- **Customer History:** Quick access to customer payment issue history
- **Resolution Tools:** One-click tools for common resolution actions

### Mobile-Optimized Interface
- **Touch-Friendly:** Large buttons for retry and alternative payment selection
- **Offline Mode:** Clear indication when offline payment recording is active
- **Quick Actions:** Fast access to most common failure resolution methods
- **Status Updates:** Real-time updates on retry and resolution progress

### Notification System
- **Staff Alerts:** Immediate notifications for high-priority failures
- **Customer Updates:** Automatic updates on payment status changes
- **Escalation Notifications:** Clear escalation chain with automatic notifications
- **Resolution Confirmation:** Confirmation messages for all parties when issues resolve

## Testing Scenarios

### Automatic Retry Testing
1. **Network Timeout Retry**
   - Simulate network timeout during card payment
   - Verify automatic retry with exponential backoff
   - Confirm successful payment after retry

2. **Gateway Error Handling**
   - Trigger gateway-specific error responses
   - Verify appropriate retry behavior based on error type
   - Test max retry limits and failure escalation

3. **Partial Payment Recovery**
   - Simulate partial payment success during network interruption
   - Verify partial amount is credited correctly
   - Test remaining balance collection process

### Failure Classification Testing
4. **Card Decline Scenarios**
   - Test various card decline reasons (expired, insufficient funds, blocked)
   - Verify appropriate customer messaging for each decline type
   - Confirm staff receive detailed decline information

5. **Payment Method Fallback**
   - Start with failed card payment
   - Switch to Twint payment method
   - Verify transaction continuity and data preservation

### Customer Management Testing
6. **Repeat Failure Customer Flagging**
   - Create customer with multiple payment failures
   - Verify automatic risk level escalation
   - Test staff notification of high-risk customers

7. **Follow-up Task Generation**
   - Generate unresolved payment failure
   - Verify automatic task creation and assignment
   - Test task completion and outcome tracking

8. **Offline Payment Recording**
   - Simulate complete system unavailability
   - Record offline payments and test synchronization
   - Verify data integrity after system recovery

## Definition of Done

- [ ] Automatic payment retry works with configurable retry strategies
- [ ] Payment method fallback provides seamless alternative options
- [ ] Failure classification correctly categorizes all error types
- [ ] Customer communication provides clear, helpful error messages
- [ ] Staff notifications are immediate and contain actionable information
- [ ] Transaction state is preserved through failure and recovery cycles
- [ ] Payment issue documentation includes complete audit trail
- [ ] Customer account flagging identifies repeat payment problems
- [ ] Follow-up tasks are generated automatically with appropriate priorities
- [ ] Offline payment recording handles system unavailability gracefully
- [ ] Partial payment handling tracks and manages split transactions
- [ ] Escalation workflow triggers supervisory intervention when needed
- [ ] API endpoints provide complete failure management functionality
- [ ] Database maintains data integrity under all failure scenarios
- [ ] UI provides intuitive failure resolution tools for staff
- [ ] Integration tests cover all failure and recovery scenarios
- [ ] Performance testing confirms system stability under failure conditions

## Estimated Effort: 3 Story Points

### Breakdown
- **Retry and Fallback Logic:** 1 point
- **Failure Classification and Tracking:** 1 point
- **UI/UX and Task Management:** 1 point

### Dependencies
- Payment processing system (Story 01) completed
- Customer management system integration
- Notification system infrastructure
- Task management framework

### Risks
- **Medium:** Complex retry logic causing infinite loops
- **Medium:** Gateway-specific error handling variations
- **Low:** Offline synchronization data conflicts