import { useState, type FormEvent } from 'react';
import { MaterialIcon, PageHeader, Panel, PanelHeader, PanelBody, Badge, Button, Input, Textarea, Select } from '../../components/ui';
import { prescriptionMedicationOptions } from './fixtures';
import { useTheme } from '../../theme/ThemeProvider';
import { doctorMessages } from '../../i18n/messages';
import { container } from '../../di/container';
import { speakText } from '../../services/voiceService';

type MedicationLine = {
  id: number;
  medication: string;
  dosage: string;
  frequency: string;
  route: string;
  duration: string;
  quantity: string;
  instructions: string;
};

export function DoctorPrescriptionWriterPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = doctorMessages[isRtl ? 'ar' : 'en'].prescriptionWriter;

  const [lines, setLines] = useState<MedicationLine[]>([
    {
      id: 1,
      medication: prescriptionMedicationOptions[0],
      dosage: '10 mg',
      frequency: isRtl ? 'مرة واحدة يومياً' : 'Once daily',
      route: 'Oral',
      duration: isRtl ? '30 يوماً' : '30 days',
      quantity: isRtl ? '30 قرصاً' : '30 tablets',
      instructions: isRtl ? 'يؤخذ مع الماء صباحاً.' : 'Take with water in the morning.',
    },
  ]);
  const [notice, setNotice] = useState('');
  const [indication, setIndication] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successRx, setSuccessRx] = useState<any>(null);

  const updateLine = (id: number, field: keyof MedicationLine, value: string) =>
    setLines((current) => current.map((line) => (line.id === id ? { ...line, [field]: value } : line)));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotice('');

    try {
      const rx = await container.createPrescriptionUseCase.execute({
        tenantId: 'tenant-demo-01',
        clinicianId: 'doc-001',
        clinicianName: isRtl ? 'د. طارق القباني' : 'Dr. Tarek El-Kabbani',
        patientId: 'pat-001',
        diagnoses: [indication || (isRtl ? 'متابعة سريرية روتينية' : 'Routine clinical follow-up')],
        items: lines.map((l) => ({
          medicationName: l.medication,
          medicationNameAr: l.medication,
          dosage: l.dosage,
          frequency: l.frequency,
          timing: l.instructions,
          durationDays: 30,
          instructions: l.instructions,
          instructionsAr: l.instructions,
          doseForm: 'tablet',
        })),
      });

      setSuccessRx(rx);
      setNotice(
        isRtl
          ? `✅ تم توقيع الوصفة الطبية رقم ${rx.id} بنجاح وإرسال إشعار فوري للمريض عبر أتمتة n8n.`
          : `✅ Prescription #${rx.id} signed and dispatched to patient via n8n automation.`
      );
    } catch (err: any) {
      setNotice(`⚠️ ${err.message || 'Error creating prescription'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="aegis-page doctor-prescription-writer" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Breadcrumb */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
        }}
      >
        <a href="/doctor/orders" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <MaterialIcon name="assignment" style={{ fontSize: '1rem' }} />
          <span>{copy.breadcrumbOrders}</span>
        </a>
        <MaterialIcon name={isRtl ? 'chevron_left' : 'chevron_right'} style={{ fontSize: '1rem', color: 'var(--text-tertiary)' }} />
        <strong style={{ color: 'var(--text-main)' }}>{copy.breadcrumbCurrent}</strong>
      </nav>

      <PageHeader
        kicker={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MaterialIcon name="prescriptions" style={{ fontSize: '1rem' }} />
            <span>{copy.eyebrow}</span>
          </div>
        }
        title={copy.heading}
        subtitle={copy.desc}
        actions={
          <Badge variant="brand" size="md" icon="verified_user">
            {copy.attestationMode}
          </Badge>
        }
      />

      {/* Patient Context Banner */}
      <Panel variant="subtle">
        <PanelBody style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--text-main)' }}>
              {isRtl ? 'محمود السيد' : 'Mahmoud El-Sayed'}
            </strong>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {isRtl ? 'MRN: PT-DEMO-01 • ذكر / 58 • تحت الرعاية النشطة' : 'MRN: PT-DEMO-01 • Male / 58 • Active In-Care'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            <span>
              {copy.encounter}: <strong style={{ color: 'var(--text-main)' }}>APT-DEMO-01</strong>
            </span>
            <span>
              {copy.allergyPrecaution}: <strong style={{ color: '#f59e0b' }}>{isRtl ? 'سجل تجريبي' : 'Demo Record'}</strong>
            </span>
          </div>
        </PanelBody>
      </Panel>

      {/* Prescription Form */}
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
      >
        <div className="doctor-rx-grid">
          {/* Main Form: Medication Lines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Panel variant="elevated">
              <PanelHeader
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MaterialIcon name="medication" style={{ color: 'var(--brand-primary)' }} />
                    <span>{copy.itemsTitle}</span>
                  </div>
                }
              />
              <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {lines.map((line) => (
                  <div
                    key={line.id}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--surface-subtle)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '0.9375rem', color: 'var(--text-main)' }}>
                        {isRtl ? `الدواء ${line.id}` : `Medication ${line.id}`}
                      </strong>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="delete"
                        disabled={lines.length === 1}
                        onClick={() => setLines((current) => current.filter((item) => item.id !== line.id))}
                        aria-label={isRtl ? `حذف الدواء ${line.id}` : `Remove medication ${line.id}`}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                        {copy.medicationLabel}
                      </label>
                      <Select
                        value={line.medication}
                        onChange={(e) => updateLine(line.id, 'medication', e.target.value)}
                        options={prescriptionMedicationOptions.map((opt) => ({ value: opt, label: opt }))}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '0.2rem' }}>
                          {copy.dosage}
                        </label>
                        <Input
                          value={line.dosage}
                          onChange={(e) => updateLine(line.id, 'dosage', e.target.value)}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '0.2rem' }}>
                          {copy.frequency}
                        </label>
                        <Input
                          value={line.frequency}
                          onChange={(e) => updateLine(line.id, 'frequency', e.target.value)}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '0.2rem' }}>
                          {copy.route}
                        </label>
                        <Select
                          value={line.route}
                          onChange={(e) => updateLine(line.id, 'route', e.target.value)}
                          options={[
                            { value: 'Oral', label: isRtl ? 'فموي' : 'Oral' },
                            { value: 'Subcutaneous', label: isRtl ? 'تحت الجلد' : 'Subcutaneous' },
                            { value: 'Topical', label: isRtl ? 'موضعي' : 'Topical' },
                          ]}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '0.2rem' }}>
                          {copy.duration}
                        </label>
                        <Input
                          value={line.duration}
                          onChange={(e) => updateLine(line.id, 'duration', e.target.value)}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '0.2rem' }}>
                          {copy.quantity}
                        </label>
                        <Input
                          value={line.quantity}
                          onChange={(e) => updateLine(line.id, 'quantity', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                        {copy.instructions}
                      </label>
                      <Textarea
                        value={line.instructions}
                        onChange={(e) => updateLine(line.id, 'instructions', e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  icon="add_circle"
                  onClick={() =>
                    setLines((current) => [
                      ...current,
                      {
                        id: current.length + 1,
                        medication: prescriptionMedicationOptions[0],
                        dosage: '10 mg',
                        frequency: isRtl ? 'مرة واحدة يومياً' : 'Once daily',
                        route: 'Oral',
                        duration: isRtl ? '30 يوماً' : '30 days',
                        quantity: isRtl ? '30 قرصاً' : '30 tablets',
                        instructions: isRtl ? 'يؤخذ مع الماء صباحاً.' : 'Take with water in the morning.',
                      },
                    ])
                  }
                  style={{ alignSelf: 'flex-start' }}
                >
                  {copy.addMedication}
                </Button>
              </PanelBody>
            </Panel>

            <Panel variant="elevated">
              <PanelHeader
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MaterialIcon name="clinical_notes" style={{ color: 'var(--brand-primary)' }} />
                    <span>{copy.indicationTitle}</span>
                  </div>
                }
              />
              <PanelBody>
                <Textarea
                  value={indication}
                  onChange={(e) => setIndication(e.target.value)}
                  placeholder={
                    isRtl
                      ? 'مسوغات سريرية تجريبية لمسودة الوصفة هذه...'
                      : 'Synthetic clinical rationale for this demonstration draft...'
                  }
                  rows={3}
                />
              </PanelBody>
            </Panel>
          </div>

          {/* Side Column: Dispense Rules & Submission */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Panel variant="elevated">
              <PanelHeader title={<span>{isRtl ? 'حوكمة وتوثيق الوصفة' : 'Prescription Governance'}</span>} />
              <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                <p style={{ margin: 0 }}>
                  {isRtl
                    ? 'تخضع الوصفات الطبية للرقابة السريرية وتوثيق الطبيب المعالج، ويتم إرسالها تلقائياً للمريض.'
                    : 'Controlled substances require two-factor biometric authentication in live deployment.'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <Button variant="primary" icon="verified" type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? (isRtl ? 'جارٍ التوقيع والإرسال...' : 'Signing & Dispatching...')
                      : (isRtl ? 'توقيع وإصدار الوصفة' : 'Sign & Prescribe')}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() =>
                      setNotice(isRtl ? 'تم حفظ المسودة محلياً.' : 'Prescription draft saved locally.')
                    }
                  >
                    {isRtl ? 'حفظ مسودة' : 'Save Draft'}
                  </Button>

                  {successRx && (
                    <Button
                      variant="ghost"
                      type="button"
                      icon="campaign"
                      onClick={() => {
                        const text = isRtl
                          ? `تم إصدار الوصفة الطبية رقم ${successRx.id}. تحتوي على ${successRx.items.length} أدوية معتمدة.`
                          : `Prescription #${successRx.id} issued with ${successRx.items.length} verified medications.`;
                        speakText(text, isRtl ? 'ar' : 'en');
                      }}
                    >
                      {isRtl ? '🔊 استمع لملخص الوصفة' : '🔊 Listen to Summary'}
                    </Button>
                  )}
                </div>
              </PanelBody>
            </Panel>
          </aside>
        </div>
      </form>

      {notice && (
        <div
          role="status"
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--brand-primary-light)',
            color: 'var(--brand-primary)',
            fontSize: '0.875rem',
          }}
        >
          {notice}
        </div>
      )}
    </div>
  );
}
