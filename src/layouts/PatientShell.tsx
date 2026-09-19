import { useEffect, type ReactNode } from 'react';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { useTheme } from '../theme/ThemeProvider';
import { MobileMenuButton } from '../components/navigation/MobileMenuButton';
import { useMobileNavigation } from '../components/navigation/useMobileNavigation';
import { patientShellMessages } from '../i18n/messages';

interface PatientNavSection {
  titleAr: string;
  titleEn: string;
  items: {
    href: string;
    icon: string;
    labelAr: string;
    labelEn: string;
    badge?: { textAr: string; textEn: string; variant: 'live' | 'n8n' | 'rbac' | 'audit' | 'cli' };
  }[];
}

const patientSections: PatientNavSection[] = [
  {
    titleAr: 'صحتي وسجلاتي الطبية',
    titleEn: 'My Health & Records',
    items: [
      { href: '/patient/dashboard', icon: 'grid_view', labelAr: 'لوحة المريض الصحية', labelEn: 'Health Dashboard', badge: { textAr: 'مباشر', textEn: 'Live', variant: 'live' } },
      { href: '/patient/profile', icon: 'person', labelAr: 'الملف الشخصي والسجل الطبي', labelEn: 'Profile & EMR' },
      { href: '/patient/vitals', icon: 'monitoring', labelAr: 'المؤشرات الحيوية والأجهزة', labelEn: 'Vitals & Wearables' },
    ],
  },
  {
    titleAr: 'الرعاية والاستشارات',
    titleEn: 'Care & Consultations',
    items: [
      { href: '/patient/appointments', icon: 'calendar_month', labelAr: 'جدول المواعيد والحجوزات', labelEn: 'Appointments' },
      { href: '/patient/ai', icon: 'smart_toy', labelAr: 'المساعد الذكي نبضة', labelEn: 'Nabda Health AI', badge: { textAr: 'ذكاء', textEn: 'AI', variant: 'audit' } },
      { href: '/patient/chat', icon: 'chat', labelAr: 'المحادثة الطبية المباشرة', labelEn: 'Live Clinic Chat', badge: { textAr: '24/7', textEn: '24/7', variant: 'n8n' } },
    ],
  },
  {
    titleAr: 'الأدوية والتحاليل المخبرية',
    titleEn: 'Prescriptions & Labs',
    items: [
      { href: '/patient/medications', icon: 'medication', labelAr: 'الأدوية والروشتات الرقمية', labelEn: 'Medications & Rx', badge: { textAr: 'صرف', textEn: 'Refills', variant: 'cli' } },
      { href: '/patient/labs', icon: 'biotech', labelAr: 'نتائج التحاليل والفحوصات', labelEn: 'Lab & Diagnostic Reports' },
    ],
  },
];

export function PatientShell({ pathname, children }: { pathname: string; children: ReactNode }) {
  const { direction, theme, setTheme, setDirection } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? patientShellMessages.ar : patientShellMessages.en;
  const mobileNavigation = useMobileNavigation();
  const toggleLanguage = () => setDirection(isRtl ? 'ltr' : 'rtl');

  // Keyboard shortcut (Ctrl+B / Cmd+B) for smooth sidebar toggling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        mobileNavigation.toggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileNavigation]);

  const isActive = (href: string) => {
    if (href === '/patient/ai') return pathname.startsWith('/patient/ai');
    return pathname === href;
  };

  const handleLinkClick = () => {
    document.body.style.overflow = 'auto';
    mobileNavigation.close();
  };

  return (
    <div className={`patient-app ${mobileNavigation.open ? 'is-nav-open' : ''}`} data-direction={isRtl ? 'rtl' : 'ltr'}>
      <header className="patient-header">
        <MobileMenuButton open={mobileNavigation.open} onClick={mobileNavigation.toggle} label={copy.openNav} controls="patient-nav" />
        <a className="patient-header__brand" href="/patient/dashboard" aria-label={copy.brandAria}>
          <span className="patient-header__mark">
            <img src="/logo.png" alt="Nabda Logo" style={{ width: '1.75rem', height: '1.75rem', objectFit: 'contain' }} />
          </span>
          <span>
            <strong>{isRtl ? 'منظومة نبضة' : 'Nabda Healthcare'}</strong>
            <small>{copy.brandSubtitle}</small>
          </span>
        </a>
        <div className="patient-header__tenant">
          <MaterialIcon name="verified_user" /> {copy.tenant}
        </div>
        <div className="patient-header__actions">
          <button type="button" onClick={toggleLanguage} aria-label={copy.language}>
            <MaterialIcon name="translate" />
            {copy.language}
          </button>
          <button
            type="button"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label={copy.theme}
          >
            <MaterialIcon name={theme === 'light' ? 'dark_mode' : 'light_mode'} />
          </button>
          <a href="/patient/chat" className="patient-header__chat-link" aria-label={copy.chat} title={copy.chat}>
            <img src="/chat-icon.jpg" alt="" className="chat-nav-icon" />
          </a>
          <a href="/patient/profile" className="patient-header__avatar" aria-label={copy.profile} title={copy.profile}>
            <MaterialIcon name="person" />
          </a>
        </div>
      </header>

      <div className="patient-app__body">
        {/* Smooth Backdrop overlay */}
        <div
          className={`admin-sidebar-backdrop ${mobileNavigation.open ? 'is-active' : ''}`}
          aria-hidden="true"
          onClick={mobileNavigation.close}
        />

        <aside className="patient-sidebar" id="patient-nav" aria-label={copy.services}>
          {/* Top Header Bar with Close Action */}
          <div className="admin-sidebar__header">
            <div className="admin-sidebar__header-brand">
              <span className="admin-sidebar__header-icon"><MaterialIcon name="favorite" /></span>
              <span className="admin-sidebar__header-title">{isRtl ? 'بوابة المريض الصحية' : 'Patient Health Portal'}</span>
            </div>
            <button
              type="button"
              className="admin-sidebar__close-btn"
              onClick={mobileNavigation.close}
              aria-label={isRtl ? 'إغلاق القائمة' : 'Close navigation menu'}
              title={isRtl ? 'إغلاق القائمة' : 'Close navigation menu'}
            >
              <MaterialIcon name="close" />
            </button>
          </div>

          {/* Active Clinic / Tenant Context Banner */}
          <div className="admin-sidebar__tenant-card">
            <div className="admin-sidebar__tenant-icon">
              <MaterialIcon name="local_hospital" />
            </div>
            <div className="admin-sidebar__tenant-info">
              <div className="admin-sidebar__tenant-header">
                <span className="admin-sidebar__tenant-status-dot" aria-hidden="true" />
                <span className="admin-sidebar__tenant-status-label">{isRtl ? 'الملف متصل وموثق' : 'EMR Verified & Active'}</span>
              </div>
              <strong className="admin-sidebar__tenant-title">{isRtl ? 'مستشفى النور التخصصي' : 'Al-Nour Medical Center'}</strong>
              <span className="admin-sidebar__tenant-sub">{isRtl ? 'سجل طبي رقم #MRN-9021' : 'Medical Record #MRN-9021'}</span>
            </div>
          </div>

          {/* Categorized Navigation */}
          <nav className="admin-sidebar__nav">
            {patientSections.map((sec, secIdx) => (
              <div key={secIdx} className="admin-sidebar__section">
                <div className="admin-sidebar__section-title">
                  {isRtl ? sec.titleAr : sec.titleEn}
                </div>
                <div className="admin-sidebar__section-items">
                  {sec.items.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        className={`admin-sidebar__link ${active ? 'is-active' : ''}`}
                        aria-current={active ? 'page' : undefined}
                        onClick={handleLinkClick}
                      >
                        <span className="admin-sidebar__link-icon">
                          <MaterialIcon name={link.icon} />
                        </span>
                        <span className="admin-sidebar__link-text">{isRtl ? link.labelAr : link.labelEn}</span>
                        {link.badge && (
                          <span className={`admin-sidebar__badge admin-sidebar__badge--${link.badge.variant}`}>
                            {isRtl ? link.badge.textAr : link.badge.textEn}
                          </span>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom User Profile & Security Card */}
          <div className="admin-sidebar__footer">
            <div className="admin-sidebar__user-card">
              <div className="admin-sidebar__user-avatar">
                <span>PT</span>
                <span className="admin-sidebar__user-status-indicator" />
              </div>
              <div className="admin-sidebar__user-details">
                <strong className="admin-sidebar__user-name">{isRtl ? 'أحمد محمد عبد الله' : 'Ahmed Mohamed'}</strong>
                <span className="admin-sidebar__user-email">patient@nabda.health</span>
              </div>
              <a
                href="/login"
                className="admin-sidebar__logout-btn"
                title={isRtl ? 'تسجيل الخروج' : 'Sign Out'}
                aria-label={isRtl ? 'تسجيل الخروج' : 'Sign Out'}
              >
                <MaterialIcon name="logout" />
              </a>
            </div>

            <div className="admin-sidebar__security-pill">
              <MaterialIcon name="verified_user" />
              <span>{isRtl ? 'حماية بيانات المريض • HIPAA' : 'Zero-Trust • HIPAA Compliant'}</span>
            </div>
          </div>
        </aside>

        <main className="patient-content">{children}</main>
      </div>
    </div>
  );
}
