import { Suspense, lazy } from 'react';
import { AdminShell } from '../../layouts/AdminShell';
import { MaterialIcon } from '../../components/ui';
import { TableSkeleton } from '../../components/ui/LoadingScreen';
import { useTheme } from '../../theme/ThemeProvider';

// Lazy load administrative views inside the isolated portal
const AdminDashboardPage = lazy(() => import('./AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminClinicsPage = lazy(() => import('./AdminClinicsPage').then(m => ({ default: m.AdminClinicsPage })));
const AdminClinicProvisionPage = lazy(() => import('./AdminClinicProvisionPage').then(m => ({ default: m.AdminClinicProvisionPage })));
const AdminUsersPage = lazy(() => import('./AdminUsersPage').then(m => ({ default: m.AdminUsersPage })));
const AdminClinicDetailPage = lazy(() => import('./AdminClinicDetailPage').then(m => ({ default: m.AdminClinicDetailPage })));
const AdminSecurityPage = lazy(() => import('./AdminSecurityPage').then(m => ({ default: m.AdminSecurityPage })));
const AdminSubscriptionsPage = lazy(() => import('./AdminSubscriptionsPage').then(m => ({ default: m.AdminSubscriptionsPage })));
const AdminRemoteConsolePage = lazy(() => import('./AdminRemoteConsolePage').then(m => ({ default: m.AdminRemoteConsolePage })));
const AdminClinicUsersPage = lazy(() => import('./AdminClinicUsersPage').then(m => ({ default: m.AdminClinicUsersPage })));
const AdminClinicUsagePage = lazy(() => import('./AdminClinicUsagePage').then(m => ({ default: m.AdminClinicUsagePage })));
const AdminApiIntegrationsPage = lazy(() => import('./AdminApiIntegrationsPage').then(m => ({ default: m.AdminApiIntegrationsPage })));
const UserProfilePage = lazy(() => import('../profile/UserProfilePage').then(m => ({ default: m.UserProfilePage })));

interface AdminPortalRouterProps {
  pathname: string;
}

export function AdminPortalRouter({ pathname }: AdminPortalRouterProps) {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';

  // Security Gate: Zero-Trust Air-Gap Rule
  // Administrative control plane is restricted to local-only access (localhost / 127.0.0.1)
  const isLocalHost = 
    typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' || 
     window.location.hostname === '[::1]');

  if (!isLocalHost) {
    return (
      <div 
        style={{
          minHeight: '100vh',
          backgroundColor: '#0a0d14',
          color: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          direction: isRtl ? 'rtl' : 'ltr',
        }}
      >
        <div
          style={{
            maxWidth: '640px',
            width: '100%',
            backgroundColor: '#111827',
            border: '1px solid #dc2626',
            borderRadius: '16px',
            padding: '36px',
            boxShadow: '0 25px 50px -12px rgba(220, 38, 38, 0.25)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'rgba(220, 38, 38, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              border: '2px solid #ef4444',
            }}
          >
            <MaterialIcon name="shield_lock" style={{ fontSize: '40px', color: '#ef4444' }} />
          </div>

          <div
            style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            {isRtl ? 'حظر أمني مشدد (Zero-Trust Air-Gap)' : 'Security Violation: 403 Forbidden'}
          </div>

          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 12px', color: '#ffffff' }}>
            {isRtl ? 'لوحة التحكم الإدارية غير متاحة عبر النطاقات العامة' : 'Admin Portal Air-Gapped From Public Access'}
          </h1>

          <p style={{ fontSize: '0.92rem', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 24px' }}>
            {isRtl
              ? 'بموجب السياسات الأمنية الصارمة لمنظومة نبضة الطبية (HIPAA §164.312 & Zero-Trust Protocol)، تم عزل لوحة تحكم الإدارة العليا بالكامل ولا يمكن الوصول إليها إلا محلياً (Localhost / Air-Gapped Network) أو عبر ريبوزيتوري الإدارة المستقل (nabda-saas-admin).'
              : 'Per Nabda Healthcare Zero-Trust & HIPAA §164.312 security protocols, the administrative plane is completely air-gapped and cannot be accessed via public endpoints. Administration is restricted strictly to local machine access (localhost) or the isolated nabda-saas-admin repository.'}
          </p>

          <div
            style={{
              backgroundColor: '#030712',
              borderRadius: '10px',
              padding: '14px 18px',
              textAlign: isRtl ? 'right' : 'left',
              fontSize: '0.78rem',
              color: '#64748b',
              marginBottom: '28px',
              border: '1px solid #1f2937',
              fontFamily: 'monospace',
            }}
          >
            <div><strong>Blocked Host:</strong> {window.location.hostname}</div>
            <div><strong>Request URI:</strong> {pathname}</div>
            <div><strong>Security Rule:</strong> LOCAL_ADMIN_AIRGAP_ENFORCED</div>
            <div><strong>Audit Chaining:</strong> SHA-256 Event Logged to Security Core</div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <a
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                backgroundColor: '#059669',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'background-color 0.2s',
              }}
            >
              <MaterialIcon name="home" style={{ fontSize: '18px' }} />
              <span>{isRtl ? 'العودة إلى المنظومة الطبية' : 'Return to Healthcare Portal'}</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const renderAdminSubView = () => {
    if (pathname === '/admin/dashboard') return <AdminDashboardPage />;
    if (pathname === '/admin/clinics') return <AdminClinicsPage />;
    if (pathname === '/admin/clinics/provision') return <AdminClinicProvisionPage />;
    if (pathname === '/admin/users') return <AdminUsersPage />;
    if (pathname === '/admin/security') return <AdminSecurityPage />;
    if (pathname === '/admin/subscriptions') return <AdminSubscriptionsPage />;
    if (pathname === '/admin/remote-console') return <AdminRemoteConsolePage />;
    if (pathname === '/admin/integrations') return <AdminApiIntegrationsPage />;
    if (pathname === '/admin/profile') return <UserProfilePage role="admin" />;
    
    const clinicIdMatch = pathname.match(/^\/admin\/clinics\/([^/]+)/);
    const clinicId = clinicIdMatch ? clinicIdMatch[1] : 'al-nour';

    if (pathname.endsWith('/users')) return <AdminClinicUsersPage clinicId={clinicId} />;
    if (pathname.endsWith('/usage')) return <AdminClinicUsagePage clinicId={clinicId} />;
    if (pathname.startsWith('/admin/clinics/')) return <AdminClinicDetailPage clinicId={clinicId} />;
    return <AdminDashboardPage />;
  };

  return (
    <div className="admin-isolated-portal" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Dedicated SaaS Core API Telemetry Bar */}
      <aside
        aria-label="Admin Operational Bar"
        style={{
          backgroundColor: '#052e16',
          color: '#86efac',
          padding: '6px 20px',
          fontSize: '0.75rem',
          fontWeight: 600,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          borderBottom: '1px solid rgba(134, 239, 172, 0.2)',
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              display: 'inline-block',
              boxShadow: '0 0 8px #22c55e',
            }}
          />
          <span>
            {isRtl
              ? 'بوابة التحكم الإدارية المستقلة • متصلة بنواة المنظومة عبر API v2.4 (Supabase RLS Enforced)'
              : 'Standalone Admin Portal • Connected to SaaS Core via API v2.4 (Supabase RLS Enforced)'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#dcfce7', opacity: 0.85 }}>
            {isRtl ? 'صلاحيات: مدير المنظومة الأعلى (Super Admin)' : 'Authority: Super Admin'}
          </span>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#ffffff',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '2px 8px',
              borderRadius: '4px',
            }}
          >
            <span>{isRtl ? 'معاينة الموقع العام' : 'Public Site'}</span>
            <MaterialIcon name="open_in_new" style={{ fontSize: '14px' }} />
          </a>
        </div>
      </aside>

      {/* 2. Isolated Admin Shell & Dynamic Content */}
      <AdminShell pathname={pathname}>
        <Suspense fallback={<TableSkeleton rows={6} columns={6} />}>
          {renderAdminSubView()}
        </Suspense>
      </AdminShell>
    </div>
  );
}
