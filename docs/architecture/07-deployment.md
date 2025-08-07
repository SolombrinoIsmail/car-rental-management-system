# CRMS Deployment Architecture

## CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/main.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm test:unit
      - run: pnpm test:integration
      
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm exec playwright install
      - run: pnpm test:e2e
      
  deploy-preview:
    if: github.event_name == 'pull_request'
    needs: [test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          
  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: [test, e2e]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Environment Configuration

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
SENTRY_DSN=https://...@sentry.io/...
UPSTASH_REDIS_URL=https://...upstash.io
UPSTASH_REDIS_TOKEN=...
```

### Multi-Environment Setup

#### Development Environment
```yaml
# vercel.json
{
  "env": {
    "NODE_ENV": "development",
    "NEXT_PUBLIC_APP_ENV": "development"
  },
  "build": {
    "env": {
      "SENTRY_ENVIRONMENT": "development"
    }
  }
}
```

#### Staging Environment
```yaml
{
  "env": {
    "NODE_ENV": "production",
    "NEXT_PUBLIC_APP_ENV": "staging"
  },
  "functions": {
    "app/api/**": {
      "memory": 1024
    }
  }
}
```

#### Production Environment
```yaml
{
  "env": {
    "NODE_ENV": "production",
    "NEXT_PUBLIC_APP_ENV": "production"
  },
  "functions": {
    "app/api/**": {
      "memory": 3008,
      "maxDuration": 60
    }
  },
  "regions": ["fra1"]
}
```

## Infrastructure as Code

### Terraform Configuration
```hcl
# infrastructure/main.tf
terraform {
  required_providers {
    vercel = {
      source = "vercel/vercel"
    }
    supabase = {
      source = "supabase/supabase"
    }
  }
}

resource "vercel_project" "crms" {
  name      = "crms-production"
  framework = "nextjs"
  
  environment = [
    {
      key    = "NEXT_PUBLIC_SUPABASE_URL"
      value  = supabase_project.crms.url
      target = ["production", "preview"]
    }
  ]
}

resource "supabase_project" "crms" {
  name              = "crms-production"
  organization_id   = var.supabase_org_id
  database_password = var.db_password
  region           = "eu-central-2" # Zurich
}
```

### Docker Configuration

#### Development Dockerfile
```dockerfile
# Dockerfile.dev
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["pnpm", "dev"]
```

#### Production Dockerfile
```dockerfile
# Dockerfile.prod
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod

FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm install -g pnpm && pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

## Database Migration Strategy

### Supabase Migrations
```sql
-- migrations/001_initial_schema.sql
-- This file is automatically applied via Supabase CLI

-- Create tables with proper RLS
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  -- ... rest of schema
);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY company_isolation ON companies
  FOR ALL USING (id = (auth.jwt() ->> 'company_id')::uuid);
```

### Migration Scripts
```typescript
// scripts/migrate.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function runMigrations() {
  const migrations = [
    '001_initial_schema.sql',
    '002_add_audit_logging.sql',
    '003_optimize_indexes.sql',
  ];
  
  for (const migration of migrations) {
    console.log(`Running migration: ${migration}`);
    
    const sql = await fs.readFile(`migrations/${migration}`, 'utf8');
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error(`Migration ${migration} failed:`, error);
      process.exit(1);
    }
    
    console.log(`Migration ${migration} completed`);
  }
}
```

## Monitoring & Observability

### Application Monitoring
```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  beforeSend(event, hint) {
    // Filter sensitive data
    if (event.request?.cookies) {
      delete event.request.cookies;
    }
    return event;
  },
});
```

### Health Check Endpoints
```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // Check database connection
    const supabase = createClient();
    const { data, error } = await supabase
      .from('companies')
      .select('id')
      .limit(1);
      
    if (error) throw error;
    
    // Check Redis connection
    await redis.ping();
    
    // Check external services
    const stripeHealth = await fetch('https://status.stripe.com/api/v2/status.json');
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'healthy',
        redis: 'healthy',
        stripe: stripeHealth.ok ? 'healthy' : 'degraded'
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}
```

### Alerting Configuration
```yaml
# monitoring/alerts.yml
alerts:
  - name: high_error_rate
    condition: error_rate > 1%
    duration: 5m
    severity: critical
    notify: ['oncall@crms.ch']
    
  - name: slow_contract_creation
    condition: p95_contract_creation > 5s
    duration: 10m
    severity: warning
    notify: ['dev-team@crms.ch']
    
  - name: low_disk_space
    condition: disk_usage > 80%
    duration: 15m
    severity: warning
    notify: ['ops@crms.ch']
    
  - name: payment_failures
    condition: payment_failure_rate > 5%
    duration: 5m
    severity: critical
    notify: ['finance@crms.ch', 'oncall@crms.ch']
```

## Backup & Disaster Recovery

### Automated Backup Strategy
```typescript
// scripts/backup.ts
export async function createBackup() {
  const timestamp = new Date().toISOString().split('T')[0];
  
  // Database backup (handled by Supabase automatically)
  // But we can also create manual snapshots
  
  // File storage backup
  const { data: files } = await supabase.storage
    .from('photos')
    .list();
    
  const backupManifest = {
    timestamp,
    database_backup: `${timestamp}-db-backup`,
    files_count: files?.length || 0,
    backup_size: await calculateBackupSize(),
  };
  
  // Store manifest
  await supabase.storage
    .from('backups')
    .upload(`manifests/${timestamp}.json`, JSON.stringify(backupManifest));
    
  return backupManifest;
}
```

### Recovery Procedures
```bash
#!/bin/bash
# scripts/disaster-recovery.sh

# 1. Database Recovery
echo "Starting database recovery..."
supabase db reset --db-url $RECOVERY_DB_URL

# 2. File Storage Recovery
echo "Restoring file storage..."
supabase storage-import --project-ref $PROJECT_REF --backup-file backup.tar.gz

# 3. Environment Restoration
echo "Restoring environment variables..."
vercel env pull --environment production

# 4. Application Deployment
echo "Redeploying application..."
vercel --prod

# 5. Health Check
echo "Running health checks..."
curl -f https://crms.swiss/api/health || exit 1

echo "Recovery completed successfully!"
```

## Performance Optimization

### CDN Configuration
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['storage.supabase.co'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 3600,
  },
  headers: async () => [
    {
      source: '/api/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, s-maxage=10, stale-while-revalidate=59'
        }
      ]
    }
  ],
  experimental: {
    optimizeCss: true,
    optimizeImages: true,
  }
};
```

### Caching Strategy
```typescript
// lib/cache-strategy.ts
export const cacheConfig = {
  // Static content
  static: {
    ttl: 31536000, // 1 year
    paths: ['/images', '/fonts', '/icons']
  },
  
  // API responses
  api: {
    ttl: 300, // 5 minutes
    paths: ['/api/dashboard', '/api/vehicles/availability']
  },
  
  // Dynamic content
  dynamic: {
    ttl: 60, // 1 minute
    paths: ['/dashboard', '/contracts', '/customers']
  }
};
```

---

**Document Version:** 3.0 - Deployment Architecture
**Last Updated:** 2025-08-06
**Status:** Ready for Implementation