# PromptWars × ACM SRM — SDG 8 Workspace

[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Lightweight, production-ready frontend starter prepared for the **PromptWars × ACM SRM Student Chapter** hackathon.

> **Hackathon Status: Official Problem Statement Pending**  
> The specific challenge prompt under **UN SDG 8 (Decent Work & Economic Growth)** will be announced during the event kickoff. To comply with hackathon rules, this repository contains zero pre-built challenge solutions or speculative application logic. It provides a clean, verified, and lightning-fast developer environment for the ~3-hour rapid build window.

---

## 🛠️ Tech Stack & Philosophy

- **Framework:** React 19 (Strict Mode enabled)
- **Language:** TypeScript 6 (Strict typing enabled)
- **Bundler & Dev Server:** Vite 8 (Near-instant HMR)
- **Linter:** Oxlint (High-performance linting)
- **Architecture:** Zero backend / database / external auth overhead to maximize development velocity and keep repository footprint strictly minimal (< 1 MB).

---

## 📋 Prerequisites

Ensure you have the following installed locally:

- **Node.js**: `v20.x` or later (tested on `v26.12.1`)
- **npm**: `v10.x` or later (tested on `11.20.0`)
- **Git**: `v2.x` or later (tested on `2.55.0`)

---

## 🚀 Quickstart

### 1. Clone & Navigate
```bash
git clone https://github.com/abbasahamed/promptwars-sdg8.git
cd promptwars-sdg8
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser. Hot Module Replacement (HMR) is active by default.

---

## 🧪 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server with HMR |
| `npm run build` | Runs TypeScript compilation (`tsc -b`) and bundles for production (`vite build`) |
| `npm run typecheck` | Validates TypeScript types across all source files without emitting files |
| `npm run lint` | Runs Oxlint linter across codebase for quality and style checks |
| `npm run preview` | Locally serves the production build in `./dist` for final inspection |

---

## 📁 Project Structure

```text
promptwars-sdg8/
├── public/                 # Static assets (favicons, icons)
│   ├── favicon.svg
│   └── icons.svg
├── src/                    # Application source code
│   ├── App.css             # Main application styling
│   ├── App.tsx             # Root component (placeholder status screen)
│   ├── index.css           # Global resets and CSS variables
│   └── main.tsx            # React root mount point
├── .env.example            # Environment configuration template
├── .gitignore              # Configured ignore rules (node_modules, dist, .env, .DS_Store)
├── .oxlintrc.json          # Oxlint configuration
├── index.html              # HTML entry point
├── package.json            # Project manifest and scripts
├── tsconfig.app.json       # TypeScript frontend compiler configuration
├── tsconfig.json           # Root TypeScript configuration
├── tsconfig.node.json      # TypeScript tooling configuration
└── vite.config.ts          # Vite bundler configuration
```

---

## ⚙️ Environment Variables

If the announced problem requires client-side configurations or API endpoints:
1. Copy the template:
   ```bash
   cp .env.example .env
   ```
2. Populate any required `VITE_` prefixed variables in `.env`.
> `.env` and `.env.*` files are explicitly excluded in `.gitignore` to prevent secret leaks.

---

## 📤 Hackathon Submission Workflow

1. **Verify Quality Before Submission:**
   ```bash
   npm run typecheck
   npm run lint
   npm run build
   ```
2. **Review Git Status:**
   Ensure only source files are staged, with no local binaries or build artifacts (`dist/` or `node_modules/`):
   ```bash
   git status
   ```
3. **Commit & Push to GitHub:**
   ```bash
   git add .
   git commit -m "feat: implement SDG 8 hackathon solution"
   git push origin main
   ```
4. **Deploy (Optional):**
   Deploy effortlessly to Vercel, Netlify, or GitHub Pages directly from the `main` branch.