# FairShift — Decent Work & Transparent Governance Platform

[![UN SDG 8](https://img.shields.io/badge/UN%20SDG-Goal%208%20Decent%20Work-0A97D9?style=flat&logo=un)](https://sdgs.un.org/goals/goal8)
[![PromptWars 2026](https://img.shields.io/badge/Hackathon-PromptWars%20%C3%97%20ACM%20SRM-4F46E5?style=flat)](https://github.com/abbasahamed/promptwars-sdg8)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Hosting](https://img.shields.io/badge/Google%20Cloud%20Run-Containerized-4285F4?logo=googlecloud&logoColor=white)](https://cloud.google.com/run)

**FairShift** is a mobile-first, decentralized workforce empowerment and compliance platform built for employee-intensive organizations under **UN Sustainable Development Goal 8 (Decent Work & Economic Growth)**. 

Targeting high-risk, labor-heavy sectors—specifically **Construction Sites** and **Campus & University Facilities**—FairShift bridges the trust deficit between frontline staff, subcontracted personnel, and organizational leadership through transparent wage calculation, safe grievance escalation, and automated fatigue monitoring.

---

## 📌 Problem Statement

In labor-intensive industries like civil construction and higher-education campus facilities, frontline workers face systematic vulnerabilities:
1. **Opaque & Disputed Pay:** Complex overtime multipliers, unrecorded night shifts, and unauthorized deductions create wage theft and tension.
2. **Fear of Grievance Retaliation:** Workers who notice safety hazards (faulty scaffolding, exposed high-voltage wiring, chemical fumes) hesitate to report them for fear of job termination or blacklisting.
3. **Severe Fatigue & Workplace Accidents:** Unmonitored overtime shifts exceed safe physiological thresholds, directly causing worksite fatalities and chronic burnout under UN SDG 8.8.
4. **Management Blindspots:** Operations supervisors lack consolidated visibility into subcontractor hours, safety hot-spots, and pending workforce disputes.

---

## 💡 Solution Overview

FairShift provides dual, synchronized interfaces powered by an accessible, bilingual (English & தமிழ்) client:
- **Worker Mode:** Provides instant, itemized wage breakdowns with zero hidden deductions and an anonymous **SafeVoice** reporting channel with verified reference tracking.
- **Employer / Admin Mode:** Delivers operational compliance oversight, automated excessive-hours fatigue alerts, and an auditable grievance triage workflow.
- **Cross-Industry Context:** Demonstrates immediate operational adaptation across **Construction Sites** (scaffolders, crane riggers, rebar crews) and **Campus Facilities** (hostel housekeeping, electrical techs, dining sanitation teams).

---

## 🚀 Three Core Implemented Features

### Feature A — Transparent Pay Calculator & Salary Slip
- **Explicit Mathematical Formulas:** Computes regular earnings ($hours \times rate$), overtime earnings ($OT\_hours \times rate \times multiplier$), approved itemized deductions (safety gear deposits, meal subsidies, festival advance recoveries), and net take-home pay.
- **One-Click Realistic Presets:** Instantly load real-world worker profiles for construction (e.g., *Rajesh Kumar - Scaffolding Lead*) or campus facilities (e.g., *Selvi M. - Hostel Housekeeping*).
- **Step-by-Step Breakdown:** An interactive, expandable mathematical audit trail showing every calculation step to eliminate contractor confusion.
- **Statutory Notice:** Clear legal disclosure that the tool provides transparent wage visibility under SDG 8.3/8.5 without claiming to replace statutory tax/provident fund records.

### Feature B — SafeVoice Workplace Reporting (Anonymous Demo Mode)
- **Multi-Category Escalation:** File tickets for *Safety Hazards*, *Wage Delays*, *Working Conditions / Heat Stress*, or *Harassment*.
- **Privacy Architecture:** Toggle *"Submit without attaching my name"* to sanitize the worker's name and role from the ordinary employer triage feed, ensuring whistleblower safety.
- **Real-Time Ticket Tracking:** Generates verifiable reference codes (e.g. `FS-CON-8492` or `FS-CMP-3101`) with live status chips (`Submitted` ➔ `Under Review` ➔ `Action Taken` ➔ `Resolved`).
- **Live Audit Trail:** Workers see timestamped corrective action notes posted by managers directly on their personal tracking feed.

### Feature C — Employer Insights & Fatigue Monitoring
- **Real-Time KPI Command:** Track total active workforce, aggregate weekly overtime hours, pending grievances, and flagged fatigue violations.
- **Automated Fatigue Warnings (UN SDG 8.8):** A configurable threshold engine (default: 48h/week) that flags personnel exceeding safe shift limits, categorizing alerts into *Warning* or *Critical Fatigue* with concrete mitigation instructions (e.g., mandatory 24h rest before operating high-altitude equipment or rotating night sanitation shifts).
- **Incident Triage Center:** Filter by category and status, inspect full ticket summaries (with anonymous privacy protection), update operational status, and record verified corrective actions.

---

## 🌐 Cross-Industry Adoption Blueprints

| Industry Context | Target Frontline Workforce | Key Operational Vulnerabilities | FairShift Real-World Deployment |
| :--- | :--- | :--- | :--- |
| **🏗️ Construction Sites** | Scaffolding leads, concrete masons, crane riggers, site electricians | High-altitude falls, night pour overtime omissions, hydration depletion in extreme heat | **On-site QR Kiosks & Audio/Tamil Terminals:** Migrant workers verify daily wages before shift departure and anonymously report equipment defects with zero paper trail. |
| **🎓 Campus Facilities** | Hostel housekeeping, HVAC/electrical techs, dining sanitation staff | Exposed corridor wiring, solvent fumes in chemical depots, delayed weekend event pay | **Institutional Administrative Oversight:** Facility deans cross-audit contractor muster rolls against logged SafeVoice disputes to ensure fair wage compliance. |

---

## 🎯 UN Sustainable Development Goal 8 Alignment

- **Target 8.3 (Formalization & Decent Jobs):** Itemized deductions eliminate predatory contractor skimming and wage ambiguity.
- **Target 8.5 (Equal Pay for Equal Work):** Transparent hourly rates and standard overtime multipliers across all shifts.
- **Target 8.8 (Safe & Secure Working Environments):** Whistleblower hazard escalation combined with physiological shift fatigue limits prevents avoidable worksite injuries.

---

## 🏛️ Architecture & Data Flow

```text
[ Frontline Worker Device ]             [ Operations Admin / Supervisor ]
            │                                           │
            ├─► Transparent Pay Calculator              │
            │   (Pure functional math, non-negative)    │
            │                                           │
            ├─► SafeVoice Incident Submission           │
            │   (Anonymous redaction filter)            │
            │                  │                        │
            │                  ▼                        │
            │       ┌───────────────────────┐           │
            │       │ LocalStorage Service  │◄──────────┤
            │       │ (Centralized Storage) │           │
            │       └───────────────────────┘           │
            │                  │                        ▼
            │                  └───────────────► Employer Dashboard
            │                                    ├─ Fatigue Rules Engine
            │                                    ├─ Incident Triage Center
            ▼                                    └─ Audit Trail Status Updates
[ Live Status Tracking Feed ] ◄─────────────────────────────────┘
```

- **Persistence Layer:** Client-side demonstration storage (`localStorage`) with automated seed restoration on first launch.
- **Zero Secrets / Zero Backend Overhead:** Fast, offline-first client architecture requiring zero external API keys or simulated black-box services.
- **Repository Footprint:** Strictly lightweight (~350 KB source footprint; well under the 10 MB limit).

---

## 💻 Setup, Development & Testing Commands

### Prerequisites
- **Node.js**: `v20.x` or later (tested on `v26.12.1`)
- **npm**: `v10.x` or later (tested on `11.20.0`)
- **Git**: `v2.x` or later

### Quickstart
```bash
# Clone the repository
git clone https://github.com/abbasahamed/promptwars-sdg8.git
cd promptwars-sdg8

# Install dependencies
npm install

# Start development server with instant HMR
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Quality Assurance & Automated Tests
```bash
# 1. Type Checking
npm run typecheck

# 2. High-performance Linter
npm run lint

# 3. Unit Tests (Pay calculations & fatigue algorithms)
npm test

# 4. Production Build Verification
npm run build

# 5. Local Production Preview
npm run preview
```

---

## ☁️ Google Cloud Run Deployment

FairShift is packaged with a multi-stage `Dockerfile` and an automated deployment script tailored for Google Cloud Run:

```bash
# Deploy directly from source via Google Cloud SDK
./deploy-cloudrun.sh
```

Or manually:
```bash
gcloud run deploy fairshift-sdg8 \
  --source . \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated
```

- **Container Architecture:** Node 22 Alpine builder compiles Vite production bundle ➔ Nginx 1.27 Alpine serves static files with dynamic `${PORT}` binding and SPA fallback.
- **Healthcheck:** Dedicated `/healthz` endpoint returning HTTP 200 for container orchestrator liveness checks.

---

## 🔒 Prototype Limitations & Security Disclosures

1. **Demonstration Storage:** This prototype uses client-side `localStorage` for self-contained hackathon evaluation. In an enterprise production deployment, this would connect to an authenticated, encrypted PostgreSQL / Cloud SQL backend with row-level security (RLS).
2. **Anonymous Reporting:** The prototype's privacy filter sanitizes identity from ordinary UI state. Production anonymous reporting would employ end-to-end cryptographic key pairs, metadata stripping, and onion routing.
3. **Statutory Payroll:** Rates and multipliers are illustrative and configurable. Production payroll must interface with regional statutory PF, ESI, and tax deduction calculators.

---

## 👥 Hackathon Submission Checklist

- [x] **Repository URL:** `https://github.com/abbasahamed/promptwars-sdg8.git`
- [x] **Single Branch:** `main` (no temporary or dirty branches)
- [x] **Repository Size:** Under 10 MB (actual: ~350 KB)
- [x] **Zero Secrets / Bloat:** `.env`, `node_modules`, `dist` excluded via `.gitignore`
- [x] **Three Core Working Features:** Transparent Pay, SafeVoice, Employer Dashboard
- [x] **Bilingual Support:** English + தமிழ் (Tamil)
- [x] **Automated Tests:** 4/4 passing unit test suite
- [x] **Cloud Run Deployment Pipeline:** `Dockerfile`, `nginx.conf.template`, `deploy-cloudrun.sh`