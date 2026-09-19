import { MaterialIcon } from '../ui';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  count?: number;
  totalCount?: number;
  isRtl?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChange,
  onClear,
  placeholder,
  count,
  totalCount,
  isRtl = false,
  className = '',
  autoFocus = false,
}: SearchBarProps) {
  const defaultPlaceholder = isRtl
    ? 'ابحث باسم الطبيب، أو التخصص السريري، أو المجمع الطبي، أو المدينة...'
    : 'Search by doctor name, specialty, clinic, or city...';

  const hasCount = count !== undefined && totalCount !== undefined;
  const trailingPadding = value && hasCount ? '95px' : hasCount ? '70px' : value ? '44px' : '20px';
  const leadingPadding = '44px';

  return (
    <div
      className={`discovery-search-bar ${className}`}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <MaterialIcon
        name="search"
        style={{
          position: 'absolute',
          left: isRtl ? 'auto' : '14px',
          right: isRtl ? '14px' : 'auto',
          color: '#087443',
          fontSize: '20px',
          pointerEvents: 'none',
        }}
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || defaultPlaceholder}
        autoFocus={autoFocus}
        style={{
          width: '100%',
          height: '46px',
          paddingLeft: isRtl ? trailingPadding : leadingPadding,
          paddingRight: isRtl ? leadingPadding : trailingPadding,
          borderRadius: '8px',
          border: '1.5px solid var(--border-default, #cbd5e1)',
          backgroundColor: 'var(--surface-primary, #ffffff)',
          color: 'var(--text-main, #0f172a)',
          fontSize: '0.9375rem',
          outline: 'none',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#087443';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(8, 116, 67, 0.15)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-default, #cbd5e1)';
          e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.04)';
        }}
        aria-label={isRtl ? 'حقل البحث العام' : 'Search query input'}
      />

      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            if (onClear) onClear();
          }}
          style={{
            position: 'absolute',
            right: isRtl ? 'auto' : '12px',
            left: isRtl ? '12px' : 'auto',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '50%',
            color: 'var(--text-muted, #64748b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={isRtl ? 'مسح البحث' : 'Clear search'}
          aria-label={isRtl ? 'مسح البحث' : 'Clear search'}
        >
          <MaterialIcon name="cancel" style={{ fontSize: '18px' }} />
        </button>
      )}

      {count !== undefined && totalCount !== undefined && (
        <span
          style={{
            position: 'absolute',
            right: isRtl ? 'auto' : value ? '40px' : '14px',
            left: isRtl ? (value ? '40px' : '14px') : 'auto',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#087443',
            backgroundColor: 'rgba(8, 116, 67, 0.08)',
            padding: '2px 6px',
            borderRadius: '4px',
            pointerEvents: 'none',
          }}
        >
          {isRtl ? `${count} من ${totalCount}` : `${count} / ${totalCount}`}
        </span>
      )}
    </div>
  );
}

