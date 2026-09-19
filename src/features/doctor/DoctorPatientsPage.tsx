import { useState, type MouseEvent } from 'react';
import { MaterialIcon, PageHeader, StatCard, Panel, PanelHeader, PanelBody, Badge, Button, Input, EmptyState } from '../../components/ui';
import { doctorPatients as initialDoctorPatients, type DoctorPatient } from './fixtures';
import { useTheme } from '../../theme/ThemeProvider';
import { doctorMessages } from '../../i18n/messages';
import { dispatchWebhookEvent, generateTemporaryPassword } from '../../services/webhookDispatcher';
import { recordClinicalInteraction } from '../../services/aiTrainingService';

export function DoctorPatientsPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? doctorMessages.ar.patients : doctorMessages.en.patients;

  const [patientsList, setPatientsList] = useState<DoctorPatient[]>(initialDoctorPatients);
  const [query, setQuery] = useState('');
  const [state, setState] = useState<'default' | 'skeleton' | 'empty' | 'notfound' | 'denied'>('default');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{
    username: string;
    tempPassword: string;
    patientName: string;
    phone: string;
  } | null>(null);

  const [newPatient, setNewPatient] = useState({
    name: '',
    phone: '',
    nationalId: '',
    age: '38',
    gender: 'Male',
    complaint: '',
  });

  const filtered = patientsList.filter((patient) =>
    `${patient.displayName} ${patient.medicalRecordNumber}`.toLowerCase().includes(query.toLowerCase())
  );

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.phone) return;
    setIsSubmitting(true);

    const tempPassword = generateTemporaryPassword();
    const cleanPhone = newPatient.phone.replace(/\D/g, '');
    const username = newPatient.nationalId.trim() || `pt_${cleanPhone.slice(-8) || Date.now().toString().slice(-6)}`;
    const newMrn = `#EG-${Math.floor(10000 + Math.random() * 90000)}`;

    // 1. Dispatch Webhook to n8n for WhatsApp automation
    await dispatchWebhookEvent('PATIENT_CREATED', {
      patientName: newPatient.name,
      mobile: newPatient.phone,
      nationalId: newPatient.nationalId,
      mrn: newMrn,
      age: newPatient.age,
      gender: newPatient.gender,
      chiefComplaint: newPatient.complaint,
      account: {
        username,
        tempPassword,
        loginUrl: window.location.origin + '/login',
      },
    });

    // 2. Index in AI training corpus (anonymized)
    if (newPatient.complaint) {
      recordClinicalInteraction({
        tenant_id: 'tenant-demo-01',
        source_type: 'doctor_consultation',
        specialty: 'Internal Medicine',
        clinical_context: `Age: ${newPatient.age}, Gender: ${newPatient.gender}. Registered by Attending Doctor`,
        raw_text: newPatient.complaint,
      });
    }

    // 3. Add to local doctor patients roster
    const addedPatient: DoctorPatient = {
      id: `patient-${Date.now()}`,
      tenantId: 'tenant-demo-01',
      displayName: newPatient.name,
      age: parseInt(newPatient.age, 10) || 35,
      medicalRecordNumber: newMrn,
      status: 'stable',
      nextVisit: isRtl ? 'اليوم' : 'Today',
      lastVisit: isRtl ? 'اليوم' : 'Today',
    };

    setPatientsList([addedPatient, ...patientsList]);
    setCreatedCredentials({
      username,
      tempPassword,
      patientName: newPatient.name,
      phone: newPatient.phone,
    });
    setIsSubmitting(false);
  };

  const openPatient = (event: MouseEvent<HTMLAnchorElement>, patientId: string) => {
    event.preventDefault();
    window.history.pushState({}, '', `/doctor/patients/${patientId}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const getStatusVariant = (status: string): 'brand' | 'success' | 'warning' | 'neutral' => {
    switch (status) {
      case 'in-room':
        return 'brand';
      case 'discharged':
        return 'success';
      case 'follow-up':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="aegis-page doctor-patients">
      {/* Scope Assurance Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.625rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--surface-subtle)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <MaterialIcon name="lock" style={{ fontSize: '1rem', color: 'var(--brand-primary)' }} />
            {copy.scopeTitle}
          </span>
          <span style={{ color: 'var(--border-default)' }}>•</span>
          <strong style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-main)' }}>
            <MaterialIcon name="groups" style={{ fontSize: '1rem' }} />
            {copy.carePanel}
          </strong>
          <span style={{ color: 'var(--border-default)' }}>•</span>
          <span style={{ fontStyle: 'italic' }}>{copy.tenant}</span>
        </div>
        <Badge variant="success" size="sm" icon="verified">
          {copy.consentVerified}
        </Badge>
      </div>

      <PageHeader
        kicker={copy.kicker}
        title={copy.heading}
        subtitle={copy.subtitle}
      />

      {/* KPI Summary Cards */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <StatCard
          label={copy.scheduledVisits}
          value={copy.scheduled}
          icon="event_available"
        />
        <StatCard
          label={copy.pendingLabs}
          value={copy.pending}
          icon="biotech"
        />
        <StatCard
          label={copy.activePatients}
          value={copy.active}
          icon="groups"
        />
      </section>

      {/* State Switcher Controls for Demonstration */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MaterialIcon name="tune" style={{ color: 'var(--brand-primary)' }} />
          <strong style={{ fontSize: '0.8125rem', color: 'var(--text-main)' }}>{copy.demoMode}:</strong>
          <small style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{copy.demoDesc}</small>
        </div>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {(['default', 'skeleton', 'empty', 'notfound', 'denied'] as const).map((option) => (
            <Button
              key={option}
              variant={state === option ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setState(option)}
            >
              {option === 'default'
                ? copy.defaultRoster
                : option === 'skeleton'
                ? copy.loadingSkeleton
                : option === 'empty'
                ? copy.emptyPanel
                : option === 'notfound'
                ? copy.noSearchResults
                : copy.accessDenied}
            </Button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: '1 1 260px' }}>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.searchPlaceholder}
            prefixIcon="search"
          />
        </div>
        <select
          defaultValue="all"
          style={{
            padding: '0.625rem 0.875rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            fontSize: '0.875rem',
            color: 'var(--text-main)',
            outline: 'none',
          }}
        >
          <option value="all">{copy.statusAll}</option>
          <option value="today">{copy.statusToday}</option>
          <option value="pending">{copy.statusPending}</option>
        </select>
        <select
          defaultValue="any"
          style={{
            padding: '0.625rem 0.875rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            fontSize: '0.875rem',
            color: 'var(--text-main)',
            outline: 'none',
          }}
        >
          <option value="any">{copy.lastVisitAny}</option>
          <option value="7d">{copy.lastVisit7d}</option>
        </select>
        <Button
          variant="outline"
          size="sm"
          icon="refresh"
          onClick={() => setQuery('')}
          aria-label={copy.resetFilters}
        />
      </div>

      {/* Patient Cohort Registry Panel */}
      <Panel variant="elevated">
        <PanelHeader
          title={
            <div>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--brand-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.15rem',
                }}
              >
                {copy.authorizedPatients}
              </span>
              <span>{copy.clinicalRegistry}</span>
            </div>
          }
          actions={
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Button
                variant="primary"
                size="sm"
                icon="person_add"
                onClick={() => {
                  setCreatedCredentials(null);
                  setShowAddModal(true);
                }}
              >
                {isRtl ? '+ مريض جديد وواتساب' : '+ New Patient & WhatsApp'}
              </Button>
              <Button variant="outline" size="sm" icon="download" disabled title="Demo-only action: exports are not connected.">
                {copy.exportCohort}
              </Button>
            </div>
          }
        />

        {showAddModal && (
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--surface-subtle)',
              borderBottom: '1px solid var(--border-default)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MaterialIcon name="person_add" style={{ color: 'var(--brand-primary)' }} />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                  {isRtl ? 'تسجيل مريض جديد وتوليد حساب مع إرسال واتساب تلقائي' : 'Register Patient & Auto-Dispatch WhatsApp Credentials'}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon="close"
                onClick={() => setShowAddModal(false)}
                aria-label={isRtl ? 'إغلاق' : 'Close'}
              />
            </div>

            {createdCredentials ? (
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--brand-primary-light)',
                  border: '2px solid var(--brand-primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Badge variant="success" icon="verified">
                    {isRtl ? 'تم إنشاء الحساب وإرسال الواتساب بنجاح' : 'Account Created & Dispatched via WhatsApp'}
                  </Badge>
                  <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
                    {isRtl ? 'أتمتة n8n النشطة' : 'Active n8n Automation'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                  <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--surface-card)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{isRtl ? 'اسم المستخدم:' : 'Username:'}</span>
                    <strong style={{ fontFamily: 'monospace', fontSize: '0.95rem' }}>{createdCredentials.username}</strong>
                  </div>
                  <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--surface-card)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{isRtl ? 'كلمة المرور المؤقتة:' : 'Temp Password:'}</span>
                    <strong style={{ fontFamily: 'monospace', fontSize: '0.95rem', color: 'var(--brand-primary)' }}>{createdCredentials.tempPassword}</strong>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(37, 211, 102, 0.12)',
                    color: '#0d7337',
                    fontSize: '0.8125rem',
                  }}
                >
                  <MaterialIcon name="chat" style={{ color: '#25D366' }} />
                  <span>
                    {isRtl
                      ? `تم إرسال رسالة واتساب تحتوي على الرابط وبيانات تسجيل الدخول إلى الرقم: ${createdCredentials.phone}`
                      : `WhatsApp message with login credentials dispatched to: ${createdCredentials.phone}`}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={copied ? 'check' : 'content_copy'}
                    onClick={() => {
                      const text = isRtl
                        ? `مرحباً ${createdCredentials.patientName}، تم إنشاء حسابك في العيادة.\nاسم المستخدم: ${createdCredentials.username}\nكلمة المرور: ${createdCredentials.tempPassword}\nالرابط: ${window.location.origin}/login`
                        : `Hello ${createdCredentials.patientName},\nYour clinic account has been created.\nUsername: ${createdCredentials.username}\nPassword: ${createdCredentials.tempPassword}\nPortal: ${window.location.origin}/login`;
                      navigator.clipboard.writeText(text);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 3000);
                    }}
                  >
                    {copied ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ البيانات' : 'Copy Credentials')}
                  </Button>
                  <a
                    href={`https://wa.me/${createdCredentials.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      isRtl
                        ? `مرحباً ${createdCredentials.patientName}،\nتم تسجيل حسابك بالعيادة بنجاح.\nاسم المستخدم: ${createdCredentials.username}\nكلمة المرور: ${createdCredentials.tempPassword}\nرابط الدخول: ${window.location.origin}/login`
                        : `Hello ${createdCredentials.patientName},\nYour clinic account is ready.\nUsername: ${createdCredentials.username}\nPassword: ${createdCredentials.tempPassword}\nPortal: ${window.location.origin}/login`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="ui-btn ui-btn--outline ui-btn--sm"
                  >
                    <MaterialIcon name="open_in_new" />
                    <span>{isRtl ? 'فتح واتساب' : 'Open WhatsApp'}</span>
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowAddModal(false);
                      setCreatedCredentials(null);
                    }}
                  >
                    {isRtl ? 'إغلاق وإظهار في السجل' : 'Done & Show in Roster'}
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreatePatient} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      {isRtl ? 'اسم المريض الكامل' : 'Patient Full Name'} *
                    </label>
                    <Input
                      required
                      value={newPatient.name}
                      onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                      placeholder={isRtl ? 'مثال: أحمد محمود علي' : 'e.g. Ahmed Mahmoud Ali'}
                      iconStart="person"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      {isRtl ? 'رقم هاتف الواتساب' : 'WhatsApp Mobile Number'} *
                    </label>
                    <Input
                      required
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                      placeholder="01012345678"
                      iconStart="phone"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      {isRtl ? 'الرقم القومي / الهوية' : 'National ID / Residency'}
                    </label>
                    <Input
                      value={newPatient.nationalId}
                      onChange={(e) => setNewPatient({ ...newPatient, nationalId: e.target.value })}
                      placeholder={isRtl ? 'رقم الهوية المكون من 14 رقم' : '14-digit National ID'}
                      iconStart="badge"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                        {isRtl ? 'العمر' : 'Age'}
                      </label>
                      <Input
                        type="number"
                        value={newPatient.age}
                        onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                        {isRtl ? 'النوع' : 'Gender'}
                      </label>
                      <select
                        value={newPatient.gender}
                        onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.625rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-default)',
                          backgroundColor: 'var(--surface-card)',
                          color: 'var(--text-main)',
                          fontSize: '0.875rem',
                        }}
                      >
                        <option value="Male">{isRtl ? 'ذكر' : 'Male'}</option>
                        <option value="Female">{isRtl ? 'أنثى' : 'Female'}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    {isRtl ? 'الشكوى السريرية الأولية (يتم فهرستها للتدريب الآلي)' : 'Primary Chief Complaint (Auto-Indexed for AI Training)'}
                  </label>
                  <Input
                    value={newPatient.complaint}
                    onChange={(e) => setNewPatient({ ...newPatient, complaint: e.target.value })}
                    placeholder={isRtl ? 'مثال: فحص روتيني لارتفاع ضغط الدم ومتابعة نسبة السكر التراكمي' : 'e.g. Routine check for hypertension and HbA1c follow-up'}
                    iconStart="medical_information"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    onClick={() => setShowAddModal(false)}
                  >
                    {isRtl ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    icon={isSubmitting ? 'hourglass_empty' : 'send'}
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? (isRtl ? 'جارٍ الإنشاء والإرسال...' : 'Creating & Sending...')
                      : (isRtl ? 'إنشاء الحساب وإرسال الواتساب فوراً' : 'Create Account & Dispatch WhatsApp')}
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}

        <PanelBody style={{ padding: 0 }}>
          {state === 'denied' ? (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
              <MaterialIcon name="block" style={{ fontSize: '3rem', color: 'var(--color-danger-text)', marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>
                {copy.accessDeniedTitle}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                {copy.accessDeniedDesc}
              </p>
            </div>
          ) : state === 'skeleton' ? (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
              <MaterialIcon name="progress_activity" style={{ fontSize: '2.5rem', color: 'var(--brand-primary)', marginBottom: '0.75rem', animation: 'spin 1.5s linear infinite' }} />
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', margin: 0 }}>
                {copy.loadingRoster}
              </p>
            </div>
          ) : state === 'empty' || state === 'notfound' || filtered.length === 0 ? (
            <EmptyState
              icon="person_search"
              title={state === 'empty' ? copy.noPatients : copy.noSearchResults}
              description={copy.adjustFilters}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filtered.map((patient) => (
                <a
                  key={patient.id}
                  href={`/doctor/patients/${patient.id}`}
                  onClick={(event) => openPatient(event, patient.id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto auto auto',
                    alignItems: 'center',
                    gap: '1.25rem',
                    padding: '1rem 1.25rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--brand-primary-light)',
                      color: 'var(--brand-primary)',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {patient.displayName
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)}
                  </div>

                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9375rem', color: 'var(--text-main)', marginBottom: '0.15rem' }}>
                      {patient.displayName}
                    </strong>
                    <small style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                      {patient.age} {copy.years} • {copy.mrn} {patient.medicalRecordNumber}
                    </small>
                  </div>

                  <div>
                    <Badge variant={getStatusVariant(patient.status)} size="sm">
                      {copy.statuses[patient.status]}
                    </Badge>
                  </div>

                  <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                    <small style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                      {copy.nextVisit}
                    </small>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {patient.nextVisit}
                    </span>
                  </div>

                  <MaterialIcon name={isRtl ? 'chevron_left' : 'chevron_right'} style={{ color: 'var(--text-tertiary)' }} />
                </a>
              ))}
            </div>
          )}
        </PanelBody>
      </Panel>
    </div>
  );
}
