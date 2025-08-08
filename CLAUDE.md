# Claude Code Configuration - Swiss Car Rental Management System

## 🚨 CRITICAL: CONCURRENT EXECUTION & FILE MANAGEMENT

**ABSOLUTE RULES**:
1. ALL operations MUST be concurrent/parallel in a single message
2. **NEVER save working files, text/mds and tests to the root folder**
3. ALWAYS organize files in appropriate subdirectories

### ⚡ GOLDEN RULE: "1 MESSAGE = ALL RELATED OPERATIONS"

**MANDATORY PATTERNS:**
- **TodoWrite**: ALWAYS batch ALL todos in ONE call (5-10+ todos minimum)
- **Task tool**: ALWAYS spawn ALL agents in ONE message with full instructions
- **File operations**: ALWAYS batch ALL reads/writes/edits in ONE message
- **Bash commands**: ALWAYS batch ALL terminal operations in ONE message
- **Memory operations**: ALWAYS batch ALL memory store/retrieve in ONE message

### 📁 File Organization Rules

**NEVER save to root folder. Use these directories:**
- `/src` - Source code files
- `/apps/web/src` - Next.js web application source
- `/packages/ui/src` - Shared UI component library
- `/packages/shared/src` - Shared utilities and types
- `/docs` - Documentation and markdown files
- `/scripts` - Utility scripts
- `/architecture` - Architecture documentation
- `/memory` - Claude Flow memory storage

## Project Overview

Swiss Car Rental Management System (CRMS) - A modern Turborepo monorepo for Swiss SME car rental companies.

**Mission**: Replace 15-30 minute paper contracts with 2-minute digital contracts, capturing 10-15% additional revenue through automated tracking.

**Target**: 20 paying customers within 4 months (CHF 99-299/month pricing tiers)

### Tech Stack
- **Monorepo**: Turborepo with pnpm workspaces
- **Frontend**: Next.js 15.4.0 with React 18, TypeScript 5.6
- **Styling**: TailwindCSS with shadcn/ui components
- **Architecture**: Microservices with API Gateway
- **Database**: PostgreSQL with Redis cache
- **Payments**: Swiss QR-bill integration
- **Development**: SPARC methodology with Claude-Flow orchestration

## SPARC Commands

### Core Commands
- `npx claude-flow sparc modes` - List available modes
- `npx claude-flow sparc run <mode> "<task>"` - Execute specific mode
- `npx claude-flow sparc tdd "<feature>"` - Run complete TDD workflow
- `npx claude-flow sparc info <mode>` - Get mode details

### Batchtools Commands
- `npx claude-flow sparc batch <modes> "<task>"` - Parallel execution
- `npx claude-flow sparc pipeline "<task>"` - Full pipeline processing
- `npx claude-flow sparc concurrent <mode> "<tasks-file>"` - Multi-task processing

### Build Commands (Turborepo)
- `pnpm build` - Build all packages and apps
- `pnpm dev` - Start development servers
- `pnpm start` - Start production servers
- `pnpm lint` - Lint all packages
- `pnpm typecheck` - TypeScript checking
- `pnpm test` - Run tests (when implemented)
- `pnpm clean` - Clean build artifacts
- `pnpm ui:add` - Add shadcn/ui components
- `pnpm ui:diff` - Check shadcn/ui component updates

## SPARC Workflow Phases

1. **Specification** - Requirements analysis (`sparc run spec-pseudocode`)
2. **Pseudocode** - Algorithm design (`sparc run spec-pseudocode`)
3. **Architecture** - System design (`sparc run architect`)
4. **Refinement** - TDD implementation (`sparc tdd`)
5. **Completion** - Integration (`sparc run integration`)

## Code Style & Best Practices

- **Modular Design**: Files under 500 lines
- **Environment Safety**: Never hardcode secrets
- **Test-First**: Write tests before implementation
- **Clean Architecture**: Separate concerns
- **Documentation**: Keep updated

## 🚀 Available Agents (54 Total)

### Core Development
`coder`, `reviewer`, `tester`, `planner`, `researcher`

### Swarm Coordination
`hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`, `collective-intelligence-coordinator`, `swarm-memory-manager`

### Consensus & Distributed
`byzantine-coordinator`, `raft-manager`, `gossip-coordinator`, `consensus-builder`, `crdt-synchronizer`, `quorum-manager`, `security-manager`

### Performance & Optimization
`perf-analyzer`, `performance-benchmarker`, `task-orchestrator`, `memory-coordinator`, `smart-agent`

### GitHub & Repository
`github-modes`, `pr-manager`, `code-review-swarm`, `issue-tracker`, `release-manager`, `workflow-automation`, `project-board-sync`, `repo-architect`, `multi-repo-swarm`

### SPARC Methodology
`sparc-coord`, `sparc-coder`, `specification`, `pseudocode`, `architecture`, `refinement`

### Specialized Development
`backend-dev`, `mobile-dev`, `ml-developer`, `cicd-engineer`, `api-docs`, `system-architect`, `code-analyzer`, `base-template-generator`

### Testing & Validation
`tdd-london-swarm`, `production-validator`

### Migration & Planning
`migration-planner`, `swarm-init`

## 🏗️ Current Project Structure

### Apps
- **`/apps/web`** - Next.js 15.4 web application
  - React 18 with TypeScript
  - TailwindCSS + shadcn/ui
  - Radix UI components

### Packages  
- **`/packages/ui`** - Shared component library
  - Reusable UI components
  - Built with tsup (ESM + CJS)
  - Tailwind + CVA styling
  
- **`/packages/shared`** - Common utilities
  - Shared types and constants
  - Swiss localization helpers
  - Database models and schemas

### Key Features Implemented
- ✅ Turborepo monorepo structure
- ✅ TypeScript 5.6 configuration
- ✅ Shared UI component system
- ✅ Swiss localization constants
- ✅ Basic customer/vehicle/contract types
- ✅ Database migration files
- ✅ Theme toggle and language selector

### In Development
- 🚧 API routes and backend services
- 🚧 Digital contract generation
- 🚧 Swiss QR-bill integration
- 🚧 Photo documentation system
- 🚧 Payment processing
- 🚧 Test suite implementation

## 🎯 Claude Code vs MCP Tools

### Claude Code Handles ALL:
- File operations (Read, Write, Edit, MultiEdit, Glob, Grep)
- Code generation and programming
- Turborepo/pnpm commands and operations
- Next.js and React development
- Implementation work
- Project navigation and analysis
- TodoWrite and task management
- Git operations
- Package management
- Testing and debugging

### MCP Tools ONLY:
- Coordination and planning
- Memory management
- Neural features
- Performance tracking
- Swarm orchestration
- GitHub integration

**KEY**: MCP coordinates, Claude Code executes.

## 🚀 Quick Setup

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Add Claude Flow MCP server (optional)
claude mcp add claude-flow npx claude-flow@alpha mcp start
```

## 🎯 Development Lifecycle

### 🔄 Feature Development Process

**MANDATORY: Before implementing ANY feature, ALWAYS:**

1. **Research Phase**
   ```bash
   # Use Brave MCP for market research, best practices, documentation
   mcp__brave-search__brave_web_search { query: "Next.js 15 best practices for [feature]" }
   mcp__brave-search__brave_web_search { query: "Swiss car rental industry requirements" }
   ```

2. **Library Documentation**
   ```bash
   # Use Context7 MCP for up-to-date library documentation
   mcp__context7__resolve-library-id { libraryName: "next.js" }
   mcp__context7__get-library-docs { context7CompatibleLibraryID: "/vercel/next.js" }
   ```

3. **Project Management**
   ```bash
   # Create Linear issue for tracking
   mcp__linear-server__create_issue {
     title: "Feature: [Feature Name]",
     team: "Development",
     labels: ["feature", "epic-xx"],
     description: "## Acceptance Criteria\n- [ ] Research completed\n- [ ] Implementation done\n- [ ] Tests written\n- [ ] Documentation updated"
   }
   ```

4. **Documentation Planning**
   ```bash
   # Create/update Notion documentation
   mcp__notion__notion-create-pages {
     pages: [{
       properties: { title: "Feature: [Feature Name] - Technical Spec" },
       content: "## Overview\n## Architecture\n## Implementation Plan\n## Testing Strategy"
     }]
   }
   ```

### 🏗️ Implementation Workflow

```bash
# 1. Start development
pnpm dev

# 2. Create feature branch
git checkout -b feat/SOL-XX-feature-name

# 3. Implement with concurrent operations
TodoWrite { todos: [...] }  # Plan tasks
Task("Research latest patterns...")  # Research agent
Task("Generate boilerplate...")     # Template generator
Write/Edit files                    # Implementation
```

### ✅ Testing Strategy

```bash
# Unit Tests (when implemented)
pnpm test

# Component Testing
pnpm test:components

# E2E Testing (planned)
pnpm test:e2e

# Type Checking
pnpm typecheck

# Linting
pnpm lint
```

### 🚀 CI/CD Pipeline (Planned)

```yaml
# .github/workflows/ci.yml (to be implemented)
- Build all packages: turbo build
- Run tests: turbo test  
- Type check: turbo typecheck
- Lint: turbo lint
- Deploy staging: Vercel preview
- Deploy production: Vercel production
```

## 📋 MCP Server Integration Requirements

### 🔍 Research & Documentation (MANDATORY)

**Before ANY implementation:**

1. **Brave Search MCP** - Market research, best practices, industry standards
   ```bash
   mcp__brave-search__brave_web_search
   mcp__brave-search__brave_local_search
   ```

2. **Context7 MCP** - Library documentation and code examples
   ```bash
   mcp__context7__resolve-library-id
   mcp__context7__get-library-docs
   ```

### 📝 Documentation Management

**All technical documentation MUST use Notion MCP:**

```bash
# Create technical specifications
mcp__notion__notion-create-pages

# Update existing docs
mcp__notion__notion-update-page

# Search existing documentation
mcp__notion__search

# Fetch documentation for reference
mcp__notion__fetch
```

**Documentation Types:**
- Technical specifications
- Architecture decisions
- API documentation
- User guides
- Deployment procedures

### 🎯 Project Tracking

**ALL features and bugs MUST be tracked in Linear:**

```bash
# Create issues for features/bugs
mcp__linear-server__create_issue

# List current issues
mcp__linear-server__list_issues

# Update issue status
mcp__linear-server__update_issue

# Create projects for epics
mcp__linear-server__create_project

# Track team progress
mcp__linear-server__list_teams
```

**Issue Categories:**
- Epic stories (from /docs/epics/)
- Feature implementations
- Bug reports
- Technical debt
- Documentation tasks

### 🎯 Daily Development Workflow

```bash
# 1. Check Linear issues
mcp__linear-server__list_my_issues

# 2. Research implementation approach
mcp__brave-search__brave_web_search { query: "implementation approach" }

# 3. Check library docs
mcp__context7__get-library-docs { context7CompatibleLibraryID: "library-id" }

# 4. Update Notion documentation
mcp__notion__notion-update-page { page_id: "spec-id", ... }

# 5. Start development
pnpm dev

# 6. Build and test
pnpm build && pnpm typecheck && pnpm lint

# 7. Update Linear issue progress
mcp__linear-server__update_issue { id: "issue-id", state: "In Progress" }
```

### Package Development
```bash
# Work on UI package
cd packages/ui && pnpm dev

# Work on web app
cd apps/web && pnpm dev

# Build specific package
turbo build --filter=@swiss-car-rental/ui
```

## MCP Tool Categories

### Coordination
`swarm_init`, `agent_spawn`, `task_orchestrate`

### Monitoring
`swarm_status`, `agent_list`, `agent_metrics`, `task_status`, `task_results`

### Memory & Neural
`memory_usage`, `neural_status`, `neural_train`, `neural_patterns`

### GitHub Integration
`github_swarm`, `repo_analyze`, `pr_enhance`, `issue_triage`, `code_review`

### System
`benchmark_run`, `features_detect`, `swarm_monitor`

## 📋 Agent Coordination Protocol

### Every Agent MUST:

**1️⃣ BEFORE Work:**
```bash
npx claude-flow@alpha hooks pre-task --description "[task]"
npx claude-flow@alpha hooks session-restore --session-id "swarm-[id]"
```

**2️⃣ DURING Work:**
```bash
npx claude-flow@alpha hooks post-edit --file "[file]" --memory-key "swarm/[agent]/[step]"
npx claude-flow@alpha hooks notify --message "[what was done]"
```

**3️⃣ AFTER Work:**
```bash
npx claude-flow@alpha hooks post-task --task-id "[task]"
npx claude-flow@alpha hooks session-end --export-metrics true
```

## 🎯 Concurrent Execution Examples

### ✅ CORRECT (Single Message):
```javascript
[BatchTool]:
  // Initialize swarm
  mcp__claude-flow__swarm_init { topology: "mesh", maxAgents: 6 }
  mcp__claude-flow__agent_spawn { type: "researcher" }
  mcp__claude-flow__agent_spawn { type: "coder" }
  mcp__claude-flow__agent_spawn { type: "tester" }
  
  // Spawn agents with Task tool
  Task("Research agent: Analyze requirements...")
  Task("Coder agent: Implement features...")
  Task("Tester agent: Create test suite...")
  
  // Batch todos
  TodoWrite { todos: [
    {id: "1", content: "Research", status: "in_progress", priority: "high"},
    {id: "2", content: "Design", status: "pending", priority: "high"},
    {id: "3", content: "Implement", status: "pending", priority: "high"},
    {id: "4", content: "Test", status: "pending", priority: "medium"},
    {id: "5", content: "Document", status: "pending", priority: "low"}
  ]}
  
  // File operations
  Bash "mkdir -p app/{src,tests,docs}"
  Write "app/src/index.js"
  Write "app/tests/index.test.js"
  Write "app/docs/README.md"
```

### ❌ WRONG (Multiple Messages):
```javascript
Message 1: mcp__claude-flow__swarm_init
Message 2: Task("agent 1")
Message 3: TodoWrite { todos: [single todo] }
Message 4: Write "file.js"
// This breaks parallel coordination!
```

## Performance Benefits

- **84.8% SWE-Bench solve rate**
- **32.3% token reduction**
- **2.8-4.4x speed improvement**
- **27+ neural models**

## Hooks Integration

### Pre-Operation
- Auto-assign agents by file type
- Validate commands for safety
- Prepare resources automatically
- Optimize topology by complexity
- Cache searches

### Post-Operation
- Auto-format code
- Train neural patterns
- Update memory
- Analyze performance
- Track token usage

### Session Management
- Generate summaries
- Persist state
- Track metrics
- Restore context
- Export workflows

## Advanced Features (v2.0.0)

- 🚀 Automatic Topology Selection
- ⚡ Parallel Execution (2.8-4.4x speed)
- 🧠 Neural Training
- 📊 Bottleneck Analysis
- 🤖 Smart Auto-Spawning
- 🛡️ Self-Healing Workflows
- 💾 Cross-Session Memory
- 🔗 GitHub Integration

## 🔄 Comprehensive Testing Strategy

### 🏗️ Testing Pyramid (Multi-Layer)

```bash
# 1. Unit Tests (Fast, Isolated) - 70% coverage
pnpm test:unit              # Vitest for utils, hooks, components
pnpm test:unit:watch        # Watch mode for development
pnpm test:unit:coverage     # Coverage reports

# 2. Integration Tests (API & DB) - 20% coverage  
pnpm test:integration       # API endpoints, database operations
pnpm test:db                # Database queries and migrations
pnpm test:api               # API route testing

# 3. Component Tests (User Interactions) - 15% coverage
pnpm test:components        # React Testing Library
pnpm test:visual            # Visual regression testing
pnpm test:accessibility     # ARIA compliance testing

# 4. E2E Tests (Critical User Flows) - 10% coverage
pnpm test:e2e              # Playwright for rental workflows
pnpm test:e2e:mobile       # Mobile device testing
pnpm test:e2e:cross-browser # Chrome, Firefox, Safari

# 5. Performance Tests (Load & Stress)
pnpm test:performance      # Core Web Vitals testing
pnpm test:lighthouse       # Lighthouse CI
pnpm test:load             # Load testing with k6

# 6. Security Tests (OWASP & Vulnerabilities)
pnpm test:security         # OWASP security testing
pnpm audit                 # Dependency vulnerability scan
pnpm test:auth             # Authentication flow testing
```

### 🎯 Swiss Car Rental Specific Test Scenarios

```typescript
// Critical E2E Test Flows (MANDATORY):
1. **Contract Creation Flow** (2-minute target)
   - Customer search/creation → Vehicle selection → Contract details
   - Digital signature → PDF generation with photos → Payment processing

2. **Swiss Payment Processing**  
   - QR-bill generation → Payment validation → Receipt generation
   - Multi-currency support (CHF primary)

3. **GDPR Compliance Testing**
   - Data export functionality → Data deletion → Consent management
   - Swiss privacy law compliance

4. **Multi-language Support**
   - German (primary) → French → Italian → English
   - Contract language switching → UI localization

5. **Business Logic Critical Paths**
   - Fuel level calculations → Kilometer tracking → Damage assessment
   - Deposit processing → Overtime charges → Insurance claims
```

### 🔐 Security & Performance Testing

```bash
# Security Testing Suite
pnpm test:security:owasp    # OWASP ZAP security testing
pnpm test:security:deps     # Snyk vulnerability scanning  
pnpm test:security:headers  # Security headers validation
pnpm test:security:auth     # Authentication bypass testing
pnpm test:security:xss      # XSS vulnerability testing
pnpm test:security:csrf     # CSRF protection testing

# Performance Testing Suite  
pnpm test:perf:lighthouse   # Lighthouse performance scoring
pnpm test:perf:bundle       # Bundle size analysis
pnpm test:perf:runtime      # Runtime performance profiling
pnpm test:perf:memory       # Memory leak detection
pnpm test:perf:database     # Database query performance
```

### 📊 Test Coverage Requirements

```typescript
// Coverage Thresholds (ENFORCED):
{
  "statements": 80,    // 80% statement coverage minimum
  "branches": 75,      // 75% branch coverage minimum  
  "functions": 85,     // 85% function coverage minimum
  "lines": 80,         // 80% line coverage minimum
  
  // Swiss-specific critical paths: 95% coverage required
  "critical_paths": [
    "src/lib/payments/**",     // Payment processing
    "src/lib/contracts/**",    // Contract generation
    "src/lib/compliance/**"    // GDPR & Swiss compliance
  ]
}
```

### 🚨 Quality Gates (BLOCKING)

```bash
# Pre-commit Gates (Cannot commit without passing)
pnpm typecheck             # TypeScript validation
pnpm lint                  # ESLint + Prettier  
pnpm test:unit --coverage  # Unit tests with 80%+ coverage
pnpm audit --audit-level high # High-severity security audit

# Pre-deployment Gates (Cannot deploy without passing)
pnpm test:integration      # All integration tests pass
pnpm test:e2e:critical     # Critical user flows pass
pnpm test:performance      # Performance budget met
pnpm test:security         # Security scan passed
pnpm test:accessibility    # ARIA compliance verified
```

### 🚀 CI/CD Implementation Strategy

#### GitHub Actions Pipeline
```yaml
# Planned CI/CD stages:
1. Code Quality:
   - ESLint, Prettier, TypeScript checks
   - Unit tests with coverage reports
   - Security scanning (npm audit)

2. Build & Test:
   - Turborepo build all packages
   - Integration tests
   - Component visual regression tests

3. Deployment:
   - Preview deployments (Vercel)
   - Staging environment validation
   - Production deployment approval

4. Post-deployment:
   - Health checks
   - Performance monitoring
   - Error tracking integration
```

#### Deployment Strategy
- **Development**: Auto-deploy to dev environment
- **Staging**: Auto-deploy on `develop` branch
- **Production**: Manual approval after staging validation

## 🔄 Git Workflow & Version Control Standards

### 🏷️ Commit Convention (Conventional Commits)

**MANDATORY format**: `type(scope): description`

```bash
# Types (REQUIRED):
feat:     New feature for users
fix:      Bug fix for users  
docs:     Documentation changes
style:    Code formatting (no logic changes)
refactor: Code restructuring (no feature/fix)
test:     Adding/updating tests
chore:    Build process, dependencies, tooling

# Examples:
feat(auth): add Swiss ID verification
fix(payment): resolve QR-bill generation error
docs(api): update rental endpoint documentation
```

### 🌿 Branch Naming Standards

```bash
# Feature branches
feat/SOL-123-user-authentication
feat/SOL-124-qr-bill-generation

# Bug fixes  
fix/SOL-125-payment-calculation-error

# Documentation
docs/SOL-126-api-documentation

# Hotfixes (production)
hotfix/SOL-127-critical-security-patch
```

### 🔀 Git Flow Process

```bash
# 1. Feature Development
git checkout -b feat/SOL-123-feature-name
# ... work on feature
git commit -m "feat(scope): add feature implementation"

# 2. Pre-commit Quality Gates (Automated)
pnpm typecheck && pnpm lint && pnpm test:unit

# 3. Pull Request Process
gh pr create --title "feat(scope): Feature Name" --body "$(cat <<'EOF'
## 🎯 Summary
- Feature implementation details

## ✅ Acceptance Criteria  
- [ ] Research completed (Brave + Context7)
- [ ] Linear issue created/updated
- [ ] Notion documentation updated
- [ ] Tests written and passing
- [ ] TypeScript checks pass
- [ ] Security scan passed

## 🧪 Test Plan
- Unit tests: X scenarios
- Integration tests: Y scenarios
- Manual testing: Z scenarios

## 📋 Swiss Compliance
- [ ] GDPR compliance verified
- [ ] Swiss financial regulations checked
- [ ] Multi-language support added

🤖 Generated with [Claude Code](https://claude.ai/code)
EOF
)"

# 4. Automated Checks (GitHub Actions)
# - TypeScript validation
# - ESLint + Prettier  
# - Unit tests with coverage
# - Security scanning (CodeQL)
# - Bundle size analysis
# - Visual regression tests

# 5. Code Review Requirements
# - At least 1 approval required
# - All checks must pass
# - Security scan must pass
# - Performance budget must be met

# 6. Merge to main
# - Squash and merge (clean history)
# - Delete feature branch
# - Auto-deploy to staging
```

### 🔐 Pre-commit Hooks Configuration

```json
// .husky/pre-commit (MANDATORY)
{
  "scripts": {
    "pre-commit": [
      "pnpm typecheck",
      "pnpm lint --fix", 
      "pnpm test:unit --run",
      "pnpm audit --fix"
    ]
  }
}
```

## 🏗️ GitHub Automation & Templates

### 📋 Issue Templates

```yaml
# .github/ISSUE_TEMPLATE/feature.yml
name: 🚀 Feature Request
about: Request a new feature for the Swiss Car Rental System
labels: ["feature", "needs-triage"]
body:
  - type: textarea
    attributes:
      label: "🎯 Feature Description"
      placeholder: "What feature would you like to see?"
  - type: textarea  
    attributes:
      label: "🇨🇭 Swiss Compliance Requirements"
      placeholder: "Any Swiss-specific legal/financial requirements?"
  - type: checkboxes
    attributes:
      label: "✅ Pre-Implementation Checklist"
      options:
        - label: "Brave research completed"
        - label: "Context7 library research done"
        - label: "Notion technical spec created"
        - label: "Swiss compliance verified"
```

### 🔄 PR Templates

```markdown
# .github/pull_request_template.md
## 🎯 Summary
Brief description of changes

## 📋 Checklist
- [ ] ✅ Brave research completed
- [ ] 📚 Context7 library docs reviewed  
- [ ] 📝 Notion documentation updated
- [ ] 🎫 Linear issue linked
- [ ] ✅ Tests written and passing
- [ ] 🔒 Security scan passed
- [ ] 🇨🇭 Swiss compliance verified
- [ ] 📊 Performance impact assessed

## 🧪 Testing
- Unit tests: X passing
- Integration tests: Y passing  
- Manual testing completed: ✅

## 🇨🇭 Swiss Compliance
- GDPR compliance: ✅/❌
- Financial regulations: ✅/❌
- Multi-language support: ✅/❌

## 📊 Performance Impact
- Bundle size: +/- X KB
- Lighthouse score: X/100
- Core Web Vitals: ✅/❌
```

### 🤖 GitHub Actions Workflows

```yaml
# .github/workflows/ci.yml (PLANNED IMPLEMENTATION)
name: CI/CD Pipeline

on: [push, pull_request]

jobs:
  quality-gates:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: TypeScript check
        run: pnpm typecheck
        
      - name: Lint check
        run: pnpm lint
        
      - name: Unit tests
        run: pnpm test:unit --coverage
        
      - name: Build packages
        run: pnpm build
        
      - name: Bundle analysis
        run: pnpm analyze-bundle
        
      - name: Security scan
        uses: github/codeql-action/analyze@v3
        
      - name: Upload coverage
        uses: codecov/codecov-action@v4

  deployment:
    needs: quality-gates
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
```

## 🔍 Error Tracking & Monitoring Stack

### 🚨 Sentry Integration (CRITICAL)

```typescript
// apps/web/src/lib/sentry.ts (TO BE IMPLEMENTED)
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // Swiss Car Rental specific context
  tags: {
    component: 'swiss-car-rental',
    market: 'switzerland',
    compliance: 'gdpr'
  },
  
  // Performance monitoring
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1,
  
  // Swiss privacy compliance
  beforeSend: (event) => {
    // Remove PII data for Swiss compliance
    return sanitizeForSwissCompliance(event)
  }
})
```

### 📊 Observability Stack

```typescript
// Monitoring requirements:
1. **Error Tracking**: Sentry for all JS errors
2. **Performance**: Core Web Vitals tracking  
3. **Business Metrics**: Rental completion rates
4. **Swiss Compliance**: GDPR audit logs
5. **Financial Tracking**: Payment success rates
6. **User Experience**: Form completion analytics
```

## 🛠️ MCP Server Orchestration

### Mandatory Pre-Implementation Checklist

**EVERY feature development MUST follow this sequence:**

1. ✅ **Sentry Check** - Review existing errors for feature area
2. ✅ **Brave Research** - Industry standards, best practices
3. ✅ **Context7 Docs** - Library documentation, code examples  
4. ✅ **Linear Issue** - Feature tracking and acceptance criteria
5. ✅ **Notion Spec** - Technical specification document
6. ✅ **Security Scan** - Vulnerability assessment
7. ✅ **Implementation** - Code development with tests
8. ✅ **Documentation** - Update Notion with implementation details
9. ✅ **Performance Test** - Bundle size and Core Web Vitals
10. ✅ **Swiss Compliance** - GDPR and financial regulation check

### Integration Tips

1. **MCP-First Development**: Always research before coding
2. **Documentation-Driven**: Create specs in Notion before implementation
3. **Issue-Tracked Progress**: Every feature needs a Linear issue
4. **Knowledge Sharing**: Use Context7 for library best practices
5. **Market Awareness**: Use Brave for industry research
6. **Error-Informed**: Check Sentry before feature development
7. **Performance-Conscious**: Monitor bundle impact continuously
8. **Security-First**: Scan before deployment
9. **Swiss-Compliant**: Verify regulations at every step
10. **Memory Persistence**: Store research findings for future reference

## 🔒 Security, Performance & Observability 

### 🛡️ Security Framework (Swiss Compliance)

```typescript
// Security Configuration (MANDATORY)
export const securityConfig = {
  // OWASP Top 10 Protection
  headers: {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  },
  
  // Swiss Privacy Compliance  
  gdpr: {
    cookieConsent: true,
    dataExport: true,
    dataRetention: '7 years', // Swiss financial regulations
    anonymization: 'automatic'
  },
  
  // Financial Data Security
  pci: {
    encryption: 'AES-256',
    tokenization: true,
    auditLogging: true
  }
}

// Security Testing Commands
pnpm security:scan         # Full security audit
pnpm security:deps         # Dependency vulnerabilities  
pnpm security:headers      # HTTP security headers
pnpm security:auth         # Authentication testing
pnpm security:data         # Data protection verification
```

### ⚡ Performance Budgets & Monitoring

```javascript
// Performance Budgets (ENFORCED)
const performanceBudgets = {
  // Core Web Vitals (Google Lighthouse)
  'first-contentful-paint': '1.5s',
  'largest-contentful-paint': '2.5s', 
  'first-input-delay': '100ms',
  'cumulative-layout-shift': '0.1',
  
  // Bundle Size Limits
  'total-bundle-size': '250KB',
  'javascript-bundle': '150KB',
  'css-bundle': '50KB',
  'images-total': '500KB',
  
  // Swiss Car Rental Specific
  'contract-generation-time': '2s',    // 2-minute goal
  'pdf-generation-time': '3s',
  'payment-processing-time': '5s',
  'search-response-time': '500ms'
}

// Performance Monitoring Commands
pnpm perf:lighthouse       # Lighthouse performance audit
pnpm perf:bundle          # Bundle size analysis
pnpm perf:vitals          # Core Web Vitals monitoring
pnpm perf:database        # Database performance profiling
```

### 📊 Observability Stack (Production)

```yaml
# Monitoring & Alerting Configuration
observability:
  metrics:
    - business_metrics:
      - contract_completion_rate
      - payment_success_rate  
      - user_satisfaction_score
      - revenue_per_rental
    
    - technical_metrics:
      - response_time_p95
      - error_rate_percentage
      - database_connection_pool
      - memory_usage_percentage
    
    - swiss_compliance:
      - gdpr_request_processing_time
      - data_retention_compliance
      - audit_log_completeness
  
  alerts:
    - critical: 'error_rate > 1%'
    - warning: 'response_time_p95 > 2s'
    - business: 'contract_completion_rate < 95%'
```

## 🧠 Claude-Specific Consistency Patterns

### 💾 Memory Management & Context Preservation

```typescript
// Claude Memory Persistence Strategy
export const claudeMemoryPatterns = {
  // Cross-session knowledge retention
  persistentMemory: {
    // Store architectural decisions
    'architectural-decisions': 'memory/architecture/',
    'code-patterns': 'memory/patterns/',
    'swiss-compliance-rules': 'memory/compliance/',
    'performance-optimizations': 'memory/performance/',
    'security-configurations': 'memory/security/'
  },
  
  // Context preservation between Claude instances
  contextPatterns: {
    projectStructure: 'Always read /CLAUDE.md first',
    codebaseUnderstanding: 'Use Glob/Grep for exploration',
    implementationApproach: 'Follow SPARC methodology',
    qualityStandards: 'Enforce testing and security gates'
  },
  
  // Consistency enforcement
  mandatoryChecks: [
    'mcp__brave-search__brave_web_search: Research first',
    'mcp__context7__get-library-docs: Check library docs',
    'mcp__linear-server__create_issue: Track all features',
    'mcp__notion__notion-create-pages: Document decisions',
    'mcp__sentry: Monitor error patterns'
  ]
}
```

### 🎯 Decision Trees for Common Scenarios

```typescript
// Claude Decision Framework
export const claudeDecisionTrees = {
  // Feature Implementation Decision Tree
  featureImplementation: {
    step1: 'Check Sentry for existing errors in feature area',
    step2: 'Research with Brave MCP for industry standards',
    step3: 'Review Context7 for library documentation',
    step4: 'Create Linear issue with acceptance criteria',
    step5: 'Document approach in Notion',
    step6: 'Implement with comprehensive tests',
    step7: 'Security scan and performance check',
    step8: 'Swiss compliance verification'
  },
  
  // Bug Fix Decision Tree
  bugFix: {
    step1: 'Analyze Sentry error context and frequency',
    step2: 'Research root cause with debugging tools',
    step3: 'Create Linear issue with error reproduction',
    step4: 'Document fix approach in Notion',
    step5: 'Implement fix with regression tests',
    step6: 'Verify fix resolves Sentry error pattern'
  },
  
  // Code Review Decision Tree
  codeReview: {
    automated: ['TypeScript check', 'ESLint', 'Unit tests', 'Security scan'],
    manual: ['Architecture review', 'Business logic validation', 'Swiss compliance check'],
    deployment: ['Integration tests', 'Performance budget', 'Security headers']
  }
}
```

## 🇨🇭 Swiss-Specific Compliance & Business Requirements

### 🏛️ Legal & Regulatory Framework

```typescript
// Swiss Compliance Configuration
export const swissCompliance = {
  // Data Protection (Swiss Federal Data Protection Act)
  dataProtection: {
    dataRetention: '7 years',        // Swiss commercial law requirement
    dataMinimization: true,          // Only collect necessary data
    consentManagement: 'explicit',   // Explicit consent required
    dataPortability: true,           // GDPR Article 20 compliance
    rightToErasure: true            // GDPR Article 17 compliance
  },
  
  // Financial Regulations
  financial: {
    currency: 'CHF',                 // Swiss Franc primary
    vatRate: '7.7%',                // Swiss VAT rate
    invoicing: 'QR-bill',           // Swiss QR-bill standard
    bookkeeping: '10 years',        // Swiss commercial code
    paymentMethods: ['QR-bill', 'SEPA', 'PostFinance', 'TWINT']
  },
  
  // Language Requirements (Swiss multilingual)
  languages: {
    primary: 'de-CH',               // German (Switzerland)
    secondary: ['fr-CH', 'it-CH'],  // French & Italian (Switzerland)
    tertiary: 'en-US',              // English for international users
    contracts: 'legally-required-language' // Contract language = customer preference
  },
  
  // Business Regulations
  business: {
    operatingHours: 'cantonal-specific',
    insuranceRequirement: 'mandatory',
    drivingLicenseValidation: 'swiss-eu-format',
    ageRequirement: '18+',
    depositRegulations: 'proportional-to-vehicle-value'
  }
}

// Swiss Compliance Testing Commands
pnpm test:compliance:gdpr    # GDPR compliance verification
pnpm test:compliance:lang    # Multi-language functionality
pnpm test:compliance:finance # Financial regulation compliance
pnpm test:compliance:data    # Data protection verification
```

### 💼 Swiss Business Logic Implementation

```typescript
// Swiss-Specific Business Rules
export const swissBusinessRules = {
  // Rental Contract Requirements
  contracts: {
    digitalSignature: 'qualified-electronic-signature', // Swiss eIDAS
    documentLanguage: 'customer-preference',
    legalDisclaimer: 'swiss-law-applicable',
    insuranceCoverage: 'minimum-liability-coverage',
    fuelPolicy: 'full-to-full-default'
  },
  
  // Payment Processing
  payments: {
    qrBill: {
      iban: 'swiss-format-validation',
      reference: 'iso11649-creditor-reference',
      currency: 'CHF-primary',
      paymentInfo: 'structured-data'
    },
    deposits: {
      calculation: 'vehicle-category-based',
      authorization: 'credit-card-hold',
      refund: 'automatic-within-7-days'
    }
  },
  
  // Vehicle Management
  fleet: {
    registration: 'swiss-license-plate-format',
    inspection: 'mot-equivalent-required',
    insurance: 'comprehensive-mandatory',
    documentation: 'registration-certificate-digital'
  }
}
```

## 📋 Linear Templates & Best Practices

### 🎫 Issue Templates & Workflows

```yaml
# Linear Issue Templates (MANDATORY USAGE)

# Epic Template
Epic:
  title: "EPIC: [Business Value] - [Technical Implementation]"
  description: |
    ## 🎯 Business Objective
    - Target revenue impact: CHF X,XXX
    - User journey improvement: X% faster
    - Swiss compliance requirement: [Regulation]
    
    ## 📋 Acceptance Criteria
    - [ ] Brave research completed
    - [ ] Context7 library research done
    - [ ] Technical architecture defined
    - [ ] Swiss compliance verified
    - [ ] Performance budget defined
    
    ## 🏗️ Technical Scope
    - Packages affected: [@swiss-car-rental/web, @swiss-car-rental/ui]
    - Database changes: [Yes/No]
    - API changes: [Yes/No]
    - Third-party integrations: [List]
  
  labels: ["epic", "business-priority", "swiss-specific"]
  
# Feature Template  
Feature:
  title: "feat(scope): [Feature Name]"
  description: |
    ## 📝 Feature Description
    Brief description of the feature
    
    ## 🔗 Epic Link
    Relates to Epic: [Epic Link]
    
    ## ✅ Definition of Done
    - [ ] Sentry error review completed
    - [ ] Brave research & best practices reviewed
    - [ ] Context7 library documentation consulted
    - [ ] Notion technical specification created
    - [ ] Implementation completed with tests
    - [ ] Security scan passed
    - [ ] Performance budget met
    - [ ] Swiss compliance verified
    - [ ] Documentation updated
    
    ## 🧪 Test Requirements
    - Unit tests: [Specific scenarios]
    - Integration tests: [API endpoints]
    - E2E tests: [User workflows]
    
    ## 🇨🇭 Swiss Compliance Checklist
    - [ ] GDPR data handling verified
    - [ ] Multi-language support added
    - [ ] Financial regulations compliance
    - [ ] Legal disclaimer updated
  
  labels: ["feature", "development", "needs-review"]

# Bug Template
Bug:
  title: "fix(scope): [Bug Description]"  
  description: |
    ## 🐛 Bug Description
    Clear description of the bug
    
    ## 🚨 Sentry Error Link
    [Link to Sentry error if available]
    
    ## 🔍 Steps to Reproduce
    1. Step 1
    2. Step 2  
    3. Step 3
    
    ## 💡 Expected Behavior
    What should happen
    
    ## 📱 Actual Behavior  
    What actually happens
    
    ## 🌍 Environment
    - Browser: [Chrome/Firefox/Safari]
    - OS: [Windows/macOS/Linux]
    - Language: [de-CH/fr-CH/it-CH/en-US]
    
    ## 🚨 Priority Assessment
    - User impact: [High/Medium/Low]
    - Business impact: [Revenue/Compliance/UX]
    - Swiss compliance risk: [Yes/No]
  
  labels: ["bug", "needs-investigation", "sentry-tracked"]
```

### 🔄 Linear Project Management Workflow

```typescript
// Linear Project States & Automation
export const linearWorkflow = {
  // Issue States
  states: {
    backlog: 'New issues, not yet prioritized',
    ready: 'Prioritized, ready for development',
    inProgress: 'Actively being worked on',
    inReview: 'Code review and testing phase',
    testing: 'QA and compliance verification',
    done: 'Completed and deployed'
  },
  
  // Automated Transitions
  automation: {
    'PR created': 'backlog → inReview',
    'Tests passing': 'inReview → testing', 
    'Deployed to staging': 'testing → done',
    'Sentry error detected': 'done → backlog (new bug)'
  },
  
  // Swiss-Specific Labels
  labels: {
    compliance: ['gdpr', 'swiss-finance', 'multi-lang'],
    priority: ['revenue-impact', 'legal-requirement', 'user-critical'],
    technical: ['performance', 'security', 'database'],
    business: ['contracts', 'payments', 'fleet-mgmt']
  }
}
```

## 📝 Notion Templates & Guidelines

### 📋 Technical Specification Template

```markdown
# [Feature Name] - Technical Specification

## 🎯 Overview
- **Epic**: [Link to Linear Epic]
- **Business Value**: [Revenue/Efficiency Impact]  
- **Swiss Compliance**: [Required Regulations]
- **Timeline**: [Development Estimate]

## 🔍 Research Summary
### Brave Search Findings
- Industry best practices: [Key findings]
- Competitor analysis: [Market insights]
- Swiss market specific: [Local requirements]

### Context7 Library Research  
- Recommended libraries: [List with versions]
- Implementation patterns: [Code examples]
- Performance considerations: [Benchmarks]

## 🏗️ Architecture Design
### System Components
- Frontend changes: [@swiss-car-rental/web]
- UI components: [@swiss-car-rental/ui]
- Shared utilities: [@swiss-car-rental/shared]
- Database schema: [Changes required]

### Swiss Compliance Architecture
- Data flow: [GDPR compliant data handling]
- Language support: [Multi-language implementation]
- Payment integration: [Swiss payment methods]

## 🧪 Testing Strategy
### Test Coverage Plan
- Unit tests: [Coverage targets]
- Integration tests: [API endpoints]
- E2E tests: [User workflows]
- Swiss compliance tests: [Regulatory verification]

### Performance Requirements
- Load time: < 2s for contract generation
- Bundle size: Impact assessment
- Core Web Vitals: Target scores

## 🔒 Security Considerations
- Data encryption: [PII protection]
- Authentication: [Swiss ID integration]
- Authorization: [Role-based access]
- Audit logging: [Compliance tracking]

## 🚀 Implementation Plan
### Phase 1: Foundation
- [ ] Research completed
- [ ] Architecture approved
- [ ] Database schema updated

### Phase 2: Core Development  
- [ ] Backend API implemented
- [ ] Frontend UI components
- [ ] Integration testing

### Phase 3: Swiss Compliance
- [ ] Multi-language support
- [ ] Payment integration  
- [ ] Legal compliance verification

### Phase 4: Production
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Monitoring setup

## 📊 Success Metrics
- Performance: [Specific targets]
- User experience: [Measurable outcomes]
- Business impact: [Revenue/efficiency gains]
- Compliance: [Regulatory adherence]

---
**Status**: [Draft/Review/Approved/Implemented]  
**Last Updated**: [Date]
**Owner**: [Team/Individual]
```

### 📚 Notion Database Templates

```typescript
// Notion Database Schemas for Swiss Car Rental System

// Technical Specifications Database
const technicalSpecsDB = {
  properties: {
    title: 'Feature Name',
    status: ['Draft', 'Review', 'Approved', 'Implemented'],
    epic: 'Linear Epic Relation',
    priority: ['P0-Critical', 'P1-High', 'P2-Medium', 'P3-Low'],
    swissCompliance: ['GDPR', 'Finance', 'Multi-lang', 'Legal'],
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Vercel'],
    estimatedEffort: 'Number (story points)',
    businessValue: 'Text (CHF impact)',
    owner: 'Person',
    createdDate: 'Date',
    lastUpdated: 'Date'
  }
}

// Architecture Decisions Database  
const architectureDecisionsDB = {
  properties: {
    title: 'Decision Title',
    status: ['Proposed', 'Accepted', 'Deprecated', 'Superseded'],
    context: 'Long text (business context)',
    decision: 'Long text (technical decision)',
    consequences: 'Long text (trade-offs)',
    alternatives: 'Long text (options considered)',
    swissCompliance: 'Multi-select (regulations)',
    technologies: 'Multi-select (tech stack)',
    decisionDate: 'Date',
    reviewDate: 'Date'
  }
}

// Code Patterns Library
const codePatternsDB = {
  properties: {
    pattern: 'Pattern Name',
    category: ['Components', 'Hooks', 'Utils', 'API', 'Database'],
    description: 'Long text (usage description)',
    codeExample: 'Code block',
    swissSpecific: 'Checkbox (Swiss business logic)',
    testingApproach: 'Text (testing strategy)',
    performance: 'Text (performance impact)',
    lastUsed: 'Date',
    frequency: 'Number (usage count)'
  }
}
```

## ☁️ Vercel Deployment Best Practices

### 🚀 Deployment Configuration

```javascript
// vercel.json (Production Configuration)
{
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "outputDirectory": "apps/web/.next",
  
  // Swiss Performance Optimization
  "regions": ["fra1"],  // Frankfurt region for Swiss users
  
  // Environment Variables
  "env": {
    "NODE_ENV": "production",
    "NEXT_PUBLIC_SENTRY_DSN": "@sentry-dsn",
    "DATABASE_URL": "@database-url",
    "NEXTAUTH_SECRET": "@auth-secret"
  },
  
  // Swiss Compliance Headers
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Strict-Transport-Security", "value": "max-age=31536000" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ],
  
  // Performance Optimizations
  "functions": {
    "apps/web/src/pages/api/**": {
      "maxDuration": 10  // 10s timeout for Swiss payment processing
    }
  }
}

// Vercel Deployment Commands
pnpm vercel:preview    # Deploy preview environment
pnpm vercel:prod       # Deploy to production  
pnpm vercel:env        # Manage environment variables
pnpm vercel:logs       # View deployment logs
pnpm vercel:analytics  # Performance analytics
```

### 📊 Vercel Analytics Integration

```typescript
// Swiss Car Rental Analytics Configuration
export const vercelAnalytics = {
  // Core Web Vitals Tracking
  webVitals: {
    fcp: 'track',  // First Contentful Paint
    lcp: 'track',  // Largest Contentful Paint
    fid: 'track',  // First Input Delay
    cls: 'track'   // Cumulative Layout Shift
  },
  
  // Swiss Business Metrics
  customEvents: [
    'contract_started',
    'contract_completed',
    'payment_initiated', 
    'payment_completed',
    'qr_bill_generated',
    'language_changed'
  ],
  
  // Privacy Compliance (Swiss)
  privacy: {
    anonymizeIP: true,
    respectDNT: true,
    cookieConsent: 'required'
  }
}
```

## 🗄️ Supabase Database Best Practices

### 🏗️ Database Architecture & Schema

```sql
-- Swiss Car Rental Database Schema (Supabase)
-- Location: /src/database/migrations/

-- Customer Management (GDPR Compliant)
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Personal Information (Encrypted)
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,  
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  
  -- Swiss Specific
  language_preference TEXT DEFAULT 'de-CH' CHECK (language_preference IN ('de-CH', 'fr-CH', 'it-CH', 'en-US')),
  swiss_id_verified BOOLEAN DEFAULT FALSE,
  
  -- GDPR Compliance
  data_consent_given BOOLEAN DEFAULT FALSE,
  data_consent_date TIMESTAMP WITH TIME ZONE,
  data_retention_until TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 years'),
  
  -- Audit Trail
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Rental Contracts (Swiss Legal Requirements)
CREATE TABLE rental_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number TEXT UNIQUE NOT NULL, -- Format: CH-YYYY-XXXXXX
  
  -- References
  customer_id UUID REFERENCES customers(id) NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) NOT NULL,
  
  -- Contract Details
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  contract_language TEXT DEFAULT 'de-CH',
  
  -- Swiss Financial Data (Encrypted)
  base_rate DECIMAL(10,2) NOT NULL,
  deposit_amount DECIMAL(10,2) NOT NULL,
  vat_rate DECIMAL(4,2) DEFAULT 7.7, -- Swiss VAT
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'CHF',
  
  -- Digital Signature (Swiss eIDAS)
  customer_signature_data JSONB,
  staff_signature_data JSONB,
  signature_timestamp TIMESTAMP WITH TIME ZONE,
  
  -- Document Storage
  pdf_document_url TEXT,
  photos JSONB, -- Array of photo URLs with metadata
  
  -- Swiss Compliance
  swiss_legal_disclaimer_accepted BOOLEAN DEFAULT FALSE,
  data_processing_consent BOOLEAN DEFAULT FALSE,
  
  -- Audit Trail (10 years retention for Swiss commercial law)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Swiss Payment Processing
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES rental_contracts(id) NOT NULL,
  
  -- Payment Details
  payment_type TEXT CHECK (payment_type IN ('qr-bill', 'card', 'sepa', 'twint')),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'CHF',
  
  -- Swiss QR-Bill Data
  qr_bill_reference TEXT, -- ISO11649 format
  swiss_iban TEXT,
  qr_bill_data JSONB,
  
  -- Status Tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  processed_at TIMESTAMP WITH TIME ZONE,
  
  -- Audit & Compliance (7 years retention)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  financial_audit_data JSONB
);
```

### 🔐 Supabase Security Configuration

```typescript
// Supabase Security Policies (Row Level Security)
export const supabaseSecurityPolicies = {
  // Customer Data Access (GDPR Compliant)
  customers: {
    select: 'auth.uid() = created_by OR auth.role() = "staff"',
    insert: 'auth.role() = "staff"',
    update: 'auth.uid() = created_by OR auth.role() = "manager"', 
    delete: 'FALSE' // Soft delete only for GDPR compliance
  },
  
  // Financial Data Access (Swiss Banking Standards)
  payments: {
    select: 'auth.role() IN ("accountant", "manager")',
    insert: 'auth.role() IN ("staff", "manager")',
    update: 'auth.role() = "manager"',
    delete: 'FALSE' // Immutable financial records
  },
  
  // Audit Trail Protection
  audit_logs: {
    select: 'auth.role() = "auditor"',
    insert: 'TRUE', // System generated
    update: 'FALSE', // Immutable
    delete: 'FALSE'  // Permanent retention
  }
}

// Supabase Environment Configuration
export const supabaseConfig = {
  // Connection Security
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.SUPABASE_SSL_CERT
  },
  
  // Swiss Data Residency
  region: 'eu-central-1', // Frankfurt for Swiss compliance
  
  // Connection Pooling (Swiss Business Hours Optimization)
  pool: {
    min: 2,
    max: 10,
    idle: '10 minutes',
    acquire: '60 seconds',
    timezone: 'Europe/Zurich'
  },
  
  // Performance Optimization
  cache: {
    ttl: '5 minutes',
    max: 100
  }
}
```

### 📊 Supabase Performance & Monitoring

```typescript
// Database Performance Commands
const supabaseCommands = {
  // Performance Monitoring
  'pnpm db:analyze': 'ANALYZE database performance',
  'pnpm db:explain': 'Query execution plan analysis',
  'pnpm db:slow-queries': 'Identify slow queries',
  'pnpm db:index-usage': 'Index utilization analysis',
  
  // Swiss Compliance Utilities
  'pnpm db:gdpr-export': 'Export customer data (GDPR Article 20)',
  'pnpm db:gdpr-delete': 'Anonymize customer data (GDPR Article 17)',
  'pnpm db:retention-check': 'Check data retention compliance',
  'pnpm db:audit-report': 'Generate compliance audit report',
  
  // Migration Management
  'pnpm db:migrate': 'Run pending migrations',
  'pnpm db:rollback': 'Rollback last migration',
  'pnpm db:seed': 'Seed development data',
  'pnpm db:backup': 'Create database backup'
}
```

## 🚀 Automation & Productivity Enhancements

### 🤖 GitHub Actions Automation

```yaml
# .github/workflows/swiss-compliance-check.yml
name: Swiss Compliance Verification

on:
  pull_request:
    paths: ['src/lib/payments/**', 'src/lib/contracts/**']

jobs:
  compliance-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: GDPR Compliance Check
        run: |
          pnpm test:compliance:gdpr
          pnpm audit:data-protection
          
      - name: Swiss Financial Regulation Check
        run: |
          pnpm test:compliance:finance
          pnpm validate:qr-bill-format
          
      - name: Multi-language Support Check  
        run: |
          pnpm test:i18n:completeness
          pnpm validate:translations
          
      - name: Generate Compliance Report
        run: |
          pnpm generate:compliance-report
          
      - name: Comment PR with Compliance Status
        uses: actions/github-script@v6
        with:
          script: |
            // Auto-comment PR with compliance status
```

### 🔄 Development Automation Scripts

```bash
#!/bin/bash
# scripts/development-cycle.sh (Full Development Automation)

# 1. Pre-development Research Phase
echo "🔍 Starting pre-development research..."
npx claude-flow@alpha hooks pre-task --description "Feature development cycle"

# 2. MCP Server Research (Concurrent)
echo "📚 Conducting research across MCP servers..."
# Note: These would be called by Claude directly via MCP tools
# - mcp__brave-search__brave_web_search
# - mcp__context7__get-library-docs  
# - mcp__linear-server__create_issue
# - mcp__notion__notion-create-pages

# 3. Quality Gates (Pre-implementation)
echo "🔒 Running pre-implementation quality gates..."
pnpm typecheck
pnpm lint
pnpm audit --audit-level high
pnpm test:security:deps

# 4. Database Migration Check
echo "🗄️ Checking database consistency..."
pnpm db:migrate --dry-run
pnpm db:validate-schema

# 5. Performance Baseline
echo "⚡ Establishing performance baseline..."
pnpm perf:lighthouse --baseline
pnpm perf:bundle --analysis

# 6. Swiss Compliance Pre-check
echo "🇨🇭 Swiss compliance verification..."
pnpm test:compliance:pre-check
pnpm validate:gdpr-readiness

# 7. Development Environment Ready
echo "✅ Development environment ready for implementation"
pnpm dev

# 8. Post-implementation Automation
echo "🚀 Post-implementation automation ready..."
# - Automatic testing on file changes
# - Sentry error monitoring
# - Performance budget enforcement
# - Swiss compliance continuous validation
```

### 📊 Productivity Metrics & Analytics

```typescript
// Development Productivity Tracking
export const productivityMetrics = {
  // Development Velocity
  velocity: {
    'story-points-per-sprint': 'track',
    'cycle-time-per-feature': 'track',
    'lead-time-to-production': 'track',
    'deployment-frequency': 'track'
  },
  
  // Quality Metrics
  quality: {
    'defect-rate-post-deployment': 'track',
    'test-coverage-percentage': 'enforce',
    'security-vulnerabilities': 'monitor',
    'performance-budget-violations': 'alert'
  },
  
  // Swiss Business Metrics
  business: {
    'contract-completion-time': 'optimize',
    'payment-success-rate': 'maximize',
    'user-satisfaction-score': 'improve',
    'compliance-audit-score': 'maintain-100%'
  },
  
  // Claude Productivity Enhancement
  claude: {
    'research-to-implementation-time': 'minimize',
    'documentation-completeness': 'maximize',
    'code-pattern-reuse': 'increase',
    'cross-session-context-retention': 'improve'
  }
}
```

## Support & Resources

### 📚 Documentation Links
- **Claude Flow**: https://github.com/ruvnet/claude-flow
- **Turborepo**: https://turbo.build/repo/docs
- **Swiss GDPR**: https://www.kmu.admin.ch/kmu/en/home/facts-and-trends/digitization/data-protection.html
- **Swiss Payment Standards**: https://www.six-group.com/en/products-services/banking-services/standardization.html

### 🚨 Issue Tracking
- **Claude Flow Issues**: https://github.com/ruvnet/claude-flow/issues
- **Project Issues**: Use Linear for all project-specific issues
- **Security Issues**: Report via Sentry integration

---

**Remember: Research First, Document Everything, Test Thoroughly, Comply Always!**

🇨🇭 **Swiss Car Rental Management System** - Built with precision, engineered for compliance.

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
Never save working files, text/mds and tests to the root folder.
