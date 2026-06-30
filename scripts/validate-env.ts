#!/usr/bin/env tsx
/**
 * Validate environment variables against the schema.
 * Run: npm run validate-env
 *
 * Exits 0 with warnings for PLACEHOLDER values (expected before go-live).
 */

import { envSchema } from "../lib/config/env";

function main() {
  const raw = process.env;
  const result = envSchema.safeParse(raw);

  if (!result.success) {
    console.error("❌ Missing required environment variables:\n");
    for (const issue of result.error.issues) {
      console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
    }
    process.exit(1);
  }

  const placeholders: string[] = [];
  for (const [key, value] of Object.entries(result.data)) {
    if (typeof value === "string" && value.includes("PLACEHOLDER")) {
      placeholders.push(key);
    }
  }

  console.log("✅ Environment schema valid\n");

  if (placeholders.length > 0) {
    console.log("⚠️  Placeholder values (replace before production):\n");
    for (const key of placeholders) {
      console.log(`  - ${key}`);
    }
  } else {
    console.log("All values appear configured (no PLACEHOLDER strings found).");
  }
}

main();
