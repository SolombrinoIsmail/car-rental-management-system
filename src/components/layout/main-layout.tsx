'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  sidebarCollapsed?: boolean;
  fullWidth?: boolean;
}

/**
 * Main layout component providing consistent structure
 */
export function MainLayout({
  children,
  header,
  sidebar,
  footer,
  className,
  sidebarCollapsed = false,
  fullWidth = false,
}: MainLayoutProps) {
  return (
    <div className={cn('flex min-h-screen flex-col bg-background', className)}>
      {/* Header */}
      {header && <div className="flex-shrink-0">{header}</div>}

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebar && (
          <aside
            className={cn(
              'flex-shrink-0 border-r bg-muted/40 transition-all duration-300',
              sidebarCollapsed ? 'w-16' : 'w-64',
              'hidden lg:block',
            )}
          >
            {sidebar}
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className={cn('h-full', !fullWidth && 'container py-6')}>{children}</div>
        </main>
      </div>

      {/* Footer */}
      {footer && <div className="flex-shrink-0 border-t">{footer}</div>}
    </div>
  );
}

/**
 * Page container for consistent spacing and max-width
 */
interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function PageContainer({
  children,
  title,
  description,
  actions,
  breadcrumb,
  className,
  maxWidth = 'full',
}: PageContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-none',
  };

  return (
    <div className={cn('space-y-6', maxWidthClasses[maxWidth], className)}>
      {/* Page Header */}
      {(title || description || actions || breadcrumb) && (
        <div className="space-y-4">
          {breadcrumb}

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {title && <h1 className="text-2xl font-bold tracking-tight">{title}</h1>}
              {description && <p className="text-muted-foreground">{description}</p>}
            </div>
            {actions && <div className="flex items-center space-x-2">{actions}</div>}
          </div>
        </div>
      )}

      {/* Page Content */}
      {children}
    </div>
  );
}

/**
 * Grid layout for cards and content
 */
interface GridLayoutProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: number;
  className?: string;
}

export function GridLayout({ children, cols = 3, gap = 6, className }: GridLayoutProps) {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };

  const gapClass = `gap-${gap}`;

  return <div className={cn('grid', colsClasses[cols], gapClass, className)}>{children}</div>;
}

/**
 * Responsive stack layout
 */
interface StackLayoutProps {
  children: React.ReactNode;
  direction?: 'vertical' | 'horizontal' | 'responsive';
  spacing?: number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  className?: string;
}

export function StackLayout({
  children,
  direction = 'vertical',
  spacing = 4,
  align = 'start',
  justify = 'start',
  className,
}: StackLayoutProps) {
  const directionClasses = {
    vertical: 'flex flex-col',
    horizontal: 'flex flex-row',
    responsive: 'flex flex-col md:flex-row',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  const spacingClass = direction === 'vertical' ? `space-y-${spacing}` : `space-x-${spacing}`;

  return (
    <div
      className={cn(
        directionClasses[direction],
        alignClasses[align],
        justifyClasses[justify],
        direction === 'responsive'
          ? `space-y-${spacing} md:space-y-0 md:space-x-${spacing}`
          : spacingClass,
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Section divider component
 */
interface SectionDividerProps {
  label?: string;
  className?: string;
}

export function SectionDivider({ label, className }: SectionDividerProps) {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      {label && (
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">{label}</span>
        </div>
      )}
    </div>
  );
}
