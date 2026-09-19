# AegisHealth - Multi-Tenant AI Healthcare Platform

Enterprise-grade multi-tenant healthcare platform built with React 19, TypeScript, Clean Architecture, Supabase PostgreSQL, and n8n workflow automation. Designed for medical centers, clinical staff, patients, and platform administrators.

---

## 1. System Architecture

AegisHealth strictly enforces Clean Architecture and Domain-Driven Design (DDD), dividing the system into four decoupled layers:

```
+-------------------------------------------------------------------------+
|                        Presentation Layer (UI)                          |
|  Doctor Portal   |  Assistant Portal  |  Patient Portal  | Super Admin  |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                    Application Layer (Use Cases)                        |
|  * RegisterPatientUseCase (Credentials, n8n WhatsApp, AI Corpus)        |
|  * CreatePrescriptionUseCase (Drug Safety, Guidance, Audio Links)       |
|  * BookAppointmentUseCase (Conflict Detection, WhatsApp Confirm)        |
|  * AttestSoapNoteUseCase (Digital Signature, Scribing Pipeline)         |
|  * ProcessSpecimenIntakeUseCase (Accession Barcode, Chain of Custody)   |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                         Domain Layer (Core)                             |
|  * Entities: Patient, Appointment, Prescription, Encounter, LabOrder    |
|  * Domain Events: PatientCreated, AppointmentBooked, PrescriptionIssued |
|  * Security Policies: RBAC Policy Matrix, Tenant Boundary Assertion     |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|             Infrastructure & Persistence Layer                          |
|  * Supabase PostgreSQL (Row-Level Security / RLS)                       |
|  * Offline-First Fault-Tolerant Repository Cache                        |
|  * n8n Webhook Dispatcher & Multi-Tenant Event Routing Engine           |
+-------------------------------------------------------------------------+
```

---

## 2. Core Capabilities

### 2.1 Multi-Tenant Isolation
- Strict logical isolation per clinic and branch.
- Supabase Row-Level Security (RLS) guarantees that tenant data cannot leak across organization boundaries.
- Active tenant context resolution at both application and database layers.

### 2.2 Super Admin Command Center
- Live telemetry and metrics calculation across all registered clinics, staff, and automation events.
- Zero-Trust security audit scanner validating 5 points: KMS rotation, tenant boundary enforcement, audit log immutability, webhook signatures, and role-based access.
- Interactive Remote Cloud Console (CLI) for system health checks and key rotation.
- Clinic provisioning workflow with automated database schema seeding.

### 2.3 Automated Patient Onboarding & Communications (n8n & WhatsApp)
- Automatic generation of Medical Record Number (MRN), username, and temporary password upon patient registration.
- Direct automated dispatch of credentials to patient WhatsApp via n8n webhook pipelines.
- Multi-format medication instructions (audio guidance links, structured dosage timing).
- Automated appointment confirmations and intake preparation checklists.
- AI Clinical Triage chatbot processing inbound patient inquiries via WhatsApp.

### 2.4 Clinical Portals
- **Doctor Portal**: AI Voice Scribe consultation recording, SOAP note attestation, prescription issuance with drug interaction checks, lab and imaging orders.
- **Assistant / Nurse Portal**: Patient registration, specimen accessioning and barcode chain of custody, vitals intake, appointment scheduling.
- **Patient Portal**: Medical history timeline, lab results, medication schedule with audio guidance, direct doctor communications.

### 2.5 Internationalization & Accessibility
- Complete bilingual support: Arabic (RTL) and English (LTR).
- Clean typographic scale with Noto Sans Arabic, Plus Jakarta Sans, and Inter.
- Dark and Light mode themes with WCAG 2.1 AA contrast compliance.

---

## 3. Project Structure

```
.
|-- docs/                          # Architectural specifications and design tokens
|-- n8n-workflows/                 # Master n8n automation workflow JSON and setup guide
|   |-- README.md                  # Workflow deployment instructions
|   `-- aegis_master_automation_workflow.json
|-- public/                        # Static assets and favicons
|-- src/
|   |-- application/               # Application Use Cases (pure business orchestration)
|   |-- components/                # Reusable UI design system components
|   |-- data/                      # Data adapters and repository routing
|   |-- domain/                    # Entities, Value Objects, Domain Events, RBAC
|   |-- hooks/                     # Custom React hooks
|   |-- i18n/                      # Internationalization dictionaries (EN / AR)
|   |-- layouts/                   # Shell layouts (AdminShell, DoctorShell, etc.)
|   |-- pages/                     # Routed page components
|   |-- repositories/              # Repository implementations (Supabase + Local Cache)
|   |-- services/                  # Infrastructure services (n8n Webhook, AI Training)
|   |-- styles/                    # Vanilla CSS tokens and component styles
|   |-- theme/                     # Theme provider and design tokens
|   |-- app.tsx                    # Application entry and client-side router
|   `-- main.tsx                   # React root mount
|-- supabase/
|   |-- schema.sql                 # PostgreSQL DDL with RLS policies
|   `-- seed.sql                   # Multi-tenant seed data and initial users
|-- package.json
|-- tsconfig.json
`-- vite.config.ts
```

---

## 4. Getting Started

### 4.1 Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Git

### 4.2 Installation
```bash
git clone <repository-url>
cd stitch_multi_tenant_ai_healthcare_platform_frontend
npm install
```

### 4.3 Development Server
Start the local development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
The application will be accessible at: `http://localhost:5173`

### 4.4 Type Checking
Run strict TypeScript typecheck across all modules:
```bash
npm run typecheck
```

### 4.5 Production Build
Compile and bundle the application for production deployment:
```bash
npm run build
```
The built artifacts will be output to the `dist/` directory.

---

## 5. Database & Seeding

The platform uses Supabase PostgreSQL. Database scripts are located in the `supabase/` directory:

1. **Schema Definition**: `supabase/schema.sql` defines all multi-tenant tables, foreign keys, indexes, and Row-Level Security policies.
2. **Seed Data**: `supabase/seed.sql` populates sample clinics, doctors, staff, and initial patient records.

### Default Seeded Accounts

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| Super Admin | admin@aegishealth.com | AegisAdmin@2026! | Global Platform Operations |
| Doctor | doctor@aegishealth.com | Doctor@2026! | Clinical Consultations & Rx |
| Assistant (Nurse) | assistant@aegishealth.com | Assistant@2026! | Intake, Vitals & Queue |
| Patient | patient@aegishealth.com | Aegis@PT2026! | Personal Health Records |

---

## 6. n8n Automation Engine Integration

The platform connects to n8n via a unified webhook ingestion endpoint:

1. Open your n8n instance (Cloud or Self-Hosted Docker).
2. Go to **Workflows** > **Add Workflow** > **Import from File**.
3. Select `n8n-workflows/aegis_master_automation_workflow.json`.
4. Copy the Webhook Production URL (e.g., `https://n8n.yourclinic.com/webhook/aegis-healthcare-hub`).
5. In the AegisHealth Super Admin panel, navigate to `/admin/integrations`.
6. Paste the Webhook URL, enter the clinic WhatsApp phone number, and click **Save Configuration**.
7. Toggle the workflow to **Active** in n8n.

Supported Events:
- `PATIENT_CREATED`: Dispatches onboarding credentials via WhatsApp.
- `APPOINTMENT_BOOKED`: Dispatches appointment confirmation and prep checklist.
- `PRESCRIPTION_ISSUED`: Dispatches medication details with audio guide link.
- `WHATSAPP_INBOUND`: Ingestion of incoming patient messages for AI triage.

---

## 7. Security and Compliance

- **Zero-Trust Principles**: Every request verifies tenant boundaries, user identity, and role permissions.
- **Audit Logging**: All clinical actions, prescription issuances, and administrative changes generate immutable audit log entries.
- **HIPAA Alignment**: Encryption in transit (TLS 1.3) and at rest (AES-256), strict access controls, and electronic signatures on clinical encounters.
- **Data Minimization**: Patient credentials sent via WhatsApp use temporary one-time passwords requiring immediate password reset upon first login.

---

## 8. Available Scripts

- `npm run dev`: Starts the local Vite development server.
- `npm run build`: Compiles TypeScript and builds the production bundle.
- `npm run typecheck`: Runs strict TypeScript compiler check with zero emit.
- `npm run preview`: Locally previews the production build from `dist/`.

---

## 9. License

Proprietary - All rights reserved. AegisHealth Platform Engineering.
