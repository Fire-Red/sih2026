---
name: istm-architecture
allowed-tools: Bash, Read, Grep, Glob, Write, Edit, Agent, AskUserQuestion
description: "Master orchestrator for the @istmx/skills framework. Intercepts raw prompts, executes a dynamic Discovery Gate based on the project domain, applies Smart Defaults, and compiles the 4 foundational blueprint files into the `.istm-context/` directory without generating generic AI slop."
---

## Output style (plain words, no dashes, no hyphens)

<!-- OUTPUT-STYLE:START -->
Write everything this skill produces, files and messages alike, in plain simple language. Keep technical terms that carry real meaning; explain each in plain words. Never use a dash or a hyphen as punctuation: no em dash, no en dash, and no hyphenated compounds. Write `read only`, not `read-only`. Say it in simple words, or reword the sentence. Code, file paths, command flags, and values other skills match on keep their hyphens. Use short sentences, commas, or parentheses. Clear beats clever.
<!-- OUTPUT-STYLE:END -->

## What this skill does

The master context orchestrator: evaluates user prompts, resolves structural ambiguity, and writes the 4 Pillars of Truth that every later skill and AI tool reads.

- Greenfield (no code yet, raw prompt): executes the Discovery Gate. Analyzes the domain of the idea (e.g., transactional, real-time, content-heavy), interviews the user to fill critical gaps, applies Smart Defaults, and generates the 4 foundation templates.
- Brownfield (with `--codebase` flag): bypasses the interview entirely. Scans high-leverage structural files (`package.json`, routers, schemas), reverse-engineers the existing architecture, and writes the 4 foundation templates to document the current state accurately.
- UI & Motion Enforcement: explicitly forces the AI to extract typography, colors, and layouts from the `.istm-context/design/` and `.istm-context/animate/` tokens, absolutely forbidding hallucinated styles.

Does not create production application code (the implementation agent owns that), audit for accessibility (/audit owns that), or write the feature scope (/scope owns that).


## Folder Structure & Stack-Idiomatic Architecture

1. **Stack-Idiomatic Structure**: Respect native framework conventions without dogmatic over-engineering:
   - **Next.js (App Router)**: Native `app/` routes, `components/ui/` for primitives, and colocated or domain components where appropriate.
   - **Vite / React / Vue / Nuxt / SvelteKit / Flutter / Mobile**: Strictly adhere to the canonical structure of the target framework.
   - **Existing Codebases**: Always inspect and adopt existing directory conventions before introducing new paths.
2. **Live Stack Research Gate**: When scaffolding unfamiliar, new, or bleeding-edge framework versions (e.g. Next.js 15/16, React 19, Tailwind v4, Vite 6), execute a live web search or official documentation lookup to verify current directory conventions, router configurations, and config filenames before generating code.
3. **Component Architecture & Primitive Reuse**:
   - **UI Primitives (`@/components/ui/` or `shared/components/`)**: Atomic, reusable building blocks (Buttons, Dialogs, Inputs, Tooltips, Sheets, Dropdowns). ALWAYS reuse existing Shadcn UI / Radix primitives instead of reinventing bespoke, unaccessible `<div>` and `<button>` hacks.
   - **Composite Sections (Page / Domain Specific)**: High-level stateful assemblies and narrative sections (HeroSection, PricingTable, CheckoutForm, InteractivePlayground) that consume atomic primitives.

## Landing Page Narrative Arc Law (Anti-Slop Standard)

Lazy 2-section outputs (Hero + Footer only) are strictly banned as generic AI slop. Any landing page, marketing site, or full-page experience must construct a complete, multi-layered narrative arc with rich visual craft:

1. **High-Impact Hero**: Compelling value proposition, primary/secondary CTAs, live preview/visual anchor.
2. **Social Proof & Trust**: Partner/client logos, live developer counts, security badges, or performance metrics.
3. **Interactive Bento Grid / Feature Showcase**: Asymmetrical bento grid highlighting core capabilities with subtle hover states.
4. **Live Interactive Universe / Demo**: A tangible, interactive playground, live canvas, or sandbox allowing users to experience the product directly.
5. **Deep-Dive Architecture & Value Columns**: Technical deep-dive, side-by-side workflow comparisons, or architecture breakdowns.
6. **Social Validation / Case Studies**: Verifiable developer quotes, case studies, or user reviews with authentic typography.
7. **Pricing & Conversion Funnel**: Transparent tiers, feature comparison matrix, and clear upgrade triggers.
8. **Interactive FAQ Accordion**: Smooth expand/collapse answers addressing user objections and technical questions.
9. **God-Tier Footer**: Full navigation columns, live status indicators, newsletter/CTA, and brand manifesto.

## Modern Styling & TypeScript Standards

1. **Tailwind v4 Semantic Token Standard**:
   - Strictly FORBID ugly inline arbitrary variables like `bg-[var(--background)]`, `text-[var(--primary)]`, or `border-[var(--border)]`.
   - Enforce clean first-class semantic utility tokens (`bg-background`, `text-foreground`, `bg-muted`, `text-muted-foreground`, `border-border`, `bg-card`, `text-card-foreground`) mapped directly via `@theme` or root CSS variables.
2. **Compiler-Grade TypeScript (Zero `any` Tolerance)**:
   - Absolute ban on `any` and `unknown as any`.
   - Mandate strict TypeScript interfaces, discriminated unions for UI/server state machines, Zod schema validation on all inputs, and inferred types from ORMs/schemas.
3. **Clean Code & Noise Comment Ban**:
   - Strictly forbid redundant, chatty comments (`// handle click`, `// button component`, `// state for user`).
   - Code must be self-documenting. Comments are permitted ONLY for non-obvious business invariants, complex mathematical equations, or custom physics/shader algorithms.

## Blueprint file convention (The 4 Pillars)

Durable context lives in the `.istm-context/` directory. These files govern all future logic:

- `agents.md` (or `.cursorrules` / `GEMINI.md` chameleon): The operational brain holding memory loops and rules.
- `architecture.md`: The system design, database models, and API flows.
- `design.md`: The UX strategy, motion logic, and UI principles.
- `project-overview.md`: The business logic and core user journeys.

Write knowledge into these 4 files by replacing their `{variables}` with concrete decisions. Never overwrite an existing pillar without permission; gap-fill conservatively.

## Scope

The `--codebase` flag argument routes directly to Phase 2 (reverse engineering). With no argument, the `Pre-flight` signals below route to Phase 0 (ambiguous), or Phase 1 (greenfield: analyze prompt, ask questions, generate templates).

## Acts vs asks

Phase 1 asks architectural questions via MCQ before generating the templates. Phase 2 acts immediately, no questions; it scans the repo and reverse-engineers the blueprints. Phase 1 scales the questions to the project's timeline (do not ask about enterprise caching for a 2-week MVP).

## Artifact ownership

The 4 Pillar files hold the content. Create them if missing. When replacing `{variables}` in the templates, inject the precise tech stack and domain logic. If design tokens are needed, read the `design/` subfolders; you own the enforcement of these tokens, but not the tokens themselves.

## Portability (any OS, any agent)

- Commands: `git` is the only required CLI, same on every OS. Use your agent's cross-platform file tools (search, read, write) to populate templates.
- If interactive question support (`AskUserQuestion`) is missing, ask any multiple choice question as plain text with the same options.

## Execution

The main thread does the writing itself in every phase; it never hands the context writing to a subagent. Before writing, the main thread reads the foundation templates in `istm-architecture/templates/`. Its `{variables}` are the inputs you gathered in pre-flight and the question rounds; apply each as you read.

### `Pre-flight` (main thread does this before anything else)

Gather several signals to determine the execution path:

1. Flag check: Was `--codebase` provided? → `CODEBASE_FLAG`.
2. Context files: Are the 4 pillars already hydrated in `.istm-context/`? → `PILLARS_EXIST`.
3. Source count: Are there existing source files (`.ts`, `.js`, `.py`, `.go`) indicating a populated repo? → `HAS_CODE`.

Pick the phase based on these signals:

| Condition | Phase |
|---|---|
| `CODEBASE_FLAG` is present | Phase 2 (Reverse-engineer the existing codebase). |
| `PILLARS_EXIST` | Phase 3 (Gap-fill: analyze the prompt against existing blueprints and update only what changed). |
| No flag, no pillars, no code (or raw prompt) | Phase 1 (Greenfield: execute Discovery Gate and Interview). |
| No flag, no pillars, but `HAS_CODE` | Phase 0 (Ambiguous: ask if they want to bootstrap from prompt or reverse-engineer from code). |

### Route to the selected phase (The 2-Track Architecture Engine)

#### Track 1: Greenfield Setup (Brand New Project)
- **Discovery Gate**: Evaluate the user's raw prompt and idea domain (transactional SaaS, real-time collab, e-commerce, portfolio).
- **Interactive Interview**: Ask targeted multiple-choice questions to resolve load-bearing unknowns (Auth provider, Database/ORM, Asset strategy). Do not ask enterprise caching questions for a small MVP.
- **Smart Defaults**: If the user has no preference, apply stable, modern defaults (PostgreSQL, Prisma/Drizzle, Next.js App Router, Tailwind v4, Shadcn UI).
- **Template Hydration**: Hydrate the 4 Pillar templates from `istm-architecture/templates/` with fresh choices.

#### Track 2: Brownfield Reverse-Engineering (Existing Codebase)
- **Zero Interrogation**: Bypass the interview entirely. Do NOT ask what database, auth, or CSS framework to use if the codebase already contains them.
- **Step 2.A — Automatic Runtime & Dependency Ingestion**:
  - Read `package.json` dependencies and devDependencies (or `Cargo.toml`, `pyproject.toml`, `go.mod`).
  - Automatically detect runtime (`Next.js App/Pages Router`, `Vite`, `Nuxt`, `SvelteKit`, `Remix`, `FastAPI`, `Expo`).
  - Automatically detect styling (`Tailwind v4`, `Tailwind v3`, `CSS Modules`, `Shadcn UI`, `@radix-ui`).
  - Automatically detect DB & ORM (`Prisma`, `Drizzle`, `Mongoose`, `Supabase`, `PostgreSQL`, `MySQL`).
  - Automatically detect Auth & State (`Auth.js/NextAuth`, `Supabase Auth`, `Clerk`, `Firebase`, `Zustand`, `TanStack Query`).
- **Step 2.B — Structural & Schema Ingestion**:
  - Read live schema files (`prisma/schema.prisma`, `src/db/schema.ts`, `drizzle/`, `models/`).
  - Read route hierarchy (`app/`, `pages/`, `src/routes/`, `routes/`, `api/`).
  - Read design tokens and styles (`globals.css`, `tailwind.config.*`, `@/components/ui/`).
- **Step 2.C — Reverse-Engineered 4 Pillars Hydration**:
  - `architecture.md`: Accurately documents the **actual live database models**, active API endpoints, server actions, and table relations.
  - `design.md`: Extracts the **actual color variables**, font families from `layout.tsx`/`globals.css`, and existing component primitives.
  - `project-overview.md`: Summarizes real project purpose from READMEs, package metadata, and domain routes.
  - `agents.md`: Locks in **existing codebase conventions** (preserves `src/` vs root, custom linters, existing helper paths) with zero destructive rewrites.
- **Step 2.D — Non-Destructive Guarantee**:
  - Never delete, overwrite, or refactor existing working application code.
  - Established patterns are documented as the immutable law for all future AI generations.

#### Track 3: Gap Fill (Updating Existing Context)
- Read existing `.istm-context/` blueprints. Identify what the new prompt requires. Update existing blueprints carefully without wiping unrelated context.

### Phase 0: Classify (only when `pre-flight` is ambiguous)

Don't guess. Ask once via your agent's interactive option picker (`AskUserQuestion`), or plain text. 
- question: "I see an existing codebase, but no `.istm-context/` blueprints. How should I proceed?"
- header: "Project state"
- options: 1. `(Recommended) Reverse-Engineer from Codebase`, "I will scan your files and accurately document the existing architecture." → Track 2 (Phase 2). 2. `Start Fresh from Prompt`, "I will interview you and scaffold a fresh architecture." → Track 1 (Phase 1).

### After all phases

If no templates were written when they should have been, report the failure. 

**CRITICAL SELF-DESTRUCT RULE**: Once Track 1 or Track 2 is complete and you have fully hydrated the rulebook template (`agents.md`), you MUST write that finished rulebook directly to the root harness file (e.g., `.cursorrules`, `CLAUDE.md`, `GEMINI.md`), overwriting this very orchestrator script. This orchestrator is a one-time bootstrap that consumes itself to leave behind the permanent project context.

Otherwise, relay the report: what was discovered, what templates were written, and what tech stack choices were locked in.

## Asset Strategy & Empty States

During the Phase 1 Interview, you MUST ask the user about their visual asset strategy (illustrations, custom icons, logos):
1. **Yes, they are in `src/assets/`**: Scan the directory and map the file paths into `design.md`. Empty states must use these branded assets.
2. **Yes, but I need to upload them**: Pause execution and instruct the user: *"Please upload your assets to `src/assets/`, then type 'done' so I can index them."*
3. **No, use code only**: Write a strict rule in `design.md`: *"Do NOT use image files. All UI and empty states must be built using purely CSS-driven color blocks, typography, and standard icon libraries."*

**Empty State & Iconography Rule**: 
You are strictly forbidden from using emojis in the UI or empty states. Always use proper SVG icon libraries (e.g., Lucide, Heroicons) instead of emojis. If the project has no custom assets, empty states must be constructed using elegant typography, clean spacing, a semantic icon, and a primary CTA.

## Strict Aesthetic Enforcement

When generating or referencing the blueprints, you must enforce the UI extraction process:
- **Typography & Headings**: You must explicitly read the `design/typography` rules. Extract the exact font families and the strict hierarchical scaling for headings (H1, H2, H3). 
- **Color Palettes**: Read `design/colors`. Extract the exact semantic background, surface, and ink tokens. Never hallucinate raw hex codes.
- **Motion**: Read `animate/`. You must adhere strictly to the Dual Motion Standard.
- Ensure these constraints are permanently written into the final `agents.md` memory file.

