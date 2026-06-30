# Notion Clinic Template — Views & Setup

Schema source of truth: [`notion/schema.ts`](../notion/schema.ts)

> **Live database:** [Contacts](https://app.notion.com/p/682f574e415b45f2855a2fd925326b99?v=38eae3a5901781fdaccb000c15bcdc00)  
> **IDs:** `682f574e415b45f2855a2fd925326b99` (database) · `38eae3a5901781fdaccb000c15bcdc00` (default view)  
> Run `npm run introspect-notion` after setting `NOTION_API_TOKEN` to diff against this doc.

---

## Database: Contacts (Leads)

| Property | Type | Options / Notes |
|---|---|---|
| Name | Title | Contact name |
| Email | Email | |
| Phone | Phone | E.164, e.g. `+351912345678` |
| Website | URL | Optional |
| Instagram | URL | Normalised handle |
| Source | Select | CTA, Popup, WhatsApp, Instagram, Email, Walk-in |
| Status | Select | New, Quoted, Booked, Confirmed, Completed, Inactive |
| Notes | Rich text | Internal clinic notes |
| Last contact | Date | Updated on each touchpoint |
| Appointment date | Date | For reminder scheduling |
| Reactivation sent | Checkbox | Prevents duplicate reactivation |
| Review requested | Date | 6-month cooldown guardrail |
| Clinic | Select | Optional — for master DB with multiple clinics |

---

## Views to Create

### 1. Pipeline (Board) — primary view

- **Type:** Board
- **Group by:** Status
- **Sort:** Last contact → descending
- **Use:** Day-to-day clinic workflow

### 2. New leads this week

- **Type:** Table
- **Filter:** Status = New AND Last contact is within past week
- **Sort:** Last contact → descending

### 3. Upcoming appointments

- **Type:** Table
- **Filter:** Appointment date is not empty AND on or after today AND Status is Booked or Confirmed
- **Sort:** Appointment date → ascending

### 4. Inactive patients (12+ months)

- **Type:** Table
- **Filter:** Last contact is more than 12 months ago AND Reactivation sent is unchecked AND Status is not Inactive
- **Sort:** Last contact → ascending
- **Use:** Weekly export → Manychat reactivation broadcast

### 5. All contacts

- **Type:** Table
- **Sort:** Name → ascending

---

## Settings Page (standalone Notion page)

Link from the clinic dashboard sidebar.

| Section | Content |
|---|---|
| Google Place ID | `PLACEHOLDER_GOOGLE_PLACE_ID` |
| Notification email | `recepcao@PLACEHOLDER_CLINIC.pt` |
| Automation toggles | Checklist of 5 workflows (ON/OFF) |
| Message templates | Mirror of Manychat copy for staff reference |

---

## Duplication SOP (per new clinic)

1. Duplicate the master Notion workspace (or duplicate the Contacts database).
2. Replace placeholder values on the Settings page (Google Place ID, email, clinic name).
3. Update `NOTION_LEADS_DATABASE_ID` in Netlify env vars for that clinic's landing page.
4. Invite clinic staff with **Can edit** access to their workspace only.
5. Remove or rename the `Clinic` property if using dedicated workspaces per client.

---

## Placeholder IDs

| Key | Value |
|---|---|
| `NOTION_LEADS_DATABASE_ID` | `682f574e415b45f2855a2fd925326b99` |
| `NOTION_DEFAULT_VIEW_ID` | `38eae3a5901781fdaccb000c15bcdc00` |
| `NOTION_SETTINGS_PAGE_ID` | `PLACEHOLDER_SETTINGS_PAGE_ID` |
| `NOTION_ONBOARDING_CHECKLIST_PAGE_ID` | `PLACEHOLDER_ONBOARDING_CHECKLIST_PAGE_ID` |

Replace after creating the template in Notion. Database ID is the 32-character hex from the database URL.
