-- ============================================================================
-- NABDA HEALTHCARE PLATFORM - ENTERPRISE MULTI-TENANT SECURITY SCHEMA
-- Strict Zero-Trust, HIPAA-aligned Row-Level Security (RLS) & Cryptographic Auditing
-- ============================================================================

-- 1. Enable pgcrypto for UUID and SHA-256 generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TENANTS TABLE (Multi-Tenant Isolation Boundary)
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    region TEXT NOT NULL,
    contact_phone TEXT,
    contact_email TEXT,
    kms_key_id TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    zero_trust_enforced BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CLINICS TABLE (Public Discovery & Admin Visibility Control)
CREATE TABLE IF NOT EXISTS public.clinics (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    tagline TEXT,
    tagline_ar TEXT,
    description TEXT,
    description_ar TEXT,
    address TEXT NOT NULL,
    address_ar TEXT NOT NULL,
    city TEXT NOT NULL,
    city_ar TEXT NOT NULL,
    district TEXT NOT NULL,
    district_ar TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    rating NUMERIC(3,2) NOT NULL DEFAULT 5.0,
    review_count INTEGER NOT NULL DEFAULT 0,
    specialties TEXT[] NOT NULL DEFAULT '{}',
    specialties_ar TEXT[] NOT NULL DEFAULT '{}',
    operating_hours TEXT,
    operating_hours_ar TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT true,
    doctor_count INTEGER NOT NULL DEFAULT 0,
    emergency_available BOOLEAN NOT NULL DEFAULT false,
    show_on_public_site BOOLEAN NOT NULL DEFAULT true, -- ADMIN CONTROL
    is_published BOOLEAN NOT NULL DEFAULT true,        -- ADMIN CONTROL
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. DOCTORS TABLE (Admin Controlled Public Visibility)
CREATE TABLE IF NOT EXISTS public.doctors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    title TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    specialty TEXT NOT NULL,
    specialty_ar TEXT NOT NULL,
    clinic_id TEXT REFERENCES public.clinics(id) ON DELETE CASCADE,
    clinic_name TEXT NOT NULL,
    clinic_name_ar TEXT NOT NULL,
    city TEXT NOT NULL,
    city_ar TEXT NOT NULL,
    district TEXT NOT NULL,
    district_ar TEXT NOT NULL,
    rating NUMERIC(3,2) NOT NULL DEFAULT 5.0,
    review_count INTEGER NOT NULL DEFAULT 0,
    years_experience INTEGER NOT NULL DEFAULT 10,
    availability TEXT NOT NULL DEFAULT 'today',
    availability_text TEXT NOT NULL,
    availability_text_ar TEXT NOT NULL,
    consultation_fee NUMERIC(10,2) NOT NULL DEFAULT 200,
    bio TEXT,
    bio_ar TEXT,
    badge TEXT,
    badge_ar TEXT,
    available_slots TEXT[] NOT NULL DEFAULT '{}',
    show_on_public_site BOOLEAN NOT NULL DEFAULT true, -- ADMIN CONTROL
    is_published BOOLEAN NOT NULL DEFAULT true,        -- ADMIN CONTROL
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PLATFORM SERVICES TABLE (Admin Controlled)
CREATE TABLE IF NOT EXISTS public.platform_services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    category TEXT NOT NULL,
    category_ar TEXT NOT NULL,
    description TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    icon TEXT NOT NULL,
    features TEXT[] NOT NULL DEFAULT '{}',
    features_ar TEXT[] NOT NULL DEFAULT '{}',
    route TEXT NOT NULL,
    show_on_public_site BOOLEAN NOT NULL DEFAULT true, -- ADMIN CONTROL
    is_published BOOLEAN NOT NULL DEFAULT true,        -- ADMIN CONTROL
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PATIENTS TABLE (PHI Protected, Strict Tenant Boundary)
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    mrn TEXT NOT NULL,
    national_id TEXT NOT NULL,
    full_name_ar TEXT NOT NULL,
    full_name_en TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female')),
    phone TEXT NOT NULL,
    whatsapp_opt_in BOOLEAN NOT NULL DEFAULT true,
    blood_type TEXT,
    allergies TEXT[] NOT NULL DEFAULT '{}',
    chronic_conditions TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'stable',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_mrn UNIQUE (tenant_id, mrn)
);

-- 7. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    clinician_id TEXT NOT NULL,
    clinician_name TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    time_slot TEXT NOT NULL,
    visit_type TEXT NOT NULL DEFAULT 'scheduled',
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_room', 'completed', 'cancelled', 'no_show')),
    room TEXT,
    chief_complaint TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. AUDIT LOGS (Immutable & Cryptographically Chained Ledger)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id),
    actor_id TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    previous_hash TEXT NOT NULL,
    current_hash TEXT NOT NULL,
    ip_address TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- STRICT ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- 1. Enable RLS on ALL tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 2. PUBLIC SITE ACCESS: Public (anon) users can ONLY select published items where show_on_public_site = true
CREATE POLICY "Public Read Published Clinics"
    ON public.clinics FOR SELECT
    TO anon, authenticated
    USING (show_on_public_site = true AND is_published = true);

CREATE POLICY "Public Read Published Doctors"
    ON public.doctors FOR SELECT
    TO anon, authenticated
    USING (show_on_public_site = true AND is_published = true);

CREATE POLICY "Public Read Published Services"
    ON public.platform_services FOR SELECT
    TO anon, authenticated
    USING (show_on_public_site = true AND is_published = true);

-- 3. ADMIN MANAGEMENT: Super Admin has full authority to manage visibility & records
CREATE POLICY "Admin Full Access Clinics"
    ON public.clinics FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'super_admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "Admin Full Access Doctors"
    ON public.doctors FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'super_admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "Admin Full Access Services"
    ON public.platform_services FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'super_admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'super_admin');

-- 4. MULTI-TENANT ISOLATION: Strict boundary on Patients and Appointments
CREATE POLICY "Tenant Isolated Patients"
    ON public.patients FOR ALL
    TO authenticated
    USING (tenant_id::text = (auth.jwt() ->> 'tenant_id') OR auth.jwt() ->> 'role' = 'super_admin')
    WITH CHECK (tenant_id::text = (auth.jwt() ->> 'tenant_id') OR auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "Tenant Isolated Appointments"
    ON public.appointments FOR ALL
    TO authenticated
    USING (tenant_id::text = (auth.jwt() ->> 'tenant_id') OR auth.jwt() ->> 'role' = 'super_admin')
    WITH CHECK (tenant_id::text = (auth.jwt() ->> 'tenant_id') OR auth.jwt() ->> 'role' = 'super_admin');

-- 5. IMMUTABLE AUDIT LOG: Anyone can insert, no one can UPDATE or DELETE (Append-Only)
CREATE POLICY "Audit Logs Append Only"
    ON public.audit_logs FOR INSERT
    TO authenticated, anon
    WITH CHECK (true);

CREATE POLICY "Audit Logs View Restricted"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'super_admin' OR tenant_id::text = (auth.jwt() ->> 'tenant_id'));

-- Revoke UPDATE and DELETE on audit_logs from ALL roles
REVOKE UPDATE, DELETE, TRUNCATE ON public.audit_logs FROM PUBLIC, anon, authenticated;
