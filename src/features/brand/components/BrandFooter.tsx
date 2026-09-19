import { MaterialIcon } from '../../../components/ui';

export interface BrandFooterProps {
  isRtl: boolean;
}

export function BrandFooter({ isRtl }: BrandFooterProps) {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-default, #e2e8f0)',
        backgroundColor: 'var(--surface-primary, #ffffff)',
        padding: '40px 24px 28px 24px',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
          }}
        >
          {/* Column 1: Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MaterialIcon name="medical_information" style={{ fontSize: '20px', color: '#087443' }} />
              <strong style={{ fontSize: '1rem', color: 'var(--text-main, #0f172a)' }}>
                {isRtl ? 'منظومة نبضة الطبية' : 'Nabda Healthcare'}
              </strong>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted, #64748b)', margin: 0, lineHeight: '1.5' }}>
              {isRtl
                ? 'منصة الرعاية الصحية السحابية المتكاملة للعيادات التخصصية والمرضى.'
                : 'Multi-tenant healthcare cloud platform connecting clinics, specialists, and patients.'}
            </p>
          </div>

          {/* Column 2: Public Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>
              {isRtl ? 'الخدمات العامة' : 'Public Access'}
            </span>
            <a href="#public-discovery-section" style={{ color: 'var(--text-muted, #64748b)', textDecoration: 'none' }}>
              {isRtl ? 'البحث عن طبيب' : 'Find a Doctor'}
            </a>
            <a href="/clinic/al-nour" style={{ color: 'var(--text-muted, #64748b)', textDecoration: 'none' }}>
              {isRtl ? 'مستشفى النور التخصصي' : 'Al-Nour Medical Center'}
            </a>
            <a href="/clinic/al-nour/doctors" style={{ color: 'var(--text-muted, #64748b)', textDecoration: 'none' }}>
              {isRtl ? 'استشاريو مستشفى النور' : 'Al-Nour Attending Staff'}
            </a>
            <a href="/clinic/al-nour/services" style={{ color: 'var(--text-muted, #64748b)', textDecoration: 'none' }}>
              {isRtl ? 'الخدمات والتحاليل' : 'Clinical Diagnostics'}
            </a>
          </div>

          {/* Column 3: Portals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>
              {isRtl ? 'بوابات النظام السريري' : 'Workspaces'}
            </span>
            <a href="/login" style={{ color: 'var(--text-muted, #64748b)', textDecoration: 'none' }}>
              {isRtl ? 'تسجيل دخول الممارسين' : 'Staff & Physician Login'}
            </a>
            <a href="/patient/dashboard" style={{ color: 'var(--text-muted, #64748b)', textDecoration: 'none' }}>
              {isRtl ? 'بوابة المريض الصحية' : 'Patient Health Portal'}
            </a>
            <a href="/signup" style={{ color: 'var(--text-muted, #64748b)', textDecoration: 'none' }}>
              {isRtl ? 'تسجيل مريض جديد' : 'New Patient Registration'}
            </a>
            <a href="/request-access" style={{ color: 'var(--text-muted, #64748b)', textDecoration: 'none' }}>
              {isRtl ? 'انضمام منشأة طبية' : 'Clinic Onboarding Request'}
            </a>
          </div>

          {/* Column 4: Emergency Disclaimer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
            <span style={{ fontWeight: 700, color: '#dc2626' }}>
              {isRtl ? 'تنبيه الطوارئ الطبية' : 'Emergency Notice'}
            </span>
            <p style={{ color: 'var(--text-muted, #64748b)', margin: 0, lineHeight: '1.45' }}>
              {isRtl
                ? 'هذه المنصة مخصصة للمواعيد والعيادات الخارجية المجدولة. في حالات الطوارئ الحرجة يرجى الاتصال فوراً برقم الطوارئ المحلي المعتمد أو التوجه لأقرب مستشفى.'
                : 'For acute, life-threatening medical emergencies, please dial your local emergency services immediately or proceed to the nearest emergency department.'}
            </p>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--border-default, #e2e8f0)',
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.75rem',
            color: 'var(--text-muted, #64748b)',
          }}
        >
          <span>
            © 2026 {isRtl ? 'منظومة نبضة للرعاية الصحية. جميع الحقوق محفوظة.' : 'Nabda Healthcare Platform. All rights reserved.'}
          </span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>{isRtl ? 'بيانات تجريبية مصرح بها' : 'Demonstration & Simulation Environment'}</span>
            <span>•</span>
            <span>{isRtl ? 'النسخة السريرية v2.4' : 'Clinical Build v2.4'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
