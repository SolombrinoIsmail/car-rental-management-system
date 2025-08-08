/**
 * Form Components Index
 *
 * Exports all form-related components with Swiss localization support
 */

// Specialized Input Components
export {
  PasswordInput,
  EmailInput,
  PhoneInput,
  DateInput,
  TimeInput,
  AddressInput,
  PersonNameInput,
  FormField,
  FormSection,
} from './form-components';

// Component Types
export type {
  PasswordInputProps,
  EmailInputProps,
  PhoneInputProps,
  DateInputProps,
  TimeInputProps,
  AddressInputProps,
  PersonNameInputProps,
  FormFieldProps,
  FormSectionProps,
} from './form-components';

/**
 * Form validation patterns for Swiss market
 */
export const SWISS_VALIDATION_PATTERNS = {
  // Swiss postal code: 4 digits
  POSTAL_CODE: /^\d{4}$/,

  // Swiss phone numbers (mobile and landline)
  PHONE: {
    MOBILE: /^(\+41|0041|0)\s?7[56789]\s?\d{3}\s?\d{2}\s?\d{2}$/,
    LANDLINE: /^(\+41|0041|0)\s?[2-6]\d\s?\d{3}\s?\d{2}\s?\d{2}$/,
    ANY: /^(\+41|0041|0)\s?[2-9]\d\s?\d{3}\s?\d{2}\s?\d{2}$/,
  },

  // Swiss license plates
  LICENSE_PLATE: /^[A-Z]{2}\s?\d{1,6}$/,

  // Email validation (RFC 5322 compliant)
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Password strength (Swiss banking standards inspired)
  PASSWORD: {
    MIN_LENGTH: 8,
    STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  },
} as const;

/**
 * Form field configurations for Swiss market
 */
export const SWISS_FORM_CONFIG = {
  // Default country for phone input
  DEFAULT_COUNTRY: 'CH' as const,

  // Supported countries for address input
  SUPPORTED_COUNTRIES: ['CH', 'DE', 'AT', 'FR', 'IT'] as const,

  // Default locale
  DEFAULT_LOCALE: 'de-CH' as const,

  // Date formats
  DATE_FORMATS: {
    'de-CH': 'DD.MM.YYYY',
    'fr-CH': 'DD.MM.YYYY',
    'it-CH': 'DD.MM.YYYY',
  },

  // Time formats (24-hour format is standard in Switzerland)
  TIME_FORMAT: 'HH:mm',

  // Currency formatting
  CURRENCY: {
    CODE: 'CHF',
    SYMBOL: 'CHF',
    DECIMAL_PLACES: 2,
  },
} as const;

/**
 * Validation error messages in Swiss languages
 */
export const VALIDATION_MESSAGES = {
  'de-CH': {
    required: 'Dieses Feld ist erforderlich',
    invalidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    invalidPhone: 'Bitte geben Sie eine gültige Schweizer Telefonnummer ein',
    invalidPostalCode: 'Bitte geben Sie eine gültige Postleitzahl ein (4 Ziffern)',
    passwordTooWeak:
      'Das Passwort muss mindestens 8 Zeichen lang sein und Gross-/Kleinbuchstaben, Zahlen und Sonderzeichen enthalten',
    passwordMismatch: 'Die Passwörter stimmen nicht überein',
    invalidDate: 'Bitte geben Sie ein gültiges Datum ein',
    futureDateRequired: 'Das Datum muss in der Zukunft liegen',
    pastDateRequired: 'Das Datum muss in der Vergangenheit liegen',
  },
  'fr-CH': {
    required: 'Ce champ est obligatoire',
    invalidEmail: 'Veuillez entrer une adresse e-mail valide',
    invalidPhone: 'Veuillez entrer un numéro de téléphone suisse valide',
    invalidPostalCode: 'Veuillez entrer un code postal valide (4 chiffres)',
    passwordTooWeak:
      'Le mot de passe doit contenir au moins 8 caractères avec des majuscules, minuscules, chiffres et caractères spéciaux',
    passwordMismatch: 'Les mots de passe ne correspondent pas',
    invalidDate: 'Veuillez entrer une date valide',
    futureDateRequired: 'La date doit être dans le futur',
    pastDateRequired: 'La date doit être dans le passé',
  },
  'it-CH': {
    required: 'Questo campo è obbligatorio',
    invalidEmail: 'Inserisci un indirizzo e-mail valido',
    invalidPhone: 'Inserisci un numero di telefono svizzero valido',
    invalidPostalCode: 'Inserisci un codice postale valido (4 cifre)',
    passwordTooWeak:
      'La password deve contenere almeno 8 caratteri con maiuscole, minuscole, numeri e caratteri speciali',
    passwordMismatch: 'Le password non corrispondono',
    invalidDate: 'Inserisci una data valida',
    futureDateRequired: 'La data deve essere nel futuro',
    pastDateRequired: 'La data deve essere nel passato',
  },
} as const;

/**
 * Form accessibility configuration
 */
export const FORM_ACCESSIBILITY = {
  // ARIA labels for screen readers
  ARIA_LABELS: {
    required: 'Pflichtfeld',
    optional: 'Optional',
    showPassword: 'Passwort anzeigen',
    hidePassword: 'Passwort verstecken',
    selectDate: 'Datum auswählen',
    selectTime: 'Zeit auswählen',
  },

  // Error announcement settings
  ERROR_ANNOUNCEMENT: {
    LIVE_REGION: 'polite' as const,
    DELAY_MS: 500,
  },
} as const;
