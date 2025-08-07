# Design System Tokens and Theme Configuration

## Architecture Decision Record (ADR-002): Design System Foundation

### Status: Accepted
### Date: 2025-08-07
### Context: Need for consistent, scalable design system with Swiss design principles

## Design Token Architecture

### 1. Token Hierarchy

```typescript
// src/design-system/tokens/index.ts
export const tokens = {
  // Primitive tokens (brand-agnostic)
  primitive: {
    colors: {
      neutral: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
        950: '#0a0a0a'
      },
      red: {
        50: '#fef2f2',
        500: '#ef4444',
        600: '#dc2626',
        900: '#7f1d1d'
      },
      // Swiss flag inspiration
      swissRed: {
        50: '#fff1f1',
        500: '#dc143c',
        600: '#c41e3a',
        900: '#8b0000'
      },
      // Swiss brand colors
      alpine: {
        50: '#f0f9ff',
        500: '#0ea5e9',
        600: '#0284c7',
        900: '#0c4a6e'
      }
    },
    spacing: {
      0: '0px',
      1: '0.25rem',  // 4px
      2: '0.5rem',   // 8px
      3: '0.75rem',  // 12px
      4: '1rem',     // 16px
      5: '1.25rem',  // 20px
      6: '1.5rem',   // 24px
      8: '2rem',     // 32px
      10: '2.5rem',  // 40px
      12: '3rem',    // 48px
      16: '4rem',    // 64px
      20: '5rem',    // 80px
      24: '6rem'     // 96px
    },
    typography: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
        // Swiss typography inspiration
        helvetica: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif']
      },
      fontSize: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem'     // 48px
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
      },
      lineHeight: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75'
      }
    },
    borderRadius: {
      none: '0px',
      sm: '0.125rem',   // 2px
      md: '0.375rem',   // 6px
      lg: '0.5rem',     // 8px
      xl: '0.75rem',    // 12px
      '2xl': '1rem',    // 16px
      full: '9999px'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
    }
  },
  
  // Semantic tokens (component-specific)
  semantic: {
    colors: {
      background: {
        primary: 'primitive.colors.neutral.50',
        secondary: 'primitive.colors.neutral.100',
        elevated: 'primitive.colors.neutral.0'
      },
      text: {
        primary: 'primitive.colors.neutral.900',
        secondary: 'primitive.colors.neutral.600',
        muted: 'primitive.colors.neutral.400',
        inverse: 'primitive.colors.neutral.50'
      },
      border: {
        primary: 'primitive.colors.neutral.200',
        secondary: 'primitive.colors.neutral.300',
        focus: 'primitive.colors.alpine.500'
      },
      brand: {
        primary: 'primitive.colors.swissRed.600',
        secondary: 'primitive.colors.alpine.600',
        tertiary: 'primitive.colors.neutral.800'
      },
      feedback: {
        success: {
          bg: 'primitive.colors.green.50',
          text: 'primitive.colors.green.800',
          border: 'primitive.colors.green.200'
        },
        warning: {
          bg: 'primitive.colors.yellow.50',
          text: 'primitive.colors.yellow.800',
          border: 'primitive.colors.yellow.200'
        },
        error: {
          bg: 'primitive.colors.red.50',
          text: 'primitive.colors.red.800',
          border: 'primitive.colors.red.200'
        },
        info: {
          bg: 'primitive.colors.alpine.50',
          text: 'primitive.colors.alpine.800',
          border: 'primitive.colors.alpine.200'
        }
      }
    }
  },
  
  // Component tokens
  component: {
    button: {
      primary: {
        bg: 'semantic.colors.brand.primary',
        text: 'semantic.colors.text.inverse',
        border: 'semantic.colors.brand.primary',
        hover: {
          bg: 'primitive.colors.swissRed.700'
        }
      },
      secondary: {
        bg: 'semantic.colors.background.primary',
        text: 'semantic.colors.text.primary',
        border: 'semantic.colors.border.primary',
        hover: {
          bg: 'semantic.colors.background.secondary'
        }
      },
      ghost: {
        bg: 'transparent',
        text: 'semantic.colors.brand.primary',
        hover: {
          bg: 'semantic.colors.background.secondary'
        }
      }
    },
    input: {
      bg: 'semantic.colors.background.primary',
      text: 'semantic.colors.text.primary',
      border: 'semantic.colors.border.primary',
      placeholder: 'semantic.colors.text.muted',
      focus: {
        border: 'semantic.colors.border.focus',
        ring: 'primitive.colors.alpine.200'
      },
      error: {
        border: 'semantic.colors.feedback.error.border',
        ring: 'semantic.colors.feedback.error.bg'
      }
    },
    card: {
      bg: 'semantic.colors.background.elevated',
      border: 'semantic.colors.border.primary',
      shadow: 'primitive.shadows.md'
    }
  }
}
```

### 2. Theme Configuration

```typescript
// src/design-system/themes/index.ts
export interface Theme {
  name: string
  colors: typeof tokens.semantic.colors
  typography: typeof tokens.primitive.typography
  spacing: typeof tokens.primitive.spacing
  shadows: typeof tokens.primitive.shadows
  borderRadius: typeof tokens.primitive.borderRadius
}

// Light Theme (Default)
export const lightTheme: Theme = {
  name: 'light',
  colors: {
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      elevated: '#ffffff'
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      muted: '#9ca3af',
      inverse: '#ffffff'
    },
    brand: {
      primary: '#c41e3a',  // Swiss red
      secondary: '#0284c7', // Alpine blue
      tertiary: '#1f2937'
    }
    // ... rest of light theme tokens
  },
  // ... other theme properties
}

// Dark Theme
export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      elevated: '#334155'
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      muted: '#64748b',
      inverse: '#0f172a'
    },
    brand: {
      primary: '#ef4444',  // Brighter red for dark mode
      secondary: '#3b82f6', // Brighter blue for dark mode
      tertiary: '#e2e8f0'
    }
    // ... rest of dark theme tokens
  },
  // ... other theme properties
}

// High Contrast Theme (Accessibility)
export const highContrastTheme: Theme = {
  name: 'high-contrast',
  colors: {
    background: {
      primary: '#ffffff',
      secondary: '#f3f4f6',
      elevated: '#ffffff'
    },
    text: {
      primary: '#000000',
      secondary: '#1f2937',
      muted: '#374151',
      inverse: '#ffffff'
    },
    brand: {
      primary: '#991b1b',  // Darker red for higher contrast
      secondary: '#1e40af', // Darker blue for higher contrast
      tertiary: '#000000'
    }
    // ... rest of high contrast theme tokens
  },
  // ... other theme properties
}
```

### 3. Theme Provider Implementation

```typescript
// src/design-system/providers/ThemeProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import { Theme, lightTheme, darkTheme, highContrastTheme } from '../themes'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  availableThemes: Theme[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
}

export const ThemeProvider = ({ 
  children, 
  defaultTheme = lightTheme 
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  
  const availableThemes = [lightTheme, darkTheme, highContrastTheme]
  
  const toggleTheme = () => {
    setTheme(current => 
      current.name === 'light' ? darkTheme : lightTheme
    )
  }
  
  // System theme detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setTheme(darkTheme)
      } else {
        setTheme(lightTheme)
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])
  
  // High contrast detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setTheme(highContrastTheme)
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])
  
  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      toggleTheme,
      availableThemes
    }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

### 4. CSS-in-JS Integration (Styled Components)

```typescript
// src/design-system/styled/index.ts
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { Theme } from '../themes'

// Extend styled-components theme type
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

// Theme utilities
export const getColor = (path: string) => (props: { theme: Theme }) => {
  const keys = path.split('.')
  return keys.reduce((obj, key) => obj?.[key], props.theme.colors)
}

export const getSpacing = (value: keyof Theme['spacing']) => 
  (props: { theme: Theme }) => props.theme.spacing[value]

// Example styled component
export const StyledButton = styled.button<{
  variant: 'primary' | 'secondary' | 'ghost'
  size: 'sm' | 'md' | 'lg'
}>`
  padding: ${props => 
    props.size === 'sm' ? `${getSpacing(2)(props)} ${getSpacing(3)(props)}` :
    props.size === 'md' ? `${getSpacing(3)(props)} ${getSpacing(4)(props)}` :
    `${getSpacing(4)(props)} ${getSpacing(6)(props)}`
  };
  
  background-color: ${props => 
    props.variant === 'primary' ? getColor('brand.primary')(props) :
    props.variant === 'secondary' ? getColor('background.secondary')(props) :
    'transparent'
  };
  
  color: ${props =>
    props.variant === 'primary' ? getColor('text.inverse')(props) :
    getColor('text.primary')(props)
  };
  
  border: 1px solid ${props =>
    props.variant === 'primary' ? getColor('brand.primary')(props) :
    props.variant === 'secondary' ? getColor('border.primary')(props) :
    'transparent'
  };
  
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  
  &:hover {
    background-color: ${props =>
      props.variant === 'primary' ? getColor('brand.primary')(props) + 'e6' :
      props.variant === 'secondary' ? getColor('background.elevated')(props) :
      getColor('background.secondary')(props)
    };
  }
  
  &:focus-visible {
    outline: 2px solid ${getColor('border.focus')};
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
```

### 5. Tailwind CSS Integration

```typescript
// tailwind.config.js
const { tokens } = require('./src/design-system/tokens')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primitive colors
        neutral: tokens.primitive.colors.neutral,
        'swiss-red': tokens.primitive.colors.swissRed,
        alpine: tokens.primitive.colors.alpine,
        
        // Semantic colors
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        muted: 'var(--color-muted)',
        accent: 'var(--color-accent)',
        destructive: 'var(--color-destructive)',
      },
      fontFamily: {
        sans: tokens.primitive.typography.fontFamily.sans,
        mono: tokens.primitive.typography.fontFamily.mono,
        helvetica: tokens.primitive.typography.fontFamily.helvetica,
      },
      fontSize: tokens.primitive.typography.fontSize,
      spacing: tokens.primitive.spacing,
      borderRadius: tokens.primitive.borderRadius,
      boxShadow: tokens.primitive.shadows,
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
```

### 6. CSS Custom Properties

```css
/* src/design-system/globals.css */
:root {
  /* Light theme variables */
  --color-primary: 196 30 58; /* Swiss red */
  --color-secondary: 2 132 199; /* Alpine blue */
  --color-background: 255 255 255;
  --color-foreground: 17 24 39;
  --color-muted: 156 163 175;
  --color-accent: 249 250 251;
  --color-destructive: 239 68 68;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 3rem;
  
  /* Typography */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* Border radius */
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
}

[data-theme="dark"] {
  --color-background: 15 23 42;
  --color-foreground: 248 250 252;
  --color-muted: 100 116 139;
  --color-accent: 30 41 59;
}

[data-theme="high-contrast"] {
  --color-primary: 153 27 27; /* Darker red */
  --color-secondary: 30 64 175; /* Darker blue */
  --color-background: 255 255 255;
  --color-foreground: 0 0 0;
  --color-muted: 55 65 81;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Swiss Design Principles

### 1. Typography Hierarchy
- Clean, readable sans-serif fonts (Helvetica inspiration)
- Clear hierarchy with consistent scaling
- Generous whitespace and line-height

### 2. Color Palette
- **Primary**: Swiss red (#c41e3a) - official flag color
- **Secondary**: Alpine blue (#0284c7) - mountain inspiration
- **Neutral**: High contrast grays for accessibility
- **Accent**: Subtle colors for status and feedback

### 3. Grid System
- 8px base unit for consistent spacing
- Golden ratio proportions (1:1.618)
- Clean layouts with ample whitespace

### 4. Interaction Design
- Subtle animations (200ms duration)
- Clear focus states for accessibility
- Consistent hover and active states

## Performance Optimizations

### 1. Theme Loading
- CSS custom properties for instant theme switching
- Minimal JavaScript for theme logic
- Preload critical theme assets

### 2. Token Management
- Tree-shakeable token exports
- Compile-time token resolution
- Minimal runtime overhead

### 3. Bundle Size
- < 5KB for core design system
- < 15KB for complete theme system
- Lazy loading for theme variations