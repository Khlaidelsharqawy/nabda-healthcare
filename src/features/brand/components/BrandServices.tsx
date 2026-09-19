import { Badge } from '../../../components/ui';
import { ServiceCard } from '../../../components/discovery';
import { PlatformService } from '../../../domain';

export interface BrandServicesProps {
  services: PlatformService[];
  isRtl: boolean;
}

export function BrandServices({ services, isRtl }: BrandServicesProps) {
  return (
    <section
      id="public-services-section"
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        padding: '0 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
        <Badge variant="brand" icon="health_and_safety">
          {isRtl ? 'إمكانيات المنظومة السريرية' : 'Platform Capabilities'}
        </Badge>
        <h2
          style={{
            fontSize: '1.875rem',
            fontWeight: 800,
            color: 'var(--text-main, #0f172a)',
            margin: '8px 0 6px 0',
          }}
        >
          {isRtl ? 'خدمات سريرية ورقمية متكاملة' : 'Integrated Healthcare Capabilities'}
        </h2>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted, #64748b)', margin: 0 }}>
          {isRtl
            ? 'من حجز الاستشارة حتى التوثيق الصوتي والوصفات الدوائية، توفر نبضة تجربة رعاية صحية رقمية موحدة.'
            : 'From appointment scheduling to ambient scribe documentation and digital e-prescriptions.'}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
        }}
      >
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} isRtl={isRtl} />
        ))}
      </div>
    </section>
  );
}
