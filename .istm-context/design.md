---
version: 4.1.0
name: Expo Notion Minimal (Light Mode)
description: A clean, calm light mode interface blending Expo clarity and telemetry precision with Notion warm minimalist paper aesthetics. It features one indigo interactive color (#4630eb), warm canvas tone (#fbfaf7), crisp ink hierarchy, and quiet hairline dividers.

colors:
  canvas: "#fbfaf7"
  surface: "#ffffff"
  surface-soft: "#f3f1ec"
  ink: "#172033"
  ink-secondary: "#3e495d"
  ink-muted: "#687386"
  border: "#e6e3dd"
  border-soft: "#efede8"
  primary: "#4630eb"
  primary-hover: "#3924c7"
  primary-pressed: "#2e1e9f"
  on-primary: "#ffffff"
  warm-accent: "#f3dfc7"
  success: "#27865d"
  warning: "#b88635"
  error: "#c93652"

typography:
  display:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(2.8rem, 7vw, 5.5rem)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.065em"
  heading:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 3rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.045em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  caption:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
  data:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4

geometry:
  control: "0.625rem"
  card: "0.875rem"
  feature: "1.25rem"
  pill: "9999px"

motion:
  interaction: "140ms ease-out"
  reveal: "220ms cubic-bezier(0.22, 1, 0.36, 1)"
  rule: Fast, discrete transitions. No sluggish animations. Respect prefers-reduced-motion.
---

# Expo Notion Minimal Design System (Light Mode)

## Aesthetic Philosophy

The platform pairs **Expo developer precision** (functional telemetry tags, crisp monospace accents, sharp data density, single electric indigo accent `#4630eb`) with **Notion warm minimalism** (tactile paper off-white canvas `#fbfaf7`, calm sans-serif typography, quiet hairline dividers `#e6e3dd`, and structured clean layout blocks).

The user experience feels like an intelligent, high-trust civic field notebook: minimal, effortless to read, uncluttered, and free from noise or fake decorative elements.

## Color Principles

- **Canvas**: Warm paper tone `#fbfaf7` (never harsh pure white `#ffffff` as full-screen canvas, and never dark mode backgrounds).
- **Surfaces**: Crisp white `#ffffff` cards sitting quietly on `#fbfaf7` canvas with hairline `#e6e3dd` borders.
- **Single Interactive Color**: Electric Indigo `#4630eb`. Used exclusively for key actions, interactive selections, focused states, and primary CTAs.
- **Semantic Accents**: Green (`#27865d`), Amber (`#b88635`), and Crimson (`#c93652`) appear strictly to convey actual domain statuses (verified, pending, critical).
- **No Emojis**: Always use Lucide icons with 1.5px stroke weights.

## Component and Card Rules

1. **Quiet Cards**: Cards are solid `#ffffff` or muted `#f3f1ec` with subtle borders (`border-border`). No heavy drop shadows.
2. **Telemetry Badges**: Use compact monospace pills for status indicators (`font-mono text-xs uppercase`).
3. **Buttons**: Primary buttons use `#4630eb` with white text. Secondary buttons use clean bordered surfaces with subtle hover transitions.
4. **Forms & Input**: Clean inputs with hairline neutral borders that cleanly highlight with an indigo ring on focus.
5. **No Clutter**: Avoid unnecessary decorative gradients, mesh overlays, or floating neon widgets. Keep every element purposeful.
