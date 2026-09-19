import { useState } from 'react';
import { MaterialIcon, PageHeader, Button, Panel, PanelHeader, Badge, FormField, Input, Textarea } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { adminMessages } from '../../i18n/messages';
import { repositories } from '../../repositories';
import { Clinic } from '../../domain';

export function AdminClinicProvisionPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = adminMessages[isRtl ? 'ar' : 'en'].provision;

  const [clinicNameEn, setClinicNameEn] = useState('');
  const [clinicNameAr, setClinicNameAr] = useState('');
  const [regionEn, setRegionEn] = useState('Riyadh / Central');
  const [regionAr, setRegionAr] = useState('الرياض / المنطقة الوسطى');
  const [phone, setPhone] = useState('+966 11 000 0000');
  const [email, setEmail] = useState('info@clinic.med');
  const [primaryContact, setPrimaryContact] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);

  const handleSave = async () => {
    if (!clinicNameEn.trim() && !clinicNameAr.trim()) {
      setNotice({
        text: isRtl ? 'يرجى إدخال اسم العيادة' : 'Please enter clinic name',
        error: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const slug = (clinicNameEn || 'clinic')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const newClinic: Clinic = {
        id: slug || `clinic-${Date.now()}`,
        name: clinicNameEn.trim() || clinicNameAr.trim(),
        nameAr: clinicNameAr.trim() || clinicNameEn.trim(),
        tagline: 'Modern Healthcare & Outpatient Clinic',
        taglineAr: 'رعاية صحية حديثة وعيادات تخصصية متكاملة',
        description: notes || 'Provisioned medical center under enterprise tenant isolation.',
        descriptionAr: notes || 'مجمع طبي معتمد ضمن العزل التام للمستأجرين.',
        address: regionEn,
        addressAr: regionAr,
        city: isRtl ? 'الرياض' : 'Riyadh',
        cityAr: 'الرياض',
        district: regionAr,
        districtAr: regionAr,
        phone: phone.trim(),
        email: email.trim(),
        rating: 5.0,
        reviewCount: 1,
        specialties: ['General Practice', 'Internal Medicine'],
        specialtiesAr: ['الطب العام', 'الطب الباطني'],
        operatingHours: 'Saturday – Thursday: 08:00 AM – 10:00 PM',
        operatingHoursAr: 'السبت – الخميس: ٠٨:٠٠ ص – ١٠:٠٠ م',
        isVerified: true,
        badge: 'Newly Provisioned',
        badgeAr: 'عيادة جديدة معتمدة',
        doctorCount: 4,
        consultationFeeRange: '200 – 300 SAR',
        consultationFeeRangeAr: '٢٠٠ – ٣٠٠ ر.س',
        emergencyAvailable: false,
        isDemo: false,
        mapCoordinates: {
          latApprox: 24.7136,
          lngApprox: 46.6753,
          label: clinicNameEn || clinicNameAr,
        },
      };

      await repositories.clinics.save(newClinic);

      await repositories.auditLogs.append({
        tenantId: 'global',
        actorId: 'usr-admin-01',
        actorRole: 'super_admin',
        action: 'PROVISION_CLINIC',
        entityType: 'integration',
        entityId: newClinic.id,
        details: { clinicName: newClinic.name, contact: primaryContact },
      });

      setNotice({
        text: isRtl ? 'تم تهيئة وتفعيل العيادة بنجاح في قاعدة البيانات!' : 'Clinic provisioned and activated in database successfully!',
        error: false,
      });

      setTimeout(() => {
        window.location.href = '/admin/clinics';
      }, 1000);
    } catch (err) {
      console.error(err);
      setNotice({
        text: isRtl ? 'فشلت عملية تهيئة العيادة' : 'Failed to provision clinic',
        error: true,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-page__section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        kicker={copy.kicker}
        title={copy.title}
        actions={
          <Button
            variant="primary"
            size="md"
            icon="save"
            onClick={handleSave}
            disabled={isSubmitting}
            title={copy.saveDraftTitle}
          >
            {isSubmitting
              ? (isRtl ? 'جاري التهيئة...' : 'Provisioning...')
              : (isRtl ? 'حفظ وتفعيل العيادة' : 'Save & Provision Clinic')}
          </Button>
        }
      />

      {notice && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: notice.error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            color: notice.error ? 'var(--color-danger-text)' : 'var(--color-success-text)',
            border: `1px solid ${notice.error ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
          }}
        >
          <MaterialIcon name={notice.error ? 'error' : 'check_circle'} />
          <span>{notice.text}</span>
        </div>
      )}

      <div className="admin-columns">
        <Panel variant="elevated">
          <PanelHeader
            title={copy.tenantSetup}
            icon="domain_add"
            actions={<Badge variant="brand">{isRtl ? 'مستأجر جديد' : 'New Tenant'}</Badge>}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <FormField label={isRtl ? 'اسم العيادة (بالعربية)' : 'Clinic Name (Arabic)'} required>
              <Input
                value={clinicNameAr}
                onChange={(e) => setClinicNameAr(e.target.value)}
                placeholder="مثال: مجمع عافية الطبي"
                iconStart="local_hospital"
              />
            </FormField>
            <FormField label={isRtl ? 'اسم العيادة (بالإنجليزية)' : 'Clinic Name (English)'} required>
              <Input
                value={clinicNameEn}
                onChange={(e) => setClinicNameEn(e.target.value)}
                placeholder="e.g. Afia Medical Complex"
                iconStart="local_hospital"
              />
            </FormField>
            <FormField label={isRtl ? 'المنطقة والموقع' : 'Region & Location'} required>
              <Input
                value={isRtl ? regionAr : regionEn}
                onChange={(e) => {
                  if (isRtl) setRegionAr(e.target.value);
                  else setRegionEn(e.target.value);
                }}
                iconStart="location_on"
              />
            </FormField>
            <FormField label={isRtl ? 'رقم الهاتف المعتمد' : 'Official Phone'} required>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                iconStart="phone"
              />
            </FormField>
            <div style={{ gridColumn: '1 / -1' }}>
              <FormField label={copy.primaryContact} required>
                <Input
                  value={primaryContact}
                  onChange={(e) => setPrimaryContact(e.target.value)}
                  placeholder={isRtl ? 'د. ليلى حسن — المدير الطبي' : 'Dr. Layla Hassan — Medical Director'}
                  iconStart="person"
                />
              </FormField>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <FormField label={copy.provisioningNotes}>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={copy.notesDefault}
                  rows={3}
                />
              </FormField>
            </div>
          </div>
        </Panel>

        <Panel variant="elevated">
          <PanelHeader
            title={copy.checklistHeading}
            icon="checklist"
          />
          <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {copy.checklist.map((item) => (
              <li
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--surface-subtle)',
                  fontSize: '0.85rem',
                  color: 'var(--text-main)',
                }}
              >
                <MaterialIcon name="check_circle" style={{ color: 'var(--color-success-text)', fontSize: '1.1rem' }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
