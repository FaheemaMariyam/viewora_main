
import { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { logout } from "../api/authApi";
import { 
  Home, Building2, Sparkles, MessageSquare, 
  Bell, User as UserIcon, LogOut, Menu, X,
  ChevronDown, LayoutDashboard
} from "lucide-react";

export default function Navbar() {
  const { user, loading, logoutUser, totalUnread, loadUnread } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (loading) return null;

  const handleLogout = async () => {
    await logout();
    logoutUser();
    navigate("/");
    setOpen(false);
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const navLinkClass = (path) => `
    relative flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-300
    text-[10px] font-black uppercase tracking-[0.15em]
    ${isActive(path) 
      ? "text-white bg-white/10 shadow-inner" 
      : "text-gray-400 hover:text-white hover:bg-white/5"}
  `;

  return (
    <nav className="sticky top-0 z-50 bg-[#0F172A] border-b border-white/5 backdrop-blur-xl shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Brand Identity */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-4 cursor-pointer group"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-white text-[#0F172A] font-black text-xl rounded-2xl shadow-[0_8px_20px_rgba(255,255,255,0.15)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            V
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-white tracking-tighter leading-none group-hover:tracking-normal transition-all duration-500">
              Viewora
            </span>
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.3em] leading-none mt-1">
              Premium Assets
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-2">
          {!user && (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
              >
                Access Portal
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="px-6 py-2.5 bg-white text-[#0F172A] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition shadow-[0_8px_20px_rgba(255,255,255,0.1)] active:scale-95"
              >
                Join Network
              </button>
            </>
          )}

          {user && (
            <>
              <button onClick={() => navigate("/properties")} className={navLinkClass("/properties")}>
                <Building2 size={14} className={isActive("/properties") ? "text-white" : "text-gray-500"} />
                Properties
              </button>

              {(user?.role === "seller" || user?.role === "broker" || user?.role === "admin") && (
                <button 
                  onClick={() => {
                    if (user.role === "seller") navigate("/seller");
                    if (user.role === "broker") navigate("/broker");
                    if (user.role === "admin") navigate("/admin/dashboard");
                  }} 
                  className={navLinkClass("/dashboard")} // Generic match for style
                >
                  <LayoutDashboard size={14} className="text-gray-500 hover:text-white" />
                  Dashboard
                </button>
              )}

              {user?.role === "client" && (
                <button onClick={() => navigate("/ai-advisor")} className={navLinkClass("/ai-advisor")}>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse" />
                  Viewora AI
                </button>
              )}

              <div className="h-4 w-px bg-white/10 mx-2" />
              
              <button
                onClick={() => navigate("/notifications")}
                className="p-2 relative text-gray-400 hover:text-white transition-all hover:bg-white/5 rounded-xl"
              >
                <Bell size={18} strokeWidth={2.5} />
                {totalUnread > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-red-500 w-2 h-2 rounded-full border-2 border-[#0F172A]" />
                )}
              </button>

              {/* Chat - Only for Broker and Client */}
              {(user?.role === "broker" || user?.role === "client") && (
                <button
                  onClick={async () => {
                    await loadUnread();
                    navigate("/chats");
                  }}
                  className={`p-2 relative transition-all hover:bg-white/5 rounded-xl ${isActive("/chats") ? "text-white bg-white/10" : "text-gray-400 hover:text-white"}`}
                >
                  <MessageSquare size={18} strokeWidth={2.5} />
                  {totalUnread > 0 && (
                    <span className="absolute top-1.5 right-1.5 bg-red-500 w-2 h-2 rounded-full border-2 border-[#0F172A]" />
                  )}
                </button>
              )}

              <div className="h-8 w-px bg-white/10 mx-2" />

              {/* User Identity Peek */}
              <div 
                onClick={() => navigate("/profile")}
                className={`flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-2xl cursor-pointer transition-all border ${
                  isActive("/profile") 
                    ? "bg-white/10 border-white/20" 
                    : "hover:bg-white/5 border-transparent"
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-primary to-blue-600 flex items-center justify-center text-white shadow-lg">
                  <UserIcon size={16} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-black text-white uppercase tracking-tight">{user.first_name || 'Member'}</span>
                  <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{user.role}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2.5 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all rounded-xl ml-2"
                title="Secure Logout"
              >
                <LogOut size={18} strokeWidth={2.5} />
              </button>
            </>
          )}
        </div>

        {/* Mobile Interaction Component */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 text-white bg-white/5 rounded-xl hover:bg-white/10 transition-all"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Experience Layer */}
      {open && (
        <div className="lg:hidden bg-[#0F172A]/95 backdrop-blur-2xl border-t border-white/5 px-6 py-8 space-y-6 animate-in slide-in-from-top-4 duration-300">
          {user && (
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-[2rem] border border-white/5">
               <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center text-white">
                 <UserIcon size={24} strokeWidth={2.5} />
               </div>
               <div>
                  <p className="font-black text-white uppercase tracking-widest text-xs">{user.first_name}</p>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-0.5">{user.role}</p>
               </div>
            </div>
          )}
          
          <div className="space-y-2">
            {!user ? (
              <>
                <button onClick={() => { navigate("/login"); setOpen(false); }} className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white bg-white/5 rounded-2xl border border-white/5">Log In</button>
                <button onClick={() => { navigate("/signup"); setOpen(false); }} className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary bg-white rounded-2xl shadow-xl">Start Journey</button>
              </>
            ) : (
              <>
                <MobileNavLink icon={Building2} label="Inventory" onClick={() => { navigate("/properties"); setOpen(false); }} active={isActive("/properties")} />
                {user?.role === "client" && (
                  <MobileNavLink icon={Sparkles} label="Intelligencer" onClick={() => { navigate("/ai-advisor"); setOpen(false); }} active={isActive("/ai-advisor")} />
                )}
                {/* Chat - Only for Broker and Client */}
                {(user?.role === "broker" || user?.role === "client") && (
                  <MobileNavLink icon={MessageSquare} label="Transmissions" onClick={() => { navigate("/chats"); setOpen(false); }} active={isActive("/chats")} />
                )}
                <MobileNavLink icon={UserIcon} label="Account Detail" onClick={() => { navigate("/profile"); setOpen(false); }} active={isActive("/profile")} />
                <button onClick={handleLogout} className="w-full flex items-center gap-4 p-5 rounded-[2rem] text-red-400 hover:bg-red-400/10 transition-all text-[10px] font-black uppercase tracking-[0.3em] mt-8">
                  <LogOut size={20} />
                  Terminate Session
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function MobileNavLink({ icon: Icon, label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-5 rounded-[2rem] transition-all border ${
        active 
          ? "bg-white text-[#0F172A] border-transparent shadow-xl" 
          : "text-gray-400 hover:text-white border-white/5 hover:bg-white/5"
      }`}
    >
      <Icon size={20} className={active ? "text-[#0F172A]" : "text-gray-600"} />
      <span className="text-[10px] font-black uppercase tracking-[0.3em]">{label}</span>
    </button>
  );
}
