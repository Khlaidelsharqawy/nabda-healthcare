import { useState, useRef, useEffect } from 'react';
import { MaterialIcon } from '../ui/MaterialIcon';
import { useTheme } from '../../theme/ThemeProvider';
import { MobileMenuButton } from './MobileMenuButton';
import { assistantShellMessages } from '../../i18n/messages';

export function AssistantHeader({
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
  const { theme, setTheme } = useTheme();
  const messages = arabic ? assistantShellMessages.ar : assistantShellMessages.en;
  const label = arabic ? 'عربي' : 'EN';

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
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
    <header className="assistant-header" style={{ position: 'relative' }}>
      <MobileMenuButton
        open={menuOpen}
        onClick={onMenuToggle}
        label={arabic ? 'فتح قائمة التنقل' : 'Open navigation menu'}
        controls={controls}
      />
      <a
        className="assistant-header__brand"
        href="/assistant/patients"
        aria-label={arabic ? 'مساحة عمل المساعد - منظومة نبضة' : 'Nabda Assistant Workspace'}
      >
        <span className="assistant-header__mark">
          <MaterialIcon name="support_agent" />
        </span>
        <span className="assistant-header__text">
          <strong>{arabic ? 'منظومة نبضة' : 'Nabda'}</strong>
          <small>{messages.operations}</small>
        </span>
      </a>

      <div className="assistant-header__meta">
        <span className="assistant-header__pill">
          <MaterialIcon name="verified_user" />
          {messages.operationalAccess}
        </span>
        <span className="assistant-header__tenant">{messages.tenant}</span>
      </div>

      <div className="assistant-header__actions" ref={notifRef}>
        <button
          type="button"
          className="assistant-header__lang"
          onClick={onLanguageToggle}
          aria-label={arabic ? 'تغيير اللغة' : 'Toggle language'}
        >
          <MaterialIcon name="translate" />
          <span>{label}</span>
        </button>

        <button
          type="button"
          className="assistant-header__icon"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label={arabic ? 'تغيير المظهر' : 'Toggle theme'}
        >
          <MaterialIcon name={theme === 'light' ? 'dark_mode' : 'light_mode'} />
        </button>

        <a
          href="/assistant/chat"
          className="assistant-header__icon assistant-header__chat-link"
          aria-label={messages.chat}
          title={messages.chat}
        >
          <img src="/chat-icon.jpg" alt="" className="chat-nav-icon" />
        </a>

        {/* Interactive Notifications Button */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="assistant-header__icon"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label={messages.notifications}
            aria-expanded={notificationsOpen}
          >
            <MaterialIcon name="notifications" />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#dc2626',
                }}
              />
            )}
          </button>

          {/* Notifications Dropdown Popover */}
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
                  {arabic ? 'تنبيهات العمليات والاستقبال' : 'Operational Alerts'}
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
                <div
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--surface-subtle, #f8fafc)',
                    fontSize: '0.8125rem',
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--text-main, #0f172a)' }}>
                    {arabic ? 'تحديث طابور الانتظار' : 'Reception Queue Alert'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
                    {arabic ? 'مريض جديد وصل للاستقبال: [اسم المريض التجريبي]' : 'New patient checked in: [Demo Patient Profile]'}
                  </div>
                </div>

                <div
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--surface-subtle, #f8fafc)',
                    fontSize: '0.8125rem',
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--text-main, #0f172a)' }}>
                    {arabic ? 'عينة مختبر جديدة جاهزة' : 'Lab Specimen Ready'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
                    {arabic ? 'عينة دم #SP-204 بانتظار الإدخال' : 'Specimen #SP-204 awaiting accessioning'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <a
          href="/assistant/profile"
          className="assistant-header__profile"
          aria-label={messages.profile}
          title={messages.profile}
        >
          <span className="assistant-header__avatar">
            <MaterialIcon name="person" />
          </span>
          <div>
            <strong>{messages.receptionTeam}</strong>
            <small>{messages.operationsDesk}</small>
          </div>
        </a>
      </div>
    </header>
  );
}
