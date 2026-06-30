/**
 * Notion clinic template — property definitions and view specs.
 *
 * Mirrors the schema documented in plans/implementation-plan.md.
 * Use these constants when creating or validating a clinic database.
 *
 * TODO: Replace placeholder IDs after duplicating the template workspace.
 */

export const NOTION_LEADS_PROPERTIES = {
  Name: { type: "title" as const, description: "Contact name" },
  Email: { type: "email" as const },
  Phone: { type: "phone_number" as const, description: "E.164 format, e.g. +351912345678" },
  Website: { type: "url" as const },
  Instagram: { type: "url" as const, description: "Normalised handle URL" },
  Source: {
    type: "select" as const,
    options: ["CTA", "Popup", "WhatsApp", "Instagram", "Email", "Walk-in"],
  },
  Status: {
    type: "select" as const,
    options: ["New", "Quoted", "Booked", "Confirmed", "Completed", "Inactive"],
  },
  Notes: { type: "rich_text" as const, description: "Internal clinic notes" },
  "Last contact": { type: "date" as const },
  "Appointment date": { type: "date" as const },
  "Reactivation sent": { type: "checkbox" as const },
  "Review requested": { type: "date" as const, description: "Last review ask — guard 6-month cooldown" },
  Clinic: {
    type: "select" as const,
    options: ["PLACEHOLDER_Clinic_A"],
    description: "Optional — use when one master DB serves multiple clinics",
  },
} as const;

export type NotionLeadPropertyName = keyof typeof NOTION_LEADS_PROPERTIES;

/**
 * View definitions to create manually in Notion (or via API where supported).
 * Group / filter / sort match the implementation plan.
 */
export const NOTION_LEADS_VIEWS = [
  {
    name: "Pipeline",
    type: "board" as const,
    groupBy: "Status",
    sort: [{ property: "Last contact", direction: "descending" as const }],
    description: "Kanban board — primary clinic workflow view",
  },
  {
    name: "New leads this week",
    type: "table" as const,
    filter: {
      and: [
        { property: "Status", condition: "equals", value: "New" },
        { property: "Last contact", condition: "past_week" },
      ],
    },
    sort: [{ property: "Last contact", direction: "descending" as const }],
  },
  {
    name: "Upcoming appointments",
    type: "table" as const,
    filter: {
      and: [
        { property: "Appointment date", condition: "is_not_empty" },
        { property: "Appointment date", condition: "on_or_after", value: "today" },
        { property: "Status", condition: "one_of", value: ["Booked", "Confirmed"] },
      ],
    },
    sort: [{ property: "Appointment date", direction: "ascending" as const }],
  },
  {
    name: "Inactive patients (12+ months)",
    type: "table" as const,
    filter: {
      and: [
        { property: "Last contact", condition: "before", value: "12_months_ago" },
        { property: "Reactivation sent", condition: "equals", value: false },
        { property: "Status", condition: "does_not_equal", value: "Inactive" },
      ],
    },
    sort: [{ property: "Last contact", direction: "ascending" as const }],
    description: "Export or sync to Manychat for reactivation broadcasts",
  },
  {
    name: "All contacts",
    type: "table" as const,
    sort: [{ property: "Name", direction: "ascending" as const }],
  },
] as const;

/**
 * Settings page blocks — create as a Notion page linked from the clinic dashboard.
 */
export const NOTION_SETTINGS_SECTIONS = [
  {
    title: "Google Place ID",
    placeholder: "PLACEHOLDER_GOOGLE_PLACE_ID",
    usage: "Review link: https://search.google.com/local/writereview?placeid={id}",
  },
  {
    title: "Notification email",
    placeholder: "recepcao@PLACEHOLDER_CLINIC.pt",
    usage: "Internal alerts for flagged no-shows and manual follow-ups",
  },
  {
    title: "Automation toggles",
    items: [
      "Instant lead reply — ON",
      "Quote follow-up (3 messages) — ON",
      "Appointment reminders (48h / 24h / 2h) — ON",
      "Reactivation (12+ months) — ON",
      "Review request (+2h post-appointment) — ON",
    ],
  },
  {
    title: "Message templates",
    description: "Mirror of Manychat copy — edit in Manychat, reference here for clinic staff",
  },
] as const;

export const NOTION_TEMPLATE_IDS = {
  /** Master workspace database — https://app.notion.com/p/682f574e415b45f2855a2fd925326b99 */
  leadsDatabaseId: "682f574e415b45f2855a2fd925326b99",
  /** Default view from shared link */
  leadsDefaultViewId: "38eae3a5901781fdaccb000c15bcdc00",
  settingsPageId: "PLACEHOLDER_SETTINGS_PAGE_ID",
  onboardingChecklistPageId: "PLACEHOLDER_ONBOARDING_CHECKLIST_PAGE_ID",
  playbookPageId: "PLACEHOLDER_PLAYBOOK_PAGE_ID",
} as const;
