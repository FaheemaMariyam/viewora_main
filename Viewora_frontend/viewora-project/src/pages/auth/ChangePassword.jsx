
import { useState } from "react";
import { changePassword } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { isStrongPassword } from "../../utils/validators";
import { Lock, ArrowLeft, ShieldCheck, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (oldPassword === newPassword) {
      toast.error("New password must be different from old password");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      toast.success("Password updated successfully. Please login again.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 font-sans">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 text-gray-500 hover:text-brand-primary mb-6 transition-colors font-medium text-sm group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Profile
        </button>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          
          <div className="p-8 pb-4 text-center">
            <div className="w-16 h-16 bg-brand-primary/5 text-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-primary/10">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-black text-[#0F172A] mb-1 tracking-tight">Update Security</h2>
            <p className="text-sm text-gray-400 font-medium">Protect your account with a strong password</p>
          </div>

          <form onSubmit={submit} className="p-8 pt-4 space-y-6">
            
            {/* Old Password */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-[#64748B] ml-1">Current Password</label>
              <div className="relative group">
                <input
                  type={showOld ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-gray-200 border px-4 py-3.5 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all group-hover:bg-white text-[#0F172A] font-medium placeholder:text-gray-300"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-primary transition-colors"
                >
                  {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-[#64748B] ml-1">New Password</label>
              <div className="relative group">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-gray-200 border px-4 py-3.5 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all group-hover:bg-white text-[#0F172A] font-medium placeholder:text-gray-300"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-primary transition-colors"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2 ml-1">
                <ShieldCheck size={14} className={newPassword.length >= 8 ? "text-emerald-500" : "text-gray-300"} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${newPassword.length >= 8 ? "text-emerald-600" : "text-gray-400"}`}>
                  Minimum 8 characters required
                </span>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-brand-primary text-white py-4 rounded-2xl font-bold tracking-tight hover:bg-[#1E293B] hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 group shadow-sm ring-1 ring-[#0F172A]/5"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
                  Update Password
                </>
              )}
            </button>
          </form>

          <div className="bg-gray-50/50 p-6 border-t border-gray-100 flex items-center gap-4">
             <div className="p-2.5 rounded-xl bg-white text-emerald-500 shadow-sm ring-1 ring-emerald-500/10">
               <ShieldCheck size={20} />
             </div>
             <div className="text-[11px] text-[#64748B] leading-relaxed font-medium">
               <span className="text-[#0F172A] font-extrabold uppercase tracking-widest block mb-0.5">V-Shield Security</span>
               Your session will be terminated upon password change for your security.
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
