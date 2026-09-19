import { MaterialIcon, PageHeader, Button, Panel, PanelHeader, FormField, Input } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { adminMessages } from '../../i18n/messages';

export function AdminClinicDetailPage({ clinicId }: { clinicId: string }) {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = adminMessages[isRtl ? 'ar' : 'en'].clinicDetail;

  return (
    <div className="admin-page__section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        kicker={copy.kicker}
        title={`${clinicId} ${copy.overviewSuffix}`}
        actions={
          <Button variant="primary" size="md" icon="save" disabled title={copy.saveConfigTitle}>
            {copy.saveConfig}
          </Button>
        }
      />

      <div className="admin-columns">
        <Panel variant="elevated">
          <PanelHeader
            title={copy.profileHeading}
            icon="domain"
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <FormField label={copy.tenantAlias}>
              <Input defaultValue={clinicId} iconStart="tag" />
            </FormField>
            <FormField label={copy.region}>
              <Input defaultValue={copy.regionValue} iconStart="location_on" />
            </FormField>
            <FormField label={copy.complianceState}>
              <Input defaultValue={copy.complianceValue} iconStart="verified" />
            </FormField>
            <FormField label={copy.activeModules}>
              <Input defaultValue={copy.activeModulesValue} iconStart="apps" />
            </FormField>
          </div>
        </Panel>

        <Panel variant="elevated">
          <PanelHeader
            title={copy.operationalNotes}
            icon="event_note"
          />
          <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {copy.notes.map((note) => (
              <li
                key={note}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--surface-subtle)',
                  fontSize: '0.85rem',
                  color: 'var(--text-main)',
                }}
              >
                <MaterialIcon name="info" style={{ color: 'var(--brand-primary)', fontSize: '1.1rem' }} />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
