import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import logo from "@/assets/logo-declic-transparent.png";
import logoWhite from "@/assets/logo-declic-white.png";

const Footer = () => (
  <footer className="border-t border-border">
    <div className="bg-footer-bg text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <img src={logoWhite} alt="Déclic Digital" className="h-16" />
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Déclic Digital accompagne les PME et petites entreprises à Paris et dans les Hauts-de-Seine (92) pour développer leur visibilité en ligne. Fondée par un Expert Produit Google.
            </p>
            <div className="space-y-2 text-sm text-primary-foreground/70">
              <a href="tel:0602228939" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
                <Phone size={14} /> 06.02.22.89.39
              </a>
              <a href="mailto:contact@declicdigital.net" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
                <Mail size={14} /> contact@declicdigital.net
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary-foreground/50">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/creation-site-web" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Création de site web</Link></li>
              <li><Link to="/referencement-seo" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Référencement SEO</Link></li>
              <li><Link to="/audit-seo-gratuit" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Audit SEO gratuit</Link></li>
              <li><Link to="/tarifs" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Nos tarifs</Link></li>
              <li><Link to="/contact" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Demande de devis</Link></li>
              <li><Link to="/nos-villes" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors font-semibold">Nos villes →</Link></li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary-foreground/50">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Accueil</Link></li>
              <li><Link to="/realisations" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Réalisations</Link></li>
              <li><Link to="/qui-sommes-nous" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Qui sommes-nous</Link></li>
              <li><Link to="/faq" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">FAQ</Link></li>
              <li><Link to="/blog" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors font-semibold">Blog →</Link></li>
              <li><Link to="/plan-du-site" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Plan du site</Link></li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary-foreground/50">Contact</h3>
            <p className="text-sm text-primary-foreground/70 mb-4">
              Prêt à développer votre visibilité en ligne ?
            </p>
            <div className="flex flex-col items-start gap-3">
              <Link
                to="/audit-seo-gratuit"
                className="inline-block gradient-primary rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Audit SEO gratuit
              </Link>
              <Link
                to="/formulaire-client"
                className="inline-block rounded-full border border-primary-foreground/30 px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
              >
                Formulaire client
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/10 pt-6 space-y-4">
          <p className="text-xs text-primary-foreground/40 italic">* Offre à 100€ valable uniquement pour les sites vitrine.</p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/40">
            <span>© {new Date().getFullYear()} Déclic Digital. SIRET 102 436 664 00019. Tous droits réservés.</span>
            <Link to="/mentions-legales" className="hover:text-primary-foreground transition-colors">Mentions légales</Link>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
