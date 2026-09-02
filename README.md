# KobbyDrive - Free Driving School Public Application & Admin Management System

A lightweight, modern, responsive web application for managing the **Free Driving School Program**. Built with Next.js, React, Tailwind CSS, and Supabase.

## 🚀 Key Features

### 1. Public Application Portal (`/`)
- Multi-step sectioned application form collecting all 14 mandatory applicant fields:
  1. Surname
  2. Last Name / Other Names
  3. Gender (Male, Female, Other)
  4. Title (Mr, Mrs, Miss, Ms, Dr, Rev)
  5. ID Type (Ghana Card, National ID, Passport, Voter ID, Driver's License, etc.)
  6. ID Number
  7. Date of Birth
  8. Place of Birth
  9. Postal Address
  10. House Address / Residential Address
  11. Nationality
  12. Email Address
  13. Phone Number
  14. Interactive Digital Signature (Canvas drawing with touch/stylus/mouse support + clear/upload options)
- Instant generation of unique Application Reference Number (e.g. `KBD-2026-XXXXX`).
- Printable Official Application Slip with QR/Dossier and celebration confetti.

### 2. Applicant Status Tracker (`/track`)
- Real-time status lookup using either Application Reference Number or registered Phone Number.
- 5-step visual progress tracking timeline:
  - Step 1: Application Submitted
  - Step 2: Under Review & Verification
  - Step 3: Approved & Scheduled
  - Step 4: In Driving Training
  - Step 5: Graduated / Certified

### 3. Admin Management Dashboard (`/admin`)
- Secure passcode login gateway (`/admin/login`).
- Real-time KPI Metric cards (Total, Pending, Under Review, Approved, In Training, Graduated, Rejected).
- Real-time search by name, ID number, phone number, email, or application number.
- Advanced filtering by status and gender.
- Detailed Applicant Dossier Modal with high-resolution digital signature renderer.
- Status workflow updater (`Pending` → `Under Review` → `Approved` → `In Training` → `Completed` / `Rejected`).
- Internal admin notes & remarks logging with audit history.
- Batch operations (Batch Approve, Batch In Training, Batch Reject).
- One-click CSV / Excel export.
- Printable Applicant Profile Dossiers.

---

## 🗄️ Database Architecture (Supabase)
All tables are isolated with the `kbdr_` prefix:
- `kbdr_applications`: Stores all candidate applications and digital signatures.
- `kbdr_application_logs`: Audit log tracking status transitions and admin actions.
- `kbdr_settings`: Program settings and configuration storage.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **UI & Styling**: React 19, Tailwind CSS, Lucide Icons
- **Backend & Database**: Supabase (PostgreSQL with Row Level Security)
- **Signature Engine**: HTML5 High-DPI Canvas with touch & stylus support
- **Hosting**: Vercel

---

## ⚙️ Environment Variables
Copy `.env.example` to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
ADMIN_SECRET_KEY=admin2026
NEXT_PUBLIC_PROGRAM_NAME="KobbyDrive Free Driving School"
```

## 💻 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```