
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import { AuthContext } from "../auth/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../api/authApi";
import { toast } from "react-toastify";
import { Lock, User, ArrowRight, ShieldCheck } from "lucide-react";

export default function Login() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login({
        username: e.target.username.value,
        password: e.target.password.value,
      });

      if (res.data?.mfa_required) {
        navigate("/admin/otp", {
          state: { username: e.target.username.value },
        });
        return;
      }

      if (res.data?.otp_required && res.data.role === "broker") {
        navigate("/broker-otp", {
          state: { username: e.target.username.value },
        });
        return;
      }

      await loginUser();
      
      const role = res.data.role; // Assuming login response returns role, otherwise fetch user profile
      
      if (role === "seller") {
        navigate("/seller");
      } else if (role === "broker") {
        navigate("/broker");
      } else if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/properties");
      }

    } catch {
      setError("Invalid username or password");
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#F8FAFC] px-4 font-sans overflow-hidden">
      
      {/* ================= STUDIO LIGHT BACKGROUND ================= */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[0%] right-[-10%] w-[60%] h-[60%] bg-slate-200/30 blur-[150px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-50/50 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-[420px] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* ================= WHITE GLASS LOGIN CARD ================= */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-12 border border-white shadow-[0_45px_100px_-20px_rgba(0,0,0,0.06)]">
          
          <div className="mb-10 text-center">
             <div className="inline-flex items-center justify-center w-16 h-16 bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100 mb-6 group hover:scale-105 transition-transform duration-500">
                <img src="/logo.png" alt="Viewora" className="w-8 h-8 object-contain" />
             </div>
             <h1 className="text-3xl font-bold tracking-tight text-slate-950 font-display mb-2">Welcome Back</h1>
             <p className="text-[17px] text-slate-500 font-medium">Elevating your property experience.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 text-[13px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-2xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[13px] font-bold text-slate-400 ml-1">Username</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-950 transition-colors" />
                <input
                  name="username"
                  type="text"
                  placeholder="name@example.com"
                  required
                  autoFocus
                  className="w-full bg-white border border-slate-100 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-slate-100 focus:border-slate-900 outline-none transition-all text-[15px] font-medium text-slate-950 placeholder:text-slate-300 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="block text-[13px] font-bold text-slate-400">Password</label>
                <button 
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-[13px] font-bold text-slate-400 hover:text-slate-950 transition-colors"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-950 transition-colors" />
                <input
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  required
                  className="w-full bg-white border border-slate-100 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-slate-100 focus:border-slate-900 outline-none transition-all text-[15px] font-medium text-slate-950 placeholder:text-slate-300 shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-950 text-white py-4 rounded-2xl text-[17px] font-bold shadow-xl shadow-slate-200 hover:bg-black hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 mt-8 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[12px] font-bold uppercase tracking-widest text-slate-300">
              <span className="px-4 bg-white/20 backdrop-blur-md">or continue with</span>
            </div>
          </div>

          <div className="w-full flex justify-center scale-[1.02]">
            <GoogleLogin
              theme="outline"
              shape="pill"
              size="large"
              width="322px"
              onSuccess={async (res) => {
                try {
                  await googleLogin(res.credential);
                  await loginUser();
                  navigate("/profile");
                } catch {
                  setError("Google login failed");
                }
              }}
              onError={() => setError("Google login failed")}
            />
          </div>
        </div>

        <p className="mt-10 text-center text-[15px] font-medium text-slate-500">
          Not a member?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-slate-950 font-bold hover:underline hover:underline-offset-4 decoration-slate-300 transition-all"
          >
            Create an account
          </button>
        </p>

        {/* Minimal Footer Proof */}
        <div className="mt-12 text-center opacity-30 group cursor-default">
           <div className="flex items-center justify-center gap-2 text-[11px] font-medium tracking-widest text-slate-400">
             <ShieldCheck size={14} className="text-slate-400" />
             <span>Secured Viewora Cloud Navigation</span>
           </div>
        </div>
      </div>
    </div>
  );
}
