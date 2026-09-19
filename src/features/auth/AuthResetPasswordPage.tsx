import { useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { authMessages } from '../../i18n/messages';
import { MaterialIcon, Button, FormField, Input } from '../../components/ui';

export function AuthResetPasswordPage() {
  const { direction } = useTheme();
  const copy = direction === 'rtl' ? authMessages.ar : authMessages.en;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password.trim() || !confirmPassword.trim()) {
      setNotice({ text: copy.passwordMissing, error: true });
      return;
    }

    if (password !== confirmPassword) {
      setNotice({ text: copy.passwordMismatch, error: true });
      return;
    }

    setNotice({ text: copy.passwordUpdated, error: false });
  };

  return (
    <div className="auth-flow-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <FormField label={copy.newPassword} required>
          <Input
            type={showPassword ? 'text' : 'password'}
            iconStart="lock"
            iconEnd={showPassword ? 'visibility_off' : 'visibility'}
            onIconEndClick={() => setShowPassword((value) => !value)}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={copy.newPasswordPlaceholder}
            aria-label={copy.newPassword}
            required
          />
        </FormField>

        <FormField label={copy.confirmPassword} required>
          <Input
            type={showPassword ? 'text' : 'password'}
            iconStart="lock"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder={copy.confirmPasswordPlaceholder}
            aria-label={copy.confirmPassword}
            required
          />
        </FormField>

        <Button type="submit" variant="primary" size="lg" fullWidth icon="check">
          {copy.updatePassword}
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
