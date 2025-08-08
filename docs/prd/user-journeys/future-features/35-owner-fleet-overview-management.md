# Fleet Overview Management

**Actor:** Owner  
**Trigger:** Fleet planning or maintenance scheduling

## Journey Steps

### 1. Review Fleet Status (20 seconds)

- Open vehicle management
- See all vehicles and current status
- Check maintenance flags
- View utilization rates

### 2. Update Vehicle Information (30 seconds)

- Edit vehicle details
- Set hourly/daily/weekly/monthly rates
- Update maintenance status
- Set availability dates
- Save changes

## Time Estimate

Total time: ~50 seconds for fleet management tasks

## Key Features Required

- Comprehensive vehicle management interface
- Fleet status overview
- Maintenance tracking system
- Utilization rate calculations
- Vehicle detail editing
- Flexible rate configuration
- Availability calendar management
- Bulk update capabilities

## Visual Flow Chart

```mermaid
flowchart TD
    Start([Fleet planning or maintenance scheduling]) --> OpenVehicles[🚗 Open vehicle management<br/>20 seconds]
    OpenVehicles --> ReviewStatus[📊 Review Fleet Status]

    ReviewStatus --> CheckVehicles[See all vehicles and current status]
    ReviewStatus --> CheckMaintenance[Check maintenance flags]
    ReviewStatus --> CheckUtilization[View utilization rates]

    CheckVehicles --> UpdateInfo[✏️ Update Vehicle Information<br/>30 seconds]
    CheckMaintenance --> UpdateInfo
    CheckUtilization --> UpdateInfo

    UpdateInfo --> EditDetails[Edit vehicle details]
    UpdateInfo --> SetRates[Set hourly/daily/weekly/monthly rates]
    UpdateInfo --> UpdateMaintenanceStatus[Update maintenance status]
    UpdateInfo --> SetAvailability[Set availability dates]

    EditDetails --> SaveChanges[💾 Save changes]
    SetRates --> SaveChanges
    UpdateMaintenanceStatus --> SaveChanges
    SetAvailability --> SaveChanges

    SaveChanges --> Verification{✅ Changes saved successfully?}

    Verification -->|Yes| Complete[Fleet management complete<br/>Total: ~50 seconds]
    Verification -->|No| ErrorHandle[Handle error and retry]

    ErrorHandle --> UpdateInfo
    Complete --> MoreUpdates{More vehicles to update?}

    MoreUpdates -->|Yes| UpdateInfo
    MoreUpdates -->|No| End([End])

    classDef accessStyle fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef reviewStyle fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef updateStyle fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef saveStyle fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef decisionStyle fill:#ede7f6,stroke:#512da8,stroke-width:2px
    classDef successStyle fill:#f1f8e9,stroke:#33691e,stroke-width:2px
    classDef errorStyle fill:#ffebee,stroke:#c62828,stroke-width:2px

    class OpenVehicles accessStyle
    class ReviewStatus,CheckVehicles,CheckMaintenance,CheckUtilization reviewStyle
    class UpdateInfo,EditDetails,SetRates,UpdateMaintenanceStatus,SetAvailability updateStyle
    class SaveChanges saveStyle
    class Verification,MoreUpdates decisionStyle
    class Complete successStyle
    class ErrorHandle errorStyle
```
