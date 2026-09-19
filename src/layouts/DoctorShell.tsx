import { useEffect, type ReactNode } from 'react';
import { DoctorHeader } from '../components/navigation/DoctorHeader';
import { DoctorSidebar } from '../components/navigation/DoctorSidebar';
import { useTheme } from '../theme/ThemeProvider';
import { useMobileNavigation } from '../components/navigation/useMobileNavigation';

export function DoctorShell({
  pathname,
  children,
  navigationVariant = 'default',
}: {
  pathname: string;
  children: ReactNode;
  navigationVariant?: 'default' | 'registry';
}) {
  const { direction, setDirection } = useTheme();
  const navigation = useMobileNavigation();
  const isRtl = direction === 'rtl';

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
    <div className={`doctor-app ${navigation.open ? 'is-nav-open' : ''}`} data-direction={isRtl ? 'rtl' : 'ltr'}>
      <DoctorHeader
        arabic={isRtl}
        onLanguageToggle={toggleLanguage}
        menuOpen={navigation.open}
        onMenuToggle={navigation.toggle}
        controls="doctor-nav"
      />
      <div className="doctor-app__body">
        {/* Smooth Backdrop overlay */}
        <div
          className={`admin-sidebar-backdrop ${navigation.open ? 'is-active' : ''}`}
          aria-hidden="true"
          onClick={navigation.close}
        />

        <DoctorSidebar
          pathname={pathname}
          arabic={isRtl}
          variant={navigationVariant}
          onClose={navigation.close}
          onNavigate={navigation.close}
        />
        <main className="doctor-content">{children}</main>
      </div>
    </div>
  );
}
