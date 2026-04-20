import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-declic-digital-new.webp";

const navLinks = [
  { label: "Création de site", to: "/creation-site-web" },
  { label: "SEO", to: "/referencement-seo" },
  { label: "Visibilité IA", to: "/visibilite-ia" },
  { label: "Tarifs", to: "/tarifs" },
  { label: "Réalisations", to: "/realisations" },
  { label: "Blog", to: "/blog" },
];

const moreLinks = [
  { label: "Nos métiers", to: "/nos-metiers" },
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
    `rounded-lg px-2 xl:px-3 py-2 text-[13px] xl:text-[15px] font-medium whitespace-nowrap transition-colors hover:bg-secondary ${
      isActive(to) ? "text-primary" : "text-muted-foreground"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container flex h-[4.5rem] items-center justify-between md:h-20">
        <Link to="/" className="flex shrink-0 items-center" onClick={() => { if (window.location.pathname === '/') { window.scrollTo({ top: 0, behavior: 'smooth' }); } }}>
          <img src={logo} alt="Déclic Digital" className="h-14 md:h-16 w-auto object-contain" width={160} height={88} />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className={linkClass(l.to)}>
              {l.label}
            </Link>
          ))}

          <div ref={moreRef} className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex items-center gap-1 rounded-lg px-2 xl:px-3 py-2 text-[13px] xl:text-[15px] font-medium whitespace-nowrap transition-colors hover:bg-secondary text-muted-foreground"
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

        <div className="hidden lg:flex items-center gap-1.5 shrink-0">
          <Button asChild variant="custom" size="sm" className="rounded-full px-4 xl:px-5 text-[13px] xl:text-[15px] font-bold gradient-primary btn-glow text-white shadow-glow whitespace-nowrap">
            <Link to="/rendez-vous">Prendre RDV</Link>
          </Button>
          <Button asChild variant="custom" size="sm" className="hidden xl:inline-flex gradient-primary btn-glow rounded-full px-4 xl:px-6 text-[13px] xl:text-[15px] font-semibold text-white shadow-glow whitespace-nowrap">
            <Link to="/contact">Audit SEO gratuit</Link>
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
              to="/rendez-vous"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-4 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/10 border border-primary mt-1"
            >
              Prendre RDV
            </Link>
            <Button asChild variant="custom" size="sm" className="gradient-primary btn-glow mt-2 rounded-full font-semibold text-white shadow-glow">
              <Link to="/contact" onClick={() => setMobileOpen(false)}>
                Audit SEO gratuit
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
