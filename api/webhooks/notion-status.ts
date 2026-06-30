/**
 * Webhook handler for Notion → Manychat status sync.
 * Deploy as app/api/webhooks/notion-status/route.ts in the landing page repo.
 *
 * TODO: Verify Notion automation webhook payload shape once configured.
 */

import { z } from "zod";
import { updateLeadStatus } from "@/lib/leads/notion";
import { tagManychatSubscriber, STATUS_TO_MANYCHAT_TAG } from "@/lib/leads/manychat";
import type { LeadStatus } from "@/lib/leads/types";
import { LEAD_STATUSES } from "@/lib/leads/types";

const webhookSchema = z.object({
  page_id: z.string(),
  subscriber_id: z.string().optional(),
  status: z.enum(LEAD_STATUSES),
});

export async function POST(request: Request): Promise<Response> {
  const secret = process.env.WEBHOOK_SECRET;
  if (secret && !secret.includes("PLACEHOLDER")) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const payload = webhookSchema.parse(await request.json());

    await updateLeadStatus(payload.page_id, payload.status as LeadStatus);

    const tag = STATUS_TO_MANYCHAT_TAG[payload.status];
    if (tag && payload.subscriber_id) {
      await tagManychatSubscriber(payload.subscriber_id, tag);
    }

    return Response.json({ ok: true, tag: tag ?? null });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: "Invalid payload", details: err.flatten() }, { status: 400 });
    }
    return Response.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
