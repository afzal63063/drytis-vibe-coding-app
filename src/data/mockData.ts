import type { BugReport, Task, TimeEntry } from '../types';
import { uid } from '../utils/time';
import { localDateKey } from '../utils/time';

const hoursAgo = (h: number) => Date.now() - h * 3600_000;

export function seedTasks(): Task[] {
  const base: Task[] = [
    {
      id: uid(),
      title: 'Fix HTTP 500 on /orders checkout when promo applied',
      description:
        'Cart service returns 500 for any order containing a percentage-based promo. Reproduced locally with test cart c-2041.',
      category: 'API Bug',
      priority: 'critical',
      estimatedMinutes: 90,
      assignee: 'Afaq (AI-1)',
      clientName: 'Northwind Retail',
      status: 'inProgress',
      createdAt: hoursAgo(2),
      updatedAt: hoursAgo(0.4),
      subtasks: [
        { id: uid(), title: 'Reproduce with curl + demo cart', done: true },
        { id: uid(), title: 'Trace discount calculator chain', done: true },
        { id: uid(), title: 'Patch rounding on percent promo', done: false },
        { id: uid(), title: 'Add regression test for 500 path', done: false },
      ],
    },
    {
      id: uid(),
      title: 'Persist dark-mode preference across sessions',
      description: 'Theme resets on hard refresh because the choice is only held in React state.',
      category: 'React UI',
      priority: 'medium',
      estimatedMinutes: 45,
      assignee: 'Afaq (AI-1)',
      clientName: 'Acme SaaS',
      status: 'todo',
      createdAt: hoursAgo(6),
      updatedAt: hoursAgo(6),
      subtasks: [
        { id: uid(), title: 'Read stored theme on bootstrap', done: false },
        { id: uid(), title: 'Guard SSR flash on initial paint', done: false },
      ],
    },
    {
      id: uid(),
      title: 'Optimize classifier prompt for random stack traces',
      description: 'Template currently mislabels promise rejections as type errors ~40% of the time.',
      category: 'Prompt Optimization',
      priority: 'medium',
      estimatedMinutes: 60,
      assignee: 'Afaq (AI-1)',
      clientName: 'Insightful Analytics',
      status: 'review',
      createdAt: hoursAgo(26),
      updatedAt: hoursAgo(1),
      subtasks: [
        { id: uid(), title: 'Add reasoning traces to few-shot examples', done: true },
        { id: uid(), title: 'Evaluate 50-sample eval set', done: true },
        { id: uid(), title: 'Ship v2 template to production', done: false },
      ],
    },
    {
      id: uid(),
      title: 'Mask PII fields in customer-export endpoint',
      description: 'CSV export currently serializes raw email + phone columns for non-admin roles.',
      category: 'Security',
      priority: 'high',
      estimatedMinutes: 75,
      assignee: 'Afaq (AI-1)',
      clientName: 'MediCare Plus',
      status: 'todo',
      createdAt: hoursAgo(20),
      updatedAt: hoursAgo(20),
      subtasks: [
        { id: uid(), title: 'Define mask rules per role', done: false },
        { id: uid(), title: 'Apply tokenization at serialization layer', done: false },
      ],
    },
    {
      id: uid(),
      title: 'Unit tests for billing accrual calculator',
      description: 'Cover tier-switch, rounding, and idle-pause branches of the accrual engine.',
      category: 'Testing',
      priority: 'low',
      estimatedMinutes: 50,
      assignee: 'Afaq (AI-1)',
      clientName: 'Northwind Retail',
      status: 'todo',
      createdAt: hoursAgo(30),
      updatedAt: hoursAgo(30),
      subtasks: [],
    },
    {
      id: uid(),
      title: 'Add composite index on orders(status, created_at)',
      description: 'Admin dashboard list queries scan 2.1M rows; index expected to cut p95 from 1.8s to ~90ms.',
      category: 'Database',
      priority: 'high',
      estimatedMinutes: 40,
      assignee: 'Afaq (AI-1)',
      clientName: 'Northwind Retail',
      status: 'review',
      createdAt: hoursAgo(50),
      updatedAt: hoursAgo(22),
      subtasks: [
        { id: uid(), title: 'Baseline EXPLAIN on prod replica', done: true },
        { id: uid(), title: 'Apply index in migration 0142', done: true },
      ],
    },
    {
      id: uid(),
      title: 'Rate-limit webhook ingress to 120 req/min per tenant',
      description: 'Webhooks endpoint is unthrottled; one noisy tenant can starve the shared worker pool.',
      category: 'DevOps',
      priority: 'medium',
      estimatedMinutes: 65,
      assignee: 'Afaq (AI-1)',
      clientName: 'FinPeer',
      status: 'todo',
      createdAt: hoursAgo(70),
      updatedAt: hoursAgo(70),
      subtasks: [
        { id: uid(), title: 'Add token bucket per tenant key', done: false },
        { id: uid(), title: 'Emit 429 + Retry-After contract', done: false },
      ],
    },
    {
      id: uid(),
      title: 'Fix infinite re-render in useSession hook',
      description: 'State updater returns a new object reference every tick, flooding the reconciler.',
      category: 'React UI',
      priority: 'high',
      estimatedMinutes: 35,
      assignee: 'Afaq (AI-1)',
      clientName: 'Acme SaaS',
      status: 'done',
      createdAt: hoursAgo(96),
      updatedAt: hoursAgo(30),
      subtasks: [
        { id: uid(), title: 'Memoize selector result', done: true },
        { id: uid(), title: 'Add vitest render loop guard', done: true },
      ],
    },
  ];
  return base;
}

export function seedBugs(): BugReport[] {
  return [
    {
      id: uid(),
      title: 'Checkout crashes with percent-based promo code',
      stackTrace: `Error: ROUND_HALF_UP on null magnitude
    at applyPercentPromo (adjustments.ts:43)
    at CartService.total (cart.service.ts:210)
    at CheckoutBanner.tsx:88
    at renderWithHooks (react-dom)
Cause: promo.rate is undefined when code uses legacy 'PCT' tokens.`,
      severity: 'P1',
      flags: ['integrity'],
      status: 'open',
      reporter: 'QA · R. Hu',
      clientName: 'Northwind Retail',
      createdAt: hoursAgo(3),
    },
    {
      id: uid(),
      title: 'useSession dispatches setState on every render',
      stackTrace: `Warning: Maximum update depth exceeded.
    at useSession (session.ts:52)
    at App.tsx:14
    at Provider (session-provider.tsx:33)`,
      severity: 'P2',
      flags: ['tabSwitch', 'aiAssisted'],
      status: 'investigating',
      reporter: 'Client · Acme SaaS',
      clientName: 'Acme SaaS',
      createdAt: hoursAgo(28),
    },
    {
      id: uid(),
      title: 'CSV export leaks unmasked email column for operator role',
      stackTrace: `GET /api/v2/export/customers?role=operator -> 200
row[7] = 'full.email@corp.com'  (should be masked)
maskRules.operator.email === '*' expected, got full value.`,
      severity: 'P3',
      flags: ['integrity', 'tabSwitch'],
      status: 'escalated',
      reporter: 'Security · M. Ito',
      clientName: 'MediCare Plus',
      createdAt: hoursAgo(54),
      resolutionNote: 'Escalated to platform security; tokenization tracked on MediCare Plus export task.',
    },
    {
      id: uid(),
      title: 'Toast notifications overlap on small viewports',
      stackTrace: `layout: toasts stack without bounds
viewport(w=390) -> second toast rendered at y=-38 (hidden)
_snackbar.tsx:112  pushToast()`,
      severity: 'P4',
      flags: ['aiAssisted'],
      status: 'resolved',
      reporter: 'QA · R. Hu',
      clientName: 'FinPeer',
      createdAt: hoursAgo(120),
      resolutionNote: 'Toast queue now docks inside viewport-safe container with max-width clamp.',
    },
  ];
}

/** Seed 6 days of billed time entries so analytics start warm. */
export function seedTimeEntries(): TimeEntry[] {
  const rows: Array<[dayOffset: number, client: string, task: string, minutes: number, tier: TimeEntry['tier']]> = [
    [0, 'Northwind Retail', 'Fix HTTP 500 on /orders checkout', 46, 'tier2'],
    [0, 'Insightful Analytics', 'Optimize classifier prompt', 22, 'tier2'],
    [1, 'Acme SaaS', 'Persist dark-mode preference', 74, 'tier2'],
    [1, 'Northwind Retail', 'Unit tests for billing calculator', 38, 'tier1'],
    [2, 'MediCare Plus', 'Mask PII in customer export', 121, 'tier2'],
    [3, 'Northwind Retail', 'Composite index on orders', 58, 'tier2'],
    [3, 'Acme SaaS', 'Fix useSession re-render', 34, 'tier1'],
    [4, 'FinPeer', 'Rate-limit webhook ingress', 96, 'tier2'],
    [4, 'Northwind Retail', 'Composite index on orders', 42, 'tier1'],
    [5, 'Insightful Analytics', 'Optimize classifier prompt', 68, 'tier1'],
  ];

  return rows.map(([offset, client, task, minutes, tier]) => {
    const d = new Date();
    d.setDate(d.getDate() - offset);
    return {
      id: uid(),
      taskId: uid(),
      taskTitle: task,
      clientName: client,
      seconds: minutes * 60,
      date: localDateKey(d),
      tier,
    };
  });
}

export const CANDIDATE_NAME = 'Afaq (AI-1)';
export const CANDIDATE_ROLE = 'Candidate / AI Engineer';