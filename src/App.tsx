import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
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
import Tarifs from "./pages/Tarifs";
import MentionsLegales from "./pages/MentionsLegales";
import Realisations from "./pages/Realisations";
import PlanDuSite from "./pages/PlanDuSite";
import FormulaireClient from "./pages/FormulaireClient";
import AdminSoumissions from "./pages/AdminSoumissions";
import VilleCreationSite from "./pages/VilleCreationSite";
import VilleReferencementSeo from "./pages/VilleReferencementSeo";
import NosVilles from "./pages/NosVilles";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
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
            <Route path="/creation-site-web/:ville" element={<VilleCreationSite />} />
            <Route path="/referencement-seo" element={<ReferencementSeo />} />
            <Route path="/referencement-seo/:ville" element={<VilleReferencementSeo />} />
            <Route path="/nos-villes" element={<NosVilles />} />
            <Route path="/realisations" element={<Realisations />} />
            <Route path="/qui-sommes-nous" element={<QuiSommesNous />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/tarifs" element={<Tarifs />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/plan-du-site" element={<PlanDuSite />} />
            <Route path="/formulaire-client" element={<FormulaireClient />} />
            <Route path="/admin/soumissions" element={<AdminSoumissions />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
