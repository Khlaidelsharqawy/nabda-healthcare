import { type ReactNode } from 'react';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { useTheme } from '../theme/ThemeProvider';
import { MobileMenuButton } from '../components/navigation/MobileMenuButton';
import { useMobileNavigation } from '../components/navigation/useMobileNavigation';
import { patientShellMessages } from '../i18n/messages';

const links = [
  { href: '/patient/dashboard', key: 'dashboard' as const, icon: 'dashboard' },
  { href: '/patient/profile', key: 'profile' as const, icon: 'person' },
  { href: '/patient/appointments', key: 'appointments' as const, icon: 'calendar_month' },
  { href: '/patient/medications', key: 'medications' as const, icon: 'medication' },
  { href: '/patient/labs', key: 'labs' as const, icon: 'biotech' },
  { href: '/patient/ai', key: 'ai' as const, icon: 'smart_toy' },
  { href: '/patient/vitals', key: 'vitals' as const, icon: 'monitoring' },
];

export function PatientShell({ pathname, children }: { pathname: string; children: ReactNode }) {
  const { direction, theme, setTheme, setDirection } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? patientShellMessages.ar : patientShellMessages.en;
  const mobileNavigation = useMobileNavigation();
  const toggleLanguage = () => setDirection(isRtl ? 'ltr' : 'rtl');

  return (
    <div className={`patient-app ${mobileNavigation.open ? 'is-nav-open' : ''}`} data-direction={isRtl ? 'rtl' : 'ltr'}>
      <header className="patient-header">
      <MobileMenuButton open={mobileNavigation.open} onClick={mobileNavigation.toggle} label={copy.openNav} controls="patient-nav" />
        <a className="patient-header__brand" href="/patient/dashboard" aria-label={copy.brandAria}>
          <span className="patient-header__mark"><MaterialIcon name="medical_information" /></span>
          <span><strong>{isRtl ? 'منظومة عافية' : 'AegisHealth'}</strong><small>{copy.brandSubtitle}</small></span>
        </a>
        <div className="patient-header__tenant"><MaterialIcon name="verified_user" /> {copy.tenant}</div>
        <div className="patient-header__actions">
          <button type="button" onClick={toggleLanguage} aria-label={copy.language}><MaterialIcon name="translate" />{copy.language}</button>
          <button type="button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={copy.theme}><MaterialIcon name={theme === 'light' ? 'dark_mode' : 'light_mode'} /></button>
          <a href="/patient/chat" className="patient-header__chat-link" aria-label={copy.chat} title={copy.chat}>
            <img src="/chat-icon.jpg" alt="" className="chat-nav-icon" />
          </a>
          <a href="/patient/profile" className="patient-header__avatar" aria-label={copy.profile} title={copy.profile}><MaterialIcon name="person" /></a>
        </div>
      </header>
      <div className="patient-app__body">
        {mobileNavigation.open && <button className="mobile-drawer-backdrop" type="button" aria-label={copy.closeNav} onClick={mobileNavigation.close} />}
        <aside className="patient-sidebar" id="patient-nav" aria-label={copy.services}>
          <div className="patient-sidebar__scope"><MaterialIcon name="lock" /><span>{copy.selfRecords}<small>{copy.currentTenant}</small></span></div>
          <nav>{links.map((link) => { const active = pathname === link.href || (link.href === '/patient/ai' && pathname.startsWith('/patient/ai/')); return <a key={link.href} href={link.href} className={active ? 'is-active' : ''} aria-current={active ? 'page' : undefined} onClick={mobileNavigation.close}><MaterialIcon name={link.icon} /><span>{copy[link.key]}</span></a>; })}</nav>
          <div className="patient-sidebar__footer"><MaterialIcon name="shield" /> {copy.footer}</div>
        </aside>
        <main className="patient-content">{children}</main>
      </div>
    </div>
  );
}

