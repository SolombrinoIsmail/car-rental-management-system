/**
 * Layout Components Index
 *
 * Exports all layout-related components for consistent application structure
 */

// Main Layout Components
export { MainLayout, PageContainer, GridLayout, StackLayout, SectionDivider } from './main-layout';

export { Header, NavLink, Breadcrumb } from './header';

// Type exports
export type {
  MainLayoutProps,
  PageContainerProps,
  GridLayoutProps,
  StackLayoutProps,
  SectionDividerProps,
} from './main-layout';

export type { HeaderProps, NavLinkProps, BreadcrumbProps } from './header';

/**
 * Layout constants for consistent spacing and sizing
 */
export const LAYOUT_CONSTANTS = {
  // Container widths
  CONTAINER: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
  },

  // Spacing scale
  SPACING: {
    XS: '0.25rem', // 4px
    SM: '0.5rem', // 8px
    MD: '1rem', // 16px
    LG: '1.5rem', // 24px
    XL: '2rem', // 32px
    '2XL': '3rem', // 48px
    '3XL': '4rem', // 64px
  },

  // Common breakpoints
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
  },
} as const;
