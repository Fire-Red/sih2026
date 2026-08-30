# Spec 0009: 4-Role MVP Scope Realignment & Industry Role Deprecation

## Summary & Requirements

This specification formalizes the core 4-role MVP ecosystem for the platform, focusing development directly on the central intelligence pipeline and completely removing the Industry participant role from the active prototype.

### Active 4-Role MVP Ecosystem:
1. **Citizen**: Submits community problem reports with geolocation, category, severity, and media evidence. Tracks report lifecycles.
2. **Government (Unified Single Officer)**: Handles the full government-side decision loop—reviews fused candidate systemic problem clusters, creates/edits Problem DNA profiles, approves challenges, and monitors project milestones.
3. **University / Lab**: Institutional capability provider. Explores validated challenges matching academic departments, labs, and research areas. Forms and mentors student teams.
4. **Student**: University-affiliated problem solver. Discovers matched challenges, joins university teams, submits approach proposals, and executes project milestones.

### Deprecated from MVP (Future Extension Only):
- **Industry / Startup / MSME / CSR**: Completely removed from onboarding choices, role routing, dashboards, and capability matching algorithms. Marked as a future roadmap extension in documentation.

---

## Acceptance Criteria

1. **Role Matrix & Navigation**:
   - `UserRole` union simplified across frontend and backend: `'citizen' | 'government' | 'institution' | 'student' | 'admin'`.
   - Onboarding wizard step 1 presents exactly 4 active roles (Citizen, Student, Government Officer, University/Institution). Industry is removed.
   - Dynamic dashboard router in `client/app/(dashboard)/dashboard/page.tsx` renders exclusively Citizen, Government, University, or Student views.
2. **Core 6-Stage Intelligence Flow**:
   - **Stage 1 (Report)**: Citizen submits local problem via `/report`.
   - **Stage 2 (Fusion)**: System evaluates multi-signal relations (Mistral pgvector embeddings + PostGIS geographic proximity + temporal gap + category match) to surface candidate systemic problem clusters.
   - **Stage 3 (Validation & DNA)**: Unified Government Officer reviews candidate clusters in `/government/manage`, creates/edits Problem DNA with required capability decomposition, and publishes the challenge.
   - **Stage 4 (Capability Assembly)**: System performs deterministic capability scoring against real/demo universities.
   - **Stage 5 (Team Formation & Pitch)**: University faculty and students review the challenge in `/problems`, assemble a team, and submit a pitch (1-paragraph approach + video walkthrough + slide deck).
   - **Stage 6 (Project Execution)**: Government Officer selects the winning team, auto-generating the active project workspace at `/projects/[id]` for milestone tracking.
3. **Design System & UI Integrity**:
   - Strict `Expo Notion Minimal` (canvas `#fbfaf7`, card surface `#ffffff`, single action indigo `#4630eb`, hairline `#e6e3dd` borders).
   - No emojis; only Lucide icons.
   - Accessible Shadcn UI primitives with semantic Tailwind v4 utility tokens.

---

## Step 1: Global Setup & Type Definitions

### 1. Updated Shared Auth & Role Types (`client/types/auth.ts`)
```typescript
export type UserRole = "citizen" | "government" | "institution" | "student" | "admin";

export interface GeoContext {
  state: string;
  district: string;
  pinCode: string;
  latitude: string | null;
  longitude: string | null;
  formattedAddress?: string;
}

export interface UserProfile {
  id?: string;
  firebaseUid: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  avatarUrl?: string | null;
  phone?: string | null;
  isOnboarded: boolean;
  geoContext: GeoContext;
  roleProfile?: GovernmentProfileData | StudentProfileData | InstitutionProfileData | null;
}
```

---

## UI Component Structure & Changes

### 1. Onboarding Wizard (`client/app/(auth)/onboarding/page.tsx`)
- Remove `industry` from the `ROLES` array.
- Step 1 presents:
  - **Citizen** (`UserRound`): Report local issues and track outcomes.
  - **Student** (`GraduationCap`): Join university teams and build solutions for real challenges.
  - **Government Officer** (`Landmark`): Review reports, validate systemic problems, and publish challenges.
  - **University / Lab** (`Building2`): Showcase department capabilities and mentor student teams.

### 2. Dashboard Router (`client/app/(dashboard)/dashboard/page.tsx`)
- Remove `IndustryDashboardView` and its imports.
- Direct users cleanly based on the 4 roles:
  - `citizen` -> `CitizenDashboardView`
  - `government` -> `GovernmentDashboardView`
  - `institution` -> `InstitutionDashboardView`
  - `student` -> `StudentDashboardView`

### 3. Capability Matching & Discovery
- Match required capability vectors strictly against `institution_capabilities` and `institution_departments`.

---

## Build Plan

### Phase 1: Type Cleanliness & Deprecation
1. Remove `IndustryProfileData` and `'industry'` references from active onboarding selections in `client/app/(auth)/onboarding/page.tsx`.
2. Delete or retire `industry-dashboard-view.tsx` and prune industry role switches from `client/app/(dashboard)/dashboard/page.tsx`.
3. Update `client/types/auth.ts` to solidify the 4 primary MVP roles.

### Phase 2: Core Workflow Verification
1. Verify Citizen intake at `/report` and listing at `/track`.
2. Verify Government unified console at `/government/manage` for Problem DNA validation and winner selection.
3. Verify Student & University team creation and pitch submission from `/problems`.
4. Verify Milestone workspace at `/projects/[id]`.

### Phase 3: Compilation & Type Check
1. Run Next.js production build (`npm run build`) to ensure zero broken imports or invalid role references.

---

## Definition of Done
- Onboarding presents only Citizen, Government, University, and Student.
- No active UI, route, or matching logic references the Industry role.
- Complete 6-stage lifecycle runs seamlessly from Citizen report -> Problem Fusion -> Government DNA validation -> University/Student matching -> Project workspace.
- Compiler-grade TypeScript and Next.js production build pass cleanly with exit code 0.
