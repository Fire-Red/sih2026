# Spec 0003 — Drizzle Schema: Teams, Applications, Active Projects

## Status
`draft`

## Summary

Extend [`client/lib/db/schema.ts`](file:///workspaces/web/client/lib/db/schema.ts) with three new tables required by the CivicPulse lifecycle defined in [`plan.md`](file:///workspaces/web/plan.md):

1. **`student_teams`** — A named group of students who apply together to a problem.
2. **`problem_applications`** — A team's pitch submission for a specific problem (1-para approach + video + PPT).
3. **`active_projects`** — The auto-created workspace after government selects a winning team.

Additionally, **extend `problem_reports`** with four new columns to support the quota and selection lifecycle.

No other tables are touched. No existing columns are removed or renamed. This spec covers schema only — API routes are in Spec 0004.

---

## Acceptance Criteria

- [ ] `problem_reports` has four new columns: `maxTeamsAllowed`, `appliedTeamsCount`, `sponsoringDepartment`, `selectedTeamId`.
- [ ] `student_teams` table exists with all columns defined below. FK to `users` for `leaderId`.
- [ ] `problem_applications` table exists with all columns. FK to `problemReports` and `studentTeams`. Enum for `status`.
- [ ] `active_projects` table exists with all columns. FK to `problemReports` and `studentTeams`. JSONB `milestones` column.
- [ ] All new Drizzle inferred types exported: `StudentTeam`, `NewStudentTeam`, `ProblemApplication`, `NewProblemApplication`, `ActiveProject`, `NewActiveProject`.
- [ ] `drizzle-kit push` succeeds against live Neon PostgreSQL with zero errors.
- [ ] Schema file split into `schema/` folder (current schema.ts hits ~320 lines with new tables — exceeds 250-line cap).

---

## Architecture Constraints (from blueprints)

- ORM: Drizzle ORM — no raw SQL in schema definitions.
- DB: Neon PostgreSQL — `pgTable`, `uuid`, `text`, `integer`, `boolean`, `timestamp`, `jsonb` from `drizzle-orm/pg-core`.
- All tables: `id` (UUID, `defaultRandom()`), `createdAt`, `updatedAt` (timestamps with timezone).
- TypeScript: strict, no `any`. All types inferred via `$inferSelect` / `$inferInsert`.
- `jsonb` is used for `milestones` — not a separate table at prototype stage.
- Enum values must be exhaustive and stable.

---

## Step 1: Extend `problem_reports`

Add four **nullable** columns (existing rows are unaffected):

| Column | Drizzle Type | Default | Notes |
|---|---|---|---|
| `max_teams_allowed` | `integer` | `3` | Government-set concurrent team cap |
| `applied_teams_count` | `integer` | `0` | Denormalized counter, maintained by API |
| `sponsoring_department` | `text` | `null` | Optional government department name |
| `selected_team_id` | `uuid` | `null` | FK → `student_teams.id`, set on winner selection |

> **Denormalized counter rationale**: `appliedTeamsCount` avoids a `COUNT(*)` join on every `/problems` list render. The API route is the sole writer — no DB triggers.

---

## Step 2: `student_teams` Table

| Column | Drizzle Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, `defaultRandom()` | |
| `team_name` | `text` | NOT NULL | e.g. "Team Hydra" |
| `leader_id` | `uuid` | FK → `users.id`, NOT NULL | Student who created the team |
| `institution_name` | `text` | NOT NULL | Plain text — team's college |
| `faculty_mentor_name` | `text` | nullable | Optional faculty mentor |
| `faculty_mentor_email` | `text` | nullable | For verification contact |
| `member_count` | `integer` | NOT NULL, default `1` | Denormalized for quick display |
| `skills` | `text[]` | nullable | Aggregated skill tags from members |
| `is_active` | `boolean` | NOT NULL, default `true` | Soft delete |
| `created_at` | `timestamp` | withTimezone, defaultNow() | |
| `updated_at` | `timestamp` | withTimezone, defaultNow() | |

**No separate `team_members` join table at this stage.** Member names are submitted inside `problem_applications.teamComposition` JSONB. This is a deliberate prototype deferral.

---

## Step 3: `problem_applications` Table

### Enum: `applicationStatusEnum`

```ts
pgEnum("application_status", [
  "submitted",    // pending review
  "under_review", // government is reviewing
  "selected",     // chosen as winner
  "rejected",     // rejected
  "withdrawn",    // team withdrew
])
```

### Columns

| Column | Drizzle Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, `defaultRandom()` | |
| `problem_report_id` | `uuid` | FK → `problem_reports.id`, NOT NULL | The problem being applied to |
| `team_id` | `uuid` | FK → `student_teams.id`, NOT NULL | The applying team |
| `pitch_summary` | `text` | NOT NULL | 1-paragraph approach (≤ 500 chars, API-enforced) |
| `video_url` | `text` | NOT NULL | 3-min walkthrough video URL |
| `ppt_url` | `text` | NOT NULL | PPT slide deck URL |
| `repo_url` | `text` | nullable | Optional GitHub/GitLab link |
| `team_composition` | `jsonb` | NOT NULL | `{ members: Array<{ name: string; role: string; year: number }> }` |
| `status` | `applicationStatusEnum` | NOT NULL, default `"submitted"` | |
| `reviewed_by` | `uuid` | FK → `users.id`, nullable | Government reviewer |
| `reviewed_at` | `timestamp` | withTimezone, nullable | |
| `review_notes` | `text` | nullable | Optional reviewer comment |
| `created_at` | `timestamp` | withTimezone, defaultNow() | |
| `updated_at` | `timestamp` | withTimezone, defaultNow() | |

**Unique constraint**: `(problem_report_id, team_id)` — one application per team per problem.

---

## Step 4: `active_projects` Table

### Enum: `projectStatusEnum`

```ts
pgEnum("project_status", [
  "active",      // milestones in progress
  "prototype",   // prototype built, under review
  "pilot",       // pilot deployment in test district
  "deployment",  // full deployment live
  "completed",   // impact verified, closed
  "blocked",     // needs government intervention
  "cancelled",   // cancelled
])
```

### Columns

| Column | Drizzle Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, `defaultRandom()` | |
| `problem_report_id` | `uuid` | FK → `problem_reports.id`, NOT NULL | Source problem |
| `team_id` | `uuid` | FK → `student_teams.id`, NOT NULL | Selected team |
| `application_id` | `uuid` | FK → `problem_applications.id`, NOT NULL | The winning application |
| `title` | `text` | NOT NULL | Copied from problem title at creation |
| `status` | `projectStatusEnum` | NOT NULL, default `"active"` | |
| `milestones` | `jsonb` | NOT NULL, default `'[]'` | `Array<{ id: string; title: string; dueDate: string; status: "pending" \| "in_progress" \| "completed" \| "overdue"; completedAt: string \| null; notes: string \| null }>` |
| `pilot_district` | `text` | nullable | Target district |
| `pilot_description` | `text` | nullable | What the pilot tests |
| `pilot_photos` | `text[]` | nullable | ImageKit evidence URLs |
| `start_date` | `text` | NOT NULL | ISO date string |
| `target_end_date` | `text` | nullable | ISO date string |
| `actual_end_date` | `text` | nullable | Set on completion |
| `created_at` | `timestamp` | withTimezone, defaultNow() | |
| `updated_at` | `timestamp` | withTimezone, defaultNow() | |

**Unique constraint**: `(problem_report_id)` — one active project per problem.

---

## File Split — Required

Current `schema.ts` is **182 lines**. New tables will push it to ~320 lines. Split is mandatory.

### Target structure

```
client/lib/db/
├── schema/
│   ├── users.ts          # users, role profiles, enums
│   ├── reports.ts        # problem_reports (extended), problem_evidence, category/severity/status enums
│   ├── teams.ts          # student_teams
│   ├── applications.ts   # problem_applications, applicationStatusEnum
│   ├── projects.ts       # active_projects, projectStatusEnum
│   └── index.ts          # barrel re-export of all tables and types
└── index.ts              # Drizzle db instance — update import to ./schema/index
```

---

## TypeScript Exports (barrel `schema/index.ts`)

```ts
export * from "./users";
export * from "./reports";
export * from "./teams";
export * from "./applications";
export * from "./projects";
```

New types to exist after this spec:
- `StudentTeam`, `NewStudentTeam`
- `ProblemApplication`, `NewProblemApplication`
- `ActiveProject`, `NewActiveProject`

---

## Zod Schemas (new file: `client/lib/api/schemas/team-schemas.ts`)

```ts
const TeamCompositionMemberSchema = z.object({
  name: z.string().min(1).max(100),
  role: z.string().min(1).max(80),
  year: z.number().int().min(1).max(6),
});

const CreateTeamPayload = z.object({
  teamName: z.string().min(2).max(80),
  institutionName: z.string().min(2).max(200),
  facultyMentorName: z.string().max(100).optional(),
  facultyMentorEmail: z.string().email().optional(),
  skills: z.array(z.string().max(50)).max(15).optional(),
});

const SubmitApplicationPayload = z.object({
  problemReportId: z.string().uuid(),
  teamId: z.string().uuid(),
  pitchSummary: z.string().min(50).max(500),
  videoUrl: z.string().url(),
  pptUrl: z.string().url(),
  repoUrl: z.string().url().optional(),
  teamComposition: z.object({
    members: z.array(TeamCompositionMemberSchema).min(1).max(10),
  }),
});
```

---

## Build Plan

| # | Task | File(s) |
|---|---|---|
| 1 | Create `schema/users.ts` — move existing user/profile tables | `client/lib/db/schema/users.ts` |
| 2 | Create `schema/reports.ts` — move report tables + add 4 new columns to `problem_reports` | `client/lib/db/schema/reports.ts` |
| 3 | Create `schema/teams.ts` — define `studentTeams` | `client/lib/db/schema/teams.ts` |
| 4 | Create `schema/applications.ts` — define `applicationStatusEnum` + `problemApplications` with unique constraint | `client/lib/db/schema/applications.ts` |
| 5 | Create `schema/projects.ts` — define `projectStatusEnum` + `activeProjects` with unique constraint | `client/lib/db/schema/projects.ts` |
| 6 | Create `schema/index.ts` — barrel re-export | `client/lib/db/schema/index.ts` |
| 7 | Update `client/lib/db/index.ts` — import from `./schema/index` | `client/lib/db/index.ts` |
| 8 | Audit all schema imports across `client/` — update to new barrel path | various |
| 9 | Create Zod schemas | `client/lib/api/schemas/team-schemas.ts` |
| 10 | Run `drizzle-kit push` and confirm zero errors | terminal |

---

## What This Spec Does NOT Cover

- API route handlers → Spec 0004
- `/problems` directory page → Spec 0005
- `/government/manage` console → Spec 0006
- `/projects/[id]` workspace → Spec 0007
- Landing page redesign → Spec 0008

---

## Dependency Graph

```
Spec 0003 (Schema)
  └─→ Spec 0004 (API Routes)
        ├─→ Spec 0005 (/problems)
        ├─→ Spec 0006 (/government/manage)
        └─→ Spec 0007 (/projects/[id])
              └─→ Spec 0008 (Landing page)
```

Run `/istm-develop` to implement this spec.
