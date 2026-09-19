import {
  Patient,
  Appointment,
  Prescription,
  LabOrder,
  AuditLog,
  ClinicIntegration,
  PatientId,
  AppointmentId,
  PrescriptionId,
  LabOrderId,
  TenantId,
  AppointmentStatus,
  LabOrderStatus,
  User,
  Clinic,
  Doctor,
  PlatformService,
  SpecialtyItem,
  LocationItem,
  PlatformStats,
} from '../domain';
import {
  IPatientRepository,
  IAppointmentRepository,
  IPrescriptionRepository,
  ILabOrderRepository,
  IAuditLogRepository,
  IIntegrationRepository,
  IClinicRepository,
  IDoctorRepository,
  IPlatformRepository,
  IUserRepository,
} from './contracts';

// Local storage helper
function loadStore<T>(key: string, defaultValue: T[]): T[] {
  try {
    const raw = localStorage.getItem(`aegis_repo_${key}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(`Error loading store ${key}`, e);
  }
  return defaultValue;
}

function saveStore<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(`aegis_repo_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving store ${key}`, e);
  }
}

// Initial Seed Data
const SEED_PATIENTS: Patient[] = [
  {
    id: 'pat-001',
    tenantId: 'tenant-demo-01',
    medicalRecordNumber: '#EG-8933',
    nationalId: '28408140102938',
    fullNameAr: 'طارق منصور حسن عبد الرحيم',
    fullNameEn: 'Tariq Mansoor Hassan Abdelrahim',
    dateOfBirth: '1984-08-14',
    gender: 'male',
    phone: '+20 100 123 4567',
    whatsappOptIn: true,
    emergencyContact: {
      name: 'Salma Mansoor (Sister)',
      phone: '+20 100 987 6543',
      relation: 'Sister',
    },
    allergies: ['Penicillin G', 'Sulfa drugs'],
    chronicConditions: ['Type 2 Diabetes Mellitus', 'Essential Hypertension'],
    latestVitals: {
      bloodPressure: '138/88',
      heartRate: 84,
      temperature: 36.8,
      weightKg: 82.4,
      recordedAt: new Date().toISOString(),
    },
    status: 'stable',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'pat-002',
    tenantId: 'tenant-demo-01',
    medicalRecordNumber: '#EG-98124',
    nationalId: '29204120109845',
    fullNameAr: 'فاطمة شريف عبد الفتاح',
    fullNameEn: 'Fatma Sherif Abdel Fattah',
    dateOfBirth: '1992-04-12',
    gender: 'female',
    phone: '+20 111 234 5678',
    whatsappOptIn: true,
    allergies: ['Latex'],
    chronicConditions: ['Gestational Diabetes Risk'],
    latestVitals: {
      bloodPressure: '118/76',
      heartRate: 74,
      temperature: 36.6,
      weightKg: 68.0,
      recordedAt: new Date().toISOString(),
    },
    status: 'stable',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: 'pat-003',
    tenantId: 'tenant-demo-01',
    medicalRecordNumber: '#EG-74102',
    nationalId: '27611050104829',
    fullNameAr: 'محمود السيد البنهاوي',
    fullNameEn: 'Mahmoud El-Sayed El-Banhawy',
    dateOfBirth: '1976-11-05',
    gender: 'male',
    phone: '+20 122 345 6789',
    whatsappOptIn: true,
    allergies: [],
    chronicConditions: ['Dyslipidemia', 'Coronary Artery Disease'],
    latestVitals: {
      bloodPressure: '142/90',
      heartRate: 88,
      temperature: 37.1,
      weightKg: 89.5,
      recordedAt: new Date().toISOString(),
    },
    status: 'follow-up',
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
];

const SEED_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-001',
    tenantId: 'tenant-demo-01',
    patientId: 'pat-001',
    patientName: 'طارق منصور حسن',
    patientPhone: '+20 100 123 4567',
    clinicianId: 'doc-001',
    clinicianName: 'د. طارق القباني (استشاري القلب)',
    scheduledAt: new Date().toISOString(),
    timeSlot: '10:30 AM',
    dateFormatted: 'Today',
    visitType: 'scheduled',
    status: 'confirmed',
    room: 'غرفة كشف 1',
    clinicName: 'مركز النور التخصصي - عيادة القلب',
    chiefComplaint: 'متابعة دورية لارتفاع ضغط الدم واضطراب نبض خفيف',
    preparationChecklist: [
      'صيام 10 ساعات إذا كان مطلوباً تحليل دهون',
      'إحضار أحدث تقرير رسم قلب (ECG)',
      'إحضار شريط قياسات الضغط المنزلي للأسبوع الماضي',
    ],
    createdAt: new Date().toISOString(),
  },
];

const SEED_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-001',
    tenantId: 'tenant-demo-01',
    patientId: 'pat-001',
    clinicianId: 'doc-001',
    clinicianName: 'Dr. Tarek El-Kabbani',
    status: 'active',
    items: [
      {
        id: 'rxi-001',
        medicationName: 'Atorvastatin 20mg',
        medicationNameAr: 'أتورفاستاتين ٢٠ مجم',
        dosage: '20mg',
        frequency: 'Once Daily',
        timing: 'Evening / Before sleep',
        durationDays: 30,
        instructions: 'Take 1 tablet in the evening with a full glass of water. Avoid grapefruit.',
        instructionsAr: 'تناول قرصاً واحداً مساءً قبل النوم مع كوب ماء كامل. تجنب تناول الجريب فروت.',
        guidance: {
          doseForm: 'tablet',
          emojiBadge: '💊',
          timingEmoji: '🌙',
          foodInstruction: 'anytime',
          waterInstruction: 'full-glass',
          spokenInstructionsAr: 'تناول قرصاً واحداً مساءً مع كوب ماء كامل',
          spokenInstructionsEn: 'Take one tablet in the evening with a full glass of water',
        },
      },
      {
        id: 'rxi-002',
        medicationName: 'Metformin 500mg',
        medicationNameAr: 'ميتفورمين ٥٠٠ مجم',
        dosage: '500mg',
        frequency: 'Twice Daily',
        timing: 'Morning & Evening',
        durationDays: 30,
        instructions: 'Take 1 tablet twice daily with meals to avoid gastric irritation.',
        instructionsAr: 'تناول قرصاً واحداً مرتين يومياً بعد الطعام مباشرة لتجنب اضطراب المعدة.',
        guidance: {
          doseForm: 'tablet',
          emojiBadge: '💊',
          timingEmoji: '☀️',
          foodInstruction: 'after-meal',
          waterInstruction: 'full-glass',
          spokenInstructionsAr: 'تناول قرصاً مرتين يومياً بعد الطعام مباشرة مع كوب ماء',
          spokenInstructionsEn: 'Take one tablet twice daily with meals and water',
        },
      },
    ],
    refillsAllowed: 3,
    refillsUsed: 0,
    diagnoses: ['I10 Essential Hypertension', 'E11 Type 2 Diabetes'],
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 90 * 86400000).toISOString(),
  },
];

const SEED_LAB_ORDERS: LabOrder[] = [
  {
    id: 'lab-001',
    tenantId: 'tenant-demo-01',
    patientId: 'pat-001',
    patientName: 'طارق منصور حسن',
    patientMrn: '#EG-8933',
    orderingClinicianId: 'doc-001',
    orderingClinicianName: 'Dr. Tarek El-Kabbani',
    orderNumber: '#ORD-2025-0811',
    testType: 'Comprehensive Metabolic Panel + Lipid Panel',
    specimenType: 'blood',
    priority: 'routine',
    status: 'accessioned',
    accessionNumber: 'ACC-8933-B',
    collectedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

// In-Memory Patient Repository
export class InMemoryPatientRepository implements IPatientRepository {
  private patients: Patient[] = loadStore<Patient>('patients', SEED_PATIENTS);

  async findById(id: PatientId, tenantId: TenantId): Promise<Patient | null> {
    const p = this.patients.find((p) => p.id === id && p.tenantId === tenantId);
    return p ? { ...p } : null;
  }

  async findByMrn(mrn: string, tenantId: TenantId): Promise<Patient | null> {
    const p = this.patients.find((p) => p.medicalRecordNumber.toLowerCase() === mrn.toLowerCase() && p.tenantId === tenantId);
    return p ? { ...p } : null;
  }

  async findByNationalId(nationalId: string, tenantId: TenantId): Promise<Patient | null> {
    const p = this.patients.find((p) => p.nationalId === nationalId && p.tenantId === tenantId);
    return p ? { ...p } : null;
  }

  async list(tenantId: TenantId, query?: string): Promise<Patient[]> {
    let result = this.patients.filter((p) => p.tenantId === tenantId);
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.fullNameAr.toLowerCase().includes(q) ||
          p.fullNameEn.toLowerCase().includes(q) ||
          p.medicalRecordNumber.toLowerCase().includes(q) ||
          p.nationalId.includes(q) ||
          p.phone.includes(q)
      );
    }
    return result.map((p) => ({ ...p }));
  }

  async save(patient: Patient): Promise<Patient> {
    this.patients.unshift(patient);
    saveStore('patients', this.patients);
    return { ...patient };
  }

  async update(patient: Patient): Promise<Patient> {
    const idx = this.patients.findIndex((p) => p.id === patient.id && p.tenantId === patient.tenantId);
    if (idx >= 0) {
      this.patients[idx] = { ...patient };
      saveStore('patients', this.patients);
    }
    return { ...patient };
  }
}

// In-Memory Appointment Repository
export class InMemoryAppointmentRepository implements IAppointmentRepository {
  private appointments: Appointment[] = loadStore<Appointment>('appointments', SEED_APPOINTMENTS);

  async findById(id: AppointmentId, tenantId: TenantId): Promise<Appointment | null> {
    const a = this.appointments.find((a) => a.id === id && a.tenantId === tenantId);
    return a ? { ...a } : null;
  }

  async listByTenant(tenantId: TenantId, date?: string): Promise<Appointment[]> {
    let result = this.appointments.filter((a) => a.tenantId === tenantId);
    if (date) {
      result = result.filter((a) => a.dateFormatted.includes(date) || a.scheduledAt.startsWith(date));
    }
    return result.map((a) => ({ ...a }));
  }

  async listByPatient(patientId: PatientId, tenantId: TenantId): Promise<Appointment[]> {
    return this.appointments
      .filter((a) => a.patientId === patientId && a.tenantId === tenantId)
      .map((a) => ({ ...a }));
  }

  async listByClinician(clinicianId: string, tenantId: TenantId, date?: string): Promise<Appointment[]> {
    let result = this.appointments.filter((a) => a.clinicianId === clinicianId && a.tenantId === tenantId);
    if (date) {
      result = result.filter((a) => a.scheduledAt.startsWith(date));
    }
    return result.map((a) => ({ ...a }));
  }

  async save(appointment: Appointment): Promise<Appointment> {
    this.appointments.unshift(appointment);
    saveStore('appointments', this.appointments);
    return { ...appointment };
  }

  async updateStatus(id: AppointmentId, status: AppointmentStatus, tenantId: TenantId): Promise<void> {
    const a = this.appointments.find((a) => a.id === id && a.tenantId === tenantId);
    if (a) {
      a.status = status;
      saveStore('appointments', this.appointments);
    }
  }

  async checkConflict(clinicianId: string, scheduledAt: string, tenantId: TenantId): Promise<boolean> {
    return this.appointments.some(
      (a) => a.clinicianId === clinicianId && a.tenantId === tenantId && a.scheduledAt === scheduledAt && a.status !== 'cancelled'
    );
  }
}

// In-Memory Prescription Repository
export class InMemoryPrescriptionRepository implements IPrescriptionRepository {
  private prescriptions: Prescription[] = loadStore<Prescription>('prescriptions', SEED_PRESCRIPTIONS);

  async findById(id: PrescriptionId, tenantId: TenantId): Promise<Prescription | null> {
    const rx = this.prescriptions.find((p) => p.id === id && p.tenantId === tenantId);
    return rx ? { ...rx } : null;
  }

  async listByPatient(patientId: PatientId, tenantId: TenantId): Promise<Prescription[]> {
    return this.prescriptions
      .filter((p) => p.patientId === patientId && p.tenantId === tenantId)
      .map((p) => ({ ...p }));
  }

  async save(prescription: Prescription): Promise<Prescription> {
    this.prescriptions.unshift(prescription);
    saveStore('prescriptions', this.prescriptions);
    return { ...prescription };
  }
}

// In-Memory Lab Order Repository
export class InMemoryLabOrderRepository implements ILabOrderRepository {
  private labOrders: LabOrder[] = loadStore<LabOrder>('lab_orders', SEED_LAB_ORDERS);

  async findById(id: LabOrderId, tenantId: TenantId): Promise<LabOrder | null> {
    const lo = this.labOrders.find((l) => l.id === id && l.tenantId === tenantId);
    return lo ? { ...lo } : null;
  }

  async listByPatient(patientId: PatientId, tenantId: TenantId): Promise<LabOrder[]> {
    return this.labOrders
      .filter((l) => l.patientId === patientId && l.tenantId === tenantId)
      .map((l) => ({ ...l }));
  }

  async listPending(tenantId: TenantId): Promise<LabOrder[]> {
    return this.labOrders
      .filter((l) => l.tenantId === tenantId && (l.status === 'ordered' || l.status === 'accessioned'))
      .map((l) => ({ ...l }));
  }

  async save(order: LabOrder): Promise<LabOrder> {
    this.labOrders.unshift(order);
    saveStore('lab_orders', this.labOrders);
    return { ...order };
  }

  async updateStatus(id: LabOrderId, status: LabOrderStatus, accessionNumber?: string, tenantId?: TenantId): Promise<void> {
    const lo = this.labOrders.find((l) => l.id === id && (!tenantId || l.tenantId === tenantId));
    if (lo) {
      lo.status = status;
      if (accessionNumber) lo.accessionNumber = accessionNumber;
      saveStore('lab_orders', this.labOrders);
    }
  }
}

// In-Memory Audit Log Repository
export class InMemoryAuditLogRepository implements IAuditLogRepository {
  private logs: AuditLog[] = loadStore<AuditLog>('audit_logs', []);

  async append(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const entry: AuditLog = {
      ...log,
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };
    this.logs.unshift(entry);
    saveStore('audit_logs', this.logs);
    return entry;
  }

  async listByTenant(tenantId: TenantId, limit = 100): Promise<AuditLog[]> {
    return this.logs
      .filter((l) => l.tenantId === tenantId)
      .slice(0, limit)
      .map((l) => ({ ...l }));
  }
}

// In-Memory Integration Repository
export class InMemoryIntegrationRepository implements IIntegrationRepository {
  private integrations: ClinicIntegration[] = loadStore<ClinicIntegration>('integrations', [
    {
      id: 'int-n8n-default',
      tenantId: 'tenant-demo-01',
      integrationType: 'n8n_webhook',
      serviceName: 'n8n Primary Operations Hub',
      endpointUrl: 'https://n8n.example.com/webhook/aegis-operations',
      eventsSubscribed: ['PATIENT_CREATED', 'APPOINTMENT_BOOKED', 'SOAP_NOTE_FINALIZED', 'LAB_RESULT_READY'],
      isActive: true,
      lastPingStatus: 'healthy',
      lastPingAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'int-whatsapp-default',
      tenantId: 'tenant-demo-01',
      integrationType: 'whatsapp_business',
      serviceName: 'WhatsApp Triage Dispatcher',
      endpointUrl: 'https://n8n.example.com/webhook/aegis-whatsapp-dispatch',
      eventsSubscribed: ['PATIENT_CREATED', 'APPOINTMENT_BOOKED', 'LAB_RESULT_READY'],
      isActive: true,
      lastPingStatus: 'healthy',
      lastPingAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  ]);

  async list(tenantId: TenantId): Promise<ClinicIntegration[]> {
    return this.integrations
      .filter((i) => i.tenantId === tenantId || i.tenantId === 'global')
      .map((i) => ({ ...i }));
  }

  async save(integration: ClinicIntegration): Promise<ClinicIntegration> {
    const idx = this.integrations.findIndex((i) => i.id === integration.id);
    if (idx >= 0) {
      this.integrations[idx] = { ...integration };
    } else {
      this.integrations.unshift(integration);
    }
    saveStore('integrations', this.integrations);
    return { ...integration };
  }

  async delete(id: string, tenantId: TenantId): Promise<void> {
    this.integrations = this.integrations.filter((i) => !(i.id === id && (i.tenantId === tenantId || tenantId === 'global')));
    saveStore('integrations', this.integrations);
  }

  async findForEvent(eventType: string, tenantId: TenantId): Promise<ClinicIntegration[]> {
    return this.integrations
      .filter((i) => i.isActive && (i.tenantId === tenantId || i.tenantId === 'global') && i.eventsSubscribed.includes(eventType))
      .map((i) => ({ ...i }));
  }
}

// ---------------------------------------------------------------------------
// In-Memory User Repository (Admin Managed)
// ---------------------------------------------------------------------------
const SEED_USERS: User[] = [
  {
    id: 'usr-admin-01',
    tenantId: 'tenant-demo-01',
    email: 'admin@nabda.health',
    fullName: 'Platform Super Admin',
    role: 'super_admin',
    phone: '+966 50 000 0001',
    specialty: 'System Administration',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-doctor-01',
    tenantId: 'tenant-demo-01',
    email: 'doctor@nabda.health',
    fullName: 'Dr. Sarah Mansour',
    role: 'doctor',
    phone: '+966 50 000 0002',
    specialty: 'Cardiology',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-assistant-01',
    tenantId: 'tenant-demo-01',
    email: 'assistant@nabda.health',
    fullName: 'Nurse Nourhan Mostafa',
    role: 'assistant',
    phone: '+966 50 000 0003',
    specialty: 'Clinical Nursing & Specimen Intake',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-patient-01',
    tenantId: 'tenant-demo-01',
    email: 'patient@nabda.health',
    fullName: 'Tariq Al-Sabah',
    role: 'patient',
    phone: '+966 50 000 0004',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = loadStore<User>('users', SEED_USERS);

  async list(): Promise<User[]> {
    return this.users.map((u) => ({ ...u }));
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    return user ? { ...user } : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    return user ? { ...user } : null;
  }

  async save(user: User): Promise<User> {
    const idx = this.users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      this.users[idx] = { ...user };
    } else {
      this.users.unshift(user);
    }
    saveStore('users', this.users);
    return { ...user };
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter((u) => u.id !== id);
    saveStore('users', this.users);
  }
}

// ---------------------------------------------------------------------------
// In-Memory Clinic Repository (Admin Managed)
// ---------------------------------------------------------------------------
const SEED_CLINICS: Clinic[] = [
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
    mapCoordinates: {
      latApprox: 24.7136,
      lngApprox: 46.6753,
      label: 'Al-Nour Medical Center Riyadh',
    },
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
    mapCoordinates: {
      latApprox: 30.0561,
      lngApprox: 31.3411,
      label: 'Dar Al-Shifa Cairo',
    },
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
    mapCoordinates: {
      latApprox: 25.2345,
      lngApprox: 55.3218,
      label: 'Future Health Dubai',
    },
  },
];

export class InMemoryClinicRepository implements IClinicRepository {
  private clinics: Clinic[] = loadStore<Clinic>('clinics', SEED_CLINICS);

  async list(): Promise<Clinic[]> {
    return this.clinics.map((c) => ({ ...c }));
  }

  async findById(id: string): Promise<Clinic | null> {
    const c = this.clinics.find((item) => item.id === id);
    return c ? { ...c } : null;
  }

  async save(clinic: Clinic): Promise<Clinic> {
    const idx = this.clinics.findIndex((c) => c.id === clinic.id);
    if (idx >= 0) {
      this.clinics[idx] = { ...clinic };
    } else {
      this.clinics.unshift(clinic);
    }
    saveStore('clinics', this.clinics);
    return { ...clinic };
  }

  async delete(id: string): Promise<void> {
    this.clinics = this.clinics.filter((c) => c.id !== id);
    saveStore('clinics', this.clinics);
  }

  async query(params: {
    searchQuery?: string;
    specialty?: string;
    city?: string;
    minRating?: number;
  }): Promise<Clinic[]> {
    return this.clinics.filter((clinic) => {
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
}

// ---------------------------------------------------------------------------
// In-Memory Doctor Repository (Admin Managed)
// ---------------------------------------------------------------------------
const SEED_DOCTORS: Doctor[] = [
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

export class InMemoryDoctorRepository implements IDoctorRepository {
  private doctors: Doctor[] = loadStore<Doctor>('doctors', SEED_DOCTORS);

  async list(): Promise<Doctor[]> {
    return this.doctors.map((d) => ({ ...d }));
  }

  async findById(id: string): Promise<Doctor | null> {
    const d = this.doctors.find((item) => item.id === id);
    return d ? { ...d } : null;
  }

  async findByClinic(clinicId: string): Promise<Doctor[]> {
    return this.doctors.filter((d) => d.clinicId === clinicId).map((d) => ({ ...d }));
  }

  async save(doctor: Doctor): Promise<Doctor> {
    const idx = this.doctors.findIndex((d) => d.id === doctor.id);
    if (idx >= 0) {
      this.doctors[idx] = { ...doctor };
    } else {
      this.doctors.unshift(doctor);
    }
    saveStore('doctors', this.doctors);
    return { ...doctor };
  }

  async query(params: {
    searchQuery?: string;
    specialty?: string;
    clinicId?: string;
    city?: string;
    minRating?: number;
  }): Promise<Doctor[]> {
    return this.doctors.filter((doc) => {
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
}

// ---------------------------------------------------------------------------
// In-Memory Platform Repository (Services, Specialties, Stats)
// ---------------------------------------------------------------------------
const SEED_SERVICES: PlatformService[] = [
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

const SEED_SPECIALTIES: SpecialtyItem[] = [
  { id: 'cardiology', name: 'Cardiology', nameAr: 'أمراض القلب', icon: 'cardiology', doctorCount: 8, clinicCount: 3 },
  { id: 'internal-medicine', name: 'Internal Medicine', nameAr: 'الطب الباطني', icon: 'medical_services', doctorCount: 12, clinicCount: 3 },
  { id: 'pediatrics', name: 'Pediatrics', nameAr: 'طب الأطفال', icon: 'child_care', doctorCount: 6, clinicCount: 2 },
  { id: 'general-surgery', name: 'General Surgery', nameAr: 'الجراحة العامة', icon: 'healing', doctorCount: 5, clinicCount: 2 },
  { id: 'endocrinology', name: 'Endocrinology', nameAr: 'الغدد الصماء', icon: 'biotech', doctorCount: 4, clinicCount: 2 },
  { id: 'dermatology', name: 'Dermatology', nameAr: 'الجلدية', icon: 'face', doctorCount: 5, clinicCount: 2 },
];

const SEED_LOCATIONS: LocationItem[] = [
  { id: 'riyadh', city: 'Riyadh', cityAr: 'الرياض', district: 'Olaya District', districtAr: 'حي العليا', clinicCount: 1, doctorCount: 14 },
  { id: 'cairo', city: 'Cairo', cityAr: 'القاهرة', district: 'Nasr City', districtAr: 'مدينة نصر', clinicCount: 1, doctorCount: 22 },
  { id: 'dubai', city: 'Dubai', cityAr: 'دبي', district: 'Healthcare City', districtAr: 'مدينة دبي الطبية', clinicCount: 1, doctorCount: 18 },
];

export class InMemoryPlatformRepository implements IPlatformRepository {
  async getServices(): Promise<PlatformService[]> {
    return SEED_SERVICES.map((s) => ({ ...s }));
  }

  async getSpecialties(): Promise<SpecialtyItem[]> {
    return SEED_SPECIALTIES.map((s) => ({ ...s }));
  }

  async getLocations(): Promise<LocationItem[]> {
    return SEED_LOCATIONS.map((l) => ({ ...l }));
  }

  async getStats(): Promise<PlatformStats> {
    return {
      clinics: 3,
      doctors: 54,
      specialties: 6,
      appointments: 1420,
      locations: 3,
      isDemo: false,
    };
  }
}
