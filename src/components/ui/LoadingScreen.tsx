import React from 'react';

/**
 * Enterprise Clinical Loading Screen with Nabda Heartbeat Pulse & Top Progress Bar
 */
export function PageLoadingIndicator({ message, isRtl = true }: { message?: string; isRtl?: boolean }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(248, 250, 252, 0.92)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* Top Emerald Glowing Progress Line */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #087443 0%, #10b981 50%, #087443 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmerBar 1.5s infinite linear',
          zIndex: 10000,
        }}
      />

      {/* Center Medical Pulse Animation */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          maxWidth: '420px',
          textAlign: 'center',
        }}
      >
        <div style={{ position: 'relative', width: '80px', height: '80px' }}>
          {/* Pulsing Outer Ripple Ring */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              backgroundColor: 'rgba(8, 116, 67, 0.15)',
              animation: 'pulseRing 1.8s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
            }}
          />
          {/* Inner Brand Heartbeat Icon Container */}
          <div
            style={{
              position: 'absolute',
              inset: '10px',
              borderRadius: '50%',
              backgroundColor: '#087443',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(8, 116, 67, 0.35)',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: '34px',
                animation: 'heartbeat 1.4s infinite ease-in-out',
              }}
            >
              monitor_heart
            </span>
          </div>
        </div>

        {/* Dynamic Contextual Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h3
            style={{
              fontSize: '1.125rem',
              fontWeight: 800,
              color: 'var(--text-main, #0f172a)',
              margin: 0,
            }}
          >
            {message || (isRtl ? 'جاري تحميل المنظومة الطبية...' : 'Loading Healthcare Platform...')}
          </h3>
          <p
            style={{
              fontSize: '0.8125rem',
              color: 'var(--text-muted, #64748b)',
              margin: 0,
            }}
          >
            {isRtl
              ? 'تأمين الاتصال السريري المشفر • فحص الصلاحيات المعيارية'
              : 'Securing encrypted clinical telemetry • Verifying Zero-Trust tokens'}
          </p>
        </div>

        {/* Security Compliance Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            color: '#087443',
            fontWeight: 700,
            boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            verified_user
          </span>
          <span>{isRtl ? 'حماية بيانات مشفرة HIPAA & Zero-Trust' : 'HIPAA & Zero-Trust Protected'}</span>
        </div>
      </div>

      <style>{`
        @keyframes shimmerBar {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        @keyframes pulseRing {
          0% { transform: scale(0.85); opacity: 0.8; }
          50% { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.18); }
          28% { transform: scale(1); }
          42% { transform: scale(1.18); }
          70% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

/**
 * Shimmering Table Skeleton Loader for zero Cumulative Layout Shift (CLS)
 */
export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div
          key={rIdx}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: '16px',
            padding: '14px 12px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            animation: 'skeletonPulse 1.5s ease-in-out infinite',
          }}
        >
          {Array.from({ length: columns }).map((_, cIdx) => (
            <div
              key={cIdx}
              style={{
                height: '14px',
                backgroundColor: '#e2e8f0',
                borderRadius: '4px',
                width: cIdx === 0 ? '70%' : '50%',
              }}
            />
          ))}
        </div>
      ))}
      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
