import { useState, useMemo } from 'react';
import { MaterialIcon, Button, Badge, Panel } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { brandMessages } from '../../i18n/messages';
import {
  mockClinics,
  mockDoctors,
  mockPlatformServices,
  mockSpecialties,
  mockLocations,
  demoPlatformStats,
  queryDoctors,
  queryClinics,
  Doctor,
  Clinic,
} from '../../data/mock';
import {
  DoctorCard,
  ClinicCard,
  ServiceCard,
  SearchBar,
  FilterBar,
  BookingModal,
  RatingDisplay,
} from '../../components/discovery';

export interface BrandLandingPageProps {
  initialTab?: 'doctors' | 'clinics';
}

export function BrandLandingPage({ initialTab = 'doctors' }: BrandLandingPageProps = {}) {
  const { direction, theme, setDirection, setTheme } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? brandMessages.ar : brandMessages.en;

  // Discovery State
  const [activeTab, setActiveTab] = useState<'doctors' | 'clinics'>(initialTab);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<number>(0);

  // Booking Modal State
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);

  // Filtered Doctors
  const filteredDoctors = useMemo(() => {
    return queryDoctors({
      searchQuery,
      specialty: selectedSpecialty,
      city: selectedCity,
      minRating: selectedRating,
    });
  }, [searchQuery, selectedSpecialty, selectedCity, selectedRating]);

  // Filtered Clinics
  const filteredClinics = useMemo(() => {
    return queryClinics({
      searchQuery,
      specialty: selectedSpecialty,
      city: selectedCity,
      minRating: selectedRating,
    });
  }, [searchQuery, selectedSpecialty, selectedCity, selectedRating]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedSpecialty !== 'all' ||
    selectedCity !== 'all' ||
    selectedRating > 0;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('all');
    setSelectedCity('all');
    setSelectedRating(0);
  };

  const handleOpenBooking = (doctor: Doctor) => {
    setBookingDoctor(doctor);
    setIsBookingOpen(true);
  };

  const handleExploreClinicDoctors = (clinicId: string) => {
    setActiveTab('doctors');
    const targetClinic = mockClinics.find((c) => c.id === clinicId);
    if (targetClinic) {
      setSearchQuery(isRtl ? targetClinic.nameAr : targetClinic.name);
    }
    const discoveryEl = document.getElementById('public-discovery-section');
    if (discoveryEl) {
      discoveryEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickSpecialtyClick = (specialtyId: string) => {
    setSelectedSpecialty(specialtyId);
    setActiveTab('doctors');
    const discoveryEl = document.getElementById('public-discovery-section');
    if (discoveryEl) {
      discoveryEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="brand-page public-healthcare-portal"
      data-direction={isRtl ? 'rtl' : 'ltr'}
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-main, #f8fafc)',
        color: 'var(--text-main, #0f172a)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 1. Global Public Topbar */}
      <header
        className="brand-page__topbar"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'var(--surface-primary, #ffffff)',
          borderBottom: '1px solid var(--border-default, #e2e8f0)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a
            href="/"
            className="aegis-brand"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
          >
            <span
              className="aegis-brand__mark"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: '#087443',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialIcon name="medical_information" style={{ fontSize: '22px' }} />
            </span>
            <div className="aegis-brand__text" style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                className="aegis-brand__title"
                style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main, #0f172a)', lineHeight: '1.2' }}
              >
                {isRtl ? 'منظومة عافية' : 'AegisHealth'}
              </span>
              <span
                className="aegis-brand__subtitle"
                style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#087443', letterSpacing: '0.05em' }}
              >
                {isRtl ? 'المنظومة السريرية الموحدة' : 'CLINICAL ECOSYSTEM'}
              </span>
            </div>
          </a>

          {/* Nav Links */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
            className="public-portal-nav"
          >
            <a
              href="#public-discovery-section"
              style={{ color: 'var(--text-main, #334155)', textDecoration: 'none' }}
            >
              {isRtl ? 'الأطباء والعيادات' : 'Doctors & Clinics'}
            </a>
            <a
              href="#public-services-section"
              style={{ color: 'var(--text-main, #334155)', textDecoration: 'none' }}
            >
              {isRtl ? 'الخدمات السريرية' : 'Services'}
            </a>
            <a
              href="#public-demo-clinics-section"
              style={{ color: 'var(--text-main, #334155)', textDecoration: 'none' }}
            >
              {isRtl ? 'المجمعات التجريبية' : 'Demo Clinics'}
            </a>
            <a
              href="/clinic/al-nour"
              style={{ color: '#087443', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <MaterialIcon name="local_hospital" style={{ fontSize: '16px' }} />
              <span>{isRtl ? 'مجمع عافية الطبي التجريبي' : 'AegisHealth Demo Center'}</span>
            </a>
          </nav>
        </div>

        {/* Topbar Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button
            variant="ghost"
            size="sm"
            icon="translate"
            onClick={() => setDirection(isRtl ? 'ltr' : 'rtl')}
            aria-label={isRtl ? 'تغيير اللغة' : 'Toggle language'}
          >
            {isRtl ? 'English' : 'العربية'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            icon={theme === 'light' ? 'dark_mode' : 'light_mode'}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label={isRtl ? 'تغيير المظهر' : 'Toggle theme'}
          />

          <a
            href="/login"
            className="ui-btn ui-btn--primary ui-btn--sm"
            style={{ textDecoration: 'none', marginLeft: '6px' }}
          >
            <MaterialIcon name="login" />
            <span>{isRtl ? 'دخول المنظومة' : 'Portal Login'}</span>
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '64px' }}>
        {/* 2. Hero & Platform Introduction */}
        <section
          className="brand-hero-healthcare"
          style={{
            background: 'linear-gradient(180deg, var(--surface-primary, #ffffff) 0%, rgba(8, 116, 67, 0.04) 100%)',
            borderBottom: '1px solid var(--border-default, #e2e8f0)',
            padding: '56px 24px 44px 24px',
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '24px',
            }}
          >
            <Badge variant="brand" size="md" icon="health_and_safety">
              {isRtl ? 'المنصة التشغيلية للعيادات التخصصية والرعاية الخارجية' : 'Specialist Outpatient Clinical Operations & Care Platform'}
            </Badge>

            <h1
              style={{
                fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
                fontWeight: 800,
                color: 'var(--text-main, #0f172a)',
                margin: 0,
                lineHeight: '1.2',
                maxWidth: '920px',
              }}
            >
              {isRtl
                ? 'منظومة تشغيل العيادات التخصصية ورعاية المرضى'
                : 'Healthcare Operating Platform for Specialty Clinics & Patient Care'}
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 1.8vw, 1.1875rem)',
                color: 'var(--text-muted, #4e6153)',
                lineHeight: '1.6',
                margin: 0,
                maxWidth: '780px',
              }}
            >
              {isRtl
                ? 'بنية رقمية موحدة لإدارة العيادات والمجمعات الطبية، وتنسيق الأطباء والاستشاريين، وبوابات المرضى مع التوثيق السريري الذكي وتكامل المختبرات والوصفات الدوائية.'
                : 'Unified operating infrastructure connecting clinic administration, attending clinicians, and patient health portals with ambient clinical intelligence, diagnostics, and prescription workflows.'}
            </p>

            {/* Live Search Bar embedded directly in Hero */}
            <div
              style={{
                width: '100%',
                maxWidth: '740px',
                marginTop: '12px',
                boxShadow: '0 10px 25px -5px rgba(8, 116, 67, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                borderRadius: '10px',
              }}
            >
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
                count={activeTab === 'doctors' ? filteredDoctors.length : filteredClinics.length}
                totalCount={activeTab === 'doctors' ? mockDoctors.length : mockClinics.length}
                isRtl={isRtl}
              />
            </div>

            {/* Quick Specialty Clickable Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', maxWidth: '800px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted, #4e6153)', alignSelf: 'center' }}>
                {isRtl ? 'التخصصات الأكثر طلباً:' : 'Popular Specialties:'}
              </span>
              {mockSpecialties.slice(1, 6).map((spec) => (
                <button
                  key={spec.id}
                  type="button"
                  onClick={() => handleQuickSpecialtyClick(spec.id)}
                  style={{
                    backgroundColor: 'var(--surface-primary, #ffffff)',
                    border: '1px solid var(--border-default, #cbd5e1)',
                    borderRadius: '20px',
                    padding: '4px 12px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#087443',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <MaterialIcon name={spec.icon} style={{ fontSize: '14px' }} />
                  <span>{isRtl ? spec.nameAr : spec.name}</span>
                </button>
              ))}
            </div>

            {/* Demonstration Scale Metrics Row (Honest Prototype Scale) */}
            <div
              style={{
                width: '100%',
                maxWidth: '960px',
                marginTop: '16px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border-default, #e2e8f0)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: '#087443',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {isRtl ? 'مؤشرات بيئة العرض التجريبي والنموذج الأولي' : 'Platform Demonstration Scale • Prototype Sample Data'}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '20px',
                  width: '100%',
                }}
              >
                <div>
                  <strong style={{ fontSize: '1.75rem', fontWeight: 800, color: '#087443', display: 'block' }}>
                    {demoPlatformStats.clinics}
                  </strong>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted, #4e6153)' }}>
                    {isRtl ? 'عيادة ومجمع تجريبي' : 'Demo Clinics'}
                  </span>
                </div>
                <div>
                  <strong style={{ fontSize: '1.75rem', fontWeight: 800, color: '#087443', display: 'block' }}>
                    {demoPlatformStats.doctors}
                  </strong>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted, #4e6153)' }}>
                    {isRtl ? 'طبيباً واستشارياً (بيانات تجريبية)' : 'Demo Clinicians'}
                  </span>
                </div>
                <div>
                  <strong style={{ fontSize: '1.75rem', fontWeight: 800, color: '#087443', display: 'block' }}>
                    {demoPlatformStats.specialties}
                  </strong>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted, #4e6153)' }}>
                    {isRtl ? 'تخصصاً سريرياً نموذجياً' : 'Demo Specialties'}
                  </span>
                </div>
                <div>
                  <strong style={{ fontSize: '1.75rem', fontWeight: 800, color: '#087443', display: 'block' }}>
                    {demoPlatformStats.appointments.toLocaleString()}
                  </strong>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted, #4e6153)' }}>
                    {isRtl ? 'استشارة مسجلة في النموذج' : 'Demo Consultations'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Interactive Discovery Section (Doctors & Clinics) */}
        <section
          id="public-discovery-section"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            padding: '0 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <Badge variant="brand" icon="search">
                {isRtl ? 'الدليل التفاعلي الموحد' : 'Unified Public Directory'}
              </Badge>
              <h2
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: 'var(--text-main, #0f172a)',
                  margin: '8px 0 4px 0',
                }}
              >
                {isRtl ? 'استكشف الأطباء والعيادات التخصصية' : 'Explore Doctors & Specialist Clinics'}
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted, #64748b)', margin: 0 }}>
                {isRtl
                  ? 'اختر التخصص والمدينة لاستعراض الأطباء المتاحين وحجز مواعيد الاستشارات التجريبية.'
                  : 'Filter by clinical specialty and city to explore available clinicians and book simulated consultations.'}
              </p>
            </div>

            {/* Tab Switcher: Doctors vs Clinics */}
            <div
              style={{
                display: 'inline-flex',
                padding: '4px',
                borderRadius: '8px',
                backgroundColor: 'var(--surface-subtle)',
                border: '1px solid var(--border-default)',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('doctors')}
                style={{
                  padding: '8px 18px',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: activeTab === 'doctors' ? 700 : 500,
                  backgroundColor: activeTab === 'doctors' ? 'var(--surface-primary)' : 'transparent',
                  color: activeTab === 'doctors' ? '#087443' : 'var(--text-muted)',
                  boxShadow: activeTab === 'doctors' ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <MaterialIcon name="groups" style={{ fontSize: '18px' }} />
                <span>{isRtl ? 'الأطباء والاستشاريون' : 'Attending Doctors'}</span>
                <span
                  style={{
                    backgroundColor: activeTab === 'doctors' ? 'rgba(8, 116, 67, 0.14)' : 'var(--surface-muted)',
                    color: activeTab === 'doctors' ? '#087443' : 'var(--text-muted)',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                  }}
                >
                  {filteredDoctors.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('clinics')}
                style={{
                  padding: '8px 18px',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: activeTab === 'clinics' ? 700 : 500,
                  backgroundColor: activeTab === 'clinics' ? 'var(--surface-primary)' : 'transparent',
                  color: activeTab === 'clinics' ? '#087443' : 'var(--text-muted)',
                  boxShadow: activeTab === 'clinics' ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <MaterialIcon name="storefront" style={{ fontSize: '18px' }} />
                <span>{isRtl ? 'المجمعات التجريبية' : 'Demo Clinics'}</span>
                <span
                  style={{
                    backgroundColor: activeTab === 'clinics' ? 'rgba(8, 116, 67, 0.14)' : 'var(--surface-muted)',
                    color: activeTab === 'clinics' ? '#087443' : 'var(--text-muted)',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                  }}
                >
                  {filteredClinics.length}
                </span>
              </button>
            </div>
          </div>

          {/* Interactive Filter Bar */}
          <Panel variant="elevated" padding="md" style={{ borderRadius: '10px', border: '1px solid var(--border-default, #e2e8f0)' }}>
            <FilterBar
              specialties={mockSpecialties}
              locations={mockLocations}
              selectedSpecialty={selectedSpecialty}
              onSelectSpecialty={setSelectedSpecialty}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
              selectedRating={selectedRating}
              onSelectRating={setSelectedRating}
              onResetFilters={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
              isRtl={isRtl}
            />
          </Panel>

          {/* Results Grid */}
          {activeTab === 'doctors' ? (
            filteredDoctors.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                  gap: '20px',
                }}
              >
                {filteredDoctors.map((doc) => (
                  <DoctorCard
                    key={doc.id}
                    doctor={doc}
                    onBook={handleOpenBooking}
                    isRtl={isRtl}
                  />
                ))}
              </div>
            ) : (
              /* Empty Search State */
              <div
                style={{
                  padding: '48px 24px',
                  textAlign: 'center',
                  backgroundColor: 'var(--surface-primary, #ffffff)',
                  borderRadius: '12px',
                  border: '1px dashed var(--border-default, #cbd5e1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <MaterialIcon name="person_search" style={{ fontSize: '48px', color: 'var(--text-muted, #94a3b8)' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  {isRtl ? 'لم يتم العثور على أطباء مطابقين لخيارات البحث' : 'No Doctors Match Current Filters'}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted, #64748b)', maxWidth: '440px', margin: 0 }}>
                  {isRtl
                    ? 'جرب تغيير التخصص السريري، أو اختيار مدينة أخرى، أو إعادة تعيين معايير البحث.'
                    : 'Try broadening your search query, switching specialties, or resetting active filters.'}
                </p>
                <Button variant="primary" size="sm" icon="refresh" onClick={handleResetFilters}>
                  {isRtl ? 'إعادة ضبط كل الفلاتر' : 'Reset All Filters'}
                </Button>
              </div>
            )
          ) : (
            /* Clinics Tab */
            filteredClinics.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                  gap: '20px',
                }}
              >
                {filteredClinics.map((clinic) => (
                  <ClinicCard
                    key={clinic.id}
                    clinic={clinic}
                    onExploreDoctors={handleExploreClinicDoctors}
                    isRtl={isRtl}
                  />
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: '48px 24px',
                  textAlign: 'center',
                  backgroundColor: 'var(--surface-primary, #ffffff)',
                  borderRadius: '12px',
                  border: '1px dashed var(--border-default, #cbd5e1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <MaterialIcon name="domain_disabled" style={{ fontSize: '48px', color: 'var(--text-muted, #94a3b8)' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  {isRtl ? 'لم يتم العثور على مجمعات طبية مطابقة' : 'No Clinics Match Current Filters'}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted, #64748b)', maxWidth: '440px', margin: 0 }}>
                  {isRtl
                    ? 'جرب اختيار مدينة أخرى أو مسح الكلمات المفتاحية في حقل البحث.'
                    : 'Try selecting a different city or clearing the search keyword.'}
                </p>
                <Button variant="primary" size="sm" icon="refresh" onClick={handleResetFilters}>
                  {isRtl ? 'إعادة ضبط الفلاتر' : 'Reset All Filters'}
                </Button>
              </div>
            )
          )}
        </section>

        {/* 4. AegisHealth Core Platform Capabilities / Services Section */}
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
                ? 'من حجز الاستشارة حتى التوثيق الصوتي والوصفات الدوائية، توفر عافية تجربة رعاية صحية رقمية موحدة.'
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
            {mockPlatformServices.map((service) => (
              <ServiceCard key={service.id} service={service} isRtl={isRtl} />
            ))}
          </div>
        </section>

        {/* 5. Featured Primary Clinic Spotlight (AegisHealth Demo Medical Center) */}
        <section
          id="public-demo-clinics-section"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            padding: '0 24px',
          }}
        >
          <Panel
            variant="elevated"
            style={{
              borderRadius: '16px',
              padding: '32px',
              backgroundColor: 'var(--surface-primary, #ffffff)',
              border: '1px solid var(--border-default, #e2e8f0)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '32px',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Badge variant="brand" icon="local_hospital">
                    {isRtl ? 'المركز الطبي النموذجي (نموذج تجريبي)' : 'Flagship Demo Clinical Center'}
                  </Badge>
                  <RatingDisplay rating={4.9} reviewCount={342} isRtl={isRtl} />
                </div>

                <h2
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: 'var(--text-main, #0f172a)',
                    margin: 0,
                    lineHeight: '1.3',
                  }}
                >
                  {isRtl ? 'مجمع عافية الطبي التجريبي — المركز النموذجي' : 'AegisHealth Demo Medical Center — Flagship Demo'}
                </h2>

                <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted, #4e6153)', lineHeight: '1.6', margin: 0 }}>
                  {isRtl
                    ? 'يعد مجمع عافية الطبي المنشأة النموذجية التجريبية في بيئة عافية، ويضم عيادات استشارية في أمراض القلب والطب الباطني والأطفال، ومختبرات تشخيصية رقمية تعمل بالتكامل مع المنظومة السحابية.'
                    : 'AegisHealth Demo Medical Center serves as our flagship demonstration facility, housing comprehensive outpatient suites across cardiology, internal medicine, pediatrics, and integrated digital pathology.'}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MaterialIcon name="location_on" style={{ color: '#087443' }} />
                    <span>{isRtl ? '[عنوان المنشأة التجريبية — القطاع ١]، [المنطقة أ — تجريبي]' : '[Demo Facility Address — Sector 1], [City / Area — Demo A]'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MaterialIcon name="schedule" style={{ color: '#087443' }} />
                    <span>{isRtl ? 'السبت – الخميس: ٠٨:٠٠ ص – ١٠:٠٠ م (طوارئ الحالات الخفيفة متاحة)' : 'Sat – Thu: 08:00 AM – 10:00 PM (Urgent Care Available)'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MaterialIcon name="phone" style={{ color: '#087443' }} />
                    <span>[Demo Contact]</span>
                  </div>
                </div>

                {/* Direct Action Links to Al-Nour Pages */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                  <a
                    href="/clinic/al-nour"
                    className="ui-btn ui-btn--primary ui-btn--md"
                    style={{ textDecoration: 'none' }}
                  >
                    <MaterialIcon name="storefront" />
                    <span>{isRtl ? 'بوابة المجمع وحجز المواعيد' : 'Demo Center Hub'}</span>
                  </a>

                  <a
                    href="/clinic/al-nour/doctors"
                    className="ui-btn ui-btn--outline ui-btn--md"
                    style={{ textDecoration: 'none' }}
                  >
                    <MaterialIcon name="groups" />
                    <span>{isRtl ? 'أطباء واستشاريو المركز التجريبي' : 'Demo Center Doctors'}</span>
                  </a>

                  <a
                    href="/clinic/al-nour/services"
                    className="ui-btn ui-btn--ghost ui-btn--md"
                    style={{ textDecoration: 'none' }}
                  >
                    <MaterialIcon name="medical_services" />
                    <span>{isRtl ? 'الخدمات السريرية' : 'Clinic Services'}</span>
                  </a>
                </div>
              </div>

              {/* Clinic Highlights Panel */}
              <div
                style={{
                  backgroundColor: 'var(--surface-subtle)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-default)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main, #0f172a)' }}>
                  {isRtl ? 'القدرات السريرية والتشغيلية في المجمع التجريبي النموذجي:' : 'Core Clinical & Operating Capabilities (Demo Facility):'}
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { title: isRtl ? 'توثيق سريري ذكي بالصوت' : 'Ambient AI Scribe SOAP Documentation', icon: 'mic' },
                    { title: isRtl ? 'نتائج الفحوصات المخبرية الرقمية الفورية' : 'Instant Digital Laboratory Diagnostic Integration', icon: 'biotech' },
                    { title: isRtl ? 'وصفات إلكترونية ومتابعة تجديد الأدوية' : 'Electronic Prescriptions & Refill Authorization', icon: 'prescriptions' },
                    { title: isRtl ? 'فرز سريري استشاري متعدد التخصصات' : 'Multidisciplinary Senior Consultant Triage', icon: 'medical_information' },
                  ].map((item) => (
                    <li key={item.title} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem' }}>
                      <span
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(8, 116, 67, 0.1)',
                          color: '#087443',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <MaterialIcon name={item.icon} style={{ fontSize: '16px' }} />
                      </span>
                      <span>{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Panel>
        </section>

        {/* 6. Regional Locations & Coverage */}
        <section
          id="public-locations-section"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            padding: '0 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
            <Badge variant="brand" icon="location_city">
              {isRtl ? 'التغطية الجغرافية' : 'Regional Network'}
            </Badge>
            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--text-main, #0f172a)',
                margin: '8px 0 4px 0',
              }}
            >
              {isRtl ? 'توزيع شبكة المجمعات الطبية التجريبية (نموذج محاكاة)' : 'Clinic Network Distribution (Demonstration Prototype)'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted, #64748b)', margin: 0 }}>
              {isRtl
                ? 'مراكز طبية تخصصية متصلة برقمية موحدة في مختلف المناطق التجريبية المعتمدة.'
                : 'Seamlessly connected multi-specialty centers located across demonstration healthcare sectors.'}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            {mockLocations.slice(1).map((loc) => (
              <div
                key={loc.id}
                style={{
                  padding: '20px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--surface-primary, #ffffff)',
                  border: '1px solid var(--border-default, #e2e8f0)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main, #0f172a)' }}>
                    {isRtl ? loc.cityAr : loc.city}
                  </h4>
                  <Badge variant="outline" size="sm">
                    {isRtl ? `${loc.clinicCount} مجمعات` : `${loc.clinicCount} Centers`}
                  </Badge>
                </div>
                <span style={{ fontSize: '0.78125rem', color: 'var(--text-muted, #64748b)' }}>
                  {isRtl ? loc.districtAr : loc.district}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#087443', marginTop: '4px' }}>
                  {isRtl ? `${loc.doctorCount} أطباء متاحون للحجز` : `${loc.doctorCount} Doctors Available`}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Enterprise Security & Trust Banner */}
        <section
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            padding: '0 24px',
          }}
        >
          <div
            style={{
              padding: '24px',
              borderRadius: '12px',
              backgroundColor: 'rgba(8, 116, 67, 0.08)',
              border: '1px solid rgba(8, 116, 67, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '780px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#087443',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <MaterialIcon name="shield" style={{ fontSize: '24px' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 4px 0', color: '#087443' }}>
                  {isRtl ? 'معايير خصوصية وأمان البيانات الصحية متعددة المستأجرين' : 'Healthcare Privacy & Multi-Tenant Security Standards'}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-main, #334155)', margin: 0, lineHeight: '1.45' }}>
                  {isRtl
                    ? 'تعتمد المنصة تصميماً مؤسسياً يضمن العزل الصارم لبيانات المنشآت الطبية، والتشفير الشامل للسجلات الصحية وفق المعايير السريرية الوطنية دون تدريب النماذج العامة على بيانات المرضى.'
                    : 'Built with enterprise multi-tenant isolation, encrypted health record storage, and strict national privacy compliance with zero model training on patient records.'}
                </p>
              </div>
            </div>

            <a
              href="/login"
              className="ui-btn ui-btn--primary ui-btn--md"
              style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              <MaterialIcon name="admin_panel_settings" />
              <span>{isRtl ? 'بوابة الممارسين والمسؤولين' : 'Practitioner Portal'}</span>
            </a>
          </div>
        </section>
      </main>

      {/* 8. Global Public Healthcare Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-default, #e2e8f0)',
          backgroundColor: 'var(--surface-primary, #ffffff)',
          padding: '40px 24px 28px 24px',
          marginTop: 'auto',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Column 1: Brand */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MaterialIcon name="medical_information" style={{ fontSize: '20px', color: '#087443' }} />
                <strong style={{ fontSize: '1rem', color: 'var(--text-main, #0f172a)' }}>
                  {isRtl ? 'منظومة عافية الطبية' : 'AegisHealth Clinical'}
                </strong>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted, #64748b)', margin: 0, lineHeight: '1.5' }}>
                {isRtl
                  ? 'منصة الرعاية الصحية السحابية المتكاملة للعيادات التخصصية والمرضى.'
                  : 'Multi-tenant healthcare cloud platform connecting clinics, specialists, and patients.'}
              </p>
            </div>

            {/* Column 2: Public Navigation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>
                {isRtl ? 'الخدمات العامة' : 'Public Access'}
              </span>
              <a href="#public-discovery-section" style={{ color: 'var(--text-muted, #64748b)', textDecoration: 'none' }}>
                {isRtl ? 'البحث عن طبيب' : 'Find a Doctor'}
              </a>
              <a href="/clinic/al-nour" style={{ color: 'var(--text-muted, #64748b)', textDecoration: 'none' }}>
                {isRtl ? 'مجمع عافية الطبي التجريبي' : 'AegisHealth Demo Medical Center'}
              </a>
              <a href="/clinic/al-nour/doctors" style={{ color: 'var(--text-muted, #64748b)', textDecoration: 'none' }}>
                {isRtl ? 'استشاريو مجمع عافية' : 'AegisHealth Demo Attending Staff'}
              </a>
              <a href="/clinic/al-nour/services" style={{ color: 'var(--text-muted, #64748b)', textDecoration: 'none' }}>
                {isRtl ? 'الخدمات والتحاليل' : 'Clinical Diagnostics'}
              </a>
            </div>

            {/* Column 3: Portals */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>
                {isRtl ? 'بوابات النظام السريري' : 'Workspaces'}
              </span>
              <a href="/login" style={{ color: 'var(--text-muted, #64748b)', textDecoration: 'none' }}>
                {isRtl ? 'تسجيل دخول الممارسين' : 'Staff & Physician Login'}
              </a>
              <a href="/patient/dashboard" style={{ color: 'var(--text-muted, #64748b)', textDecoration: 'none' }}>
                {isRtl ? 'بوابة المريض الصحية' : 'Patient Health Portal'}
              </a>
              <a href="/signup" style={{ color: 'var(--text-muted, #64748b)', textDecoration: 'none' }}>
                {isRtl ? 'تسجيل مريض جديد' : 'New Patient Registration'}
              </a>
              <a href="/request-access" style={{ color: 'var(--text-muted, #64748b)', textDecoration: 'none' }}>
                {isRtl ? 'انضمام منشأة طبية' : 'Clinic Onboarding Request'}
              </a>
            </div>

            {/* Column 4: Emergency Disclaimer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
              <span style={{ fontWeight: 700, color: '#dc2626' }}>
                {isRtl ? 'تنبيه الطوارئ الطبية' : 'Emergency Notice'}
              </span>
              <p style={{ color: 'var(--text-muted, #64748b)', margin: 0, lineHeight: '1.45' }}>
                {isRtl
                  ? 'هذه المنصة مخصصة للمواعيد والعيادات الخارجية المجدولة. في حالات الطوارئ الحرجة يرجى الاتصال فوراً برقم الطوارئ المحلي المعتمد أو التوجه لأقرب مستشفى.'
                  : 'For acute, life-threatening medical emergencies, please dial your local emergency services immediately or proceed to the nearest emergency department.'}
              </p>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid var(--border-default, #e2e8f0)',
              paddingTop: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.75rem',
              color: 'var(--text-muted, #64748b)',
            }}
          >
            <span>
              © 2026 {isRtl ? 'منظومة عافية للرعاية الصحية. جميع الحقوق محفوظة.' : 'AegisHealth Clinical Platform. All rights reserved.'}
            </span>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span>{isRtl ? 'بيانات تجريبية مصرح بها' : 'Demonstration & Simulation Environment'}</span>
              <span>•</span>
              <span>{isRtl ? 'النسخة السريرية v2.4' : 'Clinical Build v2.4'}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 9. Interactive Booking Modal */}
      <BookingModal
        doctor={bookingDoctor}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        isRtl={isRtl}
      />
    </div>
  );
}
