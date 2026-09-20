# drytis-vibe-coding-app

A production-ready, modular React application replicating the **Drytis Engineering & Vibe Coding Workflow**: a Kanban task queue, a live billable coding timer with tier rates, an AI prompt studio, a bug escalation portal, and engineer performance analytics — all persisted to `localStorage`.

- **GitHub Owner:** `afzal63063`
- **Repository:** `drytis-vibe-coding-app`
- **Stack:** React 18 · TypeScript · Vite · Tailwind CSS · Lucide React

## Structure

```
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
    │   └── AppContext.tsx          # centralized state + localStorage persistence
    ├── hooks/                       # usePersistentState, useNow, useTypewriter
    ├── data/                        # mock seed data, prompt templates, AI output simulator
    ├── types/                       # TypeScript domain model
    ├── utils/                       # time, billing/tiers, metadata maps
    └── components/
        ├── layout/
        │   ├── Sidebar.tsx          # navigation + engineer/tier card
        │   └── Header.tsx           # role badge, live status, tier indicator
        ├── tasks/                   # TaskQueue.tsx (Module A), TaskCard.tsx, TaskModal.tsx
        ├── timer/                   # TimerBilling.tsx (Module B)
        ├── prompts/                 # PromptStudio.tsx (Module C)
        ├── bugs/                    # BugPortal.tsx (Module D)
        ├── perf/                    # PerformanceAnalytics.tsx (Module E)
        ├── settings/                # SettingsPanel.tsx
        └── ui.tsx                   # shared UI primitives
```

## Modules

| Module | File | Highlights |
| ------ | ---- | ---------- |
| A · Task Queue | `tasks/TaskQueue.tsx` | 4 Kanban columns (Todo → In Progress → Review → Done), drag & drop, priority/category/estimate/assignee/client, subtask checklists with inline progress. |
| B · Timer & Billing | `timer/TimerBilling.tsx` | Real-time stopwatch (Play/Pause/Resume/Complete) and live accrual at Tier-I `$4.26/hr`, Tier-II `$8.50/hr`, Tier-III `$17.15/hr`; switching tiers re-prices session/today/week instantly. |
| C · Prompt Studio | `prompts/PromptStudio.tsx` | Templates: Refactor & Debug Stack Trace, Generate Unit Tests, API Masking & Security Audit; system + payload inputs, model/temperature runtime, simulated streaming AI output. |
| D · Bug Portal | `bugs/BugPortal.tsx` | P1–P4 severity form with tab-switch/integrity flags; filterable ticket list with status tags, resolution notes, and delete. |
| E · Performance | `perf/PerformanceAnalytics.tsx` | Total hours, tasks completed, CSAT (4.9/5.0 default), avg resolution time, and a tier-advancement progress bar. |

## Scripts

| Command        | Description                        |
| -------------- | ---------------------------------- |
| `npm run dev`  | Start the Vite dev server          |
| `npm run build`| Type-check (`tsc`) + production build |
| `npm run lint` | Run ESLint (`eslint .`)            |
| `npm run preview` | Preview the production build    |

## State & Storage

All state lives in `src/context/AppContext.tsx` and persists under the `localStorage` key **`drytis-workflow-v2`**. On first launch the app seeds mock tasks, time entries, and bug tickets so every dashboard is populated out of the box (Settings → Reset workspace reseeds).

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```