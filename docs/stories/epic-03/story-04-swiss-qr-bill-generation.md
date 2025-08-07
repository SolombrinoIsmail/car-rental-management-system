# Story 04: Swiss QR Bill Generation

**Story ID:** EPIC-03-S04  
**Epic:** Epic 3: Financial & Payment Processing  
**Priority:** Medium  
**Story Points:** 5

## User Story Statement

**As an** owner  
**I want to** generate Swiss QR bills for invoices  
**So that** customers can pay invoices easily using their preferred Swiss banking app and we improve cash flow with faster payments

## Detailed Acceptance Criteria

1. **Valid QR Bill Generation**
   - GIVEN a finalized invoice or rental contract
   - WHEN generating a QR bill
   - THEN the QR bill meets Swiss Payment Standards 2019 specifications
   - AND passes validation with Swiss banking systems

2. **QR Code Content Standards**
   - GIVEN QR bill generation
   - WHEN creating the QR code
   - THEN it contains all mandatory fields (IBAN, amount, currency, creditor info)
   - AND follows the exact Swiss QR specification format

3. **Reference Number Generation**
   - GIVEN each invoice requiring payment
   - WHEN creating the QR bill
   - THEN a unique reference number is generated using ISO 11649 standard
   - AND reference numbers include check digits for validation

4. **Invoice Integration**
   - GIVEN a rental invoice
   - WHEN the invoice is generated
   - THEN the QR bill is automatically embedded in the PDF
   - AND positioned according to Swiss banking layout requirements

5. **Contract Integration**
   - GIVEN a rental contract
   - WHEN the contract includes payment terms
   - THEN QR bills can be embedded directly in contracts
   - AND separate payment slips can be generated

6. **Multi-Currency Support**
   - GIVEN customers paying in different currencies
   - WHEN generating QR bills
   - THEN both CHF and EUR are supported
   - AND currency is clearly indicated in the QR code

7. **Payment Status Tracking**
   - GIVEN a QR bill has been issued
   - WHEN payments are received
   - THEN incoming payments are matched to reference numbers
   - AND payment status is updated in real-time

8. **Bank Statement Reconciliation**
   - GIVEN bank statements with QR payment references
   - WHEN processing daily reconciliation
   - THEN payments are automatically matched to invoices
   - AND unmatched payments are flagged for manual review

9. **Debtor Information Handling**
   - GIVEN customer information for QR bill
   - WHEN generating the payment slip
   - THEN customer name and address are included when available
   - AND structured address format follows Swiss postal standards

10. **Payment Message Support**
    - GIVEN additional payment information needed
    - WHEN creating QR bills
    - THEN unstructured messages can be included (max 140 characters)
    - AND structured messages follow Swiss payment message standards

11. **QR Bill Validation**
    - GIVEN generated QR bills
    - WHEN bills are created
    - THEN each QR bill is validated against Swiss banking standards
    - AND validation errors prevent bill generation with clear error messages

12. **Printing and Digital Distribution**
    - GIVEN generated QR bills
    - WHEN distributing to customers
    - THEN bills can be printed with proper dimensions and quality
    - AND can be sent digitally via email with embedded PDF

## Technical Implementation Notes

### Swiss QR Bill Standards Compliance
- **Standard:** Swiss Implementation Guidelines QR-bill v2.3
- **Format:** ISO 20022 pain.001 message format
- **Validation:** Must pass Swiss Payment Standards test suite
- **Layout:** Exact positioning requirements (62mm x 105mm payment part)

### QR Code Generation
- **Library:** Use certified Swiss QR bill library (e.g., Swiss-QR-Bill library)
- **Error Correction:** Level M (15% error correction)
- **Encoding:** UTF-8 character encoding
- **Size:** 46x46mm at 300 DPI minimum resolution

### Reference Number Algorithm
```typescript
// ISO 11649 RF Creditor Reference
function generateReferenceNumber(invoiceId: string): string {
  const baseReference = invoiceId.padStart(21, '0');
  const checkDigits = calculateMod97CheckDigits(baseReference);
  return `RF${checkDigits}${baseReference}`;
}

function calculateMod97CheckDigits(reference: string): string {
  // ISO 11649 check digit calculation
  const numericString = reference + '2715'; // RF = 2715
  const remainder = BigInt(numericString) % 97n;
  const checkDigits = 98n - remainder;
  return checkDigits.toString().padStart(2, '0');
}
```

### Database Design
```sql
-- QR bill records
CREATE TABLE qr_bills (
    id UUID PRIMARY KEY,
    invoice_id UUID REFERENCES invoices(id),
    reference_number VARCHAR(27) UNIQUE NOT NULL, -- RF + 2 digits + 21 characters
    iban VARCHAR(34) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    creditor_name VARCHAR(70) NOT NULL,
    creditor_address TEXT NOT NULL,
    debtor_name VARCHAR(70),
    debtor_address TEXT,
    payment_message TEXT,
    qr_code_data TEXT NOT NULL,
    status ENUM('generated', 'sent', 'paid', 'expired'),
    generated_at TIMESTAMP DEFAULT NOW(),
    paid_at TIMESTAMP,
    created_by UUID REFERENCES staff_users(id)
);

-- Payment matching
CREATE TABLE qr_payment_matches (
    id UUID PRIMARY KEY,
    qr_bill_id UUID REFERENCES qr_bills(id),
    bank_transaction_id VARCHAR(255),
    payment_amount DECIMAL(12,2),
    payment_currency VARCHAR(3),
    payment_date DATE,
    bank_reference TEXT,
    match_confidence DECIMAL(3,2), -- 0.00 to 1.00
    matched_at TIMESTAMP DEFAULT NOW(),
    matched_by UUID REFERENCES staff_users(id)
);
```

## API Endpoints Needed

### QR Bill Generation
```
POST /api/v1/qr-bills/generate
- Body: { invoice_id, payment_terms?, custom_message? }
- Response: { qr_bill_id, reference_number, qr_code_svg, pdf_url }

GET /api/v1/qr-bills/{qr_bill_id}
- Response: { qr_bill_details, payment_status, qr_code_data }

POST /api/v1/qr-bills/{qr_bill_id}/regenerate
- Response: { updated_qr_bill, new_reference_number }
```

### Payment Tracking
```
GET /api/v1/qr-bills/payment-status/{reference_number}
- Response: { payment_status, amount_paid, payment_date }

POST /api/v1/qr-bills/payment-received
- Body: { reference_number, amount, payment_date, bank_transaction_id }
- Response: { match_result, invoice_updated, confidence_score }
```

### Bank Integration
```
POST /api/v1/qr-bills/reconcile-bank-statement
- Body: { bank_statement_data, date_range }
- Response: { matched_payments[], unmatched_payments[], reconciliation_summary }

GET /api/v1/qr-bills/unmatched-payments
- Query: date_range?, amount_range?
- Response: { unmatched_payments[], suggested_matches[] }
```

## Database Schema Requirements

### Core Tables
- `qr_bills` - Generated QR bills with all Swiss banking details
- `qr_payment_matches` - Links between bank payments and invoices
- `bank_transactions` - Raw bank transaction data for reconciliation
- `qr_bill_templates` - Customizable templates for different invoice types

### Indexes Required
- `qr_bills(reference_number)` (unique)
- `qr_bills(invoice_id, status)`
- `qr_payment_matches(qr_bill_id, payment_date DESC)`
- `qr_bills(status, generated_at DESC)`

### Constraints
- Reference numbers must be unique across all QR bills
- IBAN must be valid Swiss or SEPA format
- Amount must be positive and within Swiss banking limits
- Currency must be CHF or EUR only

## UI/UX Considerations

### QR Bill Generation Interface
- **Invoice Integration:** One-click QR bill generation from invoices
- **Preview Mode:** Show QR bill preview before final generation
- **Customization Options:** Allow custom payment messages and terms
- **Batch Generation:** Generate multiple QR bills for unpaid invoices

### Payment Tracking Dashboard
- **Status Overview:** Visual dashboard of QR bill payment statuses
- **Payment Matching:** Interface for reviewing and confirming payment matches
- **Exception Handling:** Clear workflow for unmatched or partial payments
- **Reporting Tools:** Generate payment status reports for accounting

### Customer-Facing Elements
- **Email Templates:** Professional email templates with embedded QR bills
- **Print Layout:** Optimized layout for standard A4 printing
- **Mobile Display:** QR codes properly sized for mobile scanning
- **Payment Instructions:** Clear instructions in multiple languages

### Administrative Interface
- **Bank Integration Setup:** Configure bank account details and IBAN
- **Reference Number Format:** Configure reference number patterns
- **Template Management:** Customize QR bill templates and layouts
- **Reconciliation Tools:** Tools for manual payment matching

## Testing Scenarios

### QR Bill Generation Testing
1. **Standard Invoice QR Bill**
   - Generate QR bill for CHF invoice
   - Validate QR code content against Swiss standards
   - Verify reference number format and check digits

2. **EUR Currency QR Bill**
   - Create QR bill for EUR-based invoice
   - Verify currency handling and format compliance
   - Test with Swiss banking test environment

3. **Customer Address Handling**
   - Generate QR bill with complete customer address
   - Test address formatting for Swiss postal standards
   - Verify handling of incomplete address information

### Payment Integration Testing
4. **Bank Payment Matching**
   - Simulate bank payment with correct reference number
   - Verify automatic payment matching and status update
   - Test confidence scoring for payment matches

5. **Partial Payment Handling**
   - Process partial payment against QR bill
   - Verify remaining balance tracking
   - Test generation of follow-up QR bills for balance

### Error Handling Testing
6. **Invalid QR Data Handling**
   - Attempt QR bill generation with invalid IBAN
   - Test handling of excessive payment message length
   - Verify graceful failure with clear error messages

7. **Bank Statement Reconciliation**
   - Import bank statement with mixed payment references
   - Test automatic matching accuracy
   - Verify manual review process for unmatched payments

8. **QR Code Quality Testing**
   - Generate QR codes at various print sizes
   - Test scanning reliability with different banking apps
   - Verify error correction capability

## Definition of Done

- [ ] QR bills comply with Swiss Payment Standards 2019 specifications
- [ ] Generated QR codes pass validation with Swiss banking test systems
- [ ] Reference numbers follow ISO 11649 standard with correct check digits
- [ ] QR bills integrate seamlessly into invoice and contract PDFs
- [ ] Multi-currency support works correctly for CHF and EUR
- [ ] Payment status tracking provides real-time updates
- [ ] Bank statement reconciliation automatically matches payments
- [ ] Customer address handling follows Swiss postal standards
- [ ] Payment messages support both structured and unstructured formats
- [ ] QR bill validation prevents generation of non-compliant bills
- [ ] Print quality meets Swiss banking layout requirements
- [ ] Digital distribution works via email and customer portals
- [ ] API endpoints provide complete QR bill lifecycle management
- [ ] Database schema supports all Swiss banking requirements
- [ ] UI provides intuitive QR bill generation and management
- [ ] Integration tests verify end-to-end payment flow
- [ ] Banking app compatibility tested with major Swiss banks

## Estimated Effort: 5 Story Points

### Breakdown
- **Swiss QR Standard Implementation:** 2 points
- **Bank Integration and Reconciliation:** 1 point
- **PDF Integration and Layout:** 1 point
- **Payment Matching and Tracking:** 1 point

### Dependencies
- Swiss bank account setup with QR bill capability
- Payment processing system (Story 01) integration
- Invoice generation system
- PDF generation infrastructure

### Risks
- **High:** Swiss banking standard changes during development
- **Medium:** Bank integration API availability and reliability
- **Medium:** QR code scanning compatibility across banking apps
- **Low:** Print layout compliance with Swiss specifications