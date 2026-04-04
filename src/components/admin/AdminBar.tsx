import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Settings, Users, Inbox, Plus, FileText, Layout, Rocket, Puzzle, ChevronDown } from "lucide-react";

const ADMIN_BAR_HEIGHT = 40;

const AdminBar = () => {
  const { isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [contentOpen, setContentOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setContentOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!isAdmin) return null;

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const contentItems = [
    { icon: FileText, label: "Article de blog", emoji: "📝", to: "/admin/blog/new" },
    { icon: Layout, label: "Page édito", emoji: "📄", to: "/admin/page/new?type=edito" },
    { icon: Rocket, label: "Landing Page", emoji: "🚀", to: "/admin/page/new?type=landing" },
    { icon: Puzzle, label: "Bloc custom", emoji: "🧩", to: "/admin/blog" },
  ];

  return (
    <div
      className="sticky top-0 z-[9999] flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 px-4 text-white shadow-lg"
      style={{ height: ADMIN_BAR_HEIGHT }}
    >
      <Link to="/" className="flex items-center gap-2 text-sm font-semibold hover:text-white/80 transition">
        <Settings size={16} className="animate-spin-slow" />
        Mode Admin 🛠️
      </Link>
      <div className="flex items-center gap-3">
        {/* + Contenu dropdown */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setContentOpen(!contentOpen)}
            className="flex items-center gap-1.5 rounded-md bg-emerald-500/80 px-3 py-1.5 text-xs font-medium transition hover:bg-emerald-500"
          >
            <Plus size={14} />
            Contenu
            <ChevronDown size={12} className={`transition-transform ${contentOpen ? "rotate-180" : ""}`} />
          </button>
          {contentOpen && (
            <div className="absolute right-0 top-full mt-1 w-52 rounded-lg border border-white/10 bg-gray-900 p-1 shadow-xl animate-fade-in z-[10001]">
              {contentItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setContentOpen(false)}
                  className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-white/90 transition hover:bg-white/10"
                >
                  <span>{item.emoji}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        <Link
          to="/admin/blog"
          className="flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium transition hover:bg-white/20"
        >
          <FileText size={14} />
          Blog
        </Link>
        <Link
          to="/admin/clients"
          className="flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium transition hover:bg-white/20"
        >
          <Users size={14} />
          Clients
        </Link>
        <Link
          to="/admin/soumissions"
          className="flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium transition hover:bg-white/20"
        >
          <Inbox size={14} />
          Soumissions
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-md bg-red-500/80 px-3 py-1.5 text-xs font-medium transition hover:bg-red-500"
        >
          <LogOut size={14} />
          Quitter
        </button>
      </div>
    </div>
  );
};

export const ADMIN_BAR_HEIGHT_PX = 40;
export default AdminBar;
