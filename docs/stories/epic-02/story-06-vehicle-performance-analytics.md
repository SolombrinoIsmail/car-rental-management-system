# Story 6: Vehicle Performance Analytics

**Story ID:** EPIC-02-STORY-06  
**Epic:** Fleet Management System  
**Priority:** Medium  
**Story Points:** 5

## User Story Statement

**As an** owner  
**I want to** analyze individual vehicle and fleet performance through comprehensive analytics and reporting  
**So that** I can make data-driven decisions about fleet composition, pricing optimization, and vehicle lifecycle management to maximize profitability

## Detailed Acceptance Criteria

1. **Vehicle Utilization Analytics**
   - System shall calculate and display utilization rate per vehicle (rental days / available days)
   - System shall track average rental duration and frequency by vehicle
   - System shall identify peak usage periods and seasonal patterns
   - System shall compare utilization rates across vehicle categories and individual vehicles

2. **Revenue Performance Tracking**
   - System shall calculate total revenue per vehicle including all fees and charges
   - System shall track revenue per mile/kilometer and revenue per day
   - System shall analyze pricing effectiveness and rate optimization opportunities
   - System shall compare actual vs projected revenue performance

3. **Maintenance Cost Analysis**
   - System shall track total maintenance costs per vehicle over different time periods
   - System shall calculate maintenance cost per mile/kilometer driven
   - System shall identify high-maintenance vehicles and recurring issues
   - System shall analyze maintenance cost trends and budget planning

4. **Fleet Performance Comparison**
   - System shall rank vehicles by profitability (revenue minus all costs)
   - System shall identify underperforming vehicles with low utilization or high costs
   - System shall compare similar vehicles to identify best and worst performers
   - System shall provide recommendations for fleet optimization

5. **Customer Preference Analytics**
   - System shall track which vehicles are most frequently requested or rented
   - System shall analyze customer satisfaction scores by vehicle
   - System shall identify vehicle features that drive higher demand
   - System shall track repeat rental rates by specific vehicles

6. **Fuel Consumption and Efficiency**
   - System shall track fuel consumption data where available
   - System shall calculate miles per gallon or fuel efficiency metrics
   - System shall monitor fuel costs as percentage of vehicle operating costs
   - System shall identify fuel-efficient vehicles for cost optimization

7. **Geographic Performance Analysis**
   - System shall analyze vehicle performance by location or region
   - System shall track inter-location transfer patterns and costs
   - System shall identify location-specific demand patterns
   - System shall optimize vehicle distribution across locations

8. **Lifecycle and Depreciation Analysis**
   - System shall track vehicle age, mileage, and depreciation estimates
   - System shall analyze optimal replacement timing based on performance data
   - System shall calculate total cost of ownership including purchase and operating costs
   - System shall project future maintenance needs based on historical patterns

9. **Predictive Analytics**
   - System shall forecast future demand based on historical patterns
   - System shall predict maintenance needs based on usage patterns
   - System shall identify vehicles likely to become unprofitable
   - System shall recommend optimal fleet size and composition

10. **Interactive Reporting Dashboard**
    - System shall provide customizable dashboard with key performance indicators
    - System shall allow filtering by date ranges, vehicle categories, and locations
    - System shall support drilling down from fleet-level to individual vehicle metrics
    - System shall enable export of reports in multiple formats (PDF, Excel, CSV)

11. **Benchmark and Goal Tracking**
    - System shall allow setting performance targets for utilization and revenue
    - System shall track progress against goals with visual indicators
    - System shall provide alerts when vehicles fall below performance thresholds
    - System shall compare current performance to historical baselines

12. **ROI and Financial Analytics**
    - System shall calculate return on investment for each vehicle
    - System shall track payback periods for vehicle purchases
    - System shall analyze profit margins by vehicle and category
    - System shall provide cash flow analysis based on vehicle performance

## Technical Implementation Notes

### Database Schema Requirements
```sql
-- Vehicle performance metrics (aggregated data)
CREATE TABLE vehicle_performance_metrics (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT REFERENCES vehicles(id),
    period_start DATE,
    period_end DATE,
    period_type VARCHAR(20), -- daily, weekly, monthly, yearly
    
    -- Utilization metrics
    total_days_available INTEGER,
    total_days_rented INTEGER,
    utilization_rate DECIMAL(5,2), -- percentage
    average_rental_duration DECIMAL(5,2), -- days
    total_rentals INTEGER,
    
    -- Financial metrics
    total_revenue DECIMAL(12,2),
    revenue_per_day DECIMAL(8,2),
    revenue_per_km DECIMAL(6,3),
    total_maintenance_cost DECIMAL(10,2),
    total_operational_cost DECIMAL(12,2),
    net_profit DECIMAL(12,2),
    roi_percentage DECIMAL(5,2),
    
    -- Usage metrics
    total_kilometers_driven INTEGER,
    fuel_consumed DECIMAL(8,2),
    fuel_cost DECIMAL(8,2),
    average_trip_distance DECIMAL(6,2),
    
    calculated_at TIMESTAMP DEFAULT NOW()
);

-- Daily vehicle snapshots for trend analysis
CREATE TABLE daily_vehicle_snapshots (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT REFERENCES vehicles(id),
    snapshot_date DATE,
    status VARCHAR(20),
    current_mileage INTEGER,
    location_id BIGINT REFERENCES locations(id),
    is_available BOOLEAN,
    daily_revenue DECIMAL(8,2) DEFAULT 0,
    maintenance_cost DECIMAL(8,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Performance benchmarks and targets
CREATE TABLE performance_targets (
    id BIGSERIAL PRIMARY KEY,
    target_type VARCHAR(50), -- utilization, revenue_per_day, roi, etc.
    vehicle_category VARCHAR(30),
    location_id BIGINT REFERENCES locations(id),
    target_value DECIMAL(10,2),
    measurement_period VARCHAR(20), -- monthly, quarterly, yearly
    effective_from DATE,
    effective_to DATE,
    created_by BIGINT REFERENCES users(id)
);

-- Customer satisfaction scores by vehicle
CREATE TABLE vehicle_satisfaction_scores (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT REFERENCES vehicles(id),
    contract_id BIGINT REFERENCES contracts(id),
    cleanliness_rating INTEGER, -- 1-5
    condition_rating INTEGER, -- 1-5
    performance_rating INTEGER, -- 1-5
    overall_rating INTEGER, -- 1-5
    comments TEXT,
    recorded_at TIMESTAMP DEFAULT NOW()
);

-- Predictive analytics results
CREATE TABLE vehicle_predictions (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT REFERENCES vehicles(id),
    prediction_type VARCHAR(50), -- maintenance_due, demand_forecast, replacement_needed
    prediction_value DECIMAL(10,2),
    confidence_score DECIMAL(3,2), -- 0.00 to 1.00
    prediction_date DATE,
    factors_considered JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints Needed
- `GET /api/analytics/vehicles/{id}/performance` - Individual vehicle performance
- `GET /api/analytics/fleet/utilization` - Fleet-wide utilization metrics
- `GET /api/analytics/revenue/comparison` - Revenue comparison across vehicles
- `GET /api/analytics/maintenance/costs` - Maintenance cost analysis
- `GET /api/analytics/rankings/profitability` - Vehicle profitability rankings
- `GET /api/analytics/trends/demand` - Demand trend analysis
- `GET /api/analytics/predictions/maintenance` - Predictive maintenance alerts
- `GET /api/analytics/benchmarks/performance` - Performance vs targets
- `POST /api/analytics/targets` - Set performance targets
- `GET /api/analytics/reports/export` - Export analytics reports
- `GET /api/analytics/dashboard/widgets` - Dashboard widget data

### Analytics Calculation Engine
```sql
-- Example utilization calculation
CREATE OR REPLACE FUNCTION calculate_vehicle_utilization(
    p_vehicle_id BIGINT,
    p_start_date DATE,
    p_end_date DATE
) RETURNS DECIMAL(5,2) AS $$
DECLARE
    total_days INTEGER;
    rented_days INTEGER;
    utilization DECIMAL(5,2);
BEGIN
    total_days := p_end_date - p_start_date + 1;
    
    SELECT COALESCE(SUM(
        CASE 
            WHEN c.end_date <= p_end_date THEN c.end_date - c.start_date + 1
            ELSE p_end_date - c.start_date + 1
        END
    ), 0) INTO rented_days
    FROM contracts c
    WHERE c.vehicle_id = p_vehicle_id
      AND c.start_date <= p_end_date
      AND c.end_date >= p_start_date
      AND c.status IN ('completed', 'active');
    
    utilization := (rented_days::DECIMAL / total_days::DECIMAL) * 100;
    
    RETURN ROUND(utilization, 2);
END;
$$ LANGUAGE plpgsql;
```

### UI/UX Considerations

1. **Analytics Dashboard Design**
   - Interactive charts and graphs using D3.js or Chart.js
   - KPI cards with trend indicators
   - Drill-down capability from fleet to individual vehicles
   - Real-time data updates with refresh indicators

2. **Performance Comparison Views**
   - Side-by-side vehicle comparison tables
   - Ranking lists with performance scores
   - Heat maps for quick performance visualization
   - Scatter plots for correlation analysis

3. **Report Export Interface**
   - Customizable report builder
   - Template selection for common reports
   - Scheduled report delivery options
   - Interactive print preview

4. **Mobile Analytics Interface**
   - Touch-optimized charts and tables
   - Key metrics summary for quick review
   - Offline report caching
   - Push notifications for performance alerts

## Testing Scenarios

1. **Utilization Calculation Accuracy**
   - Create test rentals with various durations and overlaps
   - Verify utilization calculations match expected results
   - Test edge cases (partial days, month boundaries)
   - Validate utilization rates across different time periods

2. **Revenue Analysis Testing**
   - Input various rental scenarios with different pricing
   - Test revenue calculations including fees and discounts
   - Verify revenue per day and per kilometer calculations
   - Test profit margin calculations with maintenance costs

3. **Performance Comparison Validation**
   - Create fleet with varying performance characteristics
   - Verify ranking algorithms work correctly
   - Test filtering and sorting of performance data
   - Validate benchmark comparison calculations

4. **Predictive Analytics Testing**
   - Input historical data and verify prediction accuracy
   - Test maintenance prediction algorithms
   - Validate demand forecasting with seasonal data
   - Test confidence score calculations

5. **Dashboard Functionality**
   - Test all dashboard widgets load correctly
   - Verify drill-down navigation works
   - Test data refresh and real-time updates
   - Validate export functionality for all formats

6. **Large Dataset Performance**
   - Test analytics calculations with 500+ vehicles
   - Verify query performance with 2+ years of data
   - Test report generation time with complex queries
   - Validate memory usage during large calculations

7. **Cross-System Integration**
   - Verify contract data integration accuracy
   - Test maintenance cost data synchronization
   - Validate customer feedback integration
   - Test fuel consumption data integration

8. **Mobile Analytics Testing**
   - Test dashboard responsiveness on mobile devices
   - Verify touch interactions with charts
   - Test offline report caching
   - Validate push notification delivery

## Definition of Done

- [ ] Vehicle utilization analytics implemented and accurate
- [ ] Revenue performance tracking system operational
- [ ] Maintenance cost analysis functionality complete
- [ ] Fleet performance comparison tools working
- [ ] Predictive analytics engine implemented
- [ ] Interactive dashboard with all widgets functional
- [ ] Report export system supporting multiple formats
- [ ] Performance benchmarking and target tracking operational
- [ ] Mobile analytics interface deployed
- [ ] API endpoints documented and tested
- [ ] Analytics calculation accuracy verified through testing
- [ ] Performance optimized for large datasets
- [ ] User acceptance testing completed
- [ ] Training materials created for analytics features

## Dependencies

- Vehicle registry and maintenance systems (Stories 1, 4)
- Contract and financial data from other epics
- Reporting infrastructure and visualization libraries
- Data warehouse or analytics database setup
- Export service for report generation

## Risks and Mitigation

**Risk:** Complex analytics calculations causing performance issues  
**Mitigation:** Implement background job processing and result caching  
**Contingency:** Pre-calculated summary tables updated nightly

**Risk:** Inaccurate analytics due to incomplete or inconsistent data  
**Mitigation:** Implement data validation and quality checks  
**Contingency:** Data reconciliation tools and manual correction procedures

**Risk:** Dashboard complexity overwhelming users  
**Mitigation:** Provide multiple dashboard views for different user roles  
**Contingency:** Simplified reporting interface with essential metrics only

## Estimated Effort: 5 Story Points

**Breakdown:**
- Analytics calculation engine development: 2 days
- Dashboard UI development with charts: 2 days
- Report export system implementation: 1 day
- Predictive analytics algorithms: 1.5 days
- Performance optimization and caching: 1 day
- Testing and data validation: 1.5 days

**Total:** 9 developer days