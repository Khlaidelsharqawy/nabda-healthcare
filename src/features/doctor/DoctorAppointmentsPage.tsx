import { useMemo, useState } from 'react';
import { MaterialIcon, PageHeader, Panel, PanelHeader, PanelBody, Badge, Button } from '../../components/ui';
import { doctorAppointments } from './fixtures';
import { useTheme } from '../../theme/ThemeProvider';
import { doctorMessages } from '../../i18n/messages';

export function DoctorAppointmentsPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? doctorMessages.ar.appointments : doctorMessages.en.appointments;

  const [notice, setNotice] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'today' | 'follow-up'>('all');

  const visibleAppointments = useMemo(() => {
    return doctorAppointments.filter((appointment) => {
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'today') return appointment.status !== 'cancelled';
      return appointment.visitType.toLowerCase().includes('follow');
    });
  }, [selectedFilter]);

  const getStatusVariant = (status: string): 'success' | 'warning' | 'error' | 'brand' | 'neutral' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-room':
        return 'brand';
      case 'waiting':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="aegis-page doctor-appointments">
      <PageHeader
        kicker={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>{copy.dept}</span>
            <span>•</span>
            <span style={{ color: 'var(--text-tertiary)' }}>{copy.clinicRoom}</span>
          </div>
        }
        title={copy.heading}
        subtitle={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-primary)',
              }}
            />
            <span>
              <strong>{isRtl ? 'د. [اسم الطبيب المعالج]' : 'Dr. [Doctor Name]'}</strong> • {copy.specialty}
            </span>
          </div>
        }
        actions={
          <Button
            variant="primary"
            icon="add_circle"
            onClick={() =>
              setNotice(
                isRtl
                  ? 'تجربة فقط: حجز المتابعة غير متصل.'
                  : 'Demo only: direct follow-up booking is not connected in this frontend-only build.'
              )
            }
          >
            {copy.bookFollowUp}
          </Button>
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
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex' }}
            aria-label="Close notification"
          >
            <MaterialIcon name="close" />
          </button>
        </div>
      )}

      {/* Capacity & AI Optimization Grid */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Clinic Load Card */}
        <Panel variant="elevated">
          <PanelHeader
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MaterialIcon name="pace" style={{ color: 'var(--brand-primary)' }} />
                <span>{copy.clinicLoad}</span>
              </div>
            }
            actions={
              <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                <strong style={{ fontSize: '1.125rem', color: 'var(--text-main)' }}>16 / 18</strong>
                <small style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                  {copy.slotsBooked}
                </small>
              </div>
            }
          />
          <PanelBody>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>
              {copy.consultationsCount}
            </p>

            {/* Segmented Progress Bar */}
            <div
              style={{
                height: '8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--surface-muted)',
                overflow: 'hidden',
                display: 'flex',
                gap: '2px',
                marginBottom: '0.75rem',
              }}
            >
              <div style={{ width: '45%', backgroundColor: '#10b981' }} title="Completed" />
              <div style={{ width: '15%', backgroundColor: 'var(--brand-primary)' }} title="In Room" />
              <div style={{ width: '30%', backgroundColor: '#f59e0b' }} title="Waiting" />
              <div style={{ width: '10%', backgroundColor: 'var(--border-default)' }} title="Open" />
            </div>

            {/* Progress Legend */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: 'var(--text-tertiary)',
                marginBottom: '1rem',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                {copy.legendCompleted}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)' }} />
                {copy.legendInRoom}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                {copy.legendWaiting}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--border-default)' }} />
                {copy.legendOpen}
              </span>
            </div>

            {/* Open Slots Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-subtle)',
                fontSize: '0.8125rem',
              }}
            >
              <span style={{ color: 'var(--text-muted)' }}>{copy.openSlots}:</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Badge variant="brand" size="sm">01:15 PM</Badge>
                <Badge variant="brand" size="sm">03:30 PM</Badge>
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                <MaterialIcon name="verified_user" style={{ fontSize: '0.875rem' }} />
                {copy.emergencyBuffer}
              </span>
            </div>
          </PanelBody>
        </Panel>

        {/* AI Schedule Guidance Card */}
        <Panel variant="accent">
          <PanelHeader
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Badge variant="brand" size="sm" icon="lock">
                  {copy.aiTitle}
                </Badge>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  • {copy.aiLive}
                </span>
              </div>
            }
          />
          <PanelBody>
            <h3
              style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                margin: '0 0 0.5rem 0',
              }}
            >
              {copy.aiHeading}
            </h3>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                margin: '0 0 1.25rem 0',
              }}
            >
              {copy.aiBody}
            </p>
            <Button
              variant="outline"
              size="sm"
              icon={isRtl ? 'arrow_back' : 'arrow_forward'}
              onClick={() =>
                setNotice(
                  isRtl
                    ? 'تجربة فقط: تعديل الجدول غير متصل بالعمليات.'
                    : 'Demo only: schedule flow adjustment is local and does not change clinic operations.'
                )
              }
            >
              {copy.adjustSchedule}
            </Button>
          </PanelBody>
        </Panel>
      </section>

      {/* Appointment Table Panel */}
      <Panel variant="elevated">
        <PanelHeader
          title={
            <div>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--brand-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.15rem',
                }}
              >
                {copy.scheduleKicker}
              </span>
              <span>{copy.todayAppointments}</span>
            </div>
          }
          actions={
            <Button
              variant="outline"
              size="sm"
              icon="filter_list"
              onClick={() => setShowFilters((current) => !current)}
              aria-expanded={showFilters}
            >
              {copy.filter}
            </Button>
          }
        />

        {showFilters && (
          <div
            style={{
              padding: '0.75rem 1.25rem',
              backgroundColor: 'var(--surface-subtle)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
            aria-label="Local appointment filters"
          >
            <Button
              variant={selectedFilter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedFilter('all');
                setNotice(isRtl ? 'تمت إعادة ضبط التصفية.' : 'Demo only: local schedule filter reset.');
              }}
            >
              {copy.all}
            </Button>
            <Button
              variant={selectedFilter === 'today' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedFilter('today');
                setNotice(isRtl ? 'تمت التصفية إلى المواعيد النشطة.' : 'Demo only: schedule view filtered to active visits.');
              }}
            >
              {copy.active}
            </Button>
            <Button
              variant={selectedFilter === 'follow-up' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedFilter('follow-up');
                setNotice(isRtl ? 'عرض المتابعة محلي فقط.' : 'Demo only: follow-up view is local only.');
              }}
            >
              {copy.followUp}
            </Button>
          </div>
        )}

        <PanelBody style={{ padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--surface-subtle)', borderBottom: '1px solid var(--border-default)' }}>
                  <th style={{ padding: '0.75rem 1.25rem', textAlign: isRtl ? 'right' : 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    Time
                  </th>
                  <th style={{ padding: '0.75rem 1.25rem', textAlign: isRtl ? 'right' : 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    Patient
                  </th>
                  <th style={{ padding: '0.75rem 1.25rem', textAlign: isRtl ? 'right' : 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    Status
                  </th>
                  <th style={{ padding: '0.75rem 1.25rem', textAlign: isRtl ? 'right' : 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    Location
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleAppointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                      {appointment.time}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                        {appointment.patientName}
                      </strong>
                      <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {appointment.visitType}
                      </small>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <Badge variant={getStatusVariant(appointment.status)} size="sm">
                        {appointment.status.replace('-', ' ')}
                      </Badge>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MaterialIcon name="meeting_room" style={{ fontSize: '1rem', color: 'var(--text-tertiary)' }} />
                        {appointment.room}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PanelBody>
      </Panel>
    </div>
  );
}
