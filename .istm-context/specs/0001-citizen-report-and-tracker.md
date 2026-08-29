# Feature Spec: 0001 - Citizen Problem Report Intake & Live Tracking Dashboard

## Summary & Requirements

The **Citizen Problem Report Intake (`/report`)** and **Citizen Live Tracking Dashboard (`/track` or integrated citizen dashboard)** allow any citizen or local community member across Jharkhand to report local societal challenges (water quality, agricultural distress, road/infra, healthcare, rural power, etc.) with precise geolocation, multimedia evidence, and structured categorical context.

Once submitted, citizens can track the end-to-end lifecycle of their report through a live transparent milestone view:
`Submitted` → `AI Clustered & Triaged` → `Validated by Govt` → `Assigned to University (BIT Mesra / BAU / etc.)` → `Student Team Prototyping` → `Resolved / Deployed`.

### Core Acceptance Criteria
1. **Multi-Step Intuitive Wizard (`/report`)**:
   - **Step 1: Problem Details**: Title, category/domain selector (Water & Sanitation, Agriculture, Rural Infrastructure, Healthcare, Education, Environment, Energy, Livelihoods), subcategory, description, and severity assessment (Low, Medium, High, Critical) with estimated population affected.
   - **Step 2: Geolocation & Administrative Area**: Instant browser GPS coordinate capture + auto reverse-geocoding (State, District e.g. Ranchi, Dhanbad, Gumla, Palamu, Block/Panchayat, PIN).
   - **Step 3: Evidence & Attachments**: Photo/document upload interface with preview, captioning, and client upload storage.
   - **Step 4: AI Pre-Classification & Review**: Live preview showing automated keyword extraction and domain auto-tagging before submission confirmation.
2. **Citizen Live Dashboard & Tracker (`/track` / `/dashboard`)**:
   - Status tracking card with visual timeline progression.
   - Real-time updates on which Higher Education Institution (HEI) or Student Team claimed the problem.
   - Upvoting / "I am also facing this issue" endorsement counter to increase problem priority.
   - Direct filterable list of user's past submitted reports and local district signals.
3. **Database & API Integration**:
   - PostgreSQL table schemas for `problem_reports`, `problem_evidence`, and `problem_endorsements`.
   - API endpoints:
     - `POST /api/reports`: Submit a new citizen report with evidence.
     - `GET /api/reports`: List citizen's reports or district reports.
     - `GET /api/reports/[id]`: Retrieve single report details with timeline and assigned HEI info.
     - `POST /api/reports/[id]/endorse`: Endorse a report ("Me too").

---

## Step 1: Global Setup (CSS & Layouts)

- Use existing semantic Tailwind v4 tokens defined in `client/app/globals.css`.
- Colors: Canvas `#ffffff`, Surface Soft `#f7f7f7`, Primary `#0052ff` (Coinbase Blue), Body `#5b616e`, Ink `#0a0b0d`.
- Typography: Inter with modest display weights and JetBrains Mono for telemetry/coordinates/IDs.
- Reusable UI primitives: Buttons (`rounded-full`), Inputs/Textareas (`rounded-xl`), Cards (`rounded-2xl` / `rounded-3xl`), Badges (`rounded-full`).

---

## Database Schema Additions (Drizzle ORM)

```typescript
// client/lib/db/schema.ts additions

export const reportCategoryEnum = pgEnum("report_category", [
  "water_sanitation",
  "agriculture_irrigation",
  "rural_infrastructure",
  "healthcare_nutrition",
  "education_skills",
  "environment_waste",
  "energy_power",
  "rural_livelihoods",
  "accessibility_public_services",
]);

export const reportSeverityEnum = pgEnum("report_severity", [
  "low",
  "medium",
  "high",
  "critical",
]);

export const reportStatusEnum = pgEnum("report_status", [
  "submitted",
  "under_review",
  "fused_clustered",
  "validated",
  "assigned_to_hei",
  "solution_in_progress",
  "resolved_deployed",
  "rejected",
]);

export const problemReports = pgTable("problem_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  reporterId: uuid("reporter_id").references(() => users.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: reportCategoryEnum("category").notNull(),
  subcategory: text("subcategory"),
  severity: reportSeverityEnum("severity").default("medium").notNull(),
  affectedPopulationEstimate: integer("affected_population_estimate").default(100),
  state: text("state").default("Jharkhand").notNull(),
  district: text("district").notNull(),
  blockOrPanchayat: text("block_or_panchayat"),
  pinCode: text("pin_code"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  formattedAddress: text("formatted_address"),
  status: reportStatusEnum("status").default("submitted").notNull(),
  endorsementCount: integer("endorsement_count").default(0).notNull(),
  assignedInstitutionName: text("assigned_institution_name"),
  assignedProjectTitle: text("assigned_project_title"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const problemEvidence = pgTable("problem_evidence", {
  id: uuid("id").defaultRandom().primaryKey(),
  problemReportId: uuid("problem_report_id")
    .references(() => problemReports.id, { onDelete: "cascade" })
    .notNull(),
  mediaType: text("media_type").notNull(), // 'image' | 'video' | 'document'
  mediaUrl: text("media_url").notNull(),
  caption: text("caption"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
```

---

## UI Components & Architecture

### 1. Wizard Component (`client/app/(citizen)/report/page.tsx` / `client/components/reports/`)
- `ReportWizardHeader`: Step progression indicator (1. Problem Context → 2. Location & Impact → 3. Evidence → 4. AI Verification & Submit).
- `StepProblemDetails`: Category grid with iconography, severity radio pills, title and description with char count.
- `StepLocationPicker`: GPS locator trigger button, Jharkhand district selector (24 districts pre-populated), auto-reverse geocoding summary.
- `StepEvidenceUpload`: Clean file dropzone with image preview and delete buttons.
- `StepReviewSubmission`: AI Analysis preview showing auto-detected category match confidence and submission summary.

### 2. Live Citizen Tracker Component (`client/app/(citizen)/track/page.tsx` / `client/components/reports/report-tracker.tsx`)
- `TrackerStatsSummary`: Active reports, under evaluation, assigned to universities, resolved.
- `ReportCard`: Visual card with status pill, district badge, endorsement counter ("+1 I'm affected"), and expandible lifecycle stepper:
  - Step 1: Citizen Submission
  - Step 2: AI Clustering
  - Step 3: District Validation
  - Step 4: HEI Research / Multidisciplinary Student Team
  - Step 5: Field Pilot & Verification
- `EmptyStateReports`: Informative empty state prompting the citizen to submit their first local challenge.

---

## Implementation Plan

1. **Step 1: DB Schema Migration & Push**:
   - Update `client/lib/db/schema.ts` with `problemReports`, `problemEvidence`, and corresponding enums.
   - Run `npx drizzle-kit push` to sync table schema with Neon PostgreSQL.
2. **Step 2: Server API Endpoints**:
   - Implement `client/app/api/reports/route.ts` (POST for report creation, GET for list queries with district filtering).
   - Implement `client/app/api/reports/[id]/route.ts` (GET single report details).
   - Implement `client/app/api/reports/[id]/endorse/route.ts` (POST to increment endorsements).
3. **Step 3: Citizen Report Wizard UI (`/report`)**:
   - Build 4-step wizard with smooth transitions, validation, and real-time GPS location capture.
4. **Step 4: Citizen Live Tracker UI (`/track`) & Dashboard Integration**:
   - Build real-time tracker cards with interactive lifecycle timelines.
   - Link `/report` and `/track` directly into the navigation header and dashboard.
5. **Step 5: End-to-End Verification**:
   - Run end-to-end test script simulating a citizen submitting a water crisis report in Palamu district, verifying persistence in Neon PostgreSQL, and displaying the status in the tracker.
