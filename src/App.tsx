import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

const GeoRedirect = () => <Navigate to="/visibilite-ia" replace />;
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import ScrollToTop from "./components/ScrollToTop";

// Lazy-loaded pages for code splitting
const AuditSeo = lazy(() => import("./pages/AuditSeo"));
const CreationSite = lazy(() => import("./pages/CreationSite"));
const ReferencementSeo = lazy(() => import("./pages/ReferencementSeo"));
const QuiSommesNous = lazy(() => import("./pages/QuiSommesNous"));
const Contact = lazy(() => import("./pages/Contact"));
const Faq = lazy(() => import("./pages/Faq"));
const Tarifs = lazy(() => import("./pages/Tarifs"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const Realisations = lazy(() => import("./pages/Realisations"));
const PlanDuSite = lazy(() => import("./pages/PlanDuSite"));
const VilleCreationSite = lazy(() => import("./pages/VilleCreationSite"));
const VilleReferencementSeo = lazy(() => import("./pages/VilleReferencementSeo"));
const NosVilles = lazy(() => import("./pages/NosVilles"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const BlogCategory = lazy(() => import("./pages/BlogCategory"));
const NosMetiers2 = lazy(() => import("./pages/NosMetiers2"));
const MetierCreationSite = lazy(() => import("./pages/MetierCreationSite"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PolitiqueConfidentialite = lazy(() => import("./pages/PolitiqueConfidentialite"));
const Geo = lazy(() => import("./pages/Geo"));
const RendezVous = lazy(() => import("./pages/RendezVous"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<div className="min-h-screen" />}>
              <Routes>
                {/* Site public */}
                <Route path="/" element={<Index />} />
                <Route path="/audit-seo-gratuit" element={<AuditSeo />} />
                <Route path="/creation-site-web" element={<CreationSite />} />
                <Route path="/creation-site-web/metier/:metier" element={<MetierCreationSite />} />
                <Route path="/creation-site-web/:ville" element={<VilleCreationSite />} />
                <Route path="/nos-metiers" element={<NosMetiers2 />} />
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
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/categorie/:categorySlug" element={<BlogCategory />} />
                <Route path="/blog/:slug" element={<BlogArticle />} />
                <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
                <Route path="/visibilite-ia" element={<Geo />} />
                <Route path="/rendez-vous" element={<RendezVous />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/geo" element={<GeoRedirect />} />


                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
