export interface BlogArticle {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  content: string;
  relatedSlugs: string[];
}

export const blogArticles: BlogArticle[] = [];

export const blogCategories = [...new Set(blogArticles.map((a) => a.category))];

export const getArticlesByCategory = (category: string) =>
  blogArticles.filter((a) => a.category === category);

export const getCategorySlug = (category: string) =>
  category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const getCategoryFromSlug = (slug: string) =>
  blogCategories.find((c) => getCategorySlug(c) === slug);

export const getArticleBySlug = (slug: string) =>
  blogArticles.find((a) => a.slug === slug);

export const getRelatedArticles = (article: BlogArticle) =>
  article.relatedSlugs
    .map((s) => blogArticles.find((a) => a.slug === s))
    .filter(Boolean) as BlogArticle[];
