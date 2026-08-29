# SIH26043 Architecture

Public interface copy must remain location neutral. Regional scope belongs in data and operations, not in general page headings, navigation, metadata, or promotional copy.

## Architecture Goals

The architecture should be:
- maintainable
- understandable
- scalable according to project constraints
- honest about data provenance (every external record tracks its source, verification date, and status)
- visually restrained (single primary color #4630EB for interaction, no decorative color)
- hybrid AI (use AI selectively, deterministic logic where it is better)
- geospatially aware (location is a first class citizen in every query)
- role aware (7 distinct roles with distinct permissions and views)

Avoid unnecessary complexity. Prove the core loop before expanding.

---

# System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENTS                                    │
│                                                                     │
│   Next.js App (client/)                                             │
│   ├── Citizen Portal (report, track, evidence)                      │
│   ├── Government Console (validate, monitor, dashboards)            │
│   ├── Institution Portal (profile, capabilities, challenges)        │
│   ├── Student Portal (profile, skills, teams, projects)             │
│   ├── Industry Portal (profile, capabilities, partnerships)         │
│   └── Admin Console (users, data, system)                           │
│                                                                     │
│   Leaflet Maps / react-leaflet                                      │
│   shadcn/ui + Tailwind CSS v4                                       │
│   Zustand (client state) + TanStack Query (server state)            │
│   Zod (validation)                                                  │
│   ImageKit (media upload SDK)                                       │
└─────────────────────┬───────────────────────────────────────────────┘
                      │
                      │ HTTPS / REST
                      │
┌─────────────────────▼───────────────────────────────────────────────┐
│                    NEXT.JS API ROUTES                                │
│                    (client/app/api/)                                 │
│                                                                     │
│   Application Backend                                               │
│   ├── Auth middleware (Firebase Auth verification)                   │
│   ├── RBAC middleware                                                │
│   ├── Problem Reports CRUD                                          │
│   ├── Systemic Problems CRUD                                        │
│   ├── Institutions CRUD                                             │
│   ├── Challenges / Projects / Milestones                            │
│   ├── Capability Matching                                           │
│   ├── Geographic Queries (PostGIS via Drizzle)                      │
│   ├── Notifications                                                 │
│   └── Audit Logs                                                    │
│                                                                     │
│   Drizzle ORM → Neon PostgreSQL (PostGIS + pgvector)                │
└─────────────────────┬───────────────────────────────────────────────┘
                      │
                      │ Internal HTTP (REST)
                      │
┌─────────────────────▼───────────────────────────────────────────────┐
│                    FASTAPI AI SERVICE                                │
│                    (server/)                                         │
│                                                                     │
│   AI Backend (Python)                                               │
│   ├── Embedding Service (Mistral Embed, mistral-embed, 1024 dim)   │
│   ├── Problem Fusion Pipeline                                       │
│   │   ├── Normalization                                             │
│   │   ├── Embedding generation                                      │
│   │   ├── Vector retrieval (pgvector)                               │
│   │   ├── Geographic checks (PostGIS)                               │
│   │   ├── Temporal checks                                           │
│   │   ├── Domain compatibility                                      │
│   │   ├── Confidence calculation                                    │
│   │   └── LLM reasoning for ambiguous cases                        │
│   ├── Capability Decomposition                                      │
│   ├── RAG Service (retrieve context, ground reasoning)              │
│   ├── Structured Summarization                                      │
│   ├── Solution Memory Retrieval                                     │
│   └── Data Ingestion Pipeline                                       │
│                                                                     │
│   MistralAI SDK                                                     │
│   ├── mistral-embed (embeddings)                                    │
│   └── mistral-large-latest (reasoning)                              │
│   Pydantic (validation)                                             │
│   LangChain / LangGraph (selective orchestration)                   │
│   SQLAlchemy or asyncpg (direct DB access for vector/geo queries)   │
└─────────────────────┬───────────────────────────────────────────────┘
                      │
                      │
┌─────────────────────▼───────────────────────────────────────────────┐
│                    NEON POSTGRESQL                                   │
│                                                                     │
│   Extensions:                                                       │
│   ├── PostGIS (geography, geometry, spatial queries)                 │
│   ├── pgvector (vector similarity search)                           │
│   └── uuid-ossp (UUID generation)                                   │
│                                                                     │
│   Source of Truth for ALL data                                       │
│   No separate vector database                                       │
│   No separate search engine (for prototype)                         │
└─────────────────────────────────────────────────────────────────────┘

External Services:
├── Firebase Authentication
├── ImageKit (media storage)
├── MistralAI API (embeddings + LLM)
├── Nominatim / geocoding (cached, rate limited)
└── Sentry (monitoring)
```

---

# Tech Stack

## Frontend
- Framework: Next.js (App Router, TypeScript)
- Styling: Tailwind CSS v4 with semantic tokens via `@theme`
- Component Library: shadcn/ui (Radix primitives)
- State Management: Zustand (client state) + TanStack Query (server state)
- Maps: Leaflet via react-leaflet
- Validation: Zod
- Media Upload: ImageKit client SDK
- Icons: Lucide React (no emojis, no stock illustrations)

## Application Backend (Next.js API Routes)
- Framework: Next.js Route Handlers
- Database: Neon PostgreSQL (serverless)
- ORM: Drizzle ORM
- Extensions: PostGIS, pgvector, uuid-ossp
- Auth: Firebase Authentication (token verification in middleware)
- Authorization: Application level RBAC

## AI Backend (FastAPI)
- Framework: FastAPI (Python 3.11+)
- AI Provider: MistralAI
  - Embeddings: mistral-embed (1024 dimensions)
  - Reasoning: mistral-large-latest
- Validation: Pydantic v2
- Orchestration: LangChain / LangGraph (selective, behind service interfaces)
- DB Access: asyncpg or SQLAlchemy async for vector and geo queries

## Infrastructure
- Frontend Hosting: Vercel
- AI Backend Hosting: AWS EC2
- Database: Neon (serverless PostgreSQL)
- Media: ImageKit
- Monitoring: Sentry
- Testing: Vitest + Playwright (frontend), pytest (backend)

---

# Folder Structure

```
/workspaces/web/
├── .istm-context/            # Project context (4 Pillars + design tokens)
├── packages/
│   └── shared/               # Shared types, Zod schemas, constants
│       ├── src/
│       │   ├── types/         # TypeScript interfaces shared across client and server
│       │   ├── schemas/       # Zod validation schemas
│       │   ├── constants/     # Shared constants (roles, statuses, categories)
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── client/                    # Next.js App Router
│   ├── app/
│   │   ├── (auth)/            # Auth pages (login, register)
│   │   ├── (citizen)/         # Citizen facing pages
│   │   │   ├── report/        # Submit and track reports
│   │   │   └── track/
│   │   ├── (government)/      # Government console
│   │   │   ├── validate/      # Validation console
│   │   │   ├── radar/         # Problem radar dashboard
│   │   │   ├── challenges/    # Challenge portfolio
│   │   │   └── impact/        # Impact dashboard
│   │   ├── (institution)/     # Institution portal
│   │   │   ├── profile/
│   │   │   ├── capabilities/
│   │   │   └── challenges/
│   │   ├── (student)/         # Student portal
│   │   │   ├── profile/
│   │   │   ├── teams/
│   │   │   └── projects/
│   │   ├── (industry)/        # Industry portal
│   │   ├── (admin)/           # Admin console
│   │   ├── api/               # Next.js API routes
│   │   │   ├── auth/
│   │   │   ├── reports/
│   │   │   ├── problems/
│   │   │   ├── institutions/
│   │   │   ├── capabilities/
│   │   │   ├── challenges/
│   │   │   ├── projects/
│   │   │   ├── impact/
│   │   │   ├── solutions/
│   │   │   └── admin/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                # shadcn/ui primitives
│   │   ├── maps/              # Leaflet map components
│   │   ├── reports/           # Report related composites
│   │   ├── problems/          # Problem fusion, DNA, radar composites
│   │   ├── institutions/      # Institution cards, capability views
│   │   ├── projects/          # Project lifecycle composites
│   │   ├── impact/            # Impact verification composites
│   │   └── layout/            # Shell, sidebar, header, navigation
│   ├── lib/
│   │   ├── db/                # Drizzle config, schema, migrations
│   │   │   ├── schema/        # Drizzle table definitions
│   │   │   ├── migrations/
│   │   │   └── index.ts
│   │   ├── auth/              # Firebase auth helpers
│   │   ├── api/               # API client functions (TanStack Query hooks)
│   │   ├── geo/               # Geographic utilities
│   │   └── utils/             # General utilities
│   ├── store/                 # Zustand stores
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # Client specific types
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts     # or CSS based config for v4
│   └── next.config.ts
├── server/                    # FastAPI AI Backend
│   ├── app/
│   │   ├── main.py            # FastAPI app entry
│   │   ├── config.py          # Settings, env vars
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── embeddings.py
│   │   │   │   ├── fusion.py
│   │   │   │   ├── matching.py
│   │   │   │   ├── rag.py
│   │   │   │   ├── summarization.py
│   │   │   │   ├── ingestion.py
│   │   │   │   └── health.py
│   │   │   └── deps.py        # Dependency injection
│   │   ├── services/
│   │   │   ├── embedding_service.py
│   │   │   ├── fusion_service.py
│   │   │   ├── matching_service.py
│   │   │   ├── rag_service.py
│   │   │   ├── summarization_service.py
│   │   │   ├── ingestion_service.py
│   │   │   └── solution_memory_service.py
│   │   ├── models/            # Pydantic models
│   │   │   ├── report.py
│   │   │   ├── problem.py
│   │   │   ├── institution.py
│   │   │   ├── capability.py
│   │   │   └── common.py
│   │   ├── core/
│   │   │   ├── ai_provider.py # Abstracted AI provider interface
│   │   │   ├── mistral.py     # MistralAI implementation
│   │   │   └── security.py
│   │   └── db/
│   │       ├── connection.py
│   │       └── queries.py     # Raw SQL for vector and geo operations
│   ├── scripts/
│   │   ├── seed_institutions.py
│   │   ├── seed_reports.py
│   │   ├── seed_capabilities.py
│   │   └── generate_embeddings.py
│   ├── tests/
│   ├── requirements.txt
│   ├── pyproject.toml
│   └── Dockerfile
├── GEMINI.md
├── CLAUDE.md
└── package.json               # Root workspace config
```

Each feature module (reports, problems, institutions, projects, impact) owns its own components, API routes, hooks, and types. Only truly reusable primitives belong in `components/ui/`.

---

# Database Schema (Core Entities)

## Users and Roles

```sql
-- Users (Firebase UID as primary key or linked)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN (
    'citizen', 'government', 'institution_admin',
    'student', 'industry', 'lab', 'platform_admin'
  )),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Role specific profiles
CREATE TABLE government_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  department_id UUID,
  designation TEXT,
  district_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  institution_id UUID,
  enrollment_number TEXT,
  department TEXT,
  year_of_study INTEGER,
  availability TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE student_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES student_profiles(id),
  skill TEXT NOT NULL,
  proficiency TEXT CHECK (proficiency IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE student_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES student_profiles(id),
  interest TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE industry_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  organization_name TEXT NOT NULL,
  organization_type TEXT CHECK (organization_type IN (
    'startup', 'msme', 'corporate', 'csr', 'ngo'
  )),
  sector TEXT,
  website TEXT,
  location geography(Point, 4326),
  district_id UUID,
  source_url TEXT,
  source_type TEXT CHECK (source_type IN ('official', 'self_reported', 'directory')),
  last_verified_at TIMESTAMPTZ,
  verification_status TEXT DEFAULT 'unverified',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE industry_capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_profile_id UUID REFERENCES industry_profiles(id),
  capability TEXT NOT NULL,
  description TEXT,
  source_url TEXT,
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Geography

```sql
CREATE TABLE states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE districts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  state_id UUID REFERENCES states(id),
  headquarters TEXT,
  location geography(Point, 4326),
  boundary geography(MultiPolygon, 4326),
  source_url TEXT,
  source_type TEXT DEFAULT 'official',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE administrative_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('block', 'panchayat', 'municipality', 'ward')),
  district_id UUID REFERENCES districts(id),
  location geography(Point, 4326),
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE government_departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  state_id UUID REFERENCES states(id),
  parent_department_id UUID REFERENCES government_departments(id),
  domain TEXT,
  website TEXT,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Problem Reports

```sql
CREATE TABLE problem_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location geography(Point, 4326),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  district_id UUID REFERENCES districts(id),
  category TEXT,
  subcategory TEXT,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  affected_population_estimate INTEGER,
  status TEXT DEFAULT 'submitted' CHECK (status IN (
    'submitted', 'under_review', 'fused', 'validated', 'rejected', 'archived'
  )),
  reported_at TIMESTAMPTZ DEFAULT now(),
  is_synthetic BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE problem_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_report_id UUID REFERENCES problem_reports(id),
  uploader_id UUID REFERENCES users(id),
  media_type TEXT CHECK (media_type IN ('image', 'video', 'document')),
  media_url TEXT NOT NULL,
  imagekit_file_id TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE problem_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_report_id UUID REFERENCES problem_reports(id) UNIQUE,
  embedding vector(1024),
  model_name TEXT DEFAULT 'mistral-embed',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE problem_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_a_id UUID REFERENCES problem_reports(id),
  report_b_id UUID REFERENCES problem_reports(id),
  semantic_similarity DOUBLE PRECISION,
  geographic_distance_km DOUBLE PRECISION,
  temporal_gap_days INTEGER,
  domain_compatible BOOLEAN,
  overall_confidence DOUBLE PRECISION,
  confidence_level TEXT CHECK (confidence_level IN ('high', 'medium', 'low')),
  llm_reasoning TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Systemic Problems

```sql
CREATE TABLE systemic_problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT,
  domain TEXT NOT NULL,
  subdomain TEXT,
  status TEXT DEFAULT 'candidate' CHECK (status IN (
    'candidate', 'validated', 'challenged', 'in_progress',
    'resolved', 'rejected'
  )),
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  trend TEXT CHECK (trend IN ('growing', 'stable', 'shrinking', 'spreading')),
  report_count INTEGER DEFAULT 0,
  geographic_spread_km DOUBLE PRECISION,
  centroid geography(Point, 4326),
  affected_districts UUID[],
  affected_population_total INTEGER,
  validated_by UUID REFERENCES users(id),
  validated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Links reports to systemic problems
CREATE TABLE systemic_problem_reports (
  systemic_problem_id UUID REFERENCES systemic_problems(id),
  problem_report_id UUID REFERENCES problem_reports(id),
  PRIMARY KEY (systemic_problem_id, problem_report_id)
);

CREATE TABLE problem_dna (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  systemic_problem_id UUID REFERENCES systemic_problems(id) UNIQUE,
  symptoms JSONB,
  possible_causes JSONB,
  affected_locations JSONB,
  affected_population JSONB,
  evidence_summary TEXT,
  stakeholders JSONB,
  required_capabilities TEXT[],
  constraints JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE problem_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  systemic_problem_id UUID REFERENCES systemic_problems(id),
  validator_id UUID REFERENCES users(id),
  action TEXT CHECK (action IN ('validate', 'reject', 'split', 'merge', 'escalate')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Institutions and Capabilities

```sql
CREATE TABLE institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN (
    'central_university', 'state_university', 'private_university',
    'deemed_university', 'iit', 'nit', 'iiit',
    'engineering_college', 'medical_college', 'polytechnic',
    'research_institute', 'innovation_centre', 'other'
  )),
  state TEXT DEFAULT 'Jharkhand',
  district_id UUID REFERENCES districts(id),
  address TEXT,
  pin_code TEXT,
  location geography(Point, 4326),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  website TEXT,
  source_url TEXT,
  source_type TEXT CHECK (source_type IN ('official', 'ugc', 'aishe', 'self_reported')),
  retrieved_at TIMESTAMPTZ,
  last_verified_at TIMESTAMPTZ,
  verification_status TEXT DEFAULT 'verified' CHECK (verification_status IN (
    'verified', 'needs_review', 'unverified', 'conflict'
  )),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE institution_departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID REFERENCES institutions(id),
  name TEXT NOT NULL,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE institution_capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID REFERENCES institutions(id),
  capability TEXT NOT NULL,
  department TEXT,
  research_area TEXT,
  description TEXT,
  source_url TEXT,
  source_type TEXT CHECK (source_type IN ('official', 'department_page', 'research_page', 'lab_page')),
  last_verified_at TIMESTAMPTZ,
  verification_status TEXT DEFAULT 'verified',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE institution_labs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID REFERENCES institutions(id),
  department_id UUID REFERENCES institution_departments(id),
  name TEXT NOT NULL,
  focus_area TEXT,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE institution_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID REFERENCES institutions(id),
  department_id UUID REFERENCES institution_departments(id),
  program_name TEXT NOT NULL,
  level TEXT CHECK (level IN ('undergraduate', 'postgraduate', 'doctoral', 'diploma', 'certificate')),
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Capability Matching

```sql
CREATE TABLE capability_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  systemic_problem_id UUID REFERENCES systemic_problems(id),
  capability TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('essential', 'important', 'nice_to_have')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE capability_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  systemic_problem_id UUID REFERENCES systemic_problems(id),
  institution_id UUID REFERENCES institutions(id),
  matched_capabilities TEXT[],
  missing_capabilities TEXT[],
  capability_fit DOUBLE PRECISION,
  geographic_score DOUBLE PRECISION,
  institutional_score DOUBLE PRECISION,
  overall_score DOUBLE PRECISION,
  distance_km DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Project Lifecycle

```sql
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  systemic_problem_id UUID REFERENCES systemic_problems(id),
  title TEXT NOT NULL,
  description TEXT,
  required_capabilities TEXT[],
  status TEXT DEFAULT 'open' CHECK (status IN (
    'draft', 'open', 'assigned', 'in_progress', 'completed', 'cancelled'
  )),
  published_by UUID REFERENCES users(id),
  published_at TIMESTAMPTZ,
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES challenges(id),
  submitted_by UUID REFERENCES users(id),
  institution_id UUID REFERENCES institutions(id),
  title TEXT NOT NULL,
  description TEXT,
  approach TEXT,
  team_composition JSONB,
  timeline JSONB,
  budget_estimate JSONB,
  status TEXT DEFAULT 'submitted' CHECK (status IN (
    'submitted', 'under_review', 'approved', 'rejected', 'revision_requested'
  )),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES challenges(id),
  proposal_id UUID REFERENCES proposals(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN (
    'active', 'prototype', 'pilot', 'deployment',
    'completed', 'blocked', 'cancelled'
  )),
  lead_institution_id UUID REFERENCES institutions(id),
  start_date DATE,
  target_end_date DATE,
  actual_end_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  user_id UUID REFERENCES users(id),
  role TEXT CHECK (role IN (
    'lead', 'faculty_mentor', 'student', 'industry_partner',
    'government_liaison', 'researcher'
  )),
  institution_id UUID REFERENCES institutions(id),
  joined_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'in_progress', 'completed', 'overdue', 'skipped'
  )),
  completed_at TIMESTAMPTZ,
  deliverables JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE pilots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  location geography(Point, 4326),
  district_id UUID REFERENCES districts(id),
  description TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'planned' CHECK (status IN (
    'planned', 'active', 'completed', 'failed'
  )),
  results JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  pilot_id UUID REFERENCES pilots(id),
  location geography(Point, 4326),
  district_id UUID REFERENCES districts(id),
  description TEXT,
  deployed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN (
    'active', 'monitoring', 'verified', 'failed', 'decommissioned'
  )),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Impact Verification

```sql
CREATE TABLE impact_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  measurement_type TEXT CHECK (measurement_type IN (
    'baseline', 'during_pilot', 'post_intervention', 'follow_up'
  )),
  metric_name TEXT NOT NULL,
  metric_value DOUBLE PRECISION,
  metric_unit TEXT,
  measured_at TIMESTAMPTZ,
  measured_by UUID REFERENCES users(id),
  location geography(Point, 4326),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE impact_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  verified_by UUID REFERENCES users(id),
  verification_type TEXT CHECK (verification_type IN (
    'government', 'community', 'third_party'
  )),
  baseline_summary TEXT,
  outcome_summary TEXT,
  is_impact_verified BOOLEAN DEFAULT false,
  verification_notes TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Solution Memory

```sql
CREATE TABLE solution_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  systemic_problem_id UUID REFERENCES systemic_problems(id),
  problem_type TEXT NOT NULL,
  domain TEXT,
  subdomain TEXT,
  location_context JSONB,
  approach TEXT NOT NULL,
  requirements TEXT[],
  cost_estimate JSONB,
  constraints JSONB,
  measured_results JSONB,
  verification_status TEXT,
  embedding vector(1024),
  source TEXT,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

## System

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  reference_type TEXT,
  reference_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

# State Management Rules

Use Zustand for client side state (UI state, active filters, map viewport, current role). Use TanStack Query for all server state (reports, problems, institutions, projects). Do not use legacy or unnecessarily complex patterns. Keep stores focused. Avoid monolithic state objects.

---

# Product Intelligence Decisions

## Flexible problem reports

The report model supports any community or institutional problem, not only physical infrastructure. Category, severity, location, affected population, and impact details are nullable where they do not apply. Evidence is optional. Media is stored through the approved media provider and retains its provenance.

## Fusion and repeated reports

The system compares reports using semantic similarity, compatible problem type, geographic distance when available, temporal context, and evidence. It classifies relationships as exact duplicate, same systemic problem, related but separate, or unrelated.

Repeated reports close to one another can form a systemic problem when the underlying issue is also compatible. A count such as 19 reports is evidence of repeated occurrence, not proof of 19 unique households or a numeric affected population. Government validation is required before a consequential grouping is treated as confirmed.

## Solution memory retrieval

After a systemic problem is created or reviewed, RAG retrieves relevant prior solutions from solution memory. Retrieval considers problem meaning, type, symptoms, causes, required capabilities, location context, constraints, and verified results. Results show their source, verification status, evidence, limitations, and measured outcomes when available.

Student applications may reference prior solutions. The application records what the team is reusing, what it is changing, why the approach fits, and what limitations remain. Government and institution reviewers can inspect these references beside the team proposal.

## AI assistance and authority

Government officers, institutions, and students may use AI for explanation, summarization, relationship review, solution search, capability discovery, and proposal drafting. AI never approves a problem, merges a consequential report group, selects a team, verifies a capability, or claims impact. Every AI result is labelled as an assisted draft and grounded in available sources and records.

---

# Data Fetching and Caching

Use TanStack Query (React Query) via custom hooks per domain:

- `useReports()`, `useReport(id)`
- `useSystemicProblems()`, `useSystemicProblem(id)`
- `useInstitutions()`, `useInstitution(id)`
- `useCapabilityMatches(problemId)`
- `useChallenges()`, `useProjects()`
- `useImpactMeasurements(projectId)`

Responsibilities: caching, invalidation, async operations, optimistic updates. Do not misuse Zustand for server state patterns.

---

# Authentication

Provider: Firebase Authentication

Methods:
- Email and password
- Google OAuth
- Phone number (for citizen accessibility)

Authentication state must remain isolated from general application state. Firebase token is verified server side in Next.js API route middleware. Role is stored in the users table and checked via RBAC middleware.

---

# Core Workflows

## Workflow 1: Problem Fusion Pipeline

Citizen submits report
↓
Next.js API validates and stores in PostgreSQL
↓
Next.js calls FastAPI to generate embedding (mistral-embed)
↓
FastAPI stores embedding in pgvector
↓
FastAPI retrieves candidate similar reports (vector similarity + geographic filter)
↓
For each candidate pair: calculate semantic similarity, geographic distance (PostGIS), temporal gap, domain compatibility
↓
Calculate overall confidence score
↓
High confidence: auto group as candidate systemic problem
↓
Medium confidence: send to LLM (mistral-large) with RAG context for reasoning
↓
Low confidence: keep separate
↓
Candidate systemic problems surface on Government Validation Console
↓
Government validates, rejects, splits, or merges
↓
Validated problems get Problem DNA profile

## Workflow 2: Capability Assembly and Matching

Government validates systemic problem and defines required capabilities
↓
System queries institutions within configurable radius (PostGIS ST_DWithin)
↓
For each nearby institution: check capability table for matches
↓
Calculate capability fit: matched / required
↓
Calculate geographic score: normalized distance
↓
Calculate overall score: 40% capability fit + 30% geographic + 20% institutional + 10% contextual
↓
Show ranked institutions with explicit capability coverage grid
↓
Show combined coverage if multiple institutions are assembled
↓
Show missing capabilities
↓
Include industry partners and student skills in assembly view
↓
Government approves assembly and publishes challenge

---

# Hybrid AI Architecture (What AI Does vs What Normal Software Does)

## Normal software handles:
- Input validation (Zod, Pydantic)
- Distance calculations (PostGIS ST_Distance)
- Spatial filtering (PostGIS ST_DWithin)
- Sorting and ranking (SQL ORDER BY)
- Aggregation and counts (SQL)
- Permissions and RBAC (middleware)
- Workflow state transitions (status enums, guards)
- Deterministic scoring (weighted formula)
- CRUD operations

## Embeddings handle:
- Semantic representation of problem reports
- Semantic representation of solution memory

## pgvector handles:
- Vector similarity search (cosine distance)
- Finding semantically similar reports and solutions

## RAG handles:
- Retrieving relevant reports as context for LLM reasoning
- Grounding LLM responses in actual data

## LLM (mistral-large) handles:
- Ambiguous relationship reasoning (medium confidence fusion candidates)
- Structured summarization of systemic problems
- Capability decomposition from problem descriptions
- Explanation generation (why these reports are related)

## Never:
- LLM as source of truth
- LLM for distance calculations
- LLM for simple CRUD decisions
- LLM for permission checks

---

# Data Source Architecture

Every imported external record preserves provenance:

```json
{
  "source": {
    "type": "official",
    "organization": "UGC",
    "url": "https://www.ugc.gov.in/universitydetails/university",
    "retrievedAt": "2026-08-28T00:00:00Z",
    "lastVerifiedAt": "2026-08-28T00:00:00Z"
  }
}
```

Ingestion pipeline:
SOURCE → FETCH → NORMALIZE → VALIDATE → DEDUPLICATE → GEOCODE (if needed, cached, rate limited) → ENRICH → STORE SOURCE URL → STORE LAST VERIFIED DATE → DATABASE

Data freshness is a hard requirement. Every external record has: source_url, source_type, retrieved_at, last_verified_at, verification_status.

Official data sources (primary):
- UGC University Directory
- AISHE Higher Education Institution Directory
- Jharkhand Government portals
- Official university websites
- Startup India (for industry)
- OpenStreetMap (for geocoding, respecting Nominatim usage policy)

---

# API Endpoint List

## Next.js API Routes (client/app/api/)

### Reports
- POST /api/reports (submit report)
- GET /api/reports (list, with filters)
- GET /api/reports/[id] (single report)
- PUT /api/reports/[id] (update)
- POST /api/reports/[id]/evidence (add evidence)
- GET /api/reports/[id]/relationships (fusion candidates)

### Systemic Problems
- GET /api/problems (list candidates and validated)
- GET /api/problems/[id] (single with DNA)
- POST /api/problems/[id]/validate (government action)
- PUT /api/problems/[id]/dna (update DNA)
- GET /api/problems/[id]/timeline (evolution data)

### Institutions
- GET /api/institutions (list, with geo filter)
- GET /api/institutions/[id] (single with capabilities)
- POST /api/institutions (admin: add)
- PUT /api/institutions/[id] (admin: update)
- GET /api/institutions/[id]/capabilities

### Capability Matching
- GET /api/capabilities/match?problemId=X (find matching institutions)
- GET /api/capabilities/assembly?problemId=X (combined coverage view)

### Challenges and Projects
- POST /api/challenges (publish challenge)
- GET /api/challenges (list)
- POST /api/challenges/[id]/proposals (submit proposal)
- POST /api/projects (create from approved proposal)
- PUT /api/projects/[id] (update status)
- POST /api/projects/[id]/milestones
- POST /api/projects/[id]/members

### Impact
- POST /api/impact/measurements (add measurement)
- POST /api/impact/verifications (verify impact)
- GET /api/impact/dashboard (aggregated impact data)

### Solutions
- GET /api/solutions (browse solution memory)
- GET /api/solutions/similar?problemId=X (find relevant past solutions)

### Admin
- GET /api/admin/users
- PUT /api/admin/users/[id]/role
- GET /api/admin/audit-logs
- POST /api/admin/data/refresh

### Auth
- POST /api/auth/verify (verify Firebase token, return user with role)

## FastAPI Routes (server/)

### Embeddings
- POST /api/v1/embeddings/generate (generate embedding for text)
- POST /api/v1/embeddings/batch (batch generate)

### Fusion
- POST /api/v1/fusion/analyze (run fusion pipeline for a report)
- POST /api/v1/fusion/reason (LLM reasoning for ambiguous cases)

### Matching
- POST /api/v1/matching/capabilities (decompose problem into capabilities)
- POST /api/v1/matching/score (score institution matches)

### RAG
- POST /api/v1/rag/query (RAG query with context retrieval)
- POST /api/v1/rag/summarize (structured summarization)

### Ingestion
- POST /api/v1/ingestion/institutions (ingest institution data)
- POST /api/v1/ingestion/geocode (geocode with caching)

### Health
- GET /api/v1/health

---

# Performance Rules

Use:
- React Server Components where possible (Next.js App Router)
- Streaming for long operations
- PostGIS spatial indexes (GIST) for geographic queries
- pgvector HNSW or IVFFlat indexes for vector search
- Database connection pooling (Neon serverless driver)
- TanStack Query for client side caching
- Image optimization via ImageKit
- Lazy loading for map components

Avoid:
- Unnecessary re-renders
- Unoptimized assets
- Blocking the main thread with heavy computations
- Calling the LLM for operations that SQL can handle
- Full table scans without indexes

---

# Security

- Firebase Authentication (token verification server side)
- Application level RBAC (role checked on every API route)
- Server side authorization (never trust client role claims)
- Input validation (Zod on Next.js, Pydantic on FastAPI)
- Rate limiting on API routes
- Audit logs for all consequential actions
- Secure media access (ImageKit signed URLs where needed)
- Environment variables for all credentials
- No API keys in frontend code
- No MistralAI / Firebase / Neon credentials exposed to clients
- CORS configured on FastAPI

---

# First Development Milestone

Do NOT build the entire platform immediately. Build this vertical slice first:

1. PostgreSQL setup on Neon (enable PostGIS, pgvector, uuid-ossp)
2. Drizzle schema for: users, districts, institutions, institution_capabilities, problem_reports, problem_embeddings, problem_relationships, systemic_problems
3. Seed 20 to 50 real Jharkhand institutions from UGC directory with verified sources
4. Seed capabilities from official department and lab pages
5. Seed 50 to 100 carefully designed synthetic problem reports (with intentional duplicates, related reports, same location but different topics, ambiguous cases)
6. Add coordinates for all institutions and reports
7. FastAPI embedding service (mistral-embed)
8. Generate embeddings for all seed reports
9. pgvector similarity retrieval
10. PostGIS geographic filtering
11. Problem Fusion confidence scoring (semantic + geo + temporal + domain)
12. Candidate systemic problem grouping
13. Government Validation screen in Next.js
14. Map view of reports and clusters

If this works end to end, the hardest conceptual part is proven. Then build Capability Assembly, then Project Lifecycle, then Impact Verification, then Solution Memory.

---

# Future Expansion and Scalability

- Multi state expansion beyond Jharkhand
- Dedicated vector index tuning as report volume grows
- Background job queue for embedding generation at scale
- WebSocket or SSE for real time notifications
- Mobile applications
- Public API for third party integrations
- Advanced analytics and trend prediction
- Automated data refresh from government APIs
