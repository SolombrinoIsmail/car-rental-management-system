/**
 * UI Components Index
 *
 * Exports all UI components with Swiss design system and localization
 */

// Core UI Components
export { Button, buttonVariants } from './button';
export type { ButtonProps } from './button';

export { Input } from './input';
export type { InputProps } from './input';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from './dropdown-menu';

// Language & Theme Components
export { LanguageSelector } from './language-selector';
export type { LanguageSelectorProps } from './language-selector';

export { ThemeToggle } from './theme-toggle';
export type { ThemeToggleProps } from './theme-toggle';

/**
 * Swiss Design System Colors
 */
export const SWISS_COLORS = {
  // Official Swiss colors
  red: {
    DEFAULT: '#DC143C', // Swiss red
    50: '#FFF1F3',
    100: '#FFE0E5',
    200: '#FFC5D0',
    300: '#FF9AAE',
    400: '#FF5F84',
    500: '#FF2C5F',
    600: '#DC143C', // Primary Swiss red
    700: '#C01031',
    800: '#9F0E2A',
    900: '#850C25',
  },

  // Neutral colors for UI
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

/**
 * Swiss Design System Typography
 */
export const SWISS_TYPOGRAPHY = {
  // Font families
  fonts: {
    sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
    mono: ['Courier New', 'Courier', 'monospace'],
  },

  // Font sizes
  sizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
  },

  // Font weights
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line heights
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

/**
 * Swiss Design System Spacing
 */
export const SWISS_SPACING = {
  // Base spacing unit (4px)
  unit: 4,

  // Spacing scale
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  32: '8rem', // 128px
} as const;

/**
 * Swiss Design System Shadows
 */
export const SWISS_SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  none: 'none',
} as const;
