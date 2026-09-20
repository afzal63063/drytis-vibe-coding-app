import type { TaskCategory } from '../types';

export interface PromptTemplate {
  id: string;
  title: string;
  subtitle: string;
  system: string;
  payload: string;
  accent: 'bug' | 'test' | 'shield';
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'debug',
    title: 'Refactor & Debug Stack Trace',
    subtitle: 'Root-cause an error payload, then propose a refactor.',
    accent: 'bug',
    system:
      'You are a senior full-stack debugger embedded in a Drytis engineering session. ' +
      'Analyze the stack trace below, state the most probable root cause, then present a concrete fix ' +
      'and a refactor that prevents the class of bug. Be terse, cite line numbers, and end with a regression test.',
    payload: `Error: ROUND_HALF_UP on null magnitude
    at applyPercentPromo (adjustments.ts:43)
    at CartService.total (cart.service.ts:210)
    at CheckoutBanner.tsx:88
    at renderWithHooks (react-dom)

Context:
- promo.rate is populated for codes using tokens like 'PCT15'.
- Legacy codes use 'PCT' with a separate .value field.
- Recent serializer change dropped .value for legacy tokens.`,
  },
  {
    id: 'tests',
    title: 'Generate Unit Tests',
    subtitle: 'Turn an implementation into a vitest suite.',
    accent: 'test',
    system:
      'You are a testing specialist. Generate a vitest + React Testing Library suite for the attached code. ' +
      'Cover happy path, edge cases, and the failure branches. Use describe/it, assert with vitest, and mock only external modules.',
    payload: `export function tierAccrual(seconds: number, ratePerHour: number): number {
  const hours = seconds / 3600;
  const gross = hours * ratePerHour;
  return Math.round(gross * 100) / 100;
}

export function appliesPriority(p: string, overdue: boolean): 'rush' | 'normal' {
  if (p === 'P1' || overdue) return 'rush';
  return 'normal';
}`,
  },
  {
    id: 'security',
    title: 'API Masking & Security Audit',
    subtitle: 'Find data leaks and harden an endpoint contract.',
    accent: 'shield',
    system:
      'You are a security engineer performing an API masking audit. Review the endpoint snippet, list each ' +
      'sensitive field (PII, PHI, credentials), its exposure risk, and give a masked example plus header/response ' +
      'recommendations. Output findings as bullets with severity tags.',
    payload: `GET /api/v2/export/customers?role=operator
200 OK
Content-Type: application/json
{
  "customers": [{
    "id": "c_10482",
    "fullName": "Jordan Lee",
    "email": "jordan.lee@corp.com",
    "phone": "+1 555-0132",
    "ssnHash": "sha256:ab12...",
    "notes": "Card on file ends 4242"
  }]
}`,
  },
];

export interface ModelOption {
  id: string;
  label: string;
  vendor: string;
}

export const MODELS: ModelOption[] = [
  { id: 'gpt-4o', label: 'GPT-4o', vendor: 'OpenAI' },
  { id: 'claude-sonnet', label: 'Claude Sonnet', vendor: 'Anthropic' },
  { id: 'gemini-pro', label: 'Gemini Pro', vendor: 'Google' },
  { id: 'local-llama', label: 'Llama 3.1 8B', vendor: 'Self-hosted' },
];

function firstLine(payload: string): string {
  const hit = payload.split('\n').find((l) => l.trim().length > 0);
  return hit ? hit.trim() : 'n/a';
}

function excerpt(payload: string, max = 14): string {
  return payload
    .split('\n')
    .filter((l) => l.trim().length > 0)
    .slice(0, max)
    .join('\n');
}

export function buildAiOutput(templateId: string, system: string, payload: string, model: string): string {
  const preamble = `▸ session  ${new Date().toISOString().slice(11, 19)}  ·  model ${model}\n▸ obeying system instruction: ${system.split('\n')[0]?.slice(0, 90)}…\n`;

  if (templateId === 'debug') {
    return `${preamble}
## Root-cause hypothesis
The crash originates at \`adjustments.ts:43\` in \`applyPercentPromo\` — **\`promo.rate\` is \`undefined\`** for legacy codes. The serializer change this sprint dropped the legacy \`.value\` field before it reaches the discount calculator, so \`ROUND_HALF_UP\` receives a \`null\` magnitude.

Payload evidence:
\`\`\`text
${excerpt(payload)}
\`\`\`

## Priority order (blast radius)
1. **P1** — any cart with a legacy \`PCT\` token 500s at checkout (revenue-blocking).
2. **P2** — percentage math is string-based and tolerates \`NaN\` silently in \`CartService.total\`.

## The fix
\`\`\`ts
// adjustments.ts — normalize legacy tokens before math
export function applyPercentPromo(
  amount: number,
  promo: { token: string; rate?: number; value?: number },
): number {
  const rate = promo.rate ?? promo.value ?? 0;      // ← legacy .value fallback
  if (typeof rate !== 'number' || Number.isNaN(rate)) {
    throw new PromoConfigError('missing promo magnitude', promo.token);
  }
  const delta = amount * (1 - rate / 100);
  return Math.round(delta * 100) / 100;              // ROUND_HALF_UP at the boundary
}
\`\`\`

## Refactor that kills this class of bug
- Move the discount chain into a pure \`promoEngine\` module; serialize **only normalized \`{ token, rate }\`**.
- Add a schema check at the HTTP boundary so legacy tokens are upgraded in one place.
- Make \`CartService.total\` fail closed (loud error → dashboard alert) instead of bubbling a cryptic 500.

## Regression test
\`\`\`ts
it('applies legacy PCT token without crashing', () => {
  const result = applyPercentPromo(100, { token: 'PCT', value: 15 });
  expect(result).toBe(85);
});
it('throws PromoConfigError when magnitude is absent', () => {
  expect(() => applyPercentPromo(100, { token: 'PCT' })).toThrow(PromoConfigError);
});
\`\`\`

**Estimated impact**: checkout error rate → 0.00%, promo coverage restored for ~740 legacy codes.`;
  }

  if (templateId === 'tests') {
    const target = firstLine(payload).replace(/^export /, '');
    return `${preamble}
Generated suite targeting \`${target}\`.

## \`src/__tests__/tierAccrual.spec.ts\`
\`\`\`ts
import { describe, it, expect } from 'vitest';
import { tierAccrual, appliesPriority } from '../lib/accrual';

describe('tierAccrual', () => {
  it('bills fractional hours at the tier rate', () => {
    const oneHour = tierAccrual(3600, 8.5);
    expect(oneHour).toBe(8.5);
  });

  it('rounds to 2 decimals (ROUND_HALF_UP)', () => {
    expect(tierAccrual(3600, 4.26)).toBe(4.26);
    expect(tierAccrual(539, 17.15)).toBeCloseTo(2.57, 2);
  });

  it('never produces negative accrual', () => {
    expect(tierAccrual(-5, 8.5)).toBe(0);
  });

  it('zero time yields zero accrual at any tier', () => {
    expect(tierAccrual(0, 17.15)).toBe(0);
  });
});

describe('appliesPriority', () => {
  it('flags P1 as rush', () => {
    expect(appliesPriority('P1', false)).toBe('rush');
  });

  it('flags overdue work as rush regardless of severity', () => {
    expect(appliesPriority('P4', true)).toBe('rush');
  });

  it('defaults to normal cadence', () => {
    expect(appliesPriority('P2', false)).toBe('normal');
  });
});
\`\`\`

## Coverage notes
- Branch coverage: **100%** across both functions (rounding, NaN-guard, negative, P1/overdue branches).
- The NaN branch is exercised implicitly; add a strict \`Number.isFinite\` guard if the engine may receive \`Infinity\`.

## SUT snapshot (truncated)
\`\`\`ts
${excerpt(payload, 12)}
\`\`\`

**Rule applied**: no external mocks needed — pure functions, deterministic IO.`;
  }

  return `${preamble}
## Findings (masking + integrity audit)

### 1 · Unmasked email — HIGH
\`email: "jordan.lee@corp.com"\` is returned for \`role=operator\`, which should only receive a display-safe token.
\`\`\`json
{
  "customers": [{
    "id": "c_10482",
    "fullName": "Jordan Lee",
    "email": "j•••e@corp.com",
    "emailHash": "sha256:7f3a…"
  }]
}
\`\`\`

### 2 · Phone exposed — HIGH
Raw \`phone\` leaks directly. Mask to \`+1 555-••••\` unless a dedicated \`phone_delivery\` scope is requested.

### 3 · Card reference in free-text notes — CRITICAL
\`"notes": "Card on file ends 4242"\` embeds PAN tail in an unmasked string field. Strip via tokenizer on write:
\`\`\`text
input:    Card on file ends 4242
output:   Card on file {token:pay_1a2b3c}
\`\`\`

### 4 · \`ssnHash\` naming — MEDIUM
Rename to \`ssn_token\` and document k-anonymity policy (do not echo the hash itself in object arrays).

**Recommendations**
- Enforce a per-role field allowlist at the serializer (constructor-based, not ad-hoc spread).
- Add \`Strict-Transport-Security\`, \`Cross-Origin-Resource-Policy: same-site\` headers.
- Serve \`Cache-Control: no-store\` on all export responses containing tokens.

## Masked example (role=operator)
\`\`\`json
{
  "customers": [{
    "id": "c_10482",
    "email": "j•••e@corp.com",
    "phone": "+1 555-••••[operator]",
    "notes": "Card on file {token:pay_1a2b3c}"
  }]
}
\`\`\`

**Audit verdict**: 1 critical, 2 high, 1 medium. Publish fix with the export-masking task queue.

Raw input snapshot:
\`\`\`json
${excerpt(payload, 12)}
\`\`\``;
}

export interface CategoryInsight {
  category: TaskCategory;
  suggestion: string;
}

export function categoryInsights(): CategoryInsight[] {
  return [
    { category: 'API Bug', suggestion: 'Widen rate/value parsing and add a schema boundary check before the math layer.' },
    { category: 'React UI', suggestion: 'Memoize derived session objects; guard render-loops with a stress test.' },
    { category: 'Prompt Optimization', suggestion: 'Add reasoning traces + a 50-sample eval set before shipping template v2.' },
    { category: 'Database', suggestion: 'Baseline EXPLAIN on a prod replica before and after each index rollout.' },
    { category: 'DevOps', suggestion: 'Ship 429 + Retry-After contract alongside the rate limiter.' },
    { category: 'Security', suggestion: 'Move PII masking to the serializer boundary; tokenize on write.' },
    { category: 'Testing', suggestion: 'Keep pure-function suites mock-free for deterministic coverage.' },
    { category: 'Documentation', suggestion: 'Document masked vs. raw fields in the API reference.' },
  ];
}