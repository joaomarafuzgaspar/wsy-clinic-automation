# Onboarding Checklist

Target: **under 2 business days** of config work per clinic. No code changes required.

Copy this checklist into the clinic's Notion workspace (`PLACEHOLDER_ONBOARDING_CHECKLIST_PAGE_ID`).

---

## Pre-onboarding (founding team)

- [ ] Signed setup agreement and 50% upfront received
- [ ] Discovery call completed — clinic size, channels, message tone
- [ ] Clinic provides: WhatsApp Business number, Instagram handle, email domain, Google Place ID
- [ ] Confirm Instagram is Business/Creator and linked to Facebook Page

---

## Day 1 — Notion + Manychat setup

### Notion

- [ ] Duplicate master clinic template workspace
- [ ] Update Settings page: clinic name, Google Place ID, notification email
- [ ] Verify all 5 views (Pipeline, New leads, Appointments, Inactive, All contacts)
- [ ] Invite clinic staff to Notion workspace
- [ ] Record `NOTION_LEADS_DATABASE_ID` for this clinic

### Manychat

- [ ] Create clinic sub-account (or clone flow set from master)
- [ ] Upgrade to **Business plan** (annual) — required for email channel
- [ ] Connect WhatsApp Cloud API (Meta Developer App + phone number)
- [ ] Connect Instagram DMs
- [ ] Connect email channel (verify DNS/SPF)
- [ ] Clone flows from `manychat/flows/`:
  - [ ] Instant lead reply
  - [ ] Quote follow-up
  - [ ] Appointment reminders
  - [ ] Reactivation
  - [ ] Review request
- [ ] Paste Portuguese message copy from `manychat/messages/pt-PT.ts` (customise clinic name/phone)
- [ ] Record `MANYCHAT_API_TOKEN` and `MANYCHAT_PAGE_ID`

### Landing page (if clinic has dedicated site)

- [ ] Set Netlify env vars: `NOTION_LEADS_DATABASE_ID`, `CLINIC_NAME`, `CLINIC_PHONE`, `GOOGLE_PLACE_ID`
- [ ] Optional: enable Manychat sync (`MANYCHAT_API_TOKEN`, `MANYCHAT_PAGE_ID`)
- [ ] Test form submit → Notion row + Telegram alert + confirmation email

---

## Day 2 — Test and go-live

- [ ] Send test WhatsApp message → auto-reply within 60s
- [ ] Send test Instagram DM → auto-reply
- [ ] Send test inbound email → auto-reply
- [ ] Tag test contact `quoted` → verify 3-message sequence starts
- [ ] Book test appointment → verify reminders at 48h / 24h / 2h (use shortened delays in test)
- [ ] Mark test contact completed → verify review request after 2h
- [ ] Train clinic staff on Manychat inbox + Notion Pipeline view
- [ ] Hand off support SLA and escalation contacts
- [ ] Soft launch with clinic team
- [ ] Collect feedback after 1 week

---

## Post go-live

- [ ] Document clinic-specific customisations in Notion Settings
- [ ] Schedule 30-day check-in
- [ ] Invoice remaining 50% setup fee
