# Mobile-First Responsive Design Patterns

## Architecture Decision Record (ADR-004): Mobile-First Strategy

### Status: Accepted
### Date: 2025-08-07
### Context: Need for responsive design supporting Swiss market device usage patterns

## Responsive Design Architecture

### 1. Breakpoint System

```typescript
// src/design-system/breakpoints/index.ts
export const breakpoints = {
  // Mobile-first approach
  xs: '320px',   // Small phones
  sm: '480px',   // Large phones
  md: '768px',   // Tablets
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large desktop
} as const

export type Breakpoint = keyof typeof breakpoints

// CSS-in-JS breakpoint utilities
export const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  
  // Max-width queries for mobile-first
  'max-xs': `@media (max-width: ${parseInt(breakpoints.sm) - 1}px)`,
  'max-sm': `@media (max-width: ${parseInt(breakpoints.md) - 1}px)`,
  'max-md': `@media (max-width: ${parseInt(breakpoints.lg) - 1}px)`,
  'max-lg': `@media (max-width: ${parseInt(breakpoints.xl) - 1}px)`,
  
  // Range queries
  'sm-only': `@media (min-width: ${breakpoints.sm}) and (max-width: ${parseInt(breakpoints.md) - 1}px)`,
  'md-only': `@media (min-width: ${breakpoints.md}) and (max-width: ${parseInt(breakpoints.lg) - 1}px)`,
  'lg-only': `@media (min-width: ${breakpoints.lg}) and (max-width: ${parseInt(breakpoints.xl) - 1}px)`,
  
  // Orientation queries
  portrait: '@media (orientation: portrait)',
  landscape: '@media (orientation: landscape)',
  
  // High-DPI displays
  retina: '@media (-webkit-min-device-pixel-ratio: 2), @media (min-resolution: 192dpi)',
  
  // Reduced motion
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
  
  // Print styles
  print: '@media print'
}

// React hook for breakpoint detection
export const useBreakpoint = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('xs')
  
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      if (width >= parseInt(breakpoints['2xl'])) setCurrentBreakpoint('2xl')
      else if (width >= parseInt(breakpoints.xl)) setCurrentBreakpoint('xl')
      else if (width >= parseInt(breakpoints.lg)) setCurrentBreakpoint('lg')
      else if (width >= parseInt(breakpoints.md)) setCurrentBreakpoint('md')
      else if (width >= parseInt(breakpoints.sm)) setCurrentBreakpoint('sm')
      else setCurrentBreakpoint('xs')
    }
    
    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])
  
  return currentBreakpoint
}

// Responsive value utility
export const useResponsiveValue = <T>(values: Partial<Record<Breakpoint, T>>) => {
  const breakpoint = useBreakpoint()
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
  
  // Find the appropriate value by walking down from current breakpoint
  for (let i = breakpointOrder.indexOf(breakpoint); i >= 0; i--) {
    const bp = breakpointOrder[i]
    if (values[bp] !== undefined) {
      return values[bp]
    }
  }
  
  return values.xs // Fallback to smallest
}
```

### 2. Grid System

```typescript
// src/components/layout/Grid/Grid.tsx
interface GridProps {
  children: React.ReactNode
  cols?: Partial<Record<Breakpoint, number>>
  gap?: Partial<Record<Breakpoint, number>>
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
}

export const Grid = ({ 
  children, 
  cols = { xs: 1, md: 2, lg: 3 }, 
  gap = { xs: 4, md: 6 },
  align = 'stretch',
  justify = 'start'
}: GridProps) => {
  const gridCols = useResponsiveValue(cols)
  const gridGap = useResponsiveValue(gap)
  
  return (
    <div 
      className="grid"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
        gap: `${gridGap * 0.25}rem`,
        alignItems: align,
        justifyContent: justify
      }}
    >
      {children}
    </div>
  )
}

// Grid item component
interface GridItemProps {
  children: React.ReactNode
  span?: Partial<Record<Breakpoint, number>>
  start?: Partial<Record<Breakpoint, number>>
}

export const GridItem = ({ children, span, start }: GridItemProps) => {
  const gridSpan = useResponsiveValue(span || {})
  const gridStart = useResponsiveValue(start || {})
  
  return (
    <div
      style={{
        gridColumn: gridSpan ? `span ${gridSpan}` : undefined,
        gridColumnStart: gridStart
      }}
    >
      {children}
    </div>
  )
}

// Usage example
<Grid cols={{ xs: 1, sm: 2, lg: 3 }} gap={{ xs: 4, lg: 6 }}>
  <GridItem span={{ xs: 1, md: 2 }}>
    <VehicleCard />
  </GridItem>
  <GridItem>
    <VehicleCard />
  </GridItem>
  <GridItem>
    <VehicleCard />
  </GridItem>
</Grid>
```

### 3. Container System

```typescript
// src/components/layout/Container/Container.tsx
interface ContainerProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: Partial<Record<Breakpoint, number>>
}

export const Container = ({ 
  children, 
  size = 'lg',
  padding = { xs: 4, sm: 6, lg: 8 }
}: ContainerProps) => {
  const containerPadding = useResponsiveValue(padding)
  
  const maxWidths = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    full: '100%'
  }
  
  return (
    <div
      className="container"
      style={{
        maxWidth: maxWidths[size],
        margin: '0 auto',
        padding: `0 ${containerPadding * 0.25}rem`
      }}
    >
      {children}
    </div>
  )
}
```

### 4. Responsive Typography

```typescript
// src/components/atoms/Text/Text.tsx
interface ResponsiveTextProps {
  children: React.ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
  size?: Partial<Record<Breakpoint, 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'>>
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  align?: Partial<Record<Breakpoint, 'left' | 'center' | 'right' | 'justify'>>
  color?: 'primary' | 'secondary' | 'muted' | 'inverse'
}

export const Text = ({ 
  children, 
  as: Component = 'p',
  size = { xs: 'base' },
  weight = 'normal',
  align = { xs: 'left' },
  color = 'primary'
}: ResponsiveTextProps) => {
  const fontSize = useResponsiveValue(size)
  const textAlign = useResponsiveValue(align)
  
  return (
    <Component
      className={`text text--size-${fontSize} text--weight-${weight} text--color-${color}`}
      style={{ textAlign }}
    >
      {children}
    </Component>
  )
}

// Typography scale component
export const Heading = ({ level, ...props }: { level: 1 | 2 | 3 | 4 | 5 | 6 } & ResponsiveTextProps) => {
  const defaultSizes = {
    1: { xs: '2xl', sm: '3xl', md: '4xl', lg: '5xl' },
    2: { xs: 'xl', sm: '2xl', md: '3xl', lg: '4xl' },
    3: { xs: 'lg', sm: 'xl', md: '2xl', lg: '3xl' },
    4: { xs: 'base', sm: 'lg', md: 'xl' },
    5: { xs: 'sm', sm: 'base', md: 'lg' },
    6: { xs: 'xs', sm: 'sm', md: 'base' }
  }
  
  return (
    <Text
      as={`h${level}` as any}
      size={defaultSizes[level]}
      weight="bold"
      {...props}
    />
  )
}
```

### 5. Responsive Images

```typescript
// src/components/atoms/Image/Image.tsx
interface ResponsiveImageProps {
  src: string
  alt: string
  sizes?: Partial<Record<Breakpoint, string>>
  aspectRatio?: Partial<Record<Breakpoint, number>>
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down'
  lazy?: boolean
  priority?: boolean
}

export const ResponsiveImage = ({ 
  src, 
  alt, 
  sizes = { xs: '100vw', sm: '50vw', lg: '33vw' },
  aspectRatio = { xs: 16/9 },
  objectFit = 'cover',
  lazy = true,
  priority = false
}: ResponsiveImageProps) => {
  const currentAspectRatio = useResponsiveValue(aspectRatio)
  const currentSizes = useResponsiveValue(sizes)
  
  return (
    <div 
      className="responsive-image"
      style={{ 
        aspectRatio: currentAspectRatio,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <img
        src={src}
        alt={alt}
        loading={lazy ? 'lazy' : priority ? 'eager' : undefined}
        decoding="async"
        sizes={Object.entries(sizes)
          .map(([bp, size]) => `(min-width: ${breakpoints[bp as Breakpoint]}) ${size}`)
          .join(', ')
        }
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />
    </div>
  )
}

// Vehicle image with optimized loading
export const VehicleImage = ({ 
  vehicle, 
  priority = false 
}: { 
  vehicle: { id: string; name: string; images: string[] }; 
  priority?: boolean 
}) => {
  return (
    <ResponsiveImage
      src={vehicle.images[0]}
      alt={`${vehicle.name} - Car rental vehicle`}
      sizes={{ 
        xs: '100vw', 
        sm: '50vw', 
        md: '33vw', 
        lg: '25vw' 
      }}
      aspectRatio={{ xs: 4/3, md: 3/2 }}
      priority={priority}
    />
  )
}
```

### 6. Mobile Navigation Patterns

```typescript
// src/components/organisms/MobileNavigation/MobileNavigation.tsx
interface MobileNavigationProps {
  items: NavigationItem[]
  isOpen: boolean
  onToggle: () => void
}

export const MobileNavigation = ({ items, isOpen, onToggle }: MobileNavigationProps) => {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])
  
  if (!mounted) return null
  
  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        className="mobile-nav__toggle md:hidden"
        onClick={onToggle}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <div className={`hamburger ${isOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
      
      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-nav__overlay ${isOpen ? 'open' : ''}`}
        onClick={onToggle}
        aria-hidden={!isOpen}
      />
      
      {/* Mobile Menu */}
      <nav
        id="mobile-menu"
        className={`mobile-nav__menu ${isOpen ? 'open' : ''}`}
        aria-hidden={!isOpen}
      >
        <div className="mobile-nav__header">
          <h2>Menu</h2>
          <button
            onClick={onToggle}
            aria-label="Close menu"
            className="mobile-nav__close"
          >
            ×
          </button>
        </div>
        
        <ul className="mobile-nav__list">
          {items.map((item) => (
            <li key={item.href} className="mobile-nav__item">
              <a
                href={item.href}
                className="mobile-nav__link"
                onClick={onToggle}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}

// Desktop Navigation
export const DesktopNavigation = ({ items }: { items: NavigationItem[] }) => {
  return (
    <nav className="desktop-nav hidden md:block">
      <ul className="desktop-nav__list">
        {items.map((item) => (
          <li key={item.href} className="desktop-nav__item">
            <a href={item.href} className="desktop-nav__link">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// Responsive Navigation Wrapper
export const Navigation = ({ items }: { items: NavigationItem[] }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const breakpoint = useBreakpoint()
  
  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (breakpoint === 'md' || breakpoint === 'lg' || breakpoint === 'xl') {
      setMobileMenuOpen(false)
    }
  }, [breakpoint])
  
  return (
    <>
      <MobileNavigation
        items={items}
        isOpen={mobileMenuOpen}
        onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />
      <DesktopNavigation items={items} />
    </>
  )
}
```

### 7. Responsive Card Layout

```typescript
// src/components/molecules/Card/ResponsiveCard.tsx
interface ResponsiveCardProps {
  children: React.ReactNode
  direction?: Partial<Record<Breakpoint, 'row' | 'column'>>
  padding?: Partial<Record<Breakpoint, number>>
  gap?: Partial<Record<Breakpoint, number>>
}

export const ResponsiveCard = ({ 
  children, 
  direction = { xs: 'column', md: 'row' },
  padding = { xs: 4, md: 6 },
  gap = { xs: 3, md: 4 }
}: ResponsiveCardProps) => {
  const flexDirection = useResponsiveValue(direction)
  const cardPadding = useResponsiveValue(padding)
  const cardGap = useResponsiveValue(gap)
  
  return (
    <div
      className="responsive-card"
      style={{
        display: 'flex',
        flexDirection,
        padding: `${cardPadding * 0.25}rem`,
        gap: `${cardGap * 0.25}rem`,
        backgroundColor: 'var(--color-background-elevated)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--color-border-primary)'
      }}
    >
      {children}
    </div>
  )
}

// Vehicle Card Implementation
export const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
  return (
    <ResponsiveCard
      direction={{ xs: 'column', sm: 'row' }}
      padding={{ xs: 4, sm: 5 }}
    >
      <div className="vehicle-card__image">
        <VehicleImage vehicle={vehicle} />
      </div>
      
      <div className="vehicle-card__content">
        <Heading level={3} size={{ xs: 'lg', sm: 'xl' }}>
          {vehicle.name}
        </Heading>
        
        <Text 
          size={{ xs: 'sm', sm: 'base' }} 
          color="secondary"
        >
          {vehicle.category}
        </Text>
        
        <div className="vehicle-card__features">
          {vehicle.features.map((feature) => (
            <Badge key={feature} size="sm">
              {feature}
            </Badge>
          ))}
        </div>
        
        <div className="vehicle-card__price">
          <Text 
            size={{ xs: 'lg', sm: 'xl' }} 
            weight="bold"
            color="primary"
          >
            CHF {vehicle.pricePerDay}/day
          </Text>
        </div>
        
        <Button 
          size={{ xs: 'sm', sm: 'md' }}
          className="w-full sm:w-auto"
        >
          Book Now
        </Button>
      </div>
    </ResponsiveCard>
  )
}
```

### 8. Form Layout Patterns

```typescript
// src/components/organisms/BookingForm/ResponsiveBookingForm.tsx
export const ResponsiveBookingForm = () => {
  return (
    <form className="booking-form">
      {/* Two-column layout on desktop, single column on mobile */}
      <Grid 
        cols={{ xs: 1, md: 2 }} 
        gap={{ xs: 4, md: 6 }}
      >
        <GridItem span={{ xs: 1, md: 2 }}>
          <Heading level={2}>Vehicle Booking</Heading>
        </GridItem>
        
        {/* Personal Information */}
        <GridItem>
          <fieldset className="form-section">
            <legend>Personal Information</legend>
            <div className="space-y-4">
              <FormField
                label="First Name"
                name="firstName"
                required
              />
              <FormField
                label="Last Name"
                name="lastName"
                required
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                required
              />
              <FormField
                label="Phone"
                name="phone"
                type="tel"
                required
              />
            </div>
          </fieldset>
        </GridItem>
        
        {/* Booking Details */}
        <GridItem>
          <fieldset className="form-section">
            <legend>Booking Details</legend>
            <div className="space-y-4">
              <FormField
                label="Pick-up Date"
                name="pickupDate"
                type="date"
                required
              />
              <FormField
                label="Return Date"
                name="returnDate"
                type="date"
                required
              />
              <FormField
                label="Pick-up Location"
                name="pickupLocation"
                as="select"
                required
              >
                <option value="">Select location</option>
                <option value="zurich">Zurich</option>
                <option value="geneva">Geneva</option>
                <option value="basel">Basel</option>
              </FormField>
            </div>
          </fieldset>
        </GridItem>
        
        {/* Full-width submit button */}
        <GridItem span={{ xs: 1, md: 2 }}>
          <Button 
            type="submit" 
            size={{ xs: 'md', md: 'lg' }}
            className="w-full"
          >
            Complete Booking
          </Button>
        </GridItem>
      </Grid>
    </form>
  )
}
```

### 9. CSS Implementation

```css
/* src/styles/responsive.css */

/* Base mobile styles */
.mobile-nav__toggle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
}

.hamburger {
  position: relative;
  width: 1.5rem;
  height: 1.125rem;
}

.hamburger span {
  display: block;
  position: absolute;
  height: 2px;
  width: 100%;
  background: var(--color-foreground);
  border-radius: 1px;
  transition: all 0.3s ease;
}

.hamburger span:nth-child(1) {
  top: 0;
}

.hamburger span:nth-child(2) {
  top: 50%;
  transform: translateY(-50%);
}

.hamburger span:nth-child(3) {
  bottom: 0;
}

/* Hamburger animation */
.hamburger.open span:nth-child(1) {
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
}

.hamburger.open span:nth-child(3) {
  bottom: 50%;
  transform: translateY(50%) rotate(-45deg);
}

/* Mobile menu overlay */
.mobile-nav__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 40;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.mobile-nav__overlay.open {
  opacity: 1;
  visibility: visible;
}

/* Mobile menu */
.mobile-nav__menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  max-width: 80vw;
  height: 100vh;
  background: var(--color-background);
  box-shadow: var(--shadow-xl);
  z-index: 50;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  overflow-y: auto;
}

.mobile-nav__menu.open {
  transform: translateX(0);
}

.mobile-nav__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border-primary);
}

.mobile-nav__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-nav__item {
  border-bottom: 1px solid var(--color-border-primary);
}

.mobile-nav__link {
  display: block;
  padding: 1rem;
  color: var(--color-foreground);
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.mobile-nav__link:hover {
  background: var(--color-accent);
}

/* Responsive utilities */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Print styles */
@media print {
  .mobile-nav__toggle,
  .mobile-nav__menu,
  .mobile-nav__overlay {
    display: none !important;
  }
  
  .responsive-card {
    break-inside: avoid;
    box-shadow: none !important;
    border: 1px solid #000 !important;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .mobile-nav__menu {
    border: 2px solid;
  }
  
  .mobile-nav__link {
    border-bottom: 1px solid;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .hamburger span,
  .mobile-nav__overlay,
  .mobile-nav__menu,
  .mobile-nav__link {
    transition: none !important;
  }
}

/* Desktop styles */
@media (min-width: 768px) {
  .mobile-nav__toggle {
    display: none;
  }
  
  .mobile-nav__overlay,
  .mobile-nav__menu {
    display: none;
  }
}
```

## Performance Considerations

### 1. Lazy Loading
- Images load progressively based on viewport
- Non-critical CSS loads asynchronously
- Component-level code splitting

### 2. Touch Optimization
- 44px minimum touch targets
- Gesture-friendly spacing
- Fast-tap response (no 300ms delay)

### 3. Network Optimization
- Responsive images with proper sizing
- Critical CSS inlined
- Progressive enhancement for slow connections

## Testing Strategy

### 1. Device Testing
- iOS Safari (iPhone 12 Pro, iPad)
- Android Chrome (Samsung Galaxy, Pixel)
- Desktop browsers (Chrome, Firefox, Safari, Edge)

### 2. Network Testing
- Throttled connections (3G, 4G)
- Offline functionality
- Progressive loading

### 3. Accessibility Testing
- Touch target sizes
- Orientation changes
- Screen reader compatibility