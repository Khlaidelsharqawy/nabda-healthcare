import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { resolveScreenRoute } from './routeRegistry';
import { PageLoadingIndicator } from './components/ui/LoadingScreen';
import { AuthShell } from './layouts/AuthShell';
import { DoctorShell } from './layouts/DoctorShell';
import { AssistantShell } from './layouts/AssistantShell';
import { PatientShell } from './layouts/PatientShell';
import { ThemeProvider } from './theme/ThemeProvider';

// Lazy load feature components
const DoctorDashboardPage = lazy(() => import('./features/doctor/DoctorDashboardPage').then(m => ({ default: m.DoctorDashboardPage })));
const DoctorAppointmentsPage = lazy(() => import('./features/doctor/DoctorAppointmentsPage').then(m => ({ default: m.DoctorAppointmentsPage })));
const DoctorPatientsPage = lazy(() => import('./features/doctor/DoctorPatientsPage').then(m => ({ default: m.DoctorPatientsPage })));
const DoctorPatientProfilePage = lazy(() => import('./features/doctor/DoctorPatientProfilePage').then(m => ({ default: m.DoctorPatientProfilePage })));
const DoctorPatientHistoryPage = lazy(() => import('./features/doctor/DoctorPatientHistoryPage').then(m => ({ default: m.DoctorPatientHistoryPage })));
const DoctorPatientTimelinePage = lazy(() => import('./features/doctor/DoctorPatientTimelinePage').then(m => ({ default: m.DoctorPatientTimelinePage })));
const DoctorPatientNotesPage = lazy(() => import('./features/doctor/DoctorPatientNotesPage').then(m => ({ default: m.DoctorPatientNotesPage })));
const DoctorPatientDocumentsPage = lazy(() => import('./features/doctor/DoctorPatientDocumentsPage').then(m => ({ default: m.DoctorPatientDocumentsPage })));
const DoctorPatientPrescriptionsPage = lazy(() => import('./features/doctor/DoctorPatientPrescriptionsPage').then(m => ({ default: m.DoctorPatientPrescriptionsPage })));
const DoctorOrdersPage = lazy(() => import('./features/doctor/DoctorOrdersPage').then(m => ({ default: m.DoctorOrdersPage })));
const DoctorLabOrderPage = lazy(() => import('./features/doctor/DoctorLabOrderPage').then(m => ({ default: m.DoctorLabOrderPage })));
const DoctorImagingOrderPage = lazy(() => import('./features/doctor/DoctorImagingOrderPage').then(m => ({ default: m.DoctorImagingOrderPage })));
const DoctorMedicationDetailsPage = lazy(() => import('./features/doctor/DoctorMedicationDetailsPage').then(m => ({ default: m.DoctorMedicationDetailsPage })));
const DoctorPrescriptionWriterPage = lazy(() => import('./features/doctor/DoctorPrescriptionWriterPage').then(m => ({ default: m.DoctorPrescriptionWriterPage })));
const DoctorAiWorkspacePage = lazy(() => import('./features/doctor/DoctorAiWorkspacePage').then(m => ({ default: m.DoctorAiWorkspacePage })));
const DoctorPatientAiPage = lazy(() => import('./features/doctor/DoctorPatientAiPage').then(m => ({ default: m.DoctorPatientAiPage })));
const DoctorAiDraftPage = lazy(() => import('./features/doctor/DoctorAiDraftPage').then(m => ({ default: m.DoctorAiDraftPage })));
const DoctorVoiceSessionsPage = lazy(() => import('./features/doctor/DoctorVoiceSessionsPage').then(m => ({ default: m.DoctorVoiceSessionsPage })));
const DoctorNewVoiceSessionPage = lazy(() => import('./features/doctor/DoctorNewVoiceSessionPage').then(m => ({ default: m.DoctorNewVoiceSessionPage })));
const DoctorActiveVoiceSessionPage = lazy(() => import('./features/doctor/DoctorActiveVoiceSessionPage').then(m => ({ default: m.DoctorActiveVoiceSessionPage })));
const DoctorVoiceSessionReviewPage = lazy(() => import('./features/doctor/DoctorVoiceSessionReviewPage').then(m => ({ default: m.DoctorVoiceSessionReviewPage })));
const DoctorCommunicationsPage = lazy(() => import('./features/doctor/DoctorCommunicationsPage').then(m => ({ default: m.DoctorCommunicationsPage })));
const DoctorRefillsPage = lazy(() => import('./features/doctor/DoctorRefillsPage').then(m => ({ default: m.DoctorRefillsPage })));

const AssistantPatientsPage = lazy(() => import('./features/assistant/AssistantPatientsPage').then(m => ({ default: m.AssistantPatientsPage })));
const AssistantPatientRegisterPage = lazy(() => import('./features/assistant/AssistantPatientRegisterPage').then(m => ({ default: m.AssistantPatientRegisterPage })));
const AssistantAppointmentsPage = lazy(() => import('./features/assistant/AssistantAppointmentsPage').then(m => ({ default: m.AssistantAppointmentsPage })));
const AssistantQueuePage = lazy(() => import('./features/assistant/AssistantQueuePage').then(m => ({ default: m.AssistantQueuePage })));
const AssistantCommunicationsPage = lazy(() => import('./features/assistant/AssistantCommunicationsPage').then(m => ({ default: m.AssistantCommunicationsPage })));
const AssistantAiPage = lazy(() => import('./features/assistant/AssistantAiPage').then(m => ({ default: m.AssistantAiPage })));
const AssistantAiCommunicationsPage = lazy(() => import('./features/assistant/AssistantAiCommunicationsPage').then(m => ({ default: m.AssistantAiCommunicationsPage })));
const AssistantSpecimenIntakePage = lazy(() => import('./features/assistant/AssistantSpecimenIntakePage').then(m => ({ default: m.AssistantSpecimenIntakePage })));

const PatientDashboardPage = lazy(() => import('./features/patient/PatientDashboardPage').then(m => ({ default: m.PatientDashboardPage })));
const PatientProfilePage = lazy(() => import('./features/patient/PatientProfilePage').then(m => ({ default: m.PatientProfilePage })));
const PatientAppointmentsPage = lazy(() => import('./features/patient/PatientAppointmentsPage').then(m => ({ default: m.PatientAppointmentsPage })));
const PatientMedicationsPage = lazy(() => import('./features/patient/PatientMedicationsPage').then(m => ({ default: m.PatientMedicationsPage })));
const PatientLabsPage = lazy(() => import('./features/patient/PatientLabsPage').then(m => ({ default: m.PatientLabsPage })));
const PatientAiPage = lazy(() => import('./features/patient/PatientAiPage').then(m => ({ default: m.PatientAiPage })));
const PatientAiContextPage = lazy(() => import('./features/patient/PatientAiContextPage').then(m => ({ default: m.PatientAiContextPage })));
const PatientAiHistoryPage = lazy(() => import('./features/patient/PatientAiHistoryPage').then(m => ({ default: m.PatientAiHistoryPage })));
const PatientVitalsPage = lazy(() => import('./features/patient/PatientVitalsPage').then(m => ({ default: m.PatientVitalsPage })));

const BrandLandingPage = lazy(() => import('./features/brand/BrandLandingPage').then(m => ({ default: m.BrandLandingPage })));
const AuthLoginPage = lazy(() => import('./features/auth/AuthLoginPage').then(m => ({ default: m.AuthLoginPage })));
const AuthSignupPage = lazy(() => import('./features/auth/AuthSignupPage').then(m => ({ default: m.AuthSignupPage })));
const AuthRequestAccessPage = lazy(() => import('./features/auth/AuthRequestAccessPage').then(m => ({ default: m.AuthRequestAccessPage })));
const AuthPasswordRecoveryPage = lazy(() => import('./features/auth/AuthPasswordRecoveryPage').then(m => ({ default: m.AuthPasswordRecoveryPage })));
const AuthResetPasswordPage = lazy(() => import('./features/auth/AuthResetPasswordPage').then(m => ({ default: m.AuthResetPasswordPage })));
const AuthVerifyPage = lazy(() => import('./features/auth/AuthVerifyPage').then(m => ({ default: m.AuthVerifyPage })));
const AuthSessionExpiredPage = lazy(() => import('./features/auth/AuthSessionExpiredPage').then(m => ({ default: m.AuthSessionExpiredPage })));
const AuthUnauthorizedPage = lazy(() => import('./features/auth/AuthUnauthorizedPage').then(m => ({ default: m.AuthUnauthorizedPage })));

const PublicClinicHomePage = lazy(() => import('./features/public/PublicClinicHomePage').then(m => ({ default: m.PublicClinicHomePage })));
const PublicClinicDoctorsPage = lazy(() => import('./features/public/PublicClinicDoctorsPage').then(m => ({ default: m.PublicClinicDoctorsPage })));
const PublicClinicServicesPage = lazy(() => import('./features/public/PublicClinicServicesPage').then(m => ({ default: m.PublicClinicServicesPage })));
const PublicClinicBookingConfirmedPage = lazy(() => import('./features/public/PublicClinicBookingConfirmedPage').then(m => ({ default: m.PublicClinicBookingConfirmedPage })));

const AdminPortalRouter = lazy(() => import('./features/admin/AdminPortalRouter').then(m => ({ default: m.AdminPortalRouter })));
const GlobalAiChatPage = lazy(() => import('./features/chat/GlobalAiChatPage').then(m => ({ default: m.GlobalAiChatPage })));
const UserProfilePage = lazy(() => import('./features/profile/UserProfilePage').then(m => ({ default: m.UserProfilePage })));

const getLocation = () => ({
  pathname: window.location.pathname.replace(/\/$/, '') || '/',
  search: window.location.search,
});

// Authentication Routes Configuration
function getAuthConfig(pathname: string): { title: string; subtitle: string; component: ReactNode } | null {
  switch (pathname) {
    case '/login':
      return { title: 'Login', subtitle: 'Secure access for Nabda Healthcare Platform.', component: <AuthLoginPage /> };
    case '/signup':
      return { title: 'Patient Registration', subtitle: 'Create your personal healthcare account to manage care and appointments.', component: <AuthSignupPage /> };
    case '/request-access':
      return { title: 'Healthcare Provider Access', subtitle: 'Clinical onboarding and credential verification for healthcare facilities.', component: <AuthRequestAccessPage /> };
    case '/forgot-password':
      return { title: 'Account recovery', subtitle: 'Demo-only flow: this frontend build does not send emails.', component: <AuthPasswordRecoveryPage /> };
    case '/reset-password':
      return { title: 'Reset password', subtitle: 'Preview only. Passwords are not stored or validated against a live system.', component: <AuthResetPasswordPage /> };
    case '/verify':
      return { title: 'Verify account', subtitle: 'Demo-only verification. No live identity provider is connected.', component: <AuthVerifyPage /> };
    case '/session-expired':
      return { title: 'Session expired', subtitle: 'Your current preview session has ended.', component: <AuthSessionExpiredPage /> };
    case '/unauthorized':
      return { title: 'Unauthorized access', subtitle: 'This is a frontend-only access state.', component: <AuthUnauthorizedPage /> };
    default:
      return null;
  }
}

// Doctor Sub-view Resolver
function getDoctorSubView(pathname: string): ReactNode {
  if (pathname === '/doctor/dashboard') return <DoctorDashboardPage />;
  if (pathname === '/doctor/appointments') return <DoctorAppointmentsPage />;
  if (pathname === '/doctor/patients') return <DoctorPatientsPage />;
  if (pathname === '/doctor/orders') return <DoctorOrdersPage />;
  if (pathname === '/doctor/orders/lab/new') return <DoctorLabOrderPage />;
  if (pathname === '/doctor/orders/imaging/new') return <DoctorImagingOrderPage />;
  if (pathname === '/doctor/prescriptions/new') return <DoctorPrescriptionWriterPage />;
  if (pathname === '/doctor/ai') return <DoctorAiWorkspacePage />;
  if (pathname === '/doctor/voice-sessions') return <DoctorVoiceSessionsPage />;
  if (pathname === '/doctor/voice-sessions/new') return <DoctorNewVoiceSessionPage />;
  if (pathname === '/doctor/communications') return <DoctorCommunicationsPage />;
  if (pathname === '/doctor/refills') return <DoctorRefillsPage />;
  if (pathname === '/doctor/chat') return <GlobalAiChatPage role="doctor" />;
  if (pathname === '/doctor/profile') return <UserProfilePage role="doctor" />;

  // Parameterized Doctor Routes
  const match = (pattern: RegExp) => pathname.match(pattern);
  let m: RegExpMatchArray | null;

  if ((m = match(/^\/doctor\/patients\/([^/]+)\/history$/))) return <DoctorPatientHistoryPage patientId={m[1]} />;
  if ((m = match(/^\/doctor\/patients\/([^/]+)\/timeline$/))) return <DoctorPatientTimelinePage patientId={m[1]} />;
  if ((m = match(/^\/doctor\/patients\/([^/]+)\/notes$/))) return <DoctorPatientNotesPage patientId={m[1]} />;
  if ((m = match(/^\/doctor\/patients\/([^/]+)\/documents$/))) return <DoctorPatientDocumentsPage patientId={m[1]} />;
  if ((m = match(/^\/doctor\/patients\/([^/]+)\/prescriptions$/))) return <DoctorPatientPrescriptionsPage patientId={m[1]} />;
  if ((m = match(/^\/doctor\/patients\/([^/]+)$/))) return <DoctorPatientProfilePage patientId={m[1]} />;
  if ((m = match(/^\/doctor\/medications\/([^/]+)$/))) return <DoctorMedicationDetailsPage medicationId={m[1]} />;
  if ((m = match(/^\/doctor\/ai\/patient\/([^/]+)$/))) return <DoctorPatientAiPage patientId={m[1]} />;
  if ((m = match(/^\/doctor\/ai\/drafts\/([^/]+)$/))) return <DoctorAiDraftPage draftId={m[1]} />;
  if ((m = match(/^\/doctor\/voice-sessions\/([^/]+)\/review$/))) return <DoctorVoiceSessionReviewPage sessionId={m[1]} />;
  if ((m = match(/^\/doctor\/voice-sessions\/([^/]+)$/))) return <DoctorActiveVoiceSessionPage sessionId={m[1]} />;

  return <DoctorDashboardPage />;
}

// Assistant Sub-view Resolver
function getAssistantSubView(pathname: string): ReactNode {
  switch (pathname) {
    case '/assistant/patients': return <AssistantPatientsPage />;
    case '/assistant/patients/register': return <AssistantPatientRegisterPage />;
    case '/assistant/appointments': return <AssistantAppointmentsPage />;
    case '/assistant/queue': return <AssistantQueuePage />;
    case '/assistant/communications': return <AssistantCommunicationsPage />;
    case '/assistant/ai': return <AssistantAiPage />;
    case '/assistant/ai/communications': return <AssistantAiCommunicationsPage />;
    case '/assistant/orders/intake': return <AssistantSpecimenIntakePage />;
    case '/assistant/chat': return <GlobalAiChatPage role="assistant" />;
    case '/assistant/profile': return <UserProfilePage role="assistant" />;
    default: return <AssistantAppointmentsPage />;
  }
}

// Patient Sub-view Resolver
function getPatientSubView(pathname: string): ReactNode {
  switch (pathname) {
    case '/patient/dashboard': return <PatientDashboardPage />;
    case '/patient/profile': return <PatientProfilePage />;
    case '/patient/appointments': return <PatientAppointmentsPage />;
    case '/patient/medications': return <PatientMedicationsPage />;
    case '/patient/labs': return <PatientLabsPage />;
    case '/patient/ai': return <PatientAiPage />;
    case '/patient/ai/context': return <PatientAiContextPage />;
    case '/patient/ai/history': return <PatientAiHistoryPage />;
    case '/patient/vitals': return <PatientVitalsPage />;
    case '/patient/chat': return <GlobalAiChatPage role="patient" />;
    default: return <PatientDashboardPage />;
  }
}

// Central Screen Dispatcher
function renderScreen(pathname: string): ReactNode {
  // 1. Admin Control Plane (Air-Gapped Local-Only Protected)
  if (pathname.startsWith('/admin')) {
    return <AdminPortalRouter pathname={pathname} />;
  }

  // 2. Brand & Discovery
  if (pathname === '/' || pathname === '/find-doctor') return <BrandLandingPage initialTab="doctors" />;
  if (pathname === '/clinics') return <BrandLandingPage initialTab="clinics" />;

  // 3. Public Clinic Showcase
  if (pathname === '/clinic/al-nour') return <PublicClinicHomePage />;
  if (pathname === '/clinic/al-nour/doctors') return <PublicClinicDoctorsPage />;
  if (pathname === '/clinic/al-nour/services') return <PublicClinicServicesPage />;
  if (pathname === '/clinic/al-nour/booking/confirmed') return <PublicClinicBookingConfirmedPage />;

  // 4. Authentication Shell
  const authConfig = getAuthConfig(pathname);
  if (authConfig) {
    return (
      <AuthShell title={authConfig.title} subtitle={authConfig.subtitle}>
        {authConfig.component}
      </AuthShell>
    );
  }

  // 5. Doctor Portal
  if (pathname.startsWith('/doctor')) {
    const isRegistry = pathname === '/doctor/patients' || pathname === '/doctor/communications' || pathname === '/doctor/refills';
    return (
      <DoctorShell pathname={pathname} navigationVariant={isRegistry ? 'registry' : undefined}>
        {getDoctorSubView(pathname)}
      </DoctorShell>
    );
  }

  // 6. Assistant Portal
  if (pathname.startsWith('/assistant')) {
    return (
      <AssistantShell pathname={pathname}>
        {getAssistantSubView(pathname)}
      </AssistantShell>
    );
  }

  // 7. Patient Portal
  if (pathname.startsWith('/patient')) {
    return (
      <PatientShell pathname={pathname}>
        {getPatientSubView(pathname)}
      </PatientShell>
    );
  }

  return <MissingRoute pathname={pathname} />;
}

export function App() {
  const [location, setLocation] = useState(getLocation);
  const route = resolveScreenRoute(location.pathname);

  useEffect(() => {
    const handlePopState = () => setLocation(getLocation());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (!route) {
    return <MissingRoute pathname={location.pathname} />;
  }

  return (
    <ThemeProvider>
      <Suspense fallback={<PageLoadingIndicator />}>
        {renderScreen(location.pathname)}
      </Suspense>
    </ThemeProvider>
  );
}

function MissingRoute({ pathname }: { pathname: string }) {
  return (
    <main className="missing-route" aria-labelledby="missing-route-title">
      <p className="missing-route__eyebrow">Nabda Healthcare Platform</p>
      <h1 id="missing-route-title">Screen not mapped</h1>
      <p>
        No screen is registered for <code>{pathname}</code>.
      </p>
      <a href="/">Return to the platform overview</a>
    </main>
  );
}
export default App;
