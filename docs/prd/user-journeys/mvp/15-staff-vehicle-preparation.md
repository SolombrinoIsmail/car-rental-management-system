# Vehicle Preparation

**Actor:** Staff Member  
**Trigger:** Vehicle returned and needs preparation for next rental

## Journey Steps

### 1. Vehicle Return Completion (5 seconds)
- Previous rental closed
- Vehicle marked as "Needs Preparation"
- Appears in preparation queue

### 2. Begin Preparation (10 seconds)
- Access preparation queue
- Select vehicle to prepare
- Review previous rental notes
- Check for any damage flags

### 3. Physical Preparation (varies, tracked as 20 seconds in system)
- **Interior Cleaning**
  - Remove all customer items
  - Vacuum seats and floor
  - Wipe down surfaces
  - Clean windows
  - Check/empty ashtrays

- **Exterior Cleaning**
  - Quick wash if needed
  - Check tire pressure
  - Clean windows and mirrors

- **Operational Checks**
  - Check fuel level
  - Verify all features work
  - Test lights and signals
  - Check fluid levels

### 4. Document Preparation (15 seconds)
- Mark cleaning tasks complete
- Note fuel level
- Update odometer if needed
- Flag any issues found
- Take photos if pristine condition

### 5. Mark as Ready (10 seconds)
- Change status to "Available"
- Update fleet calendar
- Remove from preparation queue
- Log preparation time
- Assign to next booking if any

## Time Estimate
Total time: ~60 seconds in system (physical preparation time varies)

## Key Features Required
- Preparation queue management
- Cleaning checklist system
- Issue flagging during prep
- Quick status updates
- Photo documentation option
- Automatic availability update
- Time tracking for preparation
- Next booking assignment

## Visual Flow Chart

```mermaid
flowchart TD
    Start([Vehicle Returned]) --> Closed[Previous Rental<br/>Closed]
    Closed --> Queue[Vehicle Added to<br/>Preparation Queue<br/>5 sec]
    
    Queue --> Access[Access Preparation<br/>Queue<br/>5 sec]
    Access --> Select[Select Vehicle<br/>to Prepare<br/>5 sec]
    Select --> ReviewNotes[Review Previous<br/>Rental Notes]
    ReviewNotes --> CheckDamage{Damage<br/>Flags?}
    
    CheckDamage -->|Yes| AssessDamage[Assess Damage<br/>First]
    CheckDamage -->|No| StartPrep
    AssessDamage --> NeedRepair{Needs<br/>Repair?}
    NeedRepair -->|Yes| FlagMaint[Flag for<br/>Maintenance]
    NeedRepair -->|No| StartPrep
    
    StartPrep[Begin Preparation<br/>Process] --> Interior[Interior Cleaning]
    Interior --> RemoveItems[Remove Customer<br/>Items]
    RemoveItems --> Vacuum[Vacuum Seats<br/>and Floor]
    Vacuum --> WipeDown[Wipe Down<br/>Surfaces]
    WipeDown --> CleanWindows[Clean Interior<br/>Windows]
    CleanWindows --> CheckAshtray[Check/Empty<br/>Ashtrays]
    
    CheckAshtray --> Exterior[Exterior Cleaning]
    Exterior --> NeedWash{Needs<br/>Wash?}
    NeedWash -->|Yes| QuickWash[Quick Wash]
    NeedWash -->|No| TirePressure
    QuickWash --> TirePressure[Check Tire<br/>Pressure]
    TirePressure --> CleanMirrors[Clean Windows<br/>and Mirrors]
    
    CleanMirrors --> Operational[Operational Checks]
    Operational --> CheckFuel[Check Fuel Level]
    CheckFuel --> LowFuel{Fuel<br/>< 25%?}
    LowFuel -->|Yes| NoteFuel[Note: Needs Fuel]
    LowFuel -->|No| TestFeatures
    NoteFuel --> TestFeatures[Test All Features]
    TestFeatures --> TestLights[Test Lights<br/>and Signals]
    TestLights --> CheckFluids[Check Fluid<br/>Levels]
    
    CheckFluids --> Document[Document Preparation<br/>10 sec]
    Document --> MarkTasks[Mark Cleaning<br/>Tasks Complete]
    MarkTasks --> NoteFuelLevel[Note Fuel Level]
    NoteFuelLevel --> UpdateOdo[Update Odometer<br/>if Needed]
    UpdateOdo --> IssuesFound{Issues<br/>Found?}
    
    IssuesFound -->|Yes| FlagIssues[Flag Issues for<br/>Resolution<br/>5 sec]
    IssuesFound -->|No| PhotoCheck
    FlagIssues --> PhotoCheck{Take<br/>Photos?}
    PhotoCheck -->|Yes| TakePhotos[Photo Document<br/>Clean State<br/>10 sec]
    PhotoCheck -->|No| MarkReady
    TakePhotos --> MarkReady
    
    MarkReady[Mark as Ready<br/>5 sec] --> ChangeStatus[Change Status<br/>to "Available"]
    ChangeStatus --> UpdateCal[Update Fleet<br/>Calendar]
    UpdateCal --> RemoveQueue[Remove from<br/>Prep Queue]
    RemoveQueue --> LogTime[Log Preparation<br/>Time<br/>5 sec]
    LogTime --> NextBooking{Next Booking<br/>Waiting?}
    
    NextBooking -->|Yes| AssignBooking[Assign to<br/>Next Booking]
    NextBooking -->|No| Available[Set as Available<br/>in Fleet]
    
    AssignBooking --> End([Vehicle Ready<br/>~60 seconds])
    Available --> End
    FlagMaint --> EndMaint([Sent to Maintenance])
    
    style Start fill:#e1f5e1
    style End fill:#e1f5e1
    style EndMaint fill:#ffe6e6
    style StartPrep fill:#e6f3ff
    style MarkReady fill:#fff4e6
```