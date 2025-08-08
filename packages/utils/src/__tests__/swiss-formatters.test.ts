import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatPhoneNumber } from '../index';

describe('Swiss Formatters', () => {
  describe('formatCurrency', () => {
    it('should format price in Swiss Francs', () => {
      expect(formatCurrency(100)).toBe('CHF\u00a0100.00'); // \u00a0 is non-breaking space
      expect(formatCurrency(1234.56)).toBe('CHF\u00a01\u2019234.56'); // \u2019 is right single quotation mark
      expect(formatCurrency(0)).toBe('CHF\u00a00.00');
    });

    it('should handle large amounts', () => {
      expect(formatCurrency(1000000)).toBe('CHF\u00a01\u2019000\u2019000.00');
    });

    it('should handle decimal places correctly', () => {
      expect(formatCurrency(123.45)).toBe('CHF\u00a0123.45');
      expect(formatCurrency(123.456)).toBe('CHF\u00a0123.46'); // rounds to 2 decimals
    });
  });

  describe('formatDate', () => {
    it('should format dates in Swiss format (d.m.yyyy)', () => {
      expect(formatDate(new Date('2024-01-15'))).toBe('15.1.2024');
      expect(formatDate(new Date('2024-12-31'))).toBe('31.12.2024');
    });

    it('should handle different date inputs', () => {
      expect(formatDate('2024-01-15')).toBe('15.1.2024');
      expect(formatDate(new Date(2024, 0, 15))).toBe('15.1.2024');
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format Swiss mobile numbers correctly', () => {
      expect(formatPhoneNumber('0791234567')).toBe('+41 079 123 45 67');
      expect(formatPhoneNumber('41791234567')).toBe('+41 079 123 45 67');
      expect(formatPhoneNumber('0781234567')).toBe('+41 078 123 45 67');
      expect(formatPhoneNumber('0761234567')).toBe('+41 076 123 45 67');
      expect(formatPhoneNumber('0771234567')).toBe('+41 077 123 45 67');
    });

    it('should format Swiss landline numbers correctly', () => {
      expect(formatPhoneNumber('0443456789')).toBe('+41 44 345 67 89'); // Zurich
      expect(formatPhoneNumber('0213456789')).toBe('+41 21 345 67 89'); // Lausanne
      expect(formatPhoneNumber('0313456789')).toBe('+41 31 345 67 89'); // Bern
    });

    it('should handle numbers with country code', () => {
      expect(formatPhoneNumber('+41791234567')).toBe('+41 079 123 45 67');
      expect(formatPhoneNumber('+41443456789')).toBe('+41 44 345 67 89');
    });

    it('should handle already formatted numbers', () => {
      expect(formatPhoneNumber('+41 79 123 45 67')).toBe('+41 079 123 45 67');
      expect(formatPhoneNumber('+41 44 345 67 89')).toBe('+41 44 345 67 89');
    });

    it('should return invalid numbers as-is', () => {
      expect(formatPhoneNumber('123')).toBe('123');
      expect(formatPhoneNumber('invalid')).toBe('invalid');
      expect(formatPhoneNumber('+1234567890')).toBe('+1234567890'); // US number
    });
  });
});
