import { useMemo, useState } from 'react';
import { MaterialIcon, PageHeader, Button, Badge, Panel, PanelHeader, FormField, Input, Select, Textarea } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { assistantMessages } from '../../i18n/messages';
import { dispatchWebhookEvent, generateTemporaryPassword, type WebhookDispatchResult } from '../../services/webhookDispatcher';
import { recordClinicalInteraction } from '../../services/aiTrainingService';

const physicians = [
  'Dr. Tarek El-Kabbani (Cardiology & Vascular • Rm 01)',
  'Dr. Mona El-Shazly (Internal Medicine • Rm 02)',
  'Dr. Khaled El-Sayed (General Practice • Rm 03)',
] as const;

const visitTypes = [
  'Scheduled Appointment',
  'Direct Walk-in Intake',
  'Lab Review Only',
] as const;

type FormState = {
  arabicName: string;
  latinName: string;
  nationalId: string;
  dob: string;
  gender: 'male' | 'female';
  mobile: string;
  whatsapp: boolean;
  emergencyName: string;
  emergencyPhone: string;
  visitType: (typeof visitTypes)[number];
  physician: (typeof physicians)[number];
  bloodPressure: string;
  pulse: string;
  temperature: string;
  weight: string;
  complaint: string;
};

const initialForm: FormState = {
  arabicName: 'طارق منصور حسن عبد الرحيم',
  latinName: 'Tariq Mansoor Hassan Abdelrahim',
  nationalId: '[DEMO-NAT-ID-01]',
  dob: '1984-08-14',
  gender: 'male',
  mobile: '[Demo Contact Number]',
  whatsapp: true,
  emergencyName: 'Salma Mansoor (Sister)',
  emergencyPhone: '[Demo Emergency Contact]',
  visitType: 'Direct Walk-in Intake',
  physician: physicians[0],
  bloodPressure: '138/88',
  pulse: '84',
  temperature: '36.8',
  weight: '82.4',
  complaint: 'صداع نابض متكرر في مؤخرة الرأس منذ ٣ أيام مع إحساس بالدوار وخفقان ملحوظ بعد المجهود الصباحي. لا توجد آلام حادة بالصدر.',
};

export function AssistantPatientRegisterPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = assistantMessages[isRtl ? 'ar' : 'en'].register;

  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<'draft' | 'ready'>('ready');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{
    username: string;
    tempPassword: string;
    patientName: string;
    phone: string;
  } | null>(null);
  const [dispatchResult, setDispatchResult] = useState<WebhookDispatchResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleConfirmIntake = async () => {
    setIsSubmitting(true);
    const tempPassword = generateTemporaryPassword();
    const cleanPhone = form.mobile.replace(/\D/g, '');
    const username = form.nationalId.trim() || (cleanPhone ? `pt_${cleanPhone.slice(-8)}` : `pt_${Date.now().toString().slice(-6)}`);
    const patientName = isRtl ? form.arabicName : form.latinName;

    // Dispatch Webhook to n8n
    const res = await dispatchWebhookEvent('PATIENT_CREATED', {
      patientName,
      arabicName: form.arabicName,
      latinName: form.latinName,
      nationalId: form.nationalId,
      dob: form.dob,
      gender: form.gender,
      mobile: form.mobile,
      whatsappOptIn: form.whatsapp,
      emergencyContact: { name: form.emergencyName, phone: form.emergencyPhone },
      visitType: form.visitType,
      physician: form.physician,
      vitals: {
        bloodPressure: form.bloodPressure,
        pulse: form.pulse,
        temperature: form.temperature,
        weight: form.weight,
      },
      chiefComplaint: form.complaint,
      account: {
        username,
        tempPassword,
        loginUrl: window.location.origin + '/login',
      },
    });

    // Record de-identified intake note in AI training corpus
    if (form.complaint) {
      recordClinicalInteraction({
        tenant_id: 'tenant-demo-01',
        source_type: 'intake_triage',
        specialty: 'Internal Medicine / Triage',
        clinical_context: `Intake Vitals: BP ${form.bloodPressure}, Pulse ${form.pulse}, Temp ${form.temperature}. Visit: ${form.visitType}`,
        raw_text: form.complaint,
      });
    }

    setCreatedCredentials({
      username,
      tempPassword,
      patientName,
      phone: form.mobile,
    });
    setDispatchResult(res);
    setStatus('ready');
    setIsSubmitting(false);
  };

  const copyCredentialsToClipboard = () => {
    if (!createdCredentials) return;
    const text = isRtl
      ? `مرحباً ${createdCredentials.patientName}،\nتم إنشاء حسابك على منصة الرعاية الصحية:\nاسم المستخدم: ${createdCredentials.username}\nكلمة المرور المؤقتة: ${createdCredentials.tempPassword}\nرابط الدخول: ${window.location.origin}/login`
      : `Hello ${createdCredentials.patientName},\nYour AegisHealth patient account has been created:\nUsername: ${createdCredentials.username}\nTemporary Password: ${createdCredentials.tempPassword}\nLogin Portal: ${window.location.origin}/login`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const queueEstimate = useMemo(() => {
    if (form.visitType === 'Scheduled Appointment') return '~8 mins';
    if (form.visitType === 'Lab Review Only') return '~12 mins';
    return '~18 mins';
  }, [form.visitType]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const getVisitTypeInfo = (option: (typeof visitTypes)[number]) => {
    if (option === 'Scheduled Appointment') {
      return { label: copy.visitScheduled, desc: copy.visitScheduledSub, icon: 'calendar_today' };
    }
    if (option === 'Direct Walk-in Intake') {
      return { label: copy.visitWalkIn, desc: copy.visitWalkInSub, icon: 'bolt' };
    }
    return { label: copy.visitLabReview, desc: copy.visitLabReviewSub, icon: 'biotech' };
  };

  return (
    <div className="assistant-page assistant-register" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
          <Badge variant="brand" icon="verified_user">{copy.adminScope}</Badge>
          <span>•</span>
          <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <MaterialIcon name="person_add" /> {copy.patientIntake}
          </span>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
          <MaterialIcon name="schedule" /> {copy.deskShift}
        </span>
      </div>

      <div className="assistant-two-column-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Step 1: Demographics */}
          <Panel variant="elevated">
            <PanelHeader
              title={copy.step1Title}
              icon="badge"
              tag={<Badge variant="neutral">{copy.step01Of04}</Badge>}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <FormField label={copy.arabicNameLabel} hint={copy.arabicNameSub} required>
                <Input
                  dir="rtl"
                  value={form.arabicName}
                  onChange={(e) => update('arabicName', e.target.value)}
                  placeholder={copy.arabicNamePlaceholder}
                  iconStart="person"
                />
              </FormField>

              <FormField label={copy.latinNameLabel} hint={copy.latinNameSub}>
                <Input
                  value={form.latinName}
                  onChange={(e) => update('latinName', e.target.value)}
                  placeholder={copy.latinNamePlaceholder}
                  iconStart="person_outline"
                />
              </FormField>

              <div style={{ gridColumn: '1 / -1' }}>
                <FormField label={copy.nationalIdLabel} hint={copy.nationalIdVerified} required>
                  <Input
                    maxLength={20}
                    value={form.nationalId}
                    onChange={(e) => update('nationalId', e.target.value)}
                    iconStart="badge"
                    iconEnd="verified"
                  />
                </FormField>
              </div>

              <FormField label={copy.dobLabel}>
                <Input
                  type="date"
                  value={form.dob}
                  onChange={(e) => update('dob', e.target.value)}
                  iconStart="calendar_today"
                />
              </FormField>

              <FormField label={copy.genderLabel}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <Button
                    type="button"
                    variant={form.gender === 'male' ? 'primary' : 'outline'}
                    size="md"
                    icon="male"
                    onClick={() => update('gender', 'male')}
                  >
                    {copy.male}
                  </Button>
                  <Button
                    type="button"
                    variant={form.gender === 'female' ? 'primary' : 'outline'}
                    size="md"
                    icon="female"
                    onClick={() => update('gender', 'female')}
                  >
                    {copy.female}
                  </Button>
                </div>
              </FormField>

              <div style={{ gridColumn: '1 / -1' }}>
                <FormField label={copy.mobileLabel} hint={copy.mobileSub}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <div style={{ width: '80px' }}>
                      <Input value="[DEMO]" readOnly aria-label="Demo country code prefix" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Input
                        value={form.mobile}
                        onChange={(e) => update('mobile', e.target.value)}
                        iconStart="phone"
                      />
                    </div>
                  </div>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input
                      type="checkbox"
                      checked={form.whatsapp}
                      onChange={(e) => update('whatsapp', e.target.checked)}
                    />
                    <MaterialIcon name="chat" style={{ color: '#25D366' }} />
                    <span>{copy.whatsappOptIn}</span>
                  </label>
                </FormField>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <FormField label={copy.emergencyLabel} hint={copy.emergencySub}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <Input
                      value={form.emergencyName}
                      onChange={(e) => update('emergencyName', e.target.value)}
                      placeholder={copy.emergencyNamePlaceholder}
                      iconStart="person"
                    />
                    <Input
                      value={form.emergencyPhone}
                      onChange={(e) => update('emergencyPhone', e.target.value)}
                      placeholder={copy.emergencyPhonePlaceholder}
                      iconStart="phone"
                    />
                  </div>
                </FormField>
              </div>
            </div>
          </Panel>

          {/* Step 2: Visit & Provider Routing */}
          <Panel variant="elevated">
            <PanelHeader
              title={copy.step2Title}
              icon="domain_verification"
              tag={<Badge variant="neutral">{copy.step02Of04}</Badge>}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
              {visitTypes.map((option) => {
                const info = getVisitTypeInfo(option);
                const isSelected = form.visitType === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => update('visitType', option)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--brand-primary)' : '1px solid var(--border-default)',
                      backgroundColor: isSelected ? 'var(--brand-primary-light)' : 'var(--surface-card)',
                      textAlign: 'start',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <MaterialIcon
                        name={info.icon}
                        style={{ color: isSelected ? 'var(--brand-primary)' : 'var(--text-tertiary)' }}
                      />
                      {isSelected && <MaterialIcon name="check_circle" style={{ color: 'var(--brand-primary)' }} />}
                    </div>
                    <strong style={{ fontSize: '0.9375rem', color: isSelected ? 'var(--brand-primary)' : 'var(--text-main)' }}>
                      {info.label}
                    </strong>
                    <small style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem' }}>{info.desc}</small>
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.25rem', alignItems: 'center' }}>
              <FormField label={copy.assignedPhysician}>
                <Select
                  iconStart="medical_services"
                  value={form.physician}
                  onChange={(e) => update('physician', e.target.value as typeof form.physician)}
                >
                  {physicians.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </Select>
              </FormField>

              <div
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--surface-subtle)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{copy.queueStatusTitle}</span>
                  <Badge variant="success" dot>{copy.queueStatusActive}</Badge>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <span>{copy.estimatedWait} <strong>{queueEstimate}</strong></span>
                  <span>{copy.aheadInQueue} <strong>{copy.patientsCount}</strong></span>
                </div>
              </div>
            </div>
          </Panel>

          {/* Step 3: Vitals & Triage */}
          <Panel variant="elevated">
            <PanelHeader
              title={copy.step3Title}
              icon="vital_signs"
              tag={<Badge variant="neutral">{copy.step03Of04}</Badge>}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
              <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                  <span>{copy.bloodPressure}</span>
                  <MaterialIcon name="favorite" style={{ color: 'var(--color-danger-text)' }} />
                </div>
                <Input
                  inputSize="sm"
                  value={form.bloodPressure}
                  onChange={(e) => update('bloodPressure', e.target.value)}
                />
                <small style={{ color: 'var(--color-warning-text)', fontSize: '0.72rem', marginTop: '0.25rem', display: 'block' }}>{copy.bpStatus}</small>
              </div>

              <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                  <span>{copy.pulseRate}</span>
                  <MaterialIcon name="ecg_heart" style={{ color: 'var(--brand-primary)' }} />
                </div>
                <Input
                  inputSize="sm"
                  value={form.pulse}
                  onChange={(e) => update('pulse', e.target.value)}
                />
                <small style={{ color: 'var(--brand-primary)', fontSize: '0.72rem', marginTop: '0.25rem', display: 'block' }}>{copy.pulseStatus}</small>
              </div>

              <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                  <span>{copy.temperature}</span>
                  <MaterialIcon name="device_thermostat" style={{ color: 'var(--text-tertiary)' }} />
                </div>
                <Input
                  inputSize="sm"
                  value={form.temperature}
                  onChange={(e) => update('temperature', e.target.value)}
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '0.25rem', display: 'block' }}>{copy.tempStatus}</small>
              </div>

              <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                  <span>{copy.bodyMass}</span>
                  <MaterialIcon name="scale" style={{ color: 'var(--text-tertiary)' }} />
                </div>
                <Input
                  inputSize="sm"
                  value={form.weight}
                  onChange={(e) => update('weight', e.target.value)}
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '0.25rem', display: 'block' }}>{copy.massStatus}</small>
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <FormField label={copy.complaintLabel} hint={copy.complaintSub}>
                <Textarea
                  rows={4}
                  value={form.complaint}
                  onChange={(e) => update('complaint', e.target.value)}
                />
              </FormField>
            </div>
          </Panel>
        </div>

        {/* Sidebar Summary & Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Panel variant="elevated">
            <PanelHeader
              title={copy.receptionSummary}
              icon="schedule"
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div>
                <small style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{copy.patientSummaryLabel}</small>
                <strong style={{ display: 'block', fontSize: '0.9375rem', color: 'var(--text-main)' }}>{form.latinName || copy.unverifiedPatient}</strong>
              </div>
              <div>
                <small style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{copy.statusSummaryLabel}</small>
                <strong style={{ display: 'block', fontSize: '0.9375rem', color: 'var(--brand-primary)' }}>
                  {status === 'ready' ? copy.readyForReview : copy.draftSaved}
                </strong>
              </div>
              <div>
                <small style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{copy.visitTypeSummaryLabel}</small>
                <strong style={{ display: 'block', fontSize: '0.9375rem', color: 'var(--text-main)' }}>{getVisitTypeInfo(form.visitType).label}</strong>
              </div>
              <div>
                <small style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{copy.queueSummaryLabel}</small>
                <strong style={{ display: 'block', fontSize: '0.9375rem', color: 'var(--text-main)' }}>{queueEstimate}</strong>
              </div>
            </div>
          </Panel>

          <Panel variant="elevated">
            <PanelHeader
              title={copy.operationalChecklist}
              icon="assignment_turned_in"
            />
            <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <MaterialIcon name="check_circle" style={{ color: 'var(--color-success-text)' }} />
                <span>{copy.idValidated}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <MaterialIcon name="check_circle" style={{ color: 'var(--color-success-text)' }} />
                <span>{copy.contactRecorded}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <MaterialIcon name="check_circle" style={{ color: 'var(--color-success-text)' }} />
                <span>{copy.measurementsRecorded}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <MaterialIcon name="check_circle" style={{ color: 'var(--color-success-text)' }} />
                <span>{copy.queuePrepared}</span>
              </li>
            </ul>
          </Panel>

          {createdCredentials && (
            <Panel variant="elevated" style={{ border: '2px solid var(--brand-primary)', backgroundColor: 'var(--brand-primary-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <Badge variant="success" icon="check_circle">
                  {isRtl ? 'تم إنشاء الحساب بنجاح' : 'Account Created Successfully'}
                </Badge>
                <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
                  {isRtl ? 'أتمتة n8n جاهزة' : 'n8n Automated'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0.6rem', backgroundColor: 'var(--surface-card)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{isRtl ? 'اسم المستخدم:' : 'Username:'}</span>
                  <strong style={{ fontFamily: 'monospace' }}>{createdCredentials.username}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0.6rem', backgroundColor: 'var(--surface-card)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{isRtl ? 'كلمة المرور المؤقتة:' : 'Temp Password:'}</span>
                  <strong style={{ fontFamily: 'monospace', color: 'var(--brand-primary)' }}>{createdCredentials.tempPassword}</strong>
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
                    fontSize: '0.8rem',
                    marginTop: '0.25rem',
                  }}
                >
                  <MaterialIcon name="chat" style={{ color: '#25D366' }} />
                  <span>
                    {isRtl
                      ? 'تم إرسال بيانات الدخول تلقائياً إلى واتساب المريض عبر webhook الخاص بـ n8n'
                      : 'Credentials dispatched automatically to patient WhatsApp via n8n webhook'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    icon={copied ? 'check' : 'content_copy'}
                    onClick={copyCredentialsToClipboard}
                  >
                    {copied ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ بيانات الدخول' : 'Copy Credentials')}
                  </Button>
                  <a
                    href={`https://wa.me/${createdCredentials.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      isRtl
                        ? `مرحباً ${createdCredentials.patientName}،\nتم تسجيلك بنجاح في المركز الطبي.\nبيانات حسابك:\nالمستخدم: ${createdCredentials.username}\nكلمة المرور: ${createdCredentials.tempPassword}\nالدخول: ${window.location.origin}/login`
                        : `Hello ${createdCredentials.patientName},\nYou are registered at the Medical Center.\nUsername: ${createdCredentials.username}\nTemp Password: ${createdCredentials.tempPassword}\nPortal: ${window.location.origin}/login`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="ui-btn ui-btn--outline ui-btn--sm"
                    style={{ flexShrink: 0 }}
                    title={isRtl ? 'فتح واتساب مباشرة' : 'Open WhatsApp directly'}
                  >
                    <MaterialIcon name="open_in_new" />
                  </a>
                </div>
              </div>
            </Panel>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              icon={isSubmitting ? 'hourglass_empty' : 'task_alt'}
              disabled={isSubmitting}
              onClick={handleConfirmIntake}
            >
              {isSubmitting ? (isRtl ? 'جارٍ الإنشاء والإرسال...' : 'Creating & Dispatching...') : copy.confirmIntake}
            </Button>
            <Button
              variant="outline"
              size="md"
              fullWidth
              icon="save"
              onClick={() => setStatus('draft')}
            >
              {copy.saveDraft}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
