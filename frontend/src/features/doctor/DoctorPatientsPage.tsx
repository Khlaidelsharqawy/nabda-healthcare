import { useState, type MouseEvent } from 'react';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { doctorPatients, type DoctorPatient } from './fixtures';

const statusLabel: Record<DoctorPatient['status'], string> = { stable: 'Stable / مستقر', 'follow-up': 'Follow-up / متابعة', 'awaiting-labs': 'Awaiting Labs / بانتظار التحاليل' };

export function DoctorPatientsPage() {
  const [query, setQuery] = useState('');
  const [state, setState] = useState<'default' | 'skeleton' | 'empty' | 'notfound' | 'denied'>('default');
  const filtered = doctorPatients.filter((patient) => `${patient.displayName} ${patient.medicalRecordNumber}`.toLowerCase().includes(query.toLowerCase()));

  const openPatient = (event: MouseEvent<HTMLAnchorElement>, patientId: string) => {
    event.preventDefault();
    window.history.pushState({}, '', `/doctor/patients/${patientId}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="doctor-page doctor-patients">
      <section className="doctor-scope-bar"><div><span><MaterialIcon name="lock" />Scoped Patient Scope / نطاق المرضى المصرح بهم</span><b>•</b><strong><MaterialIcon name="groups" />Clinical Care Panel / نطاق الرعاية السريرية</strong><b>•</b><em>Tenant / المركز الطبي</em></div><small><MaterialIcon name="verified" />Clinical Consent Verified / توثيق الموافقة السريرية</small></section>
      <section className="doctor-patients-heading"><div><div className="doctor-patients-kicker">MEDICAL RECORD ROSTER <span>• عيادة الباطنة والسكري</span></div><h1>Patient Registry <span>/ سجل المرضى والمراجعين المصرح بهم</span></h1><p>Authorized patient registry under your clinical care. / سجل المرضى المصرح بهم ضمن نطاق رعايتك السريرية.</p></div><div className="doctor-patient-kpis"><div><small>SCHEDULED VISITS / الزيارات المجدولة</small><strong>Scheduled <i>/ مجدولة</i></strong></div><div><small>PENDING LABS / التحاليل المعلقة</small><strong>Pending <i>/ معلقة</i></strong></div><div><small>ACTIVE PATIENTS / المرضى النشطون</small><strong>Active <i>/ نشط</i></strong></div></div></section>
      <section className="doctor-demo-switcher"><div><MaterialIcon name="tune" /><strong>Demo Reviewer Mode:</strong><small>Switch dataset scenarios to test clinical boundary states</small></div><div>{(['default', 'skeleton', 'empty', 'notfound', 'denied'] as const).map((option) => <button className={state === option ? 'is-active' : ''} key={option} onClick={() => setState(option)} type="button">{option === 'default' ? 'Default Roster' : option === 'skeleton' ? 'Loading Skeleton' : option === 'empty' ? 'Empty Panel' : option === 'notfound' ? 'No Search Results' : 'Access Denied (403)'}</button>)}</div></section>
      <section className="doctor-patient-filters"><label><MaterialIcon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by patient name, ID (#PT-XXXX), or Egyptian National ID... / ابحث بالاسم أو رقم السجل الطبي" /></label><select defaultValue="all"><option value="all">Clinical Status: All / كل الحالات</option><option value="today">Scheduled Today (8) / مواعيد اليوم</option><option value="pending">Follow-up Pending / بانتظار المتابعة</option></select><select defaultValue="any"><option value="any">Last Visit: Anytime / أي وقت</option><option value="7d">Last 7 Days / آخر ٧ أيام</option></select><button type="button" aria-label="Reset filters" onClick={() => setQuery('')}><MaterialIcon name="refresh" /></button></section>
      <section className="doctor-patient-table-card"><div className="doctor-section-heading"><div><span className="doctor-clinical-label">AUTHORIZED PATIENTS</span><h2>Clinical Care Registry</h2></div><button type="button"><MaterialIcon name="download" />Export Clinical Cohort</button></div>{state === 'denied' ? <div className="doctor-state-panel"><MaterialIcon name="block" /><strong>Access Denied (403)</strong><span>Clinical scope verification is required.</span></div> : state === 'skeleton' ? <div className="doctor-state-panel"><MaterialIcon name="progress_activity" /><strong>Loading patient roster</strong></div> : state === 'empty' || state === 'notfound' || filtered.length === 0 ? <div className="doctor-state-panel"><MaterialIcon name="person_search" /><strong>{state === 'empty' ? 'No patients in this panel' : 'No search results'}</strong><span>Adjust the filters or search terms.</span></div> : <div className="doctor-patient-rows">{filtered.map((patient) => <a className="doctor-patient-row" href={`/doctor/patients/${patient.id}`} key={patient.id} onClick={(event) => openPatient(event, patient.id)}><span className="doctor-patient-avatar">{patient.displayName.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><span><strong>{patient.displayName}</strong><small>{patient.age} years • MRN {patient.medicalRecordNumber}</small></span><span className={`doctor-status doctor-status--${patient.status}`}>{statusLabel[patient.status]}</span><span><small>Next visit</small>{patient.nextVisit}</span><MaterialIcon name="chevron_right" /></a>)}</div>}</section>
    </div>
  );
}
