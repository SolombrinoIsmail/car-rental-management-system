# Handle No-Show

**Actor:** Staff Member  
**Trigger:** Customer doesn't arrive for scheduled reservation

## Journey Steps

### 1. Identify No-Show (10 seconds)
- Check dashboard for overdue pickups
- Verify pickup time has passed (typically 1-2 hours grace period)
- Confirm no communication from customer

### 2. Attempt Contact (15 seconds)
- Call customer phone number
- Send SMS/email if no answer
- Document contact attempt
- Wait for response (if immediate)

### 3. Process No-Show (10 seconds)
- Mark reservation as no-show
- Apply no-show policy (keep deposit)
- Convert deposit to no-show fee
- Generate no-show invoice

### 4. Release Vehicle (5 seconds)
- Update vehicle status to available
- Remove from reservation calendar
- Make available for walk-ins

### 5. Update Records (5 seconds)
- Add note to customer record
- Flag for future reservation restrictions
- Update daily revenue report

## Time Estimate
Total time: ~45 seconds for no-show processing

## Key Features Required
- Overdue pickup alerts on dashboard
- Customer contact information access
- Contact attempt logging
- No-show policy automation
- Deposit conversion to revenue
- Automatic vehicle release
- Customer flagging system
- Revenue tracking update

## Visual Flow Chart

```mermaid
flowchart TD
    Start([Scheduled Pickup<br/>Time Passed]) --> Check[Check Dashboard for<br/>Overdue Pickups<br/>5 sec]
    Check --> Verify[Verify Grace Period<br/>Expired (1-2 hours)]
    Verify --> Confirm{Customer<br/>Communication?}
    Confirm -->|Yes| Handle[Handle per<br/>Communication]
    Confirm -->|No| AttemptCall
    
    AttemptCall[Call Customer<br/>Phone Number<br/>10 sec] --> Answered{Call<br/>Answered?}
    Answered -->|Yes| Reschedule{Reschedule?}
    Answered -->|No| SendMsg[Send SMS/Email<br/>5 sec]
    
    Reschedule -->|Yes| UpdateRes[Update Reservation]
    Reschedule -->|No| CancelRes[Customer Cancels]
    
    SendMsg --> WaitResponse[Wait Brief Period<br/>for Response]
    WaitResponse --> Response{Response<br/>Received?}
    Response -->|Yes| HandleResponse[Handle per<br/>Response]
    Response -->|No| MarkNoShow
    
    MarkNoShow[Mark Reservation<br/>as No-Show<br/>5 sec] --> ApplyPolicy[Apply No-Show Policy]
    ApplyPolicy --> KeepDeposit[Keep Full Deposit<br/>as No-Show Fee]
    KeepDeposit --> ConvertRev[Convert Deposit<br/>to Revenue]
    ConvertRev --> GenInvoice[Generate No-Show<br/>Invoice/Receipt]
    
    GenInvoice --> ReleaseVeh[Update Vehicle Status<br/>to Available<br/>5 sec]
    ReleaseVeh --> RemoveCal[Remove from<br/>Reservation Calendar]
    RemoveCal --> MakeAvail[Make Available<br/>for Walk-ins]
    
    MakeAvail --> UpdateCust[Add Note to<br/>Customer Record]
    UpdateCust --> FlagCust{Multiple<br/>No-Shows?}
    FlagCust -->|Yes| RestrictFuture[Flag for Future<br/>Reservation Restrictions]
    FlagCust -->|No| UpdateRev
    RestrictFuture --> UpdateRev[Update Daily<br/>Revenue Report]
    UpdateRev --> End([No-Show Processed<br/>Vehicle Available])
    
    UpdateRes --> EndReschedule([Reservation Updated])
    CancelRes --> EndCancel([Process Cancellation])
    HandleResponse --> EndResponse([Handle per Response])
    Handle --> EndHandle([Handle per Communication])
    
    style Start fill:#ffe6e6
    style End fill:#e1f5e1
    style KeepDeposit fill:#fff4e6
    style ConvertRev fill:#fff4e6
    style FlagCust fill:#ffe6e6
```