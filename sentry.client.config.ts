import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Release tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

  // Environment
  environment: process.env.NODE_ENV || 'development',

  // Integrations
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
    Sentry.browserTracingIntegration(),
  ],

  // Filtering
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    // Random network errors
    'Network request failed',
    'NetworkError',
    'Failed to fetch',
    // Resize observer errors
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
    // Non-error throws
    'Non-Error promise rejection captured',
  ],

  // Before send hook for additional filtering
  beforeSend(event, hint) {
    // Filter out events from browser extensions
    if (event.request?.url?.includes('extension://')) {
      return null;
    }

    // Filter out events from development
    if (process.env.NODE_ENV === 'development' && !process.env.FORCE_SENTRY) {
      console.log('Sentry event suppressed in development:', event);
      return null;
    }

    return event;
  },

  // Breadcrumbs configuration
  beforeBreadcrumb(breadcrumb, hint) {
    // Filter out noisy breadcrumbs
    if (breadcrumb.category === 'console' && breadcrumb.level === 'debug') {
      return null;
    }

    return breadcrumb;
  },
});
