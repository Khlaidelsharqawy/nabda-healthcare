import { useState } from 'react';
import { MaterialIcon, Button, Badge, Panel, PanelHeader, FormField, Input } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { patientMessages } from '../../i18n/messages';
import { patientProfileFixture as data } from './fixtures';

type ContactFields = typeof data.personal;

export function PatientProfilePage() {
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState('');
  const { direction, setDirection } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? patientMessages.ar.profile : patientMessages.en.profile;

  const [alerts, setAlerts] = useState({ appointments: true, diagnostics: true, prescriptions: true });
  const [contact, setContact] = useState<ContactFields>(data.personal);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') setCustomImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      setNotice(isRtl ? 'يرجى إكمال جميع حقول كلمة المرور.' : 'Please complete all password fields.');
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setNotice(isRtl ? 'كلمتا المرور غير متطابقتين.' : 'New passwords do not match.');
      return;
    }
    setNotice(isRtl ? 'معاينة تجريبية: تم تحديث كلمة المرور محلياً لهذه الجلسة.' : 'Password updated locally for this preview session.');
    setPasswords({ current: '', next: '', confirm: '' });
  };

  const updateContact = <K extends keyof ContactFields>(key: K, value: ContactFields[K]) => {
    setContact((current) => ({ ...current, [key]: value }));
  };

  const saveLocal = () => {
    setEditing(false);
    setNotice(copy.saveNotice);
  };

  const alertItems = [
    { key: 'appointments' as const, label: copy.appointmentReminders, detail: copy.appointmentRemindersDetail, icon: 'event_upcoming' },
    { key: 'diagnostics' as const, label: copy.diagnosticAlerts, detail: copy.diagnosticAlertsDetail, icon: 'biotech' },
    { key: 'prescriptions' as const, label: copy.prescriptionUpdates, detail: copy.prescriptionUpdatesDetail, icon: 'prescriptions' },
  ];

  const baselineItems = [
    { label: copy.height, value: data.baseline[0].value, detail: copy.recordedBaseline },
    { label: copy.weight, value: data.baseline[1].value, detail: copy.recordedBaseline },
    { label: copy.bodyIndex, value: data.baseline[2].value, detail: copy.forPersonalRef },
    { label: copy.restingPulse, value: data.baseline[3].value, detail: copy.recordedBaseline },
  ];

  return (
    <div className="patient-page patient-profile" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Context Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.65rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--surface-subtle)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Badge variant="brand" icon="health_and_safety">{copy.portal}</Badge>
          <span>•</span>
          <strong style={{ color: 'var(--text-main)' }}>{copy.title}</strong>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-success-text)' }}>
          <MaterialIcon name="verified_user" /> {copy.patientScope}
        </span>
      </div>

      {/* Patient Hero Profile Card */}
      <Panel variant="elevated">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ position: 'relative' }}>
              {customImage ? (
                <img
                  src={customImage}
                  alt=""
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--brand-primary)',
                    color: '#ffffff',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                  }}
                >
                  {data.initials}
                </div>
              )}
              <label
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  insetInlineEnd: '-4px',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--surface-card)',
                  border: '1px solid var(--border-default)',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  fontSize: '0.875rem',
                }}
                title={isRtl ? 'تغيير الصورة الشخصية' : 'Change profile photo'}
              >
                <MaterialIcon name="photo_camera" />
                <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
              </label>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <Badge variant="success" icon="shield">{copy.verifiedAccount}</Badge>
                <Badge variant="neutral">{copy.selfScoped}</Badge>
              </div>
              <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>
                {isRtl ? data.arabicName : data.name}
              </h1>
              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                <span>{copy.patientId}: {data.patientId}</span>
                <span>•</span>
                <span><MaterialIcon name="local_hospital" /> {data.clinicName}</span>
                <span>•</span>
                <span><MaterialIcon name="bloodtype" /> {data.bloodType}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)' }}>
              <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem', textTransform: 'uppercase' }}>{copy.nextAppointment}</small>
              <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--brand-primary)', marginTop: '0.15rem' }}>{data.nextAppointment}</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{data.clinician}</span>
            </div>
            <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)' }}>
              <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem', textTransform: 'uppercase' }}>{copy.activePrescriptions}</small>
              <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--text-main)', marginTop: '0.15rem' }}>{data.prescriptions}</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{copy.patientViewOnly}</span>
            </div>
          </div>
        </div>
      </Panel>

      {/* Grid Layout */}
      <div className="patient-two-column-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Patient Dossier */}
          <Panel variant="elevated">
            <PanelHeader
              title={copy.dossierTitle}
              icon="badge"
              actions={
                <Button
                  variant="outline"
                  size="sm"
                  icon={editing ? 'close' : 'edit_note'}
                  onClick={() => setEditing((c) => !c)}
                >
                  {editing ? copy.cancelEdit : copy.editDetails}
                </Button>
              }
            />

            {editing ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                <FormField label={copy.fullLegalName}>
                  <Input value={contact.legalName} onChange={(e) => updateContact('legalName', e.target.value)} />
                </FormField>
                <FormField label={copy.primaryPhone}>
                  <Input value={contact.phone} onChange={(e) => updateContact('phone', e.target.value)} />
                </FormField>
                <FormField label={copy.emailAddress}>
                  <Input value={contact.email} onChange={(e) => updateContact('email', e.target.value)} />
                </FormField>
                <FormField label={copy.residentialAddress}>
                  <Input value={contact.address} onChange={(e) => updateContact('address', e.target.value)} />
                </FormField>
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <Button variant="outline" size="md" onClick={() => { setContact(data.personal); setEditing(false); }}>
                    {copy.cancel}
                  </Button>
                  <Button variant="primary" size="md" onClick={saveLocal}>
                    {copy.saveLocalDraft}
                  </Button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                <div>
                  <small style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{copy.fullLegalName}</small>
                  <strong style={{ display: 'block', fontSize: '0.9375rem', marginTop: '0.15rem' }}>{isRtl ? contact.arabicLegalName : contact.legalName}</strong>
                </div>
                <div>
                  <small style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{copy.dateOfBirthGender}</small>
                  <strong style={{ display: 'block', fontSize: '0.9375rem', marginTop: '0.15rem' }}>{contact.birthDate} ({contact.gender})</strong>
                </div>
                <div>
                  <small style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{copy.primaryPhone}</small>
                  <strong style={{ display: 'block', fontSize: '0.9375rem', marginTop: '0.15rem' }}>{contact.phone}</strong>
                </div>
                <div>
                  <small style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{copy.emailAddress}</small>
                  <strong style={{ display: 'block', fontSize: '0.9375rem', marginTop: '0.15rem' }}>{contact.email}</strong>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <small style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{copy.residentialAddress}</small>
                  <strong style={{ display: 'block', fontSize: '0.9375rem', marginTop: '0.15rem' }}>{contact.address}</strong>
                </div>
              </div>
            )}

            {/* Emergency Contact */}
            <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MaterialIcon name="emergency_share" style={{ color: 'var(--color-danger-text)' }} />
                  <strong style={{ fontSize: '0.875rem' }}>{copy.emergencyHeading}</strong>
                </div>
                <Badge variant="warning">{copy.priorityContact}</Badge>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem' }}>{copy.contactPerson}</small>
                  <strong style={{ display: 'block', fontSize: '0.875rem' }}>{isRtl ? data.emergency.arabicName : data.emergency.name}</strong>
                </div>
                <div>
                  <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem' }}>{copy.relationship}</small>
                  <strong style={{ display: 'block', fontSize: '0.875rem' }}>{data.emergency.relationship}</strong>
                </div>
                <div>
                  <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem' }}>{copy.emergencyPhone}</small>
                  <strong style={{ display: 'block', fontSize: '0.875rem' }}>{data.emergency.phone}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', fontSize: '0.78rem', color: 'var(--text-tertiary)', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span><MaterialIcon name="schedule" /> {copy.attestationNotice}</span>
              <Button variant="outline" size="sm" icon="verified" onClick={() => setNotice(copy.confirmNotice)}>
                {copy.confirmProfileLocally}
              </Button>
            </div>
          </Panel>

          {/* Baseline Measurements */}
          <Panel variant="elevated">
            <PanelHeader
              title={copy.baselineTitle}
              icon="monitoring"
            />
            <p style={{ margin: '0 0 1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{copy.baselineMuted}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {baselineItems.map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface-subtle)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <small style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{item.label}</small>
                  <strong style={{ display: 'block', fontSize: '1.25rem', color: 'var(--text-main)', margin: '0.2rem 0' }}>{item.value}</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.detail}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Right Aside: Security & Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Security / Password */}
          <Panel variant="elevated">
            <PanelHeader
              title={isRtl ? 'كلمة المرور وأمان الحساب' : 'Password & Security'}
              icon="lock"
            />
            <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
              <FormField label={isRtl ? 'كلمة المرور الحالية' : 'Current Password'}>
                <Input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                />
              </FormField>
              <FormField label={isRtl ? 'كلمة المرور الجديدة' : 'New Password'}>
                <Input
                  type="password"
                  value={passwords.next}
                  onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
                />
              </FormField>
              <FormField label={isRtl ? 'تأكيد كلمة المرور' : 'Confirm Password'}>
                <Input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                />
              </FormField>
              <Button variant="primary" size="md" fullWidth icon="key" type="submit">
                {isRtl ? 'تحديث كلمة المرور' : 'Update Password'}
              </Button>
            </form>
          </Panel>

          {/* Notifications & Language */}
          <Panel variant="elevated">
            <PanelHeader
              title={copy.alertsTitle}
              icon="notifications_active"
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
              {alertItems.map((item) => (
                <label key={item.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer', fontSize: '0.8125rem' }}>
                  <input
                    type="checkbox"
                    checked={alerts[item.key]}
                    onChange={(e) => setAlerts((c) => ({ ...c, [item.key]: e.target.checked }))}
                    style={{ marginTop: '0.2rem' }}
                  />
                  <div>
                    <strong style={{ display: 'block' }}>{item.label}</strong>
                    <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem' }}>{item.detail}</small>
                  </div>
                </label>
              ))}

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                <strong style={{ fontSize: '0.8125rem', display: 'block', marginBottom: '0.5rem' }}>{copy.preferredLanguage}</strong>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <Button
                    variant={isRtl ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setDirection('rtl')}
                  >
                    {copy.arabicLang}
                  </Button>
                  <Button
                    variant={!isRtl ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setDirection('ltr')}
                  >
                    {copy.englishLang}
                  </Button>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {notice && (
        <div className="auth-alert auth-alert--success" role="status">
          <MaterialIcon name="info" />
          <span>{notice}</span>
        </div>
      )}
    </div>
  );
}
