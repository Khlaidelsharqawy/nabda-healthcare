import { useMemo, useState } from 'react';
import { MaterialIcon, PageHeader, Button, Badge, Panel, PanelHeader, StatCard, Input, Textarea, TableWrapper, Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/ui';
import { patientVitalsFixture as data, type PatientVitalCategory } from './fixtures';
import { useTheme } from '../../theme/ThemeProvider';
import { patientMessages } from '../../i18n/messages';

export function PatientVitalsPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? patientMessages.ar.vitals : patientMessages.en.vitals;

  const [category, setCategory] = useState<PatientVitalCategory>('blood-pressure');
  const [historyFilter, setHistoryFilter] = useState<'all' | PatientVitalCategory>('all');
  const [notice, setNotice] = useState('');
  const visibleHistory = useMemo(() => data.history.filter((entry) => historyFilter === 'all' || entry.category === historyFilter), [historyFilter]);
  const showNotice = (message: string) => setNotice(isRtl ? `تجربة فقط: ${message} لم يتم تعديل الخادم.` : `Demo only: ${message} No server update was made.`);

  return (
    <div className="patient-page patient-vitals" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Scope Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--surface-subtle)',
          border: '1px solid var(--border-default)',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MaterialIcon name="verified_user" style={{ color: 'var(--brand-primary)', fontSize: '1.5rem' }} />
          <div>
            <strong style={{ fontSize: '0.9375rem', display: 'block' }}>{copy.scopeBannerTitle}</strong>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{copy.scopeBannerBody}</p>
          </div>
        </div>
        <Badge variant="neutral">{copy.nonDiagnostic}</Badge>
      </div>

      <PageHeader
        kicker={`${copy.portalCrumb} • ${copy.healthRecordsCrumb} • ${copy.vitalsCrumb}`}
        title={copy.heading}
        subtitle={copy.description}
        actions={
          <>
            <Button
              variant="outline"
              size="md"
              icon="calendar_today"
              onClick={() => showNotice(isRtl ? 'تم عرض محدد التاريخ محلياً.' : 'the local date filter was displayed.')}
            >
              {copy.last30Days}
            </Button>
            <Button
              variant="outline"
              size="md"
              icon="download"
              onClick={() => showNotice(isRtl ? 'التصدير غير متصل في هذا العرض التجريبي.' : 'export is not connected in this frontend demo.')}
            >
              {copy.exportLocally}
            </Button>
            <Button
              variant="primary"
              size="md"
              icon="add_circle"
              onClick={() => document.getElementById('log-telemetry-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {copy.logMeasurement}
            </Button>
          </>
        }
      />

      {/* Metrics Overview */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {data.overview.map((metric) => (
          <div
            key={metric.id}
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-xs)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {isRtl && metric.labelAr ? metric.labelAr : metric.label}
              </span>
              <MaterialIcon name={metric.icon} style={{ color: 'var(--brand-primary)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
              <strong style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
                {metric.value}
              </strong>
              <small style={{ color: 'var(--text-tertiary)' }}>{metric.unit}</small>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.35rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem' }}>
              <Badge variant="brand">{metric.status}</Badge>
              <small style={{ color: 'var(--text-tertiary)' }}>{metric.recordedAt}</small>
            </div>
          </div>
        ))}
      </section>

      {/* Trend Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>
        <Panel variant="elevated">
          <PanelHeader
            title={copy.trendHeading}
            subtitle={copy.trendSubtitle}
            icon="show_chart"
            actions={<Badge variant="neutral">{copy.localLogs}</Badge>}
          />
          <div style={{ marginTop: '1rem' }}>
            <svg aria-label={copy.chartAria} viewBox="0 0 700 160" role="img" style={{ width: '100%', height: 'auto' }}>
              <line x1="0" x2="700" y1="45" y2="45" stroke="var(--border-subtle)" strokeDasharray="4 4" />
              <line x1="0" x2="700" y1="100" y2="100" stroke="var(--border-subtle)" strokeDasharray="2 3" />
              <path d="M30 72 L130 64 L230 66 L330 56 L430 60 L530 54 L650 49" fill="none" stroke="var(--brand-primary)" strokeWidth="3" strokeLinecap="round" />
              <path d="M30 120 L130 114 L230 117 L330 107 L430 112 L530 108 L650 102" fill="none" stroke="var(--color-warning-text)" strokeWidth="2.5" strokeLinecap="round" />
              {[30, 130, 230, 330, 430, 530, 650].map((x, index) => (
                <circle key={x} cx={x} cy={[72, 64, 66, 56, 60, 54, 49][index]} r="4" fill="var(--brand-primary)" />
              ))}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
              <span>[Date]</span>
              <span>[Date]</span>
              <span>[Date]</span>
              <span>[Date]</span>
              <span>[Date]</span>
              <strong style={{ color: 'var(--brand-primary)' }}>[Latest Date]</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: '0.75rem' }}>
              <MaterialIcon name="info" /> {copy.chartNote}
            </div>
          </div>
        </Panel>

        <Panel variant="elevated">
          <PanelHeader
            title={copy.clinicianReviewHeading}
            subtitle={copy.careContext}
            icon="person"
            actions={<Badge variant="neutral">{copy.viewOnly}</Badge>}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.75rem 0' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-primary-light)',
                color: 'var(--brand-primary)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <MaterialIcon name="person" />
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.875rem' }}>{data.clinician}</strong>
              <small style={{ color: 'var(--text-tertiary)' }}>{data.clinicName}</small>
            </div>
          </div>
          <p style={{ margin: '0 0 1rem', fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {copy.careContextDesc}
          </p>
          <a href="/patient/appointments" className="ui-btn ui-btn--outline ui-btn--sm" style={{ justifyContent: 'center' }}>
            <MaterialIcon name="event_available" />
            <span>{copy.viewAppointmentDetails}</span>
          </a>
        </Panel>
      </div>

      {/* Measurement Entry Form */}
      <Panel variant="elevated" id="log-telemetry-form">
        <PanelHeader
          title={copy.logNewHeading}
          subtitle={copy.logFormSubtitle}
          icon="add_circle"
          actions={<Badge variant="brand">{copy.manualInput}</Badge>}
        />

        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', margin: '1rem 0', paddingBottom: '0.25rem' }}>
          {data.categories.map((item) => (
            <Button
              key={item.id}
              variant={category === item.id ? 'primary' : 'outline'}
              size="sm"
              icon={item.icon}
              onClick={() => setCategory(item.id)}
            >
              {isRtl && item.labelAr ? item.labelAr : item.label}
            </Button>
          ))}
        </div>

        <VitalForm
          category={category}
          copy={copy}
          onSubmit={() => showNotice(isRtl ? 'تم تأكيد نموذج القياس محلياً.' : 'the measurement form was acknowledged locally.')}
          onCancel={() => showNotice(isRtl ? 'تم مسح النموذج المحلي.' : 'the local form was cleared.')}
        />
      </Panel>

      {/* History Table */}
      <Panel variant="elevated" padding="none">
        <div style={{ padding: '1.25rem 1.25rem 0' }}>
          <PanelHeader
            title={copy.historyHeading}
            subtitle={copy.historySubtitle}
            icon="history"
            actions={
              <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto' }}>
                {[{ id: 'all', label: copy.allVitals }, ...data.categories.map((item) => ({ id: item.id, label: isRtl && item.shortLabelAr ? item.shortLabelAr : item.shortLabel }))].map((item) => (
                  <Button
                    key={item.id}
                    variant={historyFilter === item.id ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setHistoryFilter(item.id as 'all' | PatientVitalCategory)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            }
          />
        </div>

        <TableWrapper>
          <Table hover>
            <TableHead>
              <TableRow>
                <TableHeaderCell>{copy.dateTime}</TableHeaderCell>
                <TableHeaderCell>{copy.metricReading}</TableHeaderCell>
                <TableHeaderCell>{copy.context}</TableHeaderCell>
                <TableHeaderCell>{copy.source}</TableHeaderCell>
                <TableHeaderCell>{copy.status}</TableHeaderCell>
                <TableHeaderCell textAlign="end">{copy.actions}</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleHistory.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <strong>{entry.date}</strong>
                    <small style={{ display: 'block', color: 'var(--text-tertiary)' }}>{entry.time}</small>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MaterialIcon name={entry.icon} style={{ color: 'var(--brand-primary)' }} />
                      <span><strong>{entry.value}</strong> <small>{entry.unit}</small></span>
                    </div>
                  </TableCell>
                  <TableCell>{entry.context}</TableCell>
                  <TableCell>{entry.source}</TableCell>
                  <TableCell>
                    <Badge variant="neutral" icon="hourglass_empty">
                      {copy.presentationOnly}
                    </Badge>
                  </TableCell>
                  <TableCell textAlign="end">
                    <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="notes"
                        aria-label={`${copy.viewNoteAria} ${entry.id}`}
                        onClick={() => showNotice(isRtl ? 'تم عرض ملاحظة السجل محلياً.' : 'the local entry note was displayed.')}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="edit"
                        aria-label={`${copy.editEntryAria} ${entry.id}`}
                        onClick={() => showNotice(isRtl ? 'تعديل القياس غير متصل في هذا العرض التجريبي.' : 'measurement editing is not connected in this demo.')}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      </Panel>

      {/* Emergency & Guidance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {data.guidance.map((item, index) => (
          <Panel variant="subtle" key={item.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)', color: '#ffffff', display: 'grid', placeItems: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                {index + 1}
              </span>
              <h4 style={{ margin: 0, fontSize: '0.9375rem' }}>
                {isRtl && (item as any).titleAr ? (item as any).titleAr : item.title}
              </h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {isRtl && (item as any).textAr ? (item as any).textAr : item.text}
            </p>
          </Panel>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-subtle)' }}>
        <MaterialIcon name="medical_services" style={{ color: 'var(--brand-primary)' }} />
        <div>
          <strong style={{ display: 'block', fontSize: '0.875rem' }}>{copy.safetyTitle}</strong>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{copy.safetyBody}</p>
        </div>
      </div>

      {notice && (
        <div className="auth-alert auth-alert--success" role="status">
          <MaterialIcon name="info" />
          <span>{notice}</span>
        </div>
      )}
    </div>
  );
}

function VitalForm({
  category,
  copy,
  onSubmit,
  onCancel,
}: {
  category: PatientVitalCategory;
  copy: typeof patientMessages.en.vitals | typeof patientMessages.ar.vitals;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const fields =
    category === 'blood-pressure'
      ? ['[Systolic value]', '[Diastolic value]', '[Pulse value]']
      : category === 'blood-glucose'
        ? ['[Glucose value]', '[Fasting state]']
        : category === 'pulse'
          ? ['[Pulse value]', '[Rhythm note]']
          : ['[Weight value]', '[Context note]'];

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {fields.map((field) => (
          <div key={field}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>{field}</label>
            <Input placeholder={field} aria-label={field} />
          </div>
        ))}
      </div>
      <div>
        <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>{copy.measurementDateTime}</label>
        <Input type="datetime-local" aria-label={copy.measurementDateTime} />
      </div>
      <div>
        <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>{copy.personalNote}</label>
        <Textarea rows={2} placeholder={copy.personalNotePlaceholder} aria-label={copy.personalNote} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <Button variant="outline" size="md" onClick={onCancel}>
          {copy.clearLocalForm}
        </Button>
        <Button variant="primary" size="md" icon="save" type="submit">
          {copy.acknowledgeLocally}
        </Button>
      </div>
    </form>
  );
}
