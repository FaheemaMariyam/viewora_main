
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
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] px-4 font-sans text-[#1A1A1A]">
      
      {/* Background Decorative Gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-brand-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-brand-primary/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-sm relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Logo Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1A1A1A] text-white rounded-[1.25rem] shadow-2xl shadow-black/10 mb-6 group cursor-default transition-transform hover:scale-105 duration-500">
            <span className="text-2xl font-black italic tracking-tighter">V</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter mb-2">Viewora</h1>
          <p className="text-sm font-medium text-gray-400">Premium Real Estate Management</p>
        </div>

        {error && (
          <div className="mb-8 p-4 text-[11px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 border border-rose-100 rounded-2xl text-center">
            {error}
          </div>
        )}

        <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Username</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1A1A1A] transition-colors" />
                <input
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  required
                  autoFocus
                  className="w-full bg-gray-50/50 border border-gray-100 pl-12 pr-4 py-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all text-sm font-semibold placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Password</label>
                <button 
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:underline hover:underline-offset-4"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1A1A1A] transition-colors" />
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full bg-gray-50/50 border border-gray-100 pl-12 pr-4 py-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all text-sm font-semibold placeholder:text-gray-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A1A1A] text-white py-4 rounded-2xl text-sm font-black tracking-tight hover:bg-black hover:shadow-xl hover:shadow-black/10 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
              <span className="px-4 bg-white text-gray-300">or connectivity</span>
            </div>
          </div>

          <div className="w-full flex justify-center scale-[1.05] hover:opacity-90 transition-opacity">
            <GoogleLogin
              theme="outline"
              shape="pill"
              size="large"
              width="320px"
              text="continue_with"
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

        <p className="mt-10 text-center text-sm font-medium text-gray-400">
          Not a member?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-[#1A1A1A] font-black hover:underline hover:underline-offset-4 decoration-2"
          >
            Create an account
          </button>
        </p>

        {/* Footer Minimal Proof */}
        <div className="mt-16 text-center opacity-30 select-none">
           <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-gray-400">
             <ShieldCheck size={12} />
             <span>End-to-End Encryption</span>
           </div>
        </div>
      </div>
    </div>
  );
}
