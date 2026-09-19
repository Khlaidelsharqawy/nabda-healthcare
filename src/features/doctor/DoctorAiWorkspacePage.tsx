import { useState } from 'react';
import { MaterialIcon, PageHeader, Panel, PanelHeader, PanelBody, Badge, Button, Textarea } from '../../components/ui';
import { doctorAiPrompts } from './fixtures';
import { useTheme } from '../../theme/ThemeProvider';
import { doctorMessages } from '../../i18n/messages';

export function DoctorAiWorkspacePage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = doctorMessages[isRtl ? 'ar' : 'en'].aiWorkspace;

  const [prompt, setPrompt] = useState('');
  const [notice, setNotice] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');

  const runAnalysis = (value = prompt) => {
    setPrompt(value);
    setNotice(
      isRtl
        ? 'تجريبي للعرض فقط - تم توليد المساعدة محلياً ويلزم مراجعة الطبيب المعالج.'
        : 'Demo only - AI assistance was generated locally and requires physician review.'
    );
  };

  return (
    <div className="aegis-page doctor-ai-page" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Breadcrumb */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
        }}
      >
        <a href="/doctor/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>
          {copy.crumbWorkspace}
        </a>
        <MaterialIcon name={isRtl ? 'chevron_left' : 'chevron_right'} style={{ fontSize: '1rem', color: 'var(--text-tertiary)' }} />
        <strong style={{ color: 'var(--text-main)' }}>{copy.crumbAi}</strong>
      </nav>

      <PageHeader
        kicker={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MaterialIcon name="clinical_notes" style={{ fontSize: '1rem' }} />
            <span>{copy.eyebrow}</span>
          </div>
        }
        title={copy.heading}
        subtitle={copy.desc}
        actions={
          <Badge variant="brand" size="md" icon="verified_user">
            {copy.boundary}
          </Badge>
        }
      />

      {/* Main Workspace Layout */}
      <div className="doctor-ai-grid">
        {/* Main Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Quick Clinical Prompts Panel */}
          <Panel variant="elevated">
            <PanelHeader
              title={<span>{copy.promptsTitle}</span>}
              actions={
                <Badge variant="neutral" size="sm" icon="tune">
                  {copy.templates}
                </Badge>
              }
            />
            <PanelBody>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '0.75rem',
                }}
              >
                {doctorAiPrompts.map((item) => {
                  const title = isRtl ? item.titleAr ?? item.title : item.title;
                  const subtitle = isRtl ? item.subtitleAr ?? item.subtitle : item.subtitle;
                  const isSelected = selectedPrompt === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedPrompt(item.id);
                        runAnalysis(title);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        padding: '0.875rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isSelected ? 'var(--brand-primary-light)' : 'var(--surface-subtle)',
                        border: `1px solid ${isSelected ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                        cursor: 'pointer',
                        textAlign: isRtl ? 'right' : 'left',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <MaterialIcon
                        name={item.icon}
                        style={{
                          color: isSelected ? 'var(--brand-primary)' : 'var(--text-tertiary)',
                          fontSize: '1.25rem',
                          flexShrink: 0,
                          marginTop: '0.1rem',
                        }}
                      />
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.15rem' }}>
                          {title}
                        </strong>
                        <small style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{subtitle}</small>
                      </div>
                    </button>
                  );
                })}
              </div>
            </PanelBody>
          </Panel>

          {/* Clinician Inquiry Display */}
          <Panel variant="subtle" style={{ borderInlineStart: '3px solid var(--brand-primary)' }}>
            <PanelBody>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MaterialIcon name="stethoscope" style={{ fontSize: '1rem', color: 'var(--brand-primary)' }} />
                  <strong>{copy.doctorInquiry}</strong>
                </span>
                <span>10:42 AM</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-main)', fontWeight: 500, lineHeight: 1.5 }}>
                {prompt ||
                  (isRtl
                    ? 'تلخيص سياق المريض المصرح به وتحديد الأسئلة لمراجعة الطبيب.'
                    : 'Summarize the authorized patient context and identify questions for physician review.')}
              </p>
            </PanelBody>
          </Panel>

          {/* AI Reasoning Response Panel */}
          <Panel variant="elevated">
            <PanelHeader
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MaterialIcon name="memory" style={{ color: 'var(--brand-primary)' }} />
                  <span>{copy.reasoningCore}</span>
                  <Badge variant="brand" size="sm">{copy.aiDraft}</Badge>
                </div>
              }
              actions={
                <Badge variant="warning" size="sm" icon="pending_actions">
                  {copy.pendingAttestation}
                </Badge>
              }
            />
            <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--surface-subtle)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', color: 'var(--brand-primary)' }}>
                  <MaterialIcon name="monitoring" style={{ fontSize: '1rem' }} />
                  <strong style={{ fontSize: '0.875rem' }}>{copy.synthesisTitle}</strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {copy.synthesisDesc}
                </p>
              </div>

              <div
                style={{
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--surface-subtle)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', color: '#10b981' }}>
                  <MaterialIcon name="vital_signs" style={{ fontSize: '1rem' }} />
                  <strong style={{ fontSize: '0.875rem' }}>{copy.safetyTitle}</strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {copy.safetyDesc}
                </p>
              </div>

              <div
                style={{
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-warning-bg, rgba(234, 179, 8, 0.12))',
                  border: '1px solid var(--color-warning-border, rgba(234, 179, 8, 0.3))',
                  color: 'var(--color-warning-text, #eab308)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <MaterialIcon name="priority_high" style={{ fontSize: '1rem' }} />
                  <strong style={{ fontSize: '0.875rem' }}>{copy.verificationRequired}</strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.8125rem', lineHeight: 1.6 }}>
                  {copy.verificationDesc}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-tertiary)', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                <MaterialIcon name="verified_user" style={{ fontSize: '0.875rem', color: 'var(--brand-primary)' }} />
                <span>{copy.authorizedOnly}</span>
                <span>•</span>
                <span>{copy.protectedSession}</span>
              </div>
            </PanelBody>
          </Panel>

          {/* Interactive Composer */}
          <Panel variant="elevated">
            <PanelBody>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  runAnalysis();
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
              >
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {copy.clinicalInquiry}
                </label>
                <Textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder={copy.promptPlaceholder}
                  rows={3}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="history_toggle_off"
                    onClick={() => {
                      setPrompt('');
                      setNotice(isRtl ? 'تجريبي للعرض فقط - تم مسح السياق المحلي.' : 'Demo only - local context cleared.');
                    }}
                  >
                    {copy.clearContext}
                  </Button>
                  <Button variant="primary" size="sm" icon={isRtl ? 'arrow_back' : 'arrow_forward'} type="submit">
                    {copy.executeAnalysis}
                  </Button>
                </div>
              </form>
            </PanelBody>
          </Panel>
        </div>

        {/* Side Column: AI Safety & Attestation Governance */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Panel variant="elevated">
            <PanelHeader
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}>
                  <MaterialIcon name="shield" style={{ color: 'var(--brand-primary)' }} />
                  <span>Clinical Safety Standard</span>
                </div>
              }
            />
            <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <p style={{ margin: 0 }}>
                {isRtl
                  ? 'يتم تشغيل كافة نماذج الاستدلال السريري ضمن بيئة معزولة بنسبة 100% دون تخزين أو استخدام البيانات لتدريب النماذج الخارجية.'
                  : 'All clinical intelligence runs in a deterministic zero-retention sandbox. Patient chart inputs are uncommitted until physician e-signature.'}
              </p>
              <Badge variant="success" size="sm" icon="lock">
                HIPAA / GDPR Isolated
              </Badge>
            </PanelBody>
          </Panel>

          <Panel variant="subtle">
            <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                Assistance Pipeline
              </span>
              <strong style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
                Deterministic Healthcare LLM
              </strong>
              <small style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                Latency: 180ms • Confidence: High • Version 2.4.0
              </small>
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
