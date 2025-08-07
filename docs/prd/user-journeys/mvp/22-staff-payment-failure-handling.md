# Payment Failure Handling

**Actor:** Staff Member  
**Trigger:** Card declined, insufficient funds, or payment error
**Frequency:** Multiple times daily (10-15% of transactions)

## Journey Steps

### 1. Payment Attempt Fails (10 seconds)
- Card declined message appears
- Common reasons:
  - Insufficient funds
  - Card expired
  - Wrong PIN
  - Daily limit exceeded
  - Technical issue

### 2. Inform Customer (10 seconds)
- Explain issue politely
- Suggest alternatives:
  - Different card
  - Cash payment
  - Bank transfer
  - Split payment methods

### 3. Record Failed Attempt (15 seconds)
- Log payment failure
- Select failure reason:
  - Insufficient funds
  - Card declined
  - Technical error
  - Customer canceled
- Add notes if needed

### 4. Try Alternative Payment (30 seconds)
Options:
- **Different Card:** Enter new card details
- **Cash:** Accept cash, mark as paid
- **Bank Transfer:** Generate QR-bill for later
- **Partial Payment:** Accept what's available
- **Hold Contract:** Save as unpaid, car stays

### 5. Update Contract Status (15 seconds)
Depending on resolution:
- **Paid:** Continue with rental
- **Partial:** Note amount due
- **Unpaid:** Hold vehicle, no keys
- **Canceled:** Void contract

## Time Estimate
Total: ~80 seconds

## Why This is MVP Critical
- **Daily occurrence:** 10-15% of payments fail first attempt
- **Revenue protection:** Can't release vehicle without payment
- **Customer satisfaction:** Need smooth resolution
- **Legal requirement:** Must document payment status

## Key Features Required
- Payment failure logging
- Multiple payment method support
- Partial payment tracking
- Contract hold status
- Payment retry capability
- Failure reason tracking

## Common Scenarios

### Scenario 1: Card Limit
Customer card has CHF 500 limit, rental is CHF 600
→ Take CHF 500 on card, CHF 100 cash
→ Mark both payments in system

### Scenario 2: Technical Issue
Card reader not working
→ Take card details manually
→ Process later when system works
→ Generate QR-bill as backup

### Scenario 3: No Payment Method
Customer has no valid payment
→ Hold contract as unpaid
→ Don't release vehicle
→ Manager approval required

## Edge Cases Handled
- Foreign cards with different limits
- Corporate cards requiring approval
- Prepaid cards with insufficient balance
- Bank holidays affecting transfers
- Network outages

## What's NOT in MVP
- Automatic retry attempts
- Payment plan setup
- Credit check integration
- Collection agency handoff
- Automated dunning

## Visual Flow
```
Payment Fails → Inform Customer → Log Failure → Try Alternative → Update Status
      ↓              ↓                ↓              ↓              ↓
    10 sec         10 sec           15 sec         30 sec         15 sec
                                                 Total: ~80 seconds
```