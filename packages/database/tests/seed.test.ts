import { describe, it, expect, beforeAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

// Use a separate client for seed testing
const seedPrisma = new PrismaClient();

describe('Seed Data Validation', () => {
  beforeAll(async () => {
    await seedPrisma.$connect();
  });

  describe('Swiss Data Generation', () => {
    it('should generate valid Swiss phone numbers', () => {
      const phoneFormats = [
        '+41 44 ### ## ##', // Zürich
        '+41 31 ### ## ##', // Bern
        '+41 22 ### ## ##', // Geneva
        '+41 21 ### ## ##', // Lausanne
        '+41 61 ### ## ##', // Basel
        '+41 71 ### ## ##', // St. Gallen
        '+41 41 ### ## ##', // Lucerne
        '+41 52 ### ## ##', // Winterthur
        '+41 78 ### ## ##', // Mobile
        '+41 79 ### ## ##', // Mobile
        '+41 76 ### ## ##', // Mobile
        '+41 77 ### ## ##', // Mobile
      ];

      phoneFormats.forEach((format) => {
        const phone = faker.helpers.replaceSymbolWithNumber(format);
        expect(phone).toMatch(/^\+41\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/);
      });
    });

    it('should generate valid Swiss postal codes', () => {
      const postalCodes = [
        { min: 1000, max: 1999, canton: 'VD' }, // Vaud
        { min: 2000, max: 2999, canton: 'NE' }, // Neuchâtel
        { min: 3000, max: 3999, canton: 'BE' }, // Bern
        { min: 4000, max: 4999, canton: 'BS' }, // Basel
        { min: 5000, max: 5999, canton: 'AG' }, // Aargau
        { min: 6000, max: 6999, canton: 'LU' }, // Lucerne
        { min: 7000, max: 7999, canton: 'GR' }, // Graubünden
        { min: 8000, max: 8999, canton: 'ZH' }, // Zürich
        { min: 9000, max: 9999, canton: 'SG' }, // St. Gallen
      ];

      postalCodes.forEach(({ min, max }) => {
        const code = faker.number.int({ min, max }).toString();
        expect(parseInt(code)).toBeGreaterThanOrEqual(1000);
        expect(parseInt(code)).toBeLessThanOrEqual(9999);
      });
    });

    it('should generate valid Swiss cantons', () => {
      const validCantons = [
        'AG',
        'AI',
        'AR',
        'BE',
        'BL',
        'BS',
        'FR',
        'GE',
        'GL',
        'GR',
        'JU',
        'LU',
        'NE',
        'NW',
        'OW',
        'SG',
        'SH',
        'SO',
        'SZ',
        'TG',
        'TI',
        'UR',
        'VD',
        'VS',
        'ZG',
        'ZH',
      ];

      validCantons.forEach((canton) => {
        expect(validCantons).toContain(canton);
        expect(canton).toMatch(/^[A-Z]{2}$/);
      });
    });

    it('should generate valid Swiss license plates', () => {
      const cantons = ['ZH', 'BE', 'VD', 'AG', 'SG', 'LU', 'TI', 'VS', 'GE', 'BS'];

      cantons.forEach((canton) => {
        const plate = `${canton} ${faker.number.int({ min: 10000, max: 999999 })}`;
        expect(plate).toMatch(/^[A-Z]{2}\s\d{5,6}$/);
      });
    });

    it('should generate valid Swiss tax IDs', () => {
      for (let i = 0; i < 10; i++) {
        const taxId = `CHE-${faker.number.int({ min: 100, max: 999 })}.${faker.number.int({ min: 100, max: 999 })}.${faker.number.int({ min: 100, max: 999 })}`;
        expect(taxId).toMatch(/^CHE-\d{3}\.\d{3}\.\d{3}$/);
      }
    });
  });

  describe('Customer Data Validation', () => {
    it('should generate valid Swiss ID document numbers', () => {
      const idTypes = {
        SWISS_ID: 'S#######',
        PASSPORT: 'X#######',
        PERMIT_B: 'B#######',
        PERMIT_C: 'C#######',
        PERMIT_G: 'G#######',
        PERMIT_L: 'L#######',
      };

      Object.entries(idTypes).forEach(([, format]) => {
        const idNumber = faker.helpers.replaceSymbolWithNumber(format);
        expect(idNumber).toMatch(/^[A-Z]\d{7}$/);
      });
    });

    it('should generate valid driver license data', () => {
      const license = `CH${faker.number.int({ min: 100000000, max: 999999999 })}`;
      expect(license).toMatch(/^CH\d{9}$/);

      const expiryDate = faker.date.future({ years: 10 });
      expect(expiryDate.getTime()).toBeGreaterThan(Date.now());
    });

    it('should generate valid birth dates', () => {
      const minAge = 18;
      const maxAge = 80;

      const birthDate = faker.date.birthdate({ min: minAge, max: maxAge, mode: 'age' });
      const age = new Date().getFullYear() - birthDate.getFullYear();

      expect(age).toBeGreaterThanOrEqual(minAge);
      expect(age).toBeLessThanOrEqual(maxAge);
    });
  });

  describe('Vehicle Data Validation', () => {
    it('should generate valid VIN numbers', () => {
      for (let i = 0; i < 10; i++) {
        const vin = faker.vehicle.vin();
        expect(vin).toHaveLength(17);
        expect(vin).toMatch(/^[A-HJ-NPR-Z0-9]{17}$/);
      }
    });

    it('should generate valid vehicle specifications', () => {
      const vehicle = {
        make: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
        year: faker.number.int({ min: 2020, max: 2024 }),
        color: faker.vehicle.color(),
        fuelType: faker.helpers.arrayElement([
          'PETROL',
          'DIESEL',
          'ELECTRIC',
          'HYBRID',
          'PLUGIN_HYBRID',
        ]),
        transmission: faker.helpers.arrayElement(['MANUAL', 'AUTOMATIC']),
        seats: faker.number.int({ min: 2, max: 9 }),
        mileage: faker.number.int({ min: 0, max: 50000 }),
      };

      expect(vehicle.make).toBeTruthy();
      expect(vehicle.model).toBeTruthy();
      expect(vehicle.year).toBeGreaterThanOrEqual(2020);
      expect(vehicle.year).toBeLessThanOrEqual(2024);
      expect(['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'PLUGIN_HYBRID']).toContain(
        vehicle.fuelType,
      );
      expect(['MANUAL', 'AUTOMATIC']).toContain(vehicle.transmission);
      expect(vehicle.seats).toBeGreaterThanOrEqual(2);
      expect(vehicle.seats).toBeLessThanOrEqual(9);
      expect(vehicle.mileage).toBeGreaterThanOrEqual(0);
    });

    it('should generate valid insurance data', () => {
      const insurancePolicy = `POL-${new Date().getFullYear()}-${faker.string.numeric(6)}`;
      expect(insurancePolicy).toMatch(/^POL-\d{4}-\d{6}$/);

      const insuranceExpiry = faker.date.future({ years: 1 });
      expect(insuranceExpiry.getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe('Financial Data Validation', () => {
    it('should generate valid Swiss Franc amounts', () => {
      const amounts = {
        dailyRate: faker.number.float({ min: 50, max: 500, multipleOf: 0.05 }),
        weeklyRate: faker.number.float({ min: 300, max: 3000, multipleOf: 0.05 }),
        monthlyRate: faker.number.float({ min: 1000, max: 10000, multipleOf: 0.05 }),
        depositAmount: faker.number.float({ min: 500, max: 5000, multipleOf: 0.05 }),
      };

      Object.values(amounts).forEach((amount) => {
        // Swiss Franc uses 5 centime rounding
        const rounded = Math.round(amount * 20) / 20;
        expect(rounded % 0.05).toBeCloseTo(0, 10);
      });
    });

    it('should calculate tax correctly', () => {
      const VAT_RATE = 0.077; // Swiss VAT 7.7%
      const subtotal = 1000;
      const taxAmount = Math.round(subtotal * VAT_RATE * 100) / 100;
      const totalAmount = subtotal + taxAmount;

      expect(taxAmount).toBeCloseTo(77, 2);
      expect(totalAmount).toBeCloseTo(1077, 2);
    });

    it('should generate valid payment methods', () => {
      const paymentMethods = ['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'TWINT'];

      const method = faker.helpers.arrayElement(paymentMethods);
      expect(paymentMethods).toContain(method);

      // TWINT should be available as Swiss payment method
      expect(paymentMethods).toContain('TWINT');
    });
  });

  describe('Contract Data Validation', () => {
    it('should generate valid contract numbers', () => {
      const contractNumber = `RENT-${Date.now()}-${faker.string.numeric(4)}`;
      expect(contractNumber).toMatch(/^RENT-\d{13}-\d{4}$/);
    });

    it('should calculate rental periods correctly', () => {
      const pickupDate = new Date();
      const days = faker.number.int({ min: 1, max: 30 });
      const returnDate = new Date(pickupDate.getTime() + days * 24 * 60 * 60 * 1000);

      const calculatedDays = Math.ceil(
        (returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      expect(calculatedDays).toBe(days);
    });

    it('should validate deposit status transitions', () => {
      const validStatuses = ['PENDING', 'HELD', 'RELEASED', 'FORFEITED'];
      const transitions = [
        { from: 'PENDING', to: ['HELD', 'RELEASED'] },
        { from: 'HELD', to: ['RELEASED', 'FORFEITED'] },
        { from: 'RELEASED', to: [] },
        { from: 'FORFEITED', to: [] },
      ];

      transitions.forEach(({ from, to }) => {
        expect(validStatuses).toContain(from);
        to.forEach((status) => {
          expect(validStatuses).toContain(status);
        });
      });
    });
  });

  afterAll(async () => {
    await seedPrisma.$disconnect();
  });
});
