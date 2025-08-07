# Deposit Management

**Actor:** Staff Member  
**Trigger:** Various points in rental lifecycle requiring deposit handling

## Journey Steps

### 1. Deposit Collection (At Booking/Rental)
- Calculate deposit amount based on:
  - Vehicle value/category
  - Rental duration
  - Customer history
- Typical: CHF 500-2000 or 20-30% of rental
- Process payment (Card/Twint/Cash)
- Issue deposit receipt

### 2. Deposit Holding (During Rental)
- Track deposit in system
- Link to active contract
- Maintain payment reference
- Show as pending/held funds

### 3. Deposit Application (At Return)
- Review return condition
- Check for damages
- Calculate additional charges
- Apply deposit against charges

### 4. Deposit Settlement (Final)
- If no charges: Full refund
- If charges < deposit: Partial refund
- If charges > deposit: Additional payment required
- Process refund to original payment method

## Time Estimate
- Collection: ~20 seconds
- Application: ~15 seconds
- Settlement: ~10 seconds
Total lifecycle: ~45 seconds of active work

## Key Features Required
- Deposit calculation rules
- Multi-payment method support
- Deposit receipt generation
- Deposit tracking system
- Automatic charge application
- Refund processing
- Payment method matching
- Deposit history tracking

## Visual Flow Chart

```mermaid
flowchart TD
    Start([Deposit Required]) --> Type{Deposit<br/>Trigger}
    
    Type -->|Reservation| ResCalc[Calculate Deposit<br/>20-30% of Total]
    Type -->|Walk-in Rental| RentCalc[Calculate Deposit<br/>Based on Vehicle]
    Type -->|High-Risk Customer| HighCalc[Calculate Higher<br/>Deposit Amount]
    
    ResCalc --> Amount[Determine Amount:<br/>CHF 500-2000]
    RentCalc --> Amount
    HighCalc --> Amount
    
    Amount --> Inform[Inform Customer<br/>of Deposit]
    Inform --> PayMethod{Payment Method}
    
    PayMethod -->|Card| CardHold[Card Authorization<br/>Hold]
    PayMethod -->|Twint| TwintPay[Twint Payment]
    PayMethod -->|Cash| CashPay[Cash Payment]
    
    CardHold --> Record[Record Transaction<br/>Reference]
    TwintPay --> Record
    CashPay --> Record
    
    Record --> IssueReceipt[Issue Deposit<br/>Receipt]
    IssueReceipt --> LinkContract[Link to Contract/<br/>Reservation]
    LinkContract --> HoldStatus[Status: Deposit Held]
    
    HoldStatus -.->|Rental Period| Return([Vehicle Return])
    
    Return --> CheckCondition[Check Vehicle<br/>Condition]
    CheckCondition --> CalcCharges[Calculate Total<br/>Additional Charges]
    CalcCharges --> Compare{Charges vs<br/>Deposit}
    
    Compare -->|No Charges| FullRefund[Process Full<br/>Deposit Refund]
    Compare -->|Charges < Deposit| PartialRefund[Apply Charges<br/>Refund Balance]
    Compare -->|Charges > Deposit| AddPayment[Apply Deposit<br/>Request Additional]
    
    FullRefund --> RefundMethod{Original<br/>Payment Method}
    PartialRefund --> CalcBalance[Calculate Refund<br/>Balance]
    CalcBalance --> RefundMethod
    
    RefundMethod -->|Card| CardRefund[Process Card<br/>Refund]
    RefundMethod -->|Twint| TwintRefund[Process Twint<br/>Refund]
    RefundMethod -->|Cash| CashRefund[Return Cash]
    
    AddPayment --> CollectExtra[Collect Additional<br/>Payment]
    CollectExtra --> ApplyAll[Apply Deposit +<br/>Additional Payment]
    
    CardRefund --> UpdateRec[Update Customer<br/>Record]
    TwintRefund --> UpdateRec
    CashRefund --> UpdateRec
    ApplyAll --> UpdateRec
    
    UpdateRec --> CloseDeposit[Close Deposit<br/>Transaction]
    CloseDeposit --> End([Deposit Settled])
    
    style Start fill:#e1f5e1
    style End fill:#e1f5e1
    style PayMethod fill:#fff4e6
    style Compare fill:#ffe6e6
    style RefundMethod fill:#e6f3ff
```