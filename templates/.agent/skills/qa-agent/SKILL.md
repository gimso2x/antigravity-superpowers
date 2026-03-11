---
name: qa-agent
description: OWASP Top 10 security, performance, accessibility reviews. Use when reviewing code for security vulnerabilities, performance issues, accessibility compliance, or quality assurance checks.
---

# QA Agent

## Overview

Quality assurance specialist focused on security vulnerabilities (OWASP Top 10), performance optimization, and accessibility (WCAG 2.1 AA) compliance. Provides systematic code reviews and audits.

## Core Domains

### Security (OWASP Top 10)
- Injection (SQL, NoSQL, OS command, LDAP)
- Broken Authentication
- Sensitive Data Exposure
- XML External Entities (XXE)
- Broken Access Control
- Security Misconfiguration
- Cross-Site Scripting (XSS)
- Insecure Deserialization
- Using Components with Known Vulnerabilities
- Insufficient Logging & Monitoring

### Performance
- Database query optimization
- Bundle size optimization
- Render performance
- Network efficiency
- Memory leaks
- Caching strategies

### Accessibility (WCAG 2.1 AA)
- Keyboard navigability
- Screen reader compatibility
- Color contrast ratios
- Semantic HTML
- ARIA attributes
- Focus management
- Image alt texts

## When This Skill Applies

**Trigger phrases** include:
- "Review security", "audit", "security check", "vulnerability"
- "Check performance", "optimize", "slow", "bottleneck"
- "Accessibility", "a11y", "WCAG", "screen reader"
- "Code review", "quality check", "audit code"
- "OWASP", "XSS", "SQL injection", "security best practices"
- "Production readiness", "deployment readiness"

## Security Review Checklist

### Authentication & Authorization
- [ ] Passwords hashed with bcrypt/argon2 (cost factor >= 12)
- [ ] JWT tokens have reasonable expiration (no permanent tokens)
- [ ] Refresh token rotation implemented
- [ ] Role-based access control (RBAC) properly enforced
- [ ] Session timeout configured
- [ ] Multi-factor authentication recommended for sensitive accounts

### Input Validation
- [ ] All user input validated server-side
- [ ] SQL injection prevention (parameterized queries/ORM)
- [ ] XSS prevention with proper output encoding
- [ ] File upload validation (type, size, content)
- [ ] Rate limiting on all public endpoints
- [ ] CSRF tokens for state-changing operations

### Data Security
- [ ] No hardcoded credentials/secrets in code
- [ ] Environment variables for all sensitive data
- [ ] HTTPS enforced in production
- [ ] Security headers configured:
  - HSTS (Strict-Transport-Security)
  - CSP (Content-Security-Policy)
  - X-Frame-Options (Clickjacking protection)
  - X-Content-Type-Options
  - Referrer-Policy
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS for all API calls (no insecure HTTP)

### Dependency Security
- [ ] Dependencies up to date (`npm audit` / `pip audit`)
- [ ] No known vulnerabilities in dependencies
- [ ] Dependency scanning in CI/CD pipeline
- [ ] License compliance checked

## Performance Review Checklist

### Database
- [ ] Indexes on frequently queried columns
- [ ] No N+1 query problems (eager loading used)
- [ ] Connection pooling configured
- [ ] Pagination for large datasets
- [ ] Query caching where appropriate
- [ ] Slow query monitoring enabled

### Frontend
- [ ] Bundle size analyzed and optimized
- [ ] Code splitting implemented for large bundles
- [ ] Lazy loading for non-critical components
- [ ] Images optimized (next/image, compression)
- [ ] Minification enabled (JS, CSS)
- [ ] Browser caching headers set

### Rendering
- [ ] Minimal re-renders (avoid unnecessary state updates)
- [ ] `useMemo`/`useCallback` for expensive computations
- [ ] Virtual lists for large datasets
- [ ] Debouncing/throttling for event handlers
- [ ] Performance monitoring (Lighthouse, Web Vitals)

## Accessibility Review Checklist

### Semantic HTML
- [ ] Headings have logical hierarchy (h1 → h2 → h3)
- [ ] Interactive elements use proper tags (button, a, input)
- [ ] Form fields have associated labels
- [ ] Tables have proper structure (caption, th, scope)
- [ ] Lists use ul/ol/dl appropriately

### Keyboard Navigation
- [ ] All interactive elements keyboard accessible
- [ ] Focus order logical and visible
- [ ] No keyboard traps (can tab through entire page)
- [ ] Skip links available for main navigation
- [ ] No keyboard-only content hidden from screen readers

### Visual & Auditory
- [ ] Color contrast ≥ 4.5:1 for normal text
- [ ] Color contrast ≥ 3:1 for large text
- [ ] Color NOT the only indicator of information
- [ ] Automated audio/video has controls
- [ ] Auto-playing content ≤ 3 seconds or has pause
- [ ] Captions/subtitles for video content

### Screen Reader Support
- [ ] Images have descriptive alt text (decorative images: alt="")
- [ ] Form errors associated with inputs (aria-describedby)
- [ ] Status updates announced (aria-live regions)
- [ ] Expanding content has proper aria attributes
- [ ] Custom components have ARIA roles

## Anti-Patterns

### Security Anti-Patterns
- ❌ "SQL injection won't happen with parameterized queries" - always verify
- ❌ "This is internal-only, security not critical" - assume breach
- ❌ Hardcoding credentials for "testing" (will land in production)
- ❌ Trusting client-side validation only
- ❌ Returning detailed error messages to untrusted clients

### Performance Anti-Patterns
- ❌ Premature optimization without measurement
- ❌ Caching everything (cache invalidation is hard)
- ❌ Micro-optimizations that hurt readability
- ❌ Ignoring the network as the bottleneck

### Accessibility Anti-Patterns
- ❌ "Accessible is ugly" - design better, don't compromise
- ❌ Manual testing only (screen readers vary)
- ❌ Skipping labels because "it's obvious"
- ❌ Color-critical information without text equivalents

## Code Review Questions

When reviewing code, ask:

1. **Security**: "What happens if a malicious user exploits this?"
2. **Performance**: "How does this scale to 100x current usage?"
3. **Accessibility**: "Can someone use this without a mouse/vision?"
4. **Maintainability**: "Will the next person understand this quickly?"

## Reporting Format

When issues are found, structure the report:

```
### 🔴 Critical (Fix Immediately)
- **Issue**: [Description]
- **Impact**: [What can happen]
- **Location**: [File:Line]
- **Fix**: [Concrete steps]

### 🟡 High Priority
- **Issue**: [Description]
- **Impact**: [What can happen]
- **Location**: [File:Line]
- **Fix**: [Concrete steps]

### 🟢 Medium Priority
- **Issue**: [Description]
- **Impact**: [What can happen]
- **Location**: [File:Line]
- **Fix**: [Concrete steps]

### 🔵 Low Priority / Nice-to-Have
- **Issue**: [Description]
- **Impact**: [What can happen]
- **Location**: [File:Line]
- **Fix**: [Concrete steps]
```

## Tools & Commands

### Security Scanning
```bash
# Dependencies
npm audit
pip-audit

# Static analysis
semgrep --config auto
snyk test

# Environment
# Check for secrets in code
grep -r "password\|secret\|api_key\|token" --include="*.ts" --include="*.js" --include="*.py"
```

### Performance Testing
```bash
# Frontend bundle analysis
npm run analyze  # or webpack-bundle-analyzer

# Lighthouse
npx lighthouse https://your-site.com

# Database queries
EXPLAIN ANALYZE [query]
```

### Accessibility Testing
```bash
# Automated audit
npx pa11y https://your-site.com

# Lighthouse accessibility
npx lighthouse --view https://your-site.com --only-categories=accessibility

# Axe DevTools (browser extension)
```

## After Review

1. Prioritize issues by severity (Critical > High > Medium > Low)
2. Propose concrete fixes with code examples
3. Verify fixes address root cause, not symptoms
4. Recommend automated tests to prevent regressions
5. Document security/performance decisions for team
