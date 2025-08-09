import { prisma, DocumentType } from '@swiss-car-rental/database';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for document upload
const uploadDocumentSchema = z.object({
  type: z.nativeEnum(DocumentType),
  fileName: z.string().min(1),
  fileSize: z.number().max(5 * 1024 * 1024), // 5MB max
  mimeType: z.enum(['image/jpeg', 'image/png', 'application/pdf']),
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  expiryDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

// GET /api/customers/[id]/documents - Get customer documents
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const documents = await prisma.customerDocument.findMany({
      where: { customerId: params.id },
      orderBy: { uploadedAt: 'desc' },
    });

    // Check for expiring documents (within 30 days)
    const expiringDocuments = documents.filter((doc) => {
      if (!doc.expiryDate) return false;
      const daysUntilExpiry = Math.floor(
        (new Date(doc.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
      );
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    });

    // Check for expired documents
    const expiredDocuments = documents.filter((doc) => {
      if (!doc.expiryDate) return false;
      return new Date(doc.expiryDate) < new Date();
    });

    return NextResponse.json({
      documents,
      summary: {
        total: documents.length,
        expiring: expiringDocuments.length,
        expired: expiredDocuments.length,
        verified: documents.filter((d) => d.verified).length,
      },
      alerts: {
        expiring: expiringDocuments.map((doc) => ({
          id: doc.id,
          type: doc.type,
          expiryDate: doc.expiryDate,
          daysUntilExpiry: Math.floor(
            (new Date(doc.expiryDate as string).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        })),
        expired: expiredDocuments.map((doc) => ({
          id: doc.id,
          type: doc.type,
          expiryDate: doc.expiryDate,
          daysExpired: Math.floor(
            (new Date().getTime() - new Date(doc.expiryDate as string).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching customer documents:', error);
    return NextResponse.json({ error: 'Failed to fetch customer documents' }, { status: 500 });
  }
}

// POST /api/customers/[id]/documents - Upload customer document
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const userId = body.userId || 'system';

    // Validate input
    const validatedData = uploadDocumentSchema.parse(body);

    // Check customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: params.id },
      include: {
        documents: true,
      },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Check document limits (max 10 per customer, 50MB total)
    if (customer.documents.length >= 10) {
      return NextResponse.json(
        { error: 'Maximum document limit (10) reached for this customer' },
        { status: 400 },
      );
    }

    const totalSize = customer.documents.reduce((sum, doc) => sum + doc.fileSize, 0);
    if (totalSize + validatedData.fileSize > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Total document storage limit (50MB) would be exceeded' },
        { status: 400 },
      );
    }

    // Create document record
    const document = await prisma.customerDocument.create({
      data: {
        customerId: params.id,
        type: validatedData.type,
        fileName: validatedData.fileName,
        fileSize: validatedData.fileSize,
        mimeType: validatedData.mimeType,
        url: validatedData.url,
        thumbnailUrl: validatedData.thumbnailUrl,
        expiryDate: validatedData.expiryDate ? new Date(validatedData.expiryDate) : undefined,
        notes: validatedData.notes,
      },
    });

    // Create audit log
    await prisma.customerAuditLog.create({
      data: {
        customerId: params.id,
        userId,
        action: 'DOCUMENT_UPLOAD',
        fieldChanged: 'documents',
        newValue: JSON.stringify({
          documentId: document.id,
          type: document.type,
          fileName: document.fileName,
        }),
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    });

    // Update customer's last activity
    await prisma.customer.update({
      where: { id: params.id },
      data: { lastActivityDate: new Date() },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error uploading document:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 });
  }
}

// DELETE /api/customers/[id]/documents/[documentId] - Delete document
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const documentId = searchParams.get('documentId');
    const userId = searchParams.get('userId') || 'system';

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    // Check document exists and belongs to customer
    const document = await prisma.customerDocument.findFirst({
      where: {
        id: documentId,
        customerId: params.id,
      },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Delete document
    await prisma.customerDocument.delete({
      where: { id: documentId },
    });

    // Create audit log
    await prisma.customerAuditLog.create({
      data: {
        customerId: params.id,
        userId,
        action: 'DOCUMENT_DELETE',
        fieldChanged: 'documents',
        oldValue: JSON.stringify({
          documentId: document.id,
          type: document.type,
          fileName: document.fileName,
        }),
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    });

    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
