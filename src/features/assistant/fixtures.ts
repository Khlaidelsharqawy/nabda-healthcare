export type AssistantPatient = {
  id: string;
  name: string;
  age: number;
  status: 'ready' | 'waiting' | 'review';
  visitType: string;
  arrival: string;
  room: string;
  phone: string;
};

export const assistantPatients: AssistantPatient[] = [
  { id: 'AS-PT-01', name: 'Aisha Rahman', age: 34, status: 'ready', visitType: 'New consult', arrival: '09:10', room: 'Room 2', phone: '[Demo Contact #01]' },
  { id: 'AS-PT-02', name: 'Hassan Ali', age: 52, status: 'waiting', visitType: 'Follow-up', arrival: '09:28', room: 'Room 4', phone: '[Demo Contact #02]' },
  { id: 'AS-PT-03', name: 'Noor Al-Sayed', age: 29, status: 'review', visitType: 'Lab review', arrival: '09:40', room: 'Review Desk', phone: '[Demo Contact #03]' },
  { id: 'AS-PT-04', name: 'Salma Youssef', age: 46, status: 'ready', visitType: 'Imaging check-in', arrival: '10:05', room: 'Radiology desk', phone: '[Demo Contact #04]' },
];

export const assistantAppointments = [
  { id: 'APT-101', patient: 'Aisha Rahman', time: '09:15', clinician: 'Dr. Tarek El-Kabbani', type: 'Consultation', status: 'checked-in' },
  { id: 'APT-102', patient: 'Hassan Ali', time: '09:45', clinician: 'Dr. Mira Haddad', type: 'Follow-up', status: 'waiting' },
  { id: 'APT-103', patient: 'Noor Al-Sayed', time: '10:15', clinician: 'Dr. Salim Nasser', type: 'Lab review', status: 'in-room' },
  { id: 'APT-104', patient: 'Salma Youssef', time: '10:35', clinician: 'Dr. Lina Zayed', type: 'Imaging', status: 'scheduled' },
];

export const assistantQueue = [
  { id: 'Q-01', name: 'Aisha Rahman', priority: 'High', wait: '08m', note: 'Vitals complete', room: 'Room 2' },
  { id: 'Q-02', name: 'Hassan Ali', priority: 'Medium', wait: '14m', note: 'Awaiting clinician', room: 'Room 4' },
  { id: 'Q-03', name: 'Noor Al-Sayed', priority: 'Low', wait: '22m', note: 'Review desk', room: 'Review Desk' },
  { id: 'Q-04', name: 'Salma Youssef', priority: 'High', wait: '05m', note: 'Imaging prep', room: 'Radiology desk' },
];

export const assistantMockMessages = [
  { id: 'MSG-01', name: 'Patient support', channel: 'WhatsApp', time: '08:42', preview: 'Please confirm imaging arrival time today.', status: 'Awaiting reply' },
  { id: 'MSG-02', name: 'Insurance desk', channel: 'Phone', time: '09:10', preview: 'Authorization for lab review has been queued.', status: 'Escalated' },
  { id: 'MSG-03', name: 'Clinic admin', channel: 'Portal', time: '09:24', preview: 'Dr. Haddad requested updated room status.', status: 'Ready' },
];

export const assistantAiPrompts = [
  'Confirm check-in flow',
  'Summarize queue risk',
  'Draft reply to patient',
];

export const assistantAiPromptsAr = [
  'تأكيد تدفق تسجيل الحضور',
  'تلخيص مخاطر طابور الانتظار',
  'صياغة رد إداري للمريض',
];

export type AssistantAiModule = {
  id: string;
  icon: string;
  label: string;
  labelAr: string;
  title: string;
  arabicTitle: string;
  description: string;
  descriptionAr: string;
  metric: string;
  metricAr: string;
  metricValue: string;
  action: string;
  actionAr: string;
  actionIcon: string;
};

export type AssistantAiMessage = {
  id: string;
  author: 'assistant' | 'engine';
  label: string;
  labelAr: string;
  time: string;
  content: string;
  contentAr: string;
};

export const assistantAiModules: AssistantAiModule[] = [
  {
    id: 'queue-coordination',
    icon: 'meeting_room',
    label: 'MODULE 01',
    labelAr: 'الوحدة 01',
    title: 'Queue & Room Coordination Drafts',
    arabicTitle: 'تنظيم تدفق العيادات وتوزيع القاعات',
    description: 'Drafts room allocations and flags arrival delays before physician schedules are impacted.',
    descriptionAr: 'يقترح توزيع العيادات وينبه لتأخيرات الحضور قبل تأثر جدول الأطباء.',
    metric: 'Active clinic load',
    metricAr: 'عبء العيادات الحالي',
    metricValue: '68%',
    action: 'Draft daily room dispatch',
    actionAr: 'صياغة توزيع العيادات اليومي',
    actionIcon: 'arrow_forward',
  },
  {
    id: 'message-drafter',
    icon: 'mark_chat_unread',
    label: 'MODULE 02 • DIRECT DISPATCH',
    labelAr: 'الوحدة 02 • إرسال مباشر',
    title: 'Administrative Patient Message Drafter',
    arabicTitle: 'صياغة الرسائل التنظيمية للمرضى',
    description: 'Creates reviewable WhatsApp and SMS templates for confirmations, navigation, and pre-visit preparation.',
    descriptionAr: 'إنشاء قوالب رسائل قابلة للمراجعة لتأكيد المواعيد والتعليمات قبل الزيارة.',
    metric: 'Templates ready',
    metricAr: 'القوالب الجاهزة',
    metricValue: '03',
    action: 'Launch communication drafter',
    actionAr: 'فتح محرر المراسلات الإدارية',
    actionIcon: 'send',
  },
  {
    id: 'intake-review',
    icon: 'checklist_rtl',
    label: 'MODULE 03',
    labelAr: 'الوحدة 03',
    title: 'Operational Intake Checklist Review',
    arabicTitle: 'تدقيق متطلبات الاستقبال وتسجيل الحضور',
    description: 'Checks administrative completeness for upcoming appointments without making clinical decisions.',
    descriptionAr: 'فحص اكتمال البيانات الإدارية للمواعيد القادمة دون أي تدخل سريري.',
    metric: 'Forms complete',
    metricAr: 'اكتمال النماذج',
    metricValue: '84%',
    action: 'Run intake audit',
    actionAr: 'بدء تدقيق بيانات الاستقبال',
    actionIcon: 'play_circle',
  },
];

export const assistantAiMessages: AssistantAiMessage[] = [
  {
    id: 'AI-MSG-01',
    author: 'assistant',
    label: 'Operational Assistant',
    labelAr: 'مساعد إداري',
    time: '10:42 AM',
    content: 'Prepare tomorrow\'s consultation schedule and organize waiting intervals for the morning clinic.',
    contentAr: 'إعداد جدول كشوفات الغد وتنظيم فترات الانتظار للعيادة الصباحية.',
  },
  {
    id: 'AI-MSG-02',
    author: 'engine',
    label: 'Aegis Operations Engine',
    labelAr: 'محرك عافية للعمليات',
    time: '10:42 AM',
    content: 'Draft prepared from synthetic queue and appointment context. Room assignment and patient messaging require staff confirmation before use.',
    contentAr: 'تم إعداد المسودة استناداً لبيانات الطابور والمواعيد. يتطلب توزيع القاعات ومراسلة المرضى تأكيد الموظف المختص قبل الاعتماد.',
  },
];

export type AssistantCommunicationIntent = {
  id: string;
  title: string;
  titleAr: string;
  detail: string;
  detailAr: string;
};

export type AssistantCommunicationDraft = {
  id: string;
  recipient: string;
  intent: string;
  intentAr: string;
  generated: string;
  generatedAr: string;
  status: 'Pending review' | 'Staged locally' | 'Draft';
  staff: string;
  staffAr: string;
};

export const assistantCommunicationIntents: AssistantCommunicationIntent[] = [
  { id: 'appointment-reminder', title: 'Appointment Reminder & Intake Instructions', titleAr: 'تذكير بالموعد وتعليمات الاستقبال', detail: 'Intake instructions & arrival checklist', detailAr: 'تعليمات الحضور وقائمة التحقق' },
  { id: 'fasting-guidance', title: 'Pre-Visit Lab Fasting Guidance', titleAr: 'تعليمات الصيام قبل تحاليل المختبر', detail: 'Administrative preparation reminder only', detailAr: 'تذكير إداري بالتحضير المطلوب فقط' },
  { id: 'follow-up-booking', title: 'Follow-Up Booking Notice', titleAr: 'إشعار حجز موعد المتابعة', detail: 'Post-consultation scheduling checkpoint', detailAr: 'تنسيق الموعد بعد استشارة الطبيب' },
  { id: 'navigation-guide', title: 'Clinic Navigation & Parking Guide', titleAr: 'دليل الوصول للمركز ومواقف السيارات', detail: 'Campus entrance and parking information', detailAr: 'إرشادات بوابات الدخول والمواقف' },
];

export const assistantCommunicationDrafts: AssistantCommunicationDraft[] = [
  { id: 'DRAFT-8831', recipient: '[Patient Name]', intent: 'Appointment Reminder', intentAr: 'تذكير بالموعد', generated: 'Today, 10:42 AM', generatedAr: 'اليوم، 10:42 ص', status: 'Pending review', staff: 'Mariam Adel', staffAr: 'مريم عادل' },
  { id: 'DRAFT-8827', recipient: '[Patient Name]', intent: 'Navigation Guide', intentAr: 'دليل الوصول للمركز', generated: 'Today, 09:18 AM', generatedAr: 'اليوم، 09:18 ص', status: 'Staged locally', staff: 'Reception Team', staffAr: 'فريق الاستقبال' },
  { id: 'DRAFT-8819', recipient: '[Patient Name]', intent: 'Follow-Up Booking', intentAr: 'حجز موعد المتابعة', generated: 'Yesterday, 04:30 PM', generatedAr: 'أمس، 04:30 م', status: 'Draft', staff: 'Mariam Adel', staffAr: 'مريم عادل' },
];

export const assistantIntake = [
  { id: 'IN-01', patient: 'Aisha Rahman', specimen: 'CBC + CMP', priority: 'Routine', status: 'Label verified' },
  { id: 'IN-02', patient: 'Hassan Ali', specimen: 'HBA1C', priority: 'Priority', status: 'In transit' },
  { id: 'IN-03', patient: 'Noor Al-Sayed', specimen: 'Urinalysis', priority: 'Routine', status: 'Rack ready' },
];

export type AssistantSpecimenOrder = {
  id: string;
  time: string;
  priority: 'Routine' | 'STAT emergency' | 'Recollect';
  patient: string;
  patientId: string;
  demographics: string;
  order: string;
  clinician: string;
  specimen: string;
  prep: string;
  state: 'Pending collection' | 'STAT waiting' | 'Collected & barcoded' | 'Recollection required';
  accession: string;
};

export const assistantSpecimenOrders: AssistantSpecimenOrder[] = [
  { id: 'ORD-8841', time: '08:30', priority: 'Routine', patient: 'Patient A', patientId: 'PAT-1042', demographics: '45Y / M', order: 'Complete Blood Count & Fasting Glucose', clinician: 'Dr. Attending Physician', specimen: 'Whole Blood EDTA (Lavender) & Fluoride Oxalate (Gray)', prep: 'Verified 10h fasting', state: 'Pending collection', accession: 'ACC-2025-0941' },
  { id: 'ORD-8845', time: '09:05', priority: 'STAT emergency', patient: 'Patient B', patientId: 'PAT-1088', demographics: '62Y / F', order: 'Cardiac Troponin I & D-Dimer Assay', clinician: 'Dr. Attending Physician', specimen: 'Sodium Citrate (Light Blue) & Lithium Heparin (Green)', prep: 'Non-fasting required', state: 'STAT waiting', accession: 'ACC-2025-0942' },
  { id: 'ORD-8839', time: '08:15', priority: 'Routine', patient: 'Patient C', patientId: 'PAT-0974', demographics: '31Y / M', order: 'Comprehensive Metabolic Panel', clinician: 'Dr. Attending Physician', specimen: 'SST Clot Activator (Gold Top)', prep: 'Verified 12h fasting', state: 'Collected & barcoded', accession: 'ACC-2025-0938' },
  { id: 'ORD-8822', time: '07:45', priority: 'Recollect', patient: 'Patient D', patientId: 'PAT-0812', demographics: '54Y / F', order: 'Potassium & Electrolytes', clinician: 'Dr. Attending Physician', specimen: 'Lithium Heparin (Green Top)', prep: 'Lab rejected: hemolysis', state: 'Recollection required', accession: 'ACC-2025-0925-R' },
];
