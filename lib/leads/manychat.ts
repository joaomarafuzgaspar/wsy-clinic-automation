import type { LeadInput } from "@/lib/leads/types";
import { loadEnv, isPlaceholder } from "@/lib/config/env";

const MANYCHAT_API_BASE = "https://api.manychat.com/fb";

export interface ManychatSubscriber {
  subscriberId: string;
}

/**
 * Create or update a Manychat subscriber from a website lead.
 * Tags `website_lead` so the nurture flow can branch on channel availability.
 *
 * TODO: Implement phone-match deduplication once MANYCHAT_PAGE_ID is set.
 */
export async function syncLeadToManychat(lead: LeadInput): Promise<ManychatSubscriber | null> {
  const { MANYCHAT_API_TOKEN, MANYCHAT_PAGE_ID } = loadEnv();

  if (isPlaceholder(MANYCHAT_API_TOKEN) || isPlaceholder(MANYCHAT_PAGE_ID)) {
    console.warn("[manychat] PLACEHOLDER credentials — skipping subscriber sync");
    return null;
  }

  if (!lead.phone && !lead.email) {
    return null;
  }

  const body: Record<string, unknown> = {
    first_name: lead.name.split(" ")[0],
    last_name: lead.name.split(" ").slice(1).join(" ") || undefined,
    tags: [{ name: "website_lead" }],
  };

  if (lead.phone) body.phone = lead.phone;
  if (lead.email) body.email = lead.email;

  const response = await fetch(`${MANYCHAT_API_BASE}/subscriber/createSubscriber`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MANYCHAT_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Manychat API error ${response.status}: ${text}`);
  }

  const data = (await response.json()) as { data?: { id?: string } };
  const subscriberId = data.data?.id ?? "PLACEHOLDER_SUBSCRIBER_ID";

  return { subscriberId: String(subscriberId) };
}

/**
 * Apply a Manychat tag when Notion status changes.
 * Call from webhook handler or Zapier/Make outbound action.
 */
export async function tagManychatSubscriber(
  subscriberId: string,
  tag: string,
): Promise<void> {
  const { MANYCHAT_API_TOKEN } = loadEnv();

  if (isPlaceholder(MANYCHAT_API_TOKEN) || isPlaceholder(subscriberId)) {
    console.warn("[manychat] PLACEHOLDER — skipping tag", tag);
    return;
  }

  const response = await fetch(`${MANYCHAT_API_BASE}/subscriber/addTag`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MANYCHAT_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ subscriber_id: subscriberId, tag_name: tag }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Manychat tag error ${response.status}: ${text}`);
  }
}

/** Status → Manychat tag mapping for the Notion ↔ Manychat bridge */
export const STATUS_TO_MANYCHAT_TAG: Record<string, string> = {
  Quoted: "quoted",
  Booked: "booked",
  Confirmed: "confirmed",
  Completed: "completed",
  Inactive: "inactive",
};
