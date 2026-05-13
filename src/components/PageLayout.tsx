import { lazy, ReactNode, Suspense, Children } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import AdminEditBar from "./AdminEditBar";
const Footer = lazy(() => import("./Footer"));
const BlogCarousel = lazy(() => import("./BlogCarousel"));

interface PageLayoutProps {
  children: ReactNode;
  hideBlogCarousel?: boolean;
  noAlternate?: boolean;
  blogCarouselBg?: string;
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
  blogCarouselBg = "#E9F2F4",
}: PageLayoutProps) => {
  const location = useLocation();
  const flat = flattenChildren(children);
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={`flex-1 page-main${noAlternate ? " no-alternate" : ""}`}>
        {flat}
      </main>
      <Suspense fallback={<div style={{ minHeight: 400 }} />}>
        {!hideBlogCarousel && <BlogCarousel backgroundColor={blogCarouselBg} />}
        <Footer />
      </Suspense>
      <AdminEditBar />
    </div>
  );
};

export default PageLayout;
