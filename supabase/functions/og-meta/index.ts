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
    title: "Création site web Paris, SEO | Déclic Digital",
    description:
      "Agence web à Paris spécialisée en création de site internet et référencement SEO pour PME. Expert Produit Google. Audit SEO gratuit. Devis en ligne.",
    image: DEFAULT_IMAGE,
  },
  "/creation-site-web": {
    title: "Création de site web professionnel | Déclic Digital",
    description:
      "Création de site internet sur mesure pour PME. Site vitrine, e-commerce, landing page. Design responsive et optimisé SEO. Devis gratuit.",
    image: `${SITE_URL}/og/creation-site.png`,
  },
  "/referencement-seo": {
    title: "Référencement SEO Google | Déclic Digital",
    description:
      "Agence SEO à Paris. Audit, stratégie de référencement naturel et suivi de performance pour PME. Augmentez votre visibilité sur Google.",
    image: `${SITE_URL}/og/seo.png`,
  },
  "/audit-seo-gratuit": {
    title: "Audit SEO gratuit | Déclic Digital",
    description:
      "Recevez un audit SEO complet et gratuit de votre site web. Identifiez vos axes d'amélioration pour mieux vous positionner sur Google.",
    image: `${SITE_URL}/og/audit.png`,
  },
  "/tarifs": {
    title: "Tarifs création de site web et SEO | Déclic Digital",
    description:
      "Découvrez nos tarifs transparents pour la création de site web et le référencement SEO. À partir de 50€/mois. Devis personnalisé gratuit.",
    image: DEFAULT_IMAGE,
  },
  "/realisations": {
    title: "Nos réalisations | Déclic Digital",
    description:
      "Découvrez nos projets de création de sites web et de référencement SEO pour des PME et entrepreneurs.",
    image: DEFAULT_IMAGE,
  },
  "/qui-sommes-nous": {
    title: "Qui sommes-nous | Déclic Digital",
    description:
      "Déclic Digital, agence web fondée par Geoffrey, Expert Produit Google. Accompagnement digital pour PME à Paris et dans les Hauts-de-Seine.",
    image: DEFAULT_IMAGE,
  },
  "/faq": {
    title: "FAQ - Questions fréquentes | Déclic Digital",
    description:
      "Retrouvez les réponses aux questions les plus fréquentes sur la création de site web et le référencement SEO.",
    image: `${SITE_URL}/og/faq.webp`,
  },
  "/contact": {
    title: "Contact | Déclic Digital",
    description:
      "Contactez Déclic Digital pour votre projet web. Devis gratuit sous 24h. Téléphone, email ou formulaire en ligne.",
    image: `${SITE_URL}/og/contact.png`,
  },
  "/blog": {
    title: "Blog | Déclic Digital",
    description:
      "Conseils et actualités sur la création de site web, le SEO et le marketing digital pour les PME.",
    image: DEFAULT_IMAGE,
  },
  "/nos-villes": {
    title: "Nos villes | Création de site web et SEO | Déclic Digital",
    description:
      "Déclic Digital intervient à Paris et dans les Hauts-de-Seine (92). Découvrez nos services de création de site et SEO près de chez vous.",
    image: DEFAULT_IMAGE,
  },
};

const blogArticles: Record<string, PageMeta> = {
  "comment-choisir-hebergement-web-2026": {
    title: "Comment choisir son hébergement web en 2026 | Guide complet",
    description:
      "Découvrez les critères essentiels pour choisir un hébergement web performant en 2026 : vitesse, sécurité, support et prix. Guide pratique pour PME.",
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
