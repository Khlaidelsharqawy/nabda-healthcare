import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { PatientWorkspaceShell } from './PatientWorkspaceShell';
import { doctorPatientProfiles } from './fixtures';

const tabs = [
  { label: 'Overview / نظرة عامة', icon: 'analytics', active: true },
  { label: 'Medical History / التاريخ المرضي', icon: 'history_edu', active: false },
  { label: 'Clinical Timeline / التسلسل الزمني', icon: 'timeline', active: false },
  { label: 'Clinical Notes / الملاحظات السريرية', icon: 'description', active: false },
];

export function DoctorPatientProfilePage({ patientId }: { patientId: string }) {
  const patient = doctorPatientProfiles.find((entry) => entry.id === patientId) ?? doctorPatientProfiles[0];

  if (!patient) {
    return (
      <div className="doctor-page doctor-patient-profile">
        <section className="doctor-patient-card doctor-patient-card--empty">
          <MaterialIcon name="person_off" className="doctor-patient-card__icon" />
          <h1>Patient record unavailable</h1>
          <p>No synthetic patient profile was registered for this session.</p>
        </section>
      </div>
    );
  }

  return (
    <PatientWorkspaceShell patientId={patient.id} pathname={window.location.pathname} breadcrumbLabel="Overview / نظرة عامة">
      <div className="doctor-patient-workspace">
        <div className="doctor-patient-workspace__main">
          <section className="doctor-patient-card">
            <div className="doctor-patient-card__header">
              <div className="doctor-patient-card__title-wrap">
                <MaterialIcon name="monitor_heart" className="doctor-patient-card__title-icon" />
                <h2>Vital Signs Monitoring / متابعة المؤشرات الحيوية</h2>
              </div>
              <span className="doctor-inline-tag">Triage Record • Today</span>
            </div>

            <div className="doctor-patient-vitals">
              {patient.vitals.map((vital) => (
                <div key={`${patient.id}-${vital.label}`} className={`doctor-patient-vital doctor-patient-vital--${vital.tone}`}>
                  <div className="doctor-patient-vital__top">
                    <span>{vital.label}</span>
                    <MaterialIcon name={vital.icon} className="doctor-patient-vital__icon" />
                  </div>
                  <div className="doctor-patient-vital__value">
                    <strong>{vital.value}</strong>
                    <small>{vital.valueSuffix}</small>
                  </div>
                  <div className="doctor-patient-vital__status">
                    <span className="doctor-patient-vital__dot" />
                    <span>{vital.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="doctor-patient-card">
            <div className="doctor-patient-card__header">
              <div className="doctor-patient-card__title-wrap">
                <MaterialIcon name="medical_services" className="doctor-patient-card__title-icon" />
                <h2>Key Medical Conditions / الأمراض المزمنة</h2>
              </div>
              <button type="button" className="doctor-patient-card__ghost-button">
                <MaterialIcon name="add_circle" className="doctor-patient-card__ghost-button-icon" />
                Add Condition
              </button>
            </div>

            <div className="doctor-patient-list">
              {patient.conditions.map((condition) => (
                <div key={`${patient.id}-condition-${condition.title}`} className="doctor-patient-list__item">
                  <div className="doctor-patient-list__icon-wrap doctor-patient-list__icon-wrap--primary">
                    <MaterialIcon name="clinical_notes" className="doctor-patient-list__icon" />
                  </div>
                  <div className="doctor-patient-list__body">
                    <div className="doctor-patient-list__label-row">
                      <strong>{condition.title}</strong>
                      <span className="doctor-inline-tag">{condition.tag}</span>
                    </div>
                    <small>{condition.detail}</small>
                  </div>
                  <span className={`doctor-pill doctor-pill--${condition.tone}`}>{condition.status}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="doctor-patient-card">
            <div className="doctor-patient-card__header">
              <div className="doctor-patient-card__title-wrap">
                <MaterialIcon name="prescriptions" className="doctor-patient-card__title-icon" />
                <h2>Active Prescribed Regimen / الأدوية الحالية</h2>
              </div>
              <div className="doctor-patient-card__meta-right">
                <span>{patient.medications.length} Active RX</span>
                <button type="button" className="doctor-patient-card__ghost-button">
                  <MaterialIcon name="edit_note" className="doctor-patient-card__ghost-button-icon" />
                  Adjust
                </button>
              </div>
            </div>

            <div className="doctor-patient-list">
              {patient.medications.map((medication) => (
                <div key={`${patient.id}-medication-${medication.name}`} className="doctor-patient-list__item">
                  <div className="doctor-patient-list__icon-wrap doctor-patient-list__icon-wrap--primary-light">
                    <span className="doctor-patient-list__rx">Rx</span>
                  </div>
                  <div className="doctor-patient-list__body">
                    <div className="doctor-patient-list__label-row">
                      <strong>{medication.name}</strong>
                      <span className={`doctor-pill doctor-pill--${medication.variant}`}>{medication.status}</span>
                    </div>
                    <small>{medication.frequency}</small>
                  </div>
                  <span className="doctor-patient-list__meta">Recorded / مسجل</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="doctor-patient-workspace__side">
          <section className="doctor-patient-card">
            <div className="doctor-patient-card__header doctor-patient-card__header--compact">
              <span className="doctor-patient-card__eyebrow">
                <MaterialIcon name="event_upcoming" className="doctor-patient-card__eyebrow-icon" />
                Next Scheduled Visit / الموعد القادم
              </span>
              <span className="doctor-inline-tag doctor-inline-tag--primary">Confirmed</span>
            </div>

            <div className="doctor-patient-appointment-box">
              <div className="doctor-patient-appointment-box__header">
                <h3>{patient.nextVisit.title}</h3>
                <span>{patient.nextVisit.label}</span>
              </div>
              <p>{patient.nextVisit.subtitle}</p>
              <div className="doctor-patient-appointment-box__actions">
                <button type="button" className="doctor-patient-identity-card__button doctor-patient-identity-card__button--primary doctor-patient-identity-card__button--full">
                  <MaterialIcon name="stethoscope" className="doctor-patient-identity-card__button-icon" />
                  Prepare Consultation / تجهيز الملف
                </button>
                <button type="button" className="doctor-patient-appointment-box__small-button" aria-label="Reschedule">
                  <MaterialIcon name="edit_calendar" className="doctor-patient-card__ghost-button-icon" />
                </button>
              </div>
            </div>
          </section>

          <section className="doctor-patient-card">
            <h2 className="doctor-patient-card__side-title">Fast Actions / إجراءات سريعة</h2>
            <div className="doctor-fast-actions">
              {patient.fastActions.map((action) => (
                <button type="button" key={`${patient.id}-action-${action.label}`} className="doctor-fast-action">
                  <MaterialIcon name={action.icon} className="doctor-fast-action__icon" />
                  <span>{action.label}</span>
                  <small>{action.subLabel}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="doctor-patient-card">
            <div className="doctor-patient-card__header doctor-patient-card__header--compact doctor-patient-card__header--side">
              <div className="doctor-patient-card__title-wrap">
                <MaterialIcon name="history" className="doctor-patient-card__title-icon" />
                <h2>Recent Encounters / الزيارات السابقة</h2>
              </div>
              <a href={`/doctor/patients/${patient.id}/timeline`}>View All</a>
            </div>

            <div className="doctor-patient-list doctor-patient-list--compact">
              {patient.recentEncounters.map((encounter) => (
                <div key={`${patient.id}-encounter-${encounter.title}`} className="doctor-patient-list__item doctor-patient-list__item--compact">
                  <div className="doctor-patient-list__body">
                    <div className="doctor-patient-list__label-row">
                      <strong>{encounter.title}</strong>
                      <span>{encounter.tag}</span>
                    </div>
                    <small>{encounter.detail}</small>
                    <div className="doctor-patient-list__files">
                      <MaterialIcon name="attachment" className="doctor-patient-list__files-icon" />
                      <span>{encounter.noteCount} Note</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="doctor-patient-card">
            <div className="doctor-patient-card__title-wrap doctor-patient-card__title-wrap--side">
              <MaterialIcon name="groups" className="doctor-patient-card__title-icon" />
              <h2>Clinical Care Team / الفريق الطبي</h2>
            </div>

            <div className="doctor-patient-care-team">
              {patient.careTeam.map((member) => (
                <div key={`${patient.id}-care-team-${member.name}`} className="doctor-patient-care-team__row">
                  <div className="doctor-patient-care-team__avatar">
                    <MaterialIcon
                      name={member.role === 'Attending Physician / الطبيب المعالج' ? 'stethoscope' : 'clinical_notes'}
                      className="doctor-patient-care-team__avatar-icon"
                    />
                  </div>
                  <div className="doctor-patient-care-team__meta">
                    <strong>{member.name}</strong>
                    <small>{member.role}</small>
                  </div>
                  <span className={`doctor-pill doctor-pill--${member.tone}`}>{member.badge}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </PatientWorkspaceShell>
  );
}
