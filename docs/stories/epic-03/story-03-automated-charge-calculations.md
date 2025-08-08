# Story 03: Automated Charge Calculations

**Story ID:** EPIC-03-S03  
**Epic:** Epic 3: Financial & Payment Processing  
**Priority:** High  
**Story Points:** 5

## User Story Statement

**As a** rental staff member  
**I want to** automatically calculate all charges  
**So that** nothing is missed, pricing is consistent, and we capture the 10-15% additional revenue
through accurate tracking

## Detailed Acceptance Criteria

1. **Base Rental Calculation**
   - GIVEN a rental contract with start and end times
   - WHEN calculating charges
   - THEN the base rental is calculated using appropriate rate structure
     (hourly/daily/weekly/monthly)
   - AND the most cost-effective rate combination is automatically selected

2. **Time-Based Rate Optimization**
   - GIVEN a rental duration that could use multiple rate structures
   - WHEN calculating the base charge within 3 seconds
   - THEN the system SHALL compare all applicable rate combinations (hourly, daily, weekly, monthly)
   - AND SHALL select the option that provides the lowest total cost for the customer
   - AND SHALL complete rate comparison calculations for up to 10 possible combinations within 2
     seconds
   - AND SHALL log the selected rate structure and savings amount for audit purposes

3. **Fuel Difference Calculation**
   - GIVEN fuel levels recorded at pickup and return with accuracy to 0.1 liter
   - WHEN processing the return within 30 seconds of data entry
   - THEN fuel difference SHALL be calculated to 0.01 liter precision using fuel prices updated
     within the last 24 hours
   - AND fuel charges SHALL be itemized showing exact quantity (liters), price per liter (CHF to 3
     decimal places), and total amount
   - AND SHALL handle fuel price fluctuations by using the price effective at time of return
   - AND SHALL validate fuel level readings are within physically possible range (0-80 liters for
     standard vehicles)

4. **Excess Kilometer Charges**
   - GIVEN odometer readings at pickup and return with integer precision
   - WHEN calculating final charges within 10 seconds
   - THEN excess kilometers beyond included allowance SHALL be calculated with 1 km accuracy
   - AND per-kilometer rates SHALL be applied based on vehicle category (economy: CHF 0.25/km,
     compact: CHF 0.30/km, SUV: CHF 0.40/km)
   - AND SHALL validate odometer readings are sequential and within reasonable daily driving limits
     (maximum 2000 km per day)
   - AND SHALL handle cases where odometer reading decreases (maintenance reset) with manual review
     flag

5. **Swiss VAT Application**
   - GIVEN any chargeable amount greater than CHF 0.01
   - WHEN calculating final totals within 5 seconds
   - THEN Swiss VAT (7.7%) SHALL be automatically applied to all applicable charges with CHF 0.01
     precision
   - AND VAT amounts SHALL be itemized separately showing VAT-inclusive amount, VAT rate (7.7%), and
     VAT amount
   - AND SHALL handle VAT-exempt services (certain insurance products) according to Swiss tax
     regulations
   - AND SHALL round VAT calculations to nearest CHF 0.05 (5 Rappen) as per Swiss rounding rules

6. **Itemized Breakdown Generation**
   - GIVEN all calculated charges totaling more than CHF 0.00
   - WHEN presenting the final bill within 2 seconds of calculation completion
   - THEN each charge category SHALL be itemized with: description, quantity (to 2 decimal places),
     unit rate (CHF), subtotal (CHF), VAT rate (%), VAT amount (CHF), and line total (CHF)
   - AND SHALL ensure mathematical accuracy where sum of line totals equals grand total within CHF
     0.01
   - AND SHALL support up to 50 line items per invoice
   - AND SHALL generate line items in consistent order: base rental, additional services, penalties,
     taxes

7. **Additional Service Charges**
   - GIVEN optional services selected during rental (GPS, child seats, insurance, cleaning kits)
   - WHEN calculating total charges within 5 seconds
   - THEN all selected services SHALL be included with correct pricing: GPS (CHF 5/day), child seats
     (CHF 8/day), insurance upgrade (15% of base rental)
   - AND service duration SHALL be calculated in full day increments (minimum 1 day, partial days
     rounded up)
   - AND SHALL validate service compatibility with vehicle type (child seats not available for
     2-door vehicles)
   - AND SHALL apply quantity limits (maximum 2 child seats per vehicle, 1 GPS per rental)

8. **Late Return Penalties**
   - GIVEN a rental returned after the agreed time plus 15-minute grace period
   - WHEN calculating charges within 30 seconds of return processing
   - THEN late return penalties SHALL be automatically applied as follows: 1-2 hours late (CHF 25),
     2-6 hours late (CHF 50 + CHF 15/hour), >6 hours late (additional full day rate)
   - AND SHALL calculate delay duration in minutes with 1-minute precision
   - AND SHALL apply maximum late penalty of 200% of original rental rate
   - AND SHALL provide penalty waiver capability for staff with supervisor approval
   - AND SHALL generate automatic notification to customer when late penalty exceeds CHF 100

9. **Cleaning and Damage Charges**
   - GIVEN vehicle condition assessment at return with photographic evidence
   - WHEN additional charges are required within 10 minutes of assessment
   - THEN cleaning fees SHALL be applied per predefined schedule: light cleaning (CHF 50), deep
     cleaning (CHF 120), odor removal (CHF 200)
   - AND damage charges SHALL be calculated based on repair estimates with minimum CHF 100
     deductible
   - AND SHALL require supervisor approval for damage charges exceeding CHF 500
   - AND SHALL generate itemized repair estimates within 24 hours for damages over CHF 200
   - AND SHALL maintain photographic evidence linked to each charge for dispute resolution

10. **Multi-Day Rate Calculations**
    - GIVEN rentals spanning multiple calendar days (minimum 2 days)
    - WHEN calculating charges within 5 seconds
    - THEN daily rate breaks SHALL be correctly applied: 2-6 days (daily rate), 7-13 days (weekly
      rate discount of 15%), 14+ days (monthly rate discount of 25%)
    - AND weekend surcharges (Friday-Sunday: +20%) SHALL be applied to applicable days
    - AND holiday surcharges (+30%) SHALL be applied for Swiss federal holidays: New Year's Day,
      Good Friday, Easter Monday, Labour Day, Ascension Day, Whit Monday, Swiss National Day,
      Christmas Day, St. Stephen's Day
    - AND SHALL handle partial days at end of rental using hourly rates up to daily maximum

11. **Promotional Discount Application**
    - GIVEN valid promotional codes verified within 3 seconds
    - WHEN calculating final charges
    - THEN discounts SHALL be applied correctly: percentage discounts (5%-50% range), fixed amount
      discounts (CHF 10-500 range), free service upgrades
    - AND SHALL validate discount eligibility rules: minimum rental duration, vehicle category
      restrictions, customer type restrictions, valid date ranges
    - AND discount details SHALL be shown as separate line items with negative amounts in itemized
      breakdown
    - AND SHALL prevent stacking of promotional codes (maximum 1 promotional discount per rental)
    - AND SHALL apply discounts only to eligible charges (base rental and services, not penalties or
      taxes)

12. **Currency Conversion Handling**
    - GIVEN customers paying in EUR with rates updated within 24 hours
    - WHEN calculating charges within 2 seconds
    - THEN conversion rates SHALL be obtained from Swiss National Bank or equivalent financial
      service with timestamp
    - AND both CHF (base currency) and EUR amounts SHALL be displayed with 2 decimal precision
    - AND exchange rate and conversion timestamp SHALL be shown on invoice for transparency
    - AND SHALL apply 2% currency conversion fee for EUR transactions
    - AND SHALL handle rate volatility by fixing conversion rate at time of contract creation for
      rentals >7 days

## Technical Implementation Notes

### Calculation Engine Architecture

- **Rate Engine:** Pluggable rate calculation system supporting multiple pricing models
- **Rule-Based System:** Configurable business rules for charge calculations
- **Validation Layer:** Ensure all calculations are mathematically correct and complete
- **Audit Trail:** Track all calculation inputs and results for debugging

### Pricing Rules Framework

```typescript
interface PricingRule {
  id: string;
  name: string;
  category: ChargeCategory;
  conditions: RuleCondition[];
  calculation: CalculationFunction;
  priority: number;
  active: boolean;
}

interface ChargeLineItem {
  category: string;
  description: string;
  quantity: number;
  unit_price: Decimal;
  subtotal: Decimal;
  vat_rate: Decimal;
  vat_amount: Decimal;
  total: Decimal;
}
```

### Rate Optimization Algorithm

```typescript
function optimizeRateStructure(duration: Duration, rates: RateStructure[]): OptimizedRate {
  // Calculate all possible rate combinations
  // Return the combination with lowest total cost
  // Consider daily caps, weekly discounts, monthly rates
}
```

### Database Design

```sql
-- Rate structures
CREATE TABLE rate_structures (
    id UUID PRIMARY KEY,
    vehicle_category_id UUID REFERENCES vehicle_categories(id),
    rate_type ENUM('hourly', 'daily', 'weekly', 'monthly'),
    base_rate DECIMAL(10,2) NOT NULL,
    included_km INTEGER DEFAULT 0,
    excess_km_rate DECIMAL(6,3),
    fuel_rate DECIMAL(6,3),
    valid_from DATE NOT NULL,
    valid_until DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Charge calculations
CREATE TABLE charge_calculations (
    id UUID PRIMARY KEY,
    rental_contract_id UUID REFERENCES rental_contracts(id),
    calculation_timestamp TIMESTAMP DEFAULT NOW(),
    base_rental_amount DECIMAL(10,2),
    fuel_charges DECIMAL(10,2),
    km_charges DECIMAL(10,2),
    service_charges DECIMAL(10,2),
    penalty_charges DECIMAL(10,2),
    subtotal DECIMAL(10,2),
    vat_amount DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    calculation_details JSONB,
    calculated_by UUID REFERENCES staff_users(id)
);

-- Charge line items
CREATE TABLE charge_line_items (
    id UUID PRIMARY KEY,
    calculation_id UUID REFERENCES charge_calculations(id),
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    quantity DECIMAL(10,3),
    unit_price DECIMAL(10,2),
    subtotal DECIMAL(10,2),
    vat_rate DECIMAL(5,3),
    vat_amount DECIMAL(10,2),
    total DECIMAL(10,2)
);
```

## API Endpoints Needed

### Calculation Services

```
POST /api/v1/charges/calculate
- Body: { contract_id, calculation_params }
- Response: { total, line_items[], vat_summary, calculation_id }

GET /api/v1/charges/preview/{contract_id}
- Query: return_datetime?, fuel_level?, odometer?
- Response: { estimated_charges, breakdown[], assumptions[] }

POST /api/v1/charges/recalculate/{calculation_id}
- Body: { updated_params }
- Response: { updated_calculation, differences[] }
```

### Rate Management

```
GET /api/v1/rates/current
- Query: vehicle_category?, effective_date?
- Response: { rate_structures[], fuel_prices, surcharges[] }

POST /api/v1/rates/test-calculation
- Body: { duration, vehicle_category, services[], fuel_usage, km_usage }
- Response: { calculation_preview, rate_breakdown }
```

### Pricing Rules

```
GET /api/v1/pricing-rules/active
- Response: { rules[], categories[], vat_rates }

POST /api/v1/pricing-rules/validate
- Body: { rule_conditions, test_scenarios[] }
- Response: { validation_results[], test_outcomes[] }
```

## Database Schema Requirements

### Core Tables

- `rate_structures` - All pricing rates with validity periods
- `charge_calculations` - Complete calculation records with audit trail
- `charge_line_items` - Detailed breakdown of all charges
- `pricing_rules` - Configurable business rules for calculations
- `fuel_prices` - Historical fuel pricing for accurate calculations
- `surcharge_schedules` - Late fees, cleaning costs, damage rates

### Indexes Required

- `rate_structures(vehicle_category_id, valid_from, valid_until)`
- `charge_calculations(rental_contract_id, calculation_timestamp DESC)`
- `charge_line_items(calculation_id, category)`
- `pricing_rules(category, priority, active)`

### Constraints

- All monetary amounts must be non-negative
- VAT rates must be between 0 and 1
- Rate validity periods cannot overlap for same category
- Calculation totals must equal sum of line items

## UI/UX Considerations

### Calculation Display Interface

- **Real-time Preview:** Show estimated charges as parameters change
- **Breakdown Visualization:** Clear hierarchical display of charge categories
- **Comparison View:** Show rate optimization choices made by system
- **Highlight Changes:** Clearly show when calculations update

### Itemized Invoice Layout

- **Professional Format:** Clean, printable invoice format
- **Line Item Detail:** Each charge clearly explained with quantities
- **VAT Breakdown:** Separate section for VAT calculations
- **Multi-language:** Support German, French, Italian invoice formats

### Mobile Calculation Interface

- **Quick Calculator:** Simplified interface for field calculations
- **Voice Input:** Allow voice input for odometer and fuel readings
- **Photo Integration:** Attach fuel gauge and odometer photos
- **Offline Mode:** Basic calculations work without internet

### Administrative Interface

- **Rate Management:** Easy interface for updating pricing structures
- **Rule Testing:** Test pricing rules against historical data
- **Calculation Review:** Review and adjust calculations when needed
- **Reporting Dashboard:** Analytics on pricing accuracy and revenue

## Testing Scenarios

### Basic Calculation Scenarios

1. **Standard Daily Rental**
   - Create 3-day rental with standard vehicle
   - Return on time with same fuel level and within km limit
   - Verify only base rate and VAT are charged

2. **Rate Optimization Test**
   - Create 8-day rental (should use weekly + daily rates)
   - Verify system selects most economical rate combination
   - Confirm calculation explanation shows rate selection logic

3. **Fuel and Kilometer Charges**
   - Return vehicle with 10 liters less fuel and 200 excess km
   - Verify fuel charge calculation with current prices
   - Confirm excess km charges with correct per-km rate

### Complex Calculation Scenarios

4. **Late Return with Multiple Penalties**
   - Return vehicle 1.5 days late
   - Apply grace period, then hourly and daily late fees
   - Verify progressive penalty calculation

5. **Multiple Service Charges**
   - Rental with GPS, child seat, and insurance upgrade
   - Verify time-based vs flat-fee service charges
   - Confirm all services included in final calculation

### Edge Case Testing

6. **Cross-Month Rental**
   - Start rental in one month, end in next
   - Change fuel prices during rental period
   - Verify correct fuel price applied at return

7. **Promotional Discount Application**
   - Apply 20% discount code to base rental only
   - Verify discount applies correctly to eligible charges
   - Confirm VAT calculated on discounted amounts

8. **Currency Conversion Accuracy**
   - Calculate charges in CHF, customer pays EUR
   - Verify exchange rate applied consistently
   - Test rounding rules for currency conversion

## Definition of Done

- [ ] Base rental calculation supports all rate structures (hourly/daily/weekly/monthly)
- [ ] Rate optimization automatically selects most economical combination
- [ ] Fuel difference calculation accurate to the liter with current pricing
- [ ] Excess kilometer charges calculated correctly per vehicle category
- [ ] Swiss VAT (7.7%) applied automatically to all applicable charges
- [ ] Itemized breakdown shows clear detail for each charge category
- [ ] Additional service charges calculated based on usage duration
- [ ] Late return penalties applied progressively based on delay duration
- [ ] Cleaning and damage charges use predefined fee schedules
- [ ] Multi-day calculations handle weekend and holiday surcharges
- [ ] Promotional discounts apply correctly to eligible charges only
- [ ] Currency conversion displays both CHF and EUR amounts clearly
- [ ] API endpoints provide real-time calculation previews
- [ ] Database maintains calculation audit trail for all charges
- [ ] UI shows clear breakdown with professional invoice formatting
- [ ] Mobile interface supports field calculation needs
- [ ] Integration tests verify calculation accuracy across all scenarios
- [ ] Performance testing confirms sub-second calculation response times

## Estimated Effort: 5 Story Points

### Breakdown

- **Rate Engine Implementation:** 2 points
- **Business Rules Framework:** 1 point
- **VAT and Currency Handling:** 1 point
- **UI/UX and Reporting:** 1 point

### Dependencies

- Vehicle category and pricing data setup
- Fuel price feed integration
- VAT rate configuration
- Rate structure data migration

### Risks

- **Medium:** Rate calculation complexity causing errors
- **Medium:** VAT compliance requirements changes
- **Low:** Currency conversion rate feed reliability
