# Core User Journeys

> **Note:** User journeys have been reorganized into individual files for better maintainability and
> clarity. Please refer to the [User Journeys Index](./index.md) for the complete list of all
> journeys.

## Quick Reference

This document previously contained all user journeys in a single file. They have now been separated
into:

### Staff User Journeys

- [Staff Dashboard Review](./staff-dashboard-review.md)
- [New Rental - First Time Customer](./staff-new-rental-first-time-customer.md)
- [New Rental - Returning Customer](./staff-new-rental-returning-customer.md)
- [Rental Return - Standard](./staff-rental-return-standard.md)
- [Rental Return - With Issues](./staff-rental-return-with-issues.md)
- [Quick Vehicle Status Check](./staff-quick-vehicle-status-check.md)
- [Customer Blacklist Management](./staff-customer-blacklist-management.md)
- [End of Day Reconciliation](./staff-end-of-day-reconciliation.md)

### Owner/Admin User Journeys

- [Daily Revenue Check](./owner-daily-revenue-check.md)
- [ROI Validation](./owner-roi-validation.md)
- [Staff Account Management](./admin-staff-account-management.md)
- [Fleet Overview Management](./owner-fleet-overview-management.md)
- [Financial Reconciliation](./owner-financial-reconciliation.md)
- [Quick Contract Lookup](./owner-quick-contract-lookup.md)

### System-Initiated Journeys

- [Automatic Backup](./system-automatic-backup.md)
- [Session Timeout](./system-session-timeout.md)

---

## Legacy Content (Archived)

### Journey 1: Staff Dashboard Review (Daily Start)

**Actor:** Staff Member  
**Trigger:** Beginning of shift/workday

1. **Dashboard Access** (5 seconds)
   - Login with staff credentials
   - Dashboard loads automatically

2. **Review Today's Overview** (20 seconds)
   - See today's scheduled pickups (list with times)
   - See today's expected returns (list with times)
   - View currently available vehicles count
   - Check any overdue returns (highlighted in red)

3. **Quick Actions** (as needed)
   - Click to start new rental from dashboard
   - Click on scheduled pickup to prepare contract
   - View calendar for week overview

### Journey 2: New Rental - First Time Customer (2 minutes)

**Actor:** Staff Member  
**Trigger:** Walk-in customer wants to rent a vehicle

1. **Customer Creation** (30 seconds)
   - Click "New Customer" button
   - Enter customer details (name, ID number, phone, email, address)
   - Take photo of customer ID document
   - Save customer to database

2. **Vehicle Selection** (30 seconds)
   - View fleet calendar or available vehicles list
   - Filter by vehicle type if needed
   - Select available vehicle
   - Verify vehicle is clean and ready

3. **Contract Details** (30 seconds)
   - Enter rental start/end dates
   - Select pricing tier (hourly/daily/weekly/monthly)
   - Add extras (GPS, child seat, etc.)
   - System calculates total price with VAT
   - Enter current fuel level and odometer reading

4. **Documentation** (30 seconds)
   - Take 4 photos of vehicle condition (front, back, sides)
   - Mark any existing damage on photos
   - Capture customer signature on tablet/screen
   - Capture staff signature

5. **Payment & Finalization** (30 seconds)
   - Select payment method: Card / Twint / Cash
   - Process payment (mark as received)
   - Generate PDF contract with all photos embedded
   - Print/email contract to customer
   - Hand over vehicle keys

### Journey 3: New Rental - Returning Customer (90 seconds)

**Actor:** Staff Member  
**Trigger:** Existing customer wants to rent a vehicle

1. **Customer Search** (15 seconds)
   - Search by name or ID number
   - Select customer from results
   - Verify customer not blacklisted
   - Review rental history

2. **Quick Booking** (30 seconds)
   - Select vehicle from calendar view
   - Enter dates/hours and calculate price
   - Select rate type (hourly/daily/weekly/monthly)
   - Add any extras needed

3. **Fast Documentation** (30 seconds)
   - Take vehicle photos
   - Capture signatures
   - Generate contract PDF

4. **Payment & Completion** (15 seconds)
   - Select payment method (Card/Twint/Cash)
   - Process payment
   - Provide contract
   - Hand over keys

### Journey 4: Rental Return - Standard (1 minute)

**Actor:** Staff Member  
**Trigger:** Customer returns rental vehicle

1. **Contract Lookup** (15 seconds)
   - Search active rentals by customer name or plate number
   - Open active contract

2. **Return Inspection** (15 seconds)
   - Enter return odometer reading
   - Enter return fuel level
   - Take photos of any new damage

3. **Calculate Charges** (15 seconds)
   - System calculates kilometer overage (if any)
   - System calculates fuel difference charge (if applicable)
   - Add any damage charges
   - Show total additional charges

4. **Finalize Return** (15 seconds)
   - Select payment method for additional charges (if any)
   - Process payment (Card/Twint/Cash)
   - Generate final invoice PDF with charges
   - Mark vehicle as available in system
   - Close contract

### Journey 5: Rental Return - With Issues (2 minutes)

**Actor:** Staff Member  
**Trigger:** Customer returns vehicle with damage/issues

1. **Document Issues** (45 seconds)
   - Take detailed photos of damage
   - Add annotations to damage photos
   - Write damage description notes

2. **Calculate Charges** (30 seconds)
   - Enter repair cost estimate
   - Add administrative fees
   - Calculate total with fuel/km charges

3. **Customer Resolution** (30 seconds)
   - Show charges breakdown to customer
   - Capture customer acknowledgment signature
   - Select payment method (Card/Twint/Cash)
   - Process payment
   - Generate detailed invoice with damage photos

4. **Follow-up Actions** (15 seconds)
   - Flag vehicle for maintenance
   - Create insurance claim note
   - Update customer record

### Journey 6: Quick Vehicle Status Check

**Actor:** Staff Member  
**Trigger:** Phone inquiry about vehicle availability

1. **Calendar View** (10 seconds)
   - Open fleet calendar from staff dashboard
   - Check specific date range
   - See which vehicles are available

2. **Provide Information** (10 seconds)
   - Quote hourly/daily/weekly rate
   - Inform about vehicle types available
   - Potentially pre-reserve vehicle

### Journey 7: Customer Blacklist Management

**Actor:** Staff Member  
**Trigger:** Problematic customer behavior

1. **Find Customer** (10 seconds)
   - Search customer database
   - Open customer record

2. **Set Blacklist Status** (10 seconds)
   - Toggle blacklist flag
   - Add note about reason
   - Save changes

### Journey 8: End of Day Reconciliation

**Actor:** Staff Member  
**Trigger:** End of shift

1. **Review Day's Transactions** (30 seconds)
   - Open staff dashboard
   - View today's completed rentals
   - View today's returns
   - Check cash payments received

2. **Prepare Handover** (15 seconds)
   - Note any pending issues
   - Check tomorrow's early pickups
   - Log out of system

## Owner/Admin User Journeys

### Journey 9: Daily Revenue Check

**Actor:** Owner  
**Trigger:** Morning routine or end-of-day review

1. **Access Dashboard** (5 seconds)
   - Login with owner credentials
   - Dashboard loads automatically

2. **Review Metrics** (30 seconds)
   - View today's revenue by payment type (Card/Twint/Cash)
   - See number of contracts created
   - Check additional revenue from fuel/km
   - Compare to yesterday/last week

3. **Identify Opportunities** (15 seconds)
   - See which vehicles are most utilized
   - Identify under-performing vehicles
   - Note peak rental times

### Journey 10: ROI Validation

**Actor:** Owner  
**Trigger:** Monthly subscription renewal consideration

1. **Open ROI Dashboard** (5 seconds)
   - Access owner dashboard
   - Navigate to ROI view

2. **Review Savings** (20 seconds)
   - See hours saved vs paper process
   - Calculate labor cost savings
   - View additional revenue captured

3. **Make Decision** (10 seconds)
   - Compare subscription cost to savings
   - Verify positive ROI
   - Continue subscription

### Journey 11: Staff Account Management

**Actor:** Owner/Admin  
**Trigger:** New employee or role change

1. **Access User Management** (10 seconds)
   - Login as owner
   - Navigate to users section

2. **Create/Modify Account** (30 seconds)
   - Add new staff member
   - Set username and password
   - Assign Staff role (limited permissions)
   - Configure dashboard access
   - Save account

### Journey 12: Fleet Overview Management

**Actor:** Owner  
**Trigger:** Fleet planning or maintenance scheduling

1. **Review Fleet Status** (20 seconds)
   - Open vehicle management
   - See all vehicles and current status
   - Check maintenance flags
   - View utilization rates

2. **Update Vehicle Information** (30 seconds)
   - Edit vehicle details
   - Set hourly/daily/weekly/monthly rates
   - Update maintenance status
   - Set availability dates
   - Save changes

### Journey 13: Financial Reconciliation

**Actor:** Owner  
**Trigger:** End of month accounting

1. **Generate Reports** (15 seconds)
   - Access financial dashboard
   - Select date range
   - View total revenue breakdown by payment method

2. **Export for Accounting** (15 seconds)
   - See payment summary (Card/Twint/Cash totals)
   - Track all transactions
   - Export report for bookkeeping

### Journey 14: Quick Contract Lookup

**Actor:** Owner or Staff  
**Trigger:** Customer dispute or insurance claim

1. **Search Contracts** (15 seconds)
   - Search by customer name, date, or vehicle
   - Find specific contract

2. **Review Documentation** (30 seconds)
   - Open PDF contract
   - Review embedded photos
   - Check signatures and timestamps
   - Check payment method and amount
   - Use for dispute resolution

## System-Initiated Journeys

### Journey 15: Automatic Backup

**Actor:** System  
**Trigger:** Daily at 2 AM

1. **Backup Process** (automatic)
   - System creates database backup
   - Stores in secure location
   - Maintains 30-day backup history
   - Sends confirmation to owner email

### Journey 16: Session Timeout

**Actor:** System  
**Trigger:** 30 minutes of inactivity

1. **Security Process** (automatic)
   - System detects inactivity
   - Logs out user automatically
   - Requires re-authentication
   - Preserves any draft contract data
