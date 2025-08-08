import * as React from 'react';

import { cn } from '../lib/utils';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, name, options, value, onChange, orientation = 'vertical', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'flex-row space-x-4' : 'flex-col space-y-2',
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'flex cursor-pointer items-center space-x-2',
              option.disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              disabled={option.disabled}
              onChange={(e) => onChange?.(e.target.value)}
              className="h-4 w-4 border-gray-300 text-primary focus:ring-2 focus:ring-primary"
            />
            <span className="text-sm font-medium">{option.label}</span>
          </label>
        ))}
      </div>
    );
  },
);
RadioGroup.displayName = 'RadioGroup';

export { RadioGroup };
