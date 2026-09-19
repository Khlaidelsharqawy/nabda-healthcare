import type { ReactNode } from 'react';
import { MaterialIcon, Badge, Button } from '../../components/ui';
import { PatientWorkspaceNavigation } from './PatientWorkspaceNavigation';
import { useTheme } from '../../theme/ThemeProvider';
import { doctorMessages } from '../../i18n/messages';

export function PatientWorkspaceShell({
  patientId,
  pathname,
  breadcrumbLabel,
  children,
}: {
  patientId: string;
  pathname: string;
  breadcrumbLabel: string;
  children: ReactNode;
}) {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? doctorMessages.ar.workspace : doctorMessages.en.workspace;

  return (
    <div className="aegis-page doctor-patient-workspace-shell">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="patient breadcrumb"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
          <a
            href="/doctor/patients"
            style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}
          >
            {copy.patients}
          </a>
          <MaterialIcon name={isRtl ? 'chevron_left' : 'chevron_right'} style={{ fontSize: '1rem', color: 'var(--text-tertiary)' }} />
          <span style={{ color: 'var(--text-muted)' }}>
            {copy.patientFile} [#{patientId}]
          </span>
          <MaterialIcon name={isRtl ? 'chevron_left' : 'chevron_right'} style={{ fontSize: '1rem', color: 'var(--text-tertiary)' }} />
          <strong style={{ color: 'var(--text-main)', fontWeight: 700 }}>
            {breadcrumbLabel}
          </strong>
        </div>

        <Badge variant="success" size="sm" icon="verified">
          {copy.clinicalRecord}
        </Badge>
      </nav>

      {/* Patient Identity Banner Card */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand-primary-light)',
              color: 'var(--brand-primary)',
              display: 'grid',
              placeItems: 'center',
              fontSize: '1.75rem',
            }}
          >
            <MaterialIcon name="person" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.35rem' }}>
              <h1
                style={{
                  fontSize: '1.375rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text-main)',
                  margin: 0,
                }}
              >
                {copy.patientNamePlaceholder}
              </h1>
              <Badge variant="neutral" size="sm">
                #{patientId}
              </Badge>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontSize: '0.8125rem',
                color: 'var(--text-muted)',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MaterialIcon name="badge" style={{ fontSize: '1rem', color: 'var(--text-tertiary)' }} />
                {copy.ageGender}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MaterialIcon name="check_circle" style={{ fontSize: '1rem', color: '#10b981' }} />
                {copy.activeInCare}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MaterialIcon name="local_hospital" style={{ fontSize: '1rem', color: 'var(--text-tertiary)' }} />
                {copy.outpatientDept}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <Button
            variant="outline"
            size="sm"
            icon="badge"
            onClick={() => { window.location.href = `/doctor/patients/${patientId}`; }}
          >
            {copy.recordPrefix} #{patientId}
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon="clinical_notes"
            onClick={() => { window.location.href = `/doctor/patients/${patientId}/notes`; }}
          >
            {copy.startEncounter}
          </Button>
        </div>
      </div>

      {/* Clinical Allergy & Precaution Alert Banner */}
      <div
        role="alert"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.875rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-warning-bg)',
          border: '1px solid var(--color-warning-border)',
          color: 'var(--color-warning-text)',
          marginBottom: '1.25rem',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#fde68a',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <MaterialIcon name="warning" style={{ fontSize: '1.125rem', color: '#92400e' }} />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700 }}>
              {copy.allergyDocTitle}
            </strong>
            <span style={{ fontSize: '0.8125rem' }}>
              {copy.allergyDocDesc}
            </span>
          </div>
        </div>

        <Badge variant="warning" size="sm">
          {copy.clinicalCaution}
        </Badge>
      </div>

      {/* Sub-Workspace Section Navigation */}
      <PatientWorkspaceNavigation patientId={patientId} pathname={pathname} />

      {/* Active Sub-Workspace Tab Body */}
      <div style={{ marginTop: '1.25rem' }}>{children}</div>
    </div>
  );
}
