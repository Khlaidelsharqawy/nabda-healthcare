import { MaterialIcon, Panel, Badge } from '../ui';
import { PlatformService } from '../../data/mock/types';

export interface ServiceCardProps {
  service: PlatformService;
  isRtl?: boolean;
  className?: string;
}

export function ServiceCard({
  service,
  isRtl = false,
  className = '',
}: ServiceCardProps) {
  return (
    <Panel
      variant="elevated"
      className={`discovery-service-card ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '10px',
        padding: '22px',
        border: '1px solid var(--border-default, #e2e8f0)',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              backgroundColor: 'rgba(8, 116, 67, 0.08)',
              color: '#087443',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialIcon name={service.icon} style={{ fontSize: '26px' }} />
          </div>

          <Badge variant="outline" size="sm">
            {isRtl ? service.categoryAr : service.category}
          </Badge>
        </div>

        <h3
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: 'var(--text-main, #0f172a)',
            margin: '0 0 8px 0',
            lineHeight: '1.3',
          }}
        >
          {isRtl ? service.titleAr : service.title}
        </h3>

        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--text-muted, #64748b)',
            lineHeight: '1.5',
            margin: '0 0 16px 0',
          }}
        >
          {isRtl ? service.descriptionAr : service.description}
        </p>

        {/* Feature bullet list */}
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 18px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {(isRtl ? service.featuresAr : service.features).map((feat) => (
            <li
              key={feat}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.78125rem',
                color: 'var(--text-main, #334155)',
              }}
            >
              <MaterialIcon
                name="check_circle"
                style={{ fontSize: '15px', color: '#087443', flexShrink: 0 }}
              />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      <a
        href={service.route}
        className="ui-btn ui-btn--ghost ui-btn--sm"
        style={{
          width: '100%',
          justifyContent: 'space-between',
          textDecoration: 'none',
          padding: '8px 12px',
          backgroundColor: 'var(--surface-subtle, #f8fafc)',
          borderRadius: '6px',
          border: '1px solid var(--border-default, #e2e8f0)',
          color: '#087443',
          fontWeight: 600,
          fontSize: '0.8125rem',
        }}
      >
        <span>{isRtl ? 'استعراض الخدمة السريرية' : 'Explore Capability'}</span>
        <MaterialIcon name={isRtl ? 'arrow_back' : 'arrow_forward'} style={{ fontSize: '16px' }} />
      </a>
    </Panel>
  );
}

