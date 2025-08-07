# Admin Password Reset

**Actor:** Admin/Owner  
**Trigger:** Staff member forgets password and cannot login
**Frequency:** Weekly occurrence

## Journey Steps

### 1. Receive Reset Request (10 seconds)
- Staff calls/tells admin they're locked out
- Admin verifies identity (verbally)
- Admin logs into system

### 2. Access User Management (10 seconds)
- Navigate to Users section
- Find staff member account
- Click "Reset Password"

### 3. Set Temporary Password (15 seconds)
- System generates random password
- Or admin sets simple temporary one
- Example: "Change123!"
- Check "Force password change on login"

### 4. Communicate Password (10 seconds)
- Tell staff member new password
- Preferably in person
- Or via phone if trusted
- Remind to change immediately

### 5. Staff First Login (15 seconds)
- Staff logs in with temporary password
- System forces password change
- Staff sets their own new password
- Access restored

## Time Estimate
Total: ~60 seconds (admin: 35s, staff: 25s)

## Why This is MVP Critical
- **Daily reality:** People forget passwords
- **No email automation:** Can't send reset links
- **Productivity blocker:** Staff can't work without access
- **Security requirement:** Need secure reset process

## Key Features Required
- Admin can reset any staff password
- Force password change flag
- Password complexity rules
- Cannot reuse recent passwords
- Audit log of resets

## Simple Implementation
- No self-service reset
- No security questions  
- No email notifications
- Basic password rules only
- Manual communication

## Security Considerations
- Only Owner/Admin role can reset
- Temporary passwords expire in 24 hours
- Must change on first use
- Log all reset activities
- No password displayed after creation

## Common Scenarios

### Morning Lockout
Staff arrives, forgot password → Call owner → Reset → Back to work in 2 minutes

### New Staff First Day
Create account → Set temporary → Staff changes on first login

### Security Incident
Suspicious activity → Reset all passwords → Force everyone to change

## Not in MVP
- Self-service reset
- Email reset links
- SMS verification
- Security questions
- Password recovery

## Visual Flow
```
Request → Verify → Reset → Communicate → Change
   ↓        ↓       ↓          ↓          ↓
 10 sec   10 sec  15 sec     10 sec     15 sec
```