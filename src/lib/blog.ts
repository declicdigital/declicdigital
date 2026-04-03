import type { BlogArticle } from "@/data/blogArticles";

export interface CmsBlogPostSummary {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string | null;
  category: string;
  read_time: string;
  created_at: string;
  tags?: string[];
}

export interface BlogFeedItem {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
  date: string;
  tags: string[];
  isCms: boolean;
}

const BLOG_CMS_CACHE_KEY = "declic-blog-cms-cache";

const toStaticFeedItem = (article: BlogArticle): BlogFeedItem => ({
  slug: article.slug,
  title: article.title,
  excerpt: article.excerpt,
  image: article.image,
  category: article.category,
  readTime: article.readTime,
  date: article.date,
  tags: article.tags,
  isCms: false,
});

export const mergeBlogArticles = (
  staticArticles: BlogArticle[],
  cmsPosts: CmsBlogPostSummary[]
): BlogFeedItem[] => {
  const merged = new Map<string, BlogFeedItem>();

  staticArticles.forEach((article) => {
    merged.set(article.slug, toStaticFeedItem(article));
  });

  cmsPosts.forEach((post) => {
    const existing = merged.get(post.slug);

    merged.set(post.slug, {
      slug: post.slug,
      title: post.title || existing?.title || "",
      excerpt: post.excerpt || existing?.excerpt || "",
      image: post.cover_image_url || existing?.image || "",
      category: post.category || existing?.category || "",
      readTime: post.read_time || existing?.readTime || "5 min",
      date: post.created_at || existing?.date || new Date().toISOString(),
      tags: post.tags?.length ? post.tags : existing?.tags || [],
      isCms: true,
    });
  });

  return Array.from(merged.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const loadCachedCmsPosts = (): CmsBlogPostSummary[] => {
  if (typeof window === "undefined") return [];

  try {
    const cached = window.sessionStorage.getItem(BLOG_CMS_CACHE_KEY);
    return cached ? (JSON.parse(cached) as CmsBlogPostSummary[]) : [];
  } catch {
    return [];
  }
};

export const saveCachedCmsPosts = (posts: CmsBlogPostSummary[]) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(BLOG_CMS_CACHE_KEY, JSON.stringify(posts));
};

export const upsertCachedCmsPost = (post: CmsBlogPostSummary) => {
  const posts = loadCachedCmsPosts().filter((item) => item.slug !== post.slug);
  posts.unshift(post);
  saveCachedCmsPosts(
    posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  );
};

export const removeCachedCmsPost = (slug: string) => {
  saveCachedCmsPosts(loadCachedCmsPosts().filter((item) => item.slug !== slug));
};