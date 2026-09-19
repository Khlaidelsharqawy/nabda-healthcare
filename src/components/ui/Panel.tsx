import { type ReactNode, type HTMLAttributes } from 'react';
import { MaterialIcon } from './MaterialIcon';

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'elevated' | 'accent' | 'subtle';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Panel({
  variant = 'default',
  padding = 'md',
  className = '',
  children,
  ...props
}: PanelProps) {
  const classes = [
    'ui-panel',
    `ui-panel--${variant}`,
    `ui-panel--pad-${padding}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export interface PanelHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: string;
  action?: ReactNode;
  actions?: ReactNode;
  tag?: ReactNode;
}

export function PanelHeader({
  title,
  subtitle,
  icon,
  action,
  actions,
  tag,
  className = '',
  ...props
}: PanelHeaderProps) {
  const actionContent = action ?? actions;
  return (
    <div className={`ui-panel__header ${className}`} {...props}>
      <div className="ui-panel__header-main">
        {icon && (
          <span className="ui-panel__icon-box">
            <MaterialIcon name={icon} />
          </span>
        )}
        <div className="ui-panel__headings">
          <div className="ui-panel__title-row">
            <h3 className="ui-panel__title">{title}</h3>
            {tag && <div className="ui-panel__tag">{tag}</div>}
          </div>
          {subtitle && <p className="ui-panel__subtitle">{subtitle}</p>}
        </div>
      </div>
      {actionContent && <div className="ui-panel__actions">{actionContent}</div>}
    </div>
  );
}

export interface PanelBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function PanelBody({
  children,
  className = '',
  ...props
}: PanelBodyProps) {
  return <div className={`ui-panel__body ${className}`} {...props}>{children}</div>;
}

export interface PanelFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function PanelFooter({
  children,
  className = '',
  ...props
}: PanelFooterProps) {
  return <div className={`ui-panel__footer ${className}`} {...props}>{children}</div>;
}
