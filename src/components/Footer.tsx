import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import logo from "@/assets/logo-declic-digital-new.webp";

const Footer = () => (
  <footer className="relative overflow-hidden" style={{ borderTop: "1px solid rgba(43,30,63,0.15)" }}>
    <div style={{ background: "hsl(263, 36%, 18%)" }}>
      <div className="container py-6 md:py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="space-y-1.5">
            <img src={logo} alt="Déclic Digital" className="h-16 w-auto" loading="lazy" decoding="async" width={160} height={88} />
            <p className="text-sm leading-relaxed" style={{ color: "rgba(246,241,233,0.9)" }}>
              Déclic Digital accompagne les TPE et indépendants à Paris et dans les Hauts-de-Seine (92) pour développer leur visibilité en ligne. Fondée par un Expert Produit Google.
            </p>
            <div className="space-y-1.5 text-sm" style={{ color: "rgba(246,241,233,0.9)" }}>
              <a href="tel:0602228939" className="flex items-center gap-2 hover:opacity-100 transition-opacity" style={{ color: "rgba(246,241,233,0.9)" }}>
                <Phone size={14} style={{ color: "hsl(183, 70%, 63%)" }} /> 06.02.22.89.39
              </a>
              <a href="mailto:contact@declicdigital.net" className="flex items-center gap-2 hover:opacity-100 transition-opacity" style={{ color: "rgba(246,241,233,0.9)" }}>
                <Mail size={14} style={{ color: "hsl(183, 70%, 63%)" }} /> contact@declicdigital.net
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(183, 70%, 63%)" }}>Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/creation-site-web" className="transition-opacity hover:opacity-100" style={{ color: "rgba(246,241,233,0.9)" }}>Création de site web</Link></li>
              <li><Link to="/referencement-seo" className="transition-opacity hover:opacity-100" style={{ color: "rgba(246,241,233,0.9)" }}>Référencement SEO</Link></li>
              <li><Link to="/visibilite-ia" className="transition-opacity hover:opacity-100" style={{ color: "rgba(246,241,233,0.9)" }}>Visibilité IA (GEO)</Link></li>
              <li><Link to="/tarifs" className="transition-opacity hover:opacity-100" style={{ color: "rgba(246,241,233,0.9)" }}>Nos tarifs</Link></li>
              <li><Link to="/rendez-vous" className="transition-opacity hover:opacity-100" style={{ color: "rgba(246,241,233,0.9)" }}>Prendre rendez-vous</Link></li>
              <li><Link to="/nos-villes" className="font-semibold transition-opacity hover:opacity-100" style={{ color: "#F6F1E9" }}>Nos villes →</Link></li>
              <li><Link to="/nos-metiers" className="font-semibold transition-opacity hover:opacity-100" style={{ color: "#F6F1E9" }}>Nos métiers →</Link></li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(284, 65%, 66%)" }}>Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="transition-opacity hover:opacity-100" style={{ color: "rgba(246,241,233,0.9)" }}>Accueil</Link></li>
              <li><Link to="/realisations" className="transition-opacity hover:opacity-100" style={{ color: "rgba(246,241,233,0.9)" }}>Réalisations</Link></li>
              <li><Link to="/qui-sommes-nous" className="transition-opacity hover:opacity-100" style={{ color: "rgba(246,241,233,0.9)" }}>Qui sommes-nous</Link></li>
              <li><Link to="/faq" className="transition-opacity hover:opacity-100" style={{ color: "rgba(246,241,233,0.9)" }}>FAQ</Link></li>
              <li><Link to="/blog" className="font-semibold transition-opacity hover:opacity-100" style={{ color: "#F6F1E9" }}>Blog →</Link></li>
              <li><Link to="/brief" className="transition-opacity hover:opacity-100" style={{ color: "rgba(246,241,233,0.9)" }}>Formulaire client</Link></li>
              <li><Link to="/plan-du-site" className="transition-opacity hover:opacity-100" style={{ color: "rgba(246,241,233,0.9)" }}>Plan du site</Link></li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(330, 100%, 70%)" }}>Contact</h3>
            <p className="text-sm mb-3" style={{ color: "rgba(246,241,233,0.9)" }}>
              Prêt à développer votre visibilité en ligne ?
            </p>
            <div className="flex flex-col items-start gap-2.5">
              <Link
                to="/contact"
                className="inline-block gradient-miami btn-glow rounded-full px-5 py-2.5 text-sm font-bold shadow-glow transition-all"
                style={{ color: "#F6F1E9" }}
              >
                Demander un devis
              </Link>
              <Link
                to="/rendez-vous"
                className="inline-block gradient-primary btn-glow rounded-full px-5 py-2.5 text-sm font-bold shadow-glow transition-all"
                style={{ color: "#F6F1E9" }}
              >
                Prendre rendez-vous
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 mb-5 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(183, 70%, 63%, 0.3), hsl(284, 65%, 66%, 0.3), hsl(330, 100%, 70%, 0.3), transparent)" }} />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: "rgba(246,241,233,0.7)" }}>
          <span>© {new Date().getFullYear()} Déclic Digital. SIRET 102 436 664 00019. Tous droits réservés.</span>
          <div className="flex items-center gap-4">
            <Link to="/mentions-legales" className="transition-opacity hover:opacity-100" style={{ color: "rgba(246,241,233,0.9)" }}>Mentions légales</Link>
            <Link to="/politique-de-confidentialite" className="transition-opacity hover:opacity-100" style={{ color: "rgba(246,241,233,0.9)" }}>Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
