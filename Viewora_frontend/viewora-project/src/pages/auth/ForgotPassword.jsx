
import { useState } from "react";
import { resetPasswordRequest } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from "../../utils/validators";
import { toast } from "react-toastify";
import { ArrowLeft, Mail, ShieldQuestion, ArrowRight } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setError("Enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await resetPasswordRequest({ email });
      toast.success("Verification code sent!");
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] px-4 font-sans text-[#1A1A1A]">
      
      {/* Background Decorative Gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[30%] -left-[5%] w-[35%] h-[35%] bg-brand-primary/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-sm relative z-10 animate-in fade-in zoom-in duration-500">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-gray-400 hover:text-[#1A1A1A] mb-8 transition-colors font-black uppercase tracking-widest text-[10px] group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to access
        </button>

        <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100/50">
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-brand-primary/5 text-brand-primary rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 border border-brand-primary/10">
              <ShieldQuestion size={32} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter mb-2">Access Recovery</h1>
            <p className="text-xs font-medium text-gray-400 leading-relaxed px-4">
              Enter your email address and we'll send a code to reset your password
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 border border-rose-100 rounded-2xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1A1A1A] transition-colors" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-gray-50/50 border border-gray-100 pl-12 pr-4 py-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all text-sm font-semibold placeholder:text-gray-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  Send Recovery Code
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-12 text-center text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 select-none">
          Automated Recovery Protocol
        </div>
      </div>
    </div>
  );
}
