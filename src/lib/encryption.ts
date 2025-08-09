import crypto from 'crypto';

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const IV_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

export class EncryptionService {
  private key: Buffer;

  constructor(masterKey: string) {
    // Derive key from master key using PBKDF2
    const salt = crypto.randomBytes(SALT_LENGTH);
    this.key = crypto.pbkdf2Sync(masterKey, salt, ITERATIONS, KEY_LENGTH, 'sha256');
  }

  /**
   * Encrypt sensitive data (AES-256-GCM)
   */
  encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, this.key, iv);

    const encrypted = Buffer.concat([
      cipher.update(text, 'utf8'),
      cipher.final(),
    ]);

    const tag = cipher.getAuthTag();

    // Combine iv, tag, and encrypted data
    const combined = Buffer.concat([iv, tag, encrypted]);
    return combined.toString('base64');
  }

  /**
   * Decrypt sensitive data
   */
  decrypt(encryptedData: string): string {
    const combined = Buffer.from(encryptedData, 'base64');

    // Extract components
    const iv = combined.slice(0, IV_LENGTH);
    const tag = combined.slice(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const encrypted = combined.slice(IV_LENGTH + TAG_LENGTH);

    const decipher = crypto.createDecipheriv(ALGORITHM, this.key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  }

  /**
   * Hash sensitive data (one-way)
   */
  hash(data: string): string {
    return crypto
      .createHash('sha256')
      .update(data)
      .digest('hex');
  }

  /**
   * Generate secure random token
   */
  generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Mask sensitive data for display
   */
  mask(data: string, visibleChars: number = 4): string {
    if (data.length <= visibleChars) {
      return '*'.repeat(data.length);
    }
    const visible = data.slice(-visibleChars);
    const masked = '*'.repeat(data.length - visibleChars);
    return masked + visible;
  }

  /**
   * Encrypt PII data with field-level encryption
   */
  encryptPII(data: Record<string, unknown>): Record<string, unknown> {
    const piiFields = [
      'email',
      'phone',
      'ssn',
      'driverLicense',
      'passport',
      'creditCard',
      'bankAccount',
      'dateOfBirth',
      'address',
    ];

    const encrypted = { ...data };

    for (const field of piiFields) {
      if (encrypted[field]) {
        encrypted[field] = this.encrypt(encrypted[field]);
        encrypted[`${field}_masked`] = this.mask(data[field]);
      }
    }

    return encrypted;
  }

  /**
   * Decrypt PII data
   */
  decryptPII(data: Record<string, unknown>): Record<string, unknown> {
    const decrypted = { ...data };
    const piiFields = Object.keys(data).filter(key => !key.endsWith('_masked'));

    for (const field of piiFields) {
      if (decrypted[field] && typeof decrypted[field] === 'string') {
        try {
          decrypted[field] = this.decrypt(decrypted[field]);
        } catch {
          // Field might not be encrypted
        }
      }
    }

    return decrypted;
  }
}

// Export singleton instance
let encryptionService: EncryptionService | null = null;

export function getEncryptionService(): EncryptionService {
  if (!encryptionService) {
    const masterKey = process.env['ENCRYPTION_KEY'] || 'development-key-change-in-production';
    encryptionService = new EncryptionService(masterKey);
  }
  return encryptionService;
}

// Helper functions for common operations
export const encrypt = (text: string) => getEncryptionService().encrypt(text);
export const decrypt = (text: string) => getEncryptionService().decrypt(text);
export const hash = (text: string) => getEncryptionService().hash(text);
export const generateToken = (length?: number) => getEncryptionService().generateToken(length);
export const mask = (text: string, visibleChars?: number) => getEncryptionService().mask(text, visibleChars);