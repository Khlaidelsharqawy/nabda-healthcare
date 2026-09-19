import { useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { authMessages } from '../../i18n/messages';
import { MaterialIcon, Button, FormField, Input } from '../../components/ui';

export function AuthPasswordRecoveryPage() {
  const { direction } = useTheme();
  const copy = direction === 'rtl' ? authMessages.ar : authMessages.en;
  const [email, setEmail] = useState('');
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      setNotice({ text: copy.resetMissing, error: true });
      return;
    }

    setNotice({ text: copy.resetSent, error: false });
  };

  return (
    <div className="auth-flow-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <FormField label={copy.identifier} required>
          <Input
            type="text"
            iconStart="mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={copy.emailPlaceholder}
            aria-label={copy.identifier}
            required
          />
        </FormField>

        <Button type="submit" variant="primary" size="lg" fullWidth icon="mark_email_read">
          {copy.requestReset}
        </Button>

        {notice && (
          <div
            className={`auth-alert ${notice.error ? 'auth-alert--error' : 'auth-alert--success'}`}
            role="status"
          >
            <MaterialIcon name={notice.error ? 'error' : 'check_circle'} />
            <span>{notice.text}</span>
          </div>
        )}

        <div className="auth-links-row" style={{ marginTop: '1.25rem' }}>
          <a href="/login" className="auth-link">
            <MaterialIcon name="arrow_back" />
            <span>{copy.backLogin}</span>
          </a>
        </div>
      </form>
    </div>
  );
}
