import { MaterialIcon, Badge, Button, Panel } from '../ui';
import { Clinic } from '../../data/mock/types';
import { RatingDisplay } from './RatingDisplay';
import { LocationDisplay } from './LocationDisplay';

export interface ClinicCardProps {
  clinic: Clinic;
  onExploreDoctors?: (clinicId: string) => void;
  isRtl?: boolean;
  className?: string;
}

export function ClinicCard({
  clinic,
  onExploreDoctors,
  isRtl = false,
  className = '',
}: ClinicCardProps) {
  // Direct link to public clinic page (Al-Nour has dedicated canonical routes)
  const clinicRoute = clinic.id === 'al-nour' ? '/clinic/al-nour' : `/clinic/${clinic.id}`;

  return (
    <Panel
      variant="elevated"
      className={`discovery-clinic-card ${className}`}
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
        {/* Header row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                backgroundColor: 'rgba(8, 116, 67, 0.08)',
                color: '#087443',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <MaterialIcon name="local_hospital" style={{ fontSize: '24px' }} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--text-main, #0f172a)',
                  margin: 0,
                  lineHeight: '1.3',
                }}
              >
                {isRtl ? clinic.nameAr : clinic.name}
              </h3>
              <div style={{ marginTop: '3px' }}>
                <RatingDisplay
                  rating={clinic.rating}
                  reviewCount={clinic.reviewCount}
                  isRtl={isRtl}
                  size="sm"
                />
              </div>
            </div>
          </div>

          {clinic.badge && (
            <Badge variant="brand" size="sm">
              {isRtl ? clinic.badgeAr : clinic.badge}
            </Badge>
          )}
        </div>

        {/* Tagline / short description */}
        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--text-muted, #64748b)',
            lineHeight: '1.45',
            margin: '0 0 12px 0',
          }}
        >
          {isRtl ? clinic.taglineAr : clinic.tagline}
        </p>

        {/* Location Display */}
        <div style={{ marginBottom: '14px' }}>
          <LocationDisplay
            clinic={clinic}
            address={isRtl ? clinic.addressAr : clinic.address}
            city={isRtl ? clinic.cityAr : clinic.city}
            district={isRtl ? clinic.districtAr : clinic.district}
            isRtl={isRtl}
          />
        </div>

        {/* Specialties Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {(isRtl ? clinic.specialtiesAr : clinic.specialties).slice(0, 4).map((spec) => (
            <span
              key={spec}
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: 'var(--text-main, #334155)',
                backgroundColor: 'var(--surface-subtle, #f1f5f9)',
                padding: '3px 8px',
                borderRadius: '4px',
                border: '1px solid var(--border-default, #e2e8f0)',
              }}
            >
              {spec}
            </span>
          ))}
          {clinic.specialties.length > 4 && (
            <span
              style={{
                fontSize: '0.6875rem',
                color: 'var(--text-muted, #64748b)',
                padding: '3px 6px',
              }}
            >
              +{clinic.specialties.length - 4} {isRtl ? 'المزيد' : 'more'}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Doctor count & CTAs */}
      <div
        style={{
          borderTop: '1px solid var(--border-default, #e2e8f0)',
          paddingTop: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#087443', fontWeight: 600 }}>
          <MaterialIcon name="groups" style={{ fontSize: '16px' }} />
          <span>
            {isRtl ? `${clinic.doctorCount} أطباء متاحين` : `${clinic.doctorCount} Active Clinicians`}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {onExploreDoctors && (
            <Button
              variant="outline"
              size="sm"
              icon="person_search"
              onClick={() => onExploreDoctors(clinic.id)}
            >
              {isRtl ? 'الأطباء' : 'Doctors'}
            </Button>
          )}

          <a
            href={clinicRoute}
            className="ui-btn ui-btn--primary ui-btn--sm"
            style={{ textDecoration: 'none' }}
          >
            <MaterialIcon name={isRtl ? 'arrow_back' : 'arrow_forward'} />
            <span>{isRtl ? 'زيارة المجمع' : 'Explore Clinic'}</span>
          </a>
        </div>
      </div>
    </Panel>
  );
}

