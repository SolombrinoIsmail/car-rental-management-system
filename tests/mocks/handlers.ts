import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock API endpoints for testing
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
  }),

  // Mock authentication endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    if (body.email === 'test@example.com' && body.password === 'password') {
      return HttpResponse.json({
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
        token: 'mock-jwt-token',
      });
    }

    return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }),

  // Mock vehicles API
  http.get('/api/vehicles', () => {
    return HttpResponse.json({
      vehicles: [
        { id: '1', brand: 'BMW', model: 'X5', year: 2024, available: true },
        { id: '2', brand: 'Audi', model: 'A4', year: 2024, available: false },
      ],
    });
  }),

  // Mock reservations API
  http.get('/api/reservations', () => {
    return HttpResponse.json({
      reservations: [
        {
          id: '1',
          vehicleId: '1',
          customerId: '1',
          startDate: '2024-01-01',
          endDate: '2024-01-07',
        },
      ],
    });
  }),
];
