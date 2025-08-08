# Claude Flow Configuration - Swiss Car Rental Management System

## ⚠️ CRITICAL: ALWAYS FOLLOW THE GIT WORKFLOW

**EVERY implementation task MUST follow the complete Git workflow:**

1. Create feature branch
2. Implement changes
3. Commit with conventional commits
4. Push to remote
5. Create Pull Request
6. Review PR and provide feedback

**See the [MANDATORY Git Workflow section](#-mandatory-git-workflow---always-follow) below for
detailed steps.**

## 🚀 Claude Flow: AI-Powered Development Orchestration

Claude Flow is our primary development orchestrator, providing intelligent agent coordination, SPARC
methodology, and automated workflows for the Swiss Car Rental Management System.

## 📋 Claude Flow Command Reference

### Core Commands

```bash
# Initialize Claude Flow
npx claude-flow init                         # Initial setup
npx claude-flow config                       # Configure settings
npx claude-flow status                       # Check system status

# Agent Management
npx claude-flow agent list                   # List available agents
npx claude-flow agent spawn <type>           # Spawn specific agent
npx claude-flow agent metrics                # View agent performance

# Swarm Orchestration
npx claude-flow swarm init <topology>        # Initialize swarm (mesh|hierarchical|ring|star)
npx claude-flow swarm status                 # Check swarm status
npx claude-flow swarm monitor                # Real-time monitoring
npx claude-flow swarm scale <size>           # Auto-scale agents
```

### SPARC Development Modes

```bash
# SPARC Methodology (Specification → Pseudocode → Architecture → Refinement → Code)
npx claude-flow sparc run dev "<task>"       # Development mode
npx claude-flow sparc run api "<task>"       # API development
npx claude-flow sparc run ui "<task>"        # UI/Frontend development
npx claude-flow sparc run test "<task>"      # Test development
npx claude-flow sparc run refactor "<task>"  # Refactoring mode

# TDD with SPARC
npx claude-flow sparc tdd "<feature>"        # Test-Driven Development
npx claude-flow sparc tdd-london "<feature>" # London School TDD (mock-first)

# Batch Processing
npx claude-flow sparc batch "dev,test,api" "<task>"  # Parallel execution
```

### Task Orchestration

```bash
# Task Management
npx claude-flow task create "<description>"   # Create new task
npx claude-flow task orchestrate "<task>"     # Execute with swarm
npx claude-flow task status <id>              # Check task status
npx claude-flow task results <id>             # Get task results

# Workflow Automation
npx claude-flow workflow create               # Create workflow
npx claude-flow workflow execute <id>         # Run workflow
npx claude-flow workflow template <type>      # Use templates
```

### GitHub Integration

```bash
# PR Management
npx claude-flow github pr create             # Create PR with AI description
npx claude-flow github pr review <number>    # AI-powered code review
npx claude-flow github pr merge <number>     # Smart merge with checks

# Issue Management
npx claude-flow github issue analyze <id>    # Analyze and decompose issue
npx claude-flow github issue track           # Track all issues
npx claude-flow github issue assign <id>     # Auto-assign to agents

# Release Management
npx claude-flow github release create        # Coordinate release
npx claude-flow github release notes         # Generate changelog
```

### Memory & Learning

```bash
# Persistent Memory
npx claude-flow memory store "<key>" "<value>"  # Store knowledge
npx claude-flow memory retrieve "<key>"         # Retrieve knowledge
npx claude-flow memory search "<pattern>"       # Search memory
npx claude-flow memory backup                   # Backup state

# Neural Learning
npx claude-flow neural train "<pattern>"        # Train patterns
npx claude-flow neural predict "<input>"        # Make predictions
npx claude-flow neural patterns                 # Analyze patterns
```

### Performance & Monitoring

```bash
# Performance Analysis
npx claude-flow perf analyze                 # Bottleneck analysis
npx claude-flow perf report                  # Performance report
npx claude-flow perf optimize                # Auto-optimization

# Monitoring
npx claude-flow monitor health               # System health
npx claude-flow monitor metrics              # Real-time metrics
npx claude-flow monitor logs                 # Centralized logs
```

## 🧠 Claude Flow MCP Tools

### Swarm Management

```javascript
// Initialize swarm with topology
mcp__claude -
  flow__swarm_init({
    topology: 'hierarchical',
    maxAgents: 8,
    strategy: 'auto',
  });

// Spawn specialized agents
mcp__claude -
  flow__agent_spawn({
    type: 'code-analyzer',
    capabilities: ['typescript', 'react', 'performance'],
    swarmId: 'main',
  });

// Orchestrate complex tasks
mcp__claude -
  flow__task_orchestrate({
    task: 'Implement complete customer management system',
    strategy: 'adaptive',
    priority: 'high',
  });
```

### SPARC Modes Configuration

```javascript
// Development mode with SPARC
mcp__claude -
  flow__sparc_mode({
    mode: 'dev',
    task_description: 'Build rental contract API',
    options: {
      tdd: true,
      documentation: true,
      performance: true,
    },
  });
```

### Memory Operations

```javascript
// Store cross-session knowledge
mcp__claude -
  flow__memory_usage({
    action: 'store',
    key: 'swiss-compliance-rules',
    value: JSON.stringify(complianceData),
    namespace: 'regulations',
    ttl: 86400,
  });
```

## 🎯 Development Workflow with Claude Flow

### 1. Epic/Story Implementation

```bash
# Step 1: Analyze Linear issue
npx claude-flow linear analyze SOL-XXX

# Step 2: Initialize appropriate swarm
npx claude-flow swarm init hierarchical --max-agents 5

# Step 3: Run SPARC development
npx claude-flow sparc run dev "Implement SOL-XXX: [story description]"

# Step 4: Execute TDD workflow
npx claude-flow sparc tdd "Feature from SOL-XXX"

# Step 5: Create and review PR
npx claude-flow github pr create --issue SOL-XXX
npx claude-flow github pr review --auto
```

### 2. Bug Fix Workflow

```bash
# Analyze Sentry error
npx claude-flow sentry analyze ERROR-ID

# Spawn debugging swarm
npx claude-flow swarm init mesh --agents "debugger,tester,reviewer"

# Fix with verification
npx claude-flow sparc run fix "Resolve ERROR-ID with tests"

# Auto-create fix PR
npx claude-flow github pr create --fix ERROR-ID
```

### 3. Performance Optimization

```bash
# Analyze bottlenecks
npx claude-flow perf analyze --component "contract-generation"

# Spawn optimization swarm
npx claude-flow agent spawn performance-benchmarker
npx claude-flow agent spawn code-analyzer

# Optimize with benchmarks
npx claude-flow sparc run perf "Optimize contract generation <2s"

# Verify improvements
npx claude-flow perf report --before-after
```

## 🤖 Available Claude Flow Agents

### Core Development Agents

- `coder` - Implementation specialist
- `reviewer` - Code review expert
- `tester` - Testing specialist
- `planner` - Strategic planning
- `researcher` - Deep research

### Specialized Agents

- `backend-dev` - API development
- `mobile-dev` - React Native expert
- `api-docs` - OpenAPI/Swagger
- `system-architect` - Architecture design
- `code-analyzer` - Code quality analysis
- `perf-analyzer` - Performance optimization
- `security-manager` - Security analysis

### Swarm Coordinators

- `hierarchical-coordinator` - Queen-led swarms
- `mesh-coordinator` - P2P coordination
- `adaptive-coordinator` - Dynamic topology
- `raft-manager` - Consensus protocol
- `byzantine-coordinator` - Fault tolerance

### GitHub Specialists

- `pr-manager` - PR automation
- `issue-tracker` - Issue management
- `release-manager` - Release coordination
- `workflow-automation` - CI/CD management
- `code-review-swarm` - Multi-agent reviews

### SPARC Specialists

- `specification` - Requirements analysis
- `pseudocode` - Algorithm design
- `architecture` - System design
- `refinement` - Iterative improvement
- `sparc-coder` - TDD implementation

## 🔄 MANDATORY Git Workflow - ALWAYS FOLLOW

**⚠️ IMPORTANT: This workflow MUST be followed for EVERY implementation task**

### Complete Git Workflow Steps (REQUIRED)

```bash
# 1. Create feature branch (ALWAYS DO THIS FIRST)
git checkout -b <branch-name>  # Use issue ID format: sol-XX-description

# 2. Implement the feature/fix
# ... development work ...

# 3. Stage and commit changes
git add -A
git commit -m "type(SOL-XX): description

- Detail 1
- Detail 2

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# 4. Push branch to remote
git push -u origin <branch-name>

# 5. Create Pull Request
gh pr create \
  --title "type(SOL-XX): Description" \
  --body "detailed PR description" \
  --base main

# 6. Review the PR
gh pr view <pr-number> --comments
gh pr diff <pr-number>

# 7. Post review comment
gh pr comment <pr-number> --body "review feedback"
```

### Automated Workflow with Claude Flow

```bash
# Alternative: Use Claude Flow automation (still follows git workflow)
npx claude-flow git branch create SOL-XXX
npx claude-flow sparc run dev "Implement feature"
npx claude-flow test all --coverage
npx claude-flow github pr create \
  --title "feat(SOL-XXX): Feature name" \
  --ai-description \
  --link-issue SOL-XXX
npx claude-flow github pr review --comprehensive
npx claude-flow github pr merge --squash --delete-branch
```

### ✅ Workflow Checklist (MUST COMPLETE ALL)

- [ ] Create feature branch before starting work
- [ ] Implement all requirements from the issue
- [ ] Run linting and fix any issues
- [ ] Run tests and ensure they pass
- [ ] Commit with conventional commit message
- [ ] Push branch to remote
- [ ] Create PR with detailed description
- [ ] Review PR and provide feedback
- [ ] Tag @SolombrinoIsmail in review

## 🔍 PR Review Workflow

### Automated PR Review Process

When asked to review a PR, Claude will follow this comprehensive workflow:

1. **Initial Analysis**

   ```bash
   # Check PR status and comments
   gh pr view <number> --comments

   # Get list of changed files
   gh pr diff <number> --name-only

   # Review the diff
   gh pr diff <number>
   ```

2. **Fix Issues**
   - Address critical ESLint configuration issues
   - Fix TypeScript errors and type issues
   - Update missing configurations
   - Add required documentation

3. **Validation**

   ```bash
   # Run linting with fixes
   pnpm lint

   # Check formatting
   pnpm format:check

   # Run type checking
   pnpm typecheck

   # Run tests if available
   pnpm test
   ```

4. **Review Comment Structure**
   - **✅ Strengths**: Highlight what's done well
   - **⚠️ Critical Issues**: Must-fix problems
   - **🔧 Suggestions**: Improvements and optimizations
   - **📊 Performance Impact**: Performance considerations
   - **🚨 Security**: Security implications
   - **✨ Overall Assessment**: Score and recommendation
   - **Tag @SolombrinoIsmail** for visibility

5. **Follow-up Review** After fixes are applied:
   - Re-run all validation checks
   - Document improvements made
   - Note remaining non-critical issues
   - Provide merge recommendation
   - Create follow-up issues if needed

### Example PR Review Command Sequence

```bash
# Step 1: Initial review
gh pr view 15 --comments
gh pr diff 15

# Step 2: Fix issues (automated)
pnpm lint
pnpm format
git add .
git commit -m "fix: address PR review comments"

# Step 3: Validate fixes
pnpm lint:check
pnpm typecheck
pnpm test

# Step 4: Post review comment
gh pr comment 15 --body "Review complete with fixes applied"
```

### PR Review Checklist

- [ ] Code quality and style compliance
- [ ] TypeScript types and interfaces
- [ ] Test coverage for new features
- [ ] Documentation updates
- [ ] Security considerations
- [ ] Performance implications
- [ ] Breaking changes identified
- [ ] Migration path documented
- [ ] CI/CD checks passing

## 📊 Claude Flow Configuration

### .claude-flow.config.json

```json
{
  "project": "swiss-car-rental",
  "defaultSwarm": "hierarchical",
  "maxAgents": 8,
  "sparc": {
    "defaultMode": "dev",
    "enableTDD": true,
    "documentation": true
  },
  "github": {
    "autoReview": true,
    "requireTests": true,
    "squashMerge": true
  },
  "memory": {
    "persistent": true,
    "namespace": "car-rental",
    "backup": "daily"
  },
  "monitoring": {
    "sentry": true,
    "performance": true,
    "logs": "verbose"
  }
}
```

## 🚨 Critical Commands for Daily Use

```bash
# Morning Setup
npx claude-flow daily start              # Initialize daily workflow
npx claude-flow linear sync              # Sync with Linear issues
npx claude-flow sentry check             # Check for new errors

# Development
npx claude-flow sparc tdd "<feature>"    # TDD development
npx claude-flow swarm monitor            # Monitor agent activity
npx claude-flow memory search "<topic>"  # Search knowledge base

# End of Day
npx claude-flow daily summary            # Generate daily report
npx claude-flow memory backup            # Backup knowledge
npx claude-flow swarm destroy            # Clean up resources
```

## 🔗 Integration Commands

### Linear Integration

```bash
npx claude-flow linear list              # List current sprint issues
npx claude-flow linear get SOL-XXX       # Get issue details
npx claude-flow linear update SOL-XXX    # Update issue status
```

### Sentry Integration

```bash
npx claude-flow sentry errors            # List recent errors
npx claude-flow sentry analyze <id>      # Analyze specific error
npx claude-flow sentry fix <id>          # Auto-fix with PR
```

### Supabase Integration

```bash
npx claude-flow supabase migrate         # Run migrations
npx claude-flow supabase rls check       # Verify RLS policies
npx claude-flow supabase backup          # Backup database
```

## 📈 Performance Benchmarks

```bash
# Run comprehensive benchmarks
npx claude-flow benchmark all

# Expected Performance Targets:
# - Task Orchestration: <100ms startup
# - Agent Spawn: <50ms per agent
# - Memory Operations: <10ms read/write
# - Swarm Coordination: <200ms sync
# - SPARC Execution: <5s per phase
```

## 🛡️ Security & Compliance

```bash
# Swiss Compliance Checks
npx claude-flow compliance swiss         # Run Swiss compliance audit
npx claude-flow compliance gdpr          # GDPR verification
npx claude-flow compliance financial     # Financial regulations

# Security Scanning
npx claude-flow security scan            # Full security audit
npx claude-flow security dependencies    # Check dependencies
npx claude-flow security secrets         # Scan for secrets
```

## 📚 Advanced Claude Flow Features

### Dynamic Agent Spawning

```bash
# Spawn agents based on task complexity
npx claude-flow agent auto-spawn "<task description>"

# Adaptive swarm topology
npx claude-flow swarm adapt --optimize-for "performance|quality|speed"
```

### Collective Intelligence

```bash
# Multi-agent consensus
npx claude-flow consensus create "<decision>"

# Knowledge sharing
npx claude-flow knowledge share --from "agent1" --to "swarm"
```

### Continuous Learning

```bash
# Train from outcomes
npx claude-flow learn from-pr <number>
npx claude-flow learn from-error <id>

# Pattern recognition
npx claude-flow patterns detect --codebase
npx claude-flow patterns apply "<pattern>" "<target>"
```

## 🔧 Troubleshooting

```bash
# Debug commands
npx claude-flow debug agents            # Debug agent issues
npx claude-flow debug memory            # Memory diagnostics
npx claude-flow debug performance       # Performance profiling

# Reset commands
npx claude-flow reset swarm             # Reset swarm state
npx claude-flow reset memory            # Clear memory cache
npx claude-flow reset config            # Reset to defaults
```

## 📞 Support & Resources

- **Claude Flow Docs**: https://github.com/ruvnet/claude-flow
- **Issue Tracker**: https://github.com/ruvnet/claude-flow/issues
- **Community**: Discord/Slack channels
- **Updates**: `npx claude-flow update`

---

**Remember**: Claude Flow First → Swarm Orchestration → SPARC Development → Automated Testing → PR &
Review
