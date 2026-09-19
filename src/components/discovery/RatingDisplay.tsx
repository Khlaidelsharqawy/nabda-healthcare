import { MaterialIcon } from '../ui';

export interface RatingDisplayProps {
  rating: number;
  reviewCount?: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isRtl?: boolean;
  className?: string;
}

export function RatingDisplay({
  rating,
  reviewCount,
  showText = true,
  size = 'md',
  isRtl = false,
  className = '',
}: RatingDisplayProps) {
  const iconSize = size === 'sm' ? '14px' : size === 'lg' ? '20px' : '16px';
  const textSize = size === 'sm' ? '0.75rem' : size === 'lg' ? '0.95rem' : '0.85rem';

  return (
    <div
      className={`discovery-rating ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: textSize,
        fontWeight: 600,
        color: 'var(--text-main, #1e293b)',
      }}
      aria-label={`Rating ${rating.toFixed(1)} out of 5`}
    >
      <MaterialIcon
        name="star"
        style={{
          color: '#eab308',
          fontSize: iconSize,
          verticalAlign: 'middle',
        }}
      />
      <span>{rating.toFixed(1)}</span>
      {showText && reviewCount !== undefined && (
        <span
          style={{
            fontWeight: 400,
            color: 'var(--text-muted, #64748b)',
            fontSize: '0.8em',
          }}
        >
          ({isRtl ? `${reviewCount} تقييم` : `${reviewCount} reviews`})
        </span>
      )}
    </div>
  );
}

