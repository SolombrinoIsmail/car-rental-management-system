# Database Package

This package contains the database schema, migrations, and Prisma ORM configuration for the Swiss
Car Rental Management System.

## 🚀 Quick Start

### Prerequisites

- PostgreSQL 16+ or Supabase project
- Node.js 18+
- pnpm

### Setup

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Configure environment variables:** Create a `.env` file in the root with:

   ```env
   # Supabase Connection
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

   # Supabase API
   NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
   SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"
   ```

3. **Run migrations:**

   ```bash
   pnpm db:migrate
   ```

4. **Seed database (development only):**
   ```bash
   pnpm db:seed
   ```

## 📝 Database Schema

### Core Tables

- **organizations** - Multi-tenant organizations
- **users** - System users with roles
- **customers** - Customer records
- **vehicles** - Fleet inventory
- **vehicle_categories** - Vehicle pricing tiers
- **contracts** - Rental agreements
- **payments** - Financial transactions
- **locations** - Rental locations
- **maintenance_records** - Vehicle maintenance
- **vehicle_damages** - Damage reports

## 🔐 Row Level Security (RLS)

All tables have RLS policies enabled for multi-tenant data isolation:

- Organization-based isolation
- Role-based access control (RBAC)
- User permissions hierarchy:
  - SUPER_ADMIN: Full access
  - ADMIN: Organization management
  - MANAGER: Operations management
  - STAFF: Day-to-day operations
  - CUSTOMER: Limited read access

## 💾 Backup & Restore Procedures

### Automatic Backups (Supabase)

Supabase provides automatic daily backups for Pro plans:

- Point-in-time recovery (PITR) up to 7 days
- Automated daily backups retained for 30 days

### Manual Backup

#### Using pg_dump (Local Backup)

```bash
# Full database backup
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" \
  -f backup_$(date +%Y%m%d_%H%M%S).sql

# Schema only
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" \
  --schema-only \
  -f schema_backup_$(date +%Y%m%d_%H%M%S).sql

# Data only
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" \
  --data-only \
  -f data_backup_$(date +%Y%m%d_%H%M%S).sql
```

#### Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Create backup
supabase db dump --project-ref [PROJECT-REF] > backup.sql

# Create backup with specific options
supabase db dump \
  --project-ref [PROJECT-REF] \
  --data-only \
  --exclude-schema auth,storage,extensions > data_backup.sql
```

### Restore Procedures

#### From SQL Backup

```bash
# Restore full backup
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" \
  < backup.sql

# Restore with Supabase CLI
supabase db push --project-ref [PROJECT-REF] < backup.sql
```

#### Point-in-Time Recovery (Pro Plan)

```bash
# Via Supabase Dashboard
# 1. Go to Settings > Database
# 2. Click "Backups"
# 3. Select recovery point
# 4. Click "Restore"

# Via API
curl -X POST https://api.supabase.com/v1/projects/[PROJECT-REF]/database/backups/restore \
  -H "Authorization: Bearer [ACCESS-TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"recovery_time": "2024-01-01T12:00:00Z"}'
```

### Backup Best Practices

1. **Regular Schedule:**
   - Daily automated backups (Supabase Pro)
   - Weekly manual backups for critical data
   - Before major migrations or updates

2. **Storage:**
   - Store backups in multiple locations
   - Use cloud storage (S3, Google Cloud Storage)
   - Encrypt sensitive backups

3. **Testing:**
   - Regularly test restore procedures
   - Verify backup integrity
   - Document recovery time objectives (RTO)

4. **Automation Script:**

   ```bash
   #!/bin/bash
   # backup.sh - Automated backup script

   PROJECT_REF="your-project-ref"
   BACKUP_DIR="/backups"
   DATE=$(date +%Y%m%d_%H%M%S)

   # Create backup
   supabase db dump --project-ref $PROJECT_REF > $BACKUP_DIR/backup_$DATE.sql

   # Compress
   gzip $BACKUP_DIR/backup_$DATE.sql

   # Upload to S3 (requires AWS CLI)
   aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz s3://your-bucket/backups/

   # Clean old local backups (keep last 7 days)
   find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
   ```

## 🛠️ Development Commands

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema changes (development)
pnpm db:push

# Create migration
pnpm db:migrate

# Deploy migrations (production)
pnpm db:migrate:deploy

# Reset database
pnpm db:reset

# Seed database
pnpm db:seed

# Open Prisma Studio
pnpm db:studio
```

## 🔄 Migration Workflow

### Development

1. Make schema changes in `prisma/schema.prisma`
2. Create migration: `pnpm db:migrate`
3. Test migration locally
4. Commit migration files

### Production

1. Review migration files
2. Deploy: `pnpm db:migrate:deploy`
3. Monitor for issues
4. Rollback if needed

## 🚨 Disaster Recovery Plan

### Recovery Time Objectives

- **RTO (Recovery Time Objective):** < 4 hours
- **RPO (Recovery Point Objective):** < 24 hours

### Recovery Procedures

1. **Data Corruption:**
   - Stop application access
   - Identify corruption scope
   - Restore from last known good backup
   - Verify data integrity
   - Resume operations

2. **Complete Loss:**
   - Provision new database
   - Restore schema
   - Restore data from backup
   - Update connection strings
   - Test application
   - Resume operations

3. **Region Failure:**
   - Switch to backup region (if configured)
   - Update DNS/connection strings
   - Restore from cross-region backup
   - Verify functionality

## 📊 Monitoring

### Health Checks

```sql
-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Check slow queries
SELECT
  query,
  mean_exec_time,
  calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

## 🔗 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Database Best Practices](https://supabase.com/docs/guides/database/postgres-best-practices)
