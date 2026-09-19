import { MaterialIcon } from '../ui/MaterialIcon';
import { doctorShellMessages } from '../../i18n/messages';

interface DoctorNavSection {
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

const doctorSections: DoctorNavSection[] = [
  {
    titleAr: 'السريرية والاستشارات',
    titleEn: 'Clinical & Consultations',
    items: [
      { href: '/doctor/dashboard', icon: 'grid_view', labelAr: 'لوحة العمل السريري', labelEn: 'Clinical Dashboard', badge: { textAr: 'مباشر', textEn: 'Live', variant: 'live' } },
      { href: '/doctor/appointments', icon: 'calendar_month', labelAr: 'جدول المواعيد والعيادة', labelEn: 'Appointments Schedule' },
      { href: '/doctor/ai', icon: 'stethoscope', labelAr: 'مساحة الذكاء الاصطناعي', labelEn: 'AI Clinical Workspace', badge: { textAr: 'AI Scribe', textEn: 'AI Scribe', variant: 'audit' } },
      { href: '/doctor/voice-sessions', icon: 'mic', labelAr: 'جلسات الاستماع الصوتي', labelEn: 'Ambient Voice Scribe', badge: { textAr: 'Voice', textEn: 'Voice', variant: 'n8n' } },
    ],
  },
  {
    titleAr: 'المرضى والسجلات الطبية',
    titleEn: 'Patients & Records',
    items: [
      { href: '/doctor/patients', icon: 'groups', labelAr: 'دليل المرضى وسجلات EMR', labelEn: 'Patients & EMR', badge: { textAr: 'EMR', textEn: 'EMR', variant: 'rbac' } },
      { href: '/doctor/orders', icon: 'menu_book', labelAr: 'أوامر التحاليل والأشعة', labelEn: 'Clinical Orders' },
      { href: '/doctor/refills', icon: 'autorenew', labelAr: 'تجديد وإعادة صرف الروشتات', labelEn: 'Prescription Refills', badge: { textAr: 'Refills', textEn: 'Refills', variant: 'cli' } },
    ],
  },
  {
    titleAr: 'التواصل والدعم السريري',
    titleEn: 'Communications & Triage',
    items: [
      { href: '/doctor/communications', icon: 'support_agent', labelAr: 'فرز واستفسارات المرضى', labelEn: 'Patient Inquiries Hub' },
    ],
  },
];

export function DoctorSidebar({
  pathname,
  arabic,
  onClose,
}: {
  pathname: string;
  arabic: boolean;
  variant?: 'default' | 'registry';
  onNavigate?: () => void;
  onClose?: () => void;
}) {
  const messages = arabic ? doctorShellMessages.ar : doctorShellMessages.en;

  const isActive = (href: string) => {
    if (href === '/doctor/patients') return pathname.startsWith('/doctor/patients');
    if (href === '/doctor/orders') return pathname.startsWith('/doctor/orders') || pathname.startsWith('/doctor/medications/') || pathname.startsWith('/doctor/prescriptions/');
    if (href === '/doctor/ai') return pathname.startsWith('/doctor/ai');
    if (href === '/doctor/voice-sessions') return pathname.startsWith('/doctor/voice-sessions');
    if (href === '/doctor/communications') return pathname === '/doctor/communications';
    if (href === '/doctor/refills') return pathname === '/doctor/refills';
    return pathname === href;
  };

  return (
    <aside className="doctor-sidebar" id="doctor-nav" aria-label={messages.workspace}>
      {/* Top Header Bar with Close Action */}
      <div className="admin-sidebar__header">
        <div className="admin-sidebar__header-brand">
          <span className="admin-sidebar__header-icon"><MaterialIcon name="medical_services" /></span>
          <span className="admin-sidebar__header-title">{arabic ? 'عيادة الطبيب المعالج' : 'Doctor Clinical Workspace'}</span>
        </div>
        <button
          type="button"
          className="admin-sidebar__close-btn"
          onClick={onClose}
          aria-label={arabic ? 'إغلاق القائمة' : 'Close navigation menu'}
          title={arabic ? 'إغلاق القائمة' : 'Close navigation menu'}
        >
          <MaterialIcon name="close" />
        </button>
      </div>

      {/* Active Clinic / Tenant Context Banner */}
      <div className="admin-sidebar__tenant-card">
        <div className="admin-sidebar__tenant-icon">
          <MaterialIcon name="domain" />
        </div>
        <div className="admin-sidebar__tenant-info">
          <div className="admin-sidebar__tenant-header">
            <span className="admin-sidebar__tenant-status-dot" aria-hidden="true" />
            <span className="admin-sidebar__tenant-status-label">{arabic ? 'العيادة متصلة ومزامنة' : 'Clinic Online & Synced'}</span>
          </div>
          <strong className="admin-sidebar__tenant-title">{arabic ? 'مستشفى النور التخصصي' : 'Al-Nour Medical Center'}</strong>
          <span className="admin-sidebar__tenant-sub">{arabic ? 'قسم الباطنة والقلب' : 'Cardiology & Internal Medicine'}</span>
        </div>
      </div>

      {/* Categorized Navigation */}
      <nav className="admin-sidebar__nav">
        {doctorSections.map((sec, secIdx) => (
          <div key={secIdx} className="admin-sidebar__section">
            <div className="admin-sidebar__section-title">
              {arabic ? sec.titleAr : sec.titleEn}
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
                    onClick={() => {
                      document.body.style.overflow = 'auto';
                      onClose?.();
                    }}
                  >
                    <span className="admin-sidebar__link-icon">
                      <MaterialIcon name={link.icon} />
                    </span>
                    <span className="admin-sidebar__link-text">{arabic ? link.labelAr : link.labelEn}</span>
                    {link.badge && (
                      <span className={`admin-sidebar__badge admin-sidebar__badge--${link.badge.variant}`}>
                        {arabic ? link.badge.textAr : link.badge.textEn}
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
            <span>DR</span>
            <span className="admin-sidebar__user-status-indicator" />
          </div>
          <div className="admin-sidebar__user-details">
            <strong className="admin-sidebar__user-name">{arabic ? 'د. طارق منصور' : 'Dr. Tarek Mansour'}</strong>
            <span className="admin-sidebar__user-email">doctor@nabda.health</span>
          </div>
          <a
            href="/login"
            className="admin-sidebar__logout-btn"
            title={arabic ? 'تسجيل الخروج' : 'Sign Out'}
            aria-label={arabic ? 'تسجيل الخروج' : 'Sign Out'}
          >
            <MaterialIcon name="logout" />
          </a>
        </div>

        <div className="admin-sidebar__security-pill">
          <MaterialIcon name="verified_user" />
          <span>{arabic ? 'حماية Zero-Trust • معتمد HIPAA' : 'Zero-Trust • HIPAA Compliant'}</span>
        </div>
      </div>
    </aside>
  );
}
