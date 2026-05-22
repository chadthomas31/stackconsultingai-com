# components/

Flat directory, one component per file, PascalCase. Imported via `@/components/*`.

Design tokens live in `app/globals.css` (CSS custom properties) and `tailwind.config.ts` (Tailwind literals: `navy-900`, `brand`, `brand-soft`, `soft`). Reusable CSS utility classes live in `app/globals.css` under `/* Utilities */` — `.btn-primary`, `.btn-accent`, `.btn-ghost`, `.btn-cta-call`, `.section-kicker`, `.soft-card`, `.tier-card`, `.live-dot`.

## Design-system primitives

These are shared building blocks. Prefer them over hand-rolling the equivalent markup so the site stays visually consistent. Section/header primitives extracted 2026-05-19 — adoption is incremental, not all call sites migrated yet.

### `Section`
Standard marketing section wrapper. Encodes the SCA section canon: `py-20 md:py-28` vertical rhythm, centered content container, palette tone background.

```tsx
import Section from "@/components/Section";

<Section id="faq" tone="soft" width="4xl">
  ...
</Section>
```

Props:

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `id` | string | — | Anchor target for in-page nav |
| `tone` | `"white" \| "soft" \| "transparent"` | `"white"` | `soft` = `#f5f5fa` alternating background |
| `width` | `"3xl" \| "4xl" \| "5xl" \| "6xl" \| "7xl"` | `"6xl"` | Inner container `max-w-*` |
| `padding` | string | `"py-20 md:py-28"` | Replace vertical rhythm if needed |
| `className` | string | — | Extra classes on `<section>` |
| `innerClassName` | string | — | Extra classes on inner container |
| `ariaLabel` | string | — | For landmark sections without visible heading |

### `SectionHeader`
Kicker + H2 + optional subtitle, standardized type ramp. Pair with `Section`.

```tsx
import SectionHeader from "@/components/SectionHeader";

<SectionHeader kicker="FAQ" title="Questions we get a lot." size="large" />

<SectionHeader
  kicker="Newsletter"
  title="The Stack Report"
  subtitle="Practical AI, business tech, and productivity — every other week."
/>
```

Props:

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `kicker` | string | — | Uses `.section-kicker` |
| `title` | ReactNode | required | H2 |
| `subtitle` | ReactNode | — | Lead paragraph |
| `size` | `"default" \| "large"` | `"default"` | `default` = `text-3xl md:text-4xl`; `large` = `text-4xl md:text-5xl` |
| `align` | `"left" \| "center"` | `"center"` | Header alignment |
| `marginBottom` | string | `"mb-12"` | Override block spacing |
| `className` | string | — | Extra classes on outer `<div>` |

## Migrating existing sections

Look for:

```tsx
<section className="py-20 md:py-28 bg-white">
  <div className="max-w-6xl mx-auto px-4">
    <div className="text-center mb-12">
      <span className="section-kicker">Kicker</span>
      <h2 className="font-heading text-4xl md:text-5xl font-bold text-navy-900 mt-2">Title</h2>
    </div>
    ...
```

Replace with:

```tsx
<Section tone="white">
  <SectionHeader kicker="Kicker" title="Title" size="large" />
  ...
</Section>
```

Reference migrated examples: `FAQ.tsx`, `Newsletter.tsx`, `FinalCTA.tsx`.

## What's NOT extracted (yet)

- **Card / SoftCard**: 87 inline `rounded-{xl,lg} border border-border` patterns across components. Strong consolidation candidate — would normalize border radius drift (`rounded-lg` 85×, `rounded-md` 68×, `rounded-xl` 60×) and replace ad-hoc shadow/hover combos. Defer until a coherent variant set is mapped.
- **Button**: 20 direct `.btn-*` class uses are working fine as CSS utilities. Wrap in a typed React component only if prop-driven variants/icons become a maintenance pain.
- **Domain-specific sections** (CallOpsConsole, PricingTier, Hero): one-off compositions, not primitives.
