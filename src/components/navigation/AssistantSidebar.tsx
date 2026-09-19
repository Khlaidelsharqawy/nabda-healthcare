import { MaterialIcon } from '../ui/MaterialIcon';
import { assistantShellMessages } from '../../i18n/messages';

interface AssistantNavSection {
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

const assistantSections: AssistantNavSection[] = [
  {
    titleAr: 'الاستقبال والتسجيل السريري',
    titleEn: 'Front Desk & Intake',
    items: [
      { href: '/assistant/patients', icon: 'groups', labelAr: 'دليل المرضى وسجلات الحالات', labelEn: 'Patients Directory' },
      { href: '/assistant/patients/register', icon: 'person_add', labelAr: 'تسجيل مريض جديد وطوارئ', labelEn: 'Register New Patient', badge: { textAr: 'تسجيل', textEn: 'Intake', variant: 'live' } },
      { href: '/assistant/orders/intake', icon: 'inventory_2', labelAr: 'استلام وفرز الطلبات المخبرية', labelEn: 'Orders Intake Hub' },
    ],
  },
  {
    titleAr: 'المواعيد وإدارة العيادة',
    titleEn: 'Appointments & Flow',
    items: [
      { href: '/assistant/appointments', icon: 'calendar_month', labelAr: 'جدول المواعيد والحجوزات', labelEn: 'Appointments Schedule' },
      { href: '/assistant/queue', icon: 'queue', labelAr: 'طابور الانتظار وتسكين الغرف', labelEn: 'Clinic Queue & Rooms', badge: { textAr: 'مباشر', textEn: 'Live', variant: 'n8n' } },
    ],
  },
  {
    titleAr: 'الأتمتة والذكاء الاصطناعي',
    titleEn: 'Automation & AI',
    items: [
      { href: '/assistant/communications', icon: 'chat', labelAr: 'الرسائل والتواصل المباشر', labelEn: 'Patient Inquiries' },
      { href: '/assistant/ai', icon: 'smart_toy', labelAr: 'أتمتة المساعد الذكي n8n', labelEn: 'AI & Automation Hub', badge: { textAr: 'n8n', textEn: 'n8n', variant: 'rbac' } },
      { href: '/assistant/ai/communications', icon: 'auto_awesome', labelAr: 'مسودات الردود الذكية', labelEn: 'AI Smart Drafts', badge: { textAr: 'تلقائي', textEn: 'Auto', variant: 'cli' } },
    ],
  },
];

export function AssistantSidebar({
  pathname,
  arabic = false,
  onClose,
  onNavigate,
}: {
  pathname: string;
  arabic?: boolean;
  onClose?: () => void;
  onNavigate?: () => void;
}) {
  const messages = arabic ? assistantShellMessages.ar : assistantShellMessages.en;

  const isActive = (href: string) => {
    if (href === '/assistant/patients') return pathname === '/assistant/patients';
    if (href === '/assistant/patients/register') return pathname === '/assistant/patients/register';
    if (href === '/assistant/appointments') return pathname === '/assistant/appointments';
    if (href === '/assistant/queue') return pathname === '/assistant/queue';
    if (href === '/assistant/communications') return pathname === '/assistant/communications';
    if (href === '/assistant/ai') return pathname === '/assistant/ai';
    if (href === '/assistant/ai/communications') return pathname === '/assistant/ai/communications';
    if (href === '/assistant/orders/intake') return pathname === '/assistant/orders/intake';
    return pathname === href;
  };

  const handleLinkClick = () => {
    document.body.style.overflow = 'auto';
    onClose?.();
    onNavigate?.();
  };

  return (
    <aside className="assistant-sidebar" id="assistant-nav" aria-label={messages.operations}>
      {/* Top Header Bar with Close Action */}
      <div className="admin-sidebar__header">
        <div className="admin-sidebar__header-brand">
          <span className="admin-sidebar__header-icon"><MaterialIcon name="support_agent" /></span>
          <span className="admin-sidebar__header-title">{arabic ? 'مكتب المساعد الطبي' : 'Clinical Assistant Hub'}</span>
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
            <span className="admin-sidebar__tenant-status-label">{arabic ? 'الاستقبال متصل ومباشر' : 'Desk Online & Synced'}</span>
          </div>
          <strong className="admin-sidebar__tenant-title">{arabic ? 'مستشفى النور التخصصي' : 'Al-Nour Medical Center'}</strong>
          <span className="admin-sidebar__tenant-sub">{arabic ? 'قسم الاستقبال والتنسيق الطبي' : 'Front Desk & Patient Services'}</span>
        </div>
      </div>

      {/* Categorized Navigation */}
      <nav className="admin-sidebar__nav">
        {assistantSections.map((sec, secIdx) => (
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
                    onClick={handleLinkClick}
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
            <span>AS</span>
            <span className="admin-sidebar__user-status-indicator" />
          </div>
          <div className="admin-sidebar__user-details">
            <strong className="admin-sidebar__user-name">{arabic ? 'سارة أحمد' : 'Sarah Ahmed'}</strong>
            <span className="admin-sidebar__user-email">assistant@nabda.health</span>
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
