import { useTheme } from '../../theme/ThemeProvider';
import { authMessages } from '../../i18n/messages';
import { MaterialIcon } from '../../components/ui';

export function AuthUnauthorizedPage() {
  const { direction } = useTheme();
  const copy = direction === 'rtl' ? authMessages.ar : authMessages.en;
  return (
    <div className="auth-flow-container" style={{ textAlign: 'center', padding: '1rem 0' }}>
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--color-error-container)',
          color: 'var(--color-on-error-container)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <MaterialIcon name="gpp_bad" style={{ fontSize: '28px' }} />
      </div>
      <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.375rem', fontWeight: 700 }}>{copy.deniedTitle}</h2>
      <p style={{ margin: '0 0 1.5rem 0', color: 'var(--color-on-surface-variant)', fontSize: '0.9375rem', lineHeight: 1.5 }}>
        {copy.deniedText}
      </p>
      <div className="auth-inline-row" style={{ gap: '0.75rem' }}>
        <a href="/login" className="ui-btn ui-btn--primary ui-btn--md" style={{ flex: 1 }}>
          <MaterialIcon name="login" />
          <span>{copy.login}</span>
        </a>
        <a href="/" className="ui-btn ui-btn--outline ui-btn--md" style={{ flex: 1 }}>
          <MaterialIcon name="home" />
          <span>{copy.home}</span>
        </a>
      </div>
    </div>
  );
}
