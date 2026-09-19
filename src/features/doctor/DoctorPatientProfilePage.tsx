import { MaterialIcon, Panel, PanelHeader, PanelBody, Badge, Button } from '../../components/ui';
import { PatientWorkspaceShell } from './PatientWorkspaceShell';
import { doctorPatientProfiles } from './fixtures';
import { useTheme } from '../../theme/ThemeProvider';
import { doctorMessages } from '../../i18n/messages';

export function DoctorPatientProfilePage({ patientId }: { patientId: string }) {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? doctorMessages.ar.profile : doctorMessages.en.profile;
  const breadcrumb = isRtl ? doctorMessages.ar.workspace.tabs.overview : doctorMessages.en.workspace.tabs.overview;

  const patient = doctorPatientProfiles.find((entry) => entry.id === patientId) ?? doctorPatientProfiles[0];

  if (!patient) {
    return (
      <div className="aegis-page doctor-patient-profile">
        <Panel variant="elevated">
          <PanelBody style={{ textAlign: 'center', padding: '3rem' }}>
            <MaterialIcon name="person_off" style={{ fontSize: '3rem', color: 'var(--text-tertiary)', marginBottom: '1rem' }} />
            <h1 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Patient record unavailable</h1>
            <p style={{ color: 'var(--text-muted)' }}>No synthetic patient profile was registered for this session.</p>
          </PanelBody>
        </Panel>
      </div>
    );
  }

  return (
    <PatientWorkspaceShell patientId={patient.id} pathname={window.location.pathname} breadcrumbLabel={breadcrumb}>
      <div className="doctor-patient-workspace-grid">
        {/* Main Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Triage Vitals Panel */}
          <Panel variant="elevated">
            <PanelHeader
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MaterialIcon name="monitor_heart" style={{ color: 'var(--brand-primary)' }} />
                  <span>{copy.vitalsTitle}</span>
                </div>
              }
              actions={<Badge variant="neutral" size="sm">{copy.triageRecord}</Badge>}
            />
            <PanelBody>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '0.75rem',
                }}
              >
                {patient.vitals.map((vital) => (
                  <div
                    key={`${patient.id}-${vital.label}`}
                    style={{
                      padding: '0.875rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--surface-subtle)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {isRtl && vital.labelAr ? vital.labelAr : vital.label}
                      </span>
                      <MaterialIcon name={vital.icon} style={{ fontSize: '1rem', color: 'var(--text-tertiary)' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                      <strong style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>{vital.value}</strong>
                      <small style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{vital.valueSuffix}</small>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: vital.tone === 'secondary' ? 'var(--brand-primary)' : vital.tone === 'tertiary' ? '#f59e0b' : '#10b981',
                        }}
                      />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{vital.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </PanelBody>
          </Panel>

          {/* Active Diagnoses / Conditions Panel */}
          <Panel variant="elevated">
            <PanelHeader
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MaterialIcon name="medical_services" style={{ color: 'var(--brand-primary)' }} />
                  <span>{copy.conditionsTitle}</span>
                </div>
              }
              actions={
                <Button
                  variant="ghost"
                  size="sm"
                  icon="add_circle"
                  onClick={() => { window.location.href = `/doctor/patients/${patient.id}/notes`; }}
                >
                  {copy.addCondition}
                </Button>
              }
            />
            <PanelBody style={{ padding: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {patient.conditions.map((condition) => (
                  <div
                    key={`${patient.id}-condition-${condition.title}-${condition.detail}-${condition.status}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.875rem 1.25rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--brand-primary-light)',
                          color: 'var(--brand-primary)',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <MaterialIcon name="clinical_notes" style={{ fontSize: '1.125rem' }} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <strong style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
                            {isRtl && condition.titleAr ? condition.titleAr : condition.title}
                          </strong>
                          <Badge variant="neutral" size="sm">{condition.tag}</Badge>
                        </div>
                        <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {condition.detail}
                        </small>
                      </div>
                    </div>
                    <Badge variant={condition.tone === 'secondary' ? 'brand' : condition.tone === 'tertiary' ? 'warning' : 'neutral'} size="sm">
                      {isRtl && condition.statusAr ? condition.statusAr : condition.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </PanelBody>
          </Panel>

          {/* Active Medications / Rx Regimen Panel */}
          <Panel variant="elevated">
            <PanelHeader
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MaterialIcon name="prescriptions" style={{ color: 'var(--brand-primary)' }} />
                  <span>{copy.rxTitle}</span>
                </div>
              }
              actions={
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                    {patient.medications.length} {copy.activeRxCount}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="edit_note"
                    onClick={() => { window.location.href = `/doctor/patients/${patient.id}/prescriptions`; }}
                  >
                    {copy.adjust}
                  </Button>
                </div>
              }
            />
            <PanelBody style={{ padding: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {patient.medications.map((medication) => (
                  <div
                    key={`${patient.id}-medication-${medication.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.875rem 1.25rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--surface-subtle)',
                          color: 'var(--brand-primary)',
                          display: 'grid',
                          placeItems: 'center',
                          fontWeight: 700,
                          fontSize: '0.8125rem',
                          fontFamily: 'var(--font-display)',
                          flexShrink: 0,
                        }}
                      >
                        Rx
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <strong style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
                            {isRtl && medication.nameAr ? medication.nameAr : medication.name}
                          </strong>
                          <Badge variant="brand" size="sm">{medication.status}</Badge>
                        </div>
                        <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {isRtl && medication.frequencyAr ? medication.frequencyAr : medication.frequency}
                        </small>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{copy.recorded}</span>
                  </div>
                ))}
              </div>
            </PanelBody>
          </Panel>
        </div>

        {/* Side Column */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Next Scheduled Appointment Box */}
          <Panel variant="elevated">
            <PanelHeader
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}>
                  <MaterialIcon name="event_upcoming" style={{ color: 'var(--brand-primary)' }} />
                  <span>{copy.nextVisit}</span>
                </div>
              }
              actions={<Badge variant="brand" size="sm">{copy.confirmed}</Badge>}
            />
            <PanelBody>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.25rem 0' }}>
                {isRtl && patient.nextVisit.titleAr ? patient.nextVisit.titleAr : patient.nextVisit.title}
              </h3>
              <span style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--brand-primary)', fontWeight: 600, marginBottom: '0.35rem' }}>
                {isRtl && patient.nextVisit.labelAr ? patient.nextVisit.labelAr : patient.nextVisit.label}
              </span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>
                {patient.nextVisit.subtitle}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  variant="primary"
                  size="sm"
                  icon="stethoscope"
                  style={{ flex: 1 }}
                  onClick={() => { window.location.href = '/doctor/voice-sessions/new'; }}
                >
                  {copy.prepareConsultation}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon="edit_calendar"
                  aria-label={copy.reschedule}
                  onClick={() => {
                    alert(isRtl ? 'تم إرسال طلب إعادة جدولة الموعد إلى مكتب الاستقبال' : 'Reschedule request submitted to reception operations desk');
                  }}
                />
              </div>
            </PanelBody>
          </Panel>

          {/* Quick Actions Panel */}
          <Panel variant="elevated">
            <PanelHeader title={<span>{copy.fastActions}</span>} />
            <PanelBody>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                {patient.fastActions.map((action) => {
                  const getActionRoute = () => {
                    if (action.icon === 'prescriptions') return '/doctor/prescriptions/new';
                    if (action.icon === 'biotech') return '/doctor/orders/lab/new';
                    if (action.icon === 'radiology' || action.icon === 'imaging') return '/doctor/orders/imaging/new';
                    if (action.icon === 'edit_note') return `/doctor/patients/${patient.id}/notes`;
                    return `/doctor/patients/${patient.id}/timeline`;
                  };

                  return (
                    <button
                      type="button"
                      key={`${patient.id}-action-${action.label}`}
                      onClick={() => { window.location.href = getActionRoute(); }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '0.75rem 0.5rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--surface-subtle)',
                        border: '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        gap: '0.25rem',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <MaterialIcon name={action.icon} style={{ fontSize: '1.25rem', color: 'var(--brand-primary)' }} />
                      <strong style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>{isRtl && action.labelAr ? action.labelAr : action.label}</strong>
                      <small style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{isRtl && action.subLabelAr ? action.subLabelAr : action.subLabel}</small>
                    </button>
                  );
                })}
              </div>
            </PanelBody>
          </Panel>

          {/* Recent Encounters List */}
          <Panel variant="elevated">
            <PanelHeader
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}>
                  <MaterialIcon name="history" style={{ color: 'var(--brand-primary)' }} />
                  <span>{copy.recentEncounters}</span>
                </div>
              }
              actions={
                <a
                  href={`/doctor/patients/${patient.id}/timeline`}
                  style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', textDecoration: 'none', fontWeight: 600 }}
                >
                  {copy.viewAll}
                </a>
              }
            />
            <PanelBody style={{ padding: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {patient.recentEncounters.map((encounter) => (
                  <div
                    key={`${patient.id}-encounter-${encounter.title}`}
                    style={{
                      padding: '0.75rem 1.25rem',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <strong style={{ fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                        {isRtl && encounter.titleAr ? encounter.titleAr : encounter.title}
                      </strong>
                      <Badge variant="neutral" size="sm">{encounter.tag}</Badge>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 0.35rem 0' }}>
                      {encounter.detail}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                      <MaterialIcon name="attachment" style={{ fontSize: '0.875rem' }} />
                      <span>{encounter.noteCount} {copy.notesCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </PanelBody>
          </Panel>

          {/* Multidisciplinary Care Team */}
          <Panel variant="elevated">
            <PanelHeader
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}>
                  <MaterialIcon name="groups" style={{ color: 'var(--brand-primary)' }} />
                  <span>{copy.careTeam}</span>
                </div>
              }
            />
            <PanelBody style={{ padding: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {patient.careTeam.map((member) => (
                  <div
                    key={`${patient.id}-care-team-${member.name}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1.25rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--surface-subtle)',
                          display: 'grid',
                          placeItems: 'center',
                          color: 'var(--brand-primary)',
                        }}
                      >
                        <MaterialIcon
                          name={member.role.includes('Attending') || member.role.includes('Primary') ? 'stethoscope' : 'clinical_notes'}
                          style={{ fontSize: '1rem' }}
                        />
                      </div>
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                          {isRtl && member.nameAr ? member.nameAr : member.name}
                        </strong>
                        <small style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                          {isRtl && member.roleAr ? member.roleAr : member.role}
                        </small>
                      </div>
                    </div>
                    <Badge variant={member.tone === 'primary' ? 'brand' : 'neutral'} size="sm">
                      {isRtl && member.badgeAr ? member.badgeAr : member.badge}
                    </Badge>
                  </div>
                ))}
              </div>
            </PanelBody>
          </Panel>
        </aside>
      </div>
    </PatientWorkspaceShell>
  );
}
