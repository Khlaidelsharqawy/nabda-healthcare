import { type ReactNode } from 'react';
import { MaterialIcon } from './MaterialIcon';

export interface PageHeaderProps {
  kicker?: ReactNode;
  kickerIcon?: string;
  title: ReactNode;
  badge?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  kicker,
  kickerIcon,
  title,
  badge,
  subtitle,
  actions,
  className = '',
}: PageHeaderProps) {
  return (
    <header className={`ui-page-header ${className}`}>
      <div className="ui-page-header__main">
        {kicker && (
          <div className="ui-page-header__kicker">
            {kickerIcon && <MaterialIcon name={kickerIcon} className="ui-page-header__kicker-icon" />}
            <span>{kicker}</span>
          </div>
        )}
        <div className="ui-page-header__title-row">
          <h1 className="ui-page-header__title">{title}</h1>
          {badge && <div className="ui-page-header__badge">{badge}</div>}
        </div>
        {subtitle && <p className="ui-page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="ui-page-header__actions">{actions}</div>}
    </header>
  );
}

