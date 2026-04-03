import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, FileText, Settings, Users, Inbox } from "lucide-react";

const ADMIN_BAR_HEIGHT = 40;

const AdminBar = () => {
  const { isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) return null;

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div
      className="sticky top-0 z-[9999] flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 px-4 text-white shadow-lg"
      style={{ height: ADMIN_BAR_HEIGHT }}
    >
      <span className="flex items-center gap-2 text-sm font-semibold">
        <Settings size={16} className="animate-spin-slow" />
        Mode Admin 🛠️
      </span>
      <div className="flex items-center gap-3">
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
