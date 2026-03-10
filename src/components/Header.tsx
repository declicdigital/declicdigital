import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-declic-digital.png";

const navLinks = [
  { label: "Accueil", to: "/" },
  { label: "Création de site", to: "/creation-site-web" },
  { label: "Référencement SEO", to: "/referencement-seo" },
  { label: "Audit SEO gratuit", to: "/audit-seo-gratuit" },
  { label: "Qui sommes-nous", to: "/qui-sommes-nous" },
  { label: "Contact", to: "/contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Top bar with contact info */}
      <div className="hidden border-b border-border bg-foreground text-primary-foreground text-xs md:block">
        <div className="container flex h-9 items-center justify-end gap-6">
          <a href="tel:0602228939" className="flex items-center gap-1.5 hover:text-accent transition-colors">
            <Phone size={13} /> 06.02.22.89.39
          </a>
          <a href="mailto:contact@declicdigital.net" className="flex items-center gap-1.5 hover:text-accent transition-colors">
            <Mail size={13} /> contact@declicdigital.net
          </a>
        </div>
      </div>
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Déclic Digital" className="h-10 w-auto md:h-12" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary ${
                location.pathname === l.to
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button asChild className="gradient-primary rounded-full px-6 font-semibold text-primary-foreground shadow-md hover:opacity-90">
            <Link to="/audit-seo-gratuit">Audit SEO gratuit</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-foreground"
          aria-label="Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-card p-4 lg:hidden animate-fade-in">
          <nav className="flex flex-col gap-2">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary ${
                  location.pathname === l.to
                    ? "text-primary bg-secondary"
                    : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Button asChild className="gradient-primary mt-2 rounded-full font-semibold text-primary-foreground">
              <Link to="/audit-seo-gratuit" onClick={() => setMobileOpen(false)}>
                Audit SEO gratuit
              </Link>
            </Button>
          </nav>
        </div>
      )}
      </header>
    </>
  );
};

export default Header;
