/**
 * Customer Management API Routes
 * Epic 1 Story 1: Customer Management Foundation
 * Swiss Car Rental Management System
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { 
  Customer, 
  CreateCustomerRequest, 
  CustomerSearchQuery, 
  CustomerSearchResult,
  SwissIdDocumentType,
  SwissUtils,
  ApiResponse,
  CustomerValidationError,
  DuplicateCustomerError,
  CustomerNotFoundError 
} from '@/types/customer';

// Validation schemas using Zod
const SwissAddressSchema = z.object({
  street: z.string().min(1, 'Street is required').max(200),
  houseNumber: z.string().min(1, 'House number is required').max(10),
  postalCode: z.string().regex(/^[1-9][0-9]{3}$/, 'Invalid Swiss postal code'),
  city: z.string().min(1, 'City is required').max(100),
  canton: z.enum(['AG', 'AR', 'AI', 'BL', 'BS', 'BE', 'FR', 'GE', 'GL', 'GR', 
                  'JU', 'LU', 'NE', 'NW', 'OW', 'SG', 'SH', 'SZ', 'SO', 'TG', 
                  'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH']),
  country: z.string().default('CH')
});

const CreateCustomerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().refine(SwissUtils.validatePhone, 'Invalid Swiss phone number format'),
  dateOfBirth: z.string().datetime().refine(
    (date) => {
      const birth = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear();
      return age >= 18 && age <= 100;
    },
    'Customer must be between 18 and 100 years old'
  ),
  nationality: z.string().length(3).default('CHE'),
  preferredLanguage: z.string().default('de-CH'),
  address: SwissAddressSchema,
  idDocumentType: z.enum(['swiss_passport', 'swiss_id_card', 'residence_permit_b', 
                         'residence_permit_c', 'residence_permit_l', 'residence_permit_f',
                         'eu_passport', 'other_passport']),
  idDocumentNumber: z.string().min(1, 'ID document number is required'),
  idDocumentExpiry: z.string().datetime().optional(),
  driverLicenseNumber: z.string().min(1, 'Driver license number is required'),
  driverLicenseCountry: z.string().length(3).default('CHE'),
  driverLicenseExpiry: z.string().datetime().refine(
    (date) => new Date(date) > new Date(),
    'Driver license must not be expired'
  ),
  driverLicenseCategory: z.record(z.boolean()).default({ 'B': true }),
  notes: z.string().max(2000).optional(),
  gdprConsentDate: z.string().datetime(),
  gdprConsentVersion: z.string().min(1),
  marketingConsent: z.boolean().default(false)
}).refine(
  (data) => SwissUtils.validateIdDocument(data.idDocumentType, data.idDocumentNumber),
  {
    message: 'Invalid ID document number format for the selected document type',
    path: ['idDocumentNumber']
  }
);

const CustomerSearchSchema = z.object({
  q: z.string().min(1, 'Search query is required'),
  limit: z.number().min(1).max(50).default(20),
  offset: z.number().min(0).default(0),
  includeFlags: z.boolean().default(false),
  sortBy: z.enum(['name', 'created', 'updated', 'lifetime_value']).default('updated'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Utility functions
async function getTenantId(request: NextRequest): Promise<string> {
  // Extract tenant ID from JWT token or headers
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }
  
  // In production, decode JWT and extract tenant_id
  // For now, using a mock implementation
  return '00000000-0000-0000-0000-000000000001';
}

async function getUserId(request: NextRequest): Promise<string> {
  // Extract user ID from JWT token
  // In production, decode JWT and extract user_id
  return '00000000-0000-0000-0000-000000000002';
}

function createErrorResponse(error: Error, status: number = 500): NextResponse {
  console.error('Customer API Error:', error);
  
  let errorCode = 'INTERNAL_ERROR';
  let message = 'An unexpected error occurred';
  
  if (error instanceof CustomerValidationError) {
    errorCode = 'VALIDATION_ERROR';
    message = error.message;
    status = 400;
  } else if (error instanceof DuplicateCustomerError) {
    errorCode = 'DUPLICATE_CUSTOMER';
    message = error.message;
    status = 409;
  } else if (error instanceof CustomerNotFoundError) {
    errorCode = 'CUSTOMER_NOT_FOUND';
    message = error.message;
    status = 404;
  }
  
  return NextResponse.json({
    success: false,
    error: {
      code: errorCode,
      message: message
    }
  }, { status });
}

// GET /api/customers/search - Search customers
export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();
    const searchParams = request.nextUrl.searchParams;
    const tenantId = await getTenantId(request);
    
    // Parse and validate search parameters
    const query = CustomerSearchSchema.parse({
      q: searchParams.get('q'),
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
      includeFlags: searchParams.get('includeFlags') === 'true',
      sortBy: searchParams.get('sortBy') as any,
      sortOrder: searchParams.get('sortOrder') as any
    });
    
    // Check cache first (Redis-like behavior with Supabase)
    const cacheKey = `search:${tenantId}:${Buffer.from(JSON.stringify(query)).toString('base64')}`;
    const { data: cachedResult } = await supabase
      .from('customer_search_cache')
      .select('result_data, result_count')
      .eq('tenant_id', tenantId)
      .eq('query_hash', cacheKey)
      .gt('expires_at', new Date().toISOString())
      .single();
    
    if (cachedResult) {
      return NextResponse.json({
        success: true,
        data: {
          customers: cachedResult.result_data,
          total: cachedResult.result_count,
          hasMore: query.offset + query.limit < cachedResult.result_count
        },
        metadata: {
          cached: true,
          executionTime: Date.now() - startTime
        }
      });
    }
    
    // Execute search using the optimized PostgreSQL function
    const { data: searchResults, error } = await supabase.rpc(
      'search_customers_optimized',
      {
        p_tenant_id: tenantId,
        p_query: query.q,
        p_limit: query.limit,
        p_offset: query.offset,
        p_include_flags: query.includeFlags
      }
    );
    
    if (error) throw error;
    
    // Get total count for pagination
    const { count: totalCount } = await supabase.rpc(
      'search_customers_optimized',
      {
        p_tenant_id: tenantId,
        p_query: query.q,
        p_limit: 1000000, // Large number to get total
        p_offset: 0,
        p_include_flags: false
      }
    );
    
    const result: CustomerSearchResult = {
      customers: searchResults || [],
      total: totalCount || 0,
      hasMore: query.offset + query.limit < (totalCount || 0)
    };
    
    // Cache the result for 5 minutes
    await supabase.from('customer_search_cache').insert({
      tenant_id: tenantId,
      query_hash: cacheKey,
      query_params: query,
      result_data: result.customers,
      result_count: result.total,
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    });
    
    const response: ApiResponse<CustomerSearchResult> = {
      success: true,
      data: result,
      metadata: {
        total: result.total,
        page: Math.floor(query.offset / query.limit) + 1,
        limit: query.limit,
        executionTime: Date.now() - startTime
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    return createErrorResponse(error as Error);
  }
}

// POST /api/customers - Create new customer
export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now();
    const tenantId = await getTenantId(request);
    const userId = await getUserId(request);
    const body = await request.json();
    
    // Validate request data
    const customerData = CreateCustomerSchema.parse(body);
    
    // Check for duplicate email within tenant
    if (customerData.email) {
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id, email')
        .eq('tenant_id', tenantId)
        .eq('email', customerData.email)
        .single();
      
      if (existingCustomer) {
        throw new DuplicateCustomerError('email', customerData.email);
      }
    }
    
    // Check for duplicate phone within tenant
    const { data: existingPhone } = await supabase
      .from('customers')
      .select('id, phone')
      .eq('tenant_id', tenantId)
      .eq('phone', SwissUtils.formatPhone(customerData.phone))
      .single();
    
    if (existingPhone) {
      throw new DuplicateCustomerError('phone', customerData.phone);
    }
    
    // Format phone number to international format
    const formattedPhone = SwissUtils.formatPhone(customerData.phone);
    
    // Prepare customer record
    const newCustomer = {
      tenant_id: tenantId,
      first_name: customerData.firstName,
      last_name: customerData.lastName,
      email: customerData.email,
      phone: formattedPhone,
      date_of_birth: customerData.dateOfBirth,
      nationality: customerData.nationality,
      preferred_language: customerData.preferredLanguage,
      address: customerData.address,
      id_document_type: customerData.idDocumentType,
      id_document_number: customerData.idDocumentNumber,
      id_document_expiry: customerData.idDocumentExpiry,
      driver_license_number: customerData.driverLicenseNumber,
      driver_license_country: customerData.driverLicenseCountry,
      driver_license_expiry: customerData.driverLicenseExpiry,
      driver_license_category: customerData.driverLicenseCategory,
      notes: customerData.notes,
      gdpr_consent_date: customerData.gdprConsentDate,
      gdpr_consent_version: customerData.gdprConsentVersion,
      marketing_consent: customerData.marketingConsent,
      created_by: userId,
      updated_by: userId
    };
    
    // Insert customer record
    const { data: insertedCustomer, error: insertError } = await supabase
      .from('customers')
      .insert(newCustomer)
      .select('*')
      .single();
    
    if (insertError) {
      if (insertError.code === '23505') { // Unique violation
        throw new DuplicateCustomerError('customer', 'A customer with this information already exists');
      }
      throw insertError;
    }
    
    // Transform database record to API response format
    const customer: Customer = {
      id: insertedCustomer.id,
      tenantId: insertedCustomer.tenant_id,
      customerCode: insertedCustomer.customer_code,
      firstName: insertedCustomer.first_name,
      lastName: insertedCustomer.last_name,
      email: insertedCustomer.email,
      phone: insertedCustomer.phone,
      dateOfBirth: insertedCustomer.date_of_birth,
      nationality: insertedCustomer.nationality,
      preferredLanguage: insertedCustomer.preferred_language,
      address: insertedCustomer.address,
      idDocumentType: insertedCustomer.id_document_type,
      idDocumentNumber: SwissUtils.maskSensitiveData(insertedCustomer.id_document_number, 'id'),
      idDocumentExpiry: insertedCustomer.id_document_expiry,
      driverLicenseNumber: SwissUtils.maskSensitiveData(insertedCustomer.driver_license_number, 'id'),
      driverLicenseCountry: insertedCustomer.driver_license_country,
      driverLicenseExpiry: insertedCustomer.driver_license_expiry,
      driverLicenseCategory: insertedCustomer.driver_license_category,
      flags: insertedCustomer.flags || {},
      notes: insertedCustomer.notes,
      lifetimeValue: parseFloat(insertedCustomer.lifetime_value) || 0,
      totalRentals: insertedCustomer.total_rentals || 0,
      gdprConsentDate: insertedCustomer.gdpr_consent_date,
      gdprConsentVersion: insertedCustomer.gdpr_consent_version,
      marketingConsent: insertedCustomer.marketing_consent || false,
      dataRetentionExpiry: insertedCustomer.data_retention_expiry,
      createdAt: insertedCustomer.created_at,
      updatedAt: insertedCustomer.updated_at,
      createdBy: insertedCustomer.created_by,
      updatedBy: insertedCustomer.updated_by
    };
    
    const response: ApiResponse<Customer> = {
      success: true,
      data: customer,
      metadata: {
        executionTime: Date.now() - startTime
      }
    };
    
    return NextResponse.json(response, { status: 201 });
    
  } catch (error) {
    return createErrorResponse(error as Error);
  }
}

// Additional endpoint handlers would go here:
// - PUT /api/customers/[id] - Update customer
// - DELETE /api/customers/[id] - Delete customer (GDPR compliant)
// - GET /api/customers/[id] - Get single customer
// - POST /api/customers/[id]/documents - Upload documents
// - PUT /api/customers/[id]/flags - Update flags

export const runtime = 'edge'; // Use Edge Runtime for better performance
export const revalidate = 0; // Disable caching for dynamic data