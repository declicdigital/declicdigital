import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import logo from "@/assets/logo-declic-digital-new.webp";

const Footer = () => (
  <footer className="border-t border-border relative overflow-hidden">
    {/* Grain overlay on footer */}
    <div className="absolute inset-0 pointer-events-none z-10" style={{ background: "url('/grain.webp')", backgroundSize: "256px 256px", opacity: 0.12, mixBlendMode: "soft-light" }} />
    <div style={{ background: "hsl(230, 18%, 15%)" }}>
      <div className="container py-6 md:py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-1.5">
            <img src={logo} alt="Déclic Digital" className="h-36 -mt-4 -mb-4" width={216} height={144} />
            <p className="text-sm text-white/60 leading-relaxed">
              Déclic Digital accompagne les TPE et indépendants à Paris et dans les Hauts-de-Seine (92) pour développer leur visibilité en ligne. Fondée par un Expert Produit Google.
            </p>
            <div className="space-y-1.5 text-sm text-white/60">
              <a href="tel:0602228939" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={14} className="text-brand-blue" /> 06.02.22.89.39
              </a>
              <a href="mailto:contact@declicdigital.net" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={14} className="text-brand-blue" /> contact@declicdigital.net
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-blue">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/creation-site-web" className="text-white/60 hover:text-white transition-colors">Création de site web</Link></li>
              <li><Link to="/referencement-seo" className="text-white/60 hover:text-white transition-colors">Référencement SEO</Link></li>
              <li><Link to="/audit-seo-gratuit" className="text-white/60 hover:text-white transition-colors">Audit SEO gratuit</Link></li>
              <li><Link to="/tarifs" className="text-white/60 hover:text-white transition-colors">Nos tarifs</Link></li>
              <li><Link to="/contact" className="text-white/60 hover:text-white transition-colors">Demande de devis</Link></li>
              <li><Link to="/nos-villes" className="text-white/60 hover:text-white font-semibold transition-colors">Nos villes →</Link></li>
              <li><Link to="/nos-metiers" className="text-white/60 hover:text-white font-semibold transition-colors">Nos métiers →</Link></li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-violet">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-white/60 hover:text-white transition-colors">Accueil</Link></li>
              <li><Link to="/realisations" className="text-white/60 hover:text-white transition-colors">Réalisations</Link></li>
              <li><Link to="/qui-sommes-nous" className="text-white/60 hover:text-white transition-colors">Qui sommes-nous</Link></li>
              <li><Link to="/faq" className="text-white/60 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/blog" className="text-white/60 hover:text-white font-semibold transition-colors">Blog →</Link></li>
              <li><Link to="/plan-du-site" className="text-white/60 hover:text-white transition-colors">Plan du site</Link></li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-pink">Contact</h3>
            <p className="text-sm text-white/60 mb-3">
              Prêt à développer votre visibilité en ligne ?
            </p>
            <div className="flex flex-col items-start gap-2.5">
              <Link
                to="/audit-seo-gratuit"
                className="inline-block gradient-primary btn-glow rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all"
              >
                Audit SEO gratuit
              </Link>
              <Link
                to="/formulaire-client"
                className="inline-block rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white/80 hover:text-white hover:border-white/50 hover:bg-white/5 transition-colors"
              >
                Formulaire client
              </Link>
            </div>
          </div>
        </div>

        {/* Separator with gradient */}
        <div className="mt-10 mb-5 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(183, 70%, 63%, 0.3), hsl(284, 65%, 66%, 0.3), hsl(330, 100%, 70%, 0.3), transparent)" }} />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <span>© {new Date().getFullYear()} Déclic Digital. SIRET 102 436 664 00019. Tous droits réservés.</span>
          <div className="flex items-center gap-4">
            <Link to="/mentions-legales" className="hover:text-white/70 transition-colors">Mentions légales</Link>
            <Link to="/politique-de-confidentialite" className="hover:text-white/70 transition-colors">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
