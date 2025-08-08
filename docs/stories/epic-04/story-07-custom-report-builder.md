# Story 7: Custom Report Builder

**Story ID:** CRMS-E4-S07  
**Epic:** Dashboard & Reporting  
**Priority:** Low  
**Complexity:** High

## User Story Statement

**As an** owner  
**I want to** create custom reports with flexible data selection and filtering options  
**So that** I can analyze specific business metrics tailored to my unique operational needs and
decision-making requirements

## Detailed Acceptance Criteria

1. **Flexible Date Range Selection**
   - Provide calendar widget for custom start and end date selection
   - Include predefined date range shortcuts (last 7 days, last month, last quarter, year-to-date)
   - Support fiscal year configuration with custom year-start dates
   - Allow comparison periods (same period last year, previous period)
   - Validate date ranges and prevent invalid selections

2. **Comprehensive Metric Selection**
   - Checkbox interface for selecting revenue metrics (total, by vehicle, by customer segment)
   - Fleet utilization metrics (overall, by category, by individual vehicle)
   - Operational efficiency metrics (processing times, staff productivity, customer satisfaction)
   - Financial metrics (profit margins, cost breakdowns, payment method analysis)
   - Customer metrics (acquisition, retention, lifetime value, demographics)

3. **Advanced Filtering Capabilities**
   - Filter by vehicle categories, specific vehicles, or vehicle attributes
   - Customer segment filtering (business, leisure, repeat, new customers)
   - Geographic filtering by customer location or rental pickup location
   - Staff member filtering for performance analysis
   - Contract type filtering (hourly, daily, weekly, monthly rates)

4. **Dynamic Query Builder Interface**
   - Drag-and-drop interface for building complex data queries
   - Visual query builder with AND/OR logic operators
   - Condition builder for numeric ranges, text matching, and date comparisons
   - Preview functionality showing data sample based on current filters
   - Query validation with error messages for invalid combinations

5. **Report Template Management**
   - Save custom report configurations as reusable templates
   - Name and describe templates for easy identification
   - Share templates between users within the organization
   - Version control for template modifications with change history
   - Export and import template configurations

6. **Automated Scheduling System**
   - Schedule recurring reports (daily, weekly, monthly, quarterly)
   - Flexible scheduling with custom cron expressions for advanced users
   - Email delivery configuration with multiple recipient support
   - Report failure notifications and retry mechanisms
   - Schedule modification and cancellation capabilities

7. **Multi-Format Export Options**
   - Export to Excel (.xlsx) with formatted tables and charts
   - CSV export for data analysis in external tools
   - PDF export with professional formatting and branding
   - JSON export for API integration and data sharing
   - Direct integration with Google Sheets and Microsoft Excel Online

8. **Interactive Visualization Options**
   - Choose from various chart types (line, bar, pie, scatter, heat maps)
   - Interactive charts with drill-down capabilities
   - Dashboard-style layout with multiple visualization panels
   - Custom color schemes and branding options
   - Responsive design for mobile viewing

9. **Data Grouping and Aggregation**
   - Group data by time periods (daily, weekly, monthly, quarterly)
   - Aggregate by categories (vehicle class, customer type, location)
   - Statistical functions (sum, average, count, min, max, median)
   - Calculated fields with custom formulas
   - Percentage calculations and trend analysis

10. **Report Sharing and Collaboration**
    - Generate shareable links for report viewing
    - Permission-based access control for sensitive data
    - Comment system for collaborative analysis
    - Report annotation capabilities
    - Integration with collaboration tools (Slack, Teams, email)

11. **Performance Optimization**
    - Efficient query execution for large datasets
    - Report generation progress indicators
    - Caching of frequently accessed reports
    - Pagination for large result sets
    - Query optimization suggestions for better performance

12. **Data Validation and Accuracy**
    - Data source verification and timestamp tracking
    - Calculation accuracy validation against known totals
    - Missing data identification and handling options
    - Data refresh status indicators
    - Audit trail for report generation and modifications

## Technical Implementation Notes

### Report Builder Architecture

- React-based drag-and-drop interface using libraries like React-DnD
- Query builder component with visual query construction
- Chart rendering using advanced libraries (D3.js, Chart.js, or Recharts)
- Template storage system with versioning capabilities
- Background job processing for large report generation

### Data Processing Engine

- SQL query generation from visual query builder selections
- Dynamic query optimization based on selected metrics and filters
- Caching layer for frequently accessed data combinations
- Data aggregation engine with statistical function support
- Real-time data validation and accuracy checking

### Export and Scheduling Systems

- Multi-format export pipeline with format-specific optimization
- Scheduled job system with robust error handling and retry logic
- Email delivery system with professional template formatting
- File storage system for generated reports and templates
- Integration APIs for external system connectivity

## API Endpoints Needed

### POST /api/v1/reports/custom/build

**Purpose:** Generate custom report based on user specifications  
**Payload:**

```json
{
  "report_name": "Q1 Fleet Performance Analysis",
  "date_range": {
    "start": "2024-01-01",
    "end": "2024-03-31"
  },
  "metrics": ["total_revenue", "fleet_utilization", "vehicle_performance", "customer_satisfaction"],
  "filters": {
    "vehicle_categories": ["economy", "compact"],
    "customer_segments": ["business", "leisure"],
    "staff_members": [1, 3, 5]
  },
  "grouping": {
    "time_period": "monthly",
    "categories": ["vehicle_class"]
  },
  "format": "pdf",
  "visualization": {
    "chart_types": ["line", "bar"],
    "layout": "dashboard"
  }
}
```

### GET /api/v1/reports/custom/templates

**Purpose:** Retrieve saved report templates  
**Response:**

```json
{
  "templates": [
    {
      "id": "template_123",
      "name": "Monthly Revenue Analysis",
      "description": "Comprehensive monthly revenue breakdown",
      "created_by": "owner@company.com",
      "created_at": "2024-01-15T10:00:00Z",
      "last_used": "2024-01-20T14:30:00Z",
      "configuration": {...}
    }
  ]
}
```

### POST /api/v1/reports/custom/templates

**Purpose:** Save report configuration as template  
**Payload:** Report configuration with template metadata

### POST /api/v1/reports/custom/schedule

**Purpose:** Schedule recurring custom report generation  
**Payload:**

```json
{
  "template_id": "template_123",
  "schedule": {
    "frequency": "monthly",
    "day_of_month": 1,
    "time": "09:00",
    "timezone": "UTC"
  },
  "delivery": {
    "method": "email",
    "recipients": ["owner@company.com", "manager@company.com"],
    "format": "pdf"
  }
}
```

### GET /api/v1/reports/custom/preview

**Purpose:** Preview data based on current filter selections  
**Parameters:** Query parameters matching report builder selections  
**Response:** Sample data set with row count and column information

### GET /api/v1/reports/custom/export/{report_id}

**Purpose:** Download generated custom report  
**Parameters:** format (pdf, excel, csv, json)  
**Response:** File download with appropriate MIME type

## Database Schema Requirements

### custom_report_templates Table

```sql
CREATE TABLE custom_report_templates (
  id SERIAL PRIMARY KEY,
  template_name VARCHAR(200) NOT NULL,
  description TEXT,
  configuration JSONB NOT NULL,
  created_by INTEGER REFERENCES users(id),
  shared_with JSONB DEFAULT '[]',
  is_public BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### custom_report_schedules Table

```sql
CREATE TABLE custom_report_schedules (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES custom_report_templates(id),
  schedule_name VARCHAR(100),
  cron_expression VARCHAR(50),
  delivery_config JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_executed TIMESTAMP,
  next_execution TIMESTAMP,
  execution_count INTEGER DEFAULT 0,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### custom_report_executions Table

```sql
CREATE TABLE custom_report_executions (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES custom_report_templates(id),
  schedule_id INTEGER REFERENCES custom_report_schedules(id),
  execution_date TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  file_path VARCHAR(255),
  file_size INTEGER,
  execution_time_ms INTEGER,
  error_message TEXT,
  executed_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### report_sharing Table

```sql
CREATE TABLE report_sharing (
  id SERIAL PRIMARY KEY,
  report_execution_id INTEGER REFERENCES custom_report_executions(id),
  shared_by INTEGER REFERENCES users(id),
  access_token VARCHAR(255) UNIQUE,
  expires_at TIMESTAMP,
  view_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## UI/UX Considerations

### Report Builder Interface

- **Left Panel:** Drag-and-drop metrics and dimensions library
- **Center Canvas:** Visual query builder with connected components
- **Right Panel:** Filter configuration and preview controls
- **Bottom Section:** Chart type selection and visualization options
- **Header:** Save, schedule, and export controls

### User Experience Design

- **Progressive Disclosure:** Start simple, reveal advanced options as needed
- **Visual Feedback:** Real-time preview updates as selections change
- **Guided Experience:** Tooltips and help text for complex features
- **Responsive Design:** Full functionality on desktop, optimized mobile view
- **Keyboard Shortcuts:** Power user features for efficient report building

### Template Management

- **Template Gallery:** Visual library of saved templates with previews
- **Search and Filter:** Find templates by name, creator, or usage frequency
- **Template Sharing:** Easy sharing interface with permission controls
- **Version History:** Track template changes with rollback capabilities
- **Usage Analytics:** Show template popularity and effectiveness

## Testing Scenarios

### Report Builder Functionality

1. **Query Builder Testing**
   - Test drag-and-drop interface responsiveness and accuracy
   - Verify complex query construction with multiple filters and conditions
   - Test query validation and error handling for invalid combinations
   - Confirm data preview accuracy matches final report results

2. **Template Management Testing**
   - Test template saving, loading, and modification functionality
   - Verify template sharing permissions and access control
   - Test template versioning and change history tracking
   - Confirm template import/export functionality

3. **Export and Format Testing**
   - Test multi-format export accuracy and formatting quality
   - Verify large dataset export performance and reliability
   - Test email delivery functionality with various file sizes
   - Confirm integration with external tools (Excel, Google Sheets)

4. **Scheduling System Testing**
   - Test recurring report generation accuracy and timing
   - Verify error handling and retry mechanisms for failed reports
   - Test schedule modification and cancellation functionality
   - Confirm email delivery reliability for scheduled reports

5. **Performance Testing**
   - Test report generation performance with large datasets (>100K records)
   - Verify UI responsiveness during complex query construction
   - Test concurrent report generation by multiple users
   - Monitor memory usage and resource optimization

6. **Data Accuracy Testing**
   - Verify custom report calculations match manual calculations
   - Test data consistency across different export formats
   - Confirm filter accuracy and edge case handling
   - Validate aggregation and grouping calculations

7. **User Experience Testing**
   - Test interface intuitiveness with users of varying technical skill
   - Verify mobile responsiveness and touch interaction
   - Test accessibility features for impaired users
   - Confirm error messages are clear and actionable

8. **Integration Testing**
   - Test integration with core business data sources
   - Verify real-time data synchronization accuracy
   - Test external system integration (Google Sheets, Excel Online)
   - Confirm security measures for sensitive data export

## Definition of Done

### Functional Requirements

- [ ] All 12 acceptance criteria implemented and tested
- [ ] Visual query builder fully functional with drag-and-drop interface
- [ ] Template management system operational
- [ ] Multi-format export working reliably
- [ ] Scheduling system functional with email delivery
- [ ] Report sharing and collaboration features working

### Technical Requirements

- [ ] Report builder architecture scalable and performant
- [ ] Database schema supporting all custom report functionality
- [ ] API endpoints documented and performance tested
- [ ] Export pipeline optimized for multiple formats
- [ ] Scheduling system reliable with error handling
- [ ] Security measures for data access and sharing

### Performance Requirements

- [ ] Report generation completes within 30 seconds for typical datasets
- [ ] UI remains responsive during complex query building
- [ ] Export functionality handles datasets up to 100K records
- [ ] Concurrent user support without performance degradation
- [ ] Mobile interface provides acceptable user experience

### Quality Assurance

- [ ] All 8 testing scenarios passed comprehensively
- [ ] Report accuracy verified against known data sets
- [ ] Cross-browser compatibility confirmed
- [ ] Security audit completed for data access controls
- [ ] Performance benchmarks met for all key operations
- [ ] User experience validated with target user groups

### Business Requirements

- [ ] Owner user acceptance testing completed successfully
- [ ] Custom report capabilities meet diverse business analysis needs
- [ ] Template sharing enables organizational knowledge sharing
- [ ] Export integration supports existing business processes
- [ ] Advanced users can create complex analytical reports independently

### Documentation and Training

- [ ] Comprehensive user guide for custom report builder
- [ ] Video tutorials for common report building scenarios
- [ ] Technical documentation for API integration
- [ ] Template library with pre-built business intelligence reports
- [ ] Best practices guide for effective report design

## Estimated Effort

**Story Points:** 13

**Breakdown:**

- Visual query builder and interface development: 5 points
- Template management and versioning system: 3 points
- Multi-format export and scheduling system: 3 points
- Advanced features and testing: 2 points

**Dependencies:**

- Complete data warehouse with all business metrics
- User management system for sharing and permissions (Epic 6)
- All operational data sources (Epics 1, 2, 3)
- Email infrastructure for report delivery
- File storage system for generated reports

**Risks:**

- Complex UI requirements may need iterative development and user feedback
- Performance optimization for large datasets could require advanced database tuning
- Multi-format export reliability depends on various third-party libraries
- Advanced query builder complexity may extend development timeline significantly

**Success Metrics:**

- Custom reports created and used regularly by business stakeholders
- Template library grows organically through user contributions
- Advanced analytics insights lead to measurable business improvements
- Report generation time meets user expectations for interactive analysis
- Owner satisfaction with self-service analytics capabilities
- Reduced dependency on external reporting tools or manual analysis
