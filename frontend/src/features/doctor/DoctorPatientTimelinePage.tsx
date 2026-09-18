import { useState } from 'react';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { PatientWorkspaceShell } from './PatientWorkspaceShell';
import { doctorPatientTimeline, type PatientTimelineCategory } from './fixtures';

const filters: { label: string; value: PatientTimelineCategory | 'all' }[] = [
  { label: 'All Events', value: 'all' },
  { label: 'In-Person Visits', value: 'visit' },
  { label: 'Clinical Notes / SOAP', value: 'notes' },
  { label: 'Prescriptions / Rx Changes', value: 'rx' },
  { label: 'Lab Results', value: 'lab' },
  { label: 'Procedures & ECG', value: 'procedure' },
];

export function DoctorPatientTimelinePage({ patientId }: { patientId: string }) {
  const [activeFilter, setActiveFilter] = useState<PatientTimelineCategory | 'all'>('all');
  const visibleEvents = doctorPatientTimeline.filter((event) => activeFilter === 'all' || event.category === activeFilter);

  return (
    <PatientWorkspaceShell patientId={patientId} pathname={window.location.pathname} breadcrumbLabel="Clinical Timeline / التسلسل الزمني">
      <div className="doctor-patient-timeline">
        <section className="doctor-patient-timeline__controls doctor-patient-card">
          <div className="doctor-patient-timeline__controls-heading"><MaterialIcon name="filter_list" /><strong>Event Filtering / تصنيف السجلات</strong></div>
          <div className="doctor-patient-timeline__filters" aria-label="timeline event filters">
            {filters.map((filter) => <button type="button" className={activeFilter === filter.value ? 'is-active' : ''} key={filter.value} onClick={() => setActiveFilter(filter.value)}>{filter.label} {filter.value === 'all' ? `(${doctorPatientTimeline.length})` : ''}</button>)}
          </div>
          <div className="doctor-patient-timeline__legend"><span><i /> Chronological Clinical Records / السجلات السريرية الزمنية</span><span>Active Records</span></div>
        </section>

        <section className="doctor-patient-timeline__summary doctor-patient-card">
          <strong>Chronological Summary</strong>
          <span>Active Records</span>
          <p>Longitudinal event feed documented across patient encounters.</p>
          <div><span>Status: Documented</span><span>Audit: Verified</span></div>
        </section>

        <section className="doctor-patient-timeline__feed" aria-label="clinical timeline">
          <div className="doctor-patient-timeline__track" />
          {visibleEvents.map((event) => (
            <article className="doctor-patient-timeline__event" key={event.id}>
              <div className={`doctor-patient-timeline__node doctor-patient-timeline__node--${event.tone}`}>
                <MaterialIcon name={event.icon} />
                <small>{event.dateLabel}</small>
              </div>
              <div className="doctor-patient-card doctor-patient-timeline__event-card">
                <header>
                  <div><span>{event.typeLabel}</span><h2>{event.title}</h2></div>
                  <time>{event.date}</time>
                </header>
                <p>{event.description}</p>
                <div className="doctor-patient-timeline__event-details">
                  {event.details.map((detail) => <div key={detail.label}><span>{detail.label}</span><strong>{detail.value}</strong></div>)}
                </div>
                <footer><span><MaterialIcon name="verified" /> Attending: <strong>{event.attending}</strong></span><button type="button">View Record <MaterialIcon name="keyboard_arrow_down" /></button></footer>
              </div>
            </article>
          ))}
        </section>
      </div>
    </PatientWorkspaceShell>
  );
}
