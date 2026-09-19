import { Badge, Button, MaterialIcon, Panel } from '../../../components/ui';
import { FilterBar, DoctorCard, ClinicCard } from '../../../components/discovery';
import { Doctor, Clinic, SpecialtyItem, LocationItem } from '../../../domain';

export interface BrandDiscoveryProps {
  activeTab: 'doctors' | 'clinics';
  onTabChange: (tab: 'doctors' | 'clinics') => void;
  specialties: SpecialtyItem[];
  locations: LocationItem[];
  selectedSpecialty: string;
  onSelectSpecialty: (spec: string) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  selectedRating: number;
  onSelectRating: (rating: number) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  filteredDoctors: Doctor[];
  filteredClinics: Clinic[];
  onBookDoctor: (doctor: Doctor) => void;
  onExploreClinicDoctors: (clinicId: string) => void;
  isRtl: boolean;
}

export function BrandDiscovery({
  activeTab,
  onTabChange,
  specialties,
  locations,
  selectedSpecialty,
  onSelectSpecialty,
  selectedCity,
  onSelectCity,
  selectedRating,
  onSelectRating,
  onResetFilters,
  hasActiveFilters,
  filteredDoctors,
  filteredClinics,
  onBookDoctor,
  onExploreClinicDoctors,
  isRtl,
}: BrandDiscoveryProps) {
  return (
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
            onClick={() => onTabChange('doctors')}
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
            onClick={() => onTabChange('clinics')}
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
      <Panel
        variant="elevated"
        padding="md"
        className="glass-card"
        style={{ borderRadius: '10px', border: '1px solid var(--border-default, #e2e8f0)' }}
      >
        <FilterBar
          specialties={specialties}
          locations={locations}
          selectedSpecialty={selectedSpecialty}
          onSelectSpecialty={onSelectSpecialty}
          selectedCity={selectedCity}
          onSelectCity={onSelectCity}
          selectedRating={selectedRating}
          onSelectRating={onSelectRating}
          onResetFilters={onResetFilters}
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
                onBook={onBookDoctor}
                isRtl={isRtl}
              />
            ))}
          </div>
        ) : (
          /* Empty Doctor Search State */
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
            <Button variant="primary" size="sm" icon="refresh" onClick={onResetFilters}>
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
                onExploreDoctors={onExploreClinicDoctors}
                isRtl={isRtl}
              />
            ))}
          </div>
        ) : (
          /* Empty Clinic Search State */
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
            <Button variant="primary" size="sm" icon="refresh" onClick={onResetFilters}>
              {isRtl ? 'إعادة ضبط الفلاتر' : 'Reset All Filters'}
            </Button>
          </div>
        )
      )}
    </section>
  );
}
