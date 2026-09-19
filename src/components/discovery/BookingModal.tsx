import { useState, useEffect, type FormEvent } from 'react';
import { MaterialIcon, Button, Badge } from '../ui';
import { Doctor, Clinic } from '../../data/mock/types';
import { RatingDisplay } from './RatingDisplay';

export interface BookingModalProps {
  doctor: Doctor | null;
  clinic?: Clinic | null;
  isOpen: boolean;
  onClose: () => void;
  isRtl?: boolean;
}

export function BookingModal({
  doctor,
  clinic,
  isOpen,
  onClose,
  isRtl = false,
}: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-17');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientIdNumber, setPatientIdNumber] = useState<string>('');
  const [visitReason, setVisitReason] = useState<string>('Routine Consultation');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);

  // Initialize first slot when doctor changes
  useEffect(() => {
    if (doctor && doctor.availableSlots.length > 0) {
      setSelectedSlot(doctor.availableSlots[0]);
    }
    setConfirmationCode(null);
  }, [doctor]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !doctor) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setIsLoading(true);
    // Simulate booking API reservation
    setTimeout(() => {
      setIsLoading(false);
      const code = `ALN-${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmationCode(code);
    }, 700);
  };

  return (
    <div
      className="discovery-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="discovery-modal-content"
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'var(--surface-primary, #ffffff)',
          borderRadius: '12px',
          border: '1px solid var(--border-default, #e2e8f0)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-default, #e2e8f0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--surface-subtle, #f8fafc)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#087443',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1rem',
              }}
            >
              {doctor.avatarLetter}
            </div>
            <div>
              <h2
                id="booking-modal-title"
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--text-main, #0f172a)',
                  margin: 0,
                }}
              >
                {isRtl ? `حجز موعد استشارة: ${doctor.nameAr}` : `Book Consultation: ${doctor.name}`}
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
                {isRtl ? doctor.specialtyAr : doctor.specialty} • {isRtl ? doctor.clinicNameAr : doctor.clinicName}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            icon="close"
            onClick={onClose}
            aria-label={isRtl ? 'إغلاق' : 'Close'}
          />
        </div>

        {/* Content */}
        {confirmationCode ? (
          /* Confirmation Success State */
          <div
            style={{
              padding: '28px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialIcon name="check_circle" style={{ fontSize: '36px' }} />
            </div>

            <div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--text-main, #0f172a)',
                  margin: '0 0 6px 0',
                }}
              >
                {isRtl ? 'تم تأكيد طلب الحجز المبدئي بنجاح' : 'Appointment Confirmed'}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted, #64748b)', margin: 0, maxWidth: '400px' }}>
                {isRtl
                  ? 'تم تسجيل موعدكم مع الطبيب في النظام السريري. ستصلكم رسالة نصية قصيرة تحتوي على كافة التفاصيل.'
                  : 'Your appointment slot has been reserved in the clinical scheduling system. A confirmation SMS has been dispatched.'}
              </p>
            </div>

            <div
              style={{
                padding: '14px 20px',
                borderRadius: '8px',
                backgroundColor: 'var(--surface-subtle, #f8fafc)',
                border: '1px solid var(--border-default, #e2e8f0)',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                textAlign: isRtl ? 'right' : 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--text-muted, #64748b)' }}>{isRtl ? 'رمز الحجز المرجعي:' : 'Reference Code:'}</span>
                <strong style={{ color: '#087443', fontSize: '1rem' }}>{confirmationCode}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--text-muted, #64748b)' }}>{isRtl ? 'الطبيب المعالج:' : 'Attending Doctor:'}</span>
                <span style={{ fontWeight: 600 }}>{isRtl ? doctor.nameAr : doctor.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--text-muted, #64748b)' }}>{isRtl ? 'التاريخ والوقت:' : 'Date & Time:'}</span>
                <span style={{ fontWeight: 600 }}>{selectedDate} — {selectedSlot}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--text-muted, #64748b)' }}>{isRtl ? 'المنشأة الطبية:' : 'Facility:'}</span>
                <span style={{ fontWeight: 600 }}>{isRtl ? doctor.clinicNameAr : doctor.clinicName}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '8px' }}>
              <a
                href="/clinic/al-nour/booking/confirmed"
                className="ui-btn ui-btn--primary ui-btn--md"
                style={{ flex: 1, textDecoration: 'none', textAlign: 'center', justifyContent: 'center' }}
              >
                <MaterialIcon name="receipt_long" />
                <span>{isRtl ? 'عرض بطاقة الحجز الرسمية' : 'View Official Booking Pass'}</span>
              </a>
              <Button variant="outline" size="md" onClick={onClose} style={{ flex: 1 }}>
                {isRtl ? 'إغلاق النافذة' : 'Dismiss'}
              </Button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Doctor Quick Summary */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(8, 116, 67, 0.05)',
                  border: '1px solid rgba(8, 116, 67, 0.18)',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#087443' }}>
                    {isRtl ? doctor.badgeAr : doctor.badge} • {isRtl ? `${doctor.yearsExperience} سنة خبرة سريرية` : `${doctor.yearsExperience} Years Clinical Exp`}
                  </span>
                  <div style={{ marginTop: '2px' }}>
                    <RatingDisplay rating={doctor.rating} reviewCount={doctor.reviewCount} isRtl={isRtl} size="sm" />
                  </div>
                </div>
                <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted, #64748b)', display: 'block' }}>
                    {isRtl ? 'رسوم الكشف الاستشاري' : 'Consultation Fee'}
                  </span>
                  <strong style={{ color: '#087443', fontSize: '1rem' }}>
                    {doctor.consultationFee} {isRtl ? 'وحدة تجريبية' : 'Demo Credits'}
                  </strong>
                </div>
              </div>

              {/* Date & Time Slot selection */}
              <div>
                <label
                  htmlFor="booking-date-input"
                  style={{
                    display: 'block',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--text-main, #0f172a)',
                    marginBottom: '6px',
                  }}
                >
                  {isRtl ? 'اختر تاريخ الموعد:' : 'Select Appointment Date:'}
                </label>
                <input
                  id="booking-date-input"
                  type="date"
                  value={selectedDate}
                  min="2026-09-16"
                  max="2026-10-30"
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-default, #cbd5e1)',
                    backgroundColor: 'var(--surface-primary, #ffffff)',
                    color: 'var(--text-main, #0f172a)',
                    colorScheme: 'inherit',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--text-main, #0f172a)',
                    marginBottom: '6px',
                  }}
                >
                  {isRtl ? 'المواعيد المتاحة اليوم / غداً:' : 'Available Time Slots:'}
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {doctor.availableSlots.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: isSelected ? '1.5px solid #087443' : '1px solid var(--border-default, #cbd5e1)',
                          backgroundColor: isSelected ? 'rgba(8, 116, 67, 0.1)' : 'var(--surface-primary, #ffffff)',
                          color: isSelected ? '#087443' : 'var(--text-main, #334155)',
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: '0.8125rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <MaterialIcon name="schedule" style={{ fontSize: '14px' }} />
                        <span>{slot}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Patient Basic Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label
                    htmlFor="patient-name-input"
                    style={{
                      display: 'block',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--text-main, #0f172a)',
                      marginBottom: '4px',
                    }}
                  >
                    {isRtl ? 'اسم المراجع ثلاثي:' : 'Patient Full Name:'}
                  </label>
                  <input
                    id="patient-name-input"
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder={isRtl ? 'مثال: اسم المريض بالكامل' : 'e.g. Patient Full Name'}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-default, #cbd5e1)',
                      backgroundColor: 'var(--surface-primary, #ffffff)',
                      color: 'var(--text-main, #0f172a)',
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label
                      htmlFor="patient-phone-input"
                      style={{
                        display: 'block',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: 'var(--text-main, #0f172a)',
                        marginBottom: '4px',
                      }}
                    >
                      {isRtl ? 'رقم الجوال:' : 'Mobile Number:'}
                    </label>
                    <input
                      id="patient-phone-input"
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder={isRtl ? '[رقم هاتف تجريبي]' : '[Demo Contact Number]'}
                      required
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-default, #cbd5e1)',
                        backgroundColor: 'var(--surface-primary, #ffffff)',
                        color: 'var(--text-main, #0f172a)',
                        fontSize: '0.875rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="patient-reason-select"
                      style={{
                        display: 'block',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: 'var(--text-main, #0f172a)',
                        marginBottom: '4px',
                      }}
                    >
                      {isRtl ? 'سبب الزيارة:' : 'Reason for Visit:'}
                    </label>
                    <select
                      id="patient-reason-select"
                      value={visitReason}
                      onChange={(e) => setVisitReason(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-default, #cbd5e1)',
                        fontSize: '0.875rem',
                        backgroundColor: 'var(--surface-primary, #ffffff)',
                        color: 'var(--text-main, #0f172a)',
                        outline: 'none',
                      }}
                    >
                      <option value="Routine Consultation">{isRtl ? 'كشف استشاري روتيني' : 'Routine Consultation'}</option>
                      <option value="Chronic Follow-up">{isRtl ? 'متابعة حالة مزمنة' : 'Chronic Follow-up'}</option>
                      <option value="Second Opinion">{isRtl ? 'أخذ رأي طبي ثانٍ' : 'Second Medical Opinion'}</option>
                      <option value="Diagnostic Review">{isRtl ? 'مراجعة نتائج الفحوصات' : 'Diagnostic Results Review'}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '12px 20px',
                borderTop: '1px solid var(--border-default, #e2e8f0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '10px',
                backgroundColor: 'var(--surface-subtle, #f8fafc)',
              }}
            >
              <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
                {isRtl ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon="calendar_month"
                loading={isLoading}
                disabled={!selectedSlot}
              >
                {isRtl ? 'تأكيد حجز الموعد' : 'Confirm Reservation'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

