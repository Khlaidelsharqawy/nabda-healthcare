import { AiTrainingCorpusItem } from '../lib/supabase';

/**
 * Record and de-identify a clinical interaction for AI training
 */
export function recordClinicalInteraction(params: {
  tenant_id: string;
  source_type: string;
  specialty: string;
  clinical_context: string;
  raw_text: string;
}): AiTrainingCorpusItem {
  return addTrainingCorpusItem({
    tenant_id: params.tenant_id,
    category: params.source_type as any,
    language: 'ar',
    de_identified_prompt: params.clinical_context,
    de_identified_response: params.raw_text,
    clinical_specialty: params.specialty,
    human_approved: true,
    doctor_rating: 5,
  });
}

const STORAGE_KEY_CORPUS = 'aegis_ai_training_corpus';

/**
 * PII De-Identification & Anonymization Engine
 * Strips identifiable patient data (Names, Phones, National IDs, Emails, Dates)
 */
export function deIdentifyClinicalText(rawText: string, knownPatientName?: string): string {
  if (!rawText) return '';

  let sanitized = rawText;

  // 1. Remove known patient name if provided
  if (knownPatientName && knownPatientName.trim().length > 2) {
    const escapedName = knownPatientName.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    sanitized = sanitized.replace(new RegExp(escapedName, 'gi'), '[PATIENT]');
  }

  // 2. Remove Phone numbers (international, Egyptian, Saudi, generic 8-15 digits)
  sanitized = sanitized.replace(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g, '[PHONE]');

  // 3. Remove National IDs (10 to 14 consecutive digits)
  sanitized = sanitized.replace(/\b\d{10,14}\b/g, '[NATIONAL_ID]');

  // 4. Remove Emails
  sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]');

  // 5. Remove specific birthdates / calendar dates (YYYY-MM-DD, DD/MM/YYYY)
  sanitized = sanitized.replace(/\b(?:\d{4}[-/]\d{2}[-/]\d{2}|\d{2}[-/]\d{2}[-/]\d{4})\b/g, '[DATE]');

  // 6. Generic common Arabic/English names patterns if preceded by patient indicators
  sanitized = sanitized.replace(/(?:المريض\s*[:/]\s*|Patient\s*[:/]\s*)([^\n,.]+)/gi, 'المريض: [PATIENT]');

  return sanitized;
}

/**
 * Get all training corpus items from local storage
 */
export function getLocalTrainingCorpus(): AiTrainingCorpusItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CORPUS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed reading AI training corpus from storage', e);
  }

  // Seed default clinical training pairs
  return [
    {
      id: 'train-001',
      tenant_id: 'tenant-demo-01',
      category: 'soap_synthesis',
      language: 'ar',
      de_identified_prompt: 'مريض يعاني من عطش متكرر وإجهاد مستمر مع ارتفاع قراءات السكر التراكمي إلى 8.5%.',
      de_identified_response: 'التشخيص المقترح: سكري من النوع الثاني غير منضبط. الخطة: تعديل جرعة الميتفورمين وإضافة مثبط SGLT2 مع فحص وظائف الكلى الدورية ونظام غذائي منخفض الكربوهيدرات.',
      clinical_specialty: 'Endocrinology',
      human_approved: true,
      doctor_rating: 5,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'train-002',
      tenant_id: 'tenant-demo-01',
      category: 'drug_inquiry',
      language: 'ar',
      de_identified_prompt: 'هل يتعارض دواء أتورفاستاتين مع تناول عصير الجريب فروت؟',
      de_identified_response: 'نعم، يثبط الجريب فروت إنزيم CYP3A4 المسؤول عن أيض الأتورفاستاتين، مما يرفع تركيز الدواء في الدم ويزيد خطر الاعتلال العضلي.',
      clinical_specialty: 'Cardiology',
      human_approved: true,
      doctor_rating: 5,
      created_at: new Date(Date.now() - 43200000).toISOString(),
    },
    {
      id: 'train-003',
      tenant_id: 'tenant-demo-01',
      category: 'patient_faq',
      language: 'ar',
      de_identified_prompt: 'ما هي مدة الصيام المطلوبة قبل إجراء تحليل دهون الدم الكامل؟',
      de_identified_response: 'يُفضل الصيام من 10 إلى 12 ساعة عن الطعام مع السماح بشرب الماء فقط لضمان دقة قياس الدهون الثلاثية ومستويات الكوليسترول.',
      clinical_specialty: 'General Practice',
      human_approved: true,
      doctor_rating: 5,
      created_at: new Date().toISOString(),
    }
  ];
}

/**
 * Add a new interaction to the AI training corpus
 */
export function addTrainingCorpusItem(item: Omit<AiTrainingCorpusItem, 'id' | 'created_at'>): AiTrainingCorpusItem {
  const current = getLocalTrainingCorpus();
  const newItem: AiTrainingCorpusItem = {
    ...item,
    id: `train-${Date.now()}`,
    de_identified_prompt: deIdentifyClinicalText(item.de_identified_prompt),
    de_identified_response: deIdentifyClinicalText(item.de_identified_response),
    created_at: new Date().toISOString(),
  };
  current.unshift(newItem);
  localStorage.setItem(STORAGE_KEY_CORPUS, JSON.stringify(current));
  return newItem;
}

/**
 * Export the de-identified corpus as a downloadable JSONL file (OpenAI/HuggingFace ready)
 */
export function exportCorpusToJsonl(): void {
  const corpus = getLocalTrainingCorpus().filter(c => c.human_approved);
  const jsonlLines = corpus.map(item => {
    return JSON.stringify({
      messages: [
        {
          role: 'system',
          content: 'You are AegisHealth Clinical AI, a specialized medical clinical assistant grounded in clinical guidelines, tenant isolation, and strict safety.',
        },
        { role: 'user', content: item.de_identified_prompt },
        { role: 'assistant', content: item.de_identified_response },
      ],
      metadata: {
        specialty: item.clinical_specialty,
        category: item.category,
        language: item.language,
        rating: item.doctor_rating,
      },
    });
  });

  const blob = new Blob([jsonlLines.join('\n')], { type: 'application/x-jsonlines;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `aegis_clinical_training_corpus_${new Date().toISOString().slice(0, 10)}.jsonl`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
