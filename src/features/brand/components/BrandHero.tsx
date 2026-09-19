import { Badge, MaterialIcon } from '../../../components/ui';
import { SearchBar } from '../../../components/discovery';
import { SpecialtyItem, PlatformStats } from '../../../domain';

export interface BrandHeroProps {
  isRtl: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchClear: () => void;
  searchCount: number;
  totalCount: number;
  specialties: SpecialtyItem[];
  onQuickSpecialtyClick: (specialtyId: string) => void;
  stats: PlatformStats | null;
  clinicsCount: number;
  doctorsCount: number;
}

export function BrandHero({
  isRtl,
  searchQuery,
  onSearchChange,
  onSearchClear,
  searchCount,
  totalCount,
  specialties,
  onQuickSpecialtyClick,
  stats,
  clinicsCount,
  doctorsCount,
}: BrandHeroProps) {
  return (
    <section
      className="brand-hero-healthcare"
      style={{
        background: 'linear-gradient(180deg, var(--surface-primary, #ffffff) 0%, rgba(8, 116, 67, 0.04) 100%)',
        borderBottom: '1px solid var(--border-default, #e2e8f0)',
        padding: '56px 24px 44px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '24px',
        }}
      >
        <Badge variant="brand" size="md" icon="health_and_safety">
          {isRtl
            ? 'المنصة التشغيلية للعيادات التخصصية والرعاية الخارجية'
            : 'Specialist Outpatient Clinical Operations & Care Platform'}
        </Badge>

        <h1
          style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
            fontWeight: 800,
            color: 'var(--text-main, #0f172a)',
            margin: 0,
            lineHeight: '1.2',
            maxWidth: '920px',
          }}
        >
          {isRtl
            ? 'منظومة تشغيل العيادات التخصصية ورعاية المرضى'
            : 'Healthcare Operating Platform for Specialty Clinics & Patient Care'}
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.1875rem)',
            color: 'var(--text-muted, #4e6153)',
            lineHeight: '1.6',
            margin: 0,
            maxWidth: '780px',
          }}
        >
          {isRtl
            ? 'بنية رقمية موحدة لإدارة العيادات والمجمعات الطبية، وتنسيق الأطباء والاستشاريين، وبوابات المرضى مع التوثيق السريري الذكي وتكامل المختبرات والوصفات الدوائية.'
            : 'Unified operating infrastructure connecting clinic administration, attending clinicians, and patient health portals with ambient clinical intelligence, diagnostics, and prescription workflows.'}
        </p>

        {/* Live Search Bar embedded in Hero */}
        <div
          style={{
            width: '100%',
            maxWidth: '740px',
            marginTop: '12px',
            boxShadow: '0 10px 25px -5px rgba(8, 116, 67, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            borderRadius: '10px',
          }}
        >
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            onClear={onSearchClear}
            count={searchCount}
            totalCount={totalCount}
            isRtl={isRtl}
          />
        </div>

        {/* Quick Specialty Clickable Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', maxWidth: '800px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted, #4e6153)', alignSelf: 'center' }}>
            {isRtl ? 'التخصصات الأكثر طلباً:' : 'Popular Specialties:'}
          </span>
          {specialties.slice(0, 5).map((spec) => (
            <button
              key={spec.id}
              type="button"
              onClick={() => onQuickSpecialtyClick(spec.id)}
              className="hover-elevate"
              style={{
                backgroundColor: 'var(--surface-primary, #ffffff)',
                border: '1px solid var(--border-default, #cbd5e1)',
                borderRadius: '20px',
                padding: '4px 12px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#087443',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s ease',
              }}
            >
              <MaterialIcon name={spec.icon} style={{ fontSize: '14px' }} />
              <span>{isRtl ? spec.nameAr : spec.name}</span>
            </button>
          ))}
        </div>

        {/* Demonstration Scale Metrics Row */}
        <div
          style={{
            width: '100%',
            maxWidth: '960px',
            marginTop: '16px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-default, #e2e8f0)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: '#087443',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {isRtl ? 'مؤشرات بيئة العرض التجريبي والنموذج الأولي' : 'Platform Demonstration Scale • Prototype Sample Data'}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '20px',
              width: '100%',
            }}
          >
            <div>
              <strong style={{ fontSize: '1.75rem', fontWeight: 800, color: '#087443', display: 'block' }}>
                {stats?.clinics || clinicsCount}
              </strong>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted, #4e6153)' }}>
                {isRtl ? 'مجمع وعيادة تخصصية' : 'Healthcare Centers'}
              </span>
            </div>
            <div>
              <strong style={{ fontSize: '1.75rem', fontWeight: 800, color: '#087443', display: 'block' }}>
                {stats?.doctors || doctorsCount}
              </strong>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted, #4e6153)' }}>
                {isRtl ? 'طبيباً واستشارياً معتمداً' : 'Verified Physicians'}
              </span>
            </div>
            <div>
              <strong style={{ fontSize: '1.75rem', fontWeight: 800, color: '#087443', display: 'block' }}>
                {stats?.specialties || specialties.length || 6}
              </strong>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted, #4e6153)' }}>
                {isRtl ? 'تخصصاً سريرياً دقيقاً' : 'Clinical Specialties'}
              </span>
            </div>
            <div>
              <strong style={{ fontSize: '1.75rem', fontWeight: 800, color: '#087443', display: 'block' }}>
                {(stats?.appointments || 1420).toLocaleString()}
              </strong>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted, #4e6153)' }}>
                {isRtl ? 'استشارة مسجلة بالمنظومة' : 'Completed Consultations'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
