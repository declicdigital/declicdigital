export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  category: string;
  tags: string[];
  readTime: string;
  metaTitle: string;
  metaDescription: string;
  relatedSlugs: string[];
  date: string;
}

export const blogPosts: BlogPost[] = [];

export const getPostBySlug = (slug: string) => blogPosts.find((p) => p.slug === slug);

export const blogCategories = [
  "Création de site",
  "SEO & Performance",
  "Stratégie digitale",
  "GEO, Visibilité IA",
  "Business",
];

export const getCategorySlug = (category: string) =>
  category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const getCategoryFromSlug = (slug: string) =>
  blogCategories.find((c) => getCategorySlug(c) === slug);

export const getRelatedPosts = (post: BlogPost): BlogPost[] =>
  post.relatedSlugs
    .map((s) => blogPosts.find((p) => p.slug === s))
    .filter((p): p is BlogPost => Boolean(p));
