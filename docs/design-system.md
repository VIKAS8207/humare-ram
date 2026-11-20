# Humare Ram – design system

One palette, one set of shared components, one place to change them.

## 1. Folder map

```
src/
  app/                    routes (page.tsx, layout.tsx, /book, /admin)
  styles/palette.css      THE colour palette (all colour tokens)
  config/
    palette.ts            same colours for SVG / canvas (ticket, seat map)
    images.ts             image paths + sizes
    admin.ts              admin switches (open sign-in)
  lib/                    logic with no UI (gsap, seat store, ticket, auth…)
  components/
    ui/                   design-system building blocks (see section 3)
    site/                 site chrome: navbar, footer, loader, transitions, smooth scroll
    sections/             home-page sections (hero, spotlight, cast-crew, music…)
    effects/              decoration: mandala, embers, petals, amber sparks
    booking/              public booking flow (+ shared seat map)
    ticket/               ticket card (QR + download) helpers
    admin/                admin pages (dashboard, tickets table, booking, cancel)
docs/design-system.md     this file
```

Rule of thumb: if two features need it, it lives in `components/ui`. If only one
needs it, it stays in that feature's folder.

## 2. Colour palette (`src/styles/palette.css`)

Use the names as Tailwind classes: `bg-stage`, `text-gold`, `border-line`,
`ring-ember`… Opacity works: `text-ivory/60`, `border-gold/25`, `bg-ember/10`.
**Never use raw colours** (`orange-400`, `#b8431a`) in components – add a token.

Two themes share the palette:

| Theme | Where | Tokens |
|-------|-------|--------|
| **Stage** (dark) | home page, footer, loaders | `stage`, `stage-soft`, `ivory`, `ember`, `ember-soft`, `ember-deep`, `gold`, `gold-soft`, `gold-pale`, `gold-strong`, `gold-shade`, `gold-line`, `gold-light`/`gold-mid`/`gold-deep` (metallic gradient) |
| **Paper** (cream) | booking flow, tickets, admin | `paper` (page), `paper-raised` (cards, inputs), `ink` (text), `ink-muted`, `line` (borders), `accent` (primary), `accent-ink` (text on accent), `bronze` (small gold labels) |
| **Status** | both | `ok`, `ok-strong` (paid / booked), `danger`, `danger-strong` (cancel, errors) |
| **Sponsor tiers** | partners section | `tier-diamond(-soft)`, `tier-platinum(-soft)` |

`src/config/palette.ts` repeats the few hex values that class names cannot reach
(the ticket SVG, the seat map). Change both files together.

Page background: `paper-page-bg` (cream with soft grainy brown patches).

## 3. Components (`@/components/ui`)

Import from the barrel: `import { Button, Pill } from "@/components/ui"`.

| Component | What it is | Used in |
|-----------|-----------|---------|
| `BookNowButton` | The golden "Book Now" with hover glow. `size="sm \| md \| lg"` | navbar, hero, footer |
| `Button`, `ButtonLink`, `buttonClass()` | Pill buttons: `variant="primary \| dark \| outline \| danger"`, `size`, `grow` | admin, booking, tickets |
| `Field`, `TextInput`, `inputClass` | Label + input + error. `as="div"` for dropdowns | login, booking, admin form |
| `Select` | Custom dropdown (own arrow + list) | admin forms, pagination |
| `Modal` | Centered popup (Esc / click outside closes) | admin, tickets |
| `ConfirmDialog` | "Are you sure?" popup with two buttons | cancel ticket, release seats, leave booking |
| `Pill` | Small rounded label, `tone="ok \| accent \| bronze \| ember \| neutral"` | status tags, role tags |
| `Eyebrow`, `SectionHeader` | Small-caps label; eyebrow + title + subtitle block | every section, admin |
| `StageSection`, `stageSectionClass()` | Dark section wrapper (padding, glow, reveal) | cast, event details, music |
| `RevealSection` | Scroll-reveal wrapper (`.rv`, `.rv-card`) | sections |
| `IconBadge` | Gold gradient icon square | event details |
| `StatCard` | Dashboard KPI card | dashboard |
| `PageTitle` | Page heading + subtitle + action buttons | dashboard, cancel |
| `FilterTabs`, `SearchInput`, `Pagination`, `ActionMenu` | Table toolkit (tabs with counts, search, pager, ⋮ menu) | tickets table |

Feature components built on top: `StepNav` (booking), `TicketsTable` (admin),
`TicketCard` (ticket).

## 4. Rules

1. New colour? Add a token to `palette.css` (and `palette.ts` if used in SVG).
2. Need a button/field/popup? Use the component; extend it with a prop if the
   variant is missing, don't hand-write the classes again.
3. Mobile first: text is `text-sm md:text-base`, sections `py-16 md:py-36`.
4. Buttons are pills (`rounded-full`), cards are `rounded-2xl`, inputs `rounded-xl`.
