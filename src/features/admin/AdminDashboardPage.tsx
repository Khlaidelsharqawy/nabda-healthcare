import { useState, useEffect } from 'react';
import {
  MaterialIcon,
  PageHeader,
  Button,
  StatCard,
  Panel,
  PanelHeader,
  PanelBody,
  Badge,
} from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { adminMessages } from '../../i18n/messages';
import { repositories } from '../../repositories';
import { Clinic, User, AuditLog } from '../../domain';

export function AdminDashboardPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = adminMessages[isRtl ? 'ar' : 'en'].dashboard;

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [cList, uList, aList] = await Promise.all([
          repositories.clinics.list(),
          repositories.users.list(),
          repositories.auditLogs.listByTenant('tenant-demo-01', 10),
        ]);
        setClinics(cList);
        setUsers(uList);
        setAuditLogs(aList);
      } catch (err) {
        console.error('Failed loading admin dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleExportReport = () => {
    const reportData = {
      platform: 'AegisHealth Enterprise Multi-Tenant OS',
      generatedAt: new Date().toISOString(),
      stats: {
        totalTenants: clinics.length,
        totalUsers: users.length,
        totalAuditLogs: auditLogs.length,
        systemHealth: '100% Operational',
        zeroTrustEnforced: true,
      },
      tenants: clinics.map((c) => ({
        id: c.id,
        name: c.name,
        nameAr: c.nameAr,
        city: c.city,
        doctorCount: c.doctorCount,
        rating: c.rating,
      })),
      recentAudits: auditLogs.slice(0, 5),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `aegishealth_report_${Date.now()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();

    setNotice(isRtl ? 'تم تصدير تقرير المنصة الشامل بنجاح!' : 'Platform enterprise report exported successfully!');
    setTimeout(() => setNotice(null), 4000);
  };

  const metrics = [
    {
      label: copy.metrics.activeTenants,
      value: loading ? '...' : clinics.length.toString(),
      delta: isRtl ? '+3 مراكز نشطة' : '+3 active medical centers',
      icon: 'local_hospital',
      trend: 'up' as const,
    },
    {
      label: copy.metrics.staffOnline,
      value: loading ? '...' : users.length.toString(),
      delta: isRtl ? 'أطباء وإداريون موثقون' : 'Verified staff & doctors',
      icon: 'groups',
      trend: 'up' as const,
    },
    {
      label: isRtl ? 'عمليات الأتمتة المنفذة' : 'Automated Dispatches',
      value: '1,420',
      delta: isRtl ? 'عبر n8n والواتساب' : 'Via n8n & WhatsApp Cloud',
      icon: 'bolt',
      trend: 'up' as const,
    },
    {
      label: copy.metrics.uptimeSla,
      value: '99.98%',
      delta: copy.metrics.uptimeSlaDelta,
      icon: 'shield',
      trend: 'up' as const,
    },
  ];

  return (
    <div className="admin-overview" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <PageHeader
        kicker={copy.kicker}
        title={copy.title}
        subtitle={copy.subtitle}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button
              variant="outline"
              size="md"
              icon="download"
              onClick={handleExportReport}
              title={copy.exportReportTitle}
            >
              {copy.exportReport}
            </Button>
            <a
              href="/admin/clinics/provision"
              className="ui-btn ui-btn--primary ui-btn--md"
              style={{ textDecoration: 'none' }}
              title={copy.createTenantTitle}
            >
              <MaterialIcon name="add_business" />
              <span>{copy.createTenant}</span>
            </a>
          </div>
        }
      />

      {notice && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--color-success-text)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
          }}
        >
          <MaterialIcon name="check_circle" />
          <span>{notice}</span>
        </div>
      )}

      {/* Quick Access Action Toolbar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.875rem',
          padding: '1rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--surface-container)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <a
          href="/admin/clinics/provision"
          className="ui-btn ui-btn--ghost ui-btn--sm"
          style={{ textDecoration: 'none', justifyContent: 'flex-start', padding: '0.625rem 0.875rem' }}
        >
          <MaterialIcon name="domain_add" style={{ color: 'var(--brand-primary)' }} />
          <span>{isRtl ? 'إضافة عيادة جديدة' : 'Provision New Clinic'}</span>
        </a>
        <a
          href="/admin/users"
          className="ui-btn ui-btn--ghost ui-btn--sm"
          style={{ textDecoration: 'none', justifyContent: 'flex-start', padding: '0.625rem 0.875rem' }}
        >
          <MaterialIcon name="person_add" style={{ color: 'var(--brand-primary)' }} />
          <span>{isRtl ? 'إدارة المستخدمين والأطباء' : 'Manage Staff & Doctors'}</span>
        </a>
        <a
          href="/admin/integrations"
          className="ui-btn ui-btn--ghost ui-btn--sm"
          style={{ textDecoration: 'none', justifyContent: 'flex-start', padding: '0.625rem 0.875rem' }}
        >
          <MaterialIcon name="hub" style={{ color: 'var(--brand-primary)' }} />
          <span>{isRtl ? 'ربط n8n والواتساب' : 'Configure n8n & WhatsApp'}</span>
        </a>
        <a
          href="/admin/security"
          className="ui-btn ui-btn--ghost ui-btn--sm"
          style={{ textDecoration: 'none', justifyContent: 'flex-start', padding: '0.625rem 0.875rem' }}
        >
          <MaterialIcon name="security" style={{ color: 'var(--brand-primary)' }} />
          <span>{isRtl ? 'فحص الأمان وسجل التدقيق' : 'Security & Audit Trail'}</span>
        </a>
      </div>

      {/* Metrics Row */}
      <section className="admin-grid" aria-label={copy.metricsAria}>
        {metrics.map((metric) => (
          <StatCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            delta={metric.delta}
            trend={metric.trend}
            icon={metric.icon}
          />
        ))}
      </section>

      {/* Dynamic Clinics & Live Audit Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Managed Clinics Live Status */}
        <Panel variant="elevated" padding="none">
          <div style={{ padding: '1.25rem 1.25rem 0' }}>
            <PanelHeader
              title={isRtl ? 'المراكز الطبية والمستأجرون النشطون' : 'Active Medical Clinics & Tenants'}
              icon="local_hospital"
              actions={
                <a
                  href="/admin/clinics"
                  className="ui-btn ui-btn--ghost ui-btn--sm"
                  style={{ textDecoration: 'none', fontSize: '0.75rem' }}
                >
                  <span>{isRtl ? 'عرض الكل' : 'View All'}</span>
                  <MaterialIcon name={isRtl ? 'arrow_back' : 'arrow_forward'} />
                </a>
              }
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.5rem' }}>
            {clinics.slice(0, 4).map((clinic, idx) => (
              <div
                key={clinic.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderTop: idx > 0 ? '1px solid var(--border-subtle)' : 'none',
                }}
              >
                <div>
                  <a
                    href={`/admin/clinics/${clinic.id}`}
                    style={{
                      display: 'block',
                      fontSize: '0.9375rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      textDecoration: 'none',
                    }}
                  >
                    {isRtl ? clinic.nameAr : clinic.name}
                  </a>
                  <small style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>
                    {isRtl ? clinic.cityAr : clinic.city} • {clinic.doctorCount} {isRtl ? 'أطباء' : 'Doctors'} • ⭐ {clinic.rating}
                  </small>
                </div>
                <Badge variant={clinic.isVerified ? 'success' : 'warning'} dot>
                  {clinic.isVerified ? (isRtl ? 'نشط ومعتمد' : 'Operational') : (isRtl ? 'قيد المراجعة' : 'In Review')}
                </Badge>
              </div>
            ))}
          </div>
        </Panel>

        {/* Live Immutable Audit Feed */}
        <Panel variant="elevated" padding="none">
          <div style={{ padding: '1.25rem 1.25rem 0' }}>
            <PanelHeader
              title={isRtl ? 'سجل العمليات والأمان اللحظي (Audit Trail)' : 'Live Security Audit Trail'}
              icon="history"
              actions={
                <a
                  href="/admin/security"
                  className="ui-btn ui-btn--ghost ui-btn--sm"
                  style={{ textDecoration: 'none', fontSize: '0.75rem' }}
                >
                  <span>{isRtl ? 'السجل الكامل' : 'Full Log'}</span>
                  <MaterialIcon name={isRtl ? 'arrow_back' : 'arrow_forward'} />
                </a>
              }
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.5rem' }}>
            {auditLogs.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                {isRtl ? 'لا توجد سجلات بعد' : 'No audit records yet'}
              </div>
            ) : (
              auditLogs.slice(0, 4).map((log, idx) => (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    padding: '0.95rem 1.25rem',
                    borderTop: idx > 0 ? '1px solid var(--border-subtle)' : 'none',
                  }}
                >
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                      {log.action}
                    </strong>
                    <small style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem' }}>
                      {log.actorRole} • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </small>
                  </div>
                  <Badge variant="brand" size="sm">
                    {log.entityType}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Panel>
      </section>

      {/* Compliance & Zero-Trust Verification Panel */}
      <Panel variant="elevated">
        <PanelHeader
          title={copy.complianceTitle}
          icon="health_and_safety"
          actions={<Badge variant="brand">{copy.complianceAudit}</Badge>}
        />
        <PanelBody>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {copy.complianceItems.map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--surface-subtle)',
                  fontSize: '0.85rem',
                  color: 'var(--text-main)',
                }}
              >
                <MaterialIcon name="check_circle" style={{ color: 'var(--color-success-text)', fontSize: '1.15rem' }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </PanelBody>
      </Panel>
    </div>
  );
}
