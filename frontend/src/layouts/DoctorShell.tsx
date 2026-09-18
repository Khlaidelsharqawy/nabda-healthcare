import { useState, type ReactNode } from 'react';
import { DoctorHeader } from '../components/navigation/DoctorHeader';
import { DoctorSidebar } from '../components/navigation/DoctorSidebar';
import { useTheme } from '../theme/ThemeProvider';

export function DoctorShell({ pathname, children, navigationVariant = 'default' }: { pathname: string; children: ReactNode; navigationVariant?: 'default' | 'registry' }) {
  const { direction } = useTheme();
  const [arabic, setArabic] = useState(direction === 'rtl');

  const toggleLanguage = () => {
    setArabic((value) => {
      const next = !value;
      document.documentElement.dir = next ? 'rtl' : 'ltr';
      document.documentElement.lang = next ? 'ar' : 'en';
      return next;
    });
  };

  return (
    <div className="doctor-app" data-direction={arabic ? 'rtl' : 'ltr'}>
      <DoctorHeader arabic={arabic} onLanguageToggle={toggleLanguage} />
      <div className="doctor-app__body">
        <DoctorSidebar pathname={pathname} arabic={arabic} variant={navigationVariant} />
        <main className="doctor-content">{children}</main>
      </div>
    </div>
  );
}
