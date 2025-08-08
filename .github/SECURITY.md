# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such
patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of our Swiss Car Rental Management System seriously. If you believe you have
found a security vulnerability, please report it to us as described below.

### Please do NOT:

- Open a public GitHub issue
- Post about it on social media
- Exploit the vulnerability in production

### Please DO:

- Email us directly at: security@solombrino.ch
- Include the following information:
  - Type of vulnerability (e.g., XSS, SQL Injection, Authentication Bypass)
  - Full paths of source file(s) related to the vulnerability
  - Location of the affected source code (tag/branch/commit or direct URL)
  - Step-by-step instructions to reproduce the issue
  - Proof-of-concept or exploit code (if possible)
  - Impact of the vulnerability
  - Any potential mitigations you've identified

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Assessment**: Our security team will assess the vulnerability within 5 business days
- **Communication**: We will keep you informed about the progress of addressing the vulnerability
- **Fix Timeline**: Critical vulnerabilities will be addressed within 7 days, others within 30 days
- **Credit**: We will credit you for the discovery (unless you prefer to remain anonymous)

## Security Measures

### Current Security Features

- **Authentication**: JWT-based authentication with refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Encryption at rest and in transit
- **Input Validation**: Comprehensive input validation and sanitization
- **SQL Injection Prevention**: Parameterized queries via Prisma ORM
- **XSS Prevention**: Content Security Policy (CSP) headers
- **CSRF Protection**: CSRF tokens for state-changing operations
- **Rate Limiting**: API rate limiting to prevent abuse
- **Security Headers**: Comprehensive security headers via Next.js
- **Dependency Scanning**: Automated vulnerability scanning with Dependabot
- **Code Analysis**: Static application security testing with CodeQL
- **Secret Detection**: Automated secret scanning with Gitleaks

### Swiss Compliance

Our system is designed to comply with Swiss data protection regulations:

- **Data Residency**: All data stored in Swiss or EU data centers
- **GDPR/FADP Compliance**: Full compliance with data protection laws
- **Data Minimization**: Only collect necessary data
- **Right to Erasure**: Complete data deletion capabilities
- **Audit Logging**: Comprehensive audit trails for compliance

## Security Best Practices for Contributors

### Code Security

- Never commit secrets, API keys, or credentials
- Use environment variables for sensitive configuration
- Validate and sanitize all user inputs
- Use parameterized queries for database operations
- Implement proper error handling without exposing sensitive information

### Dependencies

- Keep all dependencies up to date
- Review security advisories for dependencies
- Use `pnpm audit` regularly to check for vulnerabilities
- Only use dependencies from trusted sources

### Authentication & Authorization

- Implement proper session management
- Use secure password hashing (bcrypt/argon2)
- Enforce strong password policies
- Implement multi-factor authentication where appropriate
- Check authorization for every protected route

### Data Protection

- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Implement proper key management
- Follow the principle of least privilege
- Regular security audits and penetration testing

## Security Checklist for PRs

Before submitting a PR, ensure:

- [ ] No secrets or credentials in code
- [ ] All inputs are validated and sanitized
- [ ] Authentication and authorization checks are in place
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Dependencies are up to date
- [ ] Security tests pass
- [ ] CodeQL analysis passes

## Contact

For any security-related questions or concerns, please contact:

- Email: security@solombrino.ch
- GPG Key: [Available upon request]

## Acknowledgments

We thank the following individuals for responsibly disclosing security vulnerabilities:

- [Your name could be here!]

---

_Last updated: January 2025_
