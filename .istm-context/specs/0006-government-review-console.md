# Spec 0006: Government Review and Winner Selection Console

**Status**: In Progress
**Date**: 2026-08-29
**Scope**: `/government/manage`

## Summary

Create an authenticated government workspace where authorized reviewers can inspect validated problems and their submitted team applications, compare proposals, review pitch materials, and select one winning team. Selecting a winner is a consequential action. The server must authorize it, validate the application relationship, record the review decision, close competing applications, update the problem lifecycle, and create the active project in one database transaction.

The page is an operational review console, not a public directory. Public interface copy must remain neutral and must not expose internal pilot labels or regional marketing language.

## Requirements

### User stories

1. As a government reviewer, I can open a protected review console and see problems that have applications awaiting review.
2. As a government reviewer, I can inspect the problem context and compare every submitted team application for that problem.
3. As a government reviewer, I can open each team pitch video, slide deck, and optional repository link.
4. As a government reviewer, I can record review notes and select one winning application after confirmation.
5. As a government reviewer, I can see which problem and team are already selected and cannot select a second winner.
6. As a system operator, I can rely on an audit record of who selected the winner and when.

### Acceptance criteria

- [ ] AC-1. `/government/manage` renders inside the existing workspace shell and shows a clear page title, review context, and government specific navigation entry for government users.
- [ ] AC-2. The page is unavailable to unauthenticated users and to authenticated users whose server verified role is not `government`. Unauthorized requests return `401` or `403` and do not query or mutate review data.
- [ ] AC-3. The review queue displays validated problems with at least one application whose status is `submitted` or `under_review`, ordered by newest problem activity first. It shows an honest empty state when no applications need review.
- [ ] AC-4. Selecting a problem loads its title, description, category, severity, location fields when present, evidence links when present, team quota, application count, and current selection state from the database. Missing optional values use a clear not provided state.
- [ ] AC-5. The application comparison view shows team name, institution, member list, pitch summary, submission time, application status, video link, slide deck link, and repository link when present. It does not expose private applicant fields that are not part of the application record.
- [ ] AC-6. Video and document links use accessible named links and open in a separate browsing context. Missing media is shown as unavailable and never rendered as a broken link.
- [ ] AC-7. A reviewer can enter optional review notes and choose `Select winning team`. The action opens an accessible confirmation dialog naming the problem and selected team and explaining that other applications will be closed.
- [ ] AC-8. The winner action requires a valid problem ID, application ID, and reviewer identity. The server verifies that the application belongs to the problem and that its team is the selected team.
- [ ] AC-9. A successful winner action runs atomically: set `problem_reports.selected_team_id`, set problem status to `solution_in_progress`, set the winning application to `selected_winner`, set all other applications for the problem to `rejected`, save review notes and reviewer timestamp, and create one `active_projects` row with the default milestone plan.
- [ ] AC-10. A problem that already has `selected_team_id` cannot be selected again. The server returns a conflict response and the UI refreshes the problem state without creating a duplicate project.
- [ ] AC-11. Repeating the same request after success is safe. It must not create a second project or change the established winner.
- [ ] AC-12. Loading, empty, error, submitting, success, and conflict states are visible and actionable. Successful selection directs the reviewer to the created project or provides a working project link.
- [ ] AC-13. The page is responsive at 375px and desktop widths. Proposal comparison becomes a stacked sequence on small screens and retains clear labels for every proposal.
- [ ] AC-14. All new interactive controls use existing shadcn primitives or semantic native elements, have visible focus states, keyboard operation, accessible names, and reduced motion support.
- [ ] AC-15. The implementation has no `any`, no unsafe casts, no client side trust of role claims, no fabricated metrics, and no visible internal project identifiers in public copy.
- [ ] AC-16. Tests cover unauthorized access, queue loading, empty and error states, successful selection, duplicate selection conflict, application mismatch, and keyboard operation of the confirmation dialog.

## Decision

### Access and authorization

The page uses the existing client session for routing feedback, but server authorization is authoritative. The selection route must verify the Firebase token with the existing server authentication helper and load the user record by verified identity. The stored database role must equal `government`. A client supplied role or user ID is never sufficient.

The existing repository currently has a local session helper and incomplete server route authorization. The implementation must add or reuse a server side authorization helper at the API boundary rather than treating local storage as proof of identity. If the existing Firebase verification helper is not available, the implementation must stop and route that missing infrastructure decision to architecture instead of weakening AC-2.

### Data source and queue behavior

The database is the source of truth. The queue is derived from `problem_reports`, `problem_applications`, and `student_teams`. A problem belongs in the queue when it has no selected team and at least one application with status `submitted` or `under_review`. The queue does not invent counts or confidence values.

The existing `GET /api/applications` response shape may be extended or replaced with a government scoped response. New responses must be validated with Zod before use by the page. The page must not call the database directly.

### Winner selection transaction

Winner selection is a single server operation. It accepts `problemId`, `applicationId`, `reviewNotes`, and a server derived reviewer identity. The transaction must use a conditional update requiring `selected_team_id IS NULL`, then verify the application relationship, update application statuses, and insert the project. Any failure rolls back all changes.

The project title is derived from the selected problem title. The project description is derived from the selected pitch summary. The project uses the existing four phase milestone defaults from the project API. The created project ID is returned to the UI.

### Review history and audit

The current schema has `reviewedAt` and `reviewNotes` on applications but no audit log table. The first implementation stores reviewer notes and timestamp on the application and must not claim to provide a complete audit trail until an audit table exists. Before implementing AC-9 and AC-12, add the smallest schema extension needed for consequential action history: `reviewed_by` on `problem_applications` and a `government_review_events` table with UUID ID, problem ID, application ID, reviewer ID, action, notes, created timestamp, and updated timestamp. The event action enum must include `winner_selected`.

## API surface

### `GET /api/government/reviews`

Authenticated government users only.

Returns:

```ts
interface ReviewQueueResponse {
  success: true;
  reviews: Array<{
    problem: ProblemReviewSummary;
    applicationCount: number;
    pendingApplicationCount: number;
    selectedTeamId: string | null;
  }>;
}
```

`ProblemReviewSummary` is composed only from stored problem columns. Counts are database derived. The route returns `401` for no valid identity, `403` for a non government role, and `500` for an unavailable data source.

### `GET /api/government/reviews/[problemId]`

Authenticated government users only.

Returns the selected problem, all of its applications, joined team display data, evidence links, and any review events. It must return `404` when the problem does not exist and must not return private user profile fields.

### `POST /api/government/reviews/[problemId]/select`

Authenticated government users only.

Request:

```ts
interface SelectWinnerRequest {
  applicationId: string;
  reviewNotes?: string;
}
```

Validation uses Zod. `reviewNotes` is trimmed and limited to 2000 characters. The server obtains reviewer identity from the verified token.

Success response:

```ts
interface SelectWinnerResponse {
  success: true;
  projectId: string;
  selectedApplicationId: string;
}
```

Errors use structured responses with `401`, `403`, `404`, `409`, or `422` as appropriate. Error text must be safe to show to the reviewer and must not expose SQL or provider details.

## Feature design

### Surface composition

1. Existing workspace shell with the government navigation item highlighted.
2. Page header with the title `Review proposals`, a short explanation, and a compact operational status line derived from loaded data.
3. Review queue rail with searchable or selectable problem entries, pending application count, severity, category, and location only when stored.
4. Problem context panel with description, evidence links, category, severity, location, quota, and selection state.
5. Proposal comparison area with one review card per application. Cards are grouped under the selected problem rather than nested inside decorative cards.
6. Review action area with notes input, selection button, confirmation dialog, status feedback, and project link after success.
7. A quiet footer or help line explaining that selection creates a project workspace and closes competing submissions.

### Visual direction

Use the existing Expo Notion Minimal design system. The canvas is warm and quiet, with white surfaces, hairline borders, calm Inter typography, compact monospace status labels, and one indigo interactive color. Semantic green, amber, and crimson are reserved for actual selection, pending, and error states. No gradients, decorative illustrations, fake metrics, or dense dashboard tiles.

Use `bg-background`, `bg-card`, `bg-muted`, `text-foreground`, `text-muted-foreground`, `border-border`, `text-primary`, and existing semantic status tokens. Reuse `Button`, `Input`, `Card`, `Badge`, and any dialog primitive available in `client/components/ui/`.

### Responsive behavior

At small widths, the queue appears above the selected problem and proposals. Proposal cards stack vertically. Long summaries wrap normally and links remain reachable without horizontal page scrolling. At desktop widths, use a two column workspace with a bounded queue and a flexible review area. The review area must use `min-w-0` where text and links share a flex row.

### State behavior

The page starts with a loading skeleton or status region. A failed queue or detail request offers a retry action. A queue with no records explains that there are no proposals waiting for review. A problem with no applications explains that the record cannot be reviewed yet. A selected problem shows the winning team and disables further selection. The submit state disables the action and announces progress. A conflict response explains that another reviewer already completed the decision and refreshes the detail view.

### Accessibility and motion

Use one page `main` landmark and one `h1`. Use native links for media and project navigation, buttons for actions, labels for notes, and a semantic list for the queue and proposals. The confirmation dialog must label itself, describe the consequence, trap focus while open, close on Escape, and return focus to the selection trigger. All animated transitions honor the existing reduced motion rule.

## Data model changes

Add the following schema elements before implementing the selection route:

1. `reviewedBy` nullable UUID on `problem_applications`, referencing `users.id` with `set null` on delete.
2. `reviewEventActionEnum` with `winner_selected` as its first stable value.
3. `governmentReviewEvents` with:
   `id`, `problemId`, `applicationId`, `reviewerId`, `action`, `notes`, `createdAt`, and `updatedAt`.
4. Foreign keys from the event to the problem, application, and reviewer, with cascade for the problem and application and set null for the reviewer where the schema permits.

No existing records are deleted or rewritten by the migration. The selection transaction must preserve existing applications and mark them with their final status.

## Build plan

1. Verify the existing global CSS tokens and root workspace layout already satisfy the design system. Add only missing semantic tokens or layout hooks before feature components. Satisfies AC-1, AC-14, AC-15.
2. Add and migrate the review event schema and `reviewedBy` field. Generate and apply the migration, then verify the live schema. Satisfies AC-9, AC-16.
3. Add typed Zod request and response schemas plus server side government authorization. Satisfies AC-2, AC-8, AC-15.
4. Implement the government review queue and detail API routes using database derived data and safe structured errors. Satisfies AC-3, AC-4, AC-5, AC-6.
5. Implement the transactional winner selection route with conditional conflict protection, status updates, review event creation, and project creation. Satisfies AC-7, AC-8, AC-9, AC-10, AC-11.
6. Add government navigation entry and the `/government/manage` routing layer. Keep the page thin and place data behavior in feature components and API helpers. Satisfies AC-1, AC-12.
7. Build the queue, problem context, proposal comparison, notes field, confirmation dialog, loading, empty, error, conflict, and success states with existing UI primitives. Satisfies AC-3 through AC-7 and AC-12 through AC-14.
8. Add tests for authorization, API transaction behavior, duplicate selection, invalid application relationships, rendering states, dialog keyboard behavior, and responsive proposal layout. Satisfies AC-16.
9. Run type checking, linting, tests, and a desktop and mobile visual audit. Update `progress.md` after verification. Satisfies all criteria.

## Consequences

- The first version supports one winning team per problem. Multi team awards require a later data model decision.
- Reviewers can compare proposals, but proposal scoring is not automated and no ranking is presented as fact.
- The active project is created by the selection transaction and uses the existing prototype milestone defaults.
- A dedicated event table makes the consequential action traceable without pretending that application review fields alone are a complete audit system.
- The current local session implementation is not an authorization boundary. The server verification helper must be present before production access is considered complete.

## Verification protocol

Run the client type checker and linter, the relevant API and component tests, and the existing build command. Verify the migration against the configured database. Manually test an unauthenticated browser, a non government session, an empty queue, a populated queue, a successful selection, a second selection attempt, and keyboard only operation of the confirmation dialog.
