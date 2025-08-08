# Refund Processing

**Actor:** Staff Member / Manager  
**Trigger:** Customer entitled to refund (overpayment, early return, cancellation) **Frequency:**
Daily (3-5 times)

## Journey Steps

### 1. Identify Refund Need (20 seconds)

- Scenarios requiring refund:
  - Early return with payment
  - Cancellation within policy
  - Overcharge discovered
  - Duplicate payment
  - Service failure

### 2. Calculate Refund Amount (30 seconds)

- Original payment amount
- Services used/days rental
- Applicable fees/penalties
- Refund policy application
- Final refund amount

### 3. Get Approval (15 seconds)

- Under CHF 100: Staff approval
- CHF 100-500: Supervisor
- Over CHF 500: Manager
- Document approval

### 4. Process Refund (45 seconds)

- Select refund method:
  - Original payment method
  - Cash if card not available
  - Bank transfer
  - Credit note
- Enter refund amount
- Add reason code

### 5. Execute Refund (30 seconds)

- For card: Process reversal
- For cash: Count from drawer
- For transfer: Initiate transfer
- Generate receipt

### 6. Update Records (20 seconds)

- Update contract status
- Adjust revenue records
- Add refund notes
- Send confirmation
- File documentation

## Time Estimate

Total: ~3 minutes

## Why This is MVP Critical

- **Legal requirement:** Must refund when owed
- **Customer trust:** Quick refunds build loyalty
- **Financial accuracy:** Correct revenue reporting
- **Dispute prevention:** Avoid chargebacks

## Key Features Required

- Refund calculation logic
- Approval workflow
- Multiple refund methods
- Receipt generation
- Revenue adjustment
- Audit trail

## Visual Flow Chart

```mermaid
flowchart TD
    Start([Refund Required]) --> Identify[Identify Refund<br/>Need<br/>20 sec]
    Identify --> Reason{Refund<br/>Reason?}

    Reason -->|Early Return| EarlyReturn[Calculate Unused<br/>Days]
    Reason -->|Cancellation| Cancellation[Apply Cancel<br/>Policy]
    Reason -->|Overcharge| Overcharge[Calculate Excess<br/>Charged]
    Reason -->|Duplicate| Duplicate[Full Amount<br/>Return]
    Reason -->|Service Failure| ServiceFail[Determine<br/>Compensation]

    EarlyReturn --> Calculate[Calculate Refund<br/>Amount<br/>30 sec]
    Cancellation --> Calculate
    Overcharge --> Calculate
    Duplicate --> Calculate
    ServiceFail --> Calculate

    Calculate --> OriginalAmt[Original Payment]
    OriginalAmt --> MinusUsed[Minus Used Services]
    MinusUsed --> MinusFees[Minus Fees/Penalties]
    MinusFees --> FinalAmount[Final Refund Amount]

    FinalAmount --> CheckAmount{Amount<br/>Range?}

    CheckAmount -->|< CHF 100| StaffApprove[Staff Can<br/>Approve]
    CheckAmount -->|CHF 100-500| SupervisorApprove[Supervisor<br/>Approval]
    CheckAmount -->|> CHF 500| ManagerApprove[Manager<br/>Approval<br/>15 sec]

    StaffApprove --> Process
    SupervisorApprove --> GetApproval[Get Approval<br/>15 sec]
    ManagerApprove --> GetApproval

    GetApproval --> Approved{Approved?}
    Approved -->|No| Declined[Refund Declined<br/>Document Reason]
    Approved -->|Yes| Process[Process Refund<br/>45 sec]

    Process --> Method{Refund<br/>Method?}

    Method -->|Card| CardRefund[Process Card<br/>Reversal]
    Method -->|Cash| CashRefund[Prepare Cash<br/>From Drawer]
    Method -->|Transfer| BankTransfer[Initiate Bank<br/>Transfer]
    Method -->|Credit| CreditNote[Issue Credit<br/>Note]

    CardRefund --> Execute[Execute Refund<br/>30 sec]
    CashRefund --> Execute
    BankTransfer --> Execute
    CreditNote --> Execute

    Execute --> GenerateReceipt[Generate Receipt]
    GenerateReceipt --> Update[Update Records<br/>20 sec]

    Update --> UpdateContract[Update Contract<br/>Status]
    UpdateContract --> AdjustRevenue[Adjust Revenue<br/>Records]
    AdjustRevenue --> AddNotes[Add Refund<br/>Notes]
    AddNotes --> SendConfirm[Send Confirmation<br/>to Customer]

    SendConfirm --> End([Refund Complete])
    Declined --> EndDeclined([Process Ended])

    style Start fill:#e6ffe6
    style End fill:#e1f5e1
    style EndDeclined fill:#ffebee
    style CheckAmount fill:#fff4e6
```

## Common Scenarios

### Early Return

- 5-day rental, returned after 3
- Refund 2 days
- Minus early return fee
- Process to card

### Cancellation

- Booked for next week
- Cancels within 48 hours
- Full refund policy
- Return deposit

### System Error

- Charged twice by mistake
- Full refund of duplicate
- Immediate processing
- Apology included

## Refund Policies

- 48+ hours cancel: 100% refund
- 24-48 hours: 50% refund
- <24 hours: No refund
- Early return: Pro-rata minus fee
- Service failure: Case by case

## Edge Cases Handled

- Card expired since payment
- Original payer unavailable
- Partial refunds
- Foreign currency considerations
- Refund exceeds daily limit
