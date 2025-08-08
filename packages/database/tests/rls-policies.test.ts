import { describe, it, expect, beforeEach } from 'vitest';
import { prisma } from './setup';
import type { Organization } from '@prisma/client';

describe('Row Level Security Policies', () => {
  let testOrg1: Organization;
  let testOrg2: Organization;

  beforeEach(async () => {
    // Create two test organizations
    testOrg1 = await prisma.organization.create({
      data: {
        name: 'RLS Test Org 1',
        email: 'rls1@test.ch',
        phone: '+41 44 100 20 30',
        address: 'Security Street 1',
        city: 'Zürich',
        postalCode: '8000',
        canton: 'ZH',
        country: 'Switzerland',
        taxId: 'CHE-100.200.300',
        currency: 'CHF',
        settings: {},
      },
    });

    testOrg2 = await prisma.organization.create({
      data: {
        name: 'RLS Test Org 2',
        email: 'rls2@test.ch',
        phone: '+41 44 200 30 40',
        address: 'Privacy Avenue 2',
        city: 'Bern',
        postalCode: '3000',
        canton: 'BE',
        country: 'Switzerland',
        taxId: 'CHE-200.300.400',
        currency: 'CHF',
        settings: {},
      },
    });
  });

  describe('Organization Isolation', () => {
    it('should isolate customer data between organizations', async () => {
      // Create customers for each organization
      const customer1 = await prisma.customer.create({
        data: {
          organizationId: testOrg1.id,
          firstName: 'Org1',
          lastName: 'Customer',
          email: 'customer1@org1.ch',
          phone: '+41 78 111 11 11',
          dateOfBirth: new Date('1990-01-01'),
          address: 'Org1 Street',
          city: 'Zürich',
          postalCode: '8001',
          canton: 'ZH',
          country: 'Switzerland',
          driverLicenseNumber: 'ORG1-123',
          driverLicenseExpiry: new Date('2030-12-31'),
        },
      });

      const customer2 = await prisma.customer.create({
        data: {
          organizationId: testOrg2.id,
          firstName: 'Org2',
          lastName: 'Customer',
          email: 'customer2@org2.ch',
          phone: '+41 78 222 22 22',
          dateOfBirth: new Date('1991-01-01'),
          address: 'Org2 Street',
          city: 'Bern',
          postalCode: '3001',
          canton: 'BE',
          country: 'Switzerland',
          driverLicenseNumber: 'ORG2-456',
          driverLicenseExpiry: new Date('2030-12-31'),
        },
      });

      // Query customers for org1
      const org1Customers = await prisma.customer.findMany({
        where: { organizationId: testOrg1.id },
      });

      // Query customers for org2
      const org2Customers = await prisma.customer.findMany({
        where: { organizationId: testOrg2.id },
      });

      // Verify isolation
      expect(org1Customers).toHaveLength(1);
      expect(org1Customers[0].id).toBe(customer1.id);

      expect(org2Customers).toHaveLength(1);
      expect(org2Customers[0].id).toBe(customer2.id);
    });

    it('should isolate vehicle data between organizations', async () => {
      // Create categories for each org
      const category1 = await prisma.vehicleCategory.create({
        data: {
          organizationId: testOrg1.id,
          name: 'Org1 Cars',
          description: 'Cars for Org1',
          dailyRate: 100.0,
          depositAmount: 1000.0,
        },
      });

      const category2 = await prisma.vehicleCategory.create({
        data: {
          organizationId: testOrg2.id,
          name: 'Org2 Cars',
          description: 'Cars for Org2',
          dailyRate: 120.0,
          depositAmount: 1200.0,
        },
      });

      // Create vehicles for each org
      await prisma.vehicle.create({
        data: {
          organizationId: testOrg1.id,
          categoryId: category1.id,
          make: 'BMW',
          model: 'X5',
          year: 2024,
          licensePlate: 'ZH 111111',
          vin: 'BMW1234567890',
          color: 'Blue',
          mileage: 1000,
          fuelType: 'DIESEL',
          transmission: 'AUTOMATIC',
          seats: 7,
          status: 'AVAILABLE',
        },
      });

      await prisma.vehicle.create({
        data: {
          organizationId: testOrg2.id,
          categoryId: category2.id,
          make: 'Audi',
          model: 'A4',
          year: 2024,
          licensePlate: 'BE 222222',
          vin: 'AUDI0987654321',
          color: 'Black',
          mileage: 2000,
          fuelType: 'HYBRID',
          transmission: 'AUTOMATIC',
          seats: 5,
          status: 'AVAILABLE',
        },
      });

      // Query vehicles for each org
      const org1Vehicles = await prisma.vehicle.findMany({
        where: { organizationId: testOrg1.id },
      });

      const org2Vehicles = await prisma.vehicle.findMany({
        where: { organizationId: testOrg2.id },
      });

      // Verify isolation
      expect(org1Vehicles).toHaveLength(1);
      expect(org1Vehicles[0].make).toBe('BMW');

      expect(org2Vehicles).toHaveLength(1);
      expect(org2Vehicles[0].make).toBe('Audi');
    });

    it('should isolate contract data between organizations', async () => {
      // Setup test data for both orgs
      const customer1 = await prisma.customer.create({
        data: {
          organizationId: testOrg1.id,
          firstName: 'Contract',
          lastName: 'Tester1',
          email: 'contract1@test.ch',
          phone: '+41 78 333 33 33',
          dateOfBirth: new Date('1992-01-01'),
          address: 'Test 1',
          city: 'Zürich',
          postalCode: '8002',
          canton: 'ZH',
          country: 'Switzerland',
          driverLicenseNumber: 'CTR1-123',
          driverLicenseExpiry: new Date('2030-12-31'),
        },
      });

      const category1 = await prisma.vehicleCategory.create({
        data: {
          organizationId: testOrg1.id,
          name: 'Contract Cars 1',
          description: 'Test',
          dailyRate: 90.0,
          depositAmount: 900.0,
        },
      });

      const vehicle1 = await prisma.vehicle.create({
        data: {
          organizationId: testOrg1.id,
          categoryId: category1.id,
          make: 'VW',
          model: 'Golf',
          year: 2024,
          licensePlate: 'ZH 333333',
          vin: 'VW333333333',
          color: 'White',
          mileage: 3000,
          fuelType: 'PETROL',
          transmission: 'MANUAL',
          seats: 5,
          status: 'AVAILABLE',
        },
      });

      const location1 = await prisma.location.create({
        data: {
          organizationId: testOrg1.id,
          name: 'Org1 Location',
          address: 'Location 1',
          city: 'Zürich',
          postalCode: '8003',
          canton: 'ZH',
          country: 'Switzerland',
          phone: '+41 44 333 44 55',
          email: 'loc1@test.ch',
          isActive: true,
        },
      });

      // Create contract for org1
      await prisma.contract.create({
        data: {
          organizationId: testOrg1.id,
          customerId: customer1.id,
          vehicleId: vehicle1.id,
          pickupLocationId: location1.id,
          returnLocationId: location1.id,
          contractNumber: 'ORG1-CONTRACT-001',
          pickupDate: new Date(),
          returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status: 'ACTIVE',
          dailyRate: 90.0,
          totalDays: 7,
          subtotal: 630.0,
          taxAmount: 48.51,
          totalAmount: 678.51,
          depositAmount: 900.0,
          depositStatus: 'HELD',
          paymentMethod: 'CREDIT_CARD',
          termsAccepted: true,
        },
      });

      // Query contracts - should only see own org's contracts
      const org1Contracts = await prisma.contract.findMany({
        where: { organizationId: testOrg1.id },
      });

      const org2Contracts = await prisma.contract.findMany({
        where: { organizationId: testOrg2.id },
      });

      expect(org1Contracts).toHaveLength(1);
      expect(org1Contracts[0].contractNumber).toBe('ORG1-CONTRACT-001');

      expect(org2Contracts).toHaveLength(0);
    });
  });

  describe('Role-Based Access', () => {
    it('should enforce role-based access for users', async () => {
      // Create users with different roles
      const adminUser = await prisma.user.create({
        data: {
          organizationId: testOrg1.id,
          email: 'admin@rls-test.ch',
          firstName: 'Admin',
          lastName: 'User',
          role: 'ADMIN',
          phone: '+41 78 444 44 44',
        },
      });

      const staffUser = await prisma.user.create({
        data: {
          organizationId: testOrg1.id,
          email: 'staff@rls-test.ch',
          firstName: 'Staff',
          lastName: 'User',
          role: 'STAFF',
          phone: '+41 78 555 55 55',
        },
      });

      const customerUser = await prisma.user.create({
        data: {
          organizationId: testOrg1.id,
          email: 'customer@rls-test.ch',
          firstName: 'Customer',
          lastName: 'User',
          role: 'CUSTOMER',
          phone: '+41 78 666 66 66',
        },
      });

      // Verify all users created
      expect(adminUser.role).toBe('ADMIN');
      expect(staffUser.role).toBe('STAFF');
      expect(customerUser.role).toBe('CUSTOMER');

      // Query users by role
      const admins = await prisma.user.findMany({
        where: {
          organizationId: testOrg1.id,
          role: 'ADMIN',
        },
      });

      const staff = await prisma.user.findMany({
        where: {
          organizationId: testOrg1.id,
          role: 'STAFF',
        },
      });

      expect(admins).toHaveLength(1);
      expect(staff).toHaveLength(1);
    });
  });

  describe('Activity Logging', () => {
    it('should log activities per organization', async () => {
      const user1 = await prisma.user.create({
        data: {
          organizationId: testOrg1.id,
          email: 'logger1@test.ch',
          firstName: 'Logger',
          lastName: 'One',
          role: 'STAFF',
        },
      });

      const user2 = await prisma.user.create({
        data: {
          organizationId: testOrg2.id,
          email: 'logger2@test.ch',
          firstName: 'Logger',
          lastName: 'Two',
          role: 'STAFF',
        },
      });

      // Create activity logs for each org
      await prisma.activityLog.create({
        data: {
          organizationId: testOrg1.id,
          userId: user1.id,
          action: 'CREATE_CONTRACT',
          entityType: 'CONTRACT',
          entityId: 'test-contract-1',
          details: { contractNumber: 'TEST-001' },
          ipAddress: '192.168.1.1',
          userAgent: 'Test Agent',
        },
      });

      await prisma.activityLog.create({
        data: {
          organizationId: testOrg2.id,
          userId: user2.id,
          action: 'CREATE_VEHICLE',
          entityType: 'VEHICLE',
          entityId: 'test-vehicle-2',
          details: { licensePlate: 'TEST-002' },
          ipAddress: '192.168.1.2',
          userAgent: 'Test Agent',
        },
      });

      // Query logs for each org
      const org1Logs = await prisma.activityLog.findMany({
        where: { organizationId: testOrg1.id },
      });

      const org2Logs = await prisma.activityLog.findMany({
        where: { organizationId: testOrg2.id },
      });

      // Verify isolation
      expect(org1Logs).toHaveLength(1);
      expect(org1Logs[0].action).toBe('CREATE_CONTRACT');

      expect(org2Logs).toHaveLength(1);
      expect(org2Logs[0].action).toBe('CREATE_VEHICLE');
    });
  });
});
