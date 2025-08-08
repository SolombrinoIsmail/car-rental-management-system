# GitHub Actions Secrets Setup Guide

This guide explains how to configure the required GitHub Secrets for the CI/CD pipeline.

## Required Secrets

### Vercel Deployment (Required for deployments)

These secrets are required for deploying to Vercel:

- **`VERCEL_TOKEN`**: Your Vercel authentication token
  - Get it from: https://vercel.com/account/tokens
  - Create a new token with full access
- **`VERCEL_ORG_ID`**: Your Vercel organization ID
  - Run `npx vercel link` locally to link your project
  - Find it in `.vercel/project.json` after linking
- **`VERCEL_PROJECT_ID`**: Your Vercel project ID
  - Run `npx vercel link` locally to link your project
  - Find it in `.vercel/project.json` after linking

### Code Quality & Security Secrets

- **`SONAR_TOKEN`**: For SonarCloud code analysis
  - Get it from: https://sonarcloud.io/
  - Create project: https://sonarcloud.io/projects/create
  - Organization: `solombrinoismail`
  - Project key: `SolombrinoIsmail_car-rental-management-system`

- **`SEMGREP_APP_TOKEN`**: For Semgrep security scanning (optional)
  - Get it from: https://semgrep.dev/

- **`NVD_API_KEY`**: For OWASP Dependency Check (optional)
  - Get it from: https://nvd.nist.gov/developers/request-an-api-key

### Testing & Monitoring Secrets

- **`LHCI_GITHUB_APP_TOKEN`**: For Lighthouse CI (optional)
  - Get it from: https://github.com/apps/lighthouse-ci

- **`DATABASE_URL`**: For database tests in CI (optional)
  - Format: `postgresql://user:password@host:port/database`

- **`SENTRY_AUTH_TOKEN`**: For Sentry release tracking (optional)
  - Get it from: https://sentry.io/settings/account/api/auth-tokens/
  - Needs project:write scope

- **`SENTRY_DSN`**: For Sentry error tracking in app (optional)
  - Get it from your Sentry project settings

### Optional Secrets (Features will be skipped if not configured)

- **`CODECOV_TOKEN`**: For code coverage reporting
  - Get it from: https://app.codecov.io/
- **`SNYK_TOKEN`**: For additional security scanning
  - Get it from: https://app.snyk.io/account

## How to Add Secrets

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with its name and value

## Quick Setup Commands

After installing Vercel CLI (`pnpm add -g vercel`):

```bash
# Link your project to Vercel (creates .vercel/project.json)
npx vercel link

# View the IDs
cat .vercel/project.json

# The file will contain:
# {
#   "orgId": "YOUR_VERCEL_ORG_ID",
#   "projectId": "YOUR_VERCEL_PROJECT_ID"
# }
```

## Enable GitHub Features

### CodeQL Security Scanning

1. Go to **Settings** → **Security & analysis**
2. Enable **Code scanning**
3. Click **Set up** → **Default**

### Dependabot

1. Go to **Settings** → **Security & analysis**
2. Enable **Dependabot alerts**
3. Enable **Dependabot security updates**

## Verification

After setting up secrets, you can verify the workflows:

1. Go to **Actions** tab
2. Select any workflow
3. Click **Run workflow**
4. Check the logs for any warnings about missing secrets

## Troubleshooting

- Workflows failing? Check the Actions logs for specific error messages
- "Bad credentials" error? Regenerate and update your tokens
- Deployment not working? Ensure your Vercel project exists and is linked
### Optional Secrets (Features will be skipped if not configured)

- **`CODECOV_TOKEN`**: For code coverage reporting
  - Get it from: https://app.codecov.io/
  - Not required for public repositories
- **`SNYK_TOKEN`**: For additional security scanning
  - Get it from: https://app.snyk.io/account
  - Free tier available

## How to Add Secrets

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with its name and value

## Quick Setup Commands

After installing Vercel CLI (`pnpm add -g vercel`):

```bash
# Link your project to Vercel (creates .vercel/project.json)
npx vercel link

# View the IDs
cat .vercel/project.json

# The file will contain:
# {
#   "orgId": "YOUR_VERCEL_ORG_ID",
#   "projectId": "YOUR_VERCEL_PROJECT_ID"
# }
```

## Enable GitHub Features

### CodeQL Security Scanning

1. Go to **Settings** → **Security & analysis**
2. Enable **Code scanning**
3. Click **Set up** → **Default**

### Dependabot

1. Go to **Settings** → **Security & analysis**
2. Enable **Dependabot alerts**
3. Enable **Dependabot security updates**

## Verification

After setting up secrets, you can verify the workflows:

1. Go to **Actions** tab
2. Select any workflow
3. Click **Run workflow**
4. Check the logs for any warnings about missing secrets

## Troubleshooting

- **Workflows still failing?** Check the Actions logs for specific error messages
- **"Bad credentials" error?** Regenerate and update your tokens
- **Deployment not working?** Ensure your Vercel project exists and is linked
