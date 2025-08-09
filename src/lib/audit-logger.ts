import { z } from 'zod';
import type { DataCategory, LegalBasis } from './gdpr-compliance';

// Audit event types
export enum AuditEventType {
  // Authentication events
  LOGIN = 'auth.login',
  LOGOUT = 'auth.logout',
  LOGIN_FAILED = 'auth.login_failed',
  PASSWORD_RESET = 'auth.password_reset',
  MFA_ENABLED = 'auth.mfa_enabled',
  
  // Data access events
  DATA_ACCESS = 'data.access',
  DATA_EXPORT = 'data.export',
  DATA_DOWNLOAD = 'data.download',
  
  // Data modification events
  DATA_CREATE = 'data.create',
  DATA_UPDATE = 'data.update',
  DATA_DELETE = 'data.delete',
  DATA_ANONYMIZE = 'data.anonymize',
  
  // Consent events
  CONSENT_GRANTED = 'consent.granted',
  CONSENT_REVOKED = 'consent.revoked',
  CONSENT_UPDATED = 'consent.updated',
  
  // Admin events
  ADMIN_ACCESS = 'admin.access',
  ADMIN_MODIFY = 'admin.modify',
  CONFIG_CHANGE = 'admin.config_change',
  
  // Security events
  SECURITY_ALERT = 'security.alert',
  PERMISSION_DENIED = 'security.permission_denied',
  RATE_LIMIT_EXCEEDED = 'security.rate_limit',
  
  // Business events
  CONTRACT_CREATED = 'business.contract_created',
  CONTRACT_SIGNED = 'business.contract_signed',
  PAYMENT_PROCESSED = 'business.payment_processed',
  VEHICLE_RESERVED = 'business.vehicle_reserved',
}

// Audit log severity levels
export enum AuditSeverity {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

// Audit log entry schema
export const AuditLogSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.date(),
  eventType: z.nativeEnum(AuditEventType),
  severity: z.nativeEnum(AuditSeverity),
  
  // Actor information
  userId: z.string().nullable(),
  userEmail: z.string().email().nullable(),
  userRole: z.string().nullable(),
  sessionId: z.string().nullable(),
  
  // Request context
  ipAddress: z.string().ip().nullable(),
  userAgent: z.string().nullable(),
  requestId: z.string().uuid().nullable(),
  requestMethod: z.string().nullable(),
  requestPath: z.string().nullable(),
  
  // Event details
  resourceType: z.string().nullable(),
  resourceId: z.string().nullable(),
  action: z.string(),
  result: z.enum(['success', 'failure', 'partial']),
  errorMessage: z.string().nullable(),
  
  // GDPR compliance
  dataCategory: z.string().nullable(), // DataCategory enum
  legalBasis: z.string().nullable(), // LegalBasis enum
  affectedFields: z.array(z.string()).nullable(),
  
  // Metadata
  metadata: z.record(z.any()).nullable(),
  
  // Swiss compliance
  canton: z.string().nullable(),
  organizationId: z.string().nullable(),
});

export type AuditLog = z.infer<typeof AuditLogSchema>;

// Audit logger service
export class AuditLogger {
  private static instance: AuditLogger;
  private logs: AuditLog[] = [];
  private batchSize = 100;
  private flushInterval = 5000; // 5 seconds
  private flushTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.startAutoFlush();
  }

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  /**
   * Log an audit event
   */
  async log(params: Partial<AuditLog> & { eventType: AuditEventType; action: string }): Promise<void> {
    const log: AuditLog = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      severity: AuditSeverity.INFO,
      result: 'success',
      userId: null,
      userEmail: null,
      userRole: null,
      sessionId: null,
      ipAddress: null,
      userAgent: null,
      requestId: null,
      requestMethod: null,
      requestPath: null,
      resourceType: null,
      resourceId: null,
      errorMessage: null,
      dataCategory: null,
      legalBasis: null,
      affectedFields: null,
      metadata: null,
      canton: null,
      organizationId: null,
      ...params,
    };

    // Validate log entry
    try {
      AuditLogSchema.parse(log);
    } catch (error) {
      console.error('Invalid audit log entry:', error);
      return;
    }

    // Add to buffer
    this.logs.push(log);

    // Flush if batch size reached
    if (this.logs.length >= this.batchSize) {
      await this.flush();
    }
  }

  /**
   * Log a security event
   */
  async logSecurity(
    eventType: AuditEventType,
    message: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await this.log({
      eventType,
      action: message,
      severity: AuditSeverity.WARNING,
      metadata,
    });
  }

  /**
   * Log a GDPR-related event
   */
  async logGDPR(
    eventType: AuditEventType,
    userId: string,
    dataCategory: DataCategory,
    legalBasis: LegalBasis,
    affectedFields: string[],
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await this.log({
      eventType,
      action: `GDPR event: ${eventType}`,
      userId,
      dataCategory,
      legalBasis,
      affectedFields,
      severity: AuditSeverity.INFO,
      metadata,
    });
  }

  /**
   * Log an authentication event
   */
  async logAuth(
    eventType: AuditEventType,
    userId: string | null,
    success: boolean,
    ipAddress?: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await this.log({
      eventType,
      action: `Authentication: ${eventType}`,
      userId,
      ipAddress: ipAddress || null,
      result: success ? 'success' : 'failure',
      severity: success ? AuditSeverity.INFO : AuditSeverity.WARNING,
      metadata,
    });
  }

  /**
   * Log a business event
   */
  async logBusiness(
    eventType: AuditEventType,
    userId: string,
    resourceType: string,
    resourceId: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await this.log({
      eventType,
      action: `Business operation: ${eventType}`,
      userId,
      resourceType,
      resourceId,
      severity: AuditSeverity.INFO,
      metadata,
    });
  }

  /**
   * Flush logs to storage
   */
  private async flush(): Promise<void> {
    if (this.logs.length === 0) return;

    const logsToFlush = [...this.logs];
    this.logs = [];

    try {
      // In production, send to persistent storage (database, S3, etc.)
      if (process.env.NODE_ENV === 'production') {
        await this.persistLogs(logsToFlush);
      } else {
        // In development, just log to console
        console.log('Audit logs:', logsToFlush);
      }
    } catch (error) {
      console.error('Failed to flush audit logs:', error);
      // Re-add logs to buffer for retry
      this.logs.unshift(...logsToFlush);
    }
  }

  /**
   * Persist logs to storage
   */
  private async persistLogs(logs: AuditLog[]): Promise<void> {
    // TODO: Implement actual persistence
    // Options:
    // 1. Supabase table
    // 2. S3 bucket (for compliance)
    // 3. Specialized audit log service
    // 4. Swiss-compliant storage solution
    
    // For now, we'll prepare the data structure
    const batch = {
      timestamp: new Date().toISOString(),
      count: logs.length,
      logs: logs.map(log => ({
        ...log,
        timestamp: log.timestamp.toISOString(),
      })),
    };

    // Send to storage
    console.log('Persisting audit logs:', batch);
  }

  /**
   * Start auto-flush timer
   */
  private startAutoFlush(): void {
    this.flushTimer = setInterval(() => {
      this.flush().catch(console.error);
    }, this.flushInterval);
  }

  /**
   * Stop auto-flush timer
   */
  stopAutoFlush(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  /**
   * Query audit logs (for compliance reporting)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async query(_filters: {
    startDate?: Date;
    endDate?: Date;
    userId?: string;
    eventType?: AuditEventType;
    severity?: AuditSeverity;
    limit?: number;
  }): Promise<AuditLog[]> {
    // TODO: Implement actual query from storage
    // This would query the persistent storage
    
    return [];
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(
    startDate: Date,
    endDate: Date
  ): Promise<{
    summary: Record<string, number>;
    events: AuditLog[];
  }> {
    const events = await this.query({ startDate, endDate });
    
    const summary: Record<string, number> = {};
    events.forEach(event => {
      summary[event.eventType] = (summary[event.eventType] || 0) + 1;
    });

    return { summary, events };
  }
}

// Export singleton instance
export const auditLogger = AuditLogger.getInstance();