# User Story: Customer Communication System

## Story Information
- **Story ID:** CRITICAL-03
- **Epic:** Epic 4 - Dashboard & Reporting (Addition) or New Epic 10
- **Priority:** P0 - Critical (Customer Expectation)
- **Story Points:** 8

## User Story Statement
**As a** rental staff member  
**I want to** automatically send communications to customers  
**So that** they receive confirmations, reminders, and documents without manual effort

## Acceptance Criteria

1. **Email Communication**
   - Send reservation confirmations automatically
   - Send rental agreement PDFs after signing
   - Send return reminders 24 hours before
   - Send receipts after payment
   - Send overdue notifications
   - Support German language templates

2. **SMS Notifications**
   - Send pickup reminders (optional)
   - Send return time reminders
   - Send urgent notifications (overdue)
   - Swiss phone number validation
   - Opt-in/opt-out management
   - Delivery status tracking

3. **Template Management**
   - Pre-defined templates for all scenarios
   - Variable substitution (name, dates, amounts)
   - HTML and plain text versions
   - Admin ability to edit templates
   - Preview before sending
   - Version control for templates

4. **Communication Triggers**
   - Automatic on contract creation
   - Automatic on payment receipt
   - Scheduled for reminders
   - Manual trigger option
   - Batch communication capability
   - Event-based triggers

5. **Delivery Management**
   - Queue management for bulk sending
   - Retry logic for failures
   - Bounce handling
   - Unsubscribe handling
   - Delivery tracking and reporting
   - Rate limiting compliance

6. **Communication History**
   - Log all sent communications
   - Track open/click rates (email)
   - Track delivery status
   - Associate with customer record
   - Search and filter capabilities
   - Resend functionality

## Technical Implementation Notes

### Communication Service Architecture
```typescript
interface CommunicationService {
  providers: {
    email: 'SendGrid' | 'AWS SES',
    sms: 'Twilio' | 'MessageBird'
  };
  
  queue: {
    processor: 'BullMQ',
    workers: 4,
    retryPolicy: {
      attempts: 3,
      backoff: 'exponential'
    }
  };
  
  templates: {
    storage: 'database',
    engine: 'Handlebars',
    cache: 'Redis'
  };
}
```

### Message Queue Implementation
- Use job queue for reliable delivery
- Priority levels for different message types
- Scheduled job support for reminders
- Dead letter queue for failed messages

## API Endpoints

```
POST /api/v1/communications/send
  Request: {
    type: 'email|sms',
    recipient: 'email@example.com',
    template: 'reservation_confirmation',
    data: { name: 'John', date: '2024-03-15' },
    scheduled_for: timestamp (optional)
  }
  Response: { 
    messageId: 'msg_123',
    status: 'queued|sent',
    scheduledTime: timestamp
  }

GET /api/v1/communications/templates
  Response: {
    templates: [
      { id: 'reservation_confirmation', type: 'email', variables: [...] },
      { id: 'return_reminder', type: 'sms', variables: [...] }
    ]
  }

PUT /api/v1/communications/templates/{id}
  Request: {
    subject: 'Your Rental Confirmation',
    body_html: '<html>...',
    body_text: 'Plain text version',
    variables: ['name', 'date', 'amount']
  }

GET /api/v1/communications/history/{customerId}
  Response: {
    communications: [
      { 
        id: 'com_123',
        type: 'email',
        template: 'receipt',
        sentAt: timestamp,
        status: 'delivered',
        opened: true
      }
    ]
  }

POST /api/v1/communications/batch
  Request: {
    recipients: [...],
    template: 'maintenance_reminder',
    data: {...}
  }
  Response: { 
    batchId: 'batch_123',
    totalRecipients: 45,
    status: 'processing'
  }
```

## Database Schema Requirements

```sql
-- Communication templates
CREATE TABLE communication_templates (
    id VARCHAR(50) PRIMARY KEY,
    type VARCHAR(10) CHECK (type IN ('email', 'sms')),
    name VARCHAR(100),
    subject VARCHAR(255),
    body_html TEXT,
    body_text TEXT,
    variables JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    updated_by UUID REFERENCES users(id)
);

-- Communication log
CREATE TABLE communication_log (
    id UUID PRIMARY KEY,
    customer_id UUID REFERENCES customers(id),
    type VARCHAR(10),
    template_id VARCHAR(50),
    recipient VARCHAR(255),
    subject VARCHAR(255),
    status VARCHAR(20),
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    error_message TEXT,
    metadata JSONB
);

-- Communication preferences
CREATE TABLE customer_preferences (
    customer_id UUID REFERENCES customers(id),
    email_enabled BOOLEAN DEFAULT true,
    sms_enabled BOOLEAN DEFAULT false,
    language VARCHAR(2) DEFAULT 'de',
    reminder_hours INTEGER DEFAULT 24,
    marketing_consent BOOLEAN DEFAULT false,
    updated_at TIMESTAMP
);

-- Message queue
CREATE TABLE message_queue (
    id UUID PRIMARY KEY,
    type VARCHAR(10),
    recipient VARCHAR(255),
    template_id VARCHAR(50),
    data JSONB,
    priority INTEGER DEFAULT 5,
    scheduled_for TIMESTAMP,
    attempts INTEGER DEFAULT 0,
    status VARCHAR(20),
    error TEXT,
    created_at TIMESTAMP,
    processed_at TIMESTAMP
);
```

## UI/UX Considerations

### Template Editor Interface
- Rich text editor for HTML templates
- Variable insertion toolbar
- Live preview with sample data
- Mobile preview mode
- Syntax highlighting for variables
- Template testing interface

### Communication Dashboard
- Daily sending statistics
- Delivery rate metrics
- Template performance
- Failed message queue
- Customer preference overview
- Quick resend actions

## Testing Scenarios

1. **Automatic Trigger Testing**
   - Create contract, verify email sent
   - Process payment, verify receipt sent
   - Set return date, verify reminder scheduled
   - Trigger overdue, verify notification sent

2. **Template Variable Testing**
   - Test all variables replaced correctly
   - Test missing variable handling
   - Test special characters in data
   - Test number formatting (CHF)

3. **Delivery Failure Handling**
   - Test invalid email addresses
   - Test SMS to invalid numbers
   - Verify retry logic works
   - Check dead letter queue

4. **Bulk Communication**
   - Send to 100 recipients
   - Verify rate limiting works
   - Test queue processing
   - Monitor performance

5. **Language Testing**
   - Verify German templates
   - Test character encoding
   - Test date/time formatting
   - Test currency formatting

6. **Preference Management**
   - Test opt-out functionality
   - Verify preferences respected
   - Test unsubscribe links
   - Verify GDPR compliance

7. **Integration Testing**
   - Test with SendGrid/Twilio
   - Verify webhook handling
   - Test delivery tracking
   - Verify cost tracking

8. **Schedule Testing**
   - Schedule future messages
   - Test timezone handling
   - Verify scheduled job execution
   - Test schedule cancellation

## Definition of Done

- [ ] Email service integrated and tested
- [ ] SMS service integrated and tested
- [ ] All automatic triggers implemented
- [ ] Template management UI complete
- [ ] Message queue reliable and performant
- [ ] Delivery tracking functional
- [ ] Communication history searchable
- [ ] Preferences management working
- [ ] GDPR compliance verified
- [ ] German templates created and reviewed
- [ ] Monitoring and alerting configured
- [ ] Documentation for template variables
- [ ] Cost tracking implemented
- [ ] Load tested with 1000 messages/hour

## Dependencies
- Email service provider account (SendGrid/SES)
- SMS provider account (Twilio/MessageBird)
- Message queue infrastructure
- Template storage system
- SMTP configuration

## Risks & Mitigation
- **Risk:** Email deliverability issues
  - **Mitigation:** Proper SPF/DKIM setup, warming IP reputation
- **Risk:** SMS costs exceeding budget
  - **Mitigation:** Opt-in only, cost alerts, daily limits
- **Risk:** Template errors causing confusion
  - **Mitigation:** Thorough testing, preview capability, versioning

## Estimated Effort Breakdown
- Email integration: 1 point
- SMS integration: 1 point
- Template management: 2 points
- Automatic triggers: 1 point
- Queue implementation: 1 point
- UI development: 1 point
- Testing & refinement: 1 point
- **Total: 8 story points**

---

*This story is CRITICAL for customer satisfaction and operational efficiency. Manual communication would require 2+ hours daily.*