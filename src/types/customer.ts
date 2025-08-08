/**
 * Customer Management Foundation - TypeScript Definitions
 * Epic 1 Story 1: Customer Management Foundation
 * Swiss Car Rental Management System
 */

// Swiss-specific ID document types
export type SwissIdDocumentType =
  | 'swiss_passport'
  | 'swiss_id_card'
  | 'residence_permit_b'
  | 'residence_permit_c'
  | 'residence_permit_l'
  | 'residence_permit_f'
  | 'eu_passport'
  | 'other_passport';

// Swiss address structure
export interface SwissAddress {
  street: string;
  houseNumber: string;
  postalCode: string; // Swiss postal codes: 1000-9999
  city: string;
  canton: string; // Two-letter Swiss canton code
  country: string; // ISO 3166-1 alpha-2
}

// Customer risk flags for rental decisions
export interface CustomerFlags {
  blacklisted?: boolean;
  vip?: boolean;
  paymentRisk?: boolean;
  damageRisk?: boolean;
  specialNeeds?: boolean;
  requiresDeposit?: boolean;
}

// Document types for customer verification
export type CustomerDocumentType =
  | 'id_front'
  | 'id_back'
  | 'license_front'
  | 'license_back'
  | 'passport'
  | 'passport_back'
  | 'proof_of_address'
  | 'credit_card'
  | 'other';

// Document processing result from Supabase Storage
export interface DocumentUploadResult {
  fileUrl: string;
  thumbnailUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

// Customer document with metadata
export interface CustomerDocument {
  id: string;
  customerId: string;
  documentType: CustomerDocumentType;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  thumbnailUrl?: string;
  thumbnailSmallUrl?: string;
  thumbnailMediumUrl?: string;
  expiryDate?: string; // ISO 8601 date
  verifiedAt?: string; // ISO 8601 datetime
  verifiedBy?: string; // User ID
  verificationNotes?: string;
  extractedData?: Record<string, unknown>; // OCR data
  extractionConfidence?: number; // 0.00-1.00
  createdAt: string;
  updatedAt: string;
  uploadedBy?: string;
}

// Customer risk history for audit trail
export interface CustomerRiskHistory {
  id: string;
  customerId: string;
  riskType:
    | 'blacklist'
    | 'payment_risk'
    | 'damage_risk'
    | 'vip'
    | 'special_needs'
    | 'requires_deposit'
    | 'credit_check'
    | 'police_check';
  action: 'added' | 'removed' | 'modified' | 'expired';
  reason: string;
  expiryDate?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  requiresApproval: boolean;
  approvedAt?: string;
  approvedBy?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvalNotes?: string;
  createdAt: string;
  createdBy: string;
}

// Core Customer data structure
export interface Customer {
  id: string;
  tenantId: string;
  customerCode: string;

  // Personal Information
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  dateOfBirth: string; // ISO 8601 date
  nationality: string; // ISO 3166-1 alpha-3
  preferredLanguage: string; // RFC 5646 language tag

  // Address
  address: SwissAddress;

  // Swiss ID Documentation
  idDocumentType: SwissIdDocumentType;
  idDocumentNumber: string; // May be masked for security
  idDocumentExpiry?: string;

  // Driver License
  driverLicenseNumber: string; // May be masked for security
  driverLicenseCountry: string;
  driverLicenseExpiry: string;
  driverLicenseCategory: Record<string, boolean>; // Swiss license categories

  // Risk Management
  flags: CustomerFlags;
  blacklistReason?: string;
  blacklistExpiry?: string;
  blacklistApprovedBy?: string;
  blacklistApprovedAt?: string;

  // Business Metrics
  notes?: string;
  lifetimeValue: number;
  totalRentals: number;

  // GDPR/FADP Compliance
  gdprConsentDate?: string;
  gdprConsentVersion?: string;
  marketingConsent: boolean;
  dataRetentionExpiry?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;

  // Optional related data
  documents?: CustomerDocument[];
  riskHistory?: CustomerRiskHistory[];
  recentRentals?: RentalSummary[];
}

// Customer creation request payload
export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  dateOfBirth: string;
  nationality?: string;
  preferredLanguage?: string;
  address: SwissAddress;
  idDocumentType: SwissIdDocumentType;
  idDocumentNumber: string;
  idDocumentExpiry?: string;
  driverLicenseNumber: string;
  driverLicenseCountry?: string;
  driverLicenseExpiry: string;
  driverLicenseCategory?: Record<string, boolean>;
  notes?: string;
  gdprConsentDate: string;
  gdprConsentVersion: string;
  marketingConsent?: boolean;
}

// Customer update request payload
export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {
  id: string;
}

// Customer search parameters
export interface CustomerSearchQuery {
  q: string; // Search query
  limit?: number; // Default 20, max 50
  offset?: number; // For pagination
  includeFlags?: boolean; // Include sensitive flag information
  sortBy?: 'name' | 'created' | 'updated' | 'lifetime_value';
  sortOrder?: 'asc' | 'desc';
  filters?: {
    vip?: boolean;
    blacklisted?: boolean;
    hasFlags?: boolean;
    country?: string;
    canton?: string;
  };
}

// Customer search result
export interface CustomerSearchResult {
  customers: Customer[];
  total: number;
  hasMore: boolean;
  facets?: {
    countries: Array<{ code: string; count: number }>;
    cantons: Array<{ code: string; count: number }>;
    flags: Array<{ type: string; count: number }>;
  };
}

// Rental summary for customer history
export interface RentalSummary {
  id: string;
  contractNumber: string;
  startDate: string;
  endDate: string;
  vehicleModel: string;
  vehiclePlate: string;
  totalAmount: number;
  status: 'active' | 'completed' | 'overdue' | 'cancelled';
  daysPastDue?: number;
  outstandingBalance: number;
}

// Customer statistics for dashboard
export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  vipCustomers: number;
  blacklistedCustomers: number;
  newThisMonth: number;
  averageLifetimeValue: number;
  expiringDocuments: number; // Next 30 days
  pendingApprovals: number;
}

// Document expiry warning
export interface DocumentExpiryWarning {
  customerId: string;
  customerName: string;
  documentType: CustomerDocumentType;
  expiryDate: string;
  daysUntilExpiry: number;
  severity: 'warning' | 'critical' | 'expired';
}

// Customer flag update request
export interface CustomerFlagUpdate {
  customerId: string;
  flagType: keyof CustomerFlags;
  action: 'add' | 'remove';
  reason: string;
  expiry?: string; // ISO 8601 datetime
  severity?: 'low' | 'medium' | 'high' | 'critical';
  requiresApproval?: boolean;
}

// Manager approval request
export interface ManagerApprovalRequest {
  requestId: string;
  customerId: string;
  requestType: 'blacklist' | 'flag_change' | 'data_deletion';
  reason: string;
  requestedBy: string;
  requestedAt: string;
  details: Record<string, unknown>;
}

// Swiss phone number validation
export const SWISS_PHONE_REGEX = /^(\+41[0-9]{9}|0[79][0-9]{8})$/;

// Swiss postal code validation
export const SWISS_POSTAL_REGEX = /^[1-9][0-9]{3}$/;

// Swiss ID document format validators
export const SWISS_ID_VALIDATORS = {
  swiss_passport: /^[A-Z][0-9]{7}$/,
  swiss_id_card: /^[0-9]{8}$/,
  residence_permit_b: /^B[0-9]{8}$/,
  residence_permit_c: /^C[0-9]{8}$/,
  residence_permit_l: /^L[0-9]{8}$/,
  residence_permit_f: /^F[0-9]{8}$/,
} as const;

// Swiss cantons for address validation
export const SWISS_CANTONS = [
  'AG',
  'AR',
  'AI',
  'BL',
  'BS',
  'BE',
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
  'SZ',
  'SO',
  'TG',
  'TI',
  'UR',
  'VD',
  'VS',
  'ZG',
  'ZH',
] as const;

export type SwissCanton = (typeof SWISS_CANTONS)[number];

// Error types for customer management
export class CustomerValidationError extends Error {
  constructor(
    public field: string,
    message: string,
  ) {
    super(`Invalid ${field}: ${message}`);
    this.name = 'CustomerValidationError';
  }
}

export class CustomerNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Customer not found: ${identifier}`);
    this.name = 'CustomerNotFoundError';
  }
}

export class DuplicateCustomerError extends Error {
  constructor(field: string, value: string) {
    super(`Duplicate customer found with ${field}: ${value}`);
    this.name = 'DuplicateCustomerError';
  }
}

export class DocumentProcessingError extends Error {
  constructor(
    message: string,
    public originalError?: Error,
  ) {
    super(`Document processing failed: ${message}`);
    this.name = 'DocumentProcessingError';
  }
}

// API response wrapper for error handling
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    field?: string;
  };
  metadata?: {
    total?: number;
    page?: number;
    limit?: number;
    executionTime?: number;
  };
}

// Customer service interface for dependency injection
export interface CustomerServiceInterface {
  searchCustomers(query: CustomerSearchQuery): Promise<CustomerSearchResult>;
  getCustomer(id: string): Promise<Customer | null>;
  createCustomer(data: CreateCustomerRequest): Promise<Customer>;
  updateCustomer(data: UpdateCustomerRequest): Promise<Customer>;
  deleteCustomer(id: string): Promise<void>;
  uploadDocument(
    customerId: string,
    file: File,
    documentType: CustomerDocumentType,
  ): Promise<CustomerDocument>;
  updateCustomerFlag(update: CustomerFlagUpdate): Promise<Customer>;
  getCustomerStats(): Promise<CustomerStats>;
  getExpiringDocuments(days?: number): Promise<DocumentExpiryWarning[]>;
}

// Swiss compliance utilities
export const SwissUtils = {
  validatePhone: (phone: string): boolean => SWISS_PHONE_REGEX.test(phone),
  validatePostalCode: (code: string): boolean => SWISS_POSTAL_REGEX.test(code),
  validateIdDocument: (type: SwissIdDocumentType, number: string): boolean => {
    const validator = SWISS_ID_VALIDATORS[type as keyof typeof SWISS_ID_VALIDATORS];
    return validator ? validator.test(number) : false;
  },
  formatPhone: (phone: string): string => {
    // Convert Swiss phone to +41 format
    if (phone.startsWith('0')) {
      return `+41${phone.substring(1)}`;
    }
    return phone;
  },
  maskSensitiveData: (data: string, type: 'email' | 'phone' | 'id'): string => {
    switch (type) {
      case 'email':
        return data.replace(/(.{2}).*@(.*)\.(.{2,})/, '$1***@$2.$3');
      case 'phone':
        return data.replace(/(.{3}).*(.{2})/, '$1****$2');
      case 'id':
        return data.replace(/(.{2}).*(.{2})/, '$1****$2');
      default:
        return '***MASKED***';
    }
  },
} as const;
