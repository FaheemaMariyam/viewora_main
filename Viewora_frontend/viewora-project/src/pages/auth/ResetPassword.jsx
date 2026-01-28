
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { confirmPasswordReset } from "../../api/authApi";
import { isValidOTP, isStrongPassword } from "../../utils/validators";
import { toast } from "react-toastify";
import { KeyRound, Lock, ArrowRight, ArrowLeft } from "lucide-react";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) {
      toast.warning("Email missing. Please restart the process.");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidOTP(otp)) {
      setError("OTP must be 6 digits");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset({
        email,
        otp,
        new_password: newPassword,
      });
      toast.success("Password reset successful!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] px-4 font-sans text-[#1A1A1A]">
      
      {/* Background Decorative Gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[30%] -right-[5%] w-[35%] h-[35%] bg-brand-primary/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-sm relative z-10 animate-in fade-in zoom-in duration-500">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate("/forgot-password")}
          className="flex items-center gap-2 text-gray-400 hover:text-[#1A1A1A] mb-8 transition-colors font-black uppercase tracking-widest text-[10px] group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to email
        </button>

        <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100/50">
          
          <div className="text-center mb-10 text-sm text-gray-400">
             <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 border border-emerald-100">
               <KeyRound size={32} />
             </div>
             <h1 className="text-2xl font-black tracking-tighter text-[#1A1A1A] mb-2">New Password</h1>
             <p className="px-4 leading-relaxed font-medium">Verify your email <span className="text-[#1A1A1A] font-bold">{email}</span> and reset your access</p>
          </div>

          {error && (
            <div className="mb-8 p-4 text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 border border-rose-100 rounded-2xl text-center">
              {error}
            </div>
          )}

        <form onSubmit={submit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Verification Code</label>
            <div className="relative group">
              <input
                placeholder="000000"
                maxLength={6}
                className="w-full bg-gray-50/50 border border-gray-100 px-6 py-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all text-center tracking-[0.5em] font-black text-xl placeholder:text-gray-200 placeholder:tracking-normal"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">New Secure Password</label>
            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1A1A1A] transition-colors" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-gray-50/50 border border-gray-100 pl-11 pr-4 py-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all text-sm font-semibold"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-[#1A1A1A] text-white py-4 rounded-2xl text-sm font-black tracking-tight hover:bg-black hover:shadow-xl hover:shadow-black/10 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Reset Access
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
          
          <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-center gap-6 opacity-40 grayscale">
            {/* Minimal trust badges can go here if needed */}
          </div>
        </div>

        <div className="mt-12 text-center text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 select-none">
          Identity Verified Access
        </div>
      </div>
    </div>
  );
}
