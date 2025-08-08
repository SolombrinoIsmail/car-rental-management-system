# Epic 2: Fleet Management System

## Epic Goal

Provide comprehensive vehicle fleet management capabilities including real-time availability
tracking, maintenance scheduling, and utilization optimization to prevent double-bookings and
maximize revenue per vehicle.

## Epic Description

### Business Value

- **Revenue Optimization:** Maximize fleet utilization to 80%+
- **Operational Efficiency:** Eliminate double-bookings
- **Maintenance Tracking:** Reduce unexpected breakdowns by 70%
- **Visual Management:** At-a-glance fleet status for quick decisions

### Scope

Complete vehicle lifecycle management from registration through maintenance, availability tracking,
and status monitoring with visual calendar interface.

## User Stories

### Story 1: Vehicle Registry & Management

**As an** owner/admin  
**I want to** manage my complete vehicle fleet  
**So that** all vehicles are properly tracked and documented

**Acceptance Criteria:**

- Add vehicles with full specifications
- Upload registration documents
- Set hourly/daily/weekly/monthly rates
- Track insurance and registration expiry
- Support vehicle photos for documentation

**Technical Requirements:**

- Vehicle database schema
- Document storage system
- Rate configuration engine
- Expiry notification system

### Story 2: Fleet Calendar Visualization

**As a** rental staff member  
**I want to** see vehicle availability visually  
**So that** I can quickly identify available vehicles

**Acceptance Criteria:**

- Calendar view showing all vehicles
- Color coding for status (available/rented/maintenance)
- Click for reservation details
- Drag to extend/modify bookings
- Filter by vehicle type/class

**Technical Requirements:**

- Calendar UI component
- Real-time status updates
- Drag-and-drop functionality
- Responsive design for tablets

### Story 3: Real-time Availability Tracking

**As a** rental staff member  
**I want to** see accurate vehicle availability  
**So that** I never double-book vehicles

**Acceptance Criteria:**

- Instant status updates across all terminals
- Show current location/customer
- Expected return time display
- Overdue alerts
- Availability search by date range

**Technical Requirements:**

- WebSocket/real-time updates
- Availability calculation engine
- Conflict detection system
- Alert notification system

### Story 4: Maintenance Management

**As an** owner  
**I want to** track vehicle maintenance  
**So that** vehicles are properly serviced and safe

**Acceptance Criteria:**

- Set maintenance schedules by km/time
- Flag vehicles for maintenance
- Block availability during service
- Track maintenance history
- Cost tracking per vehicle

**Technical Requirements:**

- Maintenance scheduling engine
- Service history database
- Cost tracking system
- Automated blocking rules

### Story 5: Vehicle Status Workflow

**As a** rental staff member  
**I want to** update vehicle status through rental lifecycle  
**So that** fleet status is always accurate

**Acceptance Criteria:**

- Status transitions (available→reserved→rented→returning)
- Quick status check by plate number
- Bulk status updates
- Status change history
- Automated status updates on contract events

**Technical Requirements:**

- State machine implementation
- Status transition rules
- Audit trail system
- Event-driven updates

### Story 6: Vehicle Performance Analytics

**As an** owner  
**I want to** analyze vehicle performance  
**So that** I can optimize my fleet composition

**Acceptance Criteria:**

- Utilization rate per vehicle
- Revenue per vehicle tracking
- Maintenance cost analysis
- Popular vs underperforming vehicles
- Fuel consumption tracking

**Technical Requirements:**

- Analytics calculation engine
- Reporting database views
- Performance metrics API
- Data visualization components

## Dependencies

- Core contract system for rental data
- Calendar UI library selection
- Real-time communication infrastructure
- Analytics framework setup

## Definition of Done

- [ ] All vehicles properly registered in system
- [ ] Calendar view responsive on all devices
- [ ] No double-booking possible
- [ ] Maintenance schedules automated
- [ ] Real-time updates working across terminals
- [ ] Analytics dashboard showing key metrics
- [ ] Status workflow fully automated
- [ ] Staff trained on fleet management
- [ ] 30-day operation without conflicts

## Success Metrics

- Fleet utilization rate: >75%
- Double-booking incidents: 0
- Maintenance on-schedule rate: >95%
- Status update latency: <2 seconds
- Vehicle search time: <3 seconds

## Risk Mitigation

- **Risk:** Calendar performance with large fleet
  - **Mitigation:** Pagination and lazy loading
  - **Contingency:** Filter to date ranges

- **Risk:** Real-time sync failures
  - **Mitigation:** Fallback to polling
  - **Contingency:** Manual refresh option

- **Risk:** Maintenance scheduling conflicts
  - **Mitigation:** Buffer time in schedules
  - **Contingency:** Override capability

## Implementation Priority

**Phase 1 (Weeks 1-2):** Foundation

- Vehicle registry (Story 1)
- Basic availability (Story 3)

**Phase 2 (Weeks 3-4):** Visualization

- Fleet calendar (Story 2)
- Status workflow (Story 5)

**Phase 3 (Weeks 5-6):** Advanced

- Maintenance management (Story 4)
- Performance analytics (Story 6)

## Estimated Effort

- **Total:** 18-22 developer days
- **Story 1:** 3 days
- **Story 2:** 5 days
- **Story 3:** 3 days
- **Story 4:** 4 days
- **Story 5:** 2 days
- **Story 6:** 3 days
