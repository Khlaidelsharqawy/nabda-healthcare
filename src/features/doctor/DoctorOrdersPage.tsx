import { useState } from 'react';
import { MaterialIcon, PageHeader, StatCard, Panel, PanelHeader, PanelBody, Badge, Button, Input, EmptyState } from '../../components/ui';
import { doctorOrders, type DoctorOrderStatus, type DoctorOrderType } from './fixtures';
import { useTheme } from '../../theme/ThemeProvider';
import { doctorMessages } from '../../i18n/messages';

export function DoctorOrdersPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = doctorMessages[isRtl ? 'ar' : 'en'].orders;

  const orderTypes: { label: string; value: DoctorOrderType | 'all' }[] = [
    { label: copy.types.all, value: 'all' },
    { label: copy.types.lab, value: 'lab' },
    { label: copy.types.imaging, value: 'imaging' },
  ];

  const statuses: { label: string; value: DoctorOrderStatus | 'all' }[] = [
    { label: copy.statuses.all, value: 'all' },
    { label: copy.statuses.draft, value: 'draft' },
    { label: copy.statuses.pending, value: 'pending' },
    { label: copy.statuses.submitted, value: 'submitted' },
    { label: copy.statuses.completed, value: 'completed' },
  ];

  const [typeFilter, setTypeFilter] = useState<DoctorOrderType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<DoctorOrderStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(doctorOrders[0]?.id ?? '');
  const [notice, setNotice] = useState('');

  const visibleOrders = doctorOrders.filter((order) => {
    const matchesType = typeFilter === 'all' || order.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const localizedPatient = isRtl ? order.patientNameAr ?? order.patientName : order.patientName;
    const localizedTitle = isRtl ? order.titleAr ?? order.title : order.title;
    const query = `${order.id} ${order.patientName} ${order.patientId} ${order.title} ${localizedPatient} ${localizedTitle}`.toLowerCase();
    return matchesType && matchesStatus && query.includes(search.toLowerCase());
  });

  const getPriorityVariant = (priority: string): 'error' | 'warning' | 'neutral' => {
    switch (priority) {
      case 'stat':
      case 'urgent':
        return 'error';
      case 'priority':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const getStatusVariant = (status: DoctorOrderStatus): 'success' | 'warning' | 'brand' | 'neutral' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'submitted':
        return 'brand';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="aegis-page doctor-orders" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <PageHeader
        kicker={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MaterialIcon name="order_approve" style={{ fontSize: '1rem' }} />
            <span>{copy.eyebrow}</span>
          </div>
        }
        title={copy.heading}
        subtitle={copy.subtitle}
        actions={
          <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              icon="biotech"
              onClick={() => {
                window.location.href = '/doctor/orders/lab/new';
              }}
            >
              {copy.newLabOrder}
            </Button>
            <Button
              variant="outline"
              icon="radiology"
              onClick={() => {
                window.location.href = '/doctor/orders/imaging/new';
              }}
            >
              {copy.newImagingOrder}
            </Button>
          </div>
        }
      />

      {/* Metrics Row */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
        aria-label="clinical order metrics"
      >
        <StatCard
          label={copy.activeOrders}
          value="28"
          delta={<span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{copy.syncedLanes}</span>}
          icon="assignment_turned_in"
        />
        <StatCard
          label={copy.pendingProcessing}
          value="09"
          delta={<span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{copy.awaitingSpecimen}</span>}
          icon="pending_actions"
        />
        <StatCard
          label={copy.urgentPriority}
          value="03"
          delta={<span style={{ fontSize: '0.75rem', color: 'var(--color-danger-text)' }}>{copy.statAssigned}</span>}
          icon="bolt"
        />
        <StatCard
          label={copy.completedToday}
          value="16"
          delta={<span style={{ fontSize: '0.75rem', color: 'var(--color-success-text)' }}>{copy.resultsSigned}</span>}
          icon="verified"
        />
      </section>

      {/* Filter and Query Section */}
      <Panel variant="elevated">
        <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.35rem' }} aria-label="order type filters">
              {orderTypes.map((filter) => (
                <Button
                  key={filter.value}
                  variant={typeFilter === filter.value ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setTypeFilter(filter.value)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
              <MaterialIcon name="lock_clock" style={{ fontSize: '1rem' }} />
              <span>{copy.scopeActive}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 240px' }}>
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={copy.searchPlaceholder}
                prefixIcon="search"
                aria-label={copy.searchPlaceholder}
              />
            </div>
            <select
              aria-label="Filter orders by status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as DoctorOrderStatus | 'all')}
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
              {statuses.map((status) => (
                <option value={status.value} key={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <select
              aria-label="Filter orders by date range"
              defaultValue="last-30"
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
              <option value="last-30">{copy.dateRange}</option>
              <option value="today">{copy.today}</option>
              <option value="week">{copy.currentWeek}</option>
            </select>
          </div>
        </PanelBody>
      </Panel>

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

      {/* Orders Table Panel */}
      <Panel variant="elevated">
        <PanelHeader
          title={
            <div>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {copy.registryMeta} • {visibleOrders.length} {copy.syntheticRecords}
              </span>
            </div>
          }
          actions={<Badge variant="neutral" size="sm">{copy.demoDataOnly}</Badge>}
        />
        <PanelBody style={{ padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--surface-subtle)', borderBottom: '1px solid var(--border-default)' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: isRtl ? 'right' : 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    {copy.thOrderId}
                  </th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: isRtl ? 'right' : 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    {copy.thOrderType}
                  </th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: isRtl ? 'right' : 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    {copy.thPatient}
                  </th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: isRtl ? 'right' : 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    {copy.thRequested}
                  </th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: isRtl ? 'right' : 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    {copy.thPriority}
                  </th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: isRtl ? 'right' : 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    {copy.thStatus}
                  </th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: isRtl ? 'right' : 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    {copy.thActions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleOrders.map((order) => {
                  const isSelected = selectedOrderId === order.id;
                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: isSelected ? 'var(--surface-subtle)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <td style={{ padding: '0.875rem 1rem', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                        {order.id}
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}>
                          <MaterialIcon
                            name={order.type === 'lab' ? 'biotech' : 'radiology'}
                            style={{ color: order.type === 'lab' ? 'var(--brand-primary)' : '#0284c7', fontSize: '1rem' }}
                          />
                          <span>{isRtl ? order.typeLabelAr ?? order.typeLabel : order.typeLabel}</span>
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                          {isRtl ? order.patientNameAr ?? order.patientName : order.patientName}
                        </strong>
                        <small style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{order.patientId}</small>
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                          {isRtl ? order.titleAr ?? order.title : order.title}
                        </strong>
                        <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {isRtl ? order.detailAr ?? order.detail : order.detail}
                        </small>
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <Badge variant={getPriorityVariant(order.priority)} size="sm">
                          {isRtl ? order.priorityLabelAr ?? order.priorityLabel : order.priorityLabel}
                        </Badge>
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <Badge variant={getStatusVariant(order.status)} size="sm">
                          {isRtl ? order.statusLabelAr ?? order.statusLabel : order.statusLabel}
                        </Badge>
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedOrderId(order.id);
                              setNotice(
                                isRtl
                                  ? `عرض ${order.id} تجريبي للعرض فقط؛ لم يتم فتح أي طلب فعلي.`
                                  : `Viewing ${order.id} is demo-only; no clinical order was opened or changed.`
                              );
                            }}
                          >
                            {copy.viewDetails}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(event) => {
                              event.stopPropagation();
                              setNotice(
                                isRtl
                                  ? `تعديل ${order.id} تجريبي للعرض فقط؛ لم يتم تغيير أي طلب.`
                                  : `Editing ${order.id} is demo-only; no clinical order was changed.`
                              );
                            }}
                          >
                            {copy.edit}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {visibleOrders.length === 0 && (
            <EmptyState
              icon="search_off"
              title={copy.noMatching}
              description={copy.tryAnother}
            />
          )}
        </PanelBody>
      </Panel>
    </div>
  );
}
