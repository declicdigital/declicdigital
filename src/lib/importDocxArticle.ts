// Import d'un article de blog depuis un fichier Word (.docx).
//
// Format attendu du .docx (une info par paragraphe) :
//   Catégorie : SEO & Performance
//   Slug : /blog/mon-article
//   Title tag (SEO) : Titre pour Google
//   Meta description : Description pour Google
//   Mots-clés : mot 1, mot 2, mot 3
//   (optionnel) Extrait : ...
//   Titre H1 de l'article            <- 1er paragraphe qui n'est pas une étiquette
//   CODE HTML (sans le H1)           <- marqueur : tout ce qui suit = contenu HTML
//   <p>...</p>
//   <h2>...</h2>
//   ...
//
// Aucune dépendance : le .docx (un zip) est décompressé avec DecompressionStream,
// natif dans les navigateurs récents.

const W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";

export interface ImportedArticle {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string | null;
  meta_title: string;
  meta_description: string;
  tags: string[];
  read_time: string;
  warnings: string[];
}

// ---------- Lecture du .docx ----------

async function inflateRaw(data: Uint8Array): Promise<Uint8Array> {
  if (typeof DecompressionStream === "undefined") {
    throw new Error("Navigateur trop ancien pour lire les fichiers Word (mettez Chrome, Firefox ou Safari à jour).");
  }
  const stream = new ReadableStream<Uint8Array>({ start(c) { c.enqueue(data); c.close(); } })
    .pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function readZipEntry(buffer: ArrayBuffer, entryName: string): Promise<Uint8Array> {
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  // Fin du répertoire central (EOCD)
  let eocd = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
    if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error("Ce fichier n'est pas un document Word (.docx) valide.");
  const count = view.getUint16(eocd + 10, true);
  let p = view.getUint32(eocd + 16, true);
  const decoder = new TextDecoder();
  for (let n = 0; n < count; n++) {
    if (view.getUint32(p, true) !== 0x02014b50) break;
    const method = view.getUint16(p + 10, true);
    const compSize = view.getUint32(p + 20, true);
    const nameLen = view.getUint16(p + 28, true);
    const extraLen = view.getUint16(p + 30, true);
    const commentLen = view.getUint16(p + 32, true);
    const localOffset = view.getUint32(p + 42, true);
    const name = decoder.decode(bytes.subarray(p + 46, p + 46 + nameLen));
    if (name === entryName) {
      const lNameLen = view.getUint16(localOffset + 26, true);
      const lExtraLen = view.getUint16(localOffset + 28, true);
      const start = localOffset + 30 + lNameLen + lExtraLen;
      const data = bytes.subarray(start, start + compSize);
      if (method === 0) return data;
      if (method === 8) return inflateRaw(data);
      throw new Error("Compression du fichier Word non prise en charge.");
    }
    p += 46 + nameLen + extraLen + commentLen;
  }
  throw new Error("Contenu du document Word introuvable.");
}

/** Renvoie le texte de chaque paragraphe du document Word, dans l'ordre. */
export async function readDocxParagraphs(file: Blob): Promise<string[]> {
  const xmlBytes = await readZipEntry(await file.arrayBuffer(), "word/document.xml");
  const xml = new DOMParser().parseFromString(new TextDecoder().decode(xmlBytes), "application/xml");
  const body = xml.getElementsByTagNameNS(W_NS, "body")[0];
  if (!body) throw new Error("Document Word vide ou illisible.");

  const paragraphs: string[] = [];
  const walk = (node: Element, out: { text: string }) => {
    for (const child of Array.from(node.children)) {
      if (child.namespaceURI === W_NS) {
        if (child.localName === "t") { out.text += child.textContent ?? ""; continue; }
        if (child.localName === "tab") { out.text += "\t"; continue; }
        if (child.localName === "br" || child.localName === "cr") { out.text += "\n"; continue; }
        if (child.localName === "p") { continue; } // paragraphes imbriqués traités séparément
        if (child.localName === "del") { continue; } // suppressions en mode révision
      }
      walk(child, out);
    }
  };
  for (const p of Array.from(xml.getElementsByTagNameNS(W_NS, "p"))) {
    const out = { text: "" };
    walk(p, out);
    paragraphs.push(out.text);
  }
  return paragraphs;
}

// ---------- Analyse du contenu ----------

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " et ").replace(/[^a-z0-9]+/g, " ").trim();
}

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

type FieldKey = "category" | "slug" | "meta_title" | "meta_description" | "keywords" | "excerpt" | "title" | "read_time";

// Étiquettes reconnues (comparées sans accents ni ponctuation)
const LABELS: Record<string, FieldKey> = {
  "categorie": "category",
  "slug": "slug",
  "slug url": "slug",
  "url": "slug",
  "title tag": "meta_title",
  "title tag seo": "meta_title",
  "meta title": "meta_title",
  "balise title": "meta_title",
  "meta description": "meta_description",
  "mots cles": "keywords",
  "mot cles": "keywords",
  "mots cle": "keywords",
  "keywords": "keywords",
  "tags": "keywords",
  "extrait": "excerpt",
  "titre": "title",
  "titre h1": "title",
  "h1": "title",
  "temps de lecture": "read_time",
};

function matchLabel(line: string): { key: FieldKey; value: string } | null {
  const m = line.match(/^\s*([^:]{1,40}?)\s*:\s*([\s\S]*)$/);
  if (!m) return null;
  const key = LABELS[normalize(m[1])];
  return key ? { key, value: m[2].trim() } : null;
}

function matchCategory(value: string, categories: string[]): string | null {
  const v = normalize(value);
  if (!v) return null;
  return categories.find((c) => normalize(c) === v)
    ?? categories.find((c) => normalize(c).includes(v) || v.includes(normalize(c)))
    ?? null;
}

function looksLikeHtml(s: string) {
  return /^\s*<(h[1-6]|p|ul|ol|li|div|blockquote|figure|img|table|section|hr|pre)\b/i.test(s);
}

// Word remplace parfois " par “ ” (correction automatique) : on répare à l'intérieur des balises.
function fixSmartQuotesInTags(html: string) {
  return html.replace(/<[^>]+>/g, (tag) => tag.replace(/[“”„″«»]/g, '"').replace(/[‘’′]/g, "'"));
}

function estimateReadTime(html: string): string {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 230))} min`;
}

export function parseArticleParagraphs(paragraphs: string[], categories: string[]): ImportedArticle {
  const fields: Partial<Record<FieldKey, string>> = {};
  const warnings: string[] = [];
  let title = "";
  let contentStart = -1;

  for (let i = 0; i < paragraphs.length; i++) {
    const line = paragraphs[i].replace(/\u00a0/g, " ").trim();
    if (!line) continue;
    if (/^code html/.test(normalize(line))) { contentStart = i + 1; break; }
    if (looksLikeHtml(line)) { contentStart = i; break; } // pas de marqueur : le HTML commence ici
    const label = matchLabel(line);
    if (label) { if (!fields[label.key]) fields[label.key] = label.value; continue; }
    if (!title) { title = line; continue; }
  }
  if (!title && fields.title) title = fields.title;

  let content = "";
  if (contentStart >= 0) {
    const lines = paragraphs.slice(contentStart).map((l) => l.replace(/\u00a0/g, " ").trim()).filter(Boolean);
    const allHtml = lines.every((l) => /^</.test(l) || /<\/[a-z0-9]+>\s*$/i.test(l));
    content = allHtml
      ? fixSmartQuotesInTags(lines.join("\n"))
      : lines.map((l) => (looksLikeHtml(l) ? fixSmartQuotesInTags(l) : `<p>${l.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</p>`)).join("\n");
  }
  // Retire un éventuel <h1> (le titre est déjà géré à part)
  content = content.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>\s*/gi, "");

  const slugRaw = (fields.slug ?? "").replace(/^https?:\/\/[^/]+/i, "").replace(/^\/?blog\//i, "").replace(/^\/+|\/+$/g, "");
  const slug = slugify(slugRaw) || slugify(title);

  const category = fields.category ? matchCategory(fields.category, categories) : null;
  if (fields.category && !category) warnings.push(`Catégorie « ${fields.category} » inconnue : choisissez-la manuellement.`);

  const tags = (fields.keywords ?? "").split(/[,;]/).map((t) => t.trim()).filter(Boolean);

  if (!title) warnings.push("Titre (H1) introuvable.");
  if (!content) warnings.push("Contenu introuvable (ajoutez la ligne « CODE HTML » avant le HTML).");

  return {
    title,
    slug,
    excerpt: fields.excerpt || fields.meta_description || "",
    content,
    category,
    meta_title: fields.meta_title || title,
    meta_description: fields.meta_description || "",
    tags,
    read_time: fields.read_time || (content ? estimateReadTime(content) : ""),
    warnings,
  };
}

export async function importDocxArticle(file: File, categories: string[]): Promise<ImportedArticle> {
  if (!/\.docx$/i.test(file.name)) throw new Error("Choisissez un fichier Word au format .docx");
  return parseArticleParagraphs(await readDocxParagraphs(file), categories);
}
