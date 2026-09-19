import { useState } from 'react';
import {
  PageHeader,
  Button,
  Badge,
  TableWrapper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  Panel,
  PanelHeader,
  PanelBody,
  MaterialIcon,
} from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { adminMessages } from '../../i18n/messages';

export function AdminSubscriptionsPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = adminMessages[isRtl ? 'ar' : 'en'].subscriptions;

  const [notice, setNotice] = useState<string | null>(null);

  const handleReviewAnalytics = () => {
    setNotice(
      isRtl
        ? 'تحليل الاشتراكات: نسبة تجديد العقود 98.4%، ومتوسط استخدام API في حدود النطاق الأخضر.'
        : 'Subscription Analytics: 98.4% contract renewal rate with API usage within optimal green thresholds.'
    );
    setTimeout(() => setNotice(null), 5000);
  };

  const plans = [
    {
      name: 'Enterprise',
      clinics: isRtl ? 'مجمع النور الطبي التخصصي' : 'Al-Nour Specialized Center',
      usage: '12,400 / 50,000 API calls',
      status: copy.statusHealthy,
      variant: 'success' as const,
      price: isRtl ? '١,٥٠٠ ر.س / شهرياً' : '1,500 SAR / mo',
      renewal: isRtl ? 'تلقائي (٣١ ديسمبر ٢٠٢٦)' : 'Auto-renew (Dec 31, 2026)',
    },
    {
      name: 'Growth',
      clinics: isRtl ? 'مستشفى دار الشفاء' : 'Dar Al-Shifa Hospital',
      usage: '5,680 / 20,000 API calls',
      status: copy.statusStable,
      variant: 'brand' as const,
      price: isRtl ? '٨٥٠ ر.س / شهرياً' : '850 SAR / mo',
      renewal: isRtl ? 'تلقائي (١٥ نوفمبر ٢٠٢٦)' : 'Auto-renew (Nov 15, 2026)',
    },
    {
      name: 'Core',
      clinics: isRtl ? 'عيادات صحة المستقبل' : 'Future Health Clinics',
      usage: '2,980 / 10,000 API calls',
      status: copy.statusHealthy,
      variant: 'success' as const,
      price: isRtl ? '٤٥٠ ر.س / شهرياً' : '450 SAR / mo',
      renewal: isRtl ? 'تلقائي (٠١ أكتوبر ٢٠٢٦)' : 'Auto-renew (Oct 1, 2026)',
    },
  ] as const;

  const tiers = [
    {
      title: isRtl ? 'الباقة الأساسية (Core)' : 'Core Tier',
      desc: isRtl ? 'للعيادات الفردية والمراكز الصغيرة' : 'For solo clinics and small centers',
      price: isRtl ? '٤٥٠ ر.س' : '450 SAR',
      features: [
        isRtl ? 'حتى ٥ أطباء معتمدين' : 'Up to 5 verified doctors',
        isRtl ? 'أتمتة الواتساب الأساسية' : 'Basic WhatsApp automation',
        isRtl ? 'سجل طبي إلكتروني موحد' : 'Unified EHR records',
      ],
    },
    {
      title: isRtl ? 'باقة النمو (Growth)' : 'Growth Tier',
      desc: isRtl ? 'للمراكز الطبية التخصصية متعددة العيادات' : 'For multi-specialty clinical centers',
      price: isRtl ? '٨٥٠ ر.س' : '850 SAR',
      badge: isRtl ? 'الأكثر طلباً' : 'Popular',
      features: [
        isRtl ? 'حتى ٢٠ طبيباً واستشارياً' : 'Up to 20 doctors & consultants',
        isRtl ? 'سير عمل n8n مخصص غير محدود' : 'Unlimited custom n8n workflows',
        isRtl ? 'تكامل المختبرات وسلسلة العهدة' : 'LIS integration & chain of custody',
      ],
    },
    {
      title: isRtl ? 'باقة المؤسسات (Enterprise)' : 'Enterprise Tier',
      desc: isRtl ? 'للمستشفيات وسلاسل المجمعات الطبية الكبرى' : 'For hospitals & multi-facility health networks',
      price: isRtl ? '١,٥٠٠ ر.س' : '1,500 SAR',
      features: [
        isRtl ? 'أطباء ومستخدمون غير محدودين' : 'Unlimited doctors & staff',
        isRtl ? 'تشفير KMS مخصص لكل مستأجر' : 'Dedicated KMS encryption key per tenant',
        isRtl ? 'نموذج ذكاء اصطناعي مخصص مدرب' : 'Fine-tuned custom clinical AI model',
      ],
    },
  ];

  return (
    <div className="admin-page__section" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <PageHeader
        kicker={copy.kicker}
        title={copy.title}
        actions={
          <Button
            variant="primary"
            size="md"
            icon="analytics"
            onClick={handleReviewAnalytics}
            title={copy.reviewChurnTitle}
          >
            {copy.reviewChurn}
          </Button>
        }
      />

      {notice && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--color-success-text)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
          }}
        >
          <MaterialIcon name="insights" />
          <span>{notice}</span>
        </div>
      )}

      {/* Subscription Tiers Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {tiers.map((tier) => (
          <Panel key={tier.title} variant="elevated">
            <PanelHeader
              title={tier.title}
              actions={tier.badge ? <Badge variant="brand">{tier.badge}</Badge> : undefined}
            />
            <PanelBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{tier.desc}</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                  {tier.price} <small style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 400 }}>/ {isRtl ? 'شهرياً' : 'month'}</small>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {tier.features.map((feat) => (
                    <li key={feat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                      <MaterialIcon name="check" style={{ color: 'var(--color-success-text)', fontSize: '1rem' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </PanelBody>
          </Panel>
        ))}
      </div>

      {/* Active Clinic Subscriptions Table */}
      <TableWrapper>
        <Table hover>
          <TableHead>
            <TableRow>
              <TableHeaderCell>{copy.thPlan}</TableHeaderCell>
              <TableHeaderCell>{isRtl ? 'المركز الطبي' : 'Clinic'}</TableHeaderCell>
              <TableHeaderCell>{copy.thUsage}</TableHeaderCell>
              <TableHeaderCell>{copy.thStatus}</TableHeaderCell>
              <TableHeaderCell textAlign="end">{copy.thRenewal}</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.name}>
                <TableCell>
                  <strong style={{ color: 'var(--text-main)' }}>{plan.name}</strong>
                </TableCell>
                <TableCell>{plan.clinics}</TableCell>
                <TableCell>{plan.usage}</TableCell>
                <TableCell>
                  <Badge variant={plan.variant} dot>
                    {plan.status}
                  </Badge>
                </TableCell>
                <TableCell textAlign="end">
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>{plan.renewal}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
    </div>
  );
}
