import { useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { authMessages } from '../../i18n/messages';
import { MaterialIcon, Button, FormField, Input } from '../../components/ui';

export function AuthVerifyPage() {
  const { direction } = useTheme();
  const copy = direction === 'rtl' ? authMessages.ar : authMessages.en;
  const [code, setCode] = useState('');
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!code.trim()) {
      setNotice({ text: copy.verifyMissing, error: true });
      return;
    }

    setNotice({ text: copy.verifyDone, error: false });
  };

  return (
    <div className="auth-flow-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <FormField label={copy.verificationCode} required>
          <Input
            type="text"
            iconStart="pin"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="123456"
            aria-label={copy.verificationCode}
            required
          />
        </FormField>

        <Button type="submit" variant="primary" size="lg" fullWidth icon="verified">
          {copy.verify}
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
            <span>{copy.returnLogin}</span>
          </a>
          <span className="auth-link-divider">•</span>
          <a href="/forgot-password" className="auth-link">
            {copy.newCode}
          </a>
        </div>
      </form>
    </div>
  );
}
