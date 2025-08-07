# Component Hierarchy and Organization

## Architecture Decision Record (ADR-001): Component Organization

### Status: Accepted
### Date: 2025-08-07
### Context: Need for scalable, maintainable component architecture

## Component Hierarchy Structure

### 1. Atomic Design Layers

```
src/components/
├── atoms/                  # Basic building blocks
│   ├── Button/
│   ├── Input/
│   ├── Label/
│   ├── Icon/
│   ├── Badge/
│   ├── Avatar/
│   ├── Spinner/
│   └── Divider/
├── molecules/              # Simple component combinations
│   ├── FormField/
│   ├── SearchBox/
│   ├── DatePicker/
│   ├── DropdownMenu/
│   ├── Card/
│   ├── Toast/
│   ├── Modal/
│   └── Tooltip/
├── organisms/              # Complex UI sections
│   ├── Header/
│   ├── Navigation/
│   ├── DataTable/
│   ├── Form/
│   ├── VehicleCard/
│   ├── BookingCard/
│   ├── UserProfile/
│   └── Dashboard/
├── templates/              # Page-level layouts
│   ├── AppLayout/
│   ├── DashboardLayout/
│   ├── AuthLayout/
│   └── ErrorLayout/
└── pages/                  # Complete page implementations
    ├── HomePage/
    ├── VehiclesPage/
    ├── BookingsPage/
    ├── CustomersPage/
    └── ReportsPage/
```

### 2. Domain-Specific Components

```
src/components/domain/
├── vehicle/
│   ├── VehicleList/
│   ├── VehicleDetails/
│   ├── VehicleForm/
│   ├── VehicleFilter/
│   └── VehicleStatus/
├── booking/
│   ├── BookingForm/
│   ├── BookingList/
│   ├── BookingCalendar/
│   ├── BookingStatus/
│   └── BookingSummary/
├── customer/
│   ├── CustomerForm/
│   ├── CustomerList/
│   ├── CustomerProfile/
│   └── CustomerHistory/
├── payment/
│   ├── PaymentForm/
│   ├── PaymentHistory/
│   ├── InvoiceGenerator/
│   └── PricingCalculator/
└── reports/
    ├── RevenueChart/
    ├── UtilizationChart/
    ├── CustomerAnalytics/
    └── ExportTools/
```

### 3. Component File Structure

Each component follows consistent structure:

```
ComponentName/
├── index.ts                # Barrel export
├── ComponentName.tsx       # Main component
├── ComponentName.test.tsx  # Unit tests
├── ComponentName.stories.tsx # Storybook stories
├── ComponentName.styles.ts # Styled components
├── types.ts               # TypeScript types
├── hooks/                 # Component-specific hooks
├── utils/                 # Component utilities
└── README.md              # Component documentation
```

## Organization Principles

### 1. Separation of Concerns
- **Presentational Components**: Pure UI rendering
- **Container Components**: Data fetching and state management
- **Hook Components**: Logic encapsulation

### 2. Dependency Direction
```
Pages → Templates → Organisms → Molecules → Atoms
Domain Components → Base Components
```

### 3. Import Strategies

```typescript
// ✅ Good: Barrel imports from component level
import { Button, Input } from '@/components/atoms'
import { VehicleCard } from '@/components/domain/vehicle'

// ❌ Bad: Deep imports
import Button from '@/components/atoms/Button/Button'
```

### 4. Component Composition Patterns

```typescript
// Compound Components Pattern
<Form>
  <Form.Field>
    <Form.Label>Name</Form.Label>
    <Form.Input />
    <Form.Error />
  </Form.Field>
</Form>

// Render Props Pattern
<DataTable>
  {({ data, loading }) => (
    loading ? <Spinner /> : <VehicleList vehicles={data} />
  )}
</DataTable>

// Higher-Order Component Pattern
export const withAuth = (Component) => (props) => {
  // Authentication logic
  return <Component {...props} />
}
```

### 5. State Management Integration

```typescript
// Local State (useState/useReducer)
const [isOpen, setIsOpen] = useState(false)

// Global State (Zustand)
const { vehicles, addVehicle } = useVehicleStore()

// Server State (React Query)
const { data: bookings } = useBookings()

// Form State (React Hook Form)
const { register, handleSubmit } = useForm<BookingForm>()
```

## Component Registry

### Core Components (22)
1. Button - Interactive elements
2. Input - Form inputs
3. Select - Dropdowns
4. Checkbox - Boolean inputs
5. Radio - Single choice
6. TextArea - Multi-line text
7. Label - Form labels
8. Icon - SVG icons
9. Badge - Status indicators
10. Avatar - User images
11. Spinner - Loading states
12. Progress - Progress bars
13. Alert - Notifications
14. Card - Content containers
15. Modal - Overlays
16. Tooltip - Contextual help
17. Tabs - Content switching
18. Accordion - Collapsible content
19. Breadcrumb - Navigation
20. Pagination - Data navigation
21. Table - Data display
22. Calendar - Date selection

### Domain Components (15)
1. VehicleCard - Vehicle display
2. BookingForm - Reservation form
3. CustomerProfile - User details
4. PaymentForm - Payment processing
5. PricingCalculator - Cost calculation
6. AvailabilityChecker - Vehicle availability
7. LocationPicker - Rental locations
8. InsuranceSelector - Insurance options
9. DocumentUpload - File handling
10. SignatureCapture - Digital signatures
11. DamageReport - Vehicle condition
12. MaintenanceScheduler - Service planning
13. RevenueChart - Financial analytics
14. UtilizationReport - Fleet usage
15. CustomerAnalytics - User insights

## Performance Considerations

### 1. Bundle Splitting
```typescript
// Code splitting by route
const VehiclesPage = lazy(() => import('./VehiclesPage'))

// Component-level splitting
const DataTable = lazy(() => import('./DataTable'))
```

### 2. Tree Shaking
```typescript
// Optimized imports
import { Button } from '@/components/atoms'
// Instead of
import * as Components from '@/components'
```

### 3. Memoization Strategy
```typescript
// Expensive computations
const expensiveValue = useMemo(() => 
  computeExpensiveValue(data), [data]
)

// Component memoization
export default memo(VehicleCard)
```

## Testing Strategy

### 1. Unit Testing
- Component rendering
- Props validation
- Event handling
- Accessibility compliance

### 2. Integration Testing
- Component interactions
- Form submissions
- API integrations

### 3. Visual Testing
- Storybook visual regression
- Chromatic snapshots
- Cross-browser testing

## Quality Metrics

### Component Health Score
- TypeScript coverage > 95%
- Test coverage > 80%
- Accessibility score = 100%
- Bundle size < 50KB per route
- Performance budget < 100ms TTI

### Maintenance Indicators
- Cyclomatic complexity < 10
- Props interface stability
- Breaking change frequency
- Documentation completeness