import { useState } from 'react';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { doctorAiDraft } from './fixtures';

type DraftField = 'subjective' | 'objective' | 'assessment' | 'plan';

export function DoctorAiDraftPage({ draftId }: { draftId: string }) {
  const [draft, setDraft] = useState(doctorAiDraft);
  const [notice, setNotice] = useState('');
  const update = (field: DraftField, value: string) => setDraft((current) => ({ ...current, [field]: value }));
  const demoAction = (message: string) => setNotice(`Demo only - ${message} No clinical record was changed.`);

  return (
    <div className="doctor-page doctor-ai-draft-page">
      <div className="doctor-ai-draft-page__topline"><span><MaterialIcon name="clinical_notes" /> Clinical Draft Review / مراجعة المسودة السريرية</span><strong>NON-FINAL - PENDING PHYSICIAN REVIEW</strong></div>
      <section className="doctor-ai-draft-page__envelope"><div className="doctor-ai-draft-page__patient"><div className="doctor-ai-draft-page__avatar">PT</div><div><h1>Synthetic Patient <span>/ اسم المريض</span></h1><p>PID: <strong>{draftId}</strong> <span>•</span> MRN: {draftId} <span>•</span> {doctorAiDraft.encounterId}</p></div></div><div><strong>ASSISTANCE LEVEL: DRAFTING AID ONLY</strong><small>Autonomous submission restricted. Requires physician review.</small></div></section>
      <div className="doctor-ai-draft-page__progress"><span className="is-done">1. AI DRAFTED</span><span className="is-current">2. IN CLINICAL EDITING</span><span>3. REQUIRES REVIEW</span><span>4. NOT FINALIZED</span></div>
      <div className="doctor-ai-draft-page__grid">
        <div className="doctor-ai-draft-page__main">
          <section className="doctor-patient-card doctor-ai-draft-page__editor"><header><div><MaterialIcon name="edit_note" /><div><h2>SOAP Clinical Progress Note</h2><p>AI-assisted draft content remains editable and non-official.</p></div></div><div className="doctor-ai-draft-page__toolbar"><button aria-label="Bold formatting demo" title="Bold" type="button" onClick={() => demoAction('formatting was not applied.') }><MaterialIcon name="format_bold" /></button><button aria-label="List formatting demo" title="Bulleted list" type="button" onClick={() => demoAction('formatting was not applied.') }><MaterialIcon name="format_list_bulleted" /></button><button type="button" onClick={() => demoAction('differential was not re-checked.') }><MaterialIcon name="sync_alt" /> Re-check Differential</button></div></header><DraftSection letter="S" label="Subjective & Chief Complaint / الشكوى وتاريخ المرض" value={draft.subjective} onChange={(value) => update('subjective', value)} /><DraftSection letter="O" label="Objective & Physical Examination / الفحص السريري والعلامات الحيوية" value={draft.objective} onChange={(value) => update('objective', value)} /><DraftSection letter="A" label="Clinical Assessment & Differential / التقييم والتشخيص السريري" value={draft.assessment} onChange={(value) => update('assessment', value)} /><DraftSection letter="P" label="Plan & Interventions / الخطة العلاجية والتشخيصية" value={draft.plan} onChange={(value) => update('plan', value)} /><div className="doctor-ai-draft-page__attestation"><MaterialIcon name="verified_user" /><p><strong>Physician review boundary:</strong> This draft is assistive content only. Review and modify it before any authorized clinical workflow.</p></div></section>
          <section className="doctor-patient-card doctor-ai-draft-page__dispatch"><h2><MaterialIcon name="alt_route" /> Connected Clinical Workflow Dispatch</h2><div><button type="button" onClick={() => demoAction('the note was not exported.') }><MaterialIcon name="folder_shared" /> Export to EHR Notes</button><button type="button" onClick={() => demoAction('prescriptions were not created.') }><MaterialIcon name="prescriptions" /> Draft Prescriptions</button><button type="button" onClick={() => demoAction('diagnostic orders were not created.') }><MaterialIcon name="biotech" /> Diagnostic Orders</button></div></section>
        </div>
        <aside className="doctor-ai-draft-page__side"><section className="doctor-patient-card"><h2>AI Draft Metadata</h2><p><MaterialIcon name="memory" /> Draft ID: <strong>{draftId}</strong></p><p><MaterialIcon name="schedule" /> Draft status: In clinical editing</p><p><MaterialIcon name="shield" /> Physician review required</p></section><section className="doctor-patient-card doctor-ai-draft-page__actions"><h2>Review Actions</h2><button type="button" onClick={() => demoAction('the draft was saved locally.') }><MaterialIcon name="save" /> Save In-Progress</button><button type="button" onClick={() => demoAction('the draft was rejected locally.') }><MaterialIcon name="cancel" /> Reject Draft</button><button className="is-primary" type="button" onClick={() => demoAction('the draft was not signed or finalized.') }><MaterialIcon name="draw" /> Sign & Finalize Note</button></section></aside>
      </div>
      {notice && <p className="doctor-ai-draft-page__notice" role="status">{notice}</p>}
    </div>
  );
}

function DraftSection({ letter, label, value, onChange }: { letter: string; label: string; value: string; onChange: (value: string) => void }) { return <section className="doctor-ai-draft-page__field"><div><span>{letter}</span><label htmlFor={`draft-${letter}`}>{label}</label><small>{value.length} chars</small></div><textarea id={`draft-${letter}`} value={value} onChange={(event) => onChange(event.target.value)} /></section>; }
