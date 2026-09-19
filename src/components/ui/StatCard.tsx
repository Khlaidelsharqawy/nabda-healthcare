import { type ReactNode } from 'react';
import { MaterialIcon } from './MaterialIcon';

export interface StatCardProps {
  label: ReactNode;
  value: ReactNode;
  icon?: string;
  subtext?: ReactNode;
  delta?: ReactNode;
  trend?: string | {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error';
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  subtext,
  delta,
  trend,
  variant = 'default',
  className = '',
}: StatCardProps) {
  const secondaryText = subtext ?? delta;

  // Normalize trend
  const trendObj =
    typeof trend === 'string'
      ? {
          direction: trend === 'down' ? ('down' as const) : ('up' as const),
          value: trend === 'up' ? '▲' : trend === 'down' ? '▼' : trend,
        }
      : trend;

  return (
    <div className={`ui-stat-card ui-stat-card--${variant} ${className}`}>
      <div className="ui-stat-card__top">
        <span className="ui-stat-card__label">{label}</span>
        {icon && (
          <span className="ui-stat-card__icon-box">
            <MaterialIcon name={icon} />
          </span>
        )}
      </div>
      <div className="ui-stat-card__value-row">
        <strong className="ui-stat-card__value">{value}</strong>
        {trendObj && (
          <span className={`ui-stat-card__trend ui-stat-card__trend--${trendObj.direction}`}>
            <MaterialIcon
              name={
                trendObj.direction === 'up'
                  ? 'trending_up'
                  : trendObj.direction === 'down'
                  ? 'trending_down'
                  : 'trending_flat'
              }
            />
            {trendObj.value}
          </span>
        )}
      </div>
      {secondaryText && <div className="ui-stat-card__subtext">{secondaryText}</div>}
    </div>
  );
}
