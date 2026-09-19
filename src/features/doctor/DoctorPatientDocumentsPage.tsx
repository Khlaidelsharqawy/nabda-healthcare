import { useState } from 'react';
import { MaterialIcon, Panel, PanelHeader, PanelBody, Badge, Button, Input, EmptyState } from '../../components/ui';
import { PatientWorkspaceShell } from './PatientWorkspaceShell';
import { doctorPatientDocuments, type PatientDocumentCategory } from './fixtures';
import { useTheme } from '../../theme/ThemeProvider';
import { doctorMessages } from '../../i18n/messages';

const filters: { label: string; labelAr: string; value: PatientDocumentCategory | 'all' }[] = [
  { label: 'All Documents', labelAr: 'كافة المستندات', value: 'all' },
  { label: 'Diagnostic Reports', labelAr: 'التقارير التشخيصية', value: 'diagnostic' },
  { label: 'Pathology', labelAr: 'علم الأمراض', value: 'pathology' },
  { label: 'Surgical Records', labelAr: 'السجلات الجراحية', value: 'surgical' },
  { label: 'Hospital Discharge', labelAr: 'الخروج من المستشفى', value: 'discharge' },
  { label: 'External Referrals', labelAr: 'إحالات خارجية', value: 'referral' },
];

export function DoctorPatientDocumentsPage({ patientId }: { patientId: string }) {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = doctorMessages[isRtl ? 'ar' : 'en'].documents;

  const [activeFilter, setActiveFilter] = useState<PatientDocumentCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(doctorPatientDocuments[0]?.id ?? '');
  const [notice, setNotice] = useState('');

  const visibleDocuments = doctorPatientDocuments.filter((document) => {
    const matchesCategory = activeFilter === 'all' || document.category === activeFilter;
    const localizedTitle = isRtl ? document.titleAr ?? document.title : document.title;
    const localizedSubtitle = isRtl ? document.subtitleAr ?? document.subtitle : document.subtitle;
    const localizedAuthor = isRtl ? document.authorAr ?? document.author : document.author;
    const haystack = `${document.title} ${document.subtitle} ${document.author} ${document.fileType} ${localizedTitle} ${localizedSubtitle} ${localizedAuthor}`.toLowerCase();
    return matchesCategory && haystack.includes(search.toLowerCase());
  });

  const selectedDocument =
    doctorPatientDocuments.find((document) => document.id === selectedId) ??
    visibleDocuments[0] ??
    doctorPatientDocuments[0];

  return (
    <PatientWorkspaceShell patientId={patientId} pathname={window.location.pathname} breadcrumbLabel={copy.title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Context & Repository Telemetry Bar */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--brand-primary-light)',
                color: 'var(--brand-primary)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <MaterialIcon name="folder_shared" style={{ fontSize: '1.25rem' }} />
            </div>
            <div>
              <strong style={{ fontSize: '0.9375rem', color: 'var(--text-main)', display: 'block' }}>
                {copy.title}
              </strong>
              <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{copy.scope}</small>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            <span>
              {copy.ehrCount}: <strong style={{ color: 'var(--text-main)' }}>{doctorPatientDocuments.length} {isRtl ? 'ملفات' : 'files'}</strong>
            </span>
            <span>
              {copy.pendingSignoff}: <strong style={{ color: 'var(--brand-primary)' }}>{isRtl ? 'مستند واحد' : '1 item'}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button
              variant="outline"
              size="sm"
              icon="upload_file"
              onClick={() =>
                setNotice(
                  isRtl
                    ? 'زر رفع تجريبي للعرض فقط. لم يتم رفع أو تخزين أي ملف.'
                    : 'Demo-only upload control. No file was uploaded or stored.'
                )
              }
            >
              {copy.uploadDoc}
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon="print"
              onClick={() =>
                setNotice(
                  isRtl
                    ? 'تصدير الملخص تجريبي للعرض فقط ولا يتم تنزيل أي ملف.'
                    : 'Summary export is demo-only and does not download a file.'
                )
              }
            >
              {copy.exportSummary}
            </Button>
          </div>
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

        {/* Filter and Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: '1 1 260px' }}>
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={copy.searchPlaceholder}
              prefixIcon="search"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            icon="sync"
            onClick={() => {
              setSearch('');
              setActiveFilter('all');
            }}
          >
            {copy.reset}
          </Button>
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {filters.map((filter) => (
              <Button
                key={filter.value}
                variant={activeFilter === filter.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter(filter.value)}
              >
                {isRtl ? filter.labelAr : filter.label} (
                {filter.value === 'all'
                  ? doctorPatientDocuments.length
                  : doctorPatientDocuments.filter((d) => d.category === filter.value).length}
                )
              </Button>
            ))}
          </div>
        </div>

        {/* Grid: Document Table + Document Inspector */}
        <div className="doctor-docs-grid">
          {/* Table Panel */}
          <Panel variant="elevated">
            <PanelHeader
              title={
                <div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {copy.registryIndex} ({visibleDocuments.length} {isRtl ? 'سجلات' : 'records'})
                  </span>
                </div>
              }
              actions={
                <Badge variant="neutral" size="sm" icon="shield">
                  {copy.syntheticRegistry}
                </Badge>
              }
            />
            <PanelBody style={{ padding: 0 }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--surface-subtle)', borderBottom: '1px solid var(--border-default)' }}>
                      <th style={{ padding: '0.75rem 1rem', textAlign: isRtl ? 'right' : 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                        {copy.thDocument}
                      </th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: isRtl ? 'right' : 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                        {copy.thCategory}
                      </th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: isRtl ? 'right' : 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                        {copy.thAuthor}
                      </th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: isRtl ? 'right' : 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                        {copy.thAttestation}
                      </th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: isRtl ? 'right' : 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                        {copy.thActions}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleDocuments.map((doc) => {
                      const isSelected = selectedDocument?.id === doc.id;
                      return (
                        <tr
                          key={doc.id}
                          onClick={() => setSelectedId(doc.id)}
                          style={{
                            borderBottom: '1px solid var(--border-subtle)',
                            backgroundColor: isSelected ? 'var(--surface-subtle)' : 'transparent',
                            cursor: 'pointer',
                            transition: 'background-color 0.15s ease',
                          }}
                        >
                          <td style={{ padding: '0.875rem 1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                              <MaterialIcon name={doc.icon} style={{ color: 'var(--brand-primary)', fontSize: '1.25rem' }} />
                              <div>
                                <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                                  {isRtl ? doc.titleAr ?? doc.title : doc.title}
                                </strong>
                                <small style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                  {doc.date} • {doc.fileType} • {doc.size}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '0.875rem 1rem' }}>
                            <Badge variant="neutral" size="sm">
                              {isRtl ? doc.categoryLabelAr ?? doc.categoryLabel : doc.categoryLabel}
                            </Badge>
                          </td>
                          <td style={{ padding: '0.875rem 1rem' }}>
                            <strong style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                              {isRtl ? doc.authorAr ?? doc.author : doc.author}
                            </strong>
                            <small style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                              {isRtl ? doc.authorRoleAr ?? doc.authorRole : doc.authorRole}
                            </small>
                          </td>
                          <td style={{ padding: '0.875rem 1rem' }}>
                            <Badge variant="success" size="sm" icon={doc.statusIcon}>
                              {isRtl ? doc.statusAr ?? doc.status : doc.status}
                            </Badge>
                          </td>
                          <td style={{ padding: '0.875rem 1rem' }}>
                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                              <Button
                                variant="ghost"
                                size="sm"
                                icon="visibility"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedId(doc.id);
                                }}
                                aria-label={`Preview ${doc.title}`}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                icon="download"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setNotice(
                                    isRtl
                                      ? 'زر تنزيل تجريبي للعرض فقط. لم يتم تنزيل أي ملف.'
                                      : 'Demo-only download control. No file was downloaded.'
                                  );
                                }}
                                aria-label={`Download ${doc.title}`}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {visibleDocuments.length === 0 && (
                <EmptyState
                  icon="folder_open"
                  title={copy.noMatching}
                  description={copy.tryAnotherDoc}
                />
              )}

              <footer style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                {copy.showingPrefix} {visibleDocuments.length} {copy.showingMid} {doctorPatientDocuments.length} {copy.showingSuffix}
              </footer>
            </PanelBody>
          </Panel>

          {/* Document Inspector Sidebar */}
          {selectedDocument && <DocumentInspector document={selectedDocument} copy={copy} isRtl={isRtl} />}
        </div>
      </div>
    </PatientWorkspaceShell>
  );
}

function DocumentInspector({
  document,
  copy,
  isRtl,
}: {
  document: typeof doctorPatientDocuments[number];
  copy: typeof doctorMessages.en.documents | typeof doctorMessages.ar.documents;
  isRtl: boolean;
}) {
  return (
    <Panel variant="elevated">
      <PanelHeader
        title={
          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MaterialIcon name="lock" style={{ fontSize: '0.875rem' }} /> {copy.confidential}
            </span>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: '0.2rem 0' }}>
              {isRtl ? document.titleAr ?? document.title : document.title}
            </h2>
            <small style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
              {isRtl ? document.subtitleAr ?? document.subtitle : document.subtitle} • {copy.docId} {document.id}
            </small>
          </div>
        }
        actions={<MaterialIcon name="verified" style={{ color: 'var(--brand-primary)' }} />}
      />
      <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Simulated Document Preview Sheet */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--surface-subtle)',
            border: '1px dashed var(--border-default)',
            textAlign: 'center',
          }}
        >
          <strong style={{ fontSize: '0.8125rem', color: 'var(--text-main)', display: 'block' }}>
            {copy.watermarkHeader}
          </strong>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {copy.watermarkConfidential}
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', margin: '1rem 0' }}>
            <div style={{ height: '4px', backgroundColor: 'var(--border-default)', borderRadius: '2px' }} />
            <div style={{ height: '4px', backgroundColor: 'var(--border-default)', borderRadius: '2px', width: '85%' }} />
            <div style={{ height: '4px', backgroundColor: 'var(--border-default)', borderRadius: '2px', width: '60%' }} />
          </div>
          <footer style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
            Hash: demo...record • <strong style={{ color: 'var(--brand-primary)' }}>{copy.digitallySealed}</strong>
          </footer>
        </div>

        {/* Document Audit Metadata */}
        <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.35rem' }}>
            <dt style={{ color: 'var(--text-tertiary)' }}>{copy.uploadedOn}</dt>
            <dd style={{ margin: 0, fontWeight: 600, color: 'var(--text-main)' }}>{document.date} ({document.time})</dd>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.35rem' }}>
            <dt style={{ color: 'var(--text-tertiary)' }}>{copy.authoredBy}</dt>
            <dd style={{ margin: 0, fontWeight: 600, color: 'var(--text-main)' }}>{isRtl ? document.authorAr ?? document.author : document.author}</dd>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.35rem' }}>
            <dt style={{ color: 'var(--text-tertiary)' }}>{copy.tenantIsolation}</dt>
            <dd style={{ margin: 0, fontWeight: 600, color: 'var(--text-main)' }}>{copy.authorizedTeam}</dd>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <dt style={{ color: 'var(--text-tertiary)' }}>{copy.securityProtocol}</dt>
            <dd style={{ margin: 0, fontWeight: 600, color: 'var(--text-main)' }}>{copy.demoPresentation}</dd>
          </div>
        </dl>
      </PanelBody>
    </Panel>
  );
}
