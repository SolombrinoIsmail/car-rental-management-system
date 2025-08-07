# Swiss Localization Architecture (DE/FR/IT)

## Architecture Decision Record (ADR-005): Multi-Language Support

### Status: Accepted
### Date: 2025-08-07
### Context: Swiss market requires German, French, and Italian language support with cultural considerations

## Internationalization Architecture

### 1. Locale Configuration

```typescript
// src/i18n/config/index.ts
export const supportedLocales = ['de-CH', 'fr-CH', 'it-CH', 'en-US'] as const
export type SupportedLocale = typeof supportedLocales[number]

export const localeConfig = {
  'de-CH': {
    name: 'Deutsch (Schweiz)',
    shortName: 'DE',
    direction: 'ltr' as const,
    dateFormat: 'dd.MM.yyyy',
    timeFormat: 'HH:mm',
    currency: 'CHF',
    currencySymbol: 'CHF',
    numberFormat: {
      decimal: ',',
      thousands: "'"
    },
    firstDayOfWeek: 1, // Monday
    region: 'CH'
  },
  'fr-CH': {
    name: 'Français (Suisse)',
    shortName: 'FR',
    direction: 'ltr' as const,
    dateFormat: 'dd.MM.yyyy',
    timeFormat: 'HH:mm',
    currency: 'CHF',
    currencySymbol: 'CHF',
    numberFormat: {
      decimal: ',',
      thousands: ' '
    },
    firstDayOfWeek: 1, // Monday
    region: 'CH'
  },
  'it-CH': {
    name: 'Italiano (Svizzera)',
    shortName: 'IT',
    direction: 'ltr' as const,
    dateFormat: 'dd.MM.yyyy',
    timeFormat: 'HH:mm',
    currency: 'CHF',
    currencySymbol: 'CHF',
    numberFormat: {
      decimal: ',',
      thousands: "'"
    },
    firstDayOfWeek: 1, // Monday
    region: 'CH'
  },
  'en-US': {
    name: 'English (US)',
    shortName: 'EN',
    direction: 'ltr' as const,
    dateFormat: 'MM/dd/yyyy',
    timeFormat: 'h:mm a',
    currency: 'CHF',
    currencySymbol: 'CHF',
    numberFormat: {
      decimal: '.',
      thousands: ','
    },
    firstDayOfWeek: 0, // Sunday
    region: 'CH'
  }
} as const

export const defaultLocale: SupportedLocale = 'de-CH'

// Browser locale detection
export const detectLocale = (): SupportedLocale => {
  if (typeof window === 'undefined') return defaultLocale
  
  const browserLocales = navigator.languages || [navigator.language]
  
  for (const browserLocale of browserLocales) {
    // Exact match
    if (supportedLocales.includes(browserLocale as SupportedLocale)) {
      return browserLocale as SupportedLocale
    }
    
    // Language match (e.g., 'de' -> 'de-CH')
    const languageCode = browserLocale.split('-')[0]
    const matchingLocale = supportedLocales.find(locale => 
      locale.startsWith(languageCode)
    )
    if (matchingLocale) {
      return matchingLocale
    }
  }
  
  return defaultLocale
}
```

### 2. Translation Management

```typescript
// src/i18n/translations/index.ts
interface Translations {
  common: {
    navigation: {
      home: string
      vehicles: string
      bookings: string
      about: string
      contact: string
    }
    actions: {
      submit: string
      cancel: string
      save: string
      delete: string
      edit: string
      view: string
      book_now: string
      search: string
      filter: string
      sort: string
      reset: string
    }
    status: {
      available: string
      unavailable: string
      booked: string
      maintenance: string
      confirmed: string
      pending: string
      cancelled: string
    }
    feedback: {
      success: string
      error: string
      warning: string
      info: string
      loading: string
    }
    time: {
      today: string
      yesterday: string
      tomorrow: string
      days: string[]
      months: string[]
    }
  }
  booking: {
    form: {
      title: string
      personal_info: {
        title: string
        first_name: string
        last_name: string
        email: string
        phone: string
        date_of_birth: string
        license_number: string
      }
      rental_details: {
        title: string
        pickup_date: string
        return_date: string
        pickup_time: string
        return_time: string
        pickup_location: string
        return_location: string
      }
      vehicle_selection: {
        title: string
        category: string
        features: string
        price_per_day: string
        total_price: string
      }
      insurance: {
        title: string
        basic: string
        premium: string
        full_coverage: string
      }
      payment: {
        title: string
        method: string
        card_number: string
        expiry_date: string
        cvv: string
        billing_address: string
      }
    }
    confirmation: {
      title: string
      booking_reference: string
      pickup_instructions: string
      contact_info: string
      terms_and_conditions: string
    }
  }
  vehicle: {
    categories: {
      economy: string
      compact: string
      intermediate: string
      premium: string
      luxury: string
      suv: string
      van: string
      convertible: string
    }
    features: {
      automatic: string
      manual: string
      air_conditioning: string
      gps: string
      bluetooth: string
      usb_ports: string
      heated_seats: string
      sunroof: string
      all_wheel_drive: string
      hybrid: string
      electric: string
    }
    specifications: {
      engine: string
      fuel_type: string
      transmission: string
      seats: string
      doors: string
      luggage: string
      fuel_consumption: string
    }
  }
  validation: {
    required: string
    invalid_email: string
    invalid_phone: string
    invalid_date: string
    min_age: string
    license_required: string
    password_too_short: string
    passwords_dont_match: string
  }
}

// German (Switzerland) translations
export const deTranslations: Translations = {
  common: {
    navigation: {
      home: 'Startseite',
      vehicles: 'Fahrzeuge',
      bookings: 'Buchungen',
      about: 'Über uns',
      contact: 'Kontakt'
    },
    actions: {
      submit: 'Absenden',
      cancel: 'Abbrechen',
      save: 'Speichern',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      view: 'Anzeigen',
      book_now: 'Jetzt buchen',
      search: 'Suchen',
      filter: 'Filter',
      sort: 'Sortieren',
      reset: 'Zurücksetzen'
    },
    status: {
      available: 'Verfügbar',
      unavailable: 'Nicht verfügbar',
      booked: 'Gebucht',
      maintenance: 'Wartung',
      confirmed: 'Bestätigt',
      pending: 'Ausstehend',
      cancelled: 'Storniert'
    },
    feedback: {
      success: 'Erfolgreich',
      error: 'Fehler',
      warning: 'Warnung',
      info: 'Information',
      loading: 'Wird geladen...'
    },
    time: {
      today: 'Heute',
      yesterday: 'Gestern',
      tomorrow: 'Morgen',
      days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
      months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 
               'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
    }
  },
  booking: {
    form: {
      title: 'Fahrzeug buchen',
      personal_info: {
        title: 'Persönliche Angaben',
        first_name: 'Vorname',
        last_name: 'Nachname',
        email: 'E-Mail-Adresse',
        phone: 'Telefonnummer',
        date_of_birth: 'Geburtsdatum',
        license_number: 'Führerscheinnummer'
      },
      rental_details: {
        title: 'Mietdetails',
        pickup_date: 'Abholdatum',
        return_date: 'Rückgabedatum',
        pickup_time: 'Abholzeit',
        return_time: 'Rückgabezeit',
        pickup_location: 'Abholort',
        return_location: 'Rückgabeort'
      },
      vehicle_selection: {
        title: 'Fahrzeugauswahl',
        category: 'Kategorie',
        features: 'Ausstattung',
        price_per_day: 'Preis pro Tag',
        total_price: 'Gesamtpreis'
      },
      insurance: {
        title: 'Versicherung',
        basic: 'Basisschutz',
        premium: 'Premiumschutz',
        full_coverage: 'Vollkaskoversicherung'
      },
      payment: {
        title: 'Zahlung',
        method: 'Zahlungsmethode',
        card_number: 'Kartennummer',
        expiry_date: 'Ablaufdatum',
        cvv: 'CVV',
        billing_address: 'Rechnungsadresse'
      }
    },
    confirmation: {
      title: 'Buchungsbestätigung',
      booking_reference: 'Buchungsreferenz',
      pickup_instructions: 'Abholanweisungen',
      contact_info: 'Kontaktinformationen',
      terms_and_conditions: 'Allgemeine Geschäftsbedingungen'
    }
  },
  vehicle: {
    categories: {
      economy: 'Economy',
      compact: 'Kompakt',
      intermediate: 'Mittelklasse',
      premium: 'Premium',
      luxury: 'Luxus',
      suv: 'SUV',
      van: 'Van',
      convertible: 'Cabriolet'
    },
    features: {
      automatic: 'Automatikgetriebe',
      manual: 'Schaltgetriebe',
      air_conditioning: 'Klimaanlage',
      gps: 'GPS-Navigation',
      bluetooth: 'Bluetooth',
      usb_ports: 'USB-Anschlüsse',
      heated_seats: 'Sitzheizung',
      sunroof: 'Schiebedach',
      all_wheel_drive: 'Allradantrieb',
      hybrid: 'Hybrid',
      electric: 'Elektrisch'
    },
    specifications: {
      engine: 'Motor',
      fuel_type: 'Kraftstoffart',
      transmission: 'Getriebe',
      seats: 'Sitzplätze',
      doors: 'Türen',
      luggage: 'Gepäckraum',
      fuel_consumption: 'Kraftstoffverbrauch'
    }
  },
  validation: {
    required: 'Dieses Feld ist erforderlich',
    invalid_email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    invalid_phone: 'Bitte geben Sie eine gültige Telefonnummer ein',
    invalid_date: 'Bitte geben Sie ein gültiges Datum ein',
    min_age: 'Sie müssen mindestens 18 Jahre alt sein',
    license_required: 'Ein gültiger Führerschein ist erforderlich',
    password_too_short: 'Das Passwort muss mindestens 8 Zeichen lang sein',
    passwords_dont_match: 'Die Passwörter stimmen nicht überein'
  }
}

// French (Switzerland) translations
export const frTranslations: Translations = {
  common: {
    navigation: {
      home: 'Accueil',
      vehicles: 'Véhicules',
      bookings: 'Réservations',
      about: 'À propos',
      contact: 'Contact'
    },
    actions: {
      submit: 'Soumettre',
      cancel: 'Annuler',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Modifier',
      view: 'Voir',
      book_now: 'Réserver maintenant',
      search: 'Rechercher',
      filter: 'Filtrer',
      sort: 'Trier',
      reset: 'Réinitialiser'
    },
    status: {
      available: 'Disponible',
      unavailable: 'Indisponible',
      booked: 'Réservé',
      maintenance: 'Maintenance',
      confirmed: 'Confirmé',
      pending: 'En attente',
      cancelled: 'Annulé'
    },
    feedback: {
      success: 'Succès',
      error: 'Erreur',
      warning: 'Attention',
      info: 'Information',
      loading: 'Chargement en cours...'
    },
    time: {
      today: "Aujourd'hui",
      yesterday: 'Hier',
      tomorrow: 'Demain',
      days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
      months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
               'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    }
  },
  // ... rest of French translations
  // [Similar structure to German translations but in French]
}

// Italian (Switzerland) translations
export const itTranslations: Translations = {
  common: {
    navigation: {
      home: 'Home',
      vehicles: 'Veicoli',
      bookings: 'Prenotazioni',
      about: 'Chi siamo',
      contact: 'Contatto'
    },
    actions: {
      submit: 'Invia',
      cancel: 'Annulla',
      save: 'Salva',
      delete: 'Elimina',
      edit: 'Modifica',
      view: 'Visualizza',
      book_now: 'Prenota ora',
      search: 'Cerca',
      filter: 'Filtra',
      sort: 'Ordina',
      reset: 'Reimposta'
    },
    // ... rest of Italian translations
  },
  // ... rest of Italian translations structure
}

export const translations = {
  'de-CH': deTranslations,
  'fr-CH': frTranslations,
  'it-CH': itTranslations,
  'en-US': deTranslations // Fallback to German for now
}
```

### 3. React Context Implementation

```typescript
// src/i18n/context/I18nContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { SupportedLocale, defaultLocale, detectLocale, localeConfig } from '../config'
import { translations, Translations } from '../translations'

interface I18nContextType {
  locale: SupportedLocale
  setLocale: (locale: SupportedLocale) => void
  t: (key: string, params?: Record<string, string | number>) => string
  formatDate: (date: Date) => string
  formatTime: (date: Date) => string
  formatCurrency: (amount: number) => string
  formatNumber: (number: number) => string
  dir: 'ltr' | 'rtl'
  isRTL: boolean
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}

interface I18nProviderProps {
  children: ReactNode
  initialLocale?: SupportedLocale
}

export const I18nProvider = ({ children, initialLocale }: I18nProviderProps) => {
  const [locale, setLocaleState] = useState<SupportedLocale>(
    initialLocale || detectLocale()
  )

  // Persist locale preference
  useEffect(() => {
    const savedLocale = localStorage.getItem('preferred-locale') as SupportedLocale
    if (savedLocale && savedLocale !== locale) {
      setLocaleState(savedLocale)
    }
  }, [])

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale)
    localStorage.setItem('preferred-locale', newLocale)
    
    // Update HTML lang attribute
    document.documentElement.lang = newLocale
    document.documentElement.dir = localeConfig[newLocale].direction
  }

  // Translation function with nested key support and interpolation
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.')
    const localeTranslations = translations[locale]
    
    let value: any = localeTranslations
    for (const k of keys) {
      value = value?.[k]
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation missing for key: ${key} in locale: ${locale}`)
      return key
    }
    
    // Simple interpolation
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match: string, paramKey: string) => {
        return params[paramKey]?.toString() || match
      })
    }
    
    return value
  }

  // Date formatting
  const formatDate = (date: Date): string => {
    const config = localeConfig[locale]
    const formatter = new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    return formatter.format(date)
  }

  // Time formatting
  const formatTime = (date: Date): string => {
    const config = localeConfig[locale]
    const formatter = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: locale === 'en-US'
    })
    return formatter.format(date)
  }

  // Currency formatting
  const formatCurrency = (amount: number): string => {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 2
    })
    return formatter.format(amount)
  }

  // Number formatting
  const formatNumber = (number: number): string => {
    const formatter = new Intl.NumberFormat(locale)
    return formatter.format(number)
  }

  const dir = localeConfig[locale].direction
  const isRTL = dir === 'rtl'

  return (
    <I18nContext.Provider value={{
      locale,
      setLocale,
      t,
      formatDate,
      formatTime,
      formatCurrency,
      formatNumber,
      dir,
      isRTL
    }}>
      {children}
    </I18nContext.Provider>
  )
}
```

### 4. Translation Hooks

```typescript
// src/i18n/hooks/useTranslation.ts
import { useI18n } from '../context/I18nContext'

// Typed translation hook for specific namespaces
export const useTranslation = (namespace?: string) => {
  const { t: originalT, ...rest } = useI18n()
  
  const t = (key: string, params?: Record<string, string | number>) => {
    const fullKey = namespace ? `${namespace}.${key}` : key
    return originalT(fullKey, params)
  }
  
  return { t, ...rest }
}

// Hook for common translations
export const useCommonTranslations = () => {
  return useTranslation('common')
}

// Hook for booking-specific translations
export const useBookingTranslations = () => {
  return useTranslation('booking')
}

// Hook for vehicle-specific translations
export const useVehicleTranslations = () => {
  return useTranslation('vehicle')
}

// Hook for validation messages
export const useValidationTranslations = () => {
  return useTranslation('validation')
}
```

### 5. Language Switcher Component

```typescript
// src/components/molecules/LanguageSwitcher/LanguageSwitcher.tsx
import { useState, useRef } from 'react'
import { useI18n } from '@/i18n/context/I18nContext'
import { supportedLocales, localeConfig, SupportedLocale } from '@/i18n/config'
import { ChevronDownIcon, GlobeIcon } from '@heroicons/react/24/outline'

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'tabs'
  showFlag?: boolean
  showFullName?: boolean
}

export const LanguageSwitcher = ({ 
  variant = 'dropdown',
  showFlag = true,
  showFullName = false
}: LanguageSwitcherProps) => {
  const { locale, setLocale } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  if (variant === 'tabs') {
    return (
      <div className="language-switcher language-switcher--tabs">
        <div className="language-switcher__tabs" role="tablist">
          {supportedLocales.map((supportedLocale) => (
            <button
              key={supportedLocale}
              role="tab"
              aria-selected={locale === supportedLocale}
              className={`language-switcher__tab ${
                locale === supportedLocale ? 'active' : ''
              }`}
              onClick={() => setLocale(supportedLocale)}
            >
              {showFlag && (
                <span className={`flag flag--${supportedLocale.split('-')[1].toLowerCase()}`} />
              )}
              <span>
                {showFullName 
                  ? localeConfig[supportedLocale].name
                  : localeConfig[supportedLocale].shortName
                }
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="language-switcher language-switcher--dropdown" ref={dropdownRef}>
      <button
        className="language-switcher__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <GlobeIcon className="w-4 h-4" />
        <span className="language-switcher__current">
          {showFlag && (
            <span className={`flag flag--${locale.split('-')[1].toLowerCase()}`} />
          )}
          {localeConfig[locale].shortName}
        </span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="language-switcher__dropdown" role="listbox">
          {supportedLocales.map((supportedLocale) => (
            <button
              key={supportedLocale}
              role="option"
              aria-selected={locale === supportedLocale}
              className={`language-switcher__option ${
                locale === supportedLocale ? 'selected' : ''
              }`}
              onClick={() => {
                setLocale(supportedLocale)
                setIsOpen(false)
              }}
            >
              {showFlag && (
                <span className={`flag flag--${supportedLocale.split('-')[1].toLowerCase()}`} />
              )}
              <span className="language-switcher__option-name">
                {localeConfig[supportedLocale].name}
              </span>
              {locale === supportedLocale && (
                <span className="language-switcher__check" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

### 6. Form Validation with i18n

```typescript
// src/components/forms/BookingForm/BookingForm.i18n.tsx
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useValidationTranslations } from '@/i18n/hooks/useTranslation'
import { useBookingTranslations } from '@/i18n/hooks/useTranslation'

export const BookingForm = () => {
  const { t: vt } = useValidationTranslations()
  const { t } = useBookingTranslations()

  // Localized validation schema
  const validationSchema = yup.object({
    firstName: yup
      .string()
      .required(vt('required'))
      .min(2, vt('min_length', { min: '2' })),
    
    lastName: yup
      .string()
      .required(vt('required'))
      .min(2, vt('min_length', { min: '2' })),
    
    email: yup
      .string()
      .required(vt('required'))
      .email(vt('invalid_email')),
    
    phone: yup
      .string()
      .required(vt('required'))
      .matches(
        /^(\+41|0041|0)[0-9\s\-\(\)]{8,}$/,
        vt('invalid_phone')
      ),
    
    dateOfBirth: yup
      .date()
      .required(vt('required'))
      .max(
        new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000),
        vt('min_age')
      ),
    
    pickupDate: yup
      .date()
      .required(vt('required'))
      .min(new Date(), vt('future_date_required')),
    
    returnDate: yup
      .date()
      .required(vt('required'))
      .when('pickupDate', (pickupDate, schema) => {
        return schema.min(
          pickupDate,
          vt('return_after_pickup')
        )
      })
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset>
        <legend>{t('form.personal_info.title')}</legend>
        
        <FormField
          label={t('form.personal_info.first_name')}
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        
        <FormField
          label={t('form.personal_info.last_name')}
          error={errors.lastName?.message}
          {...register('lastName')}
        />
        
        <FormField
          label={t('form.personal_info.email')}
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />
        
        <FormField
          label={t('form.personal_info.phone')}
          type="tel"
          placeholder="+41 XX XXX XX XX"
          error={errors.phone?.message}
          {...register('phone')}
        />
      </fieldset>
      
      <fieldset>
        <legend>{t('form.rental_details.title')}</legend>
        
        <FormField
          label={t('form.rental_details.pickup_date')}
          type="date"
          error={errors.pickupDate?.message}
          {...register('pickupDate')}
        />
        
        <FormField
          label={t('form.rental_details.return_date')}
          type="date"
          error={errors.returnDate?.message}
          {...register('returnDate')}
        />
      </fieldset>
      
      <Button type="submit">
        {t('form.submit_booking')}
      </Button>
    </form>
  )
}
```

### 7. Number and Date Formatting

```typescript
// src/i18n/utils/formatters.ts
import { SupportedLocale, localeConfig } from '../config'

export class I18nFormatters {
  constructor(private locale: SupportedLocale) {}

  // Format currency specifically for Swiss context
  formatCurrency(amount: number, options?: {
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  }): string {
    const formatter = new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: options?.minimumFractionDigits ?? 2,
      maximumFractionDigits: options?.maximumFractionDigits ?? 2
    })
    return formatter.format(amount)
  }

  // Format numbers with Swiss conventions
  formatNumber(number: number): string {
    const config = localeConfig[this.locale]
    const formatter = new Intl.NumberFormat(this.locale, {
      useGrouping: true
    })
    return formatter.format(number)
  }

  // Format dates with Swiss conventions (DD.MM.YYYY)
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }
    
    const formatter = new Intl.DateTimeFormat(
      this.locale, 
      { ...defaultOptions, ...options }
    )
    return formatter.format(date)
  }

  // Format time with Swiss conventions (24h format)
  formatTime(date: Date): string {
    const formatter = new Intl.DateTimeFormat(this.locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // Swiss uses 24h format
    })
    return formatter.format(date)
  }

  // Format date and time combined
  formatDateTime(date: Date): string {
    return `${this.formatDate(date)} ${this.formatTime(date)}`
  }

  // Format relative time (e.g., "2 days ago", "in 3 hours")
  formatRelativeTime(date: Date): string {
    const rtf = new Intl.RelativeTimeFormat(this.locale, { 
      numeric: 'auto',
      style: 'long'
    })
    
    const now = new Date()
    const diffInMs = date.getTime() - now.getTime()
    const diffInSeconds = Math.floor(diffInMs / 1000)
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (Math.abs(diffInDays) >= 1) {
      return rtf.format(diffInDays, 'day')
    } else if (Math.abs(diffInHours) >= 1) {
      return rtf.format(diffInHours, 'hour')
    } else if (Math.abs(diffInMinutes) >= 1) {
      return rtf.format(diffInMinutes, 'minute')
    } else {
      return rtf.format(diffInSeconds, 'second')
    }
  }

  // Format duration (e.g., "2 days", "5 hours")
  formatDuration(startDate: Date, endDate: Date): string {
    const diffInMs = endDate.getTime() - startDate.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))

    if (diffInDays >= 1) {
      return `${diffInDays} ${diffInDays === 1 ? 'Tag' : 'Tage'}` // Localize based on current locale
    } else {
      return `${diffInHours} ${diffInHours === 1 ? 'Stunde' : 'Stunden'}`
    }
  }

  // Format file size
  formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    
    return `${this.formatNumber(Math.round(size * 100) / 100)} ${units[unitIndex]}`
  }
}

// Usage hooks
export const useFormatters = () => {
  const { locale } = useI18n()
  return useMemo(() => new I18nFormatters(locale), [locale])
}
```

### 8. SEO and Meta Tags

```typescript
// src/components/seo/I18nHead.tsx
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useI18n } from '@/i18n/context/I18nContext'
import { supportedLocales } from '@/i18n/config'

interface I18nHeadProps {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
}

export const I18nHead = ({ 
  title, 
  description, 
  canonical, 
  ogImage 
}: I18nHeadProps) => {
  const { locale } = useI18n()
  const router = useRouter()
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com'
  const currentUrl = `${baseUrl}${router.asPath}`
  
  // Generate alternate language links
  const alternateLinks = supportedLocales.map(supportedLocale => {
    const href = supportedLocale === 'de-CH' 
      ? `${baseUrl}${router.asPath}` 
      : `${baseUrl}/${supportedLocale.split('-')[0]}${router.asPath}`
    
    return {
      hrefLang: supportedLocale,
      href
    }
  })
  
  // Add x-default for international users
  alternateLinks.push({
    hrefLang: 'x-default',
    href: `${baseUrl}${router.asPath}`
  })

  return (
    <Head>
      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="language" content={locale} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical || currentUrl} />
      
      {/* Alternate language links */}
      {alternateLinks.map(({ hrefLang, href }) => (
        <link
          key={hrefLang}
          rel="alternate"
          hrefLang={hrefLang}
          href={href}
        />
      ))}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:locale" content={locale} />
      {alternateLinks.slice(0, -1).map(({ hrefLang }) => (
        <meta
          key={hrefLang}
          property="og:locale:alternate"
          content={hrefLang}
        />
      ))}
      
      {ogImage && (
        <meta property="og:image" content={ogImage} />
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && (
        <meta name="twitter:image" content={ogImage} />
      )}
    </Head>
  )
}
```

## Translation Management

### 1. Translation Workflow
- **Development**: JSON files for rapid development
- **Translation**: Export to industry-standard formats (XLIFF, CSV)
- **Review**: Translation memory and consistency checks
- **Integration**: Automated import with validation

### 2. Content Guidelines
- **Swiss German**: Use standard German with Swiss terminology
- **French**: Swiss French conventions and formal tone
- **Italian**: Swiss Italian regional preferences
- **Consistency**: Unified terminology across languages

### 3. Cultural Considerations
- **Date formats**: DD.MM.YYYY for all Swiss locales
- **Currency**: CHF with Swiss formatting conventions
- **Phone numbers**: Swiss format (+41 XX XXX XX XX)
- **Addresses**: Swiss postal code system
- **Business hours**: Swiss business culture

### 4. Performance Optimizations
- **Bundle splitting**: Language-specific chunks
- **Lazy loading**: On-demand translation loading
- **Caching**: Browser and CDN caching strategies
- **Fallbacks**: Graceful degradation to default language

## Implementation Checklist

- [ ] Configure supported locales and regions
- [ ] Implement translation context and hooks  
- [ ] Create language switcher component
- [ ] Set up form validation with i18n
- [ ] Configure number and date formatters
- [ ] Implement SEO with alternate links
- [ ] Set up translation workflow
- [ ] Test with screen readers in all languages
- [ ] Validate cultural conventions
- [ ] Performance test language switching