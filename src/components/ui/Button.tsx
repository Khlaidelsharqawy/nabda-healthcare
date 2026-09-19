import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { MaterialIcon } from './MaterialIcon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'start' | 'end';
  loading?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'start',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  const classes = [
    'ui-btn',
    `ui-btn--${variant}`,
    `ui-btn--${size}`,
    fullWidth ? 'ui-btn--block' : '',
    loading ? 'is-loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading ? (
        <span className="ui-btn__spinner" aria-hidden="true" />
      ) : icon && iconPosition === 'start' ? (
        <MaterialIcon name={icon} className="ui-btn__icon" />
      ) : null}

      {children ? <span className="ui-btn__text">{children}</span> : null}

      {!loading && icon && iconPosition === 'end' ? (
        <MaterialIcon name={icon} className="ui-btn__icon" />
      ) : null}
    </button>
  );
}

