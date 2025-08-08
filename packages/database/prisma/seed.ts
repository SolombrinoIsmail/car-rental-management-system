import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const SWISS_CANTONS = [
  'Zürich',
  'Bern',
  'Luzern',
  'Uri',
  'Schwyz',
  'Obwalden',
  'Nidwalden',
  'Glarus',
  'Zug',
  'Fribourg',
  'Solothurn',
  'Basel-Stadt',
  'Basel-Landschaft',
  'Schaffhausen',
  'Appenzell Ausserrhoden',
  'Appenzell Innerrhoden',
  'St. Gallen',
  'Graubünden',
  'Aargau',
  'Thurgau',
  'Ticino',
  'Vaud',
  'Valais',
  'Neuchâtel',
  'Geneva',
  'Jura',
];

const SWISS_CITIES = [
  'Zürich',
  'Geneva',
  'Basel',
  'Lausanne',
  'Bern',
  'Winterthur',
  'Lucerne',
  'St. Gallen',
  'Lugano',
  'Biel/Bienne',
  'Thun',
  'Köniz',
  'La Chaux-de-Fonds',
  'Fribourg',
  'Schaffhausen',
  'Chur',
  'Vernier',
  'Neuchâtel',
  'Uster',
  'Sion',
];

const VEHICLE_MAKES = [
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Volkswagen',
  'Tesla',
  'Porsche',
  'Volvo',
  'Toyota',
  'Honda',
  'Mazda',
];
const VEHICLE_FEATURES = [
  'GPS',
  'Bluetooth',
  'Cruise Control',
  'Parking Sensors',
  'Backup Camera',
  'Heated Seats',
  'Sunroof',
  'Apple CarPlay',
  'Android Auto',
  'Lane Assist',
];

async function seed() {
  console.log('🌱 Starting database seed...');

  // Clean database
  console.log('🧹 Cleaning database...');
  await prisma.additionalDriver.deleteMany();
  await prisma.vehicleDamage.deleteMany();
  await prisma.maintenance.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.customerDocument.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.vehicleCategory.deleteMany();
  await prisma.location.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // Create organization
  console.log('🏢 Creating organization...');
  const organization = await prisma.organization.create({
    data: {
      name: 'Swiss Car Rentals AG',
      slug: 'swiss-car-rentals',
      email: 'info@swisscarrentals.ch',
      phone: '+41 44 123 45 67',
      address: 'Bahnhofstrasse 10',
      city: 'Zürich',
      canton: 'Zürich',
      postalCode: '8001',
      country: 'CH',
      vatNumber: 'CHE-123.456.789',
      settings: {
        currency: 'CHF',
        timezone: 'Europe/Zurich',
        language: 'de',
      },
    },
  });

  // Create locations
  console.log('📍 Creating locations...');
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        organizationId: organization.id,
        name: 'Zürich Airport',
        address: 'Flughafenstrasse 1',
        city: 'Zürich',
        canton: 'Zürich',
        postalCode: '8058',
        phone: '+41 44 123 45 68',
        email: 'airport@swisscarrentals.ch',
        operatingHours: {
          monday: { open: '06:00', close: '23:00' },
          tuesday: { open: '06:00', close: '23:00' },
          wednesday: { open: '06:00', close: '23:00' },
          thursday: { open: '06:00', close: '23:00' },
          friday: { open: '06:00', close: '23:00' },
          saturday: { open: '07:00', close: '22:00' },
          sunday: { open: '07:00', close: '22:00' },
        },
      },
    }),
    prisma.location.create({
      data: {
        organizationId: organization.id,
        name: 'Zürich HB',
        address: 'Bahnhofplatz 15',
        city: 'Zürich',
        canton: 'Zürich',
        postalCode: '8001',
        phone: '+41 44 123 45 69',
        email: 'hauptbahnhof@swisscarrentals.ch',
        operatingHours: {
          monday: { open: '07:00', close: '20:00' },
          tuesday: { open: '07:00', close: '20:00' },
          wednesday: { open: '07:00', close: '20:00' },
          thursday: { open: '07:00', close: '20:00' },
          friday: { open: '07:00', close: '20:00' },
          saturday: { open: '08:00', close: '18:00' },
          sunday: { open: '09:00', close: '17:00' },
        },
      },
    }),
  ]);

  // Create users
  console.log('👥 Creating users...');
  const users = await Promise.all([
    prisma.user.create({
      data: {
        organizationId: organization.id,
        email: 'admin@swisscarrentals.ch',
        firstName: 'Hans',
        lastName: 'Müller',
        phone: '+41 79 123 45 67',
        role: 'ADMIN',
        settings: { notifications: true },
      },
    }),
    prisma.user.create({
      data: {
        organizationId: organization.id,
        email: 'manager@swisscarrentals.ch',
        firstName: 'Anna',
        lastName: 'Schmidt',
        phone: '+41 79 234 56 78',
        role: 'MANAGER',
        settings: { notifications: true },
      },
    }),
    prisma.user.create({
      data: {
        organizationId: organization.id,
        email: 'staff@swisscarrentals.ch',
        firstName: 'Peter',
        lastName: 'Weber',
        phone: '+41 79 345 67 89',
        role: 'STAFF',
        settings: { notifications: true },
      },
    }),
  ]);

  // Create vehicle categories
  console.log('🚗 Creating vehicle categories...');
  const categories = await Promise.all([
    prisma.vehicleCategory.create({
      data: {
        organizationId: organization.id,
        name: 'Economy',
        description: 'Small, fuel-efficient cars perfect for city driving',
        dailyRate: 89,
        weeklyRate: 550,
        monthlyRate: 1800,
        depositAmount: 500,
        excessMileageFee: 0.35,
        insuranceDaily: 25,
        sortOrder: 1,
      },
    }),
    prisma.vehicleCategory.create({
      data: {
        organizationId: organization.id,
        name: 'Compact',
        description: 'Comfortable compact cars for small families',
        dailyRate: 109,
        weeklyRate: 680,
        monthlyRate: 2200,
        depositAmount: 750,
        excessMileageFee: 0.4,
        insuranceDaily: 30,
        sortOrder: 2,
      },
    }),
    prisma.vehicleCategory.create({
      data: {
        organizationId: organization.id,
        name: 'Standard',
        description: 'Mid-size sedans with comfort and space',
        dailyRate: 139,
        weeklyRate: 850,
        monthlyRate: 2800,
        depositAmount: 1000,
        excessMileageFee: 0.45,
        insuranceDaily: 35,
        sortOrder: 3,
      },
    }),
    prisma.vehicleCategory.create({
      data: {
        organizationId: organization.id,
        name: 'Premium',
        description: 'Luxury vehicles with premium features',
        dailyRate: 249,
        weeklyRate: 1500,
        monthlyRate: 4800,
        depositAmount: 2000,
        excessMileageFee: 0.6,
        insuranceDaily: 50,
        sortOrder: 4,
      },
    }),
    prisma.vehicleCategory.create({
      data: {
        organizationId: organization.id,
        name: 'SUV',
        description: 'Spacious SUVs for families and adventures',
        dailyRate: 189,
        weeklyRate: 1150,
        monthlyRate: 3800,
        depositAmount: 1500,
        excessMileageFee: 0.55,
        insuranceDaily: 45,
        sortOrder: 5,
      },
    }),
    prisma.vehicleCategory.create({
      data: {
        organizationId: organization.id,
        name: 'Electric',
        description: 'Eco-friendly electric vehicles',
        dailyRate: 179,
        weeklyRate: 1100,
        monthlyRate: 3600,
        depositAmount: 1500,
        excessMileageFee: 0.3,
        insuranceDaily: 40,
        sortOrder: 6,
      },
    }),
  ]);

  // Create vehicles
  console.log('🚙 Creating vehicles...');
  const vehicles = [];
  for (const category of categories) {
    for (let i = 0; i < 3; i++) {
      const make = faker.helpers.arrayElement(VEHICLE_MAKES);
      const vehicle = await prisma.vehicle.create({
        data: {
          organizationId: organization.id,
          categoryId: category.id,
          locationId: faker.helpers.arrayElement(locations).id,
          registrationNumber: `ZH ${faker.number.int({ min: 10000, max: 99999 })}`,
          make,
          model: faker.vehicle.model(),
          year: faker.number.int({ min: 2020, max: 2024 }),
          color: faker.vehicle.color(),
          vin: faker.vehicle.vin(),
          mileage: faker.number.int({ min: 1000, max: 50000 }),
          fuelType:
            category.name === 'Electric'
              ? 'ELECTRIC'
              : faker.helpers.arrayElement(['PETROL', 'DIESEL', 'HYBRID']),
          transmission: faker.helpers.arrayElement(['MANUAL', 'AUTOMATIC']),
          seats: faker.helpers.arrayElement([2, 4, 5, 7]),
          status: faker.helpers.arrayElement([
            'AVAILABLE',
            'AVAILABLE',
            'AVAILABLE',
            'MAINTENANCE',
          ]),
          features: faker.helpers.arrayElements(VEHICLE_FEATURES, { min: 3, max: 7 }),
          insurancePolicy: `POL-${faker.number.int({ min: 100000, max: 999999 })}`,
          insuranceExpiry: faker.date.future(),
          registrationExpiry: faker.date.future(),
          lastServiceDate: faker.date.recent(),
          nextServiceDate: faker.date.future(),
          nextServiceMileage: faker.number.int({ min: 60000, max: 100000 }),
          purchaseDate: faker.date.past(),
          purchasePrice: faker.number.int({ min: 20000, max: 80000 }),
        },
      });
      vehicles.push(vehicle);
    }
  }

  // Create customers
  console.log('👤 Creating customers...');
  const customers = [];
  for (let i = 0; i < 20; i++) {
    const customer = await prisma.customer.create({
      data: {
        organizationId: organization.id,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: `+41 ${faker.number.int({ min: 70, max: 79 })} ${faker.number.int({ min: 100, max: 999 })} ${faker.number.int({ min: 10, max: 99 })} ${faker.number.int({ min: 10, max: 99 })}`,
        dateOfBirth: faker.date.birthdate({ min: 21, max: 70, mode: 'age' }),
        documentType: faker.helpers.arrayElement(['PASSPORT', 'ID_CARD', 'DRIVERS_LICENSE']),
        documentNumber: faker.string.alphanumeric(9).toUpperCase(),
        documentExpiry: faker.date.future({ years: 5 }),
        address: faker.location.streetAddress(),
        city: faker.helpers.arrayElement(SWISS_CITIES),
        canton: faker.helpers.arrayElement(SWISS_CANTONS),
        postalCode: faker.number.int({ min: 1000, max: 9999 }).toString(),
        preferredLanguage: faker.helpers.arrayElement(['de', 'fr', 'it', 'en']),
        marketingConsent: faker.datatype.boolean(),
      },
    });
    customers.push(customer);
  }

  // Create contracts
  console.log('📄 Creating contracts...');
  const contracts = [];
  for (let i = 0; i < 15; i++) {
    const startDate = faker.date.between({
      from: new Date('2024-01-01'),
      to: new Date('2024-12-31'),
    });
    const days = faker.number.int({ min: 1, max: 14 });
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days);

    const vehicle = faker.helpers.arrayElement(vehicles);
    const category = categories.find((c) => c.id === vehicle.categoryId)!;
    const customer = faker.helpers.arrayElement(customers);

    const baseAmount = Number(category.dailyRate) * days;
    const insuranceAmount = Number(category.insuranceDaily) * days;
    const additionalCharges = faker.number.int({ min: 0, max: 200 });
    const discountAmount = faker.number.int({ min: 0, max: 100 });
    const subtotal = baseAmount + insuranceAmount + additionalCharges - discountAmount;
    const taxAmount = subtotal * 0.077; // Swiss VAT
    const totalAmount = subtotal + taxAmount;

    const contract = await prisma.contract.create({
      data: {
        organizationId: organization.id,
        contractNumber: `CNT-${new Date().getFullYear()}-${String(i + 1).padStart(6, '0')}`,
        customerId: customer.id,
        vehicleId: vehicle.id,
        createdById: faker.helpers.arrayElement(users).id,
        pickupLocationId: faker.helpers.arrayElement(locations).id,
        returnLocationId: faker.helpers.arrayElement(locations).id,
        startDate,
        endDate,
        actualReturnDate: faker.datatype.boolean() ? endDate : null,
        dailyRate: category.dailyRate,
        totalDays: days,
        baseAmount,
        additionalCharges,
        discountAmount,
        taxAmount,
        totalAmount,
        depositAmount: category.depositAmount,
        startMileage: vehicle.mileage,
        endMileage: faker.datatype.boolean()
          ? vehicle.mileage + faker.number.int({ min: 100, max: 1000 })
          : null,
        allowedMileage: days * 200,
        startFuelLevel: faker.number.int({ min: 25, max: 100 }),
        endFuelLevel: faker.datatype.boolean() ? faker.number.int({ min: 25, max: 100 }) : null,
        insuranceType: 'STANDARD',
        insuranceDaily: category.insuranceDaily,
        extras: [
          { name: 'GPS Navigation', price: 15, quantity: days },
          { name: 'Child Seat', price: 20, quantity: days },
        ],
        status: faker.helpers.arrayElement(['ACTIVE', 'COMPLETED', 'COMPLETED']),
        termsAccepted: true,
      },
    });
    contracts.push(contract);

    // Create payment for contract
    await prisma.payment.create({
      data: {
        organizationId: organization.id,
        contractId: contract.id,
        createdById: faker.helpers.arrayElement(users).id,
        amount: totalAmount,
        method: faker.helpers.arrayElement([
          'CREDIT_CARD',
          'DEBIT_CARD',
          'CASH',
          'BANK_TRANSFER',
          'TWINT',
        ]),
        status: 'COMPLETED',
        transactionId: faker.string.uuid(),
        description: `Payment for contract ${contract.contractNumber}`,
      },
    });
  }

  // Create some maintenance records
  console.log('🔧 Creating maintenance records...');
  for (const vehicle of vehicles.slice(0, 5)) {
    await prisma.maintenance.create({
      data: {
        vehicleId: vehicle.id,
        performedById: faker.helpers.arrayElement(users).id,
        type: faker.helpers.arrayElement([
          'Oil Change',
          'Tire Rotation',
          'Brake Service',
          'General Inspection',
        ]),
        description: faker.lorem.sentence(),
        scheduledDate: faker.date.recent(),
        completedDate: faker.datatype.boolean() ? faker.date.recent() : null,
        cost: faker.number.int({ min: 100, max: 1000 }),
        mileage: vehicle.mileage,
        nextDueMileage: vehicle.mileage + 5000,
        nextDueDate: faker.date.future(),
        vendor: faker.company.name(),
        invoiceNumber: `INV-${faker.number.int({ min: 10000, max: 99999 })}`,
        status: faker.helpers.arrayElement(['SCHEDULED', 'COMPLETED']),
      },
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`
  📊 Summary:
  - Organization: 1
  - Locations: ${locations.length}
  - Users: ${users.length}
  - Vehicle Categories: ${categories.length}
  - Vehicles: ${vehicles.length}
  - Customers: ${customers.length}
  - Contracts: ${contracts.length}
  - Payments: ${contracts.length}
  - Maintenance Records: 5
  `);
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
