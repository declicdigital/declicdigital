import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, FileText, LogOut, Menu, X, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo-declic-digital-new.webp";

const navItems = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { to: "/admin/clients", icon: Users, label: "Clients" },
  { to: "/admin/soumissions", icon: FileText, label: "Soumissions" },
  { to: "/admin/blog", icon: BookOpen, label: "Blog" },
];

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
    <div className="min-h-screen flex" style={{ background: "hsl(263, 36%, 10%)" }}>

      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-64 fixed h-full border-r" style={{ background: "hsl(263, 36%, 13%)", borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <Link to="/" target="_blank" rel="noopener noreferrer">
            <img src={logo} alt="Déclic Digital" className="h-12 w-auto object-contain" />
          </Link>
          <p className="text-xs font-semibold uppercase tracking-widest mt-3" style={{ color: "rgba(255,255,255,0.25)" }}>
            Back-office admin
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={isActive(item.to)
                ? { background: "linear-gradient(135deg, hsl(183,70%,63%,0.15), hsl(284,65%,66%,0.15))", color: "white", borderLeft: "2px solid hsl(183,70%,63%)" }
                : { color: "rgba(255,255,255,0.45)" }
              }
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <a href="https://declicdigital.net" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all mb-2"
            style={{ color: "rgba(255,255,255,0.30)" }}>
            ↗ Voir le site
          </a>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all w-full hover:bg-red-500/10"
            style={{ color: "rgba(255,255,255,0.35)" }}>
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 border-b"
        style={{ background: "hsl(263, 36%, 13%)", borderColor: "rgba(255,255,255,0.07)" }}>
        <img src={logo} alt="Déclic Digital" className="h-9 w-auto object-contain" />
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ color: "rgba(255,255,255,0.7)" }}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 pt-14" style={{ background: "hsl(263, 36%, 13%)" }}>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={isActive(item.to)
                  ? { background: "rgba(255,255,255,0.08)", color: "white" }
                  : { color: "rgba(255,255,255,0.45)" }
                }
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
            <button onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full"
              style={{ color: "rgba(255,255,255,0.35)" }}>
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
