import { http, HttpResponse } from 'msw';

// API testing utilities
export const createApiHandler = (
  method: 'get' | 'post' | 'put' | 'delete',
  path: string,
  response: unknown,
  status = 200,
) => {
  return http[method](path, () => {
    return HttpResponse.json(response, { status });
  });
};

export const createErrorHandler = (
  method: 'get' | 'post' | 'put' | 'delete',
  path: string,
  error: string,
  status = 500,
) => {
  return http[method](path, () => {
    return HttpResponse.json({ error }, { status });
  });
};

// Database test utilities
export const resetDatabase = async () => {
  // This would be implemented based on your database setup
  // For now, it's a placeholder for future database testing
  console.log('Database reset for testing');
};

export const seedTestData = async () => {
  // This would be implemented to seed test data
  console.log('Test data seeded');
};

// Test containers helper (placeholder for future implementation)
export const startTestDatabase = async () => {
  // This would start a test database container
  console.log('Test database container started');
  return {
    connectionString: 'postgresql://test:test@localhost:5433/test_db',
    stop: async () => {
      console.log('Test database container stopped');
    },
  };
};

// API response helpers
export const createSuccessResponse = <T>(data: T) => ({
  success: true,
  data,
  message: 'Operation successful',
});

export const createErrorResponse = (message: string, code?: string) => ({
  success: false,
  error: { message, code },
  data: null,
});

// Swiss-specific API helpers
export const createSwissValidationError = (field: string, message: string) => ({
  success: false,
  error: {
    type: 'validation_error',
    field,
    message,
    code: 'CH_VALIDATION_FAILED',
  },
});
