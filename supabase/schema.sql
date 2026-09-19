-- ==============================================================================
-- AEGISHEALTH ENTERPRISE DATABASE SCHEMA & ROW-LEVEL SECURITY (RLS)
-- Multi-Tenant AI Healthcare Operating System
-- Target: PostgreSQL 15+ / Supabase
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- Enable pgvector for custom clinical AI chatbot embeddings
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. ENUMS & TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'doctor', 'assistant', 'patient');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in_room', 'completed', 'cancelled', 'no_show');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE encounter_status AS ENUM ('draft', 'in_progress', 'signed', 'amended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lab_status AS ENUM ('ordered', 'specimen_collected', 'in_analysis', 'ready', 'reviewed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TENANTS (CLINICS / HOSPITALS)
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    region VARCHAR(128) NOT NULL,
    address_en TEXT,
    address_ar TEXT,
    contact_phone VARCHAR(32),
    contact_email VARCHAR(255),
    kms_key_id VARCHAR(128) DEFAULT 'default-aes256',
    zero_trust_enforced BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER PROFILES (EXTENDING AUTH.USERS)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'patient',
    full_name_en VARCHAR(255) NOT NULL,
    full_name_ar VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(32) NOT NULL,
    national_id VARCHAR(64),
    specialty_en VARCHAR(128),
    specialty_ar VARCHAR(128),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    must_change_password BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PATIENTS DOSSIER
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    mrn VARCHAR(64) NOT NULL,
    full_name_en VARCHAR(255) NOT NULL,
    full_name_ar VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(16) NOT NULL,
    blood_group VARCHAR(8),
    whatsapp_phone VARCHAR(32) NOT NULL,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(32),
    allergies JSONB DEFAULT '[]'::jsonb,
    chronic_conditions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_mrn_per_tenant UNIQUE (tenant_id, mrn)
);

-- 6. APPOINTMENTS & SCHEDULING
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE RESTRICT,
    appointment_time TIMESTAMPTZ NOT NULL,
    room_number VARCHAR(32),
    status appointment_status DEFAULT 'scheduled',
    visit_type VARCHAR(64) DEFAULT 'Consultation',
    patient_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CLINICAL ENCOUNTERS & SOAP NOTES (AMBIENT SCRIBE READY)
CREATE TABLE IF NOT EXISTS public.clinical_encounters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE RESTRICT,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    status encounter_status DEFAULT 'draft',
    -- Vitals
    blood_pressure VARCHAR(16),
    heart_rate INT,
    respiratory_rate INT,
    temperature_celsius NUMERIC(4, 1),
    oxygen_saturation INT,
    blood_glucose_mgdl INT,
    -- SOAP Note Sections
    subjective_notes TEXT,
    objective_notes TEXT,
    assessment_notes TEXT,
    plan_notes TEXT,
    -- Ambient AI Scribe Metadata
    voice_session_id UUID,
    ai_scribe_generated BOOLEAN DEFAULT false,
    signed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PRESCRIPTIONS & MEDICATIONS (WITH EMOJI GUIDANCE & TIMING)
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE RESTRICT,
    encounter_id UUID REFERENCES public.clinical_encounters(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.prescription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID NOT NULL REFERENCES public.prescriptions(id) ON DELETE CASCADE,
    medication_name_en VARCHAR(255) NOT NULL,
    medication_name_ar VARCHAR(255) NOT NULL,
    dosage VARCHAR(64) NOT NULL,
    form_emoji VARCHAR(8) DEFAULT '💊', -- 💊 💧 💉 🧴
    frequency_en VARCHAR(128) NOT NULL,
    frequency_ar VARCHAR(128) NOT NULL,
    timing_emoji VARCHAR(16) DEFAULT '☀️🌙', -- ☀️ 🌙 🍽️
    food_instruction_en VARCHAR(128),
    food_instruction_ar VARCHAR(128),
    duration_days INT DEFAULT 7,
    special_notes TEXT
);

-- 9. LAB & RADIOLOGY ORDERS WITH SPECIMEN BARCODES
CREATE TABLE IF NOT EXISTS public.lab_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE RESTRICT,
    encounter_id UUID REFERENCES public.clinical_encounters(id) ON DELETE SET NULL,
    test_name_en VARCHAR(255) NOT NULL,
    test_name_ar VARCHAR(255) NOT NULL,
    category VARCHAR(64) DEFAULT 'hematology', -- hematology, biochemistry, radiology
    specimen_barcode VARCHAR(64) UNIQUE,
    status lab_status DEFAULT 'ordered',
    result_summary TEXT,
    result_data JSONB,
    critical_flag BOOLEAN DEFAULT false,
    collected_at TIMESTAMPTZ,
    ready_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CLINIC API INTEGRATIONS & N8N AUTOMATION WEBHOOKS
CREATE TABLE IF NOT EXISTS public.clinic_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    integration_type VARCHAR(64) NOT NULL, -- 'n8n_webhook', 'whatsapp_business', 'sms_gateway', 'external_lis'
    service_name VARCHAR(128) NOT NULL,
    endpoint_url TEXT NOT NULL,
    encrypted_api_key TEXT,
    events_subscribed JSONB NOT NULL DEFAULT '["patient_created", "appointment_booked", "whatsapp_inbound"]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    last_ping_status VARCHAR(32) DEFAULT 'unknown',
    last_ping_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. DE-IDENTIFIED AI TRAINING CORPUS (CUSTOM CLINICAL CHATBOT LAKE)
CREATE TABLE IF NOT EXISTS public.ai_training_corpus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
    category VARCHAR(64) NOT NULL, -- 'patient_faq', 'clinical_triage', 'soap_synthesis', 'drug_inquiry'
    language VARCHAR(8) DEFAULT 'ar',
    de_identified_prompt TEXT NOT NULL,
    de_identified_response TEXT NOT NULL,
    clinical_specialty VARCHAR(128),
    human_approved BOOLEAN DEFAULT false,
    doctor_rating INT DEFAULT 5, -- 1 to 5
    embedding vector(1536), -- Vector representation for pgvector semantic search
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. IMMUTABLE SECURITY AUDIT TRAIL (INSERT ONLY)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    actor_id UUID,
    actor_role VARCHAR(32),
    action VARCHAR(128) NOT NULL, -- e.g. 'READ_PATIENT_RECORD', 'DISPATCH_WHATSAPP', 'SIGN_SOAP'
    resource_type VARCHAR(64) NOT NULL,
    resource_id VARCHAR(64),
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disallow UPDATE and DELETE on audit_logs to preserve immutability
REVOKE UPDATE, DELETE ON public.audit_logs FROM public, authenticated;

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- Zero-Trust Multi-Tenant Isolation
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_training_corpus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to extract user tenant_id from JWT
CREATE OR REPLACE FUNCTION auth.user_tenant_id()
RETURNS UUID AS $$
    SELECT NULLIF(current_setting('request.jwt.claims', true)::jsonb ->> 'tenant_id', '')::uuid;
$$ LANGUAGE SQL STABLE;

-- Helper function to extract user role from JWT
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS text AS $$
    SELECT NULLIF(current_setting('request.jwt.claims', true)::jsonb ->> 'user_role', '')::text;
$$ LANGUAGE SQL STABLE;

-- POLICIES: TENANTS
CREATE POLICY "Super Admins can view and manage all tenants"
    ON public.tenants FOR ALL TO authenticated
    USING (auth.user_role() = 'super_admin');

CREATE POLICY "Tenant users can view their own tenant profile"
    ON public.tenants FOR SELECT TO authenticated
    USING (id = auth.user_tenant_id());

-- POLICIES: PATIENTS
CREATE POLICY "Tenant staff can view and manage their tenant patients"
    ON public.patients FOR ALL TO authenticated
    USING (
        auth.user_role() = 'super_admin' OR
        (tenant_id = auth.user_tenant_id() AND auth.user_role() IN ('doctor', 'assistant'))
    );

CREATE POLICY "Patients can view only their own patient profile"
    ON public.patients FOR SELECT TO authenticated
    USING (user_id = auth.uid());

-- POLICIES: APPOINTMENTS
CREATE POLICY "Tenant staff can view and manage appointments"
    ON public.appointments FOR ALL TO authenticated
    USING (
        auth.user_role() = 'super_admin' OR
        (tenant_id = auth.user_tenant_id() AND auth.user_role() IN ('doctor', 'assistant'))
    );

CREATE POLICY "Patients can view only their own appointments"
    ON public.appointments FOR SELECT TO authenticated
    USING (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));

-- POLICIES: CLINICAL ENCOUNTERS
CREATE POLICY "Doctors and Super Admin can manage clinical encounters"
    ON public.clinical_encounters FOR ALL TO authenticated
    USING (
        auth.user_role() = 'super_admin' OR
        (tenant_id = auth.user_tenant_id() AND auth.user_role() = 'doctor')
    );

CREATE POLICY "Patients can view signed clinical encounter summaries"
    ON public.clinical_encounters FOR SELECT TO authenticated
    USING (
        status = 'signed' AND
        patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
    );

-- POLICIES: CLINIC INTEGRATIONS (n8n & APIs)
CREATE POLICY "Super Admins can manage all clinic integrations"
    ON public.clinic_integrations FOR ALL TO authenticated
    USING (auth.user_role() = 'super_admin');

CREATE POLICY "Tenant Admins can view their clinic integrations"
    ON public.clinic_integrations FOR SELECT TO authenticated
    USING (tenant_id = auth.user_tenant_id());

-- POLICIES: AUDIT LOGS (INSERT ONLY)
CREATE POLICY "Authenticated users can insert audit logs"
    ON public.audit_logs FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Super Admins can view audit logs"
    ON public.audit_logs FOR SELECT TO authenticated
    USING (auth.user_role() = 'super_admin');

-- ==============================================================================
-- 13. SEED DATA (INITIAL ADMIN, DOCTOR, PATIENT & INTEGRATIONS)
-- See supabase/seed.sql for complete initial seed records.
-- Default Credentials:
-- Super Admin: admin@aegishealth.com / AegisAdmin@2026!
-- Doctor:      doctor@aegishealth.com / Doctor@2026!
-- Assistant:   assistant@aegishealth.com / Assistant@2026!
-- Patient:     patient@aegishealth.com / Aegis@PT2026!
-- ==============================================================================
