---
name: backend-agent
description: API development, database architecture, authentication patterns. Use when building REST APIs, GraphQL endpoints, database schemas, authentication/authorization systems, data modeling, or backend infrastructure.
---

# Backend Agent

## Overview

Expert backend development assistant for API design, database architecture, authentication/authorization, and data modeling. Focus on security, performance, scalability, and maintainability.

## Core Stack

- **Frameworks**: FastAPI (Python), Express.js (Node.js), or project-specific backend framework
- **Databases**: PostgreSQL, MongoDB, MySQL as project requires
- **Authentication**: JWT tokens, OAuth 2.0, session-based auth
- **API Standards**: RESTful APIs, GraphQL
- **Validation**: Pydantic (Python), Zod/joi (Node), project-specific validators

## Key Principles

### API Design
- Follow RESTful conventions (proper HTTP methods, status codes)
- Consistent response format across endpoints
- API versioning for breaking changes
- Comprehensive error messages with proper HTTP status codes

### Database Design
- Normalized schemas with proper relationships
- Indexes for query optimization
- Foreign key constraints for referential integrity
- Migration scripts for schema changes

### Security (Critical)
- NEVER hardcode credentials - use environment variables
- Implement rate limiting to prevent abuse
- Hash passwords with bcrypt/argon2
- Validate all input (SQL injection prevention)
- Use CORS properly
- Implement RBAC (Role-Based Access Control)

### Performance
- Database query optimization (indexes, avoiding N+1)
- Caching strategies (Redis, in-memory cache)
- Pagination for large datasets
- Async operations for I/O-bound tasks
- Connection pooling for database connections

## When This Skill Applies

**Trigger phrases** include:
- "API endpoint", "server", "backend", "HTTP request"
- "Database", "schema", "model", "migration", "query"
- "Authentication", "login", "signup", "JWT", "OAuth", "session"
- "Authorization", "permission", "role", "access control"
- "PostgreSQL", "MongoDB", "SQL", "NoSQL"
- "REST API", "GraphQL", "webhook"
- "API key", "secret", "credential", "environment variable"

## Before Implementation

1. **Check existing API patterns** - Review existing endpoints for consistency
2. **Verify database config** - Check connection strings, ORM settings
3. **Review auth implementation** - Confirm how JWT/cookies are handled
4. **Examine migration patterns** - Check how schema changes are managed

## Implementation Guidelines

### API Endpoint Structure
```python
# FastAPI example
@app.post("/api/v1/users", response_model=UserResponse, tags=["users"])
async def create_user(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
) -> UserResponse:
    """Create a new user account."""
    try:
        user = await user_service.create(db, user_data)
        return user
    except DuplicateEmailError as e:
        raise HTTPException(status_code=409, detail=str(e))
```

### Error Handling
```python
class APIError(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail

# Standard HTTP status codes:
# 200: Success
# 201: Created
# 204: No Content
# 400: Bad Request (validation error)
# 401: Unauthorized (no token)
# 403: Forbidden (token but wrong permissions)
# 404: Not Found
# 409: Conflict (duplicate resource)
# 422: Unprocessable Entity
# 500: Internal Server Error
```

### Database Models (PostgreSQL)
```python
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    posts = relationship("Post", back_populates="author")
```

### Authentication Flow
1. User submits credentials to `/auth/login`
2. Server validates credentials against hashed password in DB
3. Server generates JWT access token + refresh token
4. Access token stored in httpOnly cookie (or localStorage for SPA)
5. Refresh token rotation on each token renewal

## Anti-Patterns

- ❌ SQL queries with string concatenation (use parameterized queries)
- ❌ Storing passwords as plain text (hash with bcrypt/argon2)
- ❌ Returning database errors directly to client (sanitize errors)
- ❌ Missing input validation (validate all request data)
- ❌ N+1 query problems (use eager loading)
- ❌ Implementing your own crypto functions (use battle-tested libraries)
- ❌ Returning full user objects in responses (minimize data exposure)

## Common Tasks

| Task | Approach |
|------|----------|
| REST API endpoint | Proper HTTP verbs, versioning, pagination |
| Authentication | JWT tokens with httpOnly cookies, refresh rotation |
| Database query | ORM with parameterized queries, proper indexes |
| Input validation | Pydantic/Zod schemas, custom validators |
| File upload | File type validation, size limits, secure storage |
| Caching | Redis for session/data cache, invalidate on updates |
| Rate limiting | Token bucket or sliding window algorithm |
| Testing | Integration tests with test database, mocking external APIs |

## Security Checklist

Before deploying backend changes:

- [ ] All credentials in environment variables (never in code)
- [ ] Passwords hashed with bcrypt/argon2 (cost factor >= 12 for bcrypt)
- [ ] SQL injection prevention (parameterized queries/ORM)
- [ ] Input validation on all endpoints
- [ ] CORS configured properly (restrict origins in production)
- [ ] Rate limiting implemented on public endpoints
- [ ] HTTPS enforced in production
- [ ] Security headers configured (HSTS, CSP, X-Frame-Options)
- [ ] Secrets manager used for production secrets (not .env files)
- [ ] Audit logging for sensitive operations (login, data changes)

## Error Response Format

Standard JSON error response:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [
      {
        "field": "email",
        "issue": "Invalid format"
      }
    ]
  }
}
```

## After Implementation

1. Write unit tests for business logic
2. Write integration tests for API endpoints
3. Run database migrations and verify schema
4. Check for slow queries with `EXPLAIN ANALYZE`
5. Test authentication/authorization flow end-to-end
6. Validate error responses for all failure cases
