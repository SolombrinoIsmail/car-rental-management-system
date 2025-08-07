# Early Return

**Actor:** Staff Member  
**Trigger:** Customer returns vehicle before scheduled return date/time

## Journey Steps

### 1. Identify Early Return (10 seconds)
- Customer arrives with vehicle
- Search active contract
- Notice return is before scheduled time
- Calculate time difference

### 2. Vehicle Inspection (20 seconds)
- Take 4 return photos (front, back, sides)
- Enter return odometer reading
- Enter return fuel level
- Compare with initial photos
- Check for any damage

### 3. Calculate Adjustments (15 seconds)
- Calculate unused rental period
- Determine refund policy applicability
- Calculate any applicable refund
- Calculate standard charges (fuel/km)
- Show final settlement

### 4. Process Settlement (15 seconds)
- If refund due: Process refund
- If charges due: Collect payment
- If deposit held: Apply and settle
- Generate final invoice

### 5. Update System (10 seconds)
- Close contract early
- Mark vehicle as available immediately
- Update fleet calendar
- Update revenue records

## Time Estimate
Total time: ~70 seconds for early return process

## Key Features Required
- Early return detection
- Refund policy rules engine
- Pro-rata calculation
- Immediate availability update
- Refund processing capability
- Deposit settlement logic
- Calendar real-time update
- Revenue adjustment tracking

## Visual Flow Chart

```mermaid
flowchart TD
    Start([Customer Returns<br/>Vehicle Early]) --> Search[Search Active<br/>Contract<br/>5 sec]
    Search --> Open[Open Contract]
    Open --> Compare[Compare Actual vs<br/>Scheduled Return]
    Compare --> CalcDiff[Calculate Time<br/>Difference<br/>5 sec]
    
    CalcDiff --> Photos[📸 Take 4 Photos<br/>Front, Back, Sides<br/>15 sec]
    Photos --> EnterMetrics[Enter Odometer &<br/>Fuel Level<br/>5 sec]
    EnterMetrics --> CompareInit[Compare with<br/>Initial Photos]
    CompareInit --> CheckDamage{New Damage?}
    
    CheckDamage -->|Yes| DocDamage[Document Damage<br/>Calculate Charges]
    CheckDamage -->|No| CalcUnused
    DocDamage --> CalcUnused[Calculate Unused<br/>Rental Period<br/>5 sec]
    
    CalcUnused --> CheckPolicy{Refund Policy<br/>Applies?}
    CheckPolicy -->|Full Refund| FullRefund[Calculate Full<br/>Day Refund]
    CheckPolicy -->|Partial| PartialRefund[Calculate Partial<br/>Refund]
    CheckPolicy -->|No Refund| NoRefund[No Refund Due]
    
    FullRefund --> CalcStandard
    PartialRefund --> CalcStandard
    NoRefund --> CalcStandard[Calculate Standard<br/>Charges (Fuel/KM)<br/>5 sec]
    
    CalcStandard --> NetCalc[Calculate Net<br/>Settlement]
    NetCalc --> ShowSettle[Show Final<br/>Settlement<br/>5 sec]
    
    ShowSettle --> Settlement{Settlement<br/>Type}
    Settlement -->|Refund Due| ProcessRefund[Process Refund to<br/>Customer]
    Settlement -->|Payment Due| CollectPayment[Collect Additional<br/>Payment]
    Settlement -->|Balanced| NoAction[No Payment<br/>Required]
    
    ProcessRefund --> Method1{Payment Method}
    Method1 -->|Card| CardRefund[Refund to Card]
    Method1 -->|Twint| TwintRefund[Twint Refund]
    Method1 -->|Cash| CashRefund[Give Cash]
    
    CollectPayment --> Method2{Payment Method}
    Method2 -->|Card| CardCharge[Charge Card]
    Method2 -->|Twint| TwintCharge[Twint Payment]
    Method2 -->|Cash| CashPayment[Accept Cash]
    
    CardRefund --> DepositSettle
    TwintRefund --> DepositSettle
    CashRefund --> DepositSettle
    CardCharge --> DepositSettle
    TwintCharge --> DepositSettle
    CashPayment --> DepositSettle
    NoAction --> DepositSettle[Settle Any<br/>Held Deposit]
    
    DepositSettle --> GenInvoice[Generate Final<br/>Invoice<br/>5 sec]
    GenInvoice --> CloseContract[Close Contract<br/>Early<br/>5 sec]
    CloseContract --> MarkAvail[Mark Vehicle<br/>Available Now]
    MarkAvail --> UpdateCal[Update Fleet<br/>Calendar]
    UpdateCal --> UpdateRev[Update Revenue<br/>Records]
    UpdateRev --> End([Early Return Complete<br/>Vehicle Available])
    
    style Start fill:#e1f5e1
    style End fill:#e1f5e1
    style CheckPolicy fill:#fff4e6
    style Settlement fill:#ffe6e6
    style MarkAvail fill:#e6f3ff
```