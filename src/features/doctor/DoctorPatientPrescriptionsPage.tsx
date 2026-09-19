import { useState } from 'react';
import { MaterialIcon, Panel, PanelHeader, PanelBody, Badge, Button } from '../../components/ui';
import { PatientWorkspaceShell } from './PatientWorkspaceShell';
import { doctorPatientPrescriptions, type PatientPrescriptionStatus } from './fixtures';
import { useTheme } from '../../theme/ThemeProvider';
import { doctorMessages } from '../../i18n/messages';

const filters: { label: string; labelAr: string; value: PatientPrescriptionStatus | 'all' }[] = [
  { label: 'All', labelAr: 'الكل', value: 'all' },
  { label: 'Active', labelAr: 'نشط', value: 'active' },
  { label: 'Completed', labelAr: 'مكتمل', value: 'completed' },
  { label: 'Suspended', labelAr: 'معلق', value: 'suspended' },
];

function PrescriptionCard({
  prescription,
  selected,
  onSelect,
  onNotice,
  copy,
  isRtl,
}: {
  prescription: (typeof doctorPatientPrescriptions)[number];
  selected: boolean;
  onSelect: () => void;
  onNotice: (message: string) => void;
  copy: typeof doctorMessages.en.prescriptions | typeof doctorMessages.ar.prescriptions;
  isRtl: boolean;
}) {
  const getStatusVariant = (status: string): 'success' | 'brand' | 'warning' | 'neutral' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'brand';
      case 'suspended':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <Panel
      variant="elevated"
      style={{
        borderInlineStart: `4px solid ${
          prescription.status === 'active'
            ? '#10b981'
            : prescription.status === 'completed'
            ? 'var(--brand-primary)'
            : '#f59e0b'
        }`,
        cursor: 'pointer',
        boxShadow: selected ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        outline: selected ? '2px solid var(--brand-primary)' : 'none',
      }}
      onClick={onSelect}
    >
      <PanelHeader
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              {isRtl ? `وصفة طبية #${prescription.id}` : `Prescription #${prescription.id}`}
            </h2>
            <Badge variant={getStatusVariant(prescription.status)} size="sm">
              {isRtl ? prescription.statusLabelAr ?? prescription.statusLabel : prescription.statusLabel}
            </Badge>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
              {copy.digitalSignature} {prescription.signatureId}
            </span>
          </div>
        }
        actions={
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            <span>
              {copy.issueDate}: <strong style={{ color: 'var(--text-main)' }}>{prescription.prescribedDate}</strong>
            </span>
            <span>
              {copy.prescribedBy}: <strong style={{ color: 'var(--text-main)' }}>{prescription.prescriber}</strong>
            </span>
          </div>
        }
      />
      <PanelBody>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 260px',
            gap: '1.5rem',
            alignItems: 'start',
          }}
          className="prescription-body-grid"
        >
          {/* Medication Items */}
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.75rem 0' }}>
              {copy.medicationItems}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
              {prescription.medications.map((medication) => (
                <div
                  key={`${prescription.id}-${medication.name}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface-subtle)',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <MaterialIcon name={medication.icon} style={{ color: 'var(--brand-primary)' }} />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                        {medication.name}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {medication.dosage} • {medication.frequency} • {copy.routePrefix}{' '}
                        {isRtl ? medication.routeAr ?? medication.route : medication.route}
                      </span>
                      <small style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                        {copy.durationPrefix} {medication.duration}
                      </small>
                    </div>
                  </div>
                  <Badge variant="neutral" size="sm">
                    {isRtl
                      ? medication.badge === 'Standard Regimen'
                        ? 'نظام قياسي'
                        : medication.badge === 'Completed'
                        ? 'مكتمل'
                        : medication.badge === 'Review Required'
                        ? 'يلزم المراجعة'
                        : medication.badge
                      : medication.badge}
                  </Badge>
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--brand-primary-light)',
                color: 'var(--brand-primary)',
                fontSize: '0.8125rem',
              }}
            >
              <MaterialIcon name="info" style={{ fontSize: '1rem', marginTop: '0.1rem' }} />
              <span>
                <strong>{copy.clinicalInstructions}:</strong> {prescription.instructions}
              </span>
            </div>
          </div>

          {/* Therapy Telemetry and Actions */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--surface-subtle)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>
                {copy.refillsAdherence}
              </span>
              <strong style={{ fontSize: '1.125rem', color: 'var(--text-main)' }}>
                {prescription.refillsRemaining} {copy.remaining}
              </strong>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>{copy.therapyProgress}</span>
                <strong style={{ color: 'var(--text-main)' }}>
                  {isRtl
                    ? prescription.progressLabel === 'Completed'
                      ? 'مكتمل'
                      : prescription.progressLabel === 'Review pending'
                      ? 'بانتظار المراجعة'
                      : prescription.progressLabel
                    : prescription.progressLabel}
                </strong>
              </div>
              <div style={{ height: '6px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--border-default)', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${prescription.progress}%`,
                    height: '100%',
                    backgroundColor: 'var(--brand-primary)',
                    borderRadius: 'var(--radius-full)',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <Button
                variant="outline"
                size="sm"
                icon="visibility"
                onClick={(event) => {
                  event.stopPropagation();
                  onNotice(
                    isRtl
                      ? 'تجريبي للعرض فقط — تفاصيل الوصفة مخصصة للعرض.'
                      : 'Demo only — prescription details are display-only.'
                  );
                }}
              >
                {copy.viewDetail}
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon="cancel"
                onClick={(event) => {
                  event.stopPropagation();
                  onNotice(
                    isRtl
                      ? 'تجريبي للعرض فقط — لم يتم تغيير حالة الوصفة.'
                      : 'Demo only — prescription status was not changed.'
                  );
                }}
              >
                {copy.discontinue}
              </Button>
            </div>
          </div>
        </div>
      </PanelBody>
    </Panel>
  );
}

export function DoctorPatientPrescriptionsPage({ patientId }: { patientId: string }) {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = doctorMessages[isRtl ? 'ar' : 'en'].prescriptions;

  const [activeFilter, setActiveFilter] = useState<PatientPrescriptionStatus | 'all'>('all');
  const [selectedId, setSelectedId] = useState(doctorPatientPrescriptions[0]?.id ?? '');
  const [notice, setNotice] = useState('');

  const visiblePrescriptions = doctorPatientPrescriptions.filter(
    (item) => activeFilter === 'all' || item.status === activeFilter
  );

  return (
    <PatientWorkspaceShell patientId={patientId} pathname={window.location.pathname} breadcrumbLabel={copy.heading}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Controls Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {filters.map((filter) => (
              <Button
                key={filter.value}
                variant={activeFilter === filter.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter(filter.value)}
              >
                {isRtl ? filter.labelAr : filter.label}
              </Button>
            ))}
          </div>

          <Button
            variant="primary"
            size="sm"
            icon="add_circle"
            onClick={() => {
              window.location.href = '/doctor/prescriptions/new';
            }}
          >
            {isRtl ? 'تحرير وصفة طبية جديدة' : 'Compose Prescription'}
          </Button>
        </div>

        {notice && (
          <div
            role="status"
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--brand-primary-light)',
              color: 'var(--brand-primary)',
              fontSize: '0.875rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MaterialIcon name="info" />
              <span>{notice}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotice('')}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex' }}
              aria-label="Dismiss notice"
            >
              <MaterialIcon name="close" />
            </button>
          </div>
        )}

        {/* Prescription Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {visiblePrescriptions.map((prescription) => (
            <PrescriptionCard
              key={prescription.id}
              prescription={prescription}
              selected={selectedId === prescription.id}
              onSelect={() => setSelectedId(prescription.id)}
              onNotice={setNotice}
              copy={copy}
              isRtl={isRtl}
            />
          ))}
        </div>
      </div>
    </PatientWorkspaceShell>
  );
}
