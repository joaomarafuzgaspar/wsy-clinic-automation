import nodemailer from "nodemailer";
import type { LeadInput } from "@/lib/leads/types";
import { loadEnv, isPlaceholder } from "@/lib/config/env";

function createTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = loadEnv();
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

/**
 * Instant confirmation email when someone submits the website form.
 * Sequences (quote follow-up, reminders) run in Manychat — not here.
 */
export async function sendLeadConfirmationEmail(lead: LeadInput): Promise<boolean> {
  const env = loadEnv();

  if (!lead.email || isPlaceholder(env.SMTP_USER) || isPlaceholder(env.SMTP_PASS)) {
    console.warn("[email] PLACEHOLDER SMTP — skipping confirmation");
    return false;
  }

  const transport = createTransport();
  const from = env.SMTP_FROM ?? env.SMTP_USER!;

  await transport.sendMail({
    from,
    to: lead.email,
    subject: `Recebemos o seu pedido — ${env.CLINIC_NAME}`,
    text: [
      `Olá ${lead.name},`,
      "",
      `Obrigado pelo seu contacto com a ${env.CLINIC_NAME}.`,
      "Recebemos o seu pedido e entraremos em contacto consigo em breve.",
      "",
      `Se preferir falar connosco agora, ligue para ${env.CLINIC_PHONE}.`,
      "",
      "Com os melhores cumprimentos,",
      `Equipa ${env.CLINIC_NAME}`,
    ].join("\n"),
  });

  return true;
}
