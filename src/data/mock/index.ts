import { Clinic, Doctor, PlatformService, SpecialtyItem, LocationItem, PlatformStats } from '../../domain';

export * from './types';

// Helper to get live clinics array from localStorage / repository fallback
export function getLiveClinics(): Clinic[] {
  try {
    const raw = localStorage.getItem('aegis_repo_clinics');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback to default
  }
  return [
    {
      id: 'al-nour',
      name: 'Al-Nour Specialized Medical Center',
      nameAr: 'مجمع النور الطبي التخصصي',
      tagline: 'Multi-Specialty Outpatient Operations & Clinical Excellence',
      taglineAr: 'الريادة في العمليات السريرية والعيادات الخارجية متعددة التخصصات',
      description: 'Premier multi-specialty outpatient medical complex delivering attending consultations, advanced cardiology assessment, diagnostic imaging, and internal medicine.',
      descriptionAr: 'صرح طبي تخصصي رائد يقدم استشارات العيادات المتقدمة، وفحوصات القلب التخصصية، والطب الباطني، والمختبرات التشخيصية بأحدث المعايير.',
      address: 'Olaya District, King Fahd Road',
      addressAr: 'حي العليا، طريق الملك فهد',
      city: 'Riyadh',
      cityAr: 'الرياض',
      district: 'Olaya District',
      districtAr: 'حي العليا',
      phone: '+966 11 234 5678',
      email: 'contact@al-nour.med',
      rating: 4.9,
      reviewCount: 342,
      specialties: ['Cardiology', 'Internal Medicine', 'Pediatrics', 'Diagnostics', 'Endocrinology'],
      specialtiesAr: ['أمراض القلب', 'الطب الباطني', 'طب الأطفال', 'التشخيص والمختبرات', 'الغدد الصماء'],
      operatingHours: 'Saturday – Thursday: 08:00 AM – 10:00 PM',
      operatingHoursAr: 'السبت – الخميس: ٠٨:٠٠ ص – ١٠:٠٠ م',
      isVerified: true,
      badge: 'Accredited Center',
      badgeAr: 'مركز معتمد',
      doctorCount: 14,
      consultationFeeRange: '200 – 350 SAR',
      consultationFeeRangeAr: '٢٠٠ – ٣٥٠ ر.س',
      emergencyAvailable: true,
      isDemo: false,
      mapCoordinates: { latApprox: 24.7136, lngApprox: 46.6753, label: 'Al-Nour Medical Riyadh' },
    },
    {
      id: 'dar-al-shifa',
      name: 'Dar Al-Shifa Clinical Hospital',
      nameAr: 'مستشفى دار الشفاء التخصصي',
      tagline: 'Integrated Comprehensive Healthcare & Modern Surgical Suites',
      taglineAr: 'الرعاية الصحية الشاملة المتكاملة وغرف العمليات الحديثة',
      description: 'Advanced clinical hospital offering 24/7 emergency response, specialized surgical procedures, family medicine, and continuous patient telemetry.',
      descriptionAr: 'مستشفى سريري متكامل يقدم خدمات الطوارئ على مدار الساعة، والعمليات الجراحية التخصصية، وطب الأسرة، ومتابعة المؤشرات الحيوية.',
      address: 'Nasr City, Abbas El-Akkad St',
      addressAr: 'مدينة نصر، شارع عباس العقاد',
      city: 'Cairo',
      cityAr: 'القاهرة',
      district: 'Nasr City',
      districtAr: 'مدينة نصر',
      phone: '+20 2 2456 7890',
      email: 'contact@dar-alshifa.med',
      rating: 4.8,
      reviewCount: 289,
      specialties: ['General Surgery', 'Family Medicine', 'Cardiology', 'Orthopedics'],
      specialtiesAr: ['الجراحة العامة', 'طب الأسرة', 'أمراض القلب', 'طب وجراحة العظام'],
      operatingHours: '24/7 Emergency & Outpatient 09:00 AM – 10:00 PM',
      operatingHoursAr: 'طوارئ ٢٤/٧ والعيادات الخارجية ٠٩:٠٠ ص – ١٠:٠٠ م',
      isVerified: true,
      badge: 'Hospital Grade',
      badgeAr: 'مستشفى متكامل',
      doctorCount: 22,
      consultationFeeRange: '300 – 500 EGP',
      consultationFeeRangeAr: '٣٠٠ – ٥٠٠ ج.م',
      emergencyAvailable: true,
      isDemo: false,
      mapCoordinates: { latApprox: 30.0561, lngApprox: 31.3411, label: 'Dar Al-Shifa Cairo' },
    },
    {
      id: 'future-health',
      name: 'Future Health Integrated Clinics',
      nameAr: 'عيادات صحة المستقبل المتكاملة',
      tagline: 'AI-Driven Preventative Health & Specialized Chronic Disease Care',
      taglineAr: 'الرعاية الصحية الوقائية المعززة بالذكاء الاصطناعي وإدارة الأمراض المزمنة',
      description: 'Next-generation clinical facility integrating AI-driven diagnostic screening, cardiology wellness protocols, and precision outpatient management.',
      descriptionAr: 'مركز طبي متقدم يدمج الفحوصات التشخيصية المعززة بالذكاء الاصطناعي، ومتابعة صحة القلب، والإدارة الدقيقة للعيادات الخارجية.',
      address: 'Dubai Healthcare City, Building 64',
      addressAr: 'مدينة دبي الطبية، مبنى ٦٤',
      city: 'Dubai',
      cityAr: 'دبي',
      district: 'Healthcare City',
      districtAr: 'مدينة دبي الطبية',
      phone: '+971 4 382 9100',
      email: 'info@futurehealth.ae',
      rating: 4.9,
      reviewCount: 195,
      specialties: ['Preventative Medicine', 'Cardiology', 'Endocrinology', 'Dermatology'],
      specialtiesAr: ['الطب الوقائي', 'أمراض القلب', 'الغدد الصماء', 'الجلدية'],
      operatingHours: 'Daily: 08:30 AM – 09:30 PM',
      operatingHoursAr: 'يومياً: ٠٨:٣٠ ص – ٠٩:٣٠ م',
      isVerified: true,
      badge: 'AI Center of Excellence',
      badgeAr: 'مركز تميز بالذكاء الاصطناعي',
      doctorCount: 18,
      consultationFeeRange: '400 – 700 AED',
      consultationFeeRangeAr: '٤٠٠ – ٧٠٠ د.إ',
      emergencyAvailable: false,
      isDemo: false,
      mapCoordinates: { latApprox: 25.2345, lngApprox: 55.3218, label: 'Future Health Dubai' },
    },
  ];
}

export function getLiveDoctors(): Doctor[] {
  try {
    const raw = localStorage.getItem('aegis_repo_doctors');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback to default
  }
  return [
    {
      id: 'dr-sarah-ahmed',
      name: 'Dr. Sarah Mansour',
      nameAr: 'د. سارة منصور',
      title: 'Consultant Cardiologist & Heart Failure Specialist',
      titleAr: 'استشاري أمراض القلب وقصور عضلة القلب',
      specialty: 'Cardiology',
      specialtyAr: 'أمراض القلب',
      clinicId: 'al-nour',
      clinicName: 'Al-Nour Specialized Medical Center',
      clinicNameAr: 'مجمع النور الطبي التخصصي',
      city: 'Riyadh',
      cityAr: 'الرياض',
      district: 'Olaya District',
      districtAr: 'حي العليا',
      rating: 4.9,
      reviewCount: 168,
      yearsExperience: 14,
      availability: 'today',
      availabilityText: 'Next available: Today, 04:30 PM',
      availabilityTextAr: 'أقرب موعد متاح: اليوم، ٠٤:٣٠ م',
      languages: ['Arabic', 'English'],
      consultationFee: 300,
      bio: 'Senior consultant cardiologist with extensive experience in outpatient telemetry, cardiovascular prevention, and non-invasive diagnostics.',
      bioAr: 'استشاري أول أمراض القلب والأوعية الدموية مع خبرة واسعة في الفحوصات غير التداخلية والوقاية من أمراض القلب.',
      badge: 'Senior Consultant',
      badgeAr: 'استشاري أول',
      avatarLetter: 'S',
      availableSlots: ['04:30 PM', '05:15 PM', '06:00 PM', '07:30 PM'],
      isDemo: false,
    },
    {
      id: 'dr-tarek-kabbani',
      name: 'Dr. Tarek El-Kabbani',
      nameAr: 'د. طارق القباني',
      title: 'Senior Clinical Cardiologist & Echocardiography Director',
      titleAr: 'طبيب قلب سريري أول ورئيس وحدة تخطيط الصدى',
      specialty: 'Cardiology',
      specialtyAr: 'أمراض القلب',
      clinicId: 'al-nour',
      clinicName: 'Al-Nour Specialized Medical Center',
      clinicNameAr: 'مجمع النور الطبي التخصصي',
      city: 'Riyadh',
      cityAr: 'الرياض',
      district: 'Olaya District',
      districtAr: 'حي العليا',
      rating: 4.9,
      reviewCount: 212,
      yearsExperience: 18,
      availability: 'today',
      availabilityText: 'Next available: Today, 05:00 PM',
      availabilityTextAr: 'أقرب موعد متاح: اليوم، ٠٥:٠٠ م',
      languages: ['Arabic', 'English'],
      consultationFee: 350,
      bio: 'Fellow of the European Society of Cardiology specializing in stress echocardiography and valvular disease management.',
      bioAr: 'زميل الجمعية الأوروبية لأمراض القلب، متخصص في تخطيط الجهد بالموجات الصوتية وإدارة أمراض الصمامات.',
      badge: 'Fellow FESC',
      badgeAr: 'زميل الجمعية الأوروبية',
      avatarLetter: 'T',
      availableSlots: ['05:00 PM', '05:45 PM', '06:30 PM', '08:00 PM'],
      isDemo: false,
    },
    {
      id: 'dr-layla-nasser',
      name: 'Dr. Layla Nasser',
      nameAr: 'د. ليلى ناصر',
      title: 'Consultant of Internal Medicine & Endocrinology',
      titleAr: 'استشاري الأمراض الباطنية والغدد الصماء',
      specialty: 'Internal Medicine',
      specialtyAr: 'الطب الباطني',
      clinicId: 'al-nour',
      clinicName: 'Al-Nour Specialized Medical Center',
      clinicNameAr: 'مجمع النور الطبي التخصصي',
      city: 'Riyadh',
      cityAr: 'الرياض',
      district: 'Olaya District',
      districtAr: 'حي العليا',
      rating: 4.8,
      reviewCount: 145,
      yearsExperience: 12,
      availability: 'tomorrow',
      availabilityText: 'Next available: Tomorrow, 10:00 AM',
      availabilityTextAr: 'أقرب موعد متاح: غداً، ١٠:٠٠ ص',
      languages: ['Arabic', 'English'],
      consultationFee: 250,
      bio: 'Specialist in complex chronic metabolic management, diabetes mellitus, thyroid disorders, and preventative screenings.',
      bioAr: 'متخصصة في متابعة الأمراض الاستقلابية المزمنة واعتلالات الغدة الدرقية والسكري والفحوصات الدورية.',
      badge: 'Consultant',
      badgeAr: 'استشاري',
      avatarLetter: 'L',
      availableSlots: ['10:00 AM', '11:00 AM', '01:30 PM'],
      isDemo: false,
    },
    {
      id: 'dr-omar-haddad',
      name: 'Dr. Omar Haddad',
      nameAr: 'د. عمر الحداد',
      title: 'Consultant General Surgeon & Laparoscopy',
      titleAr: 'استشاري الجراحة العامة والمناظير',
      specialty: 'General Surgery',
      specialtyAr: 'الجراحة العامة',
      clinicId: 'dar-al-shifa',
      clinicName: 'Dar Al-Shifa Clinical Hospital',
      clinicNameAr: 'مستشفى دار الشفاء التخصصي',
      city: 'Cairo',
      cityAr: 'القاهرة',
      district: 'Nasr City',
      districtAr: 'مدينة نصر',
      rating: 4.9,
      reviewCount: 198,
      yearsExperience: 16,
      availability: 'today',
      availabilityText: 'Next available: Today, 06:00 PM',
      availabilityTextAr: 'أقرب موعد متاح: اليوم، ٠٦:٠٠ م',
      languages: ['Arabic', 'English', 'French'],
      consultationFee: 350,
      bio: 'Advanced laparoscopic and gastrointestinal surgical procedures with minimally invasive techniques.',
      bioAr: 'جراحات المناظير المتقدمة والجهاز الهضمي بأحدث التقنيات طفيفة التوغل.',
      badge: 'Senior Surgeon',
      badgeAr: 'استشاري أول جراحة',
      avatarLetter: 'O',
      availableSlots: ['06:00 PM', '07:00 PM', '08:30 PM'],
      isDemo: false,
    },
    {
      id: 'dr-mona-zaki',
      name: 'Dr. Mona Zaki',
      nameAr: 'د. منى زكي',
      title: 'Consultant Pediatrician & Neonatologist',
      titleAr: 'استشاري طب الأطفال وحديثي الولادة',
      specialty: 'Pediatrics',
      specialtyAr: 'طب الأطفال',
      clinicId: 'al-nour',
      clinicName: 'Al-Nour Specialized Medical Center',
      clinicNameAr: 'مجمع النور الطبي التخصصي',
      city: 'Riyadh',
      cityAr: 'الرياض',
      district: 'Olaya District',
      districtAr: 'حي العليا',
      rating: 4.9,
      reviewCount: 230,
      yearsExperience: 15,
      availability: 'today',
      availabilityText: 'Next available: Today, 03:30 PM',
      availabilityTextAr: 'أقرب موعد متاح: اليوم، ٠٣:٣٠ م',
      languages: ['Arabic', 'English'],
      consultationFee: 220,
      bio: 'Comprehensive pediatric care, newborn screenings, developmental milestones, and childhood immunization.',
      bioAr: 'رعاية شاملة لصحة الأطفال ومتابعة نمو حديثي الولادة والتطعيمات الدورية.',
      badge: 'Consultant',
      badgeAr: 'استشاري',
      avatarLetter: 'M',
      availableSlots: ['03:30 PM', '04:15 PM', '05:00 PM'],
      isDemo: false,
    },
    {
      id: 'dr-khaled-saeed',
      name: 'Dr. Khaled Saeed',
      nameAr: 'د. خالد سعيد',
      title: 'Consultant Endocrinologist & Diabetic Foot Specialist',
      titleAr: 'استشاري أمراض السكري والغدد الصماء',
      specialty: 'Endocrinology',
      specialtyAr: 'الغدد الصماء',
      clinicId: 'future-health',
      clinicName: 'Future Health Integrated Clinics',
      clinicNameAr: 'عيادات صحة المستقبل المتكاملة',
      city: 'Dubai',
      cityAr: 'دبي',
      district: 'Healthcare City',
      districtAr: 'مدينة دبي الطبية',
      rating: 4.9,
      reviewCount: 175,
      yearsExperience: 20,
      availability: 'this-week',
      availabilityText: 'Next available: Wednesday, 11:00 AM',
      availabilityTextAr: 'أقرب موعد متاح: الأربعاء، ١١:٠٠ ص',
      languages: ['Arabic', 'English'],
      consultationFee: 500,
      bio: 'Pioneer in continuous glucose monitoring (CGM) systems, insulin pump therapy, and metabolic disease management.',
      bioAr: 'رائد في نظم المتابعة المستمرة للجلوكوز والعلاج بمضخات الأنسولين والأمراض الاستقلابية.',
      badge: 'Senior Consultant',
      badgeAr: 'استشاري أول',
      avatarLetter: 'K',
      availableSlots: ['11:00 AM', '12:00 PM', '02:00 PM'],
      isDemo: false,
    },
  ];
}

export const mockClinics: Clinic[] = getLiveClinics();
export const mockDoctors: Doctor[] = getLiveDoctors();

export const mockPlatformServices: PlatformService[] = [
  {
    id: 'doctor-discovery',
    title: 'Physician & Specialist Discovery',
    titleAr: 'دليل الأطباء والاستشاريين',
    category: 'Patient Access',
    categoryAr: 'وصول المرضى',
    description: 'Find attending consultants across primary care, cardiology, pediatrics, and specialized medicine with direct scheduling and available booking slots.',
    descriptionAr: 'البحث عن الاستشاريين والأطباء في مختلف التخصصات السريرية، مع استعراض جداول العيادات والمواعيد المتاحة فوراً.',
    icon: 'person_search',
    features: ['Direct specialty filtering', 'Real-time slot availability', 'Credentials & experience review'],
    featuresAr: ['تصفية دقيقة حسب التخصص', 'عرض المواعيد المتاحة لحظياً', 'الاطلاع على المؤهلات والخبرات'],
    route: '/clinic/al-nour/doctors',
  },
  {
    id: 'appointment-booking',
    title: 'Consultation Scheduling & Digital Check-In',
    titleAr: 'حجز المواعيد والتسجيل الرقمي',
    category: 'Patient Operations',
    categoryAr: 'العمليات السريرية',
    description: 'Frictionless appointment booking with automated SMS/WhatsApp confirmations, digital intake reminders, and live reception queue updates.',
    descriptionAr: 'حجز مواعيد سهل مع إشعارات تأكيد تلقائية عبر الرسائل والواتساب، وتذكيرات الاستقبال، والمتابعة المباشرة في طابور الانتظار.',
    icon: 'calendar_month',
    features: ['Instant slot reservation', 'Calendar sync & SMS notifications', 'Live waiting room check-in'],
    featuresAr: ['حجز فوري للمواعيد', 'تزامن مع التقويم وإشعارات نصية', 'تسجيل وصول رقمي في صالة الانتظار'],
    route: '/clinic/al-nour',
  },
  {
    id: 'patient-portal',
    title: 'Patient Medical Portal & Telemetry',
    titleAr: 'بوابة المريض الصحية والقياسات الحيوية',
    category: 'Health Records',
    categoryAr: 'السجلات الصحية',
    description: 'Empower patients with secure access to their longitudinal health history, active prescriptions, verified laboratory findings, and self-reported vital telemetry.',
    descriptionAr: 'تمكين المريض من الوصول الآمن لملفه الصحي التراكمي، والأدوية الفعالة، ونتائج التحاليل المخبرية، وتسجيل المؤشرات الحيوية.',
    icon: 'monitor_heart',
    features: ['Unified health records', 'Laboratory result trends', 'Self-reported blood pressure & glucose'],
    featuresAr: ['سجل صحي موحد ومتكامل', 'مخططات بيانية لنتائج الفحوصات', 'تسجيل ومتابعة المؤشرات الحيوية'],
    route: '/patient/dashboard',
  },
  {
    id: 'ambient-scribe',
    title: 'Ambient Voice AI & Clinical Documentation',
    titleAr: 'التوثيق السريري الذكي ومساعد الصوت',
    category: 'Physician Productivity',
    categoryAr: 'إنتاجية الأطباء',
    description: 'Enterprise-grade clinical voice capture that generates structured SOAP progress notes in seconds, reducing administrative physician burden.',
    descriptionAr: 'تقنية التقاط صوتي سريرية متقدمة لتوليد ملاحظات SOAP الطبية تلقائياً في ثوانٍ، مما يقلل العبء الإداري على الأطباء.',
    icon: 'mic_external_on',
    features: ['Conversational transcription', 'Structured SOAP note drafts', 'Physician review & attestation'],
    featuresAr: ['تحويل المحادثة الطبية لنص', 'مسودات SOAP دقيقة ومنظمة', 'مراجعة الطبيب واعتماده بنقرة واحدة'],
    route: '/doctor/voice-sessions',
  },
];

export const mockSpecialties: SpecialtyItem[] = [
  { id: 'cardiology', name: 'Cardiology', nameAr: 'أمراض القلب', icon: 'cardiology', doctorCount: 8, clinicCount: 3 },
  { id: 'internal-medicine', name: 'Internal Medicine', nameAr: 'الطب الباطني', icon: 'medical_services', doctorCount: 12, clinicCount: 3 },
  { id: 'pediatrics', name: 'Pediatrics', nameAr: 'طب الأطفال', icon: 'child_care', doctorCount: 6, clinicCount: 2 },
  { id: 'general-surgery', name: 'General Surgery', nameAr: 'الجراحة العامة', icon: 'healing', doctorCount: 5, clinicCount: 2 },
  { id: 'endocrinology', name: 'Endocrinology', nameAr: 'الغدد الصماء', icon: 'biotech', doctorCount: 4, clinicCount: 2 },
  { id: 'dermatology', name: 'Dermatology', nameAr: 'الجلدية', icon: 'face', doctorCount: 5, clinicCount: 2 },
];

export const mockLocations: LocationItem[] = [
  { id: 'riyadh', city: 'Riyadh', cityAr: 'الرياض', district: 'Olaya District', districtAr: 'حي العليا', clinicCount: 1, doctorCount: 14 },
  { id: 'cairo', city: 'Cairo', cityAr: 'القاهرة', district: 'Nasr City', districtAr: 'مدينة نصر', clinicCount: 1, doctorCount: 22 },
  { id: 'dubai', city: 'Dubai', cityAr: 'دبي', district: 'Healthcare City', districtAr: 'مدينة دبي الطبية', clinicCount: 1, doctorCount: 18 },
];

export const demoPlatformStats: PlatformStats = {
  clinics: 3,
  doctors: 54,
  specialties: 6,
  appointments: 1420,
  locations: 3,
  isDemo: false,
};

export function queryDoctors(params: {
  searchQuery?: string;
  specialty?: string;
  clinicId?: string;
  city?: string;
  minRating?: number;
}): Doctor[] {
  const docs = getLiveDoctors();
  return docs.filter((doc) => {
    if (params.specialty && params.specialty !== 'all' && doc.specialty !== params.specialty) {
      return false;
    }
    if (params.clinicId && params.clinicId !== 'all' && doc.clinicId !== params.clinicId) {
      return false;
    }
    if (params.city && params.city !== 'all') {
      const cityNorm = params.city.toLowerCase();
      if (!doc.city.toLowerCase().includes(cityNorm) && !doc.cityAr.includes(params.city)) {
        return false;
      }
    }
    if (params.minRating && doc.rating < params.minRating) {
      return false;
    }
    if (params.searchQuery && params.searchQuery.trim() !== '') {
      const q = params.searchQuery.toLowerCase().trim();
      const matchName = doc.name.toLowerCase().includes(q) || doc.nameAr.includes(q);
      const matchSpec = doc.specialty.toLowerCase().includes(q) || doc.specialtyAr.includes(q);
      const matchClinic = doc.clinicName.toLowerCase().includes(q) || doc.clinicNameAr.includes(q);
      const matchCity = doc.city.toLowerCase().includes(q) || doc.cityAr.includes(q);
      return matchName || matchSpec || matchClinic || matchCity;
    }
    return true;
  });
}

export function queryClinics(params: {
  searchQuery?: string;
  specialty?: string;
  city?: string;
  minRating?: number;
}): Clinic[] {
  const clinics = getLiveClinics();
  return clinics.filter((clinic) => {
    if (params.specialty && params.specialty !== 'all') {
      const hasSpec = clinic.specialties.includes(params.specialty) || clinic.specialtiesAr.includes(params.specialty);
      if (!hasSpec) return false;
    }
    if (params.city && params.city !== 'all') {
      const cityNorm = params.city.toLowerCase();
      if (!clinic.city.toLowerCase().includes(cityNorm) && !clinic.cityAr.includes(params.city)) {
        return false;
      }
    }
    if (params.minRating && clinic.rating < params.minRating) {
      return false;
    }
    if (params.searchQuery && params.searchQuery.trim() !== '') {
      const q = params.searchQuery.toLowerCase().trim();
      const matchName = clinic.name.toLowerCase().includes(q) || clinic.nameAr.includes(q);
      const matchCity = clinic.city.toLowerCase().includes(q) || clinic.cityAr.includes(q);
      const matchDistrict = clinic.district.toLowerCase().includes(q) || clinic.districtAr.includes(q);
      const matchSpec = clinic.specialties.some((s) => s.toLowerCase().includes(q)) || clinic.specialtiesAr.some((s) => s.includes(q));
      return matchName || matchCity || matchDistrict || matchSpec;
    }
    return true;
  });
}

export function getClinicById(id: string): Clinic | undefined {
  return getLiveClinics().find((c) => c.id === id);
}

export function getDoctorById(id: string): Doctor | undefined {
  return getLiveDoctors().find((d) => d.id === id);
}

export function getDoctorsByClinic(clinicId: string): Doctor[] {
  return getLiveDoctors().filter((d) => d.clinicId === clinicId);
}
