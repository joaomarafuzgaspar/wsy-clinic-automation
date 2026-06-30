import type { LeadInput } from "@/lib/leads/types";
import { loadEnv, isPlaceholder } from "@/lib/config/env";

/**
 * Notify the internal team on Telegram when a new lead arrives.
 */
export async function sendTelegramAlert(lead: LeadInput): Promise<boolean> {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = loadEnv();

  if (isPlaceholder(TELEGRAM_BOT_TOKEN) || isPlaceholder(TELEGRAM_CHAT_ID)) {
    console.warn("[telegram] PLACEHOLDER credentials — skipping alert");
    return false;
  }

  const lines = [
    "🦷 Novo lead",
    `Nome: ${lead.name}`,
    lead.email ? `Email: ${lead.email}` : null,
    lead.phone ? `Telefone: ${lead.phone}` : null,
    `Origem: ${lead.source}`,
    lead.notes ? `Notas: ${lead.notes}` : null,
  ].filter(Boolean);

  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: lines.join("\n"),
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Telegram API error ${response.status}: ${text}`);
  }

  return true;
}
