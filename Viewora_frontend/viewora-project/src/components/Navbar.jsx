
// import { useContext, useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { AuthContext } from "../auth/AuthContext";
// import { logout } from "../api/authApi";
// import { 
//   Home, Building2, Sparkles, MessageSquare, 
//   Bell, User as UserIcon, LogOut, Menu, X,
//   ChevronDown, LayoutDashboard
// } from "lucide-react";

// export default function Navbar() {
//   const { user, loading, logoutUser, totalUnread, loadUnread } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [open, setOpen] = useState(false);

//   if (loading) return null;

//   const handleLogout = async () => {
//     await logout();
//     logoutUser();
//     navigate("/");
//     setOpen(false);
//   };

//   const isActive = (path) => location.pathname.startsWith(path);

//   const navLinkClass = (path) => `
//     relative flex items-center gap-2.5 px-5 py-3 rounded-2xl transition-all duration-500
//     text-sm font-medium tracking-wide backdrop-blur-md
//     ${isActive(path) 
//       ? "text-white bg-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_24px_rgba(0,0,0,0.2)] border border-white/30" 
//       : "text-gray-200 hover:text-white hover:bg-white/10 hover:shadow-lg border border-white/10 hover:border-white/20"}
//   `;

//   return (
//     <>
//       {/* Glassy Navbar with Frosted Effect */}
//       <nav className="fixed top-0 left-0 right-0 z-50">
//         {/* Frosted Glass Background */}
//         <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-2xl border-b border-white/10"></div>
        
//         {/* Subtle top shine */}
//         <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        
//         {/* Content */}
//         <div className="relative max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          
//           {/* Premium Brand Identity */}
//           <div
//             onClick={() => navigate("/")}
//             className="flex items-center gap-4 cursor-pointer group"
//           >
//             {/* Logo with Glass Effect */}
//             <div className="relative">
//               {/* Soft glow */}
//               <div className="absolute -inset-2 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              
//               {/* Glass container */}
//               <div className="relative w-14 h-14 flex items-center justify-center bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_32px_rgba(0,0,0,0.3)] group-hover:scale-105 group-hover:rotate-3 transition-all duration-500">
//                 <img src="/logo.png" alt="Viewora" className="w-full h-full object-contain p-2" />
//               </div>
//             </div>
            
//             {/* Brand Text */}
//             <div className="flex flex-col">
//               <span className="text-2xl font-bold text-white tracking-tight leading-none drop-shadow-lg">
//                 Viewora
//               </span>
//               <span className="text-[10px] font-medium text-gray-300/80 uppercase tracking-[0.2em] leading-none mt-1.5">
//                 Premium Real Estate
//               </span>
//             </div>
//           </div>

//           {/* Desktop Navigation - Glass Edition */}
//           <div className="hidden lg:flex items-center gap-3">
//             {!user && (
//               <>
//                 {/* Sign In - Glass Button */}
//                 <button
//                   onClick={() => navigate("/login")}
//                   className="px-6 py-3 text-sm font-medium tracking-wide text-gray-200 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl transition-all duration-300 border border-white/10 hover:border-white/20 hover:shadow-lg"
//                 >
//                   Sign In
//                 </button>

//                 {/* Get Started - Premium Glass Button */}
//                 <button
//                   onClick={() => navigate("/signup")}
//                   className="relative px-8 py-3 text-sm font-semibold tracking-wide text-gray-900 bg-white/95 backdrop-blur-xl rounded-2xl transition-all duration-500 overflow-hidden group shadow-[0_8px_32px_rgba(255,255,255,0.25)] hover:shadow-[0_12px_48px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 border border-white/50"
//                 >
//                   <span className="relative z-10">Get Started</span>
//                   {/* Shimmer effect */}
//                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
//                 </button>
//               </>
//             )}

//             {user && (
//               <>
//                 {/* Navigation Links - Glass Style */}
//                 <button onClick={() => navigate("/properties")} className={navLinkClass("/properties")}>
//                   <Building2 size={18} strokeWidth={2.5} />
//                   Properties
//                 </button>

//                 {(user?.role === "seller" || user?.role === "broker" || user?.role === "admin") && (
//                   <button 
//                     onClick={() => {
//                       if (user.role === "seller") navigate("/seller");
//                       if (user.role === "broker") navigate("/broker");
//                       if (user.role === "admin") navigate("/admin/dashboard");
//                     }} 
//                     className={navLinkClass("/dashboard")}
//                   >
//                     <LayoutDashboard size={18} strokeWidth={2.5} />
//                     Dashboard
//                   </button>
//                 )}

//                 {user?.role === "client" && (
//                   <button onClick={() => navigate("/ai-advisor")} className={navLinkClass("/ai-advisor")}>
//                     <Sparkles size={18} strokeWidth={2.5} className="text-emerald-300" />
//                     AI Advisor
//                   </button>
//                 )}

//                 {/* Glass Divider */}
//                 <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent mx-2"></div>
                
//                 {/* Notification - Glass Icon */}
//                 <button
//                   onClick={() => navigate("/notifications")}
//                   className="relative p-3 text-gray-200 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl transition-all duration-300 border border-white/10 hover:border-white/20 group"
//                 >
//                   <Bell size={20} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform duration-300" />
//                   {totalUnread > 0 && (
//                     <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-br from-red-400 to-red-600 rounded-full border-2 border-slate-900 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse"></span>
//                   )}
//                 </button>

//                 {/* Chat - Glass Icon */}
//                 {(user?.role === "broker" || user?.role === "client") && (
//                   <button
//                     onClick={async () => {
//                       await loadUnread();
//                       navigate("/chats");
//                     }}
//                     className={`relative p-3 backdrop-blur-md rounded-2xl transition-all duration-300 border group ${
//                       isActive("/chats") 
//                         ? "text-white bg-white/15 border-white/25 shadow-lg" 
//                         : "text-gray-200 hover:text-white bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20"
//                     }`}
//                   >
//                     <MessageSquare size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform duration-300" />
//                     {totalUnread > 0 && (
//                       <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-br from-red-400 to-red-600 rounded-full border-2 border-slate-900 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse"></span>
//                     )}
//                   </button>
//                 )}

//                 {/* Glass Divider */}
//                 <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent mx-2"></div>

//                 {/* User Profile - Premium Glass Card */}
//                 <div 
//                   onClick={() => navigate("/profile")}
//                   className={`flex items-center gap-3 pl-2 pr-5 py-2 rounded-3xl cursor-pointer transition-all duration-500 backdrop-blur-xl border group ${
//                     isActive("/profile") 
//                       ? "bg-white/15 border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_24px_rgba(0,0,0,0.2)]" 
//                       : "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/25 hover:shadow-lg"
//                   }`}
//                 >
//                   {/* Avatar with Glass Effect */}
//                   <div className="relative">
//                     {/* Glow */}
//                     <div className="absolute -inset-1 bg-gradient-to-br from-blue-400/40 via-purple-400/40 to-pink-400/40 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
//                     {/* Glass Avatar */}
//                     <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500/80 via-purple-500/80 to-pink-500/80 backdrop-blur-sm flex items-center justify-center text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_16px_rgba(0,0,0,0.3)] border border-white/20">
//                       <UserIcon size={20} strokeWidth={2.5} />
//                     </div>
//                   </div>
                  
//                   {/* User Info */}
//                   <div className="flex flex-col text-left">
//                     <span className="text-sm font-semibold text-white tracking-wide drop-shadow">{user.first_name || 'Member'}</span>
//                     <span className="text-[10px] font-medium text-gray-300/80 uppercase tracking-wider">{user.role}</span>
//                   </div>
//                 </div>

//                 {/* Logout - Glass Button */}
//                 <button
//                   onClick={handleLogout}
//                   className="p-3 text-red-300/80 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 backdrop-blur-md transition-all duration-300 rounded-2xl border border-red-400/20 hover:border-red-400/30 group"
//                   title="Sign Out"
//                 >
//                   <LogOut size={20} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform duration-300" />
//                 </button>
//               </>
//             )}
//           </div>

//           {/* Mobile Menu Toggle - Glass */}
//           <button
//             onClick={() => setOpen(!open)}
//             className="lg:hidden p-3 text-white bg-white/10 hover:bg-white/15 backdrop-blur-xl rounded-2xl transition-all duration-300 border border-white/20 hover:border-white/30"
//           >
//             {open ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
//           </button>
//         </div>
//       </nav>

//       {/* Spacer to prevent content from going under fixed navbar */}
//       <div className="h-[76px]"></div>

//       {/* Mobile Menu - Premium Glass */}
//       {open && (
//         <div className="fixed top-[76px] left-0 right-0 z-40 lg:hidden">
//           {/* Glass Background */}
//           <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-3xl border-t border-white/10"></div>
          
//           {/* Content */}
//           <div className="relative px-6 py-8 space-y-6 max-h-[calc(100vh-76px)] overflow-y-auto">
//             {user && (
//               <div className="flex items-center gap-4 p-5 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_24px_rgba(0,0,0,0.3)]">
//                 {/* Avatar */}
//                 <div className="relative">
//                   <div className="absolute -inset-1 bg-gradient-to-br from-blue-400/40 via-purple-400/40 to-pink-400/40 rounded-2xl blur-lg opacity-80"></div>
//                   <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/80 via-purple-500/80 to-pink-500/80 backdrop-blur-sm flex items-center justify-center text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_20px_rgba(0,0,0,0.3)] border border-white/20">
//                     <UserIcon size={32} strokeWidth={2.5} />
//                   </div>
//                 </div>
                
//                 {/* User Info */}
//                 <div>
//                   <p className="font-semibold text-white tracking-wide text-base drop-shadow">{user.first_name}</p>
//                   <p className="text-xs font-medium text-gray-300/80 uppercase tracking-wider mt-1">{user.role}</p>
//                 </div>
//               </div>
//             )}
            
//             {/* Navigation Links */}
//             <div className="space-y-3">
//               {!user ? (
//                 <>
//                   <button 
//                     onClick={() => { navigate("/login"); setOpen(false); }} 
//                     className="w-full py-4 text-sm font-medium tracking-wide text-gray-200 bg-white/10 hover:bg-white/15 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300"
//                   >
//                     Sign In
//                   </button>
//                   <button 
//                     onClick={() => { navigate("/signup"); setOpen(false); }} 
//                     className="w-full py-4 text-sm font-semibold tracking-wide text-gray-900 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(255,255,255,0.3)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.4)] transition-all duration-300 border border-white/50"
//                   >
//                     Get Started
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <MobileNavLink icon={Building2} label="Properties" onClick={() => { navigate("/properties"); setOpen(false); }} active={isActive("/properties")} />
//                   {user?.role === "client" && (
//                     <MobileNavLink icon={Sparkles} label="AI Advisor" onClick={() => { navigate("/ai-advisor"); setOpen(false); }} active={isActive("/ai-advisor")} />
//                   )}
//                   {(user?.role === "broker" || user?.role === "client") && (
//                     <MobileNavLink icon={MessageSquare} label="Messages" onClick={() => { navigate("/chats"); setOpen(false); }} active={isActive("/chats")} />
//                   )}
//                   <MobileNavLink icon={UserIcon} label="Profile" onClick={() => { navigate("/profile"); setOpen(false); }} active={isActive("/profile")} />
                  
//                   <button 
//                     onClick={handleLogout} 
//                     className="w-full flex items-center justify-center gap-3 p-5 rounded-3xl text-red-300 bg-red-500/10 hover:bg-red-500/20 backdrop-blur-xl transition-all duration-300 text-sm font-medium tracking-wide mt-8 border border-red-400/20 hover:border-red-400/30"
//                   >
//                     <LogOut size={22} strokeWidth={2.5} />
//                     Sign Out
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// function MobileNavLink({ icon: Icon, label, onClick, active }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`w-full flex items-center gap-4 p-5 rounded-3xl transition-all duration-300 backdrop-blur-xl border ${
//         active 
//           ? "bg-white/20 text-white border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_24px_rgba(0,0,0,0.2)]" 
//           : "text-gray-200 hover:text-white bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20"
//       }`}
//     >
//       <Icon size={22} strokeWidth={2.5} />
//       <span className="text-sm font-medium tracking-wide">{label}</span>
//     </button>
//   );
// }
import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { logout } from "../api/authApi";
import {
  Building2,
  Sparkles,
  MessageSquare,
  Bell,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";

export default function Navbar() {
  const { user, loading, logoutUser, totalUnread, loadUnread } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (loading) return null;

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = async () => {
    await logout();
    logoutUser();
    navigate("/");
    setOpen(false);
  };

  return (
    <>
      {/* ================= SMART NAVBAR (Conditional Theme) ================= */}
      <div className="fixed top-0 inset-x-0 z-50 flex justify-center">
        <nav
          className={`
            relative w-full
            ${location.pathname === "/" 
               ? "border-b border-white/20 shadow-sm" 
               : "bg-black/50 backdrop-blur-xl border-b border-white/10 shadow-md"}
          `}
        >
          {/* Glass Background - Only for Home Page */}
          {location.pathname === "/" && (
             <>
               <div className="absolute inset-0 bg-white/10 backdrop-blur-md" />
               <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
             </>
          )}

          {/* Content */}
          <div className="relative h-[72px] px-6 lg:px-8 max-w-6xl mx-auto flex items-center justify-between">
            {/* ===== BRAND ===== */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className={`w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-sm shadow-sm group-hover:scale-105 transition-transform duration-300
                  ${location.pathname === "/" ? "bg-white/20" : "bg-white/10"}`}>
                 <img src="/logo.png" alt="Viewora" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-white text-xl font-bold tracking-tight font-sans drop-shadow-sm">
                Viewora
              </span>
            </div>

            {/* ===== DESKTOP NAV ===== */}
            <div className="hidden lg:flex items-center gap-2">
              {!user ? (
                <>
                  <GlassNavLink onClick={() => navigate("/login")}>
                    Sign in
                  </GlassNavLink>

                  <GlassCTA onClick={() => navigate("/signup")}>
                    Get started
                  </GlassCTA>
                </>
              ) : (
                <>
                  <GlassNavLink
                    active={isActive("/properties")}
                    onClick={() => navigate("/properties")}
                  >
                    <Building2 size={16} />
                    Properties
                  </GlassNavLink>

                  {(user.role === "seller" ||
                    user.role === "broker" ||
                    user.role === "admin") && (
                    <GlassNavLink
                      active={isActive("/dashboard")}
                      onClick={() => {
                        if (user.role === "seller") navigate("/seller");
                        if (user.role === "broker") navigate("/broker");
                        if (user.role === "admin")
                          navigate("/admin/dashboard");
                      }}
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </GlassNavLink>
                  )}

                  {user.role === "client" && (
                    <GlassNavLink
                      active={isActive("/ai-advisor")}
                      onClick={() => navigate("/ai-advisor")}
                    >
                      <Sparkles size={16} />
                      AI Advisor
                    </GlassNavLink>
                  )}

                  <GlassIconButton
                    onClick={() => navigate("/notifications")}
                  >
                    <Bell size={16} />
                    {totalUnread > 0 && <NotificationDot />}
                  </GlassIconButton>

                  {(user.role === "broker" || user.role === "client") && (
                    <GlassIconButton
                      onClick={async () => {
                        await loadUnread();
                        navigate("/chats");
                      }}
                    >
                      <MessageSquare size={16} />
                      {totalUnread > 0 && <NotificationDot />}
                    </GlassIconButton>
                  )}

                  {/* Profile */}
                  <div
                    onClick={() => navigate("/profile")}
                    className="
                      ml-2 flex items-center gap-2 px-3 py-1.5
                      rounded-full bg-white/15 hover:bg-white/25
                      border border-white/30 cursor-pointer
                      transition shadow-md
                    "
                  >
                    <div className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center">
                      <UserIcon size={14} className="text-white" />
                    </div>
                    <span className="text-white text-sm font-medium">
                      {user.first_name}
                    </span>
                  </div>

                  <GlassIconButton danger onClick={handleLogout}>
                    <LogOut size={16} />
                  </GlassIconButton>
                </>
              )}
            </div>

            {/* ===== MOBILE TOGGLE ===== */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2.5 rounded-xl bg-white/15 border border-white/30 text-white hover:bg-white/25 transition"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Spacer for Fixed Navbar - Only show on non-home pages */}
      {location.pathname !== "/" && <div className="h-[72px]" />}

      {/* ================= MOBILE MENU (LIGHTER) ================= */}
      {open && (
        <div className="fixed top-[72px] inset-x-0 z-40 lg:hidden px-0">
          <div className="relative w-full border-t border-white/20">
            <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl" />

            <div className="relative p-6 space-y-3">
              {!user ? (
                <>
                  <MobileGlassItem
                    onClick={() => {
                      navigate("/login");
                      setOpen(false);
                    }}
                  >
                    Sign in
                  </MobileGlassItem>

                  <MobileGlassCTA
                    onClick={() => {
                      navigate("/signup");
                      setOpen(false);
                    }}
                  >
                    Get started
                  </MobileGlassCTA>
                </>
              ) : (
                <>
                  <MobileGlassItem
                    onClick={() => {
                      navigate("/properties");
                      setOpen(false);
                    }}
                  >
                    Properties
                  </MobileGlassItem>

                  <MobileGlassItem
                    onClick={() => {
                      navigate("/profile");
                      setOpen(false);
                    }}
                  >
                    Profile
                  </MobileGlassItem>

                  <MobileGlassItem
                    onClick={() => {
                      navigate("/chats");
                      setOpen(false);
                    }}
                  >
                    Messages
                  </MobileGlassItem>

                  <button
                    onClick={handleLogout}
                    className="w-full mt-4 py-3.5 rounded-2xl bg-white/10 text-white border border-white/30 hover:bg-white/20 transition"
                  >
                    Sign out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= GLASS UI COMPONENTS ================= */

function GlassNavLink({ children, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
        ${
          active
            ? "bg-white text-slate-900 shadow-md transform scale-105"
            : "text-white/90 hover:bg-white/20 hover:text-white"
        }`}
    >
      {children}
    </button>
  );
}

function GlassCTA({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        ml-4 px-6 py-2.5 rounded-full text-sm font-bold
        bg-white text-slate-900 shadow-lg
        hover:bg-slate-50 hover:scale-105 
        transition-all duration-300
      "
    >
      {children}
    </button>
  );
}

function GlassIconButton({ children, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`relative p-2.5 rounded-full transition-all duration-300
        ${
          danger
            ? "bg-white/10 text-red-200 hover:bg-red-500 hover:text-white"
            : "bg-white/10 text-white hover:bg-white hover:text-slate-900"
        }`}
    >
      {children}
    </button>
  );
}

function NotificationDot() {
  return (
    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-400 border-2 border-white shadow" />
  );
}

function MobileGlassItem({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full px-5 py-4 rounded-xl text-left text-white font-medium hover:bg-white/10 transition-all duration-300"
    >
      {children}
    </button>
  );
}

function MobileGlassCTA({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full px-5 py-4 mt-2 rounded-xl bg-white text-slate-900 font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg"
    >
      {children}
    </button>
  );
}
