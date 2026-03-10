import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import AuditSeo from "./pages/AuditSeo";
import CreationSite from "./pages/CreationSite";
import ReferencementSeo from "./pages/ReferencementSeo";
import QuiSommesNous from "./pages/QuiSommesNous";
import Contact from "./pages/Contact";
import Faq from "./pages/Faq";
import MentionsLegales from "./pages/MentionsLegales";
import Realisations from "./pages/Realisations";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/audit-seo-gratuit" element={<AuditSeo />} />
          <Route path="/creation-site-web" element={<CreationSite />} />
          <Route path="/referencement-seo" element={<ReferencementSeo />} />
          <Route path="/qui-sommes-nous" element={<QuiSommesNous />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
