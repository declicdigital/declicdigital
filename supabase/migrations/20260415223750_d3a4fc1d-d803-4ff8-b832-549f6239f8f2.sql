-- Move "Technique" articles to "SEO & Performance"
UPDATE cms_blog_posts SET category = 'SEO & Performance' WHERE category = 'Technique';

-- Move GEO-related articles to "GEO, Visibilité IA"
UPDATE cms_blog_posts SET category = 'GEO, Visibilité IA' WHERE slug IN (
  'geo-generative-engine-optimization-chatgpt-perplexity',
  'google-ai-overviews-visibilite-locale-tpe'
);