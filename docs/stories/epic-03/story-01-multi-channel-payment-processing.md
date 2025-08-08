# Story 01: Multi-Channel Payment Processing

**Story ID:** EPIC-03-S01  
**Epic:** Epic 3: Financial & Payment Processing  
**Priority:** High  
**Story Points:** 8

## User Story Statement

**As a** rental staff member  
**I want to** accept payments via card, Twint, and cash  
**So that** customers can pay using their preferred method and we can serve all Swiss payment
preferences

## Detailed Acceptance Criteria

1. **Credit/Debit Card Processing**
   - GIVEN a customer wants to pay by card
   - WHEN I process the payment through the integrated card terminal
   - THEN the payment is processed securely via Swiss payment processors
   - AND the transaction is recorded with timestamp and reference number

2. **Twint QR Code Generation**
   - GIVEN a customer wants to pay via Twint
   - WHEN I generate a payment request
   - THEN a valid Twint QR code is displayed on screen
   - AND the payment status updates in real-time when paid

3. **Cash Payment Handling**
   - GIVEN a customer pays with cash
   - WHEN I enter the cash amount received
   - THEN the system calculates change required
   - AND records the cash transaction with denomination breakdown

4. **Partial Payment Support**
   - GIVEN a customer wants to split payment
   - WHEN I process multiple payment methods for one invoice
   - THEN all partial payments are tracked against the total amount
   - AND the remaining balance is clearly displayed

5. **Payment Method Switching**
   - GIVEN a payment method fails
   - WHEN I need to switch to an alternative method
   - THEN the system allows seamless switching without data loss
   - AND maintains transaction integrity

6. **Transaction Recording**
   - GIVEN any payment is processed
   - WHEN the transaction completes
   - THEN all payment details are recorded with ISO timestamps
   - AND include method, amount, currency, and staff member ID

7. **Receipt Generation**
   - GIVEN a payment is completed
   - WHEN the transaction is finalized
   - THEN a receipt is automatically generated
   - AND can be printed or emailed to the customer

8. **Payment Validation**
   - GIVEN any payment is attempted
   - WHEN processing the payment
   - THEN the system validates payment amounts against invoice totals
   - AND prevents overpayments or underpayments

9. **Currency Support**
   - GIVEN payments in CHF or EUR
   - WHEN processing any transaction
   - THEN both currencies are supported with current exchange rates
   - AND conversion is clearly documented

10. **PCI Compliance**
    - GIVEN card payment processing
    - WHEN handling card data
    - THEN all PCI DSS requirements are met
    - AND card data is never stored locally

11. **Offline Mode Support**
    - GIVEN internet connectivity issues
    - WHEN card/Twint payments fail due to connectivity
    - THEN cash payments remain available
    - AND failed transactions can be retried when connection is restored

12. **Payment Status Tracking**
    - GIVEN any payment is initiated
    - WHEN monitoring transaction status
    - THEN real-time status updates are provided
    - AND payment history is accessible for troubleshooting

## Technical Implementation Notes

### Payment Gateway Integration

- **Primary:** Stripe Connect for card processing
- **Secondary:** Datatrans as backup Swiss processor
- **Requirements:** PCI DSS compliance, webhook support
- **Fallback:** Manual card authorization numbers

### Twint Integration

- **API:** Twint Merchant API v2.1
- **QR Code:** Dynamic QR generation with payment reference
- **Status Polling:** Real-time payment confirmation via webhooks
- **Timeout:** 5-minute payment window with retry option

### Cash Handling System

- **Denomination Tracking:** Support for all Swiss denominations
- **Change Calculator:** Automated change calculation with coin optimization
- **Till Management:** Cash drawer integration with daily reconciliation
- **Audit Trail:** Complete cash transaction logging

### Database Design

```sql
-- Payment transactions table
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY,
    rental_contract_id UUID REFERENCES rental_contracts(id),
    payment_method ENUM('card', 'twint', 'cash'),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'CHF',
    status ENUM('pending', 'completed', 'failed', 'refunded'),
    gateway_transaction_id VARCHAR(255),
    processed_by UUID REFERENCES staff_users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    metadata JSONB
);
```

## API Endpoints Needed

### Payment Processing

```
POST /api/v1/payments/process
- Body: { method, amount, currency, contract_id, metadata }
- Response: { transaction_id, status, receipt_url }

GET /api/v1/payments/twint/qr/{transaction_id}
- Response: { qr_code_data, expiry_time }

POST /api/v1/payments/cash/calculate-change
- Body: { amount_due, amount_received }
- Response: { change_amount, denomination_breakdown }
```

### Payment Status

```
GET /api/v1/payments/{transaction_id}/status
- Response: { status, last_updated, gateway_response }

POST /api/v1/payments/{transaction_id}/retry
- Response: { new_transaction_id, status }
```

### Payment History

```
GET /api/v1/payments/history
- Query: contract_id, date_range, status
- Response: { payments[], total_count, page_info }
```

## Database Schema Requirements

### Core Tables

- `payment_transactions` - Main payment records
- `payment_methods` - Configured payment methods per location
- `cash_denominations` - Cash handling records
- `payment_receipts` - Generated receipt records

### Indexes Required

- `payment_transactions(rental_contract_id, status)`
- `payment_transactions(created_at DESC)`
- `payment_transactions(gateway_transaction_id)` (unique)

### Constraints

- Amount must be positive
- Currency must be CHF or EUR
- Payment method must be valid enum value
- Contract ID must exist when provided

## UI/UX Considerations

### Payment Selection Interface

- **Layout:** Large, clearly labeled payment method buttons
- **Accessibility:** High contrast, keyboard navigation support
- **Multilingual:** Support for German, French, Italian, English

### Twint Payment Flow

- **QR Display:** Large, clear QR code with instructions
- **Status Indicator:** Real-time payment status with countdown timer
- **Fallback Options:** Clear alternative payment methods if Twint fails

### Cash Payment Interface

- **Calculator:** Built-in calculator for amount entry
- **Change Display:** Large, clear change amount with denomination breakdown
- **Validation:** Real-time validation of entered amounts

### Mobile Responsiveness

- **Touch Targets:** Minimum 44px touch targets
- **Screen Rotation:** Support for both portrait and landscape modes
- **Offline Indicators:** Clear offline mode indicators

## Testing Scenarios

### Happy Path Testing

1. **Card Payment Success**
   - Process valid card payment for full invoice amount
   - Verify transaction recorded correctly
   - Confirm receipt generation

2. **Twint Payment Success**
   - Generate Twint QR code
   - Simulate successful Twint payment
   - Verify real-time status update

3. **Cash Payment with Change**
   - Enter cash amount greater than invoice
   - Verify change calculation accuracy
   - Confirm cash transaction recording

### Error Handling Testing

4. **Card Payment Failure**
   - Simulate declined card
   - Verify error message display
   - Test fallback to alternative payment method

5. **Network Connectivity Issues**
   - Disconnect internet during card/Twint payment
   - Verify offline mode activation
   - Test retry mechanism when connection restored

### Edge Case Testing

6. **Partial Payment Processing**
   - Process multiple partial payments for single invoice
   - Verify balance tracking accuracy
   - Test completion when balance reaches zero

7. **Currency Conversion**
   - Process EUR payment for CHF invoice
   - Verify exchange rate application
   - Confirm conversion documentation

8. **Concurrent Payment Attempts**
   - Attempt multiple payment methods simultaneously
   - Verify only one payment processes
   - Test transaction locking mechanism

## Definition of Done

- [ ] All three payment methods (card, Twint, cash) are fully functional
- [ ] Payment processing complies with PCI DSS requirements
- [ ] Twint integration certified with Twint Merchant Services
- [ ] Cash handling includes full denomination tracking
- [ ] All payments generate proper receipts
- [ ] Partial payment functionality tested and working
- [ ] Offline mode handles network failures gracefully
- [ ] Payment status updates are real-time and accurate
- [ ] Error handling provides clear user feedback
- [ ] Currency support includes CHF and EUR with conversion
- [ ] API endpoints are documented and tested
- [ ] Database schema supports all payment scenarios
- [ ] UI is responsive and accessible
- [ ] Integration tests pass with 95% success rate
- [ ] Security audit completed for payment handling
- [ ] Staff training materials created for payment processing

## Estimated Effort: 8 Story Points

### Breakdown

- **Payment Gateway Integration:** 3 points
- **Twint API Integration:** 2 points
- **Cash Handling System:** 1 point
- **UI/UX Implementation:** 1 point
- **Testing & Security:** 1 point

### Dependencies

- Payment gateway merchant accounts established
- Twint merchant registration completed
- PCI compliance audit scheduled
- Cash handling hardware (if required) procured

### Risks

- **High:** Payment gateway approval delays
- **Medium:** Twint API rate limiting
- **Low:** Cash handling calculation accuracy
