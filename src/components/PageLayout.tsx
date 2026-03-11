import { ReactNode } from "react";
import PromoBanner from "./PromoBanner";
import Header from "./Header";
import Footer from "./Footer";

const PageLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <PromoBanner />
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default PageLayout;
