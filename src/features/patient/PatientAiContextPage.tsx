import { useState } from 'react';
import { MaterialIcon, PageHeader, Button, Badge, Panel, PanelHeader, TableWrapper, Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { patientMessages } from '../../i18n/messages';
import { patientAiContextFixture as data, type PatientAiContextDomain } from './fixtures';

export function PatientAiContextPage() {
  const [domains, setDomains] = useState(data.domains);
  const [notice, setNotice] = useState('');
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? patientMessages.ar.aiContext : patientMessages.en.aiContext;

  const toggleDomain = (id: string) => {
    setDomains((current) => current.map((domain) => domain.id === id ? { ...domain, enabled: !domain.enabled } : domain));
    setNotice(copy.toggleNotice);
  };

  const saveLocal = () => setNotice(copy.saveNotice);

  return (
    <div className="patient-page patient-ai-context" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
          <Badge variant="brand" icon="verified_user">{copy.portal}</Badge>
          <span>•</span>
          <strong style={{ color: 'var(--text-main)' }}>{copy.title}</strong>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-success-text)' }}>
          <MaterialIcon name="lock" /> {copy.scope}
        </span>
      </div>

      <PageHeader
        title={copy.heading}
        subtitle={copy.description}
        actions={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Badge variant="brand" icon="verified">{copy.patientScoped}</Badge>
            <Badge variant="neutral" icon="lock">{copy.protectedSession}</Badge>
          </div>
        }
      />

      {/* Safety Boundary */}
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
        <Badge variant="neutral">{copy.informationalOnly}</Badge>
      </div>

      {/* Layout */}
      <div className="patient-two-column-layout">
        {/* Context Domains List */}
        <Panel variant="elevated" padding="none">
          <div style={{ padding: '1.25rem 1.25rem 0' }}>
            <PanelHeader
              title={copy.authorizedCategories}
              subtitle={copy.contextDomains}
              icon="rule"
              actions={
                <Badge variant="brand">
                  {copy.localFixtureVisible.replace('{count}', String(domains.filter((d) => d.enabled).length))}
                </Badge>
              }
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem 1.25rem', gap: '1rem' }}>
            {domains.map((domain) => (
              <div
                key={domain.id}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--surface-subtle)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <MaterialIcon name={domain.icon} style={{ color: 'var(--brand-primary)', fontSize: '1.5rem' }} />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.9375rem' }}>{domain.label}</h4>
                      <small style={{ color: 'var(--text-muted)' }}>{domain.source}</small>
                    </div>
                  </div>
                  <Badge variant={domain.enabled ? 'success' : 'neutral'} dot>
                    {domain.enabled ? copy.displayedLocally : copy.hiddenLocally}
                  </Badge>
                </div>

                <div style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-card)', fontSize: '0.8125rem' }}>
                  <small style={{ color: 'var(--text-tertiary)', display: 'block' }}>Presentation record</small>
                  <strong>{domain.record}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span><MaterialIcon name="rule" /> <b>{copy.boundaryLabel}:</b> {domain.boundary}</span>
                  <Button variant="outline" size="sm" onClick={() => toggleDomain(domain.id)}>
                    {domain.enabled ? copy.hideLocally : copy.showLocally}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Right Aside: Controls & Allocation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Panel variant="elevated">
            <PanelHeader
              title={copy.scopeControls}
              subtitle={copy.patientGoverned}
              icon="tune"
              actions={<Badge variant="neutral">{copy.localOnly}</Badge>}
            />
            <p style={{ margin: '0.5rem 0 1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{copy.controlsDesc}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {domains.map((domain) => (
                <label key={domain.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.8125rem' }}>
                  <div>
                    <strong style={{ display: 'block' }}>{domain.shortLabel}</strong>
                    <small style={{ color: 'var(--text-tertiary)' }}>{domain.controlLabel}</small>
                  </div>
                  <input
                    type="checkbox"
                    checked={domain.enabled}
                    onChange={() => toggleDomain(domain.id)}
                    aria-label={`${copy.toggleAria} ${domain.shortLabel}`}
                  />
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.25rem' }}>
              <Button variant="primary" size="md" fullWidth icon="save" onClick={saveLocal}>
                {copy.acknowledgeLocally}
              </Button>
              <a href="/patient/ai" className="ui-btn ui-btn--ghost ui-btn--sm" style={{ justifyContent: 'center' }}>
                <MaterialIcon name="smart_toy" />
                <span>{copy.returnToAssistant}</span>
              </a>
            </div>
          </Panel>

          <Panel variant="elevated">
            <PanelHeader
              title={copy.contextAllocation}
              subtitle={copy.presentationSummary}
              icon="data_usage"
            />
            <div style={{ margin: '0.75rem 0', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--brand-primary)', fontFamily: 'var(--font-display)' }}>
                {data.allocation}
              </span>
              <small style={{ color: 'var(--text-muted)' }}>{copy.displayedCategories}</small>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem' }}>
              {data.domains.map((d) => (
                <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{d.shortLabel}</span>
                  <strong>{d.displayWeight}</strong>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* Events Table */}
      <Panel variant="elevated" padding="none">
        <div style={{ padding: '1.25rem 1.25rem 0' }}>
          <PanelHeader
            title={copy.recentEvents}
            subtitle={copy.presentationLog}
            icon="history"
            actions={
              <Button variant="ghost" size="sm" icon="refresh" onClick={() => setNotice(copy.refreshNotice)}>
                {copy.refreshLocally}
              </Button>
            }
          />
        </div>

        <TableWrapper>
          <Table hover>
            <TableHead>
              <TableRow>
                <TableHeaderCell>{copy.timestamp}</TableHeaderCell>
                <TableHeaderCell>{copy.category}</TableHeaderCell>
                <TableHeaderCell>{copy.sourceLabel}</TableHeaderCell>
                <TableHeaderCell textAlign="end">{copy.status}</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.timestamp}</TableCell>
                  <TableCell>{event.category}</TableCell>
                  <TableCell>{event.source}</TableCell>
                  <TableCell textAlign="end">
                    <Badge variant={event.tone === 'filtered' ? 'warning' : 'success'} dot>
                      {event.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
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
