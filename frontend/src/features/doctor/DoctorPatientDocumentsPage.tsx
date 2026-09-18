import { useState } from 'react';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { PatientWorkspaceShell } from './PatientWorkspaceShell';
import { doctorPatientDocuments, type PatientDocumentCategory } from './fixtures';

const filters: { label: string; value: PatientDocumentCategory | 'all' }[] = [
  { label: 'All Documents', value: 'all' },
  { label: 'Diagnostic Reports', value: 'diagnostic' },
  { label: 'Pathology', value: 'pathology' },
  { label: 'Surgical Records', value: 'surgical' },
  { label: 'Hospital Discharge', value: 'discharge' },
  { label: 'External Referrals', value: 'referral' },
];

export function DoctorPatientDocumentsPage({ patientId }: { patientId: string }) {
  const [activeFilter, setActiveFilter] = useState<PatientDocumentCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(doctorPatientDocuments[0]?.id ?? '');
  const [notice, setNotice] = useState('');
  const visibleDocuments = doctorPatientDocuments.filter((document) => {
    const matchesCategory = activeFilter === 'all' || document.category === activeFilter;
    const haystack = `${document.title} ${document.subtitle} ${document.author} ${document.fileType}`.toLowerCase();
    return matchesCategory && haystack.includes(search.toLowerCase());
  });
  const selectedDocument = doctorPatientDocuments.find((document) => document.id === selectedId) ?? visibleDocuments[0] ?? doctorPatientDocuments[0];

  return (
    <PatientWorkspaceShell patientId={patientId} pathname={window.location.pathname} breadcrumbLabel="Clinical Documents / المستندات السريرية">
      <div className="doctor-patient-documents">
        <section className="doctor-patient-documents__context doctor-patient-card">
          <div className="doctor-patient-documents__context-main"><MaterialIcon name="folder_shared" /><div><strong>Clinical Documents / المستندات السريرية</strong><span>Doctor Vault Scope: EMR Sealed • Synthetic demonstration records</span></div></div>
          <div className="doctor-patient-documents__stats"><span>EHR Documents <b>{doctorPatientDocuments.length} files</b></span><span>Pending Sign-off <b>1 item</b></span></div>
          <div className="doctor-patient-documents__actions"><span><MaterialIcon name="verified" /> Storage Compliance: demo-only local registry</span><button type="button" onClick={() => setNotice('Demo-only upload control. No file was uploaded or stored.')}><MaterialIcon name="upload_file" /> Upload Document / رفع مستند</button><button type="button" onClick={() => setNotice('Summary export is demo-only and does not download a file.')}><MaterialIcon name="print" /> Export Summary</button></div>
          {notice && <p className="doctor-patient-documents__notice" role="status">{notice}</p>}
        </section>

        <section className="doctor-patient-documents__repository">
          <div className="doctor-patient-card doctor-patient-documents__toolbar">
            <label><MaterialIcon name="search" /><input aria-label="Search clinical documents" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title, tag, author, or diagnostic code..." /></label>
            <button type="button" onClick={() => { setSearch(''); setActiveFilter('all'); }}><MaterialIcon name="sync" /> Reset</button>
            <div className="doctor-patient-documents__filters" aria-label="document category filters">{filters.map((filter) => <button type="button" className={activeFilter === filter.value ? 'is-active' : ''} key={filter.value} onClick={() => setActiveFilter(filter.value)}>{filter.label} ({filter.value === 'all' ? doctorPatientDocuments.length : doctorPatientDocuments.filter((document) => document.category === filter.value).length})</button>)}</div>
          </div>
          <div className="doctor-patient-card doctor-patient-documents__table-card">
            <div className="doctor-patient-documents__table-meta"><span>Registry Index • Filtered Encounters ({visibleDocuments.length} records)</span><span><MaterialIcon name="shield" /> Synthetic demo registry</span></div>
            <div className="doctor-patient-documents__table-wrap"><table><thead><tr><th>Document / المستند</th><th>Category</th><th>Uploaded</th><th>Author</th><th>File & Size</th><th>Attestation</th><th>Actions</th></tr></thead><tbody>{visibleDocuments.map((document) => <tr className={selectedDocument?.id === document.id ? 'is-selected' : ''} key={document.id} onClick={() => setSelectedId(document.id)}><td><div className="doctor-patient-documents__title"><MaterialIcon name={document.icon} /><span><strong>{document.title}</strong><small>{document.subtitle}</small></span></div></td><td><span className="doctor-patient-documents__category">{document.categoryLabel}</span></td><td>{document.date}<small>{document.time}</small></td><td><strong>{document.author}</strong><small>{document.authorRole}</small></td><td><span className="doctor-patient-documents__file">{document.fileType} • {document.size}</span></td><td><span className="doctor-patient-documents__status"><MaterialIcon name={document.statusIcon} /> {document.status}</span></td><td><div className="doctor-patient-documents__row-actions"><button type="button" aria-label={`Preview ${document.title}`} onClick={(event) => { event.stopPropagation(); setSelectedId(document.id); }}><MaterialIcon name="visibility" /></button><button type="button" aria-label={`Demo download ${document.title}`} onClick={(event) => { event.stopPropagation(); setNotice('Demo-only download control. No file was downloaded.'); }}><MaterialIcon name="download" /></button><button type="button" aria-label={`Audit ${document.title}`} onClick={(event) => { event.stopPropagation(); setNotice('Demo-only audit trail for the selected synthetic record.'); }}><MaterialIcon name="history" /></button></div></td></tr>)}</tbody></table></div>
            {visibleDocuments.length === 0 && <div className="doctor-patient-documents__empty"><MaterialIcon name="folder_open" /><strong>No matching documents</strong><span>Try another search or category.</span></div>}
            <footer>Showing {visibleDocuments.length} of {doctorPatientDocuments.length} synthetic patient records</footer>
          </div>
        </section>

        {selectedDocument && <DocumentInspector document={selectedDocument} />}
      </div>
    </PatientWorkspaceShell>
  );
}

function DocumentInspector({ document }: { document: typeof doctorPatientDocuments[number] }) {
  return <aside className="doctor-patient-documents__inspector"><section className="doctor-patient-card"><header><div><span><MaterialIcon name="lock" /> Confidential Synthetic Patient Record</span><h2>{document.title}</h2><small>{document.subtitle} • Document ID: {document.id}</small></div><MaterialIcon name="verified" /></header><div className="doctor-patient-documents__preview"><div><div><strong>AegisHealth Clinical Health</strong><span>CONFIDENTIAL DEMO</span></div><div className="doctor-patient-documents__preview-lines"><i /><i /><i /><i /></div><footer>Hash: demo...record <b>DIGITALLY SEALED DEMO</b></footer></div></div><dl><div><dt>Uploaded On:</dt><dd>{document.date} ({document.time})</dd></div><div><dt>Authored By:</dt><dd>{document.author}</dd></div><div><dt>Tenant Isolation:</dt><dd>Authorized demo care team</dd></div><div><dt>Security Protocol:</dt><dd>Demo-only local presentation</dd></div></dl><div className="doctor-patient-documents__attestation"><MaterialIcon name="verified_user" /><span><strong>Attestation Verified</strong><small>Synthetic fixture only. No audit record or storage mutation occurred.</small></span></div><div className="doctor-patient-documents__inspector-actions"><button type="button" onClick={() => undefined}><MaterialIcon name="open_in_new" /> Open Demo Viewer</button><div><button type="button" onClick={() => undefined}><MaterialIcon name="file_download" /> Download Copy</button><button type="button" onClick={() => undefined}><MaterialIcon name="print" /> Print</button></div></div></section><section className="doctor-patient-card doctor-patient-documents__trend"><div><MaterialIcon name="monitor_heart" /><strong>Telemetry Trend Timeline</strong></div><p>Deterministic synthetic trend matched to the document registry.</p><svg viewBox="0 0 600 120" role="img" aria-label="Synthetic telemetry trend"><polyline points="40,90 160,75 280,60 400,45 520,35" fill="none" stroke="currentColor" strokeWidth="3" /><circle cx="520" cy="35" r="5" /></svg></section></aside>;
}
