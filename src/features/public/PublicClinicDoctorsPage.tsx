import { useState, useMemo, useEffect } from 'react';
import { PublicClinicShell } from '../../layouts/PublicClinicShell';
import { useTheme } from '../../theme/ThemeProvider';
import { publicMessages } from '../../i18n/messages';
import { MaterialIcon, PageHeader, Panel, Badge, Button } from '../../components/ui';
import { repositories } from '../../repositories';
import { Doctor } from '../../domain';
import { sanitizeSearchQuery } from '../../security/sanitizer';
import { RatingDisplay, SearchBar, BookingModal } from '../../components/discovery';

export function PublicClinicDoctorsPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? publicMessages.ar : publicMessages.en;

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  // Booking Modal
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Real Database Doctors
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const list = await repositories.doctors.list();
        if (isMounted) {
          setAllDoctors(list);
          setLoading(false);
        }
      } catch (e) {
        console.error('Failed to load clinic doctors', e);
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  // Al-Nour specific doctors filtered by Admin visibility
  const alNourDoctors = useMemo(() => {
    return allDoctors.filter(
      (d) => d.clinicId === 'al-nour' && d.showOnPublicSite !== false && d.isPublished !== false
    );
  }, [allDoctors]);

  const filteredDoctors = useMemo(() => {
    const cleanQuery = sanitizeSearchQuery(searchQuery).toLowerCase().trim();
    return alNourDoctors.filter((doc) => {
      if (selectedSpecialty !== 'all' && doc.specialty !== selectedSpecialty) {
        return false;
      }
      if (cleanQuery !== '') {
        const matchName = doc.name.toLowerCase().includes(cleanQuery) || doc.nameAr.includes(cleanQuery);
        const matchSpec = doc.specialty.toLowerCase().includes(cleanQuery) || doc.specialtyAr.includes(cleanQuery);
        return matchName || matchSpec;
      }
      return true;
    });
  }, [alNourDoctors, selectedSpecialty, searchQuery]);

  const specialties = ['all', 'Cardiology', 'Internal Medicine', 'Pediatrics'];

  const handleOpenBooking = (doc: Doctor) => {
    setBookingDoctor(doc);
    setIsBookingOpen(true);
  };

  return (
    <PublicClinicShell>
      <div className="public-clinic-page" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <PageHeader
          kicker={copy.teamKicker}
          kickerIcon="groups"
          title={copy.doctors}
          subtitle={
            isRtl
              ? 'الكوادر الطبية السريرية والاستشاريون في مستشفى النور التخصصي — القاهرة'
              : 'Attending clinical consultants and physicians at Al-Nour Medical Center — Cairo'
          }
        />

        {/* Search & Filter Toolbar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: 'var(--surface-primary, #ffffff)',
            padding: '16px',
            borderRadius: '10px',
            border: '1px solid var(--border-default, #e2e8f0)',
          }}
        >
          <div style={{ maxWidth: '600px', width: '100%' }}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder={isRtl ? 'ابحث باسم الطبيب أو التخصص...' : 'Search doctor by name or specialty...'}
              count={filteredDoctors.length}
              totalCount={alNourDoctors.length}
              isRtl={isRtl}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted, #64748b)' }}>
              {isRtl ? 'تصفية العيادة:' : 'Filter Clinic:'}
            </span>
            {specialties.map((spec) => {
              const isSelected = selectedSpecialty === spec;
              const label =
                spec === 'all'
                  ? isRtl ? 'جميع العيادات' : 'All Clinics'
                  : spec === 'Cardiology'
                  ? isRtl ? 'أمراض القلب' : 'Cardiology'
                  : spec === 'Internal Medicine'
                  ? isRtl ? 'الطب الباطني' : 'Internal Medicine'
                  : isRtl ? 'طب الأطفال' : 'Pediatrics';

              return (
                <button
                  key={spec}
                  type="button"
                  onClick={() => setSelectedSpecialty(spec)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8125rem',
                    fontWeight: isSelected ? 700 : 500,
                    backgroundColor: isSelected ? '#087443' : 'var(--surface-subtle, #f1f5f9)',
                    color: isSelected ? '#ffffff' : 'var(--text-main, #334155)',
                    border: isSelected ? '1px solid #087443' : '1px solid var(--border-default, #cbd5e1)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="public-clinic-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {filteredDoctors.map((doctor) => (
              <Panel
                key={doctor.id}
                variant="elevated"
                padding="lg"
                className="public-doctor-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '10px',
                  border: '1px solid var(--border-default, #e2e8f0)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '12px' }}>
                    <div
                      className="public-doctor-card__avatar"
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(8, 116, 67, 0.1)',
                        color: '#087443',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        border: '2px solid rgba(8, 116, 67, 0.2)',
                        flexShrink: 0,
                      }}
                    >
                      {doctor.avatarLetter}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3
                        className="public-doctor-card__name"
                        style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main, #0f172a)' }}
                      >
                        {isRtl ? doctor.nameAr : doctor.name}
                      </h3>
                      <p
                        className="public-doctor-card__specialty"
                        style={{ fontSize: '0.8125rem', color: '#087443', fontWeight: 600, margin: '2px 0 4px 0' }}
                      >
                        {isRtl ? doctor.titleAr : doctor.title}
                      </p>
                      <RatingDisplay rating={doctor.rating} reviewCount={doctor.reviewCount} isRtl={isRtl} size="sm" />
                    </div>
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted, #64748b)', lineHeight: '1.45', margin: '0 0 12px 0' }}>
                    {isRtl ? doctor.bioAr : doctor.bio}
                  </p>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: doctor.availability === 'today' ? '#f0fdf4' : '#eff6ff',
                      color: doctor.availability === 'today' ? '#166534' : '#1e40af',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: doctor.availability === 'today' ? '#16a34a' : '#2563eb',
                      }}
                    />
                    <span>{isRtl ? doctor.availabilityTextAr : doctor.availabilityText}</span>
                  </div>
                </div>

                <div
                  className="public-doctor-card__footer"
                  style={{
                    borderTop: '1px solid var(--border-default, #e2e8f0)',
                    paddingTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                  }}
                >
                  <Badge variant="brand" icon="verified">
                    {isRtl ? doctor.badgeAr : doctor.badge}
                  </Badge>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Button
                      variant="primary"
                      size="sm"
                      icon="calendar_month"
                      onClick={() => handleOpenBooking(doctor)}
                    >
                      {isRtl ? 'حجز موعد' : 'Book'}
                    </Button>
                    <a
                      href="/clinic/al-nour/booking/confirmed"
                      className="ui-btn ui-btn--outline ui-btn--sm"
                      title={isRtl ? 'معاينة بطاقة الحجز' : 'View Pass'}
                    >
                      <MaterialIcon name="receipt" />
                    </a>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              backgroundColor: 'var(--surface-primary, #ffffff)',
              borderRadius: '8px',
              border: '1px dashed var(--border-default, #cbd5e1)',
            }}
          >
            <MaterialIcon name="person_search" style={{ fontSize: '40px', color: 'var(--text-muted, #94a3b8)' }} />
            <p style={{ marginTop: '8px', color: 'var(--text-muted, #64748b)' }}>
              {isRtl ? 'لا يوجد أطباء مطابقين في مستشفى النور التخصصي' : 'No doctors match query at Al-Nour Medical Center'}
            </p>
            <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setSelectedSpecialty('all'); }}>
              {isRtl ? 'إعادة التعيين' : 'Reset'}
            </Button>
          </div>
        )}

        {/* Interactive Booking Modal */}
        <BookingModal
          doctor={bookingDoctor}
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          isRtl={isRtl}
        />
      </div>
    </PublicClinicShell>
  );
}
