-- ==============================================================================
-- AEGISHEALTH SEED DATA
-- Default Tenants, Users, Doctors, Patients & Automation Webhooks
-- ==============================================================================

-- 1. SEED TENANTS (CLINICS)
INSERT INTO public.tenants (
    id,
    slug,
    name_en,
    name_ar,
    region,
    address_en,
    address_ar,
    contact_phone,
    contact_email,
    kms_key_id,
    zero_trust_enforced,
    is_active
) VALUES 
(
    'd0000000-0000-0000-0000-000000000001',
    'al-nour',
    'Al-Nour Specialized Medical Center',
    'مجمع النور الطبي التخصصي',
    'Riyadh, Saudi Arabia',
    'Olaya District, King Fahd Road, Riyadh',
    'حي العليا، طريق الملك فهد، الرياض',
    '+966 11 234 5678',
    'admin@al-nour.med',
    'kms-riyadh-sec-01',
    true,
    true
),
(
    'd0000000-0000-0000-0000-000000000002',
    'dar-al-shifa',
    'Dar Al-Shifa Clinical Hospital',
    'مستشفى دار الشفاء التخصصي',
    'Cairo, Egypt',
    'Nasr City, Abbas El-Akkad St, Cairo',
    'مدينة نصر، شارع عباس العقاد، القاهرة',
    '+20 2 2456 7890',
    'contact@dar-alshifa.med',
    'kms-cairo-sec-01',
    true,
    true
),
(
    'd0000000-0000-0000-0000-000000000003',
    'future-health',
    'Future Health Integrated Clinics',
    'عيادات صحة المستقبل المتكاملة',
    'Dubai, UAE',
    'Dubai Healthcare City, Building 64',
    'مدينة دبي الطبية، مبنى 64',
    '+971 4 382 9100',
    'info@futurehealth.ae',
    'kms-dubai-sec-01',
    true,
    true
)
ON CONFLICT (id) DO NOTHING;

-- 2. SEED AUTH USERS (IF RUNNING DIRECTLY ON SUPABASE AUTH)
-- Passwords:
-- Admin:     AegisAdmin@2026!
-- Doctor:    Doctor@2026!
-- Assistant: Assistant@2026!
-- Patient:   Aegis@PT2026!
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            aud,
            role,
            created_at,
            updated_at
        ) VALUES 
        (
            'a0000000-0000-0000-0000-000000000001',
            '00000000-0000-0000-0000-000000000000',
            'admin@aegishealth.com',
            crypt('AegisAdmin@2026!', gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"],"user_role":"super_admin"}'::jsonb,
            '{"full_name":"Platform Super Admin","role":"super_admin"}'::jsonb,
            'authenticated',
            'authenticated',
            NOW(),
            NOW()
        ),
        (
            'a0000000-0000-0000-0000-000000000002',
            '00000000-0000-0000-0000-000000000000',
            'doctor@aegishealth.com',
            crypt('Doctor@2026!', gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"],"user_role":"doctor","tenant_id":"d0000000-0000-0000-0000-000000000001"}'::jsonb,
            '{"full_name":"Dr. Sarah Mansour","role":"doctor"}'::jsonb,
            'authenticated',
            'authenticated',
            NOW(),
            NOW()
        ),
        (
            'a0000000-0000-0000-0000-000000000003',
            '00000000-0000-0000-0000-000000000000',
            'assistant@aegishealth.com',
            crypt('Assistant@2026!', gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"],"user_role":"assistant","tenant_id":"d0000000-0000-0000-0000-000000000001"}'::jsonb,
            '{"full_name":"Nurse Nourhan Mostafa","role":"assistant"}'::jsonb,
            'authenticated',
            'authenticated',
            NOW(),
            NOW()
        ),
        (
            'a0000000-0000-0000-0000-000000000004',
            '00000000-0000-0000-0000-000000000000',
            'patient@aegishealth.com',
            crypt('Aegis@PT2026!', gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"],"user_role":"patient","tenant_id":"d0000000-0000-0000-0000-000000000001"}'::jsonb,
            '{"full_name":"Tariq Al-Sabah","role":"patient"}'::jsonb,
            'authenticated',
            'authenticated',
            NOW(),
            NOW()
        )
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;

-- 3. SEED USER PROFILES (LINKED TO AUTH.USERS & TENANTS)
INSERT INTO public.user_profiles (
    id,
    tenant_id,
    role,
    full_name_en,
    full_name_ar,
    email,
    phone_number,
    specialty_en,
    specialty_ar,
    is_active
) VALUES 
(
    'a0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    'super_admin',
    'Platform Super Admin',
    'مدير النظام العام',
    'admin@aegishealth.com',
    '+966500000001',
    'System Administration',
    'إدارة المنظومة الطبية',
    true
),
(
    'a0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000001',
    'doctor',
    'Dr. Sarah Mansour',
    'د. سارة منصور',
    'doctor@aegishealth.com',
    '+966500000002',
    'Cardiology',
    'أمراض القلب والأوعية الدموية',
    true
),
(
    'a0000000-0000-0000-0000-000000000003',
    'd0000000-0000-0000-0000-000000000001',
    'assistant',
    'Nurse Nourhan Mostafa',
    'نورهان مصطفى (تمريض)',
    'assistant@aegishealth.com',
    '+966500000003',
    'Clinical Nursing & Specimen Intake',
    'التمريض واستلام العينات',
    true
),
(
    'a0000000-0000-0000-0000-000000000004',
    'd0000000-0000-0000-0000-000000000001',
    'patient',
    'Tariq Al-Sabah',
    'طارق الصباح',
    'patient@aegishealth.com',
    '+966500000004',
    NULL,
    NULL,
    true
)
ON CONFLICT (id) DO UPDATE SET
    full_name_en = EXCLUDED.full_en,
    full_name_ar = EXCLUDED.full_ar,
    email = EXCLUDED.email;

-- 4. SEED PATIENTS DOSSIER
INSERT INTO public.patients (
    id,
    tenant_id,
    user_id,
    mrn,
    full_name_en,
    full_name_ar,
    date_of_birth,
    gender,
    blood_group,
    whatsapp_phone,
    emergency_contact_name,
    emergency_contact_phone,
    allergies,
    chronic_conditions
) VALUES 
(
    'c0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000004',
    'MRN-9021',
    'Tariq Al-Sabah',
    'طارق الصباح',
    '1985-06-15',
    'Male',
    'O+',
    '+966500000004',
    'Fahad Al-Sabah',
    '+966500000005',
    '["Penicillin"]'::jsonb,
    '["Type 2 Diabetes", "Mild Hypertension"]'::jsonb
),
(
    'c0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000001',
    NULL,
    'MRN-9022',
    'Fatima Al-Zahra',
    'فاطمة الزهراء',
    '1992-11-20',
    'Female',
    'A+',
    '+966500000006',
    'Amina Al-Zahra',
    '+966500000007',
    '["Sulfa"]'::jsonb,
    '["Asthma"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 5. SEED CLINIC INTEGRATIONS (n8n & AUTOMATIONS)
INSERT INTO public.clinic_integrations (
    id,
    tenant_id,
    integration_type,
    service_name,
    endpoint_url,
    encrypted_api_key,
    events_subscribed,
    is_active,
    last_ping_status
) VALUES 
(
    'e0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    'n8n_webhook',
    'n8n WhatsApp Auto-Dispatcher Workflow',
    'https://n8n.aegishealth.internal/webhook/whatsapp-dispatch',
    'n8n_sec_key_prod_8921a9',
    '["patient_created", "appointment_booked", "prescription_issued"]'::jsonb,
    true,
    'healthy'
),
(
    'e0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000001',
    'whatsapp_business',
    'Meta WhatsApp Business Cloud API',
    'https://graph.facebook.com/v19.0/10492810928/messages',
    'waba_bearer_token_99182',
    '["whatsapp_inbound", "whatsapp_status"]'::jsonb,
    true,
    'healthy'
)
ON CONFLICT (id) DO NOTHING;
