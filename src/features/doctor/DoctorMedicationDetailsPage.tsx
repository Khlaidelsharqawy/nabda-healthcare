import { useState } from 'react';
import { MaterialIcon, PageHeader, StatCard, Panel, PanelHeader, PanelBody, Badge, Button } from '../../components/ui';
import { doctorMedicationDetails } from './fixtures';
import { useTheme } from '../../theme/ThemeProvider';
import { doctorMessages } from '../../i18n/messages';

export function DoctorMedicationDetailsPage({ medicationId }: { medicationId: string }) {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = doctorMessages[isRtl ? 'ar' : 'en'].medicationDetails;

  const [notice, setNotice] = useState('');
  const medication = { ...doctorMedicationDetails, id: medicationId };

  return (
    <div className="aegis-page doctor-medication-details" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
            <MaterialIcon name="medication" style={{ fontSize: '1rem' }} />
            <span>{copy.eyebrow}</span>
          </div>
        }
        title={medication.name}
        subtitle={copy.desc}
        actions={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              variant="outline"
              icon="edit_note"
              onClick={() =>
                setNotice(
                  isRtl ? 'تجريبي للعرض فقط — لم يتم تعديل الوصفة.' : 'Demo only — no prescription was edited.'
                )
              }
            >
              {copy.editPrescription}
            </Button>
            <Button
              variant="danger"
              icon="cancel"
              onClick={() =>
                setNotice(
                  isRtl ? 'تجريبي للعرض فقط — لم تتغير حالة الدواء.' : 'Demo only — medication status was not changed.'
                )
              }
            >
              {copy.discontinue}
            </Button>
          </div>
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
              MRN: PT-DEMO-01 • {copy.patientActive} • {isRtl ? 'الموعد APT-DEMO-01' : 'Encounter APT-DEMO-01'}
            </span>
          </div>
          <Badge variant="brand" size="md" icon="verified">
            {copy.attestationMode}
          </Badge>
        </PanelBody>
      </Panel>

      {/* Telemetry Row */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        <StatCard label={copy.activeRegimen} value={medication.duration} icon="schedule" />
        <StatCard label={copy.remainingRefills} value={`${medication.refillsRemaining} / 03`} icon="autorenew" />
        <StatCard label={copy.patientTolerance} value={copy.reportedTolerant} icon="verified" />
        <StatCard label={copy.reviewCycle} value={isRtl ? '+14 يوماً' : '+14 Days'} icon="event" />
      </section>

      {/* Grid: Rx Details & Patient Directions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <Panel variant="elevated">
          <PanelHeader
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MaterialIcon name="prescriptions" style={{ color: 'var(--brand-primary)' }} />
                <span>{copy.rxDetailsTitle}</span>
              </div>
            }
          />
          <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              <DetailBox label={copy.dosage} value={medication.dosage} icon="straighten" />
              <DetailBox label={copy.frequency} value={medication.frequency} icon="schedule" />
              <DetailBox label={copy.route} value={isRtl ? medication.routeAr ?? medication.route : medication.route} icon="alt_route" />
              <DetailBox label={copy.duration} value={medication.duration} icon="date_range" />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.875rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-subtle)',
                marginTop: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <MaterialIcon name="stethoscope" style={{ color: 'var(--brand-primary)' }} />
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{copy.prescribingClinician}</span>
                  <strong style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    {isRtl ? medication.prescriberAr ?? medication.prescriber : medication.prescriber}
                  </strong>
                </div>
              </div>
              <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{copy.prescribedDate}</span>
                <strong style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{medication.prescribedDate}</strong>
              </div>
            </div>
          </PanelBody>
        </Panel>

        <Panel variant="elevated">
          <PanelHeader
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MaterialIcon name="clinical_notes" style={{ color: 'var(--brand-primary)' }} />
                <span>{copy.directionsTitle}</span>
              </div>
            }
          />
          <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-subtle)' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-primary)', marginBottom: '0.25rem' }}>
                {copy.patientDirections}
              </span>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                {medication.instructions}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              <DetailBox label={copy.dispenseQuantity} value={medication.quantity} icon="inventory_2" />
              <DetailBox label={copy.refillAllowance} value={`${medication.refillsRemaining} ${isRtl ? 'متبقية' : 'remaining'}`} icon="autorenew" />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--brand-primary-light)',
                color: 'var(--brand-primary)',
                fontSize: '0.8125rem',
              }}
            >
              <MaterialIcon name="info" />
              <span>{copy.advisory}</span>
            </div>
          </PanelBody>
        </Panel>
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
          }}
        >
          {notice}
        </div>
      )}
    </div>
  );
}

function DetailBox({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div
      style={{
        padding: '0.75rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--surface-subtle)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.25rem' }}>
        <MaterialIcon name={icon} style={{ fontSize: '0.875rem' }} />
        <span>{label}</span>
      </div>
      <strong style={{ fontSize: '0.9375rem', color: 'var(--text-main)' }}>{value}</strong>
    </div>
  );
}
