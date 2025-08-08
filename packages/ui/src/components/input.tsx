import * as React from 'react';

import { cn } from '../lib/utils';

/**
 * Input component properties extending native HTML input attributes
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Error state for the input */
  error?: boolean;
  /** Helper text or error message */
  helperText?: string;
  /** Icon to display at the start of the input */
  startIcon?: React.ReactNode;
  /** Icon to display at the end of the input */
  endIcon?: React.ReactNode;
}

/**
 * Accessible input component with support for icons and error states.
 * Includes proper ARIA attributes for screen readers.
 *
 * @example
 * ```tsx
 * <Input
 *   type="email"
 *   placeholder="Enter email"
 *   aria-label="Email address"
 *   error={hasError}
 *   helperText="Please enter a valid email"
 * />
 * ```
 */
const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      error,
      helperText,
      startIcon,
      endIcon,
      disabled,
      id,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const helperId = `${inputId}-helper`;
    const hasHelper = Boolean(helperText);

    const inputElement = (
      <input
        type={type}
        id={inputId}
        className={cn(
          'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error ? 'border-destructive focus-visible:ring-destructive' : 'border-input',
          startIcon && 'pl-10',
          endIcon && 'pr-10',
          className,
        )}
        ref={ref}
        disabled={disabled}
        aria-invalid={error}
        aria-describedby={hasHelper ? helperId : ariaDescribedBy}
        aria-label={ariaLabel}
        {...props}
      />
    );

    if (!startIcon && !endIcon && !helperText) {
      return inputElement;
    }

    return (
      <div className="relative">
        {startIcon && (
          <div
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          >
            {startIcon}
          </div>
        )}
        {inputElement}
        {endIcon && (
          <div
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          >
            {endIcon}
          </div>
        )}
        {hasHelper && (
          <p
            id={helperId}
            className={cn('mt-1 text-sm', error ? 'text-destructive' : 'text-muted-foreground')}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

InputComponent.displayName = 'Input';

// Memoize the component for performance
const Input = React.memo(InputComponent);

export { Input };
