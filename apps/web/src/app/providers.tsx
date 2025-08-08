'use client';

import { ThemeProvider } from '@swiss-car-rental/ui';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="car-rental-theme">
      {children}
    </ThemeProvider>
  );
}
