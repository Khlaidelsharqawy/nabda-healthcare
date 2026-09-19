import { useState } from 'react';
import { PublicClinicShell } from '../../layouts/PublicClinicShell';
import { useTheme } from '../../theme/ThemeProvider';
import { publicMessages } from '../../i18n/messages';
import { MaterialIcon, PageHeader, Panel, PanelBody, Badge, Button } from '../../components/ui';

interface ClinicServiceItem {
  id: string;
  title: string;
  titleAr: string;
  category: 'clinical' | 'diagnostic' | 'chronic';
  categoryText: string;
  categoryTextAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  turnaround: string;
  turnaroundAr: string;
}

const alNourServices: ClinicServiceItem[] = [
  {
    id: 'primary-care',
    title: 'Comprehensive Primary & Family Care',
    titleAr: 'الرعاية الأولية وطب الأسرة الشامل',
    category: 'clinical',
    categoryText: 'Outpatient Clinic',
    categoryTextAr: 'عيادات خارجية',
    description: 'Routine clinical consultation, acute illness evaluation, and preventative wellness screenings for adult family members.',
    descriptionAr: 'استشارات سريرية روتينية، وتقييم الحالات الحادة، والفحوصات الوقائية الدورية لأفراد الأسرة البالغين.',
    icon: 'medical_services',
    turnaround: 'Same-Day Availability',
    turnaroundAr: 'متاح في نفس اليوم',
  },
  {
    id: 'cardiology',
    title: 'Specialist Cardiology & Heart Health',
    titleAr: 'استشارات القلب وتخطيط صدى القلب',
    category: 'clinical',
    categoryText: 'Specialty Center',
    categoryTextAr: 'مركز تخصصي',
    description: 'Attending consultant evaluation, 12-lead ECG, stress echocardiography, and long-term hypertension management.',
    descriptionAr: 'تقييم استشاري لأمراض القلب، وتخطيط كهربية القلب، وتخطيط الجهد التلفزيوني، وعلاج ضغط الدم المزمن.',
    icon: 'cardiology',
    turnaround: 'Consultant Roster',
    turnaroundAr: 'وفق جدول الاستشاريين',
  },
  {
    id: 'pediatrics',
    title: 'Pediatrics & Adolescent Medicine',
    titleAr: 'طب الأطفال والنمو والتحصينات',
    category: 'clinical',
    categoryText: 'Family Care',
    categoryTextAr: 'رعاية الأسرة',
    description: 'Newborn developmental assessments, Ministry of Health childhood immunizations, pediatric asthma, and nutritional monitoring.',
    descriptionAr: 'تقييم نمو حديثي الولادة، والتطعيمات الوطنية لوزارة الصحة، وعلاج حساسية وربو الأطفال، ومتابعة التغذية.',
    icon: 'child_care',
    turnaround: 'Daily Walk-in Slots',
    turnaroundAr: 'مواعيد يومية متاحة',
  },
  {
    id: 'diagnostics-lab',
    title: 'Diagnostic Laboratory & Pathology',
    titleAr: 'المختبرات والتحاليل التشخيصية المتقدمة',
    category: 'diagnostic',
    categoryText: 'Laboratory',
    categoryTextAr: 'مختبر سريري',
    description: 'Automated clinical chemistry, CBC with differential, lipid panels, HbA1c telemetry, and endocrine hormone assays.',
    descriptionAr: 'تحاليل كيمياء الدم الآلية، وصورة الدم الكاملة، وملف الدهون الشامل، ومتابعة السكري التراكمي، وفحوصات الهرمونات.',
    icon: 'biotech',
    turnaround: 'Results in 2–4 Hours',
    turnaroundAr: 'النتائج خلال ٢–٤ ساعات',
  },
  {
    id: 'imaging-ultrasound',
    title: 'Diagnostic Ultrasound & Radiology',
    titleAr: 'التصوير بالموجات الصوتية والأشعة التشخيصية',
    category: 'diagnostic',
    categoryText: 'Radiology',
    categoryTextAr: 'الأشعة التشخيصية',
    description: 'Abdominal ultrasound, thyroid sonography, Doppler vascular studies, and digital musculoskeletal radiography.',
    descriptionAr: 'تصوير البطن والحوض بالموجات الصوتية، وسونار الغدة الدرقية، والدوبلر الوعائي، والأشعة السينية الرقمية للعظام.',
    icon: 'radiology',
    turnaround: 'Digital Archiving',
    turnaroundAr: 'أرشفة رقمية فورية',
  },
  {
    id: 'chronic-care',
    title: 'Chronic Disease & Diabetes Management',
    titleAr: 'برنامج رعاية الأمراض المزمنة والسكري',
    category: 'chronic',
    categoryText: 'Continuous Care',
    categoryTextAr: 'رعاية مستمرة',
    description: 'Structured multi-disciplinary care plans, continuous glucose sensor integration, and quarterly physician medication optimization.',
    descriptionAr: 'خطط علاجية متكاملة لمرضى السكري والضغط، مع ربط حساسات قياس السكر المستمرة وتعديل الجرعات دورياً.',
    icon: 'monitor_heart',
    turnaround: 'Comprehensive Program',
    turnaroundAr: 'برنامج متابعة دوري',
  },
];

export function PublicClinicServicesPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? publicMessages.ar : publicMessages.en;

  const [filter, setFilter] = useState<'all' | 'clinical' | 'diagnostic' | 'chronic'>('all');

  const filteredServices = alNourServices.filter((s) => {
    if (filter === 'all') return true;
    return s.category === filter;
  });

  return (
    <PublicClinicShell>
      <div className="public-clinic-page" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <PageHeader
          kicker={copy.servicesKicker}
          kickerIcon="medical_services"
          title={copy.services}
          subtitle={
            isRtl
              ? 'الخدمات والعيادات التخصصية والفحوصات المخبرية في مجمع عافية الطبي التجريبي'
              : 'Specialized clinical departments, diagnostic laboratory panels, and imaging services at AegisHealth Demo Medical Center'
          }
        />

        {/* Filter Pills */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            padding: '12px 16px',
            backgroundColor: 'var(--surface-primary, #ffffff)',
            borderRadius: '10px',
            border: '1px solid var(--border-default, #e2e8f0)',
          }}
        >
          {[
            { id: 'all', label: isRtl ? 'جميع الخدمات' : 'All Departments' },
            { id: 'clinical', label: isRtl ? 'العيادات الاستشارية' : 'Consultant Clinics' },
            { id: 'diagnostic', label: isRtl ? 'المختبرات والأشعة' : 'Labs & Diagnostics' },
            { id: 'chronic', label: isRtl ? 'إدارة الأمراض المزمنة' : 'Chronic Disease' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as any)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8125rem',
                fontWeight: filter === tab.id ? 700 : 500,
                backgroundColor: filter === tab.id ? '#087443' : 'var(--surface-subtle, #f1f5f9)',
                color: filter === tab.id ? '#ffffff' : 'var(--text-main, #334155)',
                border: filter === tab.id ? '1px solid #087443' : '1px solid var(--border-default, #cbd5e1)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="public-clinic-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredServices.map((service) => (
            <Panel
              key={service.id}
              variant="default"
              padding="lg"
              className="public-service-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '10px',
                border: '1px solid var(--border-default, #e2e8f0)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div
                    className="public-service-card__icon-box"
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(8, 116, 67, 0.08)',
                      color: '#087443',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MaterialIcon name={service.icon} style={{ fontSize: '24px' }} />
                  </div>
                  <Badge variant="outline" size="sm">
                    {isRtl ? service.categoryTextAr : service.categoryText}
                  </Badge>
                </div>

                <h3
                  className="public-service-card__title"
                  style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-main, #0f172a)' }}
                >
                  {isRtl ? service.titleAr : service.title}
                </h3>

                <p
                  className="public-service-card__desc"
                  style={{ fontSize: '0.8125rem', color: 'var(--text-muted, #64748b)', lineHeight: '1.5', margin: '0 0 14px 0' }}
                >
                  {isRtl ? service.descriptionAr : service.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    color: '#087443',
                    fontWeight: 600,
                    marginBottom: '16px',
                  }}
                >
                  <MaterialIcon name="schedule" style={{ fontSize: '15px' }} />
                  <span>{isRtl ? service.turnaroundAr : service.turnaround}</span>
                </div>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border-default, #e2e8f0)',
                  paddingTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <a
                  href="/clinic/al-nour/booking/confirmed"
                  className="ui-btn ui-btn--primary ui-btn--sm"
                  style={{ textDecoration: 'none' }}
                >
                  <MaterialIcon name="calendar_month" />
                  <span>{isRtl ? 'حجز موعد بالقسم' : 'Book Department'}</span>
                </a>

                <a
                  href="/clinic/al-nour/doctors"
                  className="ui-btn ui-btn--ghost ui-btn--sm"
                  style={{ textDecoration: 'none' }}
                >
                  <span>{isRtl ? 'الاستشاريون' : 'Staff'}</span>
                  <MaterialIcon name={isRtl ? 'arrow_back' : 'arrow_forward'} />
                </a>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </PublicClinicShell>
  );
}
