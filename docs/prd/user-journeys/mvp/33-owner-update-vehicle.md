# Update Vehicle Information

**Actor:** Owner/Admin  
**Trigger:** Need to modify vehicle details, rates, or status

## Journey Steps

### 1. Locate Vehicle (15 seconds)

- Access fleet management
- Search by plate number or browse list
- Select vehicle to edit
- Review current information

### 2. Update Information (varies by change type)

- **Basic Details** (20 seconds)
  - Modify insurance information
  - Update service records
  - Change vehicle features
  - Update photos if needed

- **Rate Changes** (15 seconds)
  - Adjust hourly/daily/weekly/monthly rates
  - Modify deposit requirements
  - Update kilometer charges
  - Set seasonal pricing

- **Status Updates** (10 seconds)
  - Change availability status
  - Set maintenance flags
  - Update location
  - Modify booking restrictions

### 3. Validate Changes (10 seconds)

- System checks for conflicts
- Verify no active rentals affected
- Confirm rate changes for future bookings
- Review impact summary

### 4. Apply Updates (10 seconds)

- Save changes to database
- Update fleet calendar
- Notify affected staff
- Log change history

## Time Estimate

- Basic updates: ~30 seconds
- Rate changes: ~40 seconds
- Complete overhaul: ~60 seconds

## Key Features Required

- Vehicle search and filtering
- Edit mode with field validation
- Conflict detection for active rentals
- Rate change effective dating
- Change history logging
- Staff notification system
- Calendar synchronization
- Bulk update capability

## Visual Flow Chart

```mermaid
flowchart TD
    Start([Need to Update<br/>Vehicle Info]) --> Access[Access Fleet<br/>Management<br/>5 sec]
    Access --> Search[Search Vehicle by<br/>Plate or Browse<br/>5 sec]
    Search --> Select[Select Vehicle<br/>to Edit<br/>5 sec]
    Select --> Review[Review Current<br/>Information]

    Review --> UpdateType{What to<br/>Update?}

    UpdateType -->|Basic Info| BasicDetails[Update Basic Details<br/>10 sec]
    UpdateType -->|Rates| RateChanges[Modify Rates<br/>10 sec]
    UpdateType -->|Status| StatusUpdate[Change Status<br/>5 sec]
    UpdateType -->|Multiple| MultiUpdate[Multiple Updates<br/>20 sec]

    BasicDetails --> Insurance[Update Insurance<br/>Info]
    Insurance --> Service[Update Service<br/>Records]
    Service --> Features[Modify Vehicle<br/>Features]
    Features --> Photos{Update<br/>Photos?}
    Photos -->|Yes| TakePhotos[Take New Photos<br/>10 sec]
    Photos -->|No| Validate1
    TakePhotos --> Validate1

    RateChanges --> Hourly[Adjust Hourly Rate]
    Hourly --> Daily[Adjust Daily Rate]
    Daily --> Weekly[Adjust Weekly Rate]
    Weekly --> Monthly[Adjust Monthly Rate]
    Monthly --> DepositAmt[Modify Deposit<br/>Amount<br/>5 sec]
    DepositAmt --> KmRate[Update KM<br/>Charges]
    KmRate --> Effective{Set Effective<br/>Date?}
    Effective -->|Yes| SetDate[Choose Effective<br/>Date]
    Effective -->|No| Immediate[Apply Immediately]
    SetDate --> Validate2
    Immediate --> Validate2

    StatusUpdate --> AvailStatus[Change Availability<br/>Status]
    AvailStatus --> MaintFlag{Set Maintenance<br/>Flag?}
    MaintFlag -->|Yes| SetMaint[Flag for<br/>Maintenance]
    MaintFlag -->|No| Location
    SetMaint --> Location[Update Location]
    Location --> Restrictions[Modify Booking<br/>Restrictions<br/>5 sec]
    Restrictions --> Validate3

    MultiUpdate --> AllChanges[Apply All<br/>Changes]
    AllChanges --> Validate4

    Validate1 --> ConflictCheck
    Validate2 --> ConflictCheck
    Validate3 --> ConflictCheck
    Validate4 --> ConflictCheck[Check for Conflicts<br/>5 sec]

    ConflictCheck --> ActiveRentals{Active<br/>Rentals?}
    ActiveRentals -->|Yes| ShowImpact[Show Impact<br/>Summary]
    ActiveRentals -->|No| NoConflict

    ShowImpact --> Proceed{Proceed?}
    Proceed -->|No| Cancel[Cancel Changes]
    Proceed -->|Yes| ApplyChanges
    NoConflict --> ApplyChanges[Apply Updates<br/>5 sec]

    ApplyChanges --> SaveDB[Save to Database]
    SaveDB --> UpdateCal[Update Fleet<br/>Calendar]
    UpdateCal --> NotifyStaff[Notify Affected<br/>Staff<br/>5 sec]
    NotifyStaff --> LogHistory[Log Change<br/>History]
    LogHistory --> End([Update Complete<br/>30-60 seconds])

    Cancel --> EndCancel([Changes Cancelled])

    style Start fill:#e1f5e1
    style End fill:#e1f5e1
    style UpdateType fill:#fff4e6
    style ActiveRentals fill:#ffe6e6
    style ApplyChanges fill:#e6f3ff
```
