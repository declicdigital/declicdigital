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

const BLOG_CMS_CACHE_KEY = "declic-blog-cms-cache-v3";

const sortByNewest = <T extends { created_at?: string; date?: string }>(items: T[]) =>
  [...items].sort((a, b) => {
    const left = new Date(("created_at" in a ? a.created_at : a.date) || 0).getTime();
    const right = new Date(("created_at" in b ? b.created_at : b.date) || 0).getTime();
    return right - left;
  });

const normalizeCmsPosts = (posts: CmsBlogPostSummary[]): CmsBlogPostSummary[] => {
  const deduped = new Map<string, CmsBlogPostSummary>();

  sortByNewest(posts)
    .filter((post): post is CmsBlogPostSummary => Boolean(post?.slug))
    .forEach((post) => {
      const existing = deduped.get(post.slug);

      deduped.set(post.slug, {
        ...existing,
        ...post,
        cover_image_url: post.cover_image_url ?? existing?.cover_image_url ?? null,
        tags: post.tags ?? existing?.tags ?? [],
      });
    });

  return sortByNewest(Array.from(deduped.values()));
};

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

  normalizeCmsPosts(cmsPosts).forEach((post) => {
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

  return sortByNewest(Array.from(merged.values()));
};

export const loadCachedCmsPosts = (): CmsBlogPostSummary[] => {
  if (typeof window === "undefined") return [];

  try {
    const cached = window.sessionStorage.getItem(BLOG_CMS_CACHE_KEY);
    if (!cached) return [];

    const parsed = JSON.parse(cached) as CmsBlogPostSummary[] | { posts?: CmsBlogPostSummary[] };
    const posts = Array.isArray(parsed) ? parsed : parsed.posts;

    return Array.isArray(posts) ? normalizeCmsPosts(posts) : [];
  } catch {
    return [];
  }
};

export const saveCachedCmsPosts = (posts: CmsBlogPostSummary[]) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(
    BLOG_CMS_CACHE_KEY,
    JSON.stringify({ posts: normalizeCmsPosts(posts), savedAt: Date.now() })
  );
};

export const upsertCachedCmsPost = (post: CmsBlogPostSummary) => {
  const posts = loadCachedCmsPosts().filter(
    (item) => item.slug !== post.slug && item.id !== post.id
  );
  posts.unshift(post);
  saveCachedCmsPosts(posts);
};

export const removeCachedCmsPost = (slug: string) => {
  saveCachedCmsPosts(loadCachedCmsPosts().filter((item) => item.slug !== slug));
};