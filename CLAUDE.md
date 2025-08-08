# Claude Code Configuration - Swiss Car Rental Management System

## 🚨 CRITICAL RULES

1. **CONCURRENT EXECUTION**: ALL operations in ONE message
2. **FILE ORGANIZATION**: NEVER save to root - use `/src`, `/apps`, `/packages`, `/docs`
3. **RESEARCH FIRST**: Always use MCP tools (Brave, Context7, Linear, Notion) before implementation

## Quick Reference

### Essential Commands

```bash
# Development
pnpm dev                    # Start all services
pnpm build                  # Build all packages
pnpm test                   # Run test suite
pnpm typecheck             # TypeScript validation
pnpm lint                  # Lint with auto-fix

# SPARC Development
npx claude-flow sparc run <mode> "<task>"    # Execute SPARC mode
npx claude-flow sparc tdd "<feature>"        # TDD workflow
npx claude-flow sparc batch <modes> "<task>" # Parallel execution
```

## Project Overview

**Mission**: Replace 15-30 minute paper contracts with 2-minute digital contracts for Swiss SME car
rental companies.

**Target**: 20 paying customers in 4 months (CHF 99-299/month)

### Tech Stack

- **Framework**: Next.js 15.4 + React 19 + TypeScript 5.8
- **Monorepo**: Turborepo 2.0 with pnpm workspaces
- **Database**: Supabase (PostgreSQL) with RLS
- **Styling**: TailwindCSS v4 + shadcn/ui
- **Payments**: Swiss QR-bill, TWINT, PostFinance
- **Monitoring**: Sentry + OpenTelemetry

## Development Workflow

### 1. Pre-Implementation Checklist

```typescript
const mandatorySteps = [
  '✅ Sentry: Check existing errors',
  '✅ Brave: Research best practices',
  '✅ Context7: Review library docs',
  '✅ Linear: Create tracking issue',
  '✅ Notion: Document specification',
  '✅ Implementation with tests',
  '✅ Security & performance checks',
  '✅ Swiss compliance verification',
];
```

### 2. File Structure

```
/apps/web          - Next.js application
/packages/ui       - Component library
/packages/shared   - Shared utilities
/docs             - Documentation
/scripts          - Utility scripts
```

### 3. Git Workflow

#### Branch Strategy

```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feat/SOL-XXX-feature-name

# Branch naming conventions:
feat/SOL-XXX-feature-name     # New features
fix/SOL-XXX-bug-description   # Bug fixes
chore/SOL-XXX-task-name       # Maintenance tasks
docs/SOL-XXX-documentation    # Documentation updates
```

#### Development Process

```bash
# 2. Implement feature
# - Write code following standards
# - Run tests locally
# - Ensure lint/typecheck pass

# 3. Commit with conventional format
git add .
git commit -m "feat(SOL-XXX): implement feature

- Add specific functionality
- Configure necessary settings
- Update related documentation

Closes #SOL-XXX"

# 4. Push branch to GitHub
git push -u origin feat/SOL-XXX-feature-name
```

#### Pull Request Workflow

```bash
# 5. Create Pull Request
gh pr create \
  --title "feat(SOL-XXX): Feature Description" \
  --body "$(cat <<'EOF'
## 🎯 Summary
Brief description of changes

## ✅ What's Changed
- List of specific changes
- Configuration updates
- Documentation additions

## 🧪 Testing Checklist
- [ ] Unit tests pass: `pnpm test:unit`
- [ ] TypeScript compiles: `pnpm typecheck`
- [ ] Linting passes: `pnpm lint`
- [ ] E2E tests pass: `pnpm test:e2e`

## 🔗 Related
- Linear Issue: [SOL-XXX](link)
- Epic: EPIC-XX

cc @SolombrinoIsmail
EOF
)" \
  --base main

# 6. Code Review
gh pr review PR_NUMBER --comment --body "Review comments"

# 7. After approval, merge
gh pr merge PR_NUMBER --squash --delete-branch
```

#### Commit Message Format

```bash
# Format: type(scope): subject

# Types:
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation changes
style:    # Code style changes (formatting, etc)
refactor: # Code refactoring
perf:     # Performance improvements
test:     # Test additions/changes
build:    # Build system changes
ci:       # CI/CD changes
chore:    # Maintenance tasks
revert:   # Revert previous commit

# Examples:
feat(SOL-48): add development environment configuration
fix(SOL-49): resolve database connection issue
docs(SOL-50): update API documentation
```

## MCP Tool Usage

### Research & Documentation

- `mcp__brave-search__brave_web_search` - Industry research
- `mcp__context7__get-library-docs` - Library documentation
- `mcp__notion__*` - Technical documentation
- `mcp__linear-server__*` - Issue tracking
- `mcp__sentry__*` - Error monitoring

### Claude Flow Orchestration

- `mcp__claude-flow__swarm_init` - Initialize swarm
- `mcp__claude-flow__agent_spawn` - Create agents
- `mcp__claude-flow__task_orchestrate` - Execute tasks
- `mcp__claude-flow__memory_usage` - Persist knowledge

## Testing Strategy

### Test Commands

```bash
pnpm test              # All tests
pnpm test:unit        # Unit tests (Vitest)
pnpm test:e2e         # E2E tests (Playwright)
pnpm test:security    # Security scanning
pnpm test:compliance  # Swiss compliance
```

### Coverage Requirements

- Statements: 80%
- Critical paths: 95% (payments, contracts, compliance)
- Swiss business logic: 100%

## Swiss Compliance

### Key Requirements

```typescript
const swissCompliance = {
  dataRetention: '7 years', // Commercial law
  vatRate: '7.7%', // Swiss VAT
  languages: ['de-CH', 'fr-CH', 'it-CH', 'en-US'],
  paymentMethods: ['QR-bill', 'TWINT', 'SEPA'],
  personalLiability: 'CHF 250,000', // FADP executives
};
```

### Compliance Commands

```bash
pnpm test:compliance:gdpr     # GDPR verification
pnpm test:compliance:finance  # Financial regulations
pnpm db:gdpr-export          # Data export (Article 20)
pnpm db:retention-check      # Retention compliance
```

## Performance Requirements

### Targets

- Contract generation: < 2s
- Payment processing: < 5s
- Search response: < 500ms
- Bundle size: < 250KB total

### Monitoring

```bash
pnpm perf:lighthouse  # Core Web Vitals
pnpm perf:bundle     # Bundle analysis
pnpm analyze-bundle  # Size breakdown
```

## Security Framework

### Security Headers (Required)

```typescript
{
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
}
```

### Security Commands

```bash
pnpm audit --audit-level high  # Dependency scan
pnpm security:scan             # Full security audit
pnpm security:sast            # Static analysis
```

## Database Schema

### Core Tables

- `customers` - GDPR-compliant customer data
- `rental_contracts` - Swiss legal requirements
- `payments` - QR-bill and payment processing
- `vehicles` - Fleet management

### Supabase RLS Policies

- Customer data: User or staff access only
- Financial data: Manager/accountant only
- Audit logs: Immutable, auditor access only

## Deployment

### Vercel Configuration

```json
{
  "regions": ["fra1"], // Frankfurt for Swiss users
  "functions": {
    "maxDuration": 10 // Payment processing timeout
  }
}
```

### Environment Variables

- `DATABASE_URL` - Supabase connection
- `NEXT_PUBLIC_SENTRY_DSN` - Error tracking
- `NEXTAUTH_SECRET` - Authentication

## Available Agents (54)

### Core:

`coder`, `reviewer`, `tester`, `planner`, `researcher`

### Specialized:

`backend-dev`, `mobile-dev`, `api-docs`, `system-architect`, `code-analyzer`

### Swarm:

`hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`

### GitHub:

`pr-manager`, `issue-tracker`, `release-manager`, `workflow-automation`

## Pull Request Review Standards

### Code Review Checklist

```typescript
const reviewCriteria = {
  functionality: [
    '✅ Feature works as specified in Linear issue',
    '✅ Edge cases handled appropriately',
    '✅ No regressions introduced',
  ],
  codeQuality: [
    '✅ Follows project coding standards',
    '✅ No ESLint/TypeScript errors',
    '✅ Proper error handling',
    '✅ Clean, readable code',
  ],
  testing: [
    '✅ Unit tests for new functionality',
    '✅ Integration tests where needed',
    '✅ All existing tests pass',
  ],
  performance: [
    '✅ No performance degradation',
    '✅ Bundle size impact checked',
    '✅ Database queries optimized',
  ],
  security: [
    '✅ No hardcoded secrets',
    '✅ Input validation present',
    '✅ SQL injection prevention',
    '✅ XSS protection',
  ],
  documentation: [
    '✅ Code comments where needed',
    '✅ README updated if required',
    '✅ API documentation current',
  ],
};
```

### Review Process

1. **Automated Checks** - Must pass before review
   - GitHub Actions CI/CD
   - TypeScript compilation
   - Linting and formatting
   - Unit test suite

2. **Manual Review Focus**
   - Business logic correctness
   - Swiss compliance requirements
   - Performance implications
   - Security considerations

3. **Review Comments Format**

   ```markdown
   ## 🔍 Code Review

   ### ✅ Strengths

   - What's done well

   ### ⚠️ Issues Found

   - Critical problems that block merge

   ### 🔧 Suggestions

   - Improvements for consideration

   ### 📊 Impact Assessment

   - Performance/Security/UX impact
   ```

## Quality Gates

### Pre-commit (Blocking)

```bash
pnpm typecheck && pnpm lint && pnpm test:unit
```

### Pre-deployment (Required)

```bash
pnpm test:integration && pnpm test:e2e:critical && pnpm test:security
```

## Breaking Changes

### Next.js 15 - Async Params

```typescript
// ✅ NEW - Must await params
export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { id } = await params;
  const { q } = await searchParams;
  return <div>ID: {id}</div>
}
```

### TailwindCSS v4 - CSS-First

```css
/* No config file - use CSS variables */
@theme {
  --color-swiss-red: #ff0000;
  --color-swiss-blue: #0066cc;
}
```

## Support

- **Issues**: Use Linear for tracking
- **Documentation**: Update in Notion
- **Errors**: Monitor via Sentry
- **Claude Flow**: https://github.com/ruvnet/claude-flow/issues

---

**Remember**: Research First → Document → Implement → Test → Deploy
