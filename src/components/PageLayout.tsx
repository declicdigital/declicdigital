import { lazy, ReactNode, Suspense, Children, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
const Footer = lazy(() => import("./Footer"));
const BlogCarousel = lazy(() => import("./BlogCarousel"));
interface PageLayoutProps {
  children: ReactNode;
  hideBlogCarousel?: boolean;
  noAlternate?: boolean;
}
function flattenChildren(children: ReactNode): ReactNode[] {
  const flat: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (child != null && child !== false && child !== true) {
      flat.push(child);
    }
  });
  return flat;
}
const PageLayout = ({ children, hideBlogCarousel = false, noAlternate = false }: PageLayoutProps) => {
  const location = useLocation();
  const pagePath = location.pathname;
  const flat = flattenChildren(children);
  const wrappedChildren = flat;
  const mainRef = useRef<HTMLElement>(null);

  // Pages où on désactive l'alternance de fond
  const isBlogPage = pagePath.startsWith("/blog");

  useLayoutEffect(() => {
    if (isBlogPage || noAlternate) {
      // Retirer tous les bg-section-blue sur les pages blog
      const main = mainRef.current;
      if (!main) return;
      const all = main.querySelectorAll("section");
      all.forEach((sec) => {
        sec.classList.remove("bg-section-blue", "bg-section-rose", "bg-section-alt");
      });
      return;
    }

    const skipRe = /\bgradient-hero\b|\bgradient-miami\b|\bgradient-primary\b|\bbg-foreground\b|\bbg-primary\b|\bbg-card\b|\bbg-muted\b|\bbg-secondary\b|\bbg-miami\b|bg-\[hsl/;
    let rafId = 0;
    let scheduled = false;
    const apply = () => {
      scheduled = false;
      const main = mainRef.current;
      if (!main) return;
      const all = main.querySelectorAll("section");
      const plan: { el: HTMLElement; addBlue: boolean }[] = [];
      let pos = 0;
      for (let i = 0; i < all.length; i++) {
        const sec = all[i] as HTMLElement;
        if (sec.parentElement?.closest("section")) continue;
        const cls = sec.className || "";
        const skipped = skipRe.test(cls);
        plan.push({ el: sec, addBlue: !skipped && pos % 2 === 1 });
        pos++;
      }
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
  }, [pagePath, wrappedChildren, isBlogPage, noAlternate]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main ref={mainRef} className="flex-1">{wrappedChildren}</main>
      <Suspense fallback={<div style={{ minHeight: 400 }} />}>
        {!hideBlogCarousel && <BlogCarousel />}
        <Footer />
      </Suspense>
    </div>
  );
};
export default PageLayout;
