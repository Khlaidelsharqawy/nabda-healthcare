import { useEffect, type ReactNode } from 'react';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { useMobileNavigation } from '../components/navigation/useMobileNavigation';
import { useTheme } from '../theme/ThemeProvider';
import { adminShellMessages } from '../i18n/messages';

interface SidebarLink {
  href: string;
  key: keyof typeof adminShellMessages.en.links;
  icon: string;
  badge?: keyof typeof adminShellMessages.en.badges;
}

interface SidebarSection {
  sectionKey: keyof typeof adminShellMessages.en.sections;
  items: SidebarLink[];
}

const navSections: SidebarSection[] = [
  {
    sectionKey: 'operations',
    items: [
      { href: '/admin/dashboard', key: 'dashboard', icon: 'dashboard', badge: 'live' },
      { href: '/admin/clinics', key: 'clinics', icon: 'local_hospital' },
      { href: '/admin/clinics/provision', key: 'provisioning', icon: 'add_business' },
    ],
  },
  {
    sectionKey: 'identity',
    items: [
      { href: '/admin/users', key: 'users', icon: 'group', badge: 'rbac' },
      { href: '/admin/integrations', key: 'integrations', icon: 'hub', badge: 'n8n' },
    ],
  },
  {
    sectionKey: 'security',
    items: [
      { href: '/admin/security', key: 'security', icon: 'security', badge: 'audit' },
      { href: '/admin/subscriptions', key: 'subscriptions', icon: 'receipt_long' },
      { href: '/admin/remote-console', key: 'remoteConsole', icon: 'terminal', badge: 'cli' },
    ],
  },
];

export function AdminShell({ pathname, children }: { pathname: string; children: ReactNode }) {
  const { direction, theme, setDirection, setTheme } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = adminShellMessages[isRtl ? 'ar' : 'en'];
  const navigation = useMobileNavigation();

  const toggleLanguage = () => setDirection(isRtl ? 'ltr' : 'rtl');

  // Keyboard shortcut (Ctrl+B / Cmd+B) for smooth sidebar toggling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        navigation.toggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigation]);

  return (
    <div className={`admin-app ${navigation.open ? 'is-nav-open' : ''}`} data-direction={isRtl ? 'rtl' : 'ltr'}>
      <header className="admin-header">
        <button
          type="button"
          className="admin-header__menu-btn"
          onClick={navigation.toggle}
          aria-label={navigation.open ? copy.closeNav : copy.openNav}
          aria-expanded={navigation.open}
          aria-controls="admin-nav"
          title={isRtl ? 'القائمة الجانبية (Ctrl+B)' : 'Toggle Sidebar (Ctrl+B)'}
        >
          <MaterialIcon name={navigation.open ? 'close' : 'menu'} />
        </button>

        <a href="/admin/dashboard" className="admin-header__brand" aria-label={copy.brandAria}>
          <span className="admin-header__mark"><MaterialIcon name="admin_panel_settings" /></span>
          <span className="admin-header__wordmark">
            <strong>{isRtl ? 'منظومة نبضة' : 'Nabda'}</strong>
            <small>{copy.brandSub}</small>
          </span>
        </a>

        <div className="admin-header__meta">
          <span className="admin-header__pill"><MaterialIcon name="verified_user" />{copy.platformTrust}</span>
          <span className="admin-header__tenant">{copy.tenantOps}</span>
        </div>

        <div className="admin-header__actions">
          <button type="button" className="admin-header__lang" onClick={toggleLanguage} aria-label={copy.toggleLanguage}>
            <MaterialIcon name="translate" />
            <span>{isRtl ? 'عربي' : 'EN'}</span>
          </button>
          <button type="button" className="admin-header__icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={copy.toggleTheme}>
            <MaterialIcon name={theme === 'light' ? 'dark_mode' : 'light_mode'} />
          </button>
          <a href="/admin/profile" className="admin-header__profile" aria-label={copy.profile} title={copy.profile}>
            <span className="admin-header__avatar"><MaterialIcon name="person" /></span>
            <div>
              <strong>{copy.globalOps}</strong>
              <small>{copy.platformTeam}</small>
            </div>
          </a>
        </div>
      </header>

      <div className="admin-app__body">
        {/* Smooth Backdrop overlay */}
        <div
          className={`admin-sidebar-backdrop ${navigation.open ? 'is-active' : ''}`}
          aria-hidden="true"
          onClick={navigation.close}
        />

        <aside className="admin-sidebar" id="admin-nav" aria-label={copy.operations}>
          {/* Top Bar with Brand & Close Action */}
          <div className="admin-sidebar__header">
            <div className="admin-sidebar__header-brand">
              <span className="admin-sidebar__header-icon"><MaterialIcon name="admin_panel_settings" /></span>
              <span className="admin-sidebar__header-title">{isRtl ? 'لوحة الإدارة المركزية' : 'Admin Operations'}</span>
            </div>
            <button
              type="button"
              className="admin-sidebar__close-btn"
              onClick={navigation.close}
              aria-label={copy.closeNav}
              title={copy.closeNav}
            >
              <MaterialIcon name="close" />
            </button>
          </div>

          {/* Active Tenant / Clinic Context Banner */}
          <div className="admin-sidebar__tenant-card">
            <div className="admin-sidebar__tenant-icon">
              <MaterialIcon name="domain" />
            </div>
            <div className="admin-sidebar__tenant-info">
              <div className="admin-sidebar__tenant-header">
                <span className="admin-sidebar__tenant-status-dot" aria-hidden="true" />
                <span className="admin-sidebar__tenant-status-label">{copy.syncedStatus}</span>
              </div>
              <strong className="admin-sidebar__tenant-title">{copy.activeTenantName}</strong>
              <span className="admin-sidebar__tenant-sub">{copy.activeTenantLabel}</span>
            </div>
          </div>

          {/* Categorized Navigation */}
          <nav className="admin-sidebar__nav">
            {navSections.map((sec) => (
              <div key={sec.sectionKey} className="admin-sidebar__section">
                <div className="admin-sidebar__section-title">
                  {copy.sections[sec.sectionKey]}
                </div>
                <div className="admin-sidebar__section-items">
                  {sec.items.map((link) => {
                    const isClinicIndexLink = link.href === '/admin/clinics';
                    const isClinicDetailRoute = pathname.startsWith('/admin/clinics/') && !pathname.startsWith('/admin/clinics/provision');
                    const isClinicUserRoute = pathname.startsWith('/admin/clinics/') && pathname.endsWith('/users');
                    const isClinicUsageRoute = pathname.startsWith('/admin/clinics/') && pathname.endsWith('/usage');
                    const active = pathname === link.href
                      || (isClinicIndexLink && (pathname === '/admin/clinics' || isClinicDetailRoute || isClinicUserRoute || isClinicUsageRoute));
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        className={`admin-sidebar__link ${active ? 'is-active' : ''}`}
                        aria-current={active ? 'page' : undefined}
                        onClick={navigation.close}
                      >
                        <span className="admin-sidebar__link-icon">
                          <MaterialIcon name={link.icon} />
                        </span>
                        <span className="admin-sidebar__link-text">{copy.links[link.key]}</span>
                        {link.badge && (
                          <span className={`admin-sidebar__badge admin-sidebar__badge--${link.badge}`}>
                            {copy.badges[link.badge]}
                          </span>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer with Super Admin Profile Card */}
          <div className="admin-sidebar__footer">
            <div className="admin-sidebar__user-card">
              <div className="admin-sidebar__user-avatar">
                <span>SA</span>
                <span className="admin-sidebar__user-status-indicator" />
              </div>
              <div className="admin-sidebar__user-details">
                <strong className="admin-sidebar__user-name">{copy.superAdminTitle}</strong>
                <span className="admin-sidebar__user-email">{copy.superAdminEmail}</span>
              </div>
              <a
                href="/login"
                className="admin-sidebar__logout-btn"
                title={copy.logoutLabel}
                aria-label={copy.logoutLabel}
              >
                <MaterialIcon name="logout" />
              </a>
            </div>

            <div className="admin-sidebar__security-pill">
              <MaterialIcon name="verified_user" />
              <span>{copy.securityCompliance}</span>
            </div>
          </div>
        </aside>

        <main className="admin-content">
          <div className="admin-page">{children}</div>
        </main>
      </div>
    </div>
  );
}

