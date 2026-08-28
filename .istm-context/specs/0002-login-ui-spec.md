# Feature Spec: Minimalist Multi-Role Login UI

## 1. Summary & Requirements
A quiet, high-clarity authentication screen for CivicPulse. The screen provides a clean, distraction-free email & password login interface while offering seamless access for hackathon evaluators via quick demo personas and clear role routing.

### Acceptance Criteria:
- **Clean Light-Mode Minimalist Aesthetic**:
  - Crisp white background (`bg-background`) with soft gray card elevation (`bg-card` / `bg-surface-soft`) and clean hairline borders (`border-border-soft`).
  - Primary interaction accent: **Coinbase Blue** (`#0052ff`) on pill buttons (`rounded-full`) and subtle focus rings.
  - Typography: Inter with modest font weights, clear hierarchy, negative letter tracking on headings, and zero emojis.
- **Dual Mode Access**:
  - **Standard Email & Password Form**: Clean input fields with show/hide password toggle, validation states, and a primary "Sign in" pill button.
  - **1-Click Hackathon Persona Switcher (Interactive Drawer / Tabs)**: Allows evaluators and judges to immediately authenticate as one of 5 realistic personas (Citizen, Student Innovator, Government Officer, University/Lab Admin, Industry Partner) without typing credentials.
- **Accessible & Responsive**:
  - Centered responsive card (max width 440px) with split layout or sub-panel for demo presets.
  - Keyboard accessible tab order, proper ARIA labels, and clear error toast/alert feedback.
- **Stack & Architecture Rules**:
  - Strict TypeScript with zero `any`.
  - Next.js App Router idioms (`app/(auth)/login/page.tsx`).
  - Reusable primitives from `@/components/ui/`.

---

## 2. UI & Design Token Mapping

| UI Element | Tailwind v4 Semantic Class | Visual Property |
| :--- | :--- | :--- |
| **Page Canvas** | `bg-background min-h-screen` | Pure white `#ffffff` |
| **Login Container** | `max-w-[440px] w-full p-8 rounded-3xl bg-card border border-border-soft shadow-sm` | Soft institutional card |
| **Primary Action Button** | `bg-primary hover:bg-[#003ecc] text-white rounded-full font-medium h-12` | Coinbase Blue Pill `#0052ff` |
| **Form Inputs** | `h-11 rounded-xl bg-background border border-border-soft focus:border-primary focus:ring-1 focus:ring-primary text-sm` | Clean bordered input |
| **Demo Persona Cards** | `rounded-xl p-3.5 border border-border-soft bg-surface-soft hover:border-primary/40 transition-colors` | Quick-select persona pill |
| **Typography** | `font-normal tracking-[-0.02em] text-foreground` | Inter display hierarchy |

---

## 3. Component Architecture & File Layout

```
client/
├── app/
│   └── (auth)/
│       ├── layout.tsx                # Clean centered layout with CivicPulse header
│       └── login/
│           └── page.tsx              # Thin route rendering the LoginContainer
├── components/
│   ├── auth/
│   │   ├── login-form.tsx            # Email & password form with state handling
│   │   ├── demo-persona-selector.tsx # 1-click hackathon role selector
│   │   └── auth-header.tsx           # Brand wordmark and header title
│   └── ui/
│       ├── button.tsx                # shadcn button with pill variants
│       ├── input.tsx                 # accessible text input
│       └── badge.tsx                 # role indicator badges
├── types/
│   └── auth.ts                       # Role interfaces, DemoPersona types, Zod schemas
└── lib/
    └── auth/
        ├── session.ts                # Client session helper (mock/demo & real auth)
        └── personas.ts               # Predefined realistic All-India test personas
```

---

## 4. Realistic All-India Persona Dataset

```typescript
export interface DemoPersona {
  id: string;
  name: string;
  role: 'citizen' | 'student' | 'government' | 'institution' | 'industry';
  title: string;
  affiliation: string;
  email: string;
  avatarFallback: string;
  destinationRoute: string;
}

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: "gov-nodal",
    name: "Dr. A. K. Sharma",
    role: "government",
    title: "Nodal Officer / Joint Secretary",
    affiliation: "Dept. of Water Resources & Urban Dev",
    email: "aksharma@gov.in",
    avatarFallback: "AS",
    destinationRoute: "/validate",
  },
  {
    id: "student-lead",
    name: "Priya Verma",
    role: "student",
    title: "Lead Student Innovator (AI/IoT)",
    affiliation: "IIT Ropar / NIT",
    email: "priya.verma@student.ac.in",
    avatarFallback: "PV",
    destinationRoute: "/student/dashboard",
  },
  {
    id: "inst-dean",
    name: "Prof. S. Sengupta",
    role: "institution",
    title: "Dean of Research & Innovation",
    affiliation: "National Institute of Technology (AISHE: U-0231)",
    email: "dean.research@nit.ac.in",
    avatarFallback: "SS",
    destinationRoute: "/institution/capabilities",
  },
  {
    id: "citizen-rep",
    name: "Rajesh Thakur",
    role: "citizen",
    title: "Community Reporter",
    affiliation: "Civic Monitor, Urban Sector",
    email: "rajesh.thakur@gmail.com",
    avatarFallback: "RT",
    destinationRoute: "/report",
  },
  {
    id: "industry-csr",
    name: "Vikram Malhotra",
    role: "industry",
    title: "Head of CSR & Tech Grants",
    affiliation: "InfraTech Innovations Foundation",
    email: "vikram.m@infratech.org",
    avatarFallback: "VM",
    destinationRoute: "/industry",
  }
];
```

---

## 5. Build Plan

1. **Types & Data Layer (`client/types/auth.ts`, `client/lib/auth/personas.ts`)**:
   - Define TypeScript types for login payload, validation schema, and persona definitions.
2. **UI Primitives (`client/components/ui/`)**:
   - Verify/create `button.tsx`, `input.tsx`, `badge.tsx` with clean semantic tokens and pill geometry.
3. **Auth Components (`client/components/auth/`)**:
   - `auth-header.tsx`: Minimal wordmark and calm heading.
   - `login-form.tsx`: Clean inputs (Email, Password), "Forgot password" inline link, primary pill CTA, and subtle divider.
   - `demo-persona-selector.tsx`: Clean grid/list of test personas for 1-click evaluation.
4. **App Route Pages (`client/app/(auth)/layout.tsx`, `client/app/(auth)/login/page.tsx`)**:
   - Assemble components into a responsive layout.
5. **Compilation Verification**:
   - Run `npm run build` inside `client/` to guarantee clean zero-error build.
