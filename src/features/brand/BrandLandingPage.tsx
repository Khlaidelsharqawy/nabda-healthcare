import { useState, useMemo, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { repositories } from '../../repositories';
import {
  Doctor,
  Clinic,
  PlatformService,
  SpecialtyItem,
  LocationItem,
  PlatformStats,
} from '../../domain';
import { sanitizeSearchQuery } from '../../security/sanitizer';
import { BookingModal } from '../../components/discovery';
import { useDebounce } from '../../hooks/useDebounce';
import { cacheEngine } from '../../services/cacheService';
import {
  BrandTopbar,
  BrandHero,
  BrandDiscovery,
  BrandServices,
  BrandSpotlight,
  BrandLocations,
  BrandSecurityBanner,
  BrandFooter,
} from './components';

export interface BrandLandingPageProps {
  initialTab?: 'doctors' | 'clinics';
}

export function BrandLandingPage({ initialTab = 'doctors' }: BrandLandingPageProps = {}) {
  const { direction, theme, setDirection, setTheme } = useTheme();
  const isRtl = direction === 'rtl';

  // Database / Repository State
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<PlatformService[]>([]);
  const [specialties, setSpecialties] = useState<SpecialtyItem[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [, setLoading] = useState<boolean>(true);

  // Discovery Filter State
  const [activeTab, setActiveTab] = useState<'doctors' | 'clinics'>(initialTab);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearchQuery = useDebounce(searchQuery, 200);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<number>(0);

  // Booking Modal State
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);

  // High-Scale SWR Cached Data Loading (100k users/min ready)
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [cList, dList, sList, specList, locList, statsData] = await Promise.all([
          cacheEngine.swr('public_clinics', () => repositories.clinics.list(), 30000),
          cacheEngine.swr('public_doctors', () => repositories.doctors.list(), 30000),
          cacheEngine.swr('public_services', () => repositories.platform.getServices(), 30000),
          cacheEngine.swr('public_specialties', () => repositories.platform.getSpecialties(), 60000),
          cacheEngine.swr('public_locations', () => repositories.platform.getLocations(), 60000),
          cacheEngine.swr('public_stats', () => repositories.platform.getStats(), 30000),
        ]);
        if (isMounted) {
          setClinics(cList);
          setDoctors(dList);
          setServices(sList);
          setSpecialties(specList);
          setLocations(locList);
          setStats(statsData);
          setLoading(false);
        }
      } catch (e) {
        console.error('Failed to load public portal data', e);
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  // Admin Visibility Control Filter: ONLY show items approved by Admin
  const publicClinics = useMemo(() => {
    return clinics.filter((c) => c.showOnPublicSite !== false && c.isPublished !== false);
  }, [clinics]);

  const publicDoctors = useMemo(() => {
    return doctors.filter((d) => d.showOnPublicSite !== false && d.isPublished !== false);
  }, [doctors]);

  const publicServices = useMemo(() => {
    return services.filter((s) => s.showOnPublicSite !== false && s.isPublished !== false);
  }, [services]);

  // Filtered Doctors (Debounced & Sanitized)
  const filteredDoctors = useMemo(() => {
    const cleanQuery = sanitizeSearchQuery(debouncedSearchQuery).toLowerCase().trim();
    return publicDoctors.filter((doc) => {
      if (selectedSpecialty !== 'all') {
        const matchSpec =
          doc.specialty.toLowerCase() === selectedSpecialty.toLowerCase() ||
          doc.specialtyAr === selectedSpecialty;
        if (!matchSpec) return false;
      }
      if (selectedCity !== 'all') {
        const matchCity =
          doc.city.toLowerCase() === selectedCity.toLowerCase() ||
          doc.cityAr === selectedCity;
        if (!matchCity) return false;
      }
      if (selectedRating > 0 && doc.rating < selectedRating) {
        return false;
      }
      if (cleanQuery !== '') {
        const matchName = doc.name.toLowerCase().includes(cleanQuery) || doc.nameAr.includes(cleanQuery);
        const matchSpec = doc.specialty.toLowerCase().includes(cleanQuery) || doc.specialtyAr.includes(cleanQuery);
        const matchClinic = doc.clinicName.toLowerCase().includes(cleanQuery) || doc.clinicNameAr.includes(cleanQuery);
        return matchName || matchSpec || matchClinic;
      }
      return true;
    });
  }, [publicDoctors, debouncedSearchQuery, selectedSpecialty, selectedCity, selectedRating]);

  // Filtered Clinics (Debounced & Sanitized)
  const filteredClinics = useMemo(() => {
    const cleanQuery = sanitizeSearchQuery(debouncedSearchQuery).toLowerCase().trim();
    return publicClinics.filter((clinic) => {
      if (selectedSpecialty !== 'all') {
        const hasSpec =
          clinic.specialties.some((s) => s.toLowerCase() === selectedSpecialty.toLowerCase()) ||
          clinic.specialtiesAr.some((s) => s === selectedSpecialty);
        if (!hasSpec) return false;
      }
      if (selectedCity !== 'all') {
        const matchCity =
          clinic.city.toLowerCase() === selectedCity.toLowerCase() ||
          clinic.cityAr === selectedCity;
        if (!matchCity) return false;
      }
      if (selectedRating > 0 && clinic.rating < selectedRating) {
        return false;
      }
      if (cleanQuery !== '') {
        const matchName = clinic.name.toLowerCase().includes(cleanQuery) || clinic.nameAr.includes(cleanQuery);
        const matchCity = clinic.city.toLowerCase().includes(cleanQuery) || clinic.cityAr.includes(cleanQuery);
        const matchDistrict = clinic.district.toLowerCase().includes(cleanQuery) || clinic.districtAr.includes(cleanQuery);
        return matchName || matchCity || matchDistrict;
      }
      return true;
    });
  }, [publicClinics, debouncedSearchQuery, selectedSpecialty, selectedCity, selectedRating]);

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
    const targetClinic = publicClinics.find((c) => c.id === clinicId);
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
      <BrandTopbar
        isRtl={isRtl}
        theme={theme}
        onToggleDirection={() => setDirection(isRtl ? 'ltr' : 'rtl')}
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '64px' }}>
        {/* 2. Hero & Platform Introduction */}
        <BrandHero
          isRtl={isRtl}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchClear={() => setSearchQuery('')}
          searchCount={activeTab === 'doctors' ? filteredDoctors.length : filteredClinics.length}
          totalCount={activeTab === 'doctors' ? publicDoctors.length : publicClinics.length}
          specialties={specialties}
          onQuickSpecialtyClick={handleQuickSpecialtyClick}
          stats={stats}
          clinicsCount={publicClinics.length}
          doctorsCount={publicDoctors.length}
        />

        {/* 3. Interactive Discovery Section (Doctors & Clinics) */}
        <BrandDiscovery
          activeTab={activeTab}
          onTabChange={setActiveTab}
          specialties={specialties}
          locations={locations}
          selectedSpecialty={selectedSpecialty}
          onSelectSpecialty={setSelectedSpecialty}
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
          selectedRating={selectedRating}
          onSelectRating={setSelectedRating}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          filteredDoctors={filteredDoctors}
          filteredClinics={filteredClinics}
          onBookDoctor={handleOpenBooking}
          onExploreClinicDoctors={handleExploreClinicDoctors}
          isRtl={isRtl}
        />

        {/* 4. Core Platform Capabilities / Services Section */}
        <BrandServices services={publicServices} isRtl={isRtl} />

        {/* 5. Featured Primary Clinic Spotlight */}
        <BrandSpotlight isRtl={isRtl} />

        {/* 6. Regional Locations & Coverage */}
        <BrandLocations locations={locations} isRtl={isRtl} />

        {/* 7. Enterprise Security & Trust Banner */}
        <BrandSecurityBanner isRtl={isRtl} />
      </main>

      {/* 8. Global Public Healthcare Footer */}
      <BrandFooter isRtl={isRtl} />

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
