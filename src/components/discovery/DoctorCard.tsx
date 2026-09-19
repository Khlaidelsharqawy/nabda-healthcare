import { MaterialIcon, Badge, Button, Panel } from '../ui';
import { Doctor } from '../../data/mock/types';
import { RatingDisplay } from './RatingDisplay';

export interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
  isRtl?: boolean;
  className?: string;
}

export function DoctorCard({
  doctor,
  onBook,
  isRtl = false,
  className = '',
}: DoctorCardProps) {
  return (
    <Panel
      variant="elevated"
      className={`discovery-doctor-card ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '10px',
        padding: '20px',
        border: '1px solid var(--border-default, #e2e8f0)',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
      }}
    >
      <div>
        {/* Top Info Header */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '12px' }}>
          {/* Avatar Initial Circle */}
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: 'rgba(8, 116, 67, 0.1)',
              color: '#087443',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: 700,
              flexShrink: 0,
              border: '2px solid rgba(8, 116, 67, 0.2)',
            }}
          >
            {doctor.avatarLetter}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <h3
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--text-main, #0f172a)',
                  margin: 0,
                  lineHeight: '1.3',
                }}
              >
                {isRtl ? doctor.nameAr : doctor.name}
              </h3>
            </div>

            <p
              style={{
                fontSize: '0.8125rem',
                color: '#087443',
                fontWeight: 600,
                margin: '2px 0 4px 0',
              }}
            >
              {isRtl ? doctor.titleAr : doctor.title}
            </p>

            <RatingDisplay
              rating={doctor.rating}
              reviewCount={doctor.reviewCount}
              isRtl={isRtl}
              size="sm"
            />
          </div>
        </div>

        {/* Clinic Affiliation & Location */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            padding: '10px 12px',
            borderRadius: '6px',
            backgroundColor: 'var(--surface-subtle, #f8fafc)',
            border: '1px solid var(--border-default, #e2e8f0)',
            marginBottom: '12px',
            fontSize: '0.8125rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main, #1e293b)', fontWeight: 600 }}>
            <MaterialIcon name="local_hospital" style={{ fontSize: '15px', color: '#087443' }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {isRtl ? doctor.clinicNameAr : doctor.clinicName}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted, #64748b)', fontSize: '0.75rem' }}>
            <MaterialIcon name="location_on" style={{ fontSize: '14px' }} />
            <span>
              {isRtl ? `${doctor.cityAr} — ${doctor.districtAr}` : `${doctor.city} — ${doctor.district}`}
            </span>
          </div>
        </div>

        {/* Availability Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '4px',
            backgroundColor: doctor.availability === 'today' ? 'rgba(8, 116, 67, 0.12)' : 'rgba(37, 99, 235, 0.12)',
            color: doctor.availability === 'today' ? '#087443' : '#2563eb',
            border: doctor.availability === 'today' ? '1px solid rgba(8, 116, 67, 0.25)' : '1px solid rgba(37, 99, 235, 0.25)',
            fontSize: '0.75rem',
            fontWeight: 600,
            marginBottom: '14px',
            width: '100%',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: doctor.availability === 'today' ? '#16a34a' : '#2563eb',
            }}
          />
          <span>{isRtl ? doctor.availabilityTextAr : doctor.availabilityText}</span>
        </div>
      </div>

      {/* Footer: Consultation Fee & Booking CTA */}
      <div
        style={{
          borderTop: '1px solid var(--border-default, #e2e8f0)',
          paddingTop: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted, #64748b)', display: 'block' }}>
            {isRtl ? 'رسوم الكشف' : 'Consultation'}
          </span>
          <strong style={{ fontSize: '0.95rem', color: '#087443' }}>
            {doctor.consultationFee} {isRtl ? 'وحدة تجريبية' : 'Demo Credits'}
          </strong>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon="calendar_month"
          onClick={() => onBook(doctor)}
        >
          {isRtl ? 'حجز موعد استشارة' : 'Book Consultation'}
        </Button>
      </div>
    </Panel>
  );
}

