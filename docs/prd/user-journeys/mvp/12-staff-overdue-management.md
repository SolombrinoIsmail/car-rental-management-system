# Overdue Management

**Actor:** Staff Member  
**Trigger:** Vehicle not returned by scheduled time

## Journey Steps

### 1. Identify Overdue Rental (10 seconds)

- Dashboard alerts for overdue returns
- Check grace period (typically 30 minutes)
- Review contract details
- Note overdue duration

### 2. Contact Customer (20 seconds)

- Call customer mobile number
- If no answer, send SMS reminder
- Document contact attempt
- Record customer response if reached

### 3. Handle Response (15 seconds)

- If extending: Process extension
- If returning soon: Note expected time
- If unreachable: Escalate per policy
- Update system with status

### 4. Calculate Late Fees (10 seconds)

- Apply hourly/daily late charges
- Calculate based on overdue duration
- Add to contract charges
- Update total amount due

### 5. Monitor Return (ongoing)

- Track vehicle status
- Send periodic reminders
- Prepare for return processing
- Alert management if severe delay

## Time Estimate

Total time: ~55 seconds initial handling + ongoing monitoring

## Key Features Required

- Real-time overdue alerts
- Automated reminder system
- Late fee calculation engine
- Contact attempt logging
- Escalation procedures
- Status tracking system
- Management alerting
- Customer communication history

## Visual Flow Chart

```mermaid
flowchart TD
    Start([⚠️ Return Time<br/>Exceeded]) --> CheckDash[Check Dashboard<br/>Overdue Alerts<br/>5 sec]
    CheckDash --> VerifyGrace[Verify Grace Period<br/>Expired (30 min)]
    VerifyGrace --> Grace{Within<br/>Grace?}
    Grace -->|Yes| Wait[Wait for<br/>Grace Period]
    Grace -->|No| ReviewContract

    Wait --> Returned1{Vehicle<br/>Returned?}
    Returned1 -->|Yes| NormalReturn[Process Normal<br/>Return]
    Returned1 -->|No| ReviewContract[Review Contract<br/>Details<br/>5 sec]

    ReviewContract --> NoteDuration[Note Overdue<br/>Duration]
    NoteDuration --> CallCustomer[Call Customer<br/>Mobile<br/>15 sec]
    CallCustomer --> Answered{Call<br/>Answered?}

    Answered -->|No| SendSMS[Send SMS<br/>Reminder<br/>5 sec]
    Answered -->|Yes| Response{Customer<br/>Response}

    SendSMS --> DocAttempt[Document Contact<br/>Attempt]

    Response -->|Extending| ProcessExt[Process Extension<br/>Request]
    Response -->|Returning Soon| NoteTime[Note Expected<br/>Return Time]
    Response -->|Problem| HandleIssue[Handle Specific<br/>Issue]

    ProcessExt --> UpdateStatus
    NoteTime --> UpdateStatus
    HandleIssue --> UpdateStatus
    DocAttempt --> Escalate{Escalation<br/>Needed?}

    Escalate -->|Yes| AlertMgmt[Alert Management<br/>5 sec]
    Escalate -->|No| UpdateStatus[Update System<br/>Status<br/>5 sec]
    AlertMgmt --> UpdateStatus

    UpdateStatus --> CalcFees[Calculate Late Fees<br/>5 sec]
    CalcFees --> ApplyHourly{Charge<br/>Type}
    ApplyHourly -->|Hourly| HourlyRate[Apply Hourly<br/>Late Rate]
    ApplyHourly -->|Daily| DailyRate[Apply Daily<br/>Late Rate]

    HourlyRate --> AddCharges[Add to Contract<br/>Charges<br/>5 sec]
    DailyRate --> AddCharges
    AddCharges --> UpdateTotal[Update Total<br/>Amount Due]

    UpdateTotal --> SetReminder[Set Next<br/>Reminder]
    SetReminder --> Monitor{Continue<br/>Monitoring?}

    Monitor -->|Vehicle Returned| ProcessReturn[Process Late<br/>Return]
    Monitor -->|Still Overdue| CheckSeverity{Severity<br/>Level}

    CheckSeverity -->|<24 hours| SendReminder[Send Periodic<br/>Reminders]
    CheckSeverity -->|24-48 hours| DailyFollow[Daily Follow-up<br/>+ Management Alert]
    CheckSeverity -->|>48 hours| Recover[Initiate Recovery<br/>Procedures]

    SendReminder --> WaitPeriod[Wait 2 Hours]
    WaitPeriod --> Monitor

    ProcessReturn --> ApplyAllFees[Apply All<br/>Late Fees]
    ApplyAllFees --> End([Overdue Resolved])

    NormalReturn --> EndNormal([Normal Return])
    DailyFollow --> EndEscalate([Escalated to Management])
    Recover --> EndRecover([Recovery Process])

    style Start fill:#ffe6e6
    style End fill:#e1f5e1
    style Escalate fill:#ffeb3b
    style CheckSeverity fill:#ff9800
    style Recover fill:#f44336
```
