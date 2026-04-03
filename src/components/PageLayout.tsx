import { lazy, ReactNode, Suspense } from "react";
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

const PageLayout = ({ children, hideBlogCarousel = false }: PageLayoutProps) => {
  const { isAdmin } = useAuth();
  return (
  <div className="flex min-h-screen flex-col">
    {isAdmin && <Suspense fallback={null}><AdminBar /></Suspense>}
    <Header isAdmin={isAdmin} />
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
};

export default PageLayout;
