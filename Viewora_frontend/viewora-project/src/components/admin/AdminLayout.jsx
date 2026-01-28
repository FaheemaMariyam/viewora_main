import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import { logout } from "../../api/authApi";
import { 
  Users, 
  UserCheck, 
  Briefcase, 
  Building2, 
  BarChart3, 
  LogOut,
  LayoutDashboard
} from "lucide-react";

export default function AdminLayout({ children }) {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    logoutUser();
    navigate("/login");
  };

 const navItems = [
  {
    section: "MANAGEMENT",
    items: [
      { name: "Users", path: "/admin/dashboard", icon: <Users size={18} /> },
    ],
  },
  {
    section: "REQUESTS",
    items: [
      { name: "Seller Requests", path: "/admin/requests/sellers", icon: <UserCheck size={18} /> },
      { name: "Broker Requests", path: "/admin/requests/brokers", icon: <Briefcase size={18} /> },
    ],
  },
  {
    section: "SYSTEM",
    items: [
      { name: "Properties", path: "/admin/properties", icon: <Building2 size={18} /> },
      { name: "Analytics", path: "/admin/analytics", icon: <BarChart3 size={18} /> },
    ],
  },
];


  return (
    <div className="flex h-screen bg-gray-50 border-t-4 border-brand-primary">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 shadow-2xl flex flex-col">
        <div className="p-6">
          <div className="flex items-center space-x-3 text-white">
            <div className="w-8 h-8 bg-brand-primary rounded flex items-center justify-center font-bold">V</div>
            <span className="text-xl font-bold tracking-tight">Admin Ops</span>
          </div>
        </div>

       <nav className="flex-1 px-4 py-4 space-y-6">
  {navItems.map((group) => (
    <div key={group.section}>
      <p className="px-4 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        {group.section}
      </p>

      <div className="space-y-1">
        {group.items.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-brand-primary text-white shadow-lg shadow-blue-900/40"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <div className="flex items-center space-x-3">
              <span className="opacity-70 group-hover:opacity-100 transition-opacity">{item.icon}</span>
              <span className="font-semibold text-sm">{item.name}</span>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  ))}
</nav>


        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors group"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            <span className="font-semibold text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest">
            Control Center / <span className="text-gray-900">User Management</span>
          </h2>

          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-gray-900">{user?.username}</span>
              <span className="text-[10px] text-brand-primary font-bold uppercase tracking-tighter bg-blue-50 px-2 rounded">Superuser</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
              <img src={`https://ui-avatars.com/api/?name=${user?.username}&background=0F172A&color=fff`} alt="admin" />
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <section className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </section>
      </main>
    </div>
  );
}
