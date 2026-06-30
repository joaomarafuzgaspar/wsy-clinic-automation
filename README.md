# wSy Clinic Automation

White-label automation platform for dental clinics in Portugal.

**Stack:** [Manychat](https://manychat.com) (WhatsApp, Instagram, email) · [Notion](https://notion.so) (clinic dashboard) · Next.js landing page (lead capture)

## Repository layout

```
lib/                  Integration glue (Notion, Manychat, dispatch)
notion/               Schema, views, template IDs (placeholders)
manychat/             Flow specs + Portuguese message templates
playbooks/            Onboarding and channel connection guides
api/                  Route handlers to copy into wsy-landing-page
plans/                Business and implementation plans
```

## Quick start

```bash
cp .env.example .env
npm install
npm run typecheck
npm run validate-env   # requires .env with at least NOTION_* set
```

## Lead flow

```
Website form → dispatchLead()
  ├── pushLeadToNotion()     → Contacts database
  ├── syncLeadToManychat()   → tag: website_lead (optional)
  ├── sendTelegramAlert()    → internal team
  └── sendLeadConfirmationEmail()  → instant nodemailer reply
```

Messaging sequences (quote follow-up, reminders, reactivation, reviews) run in **Manychat**, not in this code.

## Placeholders to replace

| Variable | Purpose |
|---|---|
| `NOTION_LEADS_DATABASE_ID` | Clinic contacts database |
| `NOTION_SETTINGS_PAGE_ID` | Google Place ID, toggles, templates |
| `MANYCHAT_API_TOKEN` | Subscriber sync and tagging |
| `GOOGLE_PLACE_ID` | Review request link |
| `CLINIC_NAME`, `CLINIC_PHONE` | Message personalisation |

See `.env.example` for the full list.

## Plans

| Document | Description |
|---|---|
| [business-plan.md](plans/business-plan.md) | Partnership model, phases, costs, risks |
| [implementation-plan.md](plans/implementation-plan.md) | Architecture, milestones, hours |
| [notion/views.md](notion/views.md) | Database schema and view definitions |
| [playbooks/onboarding-checklist.md](playbooks/onboarding-checklist.md) | Per-clinic go-live checklist |

## Deploying to landing page

Copy into [wsy-landing-page](https://github.com/joaomarafuzgaspar/wsy-landing-page):

- `lib/` → project `lib/`
- `api/leads/route.ts` → `app/api/leads/route.ts`
- `api/webhooks/notion-status.ts` → `app/api/webhooks/notion-status/route.ts`

Set env vars in Netlify per clinic.
