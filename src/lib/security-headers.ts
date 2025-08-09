import type { NextRequest } from 'next/server';

// Content Security Policy for Swiss compliance
const generateCSP = () => {
  const policy = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      'https://*.vercel-scripts.com',
      'https://*.supabase.co',
      'https://*.sentry.io',
    ],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'img-src': ["'self'", 'data:', 'blob:', 'https://*.supabase.co'],
    'connect-src': [
      "'self'",
      'https://*.supabase.co',
      'https://*.sentry.io',
      'wss://*.supabase.co',
    ],
    'frame-src': ["'self'", 'https://*.stripe.com'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': [],
  };

  return Object.entries(policy)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
};

// Security headers configuration
export const securityHeaders = {
  // Content Security Policy
  'Content-Security-Policy': generateCSP(),

  // Prevent clickjacking
  'X-Frame-Options': 'DENY',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Enable XSS protection
  'X-XSS-Protection': '1; mode=block',

  // Force HTTPS
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

  // Referrer policy for privacy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions policy
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',

  // CORS headers for API
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'https://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',

  // Swiss compliance headers
  'X-Powered-By': '', // Remove to prevent fingerprinting
  'X-DNS-Prefetch-Control': 'on',
  'X-Download-Options': 'noopen',
  'X-Permitted-Cross-Domain-Policies': 'none',
};

// Apply security headers to response
export function applySecurityHeaders(request: NextRequest, headers: Headers) {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (value) headers.set(key, value);
  });

  // Add request ID for audit logging
  const requestId = crypto.randomUUID();
  headers.set('X-Request-ID', requestId);

  // Add timestamp for audit trail
  headers.set('X-Response-Time', new Date().toISOString());

  return headers;
}