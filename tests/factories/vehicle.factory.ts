import { faker } from '@faker-js/faker';

export interface MockVehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: 'economy' | 'compact' | 'midsize' | 'luxury' | 'suv';
  pricePerDay: number;
  available: boolean;
  licensePlate: string;
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  transmission: 'manual' | 'automatic';
  seats: number;
  color: string;
}

export const createMockVehicle = (overrides?: Partial<MockVehicle>): MockVehicle => {
  const categories: MockVehicle['category'][] = ['economy', 'compact', 'midsize', 'luxury', 'suv'];
  const fuelTypes: MockVehicle['fuelType'][] = ['petrol', 'diesel', 'electric', 'hybrid'];
  const transmissions: MockVehicle['transmission'][] = ['manual', 'automatic'];

  return {
    id: faker.string.uuid(),
    brand: faker.vehicle.manufacturer(),
    model: faker.vehicle.model(),
    year: faker.date.recent({ days: 365 * 5 }).getFullYear(),
    category: faker.helpers.arrayElement(categories),
    pricePerDay: Number(faker.commerce.price({ min: 50, max: 300, dec: 0 })),
    available: faker.datatype.boolean(),
    licensePlate: `ZH ${faker.vehicle.vrm()}`, // Swiss Zurich format
    fuelType: faker.helpers.arrayElement(fuelTypes),
    transmission: faker.helpers.arrayElement(transmissions),
    seats: faker.helpers.arrayElement([2, 4, 5, 7, 8]),
    color: faker.vehicle.color(),
    ...overrides,
  };
};

export const createMockVehicles = (
  count: number,
  overrides?: Partial<MockVehicle>,
): MockVehicle[] => {
  return Array.from({ length: count }, () => createMockVehicle(overrides));
};
