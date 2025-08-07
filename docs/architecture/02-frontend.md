# CRMS Frontend Architecture

## Frontend Architecture (Next.js 14 App Router)

```
apps/web/
├── app/                              # Next.js 14 App Directory
│   ├── (auth)/                       # Authentication routes group
│   │   ├── login/
│   │   │   ├── page.tsx             # Login page
│   │   │   └── layout.tsx           # Auth layout
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   │
│   ├── (dashboard)/                  # Protected dashboard routes
│   │   ├── layout.tsx                # Dashboard layout with sidebar
│   │   ├── page.tsx                  # Dashboard home
│   │   │
│   │   ├── contracts/
│   │   │   ├── page.tsx              # Contracts list
│   │   │   ├── new/
│   │   │   │   ├── page.tsx          # New contract wizard
│   │   │   │   └── components/       # Contract creation components
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx          # Contract details
│   │   │   │   ├── edit/page.tsx     # Edit contract
│   │   │   │   └── return/page.tsx   # Process return
│   │   │   └── quick-create/         # 2-minute flow
│   │   │
│   │   ├── customers/
│   │   │   ├── page.tsx              # Customers list
│   │   │   ├── new/page.tsx          # Add customer
│   │   │   └── [id]/                 # Customer details
│   │   │
│   │   ├── vehicles/
│   │   │   ├── page.tsx              # Fleet overview
│   │   │   ├── calendar/page.tsx     # Availability calendar
│   │   │   ├── new/page.tsx          # Add vehicle
│   │   │   └── [id]/                 # Vehicle details
│   │   │
│   │   ├── payments/
│   │   │   ├── page.tsx              # Payments list
│   │   │   ├── pending/page.tsx      # Pending payments
│   │   │   └── reconciliation/       # Swiss QR reconciliation
│   │   │
│   │   ├── reservations/
│   │   ├── reports/
│   │   └── settings/
│   │
│   ├── api/                          # API Routes
│   │   ├── auth/[...supabase]/      # Supabase auth handler
│   │   ├── contracts/
│   │   │   ├── quick-create/route.ts # Quick contract endpoint
│   │   │   └── [id]/
│   │   │       └── pdf/route.ts      # PDF generation
│   │   ├── upload/
│   │   │   └── route.ts              # File upload handler
│   │   ├── webhooks/
│   │   │   ├── stripe/route.ts       # Stripe webhooks
│   │   │   └── supabase/route.ts     # Supabase webhooks
│   │   └── reports/
│   │       └── generate/route.ts     # Report generation
│   │
│   ├── layout.tsx                    # Root layout
│   ├── loading.tsx                   # Global loading state
│   ├── error.tsx                     # Error boundary
│   ├── not-found.tsx                 # 404 page
│   └── global-error.tsx              # Global error boundary
│
├── components/                        # React Components
│   ├── ui/                           # Shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   └── ...
│   │
│   ├── forms/                        # Form components
│   │   ├── ContractForm.tsx
│   │   ├── CustomerForm.tsx
│   │   ├── VehicleForm.tsx
│   │   ├── PaymentForm.tsx
│   │   └── fields/
│   │       ├── DateRangePicker.tsx
│   │       ├── SwissPhoneInput.tsx
│   │       └── MoneyInput.tsx
│   │
│   ├── contracts/                    # Contract-specific
│   │   ├── ContractList.tsx
│   │   ├── ContractCard.tsx
│   │   ├── ContractTimeline.tsx
│   │   ├── QuickCreateWizard.tsx
│   │   └── SignaturePad.tsx
│   │
│   ├── vehicles/                     # Vehicle components
│   │   ├── VehicleCard.tsx
│   │   ├── AvailabilityCalendar.tsx
│   │   ├── FleetStatus.tsx
│   │   └── MaintenanceAlert.tsx
│   │
│   ├── dashboard/                    # Dashboard widgets
│   │   ├── RevenueChart.tsx
│   │   ├── FleetUtilization.tsx
│   │   ├── RecentActivity.tsx
│   │   ├── QuickActions.tsx
│   │   └── ROIMetrics.tsx
│   │
│   ├── photos/                       # Photo management
│   │   ├── PhotoUploader.tsx
│   │   ├── PhotoAnnotator.tsx
│   │   ├── PhotoGallery.tsx
│   │   └── DamageMarker.tsx
│   │
│   └── shared/                       # Shared components
│       ├── Layout/
│       │   ├── Sidebar.tsx
│       │   ├── Header.tsx
│       │   └── Footer.tsx
│       ├── DataTable.tsx
│       ├── SearchBar.tsx
│       ├── StatusBadge.tsx
│       └── LoadingSpinner.tsx
│
├── lib/                              # Utilities & Helpers
│   ├── supabase/
│   │   ├── client.ts                # Browser client
│   │   ├── server.ts                # Server client
│   │   ├── middleware.ts            # Auth middleware
│   │   └── types.ts                 # Generated types
│   │
│   ├── api/
│   │   ├── contracts.ts             # Contract API calls
│   │   ├── customers.ts             # Customer API calls
│   │   ├── vehicles.ts              # Vehicle API calls
│   │   └── payments.ts              # Payment API calls
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCompany.ts
│   │   ├── useRealtime.ts
│   │   ├── useDebounce.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── utils/
│   │   ├── date.ts                  # Date utilities
│   │   ├── money.ts                 # Money formatting
│   │   ├── validation.ts            # Validation helpers
│   │   ├── swiss.ts                 # Swiss-specific utils
│   │   └── pdf.ts                   # PDF generation
│   │
│   └── constants/
│       ├── routes.ts                # Route constants
│       ├── permissions.ts           # Permission definitions
│       └── config.ts                # App configuration
│
├── stores/                          # Zustand state stores
│   ├── auth.store.ts                # Authentication state
│   ├── ui.store.ts                  # UI state (sidebar, modals)
│   ├── contract.store.ts            # Contract creation state
│   └── notification.store.ts        # Toast notifications
│
├── styles/                          # Global styles
│   ├── globals.css                  # Global CSS
│   └── components.css               # Component styles
│
├── types/                           # TypeScript types
│   ├── database.types.ts            # Supabase generated types
│   ├── api.types.ts                 # API types
│   └── app.types.ts                 # Application types
│
└── public/                          # Static assets
    ├── images/
    ├── fonts/
    └── locales/                     # i18n files (future)
```

## Component Design Patterns

### 1. Server Components (Default)
```tsx
// app/(dashboard)/contracts/page.tsx
import { createServerClient } from '@/lib/supabase/server';

export default async function ContractsPage() {
  const supabase = createServerClient();
  const { data: contracts } = await supabase
    .from('contracts')
    .select('*, customer:customers(*), vehicle:vehicles(*)')
    .order('created_at', { ascending: false });

  return <ContractsList contracts={contracts} />;
}
```

### 2. Client Components (Interactive)
```tsx
// components/contracts/QuickCreateWizard.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export function QuickCreateWizard() {
  const [step, setStep] = useState(1);
  const form = useForm({
    resolver: zodResolver(contractSchema),
  });
  
  // Interactive multi-step form
}
```

### 3. Hybrid Patterns (Streaming)
```tsx
// app/(dashboard)/page.tsx
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <>
      <QuickActions />
      <Suspense fallback={<LoadingSkeleton />}>
        <RevenueMetrics />
      </Suspense>
      <Suspense fallback={<LoadingSkeleton />}>
        <RecentActivity />
      </Suspense>
    </>
  );
}
```

## State Management Architecture

### 1. Server State (React Query/TanStack Query)
```tsx
// hooks/useContracts.ts
export function useContracts(filters: ContractFilters) {
  return useQuery({
    queryKey: ['contracts', filters],
    queryFn: () => fetchContracts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}
```

### 2. Client State (Zustand)
```tsx
// stores/ui.store.ts
interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  activeModal: string | null;
  openModal: (modal: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ 
    sidebarOpen: !state.sidebarOpen 
  })),
  activeModal: null,
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
}));
```

### 3. Form State (React Hook Form + Zod)
```tsx
// schemas/contract.schema.ts
export const contractSchema = z.object({
  customer_id: z.string().uuid(),
  vehicle_id: z.string().uuid(),
  start_date: z.date(),
  end_date: z.date(),
  pickup_km: z.number().min(0),
  pickup_fuel: z.number().min(0).max(100),
});

// Usage in component
const form = useForm<ContractFormData>({
  resolver: zodResolver(contractSchema),
  defaultValues: {
    pickup_fuel: 100,
  },
});
```

## Performance Optimization

### Frontend Optimization
```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['storage.supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};
```

---

**Document Version:** 3.0 - Frontend Architecture
**Last Updated:** 2025-08-06
**Status:** Ready for Implementation