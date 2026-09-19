import { useMemo, useState } from 'react';
import { MaterialIcon, PageHeader, Button, Badge, Panel, PanelHeader, StatCard, Input, Select, EmptyState } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { assistantMessages } from '../../i18n/messages';
import { assistantPatients } from './fixtures';

export function AssistantPatientsPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = assistantMessages[isRtl ? 'ar' : 'en'].patients;
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const statusLabel = {
    ready: copy.statusReady,
    waiting: copy.statusWaiting,
    review: copy.statusReview,
  } as const;

  const statusVariant = {
    ready: 'success' as const,
    waiting: 'warning' as const,
    review: 'brand' as const,
  };

  const filtered = useMemo(
    () =>
      assistantPatients.filter((patient) => {
        const matchesQuery = `${patient.name} ${patient.id} ${patient.room}`.toLowerCase().includes(query.trim().toLowerCase());
        const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
        return matchesQuery && matchesStatus;
      }),
    [query, statusFilter],
  );

  return (
    <div className="assistant-page assistant-patients" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
          <Badge variant="brand" icon="lock">{copy.scopedAccess}</Badge>
          <span>•</span>
          <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <MaterialIcon name="groups" /> {copy.operationalIntake}
          </span>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-success-text)' }}>
          <MaterialIcon name="verified" /> {copy.registrationVerified}
        </span>
      </div>

      <PageHeader
        kicker={`${copy.kicker} • ${copy.kickerSub}`}
        title={copy.title}
        subtitle={copy.subtitle}
      />

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <StatCard
          label={copy.inWaitingRoom}
          value={assistantPatients.filter((p) => p.status === 'waiting').length}
          icon="hourglass_empty"
          variant="warning"
        />
        <StatCard
          label={copy.readyToday}
          value={assistantPatients.filter((p) => p.status === 'ready').length}
          icon="how_to_reg"
          variant="success"
        />
        <StatCard
          label={copy.needsReview}
          value={assistantPatients.filter((p) => p.status === 'review').length}
          icon="assignment_late"
          variant="accent"
        />
      </section>

      <section style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <Input
            iconStart="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.searchPlaceholder}
          />
        </div>
        <div style={{ width: '180px' }}>
          <Select
            iconStart="filter_list"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: copy.allStatuses },
              { value: 'ready', label: copy.statusReady },
              { value: 'waiting', label: copy.statusWaiting },
              { value: 'review', label: copy.statusReview },
            ]}
          />
        </div>
        <Button variant="ghost" size="md" icon="refresh" aria-label={copy.resetAria} onClick={() => { setQuery(''); setStatusFilter('all'); }} />
      </section>

      <Panel variant="elevated" padding="none">
        <div style={{ padding: '1.25rem 1.25rem 0' }}>
          <PanelHeader
            title={copy.rosterHeading}
            icon="groups"
            tag={<Badge variant="brand">{copy.operationsListBadge}</Badge>}
            actions={
              <Button variant="secondary" size="sm" icon="download" disabled title={copy.exportDemoNotice}>
                {copy.exportQueue}
              </Button>
            }
          />
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '2rem' }}>
            <EmptyState
              icon="person_search"
              title={copy.noMatchesTitle}
              description={copy.noMatchesDesc}
            />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map((patient, idx) => (
              <div
                key={patient.id}
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
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--brand-primary-light)',
                    color: 'var(--brand-primary)',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    flexShrink: 0,
                  }}
                >
                  {patient.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)}
                </div>

                <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                  <strong style={{ display: 'block', fontSize: '0.9375rem', color: 'var(--text-main)' }}>{patient.name}</strong>
                  <small style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>
                    {patient.age} {copy.yrs} • {patient.id} • {patient.phone}
                  </small>
                </div>

                <Badge variant={statusVariant[patient.status]} dot>
                  {statusLabel[patient.status]}
                </Badge>

                <div style={{ display: 'flex', flexDirection: 'column', minWidth: '100px' }}>
                  <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem', textTransform: 'uppercase' }}>{copy.visit}</small>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{patient.visitType}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', minWidth: '80px' }}>
                  <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem', textTransform: 'uppercase' }}>{copy.arrival}</small>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{patient.arrival}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', minWidth: '80px' }}>
                  <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem', textTransform: 'uppercase' }}>{copy.room}</small>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{patient.room}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
