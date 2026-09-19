import { useState } from 'react';
import { MaterialIcon, PageHeader, StatCard, Panel, PanelHeader, PanelBody, Badge, Button } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { doctorMessages } from '../../i18n/messages';

export function DoctorDashboardPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? doctorMessages.ar.dashboard : doctorMessages.en.dashboard;
  const [notice, setNotice] = useState('');

  const metrics = [
    { label: copy.census, value: '18', detail: copy.censusDetail, icon: 'calendar_today', tone: 'brand' as const, note: copy.censusNote },
    { label: copy.emrAttestation, value: '2', detail: copy.pendingSignature, icon: 'draw', tone: 'warning' as const, note: copy.counterSignNote },
    { label: copy.criticalFlag, value: '1', detail: copy.criticalDetail, icon: 'warning', tone: 'error' as const, note: copy.criticalNote },
    { label: copy.clinicalPace, value: '14.2', detail: copy.paceDetail, icon: 'timer', tone: 'brand' as const, note: copy.paceNote },
  ] as const;

  return (
    <div className="aegis-page doctor-dashboard">
      <PageHeader
        kicker={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>{copy.dept}</span>
            <span>•</span>
            <Badge variant="success" dot size="sm">
              {copy.roomStatus}
            </Badge>
          </div>
        }
        title={copy.heading}
        subtitle={
          <span>
            {copy.welcome},{' '}
            <strong style={{ color: 'var(--text-main)' }}>
              {isRtl ? 'د. [اسم الطبيب المعالج]' : 'Dr. [Doctor Name]'}
            </strong>{' '}
            • {copy.morningShift} • {isRtl ? '[اسم العيادة]' : '[Clinic Name]'}
          </span>
        }
        actions={
          <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              icon="add_circle"
              onClick={() =>
                setNotice(
                  isRtl
                    ? 'تجربة فقط: حجز الكشف الطارئ غير متصل في هذا العرض.'
                    : 'Demo only: urgent walk-in intake was not connected in this frontend-only build.'
                )
              }
            >
              {copy.urgentWalkIn}
            </Button>
            <Button
              variant="secondary"
              icon="mic"
              onClick={() =>
                setNotice(
                  isRtl
                    ? 'تجربة فقط: التسجيل الصوتي غير متصل.'
                    : 'Demo only: scribe capture is not connected. No audio recording started.'
                )
              }
            >
              {copy.startScribe}
            </Button>
            <Button
              variant="outline"
              icon="biotech"
              onClick={() =>
                setNotice(
                  isRtl
                    ? 'تجربة فقط: تم عرض قائمة التحاليل محلياً.'
                    : 'Demo only: lab review queue was displayed locally; no records were opened.'
                )
              }
            >
              {copy.labsToReview} <Badge variant="brand" size="sm" style={{ marginInlineStart: '0.35rem' }}>3</Badge>
            </Button>
          </div>
        }
      />

      {notice && (
        <div
          role="status"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--brand-primary-light)',
            color: 'var(--brand-primary)',
            fontSize: '0.875rem',
            fontWeight: 500,
            border: '1px solid var(--border-default)',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MaterialIcon name="info" />
            <span>{notice}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotice('')}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'inherit',
              display: 'flex',
            }}
            aria-label="Close notification"
          >
            <MaterialIcon name="close" />
          </button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
        aria-label="Clinical shift metrics"
      >
        {metrics.map((metric) => (
          <StatCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            delta={
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                {metric.detail}
              </span>
            }
            icon={metric.icon}
          />
        ))}
      </section>

      {/* Clinical Workspace & Queue Grid */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* In-Room Patient Panel */}
        <Panel variant="elevated" style={{ borderTop: '3px solid var(--brand-primary)' }}>
          <PanelHeader
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    animation: 'pulse 2s infinite',
                  }}
                />
                <span>{copy.inRoomTitle}</span>
              </div>
            }
            actions={<Badge variant="success" size="sm">Active Encounter</Badge>}
          />
          <PanelBody>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2
                style={{
                  fontSize: '1.375rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  margin: '0 0 0.25rem 0',
                }}
              >
                {isRtl ? 'محمود السيد' : 'Mahmoud El-Sayed'}
              </h2>
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--text-tertiary)',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <MaterialIcon name="badge" style={{ fontSize: '1rem' }} />
                <span>{copy.patientMrn}</span>
              </p>
            </div>

            {/* Vitals Telemetry Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                padding: '0.875rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-subtle)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  148/92
                </div>
                <small style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                  {copy.bp}
                </small>
              </div>
              <div style={{ textAlign: 'center', borderInline: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  78
                </div>
                <small style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                  {copy.hr}
                </small>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  64
                </div>
                <small style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                  {copy.egfr}
                </small>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem' }}>
              <Button
                variant="primary"
                size="sm"
                icon="clinical_notes"
                onClick={() => {
                  window.location.href = '/doctor/patients/PT-DEMO-01';
                }}
              >
                {isRtl ? 'فتح ملف المريض' : 'Open Patient Chart'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon="mic"
                onClick={() => {
                  window.location.href = '/doctor/voice-sessions/new';
                }}
              >
                {copy.startScribe}
              </Button>
            </div>
          </PanelBody>
        </Panel>

        {/* Waiting Room Queue Panel */}
        <Panel variant="elevated">
          <PanelHeader
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MaterialIcon name="groups" style={{ color: 'var(--brand-primary)' }} />
                <span>{copy.waitingRoom}</span>
              </div>
            }
            actions={<Badge variant="neutral" size="sm">{copy.queueKicker}</Badge>}
          />
          <PanelBody>
            <div style={{ marginBottom: '1.25rem' }}>
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text-main)',
                  lineHeight: 1,
                  marginBottom: '0.35rem',
                }}
              >
                {copy.queueCount}
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
                {isRtl
                  ? 'المرضى في الانتظار المباشر لعيادة اليوم'
                  : 'Patients currently checked in and triaged for today’s clinic.'}
              </p>
            </div>

            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-subtle)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
              }}
            >
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {isRtl ? 'متوسط زمن الانتظار' : 'Average wait time'}: <strong>12 min</strong>
              </span>
              <Badge variant="brand" size="sm">On Schedule</Badge>
            </div>

            <Button
              variant="outline"
              icon={isRtl ? 'arrow_back' : 'arrow_forward'}
              onClick={() =>
                setNotice(
                  isRtl
                    ? 'تجربة فقط: توزيع الطابور غير متصل.'
                    : 'Demo only: queue dispatch was not connected in this frontend-only build.'
                )
              }
              style={{ width: '100%' }}
            >
              {copy.openQueue}
            </Button>
          </PanelBody>
        </Panel>
      </section>
    </div>
  );
}
