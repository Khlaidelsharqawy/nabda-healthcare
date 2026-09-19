import { PageHeader, Button, StatCard } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { adminMessages } from '../../i18n/messages';

type UsageMetric = {
  label: string;
  value: string;
  delta: string;
  icon: string;
};

export function AdminClinicUsagePage({ clinicId }: { clinicId: string }) {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = adminMessages[isRtl ? 'ar' : 'en'].clinicUsage;

  const metrics: UsageMetric[] = [
    { label: copy.metrics.activePatients, value: '1,482', delta: '+6.1%', icon: 'personal_injury' },
    { label: copy.metrics.monthlyVisits, value: '4,208', delta: '+3.7%', icon: 'calendar_month' },
    { label: copy.metrics.aiInteractions, value: '1,114', delta: '+14.2%', icon: 'psychology' },
  ];

  return (
    <div className="admin-page__section" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <PageHeader
        kicker={copy.kicker}
        title={`${clinicId} ${copy.usageSuffix}`}
        actions={
          <Button variant="primary" size="md" icon="download" disabled title={copy.exportSummaryTitle}>
            {copy.exportSummary}
          </Button>
        }
      />

      <section className="admin-grid" aria-label={copy.metricsAria}>
        {metrics.map((metric) => (
          <StatCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            delta={`${metric.delta} ${copy.vsPriorPeriod}`}
            trend="up"
            icon={metric.icon}
          />
        ))}
      </section>
    </div>
  );
}
