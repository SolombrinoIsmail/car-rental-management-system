# Add Vehicle to Fleet

**Actor:** Owner/Admin  
**Trigger:** New vehicle purchased or leased for rental fleet

## Journey Steps

### 1. Access Vehicle Management (10 seconds)
- Login with owner credentials
- Navigate to fleet management section
- Click "Add New Vehicle" button

### 2. Enter Vehicle Details (45 seconds)
- Enter make, model, year
- Enter license plate number
- Enter VIN (Vehicle Identification Number)
- Select vehicle category (economy, standard, luxury, van)
- Enter color and number of seats
- Add insurance policy number and expiry date
- Enter purchase/lease date
- Set initial odometer reading

### 3. Configure Rental Rates (30 seconds)
- Set hourly rate (CHF)
- Set daily rate (CHF)
- Set weekly rate (CHF)
- Set monthly rate (CHF)
- Configure minimum rental period
- Set security deposit amount
- Add fuel tank capacity
- Set per-kilometer charge if applicable

### 4. Upload Documentation (30 seconds)
- Upload vehicle registration document
- Upload insurance certificate
- Upload purchase/lease agreement
- Take photos of vehicle (front, back, sides, interior)
- Upload service history if available

### 5. Set Initial Status (15 seconds)
- Mark as "Available" or "Preparation Needed"
- Set location if multiple branches
- Add any special features (GPS, child seat, etc.)
- Set next service date/mileage
- Save vehicle to fleet

## Time Estimate
Total time: ~2 minutes 10 seconds for complete vehicle addition

## Key Features Required
- Vehicle database with comprehensive fields
- Rate configuration per vehicle
- Document upload and storage
- Photo capture/upload capability
- Insurance tracking
- Service schedule tracking
- Multi-location support
- Vehicle categorization system

## Visual Flow Chart

```mermaid
flowchart TD
    Start([New Vehicle<br/>Acquired]) --> Login[Login as Owner/<br/>Admin<br/>5 sec]
    Login --> Navigate[Navigate to Fleet<br/>Management<br/>5 sec]
    Navigate --> AddButton[Click "Add New<br/>Vehicle" Button]
    
    AddButton --> BasicInfo[Enter Basic Info:<br/>Make, Model, Year<br/>15 sec]
    BasicInfo --> RegDetails[Enter Registration:<br/>Plate, VIN<br/>10 sec]
    RegDetails --> Category[Select Vehicle<br/>Category<br/>5 sec]
    Category --> Physical[Enter Physical Details:<br/>Color, Seats<br/>5 sec]
    Physical --> Insurance[Add Insurance Info:<br/>Policy #, Expiry<br/>10 sec]
    Insurance --> Metrics[Enter Initial Metrics:<br/>Purchase Date, Odometer<br/>10 sec]
    
    Metrics --> ConfigRates[Configure Rental Rates<br/>15 sec]
    ConfigRates --> Hourly[Set Hourly Rate<br/>CHF]
    Hourly --> Daily[Set Daily Rate<br/>CHF]
    Daily --> Weekly[Set Weekly Rate<br/>CHF]
    Weekly --> Monthly[Set Monthly Rate<br/>CHF]
    Monthly --> MinPeriod[Set Minimum<br/>Rental Period<br/>5 sec]
    MinPeriod --> Deposit[Set Security<br/>Deposit Amount<br/>5 sec]
    Deposit --> FuelCap[Enter Fuel<br/>Tank Capacity]
    FuelCap --> KmCharge[Set Per-KM<br/>Charge (if any)<br/>5 sec]
    
    KmCharge --> UploadDocs[Upload Documents<br/>10 sec]
    UploadDocs --> Registration[Upload Vehicle<br/>Registration]
    Registration --> InsCert[Upload Insurance<br/>Certificate]
    InsCert --> Agreement[Upload Purchase/<br/>Lease Agreement]
    Agreement --> Photos[Take/Upload Photos:<br/>Front, Back, Sides,<br/>Interior<br/>15 sec]
    Photos --> History{Service History<br/>Available?}
    History -->|Yes| UploadHistory[Upload Service<br/>History<br/>5 sec]
    History -->|No| SetStatus
    UploadHistory --> SetStatus
    
    SetStatus[Set Initial Status<br/>5 sec] --> AvailStatus{Mark as<br/>Available?}
    AvailStatus -->|Yes| Available[Status: Available]
    AvailStatus -->|No| Preparation[Status: Preparation<br/>Needed]
    
    Available --> Location
    Preparation --> Location[Set Location<br/>(if multiple)]
    Location --> Features[Add Special Features:<br/>GPS, Child Seat, etc.<br/>5 sec]
    Features --> Service[Set Next Service<br/>Date/Mileage<br/>5 sec]
    
    Service --> Validate{All Fields<br/>Valid?}
    Validate -->|No| FixErrors[Fix Validation<br/>Errors]
    Validate -->|Yes| Save[Save Vehicle<br/>to Fleet]
    FixErrors --> Validate
    
    Save --> UpdateCalendar[Update Fleet<br/>Calendar]
    UpdateCalendar --> Notify[Notify Staff of<br/>New Vehicle]
    Notify --> End([Vehicle Added<br/>~2 min 10 sec])
    
    style Start fill:#e1f5e1
    style End fill:#e1f5e1
    style ConfigRates fill:#fff4e6
    style AvailStatus fill:#e6f3ff
    style Validate fill:#ffe6e6
```