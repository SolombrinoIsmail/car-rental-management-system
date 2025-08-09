import { prisma, CustomerStatus } from '@swiss-car-rental/database';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schemas
const createCustomerSchema = z.object({
  organizationId: z.string().uuid(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^(\+41|0)[0-9]{9,10}$/),
  dateOfBirth: z.string().datetime(),
  documentType: z.enum(['PASSPORT', 'ID_CARD', 'DRIVERS_LICENSE', 'RESIDENCE_PERMIT']),
  documentNumber: z.string().min(1),
  documentExpiry: z.string().datetime(),
  documentCountry: z.string().default('CH'),
  driversLicenseNumber: z.string().optional(),
  driversLicenseExpiry: z.string().datetime().optional(),
  driversLicenseCountry: z.string().default('CH').optional(),
  address: z.string().min(1),
  city: z.string().min(1),
  canton: z.string().optional(),
  postalCode: z.string().regex(/^[0-9]{4}$/),
  country: z.string().default('CH'),
  notes: z.string().max(2000).optional(),
  photoUrl: z.string().url().optional(),
  preferredLanguage: z.string().default('de'),
  marketingConsent: z.boolean().default(false),
});

// GET /api/customers - Search and list customers
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const organizationId = searchParams.get('organizationId');

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
    }

    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = { organizationId };

    // Search implementation
    if (query) {
      where.OR = [
        {
          firstName: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          lastName: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          phone: {
            contains: query,
          },
        },
        {
          customerCode: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          documentNumber: {
            contains: query,
          },
        },
      ];
    }

    // Execute search with pagination
    const [customers, totalCount] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          documents: {
            select: {
              id: true,
              type: true,
              expiryDate: true,
              verified: true,
            },
          },
          _count: {
            select: {
              contracts: true,
            },
          },
        },
        orderBy: [{ updatedAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.customer.count({ where }),
    ]);

    // Format response with pagination metadata
    const response = {
      data: customers.map((customer) => ({
        ...customer,
        rentalCount: customer._count.contracts,
        status: getCustomerStatusDisplay(customer),
      })),
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error searching customers:', error);
    return NextResponse.json({ error: 'Failed to search customers' }, { status: 500 });
  }
}

// POST /api/customers - Create new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createCustomerSchema.parse(body);

    // Check for duplicates
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        organizationId: validatedData.organizationId,
        OR: [
          { email: validatedData.email },
          { phone: validatedData.phone },
          { documentNumber: validatedData.documentNumber },
        ],
      },
    });

    if (existingCustomer) {
      let duplicateField = 'customer';
      if (existingCustomer.email === validatedData.email) duplicateField = 'email';
      else if (existingCustomer.phone === validatedData.phone) duplicateField = 'phone';
      else if (existingCustomer.documentNumber === validatedData.documentNumber)
        duplicateField = 'document number';

      return NextResponse.json(
        { error: `A customer with this ${duplicateField} already exists` },
        { status: 409 },
      );
    }

    // Generate customer code
    const lastCustomer = await prisma.customer.findFirst({
      where: { organizationId: validatedData.organizationId },
      orderBy: { customerCode: 'desc' },
    });

    const year = new Date().getFullYear();
    let nextNumber = 1;
    if (lastCustomer?.customerCode) {
      const match = lastCustomer.customerCode.match(/C-(\d{4})-(\d{4})/);
      if (match && match[1] === year.toString()) {
        nextNumber = parseInt(match[2]) + 1;
      }
    }
    const customerCode = `C-${year}-${nextNumber.toString().padStart(4, '0')}`;

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        ...validatedData,
        customerCode,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        documentExpiry: new Date(validatedData.documentExpiry),
        driversLicenseExpiry: validatedData.driversLicenseExpiry
          ? new Date(validatedData.driversLicenseExpiry)
          : undefined,
        status: CustomerStatus.ACTIVE,
      },
      include: {
        documents: true,
      },
    });

    // Create audit log
    await prisma.customerAuditLog.create({
      data: {
        customerId: customer.id,
        userId: body.userId || 'system', // Should come from auth context
        action: 'CREATE',
        newValue: JSON.stringify(customer),
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}

// Helper function to determine customer status display
function getCustomerStatusDisplay(customer: Record<string, unknown>): string {
  if (customer.blacklisted) return 'blacklisted';
  if (customer.vipStatus) return 'vip';
  if (customer.status === CustomerStatus.INACTIVE) return 'inactive';
  return 'active';
}
