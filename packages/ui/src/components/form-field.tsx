import * as React from 'react';

import { cn } from '../lib/utils';

import { Label } from './label';

/**
 * Validation rule for form fields
 */
export interface ValidationRule {
  /** Rule type */
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  /** Value for the rule (e.g., minimum length, regex pattern) */
  value?: unknown;
  /** Error message to display when validation fails */
  message: string;
  /** Custom validation function */
  validate?: (value: unknown) => boolean | Promise<boolean>;
}

/**
 * FormField component properties
 */
export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Field label */
  label?: string;
  /** Error message to display */
  error?: string | boolean;
  /** Mark field as required */
  required?: boolean;
  /** Helper text to display below the field */
  helperText?: string;
  /** HTML name attribute for the field */
  name?: string;
  /** Validation rules */
  validationRules?: ValidationRule[];
  /** Callback when validation state changes */
  onValidationChange?: (isValid: boolean, error?: string) => void;
  /** Disable the field */
  disabled?: boolean;
  /** Success message or state */
  success?: string | boolean;
  /** Warning message */
  warning?: string;
  /** Field ID for accessibility */
  htmlFor?: string;
}

/**
 * Form field wrapper component with label, validation, and error handling.
 * Provides consistent layout and accessibility features for form inputs.
 *
 * @example
 * ```tsx
 * <FormField
 *   label="Email Address"
 *   required
 *   error={errors.email}
 *   helperText="We'll never share your email"
 * >
 *   <Input type="email" name="email" />
 * </FormField>
 * ```
 */
const FormFieldComponent = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      className,
      label,
      error,
      required,
      helperText,
      name,
      validationRules,
      onValidationChange,
      disabled,
      success,
      warning,
      htmlFor,
      children,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const fieldId = htmlFor || generatedId;
    const errorId = `${fieldId}-error`;
    const helperId = `${fieldId}-helper`;
    const successId = `${fieldId}-success`;
    const warningId = `${fieldId}-warning`;

    // Determine which message to show (priority: error > warning > success > helper)
    const showError = error && typeof error === 'string';
    const showWarning = !showError && warning;
    const showSuccess = !showError && !showWarning && success && typeof success === 'string';
    const showHelper = !showError && !showWarning && !showSuccess && helperText;

    // Build aria-describedby value
    const ariaDescribedBy =
      [
        showError && errorId,
        showWarning && warningId,
        showSuccess && successId,
        showHelper && helperId,
      ]
        .filter(Boolean)
        .join(' ') || undefined;

    // Validate field value
    const validate = React.useCallback(
      async (value: unknown): Promise<{ isValid: boolean; error?: string }> => {
        if (!validationRules || validationRules.length === 0) {
          return { isValid: true };
        }

        for (const rule of validationRules) {
          switch (rule.type) {
            case 'required':
              if (!value || (typeof value === 'string' && value.trim() === '')) {
                return { isValid: false, error: rule.message };
              }
              break;

            case 'minLength':
              if (typeof value === 'string' && value.length < (rule.value as number)) {
                return { isValid: false, error: rule.message };
              }
              break;

            case 'maxLength':
              if (typeof value === 'string' && value.length > (rule.value as number)) {
                return { isValid: false, error: rule.message };
              }
              break;

            case 'pattern':
              if (typeof value === 'string' && !(rule.value as RegExp).test(value)) {
                return { isValid: false, error: rule.message };
              }
              break;

            case 'custom':
              if (rule.validate) {
                const isValid = await rule.validate(value);
                if (!isValid) {
                  return { isValid: false, error: rule.message };
                }
              }
              break;
          }
        }

        return { isValid: true };
      },
      [validationRules],
    );

    // Clone children to add props
    const enhancedChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        const childProps = child.props as Record<string, unknown>;
        return React.cloneElement(child, {
          id: fieldId,
          name: name || (childProps.name as string | undefined),
          'aria-invalid': Boolean(error),
          'aria-describedby': ariaDescribedBy,
          'aria-required': required,
          disabled: disabled || (childProps.disabled as boolean | undefined),
          onBlur: async (e: React.FocusEvent<HTMLInputElement>) => {
            // Call original onBlur if exists
            const originalOnBlur = childProps.onBlur as
              | ((e: React.FocusEvent<HTMLInputElement>) => void)
              | undefined;
            if (originalOnBlur) {
              originalOnBlur(e);
            }

            // Run validation
            if (validationRules && onValidationChange) {
              const result = await validate(e.target.value);
              onValidationChange(result.isValid, result.error);
            }
          },
        });
      }
      return child;
    });

    return (
      <div ref={ref} className={cn('space-y-2', disabled && 'opacity-50', className)} {...props}>
        {label && (
          <Label htmlFor={fieldId} className={cn(disabled && 'cursor-not-allowed')}>
            {label}
            {required && (
              <span className="ml-1 text-destructive" aria-label="required">
                *
              </span>
            )}
          </Label>
        )}

        {enhancedChildren}

        {showHelper && (
          <p id={helperId} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}

        {showSuccess && (
          <p id={successId} className="text-sm text-green-600 dark:text-green-400" role="status">
            {success}
          </p>
        )}

        {showWarning && (
          <p id={warningId} className="text-sm text-yellow-600 dark:text-yellow-400" role="alert">
            {warning}
          </p>
        )}

        {showError && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

FormFieldComponent.displayName = 'FormField';

// Memoize for performance
const FormField = React.memo(FormFieldComponent);

export { FormField };
