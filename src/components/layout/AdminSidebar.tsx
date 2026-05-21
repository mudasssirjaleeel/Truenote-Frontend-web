import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import { usePermissions } from "../../hooks/usePermissions";
import {
  LayoutDashboard,
  Users,
  Coffee,
  Bean,
  Package,
  ShoppingBag,
  Tags,
  Image,
  LogOut,
  X,
  View,
  TrendingUp,
  Shield,
  Calendar,
  UserCog,
} from "lucide-react";

interface AdminSidebarProps {
  onClose?: () => void;
}

const ALL_NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, permission: "view_dashboard" },
  { to: "/admin/permissions", label: "Permissions", icon: UserCog, permission: "manage_staff_roles" },
  { to: "/admin/users", label: "Users Management", icon: Users, permission: "view_customers" },
  { to: "/admin/staff", label: "Staff", icon: Shield, permission: "view_staff" },
  { to: "/admin/products", label: "Products", icon: Package, permission: "view_menu" },
  { to: "/admin/beans", label: "Beans", icon: Bean, permission: "view_beans" },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag, permission: "view_orders" },
  { to: "/admin/categories", label: "Categories", icon: Tags, permission: "view_categories" },
  { to: "/admin/banners", label: "Banners", icon: Image, permission: "view_banners" },
  { to: "/admin/subscriptions", label: "Subscriptions", icon: Calendar, permission: "view_subscriptions" },
  { to: "/admin/kds", label: "Kitchen Display", icon: View, permission: "view_kds" },
  { to: "/admin/reports_summary", label: "Reports", icon: TrendingUp, permission: "view_reports" },
];

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { hasPermission, isAdmin } = usePermissions();

  const NAV = ALL_NAV.filter((item) => {
    if (isAdmin) return true;
    if (item.permission) return hasPermission(item.permission);
    return true;
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

  return (
    <aside className="w-64 bg-stone-900 flex flex-col h-full shadow-xl">
      {/* Logo & Close Button */}
      <div className="px-5 py-5 border-b border-stone-800 flex items-center justify-between shrink-0">
        <div>
          <p className="text-amber-400 font-bold text-xl tracking-wide">Truenote</p>
          <p className="text-stone-500 text-xs mt-0.5">Admin Panel</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800 transition-colors md:hidden"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation with custom scrollbar */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/admin"}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? "bg-amber-500 text-stone-900 font-semibold shadow-sm"
                  : "text-stone-400 hover:bg-stone-800 hover:text-stone-100"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="px-3 py-4 border-t border-stone-800 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-400 
          hover:bg-stone-800 hover:text-red-400 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e1e2f;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3f3f4f;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #5a5a6b;
        }
        
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #3f3f4f #1e1e2f;
        }
      `}</style>
    </aside>
  );
}