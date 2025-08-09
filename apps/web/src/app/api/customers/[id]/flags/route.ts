import { prisma, CustomerFlag, CustomerStatus } from '@swiss-car-rental/database';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for flag management
const manageFlagsSchema = z.object({
  flags: z.array(z.nativeEnum(CustomerFlag)),
  blacklisted: z.boolean().optional(),
  blacklistReason: z.string().max(500).optional(),
  blacklistExpiry: z.string().datetime().optional(),
  vipStatus: z.boolean().optional(),
  paymentRisk: z.boolean().optional(),
  damageRisk: z.boolean().optional(),
  specialNeeds: z.string().optional(),
  reason: z.string().max(500), // Required reason for audit trail
});

// PUT /api/customers/[id]/flags - Update customer flags and risk status
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const userId = body.userId || 'system';
    const userRole = body.userRole || 'STAFF'; // Should come from auth

    // Validate input
    const validatedData = manageFlagsSchema.parse(body);

    // Get current customer
    const currentCustomer = await prisma.customer.findUnique({
      where: { id: params.id },
    });

    if (!currentCustomer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Check if user has permission for blacklist changes
    if (
      validatedData.blacklisted !== undefined &&
      validatedData.blacklisted !== currentCustomer.blacklisted
    ) {
      // Check if user is manager or higher (level 2+)
      if (!['MANAGER', 'ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
        return NextResponse.json(
          { error: 'Manager approval required for blacklist modifications' },
          { status: 403 },
        );
      }
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      flags: validatedData.flags,
      lastActivityDate: new Date(),
    };

    // Handle blacklist fields
    if (validatedData.blacklisted !== undefined) {
      updateData.blacklisted = validatedData.blacklisted;
      updateData.blacklistReason = validatedData.blacklistReason;

      if (validatedData.blacklistExpiry) {
        updateData.blacklistExpiry = new Date(validatedData.blacklistExpiry);
      } else if (!validatedData.blacklisted) {
        updateData.blacklistExpiry = null;
      }

      // Update status based on blacklist
      if (validatedData.blacklisted) {
        updateData.status = CustomerStatus.BLACKLISTED;
      } else if (currentCustomer.status === CustomerStatus.BLACKLISTED) {
        updateData.status = CustomerStatus.ACTIVE;
      }
    }

    // Handle VIP status
    if (validatedData.vipStatus !== undefined) {
      updateData.vipStatus = validatedData.vipStatus;
      if (validatedData.vipStatus && !validatedData.blacklisted) {
        updateData.status = CustomerStatus.VIP;
      }
    }

    // Handle risk flags
    if (validatedData.paymentRisk !== undefined) {
      updateData.paymentRisk = validatedData.paymentRisk;
    }
    if (validatedData.damageRisk !== undefined) {
      updateData.damageRisk = validatedData.damageRisk;
    }
    if (validatedData.specialNeeds !== undefined) {
      updateData.specialNeeds = validatedData.specialNeeds;
    }

    // Update customer
    const updatedCustomer = await prisma.customer.update({
      where: { id: params.id },
      data: updateData,
    });

    // Create detailed audit logs for flag changes
    const flagChanges = [];

    // Check flag array changes
    const oldFlags = currentCustomer.flags || [];
    const newFlags = validatedData.flags;
    const addedFlags = newFlags.filter((f) => !oldFlags.includes(f));
    const removedFlags = oldFlags.filter((f) => !newFlags.includes(f));

    if (addedFlags.length > 0) {
      flagChanges.push({
        action: 'FLAG_ADDED',
        detail: `Added flags: ${addedFlags.join(', ')}`,
      });
    }
    if (removedFlags.length > 0) {
      flagChanges.push({
        action: 'FLAG_REMOVED',
        detail: `Removed flags: ${removedFlags.join(', ')}`,
      });
    }

    // Check blacklist changes
    if (
      validatedData.blacklisted !== undefined &&
      validatedData.blacklisted !== currentCustomer.blacklisted
    ) {
      flagChanges.push({
        action: validatedData.blacklisted ? 'BLACKLIST_ADD' : 'BLACKLIST_REMOVE',
        detail: validatedData.blacklisted
          ? `Blacklisted: ${validatedData.blacklistReason}`
          : 'Removed from blacklist',
      });
    }

    // Check VIP status changes
    if (
      validatedData.vipStatus !== undefined &&
      validatedData.vipStatus !== currentCustomer.vipStatus
    ) {
      flagChanges.push({
        action: validatedData.vipStatus ? 'VIP_ADD' : 'VIP_REMOVE',
        detail: validatedData.vipStatus ? 'Added VIP status' : 'Removed VIP status',
      });
    }

    // Create audit logs
    for (const change of flagChanges) {
      await prisma.customerAuditLog.create({
        data: {
          customerId: params.id,
          userId,
          action: change.action,
          fieldChanged: 'flags',
          oldValue: JSON.stringify(currentCustomer.flags),
          newValue: JSON.stringify(updatedCustomer.flags),
          reason: `${validatedData.reason} - ${change.detail}`,
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          userAgent: request.headers.get('user-agent'),
        },
      });
    }

    return NextResponse.json({
      ...updatedCustomer,
      flagChanges,
      message: 'Customer flags updated successfully',
    });
  } catch (error) {
    console.error('Error updating customer flags:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: 'Failed to update customer flags' }, { status: 500 });
  }
}

// GET /api/customers/[id]/risk-assessment - Get customer risk assessment
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: params.id },
      include: {
        contracts: {
          select: {
            status: true,
            totalAmount: true,
            payments: {
              select: {
                amount: true,
                status: true,
              },
            },
            damages: {
              select: {
                estimatedCost: true,
                actualCost: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Calculate risk metrics
    const completedContracts = customer.contracts.filter((c) => c.status === 'COMPLETED');
    const totalContracts = customer.contracts.length;

    // Payment history analysis
    const totalOwed = completedContracts.reduce((sum, c) => sum + Number(c.totalAmount), 0);
    const totalPaid = completedContracts.reduce((sum, c) => {
      const paid = c.payments
        .filter((p) => p.status === 'COMPLETED')
        .reduce((pSum, p) => pSum + Number(p.amount), 0);
      return sum + paid;
    }, 0);
    const paymentCompletionRate = totalOwed > 0 ? (totalPaid / totalOwed) * 100 : 100;

    // Damage history analysis
    const totalDamages = customer.contracts.reduce((sum, c) => sum + c.damages.length, 0);
    const totalDamageCost = customer.contracts.reduce((sum, c) => {
      const cost = c.damages.reduce(
        (dSum, d) => dSum + Number(d.actualCost || d.estimatedCost || 0),
        0,
      );
      return sum + cost;
    }, 0);
    const averageDamagePerRental = totalContracts > 0 ? totalDamageCost / totalContracts : 0;

    // Calculate risk scores (0-100, higher is riskier)
    const paymentRiskScore = Math.min(
      100,
      Math.max(0, 100 - paymentCompletionRate + (customer.paymentRisk ? 20 : 0)),
    );

    const damageRiskScore = Math.min(
      100,
      Math.max(
        0,
        (totalDamages > 0 ? (totalDamages / totalContracts) * 50 : 0) +
          (averageDamagePerRental > 500 ? 30 : (averageDamagePerRental / 500) * 30) +
          (customer.damageRisk ? 20 : 0),
      ),
    );

    const overallRiskScore = (paymentRiskScore + damageRiskScore) / 2;

    // Determine risk level
    let riskLevel = 'LOW';
    if (overallRiskScore >= 70) riskLevel = 'HIGH';
    else if (overallRiskScore >= 40) riskLevel = 'MEDIUM';

    return NextResponse.json({
      customerId: customer.id,
      riskAssessment: {
        overallScore: Math.round(overallRiskScore),
        level: riskLevel,
        factors: {
          payment: {
            score: Math.round(paymentRiskScore),
            completionRate: Math.round(paymentCompletionRate),
            flagged: customer.paymentRisk,
            totalOwed,
            totalPaid,
          },
          damage: {
            score: Math.round(damageRiskScore),
            totalIncidents: totalDamages,
            totalCost: totalDamageCost,
            averagePerRental: Math.round(averageDamagePerRental),
            flagged: customer.damageRisk,
          },
        },
        flags: customer.flags,
        blacklisted: customer.blacklisted,
        vipStatus: customer.vipStatus,
        specialNeeds: customer.specialNeeds,
      },
      recommendations: generateRiskRecommendations(
        overallRiskScore,
        paymentRiskScore,
        damageRiskScore,
        customer,
      ),
    });
  } catch (error) {
    console.error('Error fetching risk assessment:', error);
    return NextResponse.json({ error: 'Failed to fetch risk assessment' }, { status: 500 });
  }
}

// Helper function to generate risk recommendations
function generateRiskRecommendations(
  overallScore: number,
  paymentScore: number,
  damageScore: number,
  customer: Record<string, unknown>,
): string[] {
  const recommendations = [];

  if (customer.blacklisted) {
    recommendations.push('⚠️ Customer is blacklisted - rental not recommended');
  }

  if (overallScore >= 70) {
    recommendations.push('High risk customer - require additional deposit');
    recommendations.push('Manager approval required for rental');
  } else if (overallScore >= 40) {
    recommendations.push('Medium risk - standard deposit required');
    recommendations.push('Document vehicle condition thoroughly');
  }

  if (paymentScore >= 60) {
    recommendations.push('Payment history concerns - consider prepayment');
  }

  if (damageScore >= 60) {
    recommendations.push('Damage history concerns - detailed inspection required');
    recommendations.push('Consider additional insurance requirements');
  }

  if (customer.specialNeeds) {
    recommendations.push(`Special requirements: ${customer.specialNeeds}`);
  }

  if (customer.vipStatus) {
    recommendations.push('✨ VIP customer - provide premium service');
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ Low risk customer - standard procedures apply');
  }

  return recommendations;
}
