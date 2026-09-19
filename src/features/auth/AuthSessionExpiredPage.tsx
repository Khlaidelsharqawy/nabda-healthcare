import { useTheme } from '../../theme/ThemeProvider';
import { authMessages } from '../../i18n/messages';
import { MaterialIcon } from '../../components/ui';

export function AuthSessionExpiredPage() {
  const { direction } = useTheme();
  const copy = direction === 'rtl' ? authMessages.ar : authMessages.en;
  return (
    <div className="auth-flow-container" style={{ textAlign: 'center', padding: '1rem 0' }}>
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--color-warning-container)',
          color: 'var(--color-on-warning-container)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <MaterialIcon name="timer_off" style={{ fontSize: '28px' }} />
      </div>
      <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.375rem', fontWeight: 700 }}>{copy.expiredTitle}</h2>
      <p style={{ margin: '0 0 1.5rem 0', color: 'var(--color-on-surface-variant)', fontSize: '0.9375rem', lineHeight: 1.5 }}>
        {copy.expiredText}
      </p>
      <a href="/login" className="ui-btn ui-btn--primary ui-btn--lg ui-btn--block">
        <MaterialIcon name="login" />
        <span>{copy.returnLogin}</span>
      </a>
    </div>
  );
}
