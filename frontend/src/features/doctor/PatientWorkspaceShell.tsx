import type { ReactNode } from 'react';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { PatientWorkspaceNavigation } from './PatientWorkspaceNavigation';

export function PatientWorkspaceShell({
  patientId,
  pathname,
  breadcrumbLabel,
  children,
}: {
  patientId: string;
  pathname: string;
  breadcrumbLabel: string;
  children: ReactNode;
}) {
  return (
    <div className="doctor-page doctor-patient-profile">
      <section className="doctor-patient-breadcrumb" aria-label="patient breadcrumb">
        <nav>
          <a href="/doctor/patients">Patients / المرضى</a>
          <MaterialIcon name="chevron_right" className="doctor-patient-breadcrumb__icon" />
          <span>Patient [ID] / ملف مريض</span>
          <MaterialIcon name="chevron_right" className="doctor-patient-breadcrumb__icon" />
          <strong>{breadcrumbLabel}</strong>
        </nav>
        <div className="doctor-patient-breadcrumb__status">
          <MaterialIcon name="verified" className="doctor-patient-breadcrumb__status-icon" />
          <span>Clinical Record / السجل السريري</span>
        </div>
      </section>

      <section className="doctor-patient-identity-card">
        <div className="doctor-patient-identity-card__main">
          <div className="doctor-patient-identity-card__avatar" aria-hidden="true">
            <MaterialIcon name="person" className="doctor-patient-identity-card__avatar-icon" />
          </div>

          <div className="doctor-patient-identity-card__meta">
            <div className="doctor-patient-identity-card__name-row">
              <h1>
                Mahmoud El-Sayed
                <span> / اسم المريض</span>
              </h1>
              <span className="doctor-patient-id">#{patientId}</span>
            </div>

            <div className="doctor-patient-identity-card__facts">
              <span>
                <MaterialIcon name="badge" className="doctor-patient-identity-card__icon" />
                Age: 58 • Gender: Male / ذكر
              </span>
              <span>
                <MaterialIcon name="check_circle" className="doctor-patient-identity-card__icon doctor-patient-identity-card__icon--secondary" />
                Status: Active In-Care
              </span>
              <span>
                <MaterialIcon name="local_hospital" className="doctor-patient-identity-card__icon" />
                Outpatient Department / قسم العيادات الخارجية
              </span>
            </div>
          </div>
        </div>

        <div className="doctor-patient-identity-card__actions">
          <button type="button" className="doctor-patient-identity-card__button doctor-patient-identity-card__button--neutral">
            <MaterialIcon name="badge" className="doctor-patient-identity-card__button-icon" />
            Record: #{patientId}
          </button>
          <button type="button" className="doctor-patient-identity-card__button doctor-patient-identity-card__button--primary">
            <MaterialIcon name="clinical_notes" className="doctor-patient-identity-card__button-icon" />
            Start Encounter / بدء كشف
          </button>
        </div>
      </section>

      <section className="doctor-patient-alert">
        <div className="doctor-patient-alert__icon-wrap">
          <MaterialIcon name="warning" className="doctor-patient-alert__icon" />
        </div>
        <div className="doctor-patient-alert__body">
          <strong>Allergy Documentation / توثيق الحساسية</strong>
          <span>• Documented Clinical Precaution / تنبيه سريري مسجل • Review before order entry</span>
        </div>
        <span className="doctor-patient-alert__tag">CLINICAL CAUTION</span>
      </section>

      <PatientWorkspaceNavigation patientId={patientId} pathname={pathname} />
      {children}
    </div>
  );
}
