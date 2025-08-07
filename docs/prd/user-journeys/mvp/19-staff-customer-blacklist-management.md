# Customer Blacklist Management

**Actor:** Staff Member  
**Trigger:** Problematic customer behavior

## Journey Steps

### 1. Find Customer (10 seconds)
- Search customer database
- Open customer record

### 2. Set Blacklist Status (10 seconds)
- Toggle blacklist flag
- Add note about reason
- Save changes

## Time Estimate
Total time: ~20 seconds for blacklist management

## Key Features Required
- Customer search functionality
- Blacklist flag toggle
- Notes/reason field for blacklisting
- Audit trail for blacklist changes
- Immediate effect on rental eligibility

## Visual Flow Chart

```mermaid
flowchart TD
    A[⚠️ Problematic Customer Behavior] --> B[Access Staff Dashboard<br/>~2s]
    B --> C[Search Customer Database<br/>~5s]
    C --> D{Customer Found?}
    D -->|No| E[Check Different Search Terms<br/>~3s]
    E --> C
    D -->|Yes| F[Open Customer Record<br/>~3s]
    
    F --> G[Review Customer History<br/>~5s]
    G --> H{Action Required?}
    H -->|Blacklist| I[Toggle Blacklist Flag<br/>~2s]
    H -->|Remove Blacklist| J[Remove Blacklist Flag<br/>~2s]
    H -->|No Action| K[Close Record]
    
    I --> L[Add Blacklist Reason Notes<br/>~5s]
    J --> M[Add Removal Reason Notes<br/>~5s]
    
    L --> N[Save Changes<br/>~3s]
    M --> N
    N --> O[System Updates Rental Eligibility<br/>Auto]
    O --> P[Action Complete ✅]
    
    K --> Q[No Changes Made]
    
    style A fill:#ffebee
    style D fill:#fff3e0
    style H fill:#fff3e0
    style I fill:#ffcdd2
    style J fill:#c8e6c9
    style P fill:#e8f5e8
    style Q fill:#f5f5f5
```