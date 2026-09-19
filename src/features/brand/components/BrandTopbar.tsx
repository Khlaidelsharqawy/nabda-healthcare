import { Button, MaterialIcon } from '../../../components/ui';

export interface BrandTopbarProps {
  isRtl: boolean;
  theme: string;
  onToggleDirection: () => void;
  onToggleTheme: () => void;
}

export function BrandTopbar({
  isRtl,
  theme,
  onToggleDirection,
  onToggleTheme,
}: BrandTopbarProps) {
  return (
    <header
      className="brand-page__topbar glass-card"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--surface-primary, #ffffff)',
        borderBottom: '1px solid var(--border-default, #e2e8f0)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <a
          href="/"
          className="aegis-brand hover-elevate"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
        >
          <span
            className="aegis-brand__mark"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#e8f5e9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(8, 116, 67, 0.15)',
            }}
          >
            <img src="/logo.png" alt="Nabda Logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
          </span>
          <div className="aegis-brand__text" style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              className="aegis-brand__title"
              style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main, #0f172a)', lineHeight: '1.2' }}
            >
              {isRtl ? 'منظومة نبضة الطبية' : 'Nabda Healthcare'}
            </span>
            <span
              className="aegis-brand__subtitle"
              style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#087443', letterSpacing: '0.05em' }}
            >
              {isRtl ? 'المنظومة السريرية الموحدة' : 'CLINICAL ECOSYSTEM'}
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
          className="public-portal-nav"
        >
          <a
            href="#public-discovery-section"
            style={{ color: 'var(--text-main, #334155)', textDecoration: 'none' }}
          >
            {isRtl ? 'الأطباء والعيادات' : 'Doctors & Clinics'}
          </a>
          <a
            href="#public-services-section"
            style={{ color: 'var(--text-main, #334155)', textDecoration: 'none' }}
          >
            {isRtl ? 'الخدمات السريرية' : 'Services'}
          </a>
          <a
            href="#public-demo-clinics-section"
            style={{ color: 'var(--text-main, #334155)', textDecoration: 'none' }}
          >
            {isRtl ? 'المجمعات التجريبية' : 'Demo Clinics'}
          </a>
          <a
            href="/clinic/al-nour"
            style={{ color: '#087443', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <MaterialIcon name="local_hospital" style={{ fontSize: '16px' }} />
            <span>{isRtl ? 'مستشفى النور التخصصي' : 'Al-Nour Medical Center'}</span>
          </a>
        </nav>
      </div>

      {/* Topbar Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Button
          variant="ghost"
          size="sm"
          icon="translate"
          onClick={onToggleDirection}
          aria-label={isRtl ? 'تغيير اللغة' : 'Toggle language'}
        >
          {isRtl ? 'English' : 'العربية'}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          icon={theme === 'light' ? 'dark_mode' : 'light_mode'}
          onClick={onToggleTheme}
          aria-label={isRtl ? 'تغيير المظهر' : 'Toggle theme'}
        />

        <a
          href="/login"
          className="ui-btn ui-btn--primary ui-btn--sm hover-elevate"
          style={{ textDecoration: 'none', marginLeft: '6px' }}
        >
          <MaterialIcon name="login" />
          <span>{isRtl ? 'دخول المنظومة' : 'Portal Login'}</span>
        </a>
      </div>
    </header>
  );
}
