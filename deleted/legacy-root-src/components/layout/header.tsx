'use client';

import * as React from 'react';
import { Menu, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageSelector } from '@/components/ui/language-selector';

interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
  sticky?: boolean;
}

/**
 * Main application header component
 * Includes navigation, theme toggle, and language selector
 */
export function Header({ children, className, sticky = true }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header
      className={cn(
        'border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        sticky && 'sticky top-0 z-50',
        className,
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-swiss-red">
              <span className="text-sm font-bold text-white">SR</span>
            </div>
            <span className="hidden font-bold sm:inline-block">Swiss Rental</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">{children}</nav>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          <LanguageSelector />
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t bg-background md:hidden">
          <nav className="container py-4">
            <div className="flex flex-col space-y-3">{children}</div>
          </nav>
        </div>
      )}
    </header>
  );
}

/**
 * Navigation link component for use in header
 */
export interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  className?: string;
  onClick?: () => void;
}

export function NavLink({ href, children, active = false, className, onClick }: NavLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        'text-sm font-medium transition-colors hover:text-primary',
        active ? 'text-foreground' : 'text-foreground/60',
        className,
      )}
    >
      {children}
    </a>
  );
}

/**
 * Breadcrumb navigation component
 */
interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn('flex', className)} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && <span className="mx-2 text-muted-foreground">/</span>}
            {item.href && !item.active ? (
              <a
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </a>
            ) : (
              <span
                className={cn(
                  'text-sm font-medium',
                  item.active ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
