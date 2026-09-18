import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { PatientWorkspaceShell } from './PatientWorkspaceShell';
import { doctorPatientHistory } from './fixtures';

export function DoctorPatientHistoryPage({ patientId }: { patientId: string }) {
  const history = doctorPatientHistory;

  return (
    <PatientWorkspaceShell patientId={patientId} pathname={window.location.pathname} breadcrumbLabel="Medical History / التاريخ المرضي">
      <div className="doctor-patient-history">
        <section className="doctor-patient-history__banner">
          <div className="doctor-patient-history__banner-icon"><MaterialIcon name="info" /></div>
          <div>
            <strong>Patient Medical History / التاريخ المرضي للمريض</strong>
            <span>Authorized Clinical Documentation / توثيق سريري معتمد</span>
          </div>
        </section>

        <section className="doctor-patient-history__metrics" aria-label="history summary">
          {history.summary.map((item) => (
            <article className="doctor-patient-history__metric" key={item.label}>
              <div>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <small>{item.detail}</small>
              </div>
              <MaterialIcon name={item.icon} />
            </article>
          ))}
        </section>

        <div className="doctor-patient-history__grid">
          <div className="doctor-patient-history__main">
            <HistorySection title="1. Allergies & Adverse Reactions" arabic="الحساسية والتفاعلات الدوائية المعاكسة" icon="personal_injury" tone="error">
              {history.allergies.map((item) => <HistoryItem key={`allergy-${item.title}`} item={item} />)}
            </HistorySection>
            <HistorySection title="2. Chronic Conditions & Active Problems" arabic="الأمراض المزمنة والمشاكل السريرية النشطة" icon="vital_signs" tone="primary">
              {history.conditions.map((item) => <HistoryItem key={`condition-${item.title}`} item={item} />)}
            </HistorySection>
            <HistorySection title="3. Surgical & Procedural History" arabic="التاريخ الجراحي والتداخلات الطبية السابقة" icon="medical_services" tone="secondary">
              <div className="doctor-patient-history__procedure-list">
                {history.procedures.map((item) => <HistoryItem key={`procedure-${item.title}`} item={item} />)}
              </div>
            </HistorySection>
          </div>

          <aside className="doctor-patient-history__side">
            <section className="doctor-patient-card doctor-patient-history__status-card">
              <div className="doctor-patient-history__side-heading"><strong>Clinical History Documentation</strong><span>Documented</span></div>
              <p>Longitudinal clinical records maintained within patient file.</p>
              <div><span>Status: Active Record</span><span>Audit: Verified</span></div>
            </section>
            <HistorySideSection title="4. Family Medical History" arabic="التاريخ العائلي" icon="diversity_1" items={history.family} />
            <HistorySideSection title="5. Social & Lifestyle" arabic="السجل الاجتماعي" icon="psychology" items={history.social} />
            <section className="doctor-patient-history__governance">
              <div><MaterialIcon name="verified" /><strong>Clinical Record Status / حالة السجل السريري</strong></div>
              <p>Documented by attending clinical team / موثق من قِبل الفريق الطبي المعالج.</p>
              <strong>Attending Physician / الطبيب المعالج</strong>
              <small>Clinical Documentation Verified</small>
            </section>
          </aside>
        </div>
      </div>
    </PatientWorkspaceShell>
  );
}

function HistorySection({ title, arabic, icon, tone, children }: { title: string; arabic: string; icon: string; tone: 'primary' | 'secondary' | 'error'; children: React.ReactNode }) {
  return (
    <section className="doctor-patient-card doctor-patient-history__section">
      <header className={`doctor-patient-history__section-heading doctor-patient-history__section-heading--${tone}`}>
        <div><MaterialIcon name={icon} /><h2>{title}</h2><span>{arabic}</span></div>
        <b>Documented</b>
      </header>
      <div className="doctor-patient-history__items">{children}</div>
    </section>
  );
}

function HistoryItem({ item }: { item: { title: string; detail: string; status: string; icon?: string } }) {
  return (
    <article className="doctor-patient-history__item">
      <MaterialIcon name={item.icon ?? 'check_box'} />
      <div><strong>{item.title}</strong><p>{item.detail}</p></div>
      <span>{item.status}</span>
    </article>
  );
}

function HistorySideSection({ title, arabic, icon, items }: { title: string; arabic: string; icon: string; items: { title: string; detail: string; status: string }[] }) {
  return (
    <section className="doctor-patient-card doctor-patient-history__side-section">
      <header><div><MaterialIcon name={icon} /><h3>{title}</h3></div><span>{arabic}</span></header>
      {items.map((item) => <HistoryItem key={`side-${item.title}`} item={item} />)}
    </section>
  );
}
