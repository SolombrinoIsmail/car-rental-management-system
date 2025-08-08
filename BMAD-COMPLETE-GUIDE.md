# 📚 BMad Method Complete Step-by-Step Guide

> **IMPORTANT**: Follow EVERY step in order. Do not skip any step. Each step builds on the previous
> one.

## Table of Contents

1. [Pre-Installation Checklist](#pre-installation-checklist)
2. [Installation Phase](#installation-phase)
3. [Planning Phase](#planning-phase)
4. [Development Setup Phase](#development-setup-phase)
5. [Story Implementation Cycle](#story-implementation-cycle)
6. [QA and Iteration](#qa-and-iteration)
7. [Critical Rules](#critical-rules)
8. [Command Reference](#command-reference)
9. [Troubleshooting](#troubleshooting)

---

## Pre-Installation Checklist

### ✅ Required Tools

- [ ] Node.js installed (version 16 or higher)
- [ ] npm or yarn installed
- [ ] Git installed
- [ ] IDE installed (Claude Code, Cursor, Windsurf, VS Code with Cline/Roo)
- [ ] Terminal/Command Prompt access

### ✅ Verify Installation

```bash
# Check Node.js
node --version  # Should show v16.x.x or higher

# Check npm
npm --version   # Should show 8.x.x or higher

# Check git
git --version   # Should show git version
```

---

## Installation Phase

### Step 1: Create Your Project Directory

```bash
# Open your terminal
# Navigate to where you want your project
cd ~/Development  # or your preferred location

# Create your project folder
mkdir my-saas-project  # Replace with your actual project name

# Enter the project directory
cd my-saas-project

# Verify you're in the right place
pwd  # Should show /path/to/my-saas-project
```

### Step 2: Initialize Git Repository (Optional but Recommended)

```bash
# Initialize git
git init

# Verify git initialization
ls -la  # You should see a .git folder

# Create initial commit
git add .
git commit -m "Initial commit"
```

### Step 3: Install BMad Method

```bash
# Run the BMad installer
npx bmad-method install

# Wait for the installer to load...
```

### Step 4: Installer Interactive Prompts

#### Prompt 4.1: Choose Installation Type

```
? What would you like to do?
  1) Complete installation (recommended for new users)
  2) Install individual agent
  3) Install expansion pack
  4) Generate web bundle

ENTER: 1
```

#### Prompt 4.2: Select Your IDE

```
? Which IDE are you using?
  1) Cursor
  2) Claude Code
  3) Windsurf
  4) Trae
  5) Cline (VS Code Extension)
  6) Roo Code (VS Code Extension)
  7) GitHub Copilot (VS Code Extension)
  8) Other/Custom

ENTER: [Your IDE number - e.g., 2 for Claude Code]
```

#### Prompt 4.3: Document Location

```
? Where should documents be stored? (docs/)

PRESS ENTER to accept default OR type custom path like "documentation/"
```

#### Prompt 4.4: Technical Preferences

```
? Would you like to set up technical preferences? (y/n)

ENTER: y
```

#### Prompt 4.5: Enter Your Technical Stack

```
? Enter your technical preferences:

Preferred programming languages:
ENTER: TypeScript, Python

Preferred frontend framework:
ENTER: React with Next.js 14, TailwindCSS

Preferred backend framework:
ENTER: Node.js with Express, TypeScript

Preferred database:
ENTER: PostgreSQL with Prisma ORM

Preferred cloud platform:
ENTER: AWS (ECS, RDS, S3, CloudFront)

Testing frameworks:
ENTER: Jest, React Testing Library, Cypress

Additional tools/libraries:
ENTER: Docker, Redis, Stripe, Socket.io, JWT auth
```

### Step 5: Verify Installation Success

```bash
# Check BMad core files
ls -la .bmad-core/
# You should see:
# - agents/
# - tasks/
# - templates/
# - data/
# - workflows/
# - core-config.yaml

# Check IDE integration (example for Claude Code)
ls -la .claude/
# You should see:
# - commands/BMad/

# Check documents folder
ls -la docs/
# Should exist (might be empty)
```

### Step 6: Read Installation Summary

```bash
# The installer will show:
✅ BMad-Method installed successfully!
✅ IDE integration configured for [Your IDE]
✅ Technical preferences saved
✅ Ready to use! Type /pm (or @pm) to start
```

---

## Planning Phase

### Step 7: Open Your IDE

```bash
# Open your IDE in the project directory
# For Claude Code:
claude .

# For Cursor:
cursor .

# For VS Code:
code .
```

### Step 8: Start a NEW Chat/Conversation

**CRITICAL**: In your IDE, start a completely NEW chat/conversation

- Claude Code: Click "New Chat" or Cmd+N
- Cursor: Click "New Chat"
- VS Code with Cline: Start new Cline session

### Step 9: Load Product Manager Agent

Type EXACTLY (including the slash or @ symbol):

```
/pm
```

OR (depending on your IDE):

```
@pm
```

**WAIT** for response like:

```
PM Agent loaded. I'm your Product Manager ready to help create PRDs...
Type *help to see available commands.
```

### Step 10: Create Product Requirements Document (PRD)

Type EXACTLY:

```
*create-doc prd
```

### Step 11: Answer PM Agent Questions

#### Question 11.1: Document Type

```
PM: What type of document would you like to create?

YOUR ANSWER: PRD for a SaaS application
```

#### Question 11.2: Project Description

```
PM: Please provide a brief description of your project.

YOUR ANSWER:
A project management SaaS called TaskFlow that helps remote teams
collaborate efficiently. Core features include kanban boards,
real-time collaboration, time tracking, team chat, and
subscription-based billing with free, pro, and enterprise tiers.
Target market is small to medium remote teams (5-50 people).
```

#### Question 11.3: Target Users

```
PM: Who are your target users and personas?

YOUR ANSWER:
Primary Users:
- Small to medium remote teams (5-50 employees)
- Digital agencies and consultancies
- Software development teams
- Marketing teams

User Personas:
1. Project Manager "Sarah" - Needs visibility into all projects
2. Developer "Alex" - Wants simple task tracking without friction
3. Team Lead "Marcus" - Needs resource allocation insights
4. Freelancer "Jessica" - Tracks billable hours across clients
```

#### Question 11.4: Core Problems

```
PM: What core problems are you solving?

YOUR ANSWER:
1. Tool Fragmentation - Teams use 5+ different tools (Slack, Trello,
   Toggl, Google Docs, Zoom) leading to context switching
2. Lack of Real-time Visibility - Managers can't see project status
   without asking for updates
3. Time Tracking Friction - Developers forget to track time,
   leading to lost billable hours
4. No Unified Workload View - Can't see who's overloaded or available
5. Expensive Enterprise Tools - Current solutions like Jira/Monday
   are too complex and expensive for small teams
```

#### Question 11.5: Key Features

```
PM: What are the key features? (Separate must-have from nice-to-have)

YOUR ANSWER:
MUST HAVE (MVP):
- User authentication (email/password, Google OAuth, GitHub OAuth)
- Team workspaces with invite system
- Kanban boards with drag-drop
- List view for tasks
- Real-time updates (WebSockets)
- Basic time tracking with start/stop timer
- User roles (Owner, Admin, Member, Guest)
- Task assignments and due dates
- Email notifications for mentions/assignments
- Stripe subscription billing (Free, Pro $10/user, Enterprise custom)

NICE TO HAVE (Phase 2):
- Gantt chart view
- Team chat/comments on tasks
- File attachments (S3 integration)
- Calendar integration (Google, Outlook)
- Custom fields for tasks
- Automation rules
- API for integrations
- Mobile apps (React Native)
- Advanced reporting/analytics
- Time tracking reports with export
```

#### Question 11.6: Success Metrics

```
PM: What are your success metrics?

YOUR ANSWER:
User Metrics:
- User activation: 60% complete onboarding within 7 days
- Daily Active Users: 40% of registered users
- Team creation: 50% of users create/join team within 3 days

Business Metrics:
- Free to Paid conversion: 5% within 30 days
- Monthly Recurring Revenue growth: 20% month-over-month
- Churn rate: Less than 5% monthly
- Customer Acquisition Cost: Under $50

Product Metrics:
- Average session duration: 15+ minutes
- Tasks created per user per week: 10+
- Time to first value: Under 5 minutes
- Support tickets: Less than 10 per 100 active users
- Performance: Page load under 2 seconds
```

### Step 12: Review Generated PRD

The PM will generate a comprehensive PRD. Review it carefully:

1. Check all sections are complete
2. Verify your requirements are captured
3. Look for the Epic structure
4. Ensure acceptance criteria are clear

If changes needed:

```
Please update the [specific section] to include [specific change]
```

### Step 13: Save PRD to Project

```bash
# CRITICAL: Copy the ENTIRE PRD content from the chat

# In your terminal, create the docs directory if it doesn't exist
mkdir -p docs

# Create the PRD file
touch docs/prd.md

# Open docs/prd.md in your editor and paste the ENTIRE content
# Save the file
```

### Step 14: Verify PRD Saved Correctly

```bash
# Check the file exists and has content
ls -la docs/prd.md  # Should show file size > 0

# Quick preview
head -20 docs/prd.md  # Should show PRD header
```

### Step 15: Start NEW Chat for Architecture

**CRITICAL**: Close current chat and start a COMPLETELY NEW chat

### Step 16: Load Architect Agent

Type EXACTLY:

```
/architect
```

OR:

```
@architect
```

Wait for:

```
Architect Agent loaded. I'm your Solution Architect ready to design systems...
```

### Step 17: Create Architecture Document

Type:

```
*create-doc architecture

I have a PRD ready at docs/prd.md for TaskFlow, a project management SaaS.
Please create a comprehensive architecture document covering:
- System architecture (monolith vs microservices decision)
- Database design with multi-tenancy strategy
- Authentication and authorization architecture
- Real-time features with WebSockets
- Subscription billing integration with Stripe
- Scalability plan for 100K users
- Security architecture and compliance
- CI/CD and deployment strategy
```

### Step 18: Answer Architecture Questions

#### Question 18.1: Deployment Approach

```
Architect: What's your deployment preference and constraints?

YOUR ANSWER:
Start with monolith for faster MVP development, but architect for
future microservices extraction. Deploy on AWS using:
- ECS Fargate for containers
- RDS PostgreSQL for database
- ElastiCache Redis for sessions/cache
- S3 for file storage
- CloudFront CDN for static assets
- Route53 for DNS
- ALB for load balancing
Budget: $500/month initially, scaling to $5000/month at 10K users
```

#### Question 18.2: Scale Requirements

```
Architect: What scale should we design for?

YOUR ANSWER:
Initial: 100 users, 10 concurrent
6 months: 1,000 users, 100 concurrent
Year 1: 10,000 users, 1,000 concurrent
Year 2: 50,000 users, 5,000 concurrent
Year 3: 100,000 users, 10,000 concurrent

Peak usage: 9am-6pm business hours across timezones
Data growth: ~1GB per 100 users per month
```

#### Question 18.3: Security Requirements

```
Architect: What are your security and compliance requirements?

YOUR ANSWER:
- SOC 2 Type 2 compliance roadmap
- GDPR compliance for EU users
- Data residency options for enterprise
- Encryption at rest and in transit
- Row-level security for multi-tenancy
- API rate limiting
- DDoS protection
- Regular security audits
- PCI compliance for payments (via Stripe)
- 2FA for user accounts
```

### Step 19: Save Architecture Document

```bash
# Copy the ENTIRE architecture document from chat

# Create the architecture file
touch docs/architecture.md

# Open docs/architecture.md and paste content
# Save the file

# Verify
ls -la docs/architecture.md
head -20 docs/architecture.md
```

### Step 20: Validate Document Alignment (Optional but Recommended)

Start NEW chat:

```
/po

Please run the master checklist to validate alignment between
docs/prd.md and docs/architecture.md
```

Fix any issues identified before proceeding.

---

## Development Setup Phase

### Step 21: Document Sharding (CRITICAL)

Start NEW chat:

```
/bmad-master

Please shard both documents for development:
1. Shard docs/prd.md into docs/prd/ directory
2. Shard docs/architecture.md into docs/architecture/ directory
```

### Step 22: Verify Sharding Success

```bash
# Check PRD sharding
ls -la docs/prd/
# Should see files like:
# - epic-1-user-management.md
# - epic-2-task-management.md
# - epic-3-collaboration.md
# - requirements.md
# - success-metrics.md

# Check Architecture sharding
ls -la docs/architecture/
# Should see files like:
# - system-design.md
# - database-design.md
# - api-design.md
# - security.md
# - deployment.md
```

### Step 23: Initialize Your Application Code

**In a new terminal** (keep IDE open):

```bash
# Navigate to project root
cd ~/Development/my-saas-project

# Create Next.js frontend
npx create-next-app@latest frontend --typescript --tailwind --app

# When prompted:
# ✔ Would you like to use ESLint? → Yes
# ✔ Would you like to use `src/` directory? → Yes
# ✔ Would you like to customize the default import alias? → No
```

### Step 24: Setup Backend

```bash
# Create backend directory
mkdir backend
cd backend

# Initialize package.json
npm init -y

# Install core dependencies
npm install express cors dotenv
npm install typescript @types/node @types/express @types/cors
npm install jsonwebtoken bcryptjs
npm install stripe
npm install socket.io
npm install zod

# Install dev dependencies
npm install -D nodemon ts-node
npm install -D @types/jsonwebtoken @types/bcryptjs

# Install Prisma
npm install prisma @prisma/client

# Initialize TypeScript
npx tsc --init

# Initialize Prisma
npx prisma init
```

### Step 25: Create Project Structure

```bash
# From project root
cd ~/Development/my-saas-project

# Backend structure
mkdir -p backend/src/controllers
mkdir -p backend/src/models
mkdir -p backend/src/routes
mkdir -p backend/src/services
mkdir -p backend/src/middleware
mkdir -p backend/src/utils
mkdir -p backend/src/types
mkdir -p backend/src/config

# Frontend structure
mkdir -p frontend/src/components/ui
mkdir -p frontend/src/components/features
mkdir -p frontend/src/hooks
mkdir -p frontend/src/lib
mkdir -p frontend/src/types
mkdir -p frontend/src/utils
mkdir -p frontend/src/app/api

# Documentation structure
mkdir -p docs/stories
mkdir -p docs/dev-notes
mkdir -p docs/qa-reviews

# Testing structure
mkdir -p tests/unit
mkdir -p tests/integration
mkdir -p tests/e2e

# Verify structure
tree -L 3 -d  # Shows directory structure
```

### Step 26: Create Configuration Files

Start NEW chat:

```
/dev

Please create these initial configuration files based on docs/architecture.md:
1. .env.example for both frontend/ and backend/
2. docker-compose.yml for local PostgreSQL and Redis
3. Root .gitignore covering entire project
4. backend/tsconfig.json adjustments for our setup
5. backend/package.json scripts for development
```

### Step 27: Setup Database

```bash
# From project root
cd backend

# Update .env with your database URL
cp .env.example .env
# Edit .env and set:
# DATABASE_URL="postgresql://user:password@localhost:5432/taskflow_dev"

# Start PostgreSQL with Docker
cd ..  # Back to project root
docker-compose up -d postgres

# Create first migration
cd backend
npx prisma migrate dev --name init

# Verify database
npx prisma studio  # Opens browser to view database
```

---

## Story Implementation Cycle

### Step 28: Create First Story

**CRITICAL**: Start a COMPLETELY NEW chat

Type:

```
/sm
```

Wait for SM agent to load, then type:

```
*create
```

### Step 29: SM Creates Story

SM will:

1. Read docs/prd/epic-1-\*.md
2. Read docs/architecture/
3. Create story file

You'll see:

```
Creating Story 1.1: User Authentication Foundation
Location: docs/stories/story-1.1-user-authentication-foundation.md
Status: Draft
```

### Step 30: Review Story Content

The story should contain:

- **Title**: Clear and specific
- **Status**: Draft
- **Acceptance Criteria**: 3-5 specific criteria
- **Tasks**: 4-8 sequential tasks with checkboxes
- **Technical Notes**: From architecture
- **Estimated Hours**: 4-8 hours

Example:

```markdown
# Story 1.1: User Authentication Foundation

## Status: Draft

## Acceptance Criteria

- [ ] Users can register with email/password
- [ ] Passwords are hashed with bcrypt
- [ ] JWT tokens are generated on login
- [ ] Protected routes require valid token
- [ ] Refresh token mechanism works

## Tasks

- [ ] Create Prisma schema for User model
- [ ] Implement registration endpoint
- [ ] Implement login endpoint
- [ ] Create JWT middleware
- [ ] Add refresh token endpoint
- [ ] Write authentication tests
```

### Step 31: Approve the Story

In the same SM chat:

```
The story looks good. Please update the status from Draft to Approved.
```

SM responds:

```
✅ Updated story-1.1 status to Approved
Ready for development!
```

### Step 32: Start Development

**CRITICAL**: Close SM chat and start COMPLETELY NEW chat

Type:

```
/dev
```

### Step 33: Give Story to Dev

Type EXACTLY:

```
Please implement story 1.1: User Authentication Foundation
The story file is at: docs/stories/story-1.1-user-authentication-foundation.md

Read the story first, then implement each task sequentially.
Mark each subtask as complete with ✅ as you finish.
Maintain a File List of all created/modified files.
```

### Step 34: Dev Implementation Process

Watch Dev work through each task:

#### Task 34.1: Database Schema

```
Dev: Starting Task 1: Create Prisma schema for User model

Reading architecture for database design...
Creating backend/prisma/schema.prisma...

✅ Task 1 complete
```

#### Task 34.2: Registration Endpoint

```
Dev: Starting Task 2: Implement registration endpoint

Creating backend/src/controllers/auth.controller.ts...
Creating backend/src/routes/auth.routes.ts...
Adding validation with Zod...

✅ Task 2 complete
```

#### Task 34.3: Continue Through All Tasks

Dev will complete each task, showing:

- Files created/modified
- Code snippets
- Test results
- Checkbox updates

### Step 35: Handle Dev Questions

Dev might ask clarifying questions:

```
Dev: Should refresh tokens be stored in database or Redis?

YOUR ANSWER: Use Redis with 7-day TTL for refresh tokens.
This allows easy revocation and automatic cleanup.
```

### Step 36: Dev Completes Story

Dev will:

1. Mark all tasks ✅ complete
2. Run tests
3. Update story status to "Review"
4. Add File List section
5. Add Dev Notes section

```
Dev: All tasks completed!
- ✅ All tests passing
- ✅ Linting passed
- ✅ Story status updated to Review
- ✅ File list added
```

### Step 37: Verify Dev Work

Check that Dev has:

- [ ] All task checkboxes marked ✅
- [ ] File List section with all files
- [ ] Dev Notes with decisions/issues
- [ ] Status changed to "Review"
- [ ] Tests passing confirmation

---

## QA and Iteration

### Step 38: QA Review

**CRITICAL**: Start NEW chat

Type:

```
/qa
```

### Step 39: Request QA Review

Type:

```
Please review story 1.1: User Authentication Foundation
Location: docs/stories/story-1.1-user-authentication-foundation.md

Perform senior developer review:
1. Check code quality and patterns
2. Review security implementation
3. Verify test coverage
4. Refactor if needed
5. Add missing tests
```

### Step 40: QA Review Process

QA will:

```
Reading story and implementation...

Reviewing files:
- backend/src/controllers/auth.controller.ts
- backend/src/middleware/auth.middleware.ts
- backend/prisma/schema.prisma
- backend/src/routes/auth.routes.ts

Issues found:
1. Missing rate limiting on login endpoint
2. No input sanitization
3. JWT secret hardcoded
4. Missing error handling for database failures
5. No unit tests for utilities

Fixing issues...
```

### Step 41: QA Improvements

QA actively improves code:

```
Adding rate limiting with express-rate-limit...
✅ Added to login and register endpoints

Moving JWT secret to environment variable...
✅ Updated .env.example

Adding comprehensive error handling...
✅ Added try-catch blocks and error middleware

Creating unit tests...
✅ Added 12 new tests

Running all tests...
✅ All 18 tests passing
```

### Step 42: QA Completion

QA updates story with:

```markdown
## QA Review Results

- ✅ Security hardening complete
- ✅ Added rate limiting
- ✅ Improved error handling
- ✅ Added 12 unit tests
- ✅ Fixed environment variables
- ✅ Code follows best practices

## Status: Done
```

### Step 43: Start Next Story

**CRITICAL**: Start NEW chat

Type:

```
/sm
*create
```

SM will:

- Read story 1.1's Dev Notes and QA Review
- Create story 1.2 building on 1.1
- Continue the epic

### Step 44: Continue Development Cycle

Repeat Steps 28-43 for each story:

1. SM creates story → Approve
2. Dev implements → Review
3. QA reviews → Done
4. Next story

Stories progress:

- Story 1.1: User Authentication Foundation ✅
- Story 1.2: User Profile Management
- Story 1.3: Password Reset Flow
- Story 1.4: OAuth Integration
- Story 1.5: Two-Factor Authentication

### Step 45: Epic Completion

When all Epic 1 stories complete:

```
/sm

Epic 1 is complete. Please create the first story for Epic 2.
*create
```

### Step 46: Testing Your Application

After 3-4 stories, test the application:

```bash
# Terminal 1: Database
docker-compose up -d

# Terminal 2: Backend
cd backend
npm run dev
# Should show: Server running on port 3001

# Terminal 3: Frontend
cd frontend
npm run dev
# Should show: Ready on http://localhost:3000

# Terminal 4: Run tests
cd backend
npm test
```

Visit: http://localhost:3000

### Step 47: Regular Validation

Every 5 stories, validate progress:

Start NEW chat:

```
/po

Please review our progress:
1. Check completed stories align with PRD
2. Verify architecture is being followed
3. Identify any gaps or issues
```

---

## Critical Rules

### 🔴 NEVER BREAK THESE RULES

1. **ALWAYS NEW CHAT WHEN SWITCHING AGENTS**
   - ❌ WRONG: Same chat for SM then Dev
   - ✅ RIGHT: New chat for each agent

2. **ONE STORY AT A TIME**
   - ❌ WRONG: Multiple stories in progress
   - ✅ RIGHT: Complete full cycle per story

3. **FOLLOW THE SEQUENCE**
   - ✅ RIGHT: SM → Dev → QA → Repeat
   - ❌ WRONG: Skip steps or random order

4. **DOCUMENTS BEFORE DEVELOPMENT**
   - ✅ Must have: docs/prd.md and docs/architecture.md
   - ✅ Must shard before stories

5. **MARK TASKS COMPLETE**
   - ✅ Dev marks each task ✅ as completed
   - ✅ QA verifies all marks

---

## Command Reference

### IDE-Specific Agent Commands

#### Claude Code

```
/pm          # Product Manager
/architect   # Solution Architect
/dev         # Developer
/qa          # QA Engineer
/sm          # Scrum Master
/po          # Product Owner
/bmad-master # Universal agent
```

#### Cursor / Windsurf

```
@pm          # Product Manager
@architect   # Solution Architect
@dev         # Developer
@qa          # QA Engineer
@sm          # Scrum Master
@po          # Product Owner
@bmad-master # Universal agent
```

### Agent Task Commands

```
*help        # Show available commands
*status      # Show current status
*create      # Create next story (SM only)
*create-doc [type]  # Create document
*exit        # Exit agent mode
```

### Story Status Progression

```
Draft → Approved → InProgress → Review → Done
```

---

## Troubleshooting

### Problem: "Agent not recognized"

Solution:

```bash
# Check installation
ls -la .bmad-core/agents/
# Should list all agent .md files

# Check IDE integration
ls -la .claude/  # or .cursorrules
```

### Problem: "SM can't find epics"

Solution:

```
/bmad-master
The SM agent can't find epics. Please verify docs/prd/
has sharded epic files.
```

### Problem: "Dev lost context"

Solution:

1. Save current work
2. Start NEW chat
3. Give specific context:

```
/dev
Continue implementing story 1.2.
Previous story 1.1 is complete.
Focus on the tasks in docs/stories/story-1.2-*.md
```

### Problem: "Tests failing"

Solution:

```
/dev
Tests are failing with error: [paste error]
Please fix the tests and ensure all pass.
```

### Problem: "Story too large"

Solution:

```
/sm
This story seems too large (over 8 hours).
Please split into 2-3 smaller stories.
```

### Problem: "Can't run commands"

Solution:

```bash
# Check Node/npm
node --version
npm --version

# Reinstall dependencies
cd backend
rm -rf node_modules
npm install

cd ../frontend
rm -rf node_modules
npm install
```

---

## Success Checklist

### After 1 Hour

- [ ] BMad installed
- [ ] PRD created and saved
- [ ] Architecture created and saved
- [ ] Documents sharded
- [ ] First story created

### After 4 Hours

- [ ] Story 1.1 implemented
- [ ] Story 1.1 QA reviewed
- [ ] Story 1.2 in progress
- [ ] Basic authentication working
- [ ] Tests passing

### After 1 Day

- [ ] Epic 1 (5-6 stories) complete
- [ ] Application running locally
- [ ] 50+ tests passing
- [ ] Can register/login users
- [ ] Database migrations working

### After 1 Week

- [ ] 3-4 Epics complete
- [ ] 20-30 stories done
- [ ] Core features working
- [ ] Ready for staging deployment
- [ ] 200+ tests passing

---

## Quick Recovery Steps

If you get stuck at any point:

1. **Check where you are**:

```bash
ls -la docs/stories/  # How many stories?
git status  # What's changed?
```

2. **Reset agent context**:

```
*exit
# Start new chat
/bmad-master
*status
```

3. **Get unstuck**:

```
/bmad-master
I'm stuck at [describe situation].
My last completed story was [X.X].
Please help me continue.
```

4. **Emergency restart**:

```bash
# Save your work
git add .
git commit -m "WIP: Saving progress"

# Start fresh chat
/sm
*status
What's the next story to create after [last story]?
```

---

## Next Steps After This Guide

1. **Complete First Epic**: Get 5-6 stories done
2. **Deploy to Staging**: Use architect for deployment setup
3. **Add CI/CD**: GitHub Actions for automated testing
4. **Security Audit**: Use QA agent for security review
5. **Performance Testing**: Load testing with Artillery
6. **Documentation**: Generate API docs and user guides
7. **Launch Preparation**: Use PM for go-to-market strategy

---

## Remember

- 🎯 **New chat for each agent** - This is critical!
- 📝 **Follow the sequence** - SM → Dev → QA
- ✅ **One story at a time** - Complete before starting next
- 🔍 **Review everything** - You are the quality gate
- 🚀 **Trust the process** - It works!

---

## Ready to Start?

1. ✅ Save this guide for reference
2. ✅ Run `npx bmad-method install`
3. ✅ Type `/pm` to begin
4. ✅ Follow each step exactly
5. ✅ Build your SaaS!

**You've got this! Start with Step 1 and follow each step sequentially.**
