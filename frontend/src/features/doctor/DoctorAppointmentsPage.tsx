import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { doctorAppointments } from './fixtures';

export function DoctorAppointmentsPage() {
  return (
    <div className="doctor-page doctor-appointments">
      <section className="doctor-page-heading doctor-appointments__heading">
        <div>
          <div className="doctor-meta-row">
            <span className="doctor-clinical-label">DEPARTMENT OF CARDIOLOGY</span>
            <span className="doctor-muted-meta">Outpatient Clinic Room 1 / [اسم العيادة]</span>
          </div>
          <h1>Appointments &amp; Clinical Schedule <span>جدول المواعيد والعيادة</span></h1>
        </div>
        <div className="doctor-appointments__attending">
          <div><span /><strong>Dr. [Doctor Name] / د. [اسم الطبيب المعالج]</strong><small>Attending Cardiologist | استشاري أمراض القلب</small></div>
          <button className="doctor-action doctor-action--primary" type="button"><MaterialIcon name="add_circle" />Book Direct Follow-up / حجز استشارة متابعة</button>
        </div>
      </section>
      <section className="doctor-schedule-grid">
        <article className="doctor-schedule-card">
          <div className="doctor-schedule-card__top">
            <div className="doctor-schedule-title"><span className="doctor-schedule-icon"><MaterialIcon name="pace" /></span><div><h2>Today&apos;s Clinic Load <span>/ معدل الإشغال اليومي</span></h2><p>18 Scheduled Consultations + Walk-in Buffers</p></div></div>
            <div className="doctor-schedule-total"><strong>16 / 18</strong><small>Slots Booked (88%)</small></div>
          </div>
          <div className="doctor-progress"><span /><span /><span /><span /></div>
          <div className="doctor-progress-legend"><span>● 10 Completed (منتهي)</span><span>● 1 In Room (بالغرفة)</span><span>● 5 Confirmed/Waiting (بالانتظار)</span><span>● 2 Open Slots</span></div>
          <div className="doctor-slot-row"><span>Open Direct Follow-up Slots:</span><b>01:15 PM</b><b>03:30 PM</b><em><MaterialIcon name="verified_user" />Emergency Cardiology Buffer: 2 Protected</em></div>
        </article>
        <article className="doctor-schedule-card doctor-schedule-card--ai">
          <div className="doctor-ai-label"><MaterialIcon name="lock" />Doctor Scheduling AI</div><span className="doctor-ai-live"><i />Real-time Pacing</span>
          <h2>Consultation Velocity Optimal</h2>
          <p>Analyzed today&apos;s consultation pacing. Average visit duration is running <strong>2 minutes ahead of schedule</strong>. Patient Fatma Sherif (#EG-98124) checked in with vitals completed and can be called immediately.</p>
          <button type="button">Adjust Schedule Flow <MaterialIcon name="arrow_forward" /></button>
        </article>
      </section>
      <section className="doctor-appointment-table-card">
        <div className="doctor-section-heading"><div><span className="doctor-clinical-label">CLINICAL SCHEDULE</span><h2>Today&apos;s Appointments / مواعيد اليوم</h2></div><button type="button"><MaterialIcon name="filter_list" />Filter</button></div>
        <div className="doctor-appointment-list">
          {doctorAppointments.map((appointment) => <div className="doctor-appointment-row" key={appointment.id}><strong>{appointment.time}</strong><span><b>{appointment.patientName}</b><small>{appointment.visitType}</small></span><span className={`doctor-status doctor-status--${appointment.status}`}>{appointment.status.replace('-', ' ')}</span><span>{appointment.room}</span></div>)}
        </div>
      </section>
    </div>
  );
}
