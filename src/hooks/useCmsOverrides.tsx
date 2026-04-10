import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CmsOverride {
  id: string;
  content: any;
}

interface CmsOverridesContextValue {
  /** Get override for a given compositeKey (pagePath::blockId) */
  getOverride: (compositeKey: string) => CmsOverride | null;
  loaded: boolean;
  /** Force refresh after save/delete */
  refresh: () => void;
}

const CmsOverridesContext = createContext<CmsOverridesContextValue>({
  getOverride: () => null,
  loaded: false,
  refresh: () => {},
});

export const useCmsOverrides = () => useContext(CmsOverridesContext);

interface Props {
  pagePath: string;
  children: ReactNode;
}

/**
 * Loads ALL cms_page_blocks for a given page_path prefix in a single query,
 * then distributes results to EditableSection children via context.
 */
const CACHE_TTL = 300_000; // 5 min

export const CmsOverridesProvider = ({ pagePath, children }: Props) => {
  const [overrides, setOverrides] = useState<Map<string, CmsOverride>>(() => {
    // Hydrate from localStorage cache immediately
    try {
      const raw = localStorage.getItem(`dd_cms_${pagePath}`);
      if (raw) {
        const { entries, ts } = JSON.parse(raw);
        if (Date.now() - ts < CACHE_TTL) {
          return new Map<string, CmsOverride>(entries);
        }
      }
    } catch {}
    return new Map();
  });
  const [loaded, setLoaded] = useState(() => {
    try {
      const raw = localStorage.getItem(`dd_cms_${pagePath}`);
      if (raw) {
        const { ts } = JSON.parse(raw);
        return Date.now() - ts < CACHE_TTL;
      }
    } catch {}
    return false;
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    supabase
      .from("cms_page_blocks")
      .select("id, content, page_path")
      .like("page_path", `${pagePath}::%`)
      .eq("block_type", "section_override")
      .then(({ data }) => {
        const entries: [string, CmsOverride][] = [];
        if (data) {
          for (const row of data) {
            entries.push([row.page_path, { id: row.id, content: row.content as any }]);
          }
        }
        try { localStorage.setItem(`dd_cms_${pagePath}`, JSON.stringify({ entries, ts: Date.now() })); } catch {}
        setOverrides(new Map(entries));
        setLoaded(true);
      });
  }, [pagePath, refreshKey]);

  const value = useMemo<CmsOverridesContextValue>(() => ({
    getOverride: (key: string) => overrides.get(key) || null,
    loaded,
    refresh: () => setRefreshKey(k => k + 1),
  }), [overrides, loaded]);

  return (
    <CmsOverridesContext.Provider value={value}>
      {children}
    </CmsOverridesContext.Provider>
  );
};
