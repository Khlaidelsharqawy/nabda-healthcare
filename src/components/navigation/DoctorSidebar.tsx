import { MaterialIcon } from '../ui/MaterialIcon';
import { doctorShellMessages } from '../../i18n/messages';

const links = [
  { href: '/doctor/dashboard', icon: 'grid_view', message: 'dashboard' as const },
  { href: '/doctor/appointments', icon: 'calendar_month', message: 'schedule' as const },
  { href: '/doctor/patients', icon: 'groups', message: 'patients' as const },
  { href: '/doctor/orders', icon: 'menu_book', message: 'orders' as const },
  { href: '/doctor/ai', icon: 'clinical_notes', message: 'aiScribe' as const },
];

const registryLinks = [
  ...links.slice(0, 2),
  links[2],
  { href: '/doctor/ai', icon: 'stethoscope', message: 'workspaceShort' as const },
  { href: '/doctor/voice-sessions', icon: 'mic', message: 'scribe' as const },
  { href: '/doctor/orders', icon: 'menu_book', message: 'protocols' as const },
  { href: '/doctor/refills', icon: 'autorenew', message: 'refills' as const },
  { href: '/doctor/communications', icon: 'support_agent', message: 'help' as const },
];

export function DoctorSidebar({ pathname, arabic, variant = 'default', onNavigate }: { pathname: string; arabic: boolean; variant?: 'default' | 'registry'; onNavigate?: () => void }) {
  const messages = arabic ? doctorShellMessages.ar : doctorShellMessages.en;
  const navigation = variant === 'registry' ? registryLinks : links;

  const isActive = (link: typeof links[number] | typeof registryLinks[number]) => {
    if (link.href === '/doctor/patients') return pathname.startsWith('/doctor/patients');
    if (link.href === '/doctor/orders') return pathname.startsWith('/doctor/orders') || pathname.startsWith('/doctor/medications/') || pathname.startsWith('/doctor/prescriptions/');
    if (link.href === '/doctor/ai') return pathname.startsWith('/doctor/ai');
    if (link.href === '/doctor/voice-sessions') return pathname.startsWith('/doctor/voice-sessions');
    if (link.href === '/doctor/communications') return pathname === '/doctor/communications';
    if (link.href === '/doctor/refills') return pathname === '/doctor/refills';
    return pathname === link.href;
  };

  return (
    <aside className="doctor-sidebar" id="doctor-nav" aria-label={messages.workspace}>
      <div className="doctor-sidebar__brand">
        <div className="doctor-sidebar__brand-mark"><MaterialIcon name="health_metrics" /></div>
        <span>{messages.workspace}</span>
        <span className="doctor-sidebar__active">{messages.active}</span>
      </div>
      <div className="doctor-sidebar__attestation">
        <MaterialIcon name="verified_user" />
        <span>{messages.attestation}</span>
      </div>
      <nav className="doctor-sidebar__nav">
        {navigation.map((link, index) => {
          const active = isActive(link);
          return (
            <a
              className={active ? 'doctor-sidebar__link is-active' : 'doctor-sidebar__link'}
              href={link.href}
              key={`${link.href}-${index}`}
              aria-current={active ? 'page' : undefined}
              onClick={() => {
                document.body.style.overflow = 'auto';
                onNavigate?.();
              }}
            >
              <MaterialIcon name={link.icon} />
              <span>{messages[link.message]}</span>
            </a>
          );
        })}
      </nav>
      <div className="doctor-sidebar__status">
        <span className="doctor-sidebar__status-title">{messages.aiStatus}</span>
        <span className="doctor-sidebar__status-copy">{messages.aiReady}</span>
        <span className="doctor-sidebar__status-dot" />
      </div>
    </aside>
  );
}
