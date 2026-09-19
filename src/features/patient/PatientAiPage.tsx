import { useState, type FormEvent } from 'react';
import { MaterialIcon, PageHeader, Button, Badge, Panel, PanelHeader, Textarea } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { patientMessages } from '../../i18n/messages';
import { patientAiFixture as data, type PatientAiPrompt } from './fixtures';
import { speakText, stopSpeaking, startVoiceRecognition, stopVoiceRecognition } from '../../services/voiceService';

export function PatientAiPage() {
  const [selectedPrompt, setSelectedPrompt] = useState<PatientAiPrompt>(data.prompts[0]);
  const [question, setQuestion] = useState('');
  const [feedback, setFeedback] = useState('');
  const [notice, setNotice] = useState('');
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? patientMessages.ar.ai : patientMessages.en.ai;

  const [isListening, setIsListening] = useState(false);
  const [isSpeakingResponse, setIsSpeakingResponse] = useState(false);

  const choosePrompt = (prompt: PatientAiPrompt) => {
    setSelectedPrompt(prompt);
    setFeedback('');
    setNotice('');
    if (isSpeakingResponse) {
      stopSpeaking();
      setIsSpeakingResponse(false);
    }
  };

  const handleToggleVoiceInput = () => {
    if (isListening) {
      stopVoiceRecognition();
      setIsListening(false);
      return;
    }

    const started = startVoiceRecognition(
      (text) => {
        setQuestion((prev) => (prev ? `${prev} ${text}` : text));
      },
      (err) => {
        setNotice(err);
        setIsListening(false);
      },
      isRtl ? 'ar' : 'en'
    );

    if (started) {
      setIsListening(true);
      setNotice(isRtl ? 'جارٍ الاستماع لصوتك... تحدث الآن وسنقوم بتحويله إلى نص تلقائياً 🎙️' : 'Listening to your voice... Speak now 🎙️');
    }
  };

  const handleToggleSpeakResponse = async () => {
    if (isSpeakingResponse) {
      stopSpeaking();
      setIsSpeakingResponse(false);
      return;
    }

    setIsSpeakingResponse(true);
    await speakText(selectedPrompt.response, isRtl ? 'ar' : 'en');
    setIsSpeakingResponse(false);
  };

  const submitQuestion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuestion('');
    setNotice(copy.freeFormNotice);
    if (isListening) {
      stopVoiceRecognition();
      setIsListening(false);
    }
  };

  return (
    <div className="patient-page patient-ai" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.65rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--surface-subtle)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Badge variant="brand" icon="smart_toy">{copy.portal}</Badge>
          <span>•</span>
          <strong style={{ color: 'var(--text-main)' }}>{copy.title}</strong>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-success-text)' }}>
          <MaterialIcon name="verified_user" /> {copy.scope}
        </span>
      </div>

      <PageHeader
        kicker={copy.statusTitle}
        title={copy.title}
        subtitle={`${copy.authorizedContext}: ${data.patientLabel} • ${data.clinicName}`}
        actions={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Badge variant="brand" icon="lock">{copy.protectedSession}</Badge>
            <Badge variant="neutral" icon="shield">{copy.zeroDiagnostic}</Badge>
          </div>
        }
      />

      {/* Disclaimer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--surface-subtle)',
          border: '1px solid var(--border-default)',
        }}
      >
        <MaterialIcon name="warning" style={{ color: 'var(--color-warning-text)', fontSize: '1.5rem', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <strong style={{ display: 'block', fontSize: '0.875rem' }}>{copy.disclaimerTitle}</strong>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{copy.disclaimerDesc}</p>
        </div>
        <Badge variant="neutral">{copy.scopePrefix}: {data.scopeReference}</Badge>
      </div>

      {/* Main Workspace */}
      <div className="patient-two-column-layout-reverse">
        {/* Sidebar: Navigation Links & Prompts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Panel variant="elevated">
            <PanelHeader
              title={copy.contextBoundaries}
              icon="verified"
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <a
                href="/patient/ai/context"
                className="ui-btn ui-btn--subtle ui-btn--sm"
                style={{ justifyContent: 'space-between', padding: '0.75rem' }}
              >
                <div>
                  <strong style={{ display: 'block', fontSize: '0.875rem' }}>{copy.authorizedContextLink}</strong>
                  <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem' }}>{copy.authorizedContextSub}</small>
                </div>
                <MaterialIcon name={isRtl ? 'chevron_left' : 'chevron_right'} />
              </a>
              <a
                href="/patient/ai/history"
                className="ui-btn ui-btn--subtle ui-btn--sm"
                style={{ justifyContent: 'space-between', padding: '0.75rem' }}
              >
                <div>
                  <strong style={{ display: 'block', fontSize: '0.875rem' }}>{copy.interactionHistoryLink}</strong>
                  <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem' }}>{copy.interactionHistorySub}</small>
                </div>
                <MaterialIcon name={isRtl ? 'chevron_left' : 'chevron_right'} />
              </a>
            </div>
          </Panel>

          <Panel variant="elevated">
            <PanelHeader
              title={copy.chooseTopic}
              subtitle={copy.quickStarters}
              icon="lightbulb"
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              {data.prompts.map((p) => {
                const isSelected = selectedPrompt.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => choosePrompt(p)}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? 'var(--brand-primary-light)' : 'var(--surface-subtle)',
                      color: isSelected ? 'var(--brand-primary)' : 'var(--text-main)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      textAlign: 'start',
                      cursor: 'pointer',
                    }}
                  >
                    {isRtl ? p.arabic : p.label}
                  </button>
                );
              })}
            </div>
          </Panel>
        </div>

        {/* Conversation Main */}
        <Panel variant="elevated">
          <PanelHeader
            title={copy.activeSession}
            icon="forum"
            actions={<Badge variant="neutral">{copy.scopeBound}: {data.scopeReference}</Badge>}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {/* Patient Message */}
            <div
              style={{
                alignSelf: 'flex-start',
                maxWidth: '85%',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--surface-subtle)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem', display: 'block', marginBottom: '0.25rem' }}>
                {data.patientLabel}
              </small>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-main)' }}>{data.initialQuestion}</p>
              <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.35rem' }}>
                <MaterialIcon name="done_all" style={{ fontSize: '0.95rem' }} /> {copy.localDemoSession}
              </small>
            </div>

            {/* AI Assistant Message */}
            <div
              style={{
                alignSelf: 'stretch',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--brand-primary-light)',
                border: '1px solid rgba(8, 116, 67, 0.2)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MaterialIcon name="smart_toy" style={{ color: 'var(--brand-primary)' }} />
                  <strong style={{ fontSize: '0.875rem', color: 'var(--brand-primary)' }}>{copy.assistantTitle}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Button
                    variant={isSpeakingResponse ? 'primary' : 'outline'}
                    size="sm"
                    icon={isSpeakingResponse ? 'volume_up' : 'campaign'}
                    onClick={handleToggleSpeakResponse}
                  >
                    {isSpeakingResponse ? (isRtl ? 'إيقاف ⏹️' : 'Stop ⏹️') : (isRtl ? '🔊 استمع للإجابة' : '🔊 Read Aloud')}
                  </Button>
                  <Badge variant="brand">{copy.boundedResponse}</Badge>
                </div>
              </div>

              <p style={{ margin: '0 0 1rem', fontSize: '0.9375rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                {selectedPrompt.response}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-card)' }}>
                  <strong style={{ display: 'block', fontSize: '0.78rem', color: 'var(--brand-primary)' }}>{copy.safeScope}</strong>
                  <small style={{ color: 'var(--text-muted)' }}>{copy.safeScopeDesc}</small>
                </div>
                <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-card)' }}>
                  <strong style={{ display: 'block', fontSize: '0.78rem', color: 'var(--brand-primary)' }}>{copy.clinicalQuestions}</strong>
                  <small style={{ color: 'var(--text-muted)' }}>{copy.clinicalQuestionsDesc}</small>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(8, 116, 67, 0.15)', paddingTop: '0.5rem' }}>
                <small style={{ color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MaterialIcon name="shield" style={{ fontSize: '0.95rem' }} /> {copy.safetyWarning}
                </small>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{copy.feedbackQuestion}</span>
                  <Button variant="ghost" size="sm" icon="thumb_up" aria-label={copy.helpful} onClick={() => setFeedback(copy.helpfulFeedbackNotice)} />
                  <Button variant="ghost" size="sm" icon="thumb_down" aria-label={copy.notHelpful} onClick={() => setFeedback(copy.notHelpfulFeedbackNotice)} />
                </div>
              </div>
            </div>
          </div>

          {/* Question Composer */}
          <form onSubmit={submitQuestion} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{copy.askLabel}</label>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={copy.askPlaceholder}
              rows={3}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button variant="ghost" size="sm" icon="clear_all" onClick={() => { setQuestion(''); setNotice(copy.clearedNotice); }}>
                  {copy.clearInput}
                </Button>
                <Button
                  type="button"
                  variant={isListening ? 'primary' : 'ghost'}
                  size="sm"
                  icon={isListening ? 'mic' : 'mic_none'}
                  onClick={handleToggleVoiceInput}
                  style={isListening ? { color: 'var(--color-danger-text)', fontWeight: 700 } : {}}
                >
                  {isListening
                    ? (isRtl ? 'جارٍ الاستماع... (اضغط للإنهاء) 🔴' : 'Listening... (Tap to stop) 🔴')
                    : (isRtl ? 'تحدث صوتياً 🎙️' : 'Voice Input 🎙️')}
                </Button>
              </div>
              <Button variant="primary" size="md" icon="send" type="submit">
                {copy.sendInquiry}
              </Button>
            </div>
          </form>
        </Panel>
      </div>

      {/* Info Tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        <Panel variant="elevated">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <MaterialIcon name="calendar_month" style={{ color: 'var(--brand-primary)', fontSize: '1.5rem' }} />
            <Badge variant="neutral">{copy.upcomingStatus}</Badge>
          </div>
          <strong style={{ display: 'block', fontSize: '0.9375rem' }}>{copy.appointmentDesk}</strong>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{copy.appointmentDeskText}</p>
        </Panel>

        <Panel variant="elevated">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <MaterialIcon name="medication" style={{ color: 'var(--brand-primary)', fontSize: '1.5rem' }} />
            <Badge variant="neutral">{copy.viewOnlyStatus}</Badge>
          </div>
          <strong style={{ display: 'block', fontSize: '0.9375rem' }}>{copy.medicationRecords}</strong>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{copy.medicationRecordsText}</p>
        </Panel>

        <Panel variant="elevated">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <MaterialIcon name="biotech" style={{ color: 'var(--brand-primary)', fontSize: '1.5rem' }} />
            <Badge variant="neutral">{copy.referenceStatus}</Badge>
          </div>
          <strong style={{ display: 'block', fontSize: '0.9375rem' }}>{copy.labRecords}</strong>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{copy.labRecordsText}</p>
        </Panel>
      </div>

      {feedback && (
        <div className="auth-alert auth-alert--success" role="status">
          <MaterialIcon name="check_circle" />
          <span>{feedback}</span>
        </div>
      )}
      {notice && (
        <div className="auth-alert auth-alert--success" role="status">
          <MaterialIcon name="info" />
          <span>{notice}</span>
        </div>
      )}
    </div>
  );
}
