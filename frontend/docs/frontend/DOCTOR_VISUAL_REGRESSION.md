# Doctor Visual Regression

## `/doctor/dashboard`

- Reference: `frontend/screens/doctor/doctor_portal_clinical_dashboard_practice_overview/code.html`
- React route: `/doctor/dashboard`
- Reference route: `/doctor/dashboard?reference=stitch`
- Viewport: integrated browser desktop viewport, 960px screenshot width
- Result: PASS for the Batch 02 shell baseline; rechecked after Milestone 1 additions
- Observed differences: React dashboard remains a representative content slice rather than the complete source body
- Corrections: sidebar width, logo asset, header identity width, and action alignment corrected in Batch 02
- Final status: PASS WITH EXPLICIT SCOPE GAP

## `/doctor/appointments`

- Reference: `frontend/screens/doctor/doctor_portal_appointments_clinical_schedule/code.html`
- React route: `/doctor/appointments`
- Reference route: `/doctor/appointments?reference=stitch`
- Viewport: integrated browser desktop viewport, 960px screenshot width
- Result: PASS WITH SCOPE GAPS
- Observed differences: React content is a controlled representative schedule slice; the source continues below the captured viewport with additional schedule detail.
- Corrections: reused the measured Doctor shell, extracted scheduling cards, progress segments, AI card, and appointment rows from the Stitch evidence.
- Final status: PASS WITH SCOPE GAP; desktop screenshot captured and mobile route load verified.

## `/doctor/patients`

- Reference: `frontend/screens/doctor/doctor_portal_patient_registry_doctor_patients/code.html`
- React route: `/doctor/patients`
- Reference route: `/doctor/patients?reference=stitch`
- Viewport: integrated browser desktop viewport, 960px screenshot width
- Result: PASS WITH SCOPE GAPS
- Observed differences: the source registry contains more table/detail content below the captured viewport and a screen-specific navigation variant.
- Corrections: added the scope-attestation band, KPI row, demo state controls, filters, registry rows, and registry navigation variant using React.
- Final status: PASS WITH SCOPE GAP; desktop screenshot captured and state interaction verified.

## Cross-Screen Checks

RTL and dark-mode interaction was verified on the shared Doctor shell in Batch 02. Milestone 1 routes reuse that foundation. The appointment route loaded at a 390px viewport without the reference iframe; full pixel comparison at mobile and a reliable browser-helper language click are NOT VERIFIED. Direct dynamic patient-profile route resolution is verified; patient-row click navigation remains NOT VERIFIED in the integrated browser helper.

Batch 05 Milestone 4 source mappings:

- `/doctor/ai` -> `frontend/screens/doctor/doctor_portal_ai_workspace_doctor_ai/code.html`
- `/doctor/ai/patient/[id]` -> `frontend/screens/doctor/doctor_portal_patient_scoped_ai_workspace_doctor_ai_patient_id/code.html`
- `/doctor/ai/drafts/[id]` -> `frontend/screens/doctor/doctor_portal_clinical_draft_review_doctor_ai_drafts_id/code.html`

The three Doctor AI routes use real React in normal mode and the frozen Stitch iframe in `?reference=stitch` mode. Runtime checks cover normal/reference rendering, dynamic IDs, RTL/LTR, dark mode, and 390px responsive layout. Keyboard-only traversal and pixel-diff validation remain explicit gaps.

Batch 05 Milestone 5 source mappings:

- `/doctor/voice-sessions` -> `frontend/screens/doctor/doctor_portal_voice_sessions_ambient_scribe_review/code.html`
- `/doctor/voice-sessions/new` -> `frontend/screens/doctor/doctor_portal_new_voice_session_doctor_voice_sessions_new/code.html`
- `/doctor/voice-sessions/[id]` -> `frontend/screens/doctor/doctor_portal_active_voice_session_doctor_voice_sessions_id/code.html`
- `/doctor/voice-sessions/[id]/review` -> `frontend/screens/doctor/doctor_portal_voice_session_review_doctor_voice_sessions_id_review/code.html`

The four Voice Session routes use real React in normal mode and the frozen Stitch iframe in `?reference=stitch` mode. Voice, recording, waveform, transcript, and review behavior is deterministic UI simulation only. Runtime checks cover normal/reference rendering, dynamic IDs, local filters and controls, RTL/LTR, dark mode, and 390px responsive layout. Keyboard-only traversal and pixel-diff validation remain explicit gaps.

Batch 05 Milestone 6 source mapping:

- `/doctor/communications` -> `frontend/screens/doctor/doctor_portal_clinical_inquiries_patient_triage_inbox_doctor_communications/code.html`

The Communications route uses real React in normal mode and the frozen Stitch iframe in `?reference=stitch` mode. Inquiry selection, search, filters, draft application/discard, response editing, triage actions, and simulated send feedback remain local-only. Runtime checks cover normal/reference rendering, selected-thread behavior, RTL/LTR, dark mode, and 390px responsive layout. Keyboard-only traversal and pixel-diff validation remain explicit gaps.

Batch 05 Milestone 7 source mapping:

- `/doctor/refills` -> `frontend/screens/doctor/doctor_portal_prescription_refill_approval_queue_doctor_refills/code.html`

The Refill Approval Queue uses real React in normal mode and the frozen Stitch iframe in `?reference=stitch` mode. Request selection, search, filters, quantity/refill selectors, review notes, approval, rejection, consultation, and information-request actions remain local-only. Runtime checks cover normal/reference rendering, active sidebar state, RTL/LTR, dark mode, and 390px responsive layout. Keyboard-only traversal and pixel-diff validation remain explicit gaps.
