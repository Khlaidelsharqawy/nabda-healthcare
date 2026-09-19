import { type ReactNode } from 'react';
import { AssistantHeader } from '../components/navigation/AssistantHeader';
import { AssistantSidebar } from '../components/navigation/AssistantSidebar';
import { useTheme } from '../theme/ThemeProvider';
import { useMobileNavigation } from '../components/navigation/useMobileNavigation';

export function AssistantShell({ pathname, children }: { pathname: string; children: ReactNode }) {
  const { direction, setDirection } = useTheme();
  const mobileNavigation = useMobileNavigation();
  const isRtl = direction === 'rtl';

  const toggleLanguage = () => setDirection(isRtl ? 'ltr' : 'rtl');

  return (
    <div className={`assistant-app ${mobileNavigation.open ? 'is-nav-open' : ''}`} data-direction={isRtl ? 'rtl' : 'ltr'}>
      <AssistantHeader arabic={isRtl} onLanguageToggle={toggleLanguage} menuOpen={mobileNavigation.open} onMenuToggle={mobileNavigation.toggle} controls="assistant-nav" />
      <div className="assistant-app__body">
        {mobileNavigation.open && <button className="mobile-drawer-backdrop" type="button" aria-label={isRtl ? 'إغلاق قائمة التنقل' : 'Close navigation menu'} onClick={mobileNavigation.close} />}
        <AssistantSidebar pathname={pathname} arabic={isRtl} onNavigate={mobileNavigation.close} />
        <main className="assistant-content">{children}</main>
      </div>
    </div>
  );
}
