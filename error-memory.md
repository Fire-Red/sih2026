# Error Memory

## 2026 08 29

### Runtime chunk loading failure

Symptom: The browser requested a Turbopack JavaScript chunk that could not be loaded.

Root cause: The development server and the generated `.next` cache had mismatched chunk manifests after repeated development and build attempts.

Verified fix: Remove only the generated `client/.next` directory, restart one clean Next development server, and verify every JavaScript asset referenced by the page returns status 200.

Prevention: Restart the development server after changing build mode or when a chunk name in the browser does not match the current `.next/dev/static/chunks` output.
