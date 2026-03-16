import { ReactNode } from "react";
import PromoBanner from "./PromoBanner";
import Header from "./Header";
import Footer from "./Footer";
import BlogCarousel from "./BlogCarousel";

interface PageLayoutProps {
  children: ReactNode;
  hideBlogCarousel?: boolean;
}

const PageLayout = ({ children, hideBlogCarousel = false }: PageLayoutProps) => (
  <div className="flex min-h-screen flex-col">
    <PromoBanner />
    <Header />
    <main className="flex-1">{children}</main>
    {!hideBlogCarousel && <BlogCarousel />}
    <Footer />
  </div>
);

export default PageLayout;
