# Story 2: Owner Business Dashboard

**Story ID:** CRMS-E4-S02  
**Epic:** Dashboard & Reporting  
**Priority:** High  
**Complexity:** High

## User Story Statement

**As an** owner  
**I want to** monitor comprehensive business performance metrics in real-time  
**So that** I can make data-driven decisions to optimize revenue and demonstrate 10-15% business improvement

## Detailed Acceptance Criteria

1. **Revenue Tracking**
   - SHALL display revenue totals with CHF precision to 0.01: daily (updated every 30 minutes), weekly (updated daily at 6 AM), monthly (updated hourly), yearly (updated daily)
   - SHALL show revenue trends with interactive visual graphs loading within 3 seconds for up to 24 months of historical data
   - SHALL compare current period to previous periods with percentage changes calculated to 0.1% precision: day-over-day, week-over-week, month-over-month, year-over-year
   - SHALL break down revenue by source with exact percentages: base rentals (target 70%), additional services (target 20%), penalties/fees (target 7%), insurance (target 3%)
   - SHALL display average revenue per rental (minimum CHF 50, target CHF 150) and per day with 7-day rolling average and trend indicators

2. **Fleet Utilization Metrics**
   - SHALL show overall fleet utilization percentage updated every 15 minutes with target threshold >75% (green), 60-75% (yellow), <60% (red)
   - SHALL display utilization by vehicle category with drill-down capability: Economy (target 85%), Compact (target 80%), SUV (target 75%), Luxury (target 65%)
   - SHALL track utilization trends over 12-month periods with seasonal adjustment factors and weekly/monthly comparison overlays
   - SHALL identify top 10 and bottom 10 performing vehicles by utilization rate with specific metrics: days rented, revenue generated, maintenance costs
   - SHALL calculate and display revenue per vehicle per day with targets: Economy (CHF 60), Compact (CHF 75), SUV (CHF 110), Luxury (CHF 180)
   - SHALL provide vehicle replacement recommendations when utilization <40% for 30 consecutive days

3. **Payment Method Analysis**
   - SHALL break down payments by method with exact percentages updated daily: Cash (target <30%), Card (target 50%), Bank Transfer (target 15%), Twint/QR (target 5%)
   - SHALL show payment method preferences and trends over 12-month periods with month-over-month change indicators >5% highlighted
   - SHALL display payment success rates with SLA targets: Card (>98%), Twint (>97%), Bank Transfer (>99%) and failure statistics categorized by failure type
   - SHALL track average transaction values by payment method: Cash (CHF 50-200), Card (CHF 80-500), Bank Transfer (CHF 200-2000), Twint (CHF 30-300)
   - SHALL monitor payment processing fees with precision to CHF 0.01 and calculate impact on profit margins: Card fees (<2.5% of transaction), Bank fees (<CHF 5 per transaction)
   - SHALL alert when processing fees exceed 3% of monthly revenue

4. **Vehicle Performance Rankings**
   - SHALL list exactly top 10 performing vehicles by total revenue with monthly refresh and historical 6-month comparison
   - SHALL show vehicles with highest utilization rates (minimum 30 days data) sorted by percentage with tie-breaking by revenue
   - SHALL display vehicles with best revenue-per-day ratios calculated as (total revenue - maintenance costs) / days in service with minimum 20 rental days
   - SHALL identify underperforming vehicles (bottom 10% utilization or negative profit) with specific improvement recommendations: pricing adjustment, category change, retirement consideration
   - SHALL track vehicle profitability after maintenance costs with monthly P&L per vehicle: Revenue - (Maintenance + Insurance + Depreciation) with ROI calculations
   - SHALL generate automatic alerts for vehicles with negative profitability for 2 consecutive months

5. **Staff Productivity Insights**
   - SHALL display rentals processed per staff member per day with targets: Full-time (minimum 8 rentals), Part-time (minimum 4 rentals) and rolling 30-day averages
   - SHALL show average processing time per rental by staff member with targets: New rental (<15 minutes), Return processing (<10 minutes), Modification (<8 minutes)
   - SHALL track customer satisfaction metrics by staff member using rating data (1-5 scale) with minimum 10 ratings required, target >4.2 average
   - SHALL monitor staff efficiency trends over 6-month periods with month-over-month improvement/decline indicators >15% flagged for review
   - SHALL calculate revenue generated per staff member as total revenue attributed to rentals they processed, with target CHF 8,000 per full-time staff member per month
   - SHALL provide staff performance ranking and identify training needs based on metrics below targets

6. **Comparative Analysis**
   - SHALL provide side-by-side comparison of current vs previous periods (day, week, month, quarter, year) with automatic period matching and percentage change calculations to 0.1% precision
   - SHALL display year-over-year growth metrics with specific targets: Revenue growth (>10%), Fleet utilization (+5%), Customer acquisition (+15%), Profit margin improvement (+2%)
   - SHALL perform seasonal trend analysis using 3-year historical data with seasonal index calculations and forecasting accuracy >85% for next quarter predictions
   - SHALL benchmark performance against business goals with visual progress indicators: Green (>100% of target), Yellow (90-100%), Red (<90%)
   - SHALL show progress toward monthly and yearly targets with projected completion dates based on current trends and required daily performance to meet targets
   - SHALL provide variance analysis reports explaining >10% deviations from expected performance with root cause categories

7. **Key Performance Indicators (KPIs)**
   - SHALL display revenue growth rate with specific targets: Daily (>0.5%), Monthly (>8%), Yearly (>10%) with color-coded performance indicators updated every 4 hours
   - SHALL show fleet utilization percentage with target >75% overall and breakdown by category with monthly trending
   - SHALL calculate average rental duration with targets: 2.5 days overall, Economy (2.2 days), Luxury (3.8 days) and seasonal adjustments
   - SHALL track customer acquisition rate with target >50 new customers per month and cost per acquisition <CHF 25
   - SHALL display repeat customer percentage with target >40% of monthly rentals from returning customers and customer lifetime value calculations
   - SHALL calculate profit margin with precision to 0.01% and targets: Gross margin >60%, Net margin >20%, EBITDA margin >25% with monthly trend analysis

8. **Interactive Filtering**
   - SHALL support filtering by date ranges with custom selection and predefined periods: Today, Yesterday, Last 7 days, Last 30 days, This Month, Last Month, This Quarter, This Year with maximum 3-second filter application
   - SHALL filter by vehicle categories (unlimited selection), staff members (up to 10 concurrent), locations (if multi-location) with filter persistence across page reloads
   - SHALL provide quick filter buttons for common periods loading results within 2 seconds and maintaining filter state in URL for bookmarking
   - SHALL support saving up to 20 custom filter presets per user with descriptive naming (50 character limit) and quick preset switching
   - SHALL export filtered data in Excel (.xlsx), CSV, and PDF formats with maximum 50,000 records per export and background processing for large datasets

9. **Visual Data Presentation**
   - SHALL use professional charts and graphs with modern visualization library (Chart.js or D3.js) rendering within 2 seconds for datasets up to 12 months
   - SHALL implement consistent color-coding: Green (exceeds target by >10%), Light Green (meets target 90-110%), Yellow (80-90% of target), Red (<80% of target)
   - SHALL provide interactive tooltips with detailed information appearing within 200ms hover delay, showing exact values, percentages, and contextual data
   - SHALL maintain responsive design across devices: Desktop (full features), Tablet (optimized layout), Mobile (essential metrics only) with touch-friendly interactions
   - SHALL support print-friendly layouts with automatic page breaks, black/white optimization, and company branding for professional business reports

10. **Real-Time Data Updates**
    - SHALL update dashboard every 5 minutes during business hours (6 AM - 10 PM) and every 30 minutes outside business hours with visible update progress indicator
    - SHALL show "last updated" timestamp with exact time (HH:MM:SS) and automatic refresh countdown timer
    - SHALL display real-time revenue counter during business hours (6 AM - 10 PM) updating every 2 minutes with running daily total and progress toward daily target
    - SHALL provide immediate updates (within 60 seconds) when significant events occur: rental completion >CHF 500, daily revenue milestone, system errors, payment failures
    - SHALL implement notification system for milestone achievements: Daily revenue target (toast notification), Weekly targets (email), Monthly targets (dashboard banner), with achievement celebration graphics

11. **Goal Tracking**
    - SHALL support setting monthly revenue targets (CHF 10,000 - 500,000) and yearly targets with automatic daily/weekly breakdown calculations
    - SHALL display visual progress bars with exact completion percentages, expected vs actual performance, and projected completion dates based on current trends
    - SHALL generate alerts when falling behind targets (>10% below pace) or exceeding expectations (>15% above target) with specific recommended actions
    - SHALL track historical goal achievement with success rates over 24-month periods and performance trend analysis
    - SHALL support adjustable targets based on seasonal variations with historical seasonal index application (summer +20%, winter -10%) and manual override capability
    - SHALL calculate required daily performance to meet remaining targets and provide feasibility assessment

12. **Data Export Capabilities**
    - SHALL export dashboard data to Excel (.xlsx with multiple sheets), CSV (UTF-8 encoded), and PDF (professional formatting) with maximum 100,000 records per export
    - SHALL generate automated monthly business reports by 5th of following month including: revenue summary, fleet performance, profitability analysis, KPI dashboard with email delivery confirmation
    - SHALL support custom report generation with user-selectable metrics (up to 20 metrics per report), date ranges, and formatting options with saved report templates
    - SHALL provide scheduled email delivery of reports (daily, weekly, monthly) to up to 10 recipients with PDF attachment and customizable subject lines
    - SHALL integrate with accounting software (SAP, QuickBooks, Xero) via API for automatic financial data synchronization and reconciliation reporting
    - SHALL maintain export audit log with user, timestamp, data range, and recipient information for compliance purposes

## Technical Implementation Notes

### Frontend Architecture
- React dashboard with modular chart components
- Chart.js or D3.js for advanced data visualization
- Redux for complex state management
- Material-UI or Ant Design for professional appearance
- Responsive grid system for mobile compatibility

### Backend Services
- Business analytics API with optimized queries
- Data aggregation service for complex calculations
- Caching layer (Redis) for performance with large datasets
- Background jobs for report generation and data processing
- Real-time data streaming for live updates

### Data Processing
- Daily batch jobs for historical data aggregation
- Real-time calculation engine for live metrics
- Data warehouse structure for efficient querying
- ETL processes for data consistency
- Backup and archival system for historical data

## API Endpoints Needed

### GET /api/v1/dashboard/owner/overview
**Purpose:** Retrieve comprehensive business overview  
**Response:**
```json
{
  "revenue": {
    "today": 2450.00,
    "this_week": 15300.00,
    "this_month": 48500.00,
    "this_year": 485000.00,
    "trends": {
      "daily_change": 8.5,
      "weekly_change": 12.3,
      "monthly_change": -2.1
    }
  },
  "fleet_utilization": {
    "overall": 78.5,
    "by_category": {
      "economy": 85.2,
      "compact": 75.8,
      "suv": 72.1
    },
    "trend": [65, 70, 75, 78.5]
  },
  "payment_methods": {
    "cash": 35.5,
    "card": 45.2,
    "bank_transfer": 15.3,
    "qr_bill": 4.0
  }
}
```

### GET /api/v1/dashboard/owner/vehicles/performance
**Purpose:** Vehicle performance rankings and metrics  
**Response:** Array of vehicle performance objects with revenue, utilization, and profitability data

### GET /api/v1/dashboard/owner/staff/productivity
**Purpose:** Staff productivity metrics and comparisons  
**Response:** Staff performance data with efficiency metrics

### POST /api/v1/dashboard/owner/export
**Purpose:** Generate and export custom reports  
**Payload:** Filter criteria, format preferences, delivery options

## Database Schema Requirements

### business_metrics Table
```sql
CREATE TABLE business_metrics (
  id SERIAL PRIMARY KEY,
  metric_date DATE NOT NULL,
  revenue_total DECIMAL(10,2),
  revenue_rentals DECIMAL(10,2),
  revenue_fees DECIMAL(10,2),
  fleet_utilization DECIMAL(5,2),
  rentals_count INTEGER,
  customers_new INTEGER,
  customers_returning INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### vehicle_performance_daily Table
```sql
CREATE TABLE vehicle_performance_daily (
  id SERIAL PRIMARY KEY,
  vehicle_id INTEGER REFERENCES vehicles(id),
  metric_date DATE NOT NULL,
  revenue_generated DECIMAL(8,2),
  hours_rented INTEGER,
  utilization_rate DECIMAL(5,2),
  maintenance_cost DECIMAL(6,2),
  profit_generated DECIMAL(8,2),
  UNIQUE(vehicle_id, metric_date)
);
```

### dashboard_goals Table
```sql
CREATE TABLE dashboard_goals (
  id SERIAL PRIMARY KEY,
  goal_type VARCHAR(50) NOT NULL,
  period VARCHAR(20) NOT NULL, -- 'monthly', 'yearly'
  target_value DECIMAL(12,2),
  target_date DATE,
  current_value DECIMAL(12,2) DEFAULT 0,
  owner_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## UI/UX Considerations

### Layout Design
- **Executive Summary:** Top section with key KPIs in large, clear numbers
- **Revenue Section:** Charts and trends prominently displayed
- **Fleet Overview:** Visual grid showing vehicle performance
- **Comparison Panel:** Side-by-side period comparisons
- **Goals Tracking:** Progress bars and achievement indicators

### Color Psychology
- **Revenue Growth:** Green gradients for positive trends
- **Warning Indicators:** Amber for items needing attention
- **Critical Alerts:** Red for urgent issues requiring action
- **Neutral Data:** Professional blues and grays for general information

### Chart Types
- **Line Charts:** Revenue trends over time
- **Bar Charts:** Comparative metrics (vehicles, staff, periods)
- **Pie Charts:** Payment method and revenue source breakdowns
- **Gauge Charts:** Utilization rates and goal progress
- **Heat Maps:** Performance across time periods

### Responsive Design
- **Desktop:** Full dashboard with all metrics visible
- **Tablet:** Stacked layout with scrollable sections
- **Mobile:** Card-based layout with swipeable metrics
- **Print:** Clean, professional layout optimized for reports

## Testing Scenarios

### Business Logic Testing
1. **Revenue Calculation Accuracy**
   - Verify revenue totals match manual calculations
   - Test period comparisons with known data sets
   - Confirm percentage changes are calculated correctly
   - Validate currency formatting and decimal precision

2. **Fleet Utilization Metrics**
   - Test utilization calculations with various rental scenarios
   - Verify category breakdowns sum to overall utilization
   - Test edge cases (no rentals, 100% utilization)
   - Confirm real-time updates reflect actual bookings

3. **Comparative Analysis**
   - Test year-over-year comparisons with historical data
   - Verify trend calculations with sample datasets
   - Test seasonal adjustment algorithms
   - Confirm goal tracking accuracy

4. **Data Export Functionality**
   - Test Excel export with complex data sets
   - Verify PDF generation maintains formatting
   - Test email delivery of automated reports
   - Confirm exported data matches dashboard display

5. **Performance with Large Datasets**
   - Test dashboard performance with 2+ years of data
   - Verify query optimization with 10,000+ rentals
   - Test caching effectiveness under load
   - Monitor memory usage with extended sessions

6. **Real-Time Updates**
   - Verify revenue updates when new rentals are created
   - Test utilization changes when vehicles are rented/returned
   - Confirm goal progress updates in real-time
   - Test notification system for milestone achievements

7. **Cross-Browser and Device Testing**
   - Test complex charts on different browsers
   - Verify mobile responsiveness with actual devices
   - Test touch interactions on tablets
   - Confirm print functionality across platforms

8. **Security and Access Control**
   - Verify owner-only access to sensitive business data
   - Test data isolation between different business owners
   - Confirm audit logging for data access
   - Test session security and timeout handling

## Definition of Done

### Functional Requirements
- [ ] All 12 acceptance criteria implemented and validated
- [ ] Revenue calculations verified against manual calculations
- [ ] Real-time updates functioning correctly
- [ ] All chart types rendering properly
- [ ] Export functionality working for all formats
- [ ] Goal tracking system operational

### Technical Requirements
- [ ] API endpoints optimized for performance
- [ ] Database schema supporting all metrics
- [ ] Caching implemented for large datasets
- [ ] Real-time update system stable
- [ ] Security measures implemented and tested
- [ ] Data backup and recovery procedures

### Performance Requirements
- [ ] Dashboard loads in under 3 seconds with 1 year of data
- [ ] Chart rendering completes in under 2 seconds
- [ ] Export generation completes in under 30 seconds
- [ ] Real-time updates don't impact user experience
- [ ] Mobile performance acceptable on 3G connections

### Quality Assurance
- [ ] All 8 testing scenarios passed
- [ ] Business logic verified with real data
- [ ] Cross-browser compatibility confirmed
- [ ] Mobile responsiveness tested on multiple devices
- [ ] Security audit completed
- [ ] Performance benchmarks met

### User Experience
- [ ] Owner user acceptance testing completed
- [ ] Dashboard intuitive without training
- [ ] Professional appearance suitable for executive presentation
- [ ] Print-friendly layouts validated
- [ ] Error handling provides clear guidance

### Documentation
- [ ] Business user guide created
- [ ] API documentation comprehensive
- [ ] Deployment procedures documented
- [ ] Monitoring and alerting configured
- [ ] Backup and recovery procedures tested

## Estimated Effort

**Story Points:** 13

**Breakdown:**
- Frontend dashboard development: 5 points
- Complex analytics and calculations: 4 points
- Data visualization implementation: 2 points
- API development and optimization: 2 points

**Dependencies:**
- Revenue data from financial system (Epic 3)
- Fleet data from vehicle management (Epic 2)
- Contract data from rental system (Epic 1)
- Staff data from user management (Epic 6)

**Risks:**
- Complex calculations may require database optimization
- Large dataset performance may need advanced caching strategies
- Real-time updates with heavy analytics may impact system performance
- Business logic complexity could extend development and testing time

**Success Metrics:**
- Owner engagement >3 sessions per week
- Dashboard insights lead to measurable business decisions
- 95% accuracy in financial calculations
- Sub-3-second load times maintained with full dataset
- 10-15% revenue improvement demonstrated through system insights