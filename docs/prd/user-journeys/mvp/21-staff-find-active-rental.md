# Find Active Rental

**Actor:** Staff Member  
**Trigger:** Customer returns without paperwork, or need to check rental status **Frequency:**
Multiple times daily

## Journey Steps

### 1. Quick Search (5 seconds)

- Access active rentals list
- Search by ONE of:
  - License plate (most common)
  - Customer name (partial match)
  - Phone number
  - Contract number

### 2. View Results (5 seconds)

- System shows matching active rentals
- Display key info:
  - Customer name
  - Vehicle plate
  - Expected return date/time
  - Days overdue (if any)

### 3. Open Rental (5 seconds)

- Click to open full contract
- Verify with customer if needed
- Proceed to return process

## Time Estimate

Total: ~15 seconds

## Why This is MVP Critical

- **Common scenario:** Customer loses paperwork
- **Return efficiency:** Can't process return without finding rental
- **Phone inquiries:** "Is my rental due today?"
- **Overdue monitoring:** Quick check who's late

## Key Features Required

- Active rentals filter (exclude completed)
- Multi-field search
- Quick results display
- Direct link to return process

## Simple Implementation

- Basic search only (no filters)
- Active/completed flag on contracts
- Simple list view
- No advanced sorting

## Common Use Cases

### Walk-in Return

"I'm returning the Toyota" → Search by plate → Found → Process return

### Phone Inquiry

"When is my rental due?" → Search by name → Tell customer

### Overdue Check

Morning routine → View all active → Sort by return date → Call late customers

## Not Included in MVP

- Advanced filters (date range, vehicle type)
- Bulk operations
- Export functionality
- SMS/email from system

## Visual Flow

```
Search → Results → Select → Process
  ↓        ↓         ↓        ↓
 5 sec    5 sec    5 sec    Continue
```
