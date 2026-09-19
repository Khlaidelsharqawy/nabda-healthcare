import { useState } from 'react';
import { MaterialIcon, PageHeader, Button, Badge, Panel, PanelHeader, Textarea } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { assistantMessages } from '../../i18n/messages';
import { assistantAiMessages, assistantAiModules, assistantAiPrompts, assistantAiPromptsAr } from './fixtures';

export function AssistantAiPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = assistantMessages[isRtl ? 'ar' : 'en'].ai;

  const [prompt, setPrompt] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [notice, setNotice] = useState('');

  const activePrompts = isRtl ? assistantAiPromptsAr : assistantAiPrompts;

  const runDraft = (value = prompt) => {
    const nextPrompt = value.trim() || copy.defaultDraftPrompt;
    setPrompt(nextPrompt);
    setNotice(copy.noticePrepared);
  };

  return (
    <div className="assistant-page assistant-ai" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        kicker={`${copy.laneChip} • ${copy.boundaryChip}`}
        title={copy.title}
        subtitle={copy.subtitle}
        actions={
          <Badge variant="brand" icon="lock">
            {copy.clinicName} • {copy.protectedSession}
          </Badge>
        }
      />

      {/* Safety Boundary Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--surface-subtle)',
          border: '1px solid var(--border-default)',
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--brand-primary-light)',
            color: 'var(--brand-primary)',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <MaterialIcon name="policy" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <strong style={{ fontSize: '0.9375rem', color: 'var(--text-main)' }}>{copy.boundaryTitle}</strong>
            <code style={{ fontSize: '0.78rem', padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-subtle)' }}>
              {copy.boundaryCode}
            </code>
          </div>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{copy.boundaryDesc}</p>
        </div>
      </div>

      {/* Capabilities Modules */}
      <Panel variant="elevated">
        <PanelHeader
          title={copy.capabilitiesTitle}
          icon="grid_view"
          actions={<Badge variant="brand">{copy.activeModules}</Badge>}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {assistantAiModules.map((module) => (
            <div
              key={module.id}
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-subtle)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <MaterialIcon name={module.icon} style={{ color: 'var(--brand-primary)', fontSize: '1.5rem' }} />
                <Badge variant="neutral">{isRtl ? module.labelAr : module.label}</Badge>
              </div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{isRtl ? module.arabicTitle : module.title}</h3>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)', flex: 1 }}>{isRtl ? module.descriptionAr : module.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{isRtl ? module.metricAr : module.metric}</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--brand-primary)' }}>{module.metricValue}</strong>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={module.actionIcon}
                fullWidth
                onClick={() => runDraft(isRtl ? module.actionAr : module.action)}
              >
                {isRtl ? module.actionAr : module.action}
              </Button>
            </div>
          ))}
        </div>
      </Panel>

      {/* Interactive AI Console & Prompt Library */}
      <div className="assistant-two-column-layout">
        <Panel variant="elevated">
          <PanelHeader
            title={copy.interactiveAssistant}
            subtitle={copy.serviceSubtitle}
            icon="smart_toy"
            actions={<Badge variant="brand">{copy.bilingualLane}</Badge>}
          />

          {/* Messages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {assistantAiMessages.map((message) => {
              const isUser = message.author === 'assistant';
              return (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'flex-start',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isUser ? 'var(--surface-subtle)' : 'var(--brand-primary-light)',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isUser ? 'var(--surface-card)' : 'var(--brand-primary)',
                      color: isUser ? 'var(--text-main)' : '#ffffff',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <MaterialIcon name={isUser ? 'person' : 'psychology'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <strong style={{ fontSize: '0.8125rem' }}>{isRtl ? message.labelAr : message.label}</strong>
                      <small style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem' }}>{message.time}</small>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: isUser ? 'var(--text-main)' : 'var(--brand-primary)', lineHeight: 1.5 }}>
                      {isRtl ? message.contentAr : message.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Staged Draft */}
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--surface-card)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MaterialIcon name="edit_note" style={{ color: 'var(--brand-primary)' }} />
                <strong style={{ fontSize: '0.875rem' }}>{copy.draftBadge}</strong>
              </div>
              <Badge variant="warning">{copy.reviewRequired}</Badge>
            </div>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
              {copy.draftSuggestion}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="outline" size="sm" icon="content_copy" onClick={() => setNotice(copy.noticeDraftCopied)}>
                {copy.copyDraft}
              </Button>
              <Button variant="primary" size="sm" icon="verified" onClick={() => setNotice(copy.noticeDraftPending)}>
                {copy.markForReview}
              </Button>
            </div>
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runDraft();
            }}
            style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <label style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{copy.taskLabel}</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={copy.taskPlaceholder}
              rows={3}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="ghost" size="sm" icon="history_toggle_off" onClick={() => { setPrompt(''); setNotice(copy.noticeCleared); }}>
                {copy.clear}
              </Button>
              <Button variant="primary" size="md" icon={isRtl ? 'arrow_back' : 'arrow_forward'} type="submit">
                {copy.prepareDraft}
              </Button>
            </div>
          </form>
        </Panel>

        {/* Side Panel: Prompt Library */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Panel variant="elevated">
            <PanelHeader
              title={copy.promptLibrary}
              tag={<Badge variant="brand">{activePrompts.length} {copy.templatesCount}</Badge>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
              {activePrompts.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setSelectedPrompt(item);
                    runDraft(item);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: selectedPrompt === item ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: selectedPrompt === item ? 'var(--brand-primary-light)' : 'var(--surface-subtle)',
                    color: selectedPrompt === item ? 'var(--brand-primary)' : 'var(--text-main)',
                    fontSize: '0.8125rem',
                    textAlign: 'start',
                    cursor: 'pointer',
                  }}
                >
                  <span>{item}</span>
                  <MaterialIcon name="arrow_forward" style={{ fontSize: '1rem', flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </Panel>

          <Panel variant="elevated">
            <PanelHeader
              title={copy.protectedSessionTitle}
              icon="shield"
            />
            <p style={{ margin: '0.5rem 0 1rem', fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {copy.protectedSessionDesc}
            </p>
            <Badge variant="success" icon="lock">
              {copy.boundedSession}
            </Badge>
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
