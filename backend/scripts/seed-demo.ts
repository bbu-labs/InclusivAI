/**
 * Seed demo data into KV for hackathon demo.
 *
 * Usage:
 *   1. Create KV namespace: wrangler kv namespace create INCLUSIVAI-CACHE
 *   2. Update wrangler.toml with the namespace ID
 *   3. Run: npx wrangler kv key put --binding INCLUSIVAI_CACHE "demo:tos:instagram" "$(cat scripts/kv/tos-instagram.json)"
 *      (repeat for each demo entry)
 *
 * Or use the bulk upload approach below.
 */

import { ALL_DEMOS } from "./demo-data";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const KV_DIR = join(__dirname, "kv");
mkdirSync(KV_DIR, { recursive: true });

// Generate KV JSON files for each demo
for (const [category, demos] of Object.entries(ALL_DEMOS)) {
  for (const demo of demos) {
    const slug = demo.company
      ? demo.company.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")
      : demo.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");

    const key = `demo:${category}:${slug}`;
    const value = JSON.stringify({
      title: demo.title,
      doc_type: demo.doc_type,
      sample_text: demo.sample_text,
      analysis: demo.demo_analysis,
    });

    const fileName = `${category}-${slug}.json`;
    writeFileSync(join(KV_DIR, fileName), value);
    console.log(`Generated: ${fileName} (key: ${key})`);
  }
}

// Generate bulk upload JSON for wrangler kv bulk put
const bulkData = [];
for (const [category, demos] of Object.entries(ALL_DEMOS)) {
  for (const demo of demos) {
    const slug = demo.company
      ? demo.company.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")
      : demo.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");

    bulkData.push({
      key: `demo:${category}:${slug}`,
      value: JSON.stringify({
        title: demo.title,
        doc_type: demo.doc_type,
        sample_text: demo.sample_text,
        analysis: demo.demo_analysis,
      }),
    });
  }
}

// Also add a demo index
bulkData.push({
  key: "demo:index",
  value: JSON.stringify(
    bulkData.map((d) => ({ key: d.key, title: JSON.parse(d.value).title }))
  ),
});

writeFileSync(join(KV_DIR, "_bulk.json"), JSON.stringify(bulkData, null, 2));
console.log(`\nGenerated _bulk.json with ${bulkData.length} entries`);
console.log("\nTo upload all at once:");
console.log("  npx wrangler kv bulk put scripts/kv/_bulk.json --binding INCLUSIVAI_CACHE");
