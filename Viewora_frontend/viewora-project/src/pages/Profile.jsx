
import { useContext, useEffect } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { setupNotifications } from "../firebase/notification";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Award, 
  FileCheck, 
  Bell, 
  Lock,
  ExternalLink,
  ChevronRight
} from "lucide-react";

export default function Profile() {
  const { user, setTotalUnread } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return null;

  const renderDetailItem = (icon, label, value) => (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-50 bg-gray-50/30 hover:bg-white hover:border-brand-primary/10 hover:shadow-sm transition-all group">
      <div className="p-2.5 rounded-lg bg-white border border-gray-100 text-brand-primary/60 group-hover:text-brand-primary group-hover:scale-110 transition-all">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{value || "Not provided"}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Profile Header Card - Glassmorphism style */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden mb-8 relative">
          <div className="bg-[#0F172A] h-40 relative">
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
             <div className="absolute -bottom-1 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
          </div>
          
          <div className="px-10 pb-10 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between -mt-16 gap-6">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                <div className="h-32 w-32 bg-white rounded-3xl p-1.5 shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500">
                   <div className="h-full w-full bg-gradient-to-br from-brand-primary to-[#334155] rounded-2xl flex items-center justify-center text-4xl font-black text-white">
                      {user.username?.[0]?.toUpperCase() || "V"}
                   </div>
                </div>
                <div className="mb-2">
                  <div className="flex items-center gap-3 mb-1 justify-center md:justify-start">
                    <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">{user.username}</h2>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter bg-brand-primary/5 text-brand-primary border border-brand-primary/10">
                      {user.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 font-medium justify-center md:justify-start">
                    <Mail size={16} className="text-gray-300" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3 pb-2">
                <div className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold border ${user.is_profile_complete ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>
                  <ShieldCheck size={14} className="mr-2" />
                  {user.is_profile_complete ? "Verified Profile" : "Incomplete Profile"}
                </div>
                {user.role !== 'client' && (
                   <div className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold border ${user.is_admin_approved ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-rose-50 text-rose-700 border-rose-100"}`}>
                    <FileCheck size={14} className="mr-2" />
                    {user.is_admin_approved ? "Platform Approved" : "Pending Verification"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Columns */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Essential Information */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-[#0F172A] mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 font-normal">01</div>
                Essential Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderDetailItem(<User size={18} />, "Full Username", user.username)}
                {renderDetailItem(<Mail size={18} />, "Email Address", user.email)}
                {renderDetailItem(<Phone size={18} />, "Phone Number", user.phone_number)}
                {renderDetailItem(<Award size={18} />, "Account Level", user.role?.toUpperCase())}
              </div>
            </div>

            {/* Role Specific details */}
            {(user.role === 'seller' || user.role === 'broker') && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#0F172A] mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 font-normal">02</div>
                  Professional Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderDetailItem(<MapPin size={18} />, "Primary City", user.city)}
                  {renderDetailItem(<MapPin size={18} />, "Service Area", user.area)}
                  
                  {user.role === 'broker' && renderDetailItem(<Award size={18} />, "License Number", user.license_number)}
                  
                  {/* Digital Documents */}
                  <div className="md:col-span-2 mt-4 space-y-3">
                    <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">Verification Documents</p>
                    <div className="flex flex-wrap gap-4">
                      {user.ownership_proof && (
                        <a href={user.ownership_proof} target="_blank" className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] transition-all font-bold text-xs ring-1 ring-gray-200">
                          <FileCheck size={16} className="text-brand-primary" />
                          Ownership Proof
                          <ExternalLink size={14} className="ml-2 opacity-40" />
                        </a>
                      )}
                      {user.certificate && (
                        <a href={user.certificate} target="_blank" className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] transition-all font-bold text-xs ring-1 ring-gray-200">
                          <Award size={16} className="text-brand-primary" />
                          Broker Certificate
                          <ExternalLink size={14} className="ml-2 opacity-40" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Actions */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#0F172A] mb-6 flex items-center gap-3">
                  Security
                </h3>
                
                <div className="space-y-4">
                  <button
                    onClick={() => navigate("/change-password")}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md hover:ring-1 hover:ring-brand-primary/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white text-brand-primary">
                        <Lock size={18} />
                      </div>
                      <span className="text-sm font-bold text-[#334155]">Security</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-primary transition-transform group-hover:translate-x-1" />
                  </button>

                  <button
                    onClick={() => navigate("/notifications")}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md hover:ring-1 hover:ring-brand-primary/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white text-amber-500">
                        <Bell size={18} />
                      </div>
                      <span className="text-sm font-bold text-[#334155]">Notifications</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-amber-500 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
            </div>

            {/* Quick Status */}
            <div className="bg-brand-primary rounded-3xl p-8 shadow-xl relative overflow-hidden text-white">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <ShieldCheck size={120} />
               </div>
               <div className="relative z-10">
                 <h4 className="text-xl font-black mb-2 tracking-tight">V-Safe Profile</h4>
                 <p className="text-white/60 text-xs leading-relaxed mb-6">
                   Your profile is protected with enterprise-grade encryption. Ensure all details are accurate to maintain your verification status.
                 </p>
                 <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-white w-[100%] rounded-full shadow-[0_0_10px_white]"></div>
                 </div>
                 <p className="text-[10px] mt-3 font-bold uppercase tracking-widest text-white/50">Security Score: 100/100</p>
               </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
