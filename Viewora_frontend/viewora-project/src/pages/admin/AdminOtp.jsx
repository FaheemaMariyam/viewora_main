import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyAdminOtp } from "../../api/authApi";
import { AuthContext } from "../../auth/AuthContext";
import { ShieldCheck, Lock, AlertCircle } from "lucide-react";

export default function AdminOTP() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const submitOtp = async () => {
    try {
      const res = await verifyAdminOtp({
        username: state.username,
        otp,
      });

      await loginUser(res.data);
      navigate("/admin/dashboard");
    } catch {
      setError("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 w-full max-w-md border border-gray-100 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-4">
             <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Admin Authorization</h2>
          <p className="text-sm text-gray-400 font-medium">Secure OTP verification required to proceed</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-center gap-3 text-red-600 text-sm font-bold animate-shake">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-primary transition-colors" size={20} />
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-primary/20 focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all text-center tracking-[0.5em] font-black text-xl placeholder:tracking-normal placeholder:font-medium placeholder:text-base"
            />
          </div>

          <button
            onClick={submitOtp}
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Verify & Authenticate
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
          Viewora Admin Ops v2.0
        </p>
      </div>
    </div>
  );
}
