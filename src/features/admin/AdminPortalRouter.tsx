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
