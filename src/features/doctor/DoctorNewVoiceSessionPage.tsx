import { useState } from 'react';
import { MaterialIcon, PageHeader, Panel, PanelHeader, PanelBody, Badge, Button, Select } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { doctorMessages } from '../../i18n/messages';

export function DoctorNewVoiceSessionPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = doctorMessages[isRtl ? 'ar' : 'en'].newVoiceSession;

  const [appointment, setAppointment] = useState('APT-DEMO-01');
  const [purpose, setPurpose] = useState(isRtl ? 'استشارة مجدولة' : 'Scheduled Consultation');
  const [consent, setConsent] = useState(false);
  const [notice, setNotice] = useState('');

  return (
    <div className="aegis-page doctor-new-voice-page" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Back Link */}
      <a
        href="/doctor/voice-sessions"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        <MaterialIcon name={isRtl ? 'arrow_forward' : 'arrow_back'} style={{ fontSize: '1rem' }} />
        <span>{copy.backLink}</span>
      </a>

      <PageHeader
        kicker={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MaterialIcon name="mic" style={{ fontSize: '1rem' }} />
            <span>{copy.eyebrow}</span>
          </div>
        }
        title={copy.heading}
        subtitle={copy.desc}
        actions={
          <Badge variant="brand" size="md" icon="shield">
            {copy.demoBoundary}
          </Badge>
        }
      />

      <div className="doctor-new-voice-grid">
        {/* Form Column */}
        <Panel variant="elevated">
          <PanelHeader title={<span>{copy.contextTitle}</span>} />
          <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                {copy.appointmentLabel}
              </label>
              <Select
                value={appointment}
                onChange={(e) => setAppointment(e.target.value)}
                options={[
                  { value: 'APT-DEMO-01', label: `APT-DEMO-01 • ${isRtl ? 'مراجعة نتائج المختبر' : 'Follow-Up Lab Review'}` },
                  { value: 'APT-DEMO-02', label: `APT-DEMO-02 • ${isRtl ? 'استشارة مجدولة' : 'Scheduled Consultation'}` },
                  { value: 'APT-DEMO-03', label: `APT-DEMO-03 • ${isRtl ? 'متابعة اعتيادية' : 'Routine Review'}` },
                ]}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                {copy.purposeLabel}
              </label>
              <Select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                options={[
                  { value: isRtl ? 'استشارة مجدولة' : 'Scheduled Consultation', label: isRtl ? 'استشارة مجدولة' : 'Scheduled Consultation' },
                  { value: isRtl ? 'مراجعة نتائج المختبر' : 'Follow-Up Lab Review', label: isRtl ? 'مراجعة نتائج المختبر' : 'Follow-Up Lab Review' },
                  { value: isRtl ? 'مراجعة التوثيق السريري' : 'Clinical Documentation Review', label: isRtl ? 'مراجعة التوثيق السريري' : 'Clinical Documentation Review' },
                ]}
              />
            </div>

            {/* Patient Card Context */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                padding: '0.875rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-subtle)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-primary-light)',
                  color: 'var(--brand-primary)',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <MaterialIcon name="person" />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9375rem', color: 'var(--text-main)' }}>
                  {isRtl ? '[اسم المريض]' : '[Patient Name]'}
                </strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {copy.patientIdLabel} PATIENT-DEMO-01 • {copy.encounterBinding} {appointment}
                </span>
              </div>
            </div>

            {/* Informed Consent Checkbox */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: 'var(--text-main)',
                userSelect: 'none',
              }}
            >
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--brand-primary)' }}
              />
              <span>{copy.consentLabel}</span>
            </label>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <Button variant="ghost" onClick={() => (window.location.href = '/doctor/voice-sessions')}>
                {copy.cancelSession}
              </Button>
              <Button
                variant="primary"
                icon="mic"
                disabled={!consent}
                onClick={() =>
                  setNotice(
                    isRtl
                      ? 'تجريبي للعرض فقط - تم إعداد الجلسة. لم يتم بدء أي تسجيل صوتي.'
                      : 'Demo only - synthetic session prepared. No audio recording started.'
                  )
                }
              >
                {copy.startDemoSession}
              </Button>
            </div>
          </PanelBody>
        </Panel>

        {/* Aside Settings & Security */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Panel variant="elevated">
            <PanelHeader
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}>
                  <MaterialIcon name="tune" style={{ color: 'var(--brand-primary)' }} />
                  <span>{copy.inputSettingsTitle}</span>
                </div>
              }
            />
            <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.35rem' }}>
                <span>{copy.languageLabel}</span>
                <strong style={{ color: 'var(--text-main)' }}>{isRtl ? 'عربي / إنجليزي' : 'AR / EN Auto'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.35rem' }}>
                <span>{copy.transcriptLabel}</span>
                <strong style={{ color: 'var(--text-main)' }}>Medical Scribe v2</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{copy.retentionLabel}</span>
                <strong style={{ color: 'var(--brand-primary)' }}>Zero Retention</strong>
              </div>
            </PanelBody>
          </Panel>

          <Panel variant="accent" style={{ borderInlineStart: '4px solid #f59e0b' }}>
            <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b45309' }}>
                <MaterialIcon name="warning" style={{ fontSize: '1.25rem' }} />
                <strong style={{ fontSize: '0.875rem' }}>{copy.safetyTitle}</strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {copy.safetyDesc}
              </p>
            </PanelBody>
          </Panel>
        </aside>
      </div>

      {notice && (
        <div
          role="status"
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--brand-primary-light)',
            color: 'var(--brand-primary)',
            fontSize: '0.875rem',
          }}
        >
          {notice}
        </div>
      )}
    </div>
  );
}
