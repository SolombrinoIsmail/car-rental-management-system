'use client';

import * as React from 'react';

/**
 * Available theme options
 */
type Theme = 'dark' | 'light' | 'system';

/**
 * ThemeProvider component properties
 */
type ThemeProviderProps = {
  /** Child components to wrap with theme context */
  children: React.ReactNode;
  /** Default theme to use on initial load */
  defaultTheme?: Theme;
  /** LocalStorage key for persisting theme preference */
  storageKey?: string;
  /** Enable theme transition animations */
  enableTransitions?: boolean;
  /** Force a specific theme (overrides user preference) */
  forcedTheme?: Theme;
};

/**
 * Theme context state
 */
type ThemeProviderState = {
  /** Current active theme */
  theme: Theme;
  /** Function to update the theme */
  setTheme: (theme: Theme) => void;
  /** Resolved theme (system theme resolved to light/dark) */
  resolvedTheme: 'light' | 'dark';
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  resolvedTheme: 'light',
};

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

// Valid theme values for sanitization
const VALID_THEMES: readonly Theme[] = ['light', 'dark', 'system'] as const;

/**
 * Sanitize theme value from localStorage to prevent XSS
 */
function sanitizeTheme(value: unknown): Theme | null {
  if (typeof value !== 'string') return null;
  const sanitized = value.toLowerCase().trim() as Theme;
  return VALID_THEMES.includes(sanitized) ? sanitized : null;
}

/**
 * Theme provider component that manages light/dark mode across the application.
 * Persists user preference to localStorage and responds to system theme changes.
 *
 * @example
 * ```tsx
 * <ThemeProvider defaultTheme="system" storageKey="app-theme">
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ui-theme',
  enableTransitions = true,
  forcedTheme,
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (forcedTheme) return forcedTheme;

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        const sanitized = sanitizeTheme(stored);
        if (sanitized) return sanitized;
      } catch (error) {
        console.warn('Failed to read theme from localStorage:', error);
      }
    }

    return defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = React.useState<'light' | 'dark'>('light');

  // Handle system theme changes
  React.useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? 'dark' : 'light');
    };

    // Set initial resolved theme
    setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Apply theme to document
  React.useEffect(() => {
    const root = window.document.documentElement;
    const actualTheme = forcedTheme || theme;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');

    // Add transition class if enabled
    if (enableTransitions && !root.classList.contains('theme-transition')) {
      root.classList.add('theme-transition');
      root.style.setProperty('--theme-transition', 'background-color 0.3s ease, color 0.3s ease');
    }

    if (actualTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      setResolvedTheme(systemTheme);
    } else {
      root.classList.add(actualTheme);
      setResolvedTheme(actualTheme);
    }

    // Set ARIA attribute for accessibility
    root.setAttribute('data-theme', actualTheme === 'system' ? resolvedTheme : actualTheme);
  }, [theme, forcedTheme, enableTransitions, resolvedTheme]);

  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      if (forcedTheme) {
        console.warn('Cannot change theme when forcedTheme is set');
        return;
      }

      // Sanitize the new theme value
      const sanitized = sanitizeTheme(newTheme);
      if (!sanitized) {
        console.error(`Invalid theme value: ${newTheme}`);
        return;
      }

      try {
        localStorage.setItem(storageKey, sanitized);
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }

      setThemeState(sanitized);
    },
    [forcedTheme, storageKey],
  );

  const value = React.useMemo(
    () => ({
      theme: forcedTheme || theme,
      setTheme,
      resolvedTheme: theme === 'system' ? resolvedTheme : theme === 'dark' ? 'dark' : 'light',
    }),
    [theme, setTheme, resolvedTheme, forcedTheme],
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

/**
 * Hook to access and control the current theme.
 * Must be used within a ThemeProvider.
 *
 * @example
 * ```tsx
 * const { theme, setTheme, resolvedTheme } = useTheme();
 * ```
 */
export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
