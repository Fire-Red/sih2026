# CivicPulse Implementation Plan: Stripe Minimalist Edition

## 1. Executive Summary & Design Vision
CivicPulse connects citizen problem reporting directly to university student teams, government validation, and CSR pilot deployments. 
The platform adopts the **Stripe design language**:
- **Gradient Mesh Hero Backdrop**: Upper third horizontal wash of pastel cream (`#f5e9d4`), sherbet orange, lavender, electric indigo (`#533afd`), and ruby pink (`#ea2261`).
- **Surfaces & Hairlines**: Pure white canvas (`#ffffff`), cool off-white feature bands (`#f6f9fc`), warm cream cards (`#f5e9d4`), and crisp 1px borders (`#e3e8ee`).
- **Single Indigo CTA**: `#533afd` is strictly reserved for primary pill action buttons (`rounded-full`, 8px 16px padding).
- **Deep Navy Text**: `#0d253d` universal body color and dark console mockups (`#1c1e54`).
- **Editorial Typography**: Inter/Sohne at weight 300 with negative tracking (`-1.4px` on display sizes) and `tnum` tabular numerics.
- **Zero Confusion / Zero Buzzwords**: Clean, natural language (*"Explore Problems"*, *"Apply with Team"*, *"Submit Video Pitch"*, *"Select Winning Team"*).

---

## 2. End-to-End Product Lifecycle

```
[ Citizen Signal + Field Photos ]
              ↓
[ Government Reviews & Polishes Problem + Sets Max Team Quota (e.g. 3) ]
              ↓
[ Published to College Problem Directory (`/problems`) ]
              ↓
[ Student Teams Apply: 1-Para Approach + Video Walkthrough + PPT Pitch Deck ]
              ↓
[ Govt / Faculty Reviews Video & PPT Side-by-Side → Clicks [Select Winning Team] ]
              ↓
[ Auto-Creates Active Project Workspace (`/projects/[id]`): Milestones & Pilot Deployment ]
```

---

## 3. Architecture & Deliverable Phases

### Phase 1: Design System & Styling (Stripe Tokens)
- [x] Update [`.istm-context/design.md`](file:///workspaces/web/.istm-context/design.md) with complete Stripe design specification.
- [x] Update [`client/app/globals.css`](file:///workspaces/web/client/app/globals.css) with semantic Tailwind v4 tokens (Indigo `#533afd`, Deep Navy `#0d253d`, Hairlines `#e3e8ee`, Mesh gradient utilities).
- [ ] Implement reusable gradient mesh hero backdrop component.

### Phase 2: Database Schema & Backend APIs
- [ ] Update Drizzle Schema in [`client/lib/db/schema.ts`](file:///workspaces/web/client/lib/db/schema.ts):
  - Extend `problem_reports`: `maxTeamsAllowed`, `appliedTeamsCount`, `sponsoringDepartment`, `grantAmount`, `selectedTeamId`.
  - Create `student_teams`: `id`, `teamName`, `leaderId`, `institutionName`, `members`, `facultyMentorName`.
  - Create `problem_applications`: `id`, `problemId`, `teamId`, `pitchSummary`, `pptUrl`, `videoUrl`, `repoUrl`, `status`.
  - Create `active_projects`: `id`, `problemId`, `teamId`, `status`, `milestones`.
- [ ] Push migration to live Neon PostgreSQL via `drizzle-kit push`.
- [ ] Create API Route Handlers (`/api/problems`, `/api/teams`, `/api/applications`, `/api/projects`).

### Phase 3: Zero-Confusion Frontend Screens
- [ ] **Marketing Landing Page (`/`)**: Refactor with Stripe gradient mesh hero, 3-step clean process, problem preview cards, and single-indigo CTA.
- [ ] **All Problem Statements Directory (`/problems`)**: Clean search, domain filter chips (Water, Farming, Roads, Health, Energy), slot indicator (`1 of 3 Teams Applied`), and slide-over application drawer (Pitch + Video + PPT).
- [ ] **Government Review & Winner Selection Console (`/government/manage`)**: Side-by-side pitch review with embedded video player, PPT links, and one-click `Select Winning Team` action.
- [ ] **Active Project & Milestone Workspace (`/projects/[id]`)**: Focused single-tab workspace for the selected team to track milestones and submit pilot verification photos.
- [ ] **Zero-Friction Onboarding Modal (`/onboarding`)**: Simplified 1-step role selection and college/district autocomplete.
