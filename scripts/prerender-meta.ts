// scripts/prerender-meta.ts
//
// Pourquoi ce script existe :
// Le site est une SPA React (Vite, pas de SSR). netlify.toml sert le même
// dist/index.html pour TOUTES les routes (règle catch-all /* -> /index.html).
// Ce index.html contient le <title>, la <meta description> et le
// <link rel="canonical"> de la page d'accueil, en dur. React ne les corrige
// qu'après hydratation côté client via react-helmet-async. Google indexe en
// deux passes : la première (HTML brut) voit donc la home partout, la
// deuxième (rendu JS) est mise en file d'attente et peut prendre des
// semaines sur un site avec des centaines de pages villes/métiers.
//
// Ce script tourne juste après `vite build` (voir "postbuild" dans
// package.json) et écrit, pour chaque route réelle du site, un fichier
// dist/<route>/index.html avec le <title>/<meta description>/<canonical>/OG
// déjà corrects. Netlify sert un fichier statique existant en priorité sur
// la règle catch-all, donc ça fonctionne sans rien changer côté Netlify.
//
// Limite connue : seules les balises <head> sont corrigées, pas le contenu
// visuel de la page (qui reste le squelette de la home tant que React n'a
// pas hydraté). C'est volontaire : ça résout le signal de duplicate content
// / mauvaise canonical, qui est le problème identifié dans Search Console.
// Une vraie solution de contenu pré-rendu nécessiterait un SSR complet.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { cities } from "../src/data/cities";
import { trades } from "../src/data/trades";
import { getSeoMeta } from "../src/data/seoMeta";
import { getTradeSeoMeta } from "../src/data/tradeSeoMeta";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, "../dist");
const SITE_URL = "https://declicdigital.net";

// Client dédié pointant vers le projet Supabase qui contient cms_blog_posts
// (même URL/clé anon que dans src/pages/BlogArticle.tsx - clé publique, sans risque)
const BLOG_SUPABASE_URL = "https://iskxljribvfypkyappku.supabase.co";
const BLOG_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlza3hsanJpYnZmeXBreWFwcGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NjQ0MzMsImV4cCI6MjA5MjI0MDQzM30.OgWh7kKknHgdG4JMTFbNC_XdZhncnEqzJQA0GbRI_uY";

interface RouteMeta {
  urlPath: string; // ex: "/referencement-seo/paris-9eme"
  title: string;
  description: string;
}

// ------------------------------------------------------------------
// 1. Pages fixes (title/description copiés depuis chaque composant page)
// ------------------------------------------------------------------
const staticPages: RouteMeta[] = [
  {
    urlPath: "/creation-site-web",
    title: "Création site web Paris et 92 : artisans, TPE et indépendants",
    description:
      "Agence web Paris et Hauts-de-Seine (92) : création site internet professionnel pour artisans, TPE et indépendants. Site vitrine responsive, SEO inclus, livré en 2 semaines. Devis gratuit 24h.",
  },
  {
    urlPath: "/referencement-seo",
    title: "Agence SEO Paris - Référencement local TPE et artisans | Déclic Digital",
    description:
      "Agence SEO Paris et Hauts-de-Seine (92) : référencement naturel, consultant SEO local et GEO pour artisans, TPE et indépendants. Expert Produit Google certifié. Audit gratuit 48h.",
  },
  {
    urlPath: "/visibilite-ia",
    title: "Visibilité IA : apparaître dans ChatGPT et Google AI",
    description:
      "Optimisez votre présence dans les IA génératives. Déclic Digital vous aide à être cité par ChatGPT, Perplexity et Gemini. Audit gratuit.",
  },
  {
    urlPath: "/tarifs",
    title: "Tarifs site web et SEO dès 50€/mois | Déclic Digital Paris",
    description:
      "Découvrez nos forfaits création de site web et SEO pour TPE et indépendants, à partir de 50€/mois. Devis gratuit et personnalisé sous 24h.",
  },
  {
    urlPath: "/realisations",
    title: "Portfolio : sites web créés pour TPE et artisans | Déclic Digital",
    description:
      "Découvrez nos réalisations : sites vitrines, e-commerce et landing pages pour artisans et TPE. Projets concrets avec résultats mesurables.",
  },
  {
    urlPath: "/qui-sommes-nous",
    title: "Expert Produit Google, fondateur de Déclic Digital | Qui sommes-nous",
    description:
      "Geoffrey, Expert Produit Google, a fondé Déclic Digital pour rendre le web accessible aux TPE. Agence freelance spécialisée site internet et SEO à Paris.",
  },
  {
    urlPath: "/contact",
    title: "Contact et devis gratuit en 24h | Déclic Digital Paris",
    description:
      "Besoin d'un site internet ou d'un boost SEO ? Contactez Déclic Digital par téléphone, email ou formulaire. Devis personnalisé gratuit, réponse sous 24h.",
  },
  {
    urlPath: "/faq",
    title: "FAQ : questions fréquentes sur la création de site et SEO | Déclic Digital",
    description:
      "Toutes les réponses à vos questions sur la création de site web, le référencement SEO et la visibilité IA. Tarifs, délais, méthode : on vous dit tout.",
  },
  {
    urlPath: "/nos-villes",
    title: "Agence web Paris et Hauts-de-Seine (92) | Déclic Digital par ville",
    description:
      "Création de site internet et SEO local à Paris et dans le 92 (Boulogne, Neuilly, Issy...). Retrouvez nos pages dédiées par ville et arrondissement.",
  },
  {
    urlPath: "/nos-metiers",
    title: "Création de site web par métier | Déclic Digital Paris",
    description:
      "Création de site internet professionnel pour tous les métiers indépendants : artisans, commerçants, consultants, professions libérales. Solutions adaptées à chaque activité.",
  },
  {
    urlPath: "/blog",
    title: "Blog création de site web, SEO et tech | Déclic Digital",
    description:
      "Guides pratiques, tendances web design et conseils SEO pour les TPE et artisans. Apprenez à développer votre visibilité en ligne avec le blog Déclic Digital.",
  },
  {
    urlPath: "/rendez-vous",
    title: "Prendre rendez-vous | Déclic Digital Paris",
    description:
      "Réservez un créneau avec Déclic Digital pour échanger sur votre projet de site web ou de référencement SEO. Prise de rendez-vous en ligne rapide.",
  },
  {
    urlPath: "/agence-web-asnieres-sur-seine",
    title: "Agence Web et SEO Asnières-sur-Seine (92) | Déclic Digital",
    description:
      "Création de site web et référencement SEO à Asnières-sur-Seine (92600). Consultant SEO freelance pour TPE, artisans et indépendants. Ligne 13, 10 min de Paris. Devis gratuit.",
  },
  {
    urlPath: "/agence-web-levallois-perret",
    title: "Agence SEO et web Levallois-Perret | Déclic Digital",
    description:
      "Agence SEO et création de site web à Levallois-Perret. Référencement Google local, audit SEO gratuit, site internet professionnel pour TPE et artisans du 92.",
  },
  {
    urlPath: "/agence-web-suresnes",
    title: "Agence SEO et web à Suresnes | Déclic Digital",
    description:
      "Agence SEO et création de site web à Suresnes (92). Référencement Google local, audit SEO gratuit, site internet professionnel pour TPE et artisans de Suresnes.",
  },
  {
    urlPath: "/site-web-decorateur-interieur",
    title: "Création de site web pour décorateur d'intérieur | Déclic Digital Paris",
    description:
      "Vous êtes décorateur d'intérieur à Paris ou dans le 92 ? Déclic Digital crée votre site web portfolio et optimise votre référencement Google pour attirer plus de clients.",
  },
  {
    urlPath: "/plan-du-site",
    title: "Plan du site | Déclic Digital",
    description:
      "Retrouvez toutes les pages du site Déclic Digital : création de site web, référencement SEO, tarifs, réalisations, blog et pages par ville.",
  },
  {
    urlPath: "/mentions-legales",
    title: "Mentions légales | Déclic Digital, agence web Paris",
    description:
      "Mentions légales du site declicdigital.net. Informations sur l'éditeur, l'hébergeur et les conditions d'utilisation du site Déclic Digital.",
  },
  {
    urlPath: "/politique-de-confidentialite",
    title: "Politique de confidentialité et RGPD | Déclic Digital",
    description:
      "Comment Déclic Digital collecte, utilise et protège vos données personnelles. Politique conforme au RGPD. Vos droits d'accès, rectification et suppression.",
  },
];

// ------------------------------------------------------------------
// 2. Pages villes (référencement-seo/:ville et creation-site-web/:ville)
//    Source unique de vérité : src/data/cities.ts + src/data/seoMeta.ts
// ------------------------------------------------------------------
function buildCityRoutes(): RouteMeta[] {
  const routes: RouteMeta[] = [];
  for (const city of cities) {
    const seoService = getSeoMeta("seo", city.slug, city.nameShort);
    if (seoService) {
      routes.push({
        urlPath: `/referencement-seo/${city.slug}`,
        title: seoService.title,
        description: seoService.description,
      });
    }
    const creationService = getSeoMeta("creation", city.slug, city.nameShort);
    if (creationService) {
      routes.push({
        urlPath: `/creation-site-web/${city.slug}`,
        title: creationService.title,
        description: creationService.description,
      });
    }
  }
  return routes;
}

// ------------------------------------------------------------------
// 3. Pages métiers (creation-site-web/metier/:metier)
//    Même formule que dans src/pages/MetierCreationSite.tsx
// ------------------------------------------------------------------
function buildTradeRoutes(): RouteMeta[] {
  return trades.map((trade) => {
    const seo = getTradeSeoMeta(trade);
    return {
      urlPath: `/creation-site-web/metier/${trade.slug}`,
      title: seo.title,
      description: seo.description,
    };
  });
}

// ------------------------------------------------------------------
// 4. Articles de blog (depuis Supabase, status = published)
// ------------------------------------------------------------------
async function buildBlogRoutes(): Promise<RouteMeta[]> {
  try {
    const res = await fetch(
      `${BLOG_SUPABASE_URL}/rest/v1/cms_blog_posts?select=slug,title,meta_title,meta_description&status=eq.published`,
      {
        headers: {
          apikey: BLOG_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${BLOG_SUPABASE_ANON_KEY}`,
        },
      }
    );
    if (!res.ok) {
      console.warn(`[prerender-meta] Supabase blog fetch a échoué (${res.status}), articles de blog ignorés.`);
      return [];
    }
    const posts: { slug: string; title: string; meta_title: string | null; meta_description: string | null }[] =
      await res.json();
    return posts.map((post) => ({
      urlPath: `/blog/${post.slug}`,
      title: post.meta_title || post.title,
      description: post.meta_description || "",
    }));
  } catch (err) {
    console.warn("[prerender-meta] Impossible de récupérer les articles de blog depuis Supabase :", err);
    return [];
  }
}

// ------------------------------------------------------------------
// Écriture des fichiers HTML statiques
// ------------------------------------------------------------------
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function patchHtml(template: string, route: RouteMeta): string {
  const canonical = `${SITE_URL}${route.urlPath}`;
  const safeTitle = escapeHtml(route.title);
  const safeDescription = escapeHtml(route.description);

  let html = template;
  html = html.replace(/<title>.*?<\/title>/s, `<title>${safeTitle}</title>`);
  html = html.replace(
    /<meta name="description" content=".*?"\s*\/>/s,
    `<meta name="description" content="${safeDescription}" />`
  );
  html = html.replace(
    /<link rel="canonical" href=".*?"\s*\/>/s,
    `<link rel="canonical" href="${canonical}" />`
  );
  html = html.replace(
    /<meta property="og:title" content=".*?">/s,
    `<meta property="og:title" content="${safeTitle}">`
  );
  html = html.replace(
    /<meta property="og:description" content=".*?">/s,
    `<meta property="og:description" content="${safeDescription}">`
  );
  html = html.replace(
    /<meta name="twitter:title" content=".*?">/s,
    `<meta name="twitter:title" content="${safeTitle}">`
  );
  html = html.replace(
    /<meta name="twitter:description" content=".*?">/s,
    `<meta name="twitter:description" content="${safeDescription}">`
  );
  // Ajoute une balise og:url si absente, pour cohérence avec la canonical
  if (!/<meta property="og:url"/.test(html)) {
    html = html.replace(
      '<meta property="og:type" content="website">',
      `<meta property="og:type" content="website">\n    <meta property="og:url" content="${canonical}">`
    );
  } else {
    html = html.replace(/<meta property="og:url" content=".*?">/s, `<meta property="og:url" content="${canonical}">`);
  }

  return html;
}

async function main() {
  if (!existsSync(DIST_DIR)) {
    console.error(`[prerender-meta] Dossier dist introuvable (${DIST_DIR}). Le build vite a-t-il bien tourné avant ce script ?`);
    return;
  }

  const templatePath = path.join(DIST_DIR, "index.html");
  if (!existsSync(templatePath)) {
    console.error("[prerender-meta] dist/index.html introuvable, annulation.");
    return;
  }
  const template = readFileSync(templatePath, "utf-8");

  const routes: RouteMeta[] = [
    ...staticPages,
    ...buildCityRoutes(),
    ...buildTradeRoutes(),
    ...(await buildBlogRoutes()),
  ];

  let written = 0;
  for (const route of routes) {
    const outDir = path.join(DIST_DIR, route.urlPath);
    const outFile = path.join(outDir, "index.html");
    try {
      mkdirSync(outDir, { recursive: true });
      writeFileSync(outFile, patchHtml(template, route), "utf-8");
      written++;
    } catch (err) {
      console.warn(`[prerender-meta] Échec d'écriture pour ${route.urlPath}:`, err);
    }
  }

  console.log(`[prerender-meta] ${written}/${routes.length} pages pré-rendues avec title/description/canonical corrects.`);
}

main().catch((err) => {
  // On ne fait jamais échouer le build pour ça : au pire, le comportement
  // redevient celui d'avant (SPA classique), sans casser le déploiement.
  console.error("[prerender-meta] Erreur inattendue, le build continue sans pré-rendu :", err);
});
