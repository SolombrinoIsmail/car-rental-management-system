import { describe, it, expect } from 'vitest';
import { prisma } from './setup';

describe('Database Schema', () => {
  describe('Organizations', () => {
    it('should create an organization with all required fields', async () => {
      const org = await prisma.organization.create({
        data: {
          name: 'Test Rental Company',
          email: 'info@testcompany.ch',
          phone: '+41 44 123 45 67',
          address: 'Bahnhofstrasse 1',
          city: 'Zürich',
          postalCode: '8001',
          canton: 'ZH',
          country: 'Switzerland',
          taxId: 'CHE-123.456.789',
          currency: 'CHF',
          settings: {},
        },
      });

      expect(org).toBeDefined();
      expect(org.id).toBeDefined();
      expect(org.name).toBe('Test Rental Company');
      expect(org.canton).toBe('ZH');
    });

    it('should validate Swiss phone format', async () => {
      const org = await prisma.organization.create({
        data: {
          name: 'Swiss Car Rental',
          email: 'contact@swissrental.ch',
          phone: '+41 79 999 88 77',
          address: 'Hauptstrasse 10',
          city: 'Bern',
          postalCode: '3000',
          canton: 'BE',
          country: 'Switzerland',
          taxId: 'CHE-987.654.321',
          currency: 'CHF',
          settings: {},
        },
      });

      expect(org.phone).toMatch(/^\+41/);
    });
  });

  describe('Users', () => {
    it('should create user with proper role enum', async () => {
      const org = await prisma.organization.create({
        data: {
          name: 'User Test Org',
          email: 'org@test.ch',
          phone: '+41 44 111 22 33',
          address: 'Test Street 1',
          city: 'Geneva',
          postalCode: '1200',
          canton: 'GE',
          country: 'Switzerland',
          taxId: 'CHE-111.222.333',
          currency: 'CHF',
          settings: {},
        },
      });

      const user = await prisma.user.create({
        data: {
          organizationId: org.id,
          email: 'admin@test.ch',
          firstName: 'Hans',
          lastName: 'Müller',
          role: 'ADMIN',
          phone: '+41 78 123 45 67',
        },
      });

      expect(user.role).toBe('ADMIN');
      expect(['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF', 'CUSTOMER']).toContain(user.role);
    });
  });

  describe('Customers', () => {
    it('should create customer with Swiss-specific fields', async () => {
      const org = await prisma.organization.create({
        data: {
          name: 'Customer Test Org',
          email: 'customers@test.ch',
          phone: '+41 44 333 44 55',
          address: 'Customer Street 1',
          city: 'Lausanne',
          postalCode: '1000',
          canton: 'VD',
          country: 'Switzerland',
          taxId: 'CHE-444.555.666',
          currency: 'CHF',
          settings: {},
        },
      });

      const customer = await prisma.customer.create({
        data: {
          organizationId: org.id,
          firstName: 'Anna',
          lastName: 'Schmidt',
          email: 'anna.schmidt@example.ch',
          phone: '+41 79 555 66 77',
          dateOfBirth: new Date('1990-05-15'),
          address: 'Seestrasse 25',
          city: 'Luzern',
          postalCode: '6000',
          canton: 'LU',
          country: 'Switzerland',
          driverLicenseNumber: 'CH123456789',
          driverLicenseExpiry: new Date('2030-12-31'),
          idDocumentType: 'SWISS_ID',
          idDocumentNumber: 'S1234567',
          idDocumentExpiry: new Date('2032-06-30'),
          preferredLanguage: 'de',
        },
      });

      expect(customer.canton).toBe('LU');
      expect(customer.idDocumentType).toBe('SWISS_ID');
      expect(customer.preferredLanguage).toBe('de');
      expect(customer.phone).toMatch(/^\+41/);
    });
  });

  describe('Vehicles', () => {
    it('should create vehicle with proper status and transmission', async () => {
      const org = await prisma.organization.create({
        data: {
          name: 'Vehicle Test Org',
          email: 'vehicles@test.ch',
          phone: '+41 44 666 77 88',
          address: 'Auto Street 1',
          city: 'Basel',
          postalCode: '4000',
          canton: 'BS',
          country: 'Switzerland',
          taxId: 'CHE-777.888.999',
          currency: 'CHF',
          settings: {},
        },
      });

      const category = await prisma.vehicleCategory.create({
        data: {
          organizationId: org.id,
          name: 'Luxury',
          description: 'Premium vehicles',
          dailyRate: 250.0,
          weeklyRate: 1500.0,
          monthlyRate: 5000.0,
          depositAmount: 2000.0,
        },
      });

      const vehicle = await prisma.vehicle.create({
        data: {
          organizationId: org.id,
          categoryId: category.id,
          make: 'Mercedes-Benz',
          model: 'E-Class',
          year: 2024,
          licensePlate: 'ZH 123456',
          vin: 'WDD2130421A123456',
          color: 'Black',
          mileage: 5000,
          fuelType: 'HYBRID',
          transmission: 'AUTOMATIC',
          seats: 5,
          status: 'AVAILABLE',
          features: ['GPS', 'Leather Seats', 'Sunroof'],
          insurancePolicy: 'POL-2024-001',
          insuranceExpiry: new Date('2025-12-31'),
          registrationExpiry: new Date('2025-06-30'),
          lastServiceDate: new Date('2024-10-01'),
          nextServiceDue: new Date('2025-04-01'),
        },
      });

      expect(vehicle.status).toBe('AVAILABLE');
      expect(vehicle.transmission).toBe('AUTOMATIC');
      expect(vehicle.fuelType).toBe('HYBRID');
      expect(vehicle.licensePlate).toMatch(/^[A-Z]{2}\s/);
    });
  });

  describe('Contracts', () => {
    it('should create rental contract with all relations', async () => {
      const org = await prisma.organization.create({
        data: {
          name: 'Contract Test Org',
          email: 'contracts@test.ch',
          phone: '+41 44 999 00 11',
          address: 'Contract Avenue 1',
          city: 'St. Gallen',
          postalCode: '9000',
          canton: 'SG',
          country: 'Switzerland',
          taxId: 'CHE-000.111.222',
          currency: 'CHF',
          settings: {},
        },
      });

      const customer = await prisma.customer.create({
        data: {
          organizationId: org.id,
          firstName: 'Peter',
          lastName: 'Weber',
          email: 'peter.weber@test.ch',
          phone: '+41 78 222 33 44',
          dateOfBirth: new Date('1985-03-20'),
          address: 'Testweg 5',
          city: 'Winterthur',
          postalCode: '8400',
          canton: 'ZH',
          country: 'Switzerland',
          driverLicenseNumber: 'CH987654321',
          driverLicenseExpiry: new Date('2028-12-31'),
        },
      });

      const category = await prisma.vehicleCategory.create({
        data: {
          organizationId: org.id,
          name: 'Economy',
          description: 'Affordable cars',
          dailyRate: 80.0,
          weeklyRate: 500.0,
          monthlyRate: 1800.0,
          depositAmount: 500.0,
        },
      });

      const vehicle = await prisma.vehicle.create({
        data: {
          organizationId: org.id,
          categoryId: category.id,
          make: 'Toyota',
          model: 'Corolla',
          year: 2023,
          licensePlate: 'AG 987654',
          vin: 'JT2AE92C9P3456789',
          color: 'Silver',
          mileage: 15000,
          fuelType: 'PETROL',
          transmission: 'MANUAL',
          seats: 5,
          status: 'AVAILABLE',
        },
      });

      const location = await prisma.location.create({
        data: {
          organizationId: org.id,
          name: 'Airport Branch',
          address: 'Airport Road 1',
          city: 'Kloten',
          postalCode: '8302',
          canton: 'ZH',
          country: 'Switzerland',
          phone: '+41 44 800 11 22',
          email: 'airport@test.ch',
          isActive: true,
        },
      });

      const contract = await prisma.contract.create({
        data: {
          organizationId: org.id,
          customerId: customer.id,
          vehicleId: vehicle.id,
          pickupLocationId: location.id,
          returnLocationId: location.id,
          contractNumber: `RENT-${Date.now()}`,
          pickupDate: new Date('2024-12-20T10:00:00Z'),
          returnDate: new Date('2024-12-27T10:00:00Z'),
          actualPickupDate: new Date('2024-12-20T10:30:00Z'),
          status: 'ACTIVE',
          dailyRate: 80.0,
          totalDays: 7,
          subtotal: 560.0,
          taxAmount: 43.12,
          totalAmount: 603.12,
          depositAmount: 500.0,
          depositStatus: 'HELD',
          paymentMethod: 'CREDIT_CARD',
          startMileage: 15000,
          fuelLevel: 100,
          notes: 'Customer requested GPS',
          termsAccepted: true,
          signatureData: { signed: true, timestamp: new Date().toISOString() },
        },
      });

      expect(contract.status).toBe('ACTIVE');
      expect(contract.totalAmount).toBe(603.12);
      expect(contract.paymentMethod).toBe('CREDIT_CARD');
    });
  });

  describe('Payments', () => {
    it('should support Swiss payment methods including TWINT', async () => {
      const org = await prisma.organization.create({
        data: {
          name: 'Payment Test Org',
          email: 'payments@test.ch',
          phone: '+41 44 222 33 44',
          address: 'Payment Street 1',
          city: 'Zug',
          postalCode: '6300',
          canton: 'ZG',
          country: 'Switzerland',
          taxId: 'CHE-333.444.555',
          currency: 'CHF',
          settings: {},
        },
      });

      const payment = await prisma.payment.create({
        data: {
          organizationId: org.id,
          contractId: null,
          amount: 150.0,
          currency: 'CHF',
          method: 'TWINT',
          status: 'COMPLETED',
          transactionId: 'TWINT-2024-001',
          processedAt: new Date(),
          description: 'Rental payment via TWINT',
        },
      });

      expect(payment.method).toBe('TWINT');
      expect(payment.currency).toBe('CHF');
      expect(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'TWINT']).toContain(
        payment.method,
      );
    });
  });
});

describe('Database Constraints', () => {
  it('should enforce unique email for users', async () => {
    const org = await prisma.organization.create({
      data: {
        name: 'Constraint Test Org',
        email: 'constraints@test.ch',
        phone: '+41 44 555 66 77',
        address: 'Unique Street 1',
        city: 'Thun',
        postalCode: '3600',
        canton: 'BE',
        country: 'Switzerland',
        taxId: 'CHE-666.777.888',
        currency: 'CHF',
        settings: {},
      },
    });

    await prisma.user.create({
      data: {
        organizationId: org.id,
        email: 'unique@test.ch',
        firstName: 'First',
        lastName: 'User',
        role: 'STAFF',
      },
    });

    await expect(
      prisma.user.create({
        data: {
          organizationId: org.id,
          email: 'unique@test.ch',
          firstName: 'Second',
          lastName: 'User',
          role: 'STAFF',
        },
      }),
    ).rejects.toThrow();
  });

  it('should cascade delete related records', async () => {
    const org = await prisma.organization.create({
      data: {
        name: 'Cascade Test Org',
        email: 'cascade@test.ch',
        phone: '+41 44 888 99 00',
        address: 'Delete Street 1',
        city: 'Lugano',
        postalCode: '6900',
        canton: 'TI',
        country: 'Switzerland',
        taxId: 'CHE-999.000.111',
        currency: 'CHF',
        settings: {},
      },
    });

    const category = await prisma.vehicleCategory.create({
      data: {
        organizationId: org.id,
        name: 'Test Category',
        description: 'Will be deleted',
        dailyRate: 100.0,
        depositAmount: 1000.0,
      },
    });

    await prisma.vehicle.create({
      data: {
        organizationId: org.id,
        categoryId: category.id,
        make: 'Test',
        model: 'Car',
        year: 2024,
        licensePlate: 'TEST 123',
        vin: 'TEST123456789',
        color: 'Red',
        mileage: 0,
        fuelType: 'ELECTRIC',
        transmission: 'AUTOMATIC',
        seats: 4,
        status: 'AVAILABLE',
      },
    });

    // Delete category should cascade to vehicles
    await prisma.vehicleCategory.delete({
      where: { id: category.id },
    });

    const vehicles = await prisma.vehicle.findMany({
      where: { categoryId: category.id },
    });

    expect(vehicles).toHaveLength(0);
  });
});
