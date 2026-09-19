import { useState, useEffect } from 'react';
import {
  MaterialIcon,
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
} from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { adminMessages } from '../../i18n/messages';
import { adminApiClient } from '../../services/adminApiClient';
import { Clinic, Doctor, PlatformService } from '../../domain';

export function AdminClinicsPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = adminMessages[isRtl ? 'ar' : 'en'].clinics;

  // Active Tab: clinics | doctors | services
  const [activeTab, setActiveTab] = useState<'clinics' | 'doctors' | 'services'>('clinics');

  // Entities State
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<PlatformService[]>([]);
  const [loading, setLoading] = useState(true);

  // Instant Feedback Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load all data via AdminApiClient
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [cRes, dRes, sRes] = await Promise.all([
          adminApiClient.getClinics(),
          adminApiClient.getDoctors(),
          adminApiClient.getServices(),
        ]);
        if (cRes.success) setClinics(cRes.data);
        if (dRes.success) setDoctors(dRes.data);
        if (sRes.success) setServices(sRes.data);
      } catch (e) {
        console.error('Failed to load admin clinic & discovery data', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Toggle Clinic Visibility via AdminApiClient
  const handleToggleClinicVisibility = async (clinic: Clinic) => {
    try {
      const newStatus = clinic.showOnPublicSite === false ? true : false;
      const res = await adminApiClient.updateClinicVisibility(clinic.id, newStatus);
      if (res.success) {
        setClinics((prev) => prev.map((c) => (c.id === clinic.id ? res.data : c)));
        triggerToast(
          isRtl
            ? `تم ${newStatus ? 'تفعيل ظهور' : 'إخفاء'} مركز "${clinic.nameAr}" في الموقع العام بنجاح (زمن الاستجابة: ${res.latencyMs}ms)`
            : `Clinic "${clinic.name}" is now ${newStatus ? 'visible on' : 'hidden from'} public site (${res.latencyMs}ms)`
        );
      } else {
        alert(res.error || 'Failed to update visibility');
      }
    } catch (err: any) {
      alert(err.message || 'API request failed');
    }
  };

  // Toggle Doctor Visibility via AdminApiClient
  const handleToggleDoctorVisibility = async (doctor: Doctor) => {
    try {
      const newStatus = doctor.showOnPublicSite === false ? true : false;
      const res = await adminApiClient.updateDoctorVisibility(doctor.id, newStatus);
      if (res.success) {
        setDoctors((prev) => prev.map((d) => (d.id === doctor.id ? res.data : d)));
        triggerToast(
          isRtl
            ? `تم ${newStatus ? 'تفعيل ظهور' : 'إخفاء'} د. "${doctor.nameAr}" في الموقع العام بنجاح (زمن الاستجابة: ${res.latencyMs}ms)`
            : `Dr. "${doctor.name}" is now ${newStatus ? 'visible on' : 'hidden from'} public site (${res.latencyMs}ms)`
        );
      } else {
        alert(res.error || 'Failed to update visibility');
      }
    } catch (err: any) {
      alert(err.message || 'API request failed');
    }
  };

  // Toggle Service Visibility via AdminApiClient
  const handleToggleServiceVisibility = async (service: PlatformService) => {
    try {
      const newStatus = service.showOnPublicSite === false ? true : false;
      const res = await adminApiClient.updateServiceVisibility(service.id, newStatus);
      if (res.success) {
        setServices((prev) => prev.map((s) => (s.id === service.id ? res.data : s)));
        triggerToast(
          isRtl
            ? `تم ${newStatus ? 'تفعيل ظهور' : 'إخفاء'} خدمة "${service.titleAr}" في الموقع العام بنجاح (زمن الاستجابة: ${res.latencyMs}ms)`
            : `Service "${service.title}" is now ${newStatus ? 'visible on' : 'hidden from'} public site (${res.latencyMs}ms)`
        );
      } else {
        alert(res.error || 'Failed to update visibility');
      }
    } catch (err: any) {
      alert(err.message || 'API request failed');
    }
  };

  // Visibility statistics
  const visibleClinicsCount = clinics.filter((c) => c.showOnPublicSite !== false).length;
  const visibleDoctorsCount = doctors.filter((d) => d.showOnPublicSite !== false).length;
  const visibleServicesCount = services.filter((s) => s.showOnPublicSite !== false).length;

  return (
    <div className="admin-page__section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        kicker={isRtl ? 'إدارة المنظومة والظهور الرقمي' : 'System Administration & Digital Presence'}
        title={isRtl ? 'المراكز والكوادر والتحكم في الموقع العام' : 'Clinics, Physicians & Public Site Control'}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="ui-btn ui-btn--ghost ui-btn--md"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              title={isRtl ? 'فتح الموقع العام في لسان جديد لمعاينة التغييرات الحية' : 'Preview Live Public Site'}
            >
              <MaterialIcon name="open_in_new" />
              <span>{isRtl ? 'معاينة الموقع العام' : 'Preview Public Site'}</span>
            </a>
            <a
              href="/admin/clinics/provision"
              className="ui-btn ui-btn--primary ui-btn--md"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              title={copy.addTenantTitle}
            >
              <MaterialIcon name="add_business" />
              <span>{copy.addTenant}</span>
            </a>
          </div>
        }
      />

      {/* Instant Notification Toast */}
      {toastMessage && (
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#087443',
            color: '#ffffff',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.875rem',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(8, 116, 67, 0.25)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <MaterialIcon name="check_circle" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tabs Navigation & Stats Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          backgroundColor: 'var(--surface-primary, #ffffff)',
          padding: '12px 16px',
          borderRadius: '10px',
          border: '1px solid var(--border-default, #e2e8f0)',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveTab('clinics')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: activeTab === 'clinics' ? '1px solid #087443' : '1px solid var(--border-default, #cbd5e1)',
              backgroundColor: activeTab === 'clinics' ? '#087443' : 'var(--surface-subtle, #f8fafc)',
              color: activeTab === 'clinics' ? '#ffffff' : 'var(--text-main, #334155)',
              transition: 'all 0.15s ease',
            }}
          >
            <MaterialIcon name="local_hospital" />
            <span>{isRtl ? 'المراكز الطبية' : 'Clinics'}</span>
            <span
              style={{
                backgroundColor: activeTab === 'clinics' ? 'rgba(255,255,255,0.25)' : 'var(--border-default, #e2e8f0)',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.75rem',
              }}
            >
              {visibleClinicsCount}/{clinics.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('doctors')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: activeTab === 'doctors' ? '1px solid #087443' : '1px solid var(--border-default, #cbd5e1)',
              backgroundColor: activeTab === 'doctors' ? '#087443' : 'var(--surface-subtle, #f8fafc)',
              color: activeTab === 'doctors' ? '#ffffff' : 'var(--text-main, #334155)',
              transition: 'all 0.15s ease',
            }}
          >
            <MaterialIcon name="person" />
            <span>{isRtl ? 'الأطباء والاستشاريون' : 'Doctors & Specialists'}</span>
            <span
              style={{
                backgroundColor: activeTab === 'doctors' ? 'rgba(255,255,255,0.25)' : 'var(--border-default, #e2e8f0)',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.75rem',
              }}
            >
              {visibleDoctorsCount}/{doctors.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('services')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: activeTab === 'services' ? '1px solid #087443' : '1px solid var(--border-default, #cbd5e1)',
              backgroundColor: activeTab === 'services' ? '#087443' : 'var(--surface-subtle, #f8fafc)',
              color: activeTab === 'services' ? '#ffffff' : 'var(--text-main, #334155)',
              transition: 'all 0.15s ease',
            }}
          >
            <MaterialIcon name="medical_services" />
            <span>{isRtl ? 'الخدمات السريرية' : 'Clinical Services'}</span>
            <span
              style={{
                backgroundColor: activeTab === 'services' ? 'rgba(255,255,255,0.25)' : 'var(--border-default, #e2e8f0)',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.75rem',
              }}
            >
              {visibleServicesCount}/{services.length}
            </span>
          </button>
        </div>

        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted, #64748b)', fontWeight: 600 }}>
          {isRtl
            ? '💡 التعديل هنا ينعكس فوراً ولحظياً على واجهة الموقع العام للمرضى والزوار'
            : '💡 Visibility toggles update the public patient portal in real time'}
        </div>
      </div>

      {/* 1. CLINICS TAB */}
      {activeTab === 'clinics' && (
        <TableWrapper>
          <Table hover>
            <TableHead>
              <TableRow>
                <TableHeaderCell>{copy.thClinic}</TableHeaderCell>
                <TableHeaderCell>{copy.thRegion}</TableHeaderCell>
                <TableHeaderCell>{copy.thStatus}</TableHeaderCell>
                <TableHeaderCell textAlign="center">{isRtl ? 'الأطباء' : 'Doctors'}</TableHeaderCell>
                <TableHeaderCell textAlign="center" style={{ minWidth: '180px' }}>
                  {isRtl ? 'الظهور في الموقع العام' : 'Public Site Visibility'}
                </TableHeaderCell>
                <TableHeaderCell textAlign="end">{copy.thAction}</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} textAlign="center">
                    <span style={{ color: 'var(--text-tertiary)', padding: '2rem 0', display: 'inline-block' }}>
                      {isRtl ? 'جاري تحميل العيادات من قاعدة البيانات...' : 'Loading clinics from database...'}
                    </span>
                  </TableCell>
                </TableRow>
              ) : clinics.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} textAlign="center">
                    <span style={{ color: 'var(--text-tertiary)', padding: '2rem 0', display: 'inline-block' }}>
                      {isRtl ? 'لا توجد عيادات مسجلة حالياً' : 'No clinics registered currently'}
                    </span>
                  </TableCell>
                </TableRow>
              ) : (
                clinics.map((clinic) => {
                  const isVisible = clinic.showOnPublicSite !== false;
                  return (
                    <TableRow key={clinic.id}>
                      <TableCell>
                        <a
                          href={`/admin/clinics/${clinic.id}`}
                          style={{ fontWeight: 700, color: 'var(--brand-primary)', textDecoration: 'none' }}
                        >
                          {isRtl ? clinic.nameAr : clinic.name}
                        </a>
                      </TableCell>
                      <TableCell>{isRtl ? `${clinic.cityAr} - ${clinic.districtAr}` : `${clinic.city} - ${clinic.district}`}</TableCell>
                      <TableCell>
                        <Badge variant={clinic.isVerified ? 'success' : 'warning'} dot>
                          {clinic.isVerified ? copy.statusHealthy : copy.statusReview}
                        </Badge>
                      </TableCell>
                      <TableCell textAlign="center">{clinic.doctorCount}</TableCell>
                      <TableCell textAlign="center">
                        <button
                          type="button"
                          onClick={() => handleToggleClinicVisibility(clinic)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: isVisible ? '1px solid #087443' : '1px solid #94a3b8',
                            backgroundColor: isVisible ? 'rgba(8, 116, 67, 0.1)' : '#f1f5f9',
                            color: isVisible ? '#087443' : '#64748b',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '0.8125rem',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <MaterialIcon name={isVisible ? 'visibility' : 'visibility_off'} style={{ fontSize: '18px' }} />
                          <span>{isVisible ? (isRtl ? 'ظاهر للجمهور' : 'Visible') : (isRtl ? 'مخفي' : 'Hidden')}</span>
                        </button>
                      </TableCell>
                      <TableCell textAlign="end">
                        <a
                          href={`/admin/clinics/${clinic.id}`}
                          className="ui-btn ui-btn--ghost ui-btn--sm"
                          style={{ textDecoration: 'none' }}
                        >
                          <span>{copy.open}</span>
                          <MaterialIcon name={isRtl ? 'arrow_back' : 'arrow_forward'} />
                        </a>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableWrapper>
      )}

      {/* 2. DOCTORS TAB */}
      {activeTab === 'doctors' && (
        <TableWrapper>
          <Table hover>
            <TableHead>
              <TableRow>
                <TableHeaderCell>{isRtl ? 'الطبيب / الاستشاري' : 'Physician'}</TableHeaderCell>
                <TableHeaderCell>{isRtl ? 'التخصص' : 'Specialty'}</TableHeaderCell>
                <TableHeaderCell>{isRtl ? 'المركز التابع له' : 'Clinic'}</TableHeaderCell>
                <TableHeaderCell>{isRtl ? 'سنوات الخبرة' : 'Experience'}</TableHeaderCell>
                <TableHeaderCell textAlign="center" style={{ minWidth: '180px' }}>
                  {isRtl ? 'الظهور في الموقع العام' : 'Public Site Visibility'}
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} textAlign="center">
                    <span style={{ color: 'var(--text-tertiary)', padding: '2rem 0', display: 'inline-block' }}>
                      {isRtl ? 'جاري تحميل الأطباء من قاعدة البيانات...' : 'Loading doctors from database...'}
                    </span>
                  </TableCell>
                </TableRow>
              ) : doctors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} textAlign="center">
                    <span style={{ color: 'var(--text-tertiary)', padding: '2rem 0', display: 'inline-block' }}>
                      {isRtl ? 'لا يوجد أطباء مسجلون حالياً' : 'No doctors registered currently'}
                    </span>
                  </TableCell>
                </TableRow>
              ) : (
                doctors.map((doctor) => {
                  const isVisible = doctor.showOnPublicSite !== false;
                  return (
                    <TableRow key={doctor.id}>
                      <TableCell>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>
                            {isRtl ? doctor.nameAr : doctor.name}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
                            {isRtl ? doctor.titleAr : doctor.title}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="neutral">{isRtl ? doctor.specialtyAr : doctor.specialty}</Badge>
                      </TableCell>
                      <TableCell>{isRtl ? doctor.clinicNameAr : doctor.clinicName}</TableCell>
                      <TableCell>{doctor.yearsExperience} {isRtl ? 'سنوات' : 'Years'}</TableCell>
                      <TableCell textAlign="center">
                        <button
                          type="button"
                          onClick={() => handleToggleDoctorVisibility(doctor)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: isVisible ? '1px solid #087443' : '1px solid #94a3b8',
                            backgroundColor: isVisible ? 'rgba(8, 116, 67, 0.1)' : '#f1f5f9',
                            color: isVisible ? '#087443' : '#64748b',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '0.8125rem',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <MaterialIcon name={isVisible ? 'visibility' : 'visibility_off'} style={{ fontSize: '18px' }} />
                          <span>{isVisible ? (isRtl ? 'ظاهر للجمهور' : 'Visible') : (isRtl ? 'مخفي' : 'Hidden')}</span>
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableWrapper>
      )}

      {/* 3. SERVICES TAB */}
      {activeTab === 'services' && (
        <TableWrapper>
          <Table hover>
            <TableHead>
              <TableRow>
                <TableHeaderCell>{isRtl ? 'الخدمة السريرية' : 'Service'}</TableHeaderCell>
                <TableHeaderCell>{isRtl ? 'التصنيف' : 'Category'}</TableHeaderCell>
                <TableHeaderCell>{isRtl ? 'المسار الرقمي' : 'Route'}</TableHeaderCell>
                <TableHeaderCell textAlign="center" style={{ minWidth: '180px' }}>
                  {isRtl ? 'الظهور في الموقع العام' : 'Public Site Visibility'}
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} textAlign="center">
                    <span style={{ color: 'var(--text-tertiary)', padding: '2rem 0', display: 'inline-block' }}>
                      {isRtl ? 'جاري تحميل الخدمات من قاعدة البيانات...' : 'Loading services from database...'}
                    </span>
                  </TableCell>
                </TableRow>
              ) : services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} textAlign="center">
                    <span style={{ color: 'var(--text-tertiary)', padding: '2rem 0', display: 'inline-block' }}>
                      {isRtl ? 'لا توجد خدمات مسجلة حالياً' : 'No services registered currently'}
                    </span>
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => {
                  const isVisible = service.showOnPublicSite !== false;
                  return (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <MaterialIcon name={service.icon} style={{ color: '#087443' }} />
                          <span style={{ fontWeight: 700 }}>
                            {isRtl ? service.titleAr : service.title}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="neutral">{isRtl ? service.categoryAr : service.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <code style={{ fontSize: '0.8125rem', color: '#087443' }}>{service.route}</code>
                      </TableCell>
                      <TableCell textAlign="center">
                        <button
                          type="button"
                          onClick={() => handleToggleServiceVisibility(service)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: isVisible ? '1px solid #087443' : '1px solid #94a3b8',
                            backgroundColor: isVisible ? 'rgba(8, 116, 67, 0.1)' : '#f1f5f9',
                            color: isVisible ? '#087443' : '#64748b',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '0.8125rem',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <MaterialIcon name={isVisible ? 'visibility' : 'visibility_off'} style={{ fontSize: '18px' }} />
                          <span>{isVisible ? (isRtl ? 'ظاهر للجمهور' : 'Visible') : (isRtl ? 'مخفي' : 'Hidden')}</span>
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableWrapper>
      )}
    </div>
  );
}
