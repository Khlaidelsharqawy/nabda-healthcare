import { useState } from 'react';
import { MaterialIcon } from '../ui';
import { Clinic } from '../../data/mock/types';
import { LocationMapModal } from './LocationMapModal';

export interface LocationDisplayProps {
  clinic?: Clinic;
  address: string;
  city?: string;
  district?: string;
  showMapButton?: boolean;
  isRtl?: boolean;
  className?: string;
}

export function LocationDisplay({
  clinic,
  address,
  city,
  district,
  showMapButton = true,
  isRtl = false,
  className = '',
}: LocationDisplayProps) {
  const [isMapOpen, setIsMapOpen] = useState(false);

  return (
    <>
      <div
        className={`discovery-location ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.8125rem',
          color: 'var(--text-muted, #64748b)',
        }}
      >
        <MaterialIcon
          name="location_on"
          style={{
            fontSize: '16px',
            color: '#087443',
            flexShrink: 0,
          }}
        />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {address}
          {city && district ? ` (${city} — ${district})` : city ? ` (${city})` : ''}
        </span>

        {showMapButton && clinic && (
          <button
            type="button"
            onClick={() => setIsMapOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              padding: '0 2px',
              color: '#087443',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
            }}
            title={isRtl ? 'عرض الموقع والاتجاهات' : 'View map & directions'}
          >
            <span>{isRtl ? 'الخريطة' : 'Map'}</span>
            <MaterialIcon name="open_in_new" style={{ fontSize: '12px' }} />
          </button>
        )}
      </div>

      {clinic && (
        <LocationMapModal
          clinic={clinic}
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          isRtl={isRtl}
        />
      )}
    </>
  );
}

