import { type ReactNode, type HTMLAttributes } from 'react';
import { MaterialIcon } from './MaterialIcon';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'success' | 'warning' | 'error' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  icon?: string;
  dot?: boolean;
  className?: string;
  children: ReactNode;
}

export function Badge({
  variant = 'neutral',
  size = 'md',
  icon,
  dot = false,
  className = '',
  children,
  ...props
}: BadgeProps) {
  const classes = [
    'ui-badge',
    `ui-badge--${variant}`,
    `ui-badge--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...props}>
      {dot && <span className="ui-badge__dot" aria-hidden="true" />}
      {icon && <MaterialIcon name={icon} className="ui-badge__icon" />}
      <span className="ui-badge__label">{children}</span>
    </span>
  );
}
