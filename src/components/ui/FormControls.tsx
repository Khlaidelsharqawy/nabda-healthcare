import {
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  type ReactNode,
  forwardRef,
} from 'react';
import { MaterialIcon } from './MaterialIcon';

export interface FormFieldProps {
  label?: ReactNode;
  htmlFor?: string;
  required?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  required,
  hint,
  error,
  className = '',
  children,
}: FormFieldProps) {
  return (
    <div className={`ui-field ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label className="ui-field__label" htmlFor={htmlFor}>
          {label}
          {required && <span className="ui-field__required">*</span>}
        </label>
      )}
      <div className="ui-field__control">{children}</div>
      {error ? (
        <span className="ui-field__error" role="alert">
          <MaterialIcon name="error" /> {error}
        </span>
      ) : hint ? (
        <span className="ui-field__hint">{hint}</span>
      ) : null}
    </div>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  iconStart?: string;
  iconEnd?: string;
  prefixIcon?: string;
  suffixIcon?: string;
  onIconEndClick?: () => void;
  inputSize?: 'sm' | 'md' | 'lg';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ iconStart, iconEnd, prefixIcon, suffixIcon, onIconEndClick, inputSize = 'md', className = '', ...props }, ref) => {
    const start = iconStart ?? prefixIcon;
    const end = iconEnd ?? suffixIcon;
    return (
      <div className={`ui-input-wrap ui-input-wrap--${inputSize} ${className}`}>
        {start && <MaterialIcon name={start} className="ui-input__icon-start" />}
        <input ref={ref} className="ui-input" {...props} />
        {end && (
          <button
            type="button"
            className="ui-input__icon-end"
            onClick={onIconEndClick}
            tabIndex={-1}
          >
            <MaterialIcon name={end} />
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  iconStart?: string;
  selectSize?: 'sm' | 'md' | 'lg';
  options?: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ iconStart, selectSize = 'md', options, className = '', children, ...props }, ref) => {
    return (
      <div className={`ui-select-wrap ui-select-wrap--${selectSize} ${className}`}>
        {iconStart && <MaterialIcon name={iconStart} className="ui-select__icon-start" />}
        <select ref={ref} className="ui-select" {...props}>
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <span className="ui-select__chevron" aria-hidden="true">
          <MaterialIcon name="expand_more" />
        </span>
      </div>
    );
  }
);
Select.displayName = 'Select';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  textareaSize?: 'sm' | 'md' | 'lg';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ textareaSize = 'md', className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`ui-textarea ui-textarea--${textareaSize} ${className}`}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';
