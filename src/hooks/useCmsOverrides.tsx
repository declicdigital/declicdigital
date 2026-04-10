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
export const CmsOverridesProvider = ({ pagePath, children }: Props) => {
  const [overrides, setOverrides] = useState<Map<string, CmsOverride>>(new Map());
  const [loaded, setLoaded] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoaded(false);
    supabase
      .from("cms_page_blocks")
      .select("id, content, page_path")
      .like("page_path", `${pagePath}::%`)
      .eq("block_type", "section_override")
      .then(({ data }) => {
        const map = new Map<string, CmsOverride>();
        if (data) {
          for (const row of data) {
            map.set(row.page_path, { id: row.id, content: row.content as any });
          }
        }
        setOverrides(map);
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
