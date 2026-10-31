# Articles de blog à importer

Chaque fichier `.json` ici est un article pour la table `cms_blog_posts`.
Il est envoyé à Supabase par le workflow « Import des articles de blog » (`.github/workflows/import-articles.yml`).

- `slug` : sans `/` au début ni `/blog/` (ex. `mon-article`).
- `status: "published"` + `created_at` : publié, avec la date affichée (antidatage possible).
- `status: "draft"` + `scheduled_at` : programmé. `api/publish-scheduled.ts` le passe en publié à l'échéance, et `created_at` donne la date affichée.
- Un slug déjà présent en base est ignoré, jamais écrasé.
- Prérequis : secret de dépôt `SUPABASE_SERVICE_ROLE_KEY` (Settings > Secrets and variables > Actions).
