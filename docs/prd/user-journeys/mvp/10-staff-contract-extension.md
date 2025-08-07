# Contract Extension

**Actor:** Staff Member  
**Trigger:** Customer requests to extend active rental

## Journey Steps

### 1. Locate Active Contract (10 seconds)
- Search by customer name or vehicle plate
- Open active rental contract
- Verify current return date/time

### 2. Check Availability (10 seconds)
- View fleet calendar for requested extension period
- Check for upcoming reservations
- Verify vehicle availability

### 3. Calculate Extension Charges (15 seconds)
- Enter new return date/time
- System calculates additional days/hours
- Apply appropriate rate (daily/weekly)
- Add to existing contract total
- Show new total to customer

### 4. Process Additional Payment (10 seconds)
- Collect payment for extension
- Select payment method (Card/Twint/Cash)
- Process transaction
- Update payment records

### 5. Update Contract (10 seconds)
- Modify return date/time in system
- Generate contract addendum
- Capture customer signature
- Send updated confirmation

## Time Estimate
Total time: ~55 seconds for extension process

## Key Features Required
- Active contract search
- Fleet calendar integration
- Extension calculation logic
- Rate application rules
- Payment processing
- Contract modification capability
- Addendum generation
- Digital signature capture

## Visual Flow Chart

```mermaid
flowchart TD
    Start([Customer Requests<br/>Extension]) --> Search[Search Active Contract<br/>by Name/Plate<br/>10 sec]
    Search --> Open[Open Active<br/>Rental Contract]
    Open --> Verify[Verify Current<br/>Return Date/Time]
    
    Verify --> CheckCal[Check Fleet Calendar<br/>for Extension Period<br/>10 sec]
    CheckCal --> ViewRes[View Upcoming<br/>Reservations]
    ViewRes --> Available{Vehicle<br/>Available?}
    
    Available -->|No| Inform[Inform Customer<br/>Not Available]
    Available -->|Yes| EnterNew[Enter New<br/>Return Date/Time]
    
    Inform --> Alternatives{Offer<br/>Alternatives?}
    Alternatives -->|Yes| SuggestOther[Suggest Different<br/>Vehicle/Dates]
    Alternatives -->|No| EndUnavail([Extension Unavailable])
    
    EnterNew --> CalcDays[Calculate Additional<br/>Days/Hours<br/>5 sec]
    CalcDays --> ApplyRate[Apply Rate<br/>Daily/Weekly]
    ApplyRate --> CalcTotal[Calculate Extension<br/>Charges]
    CalcTotal --> ShowTotal[Show New Total<br/>to Customer<br/>5 sec]
    
    ShowTotal --> Agree{Customer<br/>Agrees?}
    Agree -->|No| Cancel[Cancel Extension<br/>Request]
    Agree -->|Yes| Payment{Payment Method}
    
    Payment -->|Card| CardPay[Process Card<br/>Payment]
    Payment -->|Twint| TwintPay[Process Twint<br/>Payment]
    Payment -->|Cash| CashPay[Accept Cash<br/>Payment]
    
    CardPay --> RecordPay[Record Payment<br/>Transaction<br/>5 sec]
    TwintPay --> RecordPay
    CashPay --> RecordPay
    
    RecordPay --> UpdateContract[Update Contract<br/>Return Date<br/>5 sec]
    UpdateContract --> GenAddendum[Generate Contract<br/>Addendum]
    GenAddendum --> CaptureSign[Capture Customer<br/>Signature<br/>5 sec]
    CaptureSign --> SendConfirm[Send Updated<br/>Confirmation]
    
    SendConfirm --> UpdateCal[Update Fleet<br/>Calendar]
    UpdateCal --> End([Extension Complete<br/>~55 seconds])
    
    Cancel --> EndCancel([No Changes Made])
    SuggestOther --> EndAlternative([Handle Alternative])
    
    style Start fill:#e1f5e1
    style End fill:#e1f5e1
    style Available fill:#ffe6e6
    style Payment fill:#fff4e6
    style CalcTotal fill:#e6f3ff
```