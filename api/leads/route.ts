/**
 * Next.js App Router handler — copy to wsy-landing-page as app/api/leads/route.ts
 *
 * POST /api/leads
 * Body: { name, email?, phone?, source, notes? }
 */

import { z } from "zod";
import { dispatchLead } from "@/lib/leads/dispatch";
import { LEAD_SOURCES } from "@/lib/leads/types";

const leadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  instagram: z.string().optional(),
  source: z.enum(LEAD_SOURCES).default("CTA"),
  notes: z.string().optional(),
});

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const lead = leadSchema.parse(body);

    if (!lead.email && !lead.phone) {
      return Response.json(
        { error: "Email or phone is required" },
        { status: 400 },
      );
    }

    const result = await dispatchLead(lead);

    if (result.errors.length > 0 && !result.notion) {
      return Response.json({ error: "Failed to save lead", details: result.errors }, { status: 500 });
    }

    return Response.json({
      ok: true,
      notionPageId: result.notion?.pageId,
      warnings: result.errors.length > 0 ? result.errors : undefined,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: "Invalid request", details: err.flatten() }, { status: 400 });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
