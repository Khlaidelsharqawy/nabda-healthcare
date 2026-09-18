import { MaterialIcon } from '../../components/ui/MaterialIcon';

const metrics = [
  { label: 'Shift Census', value: '18', detail: 'Registered Today', icon: 'calendar_today', tone: 'primary', note: '11 Done / 1 In-Room / 6 In Queue' },
  { label: 'EMR Attestation', value: '2', detail: 'Pending Signature', icon: 'draw', tone: 'tertiary', note: 'Physician counter-sign required' },
  { label: 'Critical Flag', value: '1', detail: 'Abnormal Glucose', icon: 'warning', tone: 'error', note: 'Patient Tariq Mansoor • Fasting 142 mg/dL' },
  { label: 'Clinical Pace', value: '14.2', detail: 'min / patient', icon: 'timer', tone: 'primary', note: 'Target: 15 min • Well Paced' },
] as const;

export function DoctorDashboardPage() {
  return (
    <div className="doctor-dashboard">
      <section className="doctor-page-heading">
        <div>
          <div className="doctor-meta-row">
            <span className="doctor-clinical-label">DEPARTMENT OF CARDIOLOGY &amp; INTERNAL MEDICINE</span>
            <span className="doctor-open-label"><span /> Clinic Open • Room 1 (عيادة 1)</span>
          </div>
          <h1>Doctor Clinical Dashboard <span>/ لوحة الطبيب السريرية</span></h1>
          <p>Welcome back, <strong>Dr. [Doctor Name] (د. [اسم الطبيب المعالج])</strong> • Morning Shift (09:00 AM - 04:00 PM) • [Clinic Name] / [اسم العيادة]</p>
        </div>
        <div className="doctor-actions">
          <button className="doctor-action doctor-action--primary" type="button"><MaterialIcon name="add_circle" />+ Urgent Walk-in / كشف طارئ</button>
          <button className="doctor-action doctor-action--secondary" type="button"><MaterialIcon name="mic" />Start Scribe Copilot / تشغيل التسجيل الصوتي</button>
          <button className="doctor-action doctor-action--neutral" type="button"><MaterialIcon name="biotech" />Labs to Review / التحاليل <b>3</b></button>
        </div>
      </section>
      <section className="doctor-metrics" aria-label="Clinical shift metrics">
        {metrics.map((metric) => (
          <article className="doctor-metric" key={metric.label}>
            <div className="doctor-metric__top"><span>{metric.label}</span><MaterialIcon name={metric.icon} /></div>
            <div className={`doctor-metric__value doctor-metric__value--${metric.tone}`}>{metric.value}<small>{metric.detail}</small></div>
            <p>{metric.note}</p>
          </article>
        ))}
      </section>
      <section className="doctor-dashboard__workspace">
        <div className="doctor-workspace-card">
          <div className="doctor-workspace-card__heading"><span className="doctor-live-dot" />In-Examination Room 1</div>
          <h2>Mahmoud El-Sayed <span>(محمود السيد)</span></h2>
          <p>58 Years • Male • MRN: #EG-8933 • National Health Insurance (شامل)</p>
          <div className="doctor-vitals"><strong>148/92 <small>Blood Pressure</small></strong><strong>78 <small>Heart Rate</small></strong><strong>64 <small>eGFR mL/min</small></strong></div>
        </div>
        <div className="doctor-queue-card"><span className="doctor-clinical-label">QUEUE DISPATCH</span><h2>Waiting Room / غرفة الانتظار</h2><p>6 patients are queued for today&apos;s clinical schedule.</p><button type="button">Open Queue <MaterialIcon name="arrow_forward" /></button></div>
      </section>
    </div>
  );
}
