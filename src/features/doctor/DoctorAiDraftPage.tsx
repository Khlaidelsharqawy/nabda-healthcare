import { useState } from 'react';
import { MaterialIcon, Panel, PanelHeader, PanelBody, Badge, Button, Textarea } from '../../components/ui';
import { doctorAiDraft } from './fixtures';
import { useTheme } from '../../theme/ThemeProvider';
import { doctorMessages } from '../../i18n/messages';

type DraftField = 'subjective' | 'objective' | 'assessment' | 'plan';

export function DoctorAiDraftPage({ draftId }: { draftId: string }) {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = doctorMessages[isRtl ? 'ar' : 'en'].aiDraft;

  const [draft, setDraft] = useState(doctorAiDraft);
  const [notice, setNotice] = useState('');
  const update = (field: DraftField, value: string) => setDraft((current) => ({ ...current, [field]: value }));
  const demoAction = (message: string) =>
    setNotice(
      isRtl
        ? `تجريبي للعرض فقط - ${message} لم يتم تغيير أي سجل سريري.`
        : `Demo only - ${message} No clinical record was changed.`
    );

  return (
    <div className="aegis-page doctor-ai-draft-page" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.625rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--brand-primary-light)',
          color: 'var(--brand-primary)',
          fontSize: '0.8125rem',
          fontWeight: 600,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <MaterialIcon name="clinical_notes" />
          <span>{copy.topline}</span>
        </span>
        <Badge variant="warning" size="sm">
          {copy.pendingReview}
        </Badge>
      </div>

      {/* Patient Header Envelope */}
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
                {copy.patientName}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                <span>PID: <strong>{draftId}</strong></span>
                <span>•</span>
                <span>MRN: {draftId}</span>
                <span>•</span>
                <span>{doctorAiDraft.encounterId}</span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
            <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-main)' }}>
              {copy.assistanceLevel}
            </strong>
            <small style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{copy.assistanceSub}</small>
          </div>
        </PanelBody>
      </Panel>

      {/* Progress Lifecycle Stepper */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.5rem',
          textAlign: 'center',
          fontSize: '0.75rem',
          fontWeight: 600,
        }}
      >
        <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--brand-primary-light)', color: 'var(--brand-primary)' }}>
          ✓ {copy.progress1}
        </div>
        <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-main)', border: '1px solid var(--brand-primary)' }}>
          ● {copy.progress2}
        </div>
        <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-tertiary)' }}>
          ○ {copy.progress3}
        </div>
        <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-tertiary)' }}>
          ○ {copy.progress4}
        </div>
      </div>

      {/* Main Grid: Editor + Aside */}
      <div className="doctor-draft-grid">
        {/* Editor Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Panel variant="elevated">
            <PanelHeader
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MaterialIcon name="edit_note" style={{ color: 'var(--brand-primary)' }} />
                  <div>
                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                      {copy.editorTitle}
                    </h2>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{copy.editorSub}</span>
                  </div>
                </div>
              }
              actions={
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="format_bold"
                    onClick={() => demoAction(isRtl ? 'لم يتم تطبيق التنسيق.' : 'formatting was not applied.')}
                    aria-label="Bold formatting"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="format_list_bulleted"
                    onClick={() => demoAction(isRtl ? 'لم يتم تطبيق التنسيق.' : 'formatting was not applied.')}
                    aria-label="Bulleted list"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    icon="sync_alt"
                    onClick={() => demoAction(isRtl ? 'لم تتم إعادة فحص التشخيص التفريقي.' : 'differential was not re-checked.')}
                  >
                    {copy.recheckDiff}
                  </Button>
                </div>
              }
            />
            <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <DraftSection letter="S" label={copy.subjectiveLabel} value={draft.subjective} onChange={(value) => update('subjective', value)} isRtl={isRtl} />
              <DraftSection letter="O" label={copy.objectiveLabel} value={draft.objective} onChange={(value) => update('objective', value)} isRtl={isRtl} />
              <DraftSection letter="A" label={copy.assessmentLabel} value={draft.assessment} onChange={(value) => update('assessment', value)} isRtl={isRtl} />
              <DraftSection letter="P" label={copy.planLabel} value={draft.plan} onChange={(value) => update('plan', value)} isRtl={isRtl} />

              {/* Safety Boundary Notice */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-warning-bg)',
                  border: '1px solid var(--color-warning-border)',
                  color: 'var(--color-warning-text)',
                  fontSize: '0.8125rem',
                }}
              >
                <MaterialIcon name="verified_user" style={{ fontSize: '1.25rem', color: '#b45309' }} />
                <span>
                  <strong>{copy.reviewBoundaryTitle}:</strong> {copy.reviewBoundaryDesc}
                </span>
              </div>
            </PanelBody>
          </Panel>

          {/* Dispatch Actions Card */}
          <Panel variant="elevated">
            <PanelHeader
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MaterialIcon name="alt_route" style={{ color: 'var(--brand-primary)' }} />
                  <span>{copy.dispatchTitle}</span>
                </div>
              }
            />
            <PanelBody>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                <Button variant="outline" icon="folder_shared" onClick={() => demoAction(isRtl ? 'لم يتم تصدير الملاحظة.' : 'the note was not exported.')}>
                  {copy.exportEhr}
                </Button>
                <Button variant="outline" icon="prescriptions" onClick={() => demoAction(isRtl ? 'لم يتم إنشاء وصفات دوائية.' : 'prescriptions were not created.')}>
                  {copy.draftRx}
                </Button>
                <Button variant="outline" icon="biotech" onClick={() => demoAction(isRtl ? 'لم يتم إنشاء أوامر تشخيصية.' : 'diagnostic orders were not created.')}>
                  {copy.diagnosticOrders}
                </Button>
              </div>
            </PanelBody>
          </Panel>
        </div>

        {/* Aside: Metadata & Verification Controls */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Panel variant="elevated">
            <PanelHeader title={<span>{copy.metadataTitle}</span>} />
            <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>{copy.draftId}</span>
                <strong style={{ color: 'var(--text-main)' }}>{draftId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Status</span>
                <Badge variant="warning" size="sm">{copy.draftStatus}</Badge>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Authorization</span>
                <strong style={{ color: 'var(--brand-primary)' }}>{copy.physicianRequired}</strong>
              </div>
            </PanelBody>
          </Panel>

          <Panel variant="elevated">
            <PanelHeader title={<span>{copy.reviewActions}</span>} />
            <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Button variant="outline" onClick={() => demoAction(isRtl ? 'تم حفظ المسودة محلياً.' : 'the draft was saved locally.')}>
                Save Incomplete Draft
              </Button>
              <Button variant="primary" icon="verified" onClick={() => demoAction(isRtl ? 'تم اعتماد وتوقيع الملاحظة السريرية بنجاح.' : 'the clinical note was attested and signed.')}>
                Attest & Sign SOAP Note
              </Button>
              <Button variant="danger" onClick={() => demoAction(isRtl ? 'تم إلغاء المسودة.' : 'the draft was discarded.')}>
                Discard Draft
              </Button>
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

function DraftSection({
  letter,
  label,
  value,
  onChange,
  isRtl,
}: {
  letter: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  isRtl: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <b
          style={{
            width: '24px',
            height: '24px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--brand-primary)',
            color: '#ffffff',
            display: 'grid',
            placeItems: 'center',
            fontSize: '0.75rem',
            fontWeight: 800,
          }}
        >
          {letter}
        </b>
        <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
          {label}
        </label>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        style={{ width: '100%', fontSize: '0.875rem', lineHeight: 1.6 }}
      />
    </div>
  );
}
