# Business Plan: White-Label Dental Clinic Automation (PT)

**Status:** Pre-seed / Idea stage  
**Market:** Portugal  
**Model:** White-label automation platform for dental clinics, sold and managed in partnership with wSy  
**Date:** June 2026

---

## Overview

The goal is to productize and scale what wSy currently delivers manually or semi-manually into a structured, repeatable white-label system. BQ acts as the operational and structural backbone (legal, finance, infrastructure, hiring) while the founding team handles sales, integration management, dev oversight, and customer support. No upfront financial investment from BQ — involvement kicks in once a paying client is confirmed.

**Stack decision:** Automations run on **Manychat** (WhatsApp, Instagram, and email). The clinic-facing **dashboard is Notion** — contacts, pipeline status, appointments log, and onboarding docs. A thin custom layer (landing page + API glue) connects lead capture to both systems.

---

## Business Model

**Revenue per client:**
- Setup fee: €2,000 to €5,000 (50% upfront, 50% on go-live)
- Monthly retainer: €300 to €1,500/month depending on clinic size, volume, and features

**Cost structure:**
- 1 developer (part-time) for landing page, Notion templates, and integration glue — hired through BQ at €15 to €20/hour
- Manychat **Business** subscription per clinic (~$69/mo billed annually, ~€65/month) — required for WhatsApp + Instagram + email on unlimited channels; includes 7,500 active contacts/month
- Notion workspace (team plan or per-seat, low cost at this scale)
- BQ infrastructure and back-office (no direct cost, part of partnership)
- Sales and integration managed internally (founding team)

**Break-even estimate:** 2 to 4 active clients on retainer (lower dev capex than a full custom build)

---

## Product Scope

The platform automates five core workflows for dental clinics:

1. Instant lead response (under 60 seconds via WhatsApp, Instagram, email, website)
2. Quote follow-up sequences (3-message drip over 7 days)
3. Patient reactivation (inactive for 12+ months)
4. No-show reduction (automated reminders at 48h, 24h, and 2h)
5. Google review automation (triggered post-appointment)

All workflows are configured in **Manychat** per clinic. Pipeline visibility, contact records, and operational notes live in **Notion** — the dashboard clinics use day to day. Everything is presented under the wSy brand (white-label). Onboarding a new clinic means duplicating the Notion template and cloning the Manychat flow set, not building custom software.

---

## Phases

### Phase 0: Validation and Partnership Setup
**Duration:** 3 to 4 weeks  
**Cost:** €0 (time only)

- Confirm partnership terms with wSy in writing
- Align with BQ on legal structure, hiring process, and back-office support
- Confirm stack: **Manychat** (messaging) + **Notion** (dashboard) + existing landing page (lead capture)
- Open Manychat and Notion accounts; validate WhatsApp Cloud API and Instagram DM requirements with a test number
- Identify first target clinic (warm lead or wSy existing contact)
- Define MVP scope: which of the 5 workflows to launch first

**Milestone:** Signed partnership agreement, stack validated, first prospect identified

---

### Phase 1: MVP Build
**Duration:** 4 to 6 weeks  
**Cost:** €900 to €1,800

Assumes 1 developer at €15 to €20/hour working part-time (~60 to 90 hours total). Custom backend and React dashboard are out of scope.

Deliverables:
- **Notion clinic template** — contacts database (Name, Email, Phone, Website, Instagram, Source, Status, Notes), pipeline views, appointment log, settings page
- **Manychat flows** — instant lead reply, basic quote follow-up (3 messages), WhatsApp + Instagram + email connected (Business plan)
- **Landing page integration** — form submissions sync to Notion (already built); optional tag/sync into Manychat subscriber list
- **Onboarding checklist** — step-by-step for connecting a new clinic's channels and duplicating templates

**Milestone:** MVP ready to demo to first client

---

### Phase 2: First Client Onboarding
**Duration:** 2 to 3 weeks  
**Cost:** Covered by client setup fee (€2,000 to €5,000)

- Discovery call and clinic audit
- Duplicate Notion workspace and Manychat flows for the clinic
- Configure automations to clinic's workflow and message copy
- Connect clinic's channels (WhatsApp Business, Instagram DMs, clinic email domain in Manychat)
- Train clinic staff on the Notion dashboard
- Test and soft-launch with clinic team
- Collect feedback and document learnings

**Revenue:** €1,000 to €2,500 upfront (50% of setup fee)  
**Milestone:** First client live and paying retainer

---

### Phase 3: Stabilise and Iterate
**Duration:** 3 to 5 weeks  
**Cost:** €400 to €800/month (ongoing dev support, lighter than custom stack)

- Fix bugs and edge cases from first client
- Build remaining Manychat flows (reactivation, no-show reminders, review automation)
- Refine Notion views (filters, status automation where possible via Notion API or manual SOP)
- Document integration playbook so future onboardings take under 2 days of config work
- Define SLA and support process

**Milestone:** All 5 workflows live, onboarding time reduced to under 10 business days

---

### Phase 4: Scale to 5 Clients
**Duration:** 2 to 3 months  
**Cost:** €600 to €1,200 in dev costs (part-time ongoing — mostly template maintenance)

- Run sales outreach to dental clinics in PT (direct + via wSy network)
- Onboard 4 additional clients using the playbook (duplicate Notion + Manychat, connect channels)
- Introduce tiered pricing based on clinic size and Manychat active-contact volume (Business plan overage: ~$0.025/contact above 7,500/month)
- Evaluate whether a second integrator (non-dev) can handle onboarding before hiring a second developer

**Revenue target:** €1,500 to €7,500/month in recurring retainers by end of phase  
**Milestone:** 5 active clients, positive monthly cash flow

---

## Team and Roles

| Role | Who | Time Commitment |
|---|---|---|
| Sales and Business Development | Founding team | Full focus |
| Integration Management | Founding team | Per client onboarding |
| Customer Support | Founding team | Ongoing |
| Development and integrations | Hired through BQ | Part-time, €15 to €20/h |
| Legal and Finance | BQ | As needed |
| Infrastructure and Back-office | BQ | As needed |

---

## Cost Summary

| Phase | Duration | Estimated Cost |
|---|---|---|
| Phase 0: Validation | 3 to 4 weeks | €0 |
| Phase 1: MVP Build | 4 to 6 weeks | €900 to €1,800 |
| Phase 2: First Client | 2 to 3 weeks | Covered by setup fee |
| Phase 3: Stabilise | 3 to 5 weeks | €400 to €800/month |
| Phase 4: Scale to 5 clients | 2 to 3 months | €600 to €1,200 total |

**Total estimated investment before positive cash flow:** €1,500 to €3,500 (largely recovered from first 1 to 2 setup fees)

---

## Risks and Mitigations

**PT market size:** Smaller than NL but dental shortage is less acute, meaning clinics compete more for patients and are more receptive to lead automation. Validate with wSy's existing contacts before heavy investment.

**Crowded tooling (NL precedent):** Bram flagged this is commoditised in NL. Defensibility in PT comes from local language support, personal service, and wSy's existing relationships, not from the tech alone. Manychat + Notion is intentionally not bespoke — the moat is execution and onboarding speed.

**Platform dependency (Manychat / Notion):** Pricing changes, API limits, or policy shifts affect all clients. Mitigate by documenting export paths (Notion CSV, Manychat subscriber export) and keeping the integration layer thin so a future migration is painful but possible.

**CRM/EHR integration complexity:** Full EHR integration is out of scope for MVP. Notion acts as a lightweight CRM alongside whatever the clinic already uses. Add deeper integrations only based on client demand.

**Dependency on wSy:** If the wSy partnership falls through, the model still works with direct clinic sales, just slower. Keep relationship structured but not exclusive from day one.

---

## Next Steps (Immediate)

1. Reply to Bram with updated budget estimate (Manychat + Notion stack) and BQ role definition
2. Schedule a call with wSy founder to align on partnership structure and Notion dashboard layout
3. Create a Manychat account on the **Business** plan (annual) and connect test WhatsApp, Instagram, and email channels
4. Finalise the Notion clinic template (extend the existing leads database schema)
5. Identify one warm prospect clinic to target for Phase 2
