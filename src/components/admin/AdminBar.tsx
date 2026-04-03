import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, FileText, Settings } from "lucide-react";

const AdminBar = () => {
  const { isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) return null;

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 px-4 py-2 text-white shadow-lg">
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
          Clients
        </Link>
        <Link
          to="/admin/soumissions"
          className="flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium transition hover:bg-white/20"
        >
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

export default AdminBar;
