import { type ReactNode } from 'react';
import { MobileMenuButton } from '../components/navigation/MobileMenuButton';
import { useMobileNavigation } from '../components/navigation/useMobileNavigation';
import { MaterialIcon, Button } from '../components/ui';
import { useTheme } from '../theme/ThemeProvider';
import { publicMessages } from '../i18n/messages';

const navLinks = [
  { href: '/clinic/al-nour', label: 'Overview', labelAr: 'نظرة عامة', icon: 'info' },
  { href: '/clinic/al-nour/doctors', label: 'Doctors', labelAr: 'الأطباء', icon: 'groups' },
  { href: '/clinic/al-nour/services', label: 'Services', labelAr: 'الخدمات', icon: 'medical_services' },
  { href: '/clinic/al-nour/booking/confirmed', label: 'Booking', labelAr: 'الحجز', icon: 'event_available' },
];

export function PublicClinicShell({ children }: { children: ReactNode }) {
  const { theme, setTheme, direction, setDirection } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? publicMessages.ar : publicMessages.en;
  const mobileNavigation = useMobileNavigation();
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  const toggleLanguage = () => setDirection(isRtl ? 'ltr' : 'rtl');

  return (
    <div className="public-clinic-shell" data-direction={isRtl ? 'rtl' : 'ltr'}>
      <header className="public-clinic-shell__header">
        <a href="/" className="public-clinic-shell__brand" aria-label={isRtl ? 'الصفحة الرئيسية لمنظومة عافية' : 'AegisHealth home'}>
          <span className="public-clinic-shell__mark">
            <MaterialIcon name="medical_information" />
          </span>
          <span>
            <strong>{isRtl ? 'منظومة عافية' : 'AegisHealth'}</strong>
            <small>{isRtl ? 'مجمع عافية الطبي التجريبي' : 'AegisHealth Demo Medical Center'}</small>
          </span>
        </a>

        <nav className="public-clinic-shell__nav" aria-label="Clinic navigation">
          {navLinks.map((link) => {
            const isActive = currentPath === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={isActive ? 'is-active' : ''}
                aria-current={isActive ? 'page' : undefined}
              >
                <MaterialIcon name={link.icon} />
                <span>{isRtl ? link.labelAr : link.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="public-clinic-shell__actions">
          <MobileMenuButton
            open={mobileNavigation.open}
            onClick={mobileNavigation.toggle}
            label={isRtl ? 'فتح قائمة التنقل' : 'Open clinic navigation'}
            controls="clinic-nav"
          />
          <Button
            variant="ghost"
            size="sm"
            icon="translate"
            onClick={toggleLanguage}
            aria-label={isRtl ? 'تغيير اللغة' : 'Toggle language'}
          >
            {isRtl ? 'عربي' : 'EN'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={theme === 'light' ? 'dark_mode' : 'light_mode'}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label={isRtl ? 'تغيير المظهر' : 'Toggle theme'}
          />
          <a href="/login" className="ui-btn ui-btn--primary ui-btn--sm">
            <MaterialIcon name="login" />
            <span>{copy.login}</span>
          </a>
        </div>
      </header>

      {mobileNavigation.open && (
        <button
          type="button"
          className="mobile-drawer-backdrop"
          aria-label={isRtl ? 'إغلاق قائمة التنقل' : 'Close navigation menu'}
          onClick={mobileNavigation.close}
        />
      )}

      <aside
        id="clinic-nav"
        className={`public-clinic-shell__drawer ${mobileNavigation.open ? 'is-open' : ''}`}
        aria-label="Clinic navigation"
      >
        <div className="public-clinic-shell__drawer-brand">
          <strong>{isRtl ? 'مجمع عافية التجريبي' : 'AegisHealth Demo Center'}</strong>
        </div>
        {navLinks.map((link) => {
          const isActive = currentPath === link.href;
          return (
            <a
              key={link.href}
              href={link.href}
              className={isActive ? 'is-active' : ''}
              aria-current={isActive ? 'page' : undefined}
              onClick={mobileNavigation.close}
            >
              <MaterialIcon name={link.icon} />
              <span>{isRtl ? link.labelAr : link.label}</span>
            </a>
          );
        })}
      </aside>

      <main className="public-clinic-shell__content">{children}</main>

      <footer className="public-clinic-shell__footer">
        <div className="public-clinic-shell__footer-brand">
          <strong>{isRtl ? 'منظومة عافية' : 'AegisHealth'}</strong>
          <span>{isRtl ? 'نظام العيادات الذكية الموحد' : 'Unified Clinical Healthcare Ecosystem'}</span>
        </div>
        <div className="public-clinic-shell__footer-links">
          <a href="/">{isRtl ? 'الرئيسية' : 'Home'}</a>
          <a href="/clinic/al-nour">{copy.clinic}</a>
          <a href="/login">{copy.login}</a>
        </div>
      </footer>
    </div>
  );
}
