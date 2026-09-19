import { useState } from 'react';
import { MaterialIcon, PageHeader, Button, Badge, Panel, PanelHeader, StatCard } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { patientMessages } from '../../i18n/messages';
import { patientMedicationsFixture as data, type PatientMedication } from './fixtures';
import { speakText, stopSpeaking } from '../../services/voiceService';

export function PatientMedicationsPage() {
  const [notice, setNotice] = useState('');
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? patientMessages.ar.medications : patientMessages.en.medications;

  const [speakingMedId, setSpeakingMedId] = useState<string | null>(null);

  const handleToggleSpeak = async (m: PatientMedication) => {
    if (speakingMedId === m.id) {
      stopSpeaking();
      setSpeakingMedId(null);
      return;
    }
    setSpeakingMedId(m.id);
    const textToSpeak = isRtl
      ? `دواء ${m.arabicName}. الجرعة: ${m.schedule}. الموعد: ${m.timing}. تعليمات الطبيب: ${m.instruction}. يرجى تناول الدواء مع كوب ماء كامل.`
      : `Medication: ${m.name}. Dosage: ${m.schedule}. Timing: ${m.timing}. Instructions: ${m.instruction}. Please take with a full glass of water.`;

    await speakText(textToSpeak, isRtl ? 'ar' : 'en');
    setSpeakingMedId(null);
  };

  const showLocalNotice = (message: string) => setNotice(`Demo only: ${message} No server update was made.`);

  return (
    <div className="patient-page patient-medications" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
          <Badge variant="brand" icon="medication">{copy.portal}</Badge>
          <span>•</span>
          <strong style={{ color: 'var(--text-main)' }}>{copy.title}</strong>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-success-text)' }}>
          <MaterialIcon name="verified_user" /> {copy.scope}
        </span>
      </div>

      {/* Hero & Metrics */}
      <Panel variant="elevated">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Badge variant="success" dot>{copy.activeRecord}</Badge>
              <Badge variant="neutral" icon="apartment">{data.clinicName}</Badge>
            </div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{copy.heading}</h1>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {data.patientLabel} • {copy.patientId}: {data.patientId} • {copy.clinician}: {data.clinician}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <StatCard
              label={copy.activePrescriptions}
              value={data.activeCount}
              icon="prescriptions"
              variant="accent"
            />
            <StatCard
              label={copy.refillRequests}
              value={data.refillCount}
              icon="autorenew"
              variant="default"
            />
            <StatCard
              label={copy.recordStatus}
              value={copy.viewOnly}
              icon="verified_user"
              variant="default"
            />
          </div>
        </div>
      </Panel>

      {/* Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Adherence Panel */}
        <Panel variant="elevated">
          <PanelHeader
            title={copy.overviewHeading}
            subtitle={copy.personalRecordView}
            icon="donut_large"
            actions={<Badge variant="neutral">{copy.viewOnly}</Badge>}
          />
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--brand-primary)', fontFamily: 'var(--font-display)' }}>
                {data.adherence}
              </span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{data.adherenceDetail}</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {copy.adherenceDisclaimer}
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--brand-primary-light)',
                color: 'var(--brand-primary)',
                fontSize: '0.78rem',
              }}
            >
              <MaterialIcon name="shield" />
              <span>{copy.changesRequireReview}</span>
            </div>
          </div>
        </Panel>

        {/* Daily Schedule */}
        <Panel variant="elevated">
          <PanelHeader
            title={copy.scheduledView}
            subtitle={copy.dailySchedule}
            icon="schedule"
            actions={<small style={{ color: 'var(--text-tertiary)' }}>{data.scheduleDate}</small>}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
            {data.medications.map((m) => {
              const isTaken = m.status === 'taken';
              const isDue = m.status === 'due';
              const statusText = isTaken ? copy.statusTaken : isDue ? copy.statusDue : copy.statusScheduled;
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface-subtle)',
                    border: '1px solid var(--border-subtle)',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <MaterialIcon name={m.icon} style={{ color: 'var(--brand-primary)' }} />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.875rem' }}>
                        {isRtl ? m.arabicName : m.name}
                      </strong>
                      <small style={{ color: 'var(--text-muted)' }}>{m.schedule} • {m.timing}</small>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                    <Button
                      variant={speakingMedId === m.id ? 'primary' : 'ghost'}
                      size="sm"
                      icon={speakingMedId === m.id ? 'volume_up' : 'campaign'}
                      onClick={() => handleToggleSpeak(m)}
                      aria-label={isRtl ? 'استمع' : 'Listen'}
                    />
                    <Button
                      variant={isTaken ? 'outline' : isDue ? 'primary' : 'ghost'}
                      size="sm"
                      icon={isTaken ? 'check_circle' : 'visibility'}
                      onClick={() => showLocalNotice('dose status was displayed locally.')}
                    >
                      {statusText}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      {/* Prescriptions List */}
      <Panel variant="elevated" padding="none">
        <div style={{ padding: '1.25rem 1.25rem 0' }}>
          <PanelHeader
            title={copy.activePrescriptionsHeading}
            subtitle={copy.prescriptionsSub}
            icon="prescriptions"
            actions={<Badge variant="brand" icon="verified">{copy.syntheticRecord}</Badge>}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', padding: '1.25rem' }}>
          {data.medications.map((m) => (
            <div
              key={m.id}
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--surface-subtle)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <MaterialIcon name={m.icon} style={{ color: 'var(--brand-primary)', fontSize: '1.5rem' }} />
                <Badge variant="success" dot>{m.prescriptionStatus}</Badge>
              </div>

              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
                  {isRtl ? m.arabicName : m.name}
                </h3>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{copy.presentationPurpose}</small>
              </div>

              {/* Emoji Patient Guidance Badges */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-subtle)' }}>
                  💊 {isRtl ? 'قرص فموي' : 'Oral Tablet'}
                </span>
                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-subtle)' }}>
                  {m.timing.toLowerCase().includes('morning') || m.timing.includes('صباح') ? (isRtl ? '☀️ صباحاً' : '☀️ Morning') : (isRtl ? '🌙 مساءً' : '🌙 Evening')}
                </span>
                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-subtle)' }}>
                  🍽️ {isRtl ? 'بعد الطعام' : 'After Meal'}
                </span>
                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-subtle)' }}>
                  💧 {isRtl ? 'مع كوب ماء' : 'With Water'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.78rem', backgroundColor: 'var(--surface-card)', padding: '0.65rem', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <span style={{ color: 'var(--text-tertiary)', display: 'block' }}>{copy.clinicianLabel}</span>
                  <strong>{m.clinician}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-tertiary)', display: 'block' }}>{copy.prescriptionRefLabel}</span>
                  <strong>{m.reference}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <MaterialIcon name="info" style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
                <span>{m.instruction}</span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem', flexWrap: 'wrap' }}>
                <Button
                  variant={speakingMedId === m.id ? 'primary' : 'outline'}
                  size="sm"
                  icon={speakingMedId === m.id ? 'volume_up' : 'campaign'}
                  onClick={() => handleToggleSpeak(m)}
                >
                  {speakingMedId === m.id
                    ? (isRtl ? 'إيقاف الصوت ⏹️' : 'Stop Audio ⏹️')
                    : (isRtl ? 'استمع للتعليمات 🔊' : 'Read Aloud 🔊')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon="refresh"
                  onClick={() => showLocalNotice('a local refill request notice was staged.')}
                >
                  {copy.requestReview}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="description"
                  aria-label={`${copy.viewDetailsAria} ${m.name}`}
                  onClick={() => showLocalNotice('prescription details opened locally.')}
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Safety Notice Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--surface-subtle)',
          border: '1px solid var(--border-subtle)',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <MaterialIcon name="medical_services" style={{ color: 'var(--brand-primary)' }} />
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            <strong>{copy.safetyNoticeTitle}:</strong> {copy.safetyNoticeBody}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => showLocalNotice('the safety notice was acknowledged locally.')}>
          {copy.acknowledgeLocally}
        </Button>
      </div>

      {notice && (
        <div className="auth-alert auth-alert--success" role="status">
          <MaterialIcon name="info" />
          <span>{notice}</span>
        </div>
      )}
    </div>
  );
}
