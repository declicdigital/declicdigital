import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-declic-digital-new.png";

const navLinks = [
  { label: "Création de site", to: "/creation-site-web" },
  { label: "SEO", to: "/referencement-seo" },
  { label: "Tarifs", to: "/tarifs" },
  { label: "Réalisations", to: "/realisations" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

const moreLinks = [
  { label: "Nos villes", to: "/nos-villes" },
  { label: "Qui sommes-nous", to: "/qui-sommes-nous" },
  { label: "FAQ", to: "/faq" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (to: string) =>
    location.pathname === to || (to !== "/" && location.pathname.startsWith(to));

  const linkClass = (to: string) =>
    `rounded-lg px-3 py-2 text-[15px] font-medium transition-colors hover:bg-secondary ${
      isActive(to) ? "text-primary" : "text-muted-foreground"
    }`;

  return (
    <>
      <div className="hidden border-b border-border gradient-miami text-primary-foreground text-xs md:block">
        <div className="container flex h-8 items-center justify-end gap-6">
          <a href="tel:0602228939" className="flex items-center gap-1.5 hover:text-accent transition-colors">
            <Phone size={12} /> 06.02.22.89.39
          </a>
          <a href="mailto:contact@declicdigital.net" className="flex items-center gap-1.5 hover:text-accent transition-colors">
            <Mail size={12} /> contact@declicdigital.net
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="container flex h-18 items-center justify-between md:h-20">
          <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => { if (window.location.pathname === '/') { window.scrollTo({ top: 0, behavior: 'smooth' }); } }}>
            <img src={logo} alt="Déclic Digital" className="h-20 w-auto md:h-24" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className={linkClass(l.to)}>
                {l.label}
              </Link>
            ))}

            {/* More dropdown */}
            <div ref={moreRef} className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`flex items-center gap-1 rounded-lg px-3 py-2 text-[15px] font-medium transition-colors hover:bg-secondary text-muted-foreground`}
              >
                Plus <ChevronDown size={15} className={`transition-transform ${moreOpen ? "rotate-180" : ""}`} />
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-border bg-card p-1 shadow-elevated animate-fade-in">
                  {moreLinks.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setMoreOpen(false)}
                      className={`block rounded-md px-3 py-2 text-[15px] font-medium transition-colors hover:bg-secondary ${
                        isActive(l.to) ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="rounded-full px-4 text-[13px] font-semibold text-muted-foreground hover:text-primary">
              <Link to="/connexion">
                <User size={14} className="mr-1.5" /> Espace client
              </Link>
            </Button>
            <Button asChild size="sm" className="gradient-primary rounded-full px-5 text-[13px] font-semibold text-primary-foreground shadow-md hover:opacity-90">
              <Link to="/audit-seo-gratuit">Audit SEO gratuit</Link>
            </Button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-foreground"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-border bg-card p-4 lg:hidden animate-fade-in">
            <nav className="flex flex-col gap-1">
              {[...navLinks, ...moreLinks].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary ${
                    isActive(l.to) ? "text-primary bg-secondary" : "text-muted-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/connexion"
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary flex items-center gap-2 ${
                  isActive("/connexion") ? "text-primary bg-secondary" : "text-muted-foreground"
                }`}
              >
                <User size={16} /> Espace client
              </Link>
              <Button asChild size="sm" className="gradient-primary mt-2 rounded-full font-semibold text-primary-foreground">
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
