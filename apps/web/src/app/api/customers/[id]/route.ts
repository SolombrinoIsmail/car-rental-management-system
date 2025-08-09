import { prisma, CustomerStatus, CustomerFlag } from '@swiss-car-rental/database';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for updates
const updateCustomerSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  phone: z
    .string()
    .regex(/^(\+41|0)[0-9]{9,10}$/)
    .optional(),
  dateOfBirth: z.string().datetime().optional(),
  documentType: z.enum(['PASSPORT', 'ID_CARD', 'DRIVERS_LICENSE', 'RESIDENCE_PERMIT']).optional(),
  documentNumber: z.string().min(1).optional(),
  documentExpiry: z.string().datetime().optional(),
  documentCountry: z.string().optional(),
  driversLicenseNumber: z.string().optional(),
  driversLicenseExpiry: z.string().datetime().optional(),
  driversLicenseCountry: z.string().optional(),
  address: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  canton: z.string().optional(),
  postalCode: z
    .string()
    .regex(/^[0-9]{4}$/)
    .optional(),
  country: z.string().optional(),
  notes: z.string().max(2000).optional(),
  photoUrl: z.string().url().optional(),
  preferredLanguage: z.string().optional(),
  marketingConsent: z.boolean().optional(),
  status: z.nativeEnum(CustomerStatus).optional(),
  flags: z.array(z.nativeEnum(CustomerFlag)).optional(),
  blacklisted: z.boolean().optional(),
  blacklistReason: z.string().max(500).optional(),
  blacklistExpiry: z.string().datetime().optional(),
  vipStatus: z.boolean().optional(),
  paymentRisk: z.boolean().optional(),
  damageRisk: z.boolean().optional(),
  specialNeeds: z.string().optional(),
});

// GET /api/customers/[id] - Get customer details
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: params.id },
      include: {
        documents: {
          orderBy: { uploadedAt: 'desc' },
        },
        contracts: {
          select: {
            id: true,
            contractNumber: true,
            startDate: true,
            endDate: true,
            actualReturnDate: true,
            totalAmount: true,
            status: true,
            vehicle: {
              select: {
                make: true,
                model: true,
                registrationNumber: true,
              },
            },
          },
          orderBy: { startDate: 'desc' },
          take: 50, // Last 50 rentals
        },
        auditLogs: {
          orderBy: { createdAt: 'desc' },
          take: 20, // Recent audit logs
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Calculate lifetime value if not up to date
    const lifetimeValue = await prisma.contract.aggregate({
      where: {
        customerId: params.id,
        status: 'COMPLETED',
      },
      _sum: {
        totalAmount: true,
      },
    });

    // Calculate outstanding balance
    const outstandingBalance = await prisma.contract.aggregate({
      where: {
        customerId: params.id,
        status: { in: ['ACTIVE', 'COMPLETED'] },
      },
      _sum: {
        totalAmount: true,
      },
    });

    const paidAmount = await prisma.payment.aggregate({
      where: {
        contract: {
          customerId: params.id,
        },
        status: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
    });

    const calculatedOutstanding =
      (outstandingBalance._sum.totalAmount || 0) - (paidAmount._sum.amount || 0);

    return NextResponse.json({
      ...customer,
      lifetimeValue: lifetimeValue._sum.totalAmount || 0,
      outstandingBalance: calculatedOutstanding,
      rentalHistory: customer.contracts,
      totalRentals: customer.contracts.length,
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 });
  }
}

// PUT /api/customers/[id] - Update customer
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const userId = body.userId || 'system'; // Should come from auth

    // Validate input
    const validatedData = updateCustomerSchema.parse(body);

    // Get current customer for audit log
    const currentCustomer = await prisma.customer.findUnique({
      where: { id: params.id },
    });

    if (!currentCustomer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Check for duplicate email/phone if being changed
    if (validatedData.email || validatedData.phone) {
      const duplicateCheck = await prisma.customer.findFirst({
        where: {
          organizationId: currentCustomer.organizationId,
          id: { not: params.id },
          OR: [
            validatedData.email ? { email: validatedData.email } : {},
            validatedData.phone ? { phone: validatedData.phone } : {},
          ].filter((condition) => Object.keys(condition).length > 0),
        },
      });

      if (duplicateCheck) {
        return NextResponse.json(
          { error: 'Email or phone already exists for another customer' },
          { status: 409 },
        );
      }
    }

    // Check if blacklist changes require manager approval
    if (
      validatedData.blacklisted !== undefined &&
      validatedData.blacklisted !== currentCustomer.blacklisted
    ) {
      // In real implementation, check user role here
      // For now, we'll allow it but log it
    }

    // Prepare update data
    const updateData: Record<string, unknown> = { ...validatedData };

    // Convert date strings to Date objects
    if (validatedData.dateOfBirth) {
      updateData.dateOfBirth = new Date(validatedData.dateOfBirth);
    }
    if (validatedData.documentExpiry) {
      updateData.documentExpiry = new Date(validatedData.documentExpiry);
    }
    if (validatedData.driversLicenseExpiry) {
      updateData.driversLicenseExpiry = new Date(validatedData.driversLicenseExpiry);
    }
    if (validatedData.blacklistExpiry) {
      updateData.blacklistExpiry = new Date(validatedData.blacklistExpiry);
    }

    // Update customer
    const updatedCustomer = await prisma.customer.update({
      where: { id: params.id },
      data: {
        ...updateData,
        lastActivityDate: new Date(),
      },
    });

    // Create audit logs for changes
    const changedFields = Object.keys(validatedData);
    for (const field of changedFields) {
      const oldValue = (currentCustomer as Record<string, unknown>)[field];
      const newValue = (updatedCustomer as Record<string, unknown>)[field];

      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        await prisma.customerAuditLog.create({
          data: {
            customerId: params.id,
            userId,
            action: 'UPDATE',
            fieldChanged: field,
            oldValue: JSON.stringify(oldValue),
            newValue: JSON.stringify(newValue),
            reason: body.reason,
            ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
            userAgent: request.headers.get('user-agent'),
          },
        });
      }
    }

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}

// DELETE /api/customers/[id] - Delete customer (GDPR compliant)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const userId = body.userId || 'system';
    const hardDelete = body.hardDelete === true;

    const customer = await prisma.customer.findUnique({
      where: { id: params.id },
      include: {
        contracts: {
          where: {
            status: { in: ['ACTIVE', 'DRAFT'] },
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Check if customer has active contracts
    if (customer.contracts.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete customer with active contracts' },
        { status: 400 },
      );
    }

    if (hardDelete) {
      // Hard delete - completely remove from database
      await prisma.customer.delete({
        where: { id: params.id },
      });

      return NextResponse.json({ message: 'Customer deleted permanently' });
    } else {
      // Soft delete - anonymize for GDPR compliance
      const anonymizedCustomer = await prisma.customer.update({
        where: { id: params.id },
        data: {
          firstName: 'DELETED',
          lastName: 'DELETED',
          email: `deleted_${params.id}@deleted.com`,
          phone: '0000000000',
          documentNumber: 'DELETED',
          driversLicenseNumber: null,
          address: 'DELETED',
          city: 'DELETED',
          postalCode: '0000',
          notes: null,
          photoUrl: null,
          status: CustomerStatus.INACTIVE,
          anonymizedAt: new Date(),
        },
      });

      // Create audit log
      await prisma.customerAuditLog.create({
        data: {
          customerId: params.id,
          userId,
          action: 'ANONYMIZE',
          reason: 'GDPR compliance - customer deletion request',
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          userAgent: request.headers.get('user-agent'),
        },
      });

      return NextResponse.json({
        message: 'Customer data anonymized for GDPR compliance',
        anonymizedAt: anonymizedCustomer.anonymizedAt,
      });
    }
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
  }
}
