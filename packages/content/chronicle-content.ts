// Labs Chronicle — Engineering Log content
// Add new entries at the top of the `entries` array

export interface ChronicleEntry {
  slug: string;
  date: string;
  category: 'Build' | 'Discovery' | 'Pattern' | 'Architecture' | 'AI';
  emoji: string;
  title: string;
  summary: string;
  tags: string[];
  body: string;
}

export const chronicleEntries: ChronicleEntry[] = [
  {
    slug: 'building-the-forge',
    date: '2026-04-11',
    category: 'Build',
    emoji: '⚗️',
    title: 'Building The Forge: R&D Playground Live',
    summary:
      'We launched The Forge — Mwenaro Labs\' experimental zone. Here\'s the thinking behind each of the three founding experiments.',
    tags: ['forge', 'R&D', 'AI', 'design-system'],
    body: `The Forge was born from a simple tension: we call ourselves an R&D engine, but our website was a service brochure.

## The Experiments

**01 · AI Prompt Optimizer** — Using the free tier of Gemini 1.5 Flash, we built a tool that rewrites rough prompts into precise, high-quality ones. Three modes: *Refine*, *Expand*, and *Simplify*. The AI returns structured JSON with the improved prompt, a quality score, and specific improvements made.

**02 · Tech Stack Vitals** — A live, data-driven snapshot of the technologies powering the entire Mwenaro ecosystem. Backed by static data for now, but designed to eventually pull from CI/CD pipeline metadata.

**03 · Design System Previewer** — Every button variant, badge state, typography scale, and color token from the \`Midnight & Gold\` system, in one interactive preview panel. Built to serve as a living style guide.

## What's Next

The Forge will grow incrementally. Each new experiment will be numbered, tagged, and logged right here in the Chronicle.`,
  },
  {
    slug: 'gemini-flash-free-tier',
    date: '2026-04-10',
    category: 'AI',
    emoji: '🤖',
    title: 'Gemini 1.5 Flash on the Free Tier: What You Get',
    summary:
      'We integrated Google\'s Gemini 1.5 Flash into Labs. Here\'s a breakdown of the free tier constraints and how we designed around them.',
    tags: ['gemini', 'AI', 'cost-strategy'],
    body: `When cost is a constraint, engineering creativity becomes the skill.

## Free Tier Limits (as of April 2026)
- **RPM**: 15 requests per minute
- **RPD**: 1,500 requests per day
- **Context window**: 1M tokens
- **Output tokens**: 8,192 per request

## Our Design Choices

**Structured output with strict JSON schema** — We instruct Gemini to return only a flat JSON object rather than free text. This avoids markdown wrapping and reduces token usage per call.

**System instructions, not prompt repetition** — The mode-specific behavior (refine / expand / simplify) is encoded into the system instruction, not repeated in every user prompt. This cuts ~30% of input tokens.

**Client-side debouncing** — The UI uses \`useTransition\` to prevent multiple rapid requests, protecting our RPM budget.

## The Upgrade Path

When budget allows, we'll move to \`gemini-2.0-flash\` for lower latency. Eventually, when effectiveness beats cost, \`gemini-2.5-pro\` for complex reasoning tasks.`,
  },
  {
    slug: 'safariclink-crm-case-study',
    date: '2026-04-05',
    category: 'Build',
    emoji: '🚛',
    title: 'SafariLink CRM: Digitizing East African Logistics',
    summary:
      'A technical retrospective on building a trade-route CRM for regional logistics operators across Kenya, Tanzania, and Uganda.',
    tags: ['case-study', 'CRM', 'logistics', 'Next.js'],
    body: `Logistics in East Africa is relationship-driven. WhatsApp groups, notebooks, and phone calls. SafariLink CRM was built to formalize those workflows without losing the human element.

## Core Requirements

1. **Offline-first**: Truck drivers in remote corridors have zero connectivity. All critical data must sync opportunistically.
2. **Swahili UI**: The primary users are operations clerks for whom English is a second language.
3. **Multi-currency**: KES, TZS, UGX — with real-time conversion display.

## Technical Decisions

**PWA with service workers** — IndexedDB queues mutations locally and syncs to Supabase when online.

**Postgres Row-Level Security** — Each logistics company sees only their own shipment records. No application-level tenant filtering.

**Hybrid date formats** — We store UTC internally but display in \`DD/MM/YYYY\` per regional convention.

## Result

Reduced manual data entry time by ~65% in pilot testing across 3 route operators.`,
  },
];
