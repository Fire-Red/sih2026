---
version: 5.0.0
name: Civic White (Light Mode)
description: A pure white, Apple-gallery civic intelligence platform. Stark white canvas, deep ink hierarchy, single Electric Indigo interactive color (#4630eb), hairline borders, zero gradients, zero decorative shadows. Government-grade authority through typography and whitespace alone.

colors:
  canvas: "#ffffff"
  surface-inset: "#f5f5f7"
  surface-raised: "#ffffff"
  ink-strong: "#0f172a"
  ink-body: "#334155"
  ink-caption: "#64748b"
  ink-muted: "#94a3b8"
  border: "#e5e7eb"
  border-soft: "#f0f0f2"
  primary: "#4630eb"
  primary-deep: "#3924c7"
  primary-press: "#2e1e9f"
  primary-soft: "#ebe8fd"
  primary-subdued: "#f5f3ff"
  on-primary: "#ffffff"
  success: "#16a34a"
  warning: "#d97706"
  error: "#dc2626"

typography:
  display:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  heading:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "-0.01em"
  caption:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0"

geometry:
  control: "8px"
  card: "12px"
  feature: "16px"
  pill: "9999px"

elevation:
  flat: "No shadow, no border"
  hairline: "1px border-border"
  raised: "1px border + shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]"
  float: "backdrop-blur(16px) + semi-transparent bg"

motion:
  interaction: "120ms ease-out"
  reveal: "200ms cubic-bezier(0.16, 1, 0.3, 1)"
  rule: "No GSAP. No scroll-jacking. Respect prefers-reduced-motion."
---

# Civic White Design System (v5.0.0)

## Aesthetic Philosophy

Pure white canvas inspired by Apple's gallery-silence and Antigravity's stark clarity. The platform achieves authority through typography hierarchy, generous whitespace, and a single Electric Indigo accent color. Every element earns its pixel. No gradients, no decorative shadows, no glassmorphism.

## Color Principles

- **Canvas**: Pure white `#ffffff`. Not warm, not tinted. Stark and authoritative.
- **Inset surfaces**: Apple parchment `#f5f5f7` for sunken wells, table backgrounds, sidebar backgrounds.
- **Single interactive color**: Electric Indigo `#4630eb`. Used only for primary CTAs, active states, links, and focus rings.
- **Semantic colors**: Green, amber, red appear only to convey factual status (verified, pending, critical).
- **No decorative color**: No secondary brand color. No gradient. No colored cards.

## Routing Principles

- Government review uses dedicated routes (`/government/manage/[id]`), not modals.
- Problem detail uses a full page route, not an inline expansion.
- All primary flows navigate to new pages. Modals reserved only for confirmation dialogs.

## Component Rules

1. Cards: White surface, 12px radius, 1px border. No shadow.
2. Buttons: Pill radius (rounded-full), 14px text, weight 500.
3. Tables: Clean data tables for lists. No card grids for data sets.
4. Status: Compact mono pills with semantic backgrounds.
5. Icons: Lucide React only. 16px default. 1.5px stroke.
