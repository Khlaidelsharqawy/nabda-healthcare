import { useEffect, useState, type SyntheticEvent } from 'react';
import { resolveScreenRoute, type ScreenRoute } from './routeRegistry';
import { DoctorDashboardPage } from './features/doctor/DoctorDashboardPage';
import { DoctorAppointmentsPage } from './features/doctor/DoctorAppointmentsPage';
import { DoctorPatientsPage } from './features/doctor/DoctorPatientsPage';
import { DoctorPatientProfilePage } from './features/doctor/DoctorPatientProfilePage';
import { DoctorPatientHistoryPage } from './features/doctor/DoctorPatientHistoryPage';
import { DoctorPatientTimelinePage } from './features/doctor/DoctorPatientTimelinePage';
import { DoctorPatientNotesPage } from './features/doctor/DoctorPatientNotesPage';
import { DoctorPatientDocumentsPage } from './features/doctor/DoctorPatientDocumentsPage';
import { DoctorPatientPrescriptionsPage } from './features/doctor/DoctorPatientPrescriptionsPage';
import { DoctorOrdersPage } from './features/doctor/DoctorOrdersPage';
import { DoctorLabOrderPage } from './features/doctor/DoctorLabOrderPage';
import { DoctorImagingOrderPage } from './features/doctor/DoctorImagingOrderPage';
import { DoctorMedicationDetailsPage } from './features/doctor/DoctorMedicationDetailsPage';
import { DoctorPrescriptionWriterPage } from './features/doctor/DoctorPrescriptionWriterPage';
import { DoctorAiWorkspacePage } from './features/doctor/DoctorAiWorkspacePage';
import { DoctorPatientAiPage } from './features/doctor/DoctorPatientAiPage';
import { DoctorAiDraftPage } from './features/doctor/DoctorAiDraftPage';
import { DoctorVoiceSessionsPage } from './features/doctor/DoctorVoiceSessionsPage';
import { DoctorNewVoiceSessionPage } from './features/doctor/DoctorNewVoiceSessionPage';
import { DoctorActiveVoiceSessionPage } from './features/doctor/DoctorActiveVoiceSessionPage';
import { DoctorVoiceSessionReviewPage } from './features/doctor/DoctorVoiceSessionReviewPage';
import { DoctorCommunicationsPage } from './features/doctor/DoctorCommunicationsPage';
import { DoctorRefillsPage } from './features/doctor/DoctorRefillsPage';
import { DoctorShell } from './layouts/DoctorShell';
import { ThemeProvider } from './theme/ThemeProvider';

const getLocation = () => ({
  pathname: window.location.pathname.replace(/\/$/, '') || '/',
  search: window.location.search,
});

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

  const isDoctorDashboard = location.pathname === '/doctor/dashboard';
  const isDoctorAppointments = location.pathname === '/doctor/appointments';
  const isDoctorPatients = location.pathname === '/doctor/patients';
  const isDoctorOrders = location.pathname === '/doctor/orders';
  const isDoctorLabOrder = location.pathname === '/doctor/orders/lab/new';
  const isDoctorImagingOrder = location.pathname === '/doctor/orders/imaging/new';
  const isDoctorPrescriptionWriter = location.pathname === '/doctor/prescriptions/new';
  const isDoctorAi = location.pathname === '/doctor/ai';
  const doctorPatientAiMatch = location.pathname.match(/^\/doctor\/ai\/patient\/([^/]+)$/);
  const doctorAiDraftMatch = location.pathname.match(/^\/doctor\/ai\/drafts\/([^/]+)$/);
  const isDoctorVoiceSessions = location.pathname === '/doctor/voice-sessions';
  const isDoctorNewVoiceSession = location.pathname === '/doctor/voice-sessions/new';
  const doctorVoiceReviewMatch = location.pathname.match(/^\/doctor\/voice-sessions\/([^/]+)\/review$/);
  const doctorVoiceSessionMatch = location.pathname.match(/^\/doctor\/voice-sessions\/([^/]+)$/);
  const isDoctorCommunications = location.pathname === '/doctor/communications';
  const isDoctorRefills = location.pathname === '/doctor/refills';
  const medicationDetailsMatch = location.pathname.match(/^\/doctor\/medications\/([^/]+)$/);
  const isDoctorPatientProfile = /^\/doctor\/patients\/[^/]+$/.test(location.pathname);
  const patientHistoryMatch = location.pathname.match(/^\/doctor\/patients\/([^/]+)\/history$/);
  const patientTimelineMatch = location.pathname.match(/^\/doctor\/patients\/([^/]+)\/timeline$/);
  const patientNotesMatch = location.pathname.match(/^\/doctor\/patients\/([^/]+)\/notes$/);
  const patientDocumentsMatch = location.pathname.match(/^\/doctor\/patients\/([^/]+)\/documents$/);
  const patientPrescriptionsMatch = location.pathname.match(/^\/doctor\/patients\/([^/]+)\/prescriptions$/);
  const referenceMode = new URLSearchParams(location.search).get('reference') === 'stitch';

  return (
    <ThemeProvider>
      {isDoctorDashboard && !referenceMode ? (
        <DoctorShell pathname={location.pathname}>
          <DoctorDashboardPage />
        </DoctorShell>
      ) : isDoctorAppointments && !referenceMode ? (
        <DoctorShell pathname={location.pathname}>
          <DoctorAppointmentsPage />
        </DoctorShell>
      ) : isDoctorPatients && !referenceMode ? (
        <DoctorShell pathname={location.pathname} navigationVariant="registry">
          <DoctorPatientsPage />
        </DoctorShell>
      ) : isDoctorPatientProfile && !referenceMode ? (
        <DoctorShell pathname={location.pathname}>
          <DoctorPatientProfilePage patientId={location.pathname.split('/').at(-1) ?? 'PT-DEMO-01'} />
        </DoctorShell>
      ) : patientHistoryMatch && !referenceMode ? (
        <DoctorShell pathname={location.pathname}>
          <DoctorPatientHistoryPage patientId={patientHistoryMatch[1]} />
        </DoctorShell>
      ) : patientTimelineMatch && !referenceMode ? (
        <DoctorShell pathname={location.pathname}>
          <DoctorPatientTimelinePage patientId={patientTimelineMatch[1]} />
        </DoctorShell>
      ) : patientNotesMatch && !referenceMode ? (
        <DoctorShell pathname={location.pathname}>
          <DoctorPatientNotesPage patientId={patientNotesMatch[1]} />
        </DoctorShell>
      ) : patientDocumentsMatch && !referenceMode ? (
        <DoctorShell pathname={location.pathname}>
          <DoctorPatientDocumentsPage patientId={patientDocumentsMatch[1]} />
        </DoctorShell>
      ) : patientPrescriptionsMatch && !referenceMode ? (
        <DoctorShell pathname={location.pathname}>
          <DoctorPatientPrescriptionsPage patientId={patientPrescriptionsMatch[1]} />
        </DoctorShell>
      ) : isDoctorOrders && !referenceMode ? (
        <DoctorShell pathname={location.pathname}>
          <DoctorOrdersPage />
        </DoctorShell>
      ) : isDoctorLabOrder && !referenceMode ? (
        <DoctorShell pathname={location.pathname}>
          <DoctorLabOrderPage />
        </DoctorShell>
      ) : isDoctorImagingOrder && !referenceMode ? (
        <DoctorShell pathname={location.pathname}>
          <DoctorImagingOrderPage />
        </DoctorShell>
      ) : isDoctorPrescriptionWriter && !referenceMode ? (
        <DoctorShell pathname={location.pathname}>
          <DoctorPrescriptionWriterPage />
        </DoctorShell>
      ) : medicationDetailsMatch && !referenceMode ? (
        <DoctorShell pathname={location.pathname}>
          <DoctorMedicationDetailsPage medicationId={medicationDetailsMatch[1]} />
        </DoctorShell>
      ) : isDoctorAi && !referenceMode ? (
        <DoctorShell pathname={location.pathname}>
          <DoctorAiWorkspacePage />
        </DoctorShell>
      ) : doctorPatientAiMatch && !referenceMode ? (
        <DoctorShell pathname={location.pathname}>
          <DoctorPatientAiPage patientId={doctorPatientAiMatch[1]} />
        </DoctorShell>
      ) : doctorAiDraftMatch && !referenceMode ? (
        <DoctorShell pathname={location.pathname}>
          <DoctorAiDraftPage draftId={doctorAiDraftMatch[1]} />
        </DoctorShell>
      ) : isDoctorVoiceSessions && !referenceMode ? (
        <DoctorShell pathname={location.pathname}>
          <DoctorVoiceSessionsPage />
        </DoctorShell>
      ) : isDoctorNewVoiceSession && !referenceMode ? (
        <DoctorShell pathname={location.pathname}>
          <DoctorNewVoiceSessionPage />
        </DoctorShell>
      ) : doctorVoiceReviewMatch && !referenceMode ? (
        <DoctorShell pathname={location.pathname}>
          <DoctorVoiceSessionReviewPage sessionId={doctorVoiceReviewMatch[1]} />
        </DoctorShell>
      ) : doctorVoiceSessionMatch && !referenceMode ? (
        <DoctorShell pathname={location.pathname}>
          <DoctorActiveVoiceSessionPage sessionId={doctorVoiceSessionMatch[1]} />
        </DoctorShell>
      ) : isDoctorCommunications && !referenceMode ? (
        <DoctorShell pathname={location.pathname} navigationVariant="registry">
          <DoctorCommunicationsPage />
        </DoctorShell>
      ) : isDoctorRefills && !referenceMode ? (
        <DoctorShell pathname={location.pathname} navigationVariant="registry">
          <DoctorRefillsPage />
        </DoctorShell>
      ) : (
        <StitchScreen route={route} />
      )}
    </ThemeProvider>
  );
}

function StitchScreen({ route }: { route: ScreenRoute }) {
  const handleFrameLoad = (event: SyntheticEvent<HTMLIFrameElement>) => {
    const frame = event.currentTarget;
    const document = frame.contentDocument;
    if (!document) return;

    document.addEventListener('click', (clickEvent) => {
      const target = clickEvent.target as HTMLElement | null;
      const anchor = target?.closest('a[href]');
      const href = anchor?.getAttribute('href');
      if (!href?.startsWith('/')) return;

      clickEvent.preventDefault();
      window.history.pushState({}, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, { capture: true });
  };

  return (
    <main className="screen-host" data-role={route.role} data-route={route.path}>
      <iframe
        key={route.source}
        className="stitch-screen"
        title={route.label}
        src={route.source}
        onLoad={handleFrameLoad}
      />
    </main>
  );
}

function MissingRoute({ pathname }: { pathname: string }) {
  return (
    <main className="missing-route" aria-labelledby="missing-route-title">
      <p className="missing-route__eyebrow">AegisHealth frontend</p>
      <h1 id="missing-route-title">Screen not mapped</h1>
      <p>
        No Stitch screen is registered for <code>{pathname}</code>. This route remains intentionally
        unmapped until its screen evidence is confirmed.
      </p>
      <a href="/">Return to the platform overview</a>
    </main>
  );
}
