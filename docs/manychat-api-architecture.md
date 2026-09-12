# Manychat API + Local Server Architecture

**Date:** September 2026  
**Context:** Architecture decision from planning chat — whether to use Manychat's API for message management while a local server handles automations.

---

## Question

Can we use **Manychat's API** for managing messages and have a **local server** manage automations?

**Short answer:** Yes — but the split works best as a **hybrid**, not as “API for everything + server for all automations.”

---

## What Manychat's API Actually Covers

The [Manychat Page API](https://api.manychat.com/) is built for **acting on subscribers**, not replacing the full Manychat product.

| Your server can… | Your server cannot easily… |
|---|---|
| Create/update subscribers | Run a full unified inbox (clinics still use Manychat's UI) |
| Add/remove tags | Read full conversation history as a first-class inbox API |
| Set custom fields (e.g. appointment date) | Ignore WhatsApp's 24h window — `sendContent` still needs valid tags outside it |
| Trigger a pre-built flow (`sendFlow`) | Replace Manychat's delay/sequence engine without your own scheduler |
| Send message content (`sendContent`) | Host channel connections yourself (WhatsApp/IG/email stay in Manychat) |

**Key API endpoints** (all use `/fb/` prefix even for Instagram/WhatsApp):

- `POST /fb/sending/sendContent` — send a message to a subscriber
- `POST /fb/sending/sendFlow` — trigger an automation flow
- `POST /fb/subscriber/createSubscriber` — create a unified subscriber
- `POST /fb/subscriber/updateSubscriber` — update subscriber data
- `POST /fb/subscriber/addTag` / `removeTag` — manage tags
- `POST /fb/subscriber/setCustomField` — set appointment date, etc.
- `GET /fb/subscriber/getInfo` — look up subscriber by ID

**Rate limits:** ~10 requests/second for write operations.

**Auth:** Bearer token from Manychat → Settings → API.

---

## Architecture Options

### Option A: Recommended hybrid (matches v2 implementation plan)

```
Notion (dashboard)  →  local server (thin glue)  →  Manychat API (tags/fields/flows)
                              ↑
Inbound DMs/email  →  Manychat flows (sequences, delays, reply handling)
```

**Local server responsibilities:**

- On new website lead → create/update Manychat subscriber + tag `website_lead`
- On Notion status `Quoted` → add tag `quoted` or call `sendFlow`
- On appointment booked → set custom field `appointment_date`
- Guardrails: don't reactivate twice; log events back to Notion

**Manychat responsibilities:**

- Instant auto-reply on first DM
- Quote follow-up sequence (+24h, +72h, +7d)
- Appointment reminders (48h, 24h, 2h before)
- YES/NO reply parsing
- Clinic staff unified inbox (WhatsApp, Instagram, email)
- Channel connectivity (Meta WhatsApp Cloud API, Instagram Graph API, email)

This is what **Milestone 6** in the implementation plan describes as optional integration glue — minimal code, no custom cron engine.

### Option B: Local server owns all automation logic

```
Notion  →  local server (cron + rules)  →  Manychat API (sendContent only)
```

**Possible, but not recommended** for this product. You would need to rebuild:

- An always-on scheduler (cron on a VPS — not ideal on Netlify alone)
- Delay/sequence state in your own database or Notion
- WhatsApp 24-hour window and message-tag compliance in your code
- Reply handling via Manychat **External Request** webhooks back to your server

The v1 plan (custom Node.js + PostgreSQL + React dashboard) was superseded for exactly this reason: margins come from fast onboarding and retainers, not from owning a messaging stack.

### Option C: External Request for dynamic logic only

```
Manychat flow  →  External Request  →  local server (AI/complex logic)  →  sendContent back
```

Good for dynamic or AI-generated replies. Not the right tool for standard drip sequences (quote follow-up, reminders) that Manychat handles natively.

---

## When a Local Server Makes Sense

| Use case | Where it lives |
|---|---|
| Notion ↔ Manychat sync (status → tag) | Local server |
| Complex branching from Notion data (inactive 12+ months) | Local server |
| Dynamic AI replies | Local server + Manychat External Request |
| Guardrails (one reactivation per contact) | Local server or Notion checkbox |
| Instant auto-reply on first DM | Manychat flow |
| Timed sequences (+24h, +72h, +7d) | Manychat flow |
| Appointment reminders | Manychat flow |
| Clinic inbox | Manychat UI |

---

## Practical Constraints

### Netlify (current hosting)

The landing page and API routes live on **Netlify**. That works well for **event-driven** glue:

- Form submit → Notion + Manychat subscriber create
- Webhook from Notion/Zapier → Manychat tag update

It is **not** ideal for **scheduled** automations (reminders, reactivation broadcasts). If you go heavy on server-side scheduling, you need:

- A small VPS, Railway, or dedicated worker, **or**
- Keep all schedules inside Manychat flows (recommended)

### WhatsApp messaging window

When sending via API outside the 24-hour user-initiated window, you must pass a valid `message_tag` (Meta-approved). Same rules apply whether you send from a Manychat flow or from your server calling `sendContent`.

### Per-clinic isolation

Each clinic gets its own Manychat sub-account (or flow clone) and its own API token. The local server must route events to the correct clinic's Manychat account.

---

## Recommended Split (Summary)

| Layer | Tool | Role |
|---|---|---|
| Channels + inbox | Manychat | WhatsApp, Instagram, email; unified inbox for clinic staff |
| Sequences + timing | Manychat flows | Delays, drip campaigns, reply parsing |
| CRM / dashboard | Notion | Contacts, pipeline, appointments, settings |
| Integration glue | Local server (Next.js API on Netlify) | Notion events → Manychat tags/fields/flows; landing form → both systems |
| Instant form confirmation | nodemailer (existing) | Website form reply before Manychat nurture kicks in |

---

## Example: Quote Follow-Up Flow

1. Clinic marks lead as **Quoted** in Notion (Status property).
2. Zapier/Make or a Notion webhook hits your API route.
3. Your server finds the subscriber by phone/email via Manychat API.
4. Your server calls `POST /fb/subscriber/addTag` with tag `quoted`.
5. Manychat flow (already built) triggers on tag `quoted` and runs the 3-message sequence over 7 days.
6. If the patient replies or gets tagged `booked`, the Manychat flow cancels the sequence automatically.

Your server never schedules the +24h / +72h / +7d sends — Manychat does.

---

## Related Documents

- [implementation-plan.md](../plans/implementation-plan.md) — full milestones and architecture
- [business-plan.md](../plans/business-plan.md) — partnership model and stack decision
- [Manychat API docs](https://api.manychat.com/)
- [Manychat API help article](https://help.manychat.com/hc/en-us/articles/14959510331420-API-Manychat)

---

## Decision Log

| Date | Decision | Rationale |
|---|---|---|
| Sep 2026 | Use Manychat for all messaging logic and sequences | Avoid rebuilding cron, webhook handlers, and Meta compliance |
| Sep 2026 | Local server = thin integration glue only | Notion sync, tag triggers, subscriber create on form submit |
| Sep 2026 | Do not rebuild v1 custom backend | Faster onboarding, lower maintenance, better margins |
