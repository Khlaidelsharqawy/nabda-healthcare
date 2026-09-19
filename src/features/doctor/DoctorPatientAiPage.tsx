import { useState } from 'react';
import { MaterialIcon, Panel, PanelHeader, PanelBody, Badge, Button, Textarea } from '../../components/ui';
import { doctorAiPatientPrompts } from './fixtures';
import { useTheme } from '../../theme/ThemeProvider';
import { doctorMessages } from '../../i18n/messages';

export function DoctorPatientAiPage({ patientId }: { patientId: string }) {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = doctorMessages[isRtl ? 'ar' : 'en'].patientAi;

  const [prompt, setPrompt] = useState('');
  const [notice, setNotice] = useState('');

  return (
    <div className="aegis-page doctor-patient-ai-page" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Back Link */}
      <a
        href={`/doctor/patients/${patientId}`}
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
        <span>{copy.backToProfile}</span>
      </a>

      {/* Patient Banner */}
      <Panel variant="elevated">
        <PanelBody style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-primary-light)',
                color: 'var(--brand-primary)',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 800,
                fontSize: '1rem',
                fontFamily: 'var(--font-display)',
              }}
            >
              PT
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.25rem 0' }}>
                {copy.syntheticPatient}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                <span>PID: <strong>{patientId}</strong></span>
                <span>•</span>
                <span>MRN: {patientId}</span>
                <span>•</span>
                <Badge variant="brand" size="sm">{copy.inConsultation}</Badge>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <MetricBox label={copy.bp} value="148/92" demoContext={copy.demoContext} />
            <MetricBox label={copy.hba1c} value="7.4%" demoContext={copy.demoContext} />
            <MetricBox label={copy.egfr} value="64" demoContext={copy.demoContext} />
          </div>
        </PanelBody>
      </Panel>

      {/* Main Grid */}
      <div className="doctor-patient-ai-grid">
        {/* Left Column: Authorized Clinical Context */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Panel variant="elevated">
            <PanelHeader
              title={<span>{copy.authorizedScope}</span>}
              icon="shield"
              tag={<Badge variant="brand" size="sm">{copy.bounded}</Badge>}
            />
            <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <p style={{ margin: 0 }}>
                {copy.sessionBoundedPrefix} <strong>{patientId}</strong> {copy.sessionBoundedSuffix}
              </p>
            </PanelBody>
          </Panel>

          <Panel variant="elevated">
            <PanelHeader
              title={<span>{copy.activeConditions}</span>}
              icon="vital_signs"
            />
            <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <ConditionItem title={isRtl ? 'السكري من النوع الثاني' : 'Type 2 Diabetes Mellitus'} detail={isRtl ? 'E11.9 - سياق تجريبي' : 'E11.9 - Synthetic context'} />
              <ConditionItem title={isRtl ? 'ارتفاع ضغط الدم الأساسي' : 'Essential Primary Hypertension'} detail={isRtl ? 'I10 - سياق تجريبي' : 'I10 - Synthetic context'} />
              <ConditionItem title={isRtl ? 'اضطراب دهون الدم' : 'Dyslipidemia'} detail={isRtl ? 'E78.5 - سياق تجريبي' : 'E78.5 - Synthetic context'} />
            </PanelBody>
          </Panel>

          <Panel variant="subtle" style={{ backgroundColor: 'var(--color-warning-bg, rgba(234, 179, 8, 0.12))', border: '1px solid var(--color-warning-border, rgba(234, 179, 8, 0.3))' }}>
            <PanelHeader
              title={<span style={{ color: 'var(--color-warning-text, #eab308)' }}>{copy.allergiesAdvisories}</span>}
              icon="warning"
            />
            <PanelBody style={{ fontSize: '0.8125rem', color: 'var(--color-warning-text, #eab308)' }}>
              <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{copy.demoFlagsOnly}</strong>
              <span>{copy.verifyAllergies}</span>
            </PanelBody>
          </Panel>

          <Panel variant="elevated">
            <PanelHeader
              title={<span>{copy.recentEncounters}</span>}
              icon="history"
            />
            <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
              <div>
                <strong style={{ display: 'block', color: 'var(--text-main)' }}>
                  {isRtl ? '12 مايو 2024 - مقابلة سريرية تجريبية' : 'May 12, 2024 - Synthetic encounter'}
                </strong>
                <span style={{ color: 'var(--text-muted)' }}>Cardiology Suite • Dr. Sarah Ahmed</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNotice(isRtl ? 'تجريبي للعرض فقط - لم يتم فتح تفاصيل المقابلة.' : 'Demo only - encounter details were not opened.')}
              >
                {copy.view}
              </Button>
            </PanelBody>
          </Panel>
        </aside>

        {/* Right Column: AI Co-pilot Interaction */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Quick AI Prompts */}
          <Panel variant="elevated">
            <PanelHeader
              title={<span>{copy.structuredQueries}</span>}
              icon="auto_awesome"
            />
            <PanelBody>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '0.75rem',
                }}
              >
                {doctorAiPatientPrompts.map((item) => {
                  const title = isRtl ? item.titleAr ?? item.title : item.title;
                  const subtitle = isRtl ? item.subtitleAr ?? item.subtitle : item.subtitle;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPrompt(title)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--surface-subtle)',
                        border: '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        textAlign: isRtl ? 'right' : 'left',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <MaterialIcon name={item.icon} style={{ color: 'var(--brand-primary)', fontSize: '1.25rem', flexShrink: 0 }} />
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-main)', marginBottom: '0.15rem' }}>
                          {title}
                        </strong>
                        <small style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{subtitle}</small>
                      </div>
                    </button>
                  );
                })}
              </div>
            </PanelBody>
          </Panel>

          {/* Synthesis Dialogue Panel */}
          <Panel variant="elevated">
            <PanelHeader
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MaterialIcon name="neurology" style={{ color: 'var(--brand-primary)' }} />
                  <span>Clinical Reasoning Engine</span>
                </div>
              }
              actions={<Badge variant="brand" size="sm">Deterministic Demo</Badge>}
            />
            <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Clinician Query */}
              <div
                style={{
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--surface-subtle)',
                  borderInlineStart: '3px solid var(--text-tertiary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>
                  <MaterialIcon name="stethoscope" style={{ fontSize: '0.875rem' }} />
                  <span>Physician Query</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 500 }}>
                  {prompt || (isRtl ? 'تلخيص نتائج الفحص السريري وتقديم مسودة خطة علاجية.' : 'Synthesize active patient telemetry, medications, and recommend plan.')}
                </p>
              </div>

              {/* AI Draft Synthesis */}
              <div
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--brand-primary-light)',
                  border: '1px solid var(--border-default)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <Badge variant="brand" size="sm" icon="verified_user">
                    Scoped Analysis
                  </Badge>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    Grounding: Patient Chart
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.6, margin: '0 0 0.75rem 0' }}>
                  {isRtl
                    ? 'بناءً على السجلات السريرية الحالية، يُلاحظ استقرار نسبي لمؤشرات ضغط الدم مع الحاجة إلى مراجعة دورية للوظائف الكلوية. يوصى بإجراء فحص متابعة بعد 3 أشهر.'
                    : 'Based on patient records and active telemetry, blood pressure is stable with ongoing pharmacotherapy. Follow-up renal function panel recommended in 90 days. Non-committal physician review required.'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  <MaterialIcon name="lock" style={{ fontSize: '0.875rem' }} />
                  <span>Strict zero-retention EHR session</span>
                </div>
              </div>

              {/* Query Input Box */}
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setNotice(
                    isRtl
                      ? 'تجريبي للعرض فقط - تم توليد الاستجابة محلياً.'
                      : 'Demo only - prompt evaluated in local demonstration context.'
                  );
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
              >
                <Textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder={isRtl ? 'اكتب استفسارك السريري المخصص...' : 'Ask clinical query regarding this patient chart...'}
                  rows={3}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="history_toggle_off"
                    onClick={() => {
                      setPrompt('');
                      setNotice(isRtl ? 'تم مسح الاستفسار.' : 'Context cleared.');
                    }}
                  >
                    {isRtl ? 'مسح' : 'Clear'}
                  </Button>
                  <Button variant="primary" size="sm" icon={isRtl ? 'arrow_back' : 'arrow_forward'} type="submit">
                    {copy.executeAnalysis}
                  </Button>
                </div>
              </form>
            </PanelBody>
          </Panel>
        </div>
      </div>

      {notice && (
        <div
          role="status"
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--surface-subtle)',
            border: '1px solid var(--border-default)',
            fontSize: '0.8125rem',
            color: 'var(--text-main)',
          }}
        >
          {notice}
        </div>
      )}
    </div>
  );
}

function MetricBox({ label, value, demoContext }: { label: string; value: string; demoContext: string }) {
  return (
    <div
      style={{
        padding: '0.5rem 0.875rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--surface-subtle)',
        textAlign: 'center',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
        {label}
      </span>
      <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{value}</strong>
      <small style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{demoContext}</small>
    </div>
  );
}

function ConditionItem({ title, detail }: { title: string; detail: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 0.75rem',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: 'var(--surface-subtle)',
      }}
    >
      <strong style={{ fontSize: '0.8125rem', color: 'var(--text-main)' }}>{title}</strong>
      <Badge variant="neutral" size="sm">{detail}</Badge>
    </div>
  );
}
