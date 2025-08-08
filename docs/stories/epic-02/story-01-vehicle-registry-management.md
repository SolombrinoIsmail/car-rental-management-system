# Story 1: Vehicle Registry & Management

**Story ID:** EPIC-02-STORY-01  
**Epic:** Fleet Management System  
**Priority:** High  
**Story Points:** 5

## User Story Statement

**As an** owner/admin  
**I want to** manage my complete vehicle fleet with comprehensive vehicle information,
documentation, and pricing  
**So that** all vehicles are properly tracked, documented, and configured for rental operations

## Detailed Acceptance Criteria

1. **Vehicle Registration**
   - System shall allow adding new vehicles with complete specification details (make, model, year,
     VIN, license plate, color, transmission, fuel type)
   - System shall validate VIN format and check for duplicates
   - System shall require mandatory fields (VIN, license plate, make, model, year)

2. **Document Management**
   - System shall allow uploading multiple document types (registration, insurance, inspection
     certificates)
   - System shall support common file formats (PDF, JPG, PNG) with max 5MB per file
   - System shall track document expiry dates and send notifications 30 days before expiration

3. **Rate Configuration**
   - System shall allow setting multiple rate types (hourly, daily, weekly, monthly)
   - System shall support seasonal pricing with date range configurations
   - System shall validate rate consistency (hourly \* 24 ≤ daily rate)

4. **Vehicle Categories**
   - System shall allow categorizing vehicles (Economy, Compact, Mid-size, SUV, Luxury)
   - System shall support custom vehicle features/attributes (GPS, Bluetooth, A/C, etc.)
   - System shall allow bulk operations for category changes

5. **Visual Documentation**
   - System shall support uploading multiple vehicle photos (exterior, interior, dashboard)
   - System shall resize images automatically for web display
   - System shall maintain original images for documentation purposes

6. **Vehicle Status Management**
   - System shall track vehicle operational status (Active, Maintenance, Retired)
   - System shall prevent rental assignment to non-active vehicles
   - System shall maintain status change history with timestamps

7. **Search and Filter**
   - System shall provide vehicle search by license plate, VIN, make, or model
   - System shall support filtering by category, status, or availability
   - System shall display vehicle list with key information in table format

8. **Data Validation**
   - System shall validate license plate format based on regional standards
   - System shall ensure insurance expiry date is future-dated
   - System shall require at least one rate configuration before activation

9. **Audit Trail**
   - System shall log all vehicle modifications with user and timestamp
   - System shall track document uploads and replacements
   - System shall maintain complete vehicle history for compliance

10. **Notification System**
    - System shall alert when vehicle documents are near expiry (30, 15, 7 days)
    - System shall notify when vehicle requires maintenance based on mileage/time
    - System shall send summary reports of fleet status weekly

## Technical Implementation Notes

### Database Schema Requirements

```sql
-- Vehicles table
CREATE TABLE vehicles (
    id BIGSERIAL PRIMARY KEY,
    vin VARCHAR(17) UNIQUE NOT NULL,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    color VARCHAR(30),
    transmission VARCHAR(20),
    fuel_type VARCHAR(20),
    category VARCHAR(30),
    status VARCHAR(20) DEFAULT 'active',
    current_mileage INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Vehicle documents table
CREATE TABLE vehicle_documents (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT REFERENCES vehicles(id),
    document_type VARCHAR(50),
    file_path VARCHAR(500),
    expiry_date DATE,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Vehicle rates table
CREATE TABLE vehicle_rates (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT REFERENCES vehicles(id),
    rate_type VARCHAR(20), -- hourly, daily, weekly, monthly
    base_rate DECIMAL(10,2),
    seasonal_multiplier DECIMAL(3,2) DEFAULT 1.0,
    effective_from DATE,
    effective_to DATE
);

-- Vehicle features table
CREATE TABLE vehicle_features (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT REFERENCES vehicles(id),
    feature_name VARCHAR(50),
    feature_value VARCHAR(100)
);
```

### API Endpoints Needed

- `POST /api/vehicles` - Create new vehicle
- `GET /api/vehicles` - List vehicles with filtering
- `GET /api/vehicles/{id}` - Get vehicle details
- `PUT /api/vehicles/{id}` - Update vehicle information
- `DELETE /api/vehicles/{id}` - Soft delete vehicle
- `POST /api/vehicles/{id}/documents` - Upload vehicle documents
- `GET /api/vehicles/{id}/documents` - Get vehicle documents
- `PUT /api/vehicles/{id}/rates` - Update vehicle rates
- `GET /api/vehicles/{id}/history` - Get vehicle audit trail

### UI/UX Considerations

1. **Vehicle Form Design**
   - Multi-step wizard for new vehicle registration
   - Real-time validation feedback
   - Auto-complete for make/model from standard database
   - Drag-and-drop file uploads with preview

2. **Vehicle List View**
   - Sortable table with key vehicle information
   - Quick status toggle buttons
   - Bulk action capabilities
   - Export functionality for fleet reports

3. **Document Management**
   - Visual expiry status indicators (green/yellow/red)
   - Document preview modal
   - Automated renewal reminders

4. **Mobile Responsiveness**
   - Touch-friendly interface for tablet use
   - Simplified mobile view for quick vehicle lookup
   - Offline capability for basic vehicle information

## Testing Scenarios

1. **Vehicle Creation Happy Path**
   - Create vehicle with all required fields
   - Upload registration documents
   - Configure base rates
   - Verify vehicle appears in active fleet

2. **Validation Testing**
   - Attempt to create vehicle with duplicate VIN
   - Try invalid license plate format
   - Upload oversized document file
   - Set invalid rate combinations

3. **Document Expiry Workflow**
   - Upload document with near-expiry date
   - Verify notification is triggered
   - Update document and confirm notification stops
   - Test bulk document status report

4. **Rate Configuration Testing**
   - Set up seasonal pricing with date ranges
   - Test rate calculation for different periods
   - Verify rate validation rules
   - Test bulk rate updates

5. **Search and Filter Testing**
   - Search by partial license plate
   - Filter by vehicle category and status
   - Test pagination with large fleet
   - Verify search performance under load

6. **File Upload Testing**
   - Upload multiple file types and sizes
   - Test concurrent document uploads
   - Verify file storage and retrieval
   - Test file deletion and cleanup

7. **Integration Testing**
   - Verify vehicle availability integration
   - Test contract system vehicle assignment
   - Validate maintenance system integration
   - Check reporting system data flow

8. **Performance Testing**
   - Load test with 1000+ vehicles
   - Test search response times
   - Verify file upload performance
   - Test concurrent user operations

## Definition of Done

- [ ] All vehicle CRUD operations implemented and tested
- [ ] Document upload/management system functional
- [ ] Rate configuration system working with validation
- [ ] Vehicle search and filtering performing well
- [ ] Mobile responsive design verified
- [ ] API documentation complete
- [ ] Unit tests achieving 90%+ coverage
- [ ] Integration tests passing
- [ ] User acceptance testing completed
- [ ] Security testing passed
- [ ] Performance benchmarks met
- [ ] Data migration scripts tested
- [ ] Admin training materials created

## Dependencies

- File storage system setup (AWS S3 or local storage)
- Authentication/authorization system
- Notification service configuration
- Database migration system

## Risks and Mitigation

**Risk:** Large file uploads impacting system performance  
**Mitigation:** Implement file size limits and asynchronous processing  
**Contingency:** Background job processing for large files

**Risk:** VIN validation complexity across regions  
**Mitigation:** Use external VIN validation service  
**Contingency:** Manual verification process for edge cases

## Estimated Effort: 5 Story Points

**Breakdown:**

- Database schema design: 0.5 days
- Backend API development: 2 days
- Frontend vehicle management UI: 1.5 days
- Document management system: 1 day
- Testing and validation: 1 day
- Integration and deployment: 0.5 days

**Total:** 6.5 developer days
