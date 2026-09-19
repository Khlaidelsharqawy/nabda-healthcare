import { MaterialIcon } from '../../../components/ui';

export interface BrandSecurityBannerProps {
  isRtl: boolean;
}

export function BrandSecurityBanner({ isRtl }: BrandSecurityBannerProps) {
  return (
    <section
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        padding: '0 24px',
      }}
    >
      <div
        className="glass-card"
        style={{
          padding: '24px',
          borderRadius: '12px',
          backgroundColor: 'rgba(8, 116, 67, 0.08)',
          border: '1px solid rgba(8, 116, 67, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '780px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#087443',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <MaterialIcon name="shield" style={{ fontSize: '24px' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 4px 0', color: '#087443' }}>
              {isRtl ? 'معايير خصوصية وأمان البيانات الصحية متعددة المستأجرين' : 'Healthcare Privacy & Multi-Tenant Security Standards'}
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-main, #334155)', margin: 0, lineHeight: '1.45' }}>
              {isRtl
                ? 'تعتمد المنصة تصميماً مؤسسياً يضمن العزل الصارم لبيانات المنشآت الطبية، والتشفير الشامل للسجلات الصحية وفق المعايير السريرية الوطنية دون تدريب النماذج العامة على بيانات المرضى.'
                : 'Built with enterprise multi-tenant isolation, encrypted health record storage, and strict national privacy compliance with zero model training on patient records.'}
            </p>
          </div>
        </div>

        <a
          href="/login"
          className="ui-btn ui-btn--primary ui-btn--md hover-elevate"
          style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}
        >
          <MaterialIcon name="admin_panel_settings" />
          <span>{isRtl ? 'بوابة الممارسين والمسؤولين' : 'Practitioner Portal'}</span>
        </a>
      </div>
    </section>
  );
}
