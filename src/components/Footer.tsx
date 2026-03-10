import { Link } from "react-router-dom";
import logo from "@/assets/logo-declic-digital.png";

const Footer = () => (
  <footer className="border-t border-border bg-foreground text-primary-foreground">
    <div className="container py-12 md:py-16">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="space-y-4">
          <img src={logo} alt="Déclic Digital" className="h-10" />
          <p className="text-sm text-primary-foreground/70 leading-relaxed">
            Déclic Digital accompagne les PME et petites entreprises partout en France pour développer leur visibilité en ligne.
          </p>
        </div>

        {/* Services */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary-foreground/50">Services</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/creation-site-web" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Création de site web</Link></li>
            <li><Link to="/referencement-seo" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Référencement SEO</Link></li>
            <li><Link to="/audit-seo-gratuit" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Audit SEO gratuit</Link></li>
            <li><Link to="/contact" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Demande de devis</Link></li>
          </ul>
        </div>

        {/* Pages */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary-foreground/50">Pages</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/qui-sommes-nous" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Qui sommes-nous</Link></li>
            <li><Link to="/faq" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">FAQ</Link></li>
            <li><Link to="/contact" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* CTA */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary-foreground/50">Contact</h3>
          <p className="text-sm text-primary-foreground/70 mb-4">
            Prêt à développer votre visibilité en ligne ?
          </p>
          <Link
            to="/audit-seo-gratuit"
            className="inline-block gradient-primary rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Audit SEO gratuit
          </Link>
        </div>
      </div>

      <div className="mt-10 border-t border-primary-foreground/10 pt-6 text-center text-xs text-primary-foreground/40">
        © {new Date().getFullYear()} Déclic Digital. Tous droits réservés.
      </div>
    </div>
  </footer>
);

export default Footer;
