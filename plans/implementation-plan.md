# Implementation Plan: Dental Clinic Automation Platform

**Version:** 2.0  
**Stack:** Manychat (messaging automations) + Notion (clinic dashboard) + Next.js landing page (lead capture)  
**Target:** White-label automation SaaS for dental clinics in Portugal  
**Estimated total hours:** 70 to 110h (1 developer, part-time)

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    Clinic Dashboard (Notion)                 │
│   Contacts · Pipeline · Appointments · Settings · Playbooks  │
└────────────────────────────┬─────────────────────────────────┘
                             │ Notion API (leads, status updates)
┌────────────────────────────▼─────────────────────────────────┐
│              Thin integration layer (Next.js API)            │
│        Landing form → Notion · optional Manychat sync        │
└────────────────────────────┬─────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────┐
│                      Manychat (per clinic)                   │
│   WhatsApp · Instagram · Email · Sequences · Tags · Inbox    │
└────────────────────────────┬─────────────────────────────────┘
                             │
       ┌─────────────────────┼─────────────────────┐
       │                     │                     │
┌──────▼──────┐    ┌─────────▼─────────┐   ┌──────▼──────┐
│ WhatsApp    │    │ Instagram Graph   │   │   Email     │
│ Cloud API   │    │       API         │   │  (Business) │
└─────────────┘    └───────────────────┘   └─────────────┘
```

Each clinic gets a **duplicated Notion workspace** (or filtered database per clinic) and a **Manychat sub-account or flow clone**. No custom PostgreSQL, no React admin UI, no multi-tenant API server.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Messaging automations | Manychat (Business plan) | WhatsApp + Instagram + email on unlimited channels; visual flow builder, sequences, unified inbox |
| Clinic dashboard | Notion | Already in use for leads; clinics get a familiar, configurable CRM without building a frontend |
| Lead capture | Next.js landing page (existing) | Form → Notion API (`lib/leads/notion.ts`); extend as needed |
| Sync glue | Notion API + Manychat API / Zapier | Keep custom code minimal; use native integrations where Manychat supports them |
| Auth (clinic access) | Notion workspace permissions | Invite clinic staff to their Notion workspace; no Clerk/Auth0 needed |
| Email (landing form) | Gmail SMTP via nodemailer (existing) | Instant confirmation when someone submits the website form |
| Email (sequences) | Manychat email channel | Quote follow-ups, reminders, reactivation, review requests — same inbox as chat |
| Internal alerts | Telegram (existing) | Team notified on new leads |
| Hosting | Netlify (existing) | Landing page and API routes |

---

## Notion Data Model (per clinic)

Extend the existing leads database schema. One database per clinic (or one master DB with a `Clinic` property for internal use).

| Property | Type | Notes |
|---|---|---|
| Name | Title | Contact name |
| Email | Email | |
| Phone | Phone | E.164 format |
| Website | URL | Optional |
| Instagram | URL | Normalised handle |
| Source | Select | CTA, Popup, WhatsApp, Instagram, Email, Walk-in |
| Status | Select | New, Quoted, Booked, Confirmed, Completed, Inactive |
| Notes | Rich text | Internal clinic notes |
| Last contact | Date | Updated manually or via automation |
| Appointment date | Date | Optional |
| Reactivation sent | Checkbox | Prevent duplicate reactivation |
| Review requested | Date | Last review ask |

**Views to ship in template:**
- Pipeline board (grouped by Status)
- New leads this week
- Upcoming appointments
- Inactive patients (12+ months)
- Settings page (Google Place ID, notification email, automation toggles as checklist)

---

## Manychat Flows (per clinic)

Requires **Business plan** ($69/mo annual) — the first tier with unlimited channels including email. Pro ($29/mo) caps at 3 channels and does not include email.

| Flow | Trigger | Channels |
|---|---|---|
| Instant lead reply | New WhatsApp/Instagram DM or inbound email | WhatsApp, Instagram, Email |
| Website lead nurture | Tag `website_lead` after form submit | Email (fallback if no phone); WhatsApp if number provided |
| Quote follow-up | Tag `quoted` or manual trigger | WhatsApp, Instagram, Email — 3 messages: +24h, +72h, +7d |
| Appointment reminders | Tag `booked` + date field | WhatsApp preferred; email as fallback — 48h, 24h, 2h before |
| Reactivation | Scheduled broadcast / tag `inactive` | Email + WhatsApp |
| Review request | Tag `completed` | +2h message with Google review link |

Message templates are in Portuguese, customised per clinic during onboarding. Google review link format: `https://search.google.com/local/writereview?placeid={google_place_id}` (stored in Notion settings).

**Channel priority:** Use WhatsApp/Instagram when the contact has a phone or handle; use email when the lead came from the website form with email only. Manychat sequences can branch on available contact fields.

---

## Milestones

### Milestone 1: Notion Clinic Template
**Estimated hours:** 12 to 16h

Tasks:
- Finalise database properties (extend existing `NOTION_LEADS_DATABASE_ID` schema)
- Build pipeline board, filters, and clinic settings page
- Document SOP for duplicating the template per new client
- Add internal wSy master view if using a single workspace with `Clinic` property
- Test lead creation from landing page → Notion (existing `pushLeadToNotion`)

**Output:** Repeatable Notion dashboard a clinic can use on day one.

---

### Milestone 2: Manychat Setup and Instant Lead Reply
**Estimated hours:** 18 to 22h

Tasks:
- Create wSy agency Manychat account on **Business plan** (annual billing); document sub-account strategy per clinic
- Connect WhatsApp Cloud API via Manychat (Meta Developer App, phone number)
- Connect Instagram DMs (requires Business/Creator account linked to Facebook Page)
- Connect **email channel** in Manychat (clinic sending domain; verify DNS/SPF as required by Manychat)
- Build welcome flow: auto-reply on first message across all three channels, tag new subscribers
- Build website-lead branch: when lead has email only, enter email nurture path
- Test end-to-end: DM and inbound email → auto-reply within 60 seconds
- Document channel connection checklist for onboarding

**Output:** New WhatsApp, Instagram, and email leads receive an auto-reply within 60 seconds.

---

### Milestone 3: Quote Follow-Up Sequence
**Estimated hours:** 10 to 14h

Tasks:
- Build 3-step sequence in Manychat (24h, 72h, 7d delays)
- Define tag `quoted` as entry trigger (set manually from Manychat inbox or via Notion → Manychat sync)
- Cancel sequence on reply or `booked` tag
- Store message templates in Manychat; mirror copy in Notion settings page for reference

**Output:** Quoted leads receive automated 3-message follow-up over 7 days.

---

### Milestone 4: Appointment Reminders and No-Show Reduction
**Estimated hours:** 12 to 16h

Tasks:
- Build reminder sequence in Manychat (48h, 24h, 2h before appointment)
- Use Manychat custom fields or tags for appointment datetime
- Parse YES/NO replies: tag `confirmed` or flag for manual follow-up in Notion
- Log appointment status updates in Notion (manual or via Zapier/Make webhook)

**Output:** Clinics see measurable reduction in no-shows.

---

### Milestone 5: Reactivation and Review Automation
**Estimated hours:** 10 to 14h

Tasks:
- Reactivation: identify contacts inactive 12+ months (Notion filter → export or scheduled Manychat broadcast)
- Review request: trigger on `completed` status, send after 2h with Google review link
- Guardrails: one reactivation per contact; one review request per 6 months
- Document manual steps vs automatable steps in the playbook

**Output:** All five core workflows operational in Manychat.

---

### Milestone 6: Integration Glue and Landing Page
**Estimated hours:** 8 to 12h

Tasks:
- Ensure landing form → Notion dispatch is production-ready (existing `dispatchLead`)
- Optional: on new lead, create/update Manychat subscriber via API (phone match)
- Optional: Zapier/Make bridge — Notion status change → Manychat tag
- Harden env vars in Netlify (NOTION_API_TOKEN, SMTP, etc.)
- Remove or gate dev-only test routes in production

**Output:** Website leads land in Notion; messaging leads flow through Manychat; minimal double-entry.

---

### Milestone 7: Onboarding Playbook and Go-Live Prep
**Estimated hours:** 8 to 12h

Tasks:
- Write runbook: duplicate Notion template, clone Manychat flows, connect channels, invite clinic to Notion
- Create onboarding checklist (Notion page) — target under 2 days of config per clinic
- Set up error monitoring for landing page API (Sentry free tier)
- End-to-end test of all 5 flows with a test WhatsApp number
- Train founding team on Manychat inbox + Notion dashboard handoff

**Output:** A new clinic can go live in under 2 days of integration work without touching code.

---

## Hours Summary

| Milestone | Description | Hours |
|---|---|---|
| 1 | Notion clinic template | 12 to 16h |
| 2 | Manychat setup + instant reply (WA, IG, email) | 18 to 22h |
| 3 | Quote follow-up sequence | 10 to 14h |
| 4 | Appointment reminders | 12 to 16h |
| 5 | Reactivation + review automation | 10 to 14h |
| 6 | Integration glue + landing page | 8 to 12h |
| 7 | Onboarding playbook + go-live | 8 to 12h |
| **Total** | | **78 to 106h** |

**Cost at €15 to €20/h: €1,170 to €2,120**

**Manychat subscription (per clinic):** Business plan ~$69/mo annual (~€65/mo) — budget separately from dev hours.

---

## MVP vs Full Build

| Scope | Milestones | Hours | Cost |
|---|---|---|---|
| MVP (demo-ready) | 1, 2, 3 | 40 to 53h | €600 to €1,060 |
| MVP (client-ready) | 1 to 4 + partial 6 | 60 to 81h | €900 to €1,620 |
| Full product | 1 to 7 | 78 to 106h | €1,170 to €2,120 |

---

## Developer Notes

**Manychat plan tier:** Use **Business** ($69/mo annual) per clinic for WhatsApp + Instagram + email on unlimited channels. Pro ($29/mo) only allows 3 channels and excludes email — not sufficient for this product. See [Manychat pricing](https://manychat.com/pricing) and [Business plan docs](https://help.manychat.com/hc/en-us/articles/25800254159900-Business-plan).

**Landing page email vs Manychat email:** Keep the existing nodemailer confirmation for instant website form replies. Use Manychat email for nurture sequences so all follow-ups sit in the same inbox as chat.

**Use Manychat for all messaging logic.** Do not rebuild webhook handlers, cron schedulers, or a custom automation engine. The previous v1 plan (custom Node.js + PostgreSQL + React dashboard) is superseded. Margins come from fast onboarding and retainers, not from owning a messaging stack.

**Notion is the dashboard.** Do not build a React admin UI unless a specific client requirement cannot be met in Notion. Extend the existing `lib/leads/notion.ts` integration rather than introducing a second database.

**WhatsApp Cloud API is free for the first 1,000 service conversations per month per phone number** when connected through Manychat/Meta. Beyond that, Meta charges per conversation. Factor this into clinic pricing.

**Instagram DM automation requires a professional Instagram account linked to a Facebook Page.** Confirm during onboarding — common blocker.

**Each clinic needs its own WhatsApp Business phone number.** They cannot share one.

**Keep integration glue thin.** Prefer Manychat native features and Notion templates over custom code. Add Zapier/Make only where the Notion ↔ Manychat gap cannot be closed with a few API calls.

**Existing code to reuse:**
- `lib/leads/notion.ts` — lead push to Notion
- `lib/leads/dispatch.ts` — parallel Notion + Telegram + email
- Landing page contact form and validation
