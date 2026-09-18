# Doctor React Conversion

## Batch 04 and Batch 05 Milestones 1–7

Converted real React screens:

- `/doctor/dashboard` — stabilized Batch 02 React dashboard baseline.
- `/doctor/appointments` — real React appointments/schedule screen using DoctorShell.
- `/doctor/patients` — real React patient registry using DoctorShell and a registry navigation variant.
- `/doctor/patients/PT-DEMO-01` — real React patient profile overview using the shared DoctorShell and a reusable patient workspace shell.
- `/doctor/patients/[id]/history` — real React patient medical history using the shared patient workspace shell.
- `/doctor/patients/[id]/timeline` — real React clinical timeline using the shared patient workspace shell.
- `/doctor/patients/[id]/notes` — real React clinical notes archive and SOAP-style detail view using the shared patient workspace shell.
- `/doctor/patients/[id]/documents` — real React clinical documents repository and inspector using the shared patient workspace shell.
- `/doctor/patients/[id]/prescriptions` — real React synthetic prescription regimen workspace using the shared patient workspace shell.
- `/doctor/orders` — real React clinical orders registry using DoctorShell and typed synthetic order fixtures.
- `/doctor/orders/lab/new` — real React laboratory order form using the canonical Lab Order Stitch variant 1.
- `/doctor/orders/imaging/new` — real React diagnostic imaging order form using the frozen Imaging Order source.
- `/doctor/medications/[id]` — real React medication details screen using deterministic synthetic medication data and dynamic medication IDs.
- `/doctor/prescriptions/new` — real React prescription writer with local synthetic draft state, structured medication entries, and source-supported quantity/instruction fields.
- `/doctor/ai` — real React Doctor AI workspace with local prompt templates, bounded synthetic context, and non-final assistance output.
- `/doctor/ai/patient/[id]` — real React patient-scoped AI workspace with dynamic patient IDs and an explicit bounded-scope safety panel.
- `/doctor/ai/drafts/[id]` — real React clinical draft review surface with editable local SOAP fields and demo-only review actions.
- `/doctor/voice-sessions` — real React synthetic Voice Session registry with search, filters, statuses, and review navigation.
- `/doctor/voice-sessions/new` — real React synthetic session setup form with local consent-like demonstration state and no microphone access.
- `/doctor/voice-sessions/[id]` — real React dynamic synthetic active session with local pause/resume state, transcript turns, and SOAP preview.
- `/doctor/voice-sessions/[id]/review` — real React dynamic review surface with SOAP editing, transcript/actions tabs, and demo-only workflow actions.
- `/doctor/communications` — real React clinical inquiries and triage inbox with deterministic inquiry fixtures, local filters, selected thread context, assistive draft handling, and demo-only response actions.
- `/doctor/refills` — real React prescription refill approval queue with deterministic request fixtures, local search/filter/selection, synthetic prescription context, and demo-only review actions.

Each converted route keeps its untouched source available at `?reference=stitch`.

## Reusable Components

- `DoctorShell`
- `DoctorHeader`
- `DoctorSidebar`
- `MaterialIcon`
- `PatientWorkspaceShell`
- `PatientWorkspaceNavigation`
- extracted theme tokens and ThemeProvider
- typed local Doctor appointment and patient fixtures

All six patient workspace pages reuse the same patient workspace shell and route-aware workspace navigation. The Orders index reuses DoctorShell and preserves the existing fallback routes for order-entry screens.

The two Milestone 2 forms reuse a small shared clinical order form shell while keeping Lab and Imaging source-specific controls distinct.

## Fixture Strategy

`src/features/doctor/fixtures.ts` contains deterministic synthetic records with tenant IDs and demo IDs. No API calls, persistence, or backend behavior exists.

## Patient Workspace Status

Implemented:

- `/doctor/patients/PT-DEMO-01` overview route
- `/doctor/patients/[id]/history` history route
- `/doctor/patients/[id]/timeline` timeline route
- `/doctor/patients/[id]/notes` notes route
- `/doctor/patients/[id]/documents` documents route
- `/doctor/patients/[id]/prescriptions` prescriptions route
- reusable patient workspace shell and shared navigation structure
- synthetic profile, history, timeline, notes, documents, and prescriptions fixtures
- synthetic clinical order registry fixtures
- synthetic laboratory and imaging form state; no persisted order fixtures

Deferred / not implemented in Batch 04:

- No patient-workspace route remains deferred.

Prescription actions remain local/demo-only and do not connect to refill workflows, APIs, persistence, or pharmacy services.

Batch 05 Milestone 1 order actions remain local/demo-only. Lab and imaging entry links continue to use the Stitch fallback routes.

Batch 05 Milestone 2 form actions remain local/demo-only. Submit, Save Draft, and validation feedback do not create or persist clinical orders.

Batch 05 Milestone 3 medication and prescription actions remain local/demo-only. Medication actions do not edit or discontinue a real medication, and prescription actions do not sign, transmit, persist, or dispense a prescription.

Batch 05 Milestone 4 AI actions remain local/demo-only. No external AI service, API, persistence, clinical signing, autonomous diagnosis, prescribing, or clinical-record commit is implemented. Patient-scoped AI is bounded to the dynamic synthetic patient context shown in the route.

Batch 05 Milestone 5 Voice Session actions remain local/demo-only. No microphone, MediaRecorder, WebRTC, WebSocket, speech, audio upload, audio storage, transcription service, persistence, or clinical-record commit is implemented. Transcript, waveform, recording, and review states are deterministic UI simulations.

Batch 05 Milestone 6 Communications actions remain local/demo-only. No realtime transport, WebSocket, email, SMS, WhatsApp, push notification, external messaging API, backend endpoint, persistence, or message delivery is implemented. Inquiry selection, filtering, drafting, triage, and simulated send feedback remain browser-local.

Batch 05 Milestone 7 Refill actions remain local/demo-only. No prescription or refill is renewed, signed, transmitted, persisted, sent to a pharmacy, or modified. Quantity, authorized refill, approval, rejection, consultation, and information-request controls update only deterministic browser-local state.

## Visual Status

The complete patient workspace set remains checked against its Stitch references. The Orders index, both order forms, medication details, prescription writer, the three Doctor AI surfaces, the four Voice Session surfaces, the Communications inbox, and the Refill Approval Queue are implemented and validated against their Stitch references at desktop and narrow responsive viewports. Backend clinical persistence, prescribing, dispensing, AI services, voice services, communication delivery, pharmacy integration, and order execution remain outside scope.
