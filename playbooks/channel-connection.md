# Channel Connection Guide

Step-by-step for connecting a clinic's messaging channels in Manychat.

**Plan required:** Business ($69/mo annual) — Pro does not include email and caps channels at 3.

---

## WhatsApp Cloud API

1. Clinic must have a dedicated WhatsApp Business phone number (cannot share).
2. Create or use existing Meta Developer App: https://developers.facebook.com
3. In Manychat → Settings → WhatsApp → Connect via Cloud API
4. Verify phone number via SMS/voice
5. Set welcome message flow to **Instant lead reply** (`manychat/flows/instant-lead-reply.json`)
6. Test: send message from personal phone → auto-reply within 60s

**Meta pricing note:** First 1,000 service conversations/month per number are free via Cloud API.

---

## Instagram DMs

**Prerequisites (common blockers):**

- Instagram account must be **Business** or **Creator**
- Account must be linked to a Facebook Page
- Page must be connected to the same Meta Developer App

**Steps:**

1. Manychat → Settings → Instagram → Connect
2. Authorise Facebook Page linked to clinic Instagram
3. Enable DM automation for the connected account
4. Route first-message trigger to **Instant lead reply** flow
5. Test: DM from personal account → auto-reply

---

## Email Channel

1. Manychat → Settings → Email → Add sending domain
2. Add DNS records (SPF, DKIM) as shown by Manychat
3. Verify domain (can take up to 48h)
4. Set from-name to clinic name, e.g. `Clínica PLACEHOLDER`
5. Connect email sequences (quote follow-up, reminders) to email channel as fallback
6. Test: send inbound email to clinic address → auto-reply

**Note:** Keep landing page nodemailer confirmation for instant form replies. Manychat email handles nurture sequences.

---

## Optional: Notion ↔ Manychat Bridge

When Notion status changes, apply the matching Manychat tag:

| Notion Status | Manychat Tag |
|---|---|
| Quoted | `quoted` |
| Booked | `booked` |
| Confirmed | `confirmed` |
| Completed | `completed` |
| Inactive | `inactive` |

**Options:**

1. **Zapier/Make** — Notion trigger → Manychat add tag (no code)
2. **Webhook** — `api/webhooks/notion-status` (see `api/webhooks/notion-status.ts`)

Mapping defined in `lib/leads/manychat.ts` → `STATUS_TO_MANYCHAT_TAG`.

---

## Placeholder Checklist

| Credential | Where to find |
|---|---|
| `MANYCHAT_API_TOKEN` | Manychat → Settings → API |
| `MANYCHAT_PAGE_ID` | Manychat → Settings → General |
| `GOOGLE_PLACE_ID` | Google Maps → clinic → Share → Embed → place ID in URL |
| Meta App ID / Secret | Meta Developer Console |
