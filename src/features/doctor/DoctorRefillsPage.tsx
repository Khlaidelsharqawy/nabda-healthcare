import { useMemo, useState } from 'react';
import { MaterialIcon, PageHeader, StatCard, Panel, PanelHeader, PanelBody, Badge, Button, Input, Textarea, Select, EmptyState } from '../../components/ui';
import { doctorRefillRequests, type RefillStatus, type RefillUrgency } from './fixtures';
import { useTheme } from '../../theme/ThemeProvider';
import { doctorMessages } from '../../i18n/messages';

type Filter = 'all' | RefillUrgency | RefillStatus;

export function DoctorRefillsPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = doctorMessages[isRtl ? 'ar' : 'en'].refills;

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState(doctorRefillRequests[0].id);
  const [statuses, setStatuses] = useState<Record<string, RefillStatus>>({});
  const [quantity, setQuantity] = useState(isRtl ? '30 قرصاً (إمداد شهر واحد)' : '30 Tablets (1 Month Maintenance Supply)');
  const [refills, setRefills] = useState(isRtl ? 'تكرار واحد مصرح به متبقٍ' : '1 Remaining Authorized Refill');
  const [note, setNote] = useState('');
  const [notice, setNotice] = useState('');

  const selected = doctorRefillRequests.find((request) => request.id === selectedId) ?? doctorRefillRequests[0];

  const visible = useMemo(
    () =>
      doctorRefillRequests.filter((request) => {
        const status = statuses[request.id] ?? request.status;
        const matchesQuery = `${request.patientLabel} ${request.patientId} ${request.medication} ${request.id}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesFilter = filter === 'all' || request.urgency === filter || status === filter;
        return matchesQuery && matchesFilter;
      }),
    [filter, query, statuses]
  );

  const setLocalStatus = (status: RefillStatus, message: string) => {
    setStatuses((current) => ({ ...current, [selected.id]: status }));
    setNotice(
      isRtl
        ? 'تجريبي للعرض فقط - تم تسجيل الإجراء محلياً. لم يتم تعديل أو تجديد أي وصفة طبية.'
        : `Demo only - ${message} No prescription was changed, signed, renewed, or transmitted.`
    );
  };

  return (
    <div className="aegis-page doctor-refills-page" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Governance Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.625rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--brand-primary-light)',
          color: 'var(--brand-primary)',
          fontSize: '0.8125rem',
          fontWeight: 600,
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <MaterialIcon name="verified_user" />
          <strong>{copy.governance}</strong>
          <span>•</span>
          <span>{copy.governanceDesc}</span>
        </span>
        <Badge variant="brand" size="sm">{copy.localDemo}</Badge>
      </div>

      <PageHeader
        kicker={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>{copy.portalCrumb}</span>
            <span>/</span>
            <span>{copy.prescriptionsCrumb}</span>
            <span>/</span>
            <strong>{copy.queueCrumb}</strong>
          </div>
        }
        title={copy.heading}
        subtitle={copy.desc}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Badge variant="brand" size="md" icon="clinical_notes">
              {copy.emrSync}
            </Badge>
            <Button
              variant="outline"
              icon="history"
              onClick={() =>
                setNotice(
                  isRtl
                    ? 'تجريبي للعرض فقط - لم يتم فتح سجل التجديدات السابق.'
                    : 'Demo only - past refill log was not opened.'
                )
              }
            >
              {copy.past30Days}
            </Button>
          </div>
        }
      />

      {/* Telemetry Row */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        <StatCard label={copy.pendingReview} value="5" delta={<span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{isRtl ? 'طلبات' : 'Requests'}</span>} icon="pending_actions" />
        <StatCard label={copy.approvedToday} value="14" delta={<span style={{ fontSize: '0.75rem', color: 'var(--color-success-text)' }}>{isRtl ? 'حالات تجريبية' : 'Processed demo states'}</span>} icon="check_circle" />
        <StatCard label={copy.visitRequired} value="3" delta={<span style={{ fontSize: '0.75rem', color: 'var(--color-warning-text)' }}>{isRtl ? 'حالات' : 'Cases'}</span>} icon="contact_support" />
        <StatCard label={copy.rejectedDiscontinued} value="1" delta={<span style={{ fontSize: '0.75rem', color: 'var(--color-danger-text)' }}>{isRtl ? 'حالة تجريبية' : 'Demo status'}</span>} icon="block" />
      </section>

      {/* Toolbar */}
      <Panel variant="elevated">
        <PanelBody style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 260px' }}>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={copy.searchPlaceholder}
              prefixIcon="search"
            />
          </div>
          <select
            aria-label="Refill filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as Filter)}
            style={{
              padding: '0.625rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-default)',
              fontSize: '0.875rem',
              color: 'var(--text-main)',
              outline: 'none',
            }}
          >
            <option value="all">{copy.allRequests}</option>
            <option value="priority">{copy.priorityRefill}</option>
            <option value="standard">{copy.standardRefill}</option>
            <option value="clarification">{copy.needsInfo}</option>
            <option value="approved">{copy.approved}</option>
            <option value="rejected">{copy.rejected}</option>
          </select>
          <select
            aria-label="Therapeutic class filter"
            style={{
              padding: '0.625rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-default)',
              fontSize: '0.875rem',
              color: 'var(--text-main)',
              outline: 'none',
            }}
          >
            <option>{copy.allTherapeutic}</option>
            <option>{isRtl ? 'أدوية ضغط الدم' : 'Antihypertensive'}</option>
            <option>{isRtl ? 'أدوية السكري وخافضات السكر' : 'Antidiabetic / Hypoglycemic'}</option>
            <option>{isRtl ? 'أدوية الجهاز التنفسي والاستنشاق' : 'Respiratory / Inhaled'}</option>
          </select>
          <Button
            variant="outline"
            icon="filter_alt_off"
            onClick={() => {
              setQuery('');
              setFilter('all');
              setNotice(isRtl ? 'تمت إعادة ضبط الفلاتر محلياً.' : 'Demo filters reset locally.');
            }}
            title="Reset filters"
          />
        </PanelBody>
      </Panel>

      {/* Refill Workspace: Queue + Selected Inspector */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '360px minmax(0, 1fr)',
          gap: '1.5rem',
          alignItems: 'start',
        }}
        className="doctor-refills-grid"
      >
        {/* Queue List Column */}
        <Panel variant="elevated">
          <PanelHeader
            title={
              <strong style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
                {copy.requestsAwaiting} ({visible.length} {copy.shown})
              </strong>
            }
            actions={<Badge variant="neutral" size="sm">Queue Ref: N-2025</Badge>}
          />
          <PanelBody style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
            {visible.map((request) => {
              const currentStatus = statuses[request.id] ?? request.status;
              const isSelected = selected.id === request.id;
              return (
                <button
                  key={request.id}
                  type="button"
                  onClick={() => setSelectedId(request.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: isRtl ? 'right' : 'left',
                    padding: '1rem 1.25rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    backgroundColor: isSelected ? 'var(--surface-subtle)' : 'transparent',
                    borderInlineStart: isSelected ? '3px solid var(--brand-primary)' : '3px solid transparent',
                    cursor: 'pointer',
                    gap: '0.35rem',
                    borderTop: 'none',
                    borderRight: 'none',
                    borderLeft: 'none',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>{request.patientLabel}</strong>
                    <Badge variant={request.urgency === 'priority' ? 'error' : 'neutral'} size="sm">
                      {request.urgency}
                    </Badge>
                  </div>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
                    {request.medication}
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                    <span>{request.patientId} • #{request.id}</span>
                    <Badge variant={currentStatus === 'approved' ? 'success' : currentStatus === 'rejected' ? 'error' : 'warning'} size="sm">
                      {currentStatus}
                    </Badge>
                  </div>
                </button>
              );
            })}

            {visible.length === 0 && (
              <EmptyState icon="search_off" title="No refill requests" description="Adjust your filters or query." />
            )}
          </PanelBody>
        </Panel>

        {/* Selected Request Inspector */}
        {selected && (
          <Panel variant="elevated">
            <PanelHeader
              title={
                <div>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.15rem 0' }}>
                    {selected.patientLabel}
                  </h2>
                  <small style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    {selected.patientId} • Refill ID #{selected.id}
                  </small>
                </div>
              }
              actions={
                <Badge variant={selected.urgency === 'priority' ? 'error' : 'brand'} size="md">
                  {selected.urgency === 'priority' ? 'Priority Refill' : 'Standard Routine'}
                </Badge>
              }
            />
            <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Prescribed Regimen Banner */}
              <div
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--surface-subtle)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Requested Medication
                </span>
                <strong style={{ fontSize: '1.125rem', color: 'var(--brand-primary)' }}>
                  {selected.medication}
                </strong>
                <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Last dispensed: 28 days ago • Tolerating well • Maintenance therapy
                </p>
              </div>

              {/* Dispense Parameters */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    Dispense Quantity
                  </label>
                  <Input value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    Authorized Refills
                  </label>
                  <Input value={refills} onChange={(e) => setRefills(e.target.value)} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  Physician Note / Instruction
                </label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={isRtl ? 'تعليمات الصيدلية أو ملاحظات الطبيب...' : 'Clinical refill instructions or pharmacist guidance...'}
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                <Button
                  variant="primary"
                  icon="check_circle"
                  onClick={() => setLocalStatus('approved', 'Refill request approved.')}
                >
                  Approve Refill
                </Button>
                <Button
                  variant="outline"
                  icon="contact_support"
                  onClick={() => setLocalStatus('clarification', 'Clinical encounter required prior to refill.')}
                >
                  Require Clinical Visit
                </Button>
                <Button
                  variant="danger"
                  icon="cancel"
                  onClick={() => setLocalStatus('rejected', 'Refill request declined.')}
                >
                  Decline Refill
                </Button>
              </div>
            </PanelBody>
          </Panel>
        )}
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
