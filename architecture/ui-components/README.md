# UI Component Architecture

This directory contains the complete UI component architecture for the car rental management system.

## Structure

- `design-system/` - Design tokens, themes, and core styling system
- `components/` - Component hierarchy and organization patterns
- `patterns/` - Reusable UI patterns and compositions
- `accessibility/` - WCAG 2.1 compliance strategy and implementations
- `i18n/` - Swiss localization architecture (DE/FR/IT)
- `performance/` - Performance optimization strategies
- `integration/` - Next.js and Prisma integration patterns

## Key Principles

1. **Atomic Design** - Components built from atoms → molecules → organisms → templates → pages
2. **Accessibility First** - WCAG 2.1 AA compliance by design
3. **Mobile First** - Progressive enhancement from mobile to desktop
4. **Performance Optimized** - Tree-shaking, lazy loading, and bundle optimization
5. **Internationalization Ready** - Multi-language support with Swiss locales
6. **Type Safe** - Full TypeScript integration with strict typing

## Quick Links

- [Component Hierarchy](./components/hierarchy.md)
- [Design System](./design-system/tokens.md)
- [Accessibility Guide](./accessibility/wcag-compliance.md)
- [Responsive Design](./patterns/responsive.md)
- [Localization](./i18n/swiss-locales.md)