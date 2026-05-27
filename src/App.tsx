import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
const GeoRedirect = () => <Navigate to="/visibilite-ia" replace />;
const AuditSeoRedirect = () => <Navigate to="/contact" replace />;
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import ScrollToTop from "./components/ScrollToTop";

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
const FormulaireClient = lazy(() => import("./pages/FormulaireClient"));
const Declicweb = lazy(() => import("./pages/Declicweb"));
const AsnièresSurSeine = lazy(() => import("./pages/AsnièresSurSeine"));
const LevalloisPerret = lazy(() => import("./pages/LevalloisPerret"));
const Suresnes = lazy(() => import("./pages/Suresnes"));
const DecorateurInterieur = lazy(() => import("./pages/DecorateurInterieur"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminClients = lazy(() => import("./pages/admin/AdminClients"));
const AdminClientDetail = lazy(() => import("./pages/admin/AdminClientDetail"));
const AdminSoumissions = lazy(() => import("./pages/admin/AdminSoumissions"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminBlogEditor = lazy(() => import("./pages/admin/AdminBlogEditor"));
const AdminCms = lazy(() => import("./pages/admin/AdminCms"));
const AdminCmsEditor = lazy(() => import("./pages/admin/AdminCmsEditor"));
const AdminTarifs = lazy(() => import("./pages/admin/AdminTarifs"));
const AdminRealisations = lazy(() => import("./pages/admin/AdminRealisations"));
const AdminPageOverrides = lazy(() => import("./pages/admin/AdminPageOverrides"));
const AdminPageOverridesEditor = lazy(() => import("./pages/admin/AdminPageOverridesEditor"));
const AdminCityContent = lazy(() => import("./pages/admin/AdminCityContent"));
const AdminCityContentEditor = lazy(() => import("./pages/admin/AdminCityContentEditor"));

const ConnexionClient = lazy(() => import("./pages/ConnexionClient"));
const EspaceClient = lazy(() => import("./pages/EspaceClient"));
const EspaceClientMessages = lazy(() => import("./pages/EspaceClientMessages"));
const EspaceClientDocuments = lazy(() => import("./pages/EspaceClientDocuments"));
const EspaceClientFactures = lazy(() => import("./pages/EspaceClientFactures"));

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
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/audit-seo-gratuit" element={<AuditSeoRedirect />} />
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
                <Route path="/brief" element={<FormulaireClient />} />
                <Route path="/declicweb" element={<Declicweb />} />
                <Route path="/agence-web-asnieres-sur-seine" element={<AsnièresSurSeine />} />
                <Route path="/agence-web-levallois-perret" element={<LevalloisPerret />} />
                <Route path="/agence-web-suresnes" element={<Suresnes />} />
                <Route path="/site-web-decorateur-interieur" element={<DecorateurInterieur />} />

                <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/clients" element={<AdminClients />} />
                <Route path="/admin/clients/:id" element={<AdminClientDetail />} />
                <Route path="/admin/soumissions" element={<AdminSoumissions />} />
                <Route path="/admin/blog" element={<AdminBlog />} />
                <Route path="/admin/blog/:id" element={<AdminBlogEditor />} />
                <Route path="/admin/cms" element={<AdminCms />} />
                <Route path="/admin/cms/:slug" element={<AdminCmsEditor />} />
                <Route path="/admin/tarifs" element={<AdminTarifs />} />
                <Route path="/admin/realisations" element={<AdminRealisations />} />
                <Route path="/admin/pages" element={<AdminPageOverrides />} />
                <Route path="/admin/pages/:pageKey" element={<AdminPageOverridesEditor />} />
                <Route path="/admin/villes" element={<AdminCityContent />} />
                <Route path="/admin/villes/:slug" element={<AdminCityContentEditor />} />

                <Route path="/connexion" element={<ConnexionClient />} />
                <Route path="/espace-client" element={<EspaceClient />} />
                <Route path="/espace-client/messages" element={<EspaceClientMessages />} />
                <Route path="/espace-client/documents" element={<EspaceClientDocuments />} />
                <Route path="/espace-client/factures" element={<EspaceClientFactures />} />

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
