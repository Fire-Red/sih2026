# SIH26043 — Societal Problem Intelligence and Collaboration Platform

Public interface copy must remain location neutral. Keep regional scope inside operational data views only, never in general page headings, navigation, metadata, or promotional copy.

## Product Name

SIH26043 (working title: JharkhandConnect or to be named later)

---

# Vision

Turn scattered community reported problems into validated systemic problems, identify what capabilities are required to solve them, connect those capabilities across universities, students, labs and industry, manage the resulting project, and eventually verify its impact.

This is not a chatbot. Not a resume analyzer. Not a university recommender. Not a generic SaaS dashboard. It is a platform that treats the problem itself as a structured object with a lifecycle, from citizen report to verified impact.

The Government of Jharkhand (SIH problem statement 26043) explicitly asks for citizen and community challenge submission, AI enabled categorization and prioritization and deduplication and routing, university collaboration, multidisciplinary student and faculty teams, industry participation, project lifecycle management, government dashboards, analytics, and notifications.

---

# Problem Statement

The current process for identifying, validating, and solving societal problems in Jharkhand is fragmented. Citizens report issues to different departments. Reports are not connected. The same systemic problem might appear as dozens of isolated complaints across different districts. Nobody systematically identifies which institutions have the capabilities to address these problems. Nobody tracks whether solutions actually worked.

Examples:
- 20 people in Dumka report water supply issues separately. Nobody connects these into one systemic water infrastructure problem.
- A university 18 km away has civil engineering and water management capabilities. A startup 60 km away has IoT sensor deployment expertise. Nobody knows both exist for the same problem.
- A previous water purification pilot in Ranchi solved a similar problem. Nobody remembers it when Dumka faces the same issue.
- A government department approves a project. Months later, nobody measures whether the intervention actually improved water supply.

The platform solves this by creating a structured intelligence pipeline from report to impact.

---

# Solution

The core conceptual flow:

Community Report
↓
Problem Normalization
↓
Problem Fusion (multi signal: semantic, geographic, temporal, domain)
↓
Candidate Systemic Problem
↓
Government Validation
↓
Structured Problem Profile (Problem DNA)
↓
Required Capabilities
↓
Location + Capability Search
↓
University / Student / Lab / Industry Capability Assembly
↓
Official Challenge
↓
Proposal
↓
Project
↓
Prototype
↓
Pilot
↓
Deployment
↓
Impact Verification
↓
Solution Memory

A core Problem Report entity contains:
- Title and description
- Location (coordinates, district)
- Category
- Evidence (images, videos, documents)
- Affected population information
- Severity
- Status and lifecycle

A Problem DNA (systemic problem profile) contains:
- Domain and subdomain
- Symptoms and possible causes
- Affected locations and population
- Severity and trend
- Evidence
- Stakeholders
- Required capabilities
- Current status

The platform answers: "What exactly are we trying to solve?" before it asks "Who should solve it?"

---

# Target Audience

Primary Users:
- Citizens and communities (problem reporters, evidence contributors)
- Government officials and departments (validators, decision makers, monitors)
- Universities and Higher Education Institutions (capability providers, research partners)
- Students (skill contributors, team members, project workers)

Secondary Users:
- Industry, startups, MSMEs, CSR organizations (technology and deployment partners)
- Research labs and innovation centres (specialized capability providers)
- Platform administrators (system operators, data integrity managers)

---

# Core User Journey: Citizen to Systemic Problem

Citizen submits a problem report with location, description, evidence
↓
System normalizes, embeds, and checks for related existing reports (Problem Fusion)
↓
System surfaces candidate systemic problems with confidence scores
↓
Government official reviews and validates (or rejects, or splits)
↓
Validated systemic problem gets a Problem DNA profile with required capabilities

---

# Secondary User Journey: Problem to Solution

Government publishes a validated challenge with required capabilities
↓
System searches institutions by capability fit and geographic practicality
↓
Capability assembly shows combined coverage and gaps across institutions, students, industry
↓
Teams form, proposals are submitted and reviewed
↓
Project lifecycle: milestones, prototype, pilot, deployment
↓
Impact verification: baseline, intervention, measurement, government and community verification
↓
Solution Memory stores the verified approach for future reuse

---

# Primary Screens

1. Citizen Report Submission
2. Problem Report Tracker (citizen view)
3. Problem Fusion Dashboard (analyst and government view)
4. Government Validation Console
5. Problem Radar (government executive dashboard)
6. Capability Assembly View
7. Challenge and Project Lifecycle Dashboard
8. Impact Verification Dashboard
9. Solution Memory Browser
10. Institution Profile
11. Student Profile and Team Dashboard
12. Admin Console

---

# Citizen Report Submission Screen

Purpose:
Allow any citizen to report a local problem with structured information.

Contains:
- Title input
- Description textarea
- Location selector (map picker, district dropdown, or GPS)
- Category selector (Water, Roads, Education, Health, Agriculture, Environment, Sanitation, etc.)
- Severity selector (low, medium, high, critical)
- Affected population estimate
- Evidence upload (images, videos, documents via ImageKit)
- Submit button
- No AI needed for submission. Simple form with validation.

---

# Problem Fusion Dashboard

Purpose:
Show how individual reports cluster into candidate systemic problems, with multi signal confidence scoring.

Contains:
- Map view showing report locations and clusters
- List of candidate systemic problems with report counts
- Confidence breakdown per candidate: semantic similarity, geographic proximity, temporal correlation, domain match
- "High confidence" auto grouped, "medium confidence" needs review, "low confidence" stays separate
- Link to individual reports within each cluster
- Actions: validate, reject, split, merge

This is the most critical analytical view.

---

# Government Validation Console

Purpose:
Government officials review candidate systemic problems and make decisions.

Contains:
- Candidate systemic problem with supporting evidence
- All contributing reports on a map
- Problem DNA editor (domain, subdomain, symptoms, causes, required capabilities)
- Actions: validate, reject, split, merge, escalate, assign priority
- Validation history and audit trail

The layout should feel like a command and control decision interface. Not a generic database table.

---

# Problem Radar (Government Executive Dashboard)

Contains:
- Emerging problems: growing, stable, shrinking, spreading
- Geographic distribution map with severity heat
- Domain trend charts (Water, Roads, Health, etc.)
- Challenge portfolio: validated, assigned, research, prototype, pilot, deployed, blocked
- Impact map: interventions, baselines, outcomes, verification status
- Institution participation overview
- Industry participation overview
- Project progress summary

---

# Empty State Philosophy

Empty states are opportunities. They should feel: informative, guiding, warm. Every empty state uses elegant typography, clean spacing, a Lucide icon, and a primary CTA. No emojis. No stock illustrations. Code only, CSS driven, with SVG icons.

---

# Future Features

Not MVP:
- Multi state expansion beyond Jharkhand
- Mobile native applications (iOS, Android)
- Real time collaboration within project teams
- Advanced NLP for non English and non Hindi reports
- Public API for third party integrations
- Advanced analytics and predictive modelling for problem trends
- Automated data refresh from official government APIs

These features are intentionally excluded from the initial build.

---

# Success Metric

The platform succeeds when a government official can answer: "If 20 different people report related problems, can the system discover that they may represent one systemic issue, explain why, and identify nearby institutions with the capabilities required to investigate it?" without guessing.

---

# Progress Tracker Log

## 2026-08-28

### Completed

- Hydrated project overview with all SIH26043 requirements
- Locked tech stack decisions
- Defined all 7 user roles and their purpose
- Defined complete product flow from citizen report to solution memory

### Verification

- (AI will dynamically log verifications here)

### Notes

- design.md deferred, will be created separately
- Jharkhand is the initial scope (20 to 50 institutions, 50 to 100 synthetic reports)
