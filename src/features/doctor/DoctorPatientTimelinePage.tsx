import { useState } from 'react';
import { MaterialIcon, Panel, PanelHeader, PanelBody, Badge, Button } from '../../components/ui';
import { PatientWorkspaceShell } from './PatientWorkspaceShell';
import { doctorPatientTimeline, type PatientTimelineCategory } from './fixtures';
import { useTheme } from '../../theme/ThemeProvider';
import { doctorMessages } from '../../i18n/messages';

export function DoctorPatientTimelinePage({ patientId }: { patientId: string }) {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? doctorMessages.ar.timeline : doctorMessages.en.timeline;
  const breadcrumb = isRtl ? doctorMessages.ar.workspace.tabs.timeline : doctorMessages.en.workspace.tabs.timeline;

  const filters: { label: string; value: PatientTimelineCategory | 'all' }[] = [
    { label: copy.allEvents, value: 'all' },
    { label: copy.visitEvents, value: 'visit' },
    { label: copy.notesEvents, value: 'notes' },
    { label: copy.rxEvents, value: 'rx' },
    { label: copy.labEvents, value: 'lab' },
    { label: copy.procedureEvents, value: 'procedure' },
  ];

  const [activeFilter, setActiveFilter] = useState<PatientTimelineCategory | 'all'>('all');
  const visibleEvents = doctorPatientTimeline.filter(
    (event) => activeFilter === 'all' || event.category === activeFilter
  );

  return (
    <PatientWorkspaceShell patientId={patientId} pathname={window.location.pathname} breadcrumbLabel={breadcrumb}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Timeline Filter Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 600, marginInlineEnd: '0.5rem' }}>
              <MaterialIcon name="filter_list" />
              <span>{copy.filterTitle}</span>
            </div>
            {filters.map((filter) => (
              <Button
                key={filter.value}
                variant={activeFilter === filter.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label} {filter.value === 'all' ? `(${doctorPatientTimeline.length})` : ''}
              </Button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              {copy.chronologicalRecords}
            </span>
            <span>{copy.activeRecords}</span>
          </div>
        </div>

        {/* Timeline Summary Banner */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--surface-subtle)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <strong style={{ fontSize: '0.875rem', color: 'var(--text-main)', display: 'block', marginBottom: '0.15rem' }}>
              {copy.summaryTitle} • {copy.activeRecords}
            </strong>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
              {copy.summaryDesc}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Badge variant="brand" size="sm">{copy.statusDocumented}</Badge>
            <Badge variant="success" size="sm">{copy.auditVerified}</Badge>
          </div>
        </div>

        {/* Chronological Event Stream */}
        <section
          aria-label="clinical timeline"
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            paddingInlineStart: '2.5rem',
          }}
        >
          {/* Vertical Track Line */}
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              bottom: '1rem',
              insetInlineStart: '1rem',
              width: '2px',
              backgroundColor: 'var(--border-default)',
            }}
          />

          {visibleEvents.map((event) => (
            <article
              key={event.id}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Event Marker Node */}
              <div
                style={{
                  position: 'absolute',
                  insetInlineStart: '-2.5rem',
                  top: '1rem',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--surface-card)',
                  border: `2px solid ${event.tone === 'primary' ? 'var(--brand-primary)' : event.tone === 'secondary' ? '#0284c7' : '#10b981'}`,
                  color: event.tone === 'primary' ? 'var(--brand-primary)' : event.tone === 'secondary' ? '#0284c7' : '#10b981',
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 2,
                }}
              >
                <MaterialIcon name={event.icon} style={{ fontSize: '1rem' }} />
              </div>

              {/* Event Card */}
              <Panel variant="elevated">
                <PanelHeader
                  title={
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                        {event.typeLabel}
                      </span>
                      <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', margin: '0.15rem 0 0 0' }}>
                        {event.title}
                      </h2>
                    </div>
                  }
                  actions={
                    <time style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                      {event.date}
                    </time>
                  }
                />
                <PanelBody>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                    {event.description}
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--surface-subtle)',
                      marginBottom: '1rem',
                    }}
                  >
                    {event.details.map((detail) => (
                      <div key={detail.label}>
                        <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                          {detail.label}
                        </span>
                        <strong style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
                          {detail.value}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '0.75rem',
                      fontSize: '0.8125rem',
                      color: 'var(--text-muted)',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MaterialIcon name="verified" style={{ fontSize: '1rem', color: 'var(--brand-primary)' }} />
                      {copy.attendingPrefix} <strong style={{ color: 'var(--text-main)' }}>{event.attending}</strong>
                    </span>
                    <Button variant="ghost" size="sm" icon="keyboard_arrow_down" disabled title="Demo-only action: record expansion is not connected.">
                      {copy.viewRecord}
                    </Button>
                  </div>
                </PanelBody>
              </Panel>
            </article>
          ))}
        </section>
      </div>
    </PatientWorkspaceShell>
  );
}
