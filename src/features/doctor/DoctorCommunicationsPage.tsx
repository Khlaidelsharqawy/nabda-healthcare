import { useMemo, useState } from 'react';
import { MaterialIcon, PageHeader, StatCard, Panel, PanelHeader, PanelBody, Badge, Button, Input, Textarea, EmptyState } from '../../components/ui';
import { doctorCommunicationThread, doctorCommunications, type CommunicationPriority, type CommunicationStatus } from './fixtures';
import { useTheme } from '../../theme/ThemeProvider';
import { doctorMessages } from '../../i18n/messages';

type Filter = 'all' | CommunicationPriority | CommunicationStatus;

export function DoctorCommunicationsPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = doctorMessages[isRtl ? 'ar' : 'en'].communications;

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState(doctorCommunications[0].id);
  const [response, setResponse] = useState('');
  const [notice, setNotice] = useState('');

  const selected = doctorCommunications.find((item) => item.id === selectedId) ?? doctorCommunications[0];
  const thread = {
    ...doctorCommunicationThread,
    patientLabel: selected.patientLabel,
    patientId: selected.patientId,
    encounterId: selected.encounterId,
    inquiry: selected.preview,
  };

  const visible = useMemo(
    () =>
      doctorCommunications.filter((item) => {
        const matchesQuery = `${item.patientLabel} ${item.patientId} ${item.subject} ${item.preview}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesFilter = filter === 'all' || item.priority === filter || item.status === filter;
        return matchesQuery && matchesFilter;
      }),
    [filter, query]
  );

  const showDemo = (message: string) =>
    setNotice(
      isRtl
        ? `تجريبي للعرض فقط - ${message} لم يتم إرسال أو حفظ أي رسالة.`
        : `Demo only - ${message} No message was delivered or persisted.`
    );

  const getPriorityVariant = (priority: CommunicationPriority): 'error' | 'warning' | 'neutral' => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'routine':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="aegis-page doctor-communications-page" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Secure Gateway Banner */}
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
          <span>{copy.gatewayTitle}</span>
          <span>•</span>
          <span>{copy.zeroOutbound}</span>
        </span>
        <Badge variant="brand" size="sm">
          <MaterialIcon name="local_hospital" style={{ fontSize: '0.875rem' }} />
          {copy.tenantName}
        </Badge>
      </div>

      <PageHeader
        kicker={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>{copy.crumbPortal}</span>
            <span>/</span>
            <span>{copy.crumbComms}</span>
            <span>/</span>
            <strong>{copy.crumbInbox}</strong>
          </div>
        }
        title={copy.heading}
        subtitle={copy.desc}
      />

      {/* Telemetry Row */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        <StatCard label={copy.unreadInquiries} value="03" delta={<span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{isRtl ? 'طابور الفرز المحلي' : 'Local triage queue'}</span>} icon="mark_email_unread" />
        <StatCard label={copy.pendingFollowUp} value="05" delta={<span style={{ fontSize: '0.75rem', color: 'var(--color-warning-text)' }}>{isRtl ? 'بانتظار المراجعة' : 'Awaiting review'}</span>} icon="pending_actions" />
        <StatCard label={copy.resolvedToday} value="11" delta={<span style={{ fontSize: '0.75rem', color: 'var(--color-success-text)' }}>{isRtl ? 'حالات تجريبية' : 'Demo statuses'}</span>} icon="task_alt" />
        <StatCard label={copy.triageTurnaround} value={isRtl ? '1.8 ساعة' : '1.8 hrs'} delta={<span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{isRtl ? 'مؤشر تجريبي' : 'Synthetic metric'}</span>} icon="timer" />
      </section>

      {/* Filter and Search Bar */}
      <Panel variant="elevated">
        <PanelBody style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: '1 1 240px' }}>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={copy.searchPlaceholder}
              prefixIcon="search"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            <Button variant={filter === 'all' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('all')}>
              {copy.allInquiries}
            </Button>
            <Button variant={filter === 'urgent' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('urgent')}>
              {copy.urgentClinical}
            </Button>
            <Button variant={filter === 'routine' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('routine')}>
              {copy.postConsultation}
            </Button>
            <Button variant={filter === 'standard' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('standard')}>
              {copy.rxClarification}
            </Button>
            <Button variant={filter === 'resolved' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('resolved')}>
              {copy.resolved}
            </Button>
          </div>
        </PanelBody>
      </Panel>

      {/* Communications Workspace: Queue + Thread */}
      <div className="doctor-comms-grid">
        {/* Inquiries Queue */}
        <Panel variant="elevated">
          <PanelHeader
            title={
              <strong style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
                {copy.activeQueue} ({visible.length} {isRtl ? 'معروض' : 'visible'})
              </strong>
            }
            actions={<Badge variant="neutral" size="sm">{copy.sortedPriority}</Badge>}
          />
          <PanelBody style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
            {visible.map((item) => {
              const isSelected = selected.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(item.id);
                    setNotice(isRtl ? 'تم اختيار الاستفسار محلياً.' : 'Local inquiry selected.');
                  }}
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
                    <Badge variant={getPriorityVariant(item.priority)} size="sm">
                      {item.priority}
                    </Badge>
                    <small style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{item.timestamp}</small>
                  </div>
                  <strong style={{ fontSize: '0.9375rem', color: 'var(--text-main)' }}>{item.patientLabel}</strong>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--brand-primary)' }}>
                    {item.subject}
                  </span>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.preview}
                  </p>
                  <footer style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-tertiary)', paddingTop: '0.35rem' }}>
                    <span>{item.channel}</span>
                    <Badge variant={item.status === 'resolved' ? 'success' : 'warning'} size="sm">
                      {item.status}
                    </Badge>
                  </footer>
                </button>
              );
            })}

            {visible.length === 0 && (
              <EmptyState icon="mark_email_read" title={copy.noMatching} description="Try another filter or search term." />
            )}
          </PanelBody>
        </Panel>

        {/* Selected Thread Dialogue */}
        {selected && (
          <Panel variant="elevated">
            <PanelHeader
              title={
                <div>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.15rem 0' }}>
                    {selected.subject}
                  </h2>
                  <small style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    {selected.patientLabel} • {selected.patientId} • Encounter {selected.encounterId}
                  </small>
                </div>
              }
              actions={<Badge variant={getPriorityVariant(selected.priority)} size="md">{selected.priority.toUpperCase()}</Badge>}
            />
            <PanelBody style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Patient Message Bubble */}
              <div
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--surface-subtle)',
                  borderInlineStart: '3px solid var(--text-tertiary)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.35rem' }}>
                  <strong>{selected.patientLabel} ({selected.channel})</strong>
                  <span>{selected.timestamp}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                  {selected.preview}
                </p>
              </div>

              {/* Physician Reply Composer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Physician Response
                </label>
                <Textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder={isRtl ? 'اكتب ردك السريري الموجه للمريض...' : 'Compose clinical advice or follow-up instruction...'}
                  rows={4}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    icon="auto_fix_high"
                    onClick={() => {
                      setResponse(
                        isRtl
                          ? 'مرحباً، بناءً على مؤشراتك الأخيرة، يرجى الاستمرار على نفس الجرعة ومراجعة العيادة في حال استمرار الأعراض.'
                          : 'Hello, your reported symptoms are consistent with mild adjustment. Please maintain the current regimen and monitor for 48 hours.'
                      );
                    }}
                  >
                    Insert Clinical Template
                  </Button>
                  <Button
                    variant="primary"
                    icon="send"
                    onClick={() => {
                      showDemo('تم إرسال الرد السريري للمريض.');
                      setResponse('');
                    }}
                  >
                    Send Response
                  </Button>
                </div>
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
