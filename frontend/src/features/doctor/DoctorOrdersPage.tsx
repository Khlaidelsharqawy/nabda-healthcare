import { useState } from 'react';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { doctorOrders, type DoctorOrderStatus, type DoctorOrderType } from './fixtures';

const orderTypes: { label: string; value: DoctorOrderType | 'all' }[] = [
  { label: 'All Orders / كافة الطلبات', value: 'all' },
  { label: 'Laboratory / تحاليل مخبرية', value: 'lab' },
  { label: 'Imaging / أشعة تشخيصية', value: 'imaging' },
];

const statuses: { label: string; value: DoctorOrderStatus | 'all' }[] = [
  { label: 'All Statuses / كافة الحالات', value: 'all' },
  { label: 'Draft / مسودة', value: 'draft' },
  { label: 'Pending / قيد التنفيذ', value: 'pending' },
  { label: 'Submitted / تم الإرسال', value: 'submitted' },
  { label: 'Completed / مكتمل', value: 'completed' },
];

export function DoctorOrdersPage() {
  const [typeFilter, setTypeFilter] = useState<DoctorOrderType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<DoctorOrderStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(doctorOrders[0]?.id ?? '');
  const [notice, setNotice] = useState('');

  const visibleOrders = doctorOrders.filter((order) => {
    const matchesType = typeFilter === 'all' || order.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const query = `${order.id} ${order.patientName} ${order.patientId} ${order.title}`.toLowerCase();
    return matchesType && matchesStatus && query.includes(search.toLowerCase());
  });

  return (
    <div className="doctor-page doctor-orders">
      <header className="doctor-orders__heading">
        <div>
          <div className="doctor-orders__eyebrow"><MaterialIcon name="order_approve" /> Clinical Workflow • EMR Gateway</div>
          <h1>Clinical Orders <span>/ الأوامر والطلبات السريرية</span></h1>
          <p>Manage and review laboratory and diagnostic imaging orders / إدارة ومتابعة طلبات الفحوصات المخبرية والأشعة التشخيصية</p>
        </div>
        <div className="doctor-orders__actions">
          <a href="/doctor/orders/lab/new"><MaterialIcon name="biotech" /> + New Lab Order / طلب فحص مخبري جديد</a>
          <a href="/doctor/orders/imaging/new"><MaterialIcon name="radiology" /> + New Imaging Order / طلب أشعة جديد</a>
        </div>
      </header>

      <section className="doctor-orders__metrics" aria-label="clinical order metrics">
        <OrderMetric label="Active Orders / الطلبات النشطة" value="28" detail="Synced across tenant care lanes" icon="assignment_turned_in" tone="primary" />
        <OrderMetric label="Pending Processing / قيد التنفيذ" value="09" detail="Awaiting specimen or scan slot" icon="pending_actions" tone="tertiary" />
        <OrderMetric label="Urgent Priority / ذات أولوية عاجلة" value="03" detail="STAT escalation assigned" icon="bolt" tone="error" />
        <OrderMetric label="Completed Today / المكتملة اليوم" value="16" detail="Results signed & cataloged" icon="verified" tone="primary" />
      </section>

      <section className="doctor-orders__filters doctor-patient-card">
        <div className="doctor-orders__type-filters" aria-label="order type filters">
          {orderTypes.map((filter) => <button type="button" className={typeFilter === filter.value ? 'is-active' : ''} key={filter.value} onClick={() => setTypeFilter(filter.value)}>{filter.label}</button>)}
        </div>
        <div className="doctor-orders__filter-grid">
          <label><MaterialIcon name="search" /><input aria-label="Search orders" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by Patient Name or Order ID / البحث بالاسم أو رقم الطلب" /></label>
          <select aria-label="Filter orders by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as DoctorOrderStatus | 'all')}>{statuses.map((status) => <option value={status.value} key={status.value}>{status.label}</option>)}</select>
          <select aria-label="Filter orders by date range" defaultValue="last-30"><option value="last-30">Date Range / الفترة الزمنية: Last 30 Days</option><option value="today">Today / اليوم</option><option value="week">Current Week / هذا الأسبوع</option></select>
        </div>
        <div className="doctor-orders__scope"><MaterialIcon name="lock_clock" /> Doctor Scope Verification Active</div>
      </section>

      {notice && <p className="doctor-orders__notice" role="status">{notice}</p>}

      <section className="doctor-patient-card doctor-orders__registry">
        <div className="doctor-orders__registry-meta"><span>Clinical Order Registry • {visibleOrders.length} synthetic records</span><span>Local demonstration data only</span></div>
        <div className="doctor-orders__table-wrap">
          <table>
            <thead><tr><th>Order ID / المعرّف</th><th>Order Type / النوع</th><th>Patient / المريض</th><th>Requested Details / الفحص المطلوب</th><th>Priority / الأولوية</th><th>Order Date / التاريخ</th><th>Ordering Doctor / الطبيب</th><th>Status / الحالة</th><th>Actions / إجراءات</th></tr></thead>
            <tbody>
              {visibleOrders.map((order) => <tr className={selectedOrderId === order.id ? 'is-selected' : ''} key={order.id} onClick={() => setSelectedOrderId(order.id)}>
                <td className="doctor-orders__id">{order.id}</td>
                <td><span className={`doctor-orders__type doctor-orders__type--${order.type}`}><MaterialIcon name={order.type === 'lab' ? 'biotech' : 'radiology'} /> {order.typeLabel}</span></td>
                <td><strong>{order.patientName}</strong><small>{order.patientId}</small></td>
                <td><strong>{order.title}</strong><small>{order.detail}</small></td>
                <td><span className={`doctor-orders__priority doctor-orders__priority--${order.priority}`}>{order.priorityLabel}</span></td>
                <td className="doctor-orders__date">{order.date}<small>{order.time}</small></td>
                <td>{order.orderingDoctor}</td>
                <td><span className={`doctor-orders__status doctor-orders__status--${order.status}`}>{order.statusLabel}</span></td>
                <td><div className="doctor-orders__row-actions"><button type="button" onClick={(event) => { event.stopPropagation(); setSelectedOrderId(order.id); setNotice(`Viewing ${order.id} is demo-only; no clinical order was opened or changed.`); }}>View Details</button><button type="button" onClick={(event) => { event.stopPropagation(); setNotice(`Editing ${order.id} is demo-only; no clinical order was changed.`); }}>Edit</button></div></td>
              </tr>)}
            </tbody>
          </table>
        </div>
        {visibleOrders.length === 0 && <div className="doctor-orders__empty"><MaterialIcon name="search_off" /><strong>No matching clinical orders</strong><span>Try another search or filter.</span></div>}
        <footer>Showing {visibleOrders.length} of {doctorOrders.length} synthetic order records</footer>
      </section>
    </div>
  );
}

function OrderMetric({ label, value, detail, icon, tone }: { label: string; value: string; detail: string; icon: string; tone: 'primary' | 'tertiary' | 'error' }) {
  return <article className={`doctor-orders__metric doctor-orders__metric--${tone}`}><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div><MaterialIcon name={icon} /></article>;
}
