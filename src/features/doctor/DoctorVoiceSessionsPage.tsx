import { useState } from 'react';
import { MaterialIcon, PageHeader, StatCard, Panel, PanelHeader, PanelBody, Badge, Button, Input, EmptyState } from '../../components/ui';
import { doctorVoiceSessions, type VoiceSessionStatus } from './fixtures';
import { useTheme } from '../../theme/ThemeProvider';
import { doctorMessages } from '../../i18n/messages';

export function DoctorVoiceSessionsPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = doctorMessages[isRtl ? 'ar' : 'en'].voiceSessions;

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | VoiceSessionStatus>('all');
  const [notice, setNotice] = useState('');

  const sessions = doctorVoiceSessions.filter((session) => {
    const matchesFilter = filter === 'all' || session.status === filter;
    const haystack = `${session.patientName} ${session.id} ${session.purpose}`.toLowerCase();
    return matchesFilter && haystack.includes(query.toLowerCase());
  });

  return (
    <div className="aegis-page doctor-voice-list-page" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Breadcrumb */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
        }}
      >
        <a href="/doctor/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>
          {copy.crumbWorkspace}
        </a>
        <MaterialIcon name={isRtl ? 'chevron_left' : 'chevron_right'} style={{ fontSize: '1rem', color: 'var(--text-tertiary)' }} />
        <strong style={{ color: 'var(--text-main)' }}>{copy.crumbVoice}</strong>
      </nav>

      <PageHeader
        kicker={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MaterialIcon name="mic" style={{ fontSize: '1rem' }} />
            <span>{copy.eyebrow}</span>
          </div>
        }
        title={copy.heading}
        subtitle={copy.desc}
        actions={
          <Button
            variant="primary"
            icon="add_circle"
            onClick={() => {
              window.location.href = '/doctor/voice-sessions/new';
            }}
          >
            {copy.recordEncounter}
          </Button>
        }
      />

      {/* Telemetry Metrics Grid */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        <StatCard
          label={copy.recordedToday}
          value="14"
          delta={<span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{isRtl ? 'مقابلات سريرية' : 'synthetic encounters'}</span>}
          icon="hearing"
        />
        <StatCard
          label={copy.awaitingAttestation}
          value="3"
          delta={<span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{isRtl ? 'مسودات ملاحظات' : 'draft notes'}</span>}
          icon="pending_actions"
        />
        <StatCard
          label={copy.signedSynced}
          value="11"
          delta={<span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{isRtl ? 'ملفات تجريبية' : 'demo files'}</span>}
          icon="cloud_done"
        />
        <StatCard
          label={copy.audioSafety}
          value="LOCAL"
          delta={<span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{isRtl ? 'لا يتم الاحتفاظ بأي تسجيل' : 'zero retention'}</span>}
          icon="shield"
        />
      </section>

      {/* Sessions Records Panel */}
      <Panel variant="elevated">
        <PanelHeader
          title={
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.15rem 0' }}>
                {copy.recordsTitle}
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                {copy.recordsDesc}
              </p>
            </div>
          }
          actions={
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{ width: '220px' }}>
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={copy.searchPlaceholder}
                  prefixIcon="search"
                />
              </div>
              <select
                aria-label="Filter voice sessions"
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | VoiceSessionStatus)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--surface-card)',
                  border: '1px solid var(--border-default)',
                  fontSize: '0.8125rem',
                  color: 'var(--text-main)',
                  outline: 'none',
                }}
              >
                <option value="all">{copy.allSessions}</option>
                <option value="pending">{copy.pending}</option>
                <option value="active">{copy.activeSession}</option>
                <option value="signed">{copy.signedEmr}</option>
              </select>
            </div>
          }
        />
        <PanelBody style={{ padding: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {sessions.map((session) => (
              <article
                key={session.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: session.status === 'active' ? 'var(--brand-primary-light)' : 'var(--surface-subtle)',
                      color: session.status === 'active' ? 'var(--brand-primary)' : 'var(--text-tertiary)',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <MaterialIcon name={session.status === 'active' ? 'mic' : 'history'} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.15rem' }}>
                      {session.patientName}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {session.patientId} • {session.purpose}
                    </span>
                    <small style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                      {session.date} • {session.duration} • {session.id}
                    </small>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <StatusBadge status={session.status} isRtl={isRtl} />
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon="visibility"
                      onClick={() => {
                        window.location.href = `/doctor/voice-sessions/${session.id}`;
                      }}
                      aria-label={`Open active session ${session.id}`}
                    >
                      {copy.view}
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon="edit_note"
                      onClick={() => {
                        window.location.href = `/doctor/voice-sessions/${session.id}/review`;
                      }}
                      aria-label={`Review session ${session.id}`}
                    >
                      {copy.review}
                    </Button>
                  </div>
                </div>
              </article>
            ))}

            {sessions.length === 0 && (
              <EmptyState
                icon="hearing_disabled"
                title={copy.noSessions}
                description={isRtl ? 'لا توجد جلسات تطابق معايير البحث.' : 'No sessions match your search criteria.'}
              />
            )}
          </div>
        </PanelBody>
      </Panel>

      {notice && (
        <div
          role="status"
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--surface-subtle)',
            border: '1px solid var(--border-default)',
            fontSize: '0.8125rem',
            color: 'var(--text-main)',
          }}
        >
          {notice}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status, isRtl }: { status: VoiceSessionStatus; isRtl: boolean }) {
  const getBadgeProps = () => {
    switch (status) {
      case 'active':
        return { variant: 'brand' as const, label: isRtl ? 'جلسة نشطة' : 'Active Session' };
      case 'pending':
        return { variant: 'warning' as const, label: isRtl ? 'بانتظار الاعتماد' : 'Pending Attestation' };
      case 'signed':
        return { variant: 'success' as const, label: isRtl ? 'موثق بالسجل' : 'Signed EMR' };
    }
  };

  const props = getBadgeProps();
  return <Badge variant={props.variant} size="sm">{props.label}</Badge>;
}
