# Error Memory

## 2026 08 30

### React effect lint errors blocked the client quality gate

Symptom: ESLint reported state updates triggered synchronously from effects in the workspace shell, report tracker, and student dashboard.

Root cause: Effects called stateful loaders directly, and the workspace shell used an effect only to copy the current session into state.

Verified fix: Initialize the workspace session from the session getter, separate report fetching from report state updates, and keep the student loader scoped to an effect with cancellation handling.

### Production build blocked by Next bundler worker failure

Symptom: `next build` panicked while processing `leaflet/dist/leaflet.css` because a worker could not bind to a port. `next build --webpack` then failed while parsing TypeScript `--showConfig` output.

Root cause: The current execution environment cannot complete Next's bundler worker startup. `tsc --noEmit` passes, so no TypeScript source error was confirmed.

Verified workaround to investigate later: Run the build in a clean local or CI environment, then isolate the Leaflet CSS import if the same Turbopack failure reproduces there.

## 2026 08 29

### Report evidence was URL-only

Symptom: The report evidence step said it supported photos, but only rendered a URL input.

Root cause: The wizard stored evidence as text links and had no file input or client-side file handling.

Verified fix: Added a device file input for images and documents, size validation, and a server signed ImageKit upload flow that stores hosted media URLs in the existing report payload. When ImageKit is not configured, the user receives a clear setup error instead of a temporary data string.

### Report location could not be searched

Symptom: A reporter could use GPS or click the map, but could not set the pin to a known town, landmark, or PIN code elsewhere.

Root cause: The location picker had no forward geocoding search and the Leaflet view did not recenter when its selected coordinates changed outside the map.

Verified fix: Added a Nominatim place search, preserved direct map selection and GPS detection, and recentered the map after an external location selection.

### Map tile provider requested an API key

Symptom: The map display could show an API key warning even though the application did not configure a map provider key.

Root cause: The location picker depended on a CARTO tile endpoint that can require provider access configuration.

Verified fix: Use standard OpenStreetMap tiles for the current prototype. Leaflet and Nominatim remain the map and location services.

### Hosted evidence URL exposed in the report UI

Symptom: The evidence list displayed long ImageKit storage URLs directly to the reporter.

Root cause: The media URL was used as visible supporting text after upload.

Verified fix: Show image previews or attachment labels and keep the URL only behind an explicit open action.

### Expanded dashboard sidebar covered content

Symptom: Government dashboard content could sit underneath the expanded sidebar.

Root cause: The dashboard reserved 7rem of left padding while the expanded sidebar is 16rem wide.

Verified fix: Dashboard content now reserves 18rem at desktop widths, matching the expanded sidebar and its control.

### Runtime chunk loading failure

Symptom: The browser requested a Turbopack JavaScript chunk that could not be loaded.

Root cause: The development server and the generated `.next` cache had mismatched chunk manifests after repeated development and build attempts.

Verified fix: Remove only the generated `client/.next` directory, restart one clean Next development server, and verify every JavaScript asset referenced by the page returns status 200.

Prevention: Restart the development server after changing build mode or when a chunk name in the browser does not match the current `.next/dev/static/chunks` output.

### Auth entry and workspace boundary

Symptom: A signed-in user could revisit login or registration, and workspace pages could render briefly without a session.

Root cause: Auth entry forms had no redirect for an existing session, while the shared workspace frame rendered its children before checking local session state.

Verified fix: Auth entry forms redirect existing sessions to `/dashboard`; the workspace frame redirects missing sessions to `/login` and withholds protected content until the check completes.

Prevention: Keep auth-entry redirects and protected-shell checks in shared components so new role routes inherit the same boundary.

### Stale generated route types after route relocation

Symptom: TypeScript referenced a removed route after moving a page into its required URL path.

Root cause: Generated `.next` route declarations retained the old page module path.

Verified fix: Remove only the generated `client/.next` directory and rerun TypeScript and the production build so route declarations regenerate from the current app tree.

Prevention: Clear the generated Next cache after relocating or deleting App Router pages when the compiler reports a missing module that no longer exists.

### Role dashboard profile field mismatch

Symptom: TypeScript failed because role dashboards read `UserProfile.name`, which is not part of the profile contract.

Root cause: The role dashboard views used the session field name while reading from the profile store.

Verified fix: Read `displayName` from `UserProfile` in the affected industry, institution, and student dashboard views.

### Government dashboard masked review API failures

Symptom: The government dashboard displayed zero proposals and an empty backlog when the review request failed, while also presenting an unverified AI online status.

Root cause: The dashboard used a raw unauthenticated fetch, ignored non successful responses, and treated the default empty array as valid data.

Verified fix: Reused the authenticated review API client, added visible loading and error states, and replaced the service health claim with human decision guidance.

Prevention: Dashboard metrics must distinguish loading, unavailable, empty, and populated states. Do not display provider health without a real health check.

### Submitted citizen reports missing from government review queue

Symptom: Newly submitted citizen problem reports did not appear in the government review console or dashboard review backlog.

Root cause: The `/api/government/reviews` route used an `innerJoin` on `problem_applications` and required `status = 'validated'`, filtering out newly submitted problem reports that did not yet have attached student team pitches.

Verified fix: Switched to `leftJoin` on `problem_applications` and removed the restrictive filter so all unassigned and newly reported problems appear in the queue for validation and decision making.
