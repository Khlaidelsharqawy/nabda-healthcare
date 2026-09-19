import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase (configured via .env or window.__ENV__)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock-healthcare-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key-placeholder';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Database Schema Interfaces
export interface Tenant {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  region: string;
  address_en?: string;
  address_ar?: string;
  contact_phone?: string;
  contact_email?: string;
  kms_key_id: string;
  zero_trust_enforced: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'super_admin' | 'doctor' | 'assistant' | 'patient';

export interface UserProfile {
  id: string;
  tenant_id?: string;
  role: UserRole;
  full_name_en: string;
  full_name_ar: string;
  email?: string;
  phone_number: string;
  national_id?: string;
  specialty_en?: string;
  specialty_ar?: string;
  avatar_url?: string;
  is_active: boolean;
  must_change_password?: boolean;
  created_at: string;
}

export interface Patient {
  id: string;
  tenant_id: string;
  user_id?: string;
  mrn: string;
  full_name_en: string;
  full_name_ar: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  blood_group?: string;
  whatsapp_phone: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  allergies: string[];
  chronic_conditions: string[];
  created_at: string;
}

export interface Appointment {
  id: string;
  tenant_id: string;
  patient_id: string;
  doctor_id: string;
  appointment_time: string;
  room_number?: string;
  status: 'scheduled' | 'confirmed' | 'in_room' | 'completed' | 'cancelled' | 'no_show';
  visit_type: string;
  patient_notes?: string;
  created_at: string;
}

export interface ClinicalEncounter {
  id: string;
  tenant_id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id?: string;
  status: 'draft' | 'in_progress' | 'signed' | 'amended';
  blood_pressure?: string;
  heart_rate?: number;
  respiratory_rate?: number;
  temperature_celsius?: number;
  oxygen_saturation?: number;
  blood_glucose_mgdl?: number;
  subjective_notes?: string;
  objective_notes?: string;
  assessment_notes?: string;
  plan_notes?: string;
  voice_session_id?: string;
  ai_scribe_generated: boolean;
  signed_at?: string;
  created_at: string;
}

export interface PrescriptionItem {
  id: string;
  prescription_id: string;
  medication_name_en: string;
  medication_name_ar: string;
  dosage: string;
  form_emoji: string;
  frequency_en: string;
  frequency_ar: string;
  timing_emoji: string;
  food_instruction_en?: string;
  food_instruction_ar?: string;
  duration_days: number;
  special_notes?: string;
}

export interface ClinicIntegration {
  id: string;
  tenant_id: string;
  integration_type: 'n8n_webhook' | 'whatsapp_business' | 'sms_gateway' | 'external_lis';
  service_name: string;
  endpoint_url: string;
  encrypted_api_key?: string;
  events_subscribed: string[];
  is_active: boolean;
  last_ping_status?: 'healthy' | 'degraded' | 'offline' | 'unknown';
  last_ping_at?: string;
  created_at: string;
}

export interface AiTrainingCorpusItem {
  id: string;
  tenant_id?: string;
  category: 'patient_faq' | 'clinical_triage' | 'soap_synthesis' | 'drug_inquiry';
  language: 'ar' | 'en';
  de_identified_prompt: string;
  de_identified_response: string;
  clinical_specialty?: string;
  human_approved: boolean;
  doctor_rating: number;
  created_at: string;
}

export interface AuditLog {
  id: string;
  tenant_id?: string;
  actor_id?: string;
  actor_role?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  ip_address?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// Singleton Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
