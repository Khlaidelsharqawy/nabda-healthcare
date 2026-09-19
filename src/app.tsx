import { lazy, Suspense, useEffect, useState } from 'react';
import { resolveScreenRoute } from './routeRegistry';
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
import { PageLoadingIndicator } from './components/ui/LoadingScreen';
import { AuthShell } from './layouts/AuthShell';
import { DoctorShell } from './layouts/DoctorShell';
import { AssistantShell } from './layouts/AssistantShell';
import { PatientShell } from './layouts/PatientShell';
import { AdminShell } from './layouts/AdminShell';
import { ThemeProvider } from './theme/ThemeProvider';

const getLocation = () => ({
  pathname: window.location.pathname.replace(/\/$/, '') || '/',
  search: window.location.search,
});

function renderScreen(pathname: string) {
  if (pathname.startsWith('/admin')) {
    return <AdminPortalRouter pathname={pathname} />;
  }
  if (pathname === '/' || pathname === '/find-doctor') return <BrandLandingPage initialTab="doctors" />;
  if (pathname === '/clinics') return <BrandLandingPage initialTab="clinics" />;
  if (pathname === '/login') {
    return (
      <AuthShell title="Login" subtitle="Secure access for Nabda Healthcare Platform.">
        <AuthLoginPage />
      </AuthShell>
    );
  }
  if (pathname === '/signup') {
    return (
      <AuthShell title="Patient Registration" subtitle="Create your personal healthcare account to manage care and appointments.">
        <AuthSignupPage />
      </AuthShell>
    );
  }
  if (pathname === '/request-access') {
    return (
      <AuthShell title="Healthcare Provider Access" subtitle="Clinical onboarding and credential verification for healthcare facilities.">
        <AuthRequestAccessPage />
      </AuthShell>
    );
  }
  if (pathname === '/forgot-password') {
    return (
      <AuthShell title="Account recovery" subtitle="Demo-only flow: this frontend build does not send emails.">
        <AuthPasswordRecoveryPage />
      </AuthShell>
    );
  }
  if (pathname === '/reset-password') {
    return (
      <AuthShell title="Reset password" subtitle="Preview only. Passwords are not stored or validated against a live system.">
        <AuthResetPasswordPage />
      </AuthShell>
    );
  }
  if (pathname === '/verify') {
    return (
      <AuthShell title="Verify account" subtitle="Demo-only verification. No live identity provider is connected.">
        <AuthVerifyPage />
      </AuthShell>
    );
  }
  if (pathname === '/session-expired') {
    return (
      <AuthShell title="Session expired" subtitle="Your current preview session has ended.">
        <AuthSessionExpiredPage />
      </AuthShell>
    );
  }
  if (pathname === '/unauthorized') {
    return (
      <AuthShell title="Unauthorized access" subtitle="This is a frontend-only access state.">
        <AuthUnauthorizedPage />
      </AuthShell>
    );
  }

  if (pathname === '/clinic/al-nour') return <PublicClinicHomePage />;
  if (pathname === '/clinic/al-nour/doctors') return <PublicClinicDoctorsPage />;
  if (pathname === '/clinic/al-nour/services') return <PublicClinicServicesPage />;
  if (pathname === '/clinic/al-nour/booking/confirmed') return <PublicClinicBookingConfirmedPage />;


  if (pathname === '/doctor/dashboard') {
    return (
      <DoctorShell pathname={pathname}>
        <DoctorDashboardPage />
      </DoctorShell>
    );
  }
  if (pathname === '/doctor/appointments') {
    return (
      <DoctorShell pathname={pathname}>
        <DoctorAppointmentsPage />
      </DoctorShell>
    );
  }
  if (pathname === '/doctor/patients') {
    return (
      <DoctorShell pathname={pathname} navigationVariant="registry">
        <DoctorPatientsPage />
      </DoctorShell>
    );
  }

  const patientHistoryMatch = pathname.match(/^\/doctor\/patients\/([^/]+)\/history$/);
  if (patientHistoryMatch) {
    return (
      <DoctorShell pathname={pathname}>
        <DoctorPatientHistoryPage patientId={patientHistoryMatch[1]} />
      </DoctorShell>
    );
  }
  const patientTimelineMatch = pathname.match(/^\/doctor\/patients\/([^/]+)\/timeline$/);
  if (patientTimelineMatch) {
    return (
      <DoctorShell pathname={pathname}>
        <DoctorPatientTimelinePage patientId={patientTimelineMatch[1]} />
      </DoctorShell>
    );
  }
  const patientNotesMatch = pathname.match(/^\/doctor\/patients\/([^/]+)\/notes$/);
  if (patientNotesMatch) {
    return (
      <DoctorShell pathname={pathname}>
        <DoctorPatientNotesPage patientId={patientNotesMatch[1]} />
      </DoctorShell>
    );
  }
  const patientDocumentsMatch = pathname.match(/^\/doctor\/patients\/([^/]+)\/documents$/);
  if (patientDocumentsMatch) {
    return (
      <DoctorShell pathname={pathname}>
        <DoctorPatientDocumentsPage patientId={patientDocumentsMatch[1]} />
      </DoctorShell>
    );
  }
  const patientPrescriptionsMatch = pathname.match(/^\/doctor\/patients\/([^/]+)\/prescriptions$/);
  if (patientPrescriptionsMatch) {
    return (
      <DoctorShell pathname={pathname}>
        <DoctorPatientPrescriptionsPage patientId={patientPrescriptionsMatch[1]} />
      </DoctorShell>
    );
  }

  if (/^\/doctor\/patients\/[^/]+$/.test(pathname)) {
    return (
      <DoctorShell pathname={pathname}>
        <DoctorPatientProfilePage patientId={pathname.split('/').at(-1) ?? 'PT-DEMO-01'} />
      </DoctorShell>
    );
  }

  if (pathname === '/doctor/orders') {
    return (
      <DoctorShell pathname={pathname}>
        <DoctorOrdersPage />
      </DoctorShell>
    );
  }
  if (pathname === '/doctor/orders/lab/new') {
    return (
      <DoctorShell pathname={pathname}>
        <DoctorLabOrderPage />
      </DoctorShell>
    );
  }
  if (pathname === '/doctor/orders/imaging/new') {
    return (
      <DoctorShell pathname={pathname}>
        <DoctorImagingOrderPage />
      </DoctorShell>
    );
  }
  if (pathname === '/doctor/prescriptions/new') {
    return (
      <DoctorShell pathname={pathname}>
        <DoctorPrescriptionWriterPage />
      </DoctorShell>
    );
  }

  const medicationDetailsMatch = pathname.match(/^\/doctor\/medications\/([^/]+)$/);
  if (medicationDetailsMatch) {
    return (
      <DoctorShell pathname={pathname}>
        <DoctorMedicationDetailsPage medicationId={medicationDetailsMatch[1]} />
      </DoctorShell>
    );
  }

  if (pathname === '/doctor/ai') {
    return (
      <DoctorShell pathname={pathname}>
        <DoctorAiWorkspacePage />
      </DoctorShell>
    );
  }

  const doctorPatientAiMatch = pathname.match(/^\/doctor\/ai\/patient\/([^/]+)$/);
  if (doctorPatientAiMatch) {
    return (
      <DoctorShell pathname={pathname}>
        <DoctorPatientAiPage patientId={doctorPatientAiMatch[1]} />
      </DoctorShell>
    );
  }
  const doctorAiDraftMatch = pathname.match(/^\/doctor\/ai\/drafts\/([^/]+)$/);
  if (doctorAiDraftMatch) {
    return (
      <DoctorShell pathname={pathname}>
        <DoctorAiDraftPage draftId={doctorAiDraftMatch[1]} />
      </DoctorShell>
    );
  }

  if (pathname === '/doctor/voice-sessions') {
    return (
      <DoctorShell pathname={pathname}>
        <DoctorVoiceSessionsPage />
      </DoctorShell>
    );
  }
  if (pathname === '/doctor/voice-sessions/new') {
    return (
      <DoctorShell pathname={pathname}>
        <DoctorNewVoiceSessionPage />
      </DoctorShell>
    );
  }

  const doctorVoiceReviewMatch = pathname.match(/^\/doctor\/voice-sessions\/([^/]+)\/review$/);
  if (doctorVoiceReviewMatch) {
    return (
      <DoctorShell pathname={pathname}>
        <DoctorVoiceSessionReviewPage sessionId={doctorVoiceReviewMatch[1]} />
      </DoctorShell>
    );
  }
  const doctorVoiceSessionMatch = pathname.match(/^\/doctor\/voice-sessions\/([^/]+)$/);
  if (doctorVoiceSessionMatch) {
    return (
      <DoctorShell pathname={pathname}>
        <DoctorActiveVoiceSessionPage sessionId={doctorVoiceSessionMatch[1]} />
      </DoctorShell>
    );
  }

  if (pathname === '/doctor/communications') {
    return (
      <DoctorShell pathname={pathname} navigationVariant="registry">
        <DoctorCommunicationsPage />
      </DoctorShell>
    );
  }
  if (pathname === '/doctor/refills') {
    return (
      <DoctorShell pathname={pathname} navigationVariant="registry">
        <DoctorRefillsPage />
      </DoctorShell>
    );
  }
  if (pathname === '/doctor/chat') {
    return (
      <DoctorShell pathname={pathname}>
        <GlobalAiChatPage role="doctor" />
      </DoctorShell>
    );
  }
  if (pathname === '/doctor/profile') {
    return (
      <DoctorShell pathname={pathname}>
        <UserProfilePage role="doctor" />
      </DoctorShell>
    );
  }

  if (pathname === '/assistant/patients') {
    return (
      <AssistantShell pathname={pathname}>
        <AssistantPatientsPage />
      </AssistantShell>
    );
  }
  if (pathname === '/assistant/patients/register') {
    return (
      <AssistantShell pathname={pathname}>
        <AssistantPatientRegisterPage />
      </AssistantShell>
    );
  }
  if (pathname === '/assistant/appointments') {
    return (
      <AssistantShell pathname={pathname}>
        <AssistantAppointmentsPage />
      </AssistantShell>
    );
  }
  if (pathname === '/assistant/queue') {
    return (
      <AssistantShell pathname={pathname}>
        <AssistantQueuePage />
      </AssistantShell>
    );
  }
  if (pathname === '/assistant/communications') {
    return (
      <AssistantShell pathname={pathname}>
        <AssistantCommunicationsPage />
      </AssistantShell>
    );
  }
  if (pathname === '/assistant/ai') {
    return (
      <AssistantShell pathname={pathname}>
        <AssistantAiPage />
      </AssistantShell>
    );
  }
  if (pathname === '/assistant/ai/communications') {
    return (
      <AssistantShell pathname={pathname}>
        <AssistantAiCommunicationsPage />
      </AssistantShell>
    );
  }
  if (pathname === '/assistant/orders/intake') {
    return (
      <AssistantShell pathname={pathname}>
        <AssistantSpecimenIntakePage />
      </AssistantShell>
    );
  }
  if (pathname === '/assistant/chat') {
    return (
      <AssistantShell pathname={pathname}>
        <GlobalAiChatPage role="assistant" />
      </AssistantShell>
    );
  }
  if (pathname === '/assistant/profile') {
    return (
      <AssistantShell pathname={pathname}>
        <UserProfilePage role="assistant" />
      </AssistantShell>
    );
  }

  if (pathname === '/patient/dashboard') {
    return (
      <PatientShell pathname={pathname}>
        <PatientDashboardPage />
      </PatientShell>
    );
  }
  if (pathname === '/patient/profile') {
    return (
      <PatientShell pathname={pathname}>
        <PatientProfilePage />
      </PatientShell>
    );
  }
  if (pathname === '/patient/appointments') {
    return (
      <PatientShell pathname={pathname}>
        <PatientAppointmentsPage />
      </PatientShell>
    );
  }
  if (pathname === '/patient/medications') {
    return (
      <PatientShell pathname={pathname}>
        <PatientMedicationsPage />
      </PatientShell>
    );
  }
  if (pathname === '/patient/labs') {
    return (
      <PatientShell pathname={pathname}>
        <PatientLabsPage />
      </PatientShell>
    );
  }
  if (pathname === '/patient/ai') {
    return (
      <PatientShell pathname={pathname}>
        <PatientAiPage />
      </PatientShell>
    );
  }
  if (pathname === '/patient/ai/context') {
    return (
      <PatientShell pathname={pathname}>
        <PatientAiContextPage />
      </PatientShell>
    );
  }
  if (pathname === '/patient/ai/history') {
    return (
      <PatientShell pathname={pathname}>
        <PatientAiHistoryPage />
      </PatientShell>
    );
  }
  if (pathname === '/patient/vitals') {
    return (
      <PatientShell pathname={pathname}>
        <PatientVitalsPage />
      </PatientShell>
    );
  }
  if (pathname === '/patient/chat') {
    return (
      <PatientShell pathname={pathname}>
        <GlobalAiChatPage role="patient" />
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
