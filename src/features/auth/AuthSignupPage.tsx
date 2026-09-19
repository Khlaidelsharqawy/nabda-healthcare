import { useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { authMessages } from '../../i18n/messages';
import { MaterialIcon, Button, FormField, Input, Badge } from '../../components/ui';

export function AuthSignupPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? authMessages.ar : authMessages.en;

  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [consent, setConsent] = useState(true);
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fullName.trim() || !nationalId.trim() || !phone.trim() || !email.trim() || !password.trim()) {
      setNotice({ text: copy.patientSignupValidation, error: true });
      return;
    }
    if (password !== confirmPassword) {
      setNotice({ text: copy.passwordMismatch, error: true });
      return;
    }
    if (!consent) {
      setNotice({ text: copy.patientConsent, error: true });
      return;
    }

    setSubmitted(true);
    setNotice({ text: copy.patientSignupSuccess, error: false });
  };

  return (
    <div className="auth-flow-container">
      <div className="auth-callout">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <Badge variant="brand" icon="person">
            {copy.signupBadge}
          </Badge>
        </div>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-on-surface-variant)' }}>
          {copy.signupScopeNotice}
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} style={{ marginTop: '1.25rem' }}>
        <FormField label={copy.fullName} required>
          <Input
            type="text"
            iconStart="person"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={copy.fullNamePlaceholder}
            required
            disabled={submitted}
          />
        </FormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <FormField label={copy.nationalId} required>
            <Input
              type="text"
              iconStart="badge"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              placeholder={copy.nationalIdPlaceholder}
              required
              disabled={submitted}
            />
          </FormField>
          <FormField label={copy.phoneNumber} required>
            <Input
              type="tel"
              iconStart="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={copy.phoneNumberPlaceholder}
              required
              disabled={submitted}
            />
          </FormField>
        </div>

        <FormField label={copy.identifier} required>
          <Input
            type="email"
            iconStart="mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={copy.emailPlaceholder}
            required
            disabled={submitted}
          />
        </FormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <FormField label={copy.password} required>
            <Input
              type={showPassword ? 'text' : 'password'}
              iconStart="lock"
              iconEnd={showPassword ? 'visibility_off' : 'visibility'}
              onIconEndClick={() => setShowPassword((v) => !v)}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={copy.passwordPlaceholder}
              required
              disabled={submitted}
            />
          </FormField>

          <FormField label={copy.confirmPassword} required>
            <Input
              type={showPassword ? 'text' : 'password'}
              iconStart="lock"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={copy.confirmPasswordPlaceholder}
              required
              disabled={submitted}
            />
          </FormField>
        </div>

        <label className="auth-checkbox" style={{ marginTop: '0.25rem' }}>
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            disabled={submitted}
          />
          <span>{copy.patientConsent}</span>
        </label>

        <Button type="submit" variant="primary" size="lg" fullWidth disabled={submitted} icon="person_add">
          {copy.submitPatientSignup}
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

        <div className="auth-divider">
          <span>{copy.haveAccount}</span>
        </div>

        <a href="/login" className="ui-btn ui-btn--secondary ui-btn--md ui-btn--block">
          <MaterialIcon name="login" />
          <span>{copy.signInAction}</span>
        </a>

        <div className="auth-access-card-wrap" style={{ marginTop: '1rem', borderTop: '1px solid var(--color-outline-variant)', paddingTop: '1rem' }}>
          <a href="/request-access" className="auth-access-card">
            <div className="auth-access-card__icon">
              <MaterialIcon name="medical_services" />
            </div>
            <div className="auth-access-card__text">
              <strong>{copy.providerAccessHeading}</strong>
              <small>{copy.providerAccessNotice}</small>
            </div>
            <MaterialIcon name={isRtl ? 'arrow_back' : 'arrow_forward'} className="auth-access-card__arrow" />
          </a>
        </div>
      </form>
    </div>
  );
}
