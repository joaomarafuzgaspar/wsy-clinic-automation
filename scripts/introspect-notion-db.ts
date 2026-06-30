#!/usr/bin/env tsx
/**
 * Fetch and print the live Notion database schema + views.
 *
 * Usage:
 *   NOTION_API_TOKEN=secret_... NOTION_LEADS_DATABASE_ID=682f574e415b45f2855a2fd925326b99 npm run introspect-notion
 *
 * Compare output against notion/schema.ts and notion/views.md.
 */

import { Client } from "@notionhq/client";

const DATABASE_ID = process.env.NOTION_LEADS_DATABASE_ID ?? "682f574e415b45f2855a2fd925326b99";
const TOKEN = process.env.NOTION_API_TOKEN;

if (!TOKEN || TOKEN.includes("PLACEHOLDER")) {
  console.error("Set NOTION_API_TOKEN (integration must have access to the database).");
  process.exit(1);
}

function formatId(id: string): string {
  const hex = id.replace(/-/g, "");
  if (hex.length !== 32) return id;
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function extractSelectOptions(prop: Record<string, unknown>): string[] {
  const select = prop.select as { options?: { name: string }[] } | undefined;
  const multi = prop.multi_select as { options?: { name: string }[] } | undefined;
  return (select?.options ?? multi?.options ?? []).map((o) => o.name);
}

async function main() {
  const client = new Client({ auth: TOKEN });
  const dbId = formatId(DATABASE_ID);

  const database = await client.databases.retrieve({ database_id: dbId });
  const title =
    "title" in database && Array.isArray(database.title)
      ? database.title.map((t) => ("plain_text" in t ? t.plain_text : "")).join("")
      : "(untitled)";

  console.log(`\n📋 Database: ${title}`);
  console.log(`   ID: ${database.id}\n`);

  console.log("── Properties ──\n");
  const properties = database.properties ?? {};
  for (const [name, prop] of Object.entries(properties).sort(([a], [b]) => a.localeCompare(b))) {
    const p = prop as Record<string, unknown>;
    const type = p.type as string;
    const options = type === "select" || type === "multi_select" ? extractSelectOptions(p) : [];
  console.log(`  ${name}`);
    console.log(`    type: ${type}`);
    if (options.length) console.log(`    options: ${options.join(", ")}`);
  }

  console.log("\n── Views (from linked collections if available) ──\n");
  // Notion API exposes views on data sources in newer versions; fall back to URL hint.
  const viewId = process.env.NOTION_DEFAULT_VIEW_ID ?? "38eae3a5901781fdaccb000c15bcdc00";
  console.log(`  Default view from URL: ${formatId(viewId)}`);
  console.log("  (View names/filters require Notion MCP or manual inspection in the UI.)\n");

  console.log("── Compare with repo ──\n");
  console.log("  Expected properties: notion/schema.ts → NOTION_LEADS_PROPERTIES");
  console.log("  Expected views: notion/views.md\n");
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
