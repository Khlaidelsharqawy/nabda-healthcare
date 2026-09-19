import { useMemo, useState } from 'react';
import { MaterialIcon, PageHeader, Button, Badge, Panel, PanelHeader, StatCard, Input, Select } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { assistantMessages } from '../../i18n/messages';
import { assistantAppointments } from './fixtures';

const statuses = ['all', 'scheduled', 'checked-in', 'in-room', 'completed', 'no-show'] as const;
const doctors = ['all', 'Dr. Tarek El-Kabbani', 'Dr. Mira Haddad', 'Dr. Salim Nasser', 'Dr. Lina Zayed'] as const;

export function AssistantAppointmentsPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = assistantMessages[isRtl ? 'ar' : 'en'].appointments;

  const [query, setQuery] = useState('');
  const [doctorFilter, setDoctorFilter] = useState<(typeof doctors)[number]>('all');
  const [statusFilter, setStatusFilter] = useState<(typeof statuses)[number]>('all');
  const [notice, setNotice] = useState('');

  const filtered = useMemo(() => {
    return assistantAppointments.filter((appointment) => {
      const matchesQuery = `${appointment.patient} ${appointment.clinician} ${appointment.type} ${appointment.id}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesDoctor = doctorFilter === 'all' || appointment.clinician === doctorFilter;
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      return matchesQuery && matchesDoctor && matchesStatus;
    });
  }, [doctorFilter, query, statusFilter]);

  const kpis = [
    { label: copy.todaysBookings, value: '42', tone: 'accent' as const, icon: 'event_available', badge: copy.loadBadge },
    { label: copy.checkedInWaiting, value: '9', tone: 'warning' as const, icon: 'how_to_reg', badge: copy.avgWaitBadge },
    { label: copy.inConsultations, value: '6', tone: 'accent' as const, icon: 'meeting_room', badge: copy.activeBadge },
    { label: copy.completed, value: '24', tone: 'success' as const, icon: 'task_alt', badge: copy.doneBadge },
    { label: copy.cancelledRescheduled, value: '3', tone: 'error' as const, icon: 'event_busy', badge: '7.1%' },
  ];

  const rooms = [
    { room: 'Room 01 - Cardiology', doctor: 'Dr. Tamer Mansour', status: isRtl ? 'مشغولة' : 'Occupied', state: 'occupied', patient: 'F. Al-Husseini', wait: '18 mins' },
    { room: 'Room 02 - Internal Med', doctor: 'Dr. Reem El-Sayed', status: isRtl ? 'مشغولة' : 'Occupied', state: 'occupied', patient: 'K. Qasemi', wait: '08 mins' },
    { room: 'Room 03 - Cardiology II', doctor: 'Dr. Hazem Abdel-Rahman', status: isRtl ? 'نداء للمريض التالي' : 'Calling Next', state: 'call', patient: 'S. Mahmoud', wait: isRtl ? 'جاهز للاستقبال' : 'Ready for Intake' },
    { room: 'Room 04 - Minor Proc', doctor: 'Dr. Amira Zahran', status: isRtl ? 'غير متاحة' : 'Unavailable', state: 'warning', patient: isRtl ? 'جاري التعقيم والتجهيز' : 'Sanitization in Progress', wait: '12m left' },
  ];

  const visitBadges = [
    copy.catAll,
    copy.catConsultation,
    copy.catFollowup,
    copy.catProcedure,
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return copy.statusScheduled;
      case 'checked-in': return copy.statusCheckedIn;
      case 'in-room': return copy.statusInRoom;
      case 'completed': return copy.statusCompleted;
      case 'no-show': return copy.statusNoShow;
      default: return status.replace('-', ' ');
    }
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'brand' | 'error' | 'neutral' => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-room': return 'brand';
      case 'checked-in': return 'warning';
      case 'no-show': return 'error';
      default: return 'neutral';
    }
  };

  return (
    <div className="assistant-page assistant-appointments" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        kicker={`${copy.receptionOps} • ${copy.appointmentsMgmt}`}
        title={copy.title}
        subtitle={copy.subtitle}
        actions={
          <>
            <Button
              variant="outline"
              size="md"
              icon="calendar_view_day"
              onClick={() => setNotice('Demo only: calendar view is local presentation. No scheduling system is connected.')}
            >
              {copy.calendarView}
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon="download"
              onClick={() => setNotice('Demo only: export is a frontend preview only. No file was generated.')}
            >
              {copy.exportSchedule}
            </Button>
            <Button
              variant="primary"
              size="md"
              icon="add_circle"
              onClick={() => setNotice('Demo only: appointment booking is not connected in this frontend-only build.')}
            >
              {copy.bookAppointment}
            </Button>
          </>
        }
      />

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {kpis.map((kpi) => (
          <StatCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.badge}
            icon={kpi.icon}
            variant={kpi.tone}
          />
        ))}
      </section>

      {/* Room Dispatch Matrix */}
      <Panel variant="elevated">
        <PanelHeader
          title={copy.roomDispatchTitle}
          subtitle={copy.roomDispatchSub}
          icon="meeting_room"
          actions={
            <Badge variant="success" dot>
              {copy.syncRealtime}
            </Badge>
          }
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {rooms.map((room) => (
            <div
              key={room.room}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-subtle)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.875rem' }}>{room.room}</strong>
                <Badge variant={room.state === 'occupied' ? 'brand' : room.state === 'call' ? 'success' : 'warning'} dot>
                  {room.status}
                </Badge>
              </div>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{room.doctor}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                <span>{room.wait.startsWith('Ready') || room.wait.includes('جاهز') ? room.wait : `${copy.inConsultPrefix}${room.wait}`}</span>
                <strong style={{ color: 'var(--text-main)' }}>{room.patient}</strong>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Controls & Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 240px' }}>
          <Input
            iconStart="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.searchPlaceholder}
          />
        </div>
        <div style={{ width: '200px' }}>
          <Select
            iconStart="medical_services"
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value as (typeof doctors)[number])}
          >
            <option value="all">{copy.allDoctors}</option>
            {doctors.slice(1).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </Select>
        </div>
        <div style={{ width: '180px' }}>
          <Select
            iconStart="filter_list"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as (typeof statuses)[number])}
          >
            <option value="all">{copy.statusAll}</option>
            <option value="scheduled">{copy.statusScheduled}</option>
            <option value="checked-in">{copy.statusCheckedIn}</option>
            <option value="in-room">{copy.statusInRoom}</option>
            <option value="completed">{copy.statusCompleted}</option>
            <option value="no-show">{copy.statusNoShow}</option>
          </Select>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>{copy.visitCategoryLabel}:</span>
        {visitBadges.map((badge, idx) => (
          <Button
            key={badge}
            variant={idx === 0 ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setNotice('Demo only: visit category filter is local state only.')}
          >
            {badge}
          </Button>
        ))}
      </div>

      {/* Appointment Slate */}
      <Panel variant="elevated" padding="none">
        <div style={{ padding: '1.25rem 1.25rem 0' }}>
          <PanelHeader
            title={copy.slateHeading}
            icon="calendar_month"
            tag={<Badge variant="brand">{copy.dayFlowBadge}</Badge>}
            actions={
              <Button
                variant="secondary"
                size="sm"
                icon="download"
                onClick={() => setNotice('Demo only: export action is not connected in this frontend-only build.')}
              >
                {copy.export}
              </Button>
            }
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filtered.map((appointment, idx) => (
            <div
              key={appointment.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.25rem',
                borderTop: idx > 0 ? '1px solid var(--border-subtle)' : 'none',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ width: '80px' }}>
                <strong style={{ display: 'block', fontSize: '0.9375rem' }}>{appointment.time}</strong>
                <small style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>{appointment.id}</small>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 200px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--brand-primary-light)',
                    color: 'var(--brand-primary)',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                  }}
                >
                  {appointment.patient.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.875rem' }}>{appointment.patient}</strong>
                  <small style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>{appointment.type}</small>
                </div>
              </div>

              <div style={{ flex: '1 1 160px' }}>
                <span style={{ fontSize: '0.875rem' }}>{appointment.clinician}</span>
              </div>

              <Badge variant={getStatusVariant(appointment.status)} dot>
                {getStatusText(appointment.status)}
              </Badge>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  variant="outline"
                  size="sm"
                  icon="check_circle"
                  onClick={() => setNotice(`Demo only: check-in for ${appointment.patient} was not processed.`)}
                >
                  {copy.checkIn}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="edit"
                  onClick={() => setNotice(`Demo only: update for ${appointment.patient} remains local-only.`)}
                >
                  {copy.update}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {notice && (
        <div className="auth-alert auth-alert--success" role="status">
          <MaterialIcon name="info" />
          <span>{notice}</span>
        </div>
      )}
    </div>
  );
}
