import { useState } from 'react';
import { MaterialIcon, PageHeader, Button, Badge, Panel, PanelHeader, StatCard } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { patientMessages } from '../../i18n/messages';
import { patientDashboardFixture as data } from './fixtures';
import { speakText, stopSpeaking } from '../../services/voiceService';

export function PatientDashboardPage() {
  const [notice, setNotice] = useState('');
  const [isSpeakingHero, setIsSpeakingHero] = useState(false);
  const [isSpeakingAppt, setIsSpeakingAppt] = useState(false);
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? patientMessages.ar.dashboard : patientMessages.en.dashboard;

  return (
    <div className="patient-page patient-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Context banner */}
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
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Badge variant="brand" icon="medical_information">{copy.portal}</Badge>
          <span>•</span>
          <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <MaterialIcon name="lock" /> {copy.patientScope}
          </span>
          <span>•</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{copy.hipaa}</span>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-success-text)' }}>
          <MaterialIcon name="verified_user" /> {copy.isolation}
        </span>
      </div>

      {/* Patient Welcome Hero */}
      <Panel variant="elevated">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-primary)',
                color: '#ffffff',
                display: 'grid',
                placeItems: 'center',
                fontSize: '1.35rem',
                fontWeight: 800,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              P
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <Badge variant="success" dot>{copy.activeRecord}</Badge>
                <Button
                  variant={isSpeakingHero ? 'primary' : 'ghost'}
                  size="sm"
                  icon={isSpeakingHero ? 'volume_up' : 'campaign'}
                  onClick={async () => {
                    if (isSpeakingHero) {
                      stopSpeaking();
                      setIsSpeakingHero(false);
                      return;
                    }
                    setIsSpeakingHero(true);
                    const text = isRtl
                      ? `أهلاً بك ${data.patientLabel}. موعدك القادم هو ${data.nextAppointment}. لديك ${data.prescriptionCount} وصفات علاجية نشطة.`
                      : `Welcome ${data.patientLabel}. Your next consultation is on ${data.nextAppointment}. You have ${data.prescriptionCount} active prescriptions.`;
                    await speakText(text, isRtl ? 'ar' : 'en');
                    setIsSpeakingHero(false);
                  }}
                >
                  {isSpeakingHero ? (isRtl ? 'إيقاف ⏹️' : 'Stop ⏹️') : (isRtl ? '🔊 استمع للملخص' : '🔊 Listen to Summary')}
                </Button>
              </div>
              <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                {copy.welcome} {data.patientLabel}
              </h1>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {copy.mrn}: {data.patientId} • {copy.primaryCare}: {data.clinicName}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <StatCard
              label={copy.nextAppointment}
              value={data.nextAppointment}
              icon="calendar_month"
              variant="accent"
            />
            <StatCard
              label={copy.activePrescriptions}
              value={data.prescriptionCount}
              icon="medication"
              variant="default"
            />
            <StatCard
              label={copy.recentLabs}
              value={data.recentLabs}
              icon="biotech"
              variant="default"
            />
          </div>
        </div>
      </Panel>

      {/* Main Grid */}
      <div className="patient-two-column-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Upcoming Consultations */}
          <Panel variant="elevated">
            <PanelHeader
              title={copy.upcomingConsultations}
              icon="event_available"
              actions={<Badge variant="success" dot>{copy.confirmedStatus}</Badge>}
            />
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--brand-primary-light)',
                    color: 'var(--brand-primary)',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 700,
                  }}
                >
                  <MaterialIcon name="person" />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '1rem' }}>{data.appointment.clinician}</strong>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--brand-primary)' }}>
                    {isRtl ? (data.appointment.typeAr || data.appointment.type) : data.appointment.type}
                  </span>
                  <small style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                    {copy.clinic}: {data.appointment.clinic}
                  </small>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--surface-subtle)',
                  fontSize: '0.85rem',
                  flexWrap: 'wrap',
                }}
              >
                <span><MaterialIcon name="event" /> {copy.date}: <strong>{data.appointment.date}</strong></span>
                <span><MaterialIcon name="schedule" /> {copy.time}: <strong>{data.appointment.time}</strong></span>
                <span><MaterialIcon name="door_front" /> <strong>{data.appointment.room}</strong></span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                  <MaterialIcon name="pin_drop" />
                  <span>{data.appointment.campus} <small>({data.appointment.address})</small></span>
                </div>
                <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>{copy.directionsAvailable}</span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <Button
                  variant={isSpeakingAppt ? 'primary' : 'outline'}
                  size="sm"
                  icon={isSpeakingAppt ? 'volume_up' : 'campaign'}
                  onClick={async () => {
                    if (isSpeakingAppt) {
                      stopSpeaking();
                      setIsSpeakingAppt(false);
                      return;
                    }
                    setIsSpeakingAppt(true);
                    const text = isRtl
                      ? `استشارة قادمة مع ${data.appointment.clinician}. الموعد يوم ${data.appointment.date} الساعة ${data.appointment.time} في ${data.appointment.room}. الموقع: ${data.appointment.campus}، ${data.appointment.address}.`
                      : `Upcoming consultation with ${data.appointment.clinician}. Date: ${data.appointment.date} at ${data.appointment.time} in ${data.appointment.room}. Location: ${data.appointment.campus}, ${data.appointment.address}.`;
                    await speakText(text, isRtl ? 'ar' : 'en');
                    setIsSpeakingAppt(false);
                  }}
                >
                  {isSpeakingAppt ? (isRtl ? 'إيقاف ⏹️' : 'Stop ⏹️') : (isRtl ? '🔊 استمع للموعد' : '🔊 Listen to Appointment')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon="receipt_long"
                  onClick={() => { window.location.href = '/clinic/al-nour/booking/confirmed'; }}
                >
                  {copy.viewBooking}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="edit_calendar"
                  onClick={() => { window.location.href = '/patient/appointments'; }}
                >
                  {copy.requestReschedule}
                </Button>
              </div>
            </div>
          </Panel>

          {/* Diagnostics Panel */}
          <Panel variant="elevated" padding="none">
            <div style={{ padding: '1.25rem 1.25rem 0' }}>
              <PanelHeader
                title={copy.diagnosticsTitle}
                icon="biotech"
                actions={<Badge variant="brand">{copy.reviewAuthorized}</Badge>}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {data.diagnostics.map((d, idx) => (
                <div
                  key={d.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    borderTop: idx > 0 ? '1px solid var(--border-subtle)' : 'none',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <MaterialIcon name={d.icon} style={{ color: 'var(--brand-primary)', fontSize: '1.5rem' }} />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.875rem' }}>{d.title}</strong>
                      <small style={{ color: 'var(--text-muted)' }}>
                        {isRtl ? (d.detailAr || d.detail) : d.detail} • {d.reference}
                      </small>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Badge variant="neutral">{isRtl ? (d.statusAr || d.status) : d.status}</Badge>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                      {copy.rangeMarker}: <strong>{d.marker}</strong>
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="visibility"
                      onClick={() => setNotice(copy.demoNotice)}
                    >
                      {copy.reviewSummary}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Right Aside: Medications & AI Companion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Medications Card */}
          <Panel variant="elevated">
            <PanelHeader
              title={copy.medicationsTitle}
              icon="medication"
              actions={<Badge variant="success" dot>{copy.activeStatus}</Badge>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              {data.medications.map((m) => (
                <div
                  key={m.id}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface-subtle)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <strong style={{ fontSize: '0.875rem' }}>{isRtl ? m.arabicName : m.name}</strong>
                    <small style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>{m.refills}</small>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isRtl ? 'وصفة علاجية معتمدة' : 'Verified Clinical Prescription'}</span>
                  <div style={{ display: 'flex', gap: '0.35rem', margin: '0.35rem 0', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-subtle)' }}>
                      💊 {isRtl ? 'قرص فموي' : 'Oral'}
                    </span>
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-subtle)' }}>
                      🍽️ {isRtl ? 'بعد الأكل' : 'After meal'}
                    </span>
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-subtle)' }}>
                      💧 {isRtl ? 'مع ماء' : 'With water'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem', fontSize: '0.78rem' }}>
                    <span>{copy.dosage}: <strong>{m.dosage}</strong></span>
                    <span>{copy.frequency}: <strong>{m.frequency}</strong></span>
                  </div>
                  <small style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.72rem', marginTop: '0.25rem' }}>
                    {copy.prescribedBy}: {m.prescriber}
                  </small>
                </div>
              ))}
              <a
                href="/patient/medications"
                className="ui-btn ui-btn--outline ui-btn--sm"
                style={{ justifyContent: 'center', marginTop: '0.25rem' }}
              >
                <span>{copy.viewMedications}</span>
                <MaterialIcon name={isRtl ? 'arrow_back' : 'arrow_forward'} />
              </a>
            </div>
          </Panel>

          {/* AI Companion Card */}
          <Panel variant="elevated">
            <PanelHeader
              title={copy.companionTitle}
              icon="psychology_alt"
              actions={<Badge variant="brand">{copy.companionStatus}</Badge>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--brand-primary-light)',
                  color: 'var(--brand-primary)',
                  fontSize: '0.78rem',
                  lineHeight: 1.4,
                }}
              >
                <MaterialIcon name="shield_with_heart" style={{ flexShrink: 0 }} />
                <p style={{ margin: 0 }}>
                  <strong>{copy.safetyTitle}:</strong> {copy.safetyDesc}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <a href="/patient/ai" className="ui-btn ui-btn--subtle ui-btn--sm" style={{ justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MaterialIcon name="chat" /> {copy.askCare}
                  </span>
                  <MaterialIcon name={isRtl ? 'chevron_left' : 'chevron_right'} />
                </a>
                <a href="/patient/ai/context" className="ui-btn ui-btn--subtle ui-btn--sm" style={{ justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MaterialIcon name="verified_user" /> {copy.viewContext}
                  </span>
                  <MaterialIcon name={isRtl ? 'chevron_left' : 'chevron_right'} />
                </a>
                <a href="/patient/ai/history" className="ui-btn ui-btn--subtle ui-btn--sm" style={{ justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MaterialIcon name="history" /> {copy.viewHistory}
                  </span>
                  <MaterialIcon name={isRtl ? 'chevron_left' : 'chevron_right'} />
                </a>
              </div>

              <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.25rem' }}>
                <MaterialIcon name="verified_user" style={{ fontSize: '0.95rem' }} />
                {copy.doctorReviewRequired}
              </small>
            </div>
          </Panel>
        </div>
      </div>

      <footer style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
        <MaterialIcon name="privacy_tip" />
        <span>{copy.privacyReview} {data.patientLabel} ({data.patientId}). {copy.privacySynthetic}</span>
      </footer>

      {notice && (
        <div className="auth-alert auth-alert--success" role="status">
          <MaterialIcon name="info" />
          <span>{notice}</span>
        </div>
      )}
    </div>
  );
}
