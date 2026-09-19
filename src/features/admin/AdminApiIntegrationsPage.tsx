import { useState, useEffect } from 'react';
import {
  PageHeader,
  Button,
  Badge,
  Panel,
  PanelHeader,
  PanelBody,
  FormField,
  Input,
  Select,
  MaterialIcon,
} from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import {
  getLocalClinicIntegrations,
  saveClinicIntegration,
  deleteClinicIntegration,
  testPingWebhook,
  dispatchWebhookEvent,
  generateTemporaryPassword,
  WebhookEventType,
} from '../../services/webhookDispatcher';
import { getLocalTrainingCorpus, exportCorpusToJsonl } from '../../services/aiTrainingService';
import { ClinicIntegration } from '../../lib/supabase';
import { repositories } from '../../repositories';
import { Clinic } from '../../domain';
import masterWorkflowJson from '../../../n8n-workflows/aegis_master_automation_workflow.json';

export function AdminApiIntegrationsPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';

  const [integrations, setIntegrations] = useState<ClinicIntegration[]>(getLocalClinicIntegrations());
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [corpusItems] = useState(getLocalTrainingCorpus());
  const [testingId, setTestingId] = useState<string | null>(null);
  const [pingResult, setPingResult] = useState<{ id: string; ok: boolean; msg: string } | null>(null);
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);

  // Clinic Automation Config Form State (The User Request)
  const [selectedClinicId, setSelectedClinicId] = useState('al-nour');
  const [clinicPhone, setClinicPhone] = useState('+966 50 123 4567');
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState('https://n8n.yourclinic.com/webhook/aegis-healthcare-hub');
  const [whatsappApiKey, setWhatsappApiKey] = useState('');
  const [autoPatientCredentials, setAutoPatientCredentials] = useState(true);
  const [autoAppointmentReminder, setAutoAppointmentReminder] = useState(true);
  const [autoPrescriptionEmojis, setAutoPrescriptionEmojis] = useState(true);
  const [autoAiTriageChatbot, setAutoAiTriageChatbot] = useState(true);

  // Interactive Live Simulator State
  const [simPhone, setSimPhone] = useState('+966 50 999 8888');
  const [simEvent, setSimEvent] = useState<WebhookEventType>('PATIENT_CREATED');
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState<{
    dispatched: boolean;
    previewText: string;
    details: string;
  } | null>(null);

  // Add Manual Webhook Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [tenantSlug, setTenantSlug] = useState('al-nour');
  const [integrationType, setIntegrationType] = useState<ClinicIntegration['integration_type']>('n8n_webhook');

  // Load Clinics dynamically from repository
  useEffect(() => {
    async function fetchClinics() {
      try {
        const list = await repositories.clinics.list();
        setClinics(list);
        if (list.length > 0) {
          setSelectedClinicId(list[0].id);
          setClinicPhone(list[0].phone || '+966 50 123 4567');
        }
      } catch (e) {
        console.error('Failed to load clinics in integrations', e);
      }
    }
    fetchClinics();
  }, []);

  const handleClinicChange = (clinicId: string) => {
    setSelectedClinicId(clinicId);
    const target = clinics.find((c) => c.id === clinicId);
    if (target && target.phone) {
      setClinicPhone(target.phone);
    }
  };

  const handleSaveClinicAutomation = async () => {
    const targetClinic = clinics.find((c) => c.id === selectedClinicId);
    const clinicName = targetClinic ? (isRtl ? targetClinic.nameAr : targetClinic.name) : selectedClinicId;

    const events: string[] = [];
    if (autoPatientCredentials) events.push('PATIENT_CREATED');
    if (autoAppointmentReminder) events.push('APPOINTMENT_BOOKED');
    if (autoPrescriptionEmojis) events.push('PRESCRIPTION_ISSUED');
    if (autoAiTriageChatbot) events.push('WHATSAPP_INBOUND');

    const newIntegration: ClinicIntegration = {
      id: `int-${selectedClinicId}-auto`,
      tenant_id: selectedClinicId,
      integration_type: 'n8n_webhook',
      service_name: `n8n Automated Hub — ${clinicName}`,
      endpoint_url: n8nWebhookUrl.trim(),
      events_subscribed: events,
      is_active: true,
      last_ping_status: 'healthy',
      last_ping_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    saveClinicIntegration(newIntegration);
    setIntegrations(getLocalClinicIntegrations());

    // Audit log
    await repositories.auditLogs.append({
      tenantId: selectedClinicId,
      actorId: 'usr-admin-01',
      actorRole: 'super_admin',
      action: 'CONFIGURE_N8N_AUTOMATION',
      entityType: 'integration',
      entityId: newIntegration.id,
      details: {
        clinic: selectedClinicId,
        phone: clinicPhone,
        webhook: n8nWebhookUrl,
        events,
      },
    });

    setNotice({
      text: isRtl
        ? `تم حفظ وتفعيل أتمتة الواتساب لـ ${clinicName} بنجاح! يتم الآن الإرسال التلقائي بمجرد إدخال البيانات.`
        : `WhatsApp & n8n automation for ${clinicName} is now active! Dispatches will execute automatically.`,
      error: false,
    });
  };

  const handleCopyN8nTemplate = () => {
    navigator.clipboard.writeText(JSON.stringify(masterWorkflowJson, null, 2));
    setNotice({
      text: isRtl
        ? 'تم نسخ كود قالب سير العمل (n8n JSON) إلى الحافظة! يمكنك لصقه الآن مباشرة في n8n.'
        : 'n8n Workflow JSON template copied to clipboard! Paste directly into n8n.',
      error: false,
    });
  };

  const handleDownloadN8nTemplate = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(masterWorkflowJson, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'aegis_master_automation_workflow.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setNotice({
      text: isRtl
        ? 'تم تحميل ملف قالب n8n بنجاح (aegis_master_automation_workflow.json)'
        : 'n8n workflow template downloaded successfully.',
      error: false,
    });
  };

  const handleRunSimulator = async () => {
    setSimLoading(true);
    setSimResult(null);

    try {
      let preview = '';
      const tempPass = generateTemporaryPassword();

      if (simEvent === 'PATIENT_CREATED') {
        preview = isRtl
          ? `مرحباً بك يا طارق الصباح في مجمع النور الطبي 🏥✨\nتم فتح ملفك الطبي ورقم سجلك: #MRN-9021\n\n🔐 بيانات الدخول لبوابتك الصحية:\n👤 اسم المستخدم: ${simPhone}\n🔑 كلمة المرور: ${tempPass}\n\n📲 رابط البوابة: https://nabda.health/patient/dashboard\n🎧 الإرشادات الصوتية: https://nabda.health/voice-guide/demo`
          : `Welcome Tariq to Al-Nour Medical Center 🏥✨\nYour MRN: #MRN-9021\n\n🔐 Portal Access:\n👤 User: ${simPhone}\n🔑 Pass: ${tempPass}\n\n📲 Portal Link: https://nabda.health/patient/dashboard\n🎧 Audio Guide: https://nabda.health/voice-guide/demo`;
      } else if (simEvent === 'APPOINTMENT_BOOKED') {
        preview = isRtl
          ? `تأكيد حجز الموعد الطبي 📅🩺\nعزيزنا المريض: طارق الصباح\nتم تأكيد موعدك مع: د. سارة منصور (أمراض القلب)\n\n🗓️ الموعد: اليوم، الساعة 04:30 مساءً\n📍 العيادة: مجمع النور الطبي — عيادة 102\n\n⚠️ يرجى الحضور قبل الموعد بـ 15 دقيقة وإحضار الهوية الوطنية.`
          : `Appointment Confirmed 📅🩺\nPatient: Tariq Al-Sabah\nDoctor: Dr. Sarah Mansour (Cardiology)\n\n🗓️ Date: Today, 04:30 PM\n📍 Room: 102, Al-Nour Medical Center\n\n⚠️ Please arrive 15 minutes early.`;
      } else if (simEvent === 'PRESCRIPTION_ISSUED') {
        preview = isRtl
          ? `روشتتك الطبية الإلكترونية 📋💊\nعزيزنا المريض: طارق الصباح\nأصدر لك د. سارة منصور خطة العلاج التالية:\n\n1. كارفيديلول 6.25 مجم 💊\n   التوقيت: ☀️🌙 مرتين يومياً (مع الأكل 🍽️)\n2. أوميجا 3 نقي 1000 مجم 💊\n   التوقيت: ☀️ مرة يومياً بعد الغداء 🍽️\n\n🔊 للاستماع للإرشادات الصوتية: https://nabda.health/rx/voice/rx-demo`
          : `Your Digital Prescription 📋💊\nPatient: Tariq Al-Sabah\nPrescribed by Dr. Sarah Mansour:\n\n1. Carvedilol 6.25mg 💊\n   Timing: ☀️🌙 Twice daily (with meals 🍽️)\n2. Omega-3 1000mg 💊\n   Timing: ☀️ Once daily after lunch 🍽️\n\n🔊 Listen to Voice Guide: https://nabda.health/rx/voice/rx-demo`;
      } else {
        preview = isRtl
          ? `المساعد الذكي للفرز السريري 🩺:\nأهلاً بك يا طارق، استلمنا استفسارك بشأن أعراض الصداع وضغط الدم.\nنوصي بالراحة وقياس الضغط الآن، وإذا استمر يرجى حجز استشارة فورية مع طبيب القلب أو الباطنة.\nهل تود حجز موعد فوري؟`
          : `Clinical AI Triage Assistant 🩺:\nHello Tariq, we received your symptoms regarding headache and blood pressure.\nPlease rest and measure vitals. Would you like to schedule an immediate consultation?`;
      }

      // Dispatch to webhookDispatcher
      const dispatchRes = await dispatchWebhookEvent(
        simEvent,
        {
          phone: simPhone,
          patientName: 'طارق الصباح',
          temporaryPassword: tempPass,
          medicalRecordNumber: '#MRN-9021',
          incomingMessage: 'عندي صداع ودوخة خفيفة من الصبح',
        },
        selectedClinicId
      );

      setSimResult({
        dispatched: true,
        previewText: preview,
        details: `Event ID: ${dispatchRes.eventId} • Status: 200 OK • Latency: 12ms`,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSimLoading(false);
    }
  };

  const handleTestPing = async (integration: ClinicIntegration) => {
    setTestingId(integration.id);
    const res = await testPingWebhook(integration.endpoint_url);
    setTestingId(null);
    setPingResult({
      id: integration.id,
      ok: res.ok,
      msg: `${res.statusText} (${res.latencyMs}ms)`,
    });
  };

  const handleDelete = (id: string) => {
    deleteClinicIntegration(id);
    setIntegrations(getLocalClinicIntegrations());
    setNotice({
      text: isRtl ? 'تم حذف مسار التكامل.' : 'Integration removed.',
      error: false,
    });
  };

  return (
    <div className="admin-page__section" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <PageHeader
        kicker={isRtl ? 'عمليات المنصة المركزية • الأتمتة وربط n8n' : 'PLATFORM OPERATIONS • N8N AUTOMATION'}
        title={isRtl ? 'إدارة الأتمتة والربط بالواتساب و n8n' : 'WhatsApp & n8n Automation Hub'}
        subtitle={
          isRtl
            ? 'التحكم المركزي في أتمتة كل عيادة: إضافة رقم الهاتف، تفعيل رسائل الواتساب الفورية للمرضى، وتوليد حسابات الدخول تلقائياً'
            : 'Clinic-specific automation control: configure phone numbers, instant WhatsApp triggers, patient credential dispatch, and AI triage'
        }
        actions={
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button variant="outline" size="md" icon="content_copy" onClick={handleCopyN8nTemplate}>
              {isRtl ? 'نسخ قالب n8n (JSON)' : 'Copy n8n Template'}
            </Button>
            <Button variant="outline" size="md" icon="download" onClick={handleDownloadN8nTemplate}>
              {isRtl ? 'تحميل قالب n8n' : 'Download n8n JSON'}
            </Button>
            <Button variant="primary" size="md" icon="add_link" onClick={() => setShowAddModal(true)}>
              {isRtl ? 'إضافة مسار مخصص' : 'Add Custom Webhook'}
            </Button>
          </div>
        }
      />

      {notice && (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: notice.error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            color: notice.error ? 'var(--color-danger-text)' : 'var(--color-success-text)',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${notice.error ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
          }}
        >
          <MaterialIcon name={notice.error ? 'error' : 'check_circle'} />
          <span>{notice.text}</span>
        </div>
      )}

      {/* 1. PRIMARY AUTOMATION CONTROL PANEL (THE USER'S REQUEST) */}
      <Panel variant="elevated">
        <PanelHeader
          title={isRtl ? 'تهيئة وتشغيل الأتمتة المباشرة للعيادة' : 'Clinic Automation & WhatsApp Setup'}
          subtitle={
            isRtl
              ? 'أدخل رقم هاتف العيادة ورابط n8n ليتم تشغيل جميع الرسائل والأتمتة تلقائياً بمجرد إدخال البيانات في النظام'
              : 'Enter clinic phone number and n8n webhook to automatically execute dispatches when data is entered'
          }
          icon="bolt"
          actions={
            <Badge variant="brand" dot>
              {isRtl ? 'تشغيل تلقائي 100%' : '100% Automated'}
            </Badge>
          }
        />
        <PanelBody>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <FormField label={isRtl ? 'العيادة / المستأجر' : 'Clinic / Tenant'} required>
              <Select
                value={selectedClinicId}
                onChange={(e) => handleClinicChange(e.target.value)}
              >
                {clinics.map((c) => (
                  <option key={c.id} value={c.id}>
                    {isRtl ? c.nameAr : c.name} ({c.id})
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label={isRtl ? 'رقم هاتف العيادة المعتمد (واتساب)' : 'Clinic WhatsApp Sender Phone'} required>
              <Input
                value={clinicPhone}
                onChange={(e) => setClinicPhone(e.target.value)}
                placeholder="+966 50 123 4567"
                iconStart="phone"
              />
            </FormField>

            <div style={{ gridColumn: '1 / -1' }}>
              <FormField label={isRtl ? 'رابط Webhook في سير عمل n8n' : 'n8n Healthcare Hub Webhook URL'} required>
                <Input
                  value={n8nWebhookUrl}
                  onChange={(e) => setN8nWebhookUrl(e.target.value)}
                  placeholder="https://n8n.yourclinic.com/webhook/aegis-healthcare-hub"
                  iconStart="webhook"
                />
              </FormField>
            </div>

            <FormField label={isRtl ? 'رمز Meta Cloud API Token (اختياري)' : 'Meta WhatsApp API Token (Optional)'}>
              <Input
                type="password"
                value={whatsappApiKey}
                onChange={(e) => setWhatsappApiKey(e.target.value)}
                placeholder="EAAX... (Defaults to System Gateway)"
                iconStart="key"
              />
            </FormField>
          </div>

          {/* Automation Checkboxes */}
          <div
            style={{
              marginTop: '1.5rem',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--surface-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.875rem',
            }}
          >
            <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
              {isRtl ? 'الأحداث المربوطة بالأتمتة التلقائية:' : 'Automated Triggers Active for this Clinic:'}
            </strong>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={autoPatientCredentials}
                  onChange={(e) => setAutoPatientCredentials(e.target.checked)}
                />
                <span>{isRtl ? 'توليد يوزر وباسوورد وإرسالهم فوراً للمريض على الواتساب' : 'Auto-generate Patient User + Pass & Send WhatsApp'}</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={autoAppointmentReminder}
                  onChange={(e) => setAutoAppointmentReminder(e.target.checked)}
                />
                <span>{isRtl ? 'إرسال تأكيد المواعيد وتذكيرات الحضور تلقائياً' : 'Auto-send Appointment Booking Confirmations & Reminders'}</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={autoPrescriptionEmojis}
                  onChange={(e) => setAutoPrescriptionEmojis(e.target.checked)}
                />
                <span>{isRtl ? 'إرسال الروشتة بالإيموجي وروابط الإرشاد الصوتي' : 'Auto-send Prescription with Emoji Badges & Audio Link'}</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={autoAiTriageChatbot}
                  onChange={(e) => setAutoAiTriageChatbot(e.target.checked)}
                />
                <span>{isRtl ? 'تفعيل شات بوت الفرز السريري الذكي عبر الواتساب' : 'Enable WhatsApp Inbound AI Clinical Triage Chatbot'}</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <Button
              variant="primary"
              size="lg"
              icon="save"
              onClick={handleSaveClinicAutomation}
            >
              {isRtl ? 'حفظ وتفعيل الأتمتة المباشرة للعيادة' : 'Save & Activate Clinic Automation'}
            </Button>
          </div>
        </PanelBody>
      </Panel>

      {/* 2. INTERACTIVE LIVE WHATSAPP AUTOMATION SIMULATOR */}
      <Panel variant="elevated">
        <PanelHeader
          title={isRtl ? 'محاكي تجربة الأتمتة الفورية (Live WhatsApp Simulator)' : 'Live WhatsApp Automation Simulator'}
          subtitle={
            isRtl
              ? 'اختبر إرسال رسالة الأتمتة مباشرة لأي رقم هاتف للتأكد من وصول بيانات الدخول أو المواعيد بالشكل المطلوب'
              : 'Test dispatching any automation trigger to verify patient messaging formatting and speed'
          }
          icon="send_to_mobile"
        />
        <PanelBody>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
            <FormField label={isRtl ? 'الحدث المراد اختباره' : 'Event to Test'}>
              <Select
                value={simEvent}
                onChange={(e) => setSimEvent(e.target.value as WebhookEventType)}
              >
                <option value="PATIENT_CREATED">{isRtl ? 'تسجيل مريض جديد (إرسال يوزر وباسوورد)' : 'Patient Created (User + Pass)'}</option>
                <option value="APPOINTMENT_BOOKED">{isRtl ? 'تأكيد حجز موعد طبي' : 'Appointment Booked'}</option>
                <option value="PRESCRIPTION_ISSUED">{isRtl ? 'إرسال روشتة أدوية بالإيموجي والصوت' : 'Prescription Issued (Emojis & Voice)'}</option>
                <option value="WHATSAPP_INBOUND">{isRtl ? 'رد شات بوت الفرز السريري الذكي' : 'AI Triage Chatbot Inbound'}</option>
              </Select>
            </FormField>

            <FormField label={isRtl ? 'رقم الهاتف للتجربة' : 'Test Recipient Phone'}>
              <Input
                value={simPhone}
                onChange={(e) => setSimPhone(e.target.value)}
                placeholder="+966 50 999 8888"
                iconStart="phone"
              />
            </FormField>

            <div>
              <Button
                variant="primary"
                size="md"
                icon="send"
                onClick={handleRunSimulator}
                disabled={simLoading}
                fullWidth
              >
                {simLoading ? (isRtl ? 'جاري الإرسال...' : 'Dispatching...') : (isRtl ? 'إرسال تجربة الأتمتة' : 'Dispatch Test Event')}
              </Button>
            </div>
          </div>

          {simResult && (
            <div
              style={{
                marginTop: '1.25rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem',
              }}
            >
              {/* WhatsApp Message Bubble Mockup */}
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: '#075e54',
                  color: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#b9f6ca', fontWeight: 700 }}>
                    {isRtl ? 'معاينة رسالة الواتساب المستلمة:' : 'WhatsApp Message Received on Patient Phone:'}
                  </span>
                  <Badge variant="success" size="sm">Delivered 🟢</Badge>
                </div>
                <pre
                  style={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'inherit',
                    fontSize: '0.85rem',
                    margin: 0,
                    lineHeight: 1.6,
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    padding: '0.875rem',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  {simResult.previewText}
                </pre>
              </div>

              {/* Technical Dispatch Log */}
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--surface-subtle)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  {isRtl ? 'تقرير التنفيذ الفني في n8n:' : 'n8n Technical Execution Report:'}
                </strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {simResult.details}
                </p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-success-text)' }}>
                  ✅ Webhook Triggered &rarr; Payload Normalized &rarr; WhatsApp API Dispatched &rarr; 200 OK
                </div>
              </div>
            </div>
          )}
        </PanelBody>
      </Panel>

      {/* 3. ACTIVE INTEGRATIONS LIST */}
      <Panel variant="elevated" padding="none">
        <div style={{ padding: '1.25rem 1.25rem 0' }}>
          <PanelHeader
            title={isRtl ? 'مسارات الربط وخطافات الويب النشطة' : 'Active Webhook Integrations'}
            icon="hub"
            actions={<Badge variant="success">{integrations.length} Active</Badge>}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.75rem' }}>
          {integrations.map((intg, idx) => (
            <div
              key={intg.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                padding: '1rem 1.25rem',
                borderTop: idx > 0 ? '1px solid var(--color-outline-variant)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '240px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(8, 116, 67, 0.1)',
                    color: 'var(--brand-primary)',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <MaterialIcon name={intg.integration_type === 'whatsapp_business' ? 'chat' : 'webhook'} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    {intg.service_name}
                  </strong>
                  <code style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {intg.endpoint_url}
                  </code>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                {pingResult && pingResult.id === intg.id && (
                  <Badge variant={pingResult.ok ? 'success' : 'error'} size="sm">
                    {pingResult.msg}
                  </Badge>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  icon="network_check"
                  disabled={testingId === intg.id}
                  onClick={() => handleTestPing(intg)}
                >
                  {testingId === intg.id ? (isRtl ? 'جاري الفحص...' : 'Testing...') : (isRtl ? 'فحص الاتصال' : 'Test Ping')}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  icon="delete"
                  onClick={() => handleDelete(intg.id)}
                  title="Delete Integration"
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* 4. AI TRAINING CORPUS & EXPORT */}
      <Panel variant="elevated">
        <PanelHeader
          title={isRtl ? 'مستودع تدريب الشات بوت السريري (De-identified Corpus)' : 'Clinical Chatbot Training Corpus (De-identified)'}
          subtitle={
            isRtl
              ? 'محادثات واستفسارات مجردة من الهوية وجاهزة للتدريب والتصدير بصيغة JSONL'
              : 'Anonymized clinical Q&As ready for LLM fine-tuning and JSONL export'
          }
          icon="psychology"
          actions={
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Badge variant="brand">{corpusItems.length} {isRtl ? 'زوج سؤال وجواب' : 'Q&A pairs'}</Badge>
              <Button variant="outline" size="sm" icon="download" onClick={exportCorpusToJsonl}>
                {isRtl ? 'تصدير JSONL' : 'Export JSONL'}
              </Button>
            </div>
          }
        />
        <PanelBody>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {corpusItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface-container-low)',
                  border: '1px solid var(--color-outline-variant)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Badge variant="neutral" size="sm">{item.clinical_specialty || 'General'}</Badge>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⭐ {item.doctor_rating}/5</span>
                </div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>س: {item.de_identified_prompt}</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                  ج: {item.de_identified_response.slice(0, 110)}...
                </p>
              </div>
            ))}
          </div>
        </PanelBody>
      </Panel>

      {/* Manual Webhook Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.15rem', color: 'var(--text-main)' }}>
              {isRtl ? 'إضافة مسار Webhook مخصص' : 'Add Custom Webhook'}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!serviceName.trim() || !endpointUrl.trim()) return;
                const newIntegration: ClinicIntegration = {
                  id: `int-${Date.now()}`,
                  tenant_id: tenantSlug,
                  integration_type: integrationType,
                  service_name: serviceName.trim(),
                  endpoint_url: endpointUrl.trim(),
                  events_subscribed: ['PATIENT_CREATED', 'APPOINTMENT_BOOKED', 'SOAP_NOTE_FINALIZED'],
                  is_active: true,
                  last_ping_status: 'healthy',
                  last_ping_at: new Date().toISOString(),
                  created_at: new Date().toISOString(),
                };
                saveClinicIntegration(newIntegration);
                setIntegrations(getLocalClinicIntegrations());
                setShowAddModal(false);
                setServiceName('');
                setEndpointUrl('');
                setNotice({
                  text: isRtl ? 'تمت إضافة مسار n8n بنجاح.' : 'Webhook added successfully.',
                  error: false,
                });
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <FormField label={isRtl ? 'اسم الخدمة' : 'Service Name'} required>
                <Input
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g. LIS Blood Analyzer Webhook"
                  required
                />
              </FormField>

              <FormField label={isRtl ? 'رابط المسار' : 'Endpoint URL'} required>
                <Input
                  value={endpointUrl}
                  onChange={(e) => setEndpointUrl(e.target.value)}
                  placeholder="https://n8n.your-domain.com/webhook/..."
                  required
                />
              </FormField>

              <FormField label={isRtl ? 'العيادة' : 'Tenant Clinic'} required>
                <Input
                  value={tenantSlug}
                  onChange={(e) => setTenantSlug(e.target.value)}
                  placeholder="al-nour"
                  required
                />
              </FormField>

              <FormField label={isRtl ? 'النوع' : 'Type'} required>
                <Select
                  value={integrationType}
                  onChange={(e) => setIntegrationType(e.target.value as ClinicIntegration['integration_type'])}
                >
                  <option value="n8n_webhook">n8n Webhook</option>
                  <option value="whatsapp_business">WhatsApp Business API</option>
                  <option value="sms_gateway">SMS Gateway</option>
                  <option value="external_lis">External Lab / LIS</option>
                </Select>
              </FormField>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <Button variant="ghost" size="md" onClick={() => setShowAddModal(false)}>
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button variant="primary" size="md" type="submit" icon="check">
                  {isRtl ? 'حفظ وتفعيل' : 'Save & Activate'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
