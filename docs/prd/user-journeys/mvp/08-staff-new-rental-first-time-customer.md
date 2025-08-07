# New Rental - First Time Customer

**Actor:** Staff Member  
**Trigger:** Walk-in customer wants to rent a vehicle

## Journey Steps

### 1. Customer Creation (35 seconds)
- Click "New Customer" button
- Enter customer details (name, ID number, phone, email, address)
- Take photo of customer ID document
- Take photo of driver's license (both sides)
- Verify driver's license validity and expiration date
- Save customer to database

### 2. Vehicle Selection (30 seconds)
- View fleet calendar or available vehicles list
- Filter by vehicle type if needed
- Select available vehicle
- Verify vehicle is clean and ready

### 3. Contract Details (30 seconds)
- Enter rental start/end dates
- Select pricing tier (hourly/daily/weekly/monthly)
- Add extras (GPS, child seat, etc.)
- System calculates total price with VAT
- Enter current fuel level and odometer reading

### 4. Documentation (30 seconds)
- Take 4 photos of vehicle condition (front, back, sides)
- Mark any existing damage on photos
- Capture customer signature on tablet/screen
- Capture staff signature

### 5. Payment & Finalization (30 seconds)
- Select payment method: Card / Twint / Cash
- Process payment (mark as received)
- Generate PDF contract with all photos embedded
- Print/email contract to customer
- Hand over vehicle keys

## Time Estimate
Total time: ~2 minutes 5 seconds for complete rental process

## Key Features Required
- Customer database with ID and driver's license verification
- Photo capture capability for ID, driver's license, and vehicle
- Fleet availability calendar
- Dynamic pricing calculator with VAT
- Digital signature capture
- Multi-payment method support
- PDF generation with embedded images
- Email/print functionality

## Visual Flow Chart

```mermaid
flowchart TD
    Start([Walk-in Customer]) --> NewCust[Click 'New Customer']
    NewCust --> EnterDetails[Enter Customer Details<br/>Name, ID, Phone, Email, Address]
    EnterDetails --> PhotoID[📸 Take Photo of<br/>ID Document]
    PhotoID --> PhotoLicense[📸 Take Photo of<br/>Driver's License<br/>(Both Sides)]
    PhotoLicense --> VerifyLicense[Verify License<br/>Validity & Expiration]
    VerifyLicense --> SaveCust[Save to Database]
    
    SaveCust --> ViewFleet[View Fleet Calendar/<br/>Available Vehicles]
    ViewFleet --> Filter{Filter Needed?}
    Filter -->|Yes| FilterType[Filter by Vehicle Type]
    Filter -->|No| SelectVehicle
    FilterType --> SelectVehicle[Select Available Vehicle]
    SelectVehicle --> Verify[Verify Vehicle<br/>Clean & Ready]
    
    Verify --> EnterDates[Enter Rental<br/>Start/End Dates]
    EnterDates --> SelectPrice[Select Pricing Tier<br/>Hourly/Daily/Weekly/Monthly]
    SelectPrice --> Extras{Add Extras?}
    Extras -->|Yes| AddExtras[Add GPS, Child Seat, etc.]
    Extras -->|No| CalcPrice
    AddExtras --> CalcPrice[System Calculates<br/>Total with VAT]
    CalcPrice --> EnterMetrics[Enter Fuel Level &<br/>Odometer Reading]
    
    EnterMetrics --> Photos[📸 Take 4 Vehicle Photos<br/>Front, Back, Sides]
    Photos --> MarkDamage{Existing Damage?}
    MarkDamage -->|Yes| Annotate[Mark Damage on Photos]
    MarkDamage -->|No| Signatures
    Annotate --> Signatures[Capture Signatures<br/>Customer & Staff]
    
    Signatures --> Payment[Select Payment Method<br/>Card / Twint / Cash]
    Payment --> Process[Process Payment]
    Process --> GeneratePDF[Generate PDF Contract<br/>with Embedded Photos]
    GeneratePDF --> Deliver{Delivery Method}
    Deliver -->|Print| Print[Print Contract]
    Deliver -->|Email| Email[Email Contract]
    Deliver -->|Both| Both[Print & Email]
    Print --> Keys[Hand Over Keys]
    Email --> Keys
    Both --> Keys
    Keys --> End([Rental Complete])
    
    style Start fill:#e1f5e1
    style End fill:#e1f5e1
    style SaveCust fill:#e6f3ff
    style CalcPrice fill:#fff4e6
    style GeneratePDF fill:#f0e6ff
```