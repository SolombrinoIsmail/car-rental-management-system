# User Journeys Index

This directory contains all user journeys for the Car Rental Management System, organized by user
type and function with sequential numbering.

## Numbering Convention

- **01-29**: Staff User Journeys
- **30-49**: Owner/Admin User Journeys
- **50-59**: System-Initiated Journeys

## Staff User Journeys (01-29)

### Daily Operations

- [01 - Staff Dashboard Review](./01-staff-dashboard-review.md) - Daily start routine for staff
  members
- [02 - End of Day Reconciliation](./02-staff-end-of-day-reconciliation.md) - Shift closing
  procedures
- [03 - Shift Handover](./03-staff-shift-handover.md) - End of shift handover process (2.5 minutes)

### Reservations & Bookings

- [04 - Create Reservation](./04-staff-create-reservation.md) - Book vehicle for future date (90
  seconds)
- [05 - Reservation to Rental Conversion](./05-staff-reservation-to-rental.md) - Convert reservation
  to active rental (65 seconds)
- [06 - Handle No-Show](./06-staff-handle-no-show.md) - Process no-show reservations (45 seconds)
- [07 - Cancellation Process](./07-staff-cancellation-process.md) - Handle reservation/rental
  cancellations (50 seconds)

### Rental Creation

- [08 - New Rental - First Time Customer](./08-staff-new-rental-first-time-customer.md) - Complete
  rental process for new customers (2 minutes)
- [09 - New Rental - Returning Customer](./09-staff-new-rental-returning-customer.md) - Streamlined
  rental for existing customers (90 seconds)

### Rental Management

- [10 - Contract Extension](./10-staff-contract-extension.md) - Extend active rental period (55
  seconds)
- [11 - Early Return](./11-staff-early-return.md) - Process early vehicle returns (70 seconds)
- [12 - Overdue Management](./12-staff-overdue-management.md) - Handle overdue rentals (55 seconds +
  monitoring)

### Rental Returns

- [13 - Rental Return - Standard](./13-staff-rental-return-standard.md) - Normal vehicle return
  process (65 seconds)
- [14 - Rental Return - With Issues](./14-staff-rental-return-with-issues.md) - Return process with
  damage/issues (2 minutes)

### Vehicle Operations

- [15 - Vehicle Preparation](./15-staff-vehicle-preparation.md) - Clean and prepare vehicle between
  rentals (60 seconds)
- [16 - Vehicle Maintenance Flag](./16-staff-vehicle-maintenance-flag.md) - Flag vehicle for
  service/repair (65 seconds)

### Financial Management

- [17 - Deposit Management](./17-staff-deposit-management.md) - Handle deposits throughout rental
  lifecycle (45 seconds total)

### Quick Actions

- [18 - Quick Vehicle Status Check](./18-staff-quick-vehicle-status-check.md) - Fast availability
  check for phone inquiries
- [19 - Customer Blacklist Management](./19-staff-customer-blacklist-management.md) - Managing
  problematic customers

## Owner/Admin User Journeys (30-49)

### Daily Management

- [30 - Daily Revenue Check](./30-owner-daily-revenue-check.md) - Morning/evening revenue review
- [31 - ROI Validation](./31-owner-roi-validation.md) - Monthly subscription value assessment

### Fleet Management

- [32 - Add Vehicle to Fleet](./32-owner-add-vehicle.md) - Add new vehicle to rental fleet (2 min 10
  sec)
- [33 - Update Vehicle Information](./33-owner-update-vehicle.md) - Modify vehicle details, rates,
  or status (30-60 seconds)
- [34 - Remove Vehicle from Fleet](./34-owner-remove-vehicle.md) - Retire vehicle from active fleet
  (60-90 seconds)
- [35 - Fleet Overview Management](./35-owner-fleet-overview-management.md) - Vehicle fleet planning
  and maintenance
- [36 - Quick Contract Lookup](./36-owner-quick-contract-lookup.md) - Finding contracts for
  disputes/claims

### Financial Operations

- [37 - Financial Reconciliation](./37-owner-financial-reconciliation.md) - End of month accounting
  processes

### System Administration

- [38 - Staff Account Management](./38-admin-staff-account-management.md) - Creating and managing
  staff accounts

## System-Initiated Journeys (50-59)

### Automated Processes

- [50 - Automatic Backup](./50-system-automatic-backup.md) - Daily automated data backup at 2 AM
- [51 - Session Timeout](./51-system-session-timeout.md) - Security timeout after 10 minutes of
  inactivity

## Journey Categories Summary

### By Frequency

**High Frequency (Multiple times daily)**

- 01 - Staff Dashboard Review
- 08, 09 - New Rental processes
- 13, 14 - Rental Returns
- 18 - Quick Vehicle Status Checks
- 04 - Reservation Creation
- 17 - Deposit Management

**Daily**

- 02 - End of Day Reconciliation
- 30 - Daily Revenue Check
- 50 - Automatic Backup
- 03 - Shift Handover
- 12 - Overdue Management
- 15 - Vehicle Preparation (multiple times)
- 16 - Vehicle Maintenance Checks

**Weekly/Monthly**

- 35 - Fleet Overview Management
- 37 - Financial Reconciliation
- 31 - ROI Validation
- 32 - Add Vehicle (as needed)
- 33 - Update Vehicle Information
- 34 - Remove Vehicle (rare)

**As Needed**

- 19 - Customer Blacklist Management
- 38 - Staff Account Management
- 36 - Quick Contract Lookup
- 10 - Contract Extensions
- 11 - Early Returns
- 07 - Cancellations
- 06 - No-Show Handling

### By Time Investment

**Under 1 minute**

- 01 - Staff Dashboard Review (30s)
- 18 - Quick Vehicle Status Check (20s)
- 19 - Customer Blacklist Management (20s)
- 02 - End of Day Reconciliation (45s)
- 36 - Quick Contract Lookup (45s)
- 06 - Handle No-Show (45s)
- 17 - Deposit Management (45s total)
- 07 - Cancellation Process (50s)
- 10 - Contract Extension (55s)
- 12 - Overdue Management (55s initial)

**1-2 minutes**

- 15 - Vehicle Preparation (60s)
- 13 - Rental Return - Standard (65s)
- 05 - Reservation to Rental Conversion (65s)
- 16 - Vehicle Maintenance Flag (65s)
- 11 - Early Return (70s)
- 09 - New Rental - Returning Customer (90s)
- 04 - Create Reservation (90s)
- 08 - New Rental - First Time Customer (2 min)
- 14 - Rental Return - With Issues (2 min)

**Over 2 minutes**

- 32 - Add Vehicle to Fleet (2 min 10 sec)
- 03 - Shift Handover (2.5 min)

**Variable Time**

- 33 - Update Vehicle Information (30-60s)
- 34 - Remove Vehicle from Fleet (60-90s)

## Complete Journey List (Numerical Order)

| #   | Journey Name                | Category            | Time    |
| --- | --------------------------- | ------------------- | ------- |
| 01  | Staff Dashboard Review      | Staff - Daily Ops   | 30s     |
| 02  | End of Day Reconciliation   | Staff - Daily Ops   | 45s     |
| 03  | Shift Handover              | Staff - Daily Ops   | 2.5 min |
| 04  | Create Reservation          | Staff - Bookings    | 90s     |
| 05  | Reservation to Rental       | Staff - Bookings    | 65s     |
| 06  | Handle No-Show              | Staff - Bookings    | 45s     |
| 07  | Cancellation Process        | Staff - Bookings    | 50s     |
| 08  | New Rental - First Time     | Staff - Creation    | 2 min   |
| 09  | New Rental - Returning      | Staff - Creation    | 90s     |
| 10  | Contract Extension          | Staff - Management  | 55s     |
| 11  | Early Return                | Staff - Management  | 70s     |
| 12  | Overdue Management          | Staff - Management  | 55s+    |
| 13  | Rental Return - Standard    | Staff - Returns     | 65s     |
| 14  | Rental Return - With Issues | Staff - Returns     | 2 min   |
| 15  | Vehicle Preparation         | Staff - Vehicle Ops | 60s     |
| 16  | Vehicle Maintenance Flag    | Staff - Vehicle Ops | 65s     |
| 17  | Deposit Management          | Staff - Financial   | 45s     |
| 18  | Quick Vehicle Status Check  | Staff - Quick       | 20s     |
| 19  | Customer Blacklist          | Staff - Quick       | 20s     |
| 30  | Daily Revenue Check         | Owner - Daily       | 50s     |
| 31  | ROI Validation              | Owner - Daily       | 35s     |
| 32  | Add Vehicle                 | Owner - Fleet       | 2m 10s  |
| 33  | Update Vehicle              | Owner - Fleet       | 30-60s  |
| 34  | Remove Vehicle              | Owner - Fleet       | 60-90s  |
| 35  | Fleet Overview              | Owner - Fleet       | 50s     |
| 36  | Quick Contract Lookup       | Owner - Fleet       | 45s     |
| 37  | Financial Reconciliation    | Owner - Financial   | 30s     |
| 38  | Staff Account Management    | Admin               | 40s     |
| 50  | Automatic Backup            | System              | Auto    |
| 51  | Session Timeout             | System              | Auto    |

## Original Documentation

- [Core User Journeys](./core-user-journeys.md) - Original consolidated journey document
- [User Journey Diagrams](./user-journey-diagrams.md) - Visual representations of user flows
