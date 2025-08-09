import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { applySecurityHeaders } from './lib/security-headers';
import { auditLogger, AuditEventType, AuditSeverity } from './lib/audit-logger';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100;
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// CSRF token validation
function validateCSRFToken(request: NextRequest): boolean {
  const token = request.headers.get('x-csrf-token');
  const cookieToken = request.cookies.get('csrf-token')?.value;
  
  return token !== null && token === cookieToken;
}

// Rate limiting
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitStore.get(ip);

  if (!limit || now > limit.resetTime) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (limit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  limit.count++;
  return true;
}

// Get client IP
function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') || 
         'unknown';
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const clientIP = getClientIP(request);
  const requestId = crypto.randomUUID();
  
  // Add request ID for tracing
  response.headers.set('x-request-id', requestId);

  // Apply security headers
  applySecurityHeaders(request, response.headers);

  // Rate limiting
  if (!checkRateLimit(clientIP)) {
    await auditLogger.log({
      eventType: AuditEventType.RATE_LIMIT_EXCEEDED,
      action: 'Rate limit exceeded',
      ipAddress: clientIP,
      requestPath: request.nextUrl.pathname,
      severity: AuditSeverity.WARNING,
      result: 'failure',
    });

    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString(),
      },
    });
  }

  // CSRF protection for mutations
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    // Skip CSRF for API routes that use API keys
    const isAPIRoute = request.nextUrl.pathname.startsWith('/api/');
    const hasAPIKey = request.headers.get('x-api-key');

    if (!isAPIRoute || !hasAPIKey) {
      if (!validateCSRFToken(request)) {
        await auditLogger.log({
          eventType: AuditEventType.SECURITY_ALERT,
          action: 'CSRF token validation failed',
          ipAddress: clientIP,
          requestPath: request.nextUrl.pathname,
          requestMethod: request.method,
          severity: AuditSeverity.WARNING,
          result: 'failure',
        });

        return new NextResponse('Forbidden', { status: 403 });
      }
    }
  }

  // Log API access for audit trail
  if (request.nextUrl.pathname.startsWith('/api/')) {
    await auditLogger.log({
      eventType: AuditEventType.DATA_ACCESS,
      action: `API access: ${request.method} ${request.nextUrl.pathname}`,
      ipAddress: clientIP,
      requestId,
      requestPath: request.nextUrl.pathname,
      requestMethod: request.method,
      severity: AuditSeverity.INFO,
      result: 'success',
    });
  }

  // Admin route protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const session = request.cookies.get('session');
    
    if (!session) {
      await auditLogger.log({
        eventType: AuditEventType.PERMISSION_DENIED,
        action: 'Unauthorized admin access attempt',
        ipAddress: clientIP,
        requestPath: request.nextUrl.pathname,
        severity: AuditSeverity.WARNING,
        result: 'failure',
      });

      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Log admin access
    await auditLogger.log({
      eventType: AuditEventType.ADMIN_ACCESS,
      action: `Admin panel access: ${request.nextUrl.pathname}`,
      ipAddress: clientIP,
      requestPath: request.nextUrl.pathname,
      severity: AuditSeverity.INFO,
      result: 'success',
    });
  }

  // Swiss compliance: Language detection and routing
  const acceptLanguage = request.headers.get('accept-language');
  const preferredLanguage = detectSwissLanguage(acceptLanguage);
  
  if (preferredLanguage && !request.nextUrl.pathname.startsWith(`/${preferredLanguage}`)) {
    // Set language cookie for future requests
    response.cookies.set('preferred-language', preferredLanguage, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 365 * 24 * 60 * 60, // 1 year
    });
  }

  // Add security headers for Swiss compliance
  response.headers.set('X-Swiss-Compliance', 'FADP-2023');
  response.headers.set('X-Data-Residency', 'CH-Frankfurt');

  return response;
}

// Detect Swiss language preference
function detectSwissLanguage(acceptLanguage: string | null): string | null {
  if (!acceptLanguage) return null;

  const swissLanguages = ['de-CH', 'fr-CH', 'it-CH', 'rm-CH'];
  const languages = acceptLanguage.split(',').map(lang => lang.trim().split(';')[0]);

  for (const lang of languages) {
    if (swissLanguages.includes(lang)) {
      return lang.split('-')[0]; // Return 'de', 'fr', 'it', or 'rm'
    }
  }

  // Default to German for Swiss users
  if (languages.some(lang => lang.includes('CH'))) {
    return 'de';
  }

  return null;
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};