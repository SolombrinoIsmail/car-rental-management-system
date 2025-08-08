# Critical MVP Journey Additions

## Final MVP Journey Count: 20 (was 16, added 4 critical)

## The 4 Critical Additions

### 1. 🔧 Initial System Setup (Journey 00)

**Why Critical:** System unusable without configuration

- One-time 15-minute setup
- Company details, VAT, bank info
- Required for QR-bills and legal compliance
- Gates all other operations

### 2. ❌ Contract Correction (Journey 20)

**Why Critical:** 5-10% of contracts have mistakes

- Wrong dates, prices, vehicles
- Legal documents cannot be wrong
- No workaround without void capability
- Daily occurrence

### 3. 🔍 Find Active Rental (Journey 21)

**Why Critical:** Different from historical lookup

- Customer returns without paperwork
- Need to find by license plate
- Required for walk-in returns
- Multiple times daily

### 4. 🔐 Password Reset (Journey 39)

**Why Critical:** Weekly occurrence minimum

- No email automation in MVP
- Staff productivity blocked
- Admin-controlled for security
- No self-service option

## Why ONLY These 4

We consciously did NOT add:

- ❌ **Payment retry/failure** - Just mark unpaid, handle manually
- ❌ **Deposit handling** - Too complex for MVP, use manual process
- ❌ **Report export** - Can screenshot/print for now
- ❌ **Bulk operations** - Not needed for small volumes
- ❌ **Notifications** - Check actively, no automation
- ❌ **Data import** - One-time manual entry acceptable
- ❌ **Price overrides** - Void and recreate with correct price
- ❌ **Refund processing** - Handle outside system initially

## Complete MVP Journey List (20 total)

### Setup & Access (3)

- 00 - Initial System Setup ⭐ NEW
- 38 - Staff Account Management
- 39 - Password Reset ⭐ NEW

### Core Rental Flow (6)

- 08 - New Rental First Time
- 09 - New Rental Returning
- 10 - Contract Extension
- 13 - Return Standard
- 14 - Return with Issues
- 20 - Contract Correction ⭐ NEW

### Operational Support (4)

- 16 - Vehicle Maintenance Flag
- 18 - Quick Vehicle Status
- 19 - Customer Blacklist
- 21 - Find Active Rental ⭐ NEW

### Fleet Management (3)

- 32 - Add Vehicle
- 33 - Update Vehicle
- 36 - Contract Lookup

### Business Oversight (2)

- 30 - Daily Revenue Check
- 31 - ROI Validation

### System (2)

- 50 - Automatic Backup
- 51 - Session Timeout

## Impact on Timeline

Adding these 4 journeys adds approximately:

- 1 week of development time
- Critical for Day 1 operations
- Still achievable in 16-20 week timeline
- Prevents major support issues

## Success Criteria

MVP cannot launch without: ✅ All 20 journeys implemented ✅ Each tested with real users ✅ Combined
daily journey time < 15 minutes ✅ Manual workarounds documented for gaps

---

_These 20 journeys represent the absolute minimum for operational viability._
