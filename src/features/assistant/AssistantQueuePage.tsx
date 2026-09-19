import { useMemo, useState } from 'react';
import { MaterialIcon, PageHeader, Button, Badge, Panel, PanelHeader, StatCard, Input, EmptyState } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { assistantMessages } from '../../i18n/messages';
import { assistantQueue } from './fixtures';

const filters = ['all', 'ready', 'waiting', 'priority'] as const;

export function AssistantQueuePage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = assistantMessages[isRtl ? 'ar' : 'en'].queue;

  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<(typeof filters)[number]>('all');
  const [notice, setNotice] = useState('');

  const statusLabel = {
    ready: copy.filterReady,
    waiting: copy.filterWaiting,
    priority: copy.filterPriority,
  } as const;

  const filteredQueue = useMemo(
    () =>
      assistantQueue.filter((entry) => {
        const matchesQuery = `${entry.name} ${entry.room} ${entry.id}`.toLowerCase().includes(query.trim().toLowerCase());
        const matchesFilter = selectedFilter === 'all' || entry.priority.toLowerCase() === selectedFilter.toLowerCase();
        return matchesQuery && matchesFilter;
      }),
    [query, selectedFilter],
  );

  const roomStatus = [
    {
      clinician: 'Dr. Tarek El-Kabbani',
      room: 'Room 01',
      status: isRtl ? 'مشغولة' : 'Occupied',
      tone: 'occupied',
      patient: 'Mahmoud Sayed Abdul Hadi',
      detail: isRtl ? 'كشف معتاد • بدأ 11:15 ص' : 'Standard consultation • started 11:15 AM',
      action: isRtl ? 'استدعاء التالي' : 'Call next',
    },
    {
      clinician: 'Dr. Mena Al-Shazly',
      room: 'Room 02',
      status: isRtl ? 'جاهزة' : 'Ready',
      tone: 'ready',
      patient: isRtl ? 'بانتظار التعيين' : 'Awaiting assignment',
      detail: isRtl ? 'الغرفة معقمة ومجهزة للاستقبال' : 'Room sanitized and prepared for intake',
      action: isRtl ? 'إدخال المريض' : 'Send patient',
    },
  ];

  const keyMetrics = [
    { label: copy.waitingInLounge, value: '6', unit: copy.registeredUnit, icon: 'airline_seat_recline_normal', tone: 'warning' as const },
    { label: copy.inExamRooms, value: '2', unit: copy.cliniciansActiveUnit, icon: 'medical_services', tone: 'accent' as const },
    { label: copy.completedToday, value: '14', unit: copy.departedUnit, icon: 'task_alt', tone: 'success' as const },
    { label: copy.priorityTriage, value: '1', unit: copy.walkInUnit, icon: 'emergency', tone: 'error' as const },
  ];

  return (
    <div className="assistant-page assistant-queue" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
          <Badge variant="brand" icon="sensors">{copy.scopeClinicFlow}</Badge>
          <span>•</span>
          <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <MaterialIcon name="groups" /> {copy.scopeReceptionOps}
          </span>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-success-text)' }}>
          <MaterialIcon name="verified" /> {copy.scopeDispatcher}
        </span>
      </div>

      <PageHeader
        kicker={`${copy.kicker} • ${copy.kickerSub}`}
        title={copy.title}
        subtitle={copy.subtitle}
      />

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {keyMetrics.map((metric) => (
          <StatCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            delta={metric.unit}
            icon={metric.icon}
            variant={metric.tone}
          />
        ))}
      </section>

      <div className="assistant-two-column-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Room Flow Matrix */}
          <Panel variant="elevated">
            <PanelHeader
              title={copy.flowMatrixHeading}
              icon="door_front"
              tag={<Badge variant="brand">{copy.roomDispatchBadge}</Badge>}
              actions={<Badge variant="success" dot>{copy.liveUpdates}</Badge>}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {roomStatus.map((room) => (
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
                    <strong style={{ fontSize: '0.875rem' }}>{room.room}: {room.clinician}</strong>
                    <Badge variant={room.tone === 'occupied' ? 'brand' : 'success'} dot>{room.status}</Badge>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{room.detail}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                    <small style={{ color: 'var(--text-tertiary)' }}>{room.patient}</small>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNotice(`Demo only: ${room.action.toLowerCase()} was not executed.`)}
                    >
                      {room.action}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Lobby Queue List */}
          <Panel variant="elevated" padding="none">
            <div style={{ padding: '1.25rem 1.25rem 0' }}>
              <PanelHeader
                title={copy.lobbyQueueHeading}
                icon="queue"
                tag={<Badge variant="brand">{copy.waitingListBadge}</Badge>}
              />
            </div>

            <div style={{ padding: '0 1.25rem 1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: '1 1 200px' }}>
                <Input
                  iconStart="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={copy.searchPlaceholder}
                  inputSize="sm"
                />
              </div>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {filters.map((filter) => (
                  <Button
                    key={filter}
                    variant={selectedFilter === filter ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedFilter(filter)}
                  >
                    {filter === 'all' ? copy.filterAll : statusLabel[filter]}
                  </Button>
                ))}
              </div>
            </div>

            {filteredQueue.length === 0 ? (
              <div style={{ padding: '2rem' }}>
                <EmptyState
                  icon="person_search"
                  title={copy.noMatchesTitle}
                  description={copy.noMatchesDesc}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {filteredQueue.map((entry, idx) => (
                  <div
                    key={entry.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem 1.25rem',
                      borderTop: idx > 0 ? '1px solid var(--border-subtle)' : 'none',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div
                      style={{
                        padding: '0.4rem 0.6rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--surface-subtle)',
                        border: '1px solid var(--border-subtle)',
                        textAlign: 'center',
                        minWidth: '55px',
                      }}
                    >
                      <small style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block' }}>{copy.tokenLabel}</small>
                      <strong style={{ fontSize: '0.9375rem', color: 'var(--brand-primary)' }}>{entry.id}</strong>
                    </div>

                    <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                      <strong style={{ display: 'block', fontSize: '0.9375rem' }}>{entry.name}</strong>
                      <small style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>{entry.note}</small>
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.2rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <span><MaterialIcon name="door_front" /> {entry.room}</span>
                        <span><MaterialIcon name="schedule" /> {entry.wait}</span>
                      </div>
                    </div>

                    <Badge
                      variant={
                        entry.priority.toLowerCase() === 'priority'
                          ? 'error'
                          : entry.priority.toLowerCase() === 'ready'
                          ? 'success'
                          : 'warning'
                      }
                      dot
                    >
                      {statusLabel[entry.priority.toLowerCase() as keyof typeof statusLabel]}
                    </Badge>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        icon="notification_important"
                        onClick={() => setNotice(`Demo only: notification for ${entry.name} was not sent.`)}
                      >
                        {copy.notify}
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        icon="chat"
                        onClick={() => setNotice(`Demo only: message for ${entry.name} was not sent.`)}
                      >
                        {copy.message}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>

        {/* Right Aside: Operations Desk */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Panel variant="elevated">
            <PanelHeader
              title={copy.operationsDeskHeading}
              icon="support_agent"
              tag={<Badge variant="brand">{copy.dispatchBoardBadge}</Badge>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-subtle)' }}>
                <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem', textTransform: 'uppercase' }}>{copy.nextCall}</small>
                <strong style={{ display: 'block', fontSize: '0.9375rem', marginTop: '0.15rem' }}>Fatma Sherif</strong>
                <span style={{ fontSize: '0.8125rem', color: 'var(--brand-primary)' }}>{isRtl ? 'غرفة 02 • جاهزة للكشف' : 'Room 02 • Ready for consultation'}</span>
              </div>
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-subtle)' }}>
                <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem', textTransform: 'uppercase' }}>{copy.priorityIntake}</small>
                <strong style={{ display: 'block', fontSize: '0.9375rem', marginTop: '0.15rem' }}>Karim Fouad</strong>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-warning-text)' }}>{isRtl ? 'العلامات الحيوية قيد الانتظار • مكتب الاستقبال' : 'Vitals pending • reception desk'}</span>
              </div>
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-subtle)' }}>
                <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem', textTransform: 'uppercase' }}>{copy.dispatcher}</small>
                <strong style={{ display: 'block', fontSize: '0.9375rem', marginTop: '0.15rem' }}>Mariam Adel</strong>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-success-text)' }}>{isRtl ? 'مكتب العمليات نشط' : 'Operational desk active'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.25rem' }}>
              <Button
                variant="primary"
                size="md"
                fullWidth
                icon="campaign"
                onClick={() => setNotice('Demo only: broadcast call was not sent to any active channel.')}
              >
                {copy.broadcastCall}
              </Button>
              <Button
                variant="outline"
                size="md"
                fullWidth
                icon="directions_walk"
                onClick={() => setNotice('Demo only: room handoff was not processed.')}
              >
                {copy.directToRoom}
              </Button>
              <Button
                variant="ghost"
                size="md"
                fullWidth
                icon="vital_signs"
                onClick={() => setNotice('Demo only: vitals recording remains unavailable in this frontend-only build.')}
              >
                {copy.recordVitals}
              </Button>
            </div>
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
