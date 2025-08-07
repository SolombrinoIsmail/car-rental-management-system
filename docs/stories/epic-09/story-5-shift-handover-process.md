# Story 5: Shift Handover Process

## Story Information
- **Story ID:** CRMS-E9-S5
- **Epic:** 9 - Operational Edge Cases
- **Story Points:** 3

## User Story
**As a** rental staff member ending my shift  
**I want to** hand over operations to the next shift systematically  
**So that** continuity is maintained, outstanding issues are communicated, and accountability is clear

## Detailed Acceptance Criteria

1. **Outstanding Items Management**
   - System automatically generates list of incomplete tasks from current shift
   - Pending rental returns with expected times and customer contact information
   - Active maintenance requests and their current status
   - Customer service issues requiring follow-up action

2. **Cash Reconciliation Process**
   - Digital cash counting interface with denomination breakdown
   - Comparison with system-calculated expected cash on hand
   - Variance reporting and investigation workflow
   - Secure cash drop confirmation with receipt generation

3. **Pending Returns Tracking**
   - Real-time list of overdue and soon-to-be-overdue rentals
   - Customer contact attempts and outcomes from current shift
   - Vehicle preparation status for expected returns
   - After-hours return processing requirements

4. **Problem Contracts Identification**
   - Automated flagging of rentals with issues (payment problems, damages, extensions)
   - Customer dispute cases requiring management attention
   - Insurance claim follow-ups and required documentation
   - Contracts requiring special handling or restrictions

5. **Shift Notes and Communications**
   - Structured note-taking for important incidents or customer interactions
   - Urgent items requiring immediate attention from next shift
   - Management notifications and special instructions
   - Maintenance and facility issues affecting operations

6. **Comprehensive Shift Report**
   - Automated generation of shift summary with key metrics
   - Revenue summary with breakdown by service type
   - Vehicle utilization statistics and availability status
   - Customer service metrics and issue resolution rates

7. **Next Shift Briefing**
   - Priority queue of tasks for incoming shift
   - Expected customer arrivals and special requirements
   - Vehicle availability status and upcoming maintenance
   - Weather or operational conditions affecting service

8. **System Status Verification**
   - Equipment functionality checks (computers, printers, payment terminals)
   - Network connectivity and system performance verification
   - Backup system status and data synchronization confirmation
   - Security system status and facility condition check

9. **Handover Confirmation**
   - Digital signature confirmation from outgoing and incoming staff
   - Acknowledged receipt of cash, keys, and important documents
   - Verification of understanding for all outstanding issues
   - Contact information for urgent questions post-shift

10. **Manager Notification System**
    - Automatic alerts for significant issues requiring management attention
    - Summary reports sent to management for shift performance review
    - Exception reporting for unusual incidents or variances
    - Escalation triggers for unresolved critical issues

11. **Documentation Retention**
    - Digital storage of all shift handover documents
    - Searchable archive of historical handover notes
    - Audit trail for cash handling and key transfers
    - Performance metrics tracking across shifts and staff

12. **Mobile Accessibility**
    - Mobile-friendly interface for handover process
    - Offline capability for completing handover documentation
    - Push notifications for urgent items requiring attention
    - Photo capture for facility or equipment issues

## Technical Implementation Notes

### Backend Services
- `ShiftHandoverService`: Manages the complete handover workflow
- `CashReconciliationService`: Handles cash counting and variance reporting
- `TaskTransferService`: Manages outstanding task assignments
- `ReportGenerationService`: Creates shift summary reports
- `NotificationService`: Sends alerts and updates to relevant parties

### Data Models
```sql
shift_handovers (
  id, outgoing_user_id, incoming_user_id, shift_date,
  handover_started_at, handover_completed_at,
  cash_expected, cash_counted, cash_variance,
  outstanding_tasks_count, urgent_items_count,
  manager_notification_sent, status
)

handover_items (
  id, handover_id, item_type, description, priority,
  assigned_to_user_id, due_date, status, resolution_notes
)
```

### State Machine
Started → Cash Counted → Tasks Reviewed → Notes Documented → Report Generated → Confirmed → Completed

## API Endpoints

### Handover Management
- `POST /api/shifts/handover/start` - Initiate shift handover process
- `GET /api/shifts/handover/outstanding-items` - Get list of pending tasks
- `POST /api/shifts/handover/cash-reconciliation` - Submit cash count
- `POST /api/shifts/handover/notes` - Add shift notes and observations
- `POST /api/shifts/handover/complete` - Finalize handover with signatures
- `GET /api/shifts/handover/{id}/report` - Get shift summary report

### Task Management
- `GET /api/tasks/pending` - Get outstanding tasks for current shift
- `POST /api/tasks/{id}/transfer` - Transfer task to next shift
- `PUT /api/tasks/{id}/priority` - Update task priority
- `POST /api/tasks/{id}/notes` - Add task-specific notes

### Reporting and Analytics
- `GET /api/shifts/performance-metrics` - Get shift performance data
- `GET /api/shifts/cash-variances` - Cash handling variance reports
- `POST /api/shifts/manager-notifications` - Send management alerts

## Database Schema Requirements

### New Tables
```sql
CREATE TABLE shift_handovers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handover_number VARCHAR(20) UNIQUE NOT NULL,
  shift_date DATE NOT NULL,
  outgoing_user_id UUID REFERENCES users(id) NOT NULL,
  incoming_user_id UUID REFERENCES users(id),
  location_id UUID REFERENCES locations(id) NOT NULL,
  handover_started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  handover_completed_at TIMESTAMP,
  cash_expected DECIMAL(10,2),
  cash_counted DECIMAL(10,2),
  cash_variance DECIMAL(10,2),
  cash_variance_explanation TEXT,
  outstanding_tasks_count INTEGER DEFAULT 0,
  urgent_items_count INTEGER DEFAULT 0,
  pending_returns_count INTEGER DEFAULT 0,
  problem_contracts_count INTEGER DEFAULT 0,
  revenue_total DECIMAL(12,2),
  transactions_count INTEGER,
  status VARCHAR(30) NOT NULL DEFAULT 'in_progress',
  manager_notification_sent BOOLEAN DEFAULT false,
  manager_reviewed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE handover_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handover_id UUID REFERENCES shift_handovers(id) NOT NULL,
  item_type VARCHAR(30) NOT NULL, -- task, return, contract, maintenance, etc.
  reference_id UUID, -- references related entity (rental, vehicle, etc.)
  title VARCHAR(200) NOT NULL,
  description TEXT,
  priority VARCHAR(10) NOT NULL DEFAULT 'normal', -- urgent, high, normal, low
  assigned_to_user_id UUID REFERENCES users(id),
  due_date TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  resolution_notes TEXT,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cash_reconciliations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handover_id UUID REFERENCES shift_handovers(id) NOT NULL,
  denomination VARCHAR(10) NOT NULL, -- $100, $50, $20, etc.
  count INTEGER NOT NULL,
  amount DECIMAL(8,2) NOT NULL,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shift_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handover_id UUID REFERENCES shift_handovers(id) NOT NULL,
  note_type VARCHAR(30) NOT NULL, -- general, urgent, maintenance, customer
  title VARCHAR(100),
  content TEXT NOT NULL,
  priority VARCHAR(10) DEFAULT 'normal',
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  created_by_user_id UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Schema Updates
- Add `current_shift_handover_id` to users table to track active handovers
- Add `handover_count` to users table for performance tracking
- Add `last_handover_variance` to users for cash handling performance

## UI/UX Considerations

### Handover Checklist Interface
- Step-by-step wizard with progress indicator
- Clear visual completion status for each section
- Required field validation with helpful error messages
- Quick action buttons for common handover tasks

### Cash Reconciliation Interface
- Calculator-style denomination entry with visual cash images
- Real-time total calculation with variance highlighting
- Photo capture capability for cash drop documentation
- Quick reconciliation for exact matches

### Task Transfer Interface
- Drag-and-drop task assignment to incoming staff
- Priority color coding (red for urgent, yellow for high priority)
- Expandable task details with customer contact information
- Bulk task assignment capabilities

### Mobile-Optimized Design
- Touch-friendly interface for tablet use during handovers
- Offline capability for completing documentation
- Voice-to-text for quick note entry
- Photo integration for documenting issues

## Testing Scenarios

### Scenario 1: Standard End-of-Day Handover
**Given:** Day shift ending with normal operations
**When:** Staff initiates handover with accurate cash count and no outstanding issues
**Then:** Handover completed in <10 minutes, all documentation generated, night shift briefed

### Scenario 2: Cash Variance Resolution
**Given:** Cash count shows $50 shortage from expected amount
**When:** Staff documents variance with explanation
**Then:** Manager notification sent, variance tracking updated, investigation workflow triggered

### Scenario 3: Multiple Outstanding Returns
**Given:** 5 rentals overdue at end of shift
**When:** Staff transfers pending returns to next shift
**Then:** Customer contact history preserved, priority assigned, follow-up tasks created

### Scenario 4: Emergency Handover Mid-Shift
**Given:** Staff member needs to leave due to emergency
**When:** Abbreviated handover process initiated
**Then:** Critical items transferred, manager notified, replacement staff briefed

### Scenario 5: System Downtime During Handover
**Given:** Network connectivity lost during handover process
**When:** Staff continues handover using offline mode
**Then:** All data captured locally, synced when connection restored

### Scenario 6: Weekend to Monday Handover
**Given:** Weekend shift ending with accumulated issues
**When:** Staff documents weekend incidents and resolutions
**Then:** Comprehensive summary provided, priority items flagged for Monday morning

### Scenario 7: New Staff Receiving Handover
**Given:** Inexperienced staff member starting shift
**When:** Handover includes training notes and support contacts
**Then:** Additional guidance provided, manager notification of new staff, support available

### Scenario 8: High-Priority Customer Issue Transfer
**Given:** VIP customer with unresolved complaint from day shift
**When:** Issue transferred with full context and urgency
**Then:** Next shift alerted immediately, manager notified, customer contact priority set

## Definition of Done

- [ ] Shift handover workflow operational with step-by-step guidance
- [ ] Outstanding tasks automatically identified and transferable
- [ ] Cash reconciliation system with variance tracking and reporting
- [ ] Pending returns monitoring with customer contact integration
- [ ] Problem contracts identification and priority assignment
- [ ] Shift notes system with categorization and follow-up tracking
- [ ] Automated shift report generation with key performance metrics
- [ ] Manager notification system for exceptions and variances
- [ ] Digital signature capability for handover confirmation
- [ ] Mobile-responsive interface for tablet and smartphone use
- [ ] Offline capability with data synchronization
- [ ] Integration with existing task and rental management systems
- [ ] Audit trail for all handover activities and cash handling
- [ ] Performance testing (handover completion <5 minutes)
- [ ] User acceptance testing with operations staff
- [ ] Training documentation and procedures created

## Dependencies
- User management and authentication system
- Task and workflow management system
- Cash handling and payment processing integration
- Rental and vehicle management systems
- Customer notification service
- Reporting and analytics platform

## Risks and Mitigation
- **Risk:** Critical information lost during handover process
  - **Mitigation:** Required field validation and completeness checks
- **Risk:** Cash handling errors and theft concerns
  - **Mitigation:** Multi-step verification and audit trail requirements
- **Risk:** Staff rushing through handover process
  - **Mitigation:** Minimum time requirements and manager spot checks
- **Risk:** System unavailable during shift change
  - **Mitigation:** Offline capability and paper backup procedures