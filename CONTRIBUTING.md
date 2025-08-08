# Contributing to Swiss Car Rental Management System

## 🎯 Development Setup

1. **Prerequisites**
   - Node.js >= 20.0.0
   - pnpm >= 9.15.0
   - Git

2. **Installation**

   ```bash
   pnpm install
   pnpm prepare  # Sets up git hooks
   ```

3. **Development**
   ```bash
   pnpm dev      # Start development servers
   pnpm lint     # Lint and fix code
   pnpm format   # Format code with Prettier
   pnpm test     # Run tests
   ```

## 📝 Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages. This
enables automated versioning and changelog generation.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions or changes
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Maintenance tasks

### Examples

```bash
feat(auth): add SSO login support
fix(contracts): resolve PDF generation timeout
docs: update API documentation
perf(db): optimize customer query performance
```

### Scope

Use the Linear issue ID when applicable:

```bash
feat(SOL-48): complete development environment setup
```

## 🔄 Pull Request Process

1. **Create feature branch**

   ```bash
   git checkout -b feat/SOL-XXX-feature-name
   ```

2. **Make changes and commit**
   - Code must pass linting and formatting checks
   - All tests must pass
   - Commit messages must follow convention

3. **Push and create PR**

   ```bash
   git push origin feat/SOL-XXX-feature-name
   gh pr create --title "feat(SOL-XXX): Feature description"
   ```

4. **PR Requirements**
   - Link to Linear issue
   - Clear description of changes
   - Screenshots for UI changes
   - Test coverage for new features
   - Pass all CI checks

## 🧪 Testing

- **Unit tests**: Test individual components/functions
- **Integration tests**: Test feature workflows
- **E2E tests**: Test complete user journeys

```bash
pnpm test:unit      # Run unit tests
pnpm test:e2e       # Run E2E tests
pnpm test:coverage  # Generate coverage report
```

## 📏 Code Style

### TypeScript/JavaScript

- ESLint with flat config for linting
- Prettier for formatting
- Import order enforced
- Prefer const over let
- Use template literals

### React

- Functional components with hooks
- TypeScript for all components
- Props validation with TypeScript
- Tailwind CSS for styling

### Path Aliases

Use path aliases for cleaner imports:

- `@/components/*` - React components
- `@/lib/*` - Utility libraries
- `@/hooks/*` - Custom hooks
- `@/types/*` - TypeScript types
- `@/services/*` - API services

## 🚀 VS Code Extensions

Required extensions:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

Recommended extensions (see `.vscode/extensions.json`)

## 🛡️ Security

- Never commit secrets or API keys
- Use environment variables for sensitive data
- Review dependencies for vulnerabilities
- Follow OWASP guidelines

## 📋 Pre-commit Hooks

Automatic checks on commit:

1. Linting (ESLint)
2. Formatting (Prettier)
3. Type checking (TypeScript)
4. Commit message validation

Pre-push hooks:

1. Unit tests
2. Build verification

## 🤝 Code Review

All PRs require:

- At least one approval
- Passing CI/CD checks
- Up-to-date with main branch
- Resolved conversations

## 📚 Resources

- [Project Documentation](./README.md)
- [API Documentation](./docs/api)
- [Linear Board](https://linear.app/solombrino-solutions)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
