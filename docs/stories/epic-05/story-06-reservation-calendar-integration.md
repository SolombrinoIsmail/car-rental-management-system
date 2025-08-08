# Story 06: Reservation Calendar Integration

## Story Information

- **Story ID:** RS-06
- **Epic:** Epic 5 - Reservation System
- **Priority:** Medium
- **Story Points:** 5

## User Story

**As a** rental staff member  
**I want to** view and manage reservations within the fleet calendar system  
**So that** I can holistically manage vehicle availability and optimize fleet utilization

## Detailed Acceptance Criteria

1. **AC-01:** Reservations display in fleet calendar with visual distinction from active rentals
2. **AC-02:** Different reservation states (confirmed, tentative, overdue) show with distinct
   colors/patterns
3. **AC-03:** Staff can drag-and-drop reservations to reschedule within availability constraints
4. **AC-04:** Calendar shows availability gaps between reservations for potential bookings
5. **AC-05:** Visual conflict warnings appear when overlapping bookings are detected
6. **AC-06:** Quick action menus allow conversion to rental, cancellation, or modification
7. **AC-07:** Calendar integrates seamlessly with existing fleet management calendar views
8. **AC-08:** Staff can filter calendar view to show only reservations, only rentals, or both
9. **AC-09:** Reservation details appear in hover tooltips or side panels when selected
10. **AC-10:** Calendar updates in real-time when reservations are created, modified, or cancelled
11. **AC-11:** Multi-vehicle view shows reservation conflicts across the entire fleet
12. **AC-12:** Calendar export functionality includes reservation data for external planning

## Technical Implementation Notes

### Calendar Architecture

- **Unified Calendar:** Single calendar component handling both rentals and reservations
- **Data Separation:** Clear distinction between reservation and rental data structures
- **Real-time Updates:** WebSocket or polling for live calendar synchronization
- **Performance Optimization:** Efficient rendering for large date ranges and fleet sizes

### Visual Design System

```
Reservation Visual Codes:
- Confirmed: Light blue with solid border
- Tentative: Light yellow with dashed border
- Overdue: Red with striped pattern
- Converting: Orange with pulse animation
- Cancelled: Gray with strikethrough

Rental Visual Codes:
- Active: Green with solid fill
- Overdue: Dark red with solid fill
- Returning Today: Blue with clock icon
```

### Integration Points

- Fleet calendar component (Epic 2, Story 2)
- Real-time availability system
- Reservation management system
- Drag-and-drop interaction library

## API Endpoints Needed

### GET /api/calendar/events

**Purpose:** Retrieve calendar events (both reservations and rentals) **Query Parameters:**

```
startDate, endDate, vehicleIds[], eventTypes[] (reservation|rental)
```

**Response:**

```json
{
  "events": [
    {
      "id": "uuid",
      "type": "reservation",
      "title": "Smith - Compact Car",
      "vehicleId": "uuid",
      "customerId": "uuid",
      "startDate": "2024-08-15T10:00:00Z",
      "endDate": "2024-08-17T10:00:00Z",
      "status": "confirmed",
      "confirmationNumber": "RES-20240806-0001",
      "estimatedRevenue": 250.0,
      "className": "reservation-confirmed"
    }
  ]
}
```

### POST /api/reservations/{id}/reschedule

**Purpose:** Reschedule reservation via drag-and-drop **Request Body:**

```json
{
  "newPickupDatetime": "2024-08-16T10:00:00Z",
  "newReturnDatetime": "2024-08-18T10:00:00Z",
  "newVehicleId": "uuid", // If dropped on different vehicle
  "rescheduleReason": "Staff optimization"
}
```

### GET /api/calendar/availability-gaps

**Purpose:** Identify availability gaps for potential bookings **Query Parameters:**

```
startDate, endDate, vehicleId, minimumGapHours
```

**Response:**

```json
{
  "gaps": [
    {
      "vehicleId": "uuid",
      "startDatetime": "2024-08-16T14:00:00Z",
      "endDatetime": "2024-08-18T09:00:00Z",
      "durationHours": 43,
      "potentialRevenue": 180.0
    }
  ]
}
```

### GET /api/calendar/conflicts

**Purpose:** Detect and report scheduling conflicts **Response:**

```json
{
  "conflicts": [
    {
      "vehicleId": "uuid",
      "conflictType": "overlap",
      "events": [
        { "id": "uuid1", "type": "reservation" },
        { "id": "uuid2", "type": "rental" }
      ],
      "severity": "high",
      "autoResolution": "upgrade_reservation"
    }
  ]
}
```

## Database Schema Requirements

### New Tables

```sql
CREATE TABLE calendar_views (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES staff(id),
    view_name VARCHAR(100),
    default_filters JSONB, -- Vehicle IDs, event types, etc.
    default_date_range VARCHAR(20), -- week, month, quarter
    display_settings JSONB, -- Colors, layout preferences
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE calendar_interactions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES staff(id),
    action_type VARCHAR(50), -- view, reschedule, convert, etc.
    target_id UUID, -- Reservation or rental ID
    target_type VARCHAR(20), -- reservation, rental
    interaction_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Views

```sql
CREATE VIEW calendar_events AS
SELECT
    r.id,
    'reservation' as event_type,
    r.confirmation_number as reference_number,
    r.customer_id,
    r.vehicle_id,
    r.pickup_datetime as start_datetime,
    r.return_datetime as end_datetime,
    r.status,
    r.estimated_total_amount as revenue,
    'reservation-' || r.status as css_class
FROM reservations r
WHERE r.status != 'CANCELLED'

UNION ALL

SELECT
    rc.id,
    'rental' as event_type,
    rc.contract_number as reference_number,
    rc.customer_id,
    rc.vehicle_id,
    rc.pickup_datetime as start_datetime,
    rc.return_datetime as end_datetime,
    rc.status,
    rc.total_amount as revenue,
    'rental-' || rc.status as css_class
FROM rental_contracts rc
WHERE rc.status IN ('ACTIVE', 'OVERDUE');
```

### Indexes

```sql
CREATE INDEX idx_calendar_events_date_range ON reservations(pickup_datetime, return_datetime);
CREATE INDEX idx_calendar_events_vehicle ON reservations(vehicle_id);
```

## UI/UX Considerations

### Calendar Interface

- **Unified Display:** Single calendar showing both reservations and rentals
- **Color Coding:** Consistent visual language across all event types
- **Interactive Elements:** Click, hover, and drag interactions
- **Responsive Design:** Works on desktop, tablet, and mobile devices
- **Zoom Levels:** Day, week, month views with appropriate detail levels

### Navigation and Filtering

- **Quick Filters:** Toggle buttons for event types, statuses, date ranges
- **Vehicle Selection:** Multi-select dropdown or checkbox list
- **Date Navigation:** Smooth scrolling and jump-to-date functionality
- **Search Integration:** Find specific reservations/rentals quickly

### Interaction Design

- **Drag Feedback:** Visual indicators during drag operations
- **Drop Zones:** Clear indication of valid drop targets
- **Confirmation Dialogs:** Verify important actions like rescheduling
- **Undo Functionality:** Reverse recent changes if needed

### Information Display

- **Event Tooltips:** Hover for quick details
- **Side Panel:** Detailed information when event selected
- **Mini Forms:** Quick edit capabilities without leaving calendar
- **Status Indicators:** Clear visual status communication

## Testing Scenarios

### Scenario 1: Basic Calendar Display

**Given:** Staff member opens fleet calendar  
**When:** Viewing current month with reservations and rentals  
**Then:** Both event types display with correct colors and information

### Scenario 2: Drag-and-Drop Rescheduling

**Given:** Confirmed reservation needs to be moved  
**When:** Staff drags reservation to different dates/vehicle  
**Then:** System validates availability and updates reservation if valid

### Scenario 3: Availability Gap Identification

**Given:** Staff looking for optimization opportunities  
**When:** Viewing calendar with gap analysis enabled  
**Then:** Available time slots highlighted for potential bookings

### Scenario 4: Conflict Detection and Warning

**Given:** Overlapping reservation and rental detected  
**When:** Conflict appears on calendar  
**Then:** Visual warning displayed with resolution suggestions

### Scenario 5: Real-time Updates

**Given:** Multiple staff members viewing same calendar  
**When:** One staff member creates new reservation  
**Then:** Calendar updates for all users without refresh

### Scenario 6: Filter and View Management

**Given:** Staff member wants to focus on specific vehicles  
**When:** Applying filters and saving custom view  
**Then:** Calendar shows only selected data and saves preferences

### Scenario 7: Quick Action Menu Usage

**Given:** Staff member right-clicks on reservation  
**When:** Selecting "Convert to Rental" from context menu  
**Then:** Conversion workflow opens with reservation pre-populated

### Scenario 8: Mobile Calendar Interaction

**Given:** Staff member using tablet device  
**When:** Viewing and interacting with calendar  
**Then:** Touch interactions work smoothly with appropriate gesture support

## Definition of Done

- [ ] All acceptance criteria implemented and tested
- [ ] Calendar component integrated with existing fleet calendar
- [ ] Visual distinction between reservations and rentals implemented
- [ ] Drag-and-drop functionality working reliably
- [ ] Real-time updates functioning across multiple user sessions
- [ ] Filter and search capabilities operational
- [ ] Quick action menus implemented for common operations
- [ ] Mobile and tablet compatibility verified
- [ ] Database views and queries optimized for performance
- [ ] API endpoints implemented with proper validation
- [ ] Unit tests cover calendar logic with >90% coverage
- [ ] Integration tests validate calendar synchronization
- [ ] Performance tests ensure smooth rendering with large datasets
- [ ] User experience tested with actual staff workflows
- [ ] Cross-browser compatibility verified
- [ ] Accessibility standards met (keyboard navigation, screen readers)
- [ ] Documentation updated (user guide, API documentation)
- [ ] Staff training conducted on calendar features

## Dependencies

### Internal Dependencies

- Fleet calendar system (Epic 2, Story 2)
- Reservation management system (Stories 1-5)
- Real-time availability tracking (Epic 2, Story 3)
- Staff authentication and permissions system

### External Dependencies

- Calendar rendering library (FullCalendar, React Calendar, etc.)
- WebSocket service for real-time updates
- Drag-and-drop interaction library

## Risk Mitigation

### Risk: Performance issues with large date ranges or fleet sizes

- **Mitigation:** Implement pagination, lazy loading, and data virtualization
- **Contingency:** Fallback to simplified view mode with reduced features

### Risk: Real-time synchronization failures

- **Mitigation:** Implement robust error handling and automatic reconnection
- **Contingency:** Manual refresh capability and offline mode indicators

### Risk: Drag-and-drop conflicts in multi-user environments

- **Mitigation:** Optimistic locking and conflict detection algorithms
- **Contingency:** Real-time conflict warnings and resolution workflows

### Risk: Mobile usability challenges

- **Mitigation:** Touch-optimized interface design and gesture recognition
- **Contingency:** Simplified mobile view with essential features only

### Risk: Visual confusion between different event types

- **Mitigation:** Clear color coding and iconography with user testing
- **Contingency:** Toggle modes to show only one event type at a time

## Success Criteria

- Calendar loading time <3 seconds for typical month view
- Drag-and-drop operations complete in <1 second
- 95% staff adoption rate within 4 weeks
- Zero data synchronization errors in multi-user scenarios
- Staff efficiency improvement of 25% for scheduling tasks
- User satisfaction score >4.4/5 for calendar functionality
