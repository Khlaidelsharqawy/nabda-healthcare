import { type ReactNode } from 'react';
import { DoctorHeader } from '../components/navigation/DoctorHeader';
import { DoctorSidebar } from '../components/navigation/DoctorSidebar';
import { useTheme } from '../theme/ThemeProvider';
import { useMobileNavigation } from '../components/navigation/useMobileNavigation';

export function DoctorShell({ pathname, children, navigationVariant = 'default' }: { pathname: string; children: ReactNode; navigationVariant?: 'default' | 'registry' }) {
  const { direction, setDirection } = useTheme();
  const mobileNavigation = useMobileNavigation();
  const isRtl = direction === 'rtl';

  const toggleLanguage = () => setDirection(isRtl ? 'ltr' : 'rtl');

  return (
    <div className={`doctor-app ${mobileNavigation.open ? 'is-nav-open' : ''}`} data-direction={isRtl ? 'rtl' : 'ltr'}>
      <DoctorHeader arabic={isRtl} onLanguageToggle={toggleLanguage} menuOpen={mobileNavigation.open} onMenuToggle={mobileNavigation.toggle} controls="doctor-nav" />
      <div className="doctor-app__body">
        {mobileNavigation.open && <button className="mobile-drawer-backdrop" type="button" aria-label={isRtl ? 'إغلاق قائمة التنقل' : 'Close navigation menu'} onClick={mobileNavigation.close} />}
        <DoctorSidebar pathname={pathname} arabic={isRtl} variant={navigationVariant} onNavigate={mobileNavigation.close} />
        <main className="doctor-content">{children}</main>
      </div>
    </div>
  );
}
