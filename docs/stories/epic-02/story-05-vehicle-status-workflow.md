# Story 5: Vehicle Status Workflow

**Story ID:** EPIC-02-STORY-05  
**Epic:** Fleet Management System  
**Priority:** Medium  
**Story Points:** 3

## User Story Statement

**As a** rental staff member  
**I want to** efficiently update and track vehicle status through the complete rental lifecycle  
**So that** fleet status is always accurate, enabling optimal vehicle utilization and preventing
operational conflicts

## Detailed Acceptance Criteria

1. **Status Transition Management**
   - System shall support defined status transitions: available → reserved → rented → returning →
     available
   - System shall enforce valid status transition rules preventing invalid state changes
   - System shall allow emergency status overrides with management approval and audit logging
   - System shall provide visual status flow indicators showing current state and next valid
     transitions

2. **Quick Status Lookup**
   - System shall provide instant vehicle status check by license plate number entry
   - System shall support barcode/QR code scanning for rapid vehicle identification
   - System shall display comprehensive status information including current customer and expected
     return
   - System shall show status change history with timestamps and user information

3. **Bulk Status Operations**
   - System shall allow selecting multiple vehicles for bulk status updates
   - System shall support filtering vehicles by current status for bulk operations
   - System shall validate bulk operations ensuring no invalid transitions occur
   - System shall provide confirmation dialogs for bulk changes with impact summary

4. **Status Change Audit Trail**
   - System shall log every status change with user ID, timestamp, and reason
   - System shall maintain complete status history for each vehicle
   - System shall provide audit reports for compliance and dispute resolution
   - System shall track automated vs manual status changes separately

5. **Automated Status Updates**
   - System shall automatically update status when contracts are created (available → reserved)
   - System shall trigger status change when rental begins (reserved → rented)
   - System shall update status on return processing (rented → returning → available)
   - System shall handle maintenance flagging (any status → maintenance)

6. **Status-Based Business Rules**
   - System shall prevent new reservations on non-available vehicles
   - System shall block maintenance scheduling for rented vehicles
   - System shall enforce cleaning/preparation time between rentals
   - System shall handle special statuses (impounded, accident, stolen)

7. **Real-time Status Synchronization**
   - System shall broadcast status changes to all connected terminals within 2 seconds
   - System shall maintain status consistency across multiple user sessions
   - System shall handle concurrent status update attempts with conflict resolution
   - System shall provide connection status indicators for real-time updates

8. **Status Workflow Customization**
   - System shall allow configuration of custom status types for specific business needs
   - System shall support custom transition rules based on vehicle categories
   - System shall enable location-specific status workflows
   - System shall allow time-based automatic status transitions

9. **Mobile Status Management**
   - System shall provide touch-optimized status update interface for mobile devices
   - System shall support offline status updates with automatic synchronization
   - System shall enable photo documentation for status changes
   - System shall provide push notifications for critical status changes

10. **Integration Touchpoints**
    - System shall integrate with contract management for automatic status updates
    - System shall sync with maintenance system for service-related status changes
    - System shall update availability system in real-time
    - System shall trigger notifications to relevant staff based on status changes

11. **Status Analytics and Reporting**
    - System shall track time spent in each status state for performance analysis
    - System shall identify bottlenecks in status workflow
    - System shall generate status change frequency reports
    - System shall provide utilization metrics based on status data

12. **Error Handling and Recovery**
    - System shall validate status changes before committing to database
    - System shall provide rollback capability for incorrect status updates
    - System shall handle system failures gracefully with automatic recovery
    - System shall alert administrators to status inconsistencies

## Technical Implementation Notes

### Database Schema Requirements

```sql
-- Vehicle status state machine configuration
CREATE TABLE status_transitions (
    id BIGSERIAL PRIMARY KEY,
    from_status VARCHAR(20),
    to_status VARCHAR(20),
    is_allowed BOOLEAN DEFAULT true,
    requires_approval BOOLEAN DEFAULT false,
    approval_role VARCHAR(50),
    transition_rules JSONB, -- business rules for transition
    created_at TIMESTAMP DEFAULT NOW()
);

-- Current vehicle status (denormalized for performance)
CREATE TABLE vehicle_current_status (
    vehicle_id BIGINT PRIMARY KEY REFERENCES vehicles(id),
    current_status VARCHAR(20) NOT NULL,
    previous_status VARCHAR(20),
    status_since TIMESTAMP DEFAULT NOW(),
    changed_by BIGINT REFERENCES users(id),
    contract_id BIGINT REFERENCES contracts(id),
    maintenance_id BIGINT REFERENCES maintenance_records(id),
    notes TEXT,
    location_id BIGINT REFERENCES locations(id)
);

-- Complete status change audit log
CREATE TABLE vehicle_status_history (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT REFERENCES vehicles(id),
    from_status VARCHAR(20),
    to_status VARCHAR(20),
    changed_by BIGINT REFERENCES users(id),
    change_reason VARCHAR(200),
    change_type VARCHAR(20), -- manual, automatic, system
    reference_id BIGINT, -- contract_id, maintenance_id, etc.
    reference_type VARCHAR(50), -- contract, maintenance, manual
    metadata JSONB, -- additional context data
    changed_at TIMESTAMP DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Status workflow configuration
CREATE TABLE status_workflow_config (
    id BIGSERIAL PRIMARY KEY,
    workflow_name VARCHAR(50),
    vehicle_category VARCHAR(30),
    location_id BIGINT REFERENCES locations(id),
    status_sequence JSONB, -- ordered array of statuses
    timing_rules JSONB, -- min/max time in each status
    automation_rules JSONB, -- automatic transition conditions
    is_active BOOLEAN DEFAULT true
);

-- Bulk status operations tracking
CREATE TABLE bulk_status_operations (
    id BIGSERIAL PRIMARY KEY,
    operation_name VARCHAR(100),
    initiated_by BIGINT REFERENCES users(id),
    vehicle_count INTEGER,
    from_status VARCHAR(20),
    to_status VARCHAR(20),
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'in_progress', -- in_progress, completed, failed
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    error_details JSONB
);
```

### API Endpoints Needed

- `GET /api/vehicles/{id}/status` - Get current vehicle status
- `PUT /api/vehicles/{id}/status` - Update vehicle status
- `POST /api/vehicles/status/bulk` - Bulk status update
- `GET /api/vehicles/status/transitions` - Get valid transitions for status
- `GET /api/vehicles/{id}/status/history` - Get status change history
- `POST /api/vehicles/status/lookup` - Quick status lookup by plate
- `GET /api/status/workflow/config` - Get status workflow configuration
- `PUT /api/status/workflow/config` - Update workflow configuration
- `POST /api/status/override` - Emergency status override
- `GET /api/status/audit` - Get status change audit reports
- `GET /api/status/analytics` - Get status analytics data

### State Machine Implementation

```javascript
// Status state machine definition
const statusStateMachine = {
  initial: 'available',
  states: {
    available: {
      on: {
        RESERVE: 'reserved',
        MAINTENANCE: 'maintenance',
        OUT_OF_SERVICE: 'out_of_service',
      },
    },
    reserved: {
      on: {
        START_RENTAL: 'rented',
        CANCEL: 'available',
        NO_SHOW: 'available',
      },
    },
    rented: {
      on: {
        RETURN: 'returning',
        EXTEND: 'rented',
        ACCIDENT: 'out_of_service',
      },
    },
    returning: {
      on: {
        COMPLETE_RETURN: 'cleaning',
        DAMAGE_FOUND: 'inspection',
      },
    },
    cleaning: {
      on: {
        READY: 'available',
        MAINTENANCE_NEEDED: 'maintenance',
      },
    },
  },
};
```

### UI/UX Considerations

1. **Status Dashboard**
   - Visual status indicators with color coding
   - Status transition timeline view
   - Quick action buttons for common transitions
   - Real-time status counter widgets

2. **Quick Lookup Interface**
   - Prominent search bar for license plate entry
   - Barcode scanner integration
   - Recent lookups history
   - Status result card with key information

3. **Bulk Operations Panel**
   - Multi-select vehicle interface
   - Filter options for bulk selection
   - Progress indicators for bulk operations
   - Rollback options for failed operations

4. **Mobile Status Interface**
   - Touch-friendly status buttons
   - Swipe gestures for status changes
   - Photo capture for status documentation
   - Offline operation indicators

## Testing Scenarios

1. **Status Transition Validation**
   - Test all valid status transitions work correctly
   - Attempt invalid transitions and verify rejection
   - Test emergency override functionality
   - Verify transition rule enforcement

2. **Quick Lookup Testing**
   - Search by full and partial license plates
   - Test barcode scanning accuracy
   - Verify search result completeness
   - Test search performance with large fleet

3. **Bulk Operations Testing**
   - Select 10+ vehicles and change status
   - Test bulk operation with invalid transitions
   - Verify transaction rollback on failures
   - Test bulk operation performance

4. **Audit Trail Verification**
   - Make status changes and verify audit logging
   - Test audit report generation
   - Verify user tracking accuracy
   - Test audit data integrity

5. **Automated Status Updates**
   - Create contract and verify automatic status change
   - Process return and verify status workflow
   - Test maintenance flagging status update
   - Verify integration consistency

6. **Real-time Synchronization**
   - Update status in one terminal, verify updates in others
   - Test concurrent status updates
   - Simulate network interruption and recovery
   - Verify conflict resolution mechanisms

7. **Mobile Interface Testing**
   - Test status updates on mobile devices
   - Verify offline functionality
   - Test photo documentation capture
   - Validate push notification delivery

8. **Performance Testing**
   - Test status lookup with 500+ vehicles
   - Load test bulk operations
   - Verify real-time update performance
   - Test audit query performance

## Definition of Done

- [ ] Status state machine implemented with all transitions
- [ ] Quick lookup functionality working with barcode support
- [ ] Bulk status operations implemented and tested
- [ ] Complete audit trail system operational
- [ ] Automated status updates integrated with other systems
- [ ] Real-time synchronization working across terminals
- [ ] Mobile interface deployed and functional
- [ ] Status workflow customization system implemented
- [ ] API endpoints documented and tested
- [ ] Unit tests covering status logic (85%+ coverage)
- [ ] Integration tests with contract and maintenance systems
- [ ] User acceptance testing completed
- [ ] Performance benchmarks achieved
- [ ] Security testing passed
- [ ] Training documentation created

## Dependencies

- Vehicle registry system (Story 1)
- Real-time communication infrastructure
- Contract management system integration
- Maintenance system integration
- Mobile app framework
- Barcode/QR code scanning capability

## Risks and Mitigation

**Risk:** Status inconsistencies due to system failures  
**Mitigation:** Implement robust transaction handling and automatic consistency checks  
**Contingency:** Manual status verification tools and batch correction utilities

**Risk:** Real-time synchronization failures causing conflicting updates  
**Mitigation:** Implement optimistic locking and conflict resolution mechanisms  
**Contingency:** Last-writer-wins with conflict notification system

**Risk:** Complex state machine causing performance issues  
**Mitigation:** Optimize state machine with caching and indexing  
**Contingency:** Simplified status model with essential transitions only

## Estimated Effort: 3 Story Points

**Breakdown:**

- Status state machine implementation: 1 day
- Quick lookup and barcode integration: 0.5 days
- Bulk operations system: 1 day
- Audit trail and reporting: 0.5 days
- Real-time synchronization: 1 day
- Mobile interface development: 1 day
- Testing and integration: 1 day

**Total:** 6 developer days
