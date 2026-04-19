import { lazy, ReactNode, Suspense, Children, isValidElement, useState, useEffect, useCallback, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import { useAuth } from "@/hooks/useAuth";
import { CmsOverridesProvider } from "@/hooks/useCmsOverrides";
import CmsPatcher from "./CmsPatcher";
import { supabase } from "@/integrations/supabase/client";

const EditableSection = lazy(() => import("./admin/EditableSection"));
const Footer = lazy(() => import("./Footer"));
const BlogCarousel = lazy(() => import("./BlogCarousel"));
const AiChatWidget = lazy(() => import("./FaqAiChat").then(m => ({ default: m.AiChatWidget })));
const AdminBar = lazy(() => import("./admin/AdminBar"));

interface PageLayoutProps {
  children: ReactNode;
  hideBlogCarousel?: boolean;
}

/** Flatten fragments so we get individual elements */
function flattenChildren(children: ReactNode): ReactNode[] {
  const flat: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (child != null && child !== false && child !== true) {
      flat.push(child);
    }
  });
  return flat;
}

/** Try to extract a human-readable label from a section element */
function guessLabel(child: any, index: number): string {
  if (!isValidElement(child)) return `Section ${index + 1}`;
  const props = child.props as any;
  const className = props?.className || "";
  const id = props?.id || "";
  if (id) return id;
  if (className.includes("gradient-hero")) return "Hero";
  if (className.includes("gradient-miami")) return "CTA Miami";
  return `Section ${index + 1}`;
}

/** Check if an element is already wrapped in EditableSection */
function isAlreadyEditable(child: any): boolean {
  if (!isValidElement(child)) return false;
  const type = (child as any).type;
  const name = type?.displayName || type?.name || type?._payload?.value?.name || "";
  if (name === "EditableSection") return true;
  const props = child.props as any;
  if (props?.blockId !== undefined && props?.pagePath !== undefined) return true;
  return false;
}

const PageLayout = ({ children, hideBlogCarousel = false }: PageLayoutProps) => {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const pagePath = location.pathname;

  const flat = flattenChildren(children);
  const [order, setOrder] = useState<number[]>(() => flat.map((_, i) => i));
  const [persistedOrderIds, setPersistedOrderIds] = useState<Record<number, string>>({});

  useEffect(() => {
    setOrder(flat.map((_, i) => i));
  }, [flat.length, pagePath]);

  const loadPersistedOrder = useCallback(async () => {
    const { data } = await supabase
      .from("cms_page_blocks")
      .select("id, page_path, sort_order")
      .like("page_path", `${pagePath}::auto-%`)
      .eq("block_type", "section_override")
      .order("sort_order");

    const persistedIds: Record<number, string> = {};
    const persistedIndices: number[] = [];

    (data || []).forEach((row) => {
      const match = row.page_path.match(/::auto-(\d+)$/);
      if (!match) return;
      const index = Number(match[1]);
      if (!Number.isInteger(index) || index < 0 || index >= flat.length) return;
      persistedIds[index] = row.id;
      if (!persistedIndices.includes(index)) persistedIndices.push(index);
    });

    setPersistedOrderIds(persistedIds);
    const defaultOrder = flat.map((_, i) => i);
    setOrder([...persistedIndices, ...defaultOrder.filter((index) => !persistedIndices.includes(index))]);
  }, [flat, pagePath]);

  useEffect(() => {
    void loadPersistedOrder();

    const channel = supabase
      .channel(`cms-section-order:${pagePath}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cms_page_blocks" },
        (payload) => {
          const row = ((payload.new && Object.keys(payload.new).length > 0 ? payload.new : payload.old) || {}) as { page_path?: string; block_type?: string };
          if (row.block_type === "section_override" && typeof row.page_path === "string" && row.page_path.startsWith(`${pagePath}::auto-`)) {
            void loadPersistedOrder();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadPersistedOrder, pagePath]);

  const persistOrder = useCallback(async (nextOrder: number[]) => {
    const now = new Date().toISOString();

    await Promise.all(nextOrder.map(async (originalIdx, displayIdx) => {
      const existingId = persistedOrderIds[originalIdx];
      const payload = { sort_order: displayIdx * 10, updated_at: now };

      if (existingId) {
        await supabase.from("cms_page_blocks").update(payload).eq("id", existingId);
        return;
      }

      const { data } = await supabase
        .from("cms_page_blocks")
        .insert({
          page_path: `${pagePath}::auto-${originalIdx}`,
          block_type: "section_override",
          content: {},
          sort_order: displayIdx * 10,
          updated_at: now,
        })
        .select("id")
        .single();

      if (data?.id) {
        setPersistedOrderIds((prev) => ({ ...prev, [originalIdx]: data.id }));
      }
    }));

    await loadPersistedOrder();
  }, [loadPersistedOrder, pagePath, persistedOrderIds]);

  const moveBlock = useCallback((fromIdx: number, direction: "up" | "down") => {
    setOrder(prev => {
      const newOrder = [...prev];
      const toIdx = direction === "up" ? fromIdx - 1 : fromIdx + 1;
      if (toIdx < 0 || toIdx >= newOrder.length) return prev;
      [newOrder[fromIdx], newOrder[toIdx]] = [newOrder[toIdx], newOrder[fromIdx]];
      void persistOrder(newOrder);
      return newOrder;
    });
  }, [persistOrder]);

  const wrappedChildren = (() => {
    if (!isAdmin) {
      // Lightweight CMS patching only — no admin UI loaded
      let visitorIdx = 0;
      return flat.map((child, i) => {
        if (!isValidElement(child)) return child;
        // Skip CMS patching for elements marked with data-cms-skip
        const childProps = (child as any).props;
        if (childProps?.["data-cms-skip"] != null) return child;
        const idx = visitorIdx++;
        return (
          <CmsPatcher key={i} blockId={`auto-${i}`} pagePath={pagePath} displayIndex={idx}>
            {child}
          </CmsPatcher>
        );
      });
    }

    const orderedChildren = order.map(originalIdx => ({
      child: flat[originalIdx],
      originalIdx,
    }));

    return orderedChildren.map(({ child, originalIdx }, displayIdx) => {
      if (!isValidElement(child)) return child;
      if (isAlreadyEditable(child)) return child;

      const blockId = `auto-${originalIdx}`;
      const label = guessLabel(child, originalIdx);

      return (
        <Suspense key={`${originalIdx}-${displayIdx}`} fallback={child}>
          <EditableSection
            blockId={blockId}
            pagePath={pagePath}
            label={label}
            onMoveUp={displayIdx > 0 ? () => moveBlock(displayIdx, "up") : undefined}
            onMoveDown={displayIdx < orderedChildren.length - 1 ? () => moveBlock(displayIdx, "down") : undefined}
            displayIndex={displayIdx}
          >
            {child}
          </EditableSection>
        </Suspense>
      );
    });
  })();

  const mainRef = useRef<HTMLElement>(null);

  // Central DOM-based section background alternation.
  // Strict positional rule: count ALL top-level <section> elements inside <main> (in order),
  // including those with their own background (hero, miami CTA…). Bloc 1 défaut, 2 bleu,
  // 3 défaut, 4 bleu, etc. Sections with a dedicated background simply keep theirs but
  // still consume their position slot, so the alternation stays figée par position.
  useLayoutEffect(() => {
    const apply = () => {
      const main = mainRef.current;
      if (!main) return;
      const all = Array.from(main.querySelectorAll("section")) as HTMLElement[];
      const candidates = all.filter((sec) => !sec.parentElement?.closest("section"));
      // Patterns indicating the section already has its own background and must be skipped.
      const skipRe = /\bgradient-hero\b|\bgradient-miami\b|\bgradient-primary\b|\bbg-foreground\b|\bbg-primary\b|\bbg-card\b|\bbg-muted\b|\bbg-secondary\b|\bbg-miami\b|bg-\[hsl/;
      candidates.forEach((sec, i) => {
        // Always strip our managed classes first (so re-renders can re-flip correctly).
        sec.classList.remove("bg-section-blue", "bg-section-rose", "bg-section-alt");
        const cls = sec.className || "";
        if (skipRe.test(cls)) return; // skip — this section keeps its own background
        // Strict positional alternation: bloc 1 (i=0) défaut, bloc 2 (i=1) bleu, etc.
        // Skipped sections still consume their slot so neutral sections keep their position.
        if (i % 2 === 1) sec.classList.add("bg-section-blue");
      });
    };
    apply();
    const t1 = window.setTimeout(apply, 100);
    const t2 = window.setTimeout(apply, 600);
    const t3 = window.setTimeout(apply, 1500);
    // Re-apply when lazy components insert/remove sections later.
    const obs = new MutationObserver(() => apply());
    if (mainRef.current) obs.observe(mainRef.current, { childList: true, subtree: true });
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); obs.disconnect(); };
  }, [pagePath, wrappedChildren]);

  return (
    <CmsOverridesProvider pagePath={pagePath}>
      <div className="flex min-h-screen flex-col">
        {isAdmin && <Suspense fallback={null}><AdminBar /></Suspense>}
        <Header isAdmin={isAdmin} />
        <main ref={mainRef} className="flex-1">{wrappedChildren}</main>
        <Suspense fallback={<div style={{ minHeight: 400 }} />}>
          {!hideBlogCarousel && <BlogCarousel />}
          <Footer />
        </Suspense>
        <Suspense fallback={null}>
          <AiChatWidget />
        </Suspense>
      </div>
    </CmsOverridesProvider>
  );
};

export default PageLayout;
