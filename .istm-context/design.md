---
version: alpha
name: Coinbase-Institutional-Design-System
description: An institutional civic intelligence platform inspired by Coinbase. Quiet, white canvas, editorially spaced, and almost monochromatic. The single brand action voltage is Coinbase Blue (#0052ff) used scarcely for primary CTA pills, brand identity, and inline accent links. Typography pairs Inter at modest display weight 400 with JetBrains Mono for all numeric telemetry and data tables. The design rotates between bright white canvas, soft gray elevation bands (#f7f7f7), and deep near black dark heroes (#0a0b0d) carrying floating product UI mockup cards.

colors:
  primary: "#0052ff"
  primary-active: "#003ecc"
  primary-disabled: "#a8b8cc"
  accent-yellow: "#f4b000"
  canvas: "#ffffff"
  surface-soft: "#f7f7f7"
  surface-strong: "#eef0f3"
  surface-dark: "#0a0b0d"
  surface-dark-elevated: "#16181c"
  hairline: "#dee1e6"
  hairline-soft: "#eef0f3"
  ink: "#0a0b0d"
  body: "#5b616e"
  body-strong: "#0a0b0d"
  muted: "#7c828a"
  muted-soft: "#a8acb3"
  on-primary: "#ffffff"
  on-dark: "#ffffff"
  on-dark-soft: "#a8acb3"
  semantic-up: "#05b169"
  semantic-down: "#cf202f"

typography:
  display-mega:
    fontFamily: "'Inter', -apple-system, system-ui, sans-serif"
    fontSize: 80px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: -2px
  display-xl:
    fontFamily: "'Inter', sans-serif"
    fontSize: 64px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: -1.6px
  display-lg:
    fontFamily: "'Inter', sans-serif"
    fontSize: 52px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: -1.3px
  display-md:
    fontFamily: "'Inter', sans-serif"
    fontSize: 44px
    fontWeight: 400
    lineHeight: 1.09
    letterSpacing: -1px
  display-sm:
    fontFamily: "'Inter', sans-serif"
    fontSize: 36px
    fontWeight: 400
    lineHeight: 1.11
    letterSpacing: -0.5px
  title-lg:
    fontFamily: "'Inter', sans-serif"
    fontSize: 32px
    fontWeight: 400
    lineHeight: 1.13
    letterSpacing: -0.4px
  title-md:
    fontFamily: "'Inter', sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: 0
  body-md:
    fontFamily: "'Inter', sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: "'Inter', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  mono-number:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  button:
    fontFamily: "'Inter', sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  pill: 100px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  base: 16px
  md: 20px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px
---

# CivicPulse Coinbase-Style Design System

This design system models institutional trust, editorial calm, and clear operational data.

## 1. Visual Foundation
- **Single Brand Voltage**: Coinbase Blue (`#0052ff`). Primary CTA pills, brand wordmark, and key focus rings.
- **Display Typography**: Inter at weight 400 (light and calm, never aggressive bold) with negative tracking.
- **Geometry**: Pills (`rounded-full`) for buttons and badges, generous 24px rounded corners (`rounded-3xl` / `rounded-2xl`) for cards.
- **Section Rhythm**: Generous 96px section padding alternating between crisp white, soft gray (`#f7f7f7`), and dark editorial canvas (`#0a0b0d`).
- **Telemetry & Numbers**: JetBrains Mono for tabular metrics, confidence percentages, and coordinates.
