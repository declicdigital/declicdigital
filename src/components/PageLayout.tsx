import { lazy, ReactNode, Suspense, Children, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import { useAuth } from "@/hooks/useAuth";

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

const PageLayout = ({ children, hideBlogCarousel = false }: PageLayoutProps) => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const pagePath = location.pathname;

  const flat = flattenChildren(children);
  const wrappedChildren = flat;

  const mainRef = useRef<HTMLElement>(null);

  // Central DOM-based section background alternation.
  // Strict positional rule: count ALL top-level <section> elements inside <main> (in order),
  // including those with their own background (hero, miami CTA…). Bloc 1 défaut, 2 bleu,
  // 3 défaut, 4 bleu, etc. Sections with a dedicated background simply keep theirs but
  // still consume their position slot, so the alternation stays figée par position.
  useLayoutEffect(() => {
    const skipRe = /\bgradient-hero\b|\bgradient-miami\b|\bgradient-primary\b|\bbg-foreground\b|\bbg-primary\b|\bbg-card\b|\bbg-muted\b|\bbg-secondary\b|\bbg-miami\b|bg-\[hsl/;
    let rafId = 0;
    let scheduled = false;

    const apply = () => {
      scheduled = false;
      const main = mainRef.current;
      if (!main) return;
      // PHASE 1 — READ: gather all sections and their className strings (no writes here).
      const all = main.querySelectorAll("section");
      const plan: { el: HTMLElement; addBlue: boolean }[] = [];
      let pos = 0;
      for (let i = 0; i < all.length; i++) {
        const sec = all[i] as HTMLElement;
        // Skip nested sections
        if (sec.parentElement?.closest("section")) continue;
        const cls = sec.className || "";
        const skipped = skipRe.test(cls);
        plan.push({ el: sec, addBlue: !skipped && pos % 2 === 1 });
        pos++;
      }
      // PHASE 2 — WRITE: mutate classList in a single batch, no further reads.
      for (const { el, addBlue } of plan) {
        el.classList.remove("bg-section-blue", "bg-section-rose", "bg-section-alt");
        if (addBlue) el.classList.add("bg-section-blue");
      }
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      rafId = requestAnimationFrame(apply);
    };

    schedule();
    const t1 = window.setTimeout(schedule, 100);
    const t2 = window.setTimeout(schedule, 600);
    const t3 = window.setTimeout(schedule, 1500);
    const obs = new MutationObserver(schedule);
    if (mainRef.current) obs.observe(mainRef.current, { childList: true, subtree: true });
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      cancelAnimationFrame(rafId);
      obs.disconnect();
    };
  }, [pagePath, wrappedChildren]);

  return (
    <div className="flex min-h-screen flex-col">
      {isAdmin && (
        <Suspense fallback={null}>
          <AdminBar />
        </Suspense>
      )}
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
  );
};

export default PageLayout;
