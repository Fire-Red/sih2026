# Spec 0010: Unified Government Officer Workspace & Decision Console

## 1. Summary & Requirements

This specification defines the complete end-to-end user experience and backend orchestration for the single **Government Officer** persona in the 4-role MVP.

The Government Officer acts as the primary validation authority:
1. **Intake Triage**: Inspects all incoming community problem reports with status tags (`submitted`, `under_review`, `validated`, `rejected`).
2. **Evidence Inspection**: Views high-resolution uploaded images (ImageKit) and attached documents/PDFs directly with an accessible lightbox modal.
3. **AI Similar Reports Assistance**: When evaluating a report, queries the database for matching issues using text similarity and geographic distance (e.g., *"3 similar reports found within 4.2 km"*), with the option to merge them.
4. **Publish Problem Statements**: Converts an accepted report (or a group of merged reports) into an official open challenge with required skills, quotas (e.g., max 3 teams), and grant/timeline details.
5. **Pitch Evaluation & Winner Selection**: Reviews student team submissions (1-paragraph approach, 3-minute video walkthrough, PPT/PDF slide deck, mentor info), and selects the winning team to automatically initialize an active project workspace with a 4-phase milestone tracker.

---

## 2. Design System Adherence (Expo Notion Minimal)

- **Canvas & Card Surfaces**: Warm paper canvas (`bg-background` / `#fbfaf7`), crisp white card tiles (`bg-card` / `#ffffff`), hairline neutral borders (`border-border` / `#e6e3dd`).
- **Interactive Action Color**: Single interactive color `#4630EB` (`bg-primary`, `text-primary`, `hover:bg-primary-hover`).
- **Typography & Telemetry**:
  - Headlines: Inter medium (`font-medium tracking-tight text-foreground`).
  - Metadata: Compact JetBrains Mono pills (`font-mono text-xs uppercase`).
- **Zero Jargon**: Plain, neutral, editorial terms only (e.g., "Related community reports", "Problem statement", "Submitted pitches", "Evidence attachments"). No buzzwords like "Problem Fusion" or "DNA".
- **Zero Emojis**: 100% Lucide React icons (`FileText`, `Image`, `MapPin`, `CheckCircle2`, `XCircle`, `ArrowRight`, `Sparkles`, `Layers`, `ShieldCheck`).
- **Component Atoms**: Reuse strict shadcn primitives (`@/components/ui/button`, `@/components/ui/dialog`, `@/components/ui/card`, `@/components/ui/badge`, `@/components/ui/input`, `@/components/ui/tabs`).

---

## 3. Data & API Architecture

### 3.1 Backend Endpoints (`client/app/api/government/`)

1. `GET /api/government/reviews`:
   - Returns all citizen-submitted reports along with their evidence attachments (`problem_evidence`), applicant counts, and review statuses.
   - Query filters: `status`, `category`, `district`.

2. `PATCH /api/government/status`:
   - Updates report status (`validated`, `under_review`, `rejected`).
   - Inserts audit entry in review history.

3. `POST /api/government/similar`:
   - Calls the AI backend embedding and vector distance service to retrieve nearby and semantically similar problem reports.
   - Payload: `{ reportId: string, text: string, category?: string, latitude?: string, longitude?: string }`.
   - Returns: List of matching reports with similarity score and distance in kilometers.

4. `POST /api/government/publish`:
   - Creates/publishes an official problem statement from one or more reports.
   - Sets `maxTeamsAllowed` (default: 3), `sponsoringDepartment`, `grantAmount`, and required skill tags.
   - Marks merged source reports as `validated`.

5. `POST /api/government/reviews/[problemId]/select`:
   - Transactionally updates selected application to `selected_winner`, rejects competing proposals, updates problem record with `selectedTeamId`, and creates the `active_projects` entry with default milestone schema.

### 3.2 AI Backend Service (`server/app/`)

- `POST /api/v1/fusion/find-related`:
  - Uses `mistral-embed` 1024-dimension vector similarity against `problem_embeddings` table.
  - Computes spatial distance using PostGIS / Haversine distance formula if coordinates are present.
  - Generates a plain-language summary of why these reports are related.

---

## 4. Component Structure (`client/components/government/`)

```text
components/government/
├── government-dashboard-view.tsx       # Executive summary & quick triage stats
├── government-review-console.tsx       # Unified master triage and review console
├── report-queue-list.tsx               # Filterable list of incoming reports & status pills
├── report-detail-pane.tsx              # Deep-dive view of active report with metadata & map
├── report-evidence-gallery.tsx         # Image thumbnail grid & lightbox modal previewer
├── ai-similar-reports-card.tsx         # List of matching nearby reports with merge CTA
├── problem-statement-publisher.tsx     # Modal form to configure and publish challenge
├── application-pitch-matrix.tsx        # Side-by-side pitch cards (Video + PPT + Team)
└── winner-selection-dialog.tsx         # Accessible confirmation modal with review notes
```

---

## 5. Acceptance Criteria

1. **Intake Queue**: Government officer can view all submitted community reports, filter by category or district, and change their review status.
2. **Evidence Inspection**: Every image uploaded via ImageKit renders cleanly in an evidence gallery with a full-size modal lightbox; document attachments open securely in a new tab.
3. **AI Similarity**: When selecting a report, the "Related community reports" panel displays similar reports with similarity score and distance in km without blocking the UI.
4. **Publish Flow**: Officer can configure and publish a Problem Statement with custom title, required skills, and team quotas.
5. **Pitch Evaluation**: Officer can play/open student video pitches, view presentation decks, review team members, and select a winner with recorded notes.
6. **Project Workspace Handoff**: Selecting a winning team automatically generates the active project workspace and displays a direct navigation link to `/projects/[id]`.
7. **Type Safety & Linting**: 100% strict TypeScript (no `any`), valid semantic Tailwind v4 tokens, zero console warnings.

---

## 6. Build Plan

1. **Step 1**: Add FastAPI endpoint `/api/v1/fusion/find-related` for text similarity + geo distance lookup.
2. **Step 2**: Add Next.js API route handlers in `client/app/api/government/` (`reviews`, `status`, `similar`, `publish`, `reviews/[problemId]/select`).
3. **Step 3**: Implement the `report-evidence-gallery.tsx` and `ai-similar-reports-card.tsx` components.
4. **Step 4**: Implement the `application-pitch-matrix.tsx` with video embed and PPT preview buttons.
5. **Step 5**: Update and integrate the unified `government-review-console.tsx` and `government-dashboard-view.tsx`.
6. **Step 6**: Verify TypeScript compilation, responsive layouts, and end-to-end winner selection workflow.
