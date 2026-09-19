import { useState } from 'react';
import { MaterialIcon, PageHeader, Button, Badge, Panel, PanelHeader, PanelBody, Input } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { adminMessages } from '../../i18n/messages';

interface ConsoleLog {
  id: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export function AdminRemoteConsolePage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = adminMessages[isRtl ? 'ar' : 'en'].remoteConsole;

  const [commandInput, setCommandInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [logs, setLogs] = useState<ConsoleLog[]>([
    {
      id: 'log-1',
      time: '19:00:12 UTC',
      type: 'info',
      message: '[SYSTEM_INIT] Nabda Healthcare Enterprise Cluster initialized in Zero-Trust mode.',
    },
    {
      id: 'log-2',
      time: '19:01:05 UTC',
      type: 'success',
      message: '[RLS_CHECK] Multi-tenant PostgreSQL isolation verified: 0 leaks detected.',
    },
    {
      id: 'log-3',
      time: '19:02:40 UTC',
      type: 'success',
      message: '[N8N_HUB] Master healthcare automation webhook listening on /webhook/aegis-healthcare-hub.',
    },
  ]);

  const executeCommand = async (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    if (!cleanCmd) return;

    setIsExecuting(true);
    const now = new Date().toLocaleTimeString();

    // Add user command
    const userLog: ConsoleLog = {
      id: `cmd-${Date.now()}`,
      time: now,
      type: 'info',
      message: `$ ${cmd}`,
    };

    setLogs((prev) => [...prev, userLog]);
    setCommandInput('');

    await new Promise((r) => setTimeout(r, 400));

    let replyLog: ConsoleLog;

    if (cleanCmd === 'health' || cleanCmd === 'health_pulse') {
      replyLog = {
        id: `rep-${Date.now()}`,
        time: now,
        type: 'success',
        message: '[HEALTH_PULSE] Nodes: 3/3 Online | Latency: 14ms | Memory: 42% | DB Pool: 8/20 Active | Status: HEALTHY',
      };
    } else if (cleanCmd === 'rotate_kms') {
      replyLog = {
        id: `rep-${Date.now()}`,
        time: now,
        type: 'warning',
        message: `[KMS_ROTATION] Tenant encryption keys rotated successfully. Key Version: kms-v${Date.now().toString().slice(-4)} (AES-256-GCM)`,
      };
    } else if (cleanCmd === 'sync_n8n') {
      replyLog = {
        id: `rep-${Date.now()}`,
        time: now,
        type: 'success',
        message: '[N8N_SYNC] Webhook ping successful. Handshake verified with n8n orchestrator. 4 event listeners bound.',
      };
    } else if (cleanCmd === 'clear') {
      setLogs([]);
      setIsExecuting(false);
      return;
    } else if (cleanCmd === 'help') {
      replyLog = {
        id: `rep-${Date.now()}`,
        time: now,
        type: 'info',
        message: 'Available commands: health_pulse, rotate_kms, sync_n8n, clear, help',
      };
    } else {
      replyLog = {
        id: `rep-${Date.now()}`,
        time: now,
        type: 'error',
        message: `[COMMAND_UNKNOWN] '${cmd}' is not recognized. Type 'help' for available commands.`,
      };
    }

    setLogs((prev) => [...prev, replyLog]);
    setIsExecuting(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(commandInput);
  };

  const nodes = [
    { name: copy.nodes.globalControl, status: copy.statusOnline, variant: 'success' as const, latency: '12ms' },
    { name: copy.nodes.northRelay, status: copy.statusStable, variant: 'brand' as const, latency: '18ms' },
    { name: copy.nodes.coastalMirror, status: copy.statusOnline, variant: 'success' as const, latency: '24ms' },
  ] as const;

  return (
    <div className="admin-page__section" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <PageHeader
        kicker={copy.kicker}
        title={copy.title}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button
              variant="outline"
              size="md"
              icon="refresh"
              onClick={() => executeCommand('health_pulse')}
              disabled={isExecuting}
            >
              {isRtl ? 'فحص النبض السحابي' : 'Execute Health Pulse'}
            </Button>
            <Button
              variant="primary"
              size="md"
              icon="key"
              onClick={() => executeCommand('rotate_kms')}
              disabled={isExecuting}
            >
              {isRtl ? 'تدوير مفاتيح KMS' : 'Rotate KMS Keys'}
            </Button>
          </div>
        }
      />

      {/* Quick Action Command Chips */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => executeCommand('health_pulse')}
          className="ui-btn ui-btn--ghost ui-btn--sm"
          style={{ fontSize: '0.75rem' }}
        >
          <MaterialIcon name="speed" style={{ fontSize: '0.9rem' }} />
          <span>health_pulse</span>
        </button>
        <button
          type="button"
          onClick={() => executeCommand('sync_n8n')}
          className="ui-btn ui-btn--ghost ui-btn--sm"
          style={{ fontSize: '0.75rem' }}
        >
          <MaterialIcon name="hub" style={{ fontSize: '0.9rem' }} />
          <span>sync_n8n</span>
        </button>
        <button
          type="button"
          onClick={() => executeCommand('rotate_kms')}
          className="ui-btn ui-btn--ghost ui-btn--sm"
          style={{ fontSize: '0.75rem' }}
        >
          <MaterialIcon name="vpn_key" style={{ fontSize: '0.9rem' }} />
          <span>rotate_kms</span>
        </button>
        <button
          type="button"
          onClick={() => executeCommand('clear')}
          className="ui-btn ui-btn--ghost ui-btn--sm"
          style={{ fontSize: '0.75rem' }}
        >
          <MaterialIcon name="cleaning_services" style={{ fontSize: '0.9rem' }} />
          <span>clear</span>
        </button>
      </div>

      <section className="admin-columns">
        {/* Interactive Remote Terminal Output */}
        <Panel variant="elevated" padding="none">
          <div style={{ padding: '1.25rem 1.25rem 0' }}>
            <PanelHeader
              title={isRtl ? 'الطرفية السحابية المباشرة (Live Terminal)' : 'Live Remote Terminal'}
              icon="terminal"
              actions={<Badge variant="brand">{isRtl ? 'جلسة مشفرة' : 'Encrypted TLS 1.3'}</Badge>}
            />
          </div>

          <div
            style={{
              margin: '1rem 1.25rem',
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              fontSize: '0.85rem',
              minHeight: '260px',
              maxHeight: '380px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            {logs.map((log) => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  lineHeight: 1.5,
                  color:
                    log.type === 'success'
                      ? '#4ade80'
                      : log.type === 'warning'
                      ? '#facc15'
                      : log.type === 'error'
                      ? '#f87171'
                      : '#94a3b8',
                }}
              >
                <span style={{ color: '#64748b', userSelect: 'none' }}>[{log.time}]</span>
                <span>{log.message}</span>
              </div>
            ))}
            {isExecuting && (
              <div style={{ color: '#38bdf8' }}>
                <span>{isRtl ? 'جاري التنفيذ...' : 'Executing command...'}</span>
              </div>
            )}
          </div>

          <form
            onSubmit={handleFormSubmit}
            style={{
              display: 'flex',
              gap: '0.75rem',
              padding: '0 1.25rem 1.25rem',
            }}
          >
            <Input
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder={isRtl ? 'اكتب أمر التشخيص هنا (مثال: health_pulse)...' : 'Type command (e.g. health_pulse, rotate_kms)...'}
              iconStart="terminal"
            />
            <Button type="submit" variant="primary" size="md" disabled={isExecuting}>
              {isRtl ? 'تنفيذ' : 'Run'}
            </Button>
          </form>
        </Panel>

        {/* Node Cluster Health Status */}
        <Panel variant="elevated" padding="none">
          <div style={{ padding: '1.25rem 1.25rem 0' }}>
            <PanelHeader
              title={copy.nodeStatusTitle}
              icon="dns"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.5rem' }}>
            {nodes.map((node, idx) => (
              <div
                key={node.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderTop: idx > 0 ? '1px solid var(--border-subtle)' : 'none',
                }}
              >
                <div>
                  <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-main)' }}>{node.name}</strong>
                  <small style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem' }}>
                    {copy.heartbeatUpdated} • {node.latency}
                  </small>
                </div>
                <Badge variant={node.variant} dot>
                  {node.status}
                </Badge>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  );
}
