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
