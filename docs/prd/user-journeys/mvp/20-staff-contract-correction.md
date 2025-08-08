# Contract Correction

**Actor:** Staff Member  
**Trigger:** Mistake discovered in contract after creation/signing **Frequency:** Daily (5-10% of
contracts need corrections)

## Journey Steps

### 1. Identify Error (10 seconds)

- Customer points out mistake
- Or staff notices error
- Common: wrong dates, price, vehicle, spelling

### 2. Access Contract (10 seconds)

- Search by contract number or customer
- Open active contract
- Review what needs correction

### 3. Void Original (15 seconds)

- Click "Void Contract"
- Select void reason:
  - Data entry error
  - Customer request
  - System error
  - Price override needed
- Add explanation note
- Original marked VOID (kept for audit)

### 4. Create Corrected Contract (30 seconds)

- System pre-fills from voided contract
- Make necessary corrections
- Verify all details with customer
- Generate new contract number

### 5. Re-sign and Finalize (15 seconds)

- Capture signatures again
- Generate corrected PDF
- Provide to customer
- Link to original for audit trail

## Time Estimate

Total: ~80 seconds

## Why This is MVP Critical

- **Legal requirement:** Can't have incorrect legal documents
- **Daily occurrence:** 5-10% error rate is normal
- **No workaround:** Can't white-out digital contracts
- **Customer satisfaction:** Fix mistakes quickly

## Key Features Required

- Void capability with reason codes
- Audit trail maintenance
- Contract cloning/pre-fill
- Original contract preservation
- Corrected contract linking

## Simple Implementation

- No approval workflow (add in Phase 2)
- No automatic refund calculations
- Basic reason codes only
- Manual signature recapture

## Visual Flow

```
Error Found → Void Original → Create New → Re-sign → Done
     ↓             ↓              ↓          ↓        ↓
   10 sec       15 sec         30 sec     15 sec   Total: 80s
```
