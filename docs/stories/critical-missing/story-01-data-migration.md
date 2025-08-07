# User Story: Data Migration from Legacy System

## Story Information
- **Story ID:** CRITICAL-01
- **Epic:** Epic 6 - System Administration & Security (Addition)
- **Priority:** P0 - Critical (Day 0 Requirement)
- **Story Points:** 13

## User Story Statement
**As a** system administrator  
**I want to** migrate all data from our existing paper/Excel-based system  
**So that** we can start operations with complete historical data and customer information

## Acceptance Criteria

1. **Customer Data Migration**
   - Import all existing customer records (estimated 500-2000 records)
   - Map fields correctly (name, ID, license, contact, history)
   - Validate Swiss ID formats and phone numbers
   - Handle duplicates intelligently with merge options
   - Generate migration report with success/failure counts

2. **Vehicle Data Import**
   - Import complete vehicle fleet (estimated 20-50 vehicles)
   - Include registration, insurance, maintenance history
   - Set correct initial status for each vehicle
   - Import current odometer readings and fuel levels
   - Validate all required fields

3. **Historical Contracts**
   - Import last 2 years of rental contracts (legal requirement)
   - Preserve original dates and prices
   - Link to correct customers and vehicles
   - Maintain payment records and methods
   - Calculate and verify historical revenue

4. **Financial Records**
   - Import outstanding balances
   - Active deposits and their status
   - Unpaid invoices and their aging
   - Historical payment records
   - Reconciliation with current bank balance

5. **Data Validation**
   - Pre-import validation with error reporting
   - Rollback capability if import fails
   - Data integrity checks post-import
   - Comparison reports with source data
   - Manual review queue for exceptions

6. **Import Formats**
   - Support CSV import for all data types
   - Support Excel (.xlsx) import
   - Template downloads for each data type
   - Clear documentation of required fields
   - Sample data files provided

## Technical Implementation Notes

### Import Pipeline Architecture
```python
class DataMigrationPipeline:
    stages = [
        'extract',     # Read from source
        'transform',   # Map and clean data
        'validate',    # Check integrity
        'load',        # Insert to database
        'verify'       # Post-import checks
    ]
    
    rollback_enabled = True
    batch_size = 100
    error_threshold = 5  # Stop if >5% errors
```

### Database Transaction Management
- Use database transactions for atomicity
- Implement checkpoint/resume for large imports
- Maintain import audit log
- Shadow tables for validation before commit

## API Endpoints

```
POST /api/v1/migration/validate
  Request: { type: 'customers', file: base64, dryRun: true }
  Response: { valid: 95, errors: 5, details: [...] }

POST /api/v1/migration/import
  Request: { type: 'customers', file: base64, mapping: {...} }
  Response: { imported: 95, failed: 5, reportId: 'abc123' }

GET /api/v1/migration/status/{importId}
  Response: { status: 'processing', progress: 67, errors: [] }

POST /api/v1/migration/rollback/{importId}
  Response: { status: 'rolled_back', affected: 100 }

GET /api/v1/migration/templates/{type}
  Response: CSV/Excel template file download
```

## Database Schema Requirements

```sql
-- Migration tracking table
CREATE TABLE migration_runs (
    id UUID PRIMARY KEY,
    type VARCHAR(50),
    source_file VARCHAR(255),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    status VARCHAR(20),
    records_processed INTEGER,
    records_imported INTEGER,
    records_failed INTEGER,
    error_details JSONB,
    performed_by UUID REFERENCES users(id),
    rollback_available BOOLEAN DEFAULT true
);

-- Migration mapping templates
CREATE TABLE migration_mappings (
    id UUID PRIMARY KEY,
    type VARCHAR(50),
    source_field VARCHAR(100),
    target_field VARCHAR(100),
    transformation VARCHAR(255),
    is_required BOOLEAN,
    validation_rule VARCHAR(255)
);
```

## UI/UX Considerations

### Import Wizard Interface
1. **Step 1:** Select data type to import
2. **Step 2:** Upload file or paste data
3. **Step 3:** Map fields (with auto-detection)
4. **Step 4:** Validation results preview
5. **Step 5:** Confirm and import
6. **Step 6:** View results and download report

### Visual Feedback
- Progress bar during import
- Real-time error highlighting
- Success/failure summary dashboard
- Downloadable import reports
- Before/after data comparison

## Testing Scenarios

1. **Happy Path Import**
   - Import 100 valid customer records
   - Verify all fields mapped correctly
   - Check database for accurate data

2. **Duplicate Handling**
   - Import file with 20% duplicates
   - Verify merge logic works correctly
   - Ensure no data loss

3. **Error Recovery**
   - Import file with 10% invalid records
   - Verify partial import with error report
   - Test rollback functionality

4. **Large Dataset**
   - Import 10,000 records
   - Monitor performance and memory usage
   - Verify batch processing works

5. **Format Compatibility**
   - Test CSV with different encodings
   - Test Excel with multiple sheets
   - Test malformed files

6. **Data Validation**
   - Import with invalid Swiss IDs
   - Import with future dates
   - Import with negative amounts

7. **Concurrent Imports**
   - Run multiple imports simultaneously
   - Verify no data corruption
   - Check proper queuing

8. **Rollback Testing**
   - Import data then rollback
   - Verify complete cleanup
   - Ensure no orphaned records

## Definition of Done

- [ ] All import types implemented (customers, vehicles, contracts, financial)
- [ ] Validation rules comprehensive and tested
- [ ] Rollback functionality verified
- [ ] Import templates created and documented
- [ ] Performance tested with 10,000+ records
- [ ] Error handling covers all scenarios
- [ ] Admin documentation complete
- [ ] Training video created
- [ ] Dry-run mode available
- [ ] Audit trail complete
- [ ] Successfully imported test dataset from actual legacy system

## Dependencies
- Database schema must be finalized
- Legacy system data export capability
- Admin authentication system
- File upload infrastructure
- Background job processing system

## Risks & Mitigation
- **Risk:** Data loss during migration
  - **Mitigation:** Complete backup before migration, rollback capability
- **Risk:** Invalid data corrupts system
  - **Mitigation:** Comprehensive validation, dry-run mode
- **Risk:** Performance issues with large datasets
  - **Mitigation:** Batch processing, off-hours migration

## Estimated Effort Breakdown
- Data mapping analysis: 2 points
- Import pipeline development: 3 points
- Validation rules implementation: 2 points
- UI development: 2 points
- Error handling & rollback: 2 points
- Testing & documentation: 2 points
- **Total: 13 story points**

---

*This story is CRITICAL for go-live. Without it, manual data entry would take weeks and introduce errors.*