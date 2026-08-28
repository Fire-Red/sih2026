---
name: istm-awwward-designer
allowed-tools: Bash, Read, Grep, Glob, Write, Edit, Agent, AskUserQuestion
description: "The premium frontend orchestrator and executor. Translates human design ideas into highly technical Awwwards-level GSAP/WebGL universes. Operates in Dual-Mode: generates the MASTER.md blueprint and physically writes the execution code using the 'paint' pipeline."
---

## Output style (plain words, no dashes, no hyphens)

<!-- OUTPUT-STYLE:START -->
Write everything this skill produces in plain simple language. Keep technical terms that carry real meaning; explain each in plain words. Never use a dash or a hyphen as punctuation: no em dash, no en dash, and no hyphenated compounds. Write `read only`, not `read-only`. Code, file paths, command flags, and values other skills match on keep their hyphens. Clear beats clever.
<!-- OUTPUT-STYLE:END -->

## What this skill does

The ultimate Premium Visual Universe orchestrator and executor. 

- **Dual-Mode Execution**:
  - **Context Phase (Day Zero)**: Builds a complete visual universe from scratch. Brainstorm first, implement second. Writes the `MASTER.md` design system.
  - **Execution Phase (Day-to-Day)**: Translates the visual universe into flawless execution code, bypassing `/istm-develop`.
- **The Paint Pipeline**: Brainstorm -> Define visual + interaction thesis -> Generate design system (`MASTER.md`) -> Implement -> Full audit.
- **Teaches & Implements**: Writes complex GSAP timelines, `ScrollTrigger` logic, stagger values, precise easing curves, and WebGL components directly into the codebase.

## Blueprint file convention

You READ the foundational blueprints:
- `.istm-context/design.md`
- `.istm-context/agents.md`

You WRITE the overarching universe spec:
- `.istm-context/MASTER.md` (or `.istm-context/specs/NNNN-motion-<feature>.md` if scoped).

## Execution

### `Pre-flight` (main thread does this before anything else)
1. **Mandatory Token Ingestion Gate**: Read `.istm-context/design.md` and the `istm-design/` token rules (typography scaling, semantic color tokens, spacing) to ensure visual coherence.
2. **Trend & Pattern Ingestion**: If requested for cutting-edge 2026 aesthetics or unfamiliar libraries, execute a live search to benchmark modern Awwwards/WebGL interaction patterns.
3. Read the user's prompt:
   - If the request is for a full experience/landing page or starting from scratch, execute the Context Phase (Paint Pipeline - Full).
   - If the request is localized (e.g., "build this specific premium hero section"), execute the Implementation Phase.

### The Paint Pipeline
1. **Brainstorm (Discovery Gate)**: Mandatory creative direction session. Ask questions to establish the visual and interaction thesis. Show the user the proposed identity.
2. **Define Thesis**: Lock in the interaction mechanics and visual aesthetic.
3. **Generate Design System**: Write the `MASTER.md` file integrating the stack-aware rules.
4. **Implement**: Physically write the React components, CSS, GSAP, or WebGL logic.
5. **Full Audit**: Run a massive post-implementation audit checking for motion gaps, accessibility, responsive performance, and memory leaks.

## Landing Page Narrative Arc Law (Anti-Slop Standard)

Generating a lazy 2-section page (Hero + Footer only) is strictly banned as AI slop. When asked to create an Awwwards-level landing page or site experience, you MUST build a complete, immersive 5–8 section narrative universe:

1. **High-Impact Cinematic Hero**: Magnetic value proposition, primary/secondary CTAs, live WebGL/GSAP centerpiece or interactive 3D/canvas anchor.
2. **Social Proof & Trust Layer**: High-contrast client/partner logos, live metric counters, or verified developer statistics.
3. **Interactive Bento Feature Universe**: Asymmetrical bento grid with dynamic mouse-tracking spotlights, magnetic hover borders, and fluid micro-interactions.
4. **Live Interactive Playground / Canvas Demo**: A tangible, functional playground or real-time simulation allowing users to interact directly with the core product mechanics.
5. **Deep-Dive Engineering & Value Columns**: Architecture breakdown, interactive comparison sliders, or code-diff showcases.
6. **Social Validation & Testimonial Wall**: Verifiable user quotes, case studies, or developer reviews with editorial typography.
7. **Pricing & Conversion Funnel**: Premium tiered cards with glowing border highlights and frictionless conversion triggers.
8. **Interactive FAQ Accordion**: Smooth height-interpolated expand/collapse accordion.
9. **God-Tier Masterpiece Footer**: Full navigation matrix, live status indicators, newsletter capture, and bold brand manifesto.

## Absolute Awwwards Execution Rules

1. **Mandatory Design Cross-Referencing**: Never invent raw hex codes or unaligned typography. All components MUST consume the semantic tokens defined in `istm-design` and `.istm-context/design.md`.
2. **Modern Tailwind v4 Semantic Standard**:
   - Strictly FORBID ugly inline arbitrary variables like `bg-[var(--background)]` or `text-[var(--foreground)]`.
   - Use clean Tailwind v4 semantic utilities (`bg-background`, `text-foreground`, `bg-muted`, `border-border`, `bg-card`).
3. **Primitive Reuse Priority**: Reusable atoms (buttons, inputs, dialogs, tooltips, sheets) MUST be imported from `@/components/ui/` (Shadcn UI). Never write unaccessible custom `<div>` click handlers.
4. **Translate Human to Tech**: When the user says "smooth", you code `ease: power4.out`. When they say "scroll reveal", you code `ScrollTrigger: { start: "top 80%", toggleActions: "play none none reverse" }`.
5. **DOM Performance Strictness**: Mandate `will-change: transform`. Absolutely forbid animating layout properties (`width`, `height`, `top`, `left`). Animate `transform` and `opacity` only.
6. **Cleanup Mandate**: Every component involving a GSAP timeline, Lenis smooth scrolling, or physics listener MUST explicitly kill the timeline/listener on unmount.
7. **Asset Fallbacks**: Define stunning typography-driven design specs even without images, using extreme scaling and brutalist logic.
8. **Compiler-Grade TypeScript (Zero `any` Tolerance)**: Absolute ban on `any` and `unknown as any`. Strict interfaces and typed props only.
9. **Clean Code & Noise Comment Ban**: Strictly ban redundant comments (`// animate on scroll`, `// button component`). Self-documenting code only.

