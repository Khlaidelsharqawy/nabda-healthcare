import { useState } from 'react';
import { MaterialIcon, Panel, PanelHeader, PanelBody, Badge, Button, Textarea } from '../../components/ui';
import { doctorVoiceSoapDraft, doctorVoiceTranscript } from './fixtures';
import { useTheme } from '../../theme/ThemeProvider';
import { doctorMessages } from '../../i18n/messages';

type ReviewTab = 'soap' | 'transcript' | 'actions';
type SoapField = keyof typeof doctorVoiceSoapDraft;

export function DoctorVoiceSessionReviewPage({ sessionId }: { sessionId: string }) {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = doctorMessages[isRtl ? 'ar' : 'en'].voiceReview;

  const [tab, setTab] = useState<ReviewTab>('soap');
  const [draft, setDraft] = useState(doctorVoiceSoapDraft);
  const [notice, setNotice] = useState('');
  const update = (field: SoapField, value: string) => setDraft((current) => ({ ...current, [field]: value }));
  const demoAction = (message: string) =>
    setNotice(
      isRtl
        ? `تجريبي للعرض فقط - ${message} لم يتم تغيير أي سجل سريري.`
        : `Demo only - ${message} No clinical record was changed.`
    );

  const tabs = [
    { id: 'soap' as const, icon: 'clinical_notes', label: copy.tabSoap, badge: copy.aiRaw },
    { id: 'transcript' as const, icon: 'graphic_eq', label: copy.tabTranscript, badge: '08:42' },
    { id: 'actions' as const, icon: 'rule', label: copy.tabActions, badge: copy.pendingBadge },
  ];

  return (
    <div className="aegis-page doctor-voice-review-page" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <a
          href={`/doctor/voice-sessions/${sessionId}`}
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
          <span>{copy.topBack}</span>
        </a>

        <Badge variant="brand" size="sm" icon="verified_user">
          {copy.protectedNotice}
        </Badge>
      </div>

      {/* Session Review Header */}
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
                {isRtl ? '[اسم المريض]' : '[Patient Name]'}
              </h1>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {isRtl
                  ? `الجلسة: 24 أكتوبر 2024 • 10:45 ص • المدة: 08 د و 42 ث • VSID: ${sessionId}`
                  : `Session: Oct 24, 2024 • 10:45 AM • Duration: 08m 42s • VSID: ${sessionId}`}
              </p>
            </div>
          </div>

          <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
            <small style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{copy.confidence}</small>
            <strong style={{ fontSize: '1.5rem', color: '#10b981', fontFamily: 'var(--font-display)' }}>98.4%</strong>
            <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{copy.deterministicDemo}</span>
          </div>
        </PanelBody>
      </Panel>

      {/* Lifecycle Flow Stepper */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--surface-subtle)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.75rem',
          fontWeight: 600,
          overflowX: 'auto',
          gap: '0.75rem',
        }}
      >
        <span style={{ color: 'var(--text-tertiary)' }}>{isRtl ? '1. تم التسجيل' : '1. RECORDED'}</span>
        <span>→</span>
        <span style={{ color: 'var(--text-tertiary)' }}>{isRtl ? '2. تم التفريغ' : '2. TRANSCRIBED'}</span>
        <span>→</span>
        <span style={{ color: 'var(--text-tertiary)' }}>{isRtl ? '3. مسودة الذكاء الاصطناعي' : '3. AI DRAFT'}</span>
        <span>→</span>
        <strong style={{ color: 'var(--brand-primary)' }}>{isRtl ? '4. قيد المراجعة' : '4. IN REVIEW'}</strong>
        <span>→</span>
        <span style={{ color: 'var(--text-tertiary)' }}>{isRtl ? '5. تم التعديل' : '5. EDITED'}</span>
        <span>→</span>
        <span style={{ color: 'var(--text-tertiary)' }}>{isRtl ? '6. غير موثق' : '6. NOT SIGNED'}</span>
        <span>→</span>
        <span style={{ color: 'var(--text-tertiary)' }}>{isRtl ? '7. غير معتمد' : '7. NOT COMMITTED'}</span>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem' }} role="tablist">
        {tabs.map((tabItem) => (
          <Button
            key={tabItem.id}
            variant={tab === tabItem.id ? 'primary' : 'outline'}
            icon={tabItem.icon}
            onClick={() => setTab(tabItem.id)}
          >
            {tabItem.label} <Badge variant="neutral" size="sm" style={{ marginInlineStart: '0.35rem' }}>{tabItem.badge}</Badge>
          </Button>
        ))}
      </div>

      {/* Tab: SOAP Review */}
      {tab === 'soap' && (
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {(['subjective', 'objective', 'assessment', 'plan'] as const).map((field) => (
            <SoapSection
              key={field}
              field={field}
              value={draft[field]}
              onChange={(value) => update(field, value)}
              onDemoEdit={() => demoAction(isRtl ? 'تم تفعيل وضع التعديل المحلي.' : 'local edit mode was enabled.')}
              copy={copy}
            />
          ))}
        </section>
      )}

      {/* Tab: Transcript Audit */}
      {tab === 'transcript' && (
        <Panel variant="elevated">
          <PanelHeader
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MaterialIcon name="graphic_eq" style={{ color: 'var(--brand-primary)' }} />
                <span>Audio Transcript Stream</span>
              </div>
            }
            actions={<Badge variant="warning" size="sm">{copy.rawContentNotice}</Badge>}
          />
          <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {doctorVoiceTranscript.map((turn) => (
              <div
                key={`${turn.speaker}-${turn.time}`}
                style={{
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: turn.speaker === 'Physician' ? 'var(--surface-subtle)' : 'var(--brand-primary-light)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                  <strong>{turn.speaker}</strong>
                  <span style={{ color: 'var(--text-tertiary)' }}>{turn.time}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  {turn.text}
                </p>
              </div>
            ))}
          </PanelBody>
        </Panel>
      )}

      {/* Tab: Review & Commit Actions */}
      {tab === 'actions' && (
        <Panel variant="elevated">
          <PanelHeader title={<span>{copy.tabActions}</span>} />
          <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '640px' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              {isRtl
                ? 'عند النقر على اعتماد وحفظ، سيتم نقل مسودة التوثيق السريري المراجعة مباشرة إلى سجل المريض الطبي بشكل دائم بتوقيعك الإلكتروني المعتمد.'
                : 'Upon attestation and commitment, the reviewed SOAP documentation will be committed to the patient’s permanent EMR under your physician credentials.'}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Button
                variant="primary"
                icon="verified"
                onClick={async () => {
                  try {
                    const { container } = await import('../../di/container');
                    const encounter = await container.attestSoapNoteUseCase.execute({
                      tenantId: 'tenant-demo-01',
                      encounterId: sessionId,
                      patientId: 'pat-001',
                      clinicianId: 'doc-001',
                      clinicianName: isRtl ? 'د. طارق القباني' : 'Dr. Tarek El-Kabbani',
                      subjective: draft.subjective,
                      objective: draft.objective,
                      assessment: draft.assessment,
                      plan: draft.plan,
                      specialty: 'Cardiology',
                    });

                    setNotice(
                      isRtl
                        ? `✅ تم توثيق الملاحظة السريرية واعتمادها بنجاح بتوقيع إلكتروني (${encounter.doctorSignature?.signatureHash})، وفهرسة الحالة مجهولة الهوية لتدريب نموذج الذكاء الاصطناعي.`
                        : `✅ Clinical SOAP note attested & signed (${encounter.doctorSignature?.signatureHash}), and de-identified case indexed for AI training.`
                    );
                  } catch (e: any) {
                    setNotice(`⚠️ ${e.message}`);
                  }
                }}
              >
                {isRtl ? 'توثيق واعتماد الملاحظة في السجل' : 'Attest & Commit to EMR'}
              </Button>
              <Button
                variant="outline"
                onClick={() => demoAction(isRtl ? 'تم حفظ التعديلات كمسودة مراجعة.' : 'changes saved as review draft.')}
              >
                {isRtl ? 'حفظ مسودة المراجعة' : 'Save Review Draft'}
              </Button>
            </div>
          </PanelBody>
        </Panel>
      )}

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

function SoapSection({
  field,
  value,
  onChange,
  onDemoEdit,
  copy,
}: {
  field: SoapField;
  value: string;
  onChange: (val: string) => void;
  onDemoEdit: () => void;
  copy: typeof doctorMessages.en.voiceReview | typeof doctorMessages.ar.voiceReview;
}) {
  const titles = {
    subjective: copy.subjectiveLabel,
    objective: copy.objectiveLabel,
    assessment: copy.assessmentLabel,
    plan: copy.planLabel,
  };

  return (
    <Panel variant="elevated">
      <PanelHeader
        title={
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
              {field[0].toUpperCase()}
            </b>
            <span style={{ fontSize: '0.9375rem', fontWeight: 700 }}>{titles[field]}</span>
          </div>
        }
        actions={
          <Button variant="ghost" size="sm" icon="edit" onClick={onDemoEdit}>
            Edit
          </Button>
        }
      />
      <PanelBody>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          style={{ width: '100%', fontSize: '0.875rem', lineHeight: 1.6 }}
        />
      </PanelBody>
    </Panel>
  );
}
