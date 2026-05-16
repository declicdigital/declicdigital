// src/hooks/useCityContent.ts
// Hook pour lire le contenu des villes depuis Supabase
// Fallback automatique sur cityContent.ts et cityGuideContent.ts

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cityContent as staticCityContent, type CityContent } from "@/data/cityContent";
import { getCityGuide, type CityGuide } from "@/data/cityGuideContent";

// ── Types ────────────────────────────────────────────────────
export interface CityContentRow {
  id: string;
  slug: string;
  creation_intro: string;
  creation_why_title: string;
  creation_why_text: string;
  creation_seo_text_1: string;
  creation_seo_text_2: string;
  seo_intro: string;
  seo_why_text: string;
  seo_local_text: string;
  local_fact: string;
  target_keywords: string[];
  guide_creation_title: string;
  guide_creation_sections: { heading: string; text: string }[];
  guide_seo_title: string;
  guide_seo_sections: { heading: string; text: string }[];
  is_published: boolean;
  updated_at: string;
}

export interface ResolvedCityContent {
  // Champs texte principaux
  creationIntro: string;
  creationWhyTitle: string;
  creationWhyText: string;
  creationSeoText: string[];
  seoIntro: string;
  seoWhyText: string;
  seoLocalText: string;
  localFact: string;
  targetKeywords: string[];
  // Guide creation
  guideCreationTitle: string;
  guideCreationSections: { heading: string; text: string }[];
  // Guide seo
  guideSeoTitle: string;
  guideSeoSections: { heading: string; text: string }[];
  // Meta
  isOverridden: boolean;
  raw: CityContentRow | null;
}

// Cache 5 min
const cache = new Map<string, { data: CityContentRow | null; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function buildFromStatic(slug: string): ResolvedCityContent {
  const staticData = staticCityContent[slug] as CityContent | undefined;
  const guide = getCityGuide(slug);

  return {
    creationIntro: staticData?.creationIntro ?? "",
    creationWhyTitle: staticData?.creationWhyTitle ?? "",
    creationWhyText: staticData?.creationWhyText ?? "",
    creationSeoText: staticData?.creationSeoText ?? [],
    seoIntro: staticData?.seoIntro ?? "",
    seoWhyText: staticData?.seoWhyText ?? "",
    seoLocalText: staticData?.seoLocalText ?? "",
    localFact: staticData?.localFact ?? "",
    targetKeywords: staticData?.targetKeywords ?? [],
    guideCreationTitle: guide?.creation?.title ?? "",
    guideCreationSections: guide?.creation?.sections ?? [],
    guideSeoTitle: guide?.seo?.title ?? "",
    guideSeoSections: guide?.seo?.sections ?? [],
    isOverridden: false,
    raw: null,
  };
}

function buildFromRow(row: CityContentRow, slug: string): ResolvedCityContent {
  // Fallback sur le statique pour les champs vides
  const staticData = staticCityContent[slug] as CityContent | undefined;
  const guide = getCityGuide(slug);

  return {
    creationIntro: row.creation_intro || staticData?.creationIntro || "",
    creationWhyTitle: row.creation_why_title || staticData?.creationWhyTitle || "",
    creationWhyText: row.creation_why_text || staticData?.creationWhyText || "",
    creationSeoText: [
      row.creation_seo_text_1 || staticData?.creationSeoText?.[0] || "",
      row.creation_seo_text_2 || staticData?.creationSeoText?.[1] || "",
    ].filter(Boolean),
    seoIntro: row.seo_intro || staticData?.seoIntro || "",
    seoWhyText: row.seo_why_text || staticData?.seoWhyText || "",
    seoLocalText: row.seo_local_text || staticData?.seoLocalText || "",
    localFact: row.local_fact || staticData?.localFact || "",
    targetKeywords: row.target_keywords?.length
      ? row.target_keywords
      : (staticData?.targetKeywords ?? []),
    guideCreationTitle: row.guide_creation_title || guide?.creation?.title || "",
    guideCreationSections: row.guide_creation_sections?.length
      ? row.guide_creation_sections
      : (guide?.creation?.sections ?? []),
    guideSeoTitle: row.guide_seo_title || guide?.seo?.title || "",
    guideSeoSections: row.guide_seo_sections?.length
      ? row.guide_seo_sections
      : (guide?.seo?.sections ?? []),
    isOverridden: true,
    raw: row,
  };
}

export function useCityContent(slug: string): {
  content: ResolvedCityContent;
  loading: boolean;
} {
  const [data, setData] = useState<CityContentRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      const cached = cache.get(slug);
      if (cached && Date.now() - cached.ts < CACHE_TTL) {
        if (!cancelled) { setData(cached.data); setLoading(false); }
        return;
      }
      try {
        const { data: row } = await supabase
          .from("city_content")
          .select("*")
          .eq("slug", slug)
          .eq("is_published", true)
          .maybeSingle();
        if (!cancelled) {
          cache.set(slug, { data: row as CityContentRow | null, ts: Date.now() });
          setData(row as CityContentRow | null);
          setLoading(false);
        }
      } catch {
        if (!cancelled) { setData(null); setLoading(false); }
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [slug]);

  return {
    content: data ? buildFromRow(data, slug) : buildFromStatic(slug),
    loading,
  };
}

export function invalidateCityCache(slug: string) {
  cache.delete(slug);
}

export async function fetchCityContentForAdmin(
  slug: string
): Promise<CityContentRow | null> {
  const { data } = await supabase
    .from("city_content")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data as CityContentRow | null;
}
