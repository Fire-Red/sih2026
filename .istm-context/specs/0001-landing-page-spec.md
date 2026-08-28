# 0001-landing-page-spec.md

# Feature Spec: SIH26043 Public Landing & Home Page (`/`)

## 1. Summary & Requirements

The landing page (`/`) serves as the primary editorial briefing and portal entrypoint for the **Government of Jharkhand Societal Problem Intelligence and Collaboration Platform (SIH26043)**. 

Rather than appearing as a generic AI chatbot or marketing landing page, the page is styled with an **editorial-first, intelligence briefing aesthetic** (calm, authoritative, data-provenance conscious, light-mode canvas with single primary blue `#4630EB` accent).

### Acceptance Criteria
1. **Header Navigation (`top-nav`)**: 56px height, white background, hairline bottom border, platform insignia with Jharkhand civic insignia/eyebrow, anchor links to intelligence modules (`Problem Fusion`, `Capability Assembly`, `Impact Radar`, `Solution Memory`), and role action buttons (`Report Problem`, `Sign In`).
2. **Hero Section**:
   - `display-xl` typography (300 weight, IBM Plex Sans): *"Turning community signals into validated systemic solutions."*
   - Subhead with live quantitative statistics (e.g. 524 Reports Ingested, 24 Districts Mapped, 48 Capable Institutions, 91.2% Average Fusion Confidence).
   - High-contrast primary action CTA (*"Explore Live Intelligence"*) and secondary action (*"File Citizen Report"*).
   - Provenance telemetry badge showing live system status and AISHE/UGC data provenance.
3. **Interactive Problem DNA & Fusion Showcase**:
   - Live visual demonstration of the Problem Fusion pipeline and structured [ProblemDNA](file:///workspaces/web/client/components/problem-dna.tsx) card (Dumka District Water Supply Instability case study).
   - Explicit multi-signal breakdown (Semantic 91%, Geographic 87%, Temporal 79%, Domain 96%).
4. **Multidisciplinary Capability Assembly Visualizer**:
   - 3-step structured walkthrough of how societal challenges are decomposed into required capabilities and matched across Jharkhand universities (BIT Mesra, IIT ISM Dhanbad, NIT Jamshedpur, etc.) and industry partners.
5. **Stakeholder Portal Routing (7 Core Roles)**:
   - Clear entry cards for Citizens, Government Administrators, Academic Institutions, Students/Researchers, and Industry Partners with concise descriptions and navigation links.
6. **Data Provenance & Trust Guarantee**:
   - Transparent showcase of zero-hallucination policy, official UGC/AISHE source backing, PostGIS spatial verification, and human validation gates.
7. **Inverse Footer (`footer`)**:
   - 64px vertical padding on inverse canvas (`#161616`), copyright, Government of Jharkhand civic reference, data provenance notice, and links.

---

## 2. Design Tokens & Styling Architecture

Strictly bound to [.istm-context/design.md](file:///workspaces/web/.istm-context/design.md) and [client/app/globals.css](file:///workspaces/web/client/app/globals.css):

- **Interactive Accent**: Single primary `#4630EB` (`bg-primary`, `text-primary`, `hover:bg-[#3A27C8]`, `active:bg-[#2E1FA5]`).
- **Canvas Alternation**: Alternate pure white canvas (`bg-background`) and soft gray bands (`bg-muted` or `bg-[#f4f4f4]`) with `py-20` (80px) vertical spacing for public editorial rhythm.
- **Typography Scale**:
  - Hero Headline: `text-4xl md:text-6xl font-light tracking-tight` (IBM Plex Sans 300).
  - Section Headlines: `text-2xl md:text-3xl font-light tracking-tight text-foreground`.
  - Eyebrows: `text-xs font-mono uppercase tracking-wider text-muted-foreground`.
  - Body Copy: `text-sm md:text-base text-muted-foreground leading-relaxed`.
  - Technical/Provenance Data: `font-mono text-xs md:text-sm`.
- **Containers & Borders**:
  - Card borders: `border border-border bg-card rounded-[8px]` with 1px hairline styling.
  - No drop shadows for decoration; subtle `shadow-[0_1px_3px_rgba(0,0,0,0.04)]` on primary interactive cards.
- **No Emojis**: Strictly use `lucide-react` icons (e.g., `ShieldCheck`, `Layers`, `Network`, `MapPin`, `ArrowRight`, `Building2`, `GraduationCap`, `CheckCircle2`, `Activity`).

---

## 3. Component Architecture & File Layout

```
client/
├── app/
│   ├── layout.tsx                     # Existing root layout with IBM Plex Sans & Mono fonts
│   ├── globals.css                    # Tailwind v4 semantic tokens
│   └── page.tsx                       # Assembled Landing Page (Thin compositional route)
├── components/
│   ├── problem-dna.tsx                # Existing rich Problem DNA component
│   └── landing/
│       ├── landing-nav.tsx            # Top 56px editorial navigation bar
│       ├── landing-hero.tsx           # Editorial Hero briefing with live statistics
│       ├── landing-pipeline.tsx       # 4-stage pipeline visualization (Report -> Fusion -> Assembly -> Impact)
│       ├── landing-dna-showcase.tsx   # Problem DNA + Multi-Signal Fusion live inspection
│       ├── landing-capabilities.tsx   # University & Industry capability matching engine visualizer
│       ├── landing-roles.tsx          # 6 role entrance cards (Citizen, Govt, Institution, Student, Industry, Admin)
│       ├── landing-provenance.tsx     # Zero-hallucination & data integrity trust banner
│       └── landing-footer.tsx         # 64px inverse dark footer with civic metadata
```

---

## 4. Strict Typing & Domain Interfaces

All components must adhere to compiler-grade TypeScript with zero `any`:

```typescript
export interface MetricStat {
  readonly label: string;
  readonly value: string;
  readonly unit?: string;
  readonly change?: string;
  readonly description: string;
}

export interface PipelineStage {
  readonly step: string;
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly provenanceTag: string;
}

export interface StakeholderRoleCard {
  readonly id: "citizen" | "government" | "institution" | "student" | "industry" | "admin";
  readonly title: string;
  readonly badge: string;
  readonly description: string;
  readonly ctaLabel: string;
  readonly href: string;
  readonly capabilities: readonly string[];
}

export interface UniversityMatchDemo {
  readonly institutionName: string;
  readonly district: string;
  readonly distanceKm: number;
  readonly matchedCapabilities: readonly string[];
  readonly capabilityFitPercentage: number;
  readonly verifiedSource: string;
}
```

---

## 5. Build Plan

### Phase 1: Modular Component Creation
1. **`client/components/landing/landing-nav.tsx`**:
   - Fixed/Sticky top navigation (56px) with civic branding (`SIH26043 // JHARKHAND CIVIC INTELLIGENCE`).
   - Quick navigation links with subtle hover transitions.
   - Action buttons: "Submit Report" (ghost/secondary), "Access Console" (primary blue).
2. **`client/components/landing/landing-hero.tsx`**:
   - Editorial title with light-weight font rendering.
   - Live telemetry stats bar with IBM Plex Mono counters (Ingested Reports, Fused Problems, Matched Capabilities, Verified Outcomes).
   - High-quality curated imagery/imagery container preview showing civic cartography & intelligence telemetry.
3. **`client/components/landing/landing-pipeline.tsx`**:
   - Visual architectural flow from Citizen Signal → Multi-Signal Fusion → Problem DNA → Multidisciplinary Assembly → Solution Memory.
4. **`client/components/landing/landing-dna-showcase.tsx`**:
   - Embeds the existing [ProblemDNA](file:///workspaces/web/client/components/problem-dna.tsx) component in a dual-column layout with the Confidence Signal Radar (Semantic, Geo, Temporal, Domain scores).
5. **`client/components/landing/landing-capabilities.tsx`**:
   - Demonstrates the weighted capability matching algorithm with real Jharkhand institutions (e.g. BIT Mesra Water Eng, IIT ISM Dhanbad IoT Hydrology).
6. **`client/components/landing/landing-roles.tsx`**:
   - 6-grid stakeholder portal directory with distinct role privileges and badges.
7. **`client/components/landing/landing-provenance.tsx` & `landing-footer.tsx`**:
   - Provenance checklist (No hallucinated data, AISHE 2024 directory, PostGIS spatial computation, human government approval gate).
   - Editorial dark footer.

### Phase 2: Assembly & Verification
1. Integrate all landing sections cleanly into `client/app/page.tsx`.
2. Ensure full responsive fidelity (mobile, tablet, desktop) without horizontal overflow or awkward text wrap.
3. Verify type checking with Next.js / TypeScript (`npm run build` or `npx tsc`).
