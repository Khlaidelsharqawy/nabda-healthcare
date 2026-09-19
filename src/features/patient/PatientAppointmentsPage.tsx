import { useMemo, useState } from 'react';
import { MaterialIcon, PageHeader, Button, Badge, Panel, PanelHeader, StatCard } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { patientMessages } from '../../i18n/messages';
import { patientAppointmentsFixture, type PatientAppointment } from './fixtures';
import { speakText, stopSpeaking } from '../../services/voiceService';

type AppointmentFilter = 'all' | 'upcoming' | 'past';

export function PatientAppointmentsPage() {
  const [filter, setFilter] = useState<AppointmentFilter>('all');
  const [selectedId, setSelectedId] = useState(patientAppointmentsFixture[0].id);
  const [notice, setNotice] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? patientMessages.ar.appointments : patientMessages.en.appointments;

  const visibleAppointments = useMemo(
    () =>
      patientAppointmentsFixture.filter(
        (appointment) =>
          filter === 'all' ||
          (filter === 'upcoming' && appointment.status === 'confirmed') ||
          (filter === 'past' && appointment.status === 'completed')
      ),
    [filter]
  );
  const selected = patientAppointmentsFixture.find((appointment) => appointment.id === selectedId) ?? patientAppointmentsFixture[0];

  const handleToggleSpeak = async () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    const prepText = copy.prepItems.join('. ');
    const text = isRtl
      ? `موعد استشارتك القادم مع ${selected.clinician}. التاريخ: ${selected.date}. الوقت: ${selected.time}. العيادة: ${selected.clinic} في ${selected.room}. تعليمات التحضير: ${prepText}`
      : `Your upcoming appointment with ${selected.clinician}. Date: ${selected.date}. Time: ${selected.time}. Clinic: ${selected.clinic} in ${selected.room}. Preparation instructions: ${prepText}`;
    await speakText(text, isRtl ? 'ar' : 'en');
    setIsSpeaking(false);
  };

  return (
    <div className="patient-page patient-appointments" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
          <Badge variant="brand" icon="calendar_month">{copy.portal}</Badge>
          <span>•</span>
          <strong style={{ color: 'var(--text-main)' }}>{copy.title}</strong>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-success-text)' }}>
          <MaterialIcon name="verified_user" /> {copy.scope}
        </span>
      </div>

      <PageHeader
        kicker={copy.hubEyebrow}
        title={`${copy.welcome} [Patient Name]`}
        subtitle={copy.description}
        actions={
          <>
            <Button
              variant="primary"
              size="md"
              icon="add_circle"
              onClick={() => setNotice(copy.bookingStagedNotice)}
            >
              {copy.bookConsultation}
            </Button>
            <a href="/patient/ai" className="ui-btn ui-btn--outline ui-btn--md">
              <MaterialIcon name="smart_toy" />
              <span>{copy.patientCompanion}</span>
            </a>
          </>
        }
      />

      {/* Metrics */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <StatCard
          label={copy.upcomingVisit}
          value="01"
          delta={copy.confirmed}
          icon="event_available"
          variant="accent"
        />
        <StatCard
          label={copy.pastRecords}
          value="03"
          delta={copy.summariesAvailable}
          icon="history"
          variant="default"
        />
        <StatCard
          label={copy.preparation}
          value="Ready"
          delta={copy.localChecklist}
          icon="fact_check"
          variant="success"
        />
        <StatCard
          label={copy.missedVisits}
          value="0"
          delta={copy.demoRecord}
          icon="task_alt"
          variant="default"
        />
      </section>

      {/* Main Layout */}
      <div className="patient-two-column-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Next Consultation Card */}
          <Panel variant="elevated">
            <PanelHeader
              title={copy.upcomingVisit}
              subtitle={copy.nextConsultation}
              icon="event_available"
              actions={<Badge variant="success" dot>{copy.confirmed}</Badge>}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
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
                    fontWeight: 700,
                  }}
                >
                  <MaterialIcon name="person" style={{ fontSize: '1.5rem' }} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '1.05rem' }}>{selected.clinician}</strong>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--brand-primary)' }}>
                    {isRtl && selected.typeAr ? selected.typeAr : selected.type}
                  </span>
                  <small style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>{selected.clinic}</small>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--surface-subtle)',
                  fontSize: '0.875rem',
                  flexWrap: 'wrap',
                }}
              >
                <span>⏰ <strong>{selected.time}</strong></span>
                <span>📅 <strong>{selected.date}</strong></span>
                <small style={{ color: 'var(--text-tertiary)' }}>{copy.clinicTime}</small>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                <MaterialIcon name="location_on" style={{ color: 'var(--brand-primary)' }} />
                <span>🏥 <strong>{selected.clinic} — {selected.room}</strong> <small>({copy.accessNotice})</small></span>
              </div>

              <div style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <MaterialIcon name="fact_check" style={{ color: 'var(--brand-primary)' }} />
                  <strong style={{ fontSize: '0.8125rem' }}>📋 {copy.prepTitle}</strong>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {copy.prepItems.map((item) => (
                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                      <MaterialIcon name="check_circle" style={{ color: 'var(--color-success-text)', fontSize: '1rem' }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <Button
                  variant={isSpeaking ? 'primary' : 'outline'}
                  size="sm"
                  icon={isSpeaking ? 'volume_up' : 'campaign'}
                  onClick={handleToggleSpeak}
                >
                  {isSpeaking
                    ? (isRtl ? 'إيقاف الصوت ⏹️' : 'Stop Audio ⏹️')
                    : (isRtl ? '🔊 استمع لتفاصيل الموعد والتحضير' : '🔊 Listen to Appointment & Prep')}
                </Button>
                <Button variant="outline" size="sm" icon="clinical_notes" onClick={() => setNotice(copy.detailsOpenedNotice)}>
                  {copy.viewDetails}
                </Button>
                <Button variant="ghost" size="sm" icon="event_repeat" onClick={() => setNotice(copy.changeStagedNotice)}>
                  {copy.requestChange}
                </Button>
              </div>
            </div>
          </Panel>

          {/* Past Visits / History */}
          <Panel variant="elevated" padding="none">
            <div style={{ padding: '1.25rem 1.25rem 0' }}>
              <PanelHeader
                title={copy.pastVisits}
                subtitle={copy.historyTitle}
                icon="history"
                actions={
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {(['all', 'upcoming', 'past'] as AppointmentFilter[]).map((val) => (
                      <Button
                        key={val}
                        variant={filter === val ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setFilter(val)}
                      >
                        {val === 'all' ? copy.allVisits : val === 'upcoming' ? copy.upcoming : copy.past}
                      </Button>
                    ))}
                  </div>
                }
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.5rem' }}>
              {visibleAppointments.map((appointment, idx) => {
                const isSelected = selectedId === appointment.id;
                return (
                  <div
                    key={appointment.id}
                    onClick={() => setSelectedId(appointment.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      padding: '1rem 1.25rem',
                      borderTop: idx > 0 ? '1px solid var(--border-subtle)' : 'none',
                      backgroundColor: isSelected ? 'var(--brand-primary-light)' : 'transparent',
                      cursor: 'pointer',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.9375rem' }}>
                        {isRtl && appointment.typeAr ? appointment.typeAr : appointment.type}
                      </strong>
                      <small style={{ color: 'var(--text-muted)' }}>
                        {appointment.clinician} • {appointment.clinic}
                      </small>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ textAlign: 'end', fontSize: '0.8125rem' }}>
                        <strong style={{ display: 'block' }}>{appointment.date}</strong>
                        <small style={{ color: 'var(--text-tertiary)' }}>{appointment.time}</small>
                      </div>

                      <Badge variant={appointment.status === 'confirmed' ? 'success' : 'neutral'} dot>
                        {appointment.status === 'confirmed' ? copy.confirmed : copy.completed}
                      </Badge>

                      <Button
                        variant="ghost"
                        size="sm"
                        icon="visibility"
                        aria-label={`View ${appointment.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setNotice(copy.summaryOpenedNotice);
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>

        {/* Right Aside: Companion & Access */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Panel variant="elevated">
            <PanelHeader
              title={copy.companionTitle}
              subtitle={copy.companionScope}
              icon="smart_toy"
            />
            <p style={{ margin: '0.5rem 0 1rem', fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {copy.companionDesc}
            </p>
            <a href="/patient/ai" className="ui-btn ui-btn--primary ui-btn--sm" style={{ justifyContent: 'center' }}>
              <span>{copy.openCompanion}</span>
              <MaterialIcon name={isRtl ? 'arrow_back' : 'arrow_forward'} />
            </a>
          </Panel>

          <Panel variant="elevated">
            <PanelHeader
              title={copy.accessTitle}
              icon="apartment"
            />
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {copy.accessDesc}
            </p>
          </Panel>
        </div>
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
