import { useMemo, useState } from 'react';
import { MaterialIcon, PageHeader, Button, Badge, Panel, PanelHeader, StatCard, Input, Select, Textarea, TableWrapper, Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { assistantMessages } from '../../i18n/messages';
import { assistantSpecimenOrders, type AssistantSpecimenOrder } from './fixtures';

type SpecimenFilterKey = 'all' | 'blood' | 'urine' | 'swab';
type PriorityFilterKey = 'all' | 'stat' | 'urgent' | 'routine';

const specimenFilterKeys: SpecimenFilterKey[] = ['all', 'blood', 'urine', 'swab'];
const priorityFilterKeys: PriorityFilterKey[] = ['all', 'stat', 'urgent', 'routine'];

type ChecklistState = { identity: boolean; prep: boolean; labels: boolean };

export function AssistantSpecimenIntakePage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = assistantMessages[isRtl ? 'ar' : 'en'].specimenIntake;

  const [selectedId, setSelectedId] = useState(assistantSpecimenOrders[0].id);
  const [query, setQuery] = useState('');
  const [specimenFilter, setSpecimenFilter] = useState<SpecimenFilterKey>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilterKey>('all');
  const [orders, setOrders] = useState(assistantSpecimenOrders);
  const [checklist, setChecklist] = useState<ChecklistState>({ identity: true, prep: true, labels: true });
  const [observation, setObservation] = useState(
    isRtl
      ? 'تم ملء الأنبوب حتى علامة التحديد، لا يوجد انحلال بالدم. تم وضع العينة في حامل حرارة الغرفة.'
      : 'Tube filled to indicator line, no hemolysis observed. Specimen placed in ambient rack.'
  );
  const [notice, setNotice] = useState('');
  const [manualOpen, setManualOpen] = useState(false);

  const filteredOrders = useMemo(() => orders.filter((order) => {
    const haystack = `${order.id} ${order.patientId} ${order.patient} ${order.order}`.toLowerCase();
    const matchesQuery = haystack.includes(query.trim().toLowerCase());
    const matchesSpecimen = specimenFilter === 'all' || (specimenFilter === 'blood' && /blood|glucose|troponin|electrolyte|metabolic|cbc/i.test(order.specimen + order.order)) || (specimenFilter === 'urine' && /urine/i.test(order.specimen)) || (specimenFilter === 'swab' && /swab/i.test(order.specimen));
    const matchesPriority = priorityFilter === 'all' || (priorityFilter === 'stat' && order.priority === 'STAT emergency') || (priorityFilter === 'routine' && order.priority === 'Routine') || (priorityFilter === 'urgent' && order.priority === 'Recollect');
    return matchesQuery && matchesSpecimen && matchesPriority;
  }), [orders, priorityFilter, query, specimenFilter]);

  const selectedOrder = orders.find((order) => order.id === selectedId) ?? orders[0];
  const allChecked = Object.values(checklist).every(Boolean);
  const setCheck = (key: keyof ChecklistState, value: boolean) => setChecklist((current) => ({ ...current, [key]: value }));

  const updateState = async (nextState: AssistantSpecimenOrder['state'], message: string) => {
    try {
      if (nextState === 'Collected & barcoded') {
        const { container } = await import('../../di/container');
        await container.processSpecimenIntakeUseCase.execute({
          tenantId: 'tenant-demo-01',
          collectorStaffId: 'staff-001',
          collectorName: isRtl ? 'منى رضوان' : 'Mona Radwan',
          orderId: selectedOrder.id,
          specimenType: 'blood',
          qualityNotes: observation,
        });
      }
      setOrders((current) => current.map((order) => order.id === selectedOrder.id ? { ...order, state: nextState } : order));
      setNotice(
        isRtl
          ? `✅ تم توثيق جمع العينة وحفظ رقم الاستلام وسلسلة الحيازة وإرسال إشعار للمختبر والأتمتة بنجاح.`
          : `✅ Specimen collected, accession number assigned, chain of custody logged, and laboratory automation dispatched.`
      );
    } catch (e: any) {
      setNotice(e.message);
    }
  };

  return (
    <div className="assistant-page assistant-specimen-intake" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        kicker={`${copy.portalBreadcrumb} • ${copy.ordersBreadcrumb} • ${copy.intakeBreadcrumb}`}
        title={`${copy.title} - ${copy.titleSub}`}
        subtitle={copy.subtitle}
        actions={
          <Badge variant="brand" icon="verified_user">
            {copy.operationalRole}
          </Badge>
        }
      />

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <StatCard
          label={copy.pendingCollectionMetric}
          value="4"
          delta={copy.pendingCollectionDetail}
          icon="hourglass_top"
          variant="warning"
        />
        <StatCard
          label={copy.collectedAccessionedMetric}
          value="18"
          delta={copy.collectedAccessionedDetail}
          icon="check_circle"
          variant="success"
        />
        <StatCard
          label={copy.dispatchedProcessingMetric}
          value="12"
          delta={copy.dispatchedProcessingDetail}
          icon="local_shipping"
          variant="accent"
        />
        <StatCard
          label={copy.flaggedRecollectionMetric}
          value="1"
          delta={copy.flaggedRecollectionDetail}
          icon="warning"
          variant="error"
        />
      </section>

      {/* Filter Toolbar */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 220px' }}>
          <Input
            iconStart="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.searchPlaceholder}
          />
        </div>
        <div style={{ width: '180px' }}>
          <Select
            iconStart="science"
            value={specimenFilter}
            onChange={(e) => setSpecimenFilter(e.target.value as SpecimenFilterKey)}
            options={specimenFilterKeys.map((k) => ({ value: k, label: copy.specimenTypes[k] }))}
          />
        </div>
        <div style={{ width: '180px' }}>
          <Select
            iconStart="flag"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as PriorityFilterKey)}
            options={priorityFilterKeys.map((k) => ({ value: k, label: copy.priorities[k] }))}
          />
        </div>
        <Badge variant="neutral" icon="calendar_today">{copy.todayDate}</Badge>
        <Button variant="primary" size="md" icon="add_circle" onClick={() => setManualOpen(true)}>
          {copy.manualAccessionEntry}
        </Button>
      </div>

      {/* Main Workspace Layout */}
      <div className="assistant-two-column-layout">
        {/* Left: Table & Phlebotomy Chairs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Panel variant="elevated" padding="none">
            <div style={{ padding: '1.25rem 1.25rem 0' }}>
              <PanelHeader
                title={copy.queueHeading}
                icon="format_list_bulleted"
                tag={<Badge variant="brand">{copy.ordersStaged}</Badge>}
                actions={
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="sync"
                    aria-label={copy.refreshQueueAria}
                    onClick={() => setNotice(isRtl ? 'عرض تجريبي فقط: تم تحديث الطابور المحلي.' : 'Demo only: local queue refreshed.')}
                  />
                }
              />
            </div>

            <TableWrapper>
              <Table hover>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>{copy.thRefTime}</TableHeaderCell>
                    <TableHeaderCell>{copy.thDemographics}</TableHeaderCell>
                    <TableHeaderCell>{copy.thOrder}</TableHeaderCell>
                    <TableHeaderCell>{copy.thSpecimen}</TableHeaderCell>
                    <TableHeaderCell>{copy.thPrep}</TableHeaderCell>
                    <TableHeaderCell>{copy.thState}</TableHeaderCell>
                    <TableHeaderCell>{copy.thAccession}</TableHeaderCell>
                    <TableHeaderCell textAlign="end">{copy.thAction}</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const isSelected = selectedOrder.id === order.id;
                    const stateLabelText = order.state === 'Collected & barcoded'
                      ? copy.states.collected
                      : order.state === 'STAT waiting'
                        ? copy.states.statWaiting
                        : order.state === 'Recollection required'
                          ? copy.states.recollection
                          : copy.states.pending;

                    const actionText = order.state === 'Collected & barcoded'
                      ? copy.actionReprint
                      : order.state === 'Recollection required'
                        ? copy.actionRedraw
                        : copy.actionReview;

                    return (
                      <TableRow
                        key={order.id}
                        className={isSelected ? 'is-selected' : ''}
                        onClick={() => setSelectedId(order.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <TableCell>
                          <strong>{order.id}</strong>
                          <small style={{ display: 'block', color: 'var(--text-tertiary)' }}>{order.time}</small>
                          <Badge variant={order.priority.includes('STAT') ? 'error' : 'neutral'} dot>
                            {order.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <strong>{order.patient}</strong>
                          <small style={{ display: 'block', color: 'var(--text-tertiary)' }}>{order.patientId}</small>
                        </TableCell>
                        <TableCell>
                          <span>{order.order}</span>
                          <small style={{ display: 'block', color: 'var(--text-tertiary)' }}>{order.clinician}</small>
                        </TableCell>
                        <TableCell>
                          <Badge variant="brand">{order.specimen}</Badge>
                        </TableCell>
                        <TableCell>
                          <span style={{ fontSize: '0.8125rem' }}>{order.prep}</span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.state === 'Collected & barcoded'
                                ? 'success'
                                : order.state === 'Recollection required'
                                ? 'error'
                                : order.state === 'STAT waiting'
                                ? 'warning'
                                : 'neutral'
                            }
                            dot
                          >
                            {stateLabelText}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <code style={{ fontSize: '0.78rem' }}>{order.accession}</code>
                        </TableCell>
                        <TableCell textAlign="end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setNotice(isRtl ? `عرض تجريبي فقط: تم اختيار ${order.id} للمراجعة المحلية.` : `Demo only: ${order.id} selected for local intake review.`);
                            }}
                          >
                            {actionText}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableWrapper>
          </Panel>

          {/* Phlebotomy Chairs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-primary)' }}>01</span>
              <div style={{ flex: 1 }}>
                <strong style={{ display: 'block', fontSize: '0.875rem' }}>{copy.chair1Label}</strong>
                <Badge variant="success" dot>{copy.chair1Status}</Badge>
              </div>
            </div>
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-warning-text)' }}>02</span>
              <div style={{ flex: 1 }}>
                <strong style={{ display: 'block', fontSize: '0.875rem' }}>{copy.chair2Label}</strong>
                <Badge variant="warning" dot>{copy.chair2Status}</Badge>
              </div>
            </div>
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-tertiary)' }}>03</span>
              <div style={{ flex: 1 }}>
                <strong style={{ display: 'block', fontSize: '0.875rem' }}>{copy.chair3Label}</strong>
                <Badge variant="neutral">{copy.chair3Status}</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Right Aside: Accession Entry Detail */}
        <Panel variant="elevated">
          <PanelHeader
            title={copy.accessionEntryHeading}
            subtitle={copy.accessionEntrySub}
            icon="barcode_scanner"
            actions={<Badge variant="brand">{copy.activeEncounter}</Badge>}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <strong style={{ fontSize: '0.875rem' }}>{selectedOrder.id}</strong>
                <small style={{ color: 'var(--text-tertiary)' }}>{selectedOrder.clinician}</small>
              </div>
              <h4 style={{ margin: '0.2rem 0', fontSize: '1rem' }}>{selectedOrder.patient}</h4>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{selectedOrder.patientId} • {selectedOrder.demographics}</span>
            </div>

            {/* Checklist */}
            <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '0.8125rem' }}>{copy.checklistHeading}</strong>
                <MaterialIcon name="fact_check" style={{ color: 'var(--brand-primary)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={checklist.identity} onChange={(e) => setCheck('identity', e.target.checked)} />
                  <span>{copy.checkIdentityTitle}</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={checklist.prep} onChange={(e) => setCheck('prep', e.target.checked)} />
                  <span>{copy.checkPrepTitle}</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={checklist.labels} onChange={(e) => setCheck('labels', e.target.checked)} />
                  <span>{copy.checkLabelsTitle}</span>
                </label>
              </div>
            </div>

            {/* Barcode visualizer */}
            <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-subtle)', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.78rem' }}>
                <span>{copy.accessionBarcodeTitle}</span>
                <strong>{selectedOrder.accession}</strong>
              </div>
              <code style={{ fontSize: '0.75rem', letterSpacing: '0.1em', display: 'block', padding: '0.35rem', backgroundColor: 'var(--surface-card)', borderRadius: 'var(--radius-sm)' }}>
                *AEGIS-LAB* {selectedOrder.accession}
              </code>
            </div>

            <Textarea
              rows={3}
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder={copy.qualityNoteLabel}
            />

            <Button
              variant="primary"
              size="lg"
              fullWidth
              icon="task_alt"
              disabled={!allChecked}
              onClick={() => updateState('Collected & barcoded', isRtl ? 'تم تجهيز حالة السحب' : 'Collection status prepared')}
            >
              {copy.completeCollectionBtn}
            </Button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <Button
                variant="outline"
                size="sm"
                icon="print"
                onClick={() => setNotice(isRtl ? 'عرض تجريبي فقط: تم طلب معاينة الملصق محلياً.' : 'Demo only: barcode label preview requested locally.')}
              >
                {copy.printPreviewBtn}
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon="report_problem"
                onClick={() => updateState('Recollection required', isRtl ? 'تم وضع علامة إعادة السحب' : 'Recollection flag prepared')}
              >
                {copy.flagRecollectionBtn}
              </Button>
            </div>
          </div>
        </Panel>
      </div>

      {notice && (
        <div className="auth-alert auth-alert--success" role="status">
          <MaterialIcon name="info" />
          <span>{notice}</span>
        </div>
      )}

      {/* Manual Accession Modal */}
      {manualOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10, 15, 12, 0.5)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
          role="presentation"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setManualOpen(false);
              setNotice(isRtl ? 'عرض تجريبي فقط: تم إنشاء مسودة التسجيل اليدوي محلياً.' : 'Demo only: manual accession draft created locally.');
            }}
            style={{
              backgroundColor: 'var(--surface-card)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              maxWidth: '480px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-default)',
            }}
            role="dialog"
            aria-modal="true"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.15rem' }}>{copy.manualModalTitle}</h2>
              <Button variant="ghost" size="sm" icon="close" aria-label={copy.closeManualAria} onClick={() => setManualOpen(false)} />
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>{copy.patientIdInputLabel}</label>
              <Input placeholder="PAT-XXXX" />
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>{copy.containerTypeInputLabel}</label>
              <Select
                options={[
                  { value: 'edta', label: 'Lavender Top (EDTA)' },
                  { value: 'sst', label: 'Gold Top (SST)' },
                  { value: 'citrate', label: 'Light Blue (Citrate)' },
                  { value: 'heparin', label: 'Green Top (Heparin)' },
                ]}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>{copy.requisitionNoteLabel}</label>
              <Textarea rows={3} placeholder={copy.requisitionNotePlaceholder} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Button variant="outline" size="md" onClick={() => setManualOpen(false)}>
                {copy.cancelBtn}
              </Button>
              <Button variant="primary" size="md" type="submit">
                {copy.prepareAccessionBtn}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
