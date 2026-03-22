import { lazy, ReactNode, Suspense } from "react";
import Header from "./Header";

const Footer = lazy(() => import("./Footer"));
const BlogCarousel = lazy(() => import("./BlogCarousel"));

interface PageLayoutProps {
  children: ReactNode;
  hideBlogCarousel?: boolean;
}

const PageLayout = ({ children, hideBlogCarousel = false }: PageLayoutProps) => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">{children}</main>
    <Suspense fallback={null}>
      {!hideBlogCarousel && <BlogCarousel />}
      <Footer />
    </Suspense>
  </div>
);

export default PageLayout;
