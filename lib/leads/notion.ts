import { Client } from "@notionhq/client";
import type { LeadInput, LeadStatus } from "@/lib/leads/types";
import { loadEnv, isPlaceholder } from "@/lib/config/env";

function notionClient(): Client {
  const { NOTION_API_TOKEN } = loadEnv();
  return new Client({ auth: NOTION_API_TOKEN });
}

function leadsDatabaseId(): string {
  return loadEnv().NOTION_LEADS_DATABASE_ID;
}

function selectOption(name: string) {
  return { select: { name } };
}

function dateValue(isoDate: string) {
  return { date: { start: isoDate } };
}

function richText(content: string) {
  return {
    rich_text: [{ type: "text" as const, text: { content } }],
  };
}

export interface NotionLeadPage {
  pageId: string;
  url: string;
}

/**
 * Push a new lead into the Notion contacts database.
 * Called from the landing page form handler and optional webhooks.
 */
export async function pushLeadToNotion(lead: LeadInput): Promise<NotionLeadPage> {
  const databaseId = leadsDatabaseId();

  if (isPlaceholder(databaseId)) {
    console.warn("[notion] PLACEHOLDER database ID — skipping API call");
    return {
      pageId: "PLACEHOLDER_PAGE_ID",
      url: "https://notion.so/PLACEHOLDER",
    };
  }

  const client = notionClient();
  const today = new Date().toISOString().slice(0, 10);

  const properties: Record<string, unknown> = {
    Name: { title: [{ text: { content: lead.name } }] },
    Source: selectOption(lead.source),
    Status: selectOption("New"),
    "Last contact": dateValue(today),
    "Reactivation sent": { checkbox: false },
  };

  if (lead.email) properties.Email = { email: lead.email };
  if (lead.phone) properties.Phone = { phone_number: lead.phone };
  if (lead.website) properties.Website = { url: lead.website };
  if (lead.instagram) properties.Instagram = { url: lead.instagram };
  if (lead.notes) properties.Notes = richText(lead.notes);
  if (lead.appointmentDate) properties["Appointment date"] = dateValue(lead.appointmentDate);

  const page = await client.pages.create({
    parent: { database_id: databaseId },
    properties: properties as Parameters<Client["pages"]["create"]>[0]["properties"],
  });

  return {
    pageId: page.id,
    url: "url" in page && typeof page.url === "string" ? page.url : `https://notion.so/${page.id.replace(/-/g, "")}`,
  };
}

/**
 * Update lead status — used by Zapier/Make webhooks or manual API calls.
 * TODO: Wire Notion status change → Manychat tag via automation bridge.
 */
export async function updateLeadStatus(pageId: string, status: LeadStatus): Promise<void> {
  if (isPlaceholder(pageId)) {
    console.warn("[notion] PLACEHOLDER page ID — skipping status update");
    return;
  }

  const client = notionClient();
  await client.pages.update({
    page_id: pageId,
    properties: {
      Status: selectOption(status),
      "Last contact": dateValue(new Date().toISOString().slice(0, 10)),
    } as Parameters<Client["pages"]["update"]>[0]["properties"],
  });
}

/**
 * Mark reactivation as sent to prevent duplicate broadcasts.
 */
export async function markReactivationSent(pageId: string): Promise<void> {
  if (isPlaceholder(pageId)) return;

  const client = notionClient();
  await client.pages.update({
    page_id: pageId,
    properties: {
      "Reactivation sent": { checkbox: true },
      Status: selectOption("Inactive"),
    } as Parameters<Client["pages"]["update"]>[0]["properties"],
  });
}

/**
 * Record review request date for 6-month cooldown guardrail.
 */
export async function markReviewRequested(pageId: string): Promise<void> {
  if (isPlaceholder(pageId)) return;

  const client = notionClient();
  const today = new Date().toISOString().slice(0, 10);
  await client.pages.update({
    page_id: pageId,
    properties: {
      "Review requested": dateValue(today),
    } as Parameters<Client["pages"]["update"]>[0]["properties"],
  });
}
