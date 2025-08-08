# Vehicle Maintenance Flag

**Actor:** Staff Member  
**Trigger:** Vehicle needs service, repair, or has mechanical issues

## Journey Steps

### 1. Identify Maintenance Need (10 seconds)

- Notice issue during inspection
- Or receive customer complaint
- Or reach service interval
- Or receive damage report

### 2. Access Vehicle Record (10 seconds)

- Open fleet management
- Search by plate number
- Open vehicle details
- Review current status

### 3. Set Maintenance Flag (15 seconds)

- Click "Flag for Maintenance"
- Select maintenance type:
  - Scheduled service
  - Repair needed
  - Damage assessment
  - Safety inspection
- Add detailed notes
- Set urgency level (Low/Medium/High/Critical)
- Estimate return date if known

### 4. Handle Active Bookings (20 seconds)

- System shows affected reservations
- For each affected booking:
  - Notify customer
  - Offer alternative vehicle
  - Or reschedule if possible
- Document changes made

### 5. Update System (10 seconds)

- Remove from available fleet
- Update calendar view
- Notify management
- Create maintenance ticket
- Log in vehicle history

## Time Estimate

Total time: ~65 seconds for complete maintenance flagging

## Key Features Required

- Quick vehicle status update
- Maintenance type categorization
- Urgency level system
- Booking conflict detection
- Customer notification system
- Alternative vehicle suggestion
- Maintenance ticket creation
- Management alerting

## Visual Flow Chart

```mermaid
flowchart TD
    Start([Maintenance Need<br/>Identified]) --> Source{Issue<br/>Source?}

    Source -->|Inspection| Inspection[During Return<br/>Inspection]
    Source -->|Customer| Complaint[Customer<br/>Complaint]
    Source -->|Service Due| Interval[Service Interval<br/>Reached]
    Source -->|Damage| Damage[Damage<br/>Reported]

    Inspection --> Access
    Complaint --> Access
    Interval --> Access
    Damage --> Access[Access Fleet<br/>Management<br/>5 sec]

    Access --> Search[Search Vehicle by<br/>Plate Number<br/>5 sec]
    Search --> Open[Open Vehicle<br/>Details]
    Open --> ReviewStatus[Review Current<br/>Status]

    ReviewStatus --> FlagButton[Click "Flag for<br/>Maintenance"<br/>5 sec]
    FlagButton --> SelectType[Select Maintenance<br/>Type<br/>5 sec]

    SelectType --> Type{Type?}
    Type -->|Scheduled| Scheduled[Scheduled Service]
    Type -->|Repair| Repair[Repair Needed]
    Type -->|Damage| DamageAssess[Damage Assessment]
    Type -->|Safety| Safety[Safety Inspection]

    Scheduled --> AddNotes
    Repair --> AddNotes
    DamageAssess --> AddNotes
    Safety --> AddNotes[Add Detailed<br/>Notes<br/>5 sec]

    AddNotes --> Urgency[Set Urgency Level:<br/>Low/Medium/<br/>High/Critical<br/>5 sec]
    Urgency --> Critical{Critical<br/>Issue?}
    Critical -->|Yes| ImmediateAction[Alert Management<br/>Immediately]
    Critical -->|No| EstReturn
    ImmediateAction --> EstReturn[Estimate Return<br/>Date (if known)]

    EstReturn --> CheckBookings[System Checks<br/>Active Bookings<br/>5 sec]
    CheckBookings --> Affected{Bookings<br/>Affected?}

    Affected -->|No| UpdateStatus
    Affected -->|Yes| ShowAffected[Show Affected<br/>Reservations<br/>5 sec]

    ShowAffected --> ForEach[For Each Booking:<br/>10 sec]
    ForEach --> NotifyCust[Notify Customer]
    NotifyCust --> Alternative{Alternative<br/>Available?}
    Alternative -->|Yes| OfferAlt[Offer Alternative<br/>Vehicle]
    Alternative -->|No| Reschedule[Offer to<br/>Reschedule]

    OfferAlt --> DocChanges[Document Changes]
    Reschedule --> DocChanges
    DocChanges --> NextBooking{More<br/>Bookings?}
    NextBooking -->|Yes| ForEach
    NextBooking -->|No| UpdateStatus

    UpdateStatus[Update System<br/>5 sec] --> RemoveAvail[Remove from<br/>Available Fleet]
    RemoveAvail --> UpdateCal[Update Calendar<br/>View]
    UpdateCal --> NotifyMgmt[Notify Management<br/>5 sec]
    NotifyMgmt --> CreateTicket[Create Maintenance<br/>Ticket]
    CreateTicket --> LogHistory[Log in Vehicle<br/>History]
    LogHistory --> End([Vehicle Flagged<br/>~65 seconds])

    style Start fill:#ffe6e6
    style End fill:#e1f5e1
    style Critical fill:#ff5252
    style ImmediateAction fill:#ff5252
    style UpdateStatus fill:#e6f3ff
```
