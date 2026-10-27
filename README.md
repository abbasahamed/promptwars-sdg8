# FairShift — Decent Work & Transparent Governance Platform

[![UN SDG 8](https://img.shields.io/badge/UN%20SDG-Goal%208%20Decent%20Work-0A97D9?style=flat&logo=un)](https://sdgs.un.org/goals/goal8)
[![PromptWars 2026](https://img.shields.io/badge/Hackathon-PromptWars%20%C3%97%20ACM%20SRM-4F46E5?style=flat)](https://github.com/abbasahamed/promptwars-sdg8)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Hosting](https://img.shields.io/badge/Hosting-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com/)

**FairShift** is a responsive workforce demo that connects sample wage calculations, workplace reports, and manager review flows to **UN Sustainable Development Goal 8 (Decent Work & Economic Growth)**.

Targeting high-risk, labor-heavy sectors—specifically **Construction Sites** and **Campus & University Facilities**—FairShift demonstrates how itemized pay calculations, local report tracking, and weekly-hours review can support frontline workers and operations teams.

---

## 📌 Problem Statement

In labor-intensive industries like civil construction and higher-education campus facilities, frontline workers face systematic vulnerabilities:
1. **Opaque & Disputed Pay:** Complex overtime multipliers, unrecorded night shifts, and unauthorized deductions create wage theft and tension.
2. **Fear of Grievance Retaliation:** Workers who notice safety hazards (faulty scaffolding, exposed high-voltage wiring, chemical fumes) hesitate to report them for fear of job termination or blacklisting.
3. **Long Hours & Workplace Risk:** Extended shifts can contribute to fatigue and increase risks in physically demanding or safety-sensitive work.
4. **Management Blindspots:** Operations supervisors lack consolidated visibility into subcontractor hours, safety hot-spots, and pending workforce disputes.

---

## 💡 Solution Overview

FairShift provides worker and employer demo interfaces in English:
- **Worker Mode:** Provides itemized wage breakdowns and a local **SafeVoice** reporting demo with reference tracking. Reports are stored in browser localStorage and this prototype does not provide secure anonymity.
- **Employer / Admin Mode:** Summarizes sample worker hours, overtime, open reports, and fatigue threshold alerts; managers can update report status in this browser.
- **Cross-Industry Context:** Provides distinct sample workers, reports, and role-specific examples for **Construction Sites** (scaffolders, crane riggers, rebar crews) and **Campus Facilities** (hostel housekeeping, electrical techs, dining sanitation teams).

---

## 🚀 Three Core Implemented Features

### Feature A — Transparent Pay Calculator & Salary Slip
- **Explicit formulas:** Calculates regular earnings, overtime earnings, itemized deductions, and non-negative net pay from the displayed inputs.
- **Industry sample profiles:** Load construction and campus worker examples with distinct hours, rates, and deductions.
- **Step-by-step breakdown:** Expand the calculation details to review the formula and values used.
- **Statutory Notice:** Clear legal disclosure that the tool provides transparent wage visibility under SDG 8.3/8.5 without claiming to replace statutory tax/provident fund records.

### Feature B — SafeVoice Workplace Reporting (Local Demo)
- **Multi-Category Escalation:** File tickets for *Safety Hazards*, *Wage Delays*, *Working Conditions / Heat Stress*, or *Harassment*.
- **Name omission:** The optional name field is omitted from an anonymous report in the ordinary employer view. This is a UI behavior, not secure anonymity; reports and profile links are stored in localStorage.
- **Reference and status tracking:** Creates a reference code and displays submitted, review, action, and resolved states. Data stays in the current browser and is not synchronized.
- **Profile-linked demo feed:** Select a sample worker profile to see its submitted reports after reload. The selector does not authenticate the worker or restrict access on a shared browser.

### Feature C — Employer Insights & Fatigue Monitoring
- **Workforce KPI Summary:** Track total active workforce, aggregate weekly overtime hours, pending grievances, and flagged fatigue violations.
- **Weekly-hours review (SDG 8.8):** A configurable threshold flags sample profiles for manager review, with context-specific prompts for construction and campus shift patterns. These are demo indicators, not legal findings or enforced rest rules.
- **Report triage:** Filter by category and status, inspect report summaries, and record status updates and notes in local browser storage.

---

## 🌐 Cross-Industry Adoption Blueprints

| Industry Context | Sample Workforce | Example Concern | Demo Workflow |
| :--- | :--- | :--- | :--- |
| **🏗️ Construction Sites** | Scaffolding leads, concrete masons, crane riggers, site electricians | Loose scaffold clamps, omitted night-pour overtime, and water shortages appear in sample reports. | Review sample wages, flag extended hours, and submit a site concern. |
| **🎓 Campus Facilities** | Hostel housekeeping, HVAC/electrical techs, dining sanitation staff | Sample reports cover electrical panels, chemical storage, and delayed event overtime. | Review campus pay examples, flag extended shifts, and update a report status. |

---

## 🎯 UN Sustainable Development Goal 8 Alignment

- **Target 8.3:** Itemized pay examples show how recording earnings and deductions can support transparent wage discussions.
- **Target 8.5:** Comparing rates and overtime inputs makes the calculation behind a sample pay estimate visible.
- **Target 8.8:** Hazard reports and extended-hours alerts give managers demo workflows for reviewing workplace risks; they do not prevent incidents or provide protected reporting.

---

## 🏛️ Architecture & Data Flow

```text
Worker demo UI ──► localStorage ◄── Employer demo UI
     │                                  │
     ├─ pay calculator                  ├─ sample workforce indicators
     └─ profile-linked reports          └─ local report status updates
```

- **Persistence:** Sample data and demo changes are stored in the current browser. There is no backend, authentication, or cross-device synchronization.
- **Privacy:** The profile selector and anonymous-name toggle are presentation behavior only. Anyone with access to the same browser profile may inspect or change stored data; do not enter sensitive information.



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

# 3. Unit Tests (Pay, fatigue, industry samples, and report workflows)
npm test

# 4. Production Build Verification
npm run build

# 5. Local Production Preview
npm run preview
```

---

## ☁️ Deployment

The Vite app is deployed on Vercel: [promptwars-sdg8.vercel.app](https://promptwars-sdg8.vercel.app/). Vercel builds with `npm run build` and serves the generated `dist/` directory.

For local production verification:

```bash
npm run build
npm run preview
```

### Optional container and Cloud Run alternatives

Vercel is the current hosting target. The repository also retains a Dockerfile and a Cloud Run helper for teams that need a container deployment. These alternatives are optional and are not required for the Vercel build.

```bash
# Build and run the container locally
docker build -t fairshift .
docker run --rm -p 8080:8080 fairshift

# Optional: deploy to Cloud Run after configuring Google Cloud CLI and project access
./deploy-cloudrun.sh
```

The Cloud Run helper uses the active `gcloud` project and requires the caller to have the relevant Google Cloud permissions.

---

## 🔒 Prototype Limitations & Security Disclosures

1. **Demonstration Storage:** This prototype uses client-side `localStorage`. It has no authenticated backend, server-side access controls, or cross-device data synchronization.
2. **SafeVoice Reporting:** The anonymous-name toggle omits the reporter name from the employer-facing UI. Profile links and reports remain in browser storage; this is not secure or production-grade anonymity. Do not submit sensitive information.
3. **Statutory Payroll:** Rates and multipliers are illustrative and configurable. Production payroll must interface with regional statutory PF, ESI, and tax deduction calculators.

---

## 👥 Hackathon Submission Checklist

- [x] **Repository URL:** `https://github.com/abbasahamed/promptwars-sdg8.git`
- [x] **Primary Branch:** `main`
- [x] **Zero Secrets / Bloat:** `.env`, `node_modules`, `dist` excluded via `.gitignore`
- [x] **Three Core Working Features:** Transparent Pay, SafeVoice, Employer Dashboard
- [x] **English Interface:** English-only demo UI
- [x] **Automated Tests:** Vitest unit tests for pay, fatigue, and report workflows
- [x] **Vercel Deployment:** React + TypeScript + Vite production build
