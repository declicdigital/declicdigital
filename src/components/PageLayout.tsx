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

/**
 * Sections qui ne comptent PAS dans l'alternance pair/impair :
 * - Heroes (gradient-hero, image sombre en fond)
 * - Sections CTA (texture violet-turquoise)
 * - Sections avec image en fond (relative overflow-hidden + img absolute)
 * - Stats strips (bg-[hsl(263...)])
 */
const SKIP_RE = /\bgradient-hero\b|\brelative\b.*\boverflow-hidden\b|bg-\[hsl\(263/;

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
        sec.classList.remove("bg-section-blue", "bg-section-rose", "bg-section-alt");
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

      // On ne traite que les sections de premier niveau (pas imbriquées)
      const topLevel = all.filter(
        (sec) => !sec.parentElement?.closest("section")
      );

      let pos = 0; // compteur des sections qui entrent dans l'alternance

      for (const sec of topLevel) {
        const cls = sec.className || "";

        // Sections exclues de l'alternance
        const isHero    = cls.includes("gradient-hero");
        const isCta     = cls.includes("relative") && cls.includes("overflow-hidden");
        const isStats   = cls.includes("bg-[hsl(263");
        const skip      = isHero || isCta || isStats;

        // Nettoyer les classes précédentes
        sec.classList.remove("bg-section-blue", "bg-section-rose", "bg-section-alt");
        sec.style.removeProperty("background-color");

        if (skip) {
          // Ne pas toucher au fond de ces sections
          continue;
        }

        // Alternance : pair → #F6F1E9, impair → #E9F2F4
        if (pos % 2 === 0) {
          sec.style.backgroundColor = "#F6F1E9";
        } else {
          sec.style.backgroundColor = "#E9F2F4";
        }
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
