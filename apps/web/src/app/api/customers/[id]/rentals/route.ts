import { prisma } from '@swiss-car-rental/database';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// GET /api/customers/[id]/rentals - Get customer rental history with statistics
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {
      customerId: params.id,
    };

    if (status) {
      where.status = status;
    }

    // Get customer with rental history
    const customer = await prisma.customer.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        customerCode: true,
      },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Get rentals with pagination
    const [rentals, totalCount] = await Promise.all([
      prisma.contract.findMany({
        where,
        include: {
          vehicle: {
            select: {
              id: true,
              make: true,
              model: true,
              year: true,
              registrationNumber: true,
              category: true,
            },
          },
          payments: {
            select: {
              id: true,
              amount: true,
              status: true,
              paymentDate: true,
              method: true,
            },
          },
          damages: {
            select: {
              id: true,
              description: true,
              estimatedCost: true,
              actualCost: true,
              status: true,
              reportedAt: true,
            },
          },
          additionalDrivers: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              driversLicenseNumber: true,
            },
          },
        },
        orderBy: { startDate: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contract.count({ where }),
    ]);

    // Calculate rental statistics
    const allRentals = await prisma.contract.findMany({
      where: { customerId: params.id },
      select: {
        status: true,
        totalAmount: true,
        startDate: true,
        endDate: true,
        actualReturnDate: true,
        payments: {
          select: {
            amount: true,
            status: true,
          },
        },
        damages: {
          select: {
            actualCost: true,
            estimatedCost: true,
          },
        },
      },
    });

    // Calculate statistics
    const totalRentals = allRentals.length;
    const completedRentals = allRentals.filter((r) => r.status === 'COMPLETED').length;
    const activeRentals = allRentals.filter((r) => r.status === 'ACTIVE').length;
    const cancelledRentals = allRentals.filter((r) => r.status === 'CANCELLED').length;

    // Calculate financial metrics
    const totalSpent = allRentals.reduce((sum, r) => sum + Number(r.totalAmount), 0);
    const totalPaid = allRentals.reduce((sum, r) => {
      const paid = r.payments
        .filter((p) => p.status === 'COMPLETED')
        .reduce((pSum, p) => pSum + Number(p.amount), 0);
      return sum + paid;
    }, 0);
    const outstandingBalance = totalSpent - totalPaid;

    // Calculate damage metrics
    const totalDamages = allRentals.reduce((sum, r) => sum + r.damages.length, 0);
    const totalDamageCost = allRentals.reduce((sum, r) => {
      const cost = r.damages.reduce(
        (dSum, d) => dSum + Number(d.actualCost || d.estimatedCost || 0),
        0,
      );
      return sum + cost;
    }, 0);

    // Calculate rental duration statistics
    const completedRentalDurations = allRentals
      .filter((r) => r.status === 'COMPLETED' && r.actualReturnDate)
      .map((r) => {
        const start = new Date(r.startDate);
        const end = new Date(r.actualReturnDate as Date);
        return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      });

    const averageRentalDuration =
      completedRentalDurations.length > 0
        ? Math.round(
            completedRentalDurations.reduce((sum, days) => sum + days, 0) /
              completedRentalDurations.length,
          )
        : 0;

    // Late return analysis
    const lateReturns = allRentals.filter((r) => {
      if (!r.actualReturnDate || !r.endDate) return false;
      return new Date(r.actualReturnDate) > new Date(r.endDate);
    }).length;

    const onTimeReturnRate =
      completedRentals > 0
        ? Math.round(((completedRentals - lateReturns) / completedRentals) * 100)
        : 100;

    // Recent activity (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const recentRentals = allRentals.filter((r) => new Date(r.startDate) >= sixMonthsAgo).length;

    const statistics = {
      rental: {
        total: totalRentals,
        completed: completedRentals,
        active: activeRentals,
        cancelled: cancelledRentals,
        averageDuration: averageRentalDuration,
        onTimeReturnRate,
        recentActivity: recentRentals,
      },
      financial: {
        lifetimeValue: totalSpent,
        totalPaid,
        outstandingBalance,
        averageSpendPerRental: totalRentals > 0 ? Math.round(totalSpent / totalRentals) : 0,
      },
      damage: {
        totalIncidents: totalDamages,
        totalCost: totalDamageCost,
        incidentRate: totalRentals > 0 ? Math.round((totalDamages / totalRentals) * 100) : 0,
        averageCostPerIncident: totalDamages > 0 ? Math.round(totalDamageCost / totalDamages) : 0,
      },
    };

    return NextResponse.json({
      customer,
      rentals: rentals.map((rental) => ({
        ...rental,
        duration: calculateRentalDuration(
          rental.startDate,
          rental.endDate,
          rental.actualReturnDate,
        ),
        totalPaid: rental.payments
          .filter((p) => p.status === 'COMPLETED')
          .reduce((sum, p) => sum + Number(p.amount), 0),
        isLateReturn:
          rental.actualReturnDate && rental.endDate
            ? new Date(rental.actualReturnDate) > new Date(rental.endDate)
            : false,
      })),
      statistics,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching customer rentals:', error);
    return NextResponse.json({ error: 'Failed to fetch customer rentals' }, { status: 500 });
  }
}

// Helper function to calculate rental duration
function calculateRentalDuration(
  startDate: Date,
  endDate: Date,
  actualReturnDate: Date | null,
): {
  planned: number;
  actual: number | null;
  isOverdue: boolean;
} {
  const start = new Date(startDate);
  const plannedEnd = new Date(endDate);

  const planned = Math.ceil((plannedEnd.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  if (actualReturnDate) {
    const actualEnd = new Date(actualReturnDate);
    const actual = Math.ceil((actualEnd.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = actualEnd > plannedEnd;

    return { planned, actual, isOverdue };
  }

  // For active rentals, check if overdue
  const now = new Date();
  const isOverdue = now > plannedEnd;

  return { planned, actual: null, isOverdue };
}
