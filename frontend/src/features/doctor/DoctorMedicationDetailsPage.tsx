import { useState } from 'react';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { doctorMedicationDetails } from './fixtures';

export function DoctorMedicationDetailsPage({ medicationId }: { medicationId: string }) {
  const [notice, setNotice] = useState('');
  const medication = { ...doctorMedicationDetails, id: medicationId };

  return (
    <div className="doctor-page doctor-medication-details">
      <div className="doctor-medication-details__breadcrumb"><a href="/doctor/orders"><MaterialIcon name="assignment" /> Clinical Orders / الأوامر السريرية</a><MaterialIcon name="chevron_right" /><strong>Medication Details / تفاصيل الدواء</strong></div>
      <header className="doctor-medication-details__heading"><div><span className="doctor-medication-details__eyebrow"><MaterialIcon name="medication" /> Synthetic Medication Record</span><h1>{medication.name} <span>/ تفاصيل الدواء</span></h1><p>Display-only medication detail for the authorized Doctor Workspace demonstration.</p></div><div className="doctor-medication-details__actions"><button type="button" onClick={() => setNotice('Demo only — no prescription was edited.')}><MaterialIcon name="edit_note" /> Edit Prescription / تعديل الوصفة</button><button type="button" onClick={() => setNotice('Demo only — medication status was not changed.')}><MaterialIcon name="cancel" /> Discontinue / إيقاف الدواء</button></div></header>
      <section className="doctor-medication-details__context doctor-patient-card"><div><strong>Mahmoud El-Sayed / محمود السيد</strong><span>MRN: PT-DEMO-01 • Active In-Care • Encounter APT-DEMO-01</span></div><span><MaterialIcon name="verified" /> Doctor Attestation Mode</span></section>
      <section className="doctor-medication-details__telemetry"><Metric label="Active Regimen / النظام العلاجي" value={medication.duration} /><Metric label="Remaining Refills / مرات التكرار المتبقية" value={`${medication.refillsRemaining} / 03`} /><Metric label="Patient Tolerance / التحمل السريري" value="Reported Tolerant / متحمل" /><Metric label="Review Cycle / دورة إعادة التقييم" value="+14 Days" /></section>
      <div className="doctor-medication-details__grid"><section className="doctor-patient-card"><CardHeading icon="prescriptions" title="Prescription Details" arabic="تفاصيل الوصفة الطبية المعتمدة" /><div className="doctor-medication-details__fields"><DetailField label="Dosage / الجرعة" value={medication.dosage} icon="straighten" /><DetailField label="Frequency / التكرار" value={medication.frequency} icon="schedule" /><DetailField label="Route / مسار الإعطاء" value={medication.route} icon="alt_route" /><DetailField label="Duration / المدة" value={medication.duration} icon="date_range" /></div><div className="doctor-medication-details__prescriber"><MaterialIcon name="stethoscope" /><div><span>Prescribing Clinician / الطبيب المعالج</span><strong>{medication.prescriber}</strong></div><div><span>Prescribed Date / تاريخ الوصف</span><strong>{medication.prescribedDate}</strong></div></div></section><section className="doctor-patient-card"><CardHeading icon="clinical_notes" title="Administration Directions" arabic="تعليمات الاستخدام وإرشادات المريض" /><div className="doctor-medication-details__directions"><span><MaterialIcon name="patient_list" /> Patient Directions / التوجيهات</span><p>{medication.instructions}</p></div><div className="doctor-medication-details__quantities"><DetailField label="Dispense Quantity" value={medication.quantity} icon="inventory_2" /><DetailField label="Refill Allowance" value={`${medication.refillsRemaining} remaining`} icon="autorenew" /></div><div className="doctor-medication-details__advisory"><MaterialIcon name="info" /> Dispense and substitution details are synthetic demonstration content only.</div></section></div>
      {notice && <p className="doctor-medication-details__notice" role="status">{notice}</p>}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) { return <div><span>{label}</span><strong>{value}</strong></div>; }
function CardHeading({ icon, title, arabic }: { icon: string; title: string; arabic: string }) { return <header className="doctor-medication-details__card-heading"><MaterialIcon name={icon} /><div><h2>{title}</h2><span>{arabic}</span></div></header>; }
function DetailField({ label, value, icon }: { label: string; value: string; icon: string }) { return <div className="doctor-medication-details__field"><span>{label}<MaterialIcon name={icon} /></span><strong>{value}</strong><small>Display-only synthetic value</small></div>; }
