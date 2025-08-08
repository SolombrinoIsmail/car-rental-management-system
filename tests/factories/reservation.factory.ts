import { faker } from '@faker-js/faker';
import { createMockVehicle, type MockVehicle } from './vehicle.factory';
import { createMockCustomer, type MockCustomer } from './customer.factory';

export interface MockReservation {
  id: string;
  vehicleId: string;
  customerId: string;
  vehicle?: MockVehicle;
  customer?: MockCustomer;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  totalPrice: number;
  currency: 'CHF';
  pickupLocation: string;
  returnLocation: string;
  additionalServices: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const createMockReservation = (overrides?: Partial<MockReservation>): MockReservation => {
  const startDate = faker.date.future();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + faker.number.int({ min: 1, max: 14 }));

  const statuses: MockReservation['status'][] = [
    'pending',
    'confirmed',
    'active',
    'completed',
    'cancelled',
  ];
  const locations = [
    'Zürich Airport',
    'Zürich HB',
    'Geneva Airport',
    'Basel Airport',
    'Bern Center',
  ];
  const services = [
    'GPS Navigation',
    'Child Seat',
    'Additional Driver',
    'Full Insurance',
    'Winter Tires',
  ];

  return {
    id: faker.string.uuid(),
    vehicleId: faker.string.uuid(),
    customerId: faker.string.uuid(),
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    status: faker.helpers.arrayElement(statuses),
    totalPrice: Number(faker.commerce.price({ min: 100, max: 2000, dec: 0 })),
    currency: 'CHF',
    pickupLocation: faker.helpers.arrayElement(locations),
    returnLocation: faker.helpers.arrayElement(locations),
    additionalServices: faker.helpers.arrayElements(services, { min: 0, max: 3 }),
    notes: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
    createdAt: faker.date.recent().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...overrides,
  };
};

export const createMockReservationWithRelations = (
  overrides?: Partial<MockReservation>,
): MockReservation => {
  const reservation = createMockReservation(overrides);

  return {
    ...reservation,
    vehicle: createMockVehicle({ id: reservation.vehicleId }),
    customer: createMockCustomer({ id: reservation.customerId }),
  };
};

export const createMockReservations = (
  count: number,
  overrides?: Partial<MockReservation>,
): MockReservation[] => {
  return Array.from({ length: count }, () => createMockReservation(overrides));
};
