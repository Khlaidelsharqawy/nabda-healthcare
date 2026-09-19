import { useState, useEffect, useMemo } from 'react';
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

  // New interactive filters & search
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'review'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [cList, uList, aList] = await Promise.all([
          repositories.clinics.list(),
          repositories.users.list(),
          repositories.auditLogs.listByTenant('tenant-demo-01', 15),
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
      platform: 'منظومة نبضة الطبية المتكاملة | Nabda Healthcare Enterprise Multi-Tenant OS',
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
      recentAudits: auditLogs.slice(0, 10),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `nabda_enterprise_report_${Date.now()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();

    setNotice(isRtl ? 'تم تصدير تقرير منظومة نبضة الشامل بنجاح!' : 'Nabda Healthcare enterprise report exported successfully!');
    setTimeout(() => setNotice(null), 4000);
  };

  // Filtered clinics based on region, status, and search query
  const filteredClinics = useMemo(() => {
    return clinics.filter((c) => {
      if (selectedRegion !== 'all') {
        const cCity = (c.city || '').toLowerCase();
        const cCityAr = (c.cityAr || '');
        if (selectedRegion === 'cairo' && !cCity.includes('cairo') && !cCityAr.includes('قاهر')) return false;
        if (selectedRegion === 'giza' && !cCity.includes('giza') && !cCityAr.includes('جيز')) return false;
        if (selectedRegion === 'alex' && !cCity.includes('alex') && !cCityAr.includes('إسكندر') && !cCityAr.includes('اسكندر')) return false;
      }
      if (statusFilter === 'verified' && !c.isVerified) return false;
      if (statusFilter === 'review' && c.isVerified) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = (c.name || '').toLowerCase().includes(q) || (c.nameAr || '').includes(q);
        const matchCity = (c.city || '').toLowerCase().includes(q) || (c.cityAr || '').includes(q);
        if (!matchName && !matchCity) return false;
      }
      return true;
    });
  }, [clinics, selectedRegion, statusFilter, searchQuery]);

  // Filtered audit logs
  const filteredAudits = useMemo(() => {
    if (!searchQuery.trim()) return auditLogs;
    const q = searchQuery.toLowerCase().trim();
    return auditLogs.filter((a) =>
      (a.action || '').toLowerCase().includes(q) ||
      (a.actorRole || '').toLowerCase().includes(q) ||
      (a.entityType || '').toLowerCase().includes(q)
    );
  }, [auditLogs, searchQuery]);

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
        kicker={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>{isRtl ? 'منظومة نبضة السحابية' : 'Nabda Cloud Platform'}</span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#087443', fontWeight: 600, fontSize: '0.8rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#087443', display: 'inline-block' }} />
              {isRtl ? 'النظام متصل ونشط' : 'System Online'}
            </span>
          </div>
        }
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
            backgroundColor: 'rgba(8, 116, 67, 0.1)',
            color: '#087443',
            border: '1px solid rgba(8, 116, 67, 0.3)',
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
          <MaterialIcon name="domain_add" style={{ color: '#087443' }} />
          <span>{isRtl ? 'إضافة عيادة جديدة' : 'Provision New Clinic'}</span>
        </a>
        <a
          href="/admin/users"
          className="ui-btn ui-btn--ghost ui-btn--sm"
          style={{ textDecoration: 'none', justifyContent: 'flex-start', padding: '0.625rem 0.875rem' }}
        >
          <MaterialIcon name="person_add" style={{ color: '#087443' }} />
          <span>{isRtl ? 'إدارة المستخدمين والأطباء' : 'Manage Staff & Doctors'}</span>
        </a>
        <a
          href="/admin/integrations"
          className="ui-btn ui-btn--ghost ui-btn--sm"
          style={{ textDecoration: 'none', justifyContent: 'flex-start', padding: '0.625rem 0.875rem' }}
        >
          <MaterialIcon name="hub" style={{ color: '#087443' }} />
          <span>{isRtl ? 'ربط n8n والواتساب' : 'Configure n8n & WhatsApp'}</span>
        </a>
        <a
          href="/admin/security"
          className="ui-btn ui-btn--ghost ui-btn--sm"
          style={{ textDecoration: 'none', justifyContent: 'flex-start', padding: '0.625rem 0.875rem' }}
        >
          <MaterialIcon name="security" style={{ color: '#087443' }} />
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

      {/* Real-time Filter & Search Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--surface-container-lowest)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {isRtl ? 'تصفية المحافظة:' : 'Region:'}
          </span>
          <button
            type="button"
            className={`ui-btn ui-btn--sm ${selectedRegion === 'all' ? 'ui-btn--primary' : 'ui-btn--ghost'}`}
            onClick={() => setSelectedRegion('all')}
          >
            {isRtl ? 'جميع المحافظات' : 'All Regions'}
          </button>
          <button
            type="button"
            className={`ui-btn ui-btn--sm ${selectedRegion === 'cairo' ? 'ui-btn--primary' : 'ui-btn--ghost'}`}
            onClick={() => setSelectedRegion('cairo')}
          >
            {isRtl ? 'القاهرة' : 'Cairo'}
          </button>
          <button
            type="button"
            className={`ui-btn ui-btn--sm ${selectedRegion === 'giza' ? 'ui-btn--primary' : 'ui-btn--ghost'}`}
            onClick={() => setSelectedRegion('giza')}
          >
            {isRtl ? 'الجيزة' : 'Giza'}
          </button>
          <button
            type="button"
            className={`ui-btn ui-btn--sm ${selectedRegion === 'alex' ? 'ui-btn--primary' : 'ui-btn--ghost'}`}
            onClick={() => setSelectedRegion('alex')}
          >
            {isRtl ? 'الإسكندرية' : 'Alexandria'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 280px', maxWidth: '400px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <MaterialIcon
              name="search"
              style={{
                position: 'absolute',
                insetInlineStart: '0.75rem',
                insetBlockStart: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? 'بحث في المراكز والعمليات...' : 'Search clinics and audits...'}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                paddingInlineStart: '2.4rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                background: 'var(--surface-container-low)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
              }}
            />
          </div>
          {searchQuery && (
            <button
              type="button"
              className="ui-btn ui-btn--ghost ui-btn--sm"
              onClick={() => setSearchQuery('')}
            >
              <MaterialIcon name="close" />
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Clinics & Live Audit Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Managed Clinics Live Status */}
        <Panel variant="elevated" padding="none">
          <div style={{ padding: '1.25rem 1.25rem 0' }}>
            <PanelHeader
              title={
                <span>
                  {isRtl ? 'المراكز الطبية والمستأجرون النشطون' : 'Active Medical Clinics & Tenants'}
                  {' '}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 'normal' }}>
                    ({filteredClinics.length})
                  </span>
                </span>
              }
              icon="local_hospital"
              actions={
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className={`ui-btn ui-btn--sm ${statusFilter === 'all' ? 'ui-btn--brand' : 'ui-btn--ghost'}`}
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                    onClick={() => setStatusFilter(statusFilter === 'all' ? 'verified' : 'all')}
                  >
                    {statusFilter === 'all' ? (isRtl ? 'تصفية المعتمد' : 'Show Verified') : (isRtl ? 'عرض الكل' : 'Show All')}
                  </button>
                  <a
                    href="/admin/clinics"
                    className="ui-btn ui-btn--ghost ui-btn--sm"
                    style={{ textDecoration: 'none', fontSize: '0.75rem' }}
                  >
                    <span>{isRtl ? 'عرض الكل' : 'View All'}</span>
                    <MaterialIcon name={isRtl ? 'arrow_back' : 'arrow_forward'} />
                  </a>
                </div>
              }
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.5rem' }}>
            {filteredClinics.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                {isRtl ? 'لا توجد مراكز مطابقة للبحث أو التصفية الحالية' : 'No clinics match current filter'}
              </div>
            ) : (
              filteredClinics.slice(0, 5).map((clinic, idx) => (
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
              ))
            )}
          </div>
        </Panel>

        {/* Live Immutable Audit Feed */}
        <Panel variant="elevated" padding="none">
          <div style={{ padding: '1.25rem 1.25rem 0' }}>
            <PanelHeader
              title={
                <span>
                  {isRtl ? 'سجل العمليات والأمان اللحظي' : 'Live Security Audit Trail'}
                  {' '}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 'normal' }}>
                    ({filteredAudits.length})
                  </span>
                </span>
              }
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
            {filteredAudits.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                {isRtl ? 'لا توجد سجلات مطابقة' : 'No audit records match'}
              </div>
            ) : (
              filteredAudits.slice(0, 5).map((log, idx) => (
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

      {/* Telemetry & Compliance Card */}
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
                <MaterialIcon name="check_circle" style={{ color: '#087443', fontSize: '1.15rem' }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </PanelBody>
      </Panel>
    </div>
  );
}
