import { useMemo, useState } from 'react';
import { MaterialIcon, PageHeader, Button, Badge, Panel, PanelHeader, StatCard, TableWrapper, Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { patientMessages } from '../../i18n/messages';
import { patientLabsFixture as data, type PatientLabResult } from './fixtures';

export function PatientLabsPage() {
  const [category, setCategory] = useState<'all' | PatientLabResult['category']>('all');
  const [notice, setNotice] = useState('');
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? patientMessages.ar.labs : patientMessages.en.labs;

  const visibleResults = useMemo(
    () => data.results.filter((result) => category === 'all' || result.category === category),
    [category]
  );
  const showLocalNotice = (message: string) => setNotice(`Demo only: ${message} No server update was made.`);

  return (
    <div className="patient-page patient-labs" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
          <Badge variant="brand" icon="biotech">{copy.portal}</Badge>
          <span>•</span>
          <strong style={{ color: 'var(--text-main)' }}>{copy.title}</strong>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-success-text)' }}>
          <MaterialIcon name="verified_user" /> {copy.scope}
        </span>
      </div>

      <PageHeader
        kicker={copy.eyebrow}
        title={copy.heading}
        subtitle={copy.description}
        actions={
          <Badge variant="brand" icon="verified_user">
            {data.patientLabel} • {copy.patientId}: {data.patientId}
          </Badge>
        }
      />

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <StatCard
          label={copy.recordedReports}
          value={data.reportCount}
          delta={copy.syntheticRecord}
          icon="lab_research"
          variant="accent"
        />
        <StatCard
          label={copy.latestReport}
          value={data.latestReportDate}
          delta={data.laboratoryName}
          icon="calendar_today"
          variant="default"
        />
        <StatCard
          label={copy.statusLabels}
          value={copy.statusLabels}
          delta={copy.noInterpretation}
          icon="visibility"
          variant="default"
        />
        <StatCard
          label={copy.reviewContext}
          value="[Date]"
          delta={copy.clinicianReview}
          icon="event_repeat"
          variant="default"
        />
      </section>

      {/* Main Layout */}
      <div className="patient-two-column-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Latest Panel Table */}
          <Panel variant="elevated" padding="none">
            <div style={{ padding: '1.25rem 1.25rem 0' }}>
              <PanelHeader
                title={data.panelName}
                subtitle={`${data.panelDetail} • ${copy.reportDate}: ${data.latestReportDate}`}
                icon="biotech"
                actions={<Badge variant="success" dot>{data.panelStatus}</Badge>}
              />
            </div>

            <TableWrapper>
              <Table hover>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>{copy.test}</TableHeaderCell>
                    <TableHeaderCell>{copy.recordedResult}</TableHeaderCell>
                    <TableHeaderCell>{copy.referenceRange}</TableHeaderCell>
                    <TableHeaderCell>{copy.visualMarker}</TableHeaderCell>
                    <TableHeaderCell textAlign="end">{copy.status}</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>
                        <strong>{result.name}</strong>
                        <small style={{ display: 'block', color: 'var(--text-tertiary)' }}>{result.detail}</small>
                      </TableCell>
                      <TableCell>
                        <strong style={{ fontSize: '1rem' }}>{result.value}</strong>
                        <small style={{ display: 'block', color: 'var(--text-tertiary)' }}>{result.valueLabel}</small>
                      </TableCell>
                      <TableCell>{result.referenceRange}</TableCell>
                      <TableCell>
                        <div style={{ width: '120px' }}>
                          <div style={{ height: '6px', borderRadius: '3px', backgroundColor: 'var(--surface-subtle)', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${result.marker}%`,
                                height: '100%',
                                backgroundColor: result.statusTone === 'recorded' ? 'var(--color-success-text)' : 'var(--color-warning-text)',
                              }}
                            />
                          </div>
                          <small style={{ color: 'var(--text-tertiary)', fontSize: '0.68rem', display: 'block', marginTop: '0.2rem' }}>
                            {result.markerLabel}
                          </small>
                        </div>
                      </TableCell>
                      <TableCell textAlign="end">
                        <Badge variant={result.statusTone === 'recorded' ? 'success' : 'neutral'} dot>
                          {result.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableWrapper>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                <MaterialIcon name="lock" /> {copy.noExternalDoc}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="outline" size="sm" icon="send" onClick={() => showLocalNotice('report sharing was displayed locally.')}>
                  {copy.shareLocally}
                </Button>
                <Button variant="secondary" size="sm" icon="download" onClick={() => showLocalNotice('report download was displayed locally.')}>
                  {copy.downloadOption}
                </Button>
              </div>
            </div>
          </Panel>

          {/* Archive Grid */}
          <Panel variant="elevated">
            <PanelHeader
              title={copy.archiveHeading}
              subtitle={copy.archiveSubtitle}
              icon="history"
              tag={<Badge variant="neutral">{copy.archiveTag}</Badge>}
              actions={
                <Button variant="ghost" size="sm" icon="history" onClick={() => showLocalNotice('the archive filter was reset.')}>
                  {copy.allRecords}
                </Button>
              }
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {data.archive.map((item) => (
                <div
                  key={item.id}
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
                    <Badge variant="neutral">{item.status}</Badge>
                    <small style={{ color: 'var(--text-tertiary)' }}>{item.date}</small>
                  </div>
                  <h4 style={{ margin: '0.2rem 0 0', fontSize: '0.9375rem' }}>{item.name}</h4>
                  <small style={{ color: 'var(--text-muted)' }}>{item.detail}</small>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{item.archiveLabel}</span>
                    <strong style={{ fontSize: '1rem', color: 'var(--brand-primary)' }}>{item.value}</strong>
                  </div>
                  <Button variant="ghost" size="sm" icon="visibility" fullWidth onClick={() => showLocalNotice('the report preview opened locally.')}>
                    {copy.preview}
                  </Button>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Right Aside */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Panel variant="elevated">
            <PanelHeader
              title={copy.understandingTitle}
              subtitle={copy.boundedScope}
              icon="info"
            />
            <p style={{ margin: '0.5rem 0 1rem', fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {copy.understandingDesc}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Button variant="outline" size="sm" icon="visibility" fullWidth onClick={() => showLocalNotice('the result details were displayed locally.')}>
                {copy.viewResultDetails}
              </Button>
              <Button variant="outline" size="sm" icon="event_available" fullWidth onClick={() => showLocalNotice('the clinician review note was staged locally.')}>
                {copy.noteForClinician}
              </Button>
            </div>
          </Panel>

          <Panel variant="elevated">
            <PanelHeader
              title={copy.careContextTitle}
              subtitle={data.clinician}
              icon="person"
            />
            <p style={{ margin: '0.5rem 0 1rem', fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {copy.careContextDesc}
            </p>
            <Button variant="primary" size="sm" fullWidth onClick={() => showLocalNotice('the review reminder was recorded locally.')}>
              {copy.recordReminder}
            </Button>
          </Panel>

          <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)', display: 'flex', gap: '0.75rem' }}>
            <MaterialIcon name="fact_check" style={{ color: 'var(--brand-primary)' }} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.875rem' }}>{copy.nextReportTitle}</strong>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-main)' }}>{data.nextReportLabel}</span>
              <small style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.72rem', marginTop: '0.2rem' }}>{copy.prepNotice}</small>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-subtle)' }}>
        <MaterialIcon name="shield" style={{ color: 'var(--brand-primary)' }} />
        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          <strong>{copy.safetyNoticeTitle}:</strong> {copy.safetyNoticeBody}
        </p>
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
