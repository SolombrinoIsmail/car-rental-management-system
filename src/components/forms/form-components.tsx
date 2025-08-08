"use client";

import * as React from "react";
import { Eye, EyeOff, Calendar, Clock, MapPin, Phone, Mail, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Password input with toggle visibility
 */
export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export function PasswordInput({ 
  className, 
  label, 
  error, 
  helper,
  ...props 
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Input
      type={showPassword ? "text" : "password"}
      label={label}
      error={error}
      helper={helper}
      rightIcon={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      }
      className={className}
      {...props}
    />
  );
}

/**
 * Email input with validation
 */
export interface EmailInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  validate?: boolean;
}

export function EmailInput({ 
  label = "E-Mail", 
  error, 
  helper, 
  validate = true,
  onChange,
  ...props 
}: EmailInputProps) {
  const [validationError, setValidationError] = React.useState<string>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    
    if (validate && e.target.value) {
      const isValid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(e.target.value);
      setValidationError(isValid ? undefined : "Bitte geben Sie eine gültige E-Mail-Adresse ein");
    } else {
      setValidationError(undefined);
    }
  };

  return (
    <Input
      type="email"
      label={label}
      error={error || validationError}
      helper={helper}
      leftIcon={<Mail className="h-4 w-4" />}
      onChange={handleChange}
      {...props}
    />
  );
}

/**
 * Phone input with Swiss formatting
 */
export interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  country?: "CH" | "DE" | "AT" | "FR" | "IT";
}

export function PhoneInput({ 
  label = "Telefon", 
  error, 
  helper, 
  country = "CH",
  onChange,
  ...props 
}: PhoneInputProps) {
  const countryPrefixes = {
    CH: "+41",
    DE: "+49",
    AT: "+43",
    FR: "+33",
    IT: "+39",
  };

  const formatPhoneNumber = (value: string, countryCode: string) => {
    // Remove all non-digits
    const digits = value.replace(/\\D/g, "");
    
    if (countryCode === "+41") {
      // Swiss format: +41 XX XXX XX XX
      if (digits.length <= 2) return digits;
      if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
      if (digits.length <= 7) return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
      return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
    }
    
    // Default formatting for other countries
    return digits.replace(/(\\d{2})(\\d{3})(\\d{2})(\\d{2})/, "$1 $2 $3 $4");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const prefix = countryPrefixes[country];
    let value = e.target.value;
    
    // Always ensure the country prefix is present
    if (!value.startsWith(prefix)) {
      value = prefix + " " + value.replace(/^(\\+\\d{2,3}\\s?)?/, "");
    }
    
    // Format the number
    const formatted = prefix + " " + formatPhoneNumber(value.replace(prefix, "").trim(), prefix);
    
    // Create new event with formatted value
    const newEvent = {
      ...e,
      target: {
        ...e.target,
        value: formatted,
      },
    };
    
    onChange?.(newEvent as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <Input
      type="tel"
      label={label}
      error={error}
      helper={helper || "Format: +41 XX XXX XX XX"}
      leftIcon={<Phone className="h-4 w-4" />}
      onChange={handleChange}
      {...props}
    />
  );
}

/**
 * Date input with localization
 */
export interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  locale?: string;
}

export function DateInput({ 
  label = "Datum", 
  error, 
  helper, 
  locale = "de-CH",
  ...props 
}: DateInputProps) {
  return (
    <Input
      type="date"
      label={label}
      error={error}
      helper={helper}
      leftIcon={<Calendar className="h-4 w-4" />}
      {...props}
    />
  );
}

/**
 * Time input
 */
export interface TimeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export function TimeInput({ 
  label = "Zeit", 
  error, 
  helper, 
  ...props 
}: TimeInputProps) {
  return (
    <Input
      type="time"
      label={label}
      error={error}
      helper={helper}
      leftIcon={<Clock className="h-4 w-4" />}
      {...props}
    />
  );
}

/**
 * Address input for Swiss addresses
 */
export interface AddressInputProps {
  street?: string;
  postalCode?: string;
  city?: string;
  canton?: string;
  onStreetChange?: (value: string) => void;
  onPostalCodeChange?: (value: string) => void;
  onCityChange?: (value: string) => void;
  onCantonChange?: (value: string) => void;
  errors?: {
    street?: string;
    postalCode?: string;
    city?: string;
    canton?: string;
  };
  className?: string;
}

export function AddressInput({
  street,
  postalCode,
  city,
  canton,
  onStreetChange,
  onPostalCodeChange,
  onCityChange,
  onCantonChange,
  errors,
  className,
}: AddressInputProps) {
  const validatePostalCode = (code: string) => {
    return /^\\d{4}$/.test(code);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Input
        label="Strasse und Hausnummer"
        placeholder="Musterstrasse 123"
        value={street}
        onChange={(e) => onStreetChange?.(e.target.value)}
        error={errors?.street}
        leftIcon={<MapPin className="h-4 w-4" />}
        required
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Postleitzahl"
          placeholder="8001"
          value={postalCode}
          onChange={(e) => {
            const value = e.target.value.replace(/\\D/g, "").slice(0, 4);
            onPostalCodeChange?.(value);
          }}
          error={errors?.postalCode}
          maxLength={4}
          required
        />
        
        <Input
          label="Ort"
          placeholder="Zürich"
          value={city}
          onChange={(e) => onCityChange?.(e.target.value)}
          error={errors?.city}
          required
        />
      </div>
    </div>
  );
}

/**
 * Person name input
 */
export interface PersonNameInputProps {
  firstName?: string;
  lastName?: string;
  onFirstNameChange?: (value: string) => void;
  onLastNameChange?: (value: string) => void;
  errors?: {
    firstName?: string;
    lastName?: string;
  };
  required?: boolean;
  className?: string;
}

export function PersonNameInput({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  errors,
  required = false,
  className,
}: PersonNameInputProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>
      <Input
        label="Vorname"
        placeholder="Max"
        value={firstName}
        onChange={(e) => onFirstNameChange?.(e.target.value)}
        error={errors?.firstName}
        leftIcon={<User className="h-4 w-4" />}
        required={required}
      />
      
      <Input
        label="Nachname"
        placeholder="Mustermann"
        value={lastName}
        onChange={(e) => onLastNameChange?.(e.target.value)}
        error={errors?.lastName}
        leftIcon={<User className="h-4 w-4" />}
        required={required}
      />
    </div>
  );
}

/**
 * Form field wrapper for consistent spacing
 */
export interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
}

export function FormField({ children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
    </div>
  );
}

/**
 * Form section with title and description
 */
export interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ 
  title, 
  description, 
  children, 
  className 
}: FormSectionProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}