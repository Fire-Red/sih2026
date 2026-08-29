# Spec 0008: Unified Government Officer Operational Workflow (Prototype Engine)

## Summary & Requirements

For the platform prototype and demonstration, the government-side operations are consolidated under a **Single Unified Government Decision Officer / Administrator account** (`role: 'government'`). Rather than maintaining artificial department hierarchies and multiple synthetic officer logins, all incoming citizen reports, fused candidate systemic problems, problem DNA generation, challenge publishing, pitch review, team selection, and pilot oversight will route seamlessly through this single government officer persona.

Separate user accounts remain fully supported for demonstrating external stakeholders (Citizens, University Faculty / Labs, Student Teams, and Industry Partners).

### Core Acceptance Criteria
1. **Unified Government Operations Profile**:
   - Seed and support one primary Government Decision Officer profile with full jurisdiction across districts and domains.
   - Any unassigned candidate systemic problems, problem reports, challenges, and pitch reviews automatically resolve to this officer's dashboard and review queues.
2. **End-to-End Linear Lifecycle Pipeline**:
   - **Step 1: Problem Intake & Fusion Review**: View normalized citizen reports and fused candidate systemic problem clusters.
   - **Step 2: Problem DNA Validation & Capability Decomposition**: Inspect symptoms, causes, required capability tags, and approve Problem DNA into an official Challenge.
   - **Step 3: Multi-Team Pitch Review & Winner Selection**: Review student/institution pitches side-by-side (1-paragraph approach, video walkthrough, slide deck) and execute one-click winning team selection with transactional state locking.
   - **Step 4: Active Project & Pilot Milestone Oversight**: Monitor milestone progression, review baseline vs. intervention evidence, and verify pilot outcomes.
3. **Strict Visual & Design System Adherence**:
   - Compliant with `Expo Notion Minimal` (warm paper canvas `#fbfaf7`, card surface `#ffffff`, single action indigo `#4630eb`, hairline `#e6e3dd` borders).
   - Pure Lucide React iconography (no emojis).
   - Fully accessible Shadcn primitives (`@/components/ui/`) with semantic tokens (`bg-background`, `text-foreground`, `border-border`).

---

## Architecture & Data Flow

```
[ Citizen Report Intake ]
            ↓
[ Multi-Signal Problem Fusion (Semantic + Geo + Temporal) ]
            ↓
[ Unified Government Decision Console (`/government/manage`) ]
            ↓
  - Review Candidate Systemic Problems
  - Generate & Edit Problem DNA
  - Approve & Publish Official Challenge
            ↓
[ Public Problem / Challenge Directory (`/problems`) ]
            ↓
[ Student Teams & Universities Submit Pitches ]
            ↓
[ Unified Government Officer Reviews Pitches & Selects Winner ]
            ↓
[ Active Project Workspace Created (`/projects/[id]`) ]
            ↓
[ Pilot Execution, Milestone Tracking & Impact Verification ]
```

---

## Step 1: Global Setup & Shared Type Contracts

### Shared State & Type Definitions (`packages/shared/src/types/government.ts`)
```typescript
import { z } from 'zod';

export const GovernmentActionSchema = z.enum([
  'validate_dna',
  'publish_challenge',
  'select_winning_team',
  'approve_milestone',
  'verify_impact'
]);

export interface UnifiedGovernmentOfficer {
  id: string;
  email: string;
  displayName: string;
  department: string;
  role: 'government';
  jurisdiction: 'statewide';
}

export interface CandidateProblemCluster {
  id: string;
  title: string;
  domain: string;
  reportCount: number;
  confidenceScore: number;
  semanticSimilarity: number;
  geographicSpreadKm: number;
  requiredCapabilities: string[];
  status: 'candidate' | 'validated' | 'challenged' | 'in_progress';
}
```

---

## UI Component Structure

### 1. Unified Government Review Console (`client/components/government/unified-decision-console.tsx`)
- **Queue Overview**: Clean high-density table of all pending items categorized by stage (`Pending DNA Validation`, `Active Pitch Review`, `Active Project Oversight`).
- **Interactive Problem DNA Review Drawer**: Displays symptoms, causes, PostGIS centroid, and AI-decomposed required capabilities with one-click "Publish Challenge" action.
- **Side-by-Side Pitch Inspector**: Embedded video walkthrough player, PPT slide deck link, team roster, and direct "Select Winning Team" CTA.

### 2. Streamlined Navigation Integration
- Updates `/dashboard` and `/government/manage` to provide instant direct access to the entire pipeline without department switching barriers.

---

## Build Plan

### Phase 1: Database & Seed Adjustments
1. Verify default government user seeding script in `client/lib/db/seed.ts` or `server/scripts/seed_demo_accounts.py` creates a default officer `officer@civicpulse.gov` with global review capabilities.
2. Ensure API routes (`/api/problems`, `/api/applications`, `/api/projects`) default to assigning and resolving actions to the active government officer session.

### Phase 2: Consolidated Review APIs & Services
1. Implement `GET /api/government/pipeline`: Returns aggregated counts and items for all 4 stages of the decision lifecycle in a single payload.
2. Implement `POST /api/government/validate-dna`: Atomically validates a candidate problem, writes `problem_dna`, and publishes a `challenge`.

### Phase 3: Frontend Console Implementation
1. Construct `UnifiedDecisionConsole` in `client/components/government/` using Shadcn Tabs, Dialogs, and Cards.
2. Connect to the existing `/government/manage` route.
3. Validate loading, empty, and optimistic update states with TanStack Query.

---

## Verification & Definition of Done
- Government reviewer can log in using `officer@civicpulse.gov` and see the complete queue of submitted reports, candidate clusters, team applications, and active projects.
- Validating a problem automatically makes it available in the public `/problems` directory.
- Reviewing pitches and clicking `Select Winning Team` atomically generates the project workspace at `/projects/[id]`.
- Compiler-grade TypeScript check passes (`npm run check-types` / `tsc --noEmit`).
- Production build succeeds without errors.
