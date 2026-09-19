import { useState } from 'react';
import { MaterialIcon, Panel, PanelHeader, PanelBody, Badge, Button, Input, EmptyState } from '../../components/ui';
import { PatientWorkspaceShell } from './PatientWorkspaceShell';
import { doctorPatientNotes, type PatientNoteCategory } from './fixtures';
import { useTheme } from '../../theme/ThemeProvider';
import { doctorMessages } from '../../i18n/messages';

export function DoctorPatientNotesPage({ patientId }: { patientId: string }) {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? doctorMessages.ar.notes : doctorMessages.en.notes;
  const breadcrumb = isRtl ? doctorMessages.ar.workspace.tabs.notes : doctorMessages.en.workspace.tabs.notes;

  const filters: { label: string; value: PatientNoteCategory | 'all' }[] = [
    { label: copy.allFilter, value: 'all' },
    { label: copy.soapFilter, value: 'soap' },
    { label: copy.consultFilter, value: 'consult' },
    { label: copy.dischargeFilter, value: 'discharge' },
  ];

  const [activeFilter, setActiveFilter] = useState<PatientNoteCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(doctorPatientNotes[0]?.id ?? '');
  const [demoNotice, setDemoNotice] = useState('');

  const visibleNotes = doctorPatientNotes.filter((note) => {
    const matchesFilter = activeFilter === 'all' || note.category === activeFilter;
    const searchText = `${note.title} ${note.subtitle} ${note.preview} ${note.author}`.toLowerCase();
    return matchesFilter && searchText.includes(search.toLowerCase());
  });

  const selectedNote =
    doctorPatientNotes.find((note) => note.id === selectedId) ?? visibleNotes[0] ?? doctorPatientNotes[0];

  return (
    <PatientWorkspaceShell patientId={patientId} pathname={window.location.pathname} breadcrumbLabel={breadcrumb}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '360px minmax(0, 1fr)',
          gap: '1.5rem',
          alignItems: 'start',
        }}
        className="doctor-notes-layout"
      >
        {/* Notes Archive Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Panel variant="elevated">
            <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Button
                variant="primary"
                icon="add_circle"
                onClick={() =>
                  setDemoNotice(
                    isRtl
                      ? 'محرر ملاحظات تجريبي فقط.'
                      : 'Demo-only note composer. No clinical data is persisted.'
                  )
                }
              >
                {copy.newNote}
              </Button>

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={copy.searchPlaceholder}
                prefixIcon="search"
                aria-label="Search clinical notes"
              />

              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }} aria-label="note filters">
                {filters.map((filter) => (
                  <Button
                    key={filter.value}
                    variant={activeFilter === filter.value ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter(filter.value)}
                  >
                    {filter.label} (
                    {filter.value === 'all'
                      ? doctorPatientNotes.length
                      : doctorPatientNotes.filter((note) => note.category === filter.value).length}
                    )
                  </Button>
                ))}
              </div>

              {demoNotice && (
                <div
                  role="status"
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--brand-primary-light)',
                    color: 'var(--brand-primary)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  {demoNotice}
                </div>
              )}
            </PanelBody>
          </Panel>

          {/* Notes List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {visibleNotes.map((note) => {
              const isSelected = selectedNote?.id === note.id;
              return (
                <button
                  type="button"
                  key={note.id}
                  onClick={() => setSelectedId(note.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: isRtl ? 'right' : 'left',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'var(--surface-subtle)' : 'var(--surface-card)',
                    border: `1px solid ${isSelected ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                    boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                      {note.date}
                    </span>
                    <Badge variant={note.status === 'Signed & Finalized' ? 'success' : 'brand'} size="sm">
                      {isRtl ? 'موقع ومعتمد' : note.status}
                    </Badge>
                  </div>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                    {note.title}
                  </h3>
                  <p dir="rtl" style={{ fontSize: '0.8125rem', color: 'var(--brand-primary)', margin: 0, fontWeight: 500 }}>
                    {note.subtitle}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {note.preview}
                  </p>
                  <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', fontSize: '0.7rem', color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MaterialIcon name="stethoscope" style={{ fontSize: '0.875rem' }} />
                      {note.author}
                    </span>
                    <Badge variant="neutral" size="sm">{note.typeLabel}</Badge>
                  </footer>
                </button>
              );
            })}

            {visibleNotes.length === 0 && (
              <EmptyState
                icon="search_off"
                title={copy.noMatchingNotes}
                description={copy.tryAnother}
              />
            )}
          </div>
        </div>

        {/* Note Detail Column */}
        {selectedNote && <NoteDetail note={selectedNote} copy={copy} isRtl={isRtl} />}
      </div>
    </PatientWorkspaceShell>
  );
}

function NoteDetail({
  note,
  copy,
  isRtl,
}: {
  note: typeof doctorPatientNotes[number];
  copy: typeof doctorMessages.en.notes | typeof doctorMessages.ar.notes;
  isRtl: boolean;
}) {
  return (
    <Panel variant="elevated">
      <PanelHeader
        title={
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MaterialIcon name="cloud_done" style={{ fontSize: '1rem', color: 'var(--brand-primary)' }} />
                {copy.savedToRecord} • {note.savedAt}
              </span>
              <Badge variant="success" size="sm" icon="verified">
                {copy.signed}
              </Badge>
            </div>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.15rem 0' }}>
              {note.title}
            </h1>
            <p dir="rtl" style={{ fontSize: '0.875rem', color: 'var(--brand-primary)', margin: 0 }}>
              {note.subtitle}
            </p>
          </div>
        }
        actions={
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button variant="outline" size="sm" icon="print" disabled title="Demo-only action: printing is not connected.">
              {copy.printSummary}
            </Button>
            <Button variant="outline" size="sm" icon="lock_clock" disabled title="Demo-only action: file export is not connected.">
              {copy.exportPdf}
            </Button>
            <Button variant="outline" size="sm" icon="post_add" disabled title="Demo-only action: note amendments are not persisted.">
              {copy.amendNote}
            </Button>
          </div>
        }
      />
      <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Encounter Meta Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--surface-subtle)',
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
          }}
        >
          <span><strong>{copy.encounterDate}:</strong> {note.encounterDate}</span>
          <span><strong>{copy.author}:</strong> {note.author}</span>
          <span><strong>{copy.department}:</strong> {note.department}</span>
        </div>

        {/* SOAP Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Subjective */}
          <SoapSection letter="S" title={copy.subjectiveTitle} helper={copy.subjectiveHelper} tone="brand">
            <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.6, margin: '0 0 0.75rem 0' }}>
              {note.subjective}
            </p>
            <div
              dir="rtl"
              style={{
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--brand-primary-light)',
                color: 'var(--brand-primary)',
                fontSize: '0.8125rem',
                fontStyle: 'italic',
                marginBottom: '0.75rem',
              }}
            >
              «{note.subjectiveArabic}»
            </div>
            <ul style={{ margin: 0, paddingInlineStart: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {note.subjectivePoints.map((point) => (
                <li key={`${note.id}-subjective-${point}`}>{point}</li>
              ))}
            </ul>
          </SoapSection>

          {/* Objective */}
          <SoapSection letter="O" title={copy.objectiveTitle} helper={copy.objectiveHelper} tone="info">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-subtle)',
                marginBottom: '1rem',
              }}
            >
              {note.vitals.map((vital) => (
                <div key={`${note.id}-vital-${vital.label}`}>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                    {isRtl && vital.labelAr ? vital.labelAr : vital.label}
                  </span>
                  <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{vital.value}</strong>
                  <small style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {isRtl && vital.detailAr ? vital.detailAr : vital.detail}
                  </small>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.6, margin: 0 }}>
              {note.objective}
            </p>
          </SoapSection>

          {/* Assessment */}
          <SoapSection letter="A" title={copy.assessmentTitle} helper={copy.assessmentHelper} tone="warning">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {note.assessment.map((item, index) => (
                <div
                  key={`${note.id}-assessment-${item.title}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface-subtle)',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--surface-card)',
                        border: '1px solid var(--border-default)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--text-main)',
                      }}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                        {item.title}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.detail}</span>
                    </div>
                  </div>
                  <Badge variant="brand" size="sm">{item.status}</Badge>
                </div>
              ))}
            </div>
          </SoapSection>

          {/* Plan */}
          <SoapSection letter="P" title={copy.planTitle} helper={copy.planHelper} tone="success">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {note.plan.map((item) => (
                <div
                  key={`${note.id}-plan-${item.title}`}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                  }}
                >
                  <strong style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>{item.title}</strong>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{item.detail}</span>
                  <small dir="rtl" style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 500 }}>
                    {item.arabic}
                  </small>
                </div>
              ))}
            </div>
          </SoapSection>
        </div>

        {/* Verification Footer */}
        <footer
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--surface-subtle)',
            border: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MaterialIcon name="verified" style={{ fontSize: '1.5rem', color: 'var(--brand-primary)' }} />
            <div>
              <strong style={{ fontSize: '0.875rem', color: 'var(--text-main)', display: 'block' }}>
                {copy.verifiedHeader}
              </strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{copy.verifiedDesc}</span>
            </div>
          </div>
          <div style={{ textAlign: isRtl ? 'left' : 'right', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            <span>Status: <strong style={{ color: 'var(--text-main)' }}>{copy.signed}</strong></span>
            <small style={{ display: 'block' }}>{copy.recordLocked}</small>
          </div>
        </footer>
      </PanelBody>
    </Panel>
  );
}

function SoapSection({
  letter,
  title,
  helper,
  tone,
  children,
}: {
  letter: string;
  title: string;
  helper: string;
  tone: 'brand' | 'info' | 'warning' | 'success';
  children: React.ReactNode;
}) {
  const getToneColor = () => {
    switch (tone) {
      case 'brand':
        return 'var(--brand-primary)';
      case 'info':
        return '#0284c7';
      case 'warning':
        return '#f59e0b';
      case 'success':
        return '#10b981';
    }
  };

  return (
    <section
      style={{
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--surface-card)',
        overflow: 'hidden',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1rem',
          backgroundColor: 'var(--surface-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <b
            style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: getToneColor(),
              color: '#ffffff',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 800,
              fontSize: '0.875rem',
            }}
          >
            {letter}
          </b>
          <div>
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              {title}
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{helper}</span>
          </div>
        </div>
        <MaterialIcon name="expand_less" style={{ color: 'var(--text-tertiary)' }} />
      </header>
      <div style={{ padding: '1.25rem' }}>{children}</div>
    </section>
  );
}
