# MCP Integration Guide

## Overview

Model Context Protocol (MCP) integration provides secure, standardized communication between the application and external services. This guide covers authentication, error handling, data transformation, and monitoring patterns.

## Connection Architecture

### Server Registry
- **claude-flow**: Swarm orchestration and neural processing
- **ruv-swarm**: Fault-tolerant swarm management
- **sentry**: Error monitoring and performance tracking
- **vercel**: Deployment automation
- **linear**: Project management integration
- **supabase**: Backend services
- **notion**: Documentation and workspace management

### Authentication Patterns

```javascript
// Secure token management
const mcpAuth = {
  validateToken: (token) => {
    // Implement token validation
    return token && token.length > 0 && !token.includes('expired');
  },
  
  refreshToken: async (server) => {
    // Auto-refresh tokens before expiry
    const newToken = await server.auth.refresh();
    return newToken;
  },
  
  handleAuthFailure: (error, server) => {
    // Graceful auth failure handling
    console.error(`Auth failed for ${server}: ${error.message}`);
    return { retry: true, backoff: 5000 };
  }
};
```

## Error Handling Strategies

### Circuit Breaker Pattern
```javascript
class MCPCircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.threshold = threshold;
    this.timeout = timeout;
    this.failures = 0;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = null;
  }

  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failures++;
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}
```

### Retry with Exponential Backoff
```javascript
const retryWithBackoff = async (operation, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      const backoffMs = Math.min(1000 * Math.pow(2, attempt), 30000);
      await new Promise(resolve => setTimeout(resolve, backoffMs));
    }
  }
};
```

## Data Transformation Pipelines

### Input Validation
```javascript
const validateMCPInput = (data, schema) => {
  const errors = [];
  
  for (const [key, rules] of Object.entries(schema)) {
    const value = data[key];
    
    if (rules.required && (value === undefined || value === null)) {
      errors.push(`${key} is required`);
    }
    
    if (value !== undefined && rules.type && typeof value !== rules.type) {
      errors.push(`${key} must be of type ${rules.type}`);
    }
    
    if (rules.validate && !rules.validate(value)) {
      errors.push(`${key} validation failed`);
    }
  }
  
  return errors.length === 0 ? null : errors;
};
```

### Response Transformation
```javascript
const transformMCPResponse = (response, mapping) => {
  const transformed = {};
  
  for (const [sourceKey, targetKey] of Object.entries(mapping)) {
    const value = getNestedValue(response, sourceKey);
    if (value !== undefined) {
      setNestedValue(transformed, targetKey, value);
    }
  }
  
  return transformed;
};

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
};
```

## Monitoring and Logging

### Performance Tracking
```javascript
class MCPPerformanceTracker {
  constructor() {
    this.metrics = new Map();
  }

  startOperation(operationId, serverName) {
    this.metrics.set(operationId, {
      server: serverName,
      startTime: Date.now(),
      endTime: null,
      duration: null,
      success: null,
      error: null
    });
  }

  endOperation(operationId, success = true, error = null) {
    const metric = this.metrics.get(operationId);
    if (metric) {
      metric.endTime = Date.now();
      metric.duration = metric.endTime - metric.startTime;
      metric.success = success;
      metric.error = error;
    }
  }

  getMetrics(serverName = null) {
    const allMetrics = Array.from(this.metrics.values());
    return serverName 
      ? allMetrics.filter(m => m.server === serverName)
      : allMetrics;
  }

  getAverageResponseTime(serverName) {
    const metrics = this.getMetrics(serverName);
    const durations = metrics.map(m => m.duration).filter(d => d !== null);
    return durations.length > 0 
      ? durations.reduce((sum, d) => sum + d, 0) / durations.length 
      : 0;
  }
}
```

### Structured Logging
```javascript
const createMCPLogger = (serverName) => ({
  info: (message, data = {}) => {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      server: serverName,
      message,
      ...data
    }));
  },
  
  error: (message, error = {}) => {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      server: serverName,
      message,
      error: error.message || error,
      stack: error.stack
    }));
  },
  
  debug: (message, data = {}) => {
    if (process.env.MCP_DEBUG === 'true') {
      console.debug(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'DEBUG',
        server: serverName,
        message,
        ...data
      }));
    }
  }
});
```

## Security Best Practices

### Credential Management
- Never hardcode API keys or tokens
- Use environment variables or secure vaults
- Implement automatic token rotation
- Monitor for credential exposure in logs

### Request Sanitization
```javascript
const sanitizeRequest = (data) => {
  const sanitized = { ...data };
  
  // Remove sensitive fields
  const sensitiveFields = ['password', 'token', 'secret', 'key'];
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
};
```

### Rate Limiting
```javascript
class MCPRateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(clientId) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(clientId)) {
      this.requests.set(clientId, []);
    }
    
    const clientRequests = this.requests.get(clientId);
    
    // Remove old requests
    while (clientRequests.length > 0 && clientRequests[0] < windowStart) {
      clientRequests.shift();
    }
    
    if (clientRequests.length >= this.maxRequests) {
      return false;
    }
    
    clientRequests.push(now);
    return true;
  }
}
```

## Integration Examples

### Sentry Error Monitoring
```javascript
const integrateErrorMonitoring = async () => {
  try {
    const issues = await mcp.sentry.searchIssues({
      organizationSlug: 'my-org',
      naturalLanguageQuery: 'critical errors from last 24 hours'
    });
    
    return transformMCPResponse(issues, {
      'nodes.*.title': 'errorTitle',
      'nodes.*.status': 'errorStatus',
      'nodes.*.userCount': 'affectedUsers'
    });
  } catch (error) {
    mcpLogger.error('Failed to fetch error data', error);
    throw error;
  }
};
```

### Linear Project Sync
```javascript
const syncProjectData = async () => {
  try {
    const issues = await mcp.linear.listIssues({
      teamId: 'team-uuid',
      limit: 50
    });
    
    const transformed = issues.nodes.map(issue => ({
      id: issue.id,
      title: issue.title,
      status: issue.state.name,
      assignee: issue.assignee?.name,
      priority: issue.priority
    }));
    
    return transformed;
  } catch (error) {
    mcpLogger.error('Project sync failed', error);
    return [];
  }
};
```

### Supabase Data Operations
```javascript
const performDataOperation = async (operation, data) => {
  const circuitBreaker = new MCPCircuitBreaker();
  
  return circuitBreaker.execute(async () => {
    switch (operation) {
      case 'query':
        return await mcp.supabase.executeSQL({
          projectId: 'project-id',
          query: data.query
        });
      
      case 'migrate':
        return await mcp.supabase.applyMigration({
          projectId: 'project-id',
          name: data.name,
          query: data.query
        });
      
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  });
};
```

## Configuration Management

### Environment Setup
```bash
# MCP server configuration
export MCP_SENTRY_TOKEN="your-sentry-token"
export MCP_LINEAR_API_KEY="your-linear-key"
export MCP_SUPABASE_ACCESS_TOKEN="your-supabase-token"
export MCP_DEBUG="false"
export MCP_RATE_LIMIT_MAX="1000"
export MCP_RATE_LIMIT_WINDOW="60000"
```

### Dynamic Configuration
```javascript
const mcpConfig = {
  servers: {
    sentry: {
      timeout: 30000,
      retries: 3,
      circuitBreaker: { threshold: 5, timeout: 60000 }
    },
    linear: {
      timeout: 15000,
      retries: 2,
      circuitBreaker: { threshold: 3, timeout: 30000 }
    },
    supabase: {
      timeout: 45000,
      retries: 3,
      circuitBreaker: { threshold: 5, timeout: 120000 }
    }
  },
  
  rateLimiting: {
    global: { maxRequests: 1000, windowMs: 60000 },
    perServer: { maxRequests: 100, windowMs: 60000 }
  },
  
  security: {
    sanitizeRequests: true,
    sanitizeResponses: true,
    enableAuditLogging: true
  }
};
```

This guide provides a comprehensive foundation for secure, reliable MCP integration with proper error handling, monitoring, and performance optimization.