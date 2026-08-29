# Spec 0007: Comprehensive Multi-Role Role-Based Architecture & Dashboard Matrix

**Status**: Ready for Implementation  
**Date**: 2026-08-29  
**Scope**: Cross-Role Platform Architecture (`/dashboard`, `/citizen/*`, `/student/*`, `/institution/*`, `/government/*`, `/industry/*`, `/reports/new`, `/problems`, `/projects/[id]`)

---

## 1. Executive Summary & Vision

The Societal Problem Intelligence and Collaboration Platform transforms scattered community challenges into validated systemic problems, decomposes capability requirements, connects multidisciplinary teams (students, HEIs, labs, industry), and coordinates end-to-end execution through verified field deployment.

This specification outlines the **Complete Multi-Role Architecture and Action Engine**, establishing distinct onboarding pipelines, role-specific action surfaces, Leaflet-based interactive geolocation map tools, student application/pitch review mechanics, institution lab and research capability tracking, and AI-grounded assistance (FastAPI RAG + Mistral Agent).

All user-facing surfaces strictly adhere to the **Expo Notion Minimal** design system: `#fbfaf7` canvas, `#ffffff` quiet cards, hairline `#e6e3dd` dividers, a single `#4630eb` interactive color, clean semantic tokens, and no marketing fluff, emojis, or fabricated metrics.

---

## 2. Role-Based Capabilities & Action Matrix

| Role | Primary Purpose | Key Dashboard Surfaces | Core Actions & Workflows |
| :--- | :--- | :--- | :--- |
| **Citizen / Community** | Report real-world civic problems, provide multimedia evidence, track resolution progress, and endorse/support local issues. | • `/dashboard` (Citizen view)<br>• `/reports/new`<br>• `/reports/track`<br>• `/problems` (Public directory) | 1. **Submit Problem**: 4-step wizard with interactive Leaflet map pin-drop, district selector, category, and ImageKit evidence upload.<br>2. **Track Reports**: Live milestone tracker for submitted issues.<br>3. **Community Endorsement**: Upvote/support nearby problems to increase civic signal. |
| **Student / Researcher** | Discover validated problem statements, form interdisciplinary teams, submit pitches (deck, video, repo), and execute awarded projects. | • `/dashboard` (Student view)<br>• `/problems` (Challenge directory)<br>• `/student/teams`<br>• `/student/applications`<br>• `/projects/[id]` (Workspace) | 1. **Browse Challenges**: Filter problems by category, severity, and remaining team quota (e.g. max 3 teams).<br>2. **Team Formation**: Create and manage teams with roster and faculty mentor.<br>3. **Pitch Submission**: Submit 1-paragraph summary, 3-min video URL, PPT deck URL, and repository link.<br>4. **Project Execution**: Track 4-phase milestone deliverables (Prototype, Pilot, Deployment, Impact). |
| **Institution / University / Lab** | Register institutional research labs, facilities, and academic capabilities; track affiliated student teams and applications. | • `/dashboard` (Institution view)<br>• `/institution/capabilities`<br>• `/institution/teams`<br>• `/institution/labs` | 1. **Capability Profiling**: Register specialized labs, department strengths, and equipment with provenance links.<br>2. **Student Team Oversight**: Monitor campus student applications and mentor assignments.<br>3. **Institutional Collaboration**: Pair institutional infrastructure with cross-college problem statements. |
| **Government Official** | Review candidate systemic problems, validate Problem DNA profiles, review student pitches side-by-side, award projects, and monitor field impact. | • `/dashboard` (Gov view)<br>• `/government/validate` (Fusion)<br>• `/government/manage` (Pitches)<br>• `/government/radar` (Analytics)<br>• `/projects/[id]` (Oversight) | 1. **Problem Fusion & Validation**: Review clustered reports, approve Problem DNA, set team quotas & grants.<br>2. **Pitch Review Console**: Compare candidate team videos, slide decks, and summaries side-by-side; atomically award the winning team.<br>3. **Project & Impact Oversight**: Approve milestone submissions and verify pilot results.<br>4. **AI Assistant Integration**: Query FastAPI RAG (`/api/v1/rag/ask`) for historical solution memory. |
| **Industry / Partner / MSME** | Provide CSR grants, technical deployment expertise, pilot hardware/sensors, and commercialization scaling. | • `/dashboard` (Industry view)<br>• `/industry/challenges`<br>• `/industry/partnerships` | 1. **Sponsor Challenges**: Provide grant funding or CSR sponsorship to active problem statements.<br>2. **Technology Partnership**: Offer proprietary IoT hardware, data APIs, or deployment testing grounds.<br>3. **Track Joint Pilots**: Review verification metrics and field trial telemetry. |

---

## 3. Detailed Workflow Specifications

### 3.1. Interactive Map Pin-Drop & Geospatial Integration
- **Component**: `@/components/maps/location-picker-map.tsx` & `@/components/maps/problem-radar-map.tsx`
- **Engine**: Leaflet via `react-leaflet` with OpenStreetMap / CartoDB Positron neutral tiles.
- **Workflow**:
  1. Citizen or researcher clicks on the interactive map surface.
  2. Map fires coordinate event: extracts `latitude` and `longitude` (6 decimal places).
  3. Reverse geocodes using cached Nominatim service to suggest district, block, and formatted address.
  4. User can drag pin marker to refine location or manually enter district fallback.
  5. Coordinates are formatted and validated via Zod (`z.string().regex(/^-?\d+(\.\d+)?$/)`).

### 3.2. Role-Aware Onboarding Pipeline
- **Route**: `/onboarding`
- **Dynamic Steps based on selected role**:
  - **Step 1 (All)**: Basic identity confirmation (display name, phone, state, district, pin code).
  - **Step 2 (Role-Specific)**:
    - *Citizen*: Community interests, local ward/block, preferred alert categories.
    - *Student*: Institution name, AISHE code (optional/directory lookup), department, year of study, skills/interests tags, portfolio URL.
    - *Institution*: Institution name, AISHE code, institution type (University, Autonomous College, Lab/Centre), accredited departments, official website.
    - *Government*: Department (e.g. Rural Water Supply, Road Infrastructure), designation, official jurisdiction, employee ID.
    - *Industry*: Organization name, sector, CSR focus areas, website, contact designation.
  - **Step 3 (All)**: Final review and workspace initialization. Sets `users.is_onboarded = true` and updates role profile atomically in database.

### 3.3. Student Team Pitch & Video/PPT Intake Flow
- **Submission Drawer / Modal**: `@/components/problems/pitch-submission-dialog.tsx`
- **Validation**:
  - `teamId`: Must be an active team where `leaderId == currentUser.id` or user is a member.
  - `pitchSummary`: Text (100 to 2000 characters).
  - `videoUrl`: Valid video link (YouTube, Loom, Google Drive, ImageKit) with preview player.
  - `pptUrl`: Valid document link (Google Slides, PDF, PPTX, ImageKit).
  - `repoUrl`: Optional GitHub / GitLab link.
- **Quota Guard**: Enforces `appliedTeamsCount < maxTeamsAllowed` using transactional DB lock (`where(eq(problemReports.id, problemId))`).

### 3.4. Government Review & One-Click Winner Selection
- **Workspace**: `/government/manage` (Refer to Spec 0006 for full transactional details).
- **Behavior**:
  - Side-by-side pitch comparison matrix.
  - Inline video playback and slide deck viewer.
  - One-click "Award Winning Team" triggers atomic database transaction:
    1. Sets `problem_reports.selected_team_id = teamId`.
    2. Sets winning `problem_applications.status = 'selected_winner'`.
    3. Sets competing `problem_applications.status = 'rejected'`.
    4. Creates `active_projects` row with 4 default milestones.
    5. Writes entry to `government_review_events`.

### 3.5. AI Assistant & RAG Integration
- **Widget**: Floating & contextual side-drawer `@/components/ai/civic-agent-drawer.tsx`.
- **Backend Service**: Communicates with `/api/v1/rag/ask` and `/api/v1/agent/chat` on the FastAPI backend.
- **Capabilities**:
  - Citizen: "Help me summarize my civic issue into clear technical terms."
  - Student: "What capabilities or previous verified solutions in Solution Memory match this problem?"
  - Government: "Summarize the key differences between Team Alpha's and Team Beta's proposals."
- **Strict Guardrail**: All AI responses include source grounding citations and explicit disclaimer badges: `AI-Assisted Draft • Requires Human Review`.

---

## 4. API & Routing Architecture

### Client App Router Hierarchy (`client/app/`)
```
app/
├── (auth)/
│   ├── login/
│   └── register/
├── (citizen)/
│   ├── dashboard/page.tsx       # Dynamic role switcher / citizen dashboard
│   ├── reports/
│   │   ├── new/page.tsx         # 4-Step intake wizard with interactive map
│   │   └── track/page.tsx       # Citizen's submitted reports tracker
├── (student)/
│   ├── student/teams/page.tsx   # Team creation and roster management
│   └── student/applications/page.tsx # Submitted pitches and live status
├── (institution)/
│   ├── institution/capabilities/page.tsx # Lab & faculty capability directory
│   └── institution/teams/page.tsx        # Affiliated student teams tracker
├── (government)/
│   ├── government/validate/page.tsx      # Problem fusion & DNA validation
│   ├── government/manage/page.tsx        # Pitch review & winner selection
│   └── government/radar/page.tsx         # Executive geospatial heatmaps
├── (industry)/
│   └── industry/challenges/page.tsx      # CSR sponsorship & partnership portal
├── problems/
│   ├── page.tsx                          # Public problem exploration directory
│   └── [id]/page.tsx                     # Problem details & pitch submission CTA
├── projects/
│   └── [id]/page.tsx                     # 4-Phase active project execution workspace
├── onboarding/page.tsx                   # Unified multi-step role onboarding
└── profile/page.tsx                      # Profile and district settings
```

### API Endpoint Additions
1. `GET /api/dashboard/[role]` -> Role-specific dashboard metrics and activity feed.
2. `GET /api/reports/nearby?lat=...&lng=...&radius=10` -> Nearby civic issues for map discovery and endorsement.
3. `POST /api/reports/[id]/endorse` -> Citizen community endorsement increment.
4. `GET /api/institutions/capabilities` & `POST /api/institutions/capabilities` -> HEI lab & faculty capability registration.
5. `GET /api/institutions/affiliates` -> All student teams associated with the logged-in institution's AISHE code / name.

---

## 5. UI Tokens & Styling Guidelines

- **Background Canvas**: `bg-background` (`#fbfaf7`)
- **Card Surfaces**: `bg-card` (`#ffffff`), `border border-border` (`#e6e3dd`), quiet rounded geometry `rounded-lg` (`0.875rem`).
- **Interactive Color**: `bg-primary` (`#4630eb`), `text-primary-foreground` (`#ffffff`), `hover:bg-primary-hover` (`#3924c7`).
- **Status Indicators**:
  - `Submitted / Pending`: `border-amber-200 bg-amber-50/50 text-amber-800 dark:border-amber-800`
  - `Validated / Selected / Active`: `border-emerald-200 bg-emerald-50/50 text-emerald-800`
  - `Critical / Rejected`: `border-rose-200 bg-rose-50/50 text-rose-800`
- **Typography**:
  - Headers: Inter, Medium (500), tracking `-0.045em`.
  - Body: Inter, Regular (400), leading `1.55`.
  - Data / Telemetry / Badges: JetBrains Mono (`font-mono text-xs uppercase`).
- **Strict Negative Constraints**:
  - No generic stock illustrations or emojis. Use Lucide icons exclusively.
  - No arbitrary inline style colors (e.g. no `bg-[#fbfaf7]`); use Tailwind semantic tokens.

---

## 6. Implementation & Build Plan

### Phase 1: Interactive Geospatial Map Component
- Create `@/components/maps/interactive-location-picker.tsx` using `react-leaflet`.
- Integrate coordinate selection and reverse-geocoded district auto-population into `ReportWizardStep2`.
- Add unit and interaction tests for pin movement and coordinate binding.

### Phase 2: Role-Based Dashboard Hub & Shell Routing
- Refactor `/app/dashboard/page.tsx` into a modular router that loads the authenticated user's dedicated dashboard component:
  - `CitizenDashboardView`
  - `StudentDashboardView`
  - `InstitutionDashboardView`
  - `GovernmentDashboardView`
  - `IndustryDashboardView`
- Ensure each dashboard presents authentic database records and zero fabricated metrics.

### Phase 3: Student Pitch Intake & Team Management
- Build `/student/teams/page.tsx` for creating/editing student teams and inviting members.
- Implement `@/components/problems/pitch-submission-dialog.tsx` on the problem details page.
- Connect pitch submission to transactional `/api/applications` route.

### Phase 4: Institution Capability & Student Tracking
- Build `/institution/capabilities/page.tsx` to register departmental labs and research capabilities.
- Build `/institution/teams/page.tsx` to view all student teams registered under the university's domain or AISHE code.

### Phase 5: Government Console & AI Grounding Assistant
- Build `/government/manage/page.tsx` with side-by-side pitch review and one-click atomic winner awarding.
- Embed `@/components/ai/civic-agent-drawer.tsx` connecting directly to FastAPI `/api/v1/rag/ask`.

---

## 7. Verification & Definition of Done
- [ ] TypeScript passes with zero errors and no `any` casts (`pnpm build` / `pnpm typecheck`).
- [ ] Responsive UI verified on mobile (375px) and desktop (1440px).
- [ ] Every database transaction (pitch submission, winner selection, endorsement) is atomic.
- [ ] Public copy conforms strictly to the Location Neutrality Rule.
- [ ] `progress.md` updated with completed deliverable milestones.
