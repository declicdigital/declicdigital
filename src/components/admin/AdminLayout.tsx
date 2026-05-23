import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, FileText, LogOut, Menu, X, BookOpen, Layout, DollarSign, ImagePlay, Globe, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo-declic-digital-new.webp";

const navItems = [
  { to: "/admin/dashboard",   icon: LayoutDashboard, label: "Tableau de bord" },
  { to: "/admin/clients",     icon: Users,           label: "Clients" },
  { to: "/admin/soumissions", icon: FileText,        label: "Soumissions" },
  { to: "/admin/blog",        icon: BookOpen,        label: "Blog" },
  { to: "/admin/realisations",icon: ImagePlay,       label: "Réalisations" },
  { to: "/admin/cms",         icon: Layout,          label: "CMS Pages" },
  { to: "/admin/pages",       icon: Globe,           label: "Pages du site" },
  { to: "/admin/villes",      icon: MapPin,          label: "Contenu villes" },
  { to: "/admin/tarifs",      icon: DollarSign,      label: "Tarifs" },
];

const BG_MAIN = "#F6F1E9";
const BG_SIDEBAR = "#EDE8DF";
const INK = "#2B1E3F";
const INK_LIGHT = "rgba(43,30,63,0.45)";
const INK_XLIGHT = "rgba(43,30,63,0.20)";
const BORDER = "rgba(43,30,63,0.10)";
const ACTIVE_BG = "rgba(67,97,238,0.10)";
const ACTIVE_COLOR = "#4361EE";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const isActive = (to: string) => location.pathname.startsWith(to);

  return (
    <div className="min-h-screen flex" style={{ background: BG_MAIN }}>

      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-64 fixed h-full border-r"
        style={{ background: BG_SIDEBAR, borderColor: BORDER }}>
        <div className="p-5 border-b" style={{ borderColor: BORDER }}>
          <Link to="/" target="_blank" rel="noopener noreferrer">
            <img src={logo} alt="Déclic Digital" className="h-12 w-auto object-contain" />
          </Link>
          <p className="text-xs font-semibold uppercase tracking-widest mt-3"
            style={{ color: INK_XLIGHT }}>
            Back-office admin
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={isActive(item.to)
                ? { background: ACTIVE_BG, color: ACTIVE_COLOR, borderLeft: `2px solid ${ACTIVE_COLOR}` }
                : { color: INK_LIGHT }
              }>
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: BORDER }}>
          <a href="https://declicdigital.net" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all mb-2"
            style={{ color: INK_XLIGHT }}>
            ↗ Voir le site
          </a>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all w-full hover:bg-red-500/10"
            style={{ color: "rgba(180,50,50,0.6)" }}>
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 border-b"
        style={{ background: BG_SIDEBAR, borderColor: BORDER }}>
        <img src={logo} alt="Déclic Digital" className="h-9 w-auto object-contain" />
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ color: INK_LIGHT }}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 pt-14" style={{ background: BG_SIDEBAR }}>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={isActive(item.to)
                  ? { background: ACTIVE_BG, color: ACTIVE_COLOR }
                  : { color: INK_LIGHT }
                }>
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
            <button onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full"
              style={{ color: "rgba(180,50,50,0.6)" }}>
              <LogOut size={16} />
              Déconnexion
            </button>
          </nav>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
