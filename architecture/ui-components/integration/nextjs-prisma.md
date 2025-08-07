# Next.js and Prisma Integration Patterns

## Architecture Decision Record (ADR-007): Full-Stack Integration

### Status: Accepted
### Date: 2025-08-07
### Context: Need for seamless integration between UI components, Next.js framework, and Prisma ORM

## Integration Architecture

### 1. Next.js App Router Integration

```typescript
// src/app/layout.tsx - Root layout with providers
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/design-system/providers/ThemeProvider'
import { I18nProvider } from '@/i18n/context/I18nContext'
import { QueryProvider } from '@/lib/query-client'
import { ToastProvider } from '@/components/providers/ToastProvider'
import { AuthProvider } from '@/lib/auth/AuthProvider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider>
              <I18nProvider>
                <div id="root">
                  {children}
                </div>
                <ToastProvider />
              </I18nProvider>
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

// src/app/page.tsx - Homepage with server components
import { Suspense } from 'react'
import { Hero } from '@/components/organisms/Hero'
import { VehicleShowcase } from '@/components/organisms/VehicleShowcase'
import { FeaturesSection } from '@/components/organisms/FeaturesSection'
import { TestimonialsSection } from '@/components/organisms/TestimonialsSection'
import { getVehicles } from '@/lib/prisma/vehicles'

export default async function HomePage() {
  const featuredVehicles = await getVehicles({ 
    featured: true, 
    limit: 6 
  })

  return (
    <main>
      <Hero />
      
      <Suspense fallback={<VehicleShowcaseSkeleton />}>
        <VehicleShowcase vehicles={featuredVehicles} />
      </Suspense>
      
      <FeaturesSection />
      <TestimonialsSection />
    </main>
  )
}

// src/app/vehicles/page.tsx - Vehicles list with search and filtering
import { Suspense } from 'react'
import { VehicleFilters } from '@/components/organisms/VehicleFilters'
import { VehicleGrid } from '@/components/organisms/VehicleGrid'
import { Pagination } from '@/components/molecules/Pagination'
import { getVehicles, getVehicleStats } from '@/lib/prisma/vehicles'

interface VehiclesPageProps {
  searchParams: {
    category?: string
    location?: string
    minPrice?: string
    maxPrice?: string
    features?: string[]
    page?: string
    limit?: string
    sort?: string
  }
}

export default async function VehiclesPage({ 
  searchParams 
}: VehiclesPageProps) {
  const page = parseInt(searchParams.page || '1')
  const limit = parseInt(searchParams.limit || '12')
  
  const filters = {
    category: searchParams.category,
    location: searchParams.location,
    priceRange: searchParams.minPrice && searchParams.maxPrice 
      ? [parseInt(searchParams.minPrice), parseInt(searchParams.maxPrice)]
      : undefined,
    features: searchParams.features || [],
    page,
    limit,
    sort: searchParams.sort as 'price' | 'name' | 'rating'
  }

  const [vehicles, stats] = await Promise.all([
    getVehicles(filters),
    getVehicleStats(filters)
  ])

  return (
    <div className="vehicles-page">
      <div className="vehicles-page__header">
        <h1>Our Vehicle Fleet</h1>
        <p>Choose from {stats.total} available vehicles</p>
      </div>
      
      <div className="vehicles-page__content">
        <aside className="vehicles-page__sidebar">
          <VehicleFilters 
            initialFilters={filters}
            stats={stats}
          />
        </aside>
        
        <main className="vehicles-page__main">
          <Suspense fallback={<VehicleGridSkeleton />}>
            <VehicleGrid vehicles={vehicles.data} />
          </Suspense>
          
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(stats.total / limit)}
            totalItems={stats.total}
          />
        </main>
      </div>
    </div>
  )
}

// src/app/vehicles/[id]/page.tsx - Vehicle details with dynamic routing
import { notFound } from 'next/navigation'
import { VehicleDetails } from '@/components/organisms/VehicleDetails'
import { BookingCard } from '@/components/organisms/BookingCard'
import { RelatedVehicles } from '@/components/organisms/RelatedVehicles'
import { getVehicleById, getRelatedVehicles } from '@/lib/prisma/vehicles'

interface VehiclePageProps {
  params: { id: string }
}

export default async function VehiclePage({ params }: VehiclePageProps) {
  const vehicle = await getVehicleById(params.id)
  
  if (!vehicle) {
    notFound()
  }

  const relatedVehicles = await getRelatedVehicles(vehicle.id, {
    category: vehicle.category,
    limit: 4
  })

  return (
    <div className="vehicle-page">
      <div className="vehicle-page__content">
        <main className="vehicle-page__main">
          <VehicleDetails vehicle={vehicle} />
        </main>
        
        <aside className="vehicle-page__sidebar">
          <BookingCard vehicle={vehicle} />
        </aside>
      </div>
      
      <section className="vehicle-page__related">
        <RelatedVehicles vehicles={relatedVehicles} />
      </section>
    </div>
  )
}

// Generate static paths for better SEO and performance
export async function generateStaticParams() {
  const vehicles = await getVehicles({ limit: 100 })
  
  return vehicles.data.map((vehicle) => ({
    id: vehicle.id.toString()
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: VehiclePageProps) {
  const vehicle = await getVehicleById(params.id)
  
  if (!vehicle) {
    return {
      title: 'Vehicle Not Found'
    }
  }

  return {
    title: `${vehicle.name} - Car Rental`,
    description: vehicle.description,
    openGraph: {
      title: `${vehicle.name} - Car Rental`,
      description: vehicle.description,
      images: vehicle.images.map(image => ({
        url: image,
        alt: vehicle.name
      }))
    }
  }
}
```

### 2. API Routes with Type Safety

```typescript
// src/app/api/vehicles/route.ts - GET /api/vehicles
import { NextRequest, NextResponse } from 'next/server'
import { getVehicles } from '@/lib/prisma/vehicles'
import { vehicleFilterSchema } from '@/lib/validations/vehicle'
import { withAuth } from '@/lib/middleware/auth'
import { withRateLimit } from '@/lib/middleware/rate-limit'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Validate query parameters
    const filters = vehicleFilterSchema.parse({
      category: searchParams.get('category'),
      location: searchParams.get('location'),
      minPrice: searchParams.get('minPrice') ? 
        parseInt(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? 
        parseInt(searchParams.get('maxPrice')!) : undefined,
      features: searchParams.getAll('features'),
      page: searchParams.get('page') ? 
        parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? 
        parseInt(searchParams.get('limit')!) : 12
    })

    const vehicles = await getVehicles(filters)
    
    return NextResponse.json({
      success: true,
      data: vehicles.data,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: vehicles.total,
        totalPages: Math.ceil(vehicles.total / filters.limit)
      }
    })
  } catch (error) {
    console.error('Failed to fetch vehicles:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch vehicles' 
      },
      { status: 500 }
    )
  }
}

// src/app/api/vehicles/[id]/route.ts - GET /api/vehicles/[id]
import { NextRequest, NextResponse } from 'next/server'
import { getVehicleById } from '@/lib/prisma/vehicles'

interface RouteContext {
  params: { id: string }
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const vehicle = await getVehicleById(params.id)
    
    if (!vehicle) {
      return NextResponse.json(
        { success: false, error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: vehicle
    })
  } catch (error) {
    console.error('Failed to fetch vehicle:', error)
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicle' },
      { status: 500 }
    )
  }
}

// src/app/api/bookings/route.ts - POST /api/bookings
import { NextRequest, NextResponse } from 'next/server'
import { createBooking } from '@/lib/prisma/bookings'
import { bookingSchema } from '@/lib/validations/booking'
import { withAuth } from '@/lib/middleware/auth'

export const POST = withAuth(async (request: NextRequest, { user }) => {
  try {
    const body = await request.json()
    
    // Validate booking data
    const bookingData = bookingSchema.parse(body)
    
    // Create booking with user context
    const booking = await createBooking({
      ...bookingData,
      userId: user.id
    })
    
    return NextResponse.json({
      success: true,
      data: booking
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: error.errors
        },
        { status: 400 }
      )
    }
    
    console.error('Failed to create booking:', error)
    
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    )
  }
})
```

### 3. Prisma Integration Layer

```typescript
// src/lib/prisma/client.ts - Prisma client setup
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
  errorFormat: 'pretty'
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Connection management
export async function connectPrisma() {
  try {
    await prisma.$connect()
    console.log('✅ Prisma connected successfully')
  } catch (error) {
    console.error('❌ Failed to connect to Prisma:', error)
    process.exit(1)
  }
}

export async function disconnectPrisma() {
  await prisma.$disconnect()
}

// src/lib/prisma/vehicles.ts - Vehicle data access layer
import { prisma } from './client'
import type { VehicleFilters, Vehicle } from '@/types/vehicle'

export async function getVehicles(filters: VehicleFilters = {}) {
  const {
    category,
    location,
    priceRange,
    features = [],
    page = 1,
    limit = 12,
    sort = 'name',
    featured,
    available
  } = filters

  // Build where clause
  const where: any = {}
  
  if (category) {
    where.category = category
  }
  
  if (location) {
    where.locations = {
      some: {
        city: {
          contains: location,
          mode: 'insensitive'
        }
      }
    }
  }
  
  if (priceRange) {
    where.pricePerDay = {
      gte: priceRange[0],
      lte: priceRange[1]
    }
  }
  
  if (features.length > 0) {
    where.features = {
      hasEvery: features
    }
  }
  
  if (featured !== undefined) {
    where.featured = featured
  }
  
  if (available !== undefined) {
    where.status = available ? 'AVAILABLE' : 'UNAVAILABLE'
  }

  // Build order clause
  const orderBy: any = {}
  switch (sort) {
    case 'price':
      orderBy.pricePerDay = 'asc'
      break
    case 'price_desc':
      orderBy.pricePerDay = 'desc'
      break
    case 'rating':
      orderBy.rating = 'desc'
      break
    case 'name':
    default:
      orderBy.name = 'asc'
  }

  // Execute queries in parallel
  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        locations: true,
        _count: {
          select: {
            bookings: true,
            reviews: true
          }
        }
      }
    }),
    prisma.vehicle.count({ where })
  ])

  return {
    data: vehicles.map(transformVehicle),
    total,
    page,
    limit
  }
}

export async function getVehicleById(id: string) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      locations: true,
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              avatar: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      },
      _count: {
        select: {
          bookings: true,
          reviews: true
        }
      }
    }
  })

  if (!vehicle) return null

  return transformVehicle(vehicle)
}

export async function getRelatedVehicles(
  vehicleId: string,
  filters: { category?: string; limit?: number } = {}
) {
  const { category, limit = 4 } = filters

  const vehicles = await prisma.vehicle.findMany({
    where: {
      id: { not: vehicleId },
      category: category || undefined,
      status: 'AVAILABLE'
    },
    orderBy: {
      rating: 'desc'
    },
    take: limit,
    include: {
      locations: true,
      _count: {
        select: {
          bookings: true,
          reviews: true
        }
      }
    }
  })

  return vehicles.map(transformVehicle)
}

export async function getVehicleStats(filters: VehicleFilters = {}) {
  const { category, location, priceRange, features = [] } = filters

  const where: any = {}
  
  if (category) where.category = category
  if (location) {
    where.locations = {
      some: {
        city: { contains: location, mode: 'insensitive' }
      }
    }
  }
  if (priceRange) {
    where.pricePerDay = { gte: priceRange[0], lte: priceRange[1] }
  }
  if (features.length > 0) {
    where.features = { hasEvery: features }
  }

  const [total, categories, priceStats] = await Promise.all([
    prisma.vehicle.count({ where }),
    
    prisma.vehicle.groupBy({
      by: ['category'],
      where,
      _count: { category: true }
    }),
    
    prisma.vehicle.aggregate({
      where,
      _min: { pricePerDay: true },
      _max: { pricePerDay: true },
      _avg: { pricePerDay: true }
    })
  ])

  return {
    total,
    categories: categories.map(c => ({
      name: c.category,
      count: c._count.category
    })),
    priceRange: {
      min: priceStats._min.pricePerDay || 0,
      max: priceStats._max.pricePerDay || 1000,
      avg: priceStats._avg.pricePerDay || 0
    }
  }
}

// Transform Prisma result to app format
function transformVehicle(vehicle: any): Vehicle {
  return {
    id: vehicle.id,
    name: vehicle.name,
    category: vehicle.category,
    description: vehicle.description,
    pricePerDay: vehicle.pricePerDay,
    images: vehicle.images,
    features: vehicle.features,
    specifications: vehicle.specifications,
    status: vehicle.status,
    rating: vehicle.rating,
    reviewCount: vehicle._count?.reviews || 0,
    bookingCount: vehicle._count?.bookings || 0,
    locations: vehicle.locations?.map((loc: any) => ({
      id: loc.id,
      name: loc.name,
      city: loc.city,
      address: loc.address
    })) || [],
    reviews: vehicle.reviews?.map((review: any) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      user: {
        name: review.user.name,
        avatar: review.user.avatar
      }
    })) || []
  }
}

// src/lib/prisma/bookings.ts - Booking data access layer
export async function createBooking(data: CreateBookingData) {
  return prisma.$transaction(async (tx) => {
    // Check vehicle availability
    const conflicts = await tx.booking.findMany({
      where: {
        vehicleId: data.vehicleId,
        status: { not: 'CANCELLED' },
        OR: [
          {
            pickupDate: { lte: data.returnDate },
            returnDate: { gte: data.pickupDate }
          }
        ]
      }
    })

    if (conflicts.length > 0) {
      throw new Error('Vehicle not available for selected dates')
    }

    // Create booking
    const booking = await tx.booking.create({
      data: {
        ...data,
        status: 'PENDING',
        totalPrice: calculateTotalPrice(data)
      },
      include: {
        vehicle: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    // Send confirmation email (async)
    await sendBookingConfirmation(booking)

    return booking
  })
}

export async function getUserBookings(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    include: {
      vehicle: {
        select: {
          name: true,
          category: true,
          images: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

function calculateTotalPrice(booking: CreateBookingData): number {
  const days = Math.ceil(
    (new Date(booking.returnDate).getTime() - 
     new Date(booking.pickupDate).getTime()) / 
    (1000 * 60 * 60 * 24)
  )
  
  return booking.pricePerDay * days
}
```

### 4. React Query Integration

```typescript
// src/lib/query-client.tsx - React Query setup
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
        retry: (failureCount, error: any) => {
          if (error?.status >= 400 && error?.status < 500) {
            return false // Don't retry client errors
          }
          return failureCount < 3
        }
      }
    }
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

// src/hooks/api/vehicles.ts - Vehicle API hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { VehicleFilters, Vehicle } from '@/types/vehicle'

export function useVehicles(filters: VehicleFilters = {}) {
  return useQuery({
    queryKey: ['vehicles', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, String(v)))
          } else {
            params.set(key, String(value))
          }
        }
      })

      const response = await fetch(`/api/vehicles?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles')
      }

      const data = await response.json()
      return data
    },
    enabled: true
  })
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      const response = await fetch(`/api/vehicles/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Vehicle not found')
        }
        throw new Error('Failed to fetch vehicle')
      }

      const data = await response.json()
      return data.data as Vehicle
    },
    enabled: !!id
  })
}

export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (bookingData: CreateBookingData) => {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create booking')
      }

      return response.json()
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries(['bookings'])
      queryClient.invalidateQueries(['vehicle', data.vehicleId])
      
      // Show success toast
      toast.success('Booking created successfully!')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
}

export function useUserBookings() {
  return useQuery({
    queryKey: ['bookings', 'user'],
    queryFn: async () => {
      const response = await fetch('/api/user/bookings')
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }

      const data = await response.json()
      return data.data
    }
  })
}

// Prefetch hook for performance
export function usePrefetchVehicle() {
  const queryClient = useQueryClient()

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: ['vehicle', id],
      queryFn: async () => {
        const response = await fetch(`/api/vehicles/${id}`)
        const data = await response.json()
        return data.data
      },
      staleTime: 10 * 60 * 1000 // 10 minutes
    })
  }
}
```

### 5. Form Integration with Server Actions

```typescript
// src/app/booking/[vehicleId]/page.tsx - Booking form with server actions
import { BookingForm } from '@/components/organisms/BookingForm'
import { getVehicleById } from '@/lib/prisma/vehicles'
import { createBooking } from '@/lib/actions/booking'
import { redirect } from 'next/navigation'

interface BookingPageProps {
  params: { vehicleId: string }
}

export default async function BookingPage({ params }: BookingPageProps) {
  const vehicle = await getVehicleById(params.vehicleId)
  
  if (!vehicle) {
    redirect('/vehicles')
  }

  return (
    <div className="booking-page">
      <BookingForm vehicle={vehicle} createBooking={createBooking} />
    </div>
  )
}

// src/lib/actions/booking.ts - Server action for booking creation
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { createBooking as createBookingPrisma } from '@/lib/prisma/bookings'
import { bookingSchema } from '@/lib/validations/booking'

export async function createBooking(formData: FormData) {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  try {
    // Extract and validate form data
    const rawData = {
      vehicleId: formData.get('vehicleId') as string,
      pickupDate: formData.get('pickupDate') as string,
      returnDate: formData.get('returnDate') as string,
      pickupLocation: formData.get('pickupLocation') as string,
      returnLocation: formData.get('returnLocation') as string,
      insuranceType: formData.get('insuranceType') as string,
      extras: formData.getAll('extras') as string[]
    }

    const validatedData = bookingSchema.parse(rawData)

    // Create booking
    const booking = await createBookingPrisma({
      ...validatedData,
      userId: session.user.id
    })

    // Revalidate cache
    revalidatePath('/bookings')
    revalidatePath(`/vehicles/${validatedData.vehicleId}`)

    // Redirect to confirmation
    redirect(`/booking/confirmation/${booking.id}`)
  } catch (error) {
    console.error('Booking creation failed:', error)
    throw error
  }
}

// src/components/organisms/BookingForm/BookingForm.tsx
'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/atoms/Button'
import { FormField } from '@/components/molecules/FormField'
import { VehicleSummary } from '@/components/molecules/VehicleSummary'

interface BookingFormProps {
  vehicle: Vehicle
  createBooking: (formData: FormData) => Promise<void>
}

export function BookingForm({ vehicle, createBooking }: BookingFormProps) {
  return (
    <form action={createBooking} className="booking-form">
      <input type="hidden" name="vehicleId" value={vehicle.id} />
      
      <div className="booking-form__layout">
        <div className="booking-form__details">
          <fieldset>
            <legend>Rental Details</legend>
            
            <div className="form-row">
              <FormField
                label="Pickup Date"
                name="pickupDate"
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
              />
              
              <FormField
                label="Return Date"
                name="returnDate"
                type="date"
                required
              />
            </div>
            
            <div className="form-row">
              <FormField
                label="Pickup Location"
                name="pickupLocation"
                as="select"
                required
              >
                <option value="">Select location</option>
                {vehicle.locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </FormField>
              
              <FormField
                label="Return Location"
                name="returnLocation"
                as="select"
                required
              >
                <option value="">Select location</option>
                {vehicle.locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </FormField>
            </div>
          </fieldset>

          <fieldset>
            <legend>Insurance</legend>
            
            <div className="insurance-options">
              <label className="insurance-option">
                <input 
                  type="radio" 
                  name="insuranceType" 
                  value="basic" 
                  defaultChecked 
                />
                <div>
                  <h4>Basic Coverage</h4>
                  <p>CHF 20/day - Basic protection</p>
                </div>
              </label>
              
              <label className="insurance-option">
                <input type="radio" name="insuranceType" value="premium" />
                <div>
                  <h4>Premium Coverage</h4>
                  <p>CHF 35/day - Enhanced protection</p>
                </div>
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Extras</legend>
            
            <div className="extras-grid">
              <label className="extra-option">
                <input type="checkbox" name="extras" value="gps" />
                GPS Navigation (+CHF 10/day)
              </label>
              
              <label className="extra-option">
                <input type="checkbox" name="extras" value="child-seat" />
                Child Seat (+CHF 15/day)
              </label>
              
              <label className="extra-option">
                <input type="checkbox" name="extras" value="additional-driver" />
                Additional Driver (+CHF 25/day)
              </label>
            </div>
          </fieldset>
        </div>
        
        <div className="booking-form__summary">
          <VehicleSummary vehicle={vehicle} />
          <SubmitButton />
        </div>
      </div>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button 
      type="submit" 
      size="lg" 
      loading={pending}
      loadingText="Creating Booking..."
      className="w-full"
    >
      Complete Booking
    </Button>
  )
}
```

### 6. Middleware Integration

```typescript
// src/middleware.ts - Next.js middleware
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    try {
      await rateLimit(request)
    } catch {
      return new NextResponse('Too Many Requests', { status: 429 })
    }
  }

  // Authentication check for protected routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/booking')) {
    const session = await auth()
    
    if (!session) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Admin routes
  if (pathname.startsWith('/admin')) {
    const session = await auth()
    
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/booking/:path*',
    '/admin/:path*'
  ]
}

// src/lib/middleware/auth.ts - Authentication middleware
import { NextRequest } from 'next/server'
import { verify } from 'jsonwebtoken'

export function withAuth<T extends any[]>(
  handler: (request: NextRequest, context: { user: User }, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T) => {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return new Response('Unauthorized', { status: 401 })
    }

    try {
      const user = verify(token, process.env.JWT_SECRET!) as User
      return handler(request, { user }, ...args)
    } catch {
      return new Response('Invalid token', { status: 401 })
    }
  }
}

// src/lib/middleware/rate-limit.ts - Rate limiting
const requests = new Map()

export async function rateLimit(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1'
  const limit = 100 // requests per window
  const windowMs = 15 * 60 * 1000 // 15 minutes

  if (!requests.has(ip)) {
    requests.set(ip, { count: 0, resetTime: Date.now() + windowMs })
  }

  const requestData = requests.get(ip)

  if (Date.now() > requestData.resetTime) {
    requestData.count = 0
    requestData.resetTime = Date.now() + windowMs
  }

  if (requestData.count >= limit) {
    throw new Error('Rate limit exceeded')
  }

  requestData.count++
}
```

### 7. Database Schema Integration

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  avatar        String?
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  bookings      Booking[]
  reviews       Review[]
  
  @@map("users")
}

model Vehicle {
  id            String       @id @default(cuid())
  name          String
  category      Category
  description   String
  pricePerDay   Int
  images        String[]
  features      String[]
  specifications Json
  status        VehicleStatus @default(AVAILABLE)
  featured      Boolean      @default(false)
  rating        Float        @default(0)
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
  
  bookings      Booking[]
  reviews       Review[]
  locations     VehicleLocation[]
  
  @@map("vehicles")
}

model Location {
  id            String    @id @default(cuid())
  name          String
  city          String
  address       String
  coordinates   Json?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  vehicles      VehicleLocation[]
  pickupBookings   Booking[] @relation("PickupLocation")
  returnBookings   Booking[] @relation("ReturnLocation")
  
  @@map("locations")
}

model VehicleLocation {
  vehicleId     String
  locationId    String
  vehicle       Vehicle   @relation(fields: [vehicleId], references: [id])
  location      Location  @relation(fields: [locationId], references: [id])
  
  @@id([vehicleId, locationId])
  @@map("vehicle_locations")
}

model Booking {
  id              String        @id @default(cuid())
  userId          String
  vehicleId       String
  pickupDate      DateTime
  returnDate      DateTime
  pickupLocationId String
  returnLocationId String
  status          BookingStatus @default(PENDING)
  totalPrice      Int
  insuranceType   String
  extras          String[]
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  user            User          @relation(fields: [userId], references: [id])
  vehicle         Vehicle       @relation(fields: [vehicleId], references: [id])
  pickupLocation  Location      @relation("PickupLocation", fields: [pickupLocationId], references: [id])
  returnLocation  Location      @relation("ReturnLocation", fields: [returnLocationId], references: [id])
  
  @@map("bookings")
}

model Review {
  id          String    @id @default(cuid())
  userId      String
  vehicleId   String
  rating      Int
  comment     String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  user        User      @relation(fields: [userId], references: [id])
  vehicle     Vehicle   @relation(fields: [vehicleId], references: [id])
  
  @@unique([userId, vehicleId])
  @@map("reviews")
}

enum Role {
  USER
  ADMIN
}

enum Category {
  ECONOMY
  COMPACT  
  INTERMEDIATE
  PREMIUM
  LUXURY
  SUV
  VAN
  CONVERTIBLE
}

enum VehicleStatus {
  AVAILABLE
  RENTED
  MAINTENANCE
  RETIRED
}

enum BookingStatus {
  PENDING
  CONFIRMED
  ACTIVE
  COMPLETED
  CANCELLED
}
```

## Performance Optimizations

### 1. Database Query Optimization
- **Connection pooling**: Prisma connection management
- **Query batching**: DataLoader for N+1 prevention
- **Selective fetching**: Include only needed relations
- **Pagination**: Cursor-based for better performance
- **Caching**: Redis for frequent queries

### 2. Next.js Optimizations
- **Static generation**: Pre-render vehicle catalog pages
- **Incremental static regeneration**: Update content without rebuild
- **Image optimization**: next/image with WebP support
- **Code splitting**: Route and component-level splitting
- **Edge functions**: Deploy API routes closer to users

### 3. Client-Side Performance
- **React Query caching**: Intelligent background updates
- **Prefetching**: Hover-based data prefetching
- **Virtual scrolling**: Large vehicle lists
- **Optimistic updates**: Immediate UI feedback
- **Bundle splitting**: Lazy load non-critical components

## Implementation Checklist

- [ ] Set up Next.js App Router with TypeScript
- [ ] Configure Prisma with PostgreSQL
- [ ] Implement API routes with validation
- [ ] Set up React Query for data fetching
- [ ] Create server actions for mutations
- [ ] Add authentication middleware
- [ ] Implement rate limiting
- [ ] Configure database migrations
- [ ] Set up error boundaries and logging
- [ ] Add comprehensive testing suite
- [ ] Optimize bundle size and performance
- [ ] Deploy with proper environment configuration