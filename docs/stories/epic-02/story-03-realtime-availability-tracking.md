# Story 3: Real-time Availability Tracking

**Story ID:** EPIC-02-STORY-03  
**Epic:** Fleet Management System  
**Priority:** Critical  
**Story Points:** 5

## User Story Statement

**As a** rental staff member  
**I want to** see accurate, real-time vehicle availability and status information across all system
terminals  
**So that** I never double-book vehicles and can provide customers with current, reliable
availability information

## Detailed Acceptance Criteria

1. **Real-time Status Updates**
   - System shall update vehicle status across all terminals within 2 seconds of any change
   - System shall maintain consistent availability state across multiple user sessions
   - System shall handle concurrent status updates without data corruption
   - System shall automatically reconnect after network interruptions

2. **Comprehensive Status Information**
   - System shall display current vehicle location (on-lot, with customer, in maintenance)
   - System shall show current customer name and contact for rented vehicles
   - System shall indicate expected return date and time for active rentals
   - System shall display actual vs scheduled return status

3. **Availability Search Engine**
   - System shall allow searching availability by date range and time
   - System shall filter available vehicles by category, features, and location
   - System shall show alternative vehicles when preferred option unavailable
   - System shall calculate availability including buffer time for cleaning/prep

4. **Overdue and Alert System**
   - System shall automatically flag vehicles that are overdue for return
   - System shall send escalating alerts for vehicles overdue by 2+ hours
   - System shall calculate and display estimated late fees
   - System shall provide quick contact options for overdue customers

5. **Conflict Detection and Prevention**
   - System shall prevent booking vehicles that are already reserved/rented
   - System shall detect and alert on potential scheduling conflicts
   - System shall provide suggestions for resolving booking conflicts
   - System shall maintain reservation locks during booking process

6. **Multi-location Support**
   - System shall track vehicle location across multiple rental locations
   - System shall show inter-location vehicle transfers and timing
   - System shall support location-specific availability queries
   - System shall handle vehicles in transit between locations

7. **Historical Availability Data**
   - System shall maintain 90-day history of availability changes
   - System shall track who made status changes and when
   - System shall provide audit trail for availability disputes
   - System shall support rollback of incorrect status changes

8. **Integration Points**
   - System shall automatically update availability when contracts are created/modified
   - System shall sync with maintenance system for service blocking
   - System shall integrate with return processing to update status
   - System shall trigger notifications for status changes

9. **Performance Requirements**
   - System shall handle 500+ concurrent availability queries per minute
   - System shall maintain sub-2-second response time for availability searches
   - System shall support up to 1000 vehicles with real-time tracking
   - System shall gracefully degrade during high-load periods

10. **Offline Capability**
    - System shall cache recent availability data for offline viewing
    - System shall queue status updates during network outages
    - System shall sync queued updates when connectivity is restored
    - System shall alert users when operating in offline mode

11. **Advanced Search Features**
    - System shall support fuzzy search by license plate (partial matches)
    - System shall allow searching by customer name to find current rentals
    - System shall provide saved search filters for frequently used queries
    - System shall suggest vehicles based on previous rental patterns

12. **Mobile Optimization**
    - System shall provide touch-optimized availability interface for tablets
    - System shall support barcode/QR code scanning for quick vehicle lookup
    - System shall work efficiently on mobile data connections
    - System shall support push notifications for critical availability changes

## Technical Implementation Notes

### Database Schema Requirements

```sql
-- Real-time vehicle status table
CREATE TABLE vehicle_status_realtime (
    vehicle_id BIGINT PRIMARY KEY REFERENCES vehicles(id),
    current_status VARCHAR(20) NOT NULL, -- available, rented, maintenance, transit
    location_id BIGINT REFERENCES locations(id),
    current_customer_id BIGINT REFERENCES customers(id),
    expected_return_datetime TIMESTAMP,
    last_updated TIMESTAMP DEFAULT NOW(),
    updated_by BIGINT REFERENCES users(id),
    contract_id BIGINT REFERENCES contracts(id)
);

-- Availability calculation cache
CREATE TABLE availability_cache (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT REFERENCES vehicles(id),
    date_from DATE,
    date_to DATE,
    is_available BOOLEAN,
    blocking_reason VARCHAR(100), -- rental, maintenance, reserved
    blocking_reference_id BIGINT,
    cached_at TIMESTAMP DEFAULT NOW()
);

-- Status change audit log
CREATE TABLE vehicle_status_log (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT REFERENCES vehicles(id),
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    changed_by BIGINT REFERENCES users(id),
    change_reason VARCHAR(200),
    metadata JSONB,
    changed_at TIMESTAMP DEFAULT NOW()
);

-- Availability locks for booking process
CREATE TABLE availability_locks (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT REFERENCES vehicles(id),
    locked_by BIGINT REFERENCES users(id),
    lock_start TIMESTAMP,
    lock_end TIMESTAMP,
    expires_at TIMESTAMP,
    lock_reason VARCHAR(100)
);

-- Overdue tracking
CREATE TABLE overdue_vehicles (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT REFERENCES vehicles(id),
    contract_id BIGINT REFERENCES contracts(id),
    expected_return TIMESTAMP,
    overdue_since TIMESTAMP,
    escalation_level INTEGER DEFAULT 1,
    last_contact_attempt TIMESTAMP,
    resolution_notes TEXT
);
```

### API Endpoints Needed

- `GET /api/availability/realtime` - Get real-time fleet availability
- `POST /api/availability/search` - Search available vehicles by criteria
- `GET /api/vehicles/{id}/status` - Get specific vehicle current status
- `PUT /api/vehicles/{id}/status` - Update vehicle status
- `POST /api/availability/lock` - Lock vehicle during booking process
- `DELETE /api/availability/lock/{id}` - Release availability lock
- `GET /api/availability/conflicts` - Get current availability conflicts
- `GET /api/availability/overdue` - Get overdue vehicles list
- `POST /api/availability/alerts/resolve` - Resolve overdue alerts
- `GET /api/availability/history/{vehicleId}` - Get availability history
- `GET /api/availability/audit` - Get availability change audit log

### Real-time Communication Setup

```javascript
// WebSocket implementation for real-time updates
const availabilitySocket = new WebSocket('ws://api/availability/realtime');

availabilitySocket.onmessage = function (event) {
  const update = JSON.parse(event.data);
  handleAvailabilityUpdate(update);
};

// Server-Sent Events fallback
const eventSource = new EventSource('/api/availability/events');
eventSource.onmessage = function (event) {
  const update = JSON.parse(event.data);
  handleAvailabilityUpdate(update);
};
```

### UI/UX Considerations

1. **Real-time Status Indicators**
   - Live status badges that update automatically
   - Visual indicators for data freshness
   - Connection status display
   - Smooth animations for status changes

2. **Availability Search Interface**
   - Advanced search form with date/time pickers
   - Quick filter buttons for common criteria
   - Search result highlighting and sorting
   - Saved search functionality

3. **Alert and Notification System**
   - Toast notifications for status changes
   - Priority alert system for overdue vehicles
   - Sound alerts for critical issues
   - Customizable notification preferences

4. **Mobile-First Design**
   - Touch-optimized search interface
   - Swipe actions for common status changes
   - Camera integration for QR code scanning
   - Offline-capable interface

## Testing Scenarios

1. **Real-time Update Testing**
   - Update vehicle status in one terminal, verify immediate update in others
   - Test update propagation with 10+ concurrent users
   - Simulate network interruption and verify reconnection
   - Test update ordering with rapid successive changes

2. **Availability Search Accuracy**
   - Search for vehicles in specific date range, verify results
   - Test complex search criteria (category + location + features)
   - Verify search results match actual vehicle availability
   - Test search performance with large fleet (500+ vehicles)

3. **Conflict Prevention Testing**
   - Attempt to double-book same vehicle simultaneously
   - Test availability locking during booking process
   - Verify conflict detection and resolution suggestions
   - Test concurrent booking attempts from multiple users

4. **Overdue Management Testing**
   - Create overdue rental and verify alert generation
   - Test escalation levels for increasingly overdue vehicles
   - Verify automatic late fee calculations
   - Test overdue resolution workflow

5. **Performance and Load Testing**
   - Test system with 500 concurrent availability queries
   - Load test real-time updates with 100+ simultaneous changes
   - Verify response times under high load
   - Test graceful degradation during peak usage

6. **Integration Testing**
   - Create new contract and verify automatic availability update
   - Schedule maintenance and verify availability blocking
   - Process return and verify availability restoration
   - Test cross-system data consistency

7. **Offline Functionality Testing**
   - Disconnect network and verify cached data access
   - Test queued updates during offline mode
   - Verify data sync after reconnection
   - Test offline mode indicators and behavior

8. **Mobile and Cross-platform Testing**
   - Test real-time updates on mobile devices
   - Verify touch interactions for status changes
   - Test QR code scanning functionality
   - Verify push notification delivery

## Definition of Done

- [ ] Real-time status updates working across all terminals (<2s latency)
- [ ] Availability search engine implemented and optimized
- [ ] Conflict detection and prevention system functional
- [ ] Overdue tracking and alerting system operational
- [ ] WebSocket/SSE real-time communication established
- [ ] Mobile-optimized interface deployed
- [ ] Offline capability implemented and tested
- [ ] API endpoints documented and tested
- [ ] Unit tests covering availability logic (90%+ coverage)
- [ ] Load testing completed successfully
- [ ] Integration with other systems verified
- [ ] User acceptance testing passed
- [ ] Performance benchmarks met
- [ ] Security testing completed
- [ ] Production deployment successful

## Dependencies

- Real-time communication infrastructure (WebSocket/SSE)
- Vehicle and contract management systems
- User authentication and session management
- Mobile app framework and push notification service
- Caching system (Redis recommended)

## Risks and Mitigation

**Risk:** Real-time update failures causing data inconsistency  
**Mitigation:** Implement heartbeat monitoring and automatic recovery  
**Contingency:** Manual refresh capability and conflict resolution tools

**Risk:** High load causing system performance degradation  
**Mitigation:** Implement rate limiting and caching strategies  
**Contingency:** Graceful degradation to polling-based updates

**Risk:** Network latency affecting real-time performance  
**Mitigation:** Optimize data payload size and implement compression  
**Contingency:** Adjustable update frequency based on network conditions

## Estimated Effort: 5 Story Points

**Breakdown:**

- Real-time communication setup: 1 day
- Availability calculation engine: 1.5 days
- Search and filtering system: 1 day
- Overdue tracking and alerts: 1 day
- Mobile optimization and offline capability: 1 day
- Testing and performance optimization: 1.5 days

**Total:** 7 developer days
