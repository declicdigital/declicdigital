// src/hooks/usePageContent.ts
// ============================================================
// Hook React pour lire les surcharges de contenu depuis
// Supabase, avec fallback automatique sur les données statiques.
// ============================================================

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PageOverride {
  page_key: string;
  page_label: string;
  page_type: string;
  page_url: string;
  seo_title: string | null;
  seo_description: string | null;
  seo_h1: string | null;
  hero_intro: string | null;
  hero_bg_image_url: string | null;
  sections: Section[];
  creation_seo_text_1: string | null;
  creation_seo_text_2: string | null;
  creation_why_text: string | null;
  seo_local_text: string | null;
  seo_why_text: string | null;
  local_fact: string | null;
  is_published: boolean;
  updated_at: string;
}

export interface Section {
  id: string;
  type: "h2" | "h3" | "p" | "image";
  content: string;
  order: number;
  visible: boolean;
}

export interface PageContentFallback {
  seoTitle: string;
  seoDescription: string;
  seoH1: string;
  heroIntro: string;
  heroBgImageUrl?: string;
  creationSeoText?: string[];
  creationWhyText?: string;
  seoLocalText?: string;
  seoWhyText?: string;
  localFact?: string;
}

export interface ResolvedPageContent {
  seoTitle: string;
  seoDescription: string;
  seoH1: string;
  heroIntro: string;
  heroBgImageUrl: string | undefined;
  sections: Section[];
  creationSeoText: string[];
  creationWhyText: string;
  seoLocalText: string;
  seoWhyText: string;
  localFact: string;
  isOverridden: boolean;      // true si des données Supabase sont actives
  isPublished: boolean;
  override: PageOverride | null;
}

// Cache en mémoire pour éviter les requêtes répétées (5 min)
const cache = new Map<string, { data: PageOverride | null; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function mergeWithFallback(
  override: PageOverride | null,
  fallback: PageContentFallback
): ResolvedPageContent {
  if (!override) {
    return {
      seoTitle: fallback.seoTitle,
      seoDescription: fallback.seoDescription,
      seoH1: fallback.seoH1,
      heroIntro: fallback.heroIntro,
      heroBgImageUrl: fallback.heroBgImageUrl,
      sections: [],
      creationSeoText: fallback.creationSeoText ?? [],
      creationWhyText: fallback.creationWhyText ?? "",
      seoLocalText: fallback.seoLocalText ?? "",
      seoWhyText: fallback.seoWhyText ?? "",
      localFact: fallback.localFact ?? "",
      isOverridden: false,
      isPublished: false,
      override: null,
    };
  }

  return {
    seoTitle: override.seo_title ?? fallback.seoTitle,
    seoDescription: override.seo_description ?? fallback.seoDescription,
    seoH1: override.seo_h1 ?? fallback.seoH1,
    heroIntro: override.hero_intro ?? fallback.heroIntro,
    heroBgImageUrl: override.hero_bg_image_url ?? fallback.heroBgImageUrl,
    sections: override.sections ?? [],
    creationSeoText: [
      override.creation_seo_text_1 ?? fallback.creationSeoText?.[0] ?? "",
      override.creation_seo_text_2 ?? fallback.creationSeoText?.[1] ?? "",
    ].filter(Boolean),
    creationWhyText: override.creation_why_text ?? fallback.creationWhyText ?? "",
    seoLocalText: override.seo_local_text ?? fallback.seoLocalText ?? "",
    seoWhyText: override.seo_why_text ?? fallback.seoWhyText ?? "",
    localFact: override.local_fact ?? fallback.localFact ?? "",
    isOverridden: true,
    isPublished: override.is_published,
    override,
  };
}

export function usePageContent(
  pageKey: string,
  fallback: PageContentFallback
): { content: ResolvedPageContent; loading: boolean } {
  const [override, setOverride] = useState<PageOverride | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      // Vérifier le cache
      const cached = cache.get(pageKey);
      if (cached && Date.now() - cached.ts < CACHE_TTL) {
        if (!cancelled) {
          setOverride(cached.data);
          setLoading(false);
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from("page_overrides")
          .select("*")
          .eq("page_key", pageKey)
          .eq("is_published", true)
          .maybeSingle();

        if (!cancelled) {
          const result = error ? null : (data as PageOverride | null);
          cache.set(pageKey, { data: result, ts: Date.now() });
          setOverride(result);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setOverride(null);
          setLoading(false);
        }
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [pageKey]);

  return {
    content: mergeWithFallback(override, fallback),
    loading,
  };
}

// ── Lecture admin (sans filtre is_published) ────────────────
// Utilisé par l'éditeur admin pour voir même les brouillons.
export async function fetchOverrideForAdmin(
  pageKey: string
): Promise<PageOverride | null> {
  const { data } = await supabase
    .from("page_overrides")
    .select("*")
    .eq("page_key", pageKey)
    .maybeSingle();
  return data as PageOverride | null;
}

// ── Invalidation du cache (après save dans l'admin) ─────────
export function invalidatePageCache(pageKey: string) {
  cache.delete(pageKey);
}
