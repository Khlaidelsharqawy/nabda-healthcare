import { useState } from 'react';
import { MaterialIcon, Panel, PanelHeader, PanelBody, Badge, Button } from '../../components/ui';
import { doctorVoiceTranscript } from './fixtures';
import { useTheme } from '../../theme/ThemeProvider';
import { doctorMessages } from '../../i18n/messages';

export function DoctorActiveVoiceSessionPage({ sessionId }: { sessionId: string }) {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = doctorMessages[isRtl ? 'ar' : 'en'].activeVoiceSession;

  const [recording, setRecording] = useState(true);
  const [notice, setNotice] = useState('');

  return (
    <div className="aegis-page doctor-active-voice-page" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Security & Compliance Assurance Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.625rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--brand-primary-light)',
          color: 'var(--brand-primary)',
          fontSize: '0.8125rem',
          fontWeight: 600,
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <MaterialIcon name="verified_user" style={{ fontSize: '1rem' }} />
          {copy.roleRestricted}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <MaterialIcon name="domain" style={{ fontSize: '1rem' }} />
          {copy.tenantIsolated}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <MaterialIcon name="psychology" style={{ fontSize: '1rem' }} />
          {copy.audioProcessing}
        </span>
      </div>

      {/* Patient Encounter Identity Card */}
      <Panel variant="elevated">
        <PanelBody style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--surface-subtle)',
                color: 'var(--brand-primary)',
                display: 'grid',
                placeItems: 'center',
                fontSize: '1.5rem',
              }}
            >
              <MaterialIcon name="person" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.25rem 0' }}>
                {isRtl ? '[اسم المريض]' : '[Patient Name]'}
              </h1>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {isRtl ? 'معرف المريض: PATIENT-DEMO-01 • استشارة قلب • المقابلة: APT-DEMO-01' : 'Patient ID: PATIENT-DEMO-01 • Cardiology Consultation • Encounter: APT-DEMO-01'}
              </span>
              <small style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '0.15rem' }}>
                VSID: {sessionId} • {isRtl ? 'المدة: حالة جلسة تجريبية' : 'Duration: synthetic session state'}
              </small>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              variant="outline"
              size="sm"
              icon="folder_shared"
              onClick={() =>
                setNotice(
                  isRtl ? 'تجريبي للعرض فقط - لم يتم فتح سجل المريض.' : 'Demo only - patient record was not opened.'
                )
              }
            >
              {copy.patientRecord}
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon="history"
              onClick={() =>
                setNotice(
                  isRtl ? 'تجريبي للعرض فقط - لم يتم فتح المقابلات السابقة.' : 'Demo only - prior encounters were not opened.'
                )
              }
            >
              {copy.priorEncounters}
            </Button>
          </div>
        </PanelBody>
      </Panel>

      {/* Audio Capture Studio & Telemetry */}
      <Panel variant="elevated" style={{ borderInlineStart: `4px solid ${recording ? '#10b981' : '#f59e0b'}` }}>
        <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: recording ? '#10b981' : '#f59e0b',
                  animation: recording ? 'pulse 1.5s infinite' : 'none',
                }}
              />
              <strong style={{ fontSize: '0.9375rem', color: 'var(--text-main)' }}>
                {recording ? copy.liveSession : copy.pausedSession}
              </strong>
              <small style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{copy.protectedState}</small>
            </div>
            <strong style={{ fontSize: '1.25rem', fontFamily: 'monospace', color: 'var(--brand-primary)' }}>
              00:08:14
            </strong>
          </div>

          {/* Waveform Visualization */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              height: '56px',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--surface-subtle)',
            }}
            aria-label="Synthetic audio waveform"
          >
            {Array.from({ length: 28 }, (_, index) => (
              <i
                key={index}
                style={{
                  width: '4px',
                  height: recording ? `${20 + ((index * 17) % 70)}%` : '15%',
                  backgroundColor: recording ? 'var(--brand-primary)' : 'var(--text-tertiary)',
                  borderRadius: '2px',
                  transition: 'height 0.2s ease',
                }}
              />
            ))}
          </div>

          {/* Scribe Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                variant={recording ? 'outline' : 'primary'}
                icon={recording ? 'pause' : 'play_arrow'}
                onClick={() => setRecording((value) => !value)}
              >
                {recording ? copy.pauseDemo : copy.resumeDemo}
              </Button>
              <Button
                variant="danger"
                icon="stop_circle"
                onClick={() =>
                  setNotice(
                    isRtl
                      ? 'تجريبي للعرض فقط - انتهت الجلسة التجريبية.'
                      : 'Demo only - synthetic session ended.'
                  )
                }
              >
                {copy.endSession}
              </Button>
            </div>

            <Button
              variant="primary"
              icon={isRtl ? 'arrow_back' : 'arrow_forward'}
              onClick={() => {
                window.location.href = `/doctor/voice-sessions/${sessionId}/review`;
              }}
            >
              {copy.proceedReview}
            </Button>
          </div>
        </PanelBody>
      </Panel>

      {/* Scribe Studio Grid: Real-Time Transcript & Live SOAP Synthesis */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Transcript Panel */}
        <Panel variant="elevated">
          <PanelHeader
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MaterialIcon name="hearing" style={{ color: 'var(--brand-primary)' }} />
                <span>{copy.transcriptTitle}</span>
              </div>
            }
            actions={<Badge variant="warning" size="sm">{copy.unverifiedContent}</Badge>}
          />
          <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '420px', overflowY: 'auto' }}>
            {doctorVoiceTranscript.map((turn) => {
              const speaker = isRtl ? (turn.speaker === 'Physician' ? 'الطبيب المعالج' : 'المريض') : turn.speaker;
              const isPhysician = turn.speaker === 'Physician';
              return (
                <div
                  key={`${turn.speaker}-${turn.time}`}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isPhysician ? 'var(--surface-subtle)' : 'var(--brand-primary-light)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <strong style={{ color: isPhysician ? 'var(--text-main)' : 'var(--brand-primary)' }}>
                      {speaker}
                    </strong>
                    <span style={{ color: 'var(--text-tertiary)' }}>{turn.time}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    {turn.text}
                  </p>
                </div>
              );
            })}
          </PanelBody>
        </Panel>

        {/* Live Extracted SOAP Draft */}
        <Panel variant="elevated">
          <PanelHeader
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MaterialIcon name="clinical_notes" style={{ color: 'var(--brand-primary)' }} />
                <span>{copy.soapTitle}</span>
              </div>
            }
            actions={<Badge variant="brand" size="sm">{copy.soapBadge}</Badge>}
          />
          <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '420px', overflowY: 'auto' }}>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-subtle)' }}>
              <strong style={{ display: 'block', fontSize: '0.75rem', color: 'var(--brand-primary)', marginBottom: '0.25rem' }}>
                [S] Subjective
              </strong>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {isRtl ? 'المريض يراجع لمتابعة قراءات ضغط الدم الروتينية. لا توجد أعراض حادة.' : 'Patient presents for scheduled follow-up. Tolerating current ACE-inhibitor.'}
              </p>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-subtle)' }}>
              <strong style={{ display: 'block', fontSize: '0.75rem', color: 'var(--brand-primary)', marginBottom: '0.25rem' }}>
                [O] Objective
              </strong>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                BP 148/92 mmHg, HR 78 bpm. Lungs clear to auscultation bilaterally.
              </p>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-subtle)' }}>
              <strong style={{ display: 'block', fontSize: '0.75rem', color: 'var(--brand-primary)', marginBottom: '0.25rem' }}>
                [A] Assessment
              </strong>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Essential hypertension, mildly elevated clinic reading. Stable glycemic control.
              </p>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-subtle)' }}>
              <strong style={{ display: 'block', fontSize: '0.75rem', color: 'var(--brand-primary)', marginBottom: '0.25rem' }}>
                [P] Plan
              </strong>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Continue Lisinopril 10 mg daily. Recheck CMP in 60 days. Follow up in 3 months.
              </p>
            </div>
          </PanelBody>
        </Panel>
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
