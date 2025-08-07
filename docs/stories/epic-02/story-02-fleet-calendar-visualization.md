# Story 2: Fleet Calendar Visualization

**Story ID:** EPIC-02-STORY-02  
**Epic:** Fleet Management System  
**Priority:** High  
**Story Points:** 8

## User Story Statement

**As a** rental staff member  
**I want to** see vehicle availability and booking status in an intuitive visual calendar interface  
**So that** I can quickly identify available vehicles, understand booking patterns, and efficiently schedule new rentals

## Detailed Acceptance Criteria

1. **Calendar Layout**
   - System shall display a monthly calendar view with vehicles listed vertically and dates horizontally
   - System shall show vehicle names/plates in the left column for easy identification
   - System shall provide week and day view options for detailed scheduling
   - System shall support navigation between months/weeks with smooth transitions

2. **Color Coding System**
   - System shall use green for available time slots
   - System shall use red for confirmed rentals with customer information
   - System shall use yellow for pending/reserved vehicles
   - System shall use gray for maintenance/out-of-service periods
   - System shall provide a legend explaining all color codes

3. **Booking Information Display**
   - System shall show customer name and rental duration on booking blocks
   - System shall display booking reference numbers when hovering over reservations
   - System shall indicate overdue returns with distinct visual indicators
   - System shall show partial day rentals with appropriate time slot representation

4. **Interactive Features**
   - System shall allow clicking on booking blocks to view detailed rental information
   - System shall support drag-and-drop to extend or modify booking periods
   - System shall provide right-click context menus for quick actions
   - System shall enable double-click to create new reservations

5. **Vehicle Filtering**
   - System shall allow filtering by vehicle category (Economy, SUV, Luxury, etc.)
   - System shall support filtering by vehicle status (Available, Maintenance, etc.)
   - System shall provide quick filter buttons for common selections
   - System shall maintain filter state across calendar navigation

6. **Real-time Updates**
   - System shall automatically refresh calendar data every 30 seconds
   - System shall highlight recent changes with subtle animations
   - System shall prevent conflicts when multiple users make simultaneous changes
   - System shall show loading indicators during data updates

7. **Responsive Design**
   - System shall adapt layout for tablet use in landscape orientation
   - System shall provide touch-friendly controls for mobile staff
   - System shall maintain readability at different screen sizes
   - System shall support gestures for navigation and interaction

8. **Performance Optimization**
   - System shall load initial calendar view within 2 seconds
   - System shall implement lazy loading for large date ranges
   - System shall use pagination for fleets with 50+ vehicles
   - System shall cache frequently accessed calendar data

9. **Booking Conflict Prevention**
   - System shall prevent overlapping bookings through visual validation
   - System shall show warnings when attempting to book unavailable slots
   - System shall highlight potential conflicts during drag operations
   - System shall provide alternative vehicle suggestions for conflicts

10. **Search Integration**
    - System shall allow searching for specific vehicles within calendar
    - System shall highlight search results with visual indicators
    - System shall provide quick jump to vehicle location in calendar
    - System shall support search by customer name or booking reference

11. **Export and Printing**
    - System shall allow printing calendar view for offline reference
    - System shall support export to PDF format
    - System shall maintain formatting and color coding in exports
    - System shall provide options for date range selection in exports

12. **Accessibility Features**
    - System shall support keyboard navigation for all calendar functions
    - System shall provide screen reader compatible labels
    - System shall ensure sufficient color contrast for all status indicators
    - System shall offer text-based alternatives to color coding

## Technical Implementation Notes

### Database Schema Requirements
```sql
-- Calendar views table for optimized queries
CREATE MATERIALIZED VIEW fleet_calendar_view AS
SELECT 
    v.id as vehicle_id,
    v.license_plate,
    v.make || ' ' || v.model as vehicle_name,
    v.category,
    v.status,
    c.id as contract_id,
    c.customer_id,
    cust.full_name as customer_name,
    c.start_date,
    c.end_date,
    c.status as rental_status,
    c.reference_number
FROM vehicles v
LEFT JOIN contracts c ON v.id = c.vehicle_id 
    AND c.status IN ('confirmed', 'active', 'reserved')
LEFT JOIN customers cust ON c.customer_id = cust.id
WHERE v.status != 'retired'
ORDER BY v.category, v.license_plate;

-- Calendar events table for maintenance and blocks
CREATE TABLE calendar_events (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT REFERENCES vehicles(id),
    event_type VARCHAR(20), -- maintenance, blocked, inspection
    start_date DATE,
    end_date DATE,
    title VARCHAR(200),
    description TEXT,
    color VARCHAR(7), -- hex color code
    created_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- User calendar preferences
CREATE TABLE calendar_preferences (
    user_id BIGINT PRIMARY KEY REFERENCES users(id),
    default_view VARCHAR(10) DEFAULT 'month', -- month, week, day
    vehicle_categories JSONB, -- selected categories
    auto_refresh_interval INTEGER DEFAULT 30, -- seconds
    show_customer_names BOOLEAN DEFAULT true
);
```

### API Endpoints Needed
- `GET /api/calendar/fleet` - Get fleet calendar data for date range
- `GET /api/calendar/fleet/{date}` - Get specific date calendar data
- `PUT /api/calendar/booking/{id}/extend` - Extend booking via drag operation
- `POST /api/calendar/availability/check` - Check availability for time slot
- `GET /api/calendar/conflicts` - Get current booking conflicts
- `POST /api/calendar/events` - Create calendar event (maintenance, etc.)
- `GET /api/calendar/preferences` - Get user calendar preferences
- `PUT /api/calendar/preferences` - Update user calendar preferences
- `GET /api/calendar/export/{format}` - Export calendar data

### UI/UX Considerations

1. **Calendar Component Architecture**
   - Use React or Vue calendar library (FullCalendar.js recommended)
   - Custom resource timeline view for vehicles
   - Responsive grid system for different screen sizes
   - Virtual scrolling for large vehicle lists

2. **Visual Design Elements**
   - Clean, professional calendar interface
   - Consistent color scheme matching brand colors
   - Clear typography for vehicle and customer information
   - Intuitive icons for different booking states

3. **Interaction Patterns**
   - Smooth drag-and-drop with visual feedback
   - Contextual tooltips for booking information
   - Modal dialogs for detailed booking views
   - Keyboard shortcuts for power users

4. **Mobile Adaptations**
   - Swipe gestures for calendar navigation
   - Touch-optimized booking blocks
   - Simplified view for smaller screens
   - Quick action buttons for common tasks

## Testing Scenarios

1. **Calendar Loading and Navigation**
   - Load calendar with 25 vehicles and 100+ bookings
   - Navigate between months and verify data accuracy
   - Test calendar performance with 6-month date range
   - Verify calendar loads correctly on different screen sizes

2. **Booking Visualization**
   - Create overlapping bookings and verify conflict display
   - Test color coding for different booking statuses
   - Verify customer information display in booking blocks
   - Test booking block sizing for different rental durations

3. **Drag-and-Drop Functionality**
   - Extend booking by dragging end date
   - Move booking to different vehicle via drag-drop
   - Test drag-drop validation and conflict prevention
   - Verify drag operations on touch devices

4. **Real-time Updates**
   - Create booking in one browser, verify update in another
   - Test calendar refresh behavior during active use
   - Simulate network interruption and reconnection
   - Verify conflict resolution with concurrent edits

5. **Filtering and Search**
   - Filter by vehicle category and verify results
   - Search for specific vehicle and test highlighting
   - Combine multiple filters and test performance
   - Clear filters and verify full calendar restoration

6. **Export and Print**
   - Export calendar to PDF and verify formatting
   - Print calendar page and check layout
   - Export filtered calendar view
   - Test export with large date ranges

7. **Accessibility Testing**
   - Navigate calendar using only keyboard
   - Test screen reader compatibility
   - Verify color contrast ratios
   - Test with browser zoom at 200%

8. **Performance Testing**
   - Load calendar with 100+ vehicles
   - Test scroll performance with large vehicle list
   - Measure API response times for calendar data
   - Test concurrent user interactions

## Definition of Done

- [ ] Calendar component displays vehicle availability accurately
- [ ] All color coding and visual indicators working correctly
- [ ] Drag-and-drop functionality implemented and tested
- [ ] Real-time updates functioning across browser sessions
- [ ] Filtering system working with good performance
- [ ] Mobile responsive design verified on tablets
- [ ] Export/print functionality working properly
- [ ] Accessibility standards met (WCAG 2.1 AA)
- [ ] API endpoints implemented and documented
- [ ] Unit tests covering calendar logic (85%+ coverage)
- [ ] Integration tests for real-time features
- [ ] User acceptance testing completed
- [ ] Performance benchmarks achieved
- [ ] Browser compatibility verified (Chrome, Firefox, Safari, Edge)

## Dependencies

- Real-time communication system (WebSocket/Server-Sent Events)
- Calendar UI library selection and setup
- Vehicle and booking data from previous stories
- User authentication and session management

## Risks and Mitigation

**Risk:** Calendar performance degradation with large fleets  
**Mitigation:** Implement pagination and lazy loading  
**Contingency:** Provide filtered views and date range limits

**Risk:** Real-time updates causing UI conflicts  
**Mitigation:** Implement optimistic updates with rollback capability  
**Contingency:** Manual refresh button and conflict resolution dialogs

**Risk:** Complex drag-and-drop interactions on mobile  
**Mitigation:** Simplified touch interactions with confirmation dialogs  
**Contingency:** Alternative tap-based editing interface

## Estimated Effort: 8 Story Points

**Breakdown:**
- Calendar component setup and configuration: 1 day
- Vehicle timeline and booking visualization: 2 days  
- Drag-and-drop functionality: 1.5 days
- Real-time updates integration: 1.5 days
- Filtering and search features: 1 day
- Mobile responsive design: 1 day
- Export/print functionality: 0.5 days
- Testing and performance optimization: 1.5 days

**Total:** 10 developer days