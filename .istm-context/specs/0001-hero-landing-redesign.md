# 0001 - Hero & Landing Page: Apple Glassmorphism + Stripe Mesh + Expo Design Language

## 1. Summary & Requirements
This specification defines the redesign and build of the CivicPulse Marketing Landing Page (`client/app/page.tsx`) and the flagship Hero section.
It synthesizes three distinct, world-class design languages into a harmonious, high-converting civic intelligence interface:
1. **Stripe Visual Language**: Signature gradient mesh colors (sherbet orange, lavender, electric indigo `#533afd`, and ruby `#ea2261`), cool-tinted off-white bands (`#f6f9fc`), crisp 1px borders (`#e3e8ee`), and the strict single-indigo pill CTA hierarchy.
2. **Apple Precision Glassmorphism**: Multi-layer backdrop-blur panels (`backdrop-blur-xl bg-white/70 border border-white/40 shadow-[0_8px_32px_0_rgba(13,37,61,0.06)]`), frosted glass badges, and specular rim-lighting on floating card primitives.
3. **Expo Minimalist Editorial**: Ultra-clean typography with weight 300 negative-tracked headlines, monospace/tabular metadata tags (`font-mono`, `tnum`), high-density information layout, and direct zero-fluff navigation.

### Visual Assets Used
- Background Hero Backdrop: `/hero-bg.png` (copied to [`client/public/hero-bg.png`](file:///workspaces/web/client/public/hero-bg.png)) layered under a dual-mode CSS gradient veil with soft radial blend.
- Fallback/Reference Mesh: [`client/public/reference-mesh.png`](file:///workspaces/web/client/public/reference-mesh.png).

---

## 2. Acceptance Criteria
- [ ] **Hero Section Layering**:
  - Full-width hero canvas with `/hero-bg.png` anchored with `object-cover` and covered by a subtle vignette/mesh overlay (`bg-gradient-to-b from-transparent via-white/50 to-background`).
  - Frosted glass floating pill tag (`Apple-style glassmorphism` with backdrop blur, subtle 1px border, and pulsating live status dot).
  - Headline styled according to [`.istm-context/design.md`](file:///workspaces/web/.istm-context/design.md): Sohne/Inter weight 300, Deep Navy (`#0d253d`), negative tracking (`-1.4px` on display sizes).
  - Primary CTA: Single-Indigo pill button (`#533afd`, `rounded-full`, 8px 16px padding) + Secondary glass pill button (`border border-border/80 bg-white/60 backdrop-blur-md`).
- [ ] **Interactive Glassmorphic Live Card**:
  - Right/Center composited preview card featuring live problem telemetry:
    - Glass container: `bg-white/75 backdrop-blur-xl border border-white/60 shadow-2xl rounded-2xl p-6`.
    - Live Quota Indicator: Tabular numerics showing `2/3 Student Teams Applied`.
    - Verification Chip: Verified by Ranchi Municipal Corporation.
    - Mini Audio/Video & Deck preview badges.
- [ ] **3-Step Zero-Confusion Flow Strip**:
  - Step 1: Citizen Signal (Geo-tagged photos).
  - Step 2: University Teams Pitch (1-para + 3-min video + deck).
  - Step 3: Govt Selection & Pilot Deployment.
- [ ] **Domain Filter & Live Opportunities Preview**:
  - Quick-browse tabs (Water, Roads, Education, Health, Sanitation).
  - Cards displaying active grant amount (e.g. `₹2,50,000 Grant`), quota slots, and district tag.
- [ ] **Zero Emojis & Strict Lucide Icons**: All visual indicators use Lucide icons (`CheckCircle2`, `MapPin`, `Video`, `Layers`, `ArrowRight`, `ShieldCheck`).

---

## 3. UI Tokens & Architectural Alignment

### Color Palette (from `.istm-context/design.md` & `globals.css`)
- Canvas & Background: `bg-background` (`#ffffff`), `bg-secondary` (`#f6f9fc`), `bg-accent` (`#f5e9d4`).
- Primary Action: `bg-primary` (`#533afd`), `hover:bg-primary-deep` (`#4434d4`).
- Text Hierarchy: `text-foreground` (`#0d253d`), `text-muted-foreground` (`#64748d`), `text-brand-ink-secondary` (`#273951`).
- Hairlines & Borders: `border-border` (`#e3e8ee`), `border-white/40`.
- Glass Primitives:
  - `.glass-panel`: `bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]`
  - `.glass-panel-dark`: `bg-[#0d253d]/80 backdrop-blur-xl border border-white/10 text-white`

### Component Primitive Reuse
- Buttons: `@/components/ui/button` with `rounded-full` variant.
- Badges: `@/components/ui/badge` styled with glass backdrop.
- Cards: `@/components/ui/card` with custom glassmorphism modifier classes.

---

## 4. Strict Typing & Clean Code
- **TypeScript Strictness**: Zero `any`. State transitions mapped via discriminated unions.
- **Next.js App Router**: Client components isolated to interactive leaves (`"use client"` for video modal / tab toggling; static markup rendered on server).
- **Code Conciseness**: Keep `HeroSection.tsx` and `LandingContent.tsx` modular and under ~200 lines per file.

---

## 5. Step-by-Step Build Plan

### Step 1: Asset & Utility Preparation
- Verify `/hero-bg.png` exists in `client/public/`.
- Ensure `client/app/globals.css` contains glassmorphism helper utilities:
  ```css
  .glass-card {
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.6);
  }
  ```

### Step 2: Build Hero Component (`client/components/landing/HeroSection.tsx`)
- Render the background image layer using Next.js `<Image>` with high priority or background wrapper.
- Add the dual-layer gradient overlay (Stripe mesh color accents + Apple translucent white scrim).
- Lay out the split hero:
  - Left column: Glass badge, Negative-tracked Display Heading, Subtitle, Dual Pill CTAs.
  - Right column: Interactive glass preview card displaying problem DNA and quota telemetry.

### Step 3: Build 3-Step Lifecycle Band (`client/components/landing/ProcessBand.tsx`)
- Three Apple-styled frosted cards illustrating the zero-confusion pipeline with clean Lucide icons.

### Step 4: Build Featured Problem Statements Strip (`client/components/landing/FeaturedProblems.tsx`)
- Live preview of open problems with team quota badges (`1/3 Slots Filled`), domain tags, and direct CTA to `/problems`.

### Step 5: Integrate into `client/app/page.tsx`
- Assemble components into clean, semantic sections with standard layout navigation.

---

## 6. Next Steps
Once approved, run `/istm-develop` to begin the physical execution of this specification.
