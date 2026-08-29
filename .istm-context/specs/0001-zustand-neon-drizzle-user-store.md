# Spec 0001: Zustand User Store & Neon/Drizzle Backend Persistence

**Feature**: User Profile State Management (Zustand) and Database Persistence (Neon PostgreSQL + Drizzle ORM)  
**Status**: Draft / Ready for Implementation  
**Created**: 2026-08-28  

---

## 1. Summary & Requirements

### Summary
Provide a unified client-side state store using **Zustand** (with persistence) to manage user identity, active role, geographic location, and institutional profile metadata, integrated with a serverless **Neon PostgreSQL** database configured via **Drizzle ORM** and Next.js Route Handlers (`/api/users/profile`).

### Acceptance Criteria
1. **Neon + Drizzle ORM Integration**:
   - Install `drizzle-orm`, `@neondatabase/serverless`, `dotenv`, and dev-dependency `drizzle-kit`.
   - Setup `client/drizzle.config.ts` targeting `lib/db/schema.ts` with dialect `postgresql`.
   - Configure HTTP serverless database client in `client/lib/db/index.ts` using `@neondatabase/serverless` and `drizzle-orm/neon-http`.
   - Define type-safe schema in `client/lib/db/schema.ts` adhering to `.istm-context/architecture.md` (tables: `users`, `government_profiles`, `student_profiles`, `student_skills`, `industry_profiles`, `institutions`).
2. **Zustand User Store**:
   - Create `client/store/use-user-store.ts` managing `currentUser`, `role`, `geoContext`, `metadata`, `isAuthenticated`, and hydration state.
   - Synchronize with Firebase authentication state and localStorage persistence.
3. **Backend Profile Persistence API**:
   - Create route handler `client/app/api/users/profile/route.ts` (GET & POST/PUT) to persist and fetch user profiles in Neon Postgres.
   - Integrate onboarding wizard (`client/app/(auth)/onboarding/page.tsx`) to save completed profile to the database via API and update Zustand store.
4. **Verification & CRUD Script**:
   - Provide `client/scripts/test-db-crud.ts` executable via `npx tsx` demonstrating database connectivity and CRUD lifecycle.
   - Add `db:generate` and `db:migrate` / `db:push` scripts to `client/package.json`.

---

## 2. Architecture & Design Alignment

### 2.1 Design Tokens (`.istm-context/design.md`)
- Maintain Coinbase minimalist styling: Coinbase Blue `#0052ff` for active elements, pill badges (`rounded-full`), Inter typography, JetBrains Mono for telemetry/status codes.
- UI state indicators (sync status, loading spinners, error alerts) use standard semantic tokens (`text-muted-foreground`, `bg-muted`, `border-border`).

### 2.2 Database Schema Specification (`client/lib/db/schema.ts`)
Conforms to Postgres types with UUID primary keys and timestamps:
- `users`: `id (uuid)`, `firebase_uid (text, unique)`, `email (text)`, `display_name (text)`, `role (text)`, `avatar_url (text)`, `is_active (boolean)`, `created_at`, `updated_at`.
- `government_profiles`: `id`, `user_id (fk -> users.id)`, `department (text)`, `designation (text)`, `state (text)`, `district (text)`, `pin_code (text)`.
- `student_profiles`: `id`, `user_id (fk -> users.id)`, `institution_name (text)`, `aishe_code (text)`, `department (text)`, `year_of_study (integer)`, `skills (text[])`.
- `industry_profiles`: `id`, `user_id (fk -> users.id)`, `organization_name (text)`, `organization_type (text)`, `sector (text)`, `website (text)`, `csr_focus (text)`.
- `institution_profiles`: `id`, `user_id (fk -> users.id)`, `institution_name (text)`, `aishe_code (text)`, `type (text)`, `departments (text[])`.

### 2.3 Zustand State Specification (`client/store/use-user-store.ts`)
```typescript
export interface UserState {
  user: UserProfile | null;
  isLoading: boolean;
  isHydrated: boolean;
  setUser: (user: UserProfile | null) => void;
  updateRole: (role: UserRole) => void;
  updateGeoContext: (geo: Partial<GeoContext>) => void;
  clearSession: () => void;
  syncWithBackend: () => Promise<void>;
}
```

---

## 3. Step-by-Step Build Plan

### Step 1: Package Dependencies & Configuration
- In `client/`, install:
  - Runtime: `drizzle-orm`, `@neondatabase/serverless`, `zustand`, `dotenv`
  - Dev: `drizzle-kit`, `tsx`, `@types/ws`
- Add scripts to `client/package.json`:
  ```json
  "db:generate": "drizzle-kit generate",
  "db:push": "drizzle-kit push",
  "db:migrate": "drizzle-kit migrate",
  "db:studio": "drizzle-kit studio"
  ```
- Configure `client/drizzle.config.ts`.

### Step 2: Database Layer (`client/lib/db/`)
- `client/lib/db/schema.ts`: Define Drizzle tables, relations, and TypeScript inferred types (`User`, `NewUser`, etc.).
- `client/lib/db/index.ts`: Export singleton Neon HTTP drizzle instance (`db`).

### Step 3: Zustand Store (`client/store/use-user-store.ts`)
- Implement type-safe Zustand store with `persist` middleware for caching session offline and quick hydration.
- Export hook `useUserStore`.

### Step 4: Next.js API Route Handlers (`client/app/api/users/profile/route.ts`)
- `POST`: Upsert user record and corresponding role profile in Neon PostgreSQL.
- `GET`: Fetch profile by Firebase UID or user session.

### Step 5: Onboarding & Dashboard Integration
- Update `client/app/(auth)/onboarding/page.tsx` to dispatch profile saves to `/api/users/profile` and set Zustand store state upon completion.
- Update `client/app/(dashboard)/dashboard/page.tsx` and header components to consume `useUserStore`.

### Step 6: Validation & Verification Script
- Create `client/scripts/test-db-crud.ts` to test connection, insert, query, and cleanup operations against Neon.
- Verify `next build` passes with zero compiler/lint errors.

---

## 4. Verification & Testing
1. Ensure `.env.local` / `.env` has `DATABASE_URL` placeholder or actual connection string.
2. Execute `npm run build` in `client/` to verify TypeScript compiler compliance.
3. Test full registration → onboarding → database insertion flow.
