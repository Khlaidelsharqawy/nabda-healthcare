import { useMemo, useState } from 'react';
import { MaterialIcon, PageHeader, Button, Badge, Panel, PanelHeader, StatCard, Input, EmptyState } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { patientMessages } from '../../i18n/messages';
import { patientAiHistoryFixture as data, type PatientAiHistoryEntry } from './fixtures';

type HistoryFilter = 'all' | PatientAiHistoryEntry['category'];

export function PatientAiHistoryPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<HistoryFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState('');
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? patientMessages.ar.aiHistory : patientMessages.en.aiHistory;

  const visibleEntries = useMemo(
    () =>
      data.entries.filter(
        (entry) =>
          (filter === 'all' || entry.category === filter) &&
          `${entry.title} ${entry.question} ${entry.response}`.toLowerCase().includes(query.toLowerCase())
      ),
    [filter, query]
  );

  const setFilterAndPage = (value: HistoryFilter) => {
    setFilter(value);
    setPage(1);
  };

  return (
    <div className="patient-page patient-ai-history" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
          <Badge variant="brand" icon="history_edu">{copy.portal}</Badge>
          <span>•</span>
          <strong style={{ color: 'var(--text-main)' }}>{copy.title}</strong>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-success-text)' }}>
          <MaterialIcon name="lock" /> {copy.scope}
        </span>
      </div>

      <PageHeader
        kicker={copy.eyebrow}
        title={copy.heading}
        subtitle={copy.description}
        actions={
          <StatCard
            label={copy.archivedSessions}
            value={data.sessionCount}
            delta={copy.localDemoLog}
            icon="history_edu"
            variant="accent"
          />
        }
      />

      {/* Safety Notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--surface-subtle)',
          border: '1px solid var(--border-default)',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MaterialIcon name="shield" style={{ color: 'var(--brand-primary)', fontSize: '1.5rem' }} />
          <div>
            <strong style={{ fontSize: '0.875rem' }}>{copy.boundaryTitle}</strong>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{copy.boundaryDesc}</p>
          </div>
        </div>
        <Badge variant="neutral">{copy.nonDiagnostic}</Badge>
      </div>

      {/* Filters Toolbar */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 240px' }}>
          <Input
            iconStart="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={copy.searchPlaceholder}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {data.categories.map((category) => (
            <Button
              key={category.id}
              variant={filter === category.id ? 'primary' : 'outline'}
              size="sm"
              icon={category.icon}
              onClick={() => setFilterAndPage(category.id as HistoryFilter)}
            >
              {category.id === 'all' ? (isRtl ? 'كافة المواضيع' : 'All topics') : category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Records Section */}
      <Panel variant="elevated" padding="none">
        <div style={{ padding: '1.25rem 1.25rem 0' }}>
          <PanelHeader
            title={copy.archivedRecords}
            actions={
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                  {visibleEntries.length} {copy.visibleEntries}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  icon="file_download"
                  onClick={() => setNotice(copy.exportDemoNotice)}
                >
                  {copy.exportLocally}
                </Button>
              </div>
            }
          />
        </div>

        {visibleEntries.length === 0 ? (
          <div style={{ padding: '2rem' }}>
            <EmptyState
              icon="search_off"
              title={copy.noMatchingRecords}
              description={copy.tryAnotherSearch}
              action={
                <Button variant="outline" size="sm" onClick={() => { setQuery(''); setFilter('all'); }}>
                  {copy.resetFilters}
                </Button>
              }
            />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {visibleEntries.map((entry, idx) => {
              const isExpanded = expandedId === entry.id;
              return (
                <div
                  key={entry.id}
                  style={{
                    padding: '1.25rem',
                    borderTop: idx > 0 ? '1px solid var(--border-subtle)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <time style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>{entry.date}</time>
                      <Badge variant="brand" icon={entry.icon}>{entry.categoryLabel}</Badge>
                      <code style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{entry.reference}</code>
                    </div>
                    <Badge variant="neutral" icon={entry.statusIcon}>{entry.status}</Badge>
                  </div>

                  <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-subtle)' }}>
                    <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                      <MaterialIcon name="account_circle" /> {copy.patientQuery}
                    </small>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-main)' }}>{entry.question}</p>
                  </div>

                  <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--brand-primary-light)', border: '1px solid rgba(8, 116, 67, 0.2)' }}>
                    <small style={{ color: 'var(--brand-primary)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                      <MaterialIcon name="smart_toy" /> {copy.informationalSummary}
                    </small>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.5 }}>{entry.response}</p>
                    {isExpanded && (
                      <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(8, 116, 67, 0.2)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        <MaterialIcon name="info" style={{ color: 'var(--brand-primary)' }} /> {entry.detail}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={isExpanded ? 'expand_less' : 'visibility'}
                      onClick={() => setExpandedId((c) => (c === entry.id ? null : entry.id))}
                    >
                      {isExpanded ? copy.hideDetails : copy.viewDetails}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="ios_share"
                      onClick={() => setNotice(copy.summaryExportNotice)}
                    >
                      {copy.exportNotice}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
            {copy.showingEntriesFor} {data.patientLabel}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Button
              variant="outline"
              size="sm"
              icon={isRtl ? 'chevron_right' : 'chevron_left'}
              aria-label={copy.previousPage}
              disabled={page === 1}
              onClick={() => setPage((c) => Math.max(1, c - 1))}
            />
            <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{page}</span>
            <Button
              variant="outline"
              size="sm"
              icon={isRtl ? 'chevron_left' : 'chevron_right'}
              aria-label={copy.nextPage}
              onClick={() => setPage((c) => c + 1)}
            />
          </div>
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
