import { faker } from '@faker-js/faker';

export interface MockCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  drivingLicenseNumber: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const createMockCustomer = (overrides?: Partial<MockCustomer>): MockCustomer => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    phone: `+41 ${faker.string.numeric(2)} ${faker.string.numeric(3)} ${faker.string.numeric(2)} ${faker.string.numeric(2)}`, // Swiss format
    dateOfBirth: faker.date
      .birthdate({ min: 18, max: 80, mode: 'age' })
      .toISOString()
      .split('T')[0],
    drivingLicenseNumber: `CH-${faker.string.numeric(8)}`, // Swiss license format
    address: {
      street: `${faker.location.streetAddress()} ${faker.location.secondaryAddress()}`,
      city: faker.helpers.arrayElement([
        'Zürich',
        'Geneva',
        'Basel',
        'Bern',
        'Lausanne',
        'Winterthur',
      ]),
      postalCode: faker.location.zipCode('####'),
      country: 'Switzerland',
    },
    createdAt: faker.date.recent().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...overrides,
  };
};

export const createMockCustomers = (
  count: number,
  overrides?: Partial<MockCustomer>,
): MockCustomer[] => {
  return Array.from({ length: count }, () => createMockCustomer(overrides));
};
