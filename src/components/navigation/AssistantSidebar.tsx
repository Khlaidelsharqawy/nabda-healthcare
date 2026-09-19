import { MaterialIcon } from '../ui/MaterialIcon';
import { assistantShellMessages } from '../../i18n/messages';

const links = [
  { href: '/assistant/patients', icon: 'groups', message: 'patients' as const },
  { href: '/assistant/patients/register', icon: 'person_add', message: 'register' as const },
  { href: '/assistant/appointments', icon: 'calendar_month', message: 'appointments' as const },
  { href: '/assistant/queue', icon: 'queue', message: 'queue' as const },
  { href: '/assistant/communications', icon: 'chat', message: 'communications' as const },
  { href: '/assistant/ai', icon: 'smart_toy', message: 'ai' as const },
  { href: '/assistant/ai/communications', icon: 'auto_awesome', message: 'drafts' as const },
  { href: '/assistant/orders/intake', icon: 'inventory_2', message: 'intake' as const },
];

export function AssistantSidebar({ pathname, onNavigate, arabic = false }: { pathname: string; onNavigate?: () => void; arabic?: boolean }) {
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

  return (
    <aside className="assistant-sidebar" id="assistant-nav" aria-label={messages.operations}>
      <div className="assistant-sidebar__top">
        <span className="assistant-sidebar__title">{messages.operations}</span>
        <span className="assistant-sidebar__status">{messages.active}</span>
      </div>
      <nav className="assistant-sidebar__nav">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={isActive(link.href) ? 'assistant-sidebar__link is-active' : 'assistant-sidebar__link'}
            aria-current={isActive(link.href) ? 'page' : undefined}
            onClick={() => {
              document.body.style.overflow = 'auto';
              onNavigate?.();
            }}
          >
            <MaterialIcon name={link.icon} />
            <span>{messages[link.message]}</span>
          </a>
        ))}
      </nav>
      <div className="assistant-sidebar__foot">
        <MaterialIcon name="shield" />
        <span>{messages.footer}</span>
      </div>
    </aside>
  );
}
