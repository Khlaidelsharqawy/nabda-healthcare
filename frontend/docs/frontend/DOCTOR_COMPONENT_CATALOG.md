# Doctor React Component Catalog

| Component | Location | Responsibility | Status |
|---|---|---|---|
| `DoctorShell` | `src/layouts/DoctorShell.tsx` | Shared Doctor header/sidebar/content boundary | implemented |
| `DoctorHeader` | `src/components/navigation/DoctorHeader.tsx` | Doctor identity, language, theme, notifications | implemented |
| `DoctorSidebar` | `src/components/navigation/DoctorSidebar.tsx` | Doctor navigation and AI status | implemented |
| `MaterialIcon` | `src/components/ui/MaterialIcon.tsx` | Stitch Material Symbols rendering | implemented |
| `DoctorDashboardPage` | `src/features/doctor/DoctorDashboardPage.tsx` | Existing Batch 02 dashboard slice | implemented |
| `DoctorAppointmentsPage` | `src/features/doctor/DoctorAppointmentsPage.tsx` | Clinic load, scheduling AI, appointments | implemented |
| `DoctorPatientsPage` | `src/features/doctor/DoctorPatientsPage.tsx` | Scope bar, patient KPIs, filters, roster states | implemented |
| `PatientWorkspaceShell` | `src/features/doctor/PatientWorkspaceShell.tsx` | Shared patient header, breadcrumb, workspace layout, patient identity context | implemented |
| `PatientWorkspaceNavigation` | `src/features/doctor/PatientWorkspaceNavigation.tsx` | Route-aware patient workspace tabs for overview/history/timeline/notes/documents/prescriptions | implemented |
| `DoctorPatientProfilePage` | `src/features/doctor/DoctorPatientProfilePage.tsx` | Patient overview content within the patient workspace shell | implemented |
| `DoctorPatientHistoryPage` | `src/features/doctor/DoctorPatientHistoryPage.tsx` | Synthetic medical history sections within the patient workspace shell | implemented |
| `DoctorPatientTimelinePage` | `src/features/doctor/DoctorPatientTimelinePage.tsx` | Filterable synthetic chronological clinical event feed | implemented |
| `DoctorPatientNotesPage` | `src/features/doctor/DoctorPatientNotesPage.tsx` | Synthetic clinical notes archive, filters, selection, and SOAP-style detail view | implemented |
| `DoctorPatientDocumentsPage` | `src/features/doctor/DoctorPatientDocumentsPage.tsx` | Synthetic document repository, category filters, selection, and preview inspector | implemented |
| `DoctorPatientPrescriptionsPage` | `src/features/doctor/DoctorPatientPrescriptionsPage.tsx` | Synthetic prescription regimen cards, status filters, search, and demo-only actions | implemented |
| `DoctorOrdersPage` | `src/features/doctor/DoctorOrdersPage.tsx` | Synthetic clinical order registry, filters, selection, and demo-only row actions | implemented |
| `DoctorClinicalOrderFormPage` | `src/features/doctor/DoctorClinicalOrderFormPage.tsx` | Shared Lab/Imaging form shell with source-specific controls and local demo validation | implemented |
| `DoctorLabOrderPage` | `src/features/doctor/DoctorLabOrderPage.tsx` | Canonical variant 1 laboratory requisition route | implemented |
| `DoctorImagingOrderPage` | `src/features/doctor/DoctorImagingOrderPage.tsx` | Diagnostic imaging requisition route | implemented |
| `DoctorMedicationDetailsPage` | `src/features/doctor/DoctorMedicationDetailsPage.tsx` | Dynamic synthetic medication details with display-only clinical fields and demo actions | implemented |
| `DoctorPrescriptionWriterPage` | `src/features/doctor/DoctorPrescriptionWriterPage.tsx` | Local synthetic prescription draft with structured medication entries and demo-only review/save actions | implemented |
| `DoctorAiWorkspacePage` | `src/features/doctor/DoctorAiWorkspacePage.tsx` | General Doctor AI workspace with local prompt templates, synthetic response stream, and bounded-context messaging | implemented |
| `DoctorPatientAiPage` | `src/features/doctor/DoctorPatientAiPage.tsx` | Dynamic patient-scoped AI workspace with authorized-scope boundary, synthetic context, and local query actions | implemented |
| `DoctorAiDraftPage` | `src/features/doctor/DoctorAiDraftPage.tsx` | Dynamic clinical AI draft review with editable synthetic SOAP fields and demo-only workflow actions | implemented |
| `DoctorVoiceSessionsPage` | `src/features/doctor/DoctorVoiceSessionsPage.tsx` | Synthetic Voice Session registry with search, status filters, metrics, and local navigation | implemented |
| `DoctorNewVoiceSessionPage` | `src/features/doctor/DoctorNewVoiceSessionPage.tsx` | Synthetic session setup form with appointment context, purpose, and demo-only start state | implemented |
| `DoctorActiveVoiceSessionPage` | `src/features/doctor/DoctorActiveVoiceSessionPage.tsx` | Dynamic synthetic active session with simulated controls, transcript turns, waveform, and SOAP preview | implemented |
| `DoctorVoiceSessionReviewPage` | `src/features/doctor/DoctorVoiceSessionReviewPage.tsx` | Dynamic synthetic review surface with SOAP editing, transcript/actions tabs, and demo-only actions | implemented |
| `DoctorCommunicationsPage` | `src/features/doctor/DoctorCommunicationsPage.tsx` | Clinical inquiry triage inbox with search/filter state, selected synthetic thread, bounded patient context, local composer, and demo-only actions | implemented |
| `DoctorRefillsPage` | `src/features/doctor/DoctorRefillsPage.tsx` | Synthetic prescription refill approval queue with filters, request selection, prescription context, local notes, and demo-only decisions | implemented |
| Doctor fixture records | `src/features/doctor/fixtures.ts` | Typed synthetic appointments/patients/profile/history/timeline/notes/documents/prescriptions/order data | implemented |

No backend authorization is implied by shell navigation or fixture data. Patient and tenant scope remain frontend presentation contracts until backend integration. Medication, prescription, clinical-order, AI, Voice Session, Communications, and Refill actions are local/demo-only and do not implement refill renewal, signing, persistence, order execution, dispensing, pharmacy workflows, e-prescribing, external AI/voice calls, microphone access, audio storage, transcription services, realtime messaging, external communication, or clinical-record commits. Patient-scoped AI, Voice Sessions, Communications, and Refills are bounded to displayed synthetic context. Lab variant 2 remains an inert historical/reference artifact; variant 1 is the canonical route source.
