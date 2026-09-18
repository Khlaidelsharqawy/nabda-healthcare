import { useState } from 'react';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { doctorAiPatientPrompts } from './fixtures';

export function DoctorPatientAiPage({ patientId }: { patientId: string }) {
  const [prompt, setPrompt] = useState('');
  const [notice, setNotice] = useState('');

  return (
    <div className="doctor-page doctor-patient-ai-page">
      <a className="doctor-patient-ai-page__back" href={`/doctor/patients/${patientId}`}><MaterialIcon name="arrow_back" /> Back to Patient Profile / ملف المريض</a>
      <section className="doctor-patient-ai-page__patient doctor-patient-card"><div className="doctor-patient-ai-page__avatar">PT</div><div><h1>Synthetic Patient <span>/ اسم المريض</span></h1><p><MaterialIcon name="badge" /> PID: <strong>{patientId}</strong> <span>•</span> MRN: {patientId} <span>•</span> In-Consultation</p></div><div className="doctor-patient-ai-page__metrics"><Metric label="Blood Pressure" value="[Blood Pressure]" /><Metric label="HbA1c" value="[HbA1c]" /><Metric label="eGFR" value="[eGFR]" /></div></section>
      <div className="doctor-patient-ai-page__grid">
        <aside className="doctor-patient-ai-page__context">
          <section className="doctor-patient-card"><div className="doctor-patient-ai-page__card-title"><MaterialIcon name="shield" /><h2>Authorized Scope</h2><strong>BOUNDED</strong></div><p>Session context is bounded to authorized patient <b>{patientId}</b> under tenant isolation policies.</p></section>
          <section className="doctor-patient-card"><div className="doctor-patient-ai-page__card-title"><MaterialIcon name="vital_signs" /><h2>Active Conditions</h2></div><Condition title="Type 2 Diabetes Mellitus" detail="E11.9 - Synthetic context" /><Condition title="Essential Primary Hypertension" detail="I10 - Synthetic context" /><Condition title="Dyslipidemia" detail="E78.5 - Synthetic context" /></section>
          <section className="doctor-patient-card doctor-patient-ai-page__allergy"><div className="doctor-patient-ai-page__card-title"><MaterialIcon name="warning" /><h2>Allergies & Advisories</h2></div><p><strong>Demo flags only</strong><br />Verify all allergies and advisories against the authorized clinical record.</p></section>
          <section className="doctor-patient-card"><div className="doctor-patient-ai-page__card-title"><MaterialIcon name="history" /><h2>Recent Encounters</h2></div><p>May 12, 2024 - Synthetic encounter</p><button type="button" onClick={() => setNotice('Demo only - encounter details were not opened.')}>View</button></section>
        </aside>
        <div className="doctor-patient-ai-page__main">
          <section className="doctor-patient-card doctor-patient-ai-page__boundary"><div><strong>AI Draft Assistance</strong><span>NON-FINAL</span><p>Algorithmic drafts require direct attending physician review before clinical commit.</p></div><small>LLM demo state - no network call</small></section>
          <section><h2 className="doctor-patient-ai-page__section-heading">Structured Clinical Queries</h2><div className="doctor-patient-ai-page__prompts">{doctorAiPatientPrompts.map((item) => <button key={item.id} type="button" onClick={() => { setPrompt(item.title); setNotice('Demo only - scoped analysis was generated locally.'); }}><MaterialIcon name={item.icon} /><span><strong>{item.title}</strong><small>{item.subtitle}</small></span></button>)}</div></section>
          <section className="doctor-patient-card doctor-patient-ai-page__dialogue"><div className="doctor-patient-ai-page__dialogue-heading"><span>Doctor inquiry</span><small>10:14 AM</small></div><p>{prompt || 'Synthesize this patient context for attending physician review.'}</p><div className="doctor-patient-ai-page__assistant"><MaterialIcon name="memory" /><div><strong>Scoped AI assistance - non-final</strong><p>Review the bounded patient context, identify missing verification points, and prepare questions for the attending physician. No diagnosis, prescription, or autonomous action is produced.</p></div></div><label htmlFor="patient-ai-prompt">Scoped inquiry / الاستفسار المحدد<textarea id="patient-ai-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask about this authorized patient context..." /></label><button className="is-primary" type="button" onClick={() => setNotice('Demo only - scoped analysis was not sent to a service.')}><MaterialIcon name="send" /> Execute Analysis</button></section>
        </div>
      </div>
      {notice && <p className="doctor-patient-ai-page__notice" role="status">{notice}</p>}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) { return <div><small>{label}</small><strong>{value}</strong><span>Demo context</span></div>; }
function Condition({ title, detail }: { title: string; detail: string }) { return <div className="doctor-patient-ai-page__condition"><strong>{title}</strong><small>{detail}</small></div>; }
