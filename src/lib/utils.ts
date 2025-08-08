import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with clsx
 * This is the foundation for all component styling in our system
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency for Swiss market (CHF)
 */
export function formatCurrency(
  amount: number,
  currency: string = 'CHF',
  locale: string = 'de-CH',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date for Swiss locales
 */
export function formatDate(
  date: Date | string | number,
  locale: string = 'de-CH',
  options?: Intl.DateTimeFormatOptions,
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat(locale, defaultOptions).format(new Date(date));
}

/**
 * Generate initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

/**
 * Generate a random ID
 */
export function generateId(prefix?: string): string {
  const id = Math.random().toString(36).substr(2, 9);
  return prefix ? `${prefix}-${id}` : id;
}

/**
 * Validate Swiss license plate format
 */
export function isValidSwissLicensePlate(plate: string): boolean {
  // Swiss format: 2 letters + up to 6 digits (e.g., ZH 123456)
  const swissPlateRegex = /^[A-Z]{2}\s?\d{1,6}$/;
  return swissPlateRegex.test(plate.toUpperCase());
}

/**
 * Validate Swiss postal code
 */
export function isValidSwissPostalCode(code: string): boolean {
  // Swiss postal codes are 4 digits
  const swissPostalRegex = /^\d{4}$/;
  return swissPostalRegex.test(code);
}

/**
 * Get Swiss cantons
 */
export const SWISS_CANTONS = [
  { code: 'AG', name: 'Aargau' },
  { code: 'AI', name: 'Appenzell Innerrhoden' },
  { code: 'AR', name: 'Appenzell Ausserrhoden' },
  { code: 'BE', name: 'Bern' },
  { code: 'BL', name: 'Basel-Landschaft' },
  { code: 'BS', name: 'Basel-Stadt' },
  { code: 'FR', name: 'Fribourg' },
  { code: 'GE', name: 'Geneva' },
  { code: 'GL', name: 'Glarus' },
  { code: 'GR', name: 'Graubünden' },
  { code: 'JU', name: 'Jura' },
  { code: 'LU', name: 'Lucerne' },
  { code: 'NE', name: 'Neuchâtel' },
  { code: 'NW', name: 'Nidwalden' },
  { code: 'OW', name: 'Obwalden' },
  { code: 'SG', name: 'St. Gallen' },
  { code: 'SH', name: 'Schaffhausen' },
  { code: 'SO', name: 'Solothurn' },
  { code: 'SZ', name: 'Schwyz' },
  { code: 'TG', name: 'Thurgau' },
  { code: 'TI', name: 'Ticino' },
  { code: 'UR', name: 'Uri' },
  { code: 'VD', name: 'Vaud' },
  { code: 'VS', name: 'Valais' },
  { code: 'ZG', name: 'Zug' },
  { code: 'ZH', name: 'Zürich' },
] as const;

/**
 * Get Swiss languages
 */
export const SWISS_LANGUAGES = [
  { code: 'de-CH', name: 'Deutsch (Schweiz)' },
  { code: 'fr-CH', name: 'Français (Suisse)' },
  { code: 'it-CH', name: 'Italiano (Svizzera)' },
  { code: 'rm-CH', name: 'Rumantsch' },
] as const;

/**
 * Get theme-aware classes
 */
export function getThemeAwareClasses(lightClasses: string, darkClasses: string) {
  return `${lightClasses} dark:${darkClasses}`;
}

/**
 * Handle async operations with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorMessage?: string,
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    console.error(errorMessage || 'Operation failed:', error);
    return null;
  }
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
}

/**
 * Convert bytes to human readable format
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
