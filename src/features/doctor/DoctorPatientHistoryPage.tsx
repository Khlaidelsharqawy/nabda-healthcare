import { MaterialIcon, Panel, PanelHeader, PanelBody, Badge, StatCard } from '../../components/ui';
import { PatientWorkspaceShell } from './PatientWorkspaceShell';
import { doctorPatientHistory } from './fixtures';
import { useTheme } from '../../theme/ThemeProvider';
import { doctorMessages } from '../../i18n/messages';

export function DoctorPatientHistoryPage({ patientId }: { patientId: string }) {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? doctorMessages.ar.history : doctorMessages.en.history;
  const breadcrumb = isRtl ? doctorMessages.ar.workspace.tabs.history : doctorMessages.en.workspace.tabs.history;
  const history = doctorPatientHistory;

  return (
    <PatientWorkspaceShell patientId={patientId} pathname={window.location.pathname} breadcrumbLabel={breadcrumb}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Longitudinal History Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.875rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--brand-primary-light)',
            color: 'var(--brand-primary)',
            border: '1px solid var(--border-default)',
          }}
        >
          <MaterialIcon name="info" style={{ fontSize: '1.25rem' }} />
          <div>
            <strong style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700 }}>
              {copy.bannerTitle}
            </strong>
            <span style={{ fontSize: '0.8125rem' }}>{copy.bannerSubtitle}</span>
          </div>
        </div>

        {/* History Summary Telemetry Grid */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
          }}
          aria-label="history summary"
        >
          {history.summary.map((item) => (
            <StatCard
              key={item.label}
              label={isRtl && item.labelAr ? item.labelAr : item.label}
              value={item.value}
              delta={<span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{item.detail}</span>}
              icon={item.icon}
            />
          ))}
        </section>

        {/* History Grid */}
        <div className="doctor-history-grid">
          {/* Main Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Allergies Section */}
            <HistorySection
              title={copy.section1}
              icon="personal_injury"
              tone="error"
              documentedLabel={copy.documented}
            >
              {history.allergies.map((item) => (
                <HistoryItem key={`allergy-${item.title}`} item={item} isRtl={isRtl} />
              ))}
            </HistorySection>

            {/* Chronic Conditions Section */}
            <HistorySection
              title={copy.section2}
              icon="vital_signs"
              tone="primary"
              documentedLabel={copy.documented}
            >
              {history.conditions.map((item) => (
                <HistoryItem key={`condition-${item.title}-${item.detail}-${item.status}`} item={item} isRtl={isRtl} />
              ))}
            </HistorySection>

            {/* Surgical / Procedure History Section */}
            <HistorySection
              title={copy.section3}
              icon="medical_services"
              tone="secondary"
              documentedLabel={copy.documented}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {history.procedures.map((item) => (
                  <HistoryItem key={`procedure-${item.title}`} item={item} isRtl={isRtl} />
                ))}
              </div>
            </HistorySection>
          </div>

          {/* Side Column */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Audit Status Card */}
            <Panel variant="elevated">
              <PanelHeader
                title={<strong style={{ fontSize: '0.875rem' }}>{copy.docCardTitle}</strong>}
                actions={<Badge variant="success" size="sm">{copy.documented}</Badge>}
              />
              <PanelBody>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>
                  {copy.docCardDesc}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Badge variant="brand" size="sm">{copy.activeRecord}</Badge>
                  <Badge variant="neutral" size="sm">{copy.auditVerified}</Badge>
                </div>
              </PanelBody>
            </Panel>

            {/* Family History */}
            <HistorySideSection
              title={copy.section4}
              icon="diversity_1"
              items={history.family}
              isRtl={isRtl}
            />

            {/* Social History */}
            <HistorySideSection
              title={copy.section5}
              icon="psychology"
              items={history.social}
              isRtl={isRtl}
            />

            {/* Clinical Governance Sign-Off */}
            <Panel variant="accent">
              <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MaterialIcon name="verified" style={{ color: 'var(--brand-primary)' }} />
                  <strong style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>{copy.recordStatusTitle}</strong>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  {copy.documentedBy}
                </p>
                <strong style={{ fontSize: '0.875rem', color: 'var(--brand-primary)' }}>
                  {copy.attendingDoctor}
                </strong>
                <small style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{copy.docVerified}</small>
              </PanelBody>
            </Panel>
          </aside>
        </div>
      </div>
    </PatientWorkspaceShell>
  );
}

function HistorySection({
  title,
  icon,
  tone,
  documentedLabel,
  children,
}: {
  title: string;
  icon: string;
  tone: 'primary' | 'secondary' | 'error';
  documentedLabel: string;
  children: React.ReactNode;
}) {
  return (
    <Panel variant="elevated">
      <PanelHeader
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MaterialIcon
              name={icon}
              style={{
                color: tone === 'error' ? 'var(--color-danger-text)' : 'var(--brand-primary)',
              }}
            />
            <span>{title}</span>
          </div>
        }
        actions={<Badge variant={tone === 'error' ? 'error' : 'brand'} size="sm">{documentedLabel}</Badge>}
      />
      <PanelBody style={{ padding: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>{children}</div>
      </PanelBody>
    </Panel>
  );
}

function HistoryItem({
  item,
  isRtl,
}: {
  item: {
    title: string;
    titleAr?: string;
    detail: string;
    detailAr?: string;
    status: string;
    statusAr?: string;
    icon?: string;
  };
  isRtl?: boolean;
}) {
  return (
    <article
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.875rem 1.25rem',
        borderBottom: '1px solid var(--border-subtle)',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <MaterialIcon
          name={item.icon ?? 'check_box'}
          style={{ fontSize: '1.125rem', color: 'var(--text-tertiary)' }}
        />
        <div>
          <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-main)' }}>
            {isRtl && item.titleAr ? item.titleAr : item.title}
          </strong>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0' }}>
            {isRtl && item.detailAr ? item.detailAr : item.detail}
          </p>
        </div>
      </div>
      <Badge variant="neutral" size="sm">
        {isRtl && item.statusAr ? item.statusAr : item.status}
      </Badge>
    </article>
  );
}

function HistorySideSection({
  title,
  icon,
  items,
  isRtl,
}: {
  title: string;
  icon: string;
  items: {
    title: string;
    titleAr?: string;
    detail: string;
    detailAr?: string;
    status: string;
    statusAr?: string;
  }[];
  isRtl?: boolean;
}) {
  return (
    <Panel variant="elevated">
      <PanelHeader
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}>
            <MaterialIcon name={icon} style={{ color: 'var(--brand-primary)' }} />
            <span>{title}</span>
          </div>
        }
      />
      <PanelBody style={{ padding: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {items.map((item) => (
            <div
              key={`${title}-${item.title}`}
              style={{
                padding: '0.75rem 1.25rem',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                <strong style={{ fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                  {isRtl && item.titleAr ? item.titleAr : item.title}
                </strong>
                <Badge variant="neutral" size="sm">
                  {isRtl && item.statusAr ? item.statusAr : item.status}
                </Badge>
              </div>
              <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {isRtl && item.detailAr ? item.detailAr : item.detail}
              </small>
            </div>
          ))}
        </div>
      </PanelBody>
    </Panel>
  );
}
