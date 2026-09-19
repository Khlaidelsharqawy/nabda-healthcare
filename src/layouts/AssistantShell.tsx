import { useEffect, type ReactNode } from 'react';
import { AssistantHeader } from '../components/navigation/AssistantHeader';
import { AssistantSidebar } from '../components/navigation/AssistantSidebar';
import { useTheme } from '../theme/ThemeProvider';
import { useMobileNavigation } from '../components/navigation/useMobileNavigation';

export function AssistantShell({ pathname, children }: { pathname: string; children: ReactNode }) {
  const { direction, setDirection } = useTheme();
  const mobileNavigation = useMobileNavigation();
  const isRtl = direction === 'rtl';

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

  return (
    <div className={`assistant-app ${mobileNavigation.open ? 'is-nav-open' : ''}`} data-direction={isRtl ? 'rtl' : 'ltr'}>
      <AssistantHeader
        arabic={isRtl}
        onLanguageToggle={toggleLanguage}
        menuOpen={mobileNavigation.open}
        onMenuToggle={mobileNavigation.toggle}
        controls="assistant-nav"
      />
      <div className="assistant-app__body">
        {/* Smooth Backdrop overlay */}
        <div
          className={`admin-sidebar-backdrop ${mobileNavigation.open ? 'is-active' : ''}`}
          aria-hidden="true"
          onClick={mobileNavigation.close}
        />
        <AssistantSidebar
          pathname={pathname}
          arabic={isRtl}
          onClose={mobileNavigation.close}
          onNavigate={mobileNavigation.close}
        />
        <main className="assistant-content">{children}</main>
      </div>
    </div>
  );
}
