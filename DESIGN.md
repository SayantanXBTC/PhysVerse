# PhysVerse — Design Direction

Version 1.0 · Phase 2 output · supersedes all prior visual language

---

## 1. Thesis

PhysVerse is the digital workbench for people who love physics.

Not a gaming site. Not a SaaS dashboard. Not an edtech template. A **scientific instrument crossed with an editorial science publication crossed with an interactive lab**.

The physics itself provides the visual excitement. The interface recedes.

## 2. Guiding constraints

1. **Reduce, don't decorate.** Every card, gradient, and glow needs a reason to exist. Default is nothing.
2. **Typography carries hierarchy.** Not gradients. Not glow. Not scale-on-hover.
3. **One accent color, used sparingly.** Signal, not surface.
4. **Motion communicates state.** Never ambient.
5. **The simulation is the star.** Chrome is quiet.
6. **Content density varies by page purpose.** Landing = cinematic. Lab = dense functional. Formula = high-info.
7. **Design survives with all effects disabled.** If it doesn't, redesign.

## 3. Visual identity — before / after

| Before | After |
|---|---|
| Pure `#000000` background | Ink `#0B0C0E` — slightly warm off-black |
| Red as background language (49 pulse blobs, 51 `glass-red` uses, 92 red gradients) | Ink + paper + one restrained signal red |
| `Inter` sans-serif everywhere | **Fraunces** (display serif) + **Geist Sans** (body/UI) + **JetBrains Mono** (data/equations) |
| 3 glass card wrappers (`glass`, `glass-red`, `glass-strong`) | 1 surface primitive with tiers via elevation tokens, no glass by default |
| `hover:scale-105` on 45+ elements | No decorative scale. Hover = colour/underline/reveal only |
| Gradient text on every heading | Solid ink or paper. Gradient only on the mark |
| 15 custom keyframes (float, gradient-shift, pulse-red…) | 4 primitives (fade, slide, reveal, spring) + reduced-motion path |
| Rounded-3xl inside rounded-2xl | 2 radii: `radius-md 8px` for controls, `radius-lg 14px` for containers. Nothing more |
| Buttons: gradient pills with shadow-red-500/50 | Buttons: rectangular controls, subtle border, ink or signal fill |
| Nav links: giant hover pills with scale + border transition | Nav: text with 1px underline indicator for active |

## 4. Palette

Dark is primary. Light supported for reading contexts (formulas, physicist articles).

### Ink (dark, default)

```
--ink-950:   #0B0C0E   /* app background */
--ink-900:   #101216   /* elevated surface, cards, panels */
--ink-800:   #171A1F   /* raised surface / hovered row */
--ink-700:   #23272E   /* borders, dividers */
--ink-500:   #6B7280   /* muted text, metadata */
--ink-300:   #B7BCC4   /* secondary text */
--ink-100:   #EDEEF1   /* primary text on ink */
--paper:     #F5F1EA   /* paper contrast surface (light mode primary) */
```

### Signal (single accent)

```
--signal-500: #E5484D   /* primary action, active state, live indicators */
--signal-400: #F17275   /* hover on signal */
--signal-600: #C42B30   /* pressed */
--signal-100: #FADCDE   /* signal tint on paper */
--signal-950: #2B0F11   /* signal tint on ink */
```

Red retained but **desaturated from `#EF4444` HSL(0,84,60) to `#E5484D` HSL(358,71,59)** — same wavelength, less scream.

### Scientific accents (used only in charts, diagrams, data)

```
--data-cyan:   #6EA8B7   /* velocity, momentum */
--data-amber:  #C99A4E   /* energy */
--data-sage:   #7FA07B   /* success, stable orbit */
--data-violet: #8A7CB5   /* wave, frequency */
```

**Never** use these as UI decoration. Only inside charts, formulas, diagrams.

### System

```
--success: #5B9B72
--warning: #C99A4E
--danger:  #E5484D    /* same as signal — destructive is signal in context */
```

## 5. Typography

Three fonts. Assigned by role, not by taste.

| Role | Font | Weights | When |
|---|---|---|---|
| **Display** | Fraunces (variable, OPSZ + SOFT axes) | 400, 500, 700 | Landing hero, physicist name, page title, editorial headings |
| **UI + body** | Geist Sans | 300, 400, 500, 600 | Navigation, controls, body copy, forms |
| **Data + code** | JetBrains Mono | 400, 500 | Parameter values, equations, coordinates, timestamps, XP, level, rank |

### Scale (Perfect Fourth × 1.333 base 16px)

```
--fs-xs:   0.75rem   /* 12  — labels, chips, footnotes */
--fs-sm:   0.875rem  /* 14  — meta */
--fs-base: 1rem      /* 16  — body */
--fs-md:   1.125rem  /* 18  — lead body */
--fs-lg:   1.375rem  /* 22  — subhead */
--fs-xl:   1.875rem  /* 30  — H3 */
--fs-2xl:  2.625rem  /* 42  — H2 */
--fs-3xl:  3.75rem   /* 60  — H1 */
--fs-hero: 5.625rem  /* 90  — landing hero */
```

### Rules

- Fraunces at hero size uses `font-optical-sizing: auto`, `font-variation-settings: "opsz" 144, "SOFT" 20`
- Letter-spacing tightens at display sizes: `-0.03em` at hero, `-0.02em` at H1, `-0.01em` at H2, `0` from body down, `+0.06em` on all-caps micro labels
- Line-height: `1.05` on hero, `1.15` on H1-H2, `1.35` on H3, `1.6` on body, `1.4` on data
- Body max-width 65ch. Text-wrap balance on H1-H2. Text-wrap pretty on body.
- Tabular numerals globally on data + tables: `font-variant-numeric: tabular-nums`
- **No all-caps except micro labels** (`--fs-xs`, tracking-widest, ink-500)

## 6. Spacing + rhythm

8pt base grid. Extended for editorial rhythm.

```
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-5:  24px
--space-6:  32px
--space-7:  48px
--space-8:  72px
--space-9:  120px    /* section rhythm on landing */
--space-10: 200px    /* hero → next section */
```

Container: `max-width: 1280px` for most content. `max-width: 1440px` for lab. `max-width: 68ch` for editorial (physicist article, formula detail).

## 7. Radius

```
--radius-sm: 4px   /* chips, tags, inline badges */
--radius-md: 8px   /* buttons, inputs, controls */
--radius-lg: 14px  /* cards, panels, modals */
```

**No `rounded-full` except avatars and the signal dot.** No `rounded-3xl`.

## 8. Elevation

Not shadows. **Border + subtle background shift.**

```
--surface-0: var(--ink-950)                /* base */
--surface-1: var(--ink-900)                /* card, panel, sidebar */
--surface-2: var(--ink-800)                /* hovered row, active tab */
--border-subtle: rgba(255,255,255,0.06)    /* default border */
--border-strong: rgba(255,255,255,0.10)    /* focused, selected */
--border-signal: var(--signal-500)         /* only for primary CTA / active nav dot */
```

Shadows exist **only** on modals and popovers:

```
--shadow-modal: 0 30px 60px -20px rgba(0,0,0,0.7),
                0 0 0 1px rgba(255,255,255,0.06);
```

**No `shadow-red-500/*`.** Ever.

## 9. Motion

Coherent language, honors `prefers-reduced-motion`.

```
--duration-instant: 80ms       /* button press */
--duration-fast:    140ms      /* hover */
--duration-base:    220ms      /* panel, tab, dropdown */
--duration-slow:    420ms      /* page transition, reveal */
--duration-hero:    700ms      /* landing hero sequence */

--ease-out:       cubic-bezier(0.16, 1, 0.3, 1)      /* default reveal */
--ease-standard:  cubic-bezier(0.4, 0, 0.2, 1)       /* motion */
--ease-in:        cubic-bezier(0.4, 0, 1, 1)         /* exit */
```

### Motion tiers (Emil framework)

- **Never animate** button toggles, keyboard-invoked palette, tab switches inside a page.
- **Fast** button feedback (140ms `ease-in`) — brightness or bg shift, no scale.
- **Base** modal/drawer open (220ms) — opacity + 8px translate, spring-free.
- **Slow** page transition (420ms) — opacity crossfade only. No slide+fade+blur+scale stack.
- **Hero** landing simulation reveal (700ms) — real physics motion, not decorative.

### What we deleted from previous system

Removed animations: `float`, `gradient-shift`, `pulse-red`, `bounceIn`, `particle-float`, `scroll-left`, `ripple`, `spin-slow`, `stagger-in` (as ambient loop).
Retained animations: `fade-in`, `slide-up`, `scale-in` (subtle 96→100), plus new `reveal` (mask-based).

## 10. Iconography

Swap Lucide (AI default) → **Phosphor Icons** (`phosphor-react` or `@phosphor-icons/react`). Weight `regular` throughout, `bold` only for the active/selected state. `duotone` reserved for the physics category labels (mechanics/quantum/relativity).

Existing Lucide imports migrate in Phase 4+. Keep both installed during transition.

**Rules:**
- No decorative icon beside every heading.
- No `rounded square + icon + heading` triptych (canonical AI slop).
- Icon-only buttons need `aria-label` and a tooltip.
- Category icons are duotone at 24px. UI icons regular at 18-20px.

## 11. Buttons — strict hierarchy

| Tier | Look | Use |
|---|---|---|
| **Primary** | `bg-signal-500 text-white`, radius-md, no shadow, no gradient. Hover: signal-400. Press: signal-600, translateY(1px). | ONE per screen. "Enter the Lab", "New Experiment", "Save" |
| **Secondary** | `bg-transparent text-ink-100 border border-ink-700`. Hover: `border-ink-500 bg-ink-800`. | "Preview", "Cancel" |
| **Ghost** | `bg-transparent text-ink-300`. Hover: `text-ink-100 bg-ink-900`. | Filters, tab actions |
| **Text link** | Underlined signal or ink-100. Hover: brightens. | Inline actions, "Forgot?" |
| **Destructive** | Same shape as primary, `bg-signal-600` with `border-signal-500`. Requires confirmation. | Delete account, Delete experiment |

**Sizes:** `sm` 32px, `md` 40px (default), `lg` 48px (hero only).

**No gradient fills. No shadow-glow. No scale-on-hover.**

## 12. Cards → panels

Old: `.glass-red` cards nested inside cards inside cards.

New:
- **Panel** — `bg-ink-900 border-subtle radius-lg`. Only when grouping related fields (parameters, chart wrapper).
- **Row** — no card. Full-width divider between items. Hover: `bg-ink-800` band across row.
- **Editorial section** — no card. Section separated by `--space-9` vertical rhythm + hairline `border-t border-ink-700`.

## 13. Navigation

### Desktop

- **Left:** mark (small wordmark + orbit dot).
- **Center:** primary nav — Explore · Lab · Challenges · Formulas · Physicists.
  Active state = 1px signal underline + `text-ink-100`. Inactive = `text-ink-300`, hover → `text-ink-100`.
  No pills. No hover scale. No border transitions.
- **Right:** `⌘K` search chip · avatar dropdown.
- **CTA:** "+ New experiment" — primary button, only when authenticated. Sits in the right cluster, visually differentiated.

### Mobile

- Bottom nav with 4 slots: Explore · Lab · Challenges · Profile.
- Center slot elevated: "+" primary create button.
- Icons + tiny label. Active = signal dot below icon.

## 14. Physics visual language (the signature)

Instead of gradient blobs, ambient physics motifs:

- **Orbit mark** — logo is an ink dot with a hairline elliptical orbit. Rotates once per 30s. Static under reduced-motion.
- **Field-line dividers** — section separators can be a faint SVG vector field animated once on scroll into view.
- **Coordinate grid** — dashboard "My Lab" background is a faint 8pt scientific-graph grid (1% opacity ink-100).
- **Equation typography** — formulas set in JetBrains Mono. Variables italicized inline: `F = m·a`. Real KaTeX for detail views.
- **Measurement chrome** — sliders show tick marks + numeric readout in mono. Values right-align.
- **Live physics element on landing** — a real double pendulum or 2-body orbit runs at 30fps in the hero. Not decorative — it responds to cursor gravity. That's the whole marketing visual.

## 15. Copy tone

Editorial. Confident. Specific. Never marketing-flavored.

**Delete:**
- "Experience the beauty of physics through stunning 3D visualizations"
- "Unlock the power of interactive physics simulation"
- "A complete physics learning ecosystem"
- "Take your physics journey to the next level"
- All exclamation marks in confirmations
- All "Oops!"

**Prefer:**
- "Where physics comes alive."
- "Change the conditions. Watch the laws respond."
- "63 formulas. One reference."
- "Couldn't load your experiments."
- "Enter the Lab."

Sentence case in headings. Buttons are verbs. Section titles are nouns. Never uppercase except `<label>` micro-labels.

## 16. Information architecture

Grouped into four mental models. Not necessarily literal nav labels.

| Model | Routes |
|---|---|
| **Explore** | `/` `/physicist/*` `/formulas` `/gallery` |
| **Lab** | `/dashboard` `/simulation/*` `/preview` |
| **Challenge** | `/challenges` `/leaderboard` |
| **You** | `/profile` `/onboarding` |

## 17. Density per surface

| Surface | Density | Rationale |
|---|---|---|
| Landing | Low, cinematic | First impression, one physics moment |
| Dashboard "My Lab" | Medium-high, table-driven | Users manage many experiments |
| Simulation editor | High, functional | Real instrument, dense controls |
| Simulation preview | Full-bleed canvas, minimal chrome | Simulation is the entire product |
| Physicist detail | Editorial, medium | Long-form reading |
| Formula library | High, information-dense | Reference document |
| Challenges | Medium | Mission-list, scannable |
| Leaderboard | High, table | Rank data |
| Profile | Medium | Personal identity + settings |

## 18. Anti-slop guardrails (never)

- No animated gradient text
- No `blur-3xl` decorative blob
- No `hover:scale-105` on non-CTA elements
- No gradient button
- No card-inside-card-inside-card
- No emoji as icon (except in the physics category chips: ⚛ ⚙ 🌌 kept intentionally as brand hierarchy signal)
- No "Elevate", "Seamless", "Unleash", "Next-gen", "Game-changer", "Delve", "Tapestry"
- No `#000000`. Ink `#0B0C0E`.
- No default `Inter`
- No sun/moon theme toggle icon — theme lives inside Profile → Settings
- No cookie banner in EU jurisdiction? Add compliant one if launching there.
- No pricing table (this isn't SaaS)
- No testimonial carousel
- No 3-equal-cards feature row

## 19. Phase order (execution roadmap)

| Phase | Scope | Blocker gate |
|---|---|---|
| 1 | Audit | Complete ✓ |
| 2 | DESIGN.md (this file) | Complete ✓ |
| 3 | Tokens + fonts + Tailwind config + reset old CSS | Next |
| 4 | Global nav shell (Layout.tsx) + orbit mark + `⌘K` chip | Visual gate |
| 5 | Landing redesign (hero + 6 editorial sections) | Visual gate |
| 6 | Auth split-screen (login + signup) | Visual gate |
| 7 | Onboarding — 2 short steps | |
| 8 | Dashboard — "My Lab" table + Continue + Recent Discoveries | Visual gate |
| 9 | Simulation preview (full-bleed) | Visual gate |
| 10 | Simulation editor (instrument panel) | Visual gate |
| 11 | Formulas — reference index with expandable rows | |
| 12 | Physicist archive + detail (editorial article) | |
| 13 | Public gallery (exhibition grid) | |
| 14 | Challenges (mission list) | |
| 15 | Leaderboard (ranking table) | |
| 16 | Profile (tabs: overview/experiments/achievements/activity/settings) | |
| 17 | Responsive pass all breakpoints | |
| 18 | Motion pass (Emil review) | |
| 19 | A11y pass | |
| 20 | Performance pass | |
| 21 | Redesign skill audit | |
| 22 | Taste anti-slop audit | |
| 23 | Final polish | |

**After every visual-gate phase:** run dev server, screenshot, compare to intent, fix, iterate.

## 20. Acceptance test

Open PhysVerse. Ask:

1. Does it feel like a scientific instrument? _Yes / No_
2. Would you mistake it for an AI-generated dashboard? _No_
3. Is the physics the visual star? _Yes_
4. Is there ONE obvious primary action per page? _Yes_
5. Can you disable all animation and it still feels premium? _Yes_
6. Does the microcopy sound like a human wrote it? _Yes_

All must be yes before shipping.
