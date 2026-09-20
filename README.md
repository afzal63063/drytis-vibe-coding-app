# Drytis Vibe Coding Application

[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A production-ready, modular React application replicating the **Drytis Engineering & Vibe Coding Workflow**. The platform unifies task orchestration, live compensation tracking across tiered billable rates, prompt engineering tools, bug escalation pathways, and developer productivity analytics—all backed by synchronized persistent local state.

🚀 **Live Application:** [drytis-vibe-coding-app.vercel.app](https://drytis-vibe-coding-app.vercel.app)  
📁 **GitHub Repository:** [github.com/afzal63063/drytis-vibe-coding-app](https://github.com/afzal63063/drytis-vibe-coding-app)

---

## 🌟 Key Application Modules

### 1. Module A: Kanban Task Queue (`src/components/tasks/`)
* **Interactive Kanban Board:** Move tasks across four workflow states (`Todo` → `In Progress` → `Review` → `Done`).
* **Metadata & Filtering:** Manage tasks with metadata including priority levels (*Low, Medium, High, Critical*), client assignments, estimated hours, and category tags.
* **Subtask Workflows:** Embedded checklist execution with live progress calculation bars.

### 2. Module B: Live Timer & Tier Billing Tracker (`src/components/timer/`)
* **Real-time Stopwatch:** Session tracking supporting Start, Pause, Resume, and Complete actions.
* **Dynamic Compensation Tiers:**
  * **Tier-I:** $4.26 / hr
  * **Tier-II:** $8.50 / hr
  * **Tier-III:** $17.15 / hr
* **Live Financial Recalculation:** Instant re-pricing of session, daily, and weekly earnings upon switching tiers.

### 3. Module C: AI Prompt Engineering Studio (`src/components/prompts/`)
* **Pre-configured Prompt Templates:**
  * *Refactor & Debug Stack Trace*
  * *Generate Unit Tests*
  * *API Masking & Security Audit*
* **Runtime Tuning:** Adjustable parameters including model temperature, token limits, and target persona configs.
* **Simulated AI Streaming:** Typewriter streaming response display imitating real-time LLM inference.

### 4. Module D: Bug Escalation Portal (`src/components/bugs/`)
* **Severity Management:** Log and triage issues from **P1 (Critical)** down to **P4 (Low)**.
* **Integrity Flags:** Flag edge cases, record resolution logs, and maintain status-tagged ticket streams.

### 5. Module E: Performance Analytics (`src/components/perf/`)
* **Metric Scorecards:** Track Total Hours Logged, Completed Tasks, Average Resolution Speed, and CSAT scores (defaulting to 4.9/5.0).
* **Tier Progression Engine:** Dynamic visual progress tracking toward the next compensation tier milestone.

---

## 🏗️ Project Architecture & Directory Structure

```text
drytis-vibe-coding-app/
├── package.json
├── vite.config.ts
├── index.html
├── eslint.config.js
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── context/
    │   └── AppContext.tsx          # Centralized state + localStorage persistence
    ├── hooks/                      # Custom hooks (usePersistentState, useNow, useTypewriter)
    ├── data/                       # Mock seed datasets, prompt templates, stream generator
    ├── types/                      # TypeScript domain interfaces
    ├── utils/                      # Billing formulas, time calculations, metadata mappers
    └── components/
        ├── layout/                 # Sidebar, Header & navigation
        ├── tasks/                  # TaskQueue, TaskCard, TaskModal (Module A)
        ├── timer/                  # TimerBilling (Module B)
        ├── prompts/                # PromptStudio (Module C)
        ├── bugs/                   # BugPortal (Module D)
        ├── perf/                   # PerformanceAnalytics (Module E)
        ├── settings/               # SettingsPanel & workspace reset
        └── ui.tsx                  # Shared UI primitives
