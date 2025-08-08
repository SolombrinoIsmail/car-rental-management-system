# CRMS Architecture Documentation

This directory contains the complete architecture documentation for the Car Rental Management System
(CRMS), organized by topic for easy navigation and maintenance.

## Architecture Files

### [01-overview.md](01-overview.md) - System Overview

- Technical summary and platform choices
- High-level architecture diagram
- Technology stack and rationale
- Repository structure
- Architectural patterns

### [02-frontend.md](02-frontend.md) - Frontend Architecture

- Next.js 14 App Router structure
- Component design patterns (Server/Client/Hybrid)
- State management (React Query + Zustand)
- Performance optimization strategies
- UI component organization

### [03-backend.md](03-backend.md) - Backend Architecture

- Supabase-first approach
- Data models and business logic
- Error handling and logging
- Performance specifications
- Caching strategies

### [04-database.md](04-database.md) - Database Design

- Complete PostgreSQL schema
- Multi-tenant isolation with RLS
- Indexing and optimization
- Automated functions and triggers
- Data retention policies

### [05-api.md](05-api.md) - API Specification

- RESTful API design
- Authentication and authorization
- Core endpoints (contracts, vehicles, customers)
- Real-time subscriptions
- Swiss compliance features

### [06-security.md](06-security.md) - Security Architecture

- Multi-layer security model
- Authentication flow and RBAC
- Data protection and GDPR compliance
- Input validation and file upload security
- Audit logging and monitoring

### [07-deployment.md](07-deployment.md) - Deployment & DevOps

- CI/CD pipeline with GitHub Actions
- Multi-environment configuration
- Infrastructure as Code (Terraform)
- Monitoring and health checks
- Backup and disaster recovery

### [08-integrations.md](08-integrations.md) - External Integrations

- Stripe payment processing
- Swiss QR bill generation
- Email services (Resend)
- File storage (Supabase)
- Error monitoring (Sentry)
- Real-time updates

### [09-testing.md](09-testing.md) - Testing Architecture

- Testing strategy and test pyramid
- Unit, integration, and E2E testing
- Testing stack (Vitest, Playwright, Testing Library)
- Swiss-specific test scenarios
- Performance and security testing
- Test data factories and helpers

### [10-development-team.md](10-development-team.md) - Development & Team Architecture

- Code organization standards and naming conventions
- TypeScript, ESLint, and Prettier configurations
- Git workflow and branching strategy
- Code review process and standards
- Team collaboration patterns
- Documentation standards and ADRs

## Quick Navigation

### For Developers

- Start with [System Overview](01-overview.md) for the big picture
- Review [Development & Team Architecture](10-development-team.md) for coding standards
- Check [Frontend Architecture](02-frontend.md) for UI development
- Review [Testing Architecture](09-testing.md) for testing strategies
- Check [API Specification](05-api.md) for backend integration

### For DevOps/Infrastructure

- Focus on [Deployment Architecture](07-deployment.md)
- Review [Security Architecture](06-security.md) for compliance
- Check [Database Design](04-database.md) for scaling

### For Product/Business

- Review [System Overview](01-overview.md) for capabilities
- Check [External Integrations](08-integrations.md) for features
- Review [Security Architecture](06-security.md) for compliance

## Architecture Principles

### 1. Swiss-First Design

- Data residency in Swiss/EU regions
- GDPR and Swiss data protection compliance
- Swiss market-specific features (QR bills, VAT)
- Multi-language support (future)

### 2. Rapid Development

- Supabase-first to reduce infrastructure complexity
- Component-driven UI with shadcn/ui
- Type-safe development with TypeScript
- Automated testing and deployment

### 3. Multi-Tenant SaaS

- Complete data isolation per company
- Scalable subscription tiers
- Role-based access control
- Audit trails for compliance

### 4. Performance-Focused

- Sub-2-minute contract creation goal
- Optimistic UI updates
- Intelligent caching strategies
- Real-time fleet status updates

### 5. Enterprise-Ready

- Comprehensive security model
- Automated backup and recovery
- Monitoring and alerting
- Swiss regulatory compliance

## Development Workflow

1. **Planning**: Review relevant architecture docs and
   [Development Standards](10-development-team.md)
2. **Implementation**: Follow established patterns from [Frontend](02-frontend.md) and
   [Backend](03-backend.md) docs
3. **Testing**: Use [Testing Architecture](09-testing.md) strategies and tools
4. **Code Review**: Follow [Code Review Process](10-development-team.md#code-review-process)
5. **Deployment**: Leverage automated [CI/CD Pipeline](07-deployment.md)
6. **Monitoring**: Utilize built-in observability tools

## Compliance & Standards

- **Swiss Federal Data Protection Act (FADP)**
- **GDPR (General Data Protection Regulation)**
- **PCI DSS Level 4** (via Stripe)
- **ISO 27001** security best practices
- **OWASP Top 10** vulnerability prevention

---

**Document Version:** 3.0 - Architecture Documentation Index **Last Updated:** 2025-08-06
**Status:** Ready for Implementation

For questions or clarifications, please refer to the specific architecture document or contact the
development team.
