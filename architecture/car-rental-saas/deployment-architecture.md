# Car Rental SaaS - Deployment & Infrastructure Architecture

## Infrastructure Overview

The Car Rental SaaS is deployed using a modern cloud-native architecture with Swiss data residency,
high availability, and automatic scaling. The infrastructure supports multi-tenant operations with
complete data isolation and GDPR compliance.

## High-Level Infrastructure Architecture

```mermaid
graph TB
    subgraph "External Users"
        Staff[Staff Users<br/>Desktop/Tablet]
        Mobile[Mobile Users<br/>Responsive Web]
        API[API Consumers<br/>External Integrations]
    end

    subgraph "Global CDN & Edge"
        Cloudflare[Cloudflare CDN<br/>DDoS Protection + WAF]
        VercelEdge[Vercel Edge Network<br/>Static Assets + Functions]
    end

    subgraph "Application Layer - Vercel (Frankfurt)"
        NextJS[Next.js Application<br/>SSR + Client Components]
        ServerActions[Server Actions<br/>Direct DB Access]
        APIRoutes[API Routes<br/>External Integrations]
        EdgeFunctions[Edge Functions<br/>Geo-distributed Logic]
        Middleware[Middleware<br/>Auth + Rate Limiting]
    end

    subgraph "Backend Services - Supabase (Zurich)"
        Auth[Supabase Auth<br/>JWT + Multi-tenant]
        Database[(PostgreSQL 15<br/>Multi-tenant with RLS)]
        Storage[Supabase Storage<br/>Photos + PDFs]
        Realtime[Realtime Engine<br/>WebSocket Subscriptions]
        EdgeFunctionsDB[Database Functions<br/>Business Logic]
    end

    subgraph "External Services"
        Stripe[Stripe API<br/>Payment Processing]
        QRBill[Swiss QR-Bill<br/>Generator Service]
        Email[Resend<br/>Transactional Email]
        SwissPost[Swiss Post API<br/>Address Validation]
        SMS[SMS Provider<br/>Notifications]
    end

    subgraph "Monitoring & Observability"
        Sentry[Sentry<br/>Error Tracking]
        Vercel Analytics[Vercel Analytics<br/>Performance Monitoring]
        Uptime[Uptime Monitoring<br/>Synthetic Tests]
        Logs[Structured Logging<br/>Application Logs]
    end

    subgraph "Development & CI/CD"
        GitHub[GitHub Repository<br/>Source Control]
        Actions[GitHub Actions<br/>CI/CD Pipeline]
        Staging[Staging Environment<br/>Preview Deployments]
        Testing[Automated Testing<br/>E2E + Unit Tests]
    end

    Staff --> Cloudflare
    Mobile --> Cloudflare
    API --> Cloudflare
    Cloudflare --> VercelEdge
    VercelEdge --> NextJS
    NextJS --> ServerActions
    NextJS --> APIRoutes
    NextJS --> Middleware
    ServerActions --> Auth
    ServerActions --> Database
    APIRoutes --> Stripe
    APIRoutes --> QRBill
    NextJS --> Storage
    NextJS --> Realtime
    APIRoutes --> Email
    APIRoutes --> SwissPost
    NextJS --> Sentry
    NextJS --> "Vercel Analytics"
    GitHub --> Actions
    Actions --> Staging
    Actions --> NextJS
```

## Environment Strategy

### Production Environment

```yaml
# Production Environment Configuration
name: production
region: eu-central-1 # Frankfurt, Germany (closest to Switzerland)
domain: crms.swiss

infrastructure:
  frontend:
    platform: Vercel Pro
    regions: [fra1] # Frankfurt primary
    auto_scaling: true
    edge_functions: enabled
    static_generation: true

  backend:
    platform: Supabase
    region: eu-central-2 # Zurich, Switzerland
    tier: Pro
    connection_pooling: enabled
    read_replicas: 2
    backup_frequency: daily
    point_in_time_recovery: enabled

  cdn:
    provider: Vercel Edge Network + Cloudflare
    regions: global
    caching_strategy: aggressive
    purge_strategy: selective

  monitoring:
    error_tracking: Sentry
    performance: Vercel Analytics + Custom
    uptime: Uptime Robot
    logs: Supabase Logs + Custom

security:
  ssl_certificate: EV SSL (Extended Validation)
  waf_enabled: true
  ddos_protection: true
  rate_limiting: enabled
  ip_allowlisting: false # Public access required

performance:
  target_response_time: <500ms
  target_uptime: 99.9%
  auto_scaling: enabled
  cdn_hit_ratio: >95
```

### Staging Environment

```yaml
# Staging Environment Configuration
name: staging
region: eu-central-1 # Same as production
domain: staging.crms.swiss

infrastructure:
  frontend:
    platform: Vercel (free tier)
    regions: [fra1]
    preview_deployments: enabled

  backend:
    platform: Supabase
    region: eu-central-2
    tier: Free/Starter
    connection_pooling: disabled
    read_replicas: 0
    backup_frequency: none

data_strategy:
  database: separate_instance
  storage: separate_bucket
  test_data: anonymized_production_subset

testing:
  automated_tests: full_suite
  performance_tests: basic
  security_tests: basic
  browser_tests: chrome_firefox
```

### Development Environment

```yaml
# Development Environment Configuration
name: development
region: local

infrastructure:
  frontend:
    platform: Next.js dev server
    hot_reload: enabled
    source_maps: enabled

  backend:
    platform: Supabase CLI
    local_database: Docker PostgreSQL
    local_storage: Local filesystem

development_tools:
  docker_compose: database, redis, mailhog
  code_quality: eslint, prettier, typescript
  testing: jest, playwright, msw
  debugging: next.js debugger, browser devtools
```

## Deployment Pipeline

### CI/CD Architecture

```mermaid
graph LR
    subgraph "Development"
        Dev[Developer<br/>Local Environment]
        Feature[Feature Branch<br/>Development]
    end

    subgraph "Version Control"
        PR[Pull Request<br/>Code Review]
        Main[Main Branch<br/>Production Ready]
    end

    subgraph "CI Pipeline"
        Tests[Automated Tests<br/>Unit + Integration]
        Lint[Code Quality<br/>ESLint + TypeScript]
        Security[Security Scan<br/>CodeQL + Snyk]
        Build[Build & Package<br/>Next.js Build]
    end

    subgraph "CD Pipeline"
        Preview[Preview Deploy<br/>Vercel Preview]
        Staging[Staging Deploy<br/>Full Environment]
        Prod[Production Deploy<br/>Blue-Green]
    end

    subgraph "Post-Deploy"
        Smoke[Smoke Tests<br/>Health Checks]
        Monitor[Monitoring<br/>Alerts & Metrics]
        Rollback[Rollback Ready<br/>Quick Revert]
    end

    Dev --> Feature
    Feature --> PR
    PR --> Tests
    Tests --> Lint
    Lint --> Security
    Security --> Build
    Build --> Preview
    Preview --> Staging
    Main --> Prod
    Prod --> Smoke
    Smoke --> Monitor
    Monitor --> Rollback
```

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy Car Rental SaaS

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'
  PNPM_VERSION: '8'

jobs:
  test:
    name: Test & Quality Checks
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: crms_test
        options: >-
          --health-cmd pg_isready --health-interval 10s --health-timeout 5s --health-retries 5

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping" --health-interval 10s --health-timeout 5s --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}
          run_install: false

      - name: Get pnpm store directory
        id: pnpm-cache
        run: echo "pnpm_cache_dir=$(pnpm store path)" >> $GITHUB_OUTPUT

      - name: Setup pnpm cache
        uses: actions/cache@v3
        with:
          path: ${{ steps.pnpm-cache.outputs.pnpm_cache_dir }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Type checking
        run: pnpm run type-check

      - name: Linting
        run: pnpm run lint

      - name: Unit tests
        run: pnpm run test:unit
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/crms_test
          REDIS_URL: redis://localhost:6379

      - name: Integration tests
        run: pnpm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/crms_test
          REDIS_URL: redis://localhost:6379

      - name: Build application
        run: pnpm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

  security-scan:
    name: Security Scanning
    runs-on: ubuntu-latest
    permissions:
      security-events: write

    steps:
      - uses: actions/checkout@v4

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: typescript, javascript

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2

      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  deploy-preview:
    name: Deploy Preview
    runs-on: ubuntu-latest
    needs: [test, security-scan]
    if: github.event_name == 'pull_request'

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel Preview
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}

  deploy-staging:
    name: Deploy Staging
    runs-on: ubuntu-latest
    needs: [test, security-scan]
    if: github.ref == 'refs/heads/develop'

    environment:
      name: staging
      url: https://staging.crms.swiss

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Staging
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_STAGING_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}

      - name: Run E2E Tests
        run: pnpm run test:e2e:staging
        env:
          E2E_BASE_URL: https://staging.crms.swiss

  deploy-production:
    name: Deploy Production
    runs-on: ubuntu-latest
    needs: [test, security-scan]
    if: github.ref == 'refs/heads/main'

    environment:
      name: production
      url: https://crms.swiss

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}

      - name: Health Check
        run: |
          curl -f https://crms.swiss/api/health || exit 1

      - name: Notify Team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        if: always()
```

## Infrastructure as Code

### Vercel Configuration

```json
// vercel.json
{
  "version": 2,
  "framework": "nextjs",
  "regions": ["fra1"],
  "functions": {
    "app/api/**": {
      "runtime": "nodejs20.x",
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/admin",
      "destination": "/dashboard"
    }
  ],
  "rewrites": [
    {
      "source": "/api/health",
      "destination": "/api/system/health"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "NEXT_TELEMETRY_DISABLED": "1"
  }
}
```

### Supabase Configuration

```sql
-- Database configuration
-- supabase/migrations/001_initial_setup.sql

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create custom types
CREATE TYPE user_role AS ENUM ('owner', 'manager', 'staff', 'viewer');
CREATE TYPE subscription_tier AS ENUM ('starter', 'professional', 'business', 'enterprise');

-- Set up Row Level Security policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('contract-photos', 'contract-photos', false);

INSERT INTO storage.buckets (id, name, public)
VALUES ('contract-pdfs', 'contract-pdfs', false);

-- Storage policies
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'contract-photos');

CREATE POLICY "Users can only access their company's photos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'contract-photos' AND (storage.foldername(name))[1] = (auth.jwt() ->> 'company_id'));
```

## Monitoring & Observability

### Application Performance Monitoring

```typescript
// lib/monitoring/apm.ts
import * as Sentry from '@sentry/nextjs';

export const initializeMonitoring = () => {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Error filtering
    beforeSend(event, hint) {
      // Filter out known issues
      if (event.exception) {
        const error = hint.originalException;
        if (error?.message?.includes('Non-Error promise rejection')) {
          return null;
        }
      }
      return event;
    },

    // Environment and release tracking
    environment: process.env.NODE_ENV,
    release: process.env.VERCEL_GIT_COMMIT_SHA,

    // User context
    initialScope: {
      tags: {
        component: 'crms-frontend',
      },
    },

    // Integrations
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.nextRouterInstrumentation(NextRouter),
      }),
    ],
  });
};

// Custom metrics
export const recordBusinessMetric = (
  metric: string,
  value: number,
  tags?: Record<string, string>,
) => {
  Sentry.addBreadcrumb({
    message: `Business metric: ${metric}`,
    level: 'info',
    data: { value, ...tags },
  });

  // Also send to custom analytics
  if (typeof window !== 'undefined') {
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metric, value, tags, timestamp: Date.now() }),
    }).catch(() => {}); // Fail silently
  }
};
```

### Health Check Endpoints

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const healthChecks = await Promise.allSettled([
    // Database health
    checkDatabase(),

    // External services health
    checkStripeAPI(),
    checkSupabaseStorage(),
    checkEmailService(),

    // System resources
    checkMemoryUsage(),
    checkResponseTime(),
  ]);

  const results = healthChecks.map((result, index) => ({
    service: ['database', 'stripe', 'storage', 'email', 'memory', 'response_time'][index],
    status: result.status === 'fulfilled' ? 'healthy' : 'unhealthy',
    ...(result.status === 'fulfilled' ? result.value : { error: result.reason }),
  }));

  const overallHealth = results.every((r) => r.status === 'healthy') ? 'healthy' : 'degraded';

  return NextResponse.json(
    {
      status: overallHealth,
      timestamp: new Date().toISOString(),
      version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'unknown',
      checks: results,
    },
    {
      status: overallHealth === 'healthy' ? 200 : 503,
    },
  );
}

async function checkDatabase(): Promise<{ latency: number }> {
  const start = Date.now();

  try {
    const { data, error } = await supabase.from('companies').select('id').limit(1);

    if (error) throw error;

    return { latency: Date.now() - start };
  } catch (error) {
    throw new Error(`Database check failed: ${error}`);
  }
}
```

### Alerting Strategy

```yaml
# monitoring/alerts.yml
alerts:
  critical: # Page immediately
    - name: 'Application Down'
      condition: 'uptime < 99%'
      duration: '2 minutes'
      channels: ['pagerduty', 'slack-critical']

    - name: 'Database Connection Failed'
      condition: "database_health != 'healthy'"
      duration: '1 minute'
      channels: ['pagerduty', 'slack-critical']

    - name: 'High Error Rate'
      condition: 'error_rate > 5%'
      duration: '5 minutes'
      channels: ['pagerduty', 'slack-critical']

  warning: # Slack notification
    - name: 'High Response Time'
      condition: 'avg_response_time > 2000ms'
      duration: '10 minutes'
      channels: ['slack-alerts']

    - name: 'Low Cache Hit Rate'
      condition: 'cache_hit_rate < 90%'
      duration: '15 minutes'
      channels: ['slack-alerts']

    - name: 'Failed Payment Processing'
      condition: 'payment_failure_rate > 2%'
      duration: '5 minutes'
      channels: ['slack-alerts', 'business-team']

  info: # Email digest
    - name: 'Daily Usage Report'
      condition: 'schedule: daily 9:00 CET'
      channels: ['email-digest']

    - name: 'Weekly Performance Report'
      condition: 'schedule: monday 9:00 CET'
      channels: ['email-digest', 'management']
```

## Backup & Disaster Recovery

### Backup Strategy

```typescript
// Supabase automatically handles:
// - Continuous backup with point-in-time recovery (PITR)
// - Daily full backups retained for 7 days
// - Transaction log backups every 5 minutes

// Additional custom backups for compliance
interface BackupStrategy {
  database: {
    provider: 'Supabase PITR';
    frequency: 'continuous';
    retention: '7 days automatic, extended for compliance';
    encryption: 'AES-256 at rest';
    cross_region: true;
  };

  files: {
    provider: 'Supabase Storage';
    frequency: 'real-time replication';
    retention: '7 years for legal compliance';
    encryption: 'AES-256 at rest';
    versioning: true;
  };

  application: {
    provider: 'Vercel + GitHub';
    frequency: 'every deployment';
    retention: 'unlimited via git history';
    rollback_time: '<5 minutes';
  };

  configuration: {
    provider: 'Infrastructure as Code';
    frequency: 'every change';
    retention: 'git history';
    recovery_time: '<30 minutes';
  };
}
```

### Disaster Recovery Plan

```yaml
disaster_recovery:
  rto: '4 hours' # Recovery Time Objective
  rpo: '1 hour' # Recovery Point Objective

  scenarios:
    vercel_outage:
      probability: 'low'
      impact: 'high'
      mitigation: 'Deploy to Netlify using same codebase'
      recovery_time: '2 hours'

    supabase_outage:
      probability: 'very low'
      impact: 'critical'
      mitigation: 'Restore from backup to self-hosted PostgreSQL'
      recovery_time: '4-8 hours'

    regional_outage:
      probability: 'very low'
      impact: 'critical'
      mitigation: 'Activate secondary region deployment'
      recovery_time: '1-2 hours'

    data_corruption:
      probability: 'low'
      impact: 'high'
      mitigation: 'Point-in-time recovery from Supabase'
      recovery_time: '30 minutes - 2 hours'

  testing:
    dr_drill_frequency: 'quarterly'
    backup_restore_testing: 'monthly'
    chaos_engineering: 'continuous'
```

## Security Infrastructure

### Network Security

```yaml
network_security:
  waf:
    provider: 'Cloudflare'
    rules:
      - 'OWASP Core Rule Set'
      - 'Rate limiting by IP'
      - 'Geo-blocking (if needed)'
      - 'Bot protection'

  ssl_tls:
    certificate_type: 'Extended Validation (EV)'
    tls_version: '1.3 minimum'
    cipher_suites: 'Modern'
    hsts: 'enabled with preload'

  ddos_protection:
    provider: 'Cloudflare'
    threshold: 'automatic'
    challenge_pages: 'enabled'

  ip_reputation:
    provider: 'Cloudflare'
    threat_intelligence: 'enabled'
    challenge_bad_actors: 'enabled'
```

### Application Security

```typescript
// middleware.ts - Security middleware
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // CSP header
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://*.supabase.co",
    "connect-src 'self' https://*.supabase.co https://api.stripe.com wss://*.supabase.co",
    "frame-src 'self' https://js.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

## Performance Optimization

### Caching Strategy

```typescript
// lib/cache/strategy.ts
interface CacheStrategy {
  static_assets: {
    provider: 'Vercel Edge Network';
    ttl: '1 year';
    invalidation: 'automatic on deploy';
  };

  api_responses: {
    provider: 'Vercel Edge Functions';
    ttl: '5 minutes';
    invalidation: 'tag-based';
    vary_by: ['company_id', 'user_role'];
  };

  database_queries: {
    provider: 'Application-level (React Query)';
    ttl: '30 seconds - 5 minutes';
    invalidation: 'optimistic updates';
  };

  user_sessions: {
    provider: 'Supabase Auth';
    ttl: '24 hours';
    refresh_threshold: '1 hour';
  };
}

// Cache warming for critical data
export async function warmCacheOnDeploy() {
  const criticalEndpoints = [
    '/api/dashboard/overview',
    '/api/vehicles/availability',
    '/api/contracts/recent',
  ];

  for (const endpoint of criticalEndpoints) {
    try {
      await fetch(`https://crms.swiss${endpoint}`, {
        method: 'GET',
        headers: { 'x-cache-warming': 'true' },
      });
    } catch (error) {
      console.warn(`Failed to warm cache for ${endpoint}:`, error);
    }
  }
}
```

### Database Performance

```sql
-- Database performance optimization
-- Enable query plan caching
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';

-- Connection pooling configuration (handled by Supabase)
-- Max connections: 100 (Supabase Pro tier)
-- Connection pool: PgBouncer
-- Pool mode: Transaction pooling

-- Performance monitoring views
CREATE VIEW slow_queries AS
SELECT
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements
WHERE mean_time > 100 -- Queries taking more than 100ms
ORDER BY mean_time DESC
LIMIT 50;

-- Automated query optimization hints
CREATE OR REPLACE FUNCTION analyze_table_if_needed()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-analyze tables after significant changes
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- Analyze if more than 10% of rows changed
        PERFORM pg_stat_user_tables
        WHERE schemaname = TG_TABLE_SCHEMA
        AND relname = TG_TABLE_NAME
        AND n_tup_ins + n_tup_upd + n_tup_del > reltuples * 0.1;

        IF FOUND THEN
            EXECUTE format('ANALYZE %I.%I', TG_TABLE_SCHEMA, TG_TABLE_NAME);
        END IF;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
```

---

**Deployment Architecture Version:** 1.0  
**Last Updated:** 2025-08-07  
**Status:** Complete Analysis  
**Coverage:** Production-Ready Infrastructure with Swiss Compliance
