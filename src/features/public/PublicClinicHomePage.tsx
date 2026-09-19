import { useState } from 'react';
import { PublicClinicShell } from '../../layouts/PublicClinicShell';
import { useTheme } from '../../theme/ThemeProvider';
import { publicMessages } from '../../i18n/messages';
import { MaterialIcon, Badge, Panel, PanelHeader, PanelBody, Button } from '../../components/ui';
import { mockClinics, mockDoctors, Doctor } from '../../data/mock';
import { RatingDisplay, LocationDisplay, BookingModal } from '../../components/discovery';

export function PublicClinicHomePage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = isRtl ? publicMessages.ar : publicMessages.en;

  const alNourClinic = mockClinics.find((c) => c.id === 'al-nour') || mockClinics[0];
  const primaryDoctor = mockDoctors.find((d) => d.clinicId === 'al-nour') || mockDoctors[0];

  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleStartBooking = (doc?: Doctor) => {
    setBookingDoctor(doc || primaryDoctor);
    setIsBookingOpen(true);
  };

  return (
    <PublicClinicShell>
      <div className="public-clinic-page" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <section className="public-clinic-hero" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center' }}>
          <div className="public-clinic-hero__content" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Badge variant="brand" icon="local_hospital">
                {copy.clinic}
              </Badge>
              <RatingDisplay rating={alNourClinic.rating} reviewCount={alNourClinic.reviewCount} isRtl={isRtl} />
            </div>

            <h1 className="public-clinic-hero__title" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, margin: 0, lineHeight: '1.2' }}>
              {isRtl ? alNourClinic.nameAr : alNourClinic.name}
            </h1>

            <p className="public-clinic-hero__description" style={{ fontSize: '1rem', color: 'var(--text-muted, #475569)', lineHeight: '1.6', margin: 0 }}>
              {isRtl ? alNourClinic.descriptionAr : alNourClinic.description}
            </p>

            {/* Location Display */}
            <LocationDisplay
              clinic={alNourClinic}
              address={isRtl ? alNourClinic.addressAr : alNourClinic.address}
              city={isRtl ? alNourClinic.cityAr : alNourClinic.city}
              district={isRtl ? alNourClinic.districtAr : alNourClinic.district}
              isRtl={isRtl}
            />

            <div className="public-clinic-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px' }}>
              <Button
                variant="primary"
                size="md"
                icon="calendar_month"
                onClick={() => handleStartBooking(primaryDoctor)}
              >
                {isRtl ? 'حجز موعد استشارة فوري' : 'Book Consultation'}
              </Button>

              <a href="/clinic/al-nour/doctors" className="ui-btn ui-btn--secondary ui-btn--md" style={{ textDecoration: 'none' }}>
                <MaterialIcon name="groups" />
                <span>{copy.team}</span>
              </a>

              <a href="/clinic/al-nour/services" className="ui-btn ui-btn--outline ui-btn--md" style={{ textDecoration: 'none' }}>
                <MaterialIcon name="medical_services" />
                <span>{copy.servicesLink}</span>
              </a>
            </div>
          </div>

          <div className="public-clinic-hero__side">
            <Panel variant="elevated" padding="lg" style={{ borderRadius: '12px', border: '1px solid var(--border-default, #e2e8f0)' }}>
              <PanelHeader
                title={copy.pathways}
                icon="local_hospital"
                tag={<Badge variant="success">Active</Badge>}
              />
              <PanelBody>
                <ul className="public-clinic-highlights" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, margin: 0, listStyle: 'none' }}>
                  {copy.highlights.map((item) => (
                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem' }}>
                      <MaterialIcon name="check_circle" className="public-clinic-highlight__icon" style={{ color: '#087443', fontSize: '18px', flexShrink: 0 }} />
                      <span>{item}</span>
                    </li>
                  ))}
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem' }}>
                    <MaterialIcon name="schedule" style={{ color: '#087443', fontSize: '18px', flexShrink: 0 }} />
                    <span>{isRtl ? alNourClinic.operatingHoursAr : alNourClinic.operatingHours}</span>
                  </li>
                </ul>
              </PanelBody>
            </Panel>
          </div>
        </section>

        {/* Quick Attending Doctors Spotlight */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-main, #0f172a)' }}>
              {isRtl ? 'الاستشاريون المناوبون (المنشأة التجريبية)' : 'Attending Clinicians (Demo Facility)'}
            </h2>
            <a href="/clinic/al-nour/doctors" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#087443', textDecoration: 'none' }}>
              {isRtl ? 'عرض كامل الكادر الطبي ←' : 'View All Doctors →'}
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {mockDoctors
              .filter((d) => d.clinicId === 'al-nour')
              .slice(0, 3)
              .map((doc) => (
                <Panel key={doc.id} variant="default" padding="md" style={{ borderRadius: '8px', border: '1px solid var(--border-default, #e2e8f0)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(8, 116, 67, 0.1)',
                        color: '#087443',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1rem',
                      }}
                    >
                      {doc.avatarLetter}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {isRtl ? doc.nameAr : doc.name}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: '#087443', fontWeight: 600 }}>
                        {isRtl ? doc.specialtyAr : doc.specialty}
                      </span>
                    </div>
                  </div>
                  <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <RatingDisplay rating={doc.rating} reviewCount={doc.reviewCount} isRtl={isRtl} size="sm" />
                    <Button variant="primary" size="sm" icon="calendar_month" onClick={() => handleStartBooking(doc)}>
                      {isRtl ? 'حجز' : 'Book'}
                    </Button>
                  </div>
                </Panel>
              ))}
          </div>
        </section>

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
