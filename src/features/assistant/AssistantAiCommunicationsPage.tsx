import { useState } from 'react';
import { MaterialIcon, PageHeader, Button, Badge, Panel, PanelHeader, Select, TableWrapper, Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { assistantMessages } from '../../i18n/messages';
import { assistantCommunicationDrafts, assistantCommunicationIntents } from './fixtures';

const tones = ['Polite & professional', 'Warm & concise', 'Formal notice'] as const;
type Tone = (typeof tones)[number];

export function AssistantAiCommunicationsPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = assistantMessages[isRtl ? 'ar' : 'en'].aiCommunications;

  const initialDraft = isRtl
    ? '[مسودة نص الرسالة: عزيزي [اسم المريض]، نود تذكيركم بموعد استشارتكم لدى [اسم الطبيب] في [اسم المركز] بتاريخ [تاريخ الموعد] الساعة [وقت الموعد]. يُرجى الحضور قبل الموعد بـ 15 دقيقة لإتمام تسجيل البيانات وإحضار [المستند المطلوب]. مع تمنياتنا لكم بدوام الصحة والعافية.]'
    : '[Draft Message Body: Dear [Patient Name], this is a reminder for your upcoming consultation with [Doctor Name] at [Clinic Name] on [Appointment Date] at [Appointment Time]. Please arrive 15 minutes prior to your appointment to complete reception check-in and bring [Required Document]. Wishing you good health and well-being.]';

  const [selectedIntent, setSelectedIntent] = useState(assistantCommunicationIntents[0].id);
  const [tone, setTone] = useState<Tone>(tones[0]);
  const [draft, setDraft] = useState(initialDraft);
  const [arabicFocus, setArabicFocus] = useState(isRtl);
  const [scopeVerified, setScopeVerified] = useState(true);
  const [boundaryVerified, setBoundaryVerified] = useState(true);
  const [operatorVerified, setOperatorVerified] = useState(true);
  const [notice, setNotice] = useState('');

  const selectedIntentDetails = assistantCommunicationIntents.find((intent) => intent.id === selectedIntent) ?? assistantCommunicationIntents[0];
  const characterCount = draft.length;
  const checklistComplete = scopeVerified && boundaryVerified && operatorVerified;

  const toneOptions = [
    { value: 'Polite & professional', label: copy.tonePolite },
    { value: 'Warm & concise', label: copy.toneWarm },
    { value: 'Formal notice', label: copy.toneFormal },
  ];

  const regenerateDraft = () => {
    const toneLabel = toneOptions.find((t) => t.value === tone)?.label ?? tone;
    const intentTitle = isRtl ? selectedIntentDetails.titleAr : selectedIntentDetails.title;
    setDraft(isRtl
      ? `${initialDraft}\n\nالنبرة المختارة: ${toneLabel}. الغرض: ${intentTitle}.`
      : `${initialDraft}\n\nTone selected: ${toneLabel}. Intent: ${intentTitle}.`
    );
    setNotice(copy.noticeRegenerated);
  };

  const stageDraft = () => {
    setNotice(checklistComplete ? copy.noticeStaged : copy.noticeSafetyIncomplete);
  };

  const checklistItems = [
    [scopeVerified, setScopeVerified, copy.checkRecipientTitle, copy.checkRecipientDetail],
    [boundaryVerified, setBoundaryVerified, copy.checkBoundaryTitle, copy.checkBoundaryDetail],
    [operatorVerified, setOperatorVerified, copy.checkOperatorTitle, copy.checkOperatorDetail],
  ] as const;

  const getReviewStatusLabel = (status: 'Pending review' | 'Staged locally' | 'Draft') => {
    if (status === 'Pending review') return copy.statusPendingReview;
    if (status === 'Staged locally') return copy.statusStagedLocally;
    return copy.statusDraft;
  };

  return (
    <div className="assistant-page assistant-ai-communications" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title={copy.title}
        subtitle={copy.subtitle}
        actions={
          <Badge variant="error" dot>
            {copy.dispatchBlocked} • {copy.gatewayEnforced}
          </Badge>
        }
      />

      {/* Safety Guardrail */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--surface-subtle)',
          border: '1px solid var(--border-default)',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MaterialIcon name="verified_user" style={{ color: 'var(--brand-primary)', fontSize: '1.75rem' }} />
          <div>
            <strong style={{ fontSize: '0.9375rem', display: 'block' }}>{copy.guardrailTitle}</strong>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{copy.guardrailDesc}</span>
          </div>
        </div>
        <Badge variant="success" icon="verified">{copy.zeroDispatches}</Badge>
      </div>

      {/* Workbench Layout */}
      <div className="aegis-layout-two-col-reverse">
        {/* Left Aside: Configuration */}
        <Panel variant="elevated">
          <PanelHeader
            title={copy.configHeading}
            icon="tune"
            tag={<Badge variant="neutral">{copy.stageContext}</Badge>}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-subtle)' }}>
              <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem', textTransform: 'uppercase' }}>{copy.targetPatientRecord}</small>
              <strong style={{ display: 'block', fontSize: '0.875rem', marginTop: '0.15rem' }}>{copy.patientPlaceholder}</strong>
              <small style={{ color: 'var(--brand-primary)', fontSize: '0.75rem' }}><MaterialIcon name="badge" /> {copy.validatedSynthetic}</small>
            </div>

            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-subtle)' }}>
              <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem', textTransform: 'uppercase' }}>{copy.linkedEncounter}</small>
              <strong style={{ display: 'block', fontSize: '0.875rem', marginTop: '0.15rem' }}>{copy.appointmentIdPlaceholder}</strong>
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>{copy.doctorPlaceholder}</small>
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>{copy.intentLegend}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {assistantCommunicationIntents.map((intent) => {
                  const isSelected = selectedIntent === intent.id;
                  return (
                    <button
                      key={intent.id}
                      type="button"
                      onClick={() => setSelectedIntent(intent.id)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                        backgroundColor: isSelected ? 'var(--brand-primary-light)' : 'var(--surface-subtle)',
                        textAlign: 'start',
                        cursor: 'pointer',
                      }}
                    >
                      <strong style={{ display: 'block', fontSize: '0.8125rem', color: isSelected ? 'var(--brand-primary)' : 'var(--text-main)' }}>
                        {isRtl ? intent.titleAr : intent.title}
                      </strong>
                      <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem' }}>
                        {isRtl ? intent.detailAr : intent.detail}
                      </small>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>{copy.toneLabel}</label>
              <Select
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
                options={toneOptions}
              />
            </div>

            <Button
              variant="outline"
              size="md"
              icon="auto_read_pause"
              fullWidth
              onClick={regenerateDraft}
            >
              {copy.regenerateDraft}
            </Button>
          </div>
        </Panel>

        {/* Right Main: Canvas & Safety Checklist */}
        <Panel variant="elevated">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Badge variant="brand">{copy.dispatchPreview}</Badge>
                <small style={{ color: 'var(--text-tertiary)' }}>{copy.stagedDraftVersion}</small>
              </div>
              <h3 style={{ margin: '0.35rem 0 0', fontSize: '1rem' }}>
                {copy.subjectLabel} <strong>{copy.subjectText}</strong>
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon="sync_alt"
              onClick={() => setArabicFocus((v) => !v)}
            >
              {arabicFocus ? copy.focusEnglishCanvas : copy.focusArabicCanvas}
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
              <strong>{copy.editorLabel}</strong>
              <small style={{ color: 'var(--text-tertiary)' }}>{copy.editorSub}</small>
            </div>
            <textarea
              dir={arabicFocus ? 'rtl' : 'ltr'}
              rows={8}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--surface-card)',
                color: 'var(--text-main)',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                lineHeight: 1.6,
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
              <span>{characterCount} {copy.characters} • {copy.estimatedSms} • UTF-8</span>
              <Button variant="ghost" size="sm" icon="content_copy" onClick={() => setNotice(copy.noticeCopyText)}>
                {copy.copyText}
              </Button>
            </div>
          </div>

          {/* Safety Checklist */}
          <div
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--surface-subtle)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <MaterialIcon name="checklist" style={{ color: 'var(--brand-primary)' }} />
                <strong style={{ fontSize: '0.875rem' }}>{copy.safetyChecklistTitle}</strong>
              </div>
              <Badge variant="neutral">{copy.safetyVerificationStandard}</Badge>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {checklistItems.map(([checked, setter, title, detail]) => (
                <label key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setter(e.target.checked)}
                    style={{ marginTop: '0.2rem' }}
                  />
                  <div>
                    <strong style={{ fontSize: '0.8125rem', display: 'block', color: 'var(--text-main)' }}>{title}</strong>
                    <small style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>{detail}</small>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="primary" size="md" icon="done_all" onClick={stageDraft}>
                {copy.approveStage}
              </Button>
              <Button variant="outline" size="md" icon="edit_note" onClick={() => setNotice(copy.noticeEditorOpen)}>
                {copy.editContent}
              </Button>
            </div>
            <Button variant="ghost" size="sm" icon="delete_sweep" onClick={() => { setDraft(''); setNotice(copy.noticeDiscarded); }}>
              {copy.discardDraft}
            </Button>
          </div>
        </Panel>
      </div>

      {notice && (
        <div className="auth-alert auth-alert--success" role="status">
          <MaterialIcon name="info" />
          <span>{notice}</span>
        </div>
      )}

      {/* Ledger Table */}
      <Panel variant="elevated" padding="none">
        <div style={{ padding: '1.25rem 1.25rem 0' }}>
          <PanelHeader
            title={copy.ledgerHeading}
            subtitle={copy.ledgerSub}
            icon="outbox"
            actions={
              <Button variant="ghost" size="sm" icon="refresh" onClick={() => setNotice(copy.noticeRefreshed)}>
                {copy.refreshLedger}
              </Button>
            }
          />
        </div>

        <TableWrapper>
          <Table hover>
            <TableHead>
              <TableRow>
                <TableHeaderCell>{copy.tableRecipient}</TableHeaderCell>
                <TableHeaderCell>{copy.tableIntent}</TableHeaderCell>
                <TableHeaderCell>{copy.tableGenerated}</TableHeaderCell>
                <TableHeaderCell>{copy.tableReviewStatus}</TableHeaderCell>
                <TableHeaderCell>{copy.tableAssignedStaff}</TableHeaderCell>
                <TableHeaderCell textAlign="end">{copy.tableActions}</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assistantCommunicationDrafts.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <strong style={{ display: 'block' }}>{isRtl ? copy.patientPlaceholder : entry.recipient}</strong>
                    <small style={{ color: 'var(--text-tertiary)' }}>{copy.mrnPlaceholder}</small>
                  </TableCell>
                  <TableCell>
                    <span>{isRtl ? entry.intentAr : entry.intent}</span>
                    <small style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.72rem' }}>{copy.localDraftProtocol}</small>
                  </TableCell>
                  <TableCell>{isRtl ? entry.generatedAr : entry.generated}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        entry.status === 'Pending review'
                          ? 'warning'
                          : entry.status === 'Staged locally'
                          ? 'brand'
                          : 'neutral'
                      }
                      dot
                    >
                      {getReviewStatusLabel(entry.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{isRtl ? entry.staffAr : entry.staff}</TableCell>
                  <TableCell textAlign="end">
                    <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="visibility"
                        aria-label={`Review ${entry.id}`}
                        onClick={() => setNotice(`Demo only: ${entry.id} opened for review.`)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="content_copy"
                        aria-label={`Duplicate ${entry.id}`}
                        onClick={() => setNotice(`Demo only: ${entry.id} duplicated locally.`)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      </Panel>
    </div>
  );
}
