import { useState } from 'react';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { doctorAiPrompts } from './fixtures';

export function DoctorAiWorkspacePage() {
  const [prompt, setPrompt] = useState('');
  const [notice, setNotice] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');

  const runAnalysis = (value = prompt) => {
    setPrompt(value);
    setNotice('Demo only - AI assistance was generated locally and requires physician review.');
  };

  return (
    <div className="doctor-page doctor-ai-page">
      <div className="doctor-ai-page__crumb"><a href="/doctor/dashboard">Doctor Workspace / مساحة عمل الطبيب</a><MaterialIcon name="chevron_right" /><strong>Doctor AI Workspace / مساحة الذكاء الاصطناعي</strong></div>
      <header className="doctor-ai-page__heading"><div><span className="doctor-ai-page__eyebrow"><MaterialIcon name="clinical_notes" /> Clinical AI Assistance</span><h1>Doctor AI Workspace <span>/ مساحة الذكاء الاصطناعي</span></h1><p>Assistive synthesis for authorized clinical context. No autonomous clinical decisions.</p></div><span className="doctor-ai-page__boundary"><MaterialIcon name="verified_user" /> AI Assistance Only - Physician Review Mandatory</span></header>
      <div className="doctor-ai-page__grid">
        <div className="doctor-ai-page__main">
          <section className="doctor-patient-card doctor-ai-page__prompts"><div className="doctor-ai-page__section-title"><span>Standard Clinical Inquiry Prompts</span><small><MaterialIcon name="tune" /> Templates (3)</small></div><div className="doctor-ai-page__prompt-grid">{doctorAiPrompts.map((item) => <button className={selectedPrompt === item.id ? 'doctor-ai-page__prompt is-selected' : 'doctor-ai-page__prompt'} key={item.id} type="button" onClick={() => { setSelectedPrompt(item.id); runAnalysis(item.title); }}><MaterialIcon name={item.icon} /><strong>{item.title}</strong><small>{item.subtitle}</small></button>)}</div></section>
          <section className="doctor-patient-card doctor-ai-page__message doctor-ai-page__message--doctor"><div className="doctor-ai-page__message-meta"><span><MaterialIcon name="stethoscope" /> Attending Physician Inquiry</span><small>10:42 AM</small></div><p>{prompt || 'Summarize the authorized patient context and identify questions for physician review.'}</p></section>
          <section className="doctor-patient-card doctor-ai-page__response"><div className="doctor-ai-page__response-heading"><span><MaterialIcon name="memory" /> Aegis Clinical Reasoning Core</span><strong>AI-GENERATED DRAFT</strong><small><MaterialIcon name="pending_actions" /> Pending Physician Attestation</small></div><div className="doctor-ai-page__response-block"><strong><MaterialIcon name="monitoring" /> Longitudinal Clinical Synthesis</strong><span>Labs and encounter context are organized into a reviewable synthetic summary. Verify every value against the authorized clinical record.</span></div><div className="doctor-ai-page__response-block"><strong><MaterialIcon name="vital_signs" /> Safety and Eligibility Questions</strong><span>Potential medication and protocol considerations are surfaced for the attending physician. This assistant does not prescribe or finalize treatment.</span></div><div className="doctor-ai-page__response-block doctor-ai-page__response-block--warning"><strong><MaterialIcon name="priority_high" /> Verification Required</strong><span>Confirm allergies, renal parameters, current medications, and patient scope before any clinical action.</span></div><div className="doctor-ai-page__citations"><MaterialIcon name="verified_user" /> Authorized context only <span>Protected session / جلسة محمية</span></div></section>
          <form className="doctor-ai-page__composer" onSubmit={(event) => { event.preventDefault(); runAnalysis(); }}><label htmlFor="doctor-ai-prompt">Clinical inquiry / الاستفسار السريري</label><textarea id="doctor-ai-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask for a synthetic clinical summary..." /><div><button type="button" onClick={() => { setPrompt(''); setNotice('Demo only - local context cleared.'); }}><MaterialIcon name="history_toggle_off" /> Clear Context</button><button className="is-primary" type="submit"><MaterialIcon name="arrow_forward" /> Execute Analysis</button></div></form>
        </div>
        <aside className="doctor-ai-page__side"><section className="doctor-patient-card"><h2>Authorized Context</h2><p><MaterialIcon name="shield" /> This workspace uses only the current synthetic authorized context.</p><span className="doctor-ai-page__status">BOUNDED SESSION</span></section><section className="doctor-patient-card"><h2>Clinical Actions</h2><button type="button" onClick={() => setNotice('Demo only - note draft was not created.')}><MaterialIcon name="post_add" /> Save as Clinical Note Draft</button><button type="button" onClick={() => setNotice('Demo only - note writer was not opened.')}><MaterialIcon name="edit_note" /> Edit in Note Writer</button></section></aside>
      </div>
      {notice && <p className="doctor-ai-page__notice" role="status">{notice}</p>}
    </div>
  );
}
