import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from 'react';
import { MaterialIcon, Panel, PanelHeader, PanelBody, Badge, Button, Textarea } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { chatMessages } from '../../i18n/messages';

export type ChatRole = 'doctor' | 'assistant' | 'patient';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export function GlobalAiChatPage({ role }: { role: ChatRole }) {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? chatMessages.ar : chatMessages.en;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const starters = copy.starters[role];
  const roleTitle = copy.titles[role];
  const roleSubtitle = copy.subtitles[role];
  const roleBadge = copy.badges[role];
  const fallbackResponse = copy.responses[role];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString(isRtl ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = (textToSend = input) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isThinking) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: fallbackResponse,
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsThinking(false);
    }, 600);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
    setInput('');
    setIsThinking(false);
  };

  return (
    <div
      className="aegis-page global-chat-page"
      data-direction={isRtl ? 'rtl' : 'ltr'}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - var(--header-height) - 4rem)',
        maxHeight: '900px',
        maxWidth: '1000px',
        margin: '0 auto',
        gap: '1rem',
      }}
    >
      {/* Header Panel */}
      <Panel variant="elevated">
        <PanelBody style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', padding: '0.875rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <img
              src="/chat-icon.jpg"
              alt=""
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                objectFit: 'cover',
                boxShadow: 'var(--shadow-xs)',
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  {roleTitle}
                </h1>
                <Badge variant="brand" size="sm">{roleBadge}</Badge>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {roleSubtitle}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
              <span>{copy.composer.onlineStatus}</span>
            </div>
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" icon="refresh" onClick={handleClear} aria-label={copy.composer.clear}>
                {copy.composer.clear}
              </Button>
            )}
          </div>
        </PanelBody>
      </Panel>

      {/* Main Chat Stream Container */}
      <Panel variant="elevated" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <PanelBody style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
          {messages.length === 0 ? (
            <div
              style={{
                margin: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                maxWidth: '600px',
                padding: '2rem 1rem',
              }}
            >
              <img
                src="/chat-icon.jpg"
                alt=""
                style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-lg)', marginBottom: '1rem', boxShadow: 'var(--shadow-sm)' }}
              />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>
                {copy.emptyTitle}
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
                {copy.emptySubtitle}
              </p>

              <div style={{ width: '100%' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  {copy.startersHeading}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {starters.map((starterText, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSend(starterText)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--surface-subtle)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-main)',
                        fontSize: '0.8125rem',
                        cursor: 'pointer',
                        textAlign: isRtl ? 'right' : 'left',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <MaterialIcon name="chat_bubble_outline" style={{ fontSize: '1rem', color: 'var(--brand-primary)', flexShrink: 0 }} />
                      <span>{starterText}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: isUser ? (isRtl ? 'flex-start' : 'flex-end') : isRtl ? 'flex-end' : 'flex-start',
                      gap: '0.625rem',
                    }}
                  >
                    {!isUser && (
                      <img
                        src="/chat-icon.jpg"
                        alt=""
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                      />
                    )}
                    <div
                      style={{
                        maxWidth: '75%',
                        padding: '0.875rem 1.125rem',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: isUser ? 'var(--brand-primary)' : 'var(--surface-subtle)',
                        color: isUser ? '#ffffff' : 'var(--text-main)',
                        boxShadow: 'var(--shadow-xs)',
                        border: isUser ? 'none' : '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontSize: '0.7rem', color: isUser ? 'rgba(255,255,255,0.75)' : 'var(--text-tertiary)', marginBottom: '0.35rem' }}>
                        <strong>{isUser ? copy.composer.userLabel : copy.composer.assistantLabel}</strong>
                        <span>{msg.time}</span>
                      </div>
                      <div style={{ fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                    </div>
                    {isUser && (
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--surface-subtle)',
                          display: 'grid',
                          placeItems: 'center',
                          color: 'var(--brand-primary)',
                          flexShrink: 0,
                        }}
                      >
                        <MaterialIcon name="person" style={{ fontSize: '1rem' }} />
                      </div>
                    )}
                  </div>
                );
              })}

              {isThinking && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <img
                    src="/chat-icon.jpg"
                    alt=""
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: 'var(--surface-subtle)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.8125rem',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span>{copy.composer.sending}</span>
                    <MaterialIcon name="pending" style={{ animation: 'spin 1.5s infinite' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </PanelBody>

        {/* Composer Bar */}
        <div
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--surface-card)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <form
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              handleSend();
            }}
            style={{ display: 'flex', gap: '0.625rem' }}
          >
            <Textarea
              ref={textareaRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={copy.composer.placeholder}
              aria-label={copy.composer.placeholder}
              style={{ flex: 1, resize: 'none' }}
            />
            <Button
              variant="primary"
              icon="send"
              type="submit"
              disabled={!input.trim() || isThinking}
              aria-label={copy.composer.send}
              style={{ alignSelf: 'flex-end', height: '42px' }}
            >
              {copy.composer.send}
            </Button>
          </form>

          <p
            style={{
              margin: 0,
              fontSize: '0.7rem',
              color: 'var(--text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
            }}
          >
            <MaterialIcon name="info" style={{ fontSize: '0.875rem' }} />
            <span>{copy.composer.disclaimer}</span>
          </p>
        </div>
      </Panel>
    </div>
  );
}
