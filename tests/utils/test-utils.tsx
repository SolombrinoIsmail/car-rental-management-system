import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';

// Mock Next.js router
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
  route: '/',
  basePath: '',
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
  isFallback: false,
  events: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
};

// Mock next/router
vi.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Common test utilities
export const waitForLoadingToFinish = () => new Promise((resolve) => setTimeout(resolve, 0));

export const createMockEvent = (overrides = {}): Event =>
  ({
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    target: {},
    currentTarget: {},
    ...overrides,
  }) as unknown as Event;

// Swiss-specific test helpers
export const formatSwissPrice = (price: number): string => {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
  }).format(price);
};

export const formatSwissDate = (date: string): string => {
  return new Intl.DateTimeFormat('de-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
};

export const formatSwissPhoneNumber = (phone: string): string => {
  // Format Swiss phone numbers for testing
  return phone.replace(/(\+41)\s*(\d{2})\s*(\d{3})\s*(\d{2})\s*(\d{2})/, '$1 $2 $3 $4 $5');
};
