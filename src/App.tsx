import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
const Index = lazy(() => import("./pages/Index"));
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
const FormulaireClient = lazy(() => import("./pages/FormulaireClient"));
const AdminSoumissions = lazy(() => import("./pages/AdminSoumissions"));
const AdminClients = lazy(() => import("./pages/AdminClients"));
const AdminClientDetail = lazy(() => import("./pages/AdminClientDetail"));
const Connexion = lazy(() => import("./pages/Connexion"));
const EspaceClient = lazy(() => import("./pages/EspaceClient"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const VilleCreationSite = lazy(() => import("./pages/VilleCreationSite"));
const VilleReferencementSeo = lazy(() => import("./pages/VilleReferencementSeo"));
const NosVilles = lazy(() => import("./pages/NosVilles"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const BlogCategory = lazy(() => import("./pages/BlogCategory"));
const SharedProject = lazy(() => import("./pages/SharedProject"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PolitiqueConfidentialite = lazy(() => import("./pages/PolitiqueConfidentialite"));
const FormulaireBrief = lazy(() => import("./pages/FormulaireBrief"));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<div className="min-h-screen" />}>
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
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/categorie/:categorySlug" element={<BlogCategory />} />
                <Route path="/blog/:slug" element={<BlogArticle />} />
                <Route path="/connexion" element={<Connexion />} />
                <Route path="/espace-client" element={<EspaceClient />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/admin/clients" element={<AdminClients />} />
                <Route path="/admin/client/:clientId" element={<AdminClientDetail />} />
                <Route path="/admin/soumissions" element={<AdminSoumissions />} />
                <Route path="/projet/:token" element={<SharedProject />} />
                <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
                <Route path="/brief" element={<FormulaireBrief />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
