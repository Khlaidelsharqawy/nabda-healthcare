import { Badge, MaterialIcon, Panel } from '../../../components/ui';
import { RatingDisplay } from '../../../components/discovery';

export interface BrandSpotlightProps {
  isRtl: boolean;
}

export function BrandSpotlight({ isRtl }: BrandSpotlightProps) {
  return (
    <section
      id="public-demo-clinics-section"
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        padding: '0 24px',
      }}
    >
      <Panel
        variant="elevated"
        className="glass-card"
        style={{
          borderRadius: '16px',
          padding: '32px',
          backgroundColor: 'var(--surface-primary, #ffffff)',
          border: '1px solid var(--border-default, #e2e8f0)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Badge variant="brand" icon="local_hospital">
                {isRtl ? 'المركز الطبي النموذجي (نموذج تجريبي)' : 'Flagship Demo Clinical Center'}
              </Badge>
              <RatingDisplay rating={4.9} reviewCount={342} isRtl={isRtl} />
            </div>

            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--text-main, #0f172a)',
                margin: 0,
                lineHeight: '1.3',
              }}
            >
              {isRtl ? 'مستشفى النور التخصصي — المركز النموذجي المعتمد' : 'Al-Nour Medical Center — Flagship Facility'}
            </h2>

            <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted, #4e6153)', lineHeight: '1.6', margin: 0 }}>
              {isRtl
                ? 'يعد مستشفى النور التخصصي المنشأة النموذجية في بيئة منظومة نبضة الطبية، ويضم عيادات استشارية في أمراض القلب والطب الباطني والأطفال، ومختبرات تشخيصية رقمية تعمل بالتكامل مع المنظومة السحابية.'
                : 'Al-Nour Medical Center serves as our flagship demonstration facility within Nabda Healthcare, housing comprehensive outpatient suites across cardiology, internal medicine, pediatrics, and integrated digital pathology.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MaterialIcon name="location_on" style={{ color: '#087443' }} />
                <span>{isRtl ? '[عنوان المنشأة التجريبية — القطاع ١]، [المنطقة أ — تجريبي]' : '[Demo Facility Address — Sector 1], [City / Area — Demo A]'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MaterialIcon name="schedule" style={{ color: '#087443' }} />
                <span>{isRtl ? 'السبت – الخميس: ٠٨:٠٠ ص – ١٠:٠٠ م (طوارئ الحالات الخفيفة متاحة)' : 'Sat – Thu: 08:00 AM – 10:00 PM (Urgent Care Available)'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MaterialIcon name="phone" style={{ color: '#087443' }} />
                <span>[Demo Contact]</span>
              </div>
            </div>

            {/* Direct Action Links to Al-Nour Pages */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
              <a
                href="/clinic/al-nour"
                className="ui-btn ui-btn--primary ui-btn--md hover-elevate"
                style={{ textDecoration: 'none' }}
              >
                <MaterialIcon name="storefront" />
                <span>{isRtl ? 'بوابة المجمع وحجز المواعيد' : 'Demo Center Hub'}</span>
              </a>

              <a
                href="/clinic/al-nour/doctors"
                className="ui-btn ui-btn--outline ui-btn--md hover-elevate"
                style={{ textDecoration: 'none' }}
              >
                <MaterialIcon name="groups" />
                <span>{isRtl ? 'أطباء واستشاريو المركز التجريبي' : 'Demo Center Doctors'}</span>
              </a>

              <a
                href="/clinic/al-nour/services"
                className="ui-btn ui-btn--ghost ui-btn--md hover-elevate"
                style={{ textDecoration: 'none' }}
              >
                <MaterialIcon name="medical_services" />
                <span>{isRtl ? 'الخدمات السريرية' : 'Clinic Services'}</span>
              </a>
            </div>
          </div>

          {/* Clinic Highlights Panel */}
          <div
            style={{
              backgroundColor: 'var(--surface-subtle)',
              borderRadius: '12px',
              border: '1px solid var(--border-default)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main, #0f172a)' }}>
              {isRtl ? 'القدرات السريرية والتشغيلية في المجمع التجريبي النموذجي:' : 'Core Clinical & Operating Capabilities (Demo Facility):'}
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { title: isRtl ? 'توثيق سريري ذكي بالصوت' : 'Ambient AI Scribe SOAP Documentation', icon: 'mic' },
                { title: isRtl ? 'نتائج الفحوصات المخبرية الرقمية الفورية' : 'Instant Digital Laboratory Diagnostic Integration', icon: 'biotech' },
                { title: isRtl ? 'وصفات إلكترونية ومتابعة تجديد الأدوية' : 'Electronic Prescriptions & Refill Authorization', icon: 'prescriptions' },
                { title: isRtl ? 'فرز سريري استشاري متعدد التخصصات' : 'Multidisciplinary Senior Consultant Triage', icon: 'medical_information' },
              ].map((item) => (
                <li key={item.title} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem' }}>
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(8, 116, 67, 0.1)',
                      color: '#087443',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <MaterialIcon name={item.icon} style={{ fontSize: '16px' }} />
                  </span>
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Panel>
    </section>
  );
}
