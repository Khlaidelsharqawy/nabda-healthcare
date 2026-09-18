# Nabda Healthcare Platform

> **Nabda** is an intelligent, multi-tenant AI-powered healthcare platform designed to streamline clinical workflows, patient management, medical records, and doctor-patient collaboration.

---

## 🌟 Key Features

- **Multi-Tenant Architecture**: Supports isolated tenant environments tailored for clinics, hospitals, and healthcare networks.
- **AI Clinical Workspace & Scribe**: Ambient clinical voice sessions, AI-generated clinical drafts, and automated medical notes.
- **Doctor Portal**:
  - Comprehensive clinical dashboard & appointment scheduling
  - Longitudinal patient medical timelines & profiles
  - Prescription management & lab/imaging orders
  - Voice session recording and ambient AI review
- **Patient Portal**:
  - Digital health dashboard & appointment bookings
  - Telemetry, vital signs, and diagnostic lab reports
  - Digital prescriptions and refill tracking
- **Role-Based Access Control (RBAC)**: Secure separation between Doctor, Patient, Clinic Admin, and Assistant roles.

---

## 📁 Repository Structure

```text
nabda-healthcare/
├── frontend/                   # Frontend client application
│   ├── src/                    # Application source code (React, TypeScript)
│   │   ├── app/                # Core app setup and configuration
│   │   ├── components/         # Shared UI components and navigation shells
│   │   ├── contracts/          # Domain data contracts and type definitions
│   │   ├── features/           # Feature modules (Doctor, Patient, Clinic portals)
│   │   ├── i18n/               # Internationalization & localization
│   │   ├── layouts/            # Page layouts and shells
│   │   └── theme/              # Design tokens and theme styling
│   ├── docs/                   # Architectural specs, route maps, and forensic reports
│   ├── frontend/               # UI prototypes, design screens, and mockups
│   ├── package.json            # Frontend dependencies and scripts
│   ├── tsconfig.json           # TypeScript configuration
│   └── vite.config.ts          # Vite build configuration
├── .gitignore                  # Git ignore rules for node_modules, build artifacts, etc.
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Khlaidelsharqawy/nabda-healthcare.git
   cd nabda-healthcare/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🛠 Tech Stack

- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Modern CSS design tokens, Material Icons

---

## 📄 License

Private repository. All rights reserved.
