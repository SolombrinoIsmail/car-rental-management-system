# User Journey Visualizations

## Journey Flow Diagrams

### Critical Path: Complete Rental Lifecycle
```mermaid
graph TB
    Start([Customer Arrives]) --> Greet[Staff Greets Customer<br/>5 sec]
    Greet --> Check{New Customer?}
    
    %% New Customer Path
    Check -->|Yes| NewCust[Click 'New Customer'<br/>5 sec]
    NewCust --> EnterDetails[Enter Details:<br/>Name, ID, Phone,<br/>Email, Address<br/>20 sec]
    EnterDetails --> PhotoID[📸 Take Photo of<br/>ID Document<br/>5 sec]
    PhotoID --> PhotoLicense[📸 Take Photo of<br/>Driver's License<br/>Both Sides<br/>10 sec]
    PhotoLicense --> VerifyLicense[Verify License<br/>Validity & Expiration<br/>5 sec]
    VerifyLicense --> SaveCust[Save to Database<br/>5 sec]
    
    %% Returning Customer Path
    Check -->|No| SearchCust[Search by Name/<br/>ID Number<br/>10 sec]
    SearchCust --> SelectCust[Select from Results<br/>5 sec]
    SelectCust --> CheckBlacklist{Blacklisted?}
    CheckBlacklist -->|Yes| Reject[❌ Cannot Rent<br/>Notify Customer]
    CheckBlacklist -->|No| ReviewHistory[Review Rental<br/>History<br/>10 sec]
    
    %% Vehicle Selection
    SaveCust --> ViewFleet[View Fleet Calendar/<br/>Available Vehicles<br/>10 sec]
    ReviewHistory --> ViewFleet
    ViewFleet --> FilterVehicle{Need Filter?}
    FilterVehicle -->|Yes| ApplyFilter[Filter by Type<br/>5 sec]
    FilterVehicle -->|No| SelectVehicle
    ApplyFilter --> SelectVehicle[Select Vehicle<br/>10 sec]
    SelectVehicle --> VerifyClean[Verify Vehicle<br/>Clean & Ready<br/>5 sec]
    
    %% Contract Details
    VerifyClean --> EnterDates[Enter Start/End<br/>Dates & Times<br/>10 sec]
    EnterDates --> SelectRate[Select Rate Type:<br/>Hourly/Daily/<br/>Weekly/Monthly<br/>5 sec]
    SelectRate --> AddExtras{Add Extras?}
    AddExtras -->|Yes| SelectExtras[GPS, Child Seat,<br/>Insurance, etc.<br/>10 sec]
    AddExtras -->|No| CalcPrice
    SelectExtras --> CalcPrice[System Calculates<br/>Total with VAT<br/>5 sec]
    CalcPrice --> EnterMetrics[Enter Current:<br/>Fuel Level &<br/>Odometer<br/>10 sec]
    
    %% Documentation
    EnterMetrics --> VehiclePhotos[📸 Take 4 Photos:<br/>Front, Back,<br/>Both Sides<br/>20 sec]
    VehiclePhotos --> CheckDamage{Existing Damage?}
    CheckDamage -->|Yes| MarkDamage[Mark Damage<br/>on Photos<br/>15 sec]
    CheckDamage -->|No| Signatures
    MarkDamage --> Signatures[Capture Signatures:<br/>Customer & Staff<br/>10 sec]
    
    %% Payment
    Signatures --> Payment{Payment Method}
    Payment -->|Card| CardDetails[Enter Card Info<br/>10 sec]
    Payment -->|Twint| TwintQR[Show QR Code<br/>5 sec]
    Payment -->|Cash| CountCash[Count Cash &<br/>Give Change<br/>15 sec]
    
    CardDetails --> ProcessCard[Process Card<br/>Transaction<br/>10 sec]
    TwintQR --> VerifyTwint[Verify Twint<br/>Payment<br/>10 sec]
    CountCash --> RecordCash[Record Cash<br/>Payment<br/>5 sec]
    
    ProcessCard --> GenPDF
    VerifyTwint --> GenPDF
    RecordCash --> GenPDF[Generate PDF<br/>with Photos<br/>10 sec]
    
    GenPDF --> Deliver{Delivery Method}
    Deliver -->|Print| PrintContract[Print Contract<br/>15 sec]
    Deliver -->|Email| EmailContract[Email Contract<br/>5 sec]
    Deliver -->|Both| BothDelivery[Print & Email<br/>20 sec]
    
    PrintContract --> HandKeys
    EmailContract --> HandKeys
    BothDelivery --> HandKeys[Hand Over Keys<br/>5 sec]
    
    %% Rental Period
    HandKeys -.->|Rental Period| ReturnArrival([Customer Returns<br/>Vehicle])
    
    %% Return Process
    ReturnArrival --> SearchReturn[Search Active Rentals<br/>by Name/Plate<br/>10 sec]
    SearchReturn --> OpenContract[Open Active<br/>Contract<br/>5 sec]
    OpenContract --> ReturnPhotos[📸 Take 4 Photos:<br/>Front, Back,<br/>Both Sides<br/>20 sec]
    ReturnPhotos --> EnterReturn[Enter Return:<br/>Odometer &<br/>Fuel Level<br/>10 sec]
    EnterReturn --> ComparePhotos[Compare with<br/>Initial Photos<br/>15 sec]
    ComparePhotos --> NewDamage{New Damage?}
    
    NewDamage -->|Yes| DocDamage[Document Damage<br/>with Photos &<br/>Description<br/>30 sec]
    NewDamage -->|No| CalcCharges
    
    DocDamage --> EstRepair[Enter Repair<br/>Cost Estimate<br/>10 sec]
    EstRepair --> CalcCharges[Calculate Charges:<br/>KM Overage,<br/>Fuel Difference<br/>10 sec]
    
    CalcCharges --> ShowCharges[Show Total<br/>Additional Charges<br/>5 sec]
    ShowCharges --> AdditionalDue{Charges Due?}
    
    AdditionalDue -->|Yes| CustAgree{Customer<br/>Agrees?}
    AdditionalDue -->|No| FinalInvoice
    
    CustAgree -->|Yes| AckSign[Capture Customer<br/>Acknowledgment<br/>10 sec]
    CustAgree -->|No| Dispute[Create Dispute<br/>Note & Flag<br/>20 sec]
    
    AckSign --> PayExtra{Payment Method}
    PayExtra -->|Card| ExtraCard[Process Card<br/>10 sec]
    PayExtra -->|Twint| ExtraTwint[Process Twint<br/>10 sec]
    PayExtra -->|Cash| ExtraCash[Accept Cash<br/>10 sec]
    
    ExtraCard --> FinalInvoice
    ExtraTwint --> FinalInvoice
    ExtraCash --> FinalInvoice
    Dispute --> FinalInvoice[Generate Final<br/>Invoice PDF<br/>10 sec]
    
    FinalInvoice --> UpdateStatus[Mark Vehicle<br/>as Available<br/>5 sec]
    UpdateStatus --> CloseContract[Close Contract<br/>5 sec]
    
    CloseContract --> CheckMaint{Needs<br/>Maintenance?}
    CheckMaint -->|Yes| FlagMaint[Flag for<br/>Maintenance<br/>5 sec]
    CheckMaint -->|No| Complete
    
    FlagMaint --> InsuranceNote[Create Insurance<br/>Claim Note<br/>10 sec]
    InsuranceNote --> Complete([Rental Complete<br/>Vehicle Available])
    
    Reject --> End([Process Terminated])
    
    style Start fill:#e1f5fe
    style Complete fill:#c8e6c9
    style End fill:#ffebee
    style Payment fill:#fff3e0
    style PayExtra fill:#fff3e0
    style Reject fill:#ffebee
    style Dispute fill:#ffe6cc
```

### Staff Dashboard Daily Flow
```mermaid
graph LR
    Login([Staff Login]) --> Dashboard{Staff Dashboard}
    
    Dashboard --> Pickups[Today's Pickups<br/>List View]
    Dashboard --> Returns[Today's Returns<br/>List View]
    Dashboard --> Available[Available Vehicles<br/>Count]
    Dashboard --> Overdue[Overdue Alerts<br/>Red Flags]
    
    Pickups --> NewRental[Start New Rental]
    Returns --> ProcessReturn[Process Return]
    Available --> Calendar[Fleet Calendar]
    Overdue --> Contact[Contact Customer]
    
    NewRental --> Workflow1[Rental Workflow]
    ProcessReturn --> Workflow2[Return Workflow]
    
    style Dashboard fill:#e8eaf6
    style Overdue fill:#ffebee
```

## User Journey Map - New Rental

### Journey Stages & Touchpoints

```mermaid
journey
    title Staff Member: New Rental Journey (2 minutes)
    section Discovery
      Customer Arrives: 5: Staff
      Check Availability: 4: Staff
      Quote Price: 5: Staff
    section Setup
      Create/Find Customer: 4: Staff
      Select Vehicle: 5: Staff
      Enter Details: 3: Staff
    section Documentation
      Take Photos: 4: Staff
      Capture Signatures: 5: Staff
      Select Payment: 5: Staff
    section Completion
      Generate Contract: 5: Staff
      Hand Over Keys: 5: Staff
      Customer Leaves: 5: Staff
```

## Service Blueprint - Rental Process

```mermaid
graph TB
    subgraph "Customer Actions"
        C1[Arrives at Office]
        C2[Provides ID/Info]
        C3[Selects Vehicle]
        C4[Signs Contract]
        C5[Makes Payment]
        C6[Receives Keys]
    end
    
    subgraph "Front Stage - Staff Actions"
        F1[Greet Customer]
        F2[Check Dashboard]
        F3[Create/Search Profile]
        F4[Show Available Vehicles]
        F5[Calculate Price]
        F6[Take Photos]
        F7[Process Payment]
        F8[Print Contract]
    end
    
    subgraph "Back Stage - System Actions"
        B1[Load Dashboard]
        B2[Query Database]
        B3[Update Availability]
        B4[Calculate Rates]
        B5[Generate PDF]
        B6[Log Transaction]
        B7[Update Fleet Status]
    end
    
    subgraph "Support Systems"
        S1[Database]
        S2[PDF Generator]
        S3[Payment System]
        S4[Fleet Calendar]
    end
    
    C1 --> F1
    C2 --> F3
    F2 --> B1
    F3 --> B2
    C3 --> F4
    F4 --> B3
    F5 --> B4
    C4 --> F6
    C5 --> F7
    F7 --> S3
    F8 --> B5
    B5 --> S2
    C6 --> B7
    B7 --> S4
    
    style C1 fill:#e3f2fd
    style C6 fill:#e8f5e9
```

## Owner Dashboard - Information Architecture

```mermaid
graph TD
    Dashboard[Owner Dashboard] --> Financial[Financial Overview]
    Dashboard --> Operations[Operations]
    Dashboard --> Fleet[Fleet Management]
    Dashboard --> ROI[ROI Metrics]
    
    Financial --> Revenue[Daily/Weekly/Monthly Revenue]
    Financial --> Payment[Payment Breakdown<br/>Card/Twint/Cash]
    Financial --> Additional[Additional Revenue<br/>Fuel & KM Charges]
    
    Operations --> Contracts[Contracts Created]
    Operations --> Utilization[Vehicle Utilization]
    Operations --> Staff[Staff Performance]
    
    Fleet --> Status[Vehicle Status]
    Fleet --> Maintenance[Maintenance Flags]
    Fleet --> Availability[Availability Calendar]
    
    ROI --> TimeSaved[Time Saved<br/>vs Paper Process]
    ROI --> RevCapture[Revenue Captured<br/>10-15% Increase]
    ROI --> CostBenefit[Subscription ROI]
    
    style Dashboard fill:#f3e5f5
    style ROI fill:#e8f5e9
    style Financial fill:#fff3e0
```

## Decision Flow - Payment Processing

```mermaid
flowchart TD
    Start([Payment Required]) --> Amount{Amount Due?}
    
    Amount -->|Initial Payment| Initial[Show Total]
    Amount -->|Additional Charges| Additional[Show Breakdown<br/>Fuel/KM/Damage]
    
    Initial --> Method{Select Payment Method}
    Additional --> Method
    
    Method -->|Card| Card{Card Type?}
    Method -->|Twint| Twint[Open Twint App]
    Method -->|Cash| Cash[Count Cash]
    
    Card -->|Credit| Credit[Process Credit]
    Card -->|Debit| Debit[Process Debit]
    
    Credit --> Receipt[Generate Receipt]
    Debit --> Receipt
    Twint --> Verify[Verify Payment]
    Cash --> Change[Give Change]
    
    Verify --> Receipt
    Change --> Receipt
    
    Receipt --> Update[Update System]
    Update --> Complete([Payment Complete])
    
    style Method fill:#fff3e0
    style Complete fill:#c8e6c9
```

## State Diagram - Vehicle Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Available
    Available --> Reserved: Customer Books
    Reserved --> Rented: Contract Signed
    Rented --> Returning: Return Initiated
    Returning --> Inspection: Staff Inspects
    
    Inspection --> Available: No Issues
    Inspection --> Maintenance: Damage/Service Due
    
    Maintenance --> Available: Service Complete
    
    Available --> Maintenance: Scheduled Service
    
    note right of Rented
        Tracking:
        - Current Customer
        - Expected Return
        - KM/Fuel at Start
    end note
    
    note right of Inspection
        Check:
        - New Damage
        - Fuel Level
        - KM Driven
    end note
```

## Customer Experience Map

```mermaid
graph LR
    subgraph "Pre-Rental"
        A1[Phone Inquiry]
        A2[Walk In]
        A3[Check Availability]
    end
    
    subgraph "Rental Process - 2 min"
        B1[Customer ID<br/>30s]
        B2[Vehicle Selection<br/>30s]
        B3[Pricing<br/>30s]
        B4[Documentation<br/>30s]
        B5[Payment<br/>30s]
        B6[Receive Keys<br/>30s]
    end
    
    subgraph "Rental Period"
        C1[Drive Vehicle]
        C2[Use Extras<br/>GPS/Child Seat]
    end
    
    subgraph "Return Process - 1 min"
        D1[Return Vehicle<br/>15s]
        D2[Inspection<br/>15s]
        D3[Calculate Charges<br/>15s]
        D4[Final Payment<br/>15s]
    end
    
    A1 --> A3
    A2 --> A3
    A3 --> B1
    B1 --> B2 --> B3 --> B4 --> B5 --> B6
    B6 --> C1
    C1 --> C2
    C2 --> D1
    D1 --> D2 --> D3 --> D4
    
    style B1 fill:#e3f2fd
    style B6 fill:#e8f5e9
    style D4 fill:#e8f5e9
```

## Pain Points & Solutions Matrix

| Journey Stage | Traditional Pain Point | CRMS Solution | Time Saved |
|--------------|------------------------|---------------|------------|
| Customer Search | Manual paper filing | Digital search < 15s | 5-10 min |
| Contract Creation | Handwritten forms | Auto-populated fields | 10-15 min |
| Pricing Calculation | Manual calculator | Automatic with VAT | 3-5 min |
| Photo Documentation | Separate camera + filing | Embedded in PDF | 5-10 min |
| Payment Tracking | Manual ledger | Digital tracking | 2-3 min |
| Vehicle Availability | Physical logbook | Real-time calendar | 3-5 min |
| Revenue Tracking | End-of-day counting | Automatic dashboard | 15-20 min |

## Implementation Priority Matrix

```mermaid
quadrantChart
    title Implementation Priority (Impact vs Effort)
    x-axis Low Effort --> High Effort
    y-axis Low Impact --> High Impact
    quadrant-1 Quick Wins
    quadrant-2 Major Projects  
    quadrant-3 Fill Ins
    quadrant-4 Nice to Have
    
    "Staff Dashboard": [0.3, 0.8]
    "Digital Contracts": [0.5, 0.9]
    "Payment Tracking": [0.2, 0.7]
    "Fleet Calendar": [0.4, 0.8]
    "Photo Documentation": [0.3, 0.7]
    "Customer Database": [0.3, 0.8]
    "Revenue Dashboard": [0.4, 0.9]
    "Digital Signatures": [0.6, 0.6]
    "Hourly Rates": [0.2, 0.6]
    "Maintenance Flags": [0.2, 0.4]
```

## Best Practices Applied

### 1. **Journey Mapping**
- Shows emotional highs/lows
- Identifies pain points
- Highlights opportunities

### 2. **Service Blueprint**
- Front-stage vs back-stage actions
- System touchpoints
- Support processes

### 3. **Flow Diagrams**
- Decision points
- Process steps
- Time estimates

### 4. **State Diagrams**
- Object lifecycle
- Status transitions
- Business rules

### 5. **Information Architecture**
- Dashboard organization
- Data hierarchy
- User mental models

## Usage Notes

These diagrams can be:
- **Embedded in documentation** - Mermaid renders in GitHub, GitLab, and most modern markdown viewers
- **Exported as images** - For presentations and external documents
- **Used for development** - Developers can follow the exact flows
- **Updated iteratively** - Easy to modify as requirements evolve
- **Shared with stakeholders** - Visual communication of system behavior

## Tools for Creating Journey Visualizations

1. **Mermaid** (used here) - Text-based, version-controlled, embedded in markdown
2. **Figma/FigJam** - Collaborative, visual journey mapping
3. **Miro/Mural** - Workshop-friendly, template-rich
4. **Lucidchart** - Professional diagrams, integrations
5. **Draw.io** - Free, extensive shape libraries