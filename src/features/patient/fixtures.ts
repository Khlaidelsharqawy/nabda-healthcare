export const patientDashboardFixture = {
  patientLabel: '[Patient Name]',
  patientId: '[Patient ID]',
  clinicName: '[Clinic Name]',
  nextAppointment: '[Date] • Dr. [Doctor Name]',
  prescriptionCount: '[Count] Active Formulations',
  recentLabs: '[Status] (Ready)',
  appointment: {
    clinician: 'Dr. [Doctor Name]',
    type: 'Consultation',
    typeAr: 'كشف استشاري',
    clinic: '[Clinic Name] • Specialized Outpatient Wing 3B',
    date: '[Date]',
    time: '[Time] (Local Time)',
    room: 'Room [Number]',
    campus: '[Clinic Name] • Main Campus',
    address: '[Clinic Address] • Floor [Number]',
  },
  diagnostics: [
    { id: 'LAB-DEMO-01', icon: 'bloodtype', title: '[Laboratory Diagnostic Panel]', detail: 'Comprehensive lab panel', detailAr: 'فحص مخبري شامل', reference: 'Requisition: [LAB Reference]', status: 'Ready', statusAr: 'جاهز', marker: 'NORMAL (DEMO)' },
    { id: 'RAD-DEMO-01', icon: 'radiology', title: '[Diagnostic Imaging Study]', detail: 'Diagnostic imaging study', detailAr: 'فحص أشعة تشخيصية', reference: 'Study ID: [Study Reference]', status: 'Doctor verified', statusAr: 'معتمد من الطبيب', marker: 'Review with clinician' },
  ],
  medications: [
    { id: 'MED-DEMO-01', name: '[Medication Formula 1]', arabicName: '[اسم المستحضر الدوائي الأول]', dosage: '[Dosage]', frequency: '[Frequency] • Once daily', refills: '[Count]', prescriber: 'Dr. [Doctor Name]' },
    { id: 'MED-DEMO-02', name: '[Medication Formula 2]', arabicName: '[اسم المستحضر الدوائي الثاني]', dosage: '[Dosage]', frequency: '[Frequency] • Twice daily after meals', refills: 'Standard course', prescriber: 'Dr. [Doctor Name]' },
  ],
};

export const patientProfileFixture = {
  initials: '[P]',
  name: '[Patient Name]',
  arabicName: '[اسم المريض]',
  patientId: '[Patient ID]',
  clinicName: '[Clinic Name] • [Clinic Location]',
  bloodType: '[Blood Type]',
  nextAppointment: '[Date]',
  clinician: 'Dr. [Doctor Name]',
  prescriptions: '[Count] active prescriptions',
  personal: {
    legalName: '[Patient Name]',
    arabicLegalName: '[الاسم بالكامل]',
    birthDate: '[Date of Birth]',
    gender: '[Gender]',
    phone: '[Phone Number]',
    email: '[Email Address]',
    address: '[Address]',
  },
  emergency: {
    name: '[Emergency Contact]',
    arabicName: '[جهة الاتصال]',
    relationship: '[Relationship]',
    phone: '[Emergency Phone]',
  },
  baseline: [
    { label: 'Height', value: '[Height]', detail: 'Recorded baseline' },
    { label: 'Weight', value: '[Weight]', detail: 'Recorded baseline' },
    { label: 'Body index', value: '[Recorded value]', detail: 'For personal reference' },
    { label: 'Resting pulse', value: '[Recorded value]', detail: 'Recorded baseline' },
  ],
};

export type PatientAppointment = {
  id: string;
  date: string;
  time: string;
  clinician: string;
  type: string;
  typeAr?: string;
  clinic: string;
  room: string;
  status: 'confirmed' | 'completed';
  detail: string;
};

export const patientAppointmentsFixture: PatientAppointment[] = [
  { id: 'APT-DEMO-01', date: '[Appointment Date]', time: '[Appointment Time] (Local Time)', clinician: 'Dr. [Doctor Name]', type: 'Consultation', typeAr: 'كشف استشاري', clinic: '[Clinic Name] • [Clinic Location]', room: 'Room [Number]', status: 'confirmed', detail: 'Upcoming consultation' },
  { id: 'APT-DEMO-02', date: '[Previous Date]', time: '[Previous Time]', clinician: 'Dr. [Doctor Name]', type: 'Follow-up consultation', typeAr: 'استشارة متابعة', clinic: '[Clinic Name]', room: 'Consultation room', status: 'completed', detail: 'Past visit summary available' },
  { id: 'APT-DEMO-03', date: '[Earlier Date]', time: '[Earlier Time]', clinician: 'Dr. [Doctor Name]', type: 'Care review', typeAr: 'مراجعة الخطة العلاجية', clinic: '[Clinic Name]', room: 'Consultation room', status: 'completed', detail: 'Past visit summary available' },
];

export type PatientMedication = {
  id: string;
  name: string;
  arabicName: string;
  schedule: string;
  timing: string;
  status: 'taken' | 'due' | 'scheduled';
  prescriptionStatus: string;
  clinician: string;
  reference: string;
  instruction: string;
  icon: string;
};

export const patientMedicationsFixture = {
  patientLabel: '[Patient Name]',
  patientId: '[Patient ID]',
  clinicName: '[Clinic Name]',
  clinician: 'Dr. [Doctor Name]',
  activeCount: '[Count]',
  refillCount: '[Count]',
  adherence: '[Recorded value]%',
  adherenceDetail: '[Recorded adherence summary]',
  scheduleDate: '[Date]',
  medications: [
    { id: 'MED-DEMO-01', name: '[Medication Name 1]', arabicName: '[الاسم الدوائي الأول]', schedule: '[Dosage] • [Frequency]', timing: '[Scheduled time]', status: 'taken', prescriptionStatus: '[Refill status]', clinician: 'Dr. [Doctor Name]', reference: '[Prescription Reference]', instruction: 'Use only according to the instructions in your clinician-reviewed record.', icon: 'medication' },
    { id: 'MED-DEMO-02', name: '[Medication Name 2]', arabicName: '[الاسم الدوائي الثاني]', schedule: '[Dosage] • [Frequency]', timing: '[Scheduled time]', status: 'due', prescriptionStatus: '[Refill status]', clinician: 'Dr. [Doctor Name]', reference: '[Prescription Reference]', instruction: 'Review the clinician-provided instructions in your medication record.', icon: 'favorite' },
    { id: 'MED-DEMO-03', name: '[Medication Name 3]', arabicName: '[الاسم الدوائي الثالث]', schedule: '[Dosage] • [Frequency]', timing: '[Scheduled time]', status: 'scheduled', prescriptionStatus: '[Refill status]', clinician: 'Dr. [Doctor Name]', reference: '[Prescription Reference]', instruction: 'This presentation does not change the prescribed treatment plan.', icon: 'water_drop' },
  ] as PatientMedication[],
};

export type PatientLabResult = {
  id: string;
  category: 'blood' | 'diagnostic' | 'imaging';
  name: string;
  detail: string;
  value: string;
  valueLabel: string;
  referenceRange: string;
  marker: number;
  markerLabel: string;
  status: string;
  statusTone: 'neutral' | 'recorded';
  statusIcon: string;
  date: string;
  archiveLabel: string;
  archiveNote: string;
};

export const patientLabsFixture = {
  patientLabel: '[Patient Name]',
  patientId: '[Patient ID]',
  clinicName: '[Clinic Name]',
  laboratoryName: '[Laboratory Name]',
  clinician: '[Clinician Name]',
  reportCount: '[Count]',
  latestReportDate: '[Report Date]',
  panelName: '[Diagnostic Panel Name]',
  panelDetail: '[Panel Category] • [Specimen Label]',
  panelStatus: '[Report Status]',
  nextReportLabel: '[Next Report Context]',
  results: [
    { id: 'LAB-DEMO-01', category: 'blood', name: '[Test Name 1]', detail: '[Specimen Label]', value: '[Result Value]', valueLabel: '[Unit]', referenceRange: '[Reference Range]', marker: 50, markerLabel: '[Recorded marker]', status: '[Status]', statusTone: 'neutral', statusIcon: 'visibility', date: '[Report Date]', archiveLabel: '[Recorded field]', archiveNote: 'Neutral presentation only. Review with your clinician.', },
    { id: 'LAB-DEMO-02', category: 'blood', name: '[Test Name 2]', detail: '[Specimen Label]', value: '[Result Value]', valueLabel: '[Unit]', referenceRange: '[Reference Range]', marker: 65, markerLabel: '[Recorded marker]', status: '[Status]', statusTone: 'neutral', statusIcon: 'visibility', date: '[Report Date]', archiveLabel: '[Recorded field]', archiveNote: 'No clinical meaning is inferred from this synthetic value.', },
    { id: 'LAB-DEMO-03', category: 'blood', name: '[Test Name 3]', detail: '[Specimen Label]', value: '[Result Value]', valueLabel: '[Unit]', referenceRange: '[Reference Range]', marker: 42, markerLabel: '[Recorded marker]', status: '[Status]', statusTone: 'recorded', statusIcon: 'check_circle', date: '[Report Date]', archiveLabel: '[Recorded field]', archiveNote: 'Status is displayed as supplied by the local demo fixture.', },
    { id: 'LAB-DEMO-04', category: 'blood', name: '[Test Name 4]', detail: '[Specimen Label]', value: '[Result Value]', valueLabel: '[Unit]', referenceRange: '[Reference Range]', marker: 55, markerLabel: '[Recorded marker]', status: '[Status]', statusTone: 'recorded', statusIcon: 'check_circle', date: '[Report Date]', archiveLabel: '[Recorded field]', archiveNote: 'Reference fields are presentation-only in this frontend.', },
    { id: 'LAB-DEMO-05', category: 'diagnostic', name: '[Test Name 5]', detail: '[Specimen Label]', value: '[Result Value]', valueLabel: '[Unit]', referenceRange: '[Reference Range]', marker: 48, markerLabel: '[Recorded marker]', status: '[Status]', statusTone: 'recorded', statusIcon: 'check_circle', date: '[Report Date]', archiveLabel: '[Recorded field]', archiveNote: 'No diagnosis or treatment recommendation is generated.', },
    { id: 'LAB-DEMO-06', category: 'imaging', name: '[Test Name 6]', detail: '[Specimen Label]', value: '[Result Value]', valueLabel: '[Unit]', referenceRange: '[Reference Range]', marker: 70, markerLabel: '[Recorded marker]', status: '[Status]', statusTone: 'neutral', statusIcon: 'visibility', date: '[Report Date]', archiveLabel: '[Recorded field]', archiveNote: 'This archived presentation is not a radiology interpretation.', },
  ] as PatientLabResult[],
  archive: [
    { id: 'ARCHIVE-DEMO-01', category: 'diagnostic', name: '[Diagnostic Report 1]', detail: '[Diagnostic Category]', value: '[Result Value]', valueLabel: '[Unit]', referenceRange: '[Reference Range]', marker: 50, markerLabel: '[Recorded marker]', status: '[Status]', statusTone: 'recorded', statusIcon: 'visibility', date: '[Report Date]', archiveLabel: '[Recorded field]', archiveNote: 'View-only synthetic archive item.' },
    { id: 'ARCHIVE-DEMO-02', category: 'imaging', name: '[Diagnostic Report 2]', detail: '[Diagnostic Category]', value: '[Result Value]', valueLabel: '[Unit]', referenceRange: '[Reference Range]', marker: 50, markerLabel: '[Recorded marker]', status: '[Status]', statusTone: 'neutral', statusIcon: 'visibility', date: '[Report Date]', archiveLabel: '[Recorded field]', archiveNote: 'No external report or imaging service is connected.' },
    { id: 'ARCHIVE-DEMO-03', category: 'blood', name: '[Diagnostic Report 3]', detail: '[Diagnostic Category]', value: '[Result Value]', valueLabel: '[Unit]', referenceRange: '[Reference Range]', marker: 50, markerLabel: '[Recorded marker]', status: '[Status]', statusTone: 'recorded', statusIcon: 'visibility', date: '[Report Date]', archiveLabel: '[Recorded field]', archiveNote: 'Synthetic patient-scoped record for presentation only.' },
  ] as PatientLabResult[],
};

export type PatientAiPrompt = {
  id: string;
  label: string;
  arabic: string;
  response: string;
};

export const patientAiFixture = {
  patientLabel: '[Patient Name]',
  clinicName: '[Clinic Name]',
  scopeReference: '[Session Reference]',
  initialQuestion: '[Patient question about appointment preparation and portal navigation]',
  prompts: [
    { id: 'AI-PROMPT-01', label: 'How should I prepare for my appointment?', arabic: 'كيف أستعد لموعدي الطبي القادم؟', response: 'This local demo can point you to the appointment page, where synthetic date, time, and preparation fields are displayed. Discuss any clinical preparation question with your clinician.' },
    { id: 'AI-PROMPT-02', label: 'Where can I find my patient records?', arabic: 'أين أجد سجلاتي في بوابة المريض؟', response: 'Use the Patient Portal navigation to open your profile, appointments, medications, or laboratory records. This assistant does not search outside your own patient-scoped pages.' },
    { id: 'AI-PROMPT-03', label: 'How do I review my authorized context?', arabic: 'كيف أراجع سياق البيانات المصرح بها؟', response: 'Open the separate Authorized Context route to review its presentation. This M6 demo does not edit context, permissions, or record sources.' },
    { id: 'AI-PROMPT-04', label: 'How can I prepare questions for my clinician?', arabic: 'كيف أجهز أسئلتي للطبيب؟', response: 'You can note questions about your portal records and bring them to your appointment. Clinical interpretation and treatment decisions remain with your clinician.' },
  ] as PatientAiPrompt[],
};

export type PatientAiContextDomain = {
  id: string;
  label: string;
  shortLabel: string;
  source: string;
  record: string;
  boundary: string;
  controlLabel: string;
  icon: string;
  tone: 'primary' | 'secondary' | 'tertiary';
  displayWeight: string;
  enabled: boolean;
};

export const patientAiContextFixture = {
  patientLabel: '[Patient Name]',
  patientId: '[Patient ID]',
  clinicName: '[Clinic Name]',
  allocation: '[Count]%',
  domains: [
    { id: 'CONTEXT-DEMO-01', label: 'Appointment context', shortLabel: 'Appointments', source: '[Appointment Information]', record: '[Appointment ID] • [Doctor Name] • [Appointment Date]', boundary: 'Scheduling and preparation presentation only.', controlLabel: 'Scheduling view', icon: 'calendar_month', tone: 'primary', displayWeight: '[Share]', enabled: true },
    { id: 'CONTEXT-DEMO-02', label: 'Medication context', shortLabel: 'Medications', source: '[Medication Information]', record: '[Medication Information] • [Prescription Reference]', boundary: 'View-only medication context; no dose or treatment changes.', controlLabel: 'Medication record view', icon: 'prescriptions', tone: 'secondary', displayWeight: '[Share]', enabled: true },
    { id: 'CONTEXT-DEMO-03', label: 'Diagnostic context', shortLabel: 'Diagnostics', source: '[Lab Result]', record: '[Lab Result] • [Report Reference]', boundary: 'Presentation of authorized result labels only; no interpretation.', controlLabel: 'Diagnostic record view', icon: 'biotech', tone: 'tertiary', displayWeight: '[Share]', enabled: true },
    { id: 'CONTEXT-DEMO-04', label: 'Care instructions context', shortLabel: 'Care instructions', source: '[Care Instruction]', record: '[Care Instruction] • [Clinic Preparation Label]', boundary: 'General portal information; clinician decisions remain outside this page.', controlLabel: 'Preparation information', icon: 'assignment_turned_in', tone: 'primary', displayWeight: '[Share]', enabled: true },
  ] as PatientAiContextDomain[],
  events: [
    { id: 'CONTEXT-EVENT-01', timestamp: '[Date] [Time]', category: '[Medication Information]', source: '[Patient-provided placeholder]', status: 'Displayed locally', tone: 'active' },
    { id: 'CONTEXT-EVENT-02', timestamp: '[Date] [Time]', category: '[Lab Result]', source: '[Clinician-reviewed placeholder]', status: 'Displayed locally', tone: 'active' },
    { id: 'CONTEXT-EVENT-03', timestamp: '[Date] [Time]', category: '[Draft Context Item]', source: '[Unverified placeholder]', status: 'Excluded locally', tone: 'filtered' },
  ] as { id: string; timestamp: string; category: string; source: string; status: string; tone: 'active' | 'filtered' }[],
};

export type PatientAiHistoryEntry = {
  id: string;
  category: 'appointment' | 'medication' | 'lab' | 'care';
  categoryLabel: string;
  icon: string;
  date: string;
  reference: string;
  status: string;
  statusIcon: string;
  title: string;
  question: string;
  response: string;
  detail: string;
  summaryStatus: string;
};

export const patientAiHistoryFixture = {
  patientLabel: '[Patient Name]',
  sessionCount: '[Interaction Count]',
  categories: [
    { id: 'all' as const, label: 'All topics', icon: 'history' },
    { id: 'appointment' as const, label: '[Appointment Information]', icon: 'calendar_clock' },
    { id: 'medication' as const, label: '[Medication Information]', icon: 'medication' },
    { id: 'lab' as const, label: '[Lab Result]', icon: 'biotech' },
    { id: 'care' as const, label: '[Care Instruction]', icon: 'assignment_turned_in' },
  ],
  entries: [
    { id: 'HISTORY-DEMO-01', category: 'appointment', categoryLabel: '[Appointment Information]', icon: 'calendar_month', date: '[Interaction Date]', reference: '[Interaction ID]', status: 'Informational only', statusIcon: 'info', title: '[Appointment Topic]', question: '[Conversation Topic about appointment preparation]', response: 'Local summary: the appointment page contains the synthetic date, time, and preparation fields for this patient view.', detail: 'No booking, clinical advice, or clinician communication was created by this archived demo item.', summaryStatus: 'Local presentation summary' },
    { id: 'HISTORY-DEMO-02', category: 'medication', categoryLabel: '[Medication Information]', icon: 'medication', date: '[Interaction Date]', reference: '[Interaction ID]', status: 'View only', statusIcon: 'verified_user', title: '[Medication Topic]', question: '[Conversation Topic about finding medication records]', response: 'Local summary: use the Patient Portal medication page to review synthetic medication records. Treatment decisions remain with your clinician.', detail: 'This history item does not recommend doses, changes, or actions and is not a medication record.', summaryStatus: 'Bounded informational summary' },
    { id: 'HISTORY-DEMO-03', category: 'lab', categoryLabel: '[Lab Result]', icon: 'science', date: '[Interaction Date]', reference: '[Interaction ID]', status: 'Non-diagnostic', statusIcon: 'shield', title: '[Laboratory Topic]', question: '[Conversation Topic about locating a laboratory report]', response: 'Local summary: the Patient Portal laboratory page contains synthetic result labels and report context. No interpretation is included.', detail: 'This item does not interpret values, diagnose conditions, or recommend treatment.', summaryStatus: 'Status navigation only' },
  ] as PatientAiHistoryEntry[],
};

export type PatientVitalCategory = 'blood-pressure' | 'blood-glucose' | 'pulse' | 'weight';

export const patientVitalsFixture = {
  patientLabel: '[Patient Name]',
  clinicName: '[Clinic Name]',
  clinician: '[Clinician Name]',
  categories: [
    { id: 'blood-pressure' as PatientVitalCategory, label: 'Blood pressure', labelAr: 'ضغط الدم', shortLabel: 'Blood pressure', shortLabelAr: 'ضغط الدم', icon: 'cardiology' },
    { id: 'blood-glucose' as PatientVitalCategory, label: 'Blood glucose', labelAr: 'سكر الدم', shortLabel: 'Blood glucose', shortLabelAr: 'سكر الدم', icon: 'water_drop' },
    { id: 'pulse' as PatientVitalCategory, label: 'Pulse rate', labelAr: 'النبض', shortLabel: 'Pulse', shortLabelAr: 'النبض', icon: 'ecg_heart' },
    { id: 'weight' as PatientVitalCategory, label: 'Body weight', labelAr: 'الوزن', shortLabel: 'Weight', shortLabelAr: 'الوزن', icon: 'scale' },
  ],
  overview: [
    { id: 'VITAL-DEMO-01', label: 'Blood pressure', labelAr: 'ضغط الدم', value: '[Value]', unit: '[Unit]', status: '[Reference status]', recordedAt: '[Measurement date]', source: '[Source]', icon: 'cardiology' },
    { id: 'VITAL-DEMO-02', label: 'Blood glucose', labelAr: 'سكر الدم', value: '[Value]', unit: '[Unit]', status: '[Reference status]', recordedAt: '[Measurement date]', source: '[Source]', icon: 'water_drop' },
    { id: 'VITAL-DEMO-03', label: 'Resting heart rate', labelAr: 'نبض الراحة', value: '[Value]', unit: '[Unit]', status: '[Reference status]', recordedAt: '[Measurement date]', source: '[Source]', icon: 'ecg_heart' },
    { id: 'VITAL-DEMO-04', label: 'Body mass', labelAr: 'الوزن والكتلة', value: '[Value]', unit: '[Unit]', status: '[Reference status]', recordedAt: '[Measurement date]', source: '[Source]', icon: 'scale' },
  ],
  history: [
    { id: 'VITAL-HISTORY-01', category: 'blood-pressure' as PatientVitalCategory, date: '[Measurement date]', time: '[Measurement time]', value: '[Value]', unit: '[Unit]', context: '[Measurement context]', source: '[Source]', icon: 'cardiology' },
    { id: 'VITAL-HISTORY-02', category: 'blood-glucose' as PatientVitalCategory, date: '[Measurement date]', time: '[Measurement time]', value: '[Value]', unit: '[Unit]', context: '[Measurement context]', source: '[Source]', icon: 'water_drop' },
    { id: 'VITAL-HISTORY-03', category: 'blood-pressure' as PatientVitalCategory, date: '[Measurement date]', time: '[Measurement time]', value: '[Value]', unit: '[Unit]', context: '[Measurement context]', source: '[Source]', icon: 'cardiology' },
    { id: 'VITAL-HISTORY-04', category: 'pulse' as PatientVitalCategory, date: '[Measurement date]', time: '[Measurement time]', value: '[Value]', unit: '[Unit]', context: '[Measurement context]', source: '[Source]', icon: 'ecg_heart' },
    { id: 'VITAL-HISTORY-05', category: 'weight' as PatientVitalCategory, date: '[Measurement date]', time: '[Measurement time]', value: '[Value]', unit: '[Unit]', context: '[Measurement context]', source: '[Source]', icon: 'scale' },
  ],
  guidance: [
    { id: 'GUIDANCE-DEMO-01', title: 'Quiet measurement context', titleAr: 'بيئة قياس هادئة ومناسبة', text: 'Record the context shown by your own measurement process for later discussion. This page does not assess the result.', textAr: 'سجل الظروف المحيطة بعملية القياس لمناقشتها لاحقاً مع الطبيب. هذه الصفحة لا تقيّم النتيجة سريرياً.' },
    { id: 'GUIDANCE-DEMO-02', title: 'Consistent presentation', titleAr: 'تسجيل متسق ومنتظم', text: 'Use the same local labels and units when reviewing your synthetic entries. No device connection or calibration check is active.', textAr: 'استخدم نفس الوحدات والتسميات المحلية عند مراجعة قياساتك. لا يوجد اتصال بأجهزة قياس أو فحص معايرة نشط.' },
    { id: 'GUIDANCE-DEMO-03', title: 'Prepare clinician questions', titleAr: 'تجهيز أسئلة للطبيب', text: 'Bring questions about your portal entries to your authorized clinician rather than changing care based on this page.', textAr: 'اطرح استفساراتك حول قياساتك المسجلة على طبيبك المعالج بدلاً من تغيير خطتك العلاجية بناءً على هذه الصفحة.' },
  ],
};
