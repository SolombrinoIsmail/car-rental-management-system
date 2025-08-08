import * as React from 'react';

import { cn } from '../lib/utils';

import { Label } from './label';

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, label, error, required, helperText, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {label && (
          <Label>
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </Label>
        )}
        {children}
        {helperText && !error && <p className="text-sm text-muted-foreground">{helperText}</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  },
);
FormField.displayName = 'FormField';

export { FormField };
