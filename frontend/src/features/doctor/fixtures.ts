import type { Appointment, Patient } from '../../contracts/domain';

export type DoctorAppointment = Appointment & {
  time: string;
  patientName: string;
  visitType: string;
  room: string;
};

export type DoctorPatient = Patient & {
  age: number;
  status: 'stable' | 'follow-up' | 'awaiting-labs';
  nextVisit: string;
  lastVisit: string;
};

type PatientProfileVital = {
  label: string;
  value: string;
  valueSuffix: string;
  status: string;
  icon: string;
  tone: 'primary' | 'secondary' | 'tertiary' | 'neutral';
};

type PatientProfileCondition = {
  title: string;
  detail: string;
  status: string;
  tag: string;
  tone: 'primary' | 'secondary' | 'tertiary';
};

type PatientProfileMedication = {
  name: string;
  frequency: string;
  status: string;
  variant: 'primary' | 'secondary';
};

type PatientProfileAction = {
  label: string;
  subLabel: string;
  icon: string;
};

type PatientProfileEncounter = {
  title: string;
  tag: string;
  detail: string;
  noteCount: number;
};

type PatientProfileCareTeamMember = {
  name: string;
  role: string;
  badge: string;
  tone: 'primary' | 'secondary';
};

type PatientHistoryItem = {
  title: string;
  detail: string;
  status: string;
  icon?: string;
};

export type PatientTimelineCategory = 'visit' | 'notes' | 'rx' | 'lab' | 'procedure';

export type PatientNoteCategory = 'soap' | 'consult' | 'diagnostic' | 'discharge';

export type PatientDocumentCategory = 'diagnostic' | 'pathology' | 'surgical' | 'discharge' | 'referral';

export type PatientPrescriptionStatus = 'active' | 'completed' | 'suspended';

export type DoctorOrderType = 'lab' | 'imaging';
export type DoctorOrderStatus = 'draft' | 'pending' | 'submitted' | 'completed';

type DoctorOrder = {
  id: string;
  patientId: string;
  patientName: string;
  type: DoctorOrderType;
  typeLabel: string;
  title: string;
  detail: string;
  priority: 'urgent' | 'routine';
  priorityLabel: string;
  date: string;
  time: string;
  orderingDoctor: string;
  status: DoctorOrderStatus;
  statusLabel: string;
};

type PatientPrescription = {
  id: string;
  patientId: string;
  status: PatientPrescriptionStatus;
  statusLabel: string;
  signatureId: string;
  prescribedDate: string;
  prescriber: string;
  refillsRemaining: number;
  progress: number;
  progressLabel: string;
  instructions: string;
  medications: { name: string; dosage: string; frequency: string; route: string; duration: string; badge: string; icon: string }[];
};

type PatientDocument = {
  id: string;
  patientId: string;
  category: PatientDocumentCategory;
  categoryLabel: string;
  icon: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  author: string;
  authorRole: string;
  fileType: string;
  size: string;
  status: string;
  statusIcon: string;
};

type PatientNote = {
  id: string;
  patientId: string;
  category: PatientNoteCategory;
  typeLabel: string;
  status: string;
  date: string;
  savedAt: string;
  encounterDate: string;
  author: string;
  department: string;
  title: string;
  subtitle: string;
  preview: string;
  subjective: string;
  subjectiveArabic: string;
  subjectivePoints: string[];
  vitals: { label: string; value: string; detail: string }[];
  objective: string;
  assessment: { title: string; detail: string; status: string }[];
  plan: { title: string; detail: string; arabic: string }[];
};

type PatientTimelineEvent = {
  id: string;
  category: PatientTimelineCategory;
  tone: 'primary' | 'secondary' | 'tertiary';
  icon: string;
  dateLabel: string;
  date: string;
  typeLabel: string;
  title: string;
  description: string;
  attending: string;
  details: { label: string; value: string }[];
};

export type DoctorPatientProfile = Patient & {
  age: number;
  gender: string;
  statusText: string;
  clinic: string;
  vitals: PatientProfileVital[];
  conditions: PatientProfileCondition[];
  medications: PatientProfileMedication[];
  nextVisit: { title: string; label: string; subtitle: string };
  fastActions: PatientProfileAction[];
  recentEncounters: PatientProfileEncounter[];
  careTeam: PatientProfileCareTeamMember[];
};

export const doctorPatientHistory = {
  summary: [
    { label: 'ACTIVE CONDITIONS / الحالات المسجلة', value: 'Documented', detail: 'Clinical History Active', icon: 'cardiology' },
    { label: 'MEDICATIONS / الأدوية المسجلة', value: 'Documented', detail: 'Standard Medication Record', icon: 'medication' },
    { label: 'PROCEDURE HISTORY / الإجراءات السابقة', value: 'Documented', detail: 'Historical Entries Present', icon: 'history_edu' },
    { label: 'CLINICAL STATUS / الحالة العامة', value: 'Stable', detail: 'Routine Evaluation Active', icon: 'vital_signs' },
  ],
  allergies: [
    { title: 'Documented Clinical Precaution / تنبيه سريري مسجل', detail: 'Clinical allergy review recorded. Re-evaluate as clinically indicated.', status: 'Documented', icon: 'info' },
    { title: 'Food & Environmental Screening / فحص الحساسية البيئية والغذائية', detail: 'Documented screening recorded.', status: 'Recorded' },
  ] satisfies PatientHistoryItem[],
  conditions: [
    { title: 'Documented Chronic Condition / حالة مزمنة مسجلة', detail: 'Documented in clinical record. Ongoing routine evaluation.', status: 'Monitored / متابع' },
    { title: 'Documented Chronic Condition / حالة مزمنة مسجلة', detail: 'Follow-up required • Review scheduled', status: 'Under Review / قيد المراجعة' },
    { title: 'Documented Chronic Condition / حالة مزمنة مسجلة', detail: 'Routine observation • Maintenance therapy active', status: 'Stable / مستقر' },
  ] satisfies PatientHistoryItem[],
  procedures: [
    { title: 'Documented Procedure / إجراء سريري مسجل', detail: 'Clinical procedure recorded in patient history. Follow-up documented.', status: 'Recorded Procedure', icon: 'file_copy' },
    { title: 'Documented Surgical History / تاريخ جراحي مسجل', detail: 'Surgical intervention documented in medical record.', status: 'Recorded Procedure', icon: 'content_cut' },
  ] satisfies PatientHistoryItem[],
  family: [
    { title: 'Immediate Family / الدرجة الأولى', detail: 'Medical history documented / تاريخ طبي مسجل', status: 'Documented' },
    { title: 'Extended Family / العائلة', detail: 'Screening documented / فحص مسجل', status: 'Documented' },
  ] satisfies PatientHistoryItem[],
  social: [
    { title: 'Lifestyle Screening / الفحص السلوكي', detail: 'Documented screening recorded.', status: 'Documented', icon: 'psychology' },
  ] satisfies PatientHistoryItem[],
};

export const doctorPatientTimeline: PatientTimelineEvent[] = [
  {
    id: 'TIMELINE-DEMO-01', category: 'visit', tone: 'primary', icon: 'vital_signs', dateLabel: 'Today', date: 'Today, 10:15 AM (Cairo CST)', typeLabel: 'Triage Intake', title: 'Vital Signs & Bedside Check',
    description: 'Recorded at Reception Triage Desk by Staff Nurse. Patient reported mild morning lightheadedness after fasting.', attending: 'Dr. Tarek El-Kabbani',
    details: [{ label: 'Vital Signs', value: 'Recorded' }, { label: 'Pulse', value: 'Regular' }, { label: 'Glucose', value: 'Monitored' }, { label: 'Oxygen', value: 'Normal' }],
  },
  {
    id: 'TIMELINE-DEMO-02', category: 'notes', tone: 'secondary', icon: 'description', dateLabel: "Jan '25", date: '12 Jan 2025, 11:30 AM', typeLabel: 'SOAP Note', title: 'Follow-up Consultation & Cardiological Review',
    description: 'Clinical evaluation recorded in the patient chart during routine consultation.', attending: 'Dr. Tarek El-Kabbani',
    details: [{ label: 'Assessment', value: 'Clinical evaluation recorded' }, { label: 'Plan', value: 'Care plan maintained' }],
  },
  {
    id: 'TIMELINE-DEMO-03', category: 'lab', tone: 'primary', icon: 'science', dateLabel: "Jan '25", date: '10 Jan 2025, 09:00 AM', typeLabel: 'Lab Results', title: 'Routine Diagnostic Panel',
    description: 'Laboratory results were reviewed and documented as part of the longitudinal clinical record.', attending: 'Clinical Care Team',
    details: [{ label: 'Panel', value: 'Documented' }, { label: 'Review', value: 'Verified' }],
  },
  {
    id: 'TIMELINE-DEMO-04', category: 'rx', tone: 'tertiary', icon: 'prescriptions', dateLabel: "Dec '24", date: '18 Dec 2024, 02:15 PM', typeLabel: 'Prescription', title: 'Medication Regimen Review',
    description: 'Active medication regimen reviewed and recorded during follow-up care.', attending: 'Attending Physician',
    details: [{ label: 'Medication Record', value: 'Active' }, { label: 'Status', value: 'Documented' }],
  },
  {
    id: 'TIMELINE-DEMO-05', category: 'procedure', tone: 'secondary', icon: 'medical_services', dateLabel: "Oct '24", date: '04 Oct 2024, 01:00 PM', typeLabel: 'Procedure', title: 'Documented Clinical Procedure',
    description: 'Procedure entry recorded in the patient history with follow-up documentation.', attending: 'Clinical Care Team',
    details: [{ label: 'Facility', value: 'Clinical Center' }, { label: 'Status', value: 'Recorded' }],
  },
];

export const doctorPatientNotes: PatientNote[] = [
  {
    id: 'NOTE-DEMO-01', patientId: 'PT-DEMO-01', category: 'soap', typeLabel: 'Active View', status: 'Signed & Finalized', date: '12 Jan 2025 • 11:30 AM', savedAt: '12 Jan 2025 11:35 AM', encounterDate: '12 January 2025', author: 'Dr. Tarek El-Kabbani', department: 'Cardiology Consultation', title: 'Follow-up Cardiology Visit', subtitle: 'متابعة ضغط الدم ومراجعة وظائف القلب', preview: 'Medication adherence confirmed. Morning orthostatic dizziness explored. Resting BP stabilized at 136/84 mmHg with Lisinopril.',
    subjective: 'Patient presents for routine follow-up regarding chronic hypertension and Type 2 Diabetes management. Synthetic demo history indicates diligent compliance with the documented regimen.', subjectiveArabic: 'أشعر بتحسن عام والتزمت بالعلاج تماماً. لا توجد آلام بالصدر أو نهجان، لكن ألاحظ دوخة خفيفة أحياناً بعد الاستيقاظ.', subjectivePoints: ['Denies angina pectoris, substernal tightness, or radiation to left shoulder/jaw.', 'Denies paroxysmal nocturnal dyspnea or orthopnea.', 'Mild transient morning postural lightheadedness reported without syncope.'],
    vitals: [{ label: 'Blood Pressure', value: '136 / 84', detail: 'mmHg • Right Arm, Sitting' }, { label: 'Heart Rate', value: '74', detail: 'bpm • Regular Sinus' }, { label: 'SpO2 Oxygen', value: '98%', detail: 'Room Air / هواء الغرفة' }, { label: 'BMI', value: '27.3', detail: 'Wt: 84 kg • Ht: 175 cm' }], objective: 'Synthetic examination summary: normal heart sounds, clear lungs, intact peripheral pulses, and no documented edema in this demonstration record.',
    assessment: [{ title: 'Essential (Primary) Hypertension', detail: 'Synthetic clinical context: controlled status recorded for this frontend demonstration.', status: 'Controlled' }, { title: 'Type 2 Diabetes Mellitus without complications', detail: 'Synthetic clinical context: maintenance therapy status recorded for this frontend demonstration.', status: 'Stable' }],
    plan: [{ title: 'Documented regimen review', detail: 'Medication entries remain display-only synthetic fixture data.', arabic: 'مراجعة سجل العلاج الدوائي المسجل' }, { title: 'Follow-up & laboratory review', detail: 'Future review reminder represented as static demonstration content.', arabic: 'متابعة الفحوصات المخبرية الدورية' }],
  },
  {
    id: 'NOTE-DEMO-02', patientId: 'PT-DEMO-01', category: 'soap', typeLabel: 'SOAP', status: 'Finalized', date: '14 Nov 2024 • 02:15 PM', savedAt: '14 Nov 2024 02:20 PM', encounterDate: '14 November 2024', author: 'Dr. Mona El-Shazly', department: 'Endocrine Review', title: 'Endocrine Diabetic Review', subtitle: 'استشارة متابعة السكري وفحص قاع العين', preview: 'Synthetic note preview for an endocrine follow-up and routine monitoring record.',
    subjective: 'Synthetic historical note content for the selected demonstration patient.', subjectiveArabic: 'ملخص سريري تجريبي باللغة العربية.', subjectivePoints: ['Routine follow-up entry recorded.', 'No acute concern represented in this fixture.', 'Review status remains display-only.'], vitals: [{ label: 'Panel', value: 'Recorded', detail: 'Synthetic result' }], objective: 'Synthetic objective summary for the notes archive.', assessment: [{ title: 'Routine endocrine review', detail: 'Display-only synthetic assessment.', status: 'Stable' }], plan: [{ title: 'Routine review', detail: 'Display-only synthetic plan.', arabic: 'خطة متابعة تجريبية' }],
  },
  {
    id: 'NOTE-DEMO-03', patientId: 'PT-DEMO-01', category: 'diagnostic', typeLabel: 'Diagnostic', status: 'Finalized', date: '04 Sep 2024 • 09:45 AM', savedAt: '04 Sep 2024 10:00 AM', encounterDate: '04 September 2024', author: 'Dr. Physician Demo', department: 'Diagnostics', title: 'Stress ECG Report Note', subtitle: 'تقرير اختبار الجهد التخطيطي للقلب', preview: 'Synthetic diagnostic note preview for the clinical notes archive.', subjective: 'Synthetic diagnostic context.', subjectiveArabic: 'سياق تشخيصي تجريبي.', subjectivePoints: ['Diagnostic record is display-only.'], vitals: [{ label: 'Report', value: 'Recorded', detail: 'Synthetic result' }], objective: 'Synthetic diagnostic observation.', assessment: [{ title: 'Stress ECG review', detail: 'Display-only synthetic assessment.', status: 'Recorded' }], plan: [{ title: 'Archive', detail: 'No persistence is connected.', arabic: 'سجل تجريبي غير متصل بالتخزين' }],
  },
  {
    id: 'NOTE-DEMO-04', patientId: 'PT-DEMO-01', category: 'discharge', typeLabel: 'Discharge', status: 'Archive', date: '15 May 2023 • 10:00 AM', savedAt: '15 May 2023 10:10 AM', encounterDate: '15 May 2023', author: 'Dr. Physician Demo', department: 'Clinical Care Team', title: 'Post-PCI Discharge Summary', subtitle: 'ملخص الخروج بعد القسطرة العلاجية للقلب', preview: 'Synthetic archived discharge note preview for the clinical notes workspace.', subjective: 'Synthetic archived context.', subjectiveArabic: 'سياق أرشيفي تجريبي.', subjectivePoints: ['Archived record is display-only.'], vitals: [{ label: 'Status', value: 'Archived', detail: 'Synthetic record' }], objective: 'Synthetic archived observation.', assessment: [{ title: 'Discharge summary', detail: 'Display-only synthetic assessment.', status: 'Archive' }], plan: [{ title: 'Archive only', detail: 'No persistence is connected.', arabic: 'سجل أرشيفي غير متصل بالتخزين' }],
  },
];

export const doctorPatientDocuments: PatientDocument[] = [
  { id: 'DOC-DEMO-01', patientId: 'PT-DEMO-01', category: 'discharge', categoryLabel: 'Hospital Discharge', icon: 'assignment_turned_in', title: 'Clinical Discharge Summary', subtitle: 'ملخص خروج سريري شامل • Post-Angioplasty', date: '12 Jan 2025', time: '10:42 AM', author: 'Dr. Tarek El-Kabbani', authorRole: 'Attending Cardiologist', fileType: 'PDF', size: '2.4 MB', status: 'Physician Verified', statusIcon: 'verified' },
  { id: 'DOC-DEMO-02', patientId: 'PT-DEMO-01', category: 'pathology', categoryLabel: 'Pathology', icon: 'biotech', title: 'Histopathology Specimen Analysis', subtitle: 'فحص عينة الأنسجة السريرية • Surgical Biopsy', date: '08 Jan 2025', time: '08:15 AM', author: 'Specialist Clinician', authorRole: 'Pathology Department', fileType: 'PDF', size: '1.8 MB', status: 'Lab Validated', statusIcon: 'verified' },
  { id: 'DOC-DEMO-03', patientId: 'PT-DEMO-01', category: 'diagnostic', categoryLabel: 'Diagnostic Reports', icon: 'vital_signs', title: 'Cardiac Ultrasound Diagnostic Evaluation', subtitle: 'تقرير أشعة إيكو للقلب • Transthoracic Echo', date: '04 Jan 2025', time: '03:30 PM', author: 'Dr. Tarek El-Kabbani', authorRole: 'Attending Cardiologist', fileType: 'DICOM PDF', size: '4.2 MB', status: 'Physician Signed', statusIcon: 'verified' },
  { id: 'DOC-DEMO-04', patientId: 'PT-DEMO-01', category: 'referral', categoryLabel: 'External Referrals', icon: 'forward_to_inbox', title: 'External Specialist Referral Letter', subtitle: 'خطاب إحالة تخصصية خارجية • Nephrology Consult', date: '18 Dec 2024', time: '11:10 AM', author: 'Specialist Clinician', authorRole: 'External Health System', fileType: 'Scanned PDF', size: '850 KB', status: 'Review Pending', statusIcon: 'pending' },
];

export const doctorPatientPrescriptions: PatientPrescription[] = [
  { id: 'RX-DEMO-01', patientId: 'PT-DEMO-01', status: 'active', statusLabel: 'Active / نشط', signatureId: 'SIG-DEMO-8832', prescribedDate: '12 Jan 2025', prescriber: 'Dr. Tarek El-Kabbani', refillsRemaining: 2, progress: 45, progressLabel: 'Day 14 of 30', instructions: 'Administer with a full glass of water. This is synthetic demonstration text only.', medications: [{ name: 'Lisinopril Demo 10 mg', dosage: '10 mg', frequency: 'Once daily', route: 'Oral / فموي', duration: '30 days', badge: 'Standard Regimen', icon: 'medication' }, { name: 'Metformin Demo 850 mg', dosage: '850 mg', frequency: 'Twice daily', route: 'Oral / فموي', duration: '30 days', badge: 'Standard Regimen', icon: 'vaccines' }] },
  { id: 'RX-DEMO-02', patientId: 'PT-DEMO-01', status: 'completed', statusLabel: 'Completed / مكتمل', signatureId: 'SIG-DEMO-7714', prescribedDate: '14 Nov 2024', prescriber: 'Dr. Mona El-Shazly', refillsRemaining: 0, progress: 100, progressLabel: 'Completed', instructions: 'Synthetic completed regimen record for visual demonstration only.', medications: [{ name: 'Cardio Support Demo', dosage: '20 mg', frequency: 'Once daily', route: 'Oral / فموي', duration: '90 days', badge: 'Completed', icon: 'medication' }] },
  { id: 'RX-DEMO-03', patientId: 'PT-DEMO-01', status: 'suspended', statusLabel: 'Suspended / معلق', signatureId: 'SIG-DEMO-6650', prescribedDate: '04 Sep 2024', prescriber: 'Dr. Physician Demo', refillsRemaining: 1, progress: 20, progressLabel: 'Review pending', instructions: 'Synthetic suspended regimen record. No clinical action is connected.', medications: [{ name: 'Maintenance Therapy Demo', dosage: '5 mg', frequency: 'As directed', route: 'Subcutaneous / تحت الجلد', duration: '14 days', badge: 'Review Required', icon: 'vaccines' }] },
];

export const doctorOrders: DoctorOrder[] = [
  { id: 'ORD-DEMO-89210', patientId: 'PT-DEMO-01', patientName: 'Mahmoud El-Sayed', type: 'lab', typeLabel: 'Lab', title: 'Complete Blood Count / CBC', detail: 'Specimen: Venous Blood', priority: 'urgent', priorityLabel: 'Urgent / عاجل', date: '18 Apr 2025', time: '09:20 AM', orderingDoctor: 'Dr. Tarek El-Kabbani', status: 'submitted', statusLabel: 'Submitted / تم الإرسال' },
  { id: 'ORD-DEMO-89209', patientId: 'PT-DEMO-02', patientName: 'Fatma Sherif', type: 'imaging', typeLabel: 'Imaging', title: 'Chest X-Ray PA/Lateral', detail: 'Modality: Digital Radiography', priority: 'routine', priorityLabel: 'Routine / اعتيادي', date: '18 Apr 2025', time: '08:45 AM', orderingDoctor: 'Dr. Tarek El-Kabbani', status: 'pending', statusLabel: 'Pending / قيد التنفيذ' },
  { id: 'ORD-DEMO-89204', patientId: 'PT-DEMO-03', patientName: 'Kareem El-Sayed', type: 'lab', typeLabel: 'Lab', title: 'Glycated Hemoglobin / HbA1c', detail: 'Specimen: Whole Blood', priority: 'routine', priorityLabel: 'Routine / اعتيادي', date: '17 Apr 2025', time: '02:15 PM', orderingDoctor: 'Dr. Tarek El-Kabbani', status: 'completed', statusLabel: 'Completed / مكتمل' },
  { id: 'ORD-DEMO-89198', patientId: 'PT-DEMO-01', patientName: 'Mahmoud El-Sayed', type: 'imaging', typeLabel: 'Imaging', title: 'Transthoracic Echocardiogram', detail: 'Modality: Cardiac Ultrasound', priority: 'routine', priorityLabel: 'Routine / اعتيادي', date: '16 Apr 2025', time: '11:10 AM', orderingDoctor: 'Dr. Tarek El-Kabbani', status: 'draft', statusLabel: 'Draft / مسودة' },
];

export const doctorMedicationDetails = {
  id: 'MED-DEMO-01',
  name: 'Lisinopril Demo 10 mg',
  dosage: '10 mg tablet',
  frequency: 'Once daily in the morning',
  route: 'Oral / فموي',
  duration: '30 days active',
  refillsRemaining: 2,
  quantity: '30 tablets',
  prescriber: 'Dr. Tarek El-Kabbani / د. طارق القباني',
  prescribedDate: '12 Jan 2025',
  instructions: 'Take one tablet with water in the morning. This instruction is synthetic demonstration content only.',
};

export const prescriptionMedicationOptions = [
  'Lisinopril Demo 10 mg',
  'Metformin Demo 850 mg',
  'Cardio Support Demo 20 mg',
];

export type DoctorAiPrompt = { id: string; title: string; subtitle: string; icon: string };

export const doctorAiPrompts: DoctorAiPrompt[] = [
  { id: 'synthesis', title: 'Encounter Synthesis', subtitle: 'Summarize visit and differential', icon: 'summarize' },
  { id: 'pharmacology', title: 'Pharmacology Check', subtitle: 'Review interactions and dosage', icon: 'medication' },
  { id: 'protocol', title: 'Protocol Guidance', subtitle: 'Match approved clinical protocol', icon: 'menu_book' },
];

export const doctorAiPatientPrompts: DoctorAiPrompt[] = [
  { id: 'timeline', title: 'Summarize Timeline', subtitle: 'Longitudinal HbA1c and BP', icon: 'timeline' },
  { id: 'soap', title: 'Draft Follow-Up SOAP', subtitle: 'Standardize encounter notes', icon: 'edit_note' },
  { id: 'contraindications', title: 'Review Contraindications', subtitle: 'SGLT2 / ARB / renal check', icon: 'medication_liquid' },
];

export const doctorAiDraft = {
  patientName: 'Synthetic Patient',
  encounterId: 'ENC-DEMO-01',
  subjective: 'Chief Complaint: Persistent retrosternal dull tightness and postprandial fullness for 3 weeks. Patient reports occasional nocturnal acid regurgitation.\n\nCurrent Compliance: Synthetic demonstration context only.',
  objective: 'Vitals: [Blood Pressure] | [Heart Rate] | [Respiratory Rate] | [SpO2] | [Temperature] | [BMI].\nCardiovascular: S1/S2 present, no murmurs. Chest clear to auscultation. Abdomen soft with mild epigastric tenderness.',
  assessment: '1. Gastroesophageal reflux symptoms - primary focus.\n2. Type 2 Diabetes Mellitus - synthetic context.\n3. Essential Hypertension - synthetic context.',
  plan: '1. Review authorized diagnostic context with the attending physician.\n2. Discuss medication and follow-up options during clinical review.\n3. Provide red-flag counseling appropriate to the encounter.',
};

export type VoiceSessionStatus = 'active' | 'pending' | 'signed';

export type DoctorVoiceSession = {
  id: string;
  patientName: string;
  patientId: string;
  appointmentId: string;
  purpose: string;
  date: string;
  duration: string;
  status: VoiceSessionStatus;
};

export const doctorVoiceSessions: DoctorVoiceSession[] = [
  { id: 'VOICE-DEMO-01', patientName: '[Patient Name]', patientId: 'PATIENT-DEMO-01', appointmentId: 'APT-DEMO-01', purpose: 'Cardiology consultation', date: 'Today, 10:45 AM', duration: '08m 42s', status: 'active' },
  { id: 'VOICE-DEMO-02', patientName: '[Patient Name]', patientId: 'PATIENT-DEMO-02', appointmentId: 'APT-DEMO-02', purpose: 'Follow-up review', date: 'Today, 09:20 AM', duration: '14m 02s', status: 'pending' },
  { id: 'VOICE-DEMO-03', patientName: '[Patient Name]', patientId: 'PATIENT-DEMO-03', appointmentId: 'APT-DEMO-03', purpose: 'Routine consultation', date: 'Yesterday, 03:10 PM', duration: '06m 18s', status: 'signed' },
];

export const doctorVoiceTranscript = [
  { speaker: 'Physician', time: '00:01:15', text: '[Doctor Inquiry]: Clinical assessment inquiry regarding chief symptoms and history.' },
  { speaker: 'Patient', time: '00:02:30', text: '[Patient Statement]: Description of chief complaint and symptom progression.' },
  { speaker: 'Physician', time: '00:05:12', text: '[Doctor Inquiry]: Examination findings and symptom clarification.' },
  { speaker: 'Patient', time: '00:08:14', text: '[Patient Statement]: Synthetic continuation of the authorized encounter context.' },
];

export const doctorVoiceSoapDraft = {
  subjective: 'Synthetic patient reports a persistent chief complaint requiring physician review. No real recording or patient record is represented.',
  objective: 'Vitals: [Blood Pressure] | [Heart Rate] | [Temperature] | [SpO2]. Examination findings remain synthetic placeholders pending physician verification.',
  assessment: 'Synthetic clinical assessment draft. Confirm symptoms, differential, allergies, and relevant history against the authorized clinical context.',
  plan: 'Synthetic plan draft for physician review. No order, prescription, diagnosis, or clinical record is created by this demonstration.',
};

export type CommunicationPriority = 'urgent' | 'routine' | 'standard';
export type CommunicationStatus = 'new' | 'in-review' | 'resolved';

export type DoctorCommunication = {
  id: string;
  patientLabel: string;
  patientId: string;
  subject: string;
  preview: string;
  priority: CommunicationPriority;
  status: CommunicationStatus;
  timestamp: string;
  channel: string;
  encounterId: string;
};

export const doctorCommunications: DoctorCommunication[] = [
  { id: 'COMM-DEMO-01', patientLabel: '[Patient Name: Patient A]', patientId: 'PATIENT-DEMO-01', subject: '[Subject: Mild dizziness after adjusted medication dosage]', preview: 'Synthetic inquiry about lightheadedness after a medication adjustment.', priority: 'urgent', status: 'new', timestamp: '25 min ago', channel: 'Escalated by: [Assistant Staff]', encounterId: 'ENC-DEMO-01' },
  { id: 'COMM-DEMO-02', patientLabel: '[Patient Name: Patient B]', patientId: 'PATIENT-DEMO-02', subject: '[Subject: Preparation for fasting lipid panel]', preview: 'Synthetic inquiry about preparation for a scheduled laboratory visit.', priority: 'routine', status: 'in-review', timestamp: '1 hour ago', channel: 'Escalated by: [Reception Triage]', encounterId: 'ENC-DEMO-02' },
  { id: 'COMM-DEMO-03', patientLabel: '[Patient Name: Patient C]', patientId: 'PATIENT-DEMO-03', subject: '[Subject: Clarification on inhaler administration technique]', preview: 'Synthetic follow-up about a documented medication instruction.', priority: 'standard', status: 'resolved', timestamp: '3 hours ago', channel: 'Channel: Synthetic Patient Portal', encounterId: 'ENC-DEMO-03' },
];

export const doctorCommunicationThread = {
  patientLabel: '[Patient Name: Patient A]',
  patientId: 'PATIENT-DEMO-01',
  encounterId: 'ENC-DEMO-01',
  inquiry: 'Synthetic patient message: I noticed mild lightheadedness after the adjusted medication demonstration. Should this be reviewed by the attending physician?',
  context: [
    { label: 'Active Problem', value: '[Primary Essential Hypertension]', detail: 'Synthetic ICD-10 I10 context' },
    { label: 'Current Medication', value: '[Sample Antihypertensive Agent]', detail: 'Oral daily • synthetic fixture' },
    { label: 'Allergies & Alerts', value: '[No Known Drug Allergies]', detail: 'Synthetic verification state' },
  ],
  messages: [
    { sender: 'Patient Portal', time: '09:10 AM', body: 'Synthetic inbound inquiry. No real patient communication was received.' },
    { sender: 'Doctor Workspace', time: '09:14 AM', body: 'Local review placeholder. Physician response remains unsent until explicitly authored in this demo.' },
  ],
  aiDraft: 'Synthetic assistive draft: acknowledge the reported symptom, request physician verification of the authorized context, and avoid autonomous medication instructions.',
};

export type RefillUrgency = 'priority' | 'standard';
export type RefillStatus = 'pending' | 'clarification' | 'approved' | 'rejected';

export type DoctorRefillRequest = {
  id: string;
  patientLabel: string;
  patientId: string;
  patientMeta: string;
  medication: string;
  dosage: string;
  className: string;
  lastDispensed: string;
  refillCount: string;
  requestedAt: string;
  urgency: RefillUrgency;
  status: RefillStatus;
  note: string;
};

export const doctorRefillRequests: DoctorRefillRequest[] = [
  { id: 'REFILL-DEMO-01', patientLabel: '[Patient Name: Patient A]', patientId: 'PATIENT-DEMO-01', patientMeta: '52Y • Female • Cardiology Cohort', medication: '[Medication Name: Sample Antihypertensive Agent]', dosage: '10mg Oral Daily', className: 'Antihypertensive', lastDispensed: '30 days ago', refillCount: 'Refill 2 of 3', requestedAt: '2025-05-14 • 08:45', urgency: 'priority', status: 'pending', note: 'Continuing maintenance dose as instructed during the last synthetic consultation.' },
  { id: 'REFILL-DEMO-02', patientLabel: '[Patient Name: Patient B]', patientId: 'PATIENT-DEMO-02', patientMeta: '61Y • Male • Endocrinology', medication: '[Medication Name: Sample Hypoglycemic Agent]', dosage: '500mg Oral Twice Daily', className: 'Antidiabetic / Hypoglycemic', lastDispensed: '42 days ago', refillCount: 'Refill 3 of 3 (Final)', requestedAt: '2025-05-14 • 07:10', urgency: 'priority', status: 'clarification', note: 'Synthetic lab review flag: recent HbA1c context requires physician review.' },
  { id: 'REFILL-DEMO-03', patientLabel: '[Patient Name: Patient C]', patientId: 'PATIENT-DEMO-03', patientMeta: '38Y • Female • Pulmonology', medication: '[Medication Name: Sample Inhaled Corticosteroid]', dosage: '160mcg/4.5mcg Inhalation', className: 'Respiratory / Inhaled', lastDispensed: '28 days ago', refillCount: 'Refill 1 of 2', requestedAt: '2025-05-13 • 18:22', urgency: 'standard', status: 'pending', note: 'Synthetic maintenance refill request awaiting physician review.' },
];

export const doctorAppointments: DoctorAppointment[] = [
  { id: 'APT-DEMO-01', tenantId: 'tenant-demo', patientId: 'PT-DEMO-01', status: 'completed', time: '09:00 AM', patientName: 'Mahmoud El-Sayed', visitType: 'Follow-up HTN & Fatigue', room: 'Room 1' },
  { id: 'APT-DEMO-02', tenantId: 'tenant-demo', patientId: 'PT-DEMO-02', status: 'in-room', time: '10:15 AM', patientName: 'Fatma Sherif', visitType: 'Cardiology review', room: 'Room 1' },
  { id: 'APT-DEMO-03', tenantId: 'tenant-demo', patientId: 'PT-DEMO-03', status: 'checked-in', time: '11:30 AM', patientName: 'Kareem El-Sayed', visitType: 'Diabetes follow-up', room: 'Waiting' },
];

export const doctorPatients: DoctorPatient[] = [
  { id: 'PT-DEMO-01', tenantId: 'tenant-demo', displayName: 'Mahmoud El-Sayed', medicalRecordNumber: '#EG-8933', age: 58, status: 'follow-up', nextVisit: 'Today, 10:15 AM', lastVisit: '12 Feb 2025' },
  { id: 'PT-DEMO-02', tenantId: 'tenant-demo', displayName: 'Fatma Sherif', medicalRecordNumber: '#EG-98124', age: 47, status: 'stable', nextVisit: 'Today, 11:30 AM', lastVisit: '08 Feb 2025' },
  { id: 'PT-DEMO-03', tenantId: 'tenant-demo', displayName: 'Kareem El-Sayed', medicalRecordNumber: '#EG-88429', age: 42, status: 'awaiting-labs', nextVisit: 'Tomorrow, 09:00 AM', lastVisit: '28 Jan 2025' },
];

export const doctorPatientProfiles: DoctorPatientProfile[] = [
  {
    id: 'PT-DEMO-01',
    tenantId: 'tenant-demo',
    displayName: 'Mahmoud El-Sayed',
    medicalRecordNumber: '#PT-001',
    age: 58,
    gender: 'Male / ذكر',
    statusText: 'Active In-Care',
    clinic: 'Outpatient Department / قسم العيادات الخارجية',
    vitals: [
      { label: 'BP / ضغط الدم', value: 'Recorded', valueSuffix: '/ مقاس', status: 'Status: Monitored', icon: 'speed', tone: 'primary' },
      { label: 'Pulse / النبض', value: 'Recorded', valueSuffix: '/ مقاس', status: 'Status: Monitored', icon: 'favorite', tone: 'secondary' },
      { label: 'SpO2 / تشبع الأوكسجين', value: 'Recorded', valueSuffix: '/ مقاس', status: 'Status: Stable', icon: 'air', tone: 'tertiary' },
      { label: 'Temp / درجة الحرارة', value: 'Recorded', valueSuffix: '/ مقاس', status: 'Status: Monitored', icon: 'thermostat', tone: 'neutral' },
    ],
    conditions: [
      { title: 'Documented Condition / حالة سريرية مسجلة', detail: 'Clinical note recorded • Ongoing care management', status: 'Monitored / متابع', tag: 'Recorded', tone: 'primary' },
      { title: 'Documented Condition / حالة سريرية مسجلة', detail: 'Follow-up required • Review scheduled', status: 'Review / مراجعة', tag: 'Recorded', tone: 'secondary' },
      { title: 'Documented Condition / حالة سريرية مسجلة', detail: 'Medication trust & monitoring review due', status: 'Monitoring / متابعة', tag: 'Recorded', tone: 'tertiary' },
    ],
    medications: [
      { name: 'Medication Entry / بند دوائي مسجل', frequency: 'Dosage & Frequency as directed / الجرعة حسب التعليمات • Active order', status: 'Standard Regimen', variant: 'primary' },
      { name: 'Medication Entry / بند دوائي مسجل', frequency: 'Dosage & Frequency as directed / الجرعة حسب التعليمات • Active order', status: 'Standard Regimen', variant: 'secondary' },
      { name: 'Medication Entry / بند دوائي مسجل', frequency: 'Dosage & Frequency as directed / الجرعة حسب التعليمات • Active order', status: 'Standard Regimen', variant: 'primary' },
    ],
    nextVisit: {
      title: 'Scheduled Consultation / استشارة مجدولة',
      label: 'Upcoming Visit / موعد قادم',
      subtitle: 'Scheduled Clinical Consultation & Follow-up Review • Preparation Ready.',
    },
    fastActions: [
      { label: 'New Clinical Note', subLabel: 'تدوين ملاحظة كشف', icon: 'note_add' },
      { label: 'Order Routine Labs', subLabel: 'طلب تحاليل معملية', icon: 'chips' },
      { label: 'Review Timeline', subLabel: 'سجل الأحداث الكامل', icon: 'edit_calendar' },
      { label: 'Update History', subLabel: 'تحديث التاريخ الطبي', icon: 'update' },
    ],
    recentEncounters: [
      { title: 'Clinical Follow-up / متابعة سريرية', tag: 'Recorded Encounter', detail: 'Attending Physician • Clinical review documented in patient record.', noteCount: 1 },
      { title: 'Routine Review / مراجعة دورية', tag: 'Recorded Encounter', detail: 'Consulting Physician • Routine follow-up documented in patient record.', noteCount: 1 },
    ],
    careTeam: [
      { name: 'Attending Physician / الطبيب المعالج', role: 'Primary Care & Clinical Lead', badge: 'Attending', tone: 'primary' },
      { name: 'Consulting Physician / الطبيب الاستشاري', role: 'Specialized Consultation Service', badge: 'Consultant', tone: 'secondary' },
    ],
  },
];
