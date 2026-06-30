import type { LeadInput, DispatchResult } from "@/lib/leads/types";
import { pushLeadToNotion } from "@/lib/leads/notion";
import { syncLeadToManychat } from "@/lib/leads/manychat";
import { sendLeadConfirmationEmail } from "@/lib/integrations/email";
import { sendTelegramAlert } from "@/lib/integrations/telegram";
import { loadEnv } from "@/lib/config/env";

/**
 * Parallel dispatch: Notion + optional Manychat + Telegram alert + confirmation email.
 * This is the main entry point from the landing page form handler.
 */
export async function dispatchLead(lead: LeadInput): Promise<DispatchResult> {
  const env = loadEnv();
  const errors: string[] = [];
  const result: DispatchResult = { errors };

  const tasks: Promise<void>[] = [
    pushLeadToNotion(lead)
      .then((notion) => {
        result.notion = notion;
      })
      .catch((err: unknown) => {
        errors.push(`notion: ${err instanceof Error ? err.message : String(err)}`);
      }),
  ];

  if (env.MANYCHAT_API_TOKEN && !env.MANYCHAT_API_TOKEN.includes("PLACEHOLDER")) {
    tasks.push(
      syncLeadToManychat(lead)
        .then((manychat) => {
          if (manychat) result.manychat = manychat;
        })
        .catch((err: unknown) => {
          errors.push(`manychat: ${err instanceof Error ? err.message : String(err)}`);
        }),
    );
  }

  if (env.TELEGRAM_BOT_TOKEN && !env.TELEGRAM_BOT_TOKEN.includes("PLACEHOLDER")) {
    tasks.push(
      sendTelegramAlert(lead)
        .then((sent) => {
          result.telegram = { sent };
        })
        .catch((err: unknown) => {
          errors.push(`telegram: ${err instanceof Error ? err.message : String(err)}`);
        }),
    );
  }

  if (lead.email && env.SMTP_USER && !env.SMTP_USER.includes("PLACEHOLDER")) {
    tasks.push(
      sendLeadConfirmationEmail(lead)
        .then((sent) => {
          result.email = { sent };
        })
        .catch((err: unknown) => {
          errors.push(`email: ${err instanceof Error ? err.message : String(err)}`);
        }),
    );
  }

  await Promise.all(tasks);
  return result;
}
