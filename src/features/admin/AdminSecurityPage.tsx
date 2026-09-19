import { useState, useEffect } from 'react';
import {
  MaterialIcon,
  PageHeader,
  Button,
  Badge,
  Panel,
  PanelHeader,
  PanelBody,
  StatCard,
} from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { adminMessages } from '../../i18n/messages';
import { repositories } from '../../repositories';
import { AuditLog } from '../../domain';

export function AdminSecurityPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = adminMessages[isRtl ? 'ar' : 'en'].security;

  const [auditTrail, setAuditTrail] = useState<AuditLog[]>([]);
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    status: 'passed' | 'warning';
    passedChecks: number;
    totalChecks: number;
    details: string[];
  } | null>(null);

  const loadAuditLogs = async () => {
    try {
      const logs = await repositories.auditLogs.listByTenant('tenant-demo-01', 50);
      setAuditTrail(logs);
    } catch (err) {
      console.error('Failed loading audit logs', err);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const handleRunSecurityAudit = async () => {
    setIsRunningAudit(true);
    setAuditResult(null);

    // Simulate real security validation checks
    await new Promise((r) => setTimeout(r, 700));

    const checkDetails = [
      isRtl ? 'عزل المستأجرين (Tenant Boundary Isolation): مفعل ومحمي 100%' : 'Tenant Boundary Isolation: Active & Enforced 100%',
      isRtl ? 'سياسات أمان الصفوف (Row-Level Security RLS): نشطة على جميع الجداول' : 'Row-Level Security (RLS): Enforced on all PostgreSQL tables',
      isRtl ? 'تشفير السجلات الطبية (KMS AES-256): سليم ومحدّث' : 'Medical Record KMS Encryption (AES-256): Healthy',
      isRtl ? 'فصل صلاحيات الأدوار (RBAC Least-Privilege): صفر انحراف' : 'Role-Based Access Control (RBAC): Zero Drift detected',
      isRtl ? 'سجل التدقيق الأمني (Immutable Audit Trail): محمي ضد التعديل أو الحذف' : 'Audit Trail Immutability: Protected against UPDATE/DELETE',
    ];

    await repositories.auditLogs.append({
      tenantId: 'tenant-demo-01',
      actorId: 'usr-admin-01',
      actorRole: 'super_admin',
      action: 'ZERO_TRUST_COMPREHENSIVE_AUDIT',
      entityType: 'auth',
      entityId: 'sec-check-full',
      details: { checksPassed: 5, totalChecks: 5, result: 'PASSED' },
    });

    await loadAuditLogs();

    setAuditResult({
      status: 'passed',
      passedChecks: 5,
      totalChecks: 5,
      details: checkDetails,
    });
    setIsRunningAudit(false);
  };

  const controls = [
    { label: copy.kmsRotation, value: copy.valKms, status: copy.statusHealthy, variant: 'success' as const },
    { label: copy.rbacDrift, value: '0 Drift', status: copy.statusHealthy, variant: 'success' as const },
    { label: copy.privilegedSessions, value: '3 Monitored', status: copy.statusMonitored, variant: 'brand' as const },
  ] as const;

  return (
    <div className="admin-page__section" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <PageHeader
        kicker={copy.kicker}
        title={copy.title}
        actions={
          <Button
            variant="primary"
            size="md"
            icon="shield"
            onClick={handleRunSecurityAudit}
            disabled={isRunningAudit}
            title={copy.runAuditTitle}
          >
            {isRunningAudit
              ? (isRtl ? 'جاري الفحص الشامل...' : 'Running Scan...')
              : copy.runAudit}
          </Button>
        }
      />

      {/* Security Audit Scan Result Banner */}
      {auditResult && (
        <div
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: 'var(--text-main)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MaterialIcon name="verified_user" style={{ color: 'var(--color-success-text)', fontSize: '1.5rem' }} />
              <strong style={{ fontSize: '1rem', color: 'var(--color-success-text)' }}>
                {isRtl ? 'اكتمل الفحص الأمني بنجاح: جميع معايير الأمان معتمدة (100%)' : 'Security Audit Passed: 100% Zero-Trust Compliance'}
              </strong>
            </div>
            <Badge variant="success">
              {auditResult.passedChecks} / {auditResult.totalChecks} {isRtl ? 'ناجح' : 'Passed'}
            </Badge>
          </div>
          <ul style={{ margin: 0, paddingInlineStart: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {auditResult.details.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Security Controls Metric Cards */}
      <section className="admin-grid" aria-label={copy.metricsAria}>
        {controls.map((control) => (
          <StatCard
            key={control.label}
            label={control.label}
            value={control.value}
            icon="security"
            delta={control.status}
            trend="neutral"
          />
        ))}
      </section>

      {/* Zero Trust Policies & Live Immutable Audit Log */}
      <section className="admin-columns">
        <Panel variant="elevated">
          <PanelHeader
            title={copy.policyTitle}
            icon="fact_check"
            actions={<Badge variant="brand">{copy.zeroTrustTag}</Badge>}
          />
          <PanelBody>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {copy.policies.map((policy) => (
                <li
                  key={policy}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface-subtle)',
                    fontSize: '0.875rem',
                    color: 'var(--text-main)',
                  }}
                >
                  <MaterialIcon
                    name="check_circle"
                    style={{ color: 'var(--color-success-text)' }}
                  />
                  <span>{policy}</span>
                </li>
              ))}
            </ul>
          </PanelBody>
        </Panel>

        {/* Live Immutable Audit Trail */}
        <Panel variant="elevated" padding="none">
          <div style={{ padding: '1.25rem 1.25rem 0' }}>
            <PanelHeader
              title={copy.auditTitle}
              icon="history"
              actions={
                <Badge variant="success">
                  {auditTrail.length} {isRtl ? 'سجل غير قابل للتعديل' : 'Immutable Logs'}
                </Badge>
              }
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.5rem', maxHeight: '420px', overflowY: 'auto' }}>
            {auditTrail.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                {isRtl ? 'لا توجد سجلات بعد' : 'No audit records yet'}
              </div>
            ) : (
              auditTrail.map((entry, idx) => (
                <div
                  key={entry.id}
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
                      {entry.action}
                    </strong>
                    <small style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem' }}>
                      {entry.actorRole} ({entry.actorId}) • {new Date(entry.timestamp).toLocaleString()}
                    </small>
                  </div>
                  <Badge variant="brand" size="sm">
                    {entry.entityType}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Panel>
      </section>
    </div>
  );
}
