import { useState } from 'react';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { PatientWorkspaceShell } from './PatientWorkspaceShell';
import { doctorPatientNotes, type PatientNoteCategory } from './fixtures';

const filters: { label: string; value: PatientNoteCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'SOAP', value: 'soap' },
  { label: 'Consults', value: 'consult' },
  { label: 'Discharge', value: 'discharge' },
];

export function DoctorPatientNotesPage({ patientId }: { patientId: string }) {
  const [activeFilter, setActiveFilter] = useState<PatientNoteCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(doctorPatientNotes[0]?.id ?? '');
  const [demoNotice, setDemoNotice] = useState('');
  const visibleNotes = doctorPatientNotes.filter((note) => {
    const matchesFilter = activeFilter === 'all' || note.category === activeFilter;
    const searchText = `${note.title} ${note.subtitle} ${note.preview} ${note.author}`.toLowerCase();
    return matchesFilter && searchText.includes(search.toLowerCase());
  });
  const selectedNote = doctorPatientNotes.find((note) => note.id === selectedId) ?? visibleNotes[0] ?? doctorPatientNotes[0];

  return (
    <PatientWorkspaceShell patientId={patientId} pathname={window.location.pathname} breadcrumbLabel="Clinical Notes / الملاحظات السريرية">
      <div className="doctor-patient-notes">
        <section className="doctor-patient-notes__archive">
          <div className="doctor-patient-card doctor-patient-notes__archive-controls">
            <button type="button" className="doctor-patient-notes__new-button" onClick={() => setDemoNotice('Demo-only note composer. No clinical data is persisted.')}> <MaterialIcon name="add_circle" /> + New Clinical Note / تدوين ملاحظة جديدة</button>
            <label className="doctor-patient-notes__search">
              <MaterialIcon name="search" />
              <input aria-label="Search clinical notes" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search entries, keywords, ICD-10..." />
            </label>
            <div className="doctor-patient-notes__filters" aria-label="note filters">
              {filters.map((filter) => <button type="button" className={activeFilter === filter.value ? 'is-active' : ''} key={filter.value} onClick={() => setActiveFilter(filter.value)}>{filter.label} ({filter.value === 'all' ? doctorPatientNotes.length : doctorPatientNotes.filter((note) => note.category === filter.value).length})</button>)}
            </div>
            {demoNotice && <p className="doctor-patient-notes__notice" role="status">{demoNotice}</p>}
          </div>

          <div className="doctor-patient-notes__list" aria-label="clinical notes archive">
            {visibleNotes.map((note) => (
              <button type="button" className={`doctor-patient-note-card ${selectedNote?.id === note.id ? 'is-selected' : ''}`} key={note.id} onClick={() => setSelectedId(note.id)}>
                <div className="doctor-patient-note-card__top"><span>{note.date}</span><b><MaterialIcon name={note.status === 'Signed & Finalized' ? 'lock' : 'verified'} /> {note.status}</b></div>
                <h2>{note.title}</h2>
                <p className="doctor-patient-note-card__arabic" dir="rtl">{note.subtitle}</p>
                <p className="doctor-patient-note-card__preview">{note.preview}</p>
                <footer><span><MaterialIcon name="stethoscope" /> {note.author}</span><em>{note.typeLabel}</em></footer>
              </button>
            ))}
            {visibleNotes.length === 0 && <div className="doctor-patient-card doctor-patient-notes__empty"><MaterialIcon name="search_off" /><strong>No matching clinical notes</strong><span>Try another search or filter.</span></div>}
          </div>
        </section>

        {selectedNote && <NoteDetail note={selectedNote} />}
      </div>
    </PatientWorkspaceShell>
  );
}

function NoteDetail({ note }: { note: typeof doctorPatientNotes[number] }) {
  return (
    <section className="doctor-patient-card doctor-patient-notes__detail">
      <div className="doctor-patient-notes__detail-status"><span><MaterialIcon name="cloud_done" /> Saved to Clinical Record • {note.savedAt}</span><b><MaterialIcon name="verified" /> SIGNED / موقع ومعتمد</b></div>
      <header className="doctor-patient-notes__detail-heading">
        <div><h1>{note.title}</h1><p dir="rtl">{note.subtitle}</p></div>
        <div><span><strong>Encounter Date:</strong> {note.encounterDate}</span><span><strong>Author:</strong> {note.author}</span><span><strong>Department:</strong> {note.department}</span></div>
      </header>
      <div className="doctor-patient-notes__toolbar"><span>Format: SOAP v2.4</span><span>Locale: Bilingual EG/EN</span><div><button type="button"><MaterialIcon name="print" /> Print Clinical Summary / طباعة</button><button type="button"><MaterialIcon name="lock_clock" /> Export Encrypted PDF</button><button type="button"><MaterialIcon name="post_add" /> Amend Note (Add Addendum)</button></div></div>
      <div className="doctor-patient-notes__soap">
        <SoapSection letter="S" title="Subjective / التقييم الذاتي للشكوى" helper="Patient-reported symptoms, interval history, compliance" tone="primary"><p>{note.subjective}</p><p className="doctor-patient-notes__quote" dir="rtl">{note.subjectiveArabic}</p><ul>{note.subjectivePoints.map((point) => <li key={`${note.id}-subjective-${point}`}>{point}</li>)}</ul></SoapSection>
        <SoapSection letter="O" title="Objective / الفحص السريري والمؤشرات" helper="Physical examination, vital telemetry, immediate metrics" tone="secondary"><div className="doctor-patient-notes__vitals">{note.vitals.map((vital) => <div key={`${note.id}-vital-${vital.label}`}><span>{vital.label}</span><strong>{vital.value}</strong><small>{vital.detail}</small></div>)}</div><p>{note.objective}</p></SoapSection>
        <SoapSection letter="A" title="Assessment / التشخيص السريري" helper="Clinical synthesis, differential diagnostic resolution" tone="tertiary"><div className="doctor-patient-notes__assessment">{note.assessment.map((item, index) => <div key={`${note.id}-assessment-${item.title}`}><b>{index + 1}</b><div><strong>{item.title}</strong><span>{item.detail}</span></div><em>{item.status}</em></div>)}</div></SoapSection>
        <SoapSection letter="P" title="Plan / الخطة العلاجية والدوائية" helper="Pharmacotherapy, diagnostic follow-up, patient counseling" tone="secondary"><div className="doctor-patient-notes__plan">{note.plan.map((item) => <div key={`${note.id}-plan-${item.title}`}><strong>{item.title}</strong><span>{item.detail}</span><small dir="rtl">{item.arabic}</small></div>)}</div></SoapSection>
      </div>
      <footer className="doctor-patient-notes__verification"><div><MaterialIcon name="verified" /><div><strong>PHYSICIAN VERIFIED • SIGNED / تم التدقيق والتوقيع</strong><span>Attending Physician Verification • Synthetic EMR demonstration record</span></div></div><span>Status: SIGNED<br /><small>Clinical Record Locked</small></span></footer>
    </section>
  );
}

function SoapSection({ letter, title, helper, tone, children }: { letter: string; title: string; helper: string; tone: 'primary' | 'secondary' | 'tertiary'; children: React.ReactNode }) {
  return <section className="doctor-patient-notes__soap-section"><header><b className={`doctor-patient-notes__letter doctor-patient-notes__letter--${tone}`}>{letter}</b><div><h2>{title}</h2><span>{helper}</span></div><MaterialIcon name="expand_less" /></header><div>{children}</div></section>;
}
