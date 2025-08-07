# Story 01: User & Role Management

**Story ID:** CRMS-061  
**Epic:** Epic 6 - System Administration & Security  
**Priority:** High  
**Status:** Ready for Development

## User Story Statement

**As an** admin  
**I want to** manage system users and their roles  
**So that** access is appropriately controlled and business security is maintained

## Detailed Acceptance Criteria

1. **User Account Management**
   - Create new user accounts with mandatory fields (username, email, full name, role)
   - Edit existing user information including contact details and role assignments
   - Disable/enable user accounts without deleting historical data
   - Permanently delete user accounts with proper data cleanup (GDPR compliance)

2. **Role-Based Access Control (RBAC)**
   - Define and manage three primary roles: Admin, Owner, Staff
   - Assign multiple roles to a single user if business requirements demand
   - Create custom roles with specific permission sets for specialized needs
   - Inherit permissions from parent roles in hierarchical structure

3. **Permission Matrix Management**
   - Granular permissions for modules (customers, contracts, vehicles, payments, reports)
   - CRUD permissions (Create, Read, Update, Delete) per module per role
   - Special permissions (approve refunds, modify completed contracts, access admin panel)
   - View-only access to sensitive financial data for restricted roles

4. **Password Management**
   - Enforce strong password policies (minimum 12 characters, mixed case, numbers, symbols)
   - Force password resets for new users and after security incidents
   - Self-service password reset via email with secure token expiration
   - Password history tracking to prevent reuse of last 12 passwords

5. **Account Security Features**
   - Automatic account lockout after 5 consecutive failed login attempts
   - Progressive delay between login attempts after failures
   - Account lockout duration of 30 minutes with admin override capability
   - Email notifications to admins for security-related events

6. **User Activity Tracking**
   - Log all user creation, modification, and deletion activities
   - Track role changes with timestamp and administrator who made the change
   - Record login/logout times and IP addresses for audit purposes
   - Monitor permission usage to identify potential security issues

7. **Session Management**
   - Enforce single session per user or configurable concurrent session limits
   - Session timeout after 2 hours of inactivity with warning at 110 minutes
   - Immediate session termination when user role/permissions change
   - Admin ability to forcefully terminate any user session

8. **User Directory Features**
   - Search users by name, email, or role with real-time filtering
   - Bulk operations for role assignments and account status changes
   - Export user lists with roles and last login information
   - User profile pictures for better identification in system logs

9. **Admin Dashboard Integration**
   - Visual dashboard showing user statistics (active, inactive, locked accounts)
   - Recent user activity feed with security alerts
   - Permission audit reports highlighting unusual access patterns
   - User onboarding workflow tracking for new employees

10. **Multi-tenant Considerations**
    - Support for multiple rental businesses within single system instance
    - Isolate user management per business tenant
    - Cross-tenant admin roles for system administrators
    - Tenant-specific role customization while maintaining security standards

11. **Integration Requirements**
    - API endpoints for external HR systems to sync user data
    - LDAP/Active Directory integration capability for enterprise customers
    - Single Sign-On (SSO) preparation with OAuth2/SAML support
    - Webhook notifications for user lifecycle events

12. **Compliance and Audit**
    - GDPR-compliant user data handling with proper consent tracking
    - Audit trail for all administrative actions with immutable logging
    - Data retention policies with automatic cleanup after employee departure
    - Export capabilities for compliance reporting and audits

## Technical Implementation Notes

- **Authentication Framework:** Implement JWT-based authentication with refresh tokens
- **Password Security:** Use bcrypt with salt rounds 12+ for password hashing
- **Database Design:** PostgreSQL with proper indexes on user lookup fields
- **Role Storage:** JSONB columns for flexible permission storage with validation
- **Caching:** Redis for session management and frequently accessed permission data
- **Security Headers:** Implement CSRF protection, XSS prevention, and secure cookies
- **Audit Logging:** Separate audit database with write-only access and encryption

## API Endpoints Needed

```
# User Management
GET    /api/admin/users
POST   /api/admin/users
GET    /api/admin/users/{id}
PUT    /api/admin/users/{id}
DELETE /api/admin/users/{id}
POST   /api/admin/users/{id}/disable
POST   /api/admin/users/{id}/enable

# Role Management
GET    /api/admin/roles
POST   /api/admin/roles
GET    /api/admin/roles/{id}
PUT    /api/admin/roles/{id}
DELETE /api/admin/roles/{id}
PUT    /api/admin/users/{id}/roles

# Permission Management
GET    /api/admin/permissions
GET    /api/admin/users/{id}/permissions
POST   /api/admin/roles/{id}/permissions

# Session Management
GET    /api/admin/sessions
DELETE /api/admin/sessions/{id}
POST   /api/admin/users/{id}/force-logout

# Password Management
POST   /api/admin/users/{id}/reset-password
POST   /api/admin/users/{id}/force-password-reset
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

# Audit and Reporting
GET    /api/admin/audit/users
GET    /api/admin/reports/user-activity
GET    /api/admin/reports/permission-usage
```

## Database Schema Requirements

```sql
-- Users table
users (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  password_history JSONB DEFAULT '[]',
  profile_picture_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  is_locked BOOLEAN DEFAULT false,
  locked_until TIMESTAMP,
  failed_login_attempts INTEGER DEFAULT 0,
  last_login_at TIMESTAMP,
  last_login_ip INET,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  tenant_id UUID
);

-- Roles table
roles (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '{}',
  is_system_role BOOLEAN DEFAULT false,
  tenant_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(name, tenant_id)
);

-- User roles junction table
user_roles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT NOW(),
  assigned_by UUID REFERENCES users(id),
  UNIQUE(user_id, role_id)
);

-- Sessions table
user_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  refresh_token VARCHAR(255) UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_activity_at TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Password reset tokens
password_reset_tokens (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User activity audit
user_audit_log (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  performed_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_username ON users (username);
CREATE INDEX idx_users_active ON users (is_active) WHERE is_active = true;
CREATE INDEX idx_user_sessions_token ON user_sessions (session_token);
CREATE INDEX idx_user_sessions_user ON user_sessions (user_id);
CREATE INDEX idx_user_audit_log_user ON user_audit_log (user_id);
CREATE INDEX idx_user_audit_log_created ON user_audit_log (created_at);
```

## UI/UX Considerations

- **User Management Interface:** Clean, table-based layout with inline editing capabilities
- **Role Assignment:** Drag-and-drop interface for assigning roles to users
- **Permission Matrix:** Visual grid showing roles vs permissions with clear indicators
- **Security Dashboard:** Real-time security alerts and user activity monitoring
- **Mobile Admin:** Responsive design for emergency admin access on mobile devices
- **Accessibility:** Full keyboard navigation and screen reader compatibility
- **Visual Feedback:** Clear success/error messages for all administrative actions
- **Batch Operations:** Multi-select interface for bulk user management operations
- **Search and Filter:** Advanced filtering options for large user directories
- **Audit Trail Visualization:** Timeline view of user-related administrative actions

## Testing Scenarios

1. **User Creation and Management**
   - Create new user with all required fields succeeds
   - Duplicate username/email creation is prevented with clear error
   - User profile updates save correctly and trigger audit logs
   - User account disable/enable functions work without data loss

2. **Role and Permission Management**
   - Role creation with custom permissions works correctly
   - Role assignment to users reflects immediately in system
   - Permission inheritance works correctly with role hierarchies
   - Permission changes propagate to active user sessions

3. **Password Security and Reset**
   - Strong password policy enforcement prevents weak passwords
   - Password reset email contains valid, time-limited tokens
   - Password history prevents reuse of previous passwords
   - Account lockout triggers after configured failed attempts

4. **Session Management**
   - Session timeout works correctly with appropriate warnings
   - Multiple concurrent sessions are handled per configuration
   - Force logout immediately terminates user access
   - Session data is cleaned up properly after expiration

5. **Security and Audit**
   - All user management actions are logged in audit trail
   - Security events trigger appropriate admin notifications
   - Failed login attempts are logged with IP addresses
   - GDPR data export includes complete user audit history

6. **Performance and Scalability**
   - User search performs adequately with 1000+ user accounts
   - Bulk operations (role assignment, user updates) complete within reasonable time
   - Permission checks don't significantly impact application performance
   - Database queries are optimized with proper indexing

7. **Integration Testing**
   - User creation integrates properly with email notification system
   - Role changes reflect immediately in user interface permissions
   - Session management works correctly with load balancer configuration
   - Audit logs integrate with external SIEM systems if configured

8. **Error Handling and Recovery**
   - Database failures during user operations show appropriate messages
   - Network issues during password reset are handled gracefully
   - System handles edge cases like deleted users with active sessions
   - Recovery procedures work correctly after system maintenance

## Definition of Done

- [ ] All acceptance criteria implemented and tested
- [ ] RBAC system fully functional with granular permissions
- [ ] Password policy enforcement working correctly
- [ ] User management API endpoints developed and documented
- [ ] Admin interface responsive and accessible
- [ ] Session management secure and efficient
- [ ] Audit logging comprehensive and searchable
- [ ] Security testing completed (penetration testing, vulnerability scan)
- [ ] Performance testing with realistic user loads
- [ ] Integration testing with authentication system
- [ ] User acceptance testing by admin staff
- [ ] GDPR compliance verified by legal review
- [ ] Documentation complete (admin guide, security procedures)

## Estimated Effort

**Story Points:** 13

**Breakdown:**
- Backend API development (4 points)
- Database design and migrations (2 points)
- Frontend admin interface (3 points)
- Authentication and security features (2 points)
- Audit logging system (1 point)
- Testing and security hardening (1 point)

**Dependencies:**
- Database infrastructure setup
- Email service configuration
- Security framework selection
- Admin interface framework choice

**Risks:**
- Complex permission system may impact performance
- Security requirements may extend development time
- Integration with existing systems may require additional effort
- GDPR compliance complexity may require legal consultation