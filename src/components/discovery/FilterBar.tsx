import { MaterialIcon, Button, Badge } from '../ui';
import { SpecialtyItem, LocationItem } from '../../data/mock/types';

export interface FilterBarProps {
  specialties: SpecialtyItem[];
  locations: LocationItem[];
  selectedSpecialty: string;
  onSelectSpecialty: (id: string) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  selectedRating: number;
  onSelectRating: (rating: number) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  isRtl?: boolean;
  className?: string;
}

export function FilterBar({
  specialties,
  locations,
  selectedSpecialty,
  onSelectSpecialty,
  selectedCity,
  onSelectCity,
  selectedRating,
  onSelectRating,
  onResetFilters,
  hasActiveFilters,
  isRtl = false,
  className = '',
}: FilterBarProps) {
  return (
    <div
      className={`discovery-filter-bar ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
      }}
    >
      {/* Top Row: Specialty quick pills */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px',
          scrollbarWidth: 'none',
        }}
      >
        <span
          style={{
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: 'var(--text-muted, #64748b)',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <MaterialIcon name="tune" style={{ fontSize: '16px' }} />
          <span>{isRtl ? 'التخصص:' : 'Specialty:'}</span>
        </span>

        {specialties.map((spec) => {
          const isSelected = selectedSpecialty === spec.id;
          return (
            <button
              key={spec.id}
              type="button"
              onClick={() => onSelectSpecialty(spec.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.8125rem',
                fontWeight: isSelected ? 700 : 500,
                backgroundColor: isSelected
                  ? '#087443'
                  : 'var(--surface-primary, #ffffff)',
                color: isSelected ? '#ffffff' : 'var(--text-main, #334155)',
                border: isSelected
                  ? '1px solid #087443'
                  : '1px solid var(--border-default, #cbd5e1)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <MaterialIcon
                name={spec.icon}
                style={{
                  fontSize: '15px',
                  color: isSelected ? '#ffffff' : '#087443',
                }}
              />
              <span>{isRtl ? spec.nameAr : spec.name}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Row: City Selector, Rating Filter, and Reset Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* City Selector */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted, #64748b)' }}>
              {isRtl ? 'المدينة:' : 'City:'}
            </span>
            <select
              value={selectedCity}
              onChange={(e) => onSelectCity(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-default, #cbd5e1)',
                backgroundColor: 'var(--surface-primary, #ffffff)',
                color: 'var(--text-main, #0f172a)',
                fontSize: '0.8125rem',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer',
              }}
              aria-label={isRtl ? 'تصفية حسب المدينة' : 'Filter by city'}
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id === 'all' ? 'all' : loc.city}>
                  {isRtl ? loc.cityAr : loc.city}
                </option>
              ))}
            </select>
          </div>

          {/* Rating filter */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted, #64748b)' }}>
              {isRtl ? 'التقييم الأدنى:' : 'Min Rating:'}
            </span>
            <select
              value={selectedRating}
              onChange={(e) => onSelectRating(Number(e.target.value))}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-default, #cbd5e1)',
                backgroundColor: 'var(--surface-primary, #ffffff)',
                color: 'var(--text-main, #0f172a)',
                fontSize: '0.8125rem',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer',
              }}
              aria-label={isRtl ? 'تصفية حسب التقييم' : 'Filter by minimum rating'}
            >
              <option value={0}>{isRtl ? 'أي تقييم (الكل)' : 'All Ratings'}</option>
              <option value={4.7}>★ 4.7+</option>
              <option value={4.8}>★ 4.8+</option>
              <option value={4.9}>★ 4.9+</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            icon="filter_alt_off"
            onClick={onResetFilters}
            style={{ color: '#dc2626' }}
          >
            {isRtl ? 'إعادة ضبط التصفية' : 'Reset Filters'}
          </Button>
        )}
      </div>
    </div>
  );
}

