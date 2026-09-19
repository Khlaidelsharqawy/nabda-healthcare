import { type ReactNode } from 'react';
import { MaterialIcon, Button, Badge } from '../components/ui';
import { useTheme } from '../theme/ThemeProvider';
import { authMessages } from '../i18n/messages';

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { theme, setTheme, direction, setDirection } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? authMessages.ar : authMessages.en;
  const localizedTitles: Record<string, string> = isRtl
    ? {
        Login: 'تسجيل الدخول',
        'Account recovery': 'استعادة الحساب',
        'Reset password': 'إعادة تعيين كلمة المرور',
        'Verify account': 'تحقق من الحساب',
        'Session expired': 'انتهت الجلسة',
        'Unauthorized access': 'وصول غير مصرح به',
        'Patient Registration': 'تسجيل حساب مريض',
        'Healthcare Provider Access': 'انضمام الكوادر والمنشآت الصحية',
      }
    : {};
  const localizedSubtitles: Record<string, string> = isRtl
    ? {
        Login: 'وصول تجريبي آمن إلى واجهة منظومة عافية.',
        'Account recovery': 'تدفق تجريبي: هذا الإصدار لا يرسل رسائل بريد إلكتروني.',
        'Reset password': 'معاينة فقط. لا يتم تخزين كلمات المرور أو التحقق منها عبر نظام مباشر.',
        'Verify account': 'تحقق تجريبي فقط. لا يوجد مزود هوية مباشر.',
        'Session expired': 'انتهت جلسة المعاينة الحالية.',
        'Unauthorized access': 'حالة وصول أمامية فقط.',
        'Patient Registration': 'أنشئ حسابك الشخصي في بوابة المريض لمتابعة الاستشارات والسجلات الطبية.',
        'Healthcare Provider Access': 'بوابة التحقق والاعتماد المهني للأطباء والكوادر السريرية والمراكز الطبية.',
      }
    : {};

  const toggleLanguage = () => setDirection(isRtl ? 'ltr' : 'rtl');

  return (
    <div className="auth-shell" data-direction={isRtl ? 'rtl' : 'ltr'}>
      <header className="auth-shell__topbar">
        <a href="/" className="auth-shell__brand" aria-label={isRtl ? 'الصفحة الرئيسية لمنظومة عافية' : 'AegisHealth home'}>
          <span className="auth-shell__brand-mark">
            <MaterialIcon name="medical_information" />
          </span>
          <span>
            <strong>{isRtl ? 'منظومة عافية' : 'AegisHealth'}</strong>
            <small>{copy.shellBrand}</small>
          </span>
        </a>

        <div className="auth-shell__topbar-actions">
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
        </div>
      </header>

      <main className="auth-shell__content">
        <section className="auth-shell__panel">
          <div className="auth-shell__eyebrow">
            <Badge variant="brand" icon="shield_locked" size="md">
              {copy.secureAccess}
            </Badge>
          </div>
          <h1 className="auth-shell__title">{localizedTitles[title] ?? title}</h1>
          <p className="auth-shell__subtitle">{localizedSubtitles[title] ?? subtitle}</p>
          <div className="auth-shell__form-body">
            {children}
          </div>
          {footer && <div className="auth-shell__footer">{footer}</div>}
        </section>
      </main>
    </div>
  );
}
