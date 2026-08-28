---
version: alpha-2
name: SIH26043-design-system
description: "A modern civic intelligence platform built on IBM Plex Sans typography, Expo inspired bright blue #4630EB primary, and a clean light mode canvas. The design feels premium and editorial rather than stereotypically government. White canvas with soft gray #f4f4f4 alternating bands, a single restrained blue accent for all interactive states, generous editorial spacing on public surfaces, and operational density on government consoles. Built for maps, data tables, problem fusion dashboards, and impact verification workflows. Honest data presentation with no decorative noise. No AI visual cliches."

colors:
  primary: "#4630EB"
  primary-hover: "#3A27C8"
  primary-active: "#2E1FA5"
  primary-soft: "#F0EDFE"
  on-primary: "#ffffff"

  ink: "#161616"
  ink-secondary: "#525252"
  ink-muted: "#8C8C8C"
  ink-placeholder: "#a8a8a8"

  canvas: "#ffffff"
  canvas-soft: "#f4f4f4"
  canvas-warm: "#fafaf9"

  surface-card: "#ffffff"
  surface-elevated: "#f4f4f4"
  surface-muted: "#e8e8e8"

  hairline: "#e0e0e0"
  hairline-soft: "#f0f0f0"
  hairline-strong: "#c6c6c6"

  inverse-canvas: "#161616"
  inverse-surface: "#262626"
  inverse-ink: "#ffffff"
  inverse-ink-muted: "#c6c6c6"

  semantic-success: "#24a148"
  semantic-success-soft: "#defbe6"
  semantic-warning: "#f1c21b"
  semantic-warning-soft: "#fef9e0"
  semantic-error: "#da1e28"
  semantic-error-soft: "#fff1f1"
  semantic-info: "#4630EB"
  semantic-info-soft: "#F0EDFE"

  map-accent-cyan: "#1192e8"
  map-accent-teal: "#009d9a"
  map-accent-purple: "#8a3ffc"
  map-accent-magenta: "#d02670"

  focus-ring: "#4630EB"

typography:
  display-xl:
    fontFamily: IBM Plex Sans
    fontSize: 60px
    fontWeight: 300
    lineHeight: 1.12
    letterSpacing: -0.5px
  display-lg:
    fontFamily: IBM Plex Sans
    fontSize: 48px
    fontWeight: 300
    lineHeight: 1.17
    letterSpacing: -0.4px
  display-md:
    fontFamily: IBM Plex Sans
    fontSize: 36px
    fontWeight: 300
    lineHeight: 1.22
    letterSpacing: 0
  headline:
    fontFamily: IBM Plex Sans
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.29
    letterSpacing: 0
  card-title:
    fontFamily: IBM Plex Sans
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.36
    letterSpacing: 0
  subhead:
    fontFamily: IBM Plex Sans
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: 0
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  body:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0.16px
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: 0.16px
  body-emphasis:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.43
    letterSpacing: 0.16px
  caption:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: 0.32px
  button:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.29
    letterSpacing: 0.16px
  eyebrow:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.33
    letterSpacing: 0.32px
  mono:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: 0
  mono-sm:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: 0
  tabular:
    fontFamily: IBM Plex Mono
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0
    fontFeatureSettings: tnum
  stat-display:
    fontFamily: IBM Plex Sans
    fontSize: 36px
    fontWeight: 300
    lineHeight: 1.22
    letterSpacing: 0

rounded:
  none: 0px
  xs: 2px
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 80px
  section-dense: 48px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 20px
    hover: "{colors.primary-hover}"
    active: "{colors.primary-active}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 20px
    border: 1px {colors.hairline}
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 20px
  button-danger:
    backgroundColor: "{colors.semantic-error}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 20px
  feature-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
    border: 1px {colors.hairline}
  stat-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 24px
    border: 1px {colors.hairline}
  problem-dna-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 32px
    border: 1px {colors.hairline}
  map-container:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    border: 1px {colors.hairline}
    padding: 0
  data-table:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    headerBg: "{colors.canvas-soft}"
    rowBorderColor: "{colors.hairline-soft}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 10px 14px
    border: 1px {colors.hairline}
    focusBorder: 2px {colors.primary}
    focusRing: "{colors.primary-soft}"
  badge-status:
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 2px 8px
  confidence-bar:
    backgroundColor: "{colors.canvas-soft}"
    fillColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    height: 6px
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    height: 56px
    borderBottom: 1px {colors.hairline}
  sidebar:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    width: 280px
  footer:
    backgroundColor: "{colors.inverse-canvas}"
    textColor: "{colors.inverse-ink-muted}"
    typography: "{typography.body-sm}"
    padding: 64px 32px
---

# SIH26043 Design System, Tokens, Layout Rules, and Component Registry

This document is the single source of truth for every interface, interaction, and component. Every design decision reinforces clarity, data integrity, and trust without looking like a stereotypical government portal. The platform should feel modern, premium, and editorially clean.

---

# Part 1: Core Principles and Golden Rules

## Design Personality

The application should feel:
- Calm, precise, and trustworthy
- Editorially clean (like a quality intelligence publication)
- Information first (content leads, chrome recedes)
- Modern and distinctive (not bureaucratic, not startup flashy)
- Intelligent through data quality, not through decorative AI aesthetics
- Operational where it needs to be (government consoles are dense, citizen views are simple)

The visual personality in two words: **editorial on the surface, operational underneath.**

The UI should feel like a well designed intelligence briefing rather than a generic government portal, a flashy startup dashboard, or an AI wrapper.

## Golden Rules

Every design should:
- Focus on one primary action per screen section
- Reveal complexity progressively (citizen sees simple form, government sees full console)
- Reuse existing shadcn/ui components before creating new ones
- Preserve user context during transitions
- Use motion to explain state changes, not to decorate
- Prioritize readability and scannability of data
- Let the map breathe (generous map containers, not squeezed thumbnails)
- Make Problem DNA feel like a central product object, not a generic card
- Express intelligence through information quality rather than visual decoration

## The Single Color Rule

The platform has ONE primary interactive color: `{colors.primary}` (#4630EB, Expo inspired bright blue).

Blue means: **action, interaction, selection.**

Blue is used for:
- Primary CTA buttons
- Active navigation states
- Selected tabs and filters
- Links
- Focus indicators and rings
- Primary map controls
- Information badges

Blue must remain scarce and meaningful. If blue appears somewhere, the user should understand it as "I can interact with this" or "this is selected." Do not use blue as decoration. Do not introduce a second competing brand color.

There is no secondary brand color. Green, yellow, and red appear only with semantic meaning (success, warning, error). Map visualization colors appear only when representing actual data categories.

---

# Part 2: Design Tokens

Never hardcode colors, spacing, typography, radius values, or shadows. Always use these design tokens.

## Colors

### Primary (Action and Interaction)

* **Primary** (`{colors.primary}`): #4630EB. The single interactive accent. Links, primary CTAs, active states, focus rings, selected tabs, map action buttons.
* **Primary Hover** (`{colors.primary-hover}`): #3A27C8. Hovered interactive elements.
* **Primary Active** (`{colors.primary-active}`): #2E1FA5. Pressed interactive elements.
* **Primary Soft** (`{colors.primary-soft}`): #F0EDFE. Extremely light blue tinted surface for info banners, selected list items, active filter chips, and focus ring backgrounds.
* **On Primary** (`{colors.on-primary}`): #ffffff. Text on primary colored backgrounds.

### Text Ink

* **Ink** (`{colors.ink}`): #161616. All headlines, emphasized body text, and primary labels.
* **Ink Secondary** (`{colors.ink-secondary}`): #525252. Secondary body text, sub headlines, and meta information.
* **Ink Muted** (`{colors.ink-muted}`): #8C8C8C. Helper text, captions, timestamps, and disabled labels.
* **Ink Placeholder** (`{colors.ink-placeholder}`): #a8a8a8. Input placeholders.

### Surfaces

* **Canvas** (`{colors.canvas}`): #ffffff. Default page background.
* **Canvas Soft** (`{colors.canvas-soft}`): #f4f4f4. Alternating section bands, sidebar, table headers, dense operational backgrounds.
* **Canvas Warm** (`{colors.canvas-warm}`): #fafaf9. Optional warm variant for editorial sections on landing pages.
* **Surface Card** (`{colors.surface-card}`): #ffffff. Card backgrounds on canvas-soft or within content areas.
* **Surface Elevated** (`{colors.surface-elevated}`): #f4f4f4. Elevated content on white canvas.
* **Surface Muted** (`{colors.surface-muted}`): #e8e8e8. Disabled surfaces, skeleton loading placeholders.

### Borders

* **Hairline** (`{colors.hairline}`): #e0e0e0. Default borders on cards, inputs, dividers.
* **Hairline Soft** (`{colors.hairline-soft}`): #f0f0f0. Table row dividers, subtle separators.
* **Hairline Strong** (`{colors.hairline-strong}`): #c6c6c6. Stronger visual separation.

### Inverse (Footer and Dark Sections)

* **Inverse Canvas** (`{colors.inverse-canvas}`): #161616. Footer background.
* **Inverse Surface** (`{colors.inverse-surface}`): #262626. Elevated items within dark surfaces.
* **Inverse Ink** (`{colors.inverse-ink}`): #ffffff. Text on dark surfaces.
* **Inverse Ink Muted** (`{colors.inverse-ink-muted}`): #c6c6c6. Secondary text on dark surfaces.

### Semantic (Status Only)

Semantic colors must remain semantic. They are not decorative. They represent system states.

* **Success** (`{colors.semantic-success}`): #24a148. Validated, verified, active, healthy, impact confirmed.
* **Success Soft** (`{colors.semantic-success-soft}`): #defbe6. Success banner backgrounds.
* **Warning** (`{colors.semantic-warning}`): #f1c21b. Needs review, pending, approaching deadline, unverified.
* **Warning Soft** (`{colors.semantic-warning-soft}`): #fef9e0.
* **Error** (`{colors.semantic-error}`): #da1e28. Rejected, failed, critical severity, danger actions.
* **Error Soft** (`{colors.semantic-error-soft}`): #fff1f1.
* **Info** (`{colors.semantic-info}`): #4630EB. Informational badges and banners. Same as primary.
* **Info Soft** (`{colors.semantic-info-soft}`): #F0EDFE.

Rules for semantic colors:
- GREEN appears ONLY when something is verified, validated, successful, or healthy. Not for decoration. Not for branding. Not for environmental topics (use map-accent-teal for that).
- YELLOW appears ONLY for pending states, warnings, and items requiring review.
- RED appears ONLY for errors, rejections, failures, critical severity, and destructive actions.
- BLUE (info) appears for informational context and is shared with the primary interactive color.

### Map Visualization Accents

These are data colors. They represent categories in geographic layers, chart series, and data visualization. They are never UI accent colors.

* **Cyan** (`{colors.map-accent-cyan}`): #1192e8. Water related problems, hydrological data.
* **Teal** (`{colors.map-accent-teal}`): #009d9a. Environment, agriculture, green infrastructure.
* **Purple** (`{colors.map-accent-purple}`): #8a3ffc. Education, institutional markers.
* **Magenta** (`{colors.map-accent-magenta}`): #d02670. Health, population density.

Rules for map colors:
- These colors appear ONLY when representing actual data categories on maps, charts, or visualization layers.
- Never use these colors for buttons, navigation, branding, generic cards, or decorative UI.
- This keeps the meaning of each color intact so users learn to read the map intuitively.

### Focus

* **Focus Ring** (`{colors.focus-ring}`): #4630EB. Visible focus indicator for keyboard navigation. Uses a 2px outline with a subtle `{colors.primary-soft}` background halo.

## Typography

### Font Families

* **Primary Font**: IBM Plex Sans. Open source (SIL OFL), available on Google Fonts, has Devanagari (Hindi) script support. Carries the entire UI hierarchy.
* **Monospace Font**: IBM Plex Mono. For coordinates, status codes, distances, IDs, measurements, technical values, and telemetry data.
* **Fallback Font**: system-ui, Helvetica Neue, Arial, sans-serif

### Why IBM Plex Sans

IBM Plex Sans was designed for enterprise and government screen readability. Its Devanagari support is critical for Jharkhand where Hindi is the primary language. The light weight 300 at large display sizes creates a calm, authoritative presence. The 0.16px letter spacing at body size is a precision detail.

### Type Scale

| Token | Size | Weight | Line Height | Tracking | Use |
|---|---|---|---|---|---|
| display-xl | 60px | 300 | 1.12 | -0.5px | Landing hero, major section openers |
| display-lg | 48px | 300 | 1.17 | -0.4px | Dashboard section headers, page titles |
| display-md | 36px | 300 | 1.22 | 0 | Sub section titles, feature card headers |
| headline | 28px | 600 | 1.29 | 0 | Component group titles, panel headers |
| card-title | 22px | 500 | 1.36 | 0 | Card titles, list headers |
| subhead | 20px | 400 | 1.40 | 0 | Lead body paragraphs near display text |
| body-lg | 18px | 400 | 1.55 | 0 | Hero descriptions, key explanatory text |
| body | 16px | 400 | 1.50 | 0.16px | Default body text |
| body-sm | 14px | 400 | 1.43 | 0.16px | Card body, sidebar items, table cells |
| body-emphasis | 14px | 600 | 1.43 | 0.16px | Selected tabs, emphasized small text |
| caption | 12px | 400 | 1.33 | 0.32px | Timestamps, meta, helper text |
| button | 14px | 500 | 1.29 | 0.16px | All button labels |
| eyebrow | 12px | 500 | 1.33 | 0.32px | Section eyebrows, category labels |
| mono | 14px | 400 | 1.43 | 0 | Coordinates, status codes, IDs, technical values |
| mono-sm | 12px | 400 | 1.33 | 0 | Map overlay data, small telemetry |
| tabular | 16px | 400 | 1.50 | 0 | Precise numeric data in tables (tnum) |
| stat-display | 36px | 300 | 1.22 | 0 | Large human readable dashboard statistics |

### Typography Principles

- Display sizes (36px+) use weight 300 (light). This is the typographic signature. Resist bolding display headlines.
- Body sizes (14px to 18px) use weight 400 with letter-spacing 0.16px.
- Emphasis uses weight 500 or 600, not color changes.
- Headlines use sentence case, not ALL CAPS (except eyebrow labels).
- Maximum line width for body text: 65ch (approximately 540px at 16px).

### Monospace Font Guidance

IBM Plex Mono is for technical precision. Use it when numerical alignment or technical character matters.

**Use IBM Plex Mono for:**
- Geographic coordinates (23.3441, 85.3096)
- Distances (18.4 km)
- UUIDs and record IDs
- Status codes and system values
- Timestamps in technical contexts
- Confidence percentages in analytical panels (91.2%)
- Table columns containing precise measurements

**Use IBM Plex Sans for:**
- Large human readable dashboard statistics (14 Reports, 23 Institutions, 8 Active Problems)
- Summary counts and overview numbers
- Headings that happen to contain numbers
- Numbers in body text
- Severity labels, priority labels
- Any number that is part of a sentence or label

The rule: if the number benefits from column alignment or technical precision, use Mono. If it is a headline or summary stat meant to be read at a glance, use Sans with the `{typography.stat-display}` token.

## Spacing Scale (4px Base Grid)

* XXS: 4px
* XS: 8px
* SM: 12px
* MD: 16px
* LG: 24px
* XL: 32px
* XXL: 48px
* Section: 80px (editorial pages)
* Section Dense: 48px (operational consoles)

### Spacing Principles

- Card internal padding: 24px (LG) for standard cards, 32px (XL) for featured or Problem DNA cards.
- Section vertical spacing: 80px on editorial and public pages. 48px on dense operational consoles.
- Button padding: 10px vertical, 20px horizontal.
- Input padding: 10px vertical, 14px horizontal.
- Sidebar width: 280px.
- Max content width: 1280px.
- Map containers should be generous: minimum 400px height on desktop, full width when possible.

## Shadows and Elevation

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow | Default body text, inline elements |
| 1 (subtle) | 0 1px 3px rgba(0,0,0,0.06) | Cards, dropdowns, popovers |
| 2 (medium) | 0 4px 12px rgba(0,0,0,0.08) | Floating dialogs, modal overlays |
| 3 (elevated) | 0 8px 24px rgba(0,0,0,0.10) | Full modals, toast notifications |

Shadow philosophy: prefer borders over shadows. Cards use 1px hairline borders as their primary depth cue. Shadows are reserved for floating and overlay elements. Never use shadows as decoration.

## Border Radius

| Token | Value | Use |
|---|---|---|
| none | 0px | Horizontal rules, full bleed sections |
| xs | 2px | Inline code, small tags |
| sm | 4px | Confidence bars, small interactive elements |
| md | 6px | Buttons, inputs, dropdowns, small cards |
| lg | 8px | Feature cards, data cards, map containers |
| xl | 12px | Hero cards, modal dialogs, Problem DNA card |
| pill | 9999px | Status badges, filter chips, avatar circles |

### Radius Philosophy

4px to 8px: softened enough to feel modern and approachable, sharp enough to convey precision. No bouncy consumer pill shapes on primary containers. Pill radius is reserved exclusively for status badges, filter chips, and avatar circles.

---

# Part 3: Visual Styling and Layout Rules

These rules define how every screen should be designed. If a UI decision conflicts with this section, these rules win.

## Visual Language

The interface should feel like a well edited intelligence publication: clean white canvas, generous whitespace on public surfaces, operational density on consoles, restrained blue accents, and data presented with editorial care. Visual design supports content instead of competing with it.

## Color Distribution

The interface is predominantly neutral. On any given screen:
- 85 to 90% of pixels should be white, off white, and gray (canvas, surfaces, text)
- 5 to 10% should be ink (black text, dark elements)
- 3 to 5% should be primary blue (interactive elements only)
- 1 to 2% should be semantic colors (only when representing actual states)

If a screen feels "too blue" or "too colorful," something is wrong.

## Layout Structure

Screens must follow a predictable hierarchy:

1. Top navigation bar (56px, white, logo left, navigation center, user actions right)
2. Optional sidebar (280px, canvas-soft background, role based navigation)
3. Page header (display-lg title + breadcrumbs + action buttons)
4. Content area (cards, tables, maps, forms)
5. Footer (inverse canvas, only on public pages)

## Section Rhythm

On editorial and public pages, alternate between white canvas and soft canvas (#f4f4f4) bands to create visual rhythm without color blocks or gradients.

On operational consoles (government, admin), use denser section spacing (48px) and canvas-soft backgrounds for the entire work area, with white cards providing the content containers.

## Information Density by Context

### Editorial Density (public pages, landing, citizen views)
- 80px section spacing
- Generous whitespace
- Large display typography
- Breathing room around maps and key visuals
- Progressive disclosure of complexity

### Operational Density (government console, admin, analyst views)
- 48px section spacing
- Compact card padding (20px instead of 24px where needed)
- Denser table rows
- Side by side panels (map + analysis)
- Multi column filter bars
- Inline actions rather than navigating to new pages

The government console should prioritize the ability to scan, compare, inspect, validate, merge, split, and assign. Do not sacrifice usability just to preserve minimalism.

---

# Part 4: Maps as First Class UI

Maps are not decorative thumbnails. They are primary analytical surfaces.

## Map Container Rules

- Minimum 400px height on desktop. Ideally 50 to 60vh for primary geographic views.
- Full width within their content area.
- Bordered with 1px hairline and 8px radius.
- 24px padding from surrounding content.
- Never squeezed into small card thumbnails for primary geographic views.
- Map controls use the primary blue for active states.

## Problem Fusion Map Layout

The Problem Fusion view should present the map and analytical panel as one integrated decision making interface:

```
┌─────────────────────────────────────────────────────────────────┐
│ Problem Fusion                                    [Filters ▾]  │
├──────────────────────────────┬──────────────────────────────────┤
│                              │                                  │
│         MAP VIEW             │  CANDIDATE SYSTEMIC PROBLEM      │
│                              │                                  │
│    ● ●                       │  Water Supply Instability        │
│     ●●●                      │  Dumka District                  │
│      ●                       │  14 reports                      │
│                              │                                  │
│                              │  ─────────────────────────────   │
│                              │                                  │
│                              │  Confidence Signals              │
│                              │  Semantic     ████████░░  91%    │
│                              │  Geographic   ███████░░░  87%    │
│                              │  Temporal     ██████░░░░  79%    │
│                              │  Domain       █████████░  96%    │
│                              │                                  │
│                              │  ─────────────────────────────   │
│                              │                                  │
│                              │  [Review Candidate]              │
│                              │  [Inspect Reports]               │
│                              │                                  │
└──────────────────────────────┴──────────────────────────────────┘
```

The map panel should take approximately 55 to 60% of the width. The analytical panel should take 40 to 45%. Both should scroll independently if content overflows vertically.

---

# Part 5: Problem DNA as a Visual Core Component

Problem DNA is one of the most important objects in SIH26043. It must NOT be represented as a generic form or card grid. It should feel like a structured intelligence profile: a single document that answers "what exactly are we trying to solve?" before asking "who should solve it?"

## Problem DNA Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  WATER SUPPLY INSTABILITY                                        │
│  Dumka District, Jharkhand                                       │
│                                                                  │
│  14 related reports  ·  3 affected locations  ·  VALIDATED       │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  DOMAIN                        SEVERITY                          │
│  Water Infrastructure          ████████████████░░░░  Critical    │
│                                                                  │
│  TREND                         GEOGRAPHIC SPREAD                 │
│  Growing ↑                     42.3 km                           │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SYMPTOMS                                                        │
│  · Low water pressure in distribution network                    │
│  · Irregular supply schedule (reported 3+ day gaps)              │
│  · Contamination reports near aging pipeline sections            │
│                                                                  │
│  POSSIBLE CAUSES                                                 │
│  · Infrastructure degradation (pipelines older than 15 years)    │
│  · Seasonal water table decline                                  │
│  · Distribution system capacity insufficient for population      │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  REQUIRED CAPABILITIES                                           │
│                                                                  │
│  Water engineering       ██████████████████████  essential       │
│  IoT monitoring          ████████████████░░░░░░  essential       │
│  Field testing           ██████████████░░░░░░░░  important       │
│  Data analysis           ████████████░░░░░░░░░░  important       │
│  Community engagement    ██████████░░░░░░░░░░░░  nice to have   │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  EVIDENCE                                                        │
│  14 citizen reports · 8 photographs · 2 documents                │
│  3 corroborating sources                                         │
│                                                                  │
│  SOURCE                        VERIFIED                          │
│  Citizen reports               2026-08-25                        │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Find Capable Institutions]        [View All Reports]           │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Problem DNA Design Rules

- Uses the `{components.problem-dna-card}` token: 32px padding, 8px radius, 1px hairline border.
- Title uses `{typography.headline}` (28px, weight 600).
- Location and meta use `{typography.body-sm}` with `{colors.ink-secondary}`.
- Section dividers use `{colors.hairline-soft}`.
- Capability bars use `{colors.primary}` fill on `{colors.canvas-soft}` background, 4px radius, 6px height.
- Priority labels (essential, important, nice to have) use `{typography.caption}` with appropriate semantic coloring.
- The component should feel like a one page intelligence briefing: dense enough to be useful, structured enough to be scannable.

---

# Part 6: UI Component Registry

Always use these component structures. Import from shadcn/ui for all interactive primitives.

## Buttons

* **button-primary**: Background `{colors.primary}`, text `{colors.on-primary}`, rounded `{rounded.md}` (6px), padding 10px 20px. The blue CTA. Confident but compact. Use sparingly.
* **button-secondary**: Background `{colors.canvas}`, text `{colors.ink}`, 1px border `{colors.hairline}`, rounded `{rounded.md}`, padding 10px 20px.
* **button-ghost**: Transparent background, text `{colors.primary}`, rounded `{rounded.md}`. For tertiary actions and links styled as buttons.
* **button-danger**: Background `{colors.semantic-error}`, text `{colors.on-primary}`, rounded `{rounded.md}`. Exclusively for destructive actions.

Button rules:
- No oversized pill buttons
- No gradients on buttons
- No glowing or glass effects
- No excessive shadows
- Buttons should feel precise and compact

## Cards

* **feature-card**: Background `{colors.surface-card}`, 1px border `{colors.hairline}`, rounded `{rounded.lg}` (8px), padding 24px.
* **stat-card**: Same structure as feature-card. Large stat number uses `{typography.stat-display}` (IBM Plex Sans, 36px, weight 300). Label uses `{typography.caption}`.
* **problem-dna-card**: Background `{colors.surface-card}`, 1px border `{colors.hairline}`, rounded `{rounded.lg}`, padding 32px. The most structurally rich card in the system.
* **map-container**: Background `{colors.canvas}`, 1px border `{colors.hairline}`, rounded `{rounded.lg}`, zero internal padding.

Card rules:
- No glassmorphism
- No gradient backgrounds
- No giant rounded containers
- No excessive shadows
- No colorful card backgrounds
- Hierarchy comes from typography, spacing, borders, surface changes, and information structure

## Tables

* **data-table**: Background `{colors.canvas}`, rounded `{rounded.lg}`, header row `{colors.canvas-soft}`, row dividers `{colors.hairline-soft}`, cell padding 12px 16px, body-sm typography. Numeric columns use `{typography.tabular}` (IBM Plex Mono with tnum) only when precision alignment matters.

## Inputs

* **text-input**: Background `{colors.canvas}`, 1px border `{colors.hairline}`, rounded `{rounded.md}`, padding 10px 14px. Focus state: 2px border `{colors.primary}`, subtle `{colors.primary-soft}` background ring.

## Status Badges

* **badge-success**: Background `{colors.semantic-success-soft}`, text `{colors.semantic-success}`, rounded `{rounded.pill}`, caption typography.
* **badge-warning**: Background `{colors.semantic-warning-soft}`, text #946500, rounded `{rounded.pill}`.
* **badge-error**: Background `{colors.semantic-error-soft}`, text `{colors.semantic-error}`, rounded `{rounded.pill}`.
* **badge-info**: Background `{colors.primary-soft}`, text `{colors.primary}`, rounded `{rounded.pill}`.
* **badge-neutral**: Background `{colors.canvas-soft}`, text `{colors.ink-secondary}`, rounded `{rounded.pill}`.

## Confidence Bars

* **confidence-bar**: Background `{colors.canvas-soft}`, fill `{colors.primary}`, rounded `{rounded.sm}` (4px), height 6px. Used in Problem Fusion to show semantic, geographic, temporal, and domain confidence signals.

## Navigation

* **top-nav**: Background `{colors.canvas}`, 1px bottom border `{colors.hairline}`, height 56px. Active navigation item uses `{colors.primary}` text color.
* **sidebar**: Background `{colors.canvas-soft}`, width 280px. Active sidebar item uses `{colors.primary-soft}` background and `{colors.primary}` text.

## Footer

* **footer**: Background `{colors.inverse-canvas}`, text `{colors.inverse-ink-muted}`, padding 64px 32px. Only on public and landing pages.

---

# Part 7: Trust and Provenance Visual Language

The platform deals with real societal problems. The visual system must reinforce data integrity and provenance.

## Provenance Indicators

When data has a verifiable source, surface it clearly:

```
Source: UGC University Directory
Retrieved: 2026-08-15
Verified: 2026-08-20
Status: ✓ Verified
```

Use `{typography.caption}` for provenance metadata. Use `{colors.ink-muted}` for labels and `{colors.ink-secondary}` for values. Use semantic badge colors for verification status.

## Confidence Transparency

When the system shows a confidence score (like 91% semantic similarity), the user should be able to inspect what contributed to that score. Scores should never be opaque numbers.

Display confidence as:
- A labeled bar (confidence-bar component) showing the percentage visually
- The contributing factors listed individually (semantic, geographic, temporal, domain)
- The ability to drill into the underlying data

## Evidence Counts

Evidence should always be quantified: "14 citizen reports, 8 photographs, 2 documents." Never say "multiple sources" when you can say exactly how many.

---

# Part 8: Anti Decoration Rules

## No Generic AI Visual Language

The product is AI assisted, but it should NOT look like an AI wrapper. AI appears as infrastructure inside the workflow, not as visual decoration.

Do NOT add:
- Glowing purple or blue gradients
- Neural network background illustrations
- Robot or AI assistant illustrations
- Magic wand icons on every feature
- "AI POWERED" badges plastered across the interface
- Animated particles or floating orbs
- Generic AI stock imagery
- Pulsing or glowing effects around AI features

The interface communicates intelligence through the quality and structure of the information presented, not through decorative AI aesthetics.

## No Decorative Color

Do NOT:
- Use semantic colors for decoration (green cards, red headers)
- Use map visualization colors for UI accents
- Use gradient backgrounds on content sections
- Use colorful backgrounds on cards
- Introduce new accent colors beyond the primary blue
- Use the primary blue as a card background or section background

The product should look predominantly white, gray, and black, with restrained blue interaction signals and semantic colors appearing only when they represent actual system states.

---

# Part 9: Role Based Layout Variations

## Citizen View

Simple, form driven interface. Generous spacing, large text inputs, clear submit button, progress tracker for report status. Minimal navigation. No sidebar. Very low cognitive load.

The citizen should never feel overwhelmed by the system's complexity. They see a simple form and a status tracker. Nothing more.

**Density**: Editorial (80px sections, generous padding, large inputs)

## Government Console

Full dashboard layout with sidebar navigation. Dense data tables, map views, validation consoles, and analytics. Uses the full component vocabulary: stat-cards, data-tables, status badges, map containers, confidence bars, and Problem DNA cards.

The government console should prioritize the ability to scan, compare, inspect, validate, merge, split, and assign. This is the most complex view, but clarity comes from structure rather than decoration.

**Density**: Operational (48px sections, compact cards, side by side panels)

## Institution Portal

Profile focused layout. Capability listings with source provenance, department information, student overview. Card heavy with structured data. Map showing institution location and service radius.

**Density**: Moderate (mixed editorial and operational)

## Student Portal

Clean profile and team dashboard. Skills and interests as tag lists (using neutral badges). Project cards with milestone progress. Collaborative team view.

**Density**: Clean and moderate

## Industry Portal

Organization profile with capability listings. Challenge browse view. Partnership status tracking.

**Density**: Moderate

## Admin Console

Dense operational view. User management tables, audit log viewer, data ingestion status, system health. Uses the most compact token variants (body-sm, caption, 48px section spacing).

**Density**: Operational (densest view in the system)

---

# Part 10: Responsive Behavior and Breakpoints

## Breakpoints

* **Desktop XL (1440px)**: Full layout with sidebar + content + optional analytical panel.
* **Desktop (1280px)**: Standard layout, sidebar + content.
* **Tablet (960px)**: Sidebar collapses to overlay. Card grids 3-up become 2-up. Map and analysis panel stack vertically.
* **Mobile (768px)**: Single column. Navigation becomes hamburger overlay. Touch targets strictly 44px minimum.

## Map Responsiveness

- Maps remain full width and usable on all viewports.
- On mobile, maps use minimum 300px height (not thumbnail size).
- On tablet, the Problem Fusion split layout (map + analysis) stacks vertically with the map on top.
- Never hide a critical geographic relationship simply because the viewport is small.

## Responsive Rules

- DO: Use fluid typography for display sizes (clamp between mobile and desktop values).
- DO: Maintain 44px minimum touch targets on mobile.
- DO: Stack sidebar content above the main content on mobile.
- DO: Let maps remain full width on all viewports.
- DO NOT: Hide critical map views behind tabs on mobile.
- DO NOT: Use horizontal scrolling tables on mobile without clear scroll indicators.
- DO NOT: Reduce body text below 14px on any viewport.

---

# Part 11: Motion and Animation

## Motion Philosophy

Motion should explain, not decorate. Every animation should answer "where did this come from?" or "what just changed?" If the animation does not communicate information, remove it.

## Motion Standards

- **Framework**: CSS transitions for simple state changes. Framer Motion for layout animations, page transitions, and complex interactions.
- **No GSAP** unless `/istm-animate` or `/istm-awwward-designer` is explicitly invoked.
- **Duration scale**: Fast (150ms) for hover/focus. Medium (250ms) for element entry. Slow (400ms) for page transitions and modal entry.
- **Easing**: ease-out for entries, ease-in for exits, ease-in-out for layout shifts. Use cubic-bezier(0.16, 1, 0.3, 1) for smooth content reveals.
- **Reduced motion**: Always respect prefers-reduced-motion. Disable all non-essential animation when this preference is active.
- **Skeleton loading**: Use shimmer skeletons (not circular spinners) for all loading states.

## Permitted Animations

- Subtle fade in with translateY(8px) for content entering the viewport
- Smooth expand/collapse for accordion items, sidebar sections, and filter panels
- Count transitions (numbers animate smoothly, not jump)
- Map marker pulse for new or active items
- Staggered list item reveals (80ms delay increment)
- Toast notification slide in from top right
- Confidence bar fill animation on initial render
- Panel transitions when switching between map candidates

## Prohibited Animations

- Scroll jacking
- Parallax effects
- Bouncing or pulsing UI elements
- Continuous rotation or looping animations
- Decorative floating blobs or particles
- Page transitions longer than 400ms
- Any animation that blocks user interaction
- Glowing or pulsing AI effects

---

# Part 12: Design Verification Checklist

Before considering any screen complete, verify:

1. Does the interface feel predominantly neutral (white, gray, black)?
2. Does blue clearly mean action/selection and nothing else?
3. Does the interface avoid looking like a generic government portal?
4. Does the government console feel operational enough for real decision making?
5. Are maps genuinely first class (generous size, not thumbnails)?
6. Does Problem DNA feel like a central product object (structured briefing, not a generic card)?
7. Are AI features represented through useful information rather than decoration?
8. Are semantic colors reserved strictly for semantic meaning?
9. Are typography and spacing consistent with the token definitions?
10. Does the product feel distinctive without becoming visually loud?
11. Is data provenance visible where it matters?
12. Can confidence scores be inspected, not just read as opaque numbers?
13. Are role based density levels appropriate (simple for citizens, dense for government)?
14. Is IBM Plex Mono used only where technical precision benefits from it?

If any answer is no, refine the existing design rather than adding decoration.
