# Vehicle Swap Mid-Rental

**Actor:** Staff Member  
**Trigger:** Vehicle breakdown, accident, or customer request during active rental **Frequency:**
Weekly (2-3 times)

## Journey Steps

### 1. Receive Swap Request (15 seconds)

- Customer calls/arrives with issue
- Common reasons:
  - Mechanical breakdown
  - Accident damage
  - Wrong vehicle size
  - Vehicle uncomfortable

### 2. Verify Current Rental (10 seconds)

- Look up active contract
- Check rental terms
- Note current vehicle status
- Review days remaining

### 3. Document Swap Reason (20 seconds)

- Select swap reason:
  - Breakdown
  - Accident
  - Customer request
  - Upgrade/downgrade
- Add detailed notes
- Take photos if damage/issue

### 4. Select Replacement Vehicle (20 seconds)

- Check available vehicles
- Match or upgrade category
- Consider price differences
- Get customer approval

### 5. Create Swap Documentation (30 seconds)

- Close current vehicle rental
- Record final odometer/fuel
- Create new contract segment
- Link to original contract
- Calculate any price adjustments

### 6. Vehicle Handover (15 seconds)

- Provide new keys
- Document new vehicle condition
- Update customer on any changes
- Get signature for swap

## Time Estimate

Total: ~110 seconds (under 2 minutes)

## Why This is MVP Critical

- **Breakdown reality:** Cars break, need immediate replacement
- **Customer retention:** Quick swap prevents losing customer
- **Legal continuity:** Must document vehicle changes
- **Revenue protection:** Track different rates/vehicles

## Key Features Required

- Active contract modification
- Vehicle swap linking
- Price adjustment calculation
- Multi-segment contracts
- Condition documentation
- Reason tracking

## Visual Flow Chart

```mermaid
flowchart TD
    Start([Vehicle Issue<br/>During Rental]) --> Request[Receive Swap<br/>Request<br/>15 sec]
    Request --> Verify[Verify Current<br/>Rental<br/>10 sec]
    Verify --> Reason{Swap<br/>Reason?}

    Reason -->|Breakdown| Breakdown[Document<br/>Breakdown]
    Reason -->|Accident| Accident[Document<br/>Accident]
    Reason -->|Request| CustomerReq[Document<br/>Request]

    Breakdown --> Document[Add Notes &<br/>Photos<br/>20 sec]
    Accident --> Document
    CustomerReq --> Document

    Document --> CheckAvail[Check Available<br/>Vehicles<br/>10 sec]
    CheckAvail --> Available{Suitable<br/>Vehicle?}

    Available -->|No| NoVehicle[Offer Alternatives<br/>or Cancel]
    Available -->|Yes| Select[Select Replacement<br/>10 sec]

    Select --> PriceCheck{Price<br/>Difference?}
    PriceCheck -->|Same| CreateSwap
    PriceCheck -->|Higher| GetApproval[Get Customer<br/>Approval]
    PriceCheck -->|Lower| CreateSwap[Create Swap<br/>Documentation<br/>30 sec]

    GetApproval -->|Approved| CreateSwap
    GetApproval -->|Declined| SelectOther[Select Different<br/>Vehicle]

    SelectOther --> Select

    CreateSwap --> CloseOld[Close Current<br/>Vehicle Segment]
    CloseOld --> RecordMetrics[Record Odometer<br/>& Fuel]
    RecordMetrics --> NewSegment[Create New<br/>Contract Segment]
    NewSegment --> LinkContract[Link to Original]
    LinkContract --> Handover[Vehicle Handover<br/>15 sec]

    Handover --> Keys[Provide New Keys]
    Keys --> PhotosNew[Document New<br/>Vehicle Condition]
    PhotosNew --> Signature[Get Signature]
    Signature --> End([Swap Complete])

    NoVehicle --> EndCancel([Process Alternative])

    style Start fill:#ffe6e6
    style End fill:#e1f5e1
    style EndCancel fill:#ffebee
    style PriceCheck fill:#fff4e6
```

## Common Scenarios

### Breakdown on Highway

- Customer calls from roadside
- Arrange towing for broken vehicle
- Prepare replacement
- Customer continues journey

### Minor Accident

- Cosmetic damage but driveable
- Swap for customer confidence
- Document for insurance
- Original vehicle to repair

### Size Upgrade

- Customer realizes needs bigger vehicle
- Check availability
- Calculate price difference
- Process upgrade

## Edge Cases Handled

- No equivalent vehicle available
- Price disputes on replacement
- Multi-day rental with swap midway
- Insurance implications
- Remote breakdown locations
