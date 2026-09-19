import { useEffect } from 'react';
import { MaterialIcon, Button, Badge } from '../ui';
import { Clinic } from '../../data/mock/types';

export interface LocationMapModalProps {
  clinic: Clinic | null;
  isOpen: boolean;
  onClose: () => void;
  isRtl?: boolean;
}

export function LocationMapModal({
  clinic,
  isOpen,
  onClose,
  isRtl = false,
}: LocationMapModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !clinic) return null;

  return (
    <div
      className="discovery-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="discovery-modal-content"
        style={{
          width: '100%',
          maxWidth: '580px',
          backgroundColor: 'var(--surface-primary, #ffffff)',
          borderRadius: '12px',
          border: '1px solid var(--border-default, #e2e8f0)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-modal-title"
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-default, #e2e8f0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--surface-subtle, #f8fafc)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(8, 116, 67, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#087443',
              }}
            >
              <MaterialIcon name="location_on" style={{ fontSize: '20px' }} />
            </div>
            <div>
              <h2
                id="location-modal-title"
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--text-main, #0f172a)',
                  margin: 0,
                }}
              >
                {isRtl ? clinic.nameAr : clinic.name}
              </h2>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted, #64748b)',
                }}
              >
                {isRtl ? `${clinic.cityAr} — ${clinic.districtAr}` : `${clinic.city} — ${clinic.district}`}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            icon="close"
            onClick={onClose}
            aria-label={isRtl ? 'إغلاق' : 'Close'}
          />
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Map Visual Abstraction */}
          <div
            style={{
              height: '190px',
              borderRadius: '8px',
              backgroundColor: 'var(--surface-muted, #f1f5f9)',
              border: '1px solid var(--border-default, #cbd5e1)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Architectural Grid Pattern */}
            <svg
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
              style={{ opacity: 0.45 }}
            >
              <defs>
                <pattern id="grid-map" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#94a3b8" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-map)" />
              {/* Main Arterial Road */}
              <line x1="0" y1="100" x2="600" y2="100" stroke="#cbd5e1" strokeWidth="16" />
              <line x1="0" y1="100" x2="600" y2="100" stroke="#f8fafc" strokeWidth="2" strokeDasharray="6,6" />
              {/* Secondary Cross Street */}
              <line x1="280" y1="0" x2="280" y2="200" stroke="#cbd5e1" strokeWidth="12" />
            </svg>

            {/* Central Pin */}
            <div
              style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                zIndex: 2,
              }}
            >
              <div
                style={{
                  backgroundColor: '#087443',
                  color: '#ffffff',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <MaterialIcon name="local_hospital" style={{ fontSize: '14px' }} />
                <span>{isRtl ? clinic.nameAr : clinic.name}</span>
              </div>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#087443',
                  transform: 'rotate(45deg)',
                  marginTop: '-8px',
                }}
              />
            </div>

            {/* Map corner badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '8px',
                left: isRtl ? 'auto' : '8px',
                right: isRtl ? '8px' : 'auto',
                backgroundColor: 'var(--surface-primary, rgba(255, 255, 255, 0.9))',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '0.6875rem',
                color: 'var(--text-muted, #475569)',
                border: '1px solid var(--border-default, #e2e8f0)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <MaterialIcon name="map" style={{ fontSize: '12px' }} />
              <span>{clinic.mapCoordinates.label}</span>
            </div>
          </div>

          {/* Details list */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div
              style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: 'var(--surface-subtle, #f8fafc)',
                border: '1px solid var(--border-default, #e2e8f0)',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-muted, #64748b)',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                {isRtl ? 'العنوان المعتمد' : 'Physical Address'}
              </span>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main, #0f172a)' }}>
                {isRtl ? clinic.addressAr : clinic.address}
              </p>
            </div>

            <div
              style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: 'var(--surface-subtle, #f8fafc)',
                border: '1px solid var(--border-default, #e2e8f0)',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-muted, #64748b)',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                {isRtl ? 'ساعات العمل' : 'Operating Hours'}
              </span>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main, #0f172a)' }}>
                {isRtl ? clinic.operatingHoursAr : clinic.operatingHours}
              </p>
            </div>
          </div>

          {/* Transportation & Access notes */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(8, 116, 67, 0.05)',
              border: '1px solid rgba(8, 116, 67, 0.2)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
            }}
          >
            <MaterialIcon name="info" style={{ color: '#087443', fontSize: '18px', marginTop: '2px' }} />
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-main, #1e293b)', lineHeight: '1.4' }}>
              <strong>{isRtl ? 'ملاحظة الوصول والمواقف:' : 'Patient Access & Parking:'}</strong>{' '}
              {isRtl
                ? 'تتوفر مواقف سيارات مظللة للمرضى والمراجعين مع خدمة مسار الكراسي المتحركة ومكتب استقبال الاستعلامات بالطابق الأرضي.'
                : 'Complimentary patient parking available with wheelchair-accessible entrances and direct reception desk access on ground level.'}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border-default, #e2e8f0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--surface-subtle, #f8fafc)',
          }}
        >
          <a
            href={`tel:${clinic.phone}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#087443',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <MaterialIcon name="phone" style={{ fontSize: '16px' }} />
            <span>{clinic.phone}</span>
          </a>

          <Button
            variant="primary"
            size="sm"
            icon="directions"
            onClick={() => {
              alert(
                isRtl
                  ? `جاري فتح الملاحة التوجيهية إلى ${clinic.nameAr} في خرائط الجهاز.`
                  : `Opening navigation directions to ${clinic.name} in your map application.`
              );
            }}
          >
            {isRtl ? 'بدء التوجيه' : 'Get Directions'}
          </Button>
        </div>
      </div>
    </div>
  );
}

