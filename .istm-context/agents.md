# SIH26043 — AI Agent Working Instructions

This document defines how AI coding agents should understand, architect, and implement the Societal Problem Intelligence and Collaboration Platform (SIH26043).

Everything written here is considered project context.

Never ignore these rules.

---

# Project Overview

Turn scattered community reported problems into validated systemic problems, identify what capabilities are required to solve them, connect those capabilities across universities, students, labs and industry, manage the resulting project, and eventually verify its impact.

This is a Government of Jharkhand Smart Education problem statement. The platform treats the problem itself as a structured object with a lifecycle: from citizen report through normalization, fusion, government validation, capability assembly, project management, pilot, deployment, to impact verification and solution memory.

Instead of building a generic chatbot or dashboard, we build a structured intelligence pipeline. Every AI coding assistant should understand the project exactly the same way.

---

# Core Product Principles

The product should always feel:
- Professional
- Government grade
- Information first
- Geospatially aware
- Data provenance conscious
- Premium editorial feel
- Honest (no fabricated data, no fake metrics)

Never make the application feel like a generic AI chatbot. Never fill screens with decorative cards. Never present unverified data as verified.

---

# Primary Product Flow

Citizen submits problem report
↓
System normalizes and embeds the report
↓
Problem Fusion pipeline finds related reports (multi signal: semantic, geographic, temporal, domain)
↓
Candidate systemic problems surface for government review
↓
Government validates, creating a Problem DNA profile
↓
System decomposes required capabilities
↓
Capability Assembly finds institutions, students, industry by capability fit and geographic practicality
↓
Challenge published, proposals submitted, project created
↓
Project lifecycle: milestones, prototype, pilot, deployment
↓
Impact verification: baseline, intervention, measurement, verification
↓
Solution Memory stores verified approaches

---

# Tech Stack (Locked)

## Frontend (client/)
- Next.js App Router (TypeScript)
- Tailwind CSS v4 (semantic tokens via @theme)
- shadcn/ui (Radix primitives)
- Zustand (client state)
- TanStack Query (server state)
- Leaflet via react-leaflet (maps)
- Zod (validation)
- ImageKit SDK (media upload)
- Lucide React (icons, no emojis)

## Application Backend (client/app/api/)
- Next.js Route Handlers
- Drizzle ORM
- Neon PostgreSQL (PostGIS + pgvector + uuid-ossp)
- Firebase Authentication (token verification)
- Application level RBAC

## AI Backend (server/)
- FastAPI (Python 3.11+)
- MistralAI:
  - Embeddings: mistral-embed (1024 dimensions)
  - Reasoning: mistral-large-latest
- Pydantic v2
- LangChain / LangGraph (selective, behind service interfaces)
- asyncpg or SQLAlchemy async

## Shared (packages/shared/)
- TypeScript interfaces shared across client
- Zod validation schemas
- Constants (roles, statuses, categories)

## Infrastructure
- Vercel (frontend)
- AWS EC2 (FastAPI)
- Neon (database)
- ImageKit (media)
- Firebase (auth)
- Sentry (monitoring)

---

# Core Engineering and Code Standards

1. **Compiler Grade TypeScript**:
   - Strictly forbid `any` and `unknown as any`.
   - Mandate explicit interfaces, discriminated unions for state, and Zod inference on all inputs.
2. **Modern Tailwind v4 Semantic Tokens**:
   - Strictly forbid ugly inline arbitrary variables like `bg-[var(--background)]` or `text-[var(--foreground)]`.
   - Use clean semantic utility classes (`bg-background`, `text-foreground`, `bg-muted`, `text-muted-foreground`, `border-border`, `bg-card`).
3. **Primitive Reuse Priority (shadcn/ui)**:
   - For all interactive atoms (buttons, inputs, dialogs, dropdowns, tooltips, sheets, accordions), ALWAYS reuse from `@/components/ui/`. Never write unaccessible custom `<div>` click handlers.
4. **Stack Idiomatic Structure**:
   - Next.js App Router: native `app/` routes. Route groups for roles: `(auth)`, `(citizen)`, `(government)`, `(institution)`, `(student)`, `(industry)`, `(admin)`.
5. **Noise Comment Ban**:
   - Strictly forbid redundant comments. Comments are permitted ONLY for non-obvious business invariants, mathematical algorithms, or complex AI pipeline logic.
6. **No Emojis in UI**:
   - Always use Lucide icons. Empty states use typography, spacing, a Lucide icon, and a CTA. CSS driven, code only. No stock illustrations.

---

# Frontend Layout and Text Wrapping Safety

Before adding or changing frontend UI, verify the rendered parent width and alignment at desktop and mobile sizes.

- Do not make a flex or grid text wrapper shrink to fit accidentally.
- Do not use `overflow-wrap: anywhere` for normal prose.
- Do not use display fonts for body copy.
- Do not hardcode UI surface, text, border, or semantic state colors. Use the semantic tokens.
- Use the product font for body copy, headings, buttons, forms, and navigation.

---

## Single Color Rule

The platform has ONE primary interactive color: #4630EB (Expo inspired bright blue).

Blue means: action, interaction, selection. Blue must remain scarce and meaningful. There is no secondary brand color. Red, yellow, and green appear only with semantic meaning (error, warning, success). Map visualization colors appear only when representing actual data categories.

---

# Hybrid AI Architecture Rules

## Normal software handles:
- Validation, distance, spatial filtering, sorting, aggregation, counts
- Permissions, RBAC, workflow state transitions
- Deterministic scoring (weighted capability matching formula)
- CRUD operations

## Embeddings handle:
- Semantic representation of problem reports and solution memory

## pgvector handles:
- Vector similarity search

## RAG handles:
- Retrieving relevant context for LLM reasoning

## LLM (mistral-large) handles:
- Ambiguous relationship reasoning
- Structured summarization
- Capability decomposition
- Explanation generation

## Never:
- LLM as source of truth
- LLM for distance calculations
- LLM for CRUD decisions
- LLM for permission checks
- Automatic government decision approval

---

# Data Provenance Rules

Every external record MUST have:
- source_url
- source_type (official, ugc, aishe, self_reported, directory)
- retrieved_at
- last_verified_at
- verification_status (verified, needs_review, unverified, conflict)

Never fabricate university capabilities. Never fabricate government data. Never fabricate impact numbers. Only add capabilities supported by official department, lab, research, or program pages.

When a source cannot be verified as current: verification_status = "needs_review". When sources conflict: store the conflict and require review.

---

# Database Rules

- PostgreSQL is the source of truth
- pgvector for semantic retrieval (no separate vector database)
- PostGIS for geographic operations (no LLM for distance)
- Drizzle ORM for schema, migrations, and queries from Next.js
- asyncpg or SQLAlchemy for vector and geo queries from FastAPI
- All tables: id (UUID), created_at, updated_at
- External records: source_url, source_type, retrieved_at, last_verified_at, verification_status

---

# Security Rules

- Firebase Authentication with server side token verification
- Application level RBAC on every API route
- Server side authorization (never trust client role claims)
- Input validation: Zod (Next.js), Pydantic (FastAPI)
- Rate limiting on API routes
- Audit logs for all consequential actions
- Environment variables for all credentials
- No API keys in frontend code
- No MistralAI, Firebase, or Neon credentials in client bundles
- CORS configured on FastAPI

---

# AI Provider Abstraction

Keep AI logic behind service interfaces so the model provider can be replaced:
- Embedding model: replaceable (currently mistral-embed)
- LLM model: replaceable (currently mistral-large-latest)
- Map provider: replaceable (currently Leaflet)
- Geocoding provider: replaceable (currently Nominatim, cached, rate limited)

Never hard code a single AI vendor into component logic.

---

# Folder Structure (Locked)

```
/workspaces/web/
├── .istm-context/           # Project context (Pillars)
├── packages/shared/         # Shared types, Zod schemas, constants
├── client/                  # Next.js App Router
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (citizen)/
│   │   ├── (government)/
│   │   ├── (institution)/
│   │   ├── (student)/
│   │   ├── (industry)/
│   │   ├── (admin)/
│   │   └── api/
│   ├── components/
│   │   ├── ui/              # shadcn/ui primitives
│   │   ├── maps/
│   │   ├── reports/
│   │   ├── problems/
│   │   ├── institutions/
│   │   ├── projects/
│   │   ├── impact/
│   │   └── layout/
│   ├── lib/
│   │   ├── db/              # Drizzle config, schema, migrations
│   │   ├── auth/
│   │   ├── api/
│   │   ├── geo/
│   │   └── utils/
│   ├── store/               # Zustand stores
│   ├── hooks/
│   └── types/
├── server/                  # FastAPI AI Backend
│   ├── app/
│   │   ├── api/routes/
│   │   ├── services/
│   │   ├── models/
│   │   ├── core/
│   │   └── db/
│   ├── scripts/             # Seed and ingestion scripts
│   └── tests/
├── GEMINI.md
└── CLAUDE.md
```

Pages are thin routing layers only. No business logic inside pages. No API calls inside pages.

---

# Problem Fusion Pipeline (Core Algorithm)

```
REPORT
↓ normalize text
↓ generate embedding (mistral-embed, 1024 dim)
↓ store in pgvector
↓ retrieve candidates: vector similarity > threshold
↓ for each candidate pair:
│   semantic_similarity (cosine)
│   geographic_distance (PostGIS ST_Distance)
│   temporal_gap (date difference)
│   domain_compatible (category match)
│   affected_population_compatible
↓ calculate overall confidence
↓ HIGH confidence (all signals align): auto group
↓ MEDIUM confidence (some signals disagree): LLM + RAG reasoning
↓ LOW confidence: keep separate
↓ CONSEQUENTIAL decision: human validation always
```

Weights (configurable, not scientifically validated):
- 40% capability fit
- 30% geographic practicality
- 20% institutional relevance
- 10% contextual factors

---

# Capability Matching Algorithm

```
capabilityFit = matchedCapabilities / requiredCapabilities
geographicScore = normalizedProximityScore (PostGIS)
institutionalScore = verifiedRelevantCapabilities / capacityIndicators
overallScore = 0.4 * capabilityFit + 0.3 * geographicScore + 0.2 * institutionalScore + 0.1 * contextual
```

Show combined capability coverage when assembling multiple institutions. Always show what capability is missing.

---

# Prototype Scope (Jharkhand First)

- 20 to 50 real institutions from UGC directory
- 100+ capability records where legitimately supported
- 50 to 100 synthetic problem reports (intentionally designed test cases)
- Jharkhand districts and administrative data
- Small public industry and startup dataset
- Synthetic student profiles
- Small curated solution memory dataset

---

# Synthetic Test Data Design

Include these intentional test cases:
- Case A: Multiple reports that should fuse (water supply in same district)
- Case B: Same location but unrelated problems (water + road at same village)
- Case C: Similar wording but geographically distant
- Case D: Geographically close but semantically unrelated
- Case E: Ambiguous case requiring LLM reasoning
- Case F: Systemic problem needing multiple capabilities
- Case G: Problem with no single institution covering all capabilities
- Case H: Problem with a previous verified solution in Solution Memory

---

# Planning Before Coding

Never immediately start implementing. Before writing code:

1. Understand the feature.
2. Understand dependencies.
3. Break the feature into small tasks.
4. Explain the implementation plan.
5. Ask questions if information is missing.
6. Only then begin implementation.

Never guess requirements. If anything is unclear, ask.

---

# Feature Development Process

Every feature should follow this workflow:

Understand → Plan → Break into tasks → Implement task by task → Verify → Refactor → Update progress.md

Never implement multiple unrelated features together.

---

# What the System Must Never Do

- Fabricate university capabilities
- Fabricate government data
- Fabricate impact numbers
- Expose private student data
- Treat LLM output as fact
- Automatically approve government decisions
- Merge problems solely because they are geographically close
- Recommend institutions solely because they are geographically close
- Claim a project solved a problem without measurements
- Claim an institution has a capability without a source
- Use outdated datasets without marking their age
- Put API keys in the frontend
- Use random scraped data when an official source exists
- Use emojis in the UI

---

# File Length

No source file should exceed approximately 250 lines whenever reasonably possible. If a file becomes too large, split it and extract logic.

---

# Progress and Error Memory Tracking

Two critical memory tracking files:

1. `progress.md`: Tracks completed tasks, feature statuses, and pending deliverables.
2. `error-memory.md`: Tracks system architecture bugs, root causes, and verified fix patterns.

AI agents MUST inspect `error-memory.md` before diagnosing errors. After fixing any meaningful bug, update both files immediately.

---

# When Stuck

Never invent requirements. Never guess. Stop. Ask questions. Wait for clarification. Then continue.

---

# Definition of Done

A task is complete only when:
- Feature works correctly
- Code follows project architecture
- No hardcoded values
- Components are reusable
- Folder structure is respected
- Pages remain thin
- Data provenance is preserved
- No API keys exposed
- progress.md is updated