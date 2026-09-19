import { useState, useRef, useEffect } from 'react';
import { MaterialIcon } from '../ui/MaterialIcon';
import { doctorShellMessages } from '../../i18n/messages';
import { useTheme } from '../../theme/ThemeProvider';
import { MobileMenuButton } from './MobileMenuButton';

export function DoctorHeader({
  arabic,
  onLanguageToggle,
  menuOpen,
  onMenuToggle,
  controls,
}: {
  arabic: boolean;
  onLanguageToggle: () => void;
  menuOpen: boolean;
  onMenuToggle: () => void;
  controls?: string;
}) {
  const messages = arabic ? doctorShellMessages.ar : doctorShellMessages.en;
  const { theme, setTheme } = useTheme();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const notifRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="doctor-header" style={{ position: 'relative' }}>
      <MobileMenuButton
        open={menuOpen}
        onClick={onMenuToggle}
        label={arabic ? 'فتح قائمة التنقل' : 'Open navigation menu'}
        controls={controls}
      />

      <a className="doctor-header__identity" href="/doctor/dashboard" aria-label={messages.workspace}>
        <span className="doctor-header__logo" style={{ width: '2.5rem', height: '2.5rem', flexShrink: 0 }}>
          <MaterialIcon name="medical_services" />
        </span>
        <span className="doctor-header__wordmark">
          <strong>{arabic ? 'منظومة عافية' : 'AegisHealth'}</strong>
          <small>{arabic ? 'المنصة السريرية الذكية' : 'CLINICAL AI PLATFORM'}</small>
        </span>
      </a>

      <div className="doctor-header__context">
        <div className="doctor-header__clinic">
          <strong>{messages.clinic}</strong>
          <small>{messages.department}</small>
        </div>
        <span className="doctor-header__role">
          <MaterialIcon name="shield_person" />
          {messages.role}
        </span>
      </div>

      <div className="doctor-header__actions" ref={notifRef}>
        <button
          className="doctor-header__language"
          type="button"
          onClick={onLanguageToggle}
          aria-label={messages.language}
        >
          <MaterialIcon name="translate" />
          <span>{messages.language}</span>
        </button>

        <button
          className="doctor-header__icon-button"
          type="button"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label={messages.theme}
        >
          <MaterialIcon name={theme === 'light' ? 'dark_mode' : 'light_mode'} />
        </button>

        <a
          href="/doctor/chat"
          className="doctor-header__icon-button doctor-header__chat-link"
          aria-label={messages.chat}
          title={messages.chat}
        >
          <img src="/chat-icon.jpg" alt="" className="chat-nav-icon" />
        </a>

        {/* Doctor Clinical Notifications Popover */}
        <div style={{ position: 'relative' }}>
          <button
            className="doctor-header__icon-button doctor-header__notification"
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label={messages.notifications}
            aria-expanded={notificationsOpen}
          >
            <MaterialIcon name="notifications" />
            {unreadCount > 0 && <span />}
          </button>

          {notificationsOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: arabic ? 'auto' : 0,
                left: arabic ? 0 : 'auto',
                width: '320px',
                backgroundColor: 'var(--surface-primary, #ffffff)',
                borderRadius: '8px',
                border: '1px solid var(--border-default, #cbd5e1)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border-default, #e2e8f0)',
                  paddingBottom: '8px',
                }}
              >
                <strong style={{ fontSize: '0.875rem' }}>
                  {arabic ? 'الإشعارات السريرية' : 'Clinical Notifications'}
                </strong>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setUnreadCount(0)}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#087443',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    {arabic ? 'تحديد كمقروء' : 'Mark all read'}
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a
                  href="/doctor/refills"
                  style={{
                    textDecoration: 'none',
                    padding: '8px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--surface-subtle, #f8fafc)',
                    fontSize: '0.8125rem',
                    display: 'block',
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--text-main, #0f172a)' }}>
                    {arabic ? 'طلب تجديد وصفة دوائية' : 'Refill Request Pending'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
                    {arabic ? 'المريض: أحمد المنصور — أتورفاستاتين ٢٠ ملغ' : 'Patient: Ahmed Al-Mansoor — Atorvastatin 20mg'}
                  </div>
                </a>

                <a
                  href="/doctor/voice-sessions"
                  style={{
                    textDecoration: 'none',
                    padding: '8px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--surface-subtle, #f8fafc)',
                    fontSize: '0.8125rem',
                    display: 'block',
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--text-main, #0f172a)' }}>
                    {arabic ? 'مسودة SOAP جاهزة للمراجعة' : 'SOAP Draft Ready for Review'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
                    {arabic ? 'جلسة صوتية مكتملة بانتظار توثيق الطبيب' : 'Completed voice scribe session awaiting attestation'}
                  </div>
                </a>

                <a
                  href="/doctor/orders"
                  style={{
                    textDecoration: 'none',
                    padding: '8px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--surface-subtle, #f8fafc)',
                    fontSize: '0.8125rem',
                    display: 'block',
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--text-main, #0f172a)' }}>
                    {arabic ? 'نتائج مخبرية حرجة جاهزة' : 'Critical Diagnostic Lab Results'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
                    {arabic ? 'لوحة تحاليل الدهون والإنزيمات — مريض PT-01' : 'Lipid panel results ready for patient PT-01'}
                  </div>
                </a>
              </div>
            </div>
          )}
        </div>

        <a
          href="/doctor/profile"
          className="doctor-header__profile"
          aria-label={messages.profile}
          title={messages.profile}
        >
          <div>
            <strong>{messages.doctor}</strong>
            <small>{messages.specialty}</small>
          </div>
          <span className="doctor-header__avatar">
            <MaterialIcon name="person" />
          </span>
        </a>
      </div>
    </header>
  );
}
