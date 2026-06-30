import { z } from "zod";

const optionalNonEmpty = z.string().min(1).optional();

export const envSchema = z.object({
  NOTION_API_TOKEN: z.string().min(1),
  NOTION_LEADS_DATABASE_ID: z.string().min(1),
  NOTION_SETTINGS_PAGE_ID: optionalNonEmpty,

  MANYCHAT_API_TOKEN: optionalNonEmpty,
  MANYCHAT_PAGE_ID: optionalNonEmpty,

  TELEGRAM_BOT_TOKEN: optionalNonEmpty,
  TELEGRAM_CHAT_ID: optionalNonEmpty,

  SMTP_HOST: z.string().default("smtp.gmail.com"),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: optionalNonEmpty,
  SMTP_PASS: optionalNonEmpty,
  SMTP_FROM: optionalNonEmpty,

  CLINIC_NAME: z.string().default("PLACEHOLDER_Clinic_Name"),
  CLINIC_PHONE: z.string().default("+351PLACEHOLDER"),
  GOOGLE_PLACE_ID: optionalNonEmpty,
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(source: Record<string, string | undefined> = process.env): Env {
  return envSchema.parse(source);
}

export function isPlaceholder(value: string | undefined): boolean {
  return !value || value.includes("PLACEHOLDER");
}
