import { useState } from 'react';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { PatientWorkspaceShell } from './PatientWorkspaceShell';
import { doctorPatientPrescriptions, type PatientPrescriptionStatus } from './fixtures';

const filters: { label: string; value: PatientPrescriptionStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Suspended', value: 'suspended' },
];

function PrescriptionCard({
  prescription,
  selected,
  onSelect,
  onNotice,
}: {
  prescription: (typeof doctorPatientPrescriptions)[number];
  selected: boolean;
  onSelect: () => void;
  onNotice: (message: string) => void;
}) {
  return (
    <article
      className={`doctor-patient-card doctor-patient-prescription-card ${selected ? 'is-selected' : ''}`}
      onClick={onSelect}
    >
      <div className={`doctor-patient-prescription-card__bar doctor-patient-prescription-card__bar--${prescription.status}`} />
      <header>
        <div>
          <h2>Prescription #{prescription.id}</h2>
          <span className={`doctor-patient-prescription-card__status doctor-patient-prescription-card__status--${prescription.status}`}>
            {prescription.statusLabel}
          </span>
          <span className="doctor-patient-prescription-card__signature">Digital Signature ID: {prescription.signatureId}</span>
        </div>
        <div>
          <span>Issue Date: <strong>{prescription.prescribedDate}</strong></span>
          <span>Prescribed by: <strong>{prescription.prescriber}</strong></span>
        </div>
      </header>

      <div className="doctor-patient-prescription-card__body">
        <div>
          <h3>Medication Items / عناصر الوصفة الدوائية</h3>
          {prescription.medications.map((medication) => (
            <div className="doctor-patient-prescription-item" key={`${prescription.id}-${medication.name}`}>
              <MaterialIcon name={medication.icon} />
              <div>
                <strong>{medication.name}</strong>
                <span>{medication.dosage} • {medication.frequency} • Route: {medication.route}</span>
                <small>Duration: {medication.duration} / المدة</small>
              </div>
              <b>{medication.badge}</b>
            </div>
          ))}
          <div className="doctor-patient-prescription-instructions">
            <MaterialIcon name="info" />
            <span><strong>Clinical Instructions / إرشادات الاستخدام:</strong> {prescription.instructions}</span>
          </div>
        </div>

        <aside>
          <div>
            <span>Refills & Adherence</span>
            <strong>{prescription.refillsRemaining} remaining</strong>
          </div>
          <div>
            <span>Therapy Progress</span>
            <strong>{prescription.progressLabel}</strong>
            <div className="doctor-patient-prescription-progress">
              <i style={{ width: `${prescription.progress}%` }} />
            </div>
          </div>
          <div className="doctor-patient-prescription-actions">
            <button type="button" onClick={(event) => { event.stopPropagation(); onNotice('Demo only — prescription details are display-only.'); }}>
              <MaterialIcon name="visibility" /> View Detail
            </button>
            <button type="button" onClick={(event) => { event.stopPropagation(); onNotice('Demo only — prescription status was not changed.'); }}>
              <MaterialIcon name="cancel" /> Discontinue
            </button>
          </div>
        </aside>
      </div>
    </article>
  );
}

export function DoctorPatientPrescriptionsPage({ patientId }: { patientId: string }) {
  const [activeFilter, setActiveFilter] = useState<PatientPrescriptionStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(doctorPatientPrescriptions[0]?.id ?? '');
  const [notice, setNotice] = useState('');

  const visiblePrescriptions = doctorPatientPrescriptions.filter((prescription) => {
    const matchesStatus = activeFilter === 'all' || prescription.status === activeFilter;
    const haystack = `${prescription.id} ${prescription.medications.map((item) => item.name).join(' ')}`.toLowerCase();
    return matchesStatus && haystack.includes(search.toLowerCase());
  });

  const selectedPrescription = doctorPatientPrescriptions.find((prescription) => prescription.id === selectedId)
    ?? visiblePrescriptions[0]
    ?? doctorPatientPrescriptions[0];

  return (
    <PatientWorkspaceShell patientId={patientId} pathname={window.location.pathname} breadcrumbLabel="Prescriptions / الوصفات">
      <div className="doctor-patient-prescriptions">
        <section className="doctor-patient-prescriptions__governance">
          <div>
            <MaterialIcon name="verified_user" />
            <strong>Clinical Governance Protocol</strong>
            <span>Physician Clinical Authority Required • Zero Autonomous Prescription Actions</span>
          </div>
          <span>سجل تجريبي للعرض فقط</span>
        </section>

        <section className="doctor-patient-prescriptions__header doctor-patient-card">
          <div>
            <span className="doctor-patient-prescriptions__eyebrow">Certified Active Profile / سجل نشط وموثق</span>
            <h1>Prescriptions &amp; Regimens <span>/ الوصفات والنظم العلاجية</span></h1>
            <p>Display-only synthetic medication records for this frontend demonstration.</p>
          </div>
          <button type="button" onClick={() => setNotice('Demo only — no prescription was created or changed.')}>
            <MaterialIcon name="add_circle" /> + New Prescription / إنشاء وصفة جديدة
          </button>
        </section>

        <section className="doctor-patient-prescriptions__metrics">
          {[
            { label: 'Active Regimens / الوصفات النشطة', value: doctorPatientPrescriptions.filter((item) => item.status === 'active').length, icon: 'pill', tone: 'primary' },
            { label: 'Pending Renewal / بانتظار التجديد', value: 1, icon: 'autorenew', tone: 'tertiary' },
            { label: 'Discontinued & Completed / وصفات مكتملة أو ملغاة', value: doctorPatientPrescriptions.filter((item) => item.status !== 'active').length, icon: 'fact_check', tone: 'neutral' },
          ].map((metric) => (
            <article className={`doctor-patient-prescriptions__metric doctor-patient-prescriptions__metric--${metric.tone}`} key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <MaterialIcon name={metric.icon} />
            </article>
          ))}
        </section>

        <section className="doctor-patient-card doctor-patient-prescriptions__toolbar">
          <div className="doctor-patient-prescriptions__filters" aria-label="prescription status filters">
            {filters.map((filter) => (
              <button type="button" className={activeFilter === filter.value ? 'is-active' : ''} key={filter.value} onClick={() => setActiveFilter(filter.value)}>
                {filter.label} ({filter.value === 'all' ? doctorPatientPrescriptions.length : doctorPatientPrescriptions.filter((item) => item.status === filter.value).length})
              </button>
            ))}
          </div>
          <label>
            <MaterialIcon name="search" />
            <input aria-label="Search prescriptions" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search medication formula or RX-REF..." />
          </label>
        </section>

        {notice && <p className="doctor-patient-prescriptions__notice" role="status">{notice}</p>}

        <section className="doctor-patient-prescriptions__list" aria-label="prescription list">
          {visiblePrescriptions.map((prescription) => (
            <PrescriptionCard
              key={prescription.id}
              prescription={prescription}
              selected={selectedPrescription?.id === prescription.id}
              onSelect={() => setSelectedId(prescription.id)}
              onNotice={setNotice}
            />
          ))}
          {visiblePrescriptions.length === 0 && (
            <div className="doctor-patient-card doctor-patient-prescriptions__empty">
              <MaterialIcon name="search_off" />
              <strong>No matching prescriptions</strong>
              <span>Try another search or status filter.</span>
            </div>
          )}
        </section>
      </div>
    </PatientWorkspaceShell>
  );
}
