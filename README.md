# 🚗 Swiss Car Rental Management System

A modern, enterprise-grade car rental management system built with Next.js, TypeScript, and
Supabase.

## 🏗️ Architecture

This project uses a **monorepo structure** powered by Turborepo for optimal development experience
and code sharing.

```
car-rental-management-system/
├── apps/
│   ├── web/                 # Main Next.js application
│   ├── admin/               # Admin dashboard (future)
│   └── mobile/              # React Native app (future)
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── database/            # Prisma schema & client
│   ├── config-typescript/   # Shared TypeScript configs
│   ├── config-eslint/       # Shared ESLint configs
│   └── utils/               # Shared utilities
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9.15+
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/SolombrinoIsmail/car-rental-management-system.git
cd car-rental-management-system
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
pnpm dev
```

The application will be available at http://localhost:3000

## 📚 Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm test` - Run tests

### Database Commands

- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema to database
- `pnpm db:migrate` - Run migrations
- `pnpm db:studio` - Open Prisma Studio

## 🛠️ Technology Stack

### Core Technologies

- **Turborepo 2.3+** - High-performance monorepo orchestration
- **pnpm 9.15+** - Fast, disk-efficient package manager
- **Next.js 15.4+** - React framework with App Router
- **TypeScript 5.6+** - Type-safe JavaScript
- **React 19** - UI library

### UI & Styling

- **Tailwind CSS 3.4+** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Radix UI** - Accessible component primitives

### Backend & Database

- **Supabase** - Backend as a Service
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Database

### Developer Experience

- **Turbopack** - Rust-based bundler (development)
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Commitlint** - Commit message linting

## 📦 Project Structure

```
.
├── apps/
│   └── web/                 # Main Next.js application
├── packages/
│   ├── ui/                  # Shared components and design system
│   ├── database/            # Database schema and Prisma client
│   ├── config-typescript/   # Shared TypeScript configuration
│   ├── config-eslint/       # Shared ESLint configuration
│   └── utils/               # Shared utility functions
├── .github/                 # GitHub Actions workflows
├── .vscode/                 # VS Code workspace settings
├── turbo.json              # Turborepo configuration
├── pnpm-workspace.yaml     # pnpm workspace configuration
└── package.json            # Root package.json
```

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=your_database_url

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run unit tests
pnpm test:unit

# Run E2E tests
pnpm test:e2e

# Run tests with coverage
pnpm test:coverage
```

## 📝 Code Quality

This project uses strict TypeScript configuration and enforces code quality through:

- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for pre-commit hooks
- **Commitlint** for conventional commits

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process
for submitting pull requests.

## 📄 License

This project is proprietary and confidential.

## 🔗 Links

- [Documentation](./docs)
- [Architecture Decisions](./docs/architecture)
- [API Documentation](./docs/api)

## 👥 Team

- **Ismail Solombrino** - Lead Developer

---

Built with ❤️ in Switzerland 🇨🇭
