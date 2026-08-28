---
name: istm
allowed-tools: Bash, Read, Grep, Glob, Write, Edit, Agent, AskUserQuestion
description: "The God Mode master command for the @istmx/skills ecosystem. This is the root orchestrator that imports, spins up, and routes all other specialized skills (/istm-architecture, /istm-design, /istm-awwward-designer). It acts as the ultimate AI harness controller."
---

## Output style (plain words, no dashes, no hyphens)

<!-- OUTPUT-STYLE:START -->
Write everything this skill produces, files and messages alike, in plain simple language. Keep technical terms that carry real meaning; explain each in plain words. Never use a dash or a hyphen as punctuation: no em dash, no en dash, and no hyphenated compounds. Write `read only`, not `read-only`. Say it in simple words, or reword the sentence. Code, file paths, command flags, and values other skills match on keep their hyphens. Use short sentences, commas, or parentheses. Clear beats clever.
<!-- OUTPUT-STYLE:END -->

## What this skill does

The apex router: listens to the user's ultimate goal and dynamically orchestrates the correct sub-skills to build the environment. 

- Universal NLP Router: Analyzes the user's raw prompt and semantically maps it to the absolute best skill in the entire `@istmx/skills` ecosystem. Whether they need Day Zero architecture (`/istm-architecture`), premium UI (`/istm-awwward-designer`), feature implementation (`/istm-craft`), or a codebase audit (`/audit`), this skill finds it.
- Global Context Aggregation: If architectural skills are chosen, it ensures all 4 Pillars (`agents.md`, `architecture.md`, `design.md`, `project-overview.md`) are generated in harmony.
- The Self-Destruct Bootstrap: Acts as the initial installer that consumes the user's raw prompt, builds the `.istm-context/`, and then overwrites itself into the AI harness rulebook (e.g., `.cursorrules`).

Does not write the blueprints itself; it delegates to the sub-skills (e.g., delegates UI logic to `/istm-design`).

## Scope

The `/istm` command is the universal entry point. It accepts any raw prompt.

## Acts vs asks

It asks one Master Question to determine the project archetype, then immediately delegates execution to the appropriate sub-skill. 

## Execution

The main thread acts as a dispatcher. 

### `Pre-flight` (main thread does this before anything else)

Gather signals to determine the archetype:

1. Flag check: Was a specific archetype requested? (e.g., `--type=saas`, `--type=premium`).
2. Source count: Analyze `package.json` to detect if the project leans towards a standard build or a premium build.

### Route to the selected phase (Semantic Mapping)

Analyze the prompt and immediately route execution to the absolute best skill in the installed suite:

1. **If they want to build or design a brand new project (Day Zero)**:
   - Standard SaaS / Full-Stack Web App: Delegate immediately to `/istm-architecture` to execute the Discovery Gate and create the 4 Pillars of Truth.
   - Premium Marketing Site (GSAP/WebGL/Animations): Delegate immediately to `/istm-awwward-designer` to build the interaction thesis and physical universe.
   - Backend APIs / Database Schema only: Delegate immediately to `/istm-system-design`.
   - Dedicated UI Design System / Design Tokens: Delegate immediately to `/istm-design`.
   - Specialized Motion Curves / Hardware Physics: Delegate immediately to `/istm-animate`.

2. **If they want Day-to-Day Execution (Workflow Suite)**:
   - Building a specific feature: Execute `/istm-craft` to spec it out, followed by `/istm-develop` to write the code.
   - Debugging a complex error: Execute `/istm-debug` (7-Rung Efficiency Ladder & root-cause caller tracing).
   - Reviewing code quality & tech debt: Execute `/istm-audit`, `/istm-debt`, or `/istm-check`.
   - Security & Vulnerability scans: Execute `/istm-cso`.
   - Automated Browser QA & Visual Testing: Execute `/istm-qa` (headless browser interaction & layout validation).
   - Performance & Bundle Optimization: Execute `/istm-gain`.
   - Code Review & Pre-Merge Audits: Execute `/istm-review` or `/istm-eng-review`.
   - Sprint & Milestone Planning: Execute `/istm-autoplan` or `/istm-sprint`.
   - Shipping & Release Management: Execute `/istm-ship` or `/istm-release`.
   - Writing tests: Execute `/istm-test`.

### Phase 0: Classify (only when `pre-flight` is ambiguous)

Don't guess. Ask once via your agent's interactive option picker (`AskUserQuestion`), or plain text. 
- question: "I am the master @istmx/skills orchestrator. What type of project are we building today?"
- header: "Project Archetype"
- options: 1. `Standard SaaS / Web App`, "Stable, fast, relational DB, standard UI motion." → Delegate to `/istm-architecture`. 2. `Premium Marketing Site`, "GSAP, WebGL, high-end display typography." → Delegate to `/istm-awwward-designer`. 3. `Backend API Only`, "Schemas, routes, no UI." → Delegate to `/istm-system-design`.

### After all phases

**CRITICAL SELF-DESTRUCT RULE**: Once the delegated sub-skills have completed their work and fully hydrated the `.istm-context/` directory, this Master Orchestrator MUST write the finished `agents.md` rulebook directly to the root harness file (e.g., `.cursorrules`, `CLAUDE.md`, `GEMINI.md`), overwriting this very script. 
