import { z } from 'zod';

// Environment variable validation schema
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Database
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),

  // Authentication
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),

  // API
  NEXT_PUBLIC_API_URL: z.string().url(),
  API_SECRET_KEY: z.string().min(32),

  // Email
  EMAIL_SERVER_HOST: z.string().optional(),
  EMAIL_SERVER_PORT: z.string().transform(Number).optional(),
  EMAIL_SERVER_USER: z.string().optional(),
  EMAIL_SERVER_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  // Payment
  PAYMENT_PROVIDER: z.enum(['stripe', 'twint', 'postfinance']).optional(),
  STRIPE_PUBLIC_KEY: z.string().startsWith('pk_').optional(),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_').optional(),

  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_ENVIRONMENT: z.enum(['development', 'staging', 'production']).optional(),

  // Swiss Compliance
  SWISS_VAT_RATE: z.string().transform(Number).default('0.081'),
  CURRENCY: z.enum(['CHF', 'EUR']).default('CHF'),
  TIMEZONE: z.string().default('Europe/Zurich'),

  // Feature Flags
  ENABLE_SSO: z.string().transform(val => val === 'true').default('false'),
  ENABLE_MULTI_LANGUAGE: z.string().transform(val => val === 'true').default('true'),
  DEFAULT_LANGUAGE: z.enum(['de-CH', 'fr-CH', 'it-CH', 'en-CH']).default('de-CH'),

  // Security
  ENCRYPTION_KEY: z.string().min(32).optional(),
  JWT_SECRET: z.string().min(32).optional(),
  CSRF_SECRET: z.string().min(32).optional(),
});

type EnvType = z.infer<typeof envSchema>;

// Validate and parse environment variables
function validateEnv(): EnvType {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(e => e.path.join('.')).join(', ');
      throw new Error(`Environment validation failed. Missing or invalid variables: ${missingVars}`);
    }
    throw error;
  }
}

// Export validated environment variables
export const env = validateEnv();

// Security checks for production
if (env.NODE_ENV === 'production') {
  // Ensure all security keys are set
  if (!env.ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY is required in production');
  }
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required in production');
  }
  if (!env.CSRF_SECRET) {
    throw new Error('CSRF_SECRET is required in production');
  }

  // Ensure secure URLs
  if (!env.NEXTAUTH_URL.startsWith('https://')) {
    throw new Error('NEXTAUTH_URL must use HTTPS in production');
  }
  if (!env.NEXT_PUBLIC_API_URL.startsWith('https://')) {
    throw new Error('API_URL must use HTTPS in production');
  }
}

// Export typed environment for autocomplete
export type Environment = EnvType;