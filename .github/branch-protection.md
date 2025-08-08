# Branch Protection Rules

## Main Branch Protection

Apply these rules to the `main` branch:

### Required Status Checks

- ✅ **Require branches to be up to date before merging**
- Required checks:
  - `CI/CD Pipeline / Lint & Type Check`
  - `CI/CD Pipeline / Test`
  - `CI/CD Pipeline / Build`
  - `CodeQL Security Analysis / Analyze Code (javascript)`
  - `CodeQL Security Analysis / Analyze Code (typescript)`
  - `Security Scanning / Trivy Security Scan`
  - `Security Scanning / Secret Detection`

### Required Reviews

- ✅ **Require pull request reviews before merging**
  - Required approving reviews: 1
  - Dismiss stale pull request approvals when new commits are pushed
  - Require review from CODEOWNERS
  - Restrict who can dismiss pull request reviews

### Merge Requirements

- ✅ **Require conversation resolution before merging**
- ✅ **Require signed commits**
- ✅ **Require linear history**
- ✅ **Include administrators**

### Push Restrictions

- ✅ **Restrict who can push to matching branches**
  - Users/teams with push access: @SolombrinoIsmail

### Force Push

- ❌ **Do not allow force pushes**
- ❌ **Do not allow deletions**

## Develop Branch Protection

Apply these rules to the `develop` branch:

### Required Status Checks

- ✅ **Require branches to be up to date before merging**
- Required checks:
  - `CI/CD Pipeline / Lint & Type Check`
  - `CI/CD Pipeline / Test`
  - `CI/CD Pipeline / Build`

### Required Reviews

- ✅ **Require pull request reviews before merging**
  - Required approving reviews: 1
  - Dismiss stale pull request approvals when new commits are pushed

### Merge Requirements

- ✅ **Require conversation resolution before merging**
- ✅ **Require linear history**

### Force Push

- ❌ **Do not allow force pushes**
- ❌ **Do not allow deletions**

## Setting Up Branch Protection

To apply these rules:

1. Go to Settings → Branches in your GitHub repository
2. Click "Add rule" or edit existing rules
3. Apply the settings as described above for each branch
4. Click "Create" or "Save changes"

## Automated Setup Script

Run this GitHub CLI command to set up branch protection:

```bash
# Main branch protection
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --raw-field "required_status_checks[strict]=true" \
  --raw-field "required_status_checks[contexts][]=CI/CD Pipeline / Lint & Type Check" \
  --raw-field "required_status_checks[contexts][]=CI/CD Pipeline / Test" \
  --raw-field "required_status_checks[contexts][]=CI/CD Pipeline / Build" \
  --raw-field "required_status_checks[contexts][]=CodeQL Security Analysis / Analyze Code (javascript)" \
  --raw-field "required_status_checks[contexts][]=CodeQL Security Analysis / Analyze Code (typescript)" \
  --raw-field "required_pull_request_reviews[required_approving_review_count]=1" \
  --raw-field "required_pull_request_reviews[dismiss_stale_reviews]=true" \
  --raw-field "required_pull_request_reviews[require_code_owner_reviews]=true" \
  --raw-field "required_conversation_resolution=true" \
  --raw-field "required_linear_history=true" \
  --raw-field "enforce_admins=true" \
  --raw-field "allow_force_pushes=false" \
  --raw-field "allow_deletions=false"
```
