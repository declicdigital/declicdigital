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

const PageLayout = ({
  children,
  hideBlogCarousel = false,
  noAlternate = false,
}: PageLayoutProps) => {
  const location = useLocation();
  const pagePath = location.pathname;
  const flat = flattenChildren(children);
  const mainRef = useRef<HTMLElement>(null);
  const isBlogPage = pagePath.startsWith("/blog");

  useLayoutEffect(() => {
    if (isBlogPage || noAlternate) {
      const main = mainRef.current;
      if (!main) return;
      main.querySelectorAll("section").forEach((sec) => {
        (sec as HTMLElement).style.removeProperty("background-color");
      });
      return;
    }

    let rafId = 0;
    let scheduled = false;

    const apply = () => {
      scheduled = false;
      const main = mainRef.current;
      if (!main) return;

      const all = Array.from(main.querySelectorAll("section")) as HTMLElement[];
      const topLevel = all.filter(
        (sec) => !sec.parentElement?.closest("section")
      );

      let pos = 0;

      for (const sec of topLevel) {
        const cls = sec.className || "";

        // Sections exclues de l'alternance :
        // 1. Hero gradient-hero
        // 2. Stats strip bg-[hsl(263
        // 3. Sections marquées data-alternate="skip" (CTA texture, heroes sombres)
        const isHero  = cls.includes("gradient-hero");
        const isStats = cls.includes("bg-[hsl(263");
        const isSkip  = sec.dataset.alternate === "skip";
        const skip    = isHero || isStats || isSkip;

        sec.style.removeProperty("background-color");
        if (skip) continue;

        sec.style.backgroundColor = pos % 2 === 0 ? "#F6F1E9" : "#E9F2F4";
        pos++;
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
    if (mainRef.current) {
      obs.observe(mainRef.current, { childList: true, subtree: true });
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      cancelAnimationFrame(rafId);
      obs.disconnect();
    };
  }, [pagePath, flat, isBlogPage, noAlternate]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main ref={mainRef} className="flex-1">
        {flat}
      </main>
      <Suspense fallback={<div style={{ minHeight: 400 }} />}>
        {!hideBlogCarousel && <BlogCarousel />}
        <Footer />
      </Suspense>
    </div>
  );
};

export default PageLayout;
