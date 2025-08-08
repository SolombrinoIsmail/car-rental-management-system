# 💳 Swiss Payment Systems Architecture

## Executive Summary

Swiss payment processing is complex due to multiple providers, QR-bill requirements, and banking
regulations. This architecture handles all Swiss-specific payment needs identified in the user
stories.

## Swiss Payment Landscape

### Required Payment Methods

Based on story analysis, we need to support:

- **Swiss QR-bills** (mandatory for invoicing)
- **Credit/Debit Cards** (Visa, Mastercard, Postcard)
- **TWINT** (Swiss mobile payment)
- **Cash** (with drawer management)
- **Bank Transfers** (traditional Swiss method)
- **Corporate Billing** (B2B accounts with credit terms)

### Swiss Payment Providers Integration

#### Primary Provider: Stripe

```typescript
interface StripeIntegration {
  capabilities: {
    cards: ['visa', 'mastercard', 'postcard'];
    wallets: ['apple_pay', 'google_pay'];
    bank_transfers: ['sofort', 'bancontact'];
    local_methods: ['twint']; // via partners
  };

  features: {
    payment_intents: 'for immediate charges';
    setup_intents: 'for deposit authorization';
    webhooks: 'for real-time status updates';
    connect: 'for multi-location support';
  };
}
```

#### Secondary Provider: Datatrans (Swiss-native)

```typescript
interface DatatransIntegration {
  capabilities: {
    cards: 'all_swiss_cards + international';
    twint: 'direct_integration';
    postfinance: 'native_support';
    qr_bills: 'swiss_qr_bill_generation';
  };

  advantages: {
    swiss_compliance: 'native_swiss_banking_integration';
    lower_fees: 'for_swiss_transactions';
    local_support: 'german_speaking_support';
  };
}
```

## QR-Bill Architecture

### Swiss QR-Bill Requirements

```typescript
interface SwissQRBill {
  mandatory_fields: {
    creditor: {
      name: string;
      address: SwissAddress;
      account: string; // IBAN
    };
    amount: {
      currency: 'CHF' | 'EUR';
      value: number;
    };
    debtor: {
      name: string;
      address: SwissAddress;
    };
    reference: {
      type: 'QRR' | 'SCOR' | 'NON';
      value: string;
    };
  };

  validation: {
    iban_check: 'mod97_algorithm';
    reference_check: 'iso11649_validation';
    amount_limits: { min: 0.01; max: 999999999.99 };
  };
}
```

### QR-Bill Generation Service

```typescript
// QR-bill generation microservice
class QRBillGenerator {
  async generateQRBill(contract: Contract): Promise<QRBillData> {
    const qrBill = {
      creditor: await this.getCompanyBankDetails(),
      amount: {
        currency: 'CHF',
        value: contract.total_amount,
      },
      debtor: {
        name: contract.customer.full_name,
        address: contract.customer.address,
      },
      reference: {
        type: 'QRR',
        value: this.generateReference(contract.id),
      },
      additional_info: `Rental ${contract.id}`,
      payment_purpose: 'Car Rental Services',
    };

    return {
      qr_code: await this.generateQRCode(qrBill),
      pdf: await this.generatePDF(qrBill),
      payment_slip: await this.generatePaymentSlip(qrBill),
    };
  }
}
```

## Payment Processing Architecture

### Payment Flow Design

```
Customer Payment → Provider Selection → Processing → Verification → Recording → Receipt
       ↓              ↓                ↓            ↓           ↓           ↓
   Amount/Method   Route to Best    API Call    Webhook    Database    PDF/Email
                   Provider         Handling    Response   Update      Generation
```

### Multi-Provider Payment Router

```typescript
class PaymentRouter {
  async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResult> {
    const provider = this.selectProvider(paymentRequest);

    switch (provider) {
      case 'stripe':
        return await this.stripeService.processPayment(paymentRequest);
      case 'datatrans':
        return await this.datatransService.processPayment(paymentRequest);
      case 'cash':
        return await this.cashService.recordCashPayment(paymentRequest);
      case 'qr_bill':
        return await this.qrBillService.generateBill(paymentRequest);
    }
  }

  private selectProvider(request: PaymentRequest): PaymentProvider {
    if (request.method === 'twint' && request.amount < 3000) return 'datatrans';
    if (request.method === 'card' && request.amount > 1000) return 'stripe';
    if (request.method === 'cash') return 'cash';
    if (request.method === 'invoice') return 'qr_bill';

    return 'stripe'; // default
  }
}
```

### Database Schema for Payments

#### Payment Tables

```sql
-- Main payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES contracts(id),
    customer_id UUID REFERENCES customers(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'CHF',
    payment_method VARCHAR(20) NOT NULL, -- 'card', 'twint', 'cash', 'bank_transfer', 'qr_bill'
    payment_provider VARCHAR(20), -- 'stripe', 'datatrans', 'cash', 'manual'
    provider_payment_id VARCHAR(100), -- External payment ID
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'refunded'
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Payment details
    card_last4 VARCHAR(4),
    card_brand VARCHAR(20),
    failure_reason TEXT,
    refund_reason TEXT,

    -- Swiss-specific fields
    twint_transaction_id VARCHAR(50),
    bank_reference VARCHAR(50),
    qr_bill_reference VARCHAR(50),

    -- Cash handling
    cash_received DECIMAL(10,2),
    cash_change DECIMAL(10,2),
    cash_drawer_session_id UUID,

    -- Metadata
    processing_fee DECIMAL(10,2),
    metadata JSONB
);

-- Swiss QR-bills table
CREATE TABLE qr_bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID REFERENCES payments(id),
    contract_id UUID REFERENCES contracts(id),

    -- QR-bill data
    qr_reference VARCHAR(50) UNIQUE NOT NULL,
    iban VARCHAR(34) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'CHF',

    -- Creditor info
    creditor_name VARCHAR(100) NOT NULL,
    creditor_address JSONB NOT NULL,

    -- Debtor info
    debtor_name VARCHAR(100) NOT NULL,
    debtor_address JSONB NOT NULL,

    -- Additional info
    additional_info TEXT,
    payment_purpose VARCHAR(100),

    -- Generated content
    qr_code_data TEXT NOT NULL,
    qr_code_image_path VARCHAR(500),
    pdf_path VARCHAR(500),

    -- Status
    status VARCHAR(20) DEFAULT 'generated', -- 'generated', 'sent', 'paid', 'expired'
    due_date DATE,
    paid_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cash drawer sessions for tracking
CREATE TABLE cash_drawer_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES locations(id),
    staff_id UUID REFERENCES users(id),

    -- Session details
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'open', -- 'open', 'closed', 'reconciled'

    -- Cash amounts
    opening_balance DECIMAL(10,2) NOT NULL,
    closing_balance DECIMAL(10,2),
    expected_balance DECIMAL(10,2),
    variance DECIMAL(10,2),

    -- Denominations tracking
    opening_denominations JSONB, -- {1: 10, 2: 20, 5: 15, ...}
    closing_denominations JSONB,

    -- Reconciliation
    reconciled_by UUID REFERENCES users(id),
    reconciliation_notes TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Swiss Banking Integration

### Bank Account Validation Service

```typescript
class SwissBankingService {
  async validateIBAN(iban: string): Promise<IBANValidation> {
    // Swiss IBAN validation
    const cleaned = iban.replace(/\s/g, '');

    if (!cleaned.startsWith('CH') && !cleaned.startsWith('LI')) {
      throw new Error('Only Swiss and Liechtenstein IBANs supported');
    }

    const isValid = this.mod97Check(cleaned);
    const bankCode = cleaned.substring(4, 9);
    const bankInfo = await this.getBankInfo(bankCode);

    return {
      valid: isValid,
      formatted: this.formatIBAN(cleaned),
      bank: bankInfo,
    };
  }

  async generateQRReference(contractId: string): Promise<string> {
    // Generate Swiss QR reference with check digits
    const base = `${contractId.replace(/-/g, '')}${Date.now()}`;
    const padded = base.padStart(25, '0');
    const checkDigits = this.calculateMod10(padded);

    return `${padded}${checkDigits}`;
  }
}
```

### Corporate Billing System

```typescript
interface CorporateAccount {
  company: {
    name: string;
    vat_number: string;
    credit_limit: number;
    payment_terms: number; // days
    billing_address: SwissAddress;
    contact_person: string;
  };

  billing: {
    cycle: 'monthly' | 'weekly' | 'per_rental';
    consolidation: boolean;
    auto_approval_limit: number;
    requires_po_number: boolean;
  };

  credit: {
    limit: number;
    used: number;
    available: number;
    overdue_amount: number;
  };
}

class CorporateBillingService {
  async processCorprateRental(rental: Rental, account: CorporateAccount): Promise<void> {
    // Check credit limit
    if (account.credit.used + rental.amount > account.credit.limit) {
      throw new CreditLimitExceededError();
    }

    // Requires approval?
    if (rental.amount > account.billing.auto_approval_limit) {
      await this.requestApproval(rental, account);
    }

    // Add to billing queue
    await this.addToBillingQueue(rental, account);
  }

  async generateMonthlyInvoice(accountId: string, month: string): Promise<Invoice> {
    const rentals = await this.getRentalsForMonth(accountId, month);
    const invoice = await this.createConsolidatedInvoice(rentals);

    // Generate QR-bill for corporate payment
    const qrBill = await this.qrBillService.generateQRBill(invoice);

    return { ...invoice, qr_bill: qrBill };
  }
}
```

## Payment Security & Compliance

### PCI DSS Compliance

```typescript
interface PaymentSecurity {
  card_data: {
    storage: 'never_stored_locally';
    transmission: 'tls_1.3_minimum';
    tokenization: 'provider_tokens_only';
  };

  access_control: {
    payment_viewing: 'role_based_permissions';
    refund_processing: 'manager_approval_required';
    cash_handling: 'dual_authorization';
  };

  logging: {
    all_transactions: 'immutable_audit_log';
    failed_attempts: 'security_monitoring';
    access_patterns: 'anomaly_detection';
  };
}
```

### Swiss Financial Regulations

```typescript
interface SwissFinancialCompliance {
  money_laundering: {
    customer_due_diligence: 'for_amounts_over_15000_chf';
    transaction_monitoring: 'suspicious_pattern_detection';
    reporting: 'mros_reporting_capability';
  };

  data_retention: {
    transaction_records: '10_years_minimum';
    customer_data: 'gdpr_compliant_retention';
    audit_trails: 'tamper_proof_logging';
  };

  taxation: {
    vat_calculation: '7.7_percent_standard_rate';
    vat_reporting: 'quarterly_vat_reports';
    withholding_tax: 'for_foreign_customers';
  };
}
```

## Performance & Monitoring

### Payment System Metrics

```yaml
Performance KPIs:
  - payment_processing_time: '< 5 seconds average'
  - qr_bill_generation: '< 2 seconds'
  - cash_drawer_operations: '< 1 second'
  - webhook_processing: '< 500ms'

Success Metrics:
  - payment_success_rate: '> 99% for cards'
  - twint_success_rate: '> 95%'
  - qr_bill_payment_rate: '> 85% within 30 days'
  - dispute_rate: '< 0.5%'

Business Metrics:
  - average_transaction_value: 'CHF amount'
  - payment_method_distribution: '% breakdown'
  - collection_efficiency: '% paid within terms'
  - processing_cost_per_transaction: 'CHF cost'
```

### Error Handling & Recovery

```typescript
class PaymentErrorHandler {
  async handlePaymentFailure(payment: Payment, error: PaymentError): Promise<void> {
    switch (error.type) {
      case 'insufficient_funds':
        await this.offerAlternativePayment(payment);
        break;
      case 'card_declined':
        await this.suggestContactBank(payment);
        break;
      case 'network_timeout':
        await this.retryPayment(payment);
        break;
      case 'provider_error':
        await this.switchToBackupProvider(payment);
        break;
    }

    // Log for analysis
    await this.logPaymentFailure(payment, error);
  }
}
```

## Integration with Contract System

### Payment Status in Contract Flow

```typescript
interface ContractPaymentIntegration {
  rental_creation: {
    deposit_authorization: 'hold_deposit_amount';
    payment_verification: 'verify_payment_method';
    corporate_credit_check: 'for_business_accounts';
  };

  rental_completion: {
    final_charge: 'process_additional_charges';
    deposit_release: 'release_authorized_amount';
    refund_processing: 'for_early_returns';
  };

  invoicing: {
    qr_bill_generation: 'for_unpaid_amounts';
    reminder_automation: 'payment_overdue_notifications';
    collection_workflow: 'automated_collection_process';
  };
}
```

---

**This architecture provides comprehensive Swiss payment processing while maintaining PCI compliance
and regulatory requirements.**
