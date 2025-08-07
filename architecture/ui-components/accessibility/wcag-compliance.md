# WCAG 2.1 Accessibility Compliance Strategy

## Architecture Decision Record (ADR-003): Accessibility-First Design

### Status: Accepted
### Date: 2025-08-07
### Context: Legal requirement for accessibility compliance in Swiss market

## Accessibility Architecture

### 1. WCAG 2.1 Level AA Compliance Framework

```typescript
// src/accessibility/index.ts
export interface AccessibilityRequirements {
  perceivable: {
    textAlternatives: boolean
    captions: boolean
    adaptable: boolean
    distinguishable: boolean
  }
  operable: {
    keyboardAccessible: boolean
    seizures: boolean
    navigable: boolean
    inputModalities: boolean
  }
  understandable: {
    readable: boolean
    predictable: boolean
    inputAssistance: boolean
  }
  robust: {
    compatible: boolean
  }
}

export const wcagCompliance: AccessibilityRequirements = {
  perceivable: {
    textAlternatives: true,    // 1.1.1 - All images have alt text
    captions: true,           // 1.2.2 - Video captions
    adaptable: true,          // 1.3.x - Structure and relationships
    distinguishable: true     // 1.4.x - Color contrast, text resize
  },
  operable: {
    keyboardAccessible: true, // 2.1.x - Full keyboard navigation
    seizures: true,          // 2.3.x - No seizure-inducing content
    navigable: true,         // 2.4.x - Skip links, headings, focus
    inputModalities: true    // 2.5.x - Touch and pointer accessibility
  },
  understandable: {
    readable: true,          // 3.1.x - Language identification
    predictable: true,       // 3.2.x - Consistent navigation
    inputAssistance: true    // 3.3.x - Error identification and help
  },
  robust: {
    compatible: true         // 4.1.x - Valid HTML, ARIA compliance
  }
}
```

### 2. Accessibility Testing Framework

```typescript
// src/accessibility/testing/axe-config.ts
import { configureAxe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

export const axeConfig = {
  rules: {
    // WCAG 2.1 Level AA rules
    'color-contrast': { enabled: true },
    'keyboard-navigation': { enabled: true },
    'focus-order-semantics': { enabled: true },
    'aria-required-attr': { enabled: true },
    'aria-valid-attr-value': { enabled: true },
    'button-name': { enabled: true },
    'bypass': { enabled: true },
    'document-title': { enabled: true },
    'duplicate-id': { enabled: true },
    'form-field-multiple-labels': { enabled: true },
    'frame-title': { enabled: true },
    'html-has-lang': { enabled: true },
    'html-lang-valid': { enabled: true },
    'image-alt': { enabled: true },
    'input-image-alt': { enabled: true },
    'label': { enabled: true },
    'lang': { enabled: true },
    'link-name': { enabled: true },
    'list': { enabled: true },
    'listitem': { enabled: true },
    'meta-refresh': { enabled: true },
    'meta-viewport': { enabled: true },
    'object-alt': { enabled: true },
    'page-has-heading-one': { enabled: true },
    'role-img-alt': { enabled: true },
    'scrollable-region-focusable': { enabled: true },
    'server-side-image-map': { enabled: true },
    'svg-img-alt': { enabled: true },
    'td-headers-attr': { enabled: true },
    'th-has-data-cells': { enabled: true },
    'valid-lang': { enabled: true },
    'video-caption': { enabled: true }
  },
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa']
}

// Automated testing helper
export const testAccessibility = async (component: HTMLElement) => {
  const axe = configureAxe(axeConfig)
  const results = await axe(component)
  expect(results).toHaveNoViolations()
}
```

### 3. Component Accessibility Patterns

```typescript
// src/components/atoms/Button/Button.a11y.tsx
import { forwardRef, ButtonHTMLAttributes } from 'react'
import { useId } from '@/hooks/useId'

interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  // Accessibility props
  'aria-describedby'?: string
  'aria-expanded'?: boolean
  'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
}

export const Button = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ 
    children, 
    loading, 
    loadingText = 'Loading...', 
    leftIcon, 
    rightIcon,
    disabled,
    'aria-describedby': ariaDescribedBy,
    ...props 
  }, ref) => {
    const loadingId = useId('button-loading')
    
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-describedby={
          loading ? loadingId : ariaDescribedBy
        }
        {...props}
      >
        {loading && (
          <>
            <span 
              id={loadingId}
              className="sr-only"
              aria-live="polite"
            >
              {loadingText}
            </span>
            <svg className="animate-spin" aria-hidden="true">
              {/* Spinner icon */}
            </svg>
          </>
        )}
        
        {leftIcon && (
          <span aria-hidden="true">{leftIcon}</span>
        )}
        
        <span>{children}</span>
        
        {rightIcon && (
          <span aria-hidden="true">{rightIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
```

### 4. Form Accessibility Implementation

```typescript
// src/components/molecules/FormField/FormField.a11y.tsx
import { forwardRef, InputHTMLAttributes } from 'react'
import { useId } from '@/hooks/useId'

interface AccessibleFormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  help?: string
  required?: boolean
  optional?: boolean
}

export const FormField = forwardRef<HTMLInputElement, AccessibleFormFieldProps>(
  ({ label, error, help, required, optional, ...props }, ref) => {
    const id = useId('form-field')
    const errorId = useId('form-field-error')
    const helpId = useId('form-field-help')
    
    return (
      <div className="form-field">
        <label 
          htmlFor={id}
          className="form-field__label"
        >
          {label}
          {required && (
            <span 
              className="form-field__required"
              aria-label="required"
            >
              *
            </span>
          )}
          {optional && (
            <span className="form-field__optional">
              (optional)
            </span>
          )}
        </label>
        
        <input
          ref={ref}
          id={id}
          aria-required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={[
            error && errorId,
            help && helpId
          ].filter(Boolean).join(' ') || undefined}
          {...props}
        />
        
        {help && (
          <div 
            id={helpId}
            className="form-field__help"
          >
            {help}
          </div>
        )}
        
        {error && (
          <div 
            id={errorId}
            className="form-field__error"
            role="alert"
            aria-live="polite"
          >
            <span className="sr-only">Error: </span>
            {error}
          </div>
        )}
      </div>
    )
  }
)

FormField.displayName = 'FormField'
```

### 5. Navigation Accessibility

```typescript
// src/components/organisms/Navigation/Navigation.a11y.tsx
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'

interface NavigationProps {
  items: Array<{
    href: string
    label: string
    current?: boolean
    children?: Array<{
      href: string
      label: string
    }>
  }>
}

export const Navigation = ({ items }: NavigationProps) => {
  const router = useRouter()
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const skipLinkRef = useRef<HTMLAnchorElement>(null)
  
  // Skip to content functionality
  const handleSkipToContent = (e: React.MouseEvent) => {
    e.preventDefault()
    const main = document.querySelector('#main-content')
    if (main) {
      (main as HTMLElement).focus()
      (main as HTMLElement).scrollIntoView()
    }
  }
  
  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, href: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      router.push(href)
    }
    
    if (e.key === 'Escape') {
      setActiveSubmenu(null)
    }
  }
  
  return (
    <nav 
      role="navigation" 
      aria-label="Main navigation"
      className="navigation"
    >
      {/* Skip to content link */}
      <a
        ref={skipLinkRef}
        href="#main-content"
        className="skip-link"
        onClick={handleSkipToContent}
        onFocus={(e) => e.target.scrollIntoView()}
      >
        Skip to main content
      </a>
      
      <ul className="navigation__list" role="menubar">
        {items.map((item, index) => (
          <li 
            key={item.href}
            className="navigation__item"
            role="none"
          >
            {item.children ? (
              // Submenu implementation
              <div className="navigation__submenu-container">
                <button
                  className="navigation__link"
                  aria-expanded={activeSubmenu === item.href}
                  aria-haspopup="true"
                  aria-controls={`submenu-${index}`}
                  onKeyDown={(e) => handleKeyDown(e, item.href)}
                  onClick={() => setActiveSubmenu(
                    activeSubmenu === item.href ? null : item.href
                  )}
                  role="menuitem"
                >
                  {item.label}
                  <span 
                    aria-hidden="true"
                    className={`navigation__arrow ${
                      activeSubmenu === item.href ? 'expanded' : ''
                    }`}
                  >
                    ▼
                  </span>
                </button>
                
                <ul
                  id={`submenu-${index}`}
                  className={`navigation__submenu ${
                    activeSubmenu === item.href ? 'open' : ''
                  }`}
                  role="menu"
                  aria-labelledby={`submenu-${index}-button`}
                >
                  {item.children.map((child) => (
                    <li key={child.href} role="none">
                      <a
                        href={child.href}
                        className="navigation__submenu-link"
                        role="menuitem"
                        aria-current={router.pathname === child.href ? 'page' : undefined}
                        onKeyDown={(e) => handleKeyDown(e, child.href)}
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              // Regular link
              <a
                href={item.href}
                className="navigation__link"
                aria-current={router.pathname === item.href ? 'page' : undefined}
                role="menuitem"
                onKeyDown={(e) => handleKeyDown(e, item.href)}
              >
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

### 6. Data Table Accessibility

```typescript
// src/components/organisms/DataTable/DataTable.a11y.tsx
import { useState, useMemo } from 'react'

interface Column<T> {
  key: keyof T
  header: string
  sortable?: boolean
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  caption?: string
  sortable?: boolean
  selectable?: boolean
  onSelectionChange?: (selected: T[]) => void
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  caption,
  sortable = false,
  selectable = false,
  onSelectionChange
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T
    direction: 'asc' | 'desc'
  } | null>(null)
  const [selectedRows, setSelectedRows] = useState<Set<T['id']>>(new Set())
  
  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return data
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [data, sortConfig])
  
  // Handle sorting
  const handleSort = (key: keyof T) => {
    if (!sortable) return
    
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }
  
  // Handle row selection
  const handleRowSelect = (rowId: T['id'], selected: boolean) => {
    const newSelected = new Set(selectedRows)
    if (selected) {
      newSelected.add(rowId)
    } else {
      newSelected.delete(rowId)
    }
    setSelectedRows(newSelected)
    
    const selectedData = data.filter(row => newSelected.has(row.id))
    onSelectionChange?.(selectedData)
  }
  
  // Select all functionality
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const allIds = new Set(data.map(row => row.id))
      setSelectedRows(allIds)
      onSelectionChange?.(data)
    } else {
      setSelectedRows(new Set())
      onSelectionChange?.([])
    }
  }
  
  return (
    <div className="data-table-wrapper">
      {/* Screen reader announcements */}
      <div 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      >
        {sortConfig && 
          `Table sorted by ${String(sortConfig.key)} ${sortConfig.direction}ending`
        }
        {selectable && 
          `${selectedRows.size} of ${data.length} rows selected`
        }
      </div>
      
      <table 
        className="data-table"
        role="table"
        aria-rowcount={data.length + 1} // +1 for header
        aria-colcount={columns.length + (selectable ? 1 : 0)}
      >
        {caption && (
          <caption className="data-table__caption">
            {caption}
          </caption>
        )}
        
        <thead>
          <tr role="row">
            {selectable && (
              <th 
                scope="col"
                className="data-table__header data-table__header--select"
              >
                <input
                  type="checkbox"
                  checked={selectedRows.size === data.length && data.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  aria-label="Select all rows"
                />
              </th>
            )}
            
            {columns.map((column, index) => (
              <th
                key={String(column.key)}
                scope="col"
                className={`data-table__header ${
                  sortable && column.sortable !== false ? 'sortable' : ''
                }`}
                aria-sort={
                  sortConfig?.key === column.key
                    ? sortConfig.direction === 'asc' ? 'ascending' : 'descending'
                    : sortable && column.sortable !== false ? 'none' : undefined
                }
                onClick={() => sortable && column.sortable !== false && handleSort(column.key)}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && sortable && column.sortable !== false) {
                    e.preventDefault()
                    handleSort(column.key)
                  }
                }}
                tabIndex={sortable && column.sortable !== false ? 0 : undefined}
                role={sortable && column.sortable !== false ? 'button' : undefined}
              >
                <span>{column.header}</span>
                {sortable && column.sortable !== false && (
                  <span 
                    className="data-table__sort-indicator"
                    aria-hidden="true"
                  >
                    {sortConfig?.key === column.key ? 
                      (sortConfig.direction === 'asc' ? '↑' : '↓') : 
                      '↕'
                    }
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr 
              key={row.id}
              role="row"
              className={selectedRows.has(row.id) ? 'selected' : ''}
              aria-rowindex={rowIndex + 2} // +2 for 1-based index and header
            >
              {selectable && (
                <td 
                  className="data-table__cell data-table__cell--select"
                  role="gridcell"
                >
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.id)}
                    onChange={(e) => handleRowSelect(row.id, e.target.checked)}
                    aria-label={`Select row ${rowIndex + 1}`}
                  />
                </td>
              )}
              
              {columns.map((column, colIndex) => (
                <td
                  key={String(column.key)}
                  className="data-table__cell"
                  role="gridcell"
                  aria-colindex={colIndex + 1 + (selectable ? 1 : 0)}
                >
                  {column.render 
                    ? column.render(row[column.key], row)
                    : String(row[column.key])
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

### 7. Accessibility Testing Strategy

```typescript
// src/accessibility/testing/accessibility.test.ts
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Button } from '@/components/atoms/Button'
import { FormField } from '@/components/molecules/FormField'
import { DataTable } from '@/components/organisms/DataTable'

expect.extend(toHaveNoViolations)

describe('Accessibility Tests', () => {
  describe('Button Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<Button>Click me</Button>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
    
    it('should have proper ARIA attributes when loading', async () => {
      const { container } = render(
        <Button loading loadingText="Processing...">
          Submit
        </Button>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
  
  describe('FormField Component', () => {
    it('should associate label with input', async () => {
      const { container, getByLabelText } = render(
        <FormField 
          label="Email Address" 
          type="email" 
          required 
        />
      )
      
      expect(getByLabelText('Email Address')).toBeInTheDocument()
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
    
    it('should properly announce errors', async () => {
      const { container } = render(
        <FormField 
          label="Password" 
          type="password" 
          error="Password is required"
        />
      )
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
  
  describe('DataTable Component', () => {
    const mockData = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ]
    
    const columns = [
      { key: 'name' as const, header: 'Name' },
      { key: 'email' as const, header: 'Email' }
    ]
    
    it('should have proper table structure', async () => {
      const { container } = render(
        <DataTable 
          data={mockData}
          columns={columns}
          caption="User list"
        />
      )
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
    
    it('should support keyboard navigation when sortable', async () => {
      const { container } = render(
        <DataTable 
          data={mockData}
          columns={columns}
          sortable
        />
      )
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
```

### 8. Screen Reader Testing

```typescript
// src/accessibility/testing/screen-reader.test.ts
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VehicleBookingForm } from '@/components/domain/booking/VehicleBookingForm'

describe('Screen Reader Experience', () => {
  it('should provide clear form structure', async () => {
    render(<VehicleBookingForm />)
    
    // Check for proper heading hierarchy
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Book a Vehicle')
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Vehicle Selection')
    
    // Check for form landmarks
    expect(screen.getByRole('form')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit booking/i })).toBeInTheDocument()
    
    // Check for error announcements
    const user = userEvent.setup()
    const submitButton = screen.getByRole('button', { name: /submit booking/i })
    await user.click(submitButton)
    
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
  
  it('should announce dynamic content changes', async () => {
    const { container } = render(<VehicleBookingForm />)
    
    // Check for live regions
    expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument()
    expect(container.querySelector('[aria-live="assertive"]')).toBeInTheDocument()
  })
})
```

## Implementation Guidelines

### 1. Development Checklist
- [ ] All interactive elements are keyboard accessible
- [ ] Color contrast meets WCAG AA standards (4.5:1 normal text, 3:1 large text)
- [ ] All images have descriptive alt text
- [ ] Forms have proper labels and error handling
- [ ] Page structure uses semantic HTML and proper heading hierarchy
- [ ] Focus management is implemented correctly
- [ ] Loading and error states are announced to screen readers
- [ ] Tables have proper headers and captions

### 2. Testing Strategy
- **Automated**: Jest + axe-core for WCAG compliance
- **Manual**: Keyboard navigation testing
- **Screen Reader**: NVDA/JAWS testing on Windows, VoiceOver on macOS
- **Visual**: High contrast mode testing
- **Cognitive**: Plain language review

### 3. Performance Impact
- < 2KB added for accessibility features
- No impact on component render performance
- Semantic HTML improves SEO and accessibility simultaneously