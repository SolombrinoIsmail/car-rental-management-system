# Performance Optimization Strategies

## Architecture Decision Record (ADR-006): Component Library Performance

### Status: Accepted
### Date: 2025-08-07
### Context: Need for high-performance component library with sub-second loading times

## Performance Architecture

### 1. Bundle Optimization Strategy

```typescript
// src/performance/bundling/index.ts
export interface BundleOptimizationConfig {
  treeShaking: boolean
  codesplitting: boolean
  compression: boolean
  minification: boolean
  sourceMaps: boolean
  analyzer: boolean
}

export const bundleConfig: BundleOptimizationConfig = {
  treeShaking: true,
  codesplitting: true,
  compression: true,
  minification: true,
  sourceMaps: process.env.NODE_ENV === 'development',
  analyzer: process.env.ANALYZE === 'true'
}

// Component-level exports for tree shaking
export { Button } from './atoms/Button'
export { Input } from './atoms/Input'
export { Select } from './atoms/Select'
export { FormField } from './molecules/FormField'
export { VehicleCard } from './organisms/VehicleCard'

// Avoid default exports that break tree shaking
// ❌ Bad
// export default { Button, Input, Select }

// ✅ Good  
// export { Button, Input, Select }
```

### 2. Code Splitting Implementation

```typescript
// src/performance/lazy-loading/index.ts
import { lazy, ComponentType } from 'react'

// Route-level splitting
export const VehiclesPage = lazy(() => import('@/pages/VehiclesPage'))
export const BookingsPage = lazy(() => import('@/pages/BookingsPage'))
export const CustomersPage = lazy(() => import('@/pages/CustomersPage'))

// Component-level splitting for heavy components
export const DataTable = lazy(() => import('@/components/organisms/DataTable'))
export const Chart = lazy(() => import('@/components/organisms/Chart'))
export const Calendar = lazy(() => import('@/components/organisms/Calendar'))

// Dynamic import with loading states
interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>
  fallback?: React.ComponentType
  error?: React.ComponentType<{ error: Error }>
}

export const LazyComponent = ({ 
  component, 
  fallback: Fallback = () => <div>Loading...</div>,
  error: ErrorComponent = ({ error }) => <div>Error: {error.message}</div>
}: LazyComponentProps) => {
  const Component = lazy(component)
  
  return (
    <ErrorBoundary FallbackComponent={ErrorComponent}>
      <Suspense fallback={<Fallback />}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  )
}

// Intersection Observer for lazy loading
export const useLazyLoad = (ref: RefObject<HTMLElement>, threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    
    observer.observe(element)
    
    return () => observer.disconnect()
  }, [ref, threshold])
  
  return isVisible
}

// Lazy load images
export const LazyImage = ({ 
  src, 
  alt, 
  className,
  placeholder = '/placeholder.svg'
}: {
  src: string
  alt: string
  className?: string
  placeholder?: string
}) => {
  const imgRef = useRef<HTMLImageElement>(null)
  const isVisible = useLazyLoad(imgRef)
  const [isLoaded, setIsLoaded] = useState(false)
  
  return (
    <div ref={imgRef} className={`lazy-image ${className || ''}`}>
      <img
        src={isVisible ? src : placeholder}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
```

### 3. Memoization Strategies

```typescript
// src/performance/memoization/index.ts
import { memo, useMemo, useCallback, useState } from 'react'

// Component memoization
export const VehicleCard = memo<VehicleCardProps>(({ 
  vehicle, 
  onBook, 
  onFavorite 
}) => {
  // Memoize expensive computations
  const availability = useMemo(() => {
    return calculateAvailability(vehicle.bookings, vehicle.maintenance)
  }, [vehicle.bookings, vehicle.maintenance])
  
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF'
    }).format(vehicle.pricePerDay)
  }, [vehicle.pricePerDay])
  
  // Memoize event handlers
  const handleBook = useCallback(() => {
    onBook(vehicle.id)
  }, [vehicle.id, onBook])
  
  const handleFavorite = useCallback(() => {
    onFavorite(vehicle.id)
  }, [vehicle.id, onFavorite])
  
  return (
    <div className="vehicle-card">
      <LazyImage 
        src={vehicle.images[0]}
        alt={vehicle.name}
        className="vehicle-card__image"
      />
      
      <div className="vehicle-card__content">
        <h3>{vehicle.name}</h3>
        <p className="vehicle-card__price">{formattedPrice}/day</p>
        <p className="vehicle-card__availability">
          {availability.status}
        </p>
        
        <div className="vehicle-card__actions">
          <Button onClick={handleBook}>
            Book Now
          </Button>
          <Button variant="ghost" onClick={handleFavorite}>
            ♥
          </Button>
        </div>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.vehicle.id === nextProps.vehicle.id &&
    prevProps.vehicle.pricePerDay === nextProps.vehicle.pricePerDay &&
    prevProps.vehicle.availability === nextProps.vehicle.availability
  )
})

// Hook memoization
export const useVehicleSearch = (vehicles: Vehicle[], searchQuery: string) => {
  return useMemo(() => {
    if (!searchQuery.trim()) return vehicles
    
    const query = searchQuery.toLowerCase()
    return vehicles.filter(vehicle =>
      vehicle.name.toLowerCase().includes(query) ||
      vehicle.category.toLowerCase().includes(query) ||
      vehicle.features.some(feature => 
        feature.toLowerCase().includes(query)
      )
    )
  }, [vehicles, searchQuery])
}

// Debounced search
export const useDebouncedSearch = (query: string, delay = 300) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query)
    }, delay)
    
    return () => clearTimeout(handler)
  }, [query, delay])
  
  return debouncedQuery
}

// Virtual scrolling for large lists
export const VirtualizedVehicleList = memo(({ 
  vehicles, 
  height = 400,
  itemHeight = 120 
}: {
  vehicles: Vehicle[]
  height?: number
  itemHeight?: number
}) => {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const visibleCount = Math.ceil(height / itemHeight)
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(startIndex + visibleCount + 2, vehicles.length)
  
  const visibleItems = useMemo(() => {
    return vehicles.slice(startIndex, endIndex)
  }, [vehicles, startIndex, endIndex])
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])
  
  return (
    <div
      ref={containerRef}
      className="virtualized-list"
      style={{ height, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: vehicles.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((vehicle, index) => (
          <div
            key={vehicle.id}
            style={{
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              left: 0,
              right: 0,
              height: itemHeight
            }}
          >
            <VehicleCard vehicle={vehicle} />
          </div>
        ))}
      </div>
    </div>
  )
})
```

### 4. State Management Optimization

```typescript
// src/performance/state/index.ts
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// Optimized state store with selectors
interface VehicleStore {
  vehicles: Vehicle[]
  filters: VehicleFilters
  searchQuery: string
  loading: boolean
  // Actions
  setVehicles: (vehicles: Vehicle[]) => void
  updateFilters: (filters: Partial<VehicleFilters>) => void
  setSearchQuery: (query: string) => void
  setLoading: (loading: boolean) => void
}

export const useVehicleStore = create<VehicleStore>()(
  subscribeWithSelector(
    immer((set, get) => ({
      vehicles: [],
      filters: {
        category: '',
        priceRange: [0, 1000],
        features: [],
        location: ''
      },
      searchQuery: '',
      loading: false,
      
      setVehicles: (vehicles) => set((state) => {
        state.vehicles = vehicles
      }),
      
      updateFilters: (newFilters) => set((state) => {
        state.filters = { ...state.filters, ...newFilters }
      }),
      
      setSearchQuery: (query) => set((state) => {
        state.searchQuery = query
      }),
      
      setLoading: (loading) => set((state) => {
        state.loading = loading
      })
    }))
  )
)

// Selective subscriptions to prevent unnecessary re-renders
export const useVehicles = () => useVehicleStore(state => state.vehicles)
export const useVehicleFilters = () => useVehicleStore(state => state.filters)
export const useSearchQuery = () => useVehicleStore(state => state.searchQuery)
export const useVehicleLoading = () => useVehicleStore(state => state.loading)

// Filtered vehicles with memoization
export const useFilteredVehicles = () => {
  const vehicles = useVehicles()
  const filters = useVehicleFilters()
  const searchQuery = useSearchQuery()
  
  return useMemo(() => {
    let filtered = vehicles
    
    // Category filter
    if (filters.category) {
      filtered = filtered.filter(v => v.category === filters.category)
    }
    
    // Price range filter
    filtered = filtered.filter(v => 
      v.pricePerDay >= filters.priceRange[0] && 
      v.pricePerDay <= filters.priceRange[1]
    )
    
    // Features filter
    if (filters.features.length > 0) {
      filtered = filtered.filter(v =>
        filters.features.every(feature => v.features.includes(feature))
      )
    }
    
    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(v =>
        v.name.toLowerCase().includes(query) ||
        v.description.toLowerCase().includes(query)
      )
    }
    
    return filtered
  }, [vehicles, filters, searchQuery])
}

// React Query optimization for server state
export const useVehiclesQuery = (filters?: VehicleFilters) => {
  return useQuery({
    queryKey: ['vehicles', filters],
    queryFn: () => fetchVehicles(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    select: (data) => {
      // Transform data if needed
      return data.vehicles
    }
  })
}

// Infinite query for paginated lists
export const useInfiniteVehiclesQuery = (filters?: VehicleFilters) => {
  return useInfiniteQuery({
    queryKey: ['vehicles-infinite', filters],
    queryFn: ({ pageParam = 0 }) => 
      fetchVehicles({ ...filters, page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage, pages) => 
      lastPage.hasMore ? pages.length : undefined,
    staleTime: 5 * 60 * 1000
  })
}
```

### 5. Image Optimization

```typescript
// src/performance/images/index.ts
import { useState, useRef, useCallback } from 'react'

interface ImageOptimizationConfig {
  quality: number
  format: 'webp' | 'jpeg' | 'png' | 'avif'
  sizes: string
  priority: boolean
  placeholder: 'blur' | 'empty'
}

// Next.js Image component wrapper with optimization
export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  quality = 85,
  sizes = "100vw",
  priority = false,
  className,
  onLoad,
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setError(true)
  }, [])

  if (error) {
    return (
      <div 
        className={`image-error ${className || ''}`}
        style={{ width, height }}
      >
        <span>Failed to load image</span>
      </div>
    )
  }

  return (
    <div className={`image-container ${className || ''}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        sizes={sizes}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
      
      {!isLoaded && (
        <div className="image-skeleton">
          <div className="animate-pulse bg-gray-200 w-full h-full" />
        </div>
      )}
    </div>
  )
}

// Progressive image loading
export const ProgressiveImage = ({ 
  src, 
  placeholder, 
  alt, 
  className 
}: {
  src: string
  placeholder: string
  alt: string
  className?: string
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const img = new window.Image()
    img.onload = () => {
      setImageSrc(src)
      setIsLoaded(true)
    }
    img.src = src
  }, [src])

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className || ''} transition-all duration-300 ${
        isLoaded ? 'filter-none' : 'filter blur-sm'
      }`}
    />
  )
}

// Image format detection and serving
export const getOptimizedImageUrl = (
  src: string,
  options: Partial<ImageOptimizationConfig> = {}
) => {
  const {
    quality = 85,
    format = 'webp',
    width,
    height
  } = options

  // Check if browser supports WebP
  const supportsWebP = () => {
    if (typeof window === 'undefined') return false
    
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    
    return canvas.toDataURL('image/webp').indexOf('webp') > -1
  }

  const params = new URLSearchParams()
  params.set('q', quality.toString())
  
  if (width) params.set('w', width.toString())
  if (height) params.set('h', height.toString())
  
  const finalFormat = supportsWebP() ? 'webp' : 'jpeg'
  params.set('f', finalFormat)

  return `${src}?${params.toString()}`
}

// Image preloading
export const preloadImages = (urls: string[]) => {
  urls.forEach(url => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = url
    document.head.appendChild(link)
  })
}

// Critical images preloader
export const useCriticalImages = (images: string[]) => {
  useEffect(() => {
    if (images.length > 0) {
      preloadImages(images)
    }
  }, [images])
}
```

### 6. CSS-in-JS Performance

```typescript
// src/performance/styling/index.ts
import styled, { css, keyframes } from 'styled-components'

// Avoid dynamic styles that prevent optimization
// ❌ Bad - Creates new styles on every render
const BadButton = styled.button<{ color: string }>`
  background-color: ${props => props.color};
  padding: 1rem;
`

// ✅ Good - Use predefined variants
const GoodButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 1rem;
  transition: all 0.2s ease;
  
  ${props => props.variant === 'primary' && css`
    background-color: var(--color-primary);
    color: white;
  `}
  
  ${props => props.variant === 'secondary' && css`
    background-color: var(--color-secondary);
    color: var(--color-text);
  `}
`

// Optimize animations with CSS custom properties
const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`

const OptimizedModal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  
  /* Use transform instead of changing layout properties */
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.3s ease;
  
  /* Use will-change for smooth animations */
  will-change: transform;
  
  /* Force hardware acceleration */
  transform: translateZ(0);
`

// CSS custom properties for theme switching performance
export const createThemeVariables = (theme: Theme) => css`
  --color-primary: ${theme.colors.primary};
  --color-secondary: ${theme.colors.secondary};
  --color-background: ${theme.colors.background};
  --color-text: ${theme.colors.text};
  
  --font-size-sm: ${theme.typography.sizes.sm};
  --font-size-base: ${theme.typography.sizes.base};
  --font-size-lg: ${theme.typography.sizes.lg};
  
  --spacing-xs: ${theme.spacing.xs};
  --spacing-sm: ${theme.spacing.sm};
  --spacing-md: ${theme.spacing.md};
  --spacing-lg: ${theme.spacing.lg};
`

// Utility for CSS-in-JS performance monitoring
export const withPerformanceMonitoring = <P extends {}>(
  Component: React.ComponentType<P>
) => {
  return React.memo((props: P) => {
    const renderStart = performance.now()
    
    useEffect(() => {
      const renderEnd = performance.now()
      console.log(
        `${Component.displayName || Component.name} render time: ${
          renderEnd - renderStart
        }ms`
      )
    })
    
    return <Component {...props} />
  })
}
```

### 7. Network Optimization

```typescript
// src/performance/network/index.ts
import { QueryClient } from '@tanstack/react-query'

// Optimized React Query configuration
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors
          if (error?.status >= 400 && error?.status < 500) {
            return false
          }
          return failureCount < 3
        },
        refetchOnWindowFocus: false,
        refetchOnMount: true
      },
      mutations: {
        retry: 1
      }
    }
  })
}

// Request deduplication
const requestCache = new Map<string, Promise<any>>()

export const dedupedFetch = async (
  url: string, 
  options?: RequestInit
): Promise<any> => {
  const key = `${url}-${JSON.stringify(options)}`
  
  if (requestCache.has(key)) {
    return requestCache.get(key)
  }
  
  const promise = fetch(url, options).then(res => {
    requestCache.delete(key)
    return res.json()
  })
  
  requestCache.set(key, promise)
  return promise
}

// Optimistic updates
export const useOptimisticVehicleUpdate = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateVehicle,
    onMutate: async (updatedVehicle) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['vehicles'])
      
      // Snapshot previous value
      const previousVehicles = queryClient.getQueryData(['vehicles'])
      
      // Optimistically update
      queryClient.setQueryData(['vehicles'], (old: Vehicle[] = []) =>
        old.map(vehicle =>
          vehicle.id === updatedVehicle.id
            ? { ...vehicle, ...updatedVehicle }
            : vehicle
        )
      )
      
      return { previousVehicles }
    },
    
    onError: (err, updatedVehicle, context) => {
      // Rollback on error
      if (context?.previousVehicles) {
        queryClient.setQueryData(['vehicles'], context.previousVehicles)
      }
    },
    
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries(['vehicles'])
    }
  })
}

// Background prefetching
export const usePrefetchVehicleDetails = () => {
  const queryClient = useQueryClient()
  
  return useCallback((vehicleId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['vehicle', vehicleId],
      queryFn: () => fetchVehicleDetails(vehicleId),
      staleTime: 10 * 60 * 1000 // 10 minutes
    })
  }, [queryClient])
}

// Service worker for caching
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  }
}
```

### 8. Performance Monitoring

```typescript
// src/performance/monitoring/index.ts
interface PerformanceMetrics {
  component: string
  renderTime: number
  mountTime: number
  updateTime: number
  memoryUsage: number
  bundleSize: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  
  measureComponent<P extends {}>(
    WrappedComponent: React.ComponentType<P>
  ): React.ComponentType<P> {
    return (props: P) => {
      const componentName = WrappedComponent.displayName || WrappedComponent.name
      const mountStart = performance.now()
      
      useEffect(() => {
        const mountEnd = performance.now()
        this.recordMetric({
          component: componentName,
          renderTime: 0,
          mountTime: mountEnd - mountStart,
          updateTime: 0,
          memoryUsage: this.getMemoryUsage(),
          bundleSize: 0
        })
      }, [])
      
      useEffect(() => {
        const updateStart = performance.now()
        return () => {
          const updateEnd = performance.now()
          this.recordMetric({
            component: componentName,
            renderTime: 0,
            mountTime: 0,
            updateTime: updateEnd - updateStart,
            memoryUsage: this.getMemoryUsage(),
            bundleSize: 0
          })
        }
      })
      
      return <WrappedComponent {...props} />
    }
  }
  
  private recordMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric)
    
    // Send to analytics service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'component_performance', {
        component_name: metric.component,
        mount_time: metric.mountTime,
        update_time: metric.updateTime
      })
    }
  }
  
  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize
    }
    return 0
  }
  
  getMetrics(): PerformanceMetrics[] {
    return this.metrics
  }
  
  getMetricsByComponent(component: string): PerformanceMetrics[] {
    return this.metrics.filter(m => m.component === component)
  }
}

export const performanceMonitor = new PerformanceMonitor()

// Web Vitals monitoring
export const monitorWebVitals = () => {
  if (typeof window !== 'undefined') {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log)
      getFID(console.log)
      getFCP(console.log)
      getLCP(console.log)
      getTTFB(console.log)
    })
  }
}

// Bundle size analyzer
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    import('@next/bundle-analyzer').then(({ default: withBundleAnalyzer }) => {
      // Bundle analysis configuration
    })
  }
}

// Performance budget enforcement
export const performanceBudget = {
  maxBundleSize: 250 * 1024, // 250KB
  maxRenderTime: 16, // 16ms (60fps)
  maxMountTime: 100, // 100ms
  maxUpdateTime: 16, // 16ms
  maxMemoryIncrease: 5 * 1024 * 1024 // 5MB
}

export const enforcePerformanceBudget = (metrics: PerformanceMetrics) => {
  const violations = []
  
  if (metrics.renderTime > performanceBudget.maxRenderTime) {
    violations.push(`Render time exceeded: ${metrics.renderTime}ms`)
  }
  
  if (metrics.mountTime > performanceBudget.maxMountTime) {
    violations.push(`Mount time exceeded: ${metrics.mountTime}ms`)
  }
  
  if (metrics.updateTime > performanceBudget.maxUpdateTime) {
    violations.push(`Update time exceeded: ${metrics.updateTime}ms`)
  }
  
  if (violations.length > 0) {
    console.warn(`Performance budget violations for ${metrics.component}:`, violations)
  }
  
  return violations
}
```

### 9. Webpack Configuration

```javascript
// webpack.config.js
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Vendor chunk for stable dependencies
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        // Common components chunk
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true
        },
        // UI components chunk
        components: {
          test: /[\\/]src[\\/]components[\\/]/,
          name: 'components',
          chunks: 'all'
        }
      }
    },
    usedExports: true, // Enable tree shaking
    sideEffects: false, // Mark as side-effect free
  },
  
  plugins: [
    // Bundle analyzer
    process.env.ANALYZE && new BundleAnalyzerPlugin(),
    
    // Gzip compression
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8
    }),
    
    // Brotli compression
    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        level: 11,
      },
      threshold: 10240,
      minRatio: 0.8,
    })
  ].filter(Boolean),
  
  module: {
    rules: [
      // Tree shaking for CSS
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[name]__[local]--[hash:base64:5]'
              }
            }
          }
        ]
      }
    ]
  }
}
```

## Performance Metrics

### Target Performance Budget
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s  
- **Time to Interactive**: < 3.0s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Bundle Size**: < 250KB initial
- **Component Mount**: < 100ms
- **Component Update**: < 16ms

### Monitoring Strategy
1. **Real User Monitoring**: Web Vitals collection
2. **Synthetic Testing**: Lighthouse CI integration
3. **Bundle Analysis**: Automated size tracking
4. **Component Profiling**: React DevTools integration
5. **Memory Monitoring**: Heap size tracking
6. **Network Analysis**: Request waterfall optimization

### Optimization Checklist
- [ ] Implement code splitting for routes and heavy components
- [ ] Enable tree shaking for all imports
- [ ] Optimize images with next/image and WebP format
- [ ] Implement virtual scrolling for large lists
- [ ] Use React.memo for expensive components
- [ ] Optimize state management with selective subscriptions
- [ ] Enable compression (gzip/brotli) on server
- [ ] Implement service worker for caching
- [ ] Monitor and enforce performance budgets
- [ ] Set up automated performance testing in CI/CD