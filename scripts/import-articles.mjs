// Importe les articles de content/articles/*.json dans la table cms_blog_posts.
// - Un slug déjà présent est ignoré (jamais écrasé).
// - Sans SUPABASE_SERVICE_ROLE_KEY, le script ne fait qu'un contrôle à blanc (dry run).
// Usage : node scripts/import-articles.mjs
import { createClient } from "@supabase/supabase-js";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "content/articles";
const REQUIRED = ["title", "slug", "content", "status", "category"];
const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const dryRun = !key;

const files = readdirSync(DIR).filter((f) => f.endsWith(".json")).sort();
const articles = files.map((f) => ({ file: f, data: JSON.parse(readFileSync(join(DIR, f), "utf8")) }));

let errors = 0;
for (const { file, data } of articles) {
  const missing = REQUIRED.filter((k) => !data[k]);
  if (missing.length) { console.error(`✗ ${file}: champs manquants: ${missing.join(", ")}`); errors++; }
  if (data.slug && data.slug.startsWith("/")) { console.error(`✗ ${file}: le slug ne doit pas commencer par "/"`); errors++; }
  if (data.meta_description && data.meta_description.length > 160) { console.error(`✗ ${file}: meta_description > 160 caractères`); errors++; }
  if (data.meta_title && data.meta_title.length > 70) { console.error(`✗ ${file}: meta_title > 70 caractères`); errors++; }
  if (data.content && data.content.includes("—")) { console.error(`✗ ${file}: tiret cadratin dans le contenu`); errors++; }
}
if (errors) { console.error(`\n${errors} erreur(s), import annulé.`); process.exit(1); }

console.log(`${articles.length} article(s) valides.`);
if (dryRun) {
  console.log("Pas de clé SUPABASE_SERVICE_ROLE_KEY : contrôle à blanc uniquement, rien n'est écrit.");
  process.exit(0);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });
let inserted = 0, skipped = 0, failed = 0;
for (const { data } of articles) {
  const { data: existing, error: selErr } = await supabase.from("cms_blog_posts").select("id").eq("slug", data.slug).maybeSingle();
  if (selErr) { console.error(`✗ ${data.slug}: ${selErr.message}`); failed++; continue; }
  if (existing) { console.log(`= ${data.slug}: déjà présent, ignoré`); skipped++; continue; }
  const { error } = await supabase.from("cms_blog_posts").insert({ ...data, updated_at: new Date().toISOString() });
  if (error) { console.error(`✗ ${data.slug}: ${error.message}`); failed++; continue; }
  console.log(`+ ${data.slug}: ${data.status}${data.scheduled_at ? " (programmé " + data.scheduled_at + ")" : ""}`);
  inserted++;
}
console.log(`\nAjoutés: ${inserted} · ignorés: ${skipped} · en erreur: ${failed}`);
process.exit(failed ? 1 : 0);
