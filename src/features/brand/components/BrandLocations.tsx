import { Badge } from '../../../components/ui';
import { LocationItem } from '../../../domain';

export interface BrandLocationsProps {
  locations: LocationItem[];
  isRtl: boolean;
}

export function BrandLocations({ locations, isRtl }: BrandLocationsProps) {
  return (
    <section
      id="public-locations-section"
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        padding: '0 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
        <Badge variant="brand" icon="location_city">
          {isRtl ? 'التغطية الجغرافية' : 'Regional Network'}
        </Badge>
        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--text-main, #0f172a)',
            margin: '8px 0 4px 0',
          }}
        >
          {isRtl ? 'توزيع شبكة المجمعات الطبية التجريبية (نموذج محاكاة)' : 'Clinic Network Distribution (Demonstration Prototype)'}
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted, #64748b)', margin: 0 }}>
          {isRtl
            ? 'مراكز طبية تخصصية متصلة برقمية موحدة في مختلف المناطق التجريبية المعتمدة.'
            : 'Seamlessly connected multi-specialty centers located across demonstration healthcare sectors.'}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}
      >
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="glass-card hover-elevate"
            style={{
              padding: '20px',
              borderRadius: '10px',
              backgroundColor: 'var(--surface-primary, #ffffff)',
              border: '1px solid var(--border-default, #e2e8f0)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main, #0f172a)' }}>
                {isRtl ? loc.cityAr : loc.city}
              </h4>
              <Badge variant="outline" size="sm">
                {isRtl ? `${loc.clinicCount} مجمعات` : `${loc.clinicCount} Centers`}
              </Badge>
            </div>
            <span style={{ fontSize: '0.78125rem', color: 'var(--text-muted, #64748b)' }}>
              {isRtl ? loc.districtAr : loc.district}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#087443', marginTop: '4px' }}>
              {isRtl ? `${loc.doctorCount} أطباء متاحون للحجز` : `${loc.doctorCount} Doctors Available`}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
