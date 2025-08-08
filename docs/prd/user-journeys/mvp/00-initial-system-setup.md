# Initial System Setup (One-Time)

**Actor:** Owner  
**Trigger:** First time accessing the system after purchase **Frequency:** Once per company

## Journey Steps

### 1. Company Configuration (2 minutes)

- Enter company name
- Business address
- Phone and email
- Swiss UID/VAT number
- Bank account for QR-bills
- Default language (German for MVP)

### 2. Set Business Rules (1 minute)

- Default rental terms
- Fuel price per liter
- Kilometer rate over limit
- Daily/weekly rate discount %
- VAT rate (7.7% for Switzerland)
- Operating hours

### 3. Create Owner Account (30 seconds)

- Set admin email
- Create strong password
- Security reminder setup
- Contact for support

### 4. Add Initial Vehicles (5 minutes)

- Add 3-5 vehicles to start
- Basic info: plate, make, model
- Set rates per vehicle
- Mark initial availability
- Can add more later

### 5. Create First Staff Account (1 minute)

- Add one staff member
- Set temporary password
- Assign staff role
- Test login works

### 6. Configure Contract Template (2 minutes)

- Upload company logo (optional)
- Review standard terms
- Set contract footer text
- Test PDF generation

### 7. Verify Core Functions (2 minutes)

- Create test customer
- Create test contract
- Generate test QR-bill
- Verify PDF looks correct
- Delete test data

## Time Estimate

Total: ~15 minutes one-time setup

## Why This is MVP Critical

- **Cannot operate without setup**
- **Legal requirements:** VAT, company details
- **QR-bills need bank info**
- **Sets foundation for all operations**

## Key Features Required

- Setup wizard interface
- Validation of Swiss requirements
- Default data population
- Setup completion tracking
- Cannot skip critical fields

## Simple Implementation

- Guided wizard (step-by-step)
- Pre-filled Swiss defaults
- Basic validation only
- No complex customization
- Can edit everything later

## What's Pre-configured

- Swiss legal contract template
- Standard terms and conditions
- VAT calculations
- Date/time formats
- Currency (CHF)

## What's NOT in MVP Setup

- Multiple locations
- Department structure
- Complex pricing rules
- Email templates
- Integrations
- Custom fields

## Success Criteria

- Owner can complete alone in 15 minutes
- System ready for first real rental
- All legal requirements met
- QR-bill generation working

## Post-Setup

- System dashboard appears
- Ready for first customer
- Can modify settings anytime
- Support documentation available

## Visual Flow

```
Company → Rules → Owner → Vehicles → Staff → Template → Test
   ↓        ↓       ↓        ↓         ↓        ↓        ↓
  2 min    1 min   30s      5 min     1 min    2 min    2 min
                                          Total: ~15 minutes
```
