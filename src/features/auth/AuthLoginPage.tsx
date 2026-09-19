import { useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { authMessages } from '../../i18n/messages';
import { MaterialIcon, Button, FormField, Input, Badge } from '../../components/ui';
import { repositories } from '../../repositories';

export function AuthLoginPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? authMessages.ar : authMessages.en;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setNotice({ text: copy.missingLogin, error: true });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Check known system credentials
      let targetRole: string | null = null;
      let targetRoute = '/';

      if (cleanEmail === 'admin@aegishealth.com' && cleanPass === 'AegisAdmin@2026!') {
        targetRole = 'super_admin';
        targetRoute = '/admin/dashboard';
      } else if (cleanEmail === 'doctor@aegishealth.com' && cleanPass === 'Doctor@2026!') {
        targetRole = 'doctor';
        targetRoute = '/doctor/dashboard';
      } else if (cleanEmail === 'assistant@aegishealth.com' && cleanPass === 'Assistant@2026!') {
        targetRole = 'assistant';
        targetRoute = '/assistant/patients';
      } else if (
        (cleanEmail === 'patient@aegishealth.com' || cleanEmail === 'patient') &&
        cleanPass === 'Aegis@PT2026!'
      ) {
        targetRole = 'patient';
        targetRoute = '/patient/dashboard';
      } else {
        // Check dynamic users in repository
        const user = await repositories.users.findByEmail(cleanEmail);
        if (user) {
          targetRole = user.role;
          if (user.role === 'super_admin') targetRoute = '/admin/dashboard';
          else if (user.role === 'doctor') targetRoute = '/doctor/dashboard';
          else if (user.role === 'assistant') targetRoute = '/assistant/patients';
          else targetRoute = '/patient/dashboard';
        }
      }

      if (!targetRole) {
        setNotice({
          text: isRtl
            ? 'بيانات الدخول غير صحيحة. يرجى التحقق من البريد الإلكتروني وكلمة المرور'
            : 'Invalid credentials. Please verify your email and password.',
          error: true,
        });
        setIsSubmitting(false);
        return;
      }

      // Save session
      localStorage.setItem(
        'aegis_session',
        JSON.stringify({
          email: cleanEmail,
          role: targetRole,
          timestamp: new Date().toISOString(),
        })
      );

      // Audit log
      await repositories.auditLogs.append({
        tenantId: 'tenant-demo-01',
        actorId: `usr-${targetRole}`,
        actorRole: targetRole as any,
        action: 'USER_LOGIN',
        entityType: 'auth',
        entityId: cleanEmail,
        details: { role: targetRole, route: targetRoute },
      });

      setNotice({
        text: isRtl ? 'تم تسجيل الدخول بنجاح! جاري تحويلك...' : 'Login successful! Redirecting...',
        error: false,
      });

      setTimeout(() => {
        window.location.href = targetRoute;
      }, 600);
    } catch (err) {
      console.error('Login error', err);
      setNotice({
        text: isRtl ? 'حدث خطأ غير متوقع أثناء تسجيل الدخول' : 'An unexpected error occurred during login',
        error: true,
      });
      setIsSubmitting(false);
    }
  };

  const autofillCredentials = (role: 'admin' | 'doctor' | 'patient') => {
    if (role === 'admin') {
      setEmail('admin@aegishealth.com');
      setPassword('AegisAdmin@2026!');
    } else if (role === 'doctor') {
      setEmail('doctor@aegishealth.com');
      setPassword('Doctor@2026!');
    } else {
      setEmail('patient@aegishealth.com');
      setPassword('Aegis@PT2026!');
    }
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

        <FormField label={copy.password} required>
          <Input
            type={showPassword ? 'text' : 'password'}
            iconStart="lock"
            iconEnd={showPassword ? 'visibility_off' : 'visibility'}
            onIconEndClick={() => setShowPassword((value) => !value)}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={copy.passwordPlaceholder}
            aria-label={copy.password}
            required
          />
        </FormField>

        <div className="auth-inline-row">
          <label className="auth-checkbox">
            <input type="checkbox" defaultChecked />
            <span>{copy.remember}</span>
          </label>
          <a href="/forgot-password" className="auth-link">{copy.forgot}</a>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          icon="login"
          disabled={isSubmitting}
        >
          {isSubmitting ? (isRtl ? 'جاري التحقق...' : 'Authenticating...') : copy.signInAction}
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

        {/* Quick-Access Test Accounts Auto-Fill */}
        <div
          style={{
            marginTop: '1rem',
            padding: '0.875rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--surface-subtle)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.625rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              {isRtl ? 'حسابات التجربة والاختبار السريع:' : 'Quick-Access Test Credentials:'}
            </span>
            <Badge variant="brand" dot>{isRtl ? 'قاعدة البيانات' : 'Live DB'}</Badge>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => autofillCredentials('admin')}
              className="ui-btn ui-btn--ghost ui-btn--sm"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem', justifyContent: 'center' }}
            >
              <MaterialIcon name="shield" style={{ fontSize: '0.9rem' }} />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => autofillCredentials('doctor')}
              className="ui-btn ui-btn--ghost ui-btn--sm"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem', justifyContent: 'center' }}
            >
              <MaterialIcon name="stethoscope" style={{ fontSize: '0.9rem' }} />
              <span>Doctor</span>
            </button>
            <button
              type="button"
              onClick={() => autofillCredentials('patient')}
              className="ui-btn ui-btn--ghost ui-btn--sm"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem', justifyContent: 'center' }}
            >
              <MaterialIcon name="person" style={{ fontSize: '0.9rem' }} />
              <span>Patient</span>
            </button>
          </div>
        </div>

        <div className="auth-divider">
          <span>{copy.newPatientHeading}</span>
        </div>

        <a href="/signup" className="ui-btn ui-btn--secondary ui-btn--md ui-btn--block">
          <MaterialIcon name="person_add" />
          <span>{copy.createPatientAccount}</span>
        </a>

        <div className="auth-access-card-wrap">
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

        <div className="auth-links-row">
          <a href="/verify" className="auth-link">{copy.verificationLink}</a>
          <span className="auth-link-divider">•</span>
          <a href="/unauthorized" className="auth-link">{copy.accessIssue}</a>
        </div>
      </form>
    </div>
  );
}
