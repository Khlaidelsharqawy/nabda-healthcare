import { useMemo, useState } from 'react';
import { MaterialIcon, PageHeader, Button, Badge, Panel, PanelHeader, StatCard, Input } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { assistantMessages } from '../../i18n/messages';

const conversationSeeds = [
  {
    id: 'MSG-101',
    name: 'Hassan Omar',
    nameAr: 'حسن عمر',
    phone: '[Demo Contact #01]',
    time: '10:42 AM',
    timeAr: '10:42 ص',
    status: 'confirmation',
    preview: 'أود تأكيد موعد الغد مع الدكتور طارق، هل الموعد في الساعة الخامسة؟',
    previewEn: 'I want to confirm my appointment tomorrow with Dr. Tarek. Is it at 5:00 PM?',
    category: 'Confirmation',
    categoryAr: 'تأكيد موعد',
    context: 'Tomorrow 5:00 PM',
    contextAr: 'غداً 05:00 مساءً',
    initials: 'ح ع',
    tint: 'primary',
  },
  {
    id: 'MSG-102',
    name: 'Rania El-Badry',
    nameAr: 'رانيا البدري',
    phone: '[Demo Contact #02]',
    time: '10:35 AM',
    timeAr: '10:35 ص',
    status: 'reschedule',
    preview: 'صباح الخير، لدي موعد اليوم ولكن طرأ ظرف طارئ، هل يمكن تعديل الموعد ليوم الخميس القادم؟',
    previewEn: 'Good morning, I have a reservation today but an emergency came up. Can I reschedule for next Thursday?',
    category: 'Reschedule',
    categoryAr: 'إعادة جدولة',
    context: 'Today 11:30 AM',
    contextAr: 'اليوم 11:30 صباحاً',
    initials: 'ر ب',
    tint: 'tertiary',
  },
  {
    id: 'MSG-103',
    name: 'Karim Mahmoud',
    nameAr: 'كريم محمود',
    phone: '[Demo Contact #03]',
    time: '09:58 AM',
    timeAr: '09:58 ص',
    status: 'general',
    preview: 'السلام عليكم، كم تبلغ رسوم الاستشارة وهل الدفع متاح بالبطاقة أم نقداً فقط؟',
    previewEn: 'Could you please tell me the consultation fee, and can I pay by card or cash only?',
    category: 'Payment • Digital',
    categoryAr: 'الدفع • إلكتروني',
    context: 'General Inquiry',
    contextAr: 'استفسار عام',
    initials: 'ك م',
    tint: 'secondary',
  },
  {
    id: 'MSG-104',
    name: 'Nourhan Abdel-Aziz',
    nameAr: 'نورهان عبد العزيز',
    phone: '[Demo Contact #04]',
    time: 'Yesterday',
    timeAr: 'أمس',
    status: 'schedule',
    preview: 'هل دكتورة منى موجودة يوم الأحد؟',
    previewEn: 'Is Dr. Mona available on Sunday?',
    category: 'Schedule Roster',
    categoryAr: 'جدول المواعيد',
    context: 'Dr. Mona (Pediatrics)',
    contextAr: 'د. منى (أطفال)',
    initials: 'ن ع',
    tint: 'neutral',
  },
];

const filters = ['All', 'Unresolved', 'Reschedule', 'General', 'Completed'] as const;
type Filter = (typeof filters)[number];

export function AssistantCommunicationsPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = assistantMessages[isRtl ? 'ar' : 'en'].communications;

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [activeConversationId, setActiveConversationId] = useState('MSG-101');
  const [notice, setNotice] = useState('');

  const filterLabels: Record<Filter, string> = {
    All: copy.filterAll,
    Unresolved: copy.filterUnresolved,
    Reschedule: copy.filterReschedule,
    General: copy.filterGeneral,
    Completed: copy.filterCompleted,
  };

  const filteredConversations = useMemo(() => {
    return conversationSeeds.filter((conversation) => {
      const matchesQuery = `${conversation.name} ${conversation.phone} ${conversation.preview}`
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      const matchesFilter =
        activeFilter === 'All' ||
        (activeFilter === 'Unresolved' && conversation.status === 'confirmation') ||
        (activeFilter === 'Reschedule' && conversation.status === 'reschedule') ||
        (activeFilter === 'General' && conversation.status === 'general') ||
        (activeFilter === 'Completed' && conversation.status === 'schedule');
      return matchesQuery && matchesFilter;
    });
  }, [activeFilter, query]);

  const activeConversation =
    filteredConversations.find((conversation) => conversation.id === activeConversationId) ?? filteredConversations[0] ?? conversationSeeds[0];

  const aiDraft = isRtl
    ? 'أهلاً بك! نؤكد موعدك مع الدكتور طارق منصور غداً الساعة 05:00 مساءً في مستشفى النور التخصصي (العيادة رقم 1). يرجى الحضور قبل الموعد بـ 15 دقيقة لقياس العلامات الحيوية.'
    : 'Hello Mr. Hassan! We confirm your appointment with Dr. Tarek Mansour tomorrow at 05:00 PM at Al-Nour Medical Center (Clinic Suite #1). Please arrive 15 minutes early for vital sign triage.';

  return (
    <div className="assistant-page assistant-communications" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.65rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--surface-subtle)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Badge variant="brand" icon="chat_bubble">{copy.scopeHub}</Badge>
          <span>•</span>
          <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <MaterialIcon name="support_agent" /> {copy.scopeLogistics}
          </span>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-success-text)' }}>
          <MaterialIcon name="verified" /> {copy.scopeFirewall}
        </span>
      </div>

      <PageHeader
        kicker={`${copy.kicker} • ${copy.kickerSub}`}
        title={copy.title}
        subtitle={copy.subtitle}
      />

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <StatCard
          label={copy.inquiries}
          value="28"
          icon="question_answer"
          variant="accent"
        />
        <StatCard
          label={copy.unresolved}
          value="3"
          icon="mark_chat_unread"
          variant="warning"
        />
        <StatCard
          label={copy.responses}
          value="12"
          icon="quickreply"
          variant="success"
        />
      </section>

      {/* 3-Column Workspace */}
      <div className="assistant-comms-workspace-grid">
        {/* Left Column: Inbox List */}
        <Panel variant="elevated" padding="none">
          <div style={{ padding: '1rem 1rem 0' }}>
            <PanelHeader
              title={copy.queueHeading}
              tag={<Badge variant="brand">28</Badge>}
              actions={
                <Button
                  variant="ghost"
                  size="sm"
                  icon="sync"
                  aria-label={copy.refreshFeedAria}
                  onClick={() => setNotice('Demo only: communications feed refreshed locally.')}
                />
              }
            />
          </div>

          <div style={{ padding: '0 1rem 0.75rem' }}>
            <Input
              iconStart="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={copy.searchPlaceholder}
              inputSize="sm"
            />
            <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', marginTop: '0.5rem', paddingBottom: '0.25rem' }}>
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    backgroundColor: activeFilter === filter ? 'var(--brand-primary)' : 'var(--surface-subtle)',
                    color: activeFilter === filter ? '#ffffff' : 'var(--text-muted)',
                  }}
                >
                  {filterLabels[filter]}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '550px', overflowY: 'auto' }}>
            {filteredConversations.map((c, idx) => {
              const isSelected = activeConversation.id === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveConversationId(c.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    padding: '0.85rem 1rem',
                    border: 'none',
                    borderTop: idx > 0 ? '1px solid var(--border-subtle)' : 'none',
                    backgroundColor: isSelected ? 'var(--brand-primary-light)' : 'transparent',
                    textAlign: 'start',
                    cursor: 'pointer',
                    borderInlineStart: isSelected ? '3px solid var(--brand-primary)' : '3px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.875rem', color: isSelected ? 'var(--brand-primary)' : 'var(--text-main)' }}>
                      {isRtl ? (c.nameAr ?? c.name) : c.name}
                    </strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                      {isRtl ? (c.timeAr ?? c.time) : c.time}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {isRtl ? c.preview : c.previewEn}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                    <Badge variant={c.status === 'reschedule' ? 'warning' : c.status === 'confirmation' ? 'brand' : 'neutral'}>
                      {isRtl ? (c.categoryAr ?? c.category) : c.category}
                    </Badge>
                    <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem' }}>
                      {isRtl ? (c.contextAr ?? c.context) : c.context}
                    </small>
                  </div>
                </button>
              );
            })}
          </div>
        </Panel>

        {/* Center Column: Active Chat & AI Assist */}
        <Panel variant="elevated" padding="none">
          <div
            style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-primary-light)',
                  color: 'var(--brand-primary)',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                }}
              >
                {isRtl ? (activeConversation.initials ?? 'ح') : (activeConversation.name[0] ?? 'H')}
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9375rem' }}>
                  {isRtl ? (activeConversation.nameAr ?? activeConversation.name) : activeConversation.name}
                </strong>
                <small style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                  {activeConversation.phone} • {isRtl ? (activeConversation.contextAr ?? activeConversation.context) : activeConversation.context}
                </small>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <Button
                variant="ghost"
                size="sm"
                icon="phone"
                aria-label={copy.callPatientAria}
                onClick={() => setNotice('Demo only: phone workflow not connected.')}
              />
              <Button
                variant="ghost"
                size="sm"
                icon="account_box"
                aria-label={copy.viewAccountAria}
                onClick={() => setNotice('Demo only: patient account view is local-only.')}
              />
            </div>
          </div>

          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '280px', backgroundColor: 'var(--surface-subtle)' }}>
            <div style={{ textAlign: 'center' }}>
              <Badge variant="neutral" icon="lock">{copy.encryptedBadge}</Badge>
            </div>

            <div style={{ alignSelf: 'flex-start', maxWidth: '75%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                {isRtl ? 'السلام عليكم، أنا حجزت كشف قلب مع دكتور طارق بكره' : 'Hello, I booked a cardiology consultation with Dr. Tarek tomorrow.'}
              </p>
              <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem', marginTop: '0.35rem', display: 'block' }}>
                {isRtl ? (activeConversation.nameAr ?? activeConversation.name) : activeConversation.name} • {isRtl ? 'أمس 04:15 م' : 'Yesterday 04:15 PM'}
              </small>
            </div>

            <div style={{ alignSelf: 'flex-end', maxWidth: '75%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--brand-primary-light)', border: '1px solid rgba(8, 116, 67, 0.2)' }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--brand-primary)' }}>
                {isRtl ? 'أهلاً بحضرتك في مستشفى النور التخصصي. تم تسجيل موعدك ليوم الجمعة الساعة 5:00 مساءً مع د. طارق منصور.' : 'Welcome to Al-Nour Medical Center. Your booking is recorded for Friday at 05:00 PM with Dr. Tarek Mansour.'}
              </p>
              <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem', marginTop: '0.35rem', display: 'block', textAlign: 'end' }}>
                <MaterialIcon name="done_all" /> {copy.botAutomation}
              </small>
            </div>

            <div style={{ alignSelf: 'flex-start', maxWidth: '75%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                {isRtl ? 'عايز أأكد ميعاد بكرة مع الدكتور طارق، هل الميعاد الساعة 5 ولا اتغير؟' : 'I want to confirm my appointment tomorrow with Dr. Tarek. Is it at 5 or changed?'}
              </p>
              <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem', marginTop: '0.35rem', display: 'block' }}>
                {isRtl ? (activeConversation.nameAr ?? activeConversation.name) : activeConversation.name} • {isRtl ? 'اليوم 10:42 ص' : 'Today 10:42 AM'}
              </small>
            </div>
          </div>

          {/* AI Draft Response Box */}
          <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--surface-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MaterialIcon name="psychology" style={{ color: 'var(--brand-primary)' }} />
                <strong style={{ fontSize: '0.875rem' }}>{copy.aiResponseSuggestion}</strong>
                <Badge variant="brand">{copy.confidence}</Badge>
              </div>
              <small style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>{copy.frontDeskScope}</small>
            </div>

            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <strong>{copy.detectedIntentLabel}:</strong> {copy.detectedIntentDesc}
            </p>

            <div
              style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-subtle)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.875rem',
                lineHeight: 1.5,
                color: 'var(--text-main)',
                marginBottom: '1rem',
              }}
            >
              {aiDraft}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Button
                variant="primary"
                size="sm"
                icon="send"
                onClick={() => setNotice('Demo only: outbound message was not sent.')}
              >
                {copy.sendDraft}
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon="edit"
                onClick={() => setNotice('Demo only: draft editing is local-only.')}
              >
                {copy.edit}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon="check_circle"
                onClick={() => setNotice('Demo only: conversation marked resolved.')}
              >
                {copy.markResolved}
              </Button>
            </div>
          </div>
        </Panel>

        {/* Right Column: Meta & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Panel variant="elevated">
            <PanelHeader
              title={copy.conversationStatusHeading}
              tag={<Badge variant="brand">{copy.opsSummaryBadge}</Badge>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.5rem' }}>
              <div>
                <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem', textTransform: 'uppercase' }}>{copy.routeLabel}</small>
                <strong style={{ display: 'block', fontSize: '0.875rem' }}>{copy.routeValue}</strong>
              </div>
              <div>
                <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem', textTransform: 'uppercase' }}>{copy.clinicLabel}</small>
                <strong style={{ display: 'block', fontSize: '0.875rem' }}>{copy.clinicValue}</strong>
              </div>
              <div>
                <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem', textTransform: 'uppercase' }}>{copy.assignedLabel}</small>
                <strong style={{ display: 'block', fontSize: '0.875rem' }}>{copy.assignedValue}</strong>
              </div>
              <div>
                <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem', textTransform: 'uppercase' }}>{copy.responseModeLabel}</small>
                <strong style={{ display: 'block', fontSize: '0.875rem' }}>{copy.responseModeValue}</strong>
              </div>
            </div>
          </Panel>

          <Panel variant="elevated">
            <PanelHeader
              title={copy.fastActionsHeading}
              tag={<Badge variant="neutral">{copy.templateBadge}</Badge>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Button variant="outline" size="sm" fullWidth icon="event" disabled title={copy.confirmVisitTitle}>
                {copy.confirmVisit}
              </Button>
              <Button variant="outline" size="sm" fullWidth icon="update" disabled title={copy.offerRescheduleTitle}>
                {copy.offerReschedule}
              </Button>
              <Button variant="outline" size="sm" fullWidth icon="payments" disabled title={copy.paymentDetailsTitle}>
                {copy.paymentDetails}
              </Button>
            </div>
          </Panel>
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
