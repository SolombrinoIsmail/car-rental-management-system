import { z } from 'zod';

// Swiss GDPR/FADP Compliance Module

// Data categories as per GDPR/FADP
export enum DataCategory {
  PERSONAL = 'personal',
  SENSITIVE = 'sensitive',
  FINANCIAL = 'financial',
  BEHAVIORAL = 'behavioral',
  TECHNICAL = 'technical',
}

// Legal basis for data processing
export enum LegalBasis {
  CONSENT = 'consent',
  CONTRACT = 'contract',
  LEGAL_OBLIGATION = 'legal_obligation',
  VITAL_INTERESTS = 'vital_interests',
  PUBLIC_TASK = 'public_task',
  LEGITIMATE_INTERESTS = 'legitimate_interests',
}

// Data retention periods (in days)
export const RETENTION_PERIODS = {
  [DataCategory.PERSONAL]: 365 * 10, // 10 years for Swiss legal requirements
  [DataCategory.SENSITIVE]: 365 * 7, // 7 years
  [DataCategory.FINANCIAL]: 365 * 10, // 10 years for Swiss tax law
  [DataCategory.BEHAVIORAL]: 365 * 2, // 2 years
  [DataCategory.TECHNICAL]: 90, // 3 months for logs
} as const;

// Consent management schema
export const ConsentSchema = z.object({
  userId: z.string(),
  purpose: z.string(),
  description: z.string(),
  legalBasis: z.nativeEnum(LegalBasis),
  dataCategories: z.array(z.nativeEnum(DataCategory)),
  granted: z.boolean(),
  grantedAt: z.date().nullable(),
  revokedAt: z.date().nullable(),
  expiresAt: z.date().nullable(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
});

export type Consent = z.infer<typeof ConsentSchema>;

// Data subject rights
export interface DataSubjectRights {
  access: boolean;
  rectification: boolean;
  erasure: boolean;
  portability: boolean;
  restriction: boolean;
  objection: boolean;
  automatedDecisionMaking: boolean;
}

// Privacy policy configuration
export interface PrivacyPolicy {
  version: string;
  effectiveDate: Date;
  dataController: {
    name: string;
    address: string;
    email: string;
    phone: string;
    registrationNumber: string; // Swiss company registration
  };
  dataProtectionOfficer?: {
    name: string;
    email: string;
    phone: string;
  };
  purposes: Array<{
    purpose: string;
    legalBasis: LegalBasis;
    dataCategories: DataCategory[];
    retention: number; // days
  }>;
  thirdParties: Array<{
    name: string;
    purpose: string;
    location: string; // Important for Swiss data residency
  }>;
  crossBorderTransfers: Array<{
    country: string;
    adequacyDecision: boolean;
    safeguards: string;
  }>;
}

// Data anonymization functions
export class DataAnonymizer {
  /**
   * Anonymize personal data for GDPR compliance
   */
  static anonymizePersonalData(data: Record<string, unknown>): Record<string, unknown> {
    return {
      ...data,
      firstName: 'ANONYMIZED',
      lastName: 'ANONYMIZED',
      email: this.anonymizeEmail(data.email),
      phone: this.anonymizePhone(data.phone),
      address: this.anonymizeAddress(data.address),
      dateOfBirth: null,
      driverLicense: 'ANONYMIZED',
      passport: 'ANONYMIZED',
    };
  }

  /**
   * Anonymize email while keeping domain for statistics
   */
  static anonymizeEmail(email?: string): string {
    if (!email) return 'ANONYMIZED';
    const [, domain] = email.split('@');
    return `anonymized@${domain || 'example.com'}`;
  }

  /**
   * Anonymize phone while keeping country code
   */
  static anonymizePhone(phone?: string): string {
    if (!phone) return 'ANONYMIZED';
    if (phone.startsWith('+41')) {
      return '+41 XX XXX XX XX';
    }
    return 'ANONYMIZED';
  }

  /**
   * Anonymize address while keeping canton for statistics
   */
  static anonymizeAddress(address?: { canton?: string }): Record<string, unknown> {
    if (!address) return { street: 'ANONYMIZED' };
    return {
      street: 'ANONYMIZED',
      city: 'ANONYMIZED',
      postalCode: 'XXXX',
      canton: address.canton, // Keep canton for Swiss statistics
      country: 'CH',
    };
  }

  /**
   * Pseudonymize data (reversible with key)
   */
  static pseudonymize(data: string, key: string): string {
    // Simple pseudonymization - in production, use proper encryption
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const crypto = require('crypto');
    const hash = crypto.createHmac('sha256', key);
    hash.update(data);
    return hash.digest('hex').substring(0, 16);
  }
}

// Data portability formatter
export class DataPortability {
  /**
   * Export user data in machine-readable format (JSON)
   */
  static exportUserData(userData: Record<string, unknown>): string {
    const exportData = {
      exportDate: new Date().toISOString(),
      format: 'JSON',
      version: '1.0',
      dataSubject: userData.id,
      personalData: this.filterPersonalData(userData),
      consent: userData.consents,
      processingHistory: userData.processingHistory,
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Export user data in CSV format
   */
  static exportUserDataCSV(userData: Record<string, unknown>): string {
    // Implementation for CSV export
    const headers = Object.keys(userData).join(',');
    const values = Object.values(userData).map(v => 
      typeof v === 'object' ? JSON.stringify(v) : v
    ).join(',');
    
    return `${headers}\n${values}`;
  }

  private static filterPersonalData(data: Record<string, unknown>): Record<string, unknown> {
    const personalFields = [
      'id', 'firstName', 'lastName', 'email', 'phone',
      'dateOfBirth', 'address', 'driverLicense', 'passport',
      'createdAt', 'updatedAt'
    ];

    const filtered: Record<string, unknown> = {};
    personalFields.forEach(field => {
      if (data[field] !== undefined) {
        filtered[field] = data[field];
      }
    });

    return filtered;
  }
}

// Audit logging for GDPR compliance
export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  dataCategory: DataCategory;
  affectedData: string[];
  legalBasis: LegalBasis;
  purpose: string;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failure';
  metadata?: Record<string, unknown>;
}

// Swiss-specific compliance checks
export class SwissCompliance {
  /**
   * Validate Swiss phone number
   */
  static validateSwissPhone(phone: string): boolean {
    const swissPhoneRegex = /^(\+41|0041|0)?[1-9]\d{8}$/;
    return swissPhoneRegex.test(phone.replace(/\s/g, ''));
  }

  /**
   * Validate Swiss postal code
   */
  static validateSwissPostalCode(code: string): boolean {
    const postalCode = parseInt(code, 10);
    return postalCode >= 1000 && postalCode <= 9999;
  }

  /**
   * Get Swiss canton from postal code
   */
  static getCantonFromPostalCode(code: string): string | null {
    const postalCode = parseInt(code, 10);
    
    // Simplified mapping - in production, use complete database
    const cantonRanges: Record<string, [number, number][]> = {
      'ZH': [[8000, 8999]],
      'BE': [[3000, 3999]],
      'LU': [[6000, 6999]],
      'GE': [[1200, 1299]],
      'VS': [[1900, 1999], [3900, 3999]],
      // Add more cantons
    };

    for (const [canton, ranges] of Object.entries(cantonRanges)) {
      for (const [min, max] of ranges) {
        if (postalCode >= min && postalCode <= max) {
          return canton;
        }
      }
    }

    return null;
  }

  /**
   * Validate Swiss ID documents
   */
  static validateSwissDocument(type: string, number: string): boolean {
    switch (type) {
      case 'passport':
        return /^[A-Z][0-9]{7}$/.test(number);
      case 'id_card':
        return /^[A-Z][0-9]{7}$/.test(number);
      case 'driver_license':
        return /^[0-9]{6,}$/.test(number);
      default:
        return false;
    }
  }
}