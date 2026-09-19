import { useState } from 'react';
import { MaterialIcon, Panel, PanelHeader, PanelBody, Badge, Button, Input, Textarea, Select } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { doctorMessages } from '../../i18n/messages';

type FormMode = 'lab' | 'imaging';

type LabTest = { id: string; name: string; nameAr: string; detail: string; detailAr: string; icon: string };

const labTests: LabTest[] = [
  { id: 'CBC-DIFF', name: 'Complete Blood Count (CBC) with Differential', nameAr: 'تعداد الدم الكامل (CBC) مع الفحص التفريقي', detail: 'Venous Blood • Hematology', detailAr: 'دم وريدي • أمراض الدم', icon: 'bloodtype' },
  { id: 'CMP-14', name: 'Comprehensive Metabolic Panel (CMP 14)', nameAr: 'لوحة التمثيل الغذائي الشاملة (CMP 14)', detail: 'Serum Separator • Clinical Chemistry', detailAr: 'أنبوب مصل • كيمياء سريرية', icon: 'water_drop' },
  { id: 'HS-CRP', name: 'High-Sensitivity C-Reactive Protein (hs-CRP)', nameAr: 'بروتين سي التفاعلي عالي الحساسية (hs-CRP)', detail: 'Serum • Immunology / Inflammatory Marker', detailAr: 'مصل الدم • علامات مناعية والتهابية', icon: 'monitor_heart' },
];

export function DoctorClinicalOrderFormPage({ mode }: { mode: FormMode }) {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = doctorMessages[isRtl ? 'ar' : 'en'].orderForm;

  const isLab = mode === 'lab';
  const [notice, setNotice] = useState('');
  const [validation, setValidation] = useState('');
  const [selectedTests, setSelectedTests] = useState(labTests);
  const [testSearch, setTestSearch] = useState('');
  const [imagingModality, setImagingModality] = useState('xray');
  const [indication, setIndication] = useState('');
  const [attested, setAttested] = useState(true);
  const [safetyChecks, setSafetyChecks] = useState({ pregnancy: false, implants: false, renal: false });

  const filteredTests = labTests.filter((test) => {
    const title = isRtl ? test.nameAr : test.name;
    return `${test.id} ${test.name} ${title}`.toLowerCase().includes(testSearch.toLowerCase());
  });

  const handleDemoSubmit = () => {
    if (isLab && !attested) {
      setValidation(
        isRtl
          ? 'توثيق الطبيب مطلوب قبل إرسال هذا النموذج التجريبي.'
          : 'Doctor attestation is required before this demo submission.'
      );
      return;
    }
    if (!isLab && indication.trim().length < 15) {
      setValidation(
        isRtl
          ? 'أدخل 15 حرفاً على الأقل من الدواعي السريرية للمراجعة التجريبية.'
          : 'Enter at least 15 characters of clinical indication for this demo review.'
      );
      return;
    }
    setValidation('');
    setNotice(
      isRtl
        ? `تجريبي للعرض فقط — لم يتم إرسال أو حفظ طلب ${isLab ? 'المختبر' : 'الأشعة'}.`
        : `Demo only — the ${isLab ? 'laboratory' : 'imaging'} order was not submitted or persisted.`
    );
  };

  return (
    <div className={`aegis-page doctor-order-form doctor-order-form--${mode}`} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Breadcrumb Navigation */}
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
        <strong style={{ color: 'var(--text-main)' }}>{isLab ? copy.newLabBreadcrumb : copy.newImagingBreadcrumb}</strong>
      </nav>

      {/* Header */}
      <Panel variant="elevated">
        <PanelBody style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              <MaterialIcon name={isLab ? 'biotech' : 'radiology'} style={{ fontSize: '1rem' }} />
              {isLab ? copy.eyebrowLab : copy.eyebrowImaging}
            </span>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.25rem 0' }}>
              {isLab ? copy.headingLab : copy.headingImaging}
            </h1>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {isLab ? copy.descLab : copy.descImaging}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--brand-primary-light)', color: 'var(--brand-primary)' }}>
            <MaterialIcon name="verified" style={{ fontSize: '1.25rem' }} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.8125rem' }}>{copy.attestationMode}</strong>
              <small style={{ fontSize: '0.7rem' }}>{copy.protectedSession}</small>
            </div>
          </div>
        </PanelBody>
      </Panel>

      {/* Patient Clinical Context Card */}
      <Panel variant="subtle">
        <PanelBody style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--surface-card)',
                color: 'var(--brand-primary)',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 700,
              }}
            >
              PT
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                {isRtl ? 'محمود السيد' : 'Mahmoud El-Sayed'}
              </strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                MRN: PT-DEMO-01 • {isRtl ? 'ذكر / 58 عاماً' : 'Male / 58y'} • Encounter: APT-DEMO-01
              </span>
            </div>
          </div>
          <Badge variant="success" size="sm">{copy.patientActive}</Badge>
        </PanelBody>
      </Panel>

      {validation && (
        <div
          role="alert"
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-danger-bg)',
            color: 'var(--color-danger-text)',
            border: '1px solid var(--color-danger-border)',
            fontSize: '0.8125rem',
            fontWeight: 600,
          }}
        >
          {validation}
        </div>
      )}

      {/* Main Order Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleDemoSubmit(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {isLab ? (
          <LabFormContent
            selectedTests={selectedTests}
            setSelectedTests={setSelectedTests}
            filteredTests={filteredTests}
            testSearch={testSearch}
            setTestSearch={setTestSearch}
            attested={attested}
            setAttested={setAttested}
            copy={copy}
            isRtl={isRtl}
          />
        ) : (
          <ImagingFormContent
            imagingModality={imagingModality}
            setImagingModality={setImagingModality}
            safetyChecks={safetyChecks}
            setSafetyChecks={setSafetyChecks}
            indication={indication}
            setIndication={setIndication}
            copy={copy}
            isRtl={isRtl}
          />
        )}

        {/* Action Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            <MaterialIcon name="lock" style={{ fontSize: '0.875rem' }} />
            {copy.reviewLock}
          </span>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="ghost" onClick={() => (window.location.href = '/doctor/orders')}>
              {copy.cancel}
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setNotice(
                  isRtl ? 'تجريبي للعرض فقط — لم يتم حفظ المسودة.' : 'Demo only — draft state was not saved.'
                )
              }
            >
              {copy.saveDraft}
            </Button>
            <Button variant="primary" type="submit">
              {isLab ? copy.submitLab : copy.submitImaging}
            </Button>
          </div>
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

function LabFormContent({
  selectedTests,
  setSelectedTests,
  filteredTests,
  testSearch,
  setTestSearch,
  attested,
  setAttested,
  copy,
  isRtl,
}: {
  selectedTests: LabTest[];
  setSelectedTests: React.Dispatch<React.SetStateAction<LabTest[]>>;
  filteredTests: LabTest[];
  testSearch: string;
  setTestSearch: (val: string) => void;
  attested: boolean;
  setAttested: (val: boolean) => void;
  copy: typeof doctorMessages.en.orderForm | typeof doctorMessages.ar.orderForm;
  isRtl: boolean;
}) {
  const toggleTest = (test: LabTest) => {
    if (selectedTests.some((t) => t.id === test.id)) {
      setSelectedTests(selectedTests.filter((t) => t.id !== test.id));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <Panel variant="elevated">
        <PanelHeader
          title={<span>{copy.step2LabTitle}</span>}
          actions={<span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>{selectedTests.length} selected</span>}
        />
        <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            value={testSearch}
            onChange={(e) => setTestSearch(e.target.value)}
            placeholder={copy.searchTestsPlaceholder}
            prefixIcon="search"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredTests.map((test) => {
              const isChecked = selectedTests.some((t) => t.id === test.id);
              return (
                <label
                  key={test.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isChecked ? 'var(--brand-primary-light)' : 'var(--surface-subtle)',
                    border: `1px solid ${isChecked ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleTest(test)}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--brand-primary)' }}
                    />
                    <MaterialIcon name={test.icon} style={{ color: 'var(--brand-primary)' }} />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                        {isRtl ? test.nameAr : test.name}
                      </strong>
                      <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {isRtl ? test.detailAr : test.detail}
                      </small>
                    </div>
                  </div>
                  <Badge variant="neutral" size="sm">{test.id}</Badge>
                </label>
              );
            })}
          </div>
        </PanelBody>
      </Panel>

      <Panel variant="elevated">
        <PanelHeader title={<span>{copy.step3LabTitle}</span>} />
        <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              {copy.labPriority}
            </label>
            <Select
              defaultValue="routine"
              options={[
                { value: 'routine', label: isRtl ? 'روتيني (خلال 24 ساعة)' : 'Routine (Within 24 Hours)' },
                { value: 'urgent', label: isRtl ? 'عاجل (خلال 4 ساعات)' : 'Urgent (Within 4 Hours)' },
                { value: 'stat', label: isRtl ? 'طارئ فوراً (خلال ساعة)' : 'STAT (Immediate / 1 Hour)' },
              ]}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--text-main)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={attested}
              onChange={(e) => setAttested(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--brand-primary)' }}
            />
            <span>{copy.attestConfirm}</span>
          </label>
        </PanelBody>
      </Panel>
    </div>
  );
}

function ImagingFormContent({
  imagingModality,
  setImagingModality,
  safetyChecks,
  setSafetyChecks,
  indication,
  setIndication,
  copy,
  isRtl,
}: {
  imagingModality: string;
  setImagingModality: (val: string) => void;
  safetyChecks: { pregnancy: false | boolean; implants: false | boolean; renal: false | boolean };
  setSafetyChecks: React.Dispatch<React.SetStateAction<{ pregnancy: boolean; implants: boolean; renal: boolean }>>;
  indication: string;
  setIndication: (val: string) => void;
  copy: typeof doctorMessages.en.orderForm | typeof doctorMessages.ar.orderForm;
  isRtl: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <Panel variant="elevated">
        <PanelHeader title={<span>{copy.step1ImagingTitle}</span>} />
        <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              {copy.selectModality}
            </label>
            <Select
              value={imagingModality}
              onChange={(e) => setImagingModality(e.target.value)}
              options={[
                { value: 'xray', label: isRtl ? 'أشعة سينية رقمية (X-Ray)' : 'Digital Plain Radiography (X-Ray)' },
                { value: 'ct', label: isRtl ? 'أشعة مقطعية محوسبة (CT Scan)' : 'Computed Tomography (CT Scan)' },
                { value: 'mri', label: isRtl ? 'رنين مغناطيسي (MRI)' : 'Magnetic Resonance Imaging (MRI)' },
                { value: 'ultrasound', label: isRtl ? 'موجات فوق صوتية (Ultrasound)' : 'Diagnostic Ultrasound (US)' },
              ]}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              {copy.clinicalIndication}
            </label>
            <Textarea
              value={indication}
              onChange={(e) => setIndication(e.target.value)}
              placeholder={isRtl ? 'أدخل الدواعي السريرية والسؤال التشخيصي...' : 'Enter clinical indication and diagnostic question...'}
              rows={4}
            />
          </div>
        </PanelBody>
      </Panel>

      <Panel variant="accent">
        <PanelHeader
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MaterialIcon name="shield" style={{ color: 'var(--brand-primary)' }} />
              <span>{copy.step2ImagingTitle}</span>
            </div>
          }
        />
        <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-main)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={safetyChecks.pregnancy}
              onChange={(e) => setSafetyChecks((c) => ({ ...c, pregnancy: e.target.checked }))}
              style={{ width: '16px', height: '16px', accentColor: 'var(--brand-primary)' }}
            />
            <span>{copy.pregnancyScreen}</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-main)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={safetyChecks.implants}
              onChange={(e) => setSafetyChecks((c) => ({ ...c, implants: e.target.checked }))}
              style={{ width: '16px', height: '16px', accentColor: 'var(--brand-primary)' }}
            />
            <span>{copy.implantPrecaution}</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-main)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={safetyChecks.renal}
              onChange={(e) => setSafetyChecks((c) => ({ ...c, renal: e.target.checked }))}
              style={{ width: '16px', height: '16px', accentColor: 'var(--brand-primary)' }}
            />
            <span>{copy.allergyClearance}</span>
          </label>
        </PanelBody>
      </Panel>
    </div>
  );
}
