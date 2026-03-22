const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://declicdigital.net";
const DEFAULT_IMAGE = `${SITE_URL}/og/default.png`;

interface PageMeta {
  title: string;
  description: string;
  image: string;
}

const staticPages: Record<string, PageMeta> = {
  "/": {
    title: "Agence web Paris | Création site internet & SEO TPE | Déclic Digital",
    description:
      "Déclic Digital, agence web à Paris spécialisée TPE et artisans. Création de site internet professionnel et référencement SEO en Île-de-France. Audit gratuit, devis en 24h.",
    image: DEFAULT_IMAGE,
  },
  "/creation-site-web": {
    title: "Création de site internet sur-mesure pour TPE | Déclic Digital Paris",
    description:
      "Site vitrine, e-commerce ou landing page pour TPE et artisans. Design responsive, optimisé SEO, livré en 2 semaines. Devis gratuit en 24h.",
    image: `${SITE_URL}/og/creation-site.png`,
  },
  "/referencement-seo": {
    title: "Référencement SEO Google pour TPE | Agence SEO Paris | Déclic Digital",
    description:
      "Gagnez en visibilité sur Google grâce au référencement naturel local. Audit SEO, optimisation technique et suivi de positionnement pour TPE en Île-de-France.",
    image: `${SITE_URL}/og/seo.png`,
  },
  "/audit-seo-gratuit": {
    title: "Audit SEO gratuit de votre site web en 48h | Déclic Digital",
    description:
      "Demandez votre audit SEO gratuit : analyse technique, mots clés, concurrence et recommandations personnalisées. Résultats envoyés sous 48 heures.",
    image: `${SITE_URL}/og/audit.png`,
  },
  "/tarifs": {
    title: "Tarifs site web et SEO dès 50€/mois | Déclic Digital Paris",
    description:
      "Tarifs transparents : landing page dès 200€, site vitrine dès 590€, SEO dès 50€/mois. Forfaits adaptés aux TPE et artisans. Sans engagement, devis gratuit.",
    image: DEFAULT_IMAGE,
  },
  "/realisations": {
    title: "Portfolio : sites web créés pour TPE et artisans | Déclic Digital",
    description:
      "Découvrez nos réalisations : sites vitrines, e-commerce et landing pages pour artisans et TPE. Projets concrets avec résultats mesurables.",
    image: DEFAULT_IMAGE,
  },
  "/qui-sommes-nous": {
    title: "Expert Produit Google, fondateur de Déclic Digital | Qui sommes-nous",
    description:
      "Geoffrey, Expert Produit Google, a fondé Déclic Digital pour rendre le web accessible aux TPE. Agence freelance spécialisée site internet et SEO à Paris.",
    image: DEFAULT_IMAGE,
  },
  "/faq": {
    title: "FAQ : 20 questions sur la création de site web et le SEO | Déclic Digital",
    description:
      "Combien coûte un site web ? Combien de temps pour apparaitre sur Google ? Retrouvez 20 réponses concrètes sur la création de site et le SEO pour TPE.",
    image: `${SITE_URL}/og/faq.webp`,
  },
  "/contact": {
    title: "Contact et devis gratuit en 24h | Déclic Digital Paris",
    description:
      "Besoin d'un site internet ou d'un boost SEO ? Contactez Déclic Digital par téléphone, email ou formulaire. Devis personnalisé gratuit, réponse sous 24h.",
    image: `${SITE_URL}/og/contact.png`,
  },
  "/blog": {
    title: "Blog création de site web, SEO et tech | Déclic Digital",
    description:
      "Guides pratiques, tendances web design et conseils SEO pour les TPE et artisans. Apprenez à développer votre visibilité en ligne avec le blog Déclic Digital.",
    image: DEFAULT_IMAGE,
  },
  "/nos-villes": {
    title: "Agence web Paris et Hauts-de-Seine (92) | Déclic Digital par ville",
    description:
      "Création de site internet et SEO local à Paris et dans le 92 (Boulogne, Neuilly, Issy...). Retrouvez nos pages dédiées par ville et arrondissement.",
    image: DEFAULT_IMAGE,
  },
};

const blogArticles: Record<string, PageMeta> = {
  "comment-choisir-hebergement-web-2026": {
    title: "Comment choisir son hébergement web en 2026 | Guide complet",
    description:
      "Découvrez les critères essentiels pour choisir un hébergement web performant en 2026 : vitesse, sécurité, support et prix. Guide pratique pour TPE.",
    image: `${SITE_URL}/og/hebergement.webp`,
  },
  "tendances-web-design-2026": {
    title: "Tendances web design 2026 : 7 styles incontournables",
    description:
      "Découvrez les 7 tendances web design de 2026 : minimalisme audacieux, micro-interactions, typographies XXL et bien plus. Inspirez votre prochain site.",
    image: `${SITE_URL}/og/web-design.jpg`,
  },
  "vitesse-site-web-impact-chiffre-affaires": {
    title: "Vitesse de site web et chiffre d'affaires : le lien prouvé",
    description:
      "Un site lent fait fuir vos visiteurs et plombe votre SEO. Découvrez les chiffres clés et les solutions concrètes pour accélérer votre site web.",
    image: `${SITE_URL}/og/vitesse.jpg`,
  },
  "knafo-municipales-paris-campagne-digitale-site-web": {
    title:
      "Knafo municipales Paris : 10% grâce au site web et au digital",
    description:
      "Analyse de la stratégie digitale de Knafo aux municipales de Paris 2026. Comment un site web performant et une campagne en ligne ont permis d'atteindre 10% des voix.",
    image: `${SITE_URL}/og/campagne.jpg`,
  },
  "whatsapp-montres-garmin-evolution-usage": {
    title:
      "WhatsApp sur Garmin : l'évolution qui change tout | Déclic Digital",
    description:
      "WhatsApp devient exploitable sur les montres Garmin. Analyse de cette évolution qui transforme l'usage quotidien des montres connectées pour les sportifs.",
    image: `${SITE_URL}/og/garmin.jpg`,
  },
};

function getMeta(path: string): PageMeta {
  // Exact match for static pages
  if (staticPages[path]) return staticPages[path];

  // Blog article
  const blogMatch = path.match(/^\/blog\/([^/]+)$/);
  if (blogMatch && blogArticles[blogMatch[1]]) {
    return blogArticles[blogMatch[1]];
  }

  // Fallback
  return staticPages["/"];
}

function buildHtml(path: string, meta: PageMeta): string {
  const canonicalUrl = `${SITE_URL}${path}`;
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}" />
  <link rel="canonical" href="${canonicalUrl}" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.description}" />
  <meta property="og:image" content="${meta.image}" />
  <meta property="og:site_name" content="Déclic Digital" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${meta.title}" />
  <meta name="twitter:description" content="${meta.description}" />
  <meta name="twitter:image" content="${meta.image}" />

  <meta http-equiv="refresh" content="0;url=${canonicalUrl}" />
</head>
<body>
  <p>Redirection vers <a href="${canonicalUrl}">${meta.title}</a>...</p>
  <script>window.location.replace("${canonicalUrl}");</script>
</body>
</html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.searchParams.get("path") || "/";
  const meta = getMeta(path);
  const html = buildHtml(path, meta);

  return new Response(html, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
});
