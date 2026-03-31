import { lazy, ReactNode, Suspense } from "react";
import Header from "./Header";

const Footer = lazy(() => import("./Footer"));
const BlogCarousel = lazy(() => import("./BlogCarousel"));
const AiChatWidget = lazy(() => import("./FaqAiChat").then(m => ({ default: m.AiChatWidget })));

interface PageLayoutProps {
  children: ReactNode;
  hideBlogCarousel?: boolean;
}

const PageLayout = ({ children, hideBlogCarousel = false }: PageLayoutProps) => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">{children}</main>
    <Suspense fallback={<div style={{ minHeight: 400 }} />}>
      {!hideBlogCarousel && <BlogCarousel />}
      <Footer />
    </Suspense>
    <Suspense fallback={null}>
      <AiChatWidget />
    </Suspense>
  </div>
);

export default PageLayout;
