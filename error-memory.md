# Error Memory

## 2026 08 29

### Runtime chunk loading failure

Symptom: The browser requested a Turbopack JavaScript chunk that could not be loaded.

Root cause: The development server and the generated `.next` cache had mismatched chunk manifests after repeated development and build attempts.

Verified fix: Remove only the generated `client/.next` directory, restart one clean Next development server, and verify every JavaScript asset referenced by the page returns status 200.

Prevention: Restart the development server after changing build mode or when a chunk name in the browser does not match the current `.next/dev/static/chunks` output.

### 2026 08 29

### Auth entry and workspace boundary

Symptom: A signed-in user could revisit login or registration, and workspace pages could render briefly without a session.

Root cause: Auth entry forms had no redirect for an existing session, while the shared workspace frame rendered its children before checking local session state.

Verified fix: Auth entry forms redirect existing sessions to `/dashboard`; the workspace frame redirects missing sessions to `/login` and withholds protected content until the check completes.

Prevention: Keep auth-entry redirects and protected-shell checks in shared components so new role routes inherit the same boundary.
